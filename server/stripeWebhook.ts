import type { Request, Response } from "express";
import {
  getBookingById,
  getBookingByStripeSessionId,
  updateBookingPayment,
} from "./db";
import {
  sendBookingNotificationToAdmin,
  sendBookingStatusToClient,
} from "./email";
import { resolvePublicBaseUrl } from "./publicUrl";
import { getStripe } from "./stripe";

export async function handleStripeWebhook(
  req: Request,
  res: Response
): Promise<void> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[Stripe] STRIPE_WEBHOOK_SECRET not set");
    res.status(500).send("Webhook not configured");
    return;
  }

  const signature = req.headers["stripe-signature"];
  if (!signature || typeof signature !== "string") {
    res.status(400).send("Missing stripe-signature");
    return;
  }

  let event;
  try {
    const stripe = getStripe();
    const rawBody = req.body as Buffer;
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err: any) {
    console.error("[Stripe] Signature verification failed:", err?.message);
    res.status(400).send(`Webhook Error: ${err?.message}`);
    return;
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as {
        id: string;
        payment_intent?: string | null;
        metadata?: Record<string, string>;
        amount_total?: number | null;
        currency?: string | null;
      };

      const bookingId = Number(session.metadata?.bookingId || 0);
      let booking = bookingId ? await getBookingById(bookingId) : undefined;
      if (!booking) {
        booking = await getBookingByStripeSessionId(session.id);
      }
      if (!booking) {
        console.error("[Stripe] No booking for session", session.id);
        res.json({ received: true, ignored: true });
        return;
      }

      // Idempotency
      if (booking.paymentStatus === "paid") {
        res.json({ received: true, alreadyPaid: true });
        return;
      }

      const pi =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null;

      await updateBookingPayment(booking.id, {
        paymentStatus: "paid",
        status: "confirmed",
        stripeSessionId: session.id,
        stripePaymentIntentId: pi,
        amountCents: session.amount_total ?? booking.amountCents,
        currency: session.currency ?? booking.currency ?? "eur",
      });

      console.log("[Stripe] Booking paid+confirmed:", booking.id);

      const baseUrl = resolvePublicBaseUrl();
      const confirmUrl = `${baseUrl}/api/booking-action?id=${booking.id}&action=confirm`;
      const rejectUrl = `${baseUrl}/api/booking-action?id=${booking.id}&action=reject`;
      const { buildGoogleCalendarUrl } = await import("./calendarLink");
      const calendarUrl = buildGoogleCalendarUrl({
        serviceType: booking.serviceType,
        date: booking.date,
        time: booking.time,
        name: booking.name,
      });

      try {
        await sendBookingNotificationToAdmin({
          bookingId: booking.id,
          clientName: booking.name,
          clientEmail: booking.email,
          clientPhone: booking.phone,
          serviceType: booking.serviceType,
          date: booking.date,
          time: booking.time,
          message: booking.message || undefined,
          confirmUrl,
          rejectUrl,
          calendarUrl,
        });
      } catch (e) {
        console.error("[Stripe] Admin email failed:", e);
      }

      try {
        await sendBookingStatusToClient({
          clientName: booking.name,
          clientEmail: booking.email,
          serviceType: booking.serviceType,
          date: booking.date,
          time: booking.time,
          status: "confirmed",
          paid: true,
        });
      } catch (e) {
        console.error("[Stripe] Client email failed:", e);
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as {
        id: string;
        metadata?: Record<string, string>;
      };
      const bookingId = Number(session.metadata?.bookingId || 0);
      let booking = bookingId ? await getBookingById(bookingId) : undefined;
      if (!booking) {
        booking = await getBookingByStripeSessionId(session.id);
      }
      if (booking && booking.paymentStatus === "unpaid") {
        await updateBookingPayment(booking.id, {
          status: "cancelled",
          paymentStatus: "failed",
        });
        console.log("[Stripe] Unpaid booking cancelled (session expired):", booking.id);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("[Stripe] Webhook handler error:", err);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}
