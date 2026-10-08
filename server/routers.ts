import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getBookingsByDate,
  createContactMessage,
  getContactMessages,
  createBlogPost,
  getPublishedPosts,
  getAllPosts,
  getPostBySlug,
  updateBlogPost,
  deleteBlogPost,
  getClientDocuments,
  subscribeNewsletter,
  getNewsletterSubscribers,
  unsubscribeNewsletter,
  getUserByEmail,
  getDb,
  updateBookingPayment,
} from "./db";
import { notifyOwner } from "./_core/notification";
import {
  sendBookingNotificationToAdmin,
  sendBookingStatusToClient,
  sendClientDocumentsEmail,
} from "./email";
import { TRPCError } from "@trpc/server";
import { ONE_YEAR_MS } from "@shared/const";
import { sdk } from "./_core/sdk";
import { toPublicUser, verifyPassword } from "./password";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { resolvePublicBaseUrl } from "./publicUrl";
import {
  createBookingCheckoutSession,
  getServicePriceCents,
  isStripeConfigured,
} from "./stripe";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => {
      if (!opts.ctx.user) return null;
      return toPublicUser(opts.ctx.user);
    }),
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await getUserByEmail(input.email);
        if (!user?.passwordHash) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Email o contraseña incorrectos",
          });
        }
        const ok = await verifyPassword(input.password, user.passwordHash);
        if (!ok) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Email o contraseña incorrectos",
          });
        }

        const db = await getDb();
        if (db) {
          await db
            .update(users)
            .set({ lastSignedIn: new Date() })
            .where(eq(users.id, user.id));
        }

        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || user.email || "Admin",
          expiresInMs: ONE_YEAR_MS,
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return { success: true as const, user: toPublicUser(user) };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ---- Bookings ----
  booking: router({
    // Get occupied time slots for a given date
    occupiedSlots: publicProcedure
      .input(z.object({ date: z.string().min(1) }))
      .query(async ({ input }) => {
        const bookings = await getBookingsByDate(input.date);
        return bookings.map((b) => b.time);
      }),
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(1),
          serviceType: z.string().min(1),
          date: z.string().min(1),
          time: z.string().min(1),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Antelación mínima: no permitir reservas de un día para otro (hoy ni mañana)
        const minDate = new Date();
        minDate.setHours(0, 0, 0, 0);
        minDate.setDate(minDate.getDate() + 2);
        const requested = new Date(`${input.date}T00:00:00`);
        if (Number.isNaN(requested.getTime()) || requested < minDate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Debes reservar con al menos 2 días de antelación. No es posible reservar de un día para otro.",
          });
        }

        const existingBookings = await getBookingsByDate(input.date);
        const slotTaken = existingBookings.some((b) => b.time === input.time);
        if (slotTaken) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Este horario ya está reservado. Por favor, elige otro.",
          });
        }

        let amountCents = 0;
        try {
          amountCents = getServicePriceCents(input.serviceType);
        } catch {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Este servicio no admite pago online.",
          });
        }

        console.log(
          "[Booking] Creating booking for:",
          input.name,
          input.serviceType,
          input.date,
          input.time
        );

        // Stripe Checkout (prod/local con clave): reserva unpaid + redirect
        if (isStripeConfigured()) {
          const bookingId = await createBooking({
            ...input,
            status: "pending",
            paymentStatus: "unpaid",
            amountCents,
            currency: "eur",
          });
          console.log("[Booking] Created unpaid ID:", bookingId);

          try {
            const session = await createBookingCheckoutSession({
              bookingId,
              serviceType: input.serviceType,
              date: input.date,
              time: input.time,
              customerEmail: input.email,
              customerName: input.name,
            });
            await updateBookingPayment(bookingId, {
              stripeSessionId: session.sessionId,
            });
            console.log("[Booking] Stripe Checkout session:", session.sessionId);
            return {
              success: true as const,
              bookingId,
              checkoutUrl: session.url,
              requiresPayment: true as const,
            };
          } catch (err) {
            console.error("[Booking] Stripe session failed:", err);
            await updateBookingStatus(bookingId, "cancelled");
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "No se pudo iniciar el pago. Inténtalo de nuevo.",
            });
          }
        }

        // Fallback sin Stripe (dev): flujo anterior
        const bookingId = await createBooking({
          ...input,
          status: "pending",
          paymentStatus: "unpaid",
          amountCents,
          currency: "eur",
        });
        console.log("[Booking] Created (no Stripe) ID:", bookingId);

        const origin =
          ctx.req.headers.origin ||
          ctx.req.headers.referer?.replace(/\/$/, "") ||
          "";
        const baseUrl = resolvePublicBaseUrl({ originHeader: origin });
        const confirmUrl = `${baseUrl}/api/booking-action?id=${bookingId}&action=confirm`;
        const rejectUrl = `${baseUrl}/api/booking-action?id=${bookingId}&action=reject`;

        try {
          await sendBookingNotificationToAdmin({
            bookingId,
            clientName: input.name,
            clientEmail: input.email,
            clientPhone: input.phone,
            serviceType: input.serviceType,
            date: input.date,
            time: input.time,
            message: input.message,
            confirmUrl,
            rejectUrl,
          });
        } catch (emailErr) {
          console.error("[Booking] Email notification failed:", emailErr);
        }

        try {
          await notifyOwner({
            title: "Nueva reserva de cita",
            content: `${input.name} ha reservado ${input.serviceType} para el ${input.date} a las ${input.time}.`,
          });
        } catch (notifyErr) {
          console.error("[Booking] Platform notification failed:", notifyErr);
        }

        return {
          success: true as const,
          bookingId,
          requiresPayment: false as const,
        };
      }),
    list: adminProcedure.query(async () => {
      return getBookings();
    }),
    confirm: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const booking = await getBookingById(input.id);
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Reserva no encontrada" });
        await updateBookingStatus(input.id, "confirmed");
        await sendBookingStatusToClient({
          clientName: booking.name,
          clientEmail: booking.email,
          serviceType: booking.serviceType,
          date: booking.date,
          time: booking.time,
          status: "confirmed",
        });
        return { success: true };
      }),
    reject: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const booking = await getBookingById(input.id);
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Reserva no encontrada" });
        await updateBookingStatus(input.id, "cancelled");
        await sendBookingStatusToClient({
          clientName: booking.name,
          clientEmail: booking.email,
          serviceType: booking.serviceType,
          date: booking.date,
          time: booking.time,
          status: "rejected",
        });
        return { success: true };
      }),
  }),

  // ---- Contact ----
  contact: router({
    send: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          subject: z.string().min(1),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        await createContactMessage(input);
        await notifyOwner({
          title: "Nueva consulta de contacto",
          content: `${input.name} ha enviado una consulta.\nAsunto: ${input.subject}\nEmail: ${input.email}${input.phone ? `\nTeléfono: ${input.phone}` : ""}\n\nMensaje:\n${input.message}`,
        });
        return { success: true };
      }),
    list: adminProcedure.query(async () => {
      return getContactMessages();
    }),
  }),

  // ---- Blog ----
  blog: router({
    published: publicProcedure.query(async () => {
      return getPublishedPosts();
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      return getPostBySlug(input.slug);
    }),
    all: adminProcedure.query(async () => {
      return getAllPosts();
    }),
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          excerpt: z.string().optional(),
          content: z.string().min(1),
          category: z.string().optional(),
          imageUrl: z.string().optional(),
          published: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await createBlogPost({ ...input, authorId: ctx.user.id });
        return { success: true };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          slug: z.string().optional(),
          excerpt: z.string().optional(),
          content: z.string().optional(),
          category: z.string().optional(),
          imageUrl: z.string().optional(),
          published: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateBlogPost(id, data);
        return { success: true };
      }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteBlogPost(input.id);
      return { success: true };
    }),
  }),

  // ---- Documents (enviados por email; no se persisten en storage) ----
  documents: router({
    upload: publicProcedure
      .input(
        z.object({
          clientName: z.string().min(1),
          clientEmail: z.string().email(),
          description: z.string().optional(),
          files: z
            .array(
              z.object({
                fileName: z.string().min(1),
                mimeType: z.string().optional(),
                fileSize: z.number().optional(),
                fileBase64: z.string().min(1),
              })
            )
            .min(1)
            .max(5),
        })
      )
      .mutation(async ({ input }) => {
        const MAX_FILE_BYTES = 10 * 1024 * 1024;
        const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
        const allowedExt = /\.(pdf|jpe?g|png|docx?)$/i;

        let total = 0;
        const attachments = input.files.map((f) => {
          if (!allowedExt.test(f.fileName)) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Tipo de archivo no permitido: ${f.fileName}`,
            });
          }
          const content = Buffer.from(f.fileBase64, "base64");
          if (content.length === 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Archivo vacío: ${f.fileName}`,
            });
          }
          if (content.length > MAX_FILE_BYTES) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `El archivo ${f.fileName} supera 10MB`,
            });
          }
          total += content.length;
          return {
            fileName: f.fileName.replace(/[/\\]/g, "_"),
            mimeType: f.mimeType,
            content,
          };
        });

        if (total > MAX_TOTAL_BYTES) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "El total de archivos no puede superar 20MB",
          });
        }

        const sent = await sendClientDocumentsEmail({
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          description: input.description,
          files: attachments,
        });

        if (!sent) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No se pudo enviar el email con los documentos. Inténtalo de nuevo.",
          });
        }

        // Soft notify Manus/Forge if configured (no-op otherwise)
        await notifyOwner({
          title: "Documentos recibidos por email",
          content: `${input.clientName} (${input.clientEmail}) envió ${attachments.length} documento(s): ${attachments.map((a) => a.fileName).join(", ")}${input.description ? `\nDescripción: ${input.description}` : ""}`,
        });

        return { success: true as const, filesSent: attachments.length };
      }),
    list: adminProcedure.query(async () => {
      // Legacy: tabla clientDocuments ya no se rellena; se mantiene por compatibilidad admin
      return getClientDocuments();
    }),
  }),

  // ---- Newsletter ----
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email(), name: z.string().optional() }))
      .mutation(async ({ input }) => {
        await subscribeNewsletter({ email: input.email, name: input.name });
        return { success: true };
      }),
    subscribers: adminProcedure.query(async () => {
      return getNewsletterSubscribers();
    }),
    unsubscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await unsubscribeNewsletter(input.email);
        return { success: true };
      }),
  }),

  // ---- Google Places (reseñas en vivo) ----
  places: router({
    summary: publicProcedure.query(async () => {
      const { fetchGooglePlaceSummary } = await import("./googlePlaces");
      try {
        return await fetchGooglePlaceSummary();
      } catch (err) {
        console.error("[Places] summary query failed:", err);
        return null;
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
