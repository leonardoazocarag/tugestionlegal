import "dotenv/config";
import express from "express";
import path from "path";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { assertCronAuthorized } from "./cronAuth";
import { getStorageDriver } from "../storage";
import {
  runSendNewsletter,
  runSendReminders,
  startInternalJobTimers,
} from "../jobs";
import { buildGoogleCalendarUrl } from "../calendarLink";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

function buildActionPage(title: string, message: string, type: "success" | "rejected" | "error" | "info", calendarUrl?: string): string {
  const colors = {
    success: { bg: "#f0fdf4", border: "#16a34a", icon: "\u2713", iconBg: "#16a34a" },
    rejected: { bg: "#fef2f2", border: "#dc2626", icon: "\u2717", iconBg: "#dc2626" },
    error: { bg: "#fef2f2", border: "#dc2626", icon: "!", iconBg: "#dc2626" },
    info: { bg: "#eff6ff", border: "#2563eb", icon: "i", iconBg: "#2563eb" },
  };
  const c = colors[type];
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} - Tu Gesti\u00f3n Legal</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#f5f0e9;display:flex;align-items:center;justify-content:center;min-height:100vh;">
<div style="max-width:500px;width:90%;text-align:center;">
<div style="background-color:#112250;padding:24px;border-radius:12px 12px 0 0;"><h1 style="color:#C19D4E;margin:0;font-size:22px;">Tu Gesti\u00f3n Legal</h1></div>
<div style="background:#fff;padding:40px 30px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
<div style="width:60px;height:60px;border-radius:50%;background:${c.iconBg};color:#fff;font-size:28px;line-height:60px;margin:0 auto 20px;">${c.icon}</div>
<h2 style="color:#112250;margin:0 0 12px;">${title}</h2>
<p style="color:#555;line-height:1.6;">${message}</p>
${calendarUrl ? `<a href="${calendarUrl}" target="_blank" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;margin-right:12px;">\ud83d\udcc5 A\u00f1adir a Google Calendar</a>` : ""}
<a href="/" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#112250;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Ir al inicio</a>
</div></div></body></html>`;
}

async function startServer() {
  const { ENV } = await import("./env");
  if (ENV.adminEmail && ENV.adminPassword) {
    const { ensureLocalAdmin } = await import("../db");
    await ensureLocalAdmin({
      email: ENV.adminEmail,
      password: ENV.adminPassword,
      name: ENV.adminName,
    });
  } else {
    console.warn(
      "[Auth] ADMIN_EMAIL / ADMIN_PASSWORD not set — password login will not work until seeded"
    );
  }

  const app = express();
  const server = createServer(app);

  // Stripe webhook needs raw body — must be before express.json()
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const { handleStripeWebhook } = await import("../stripeWebhook");
      await handleStripeWebhook(req, res);
    }
  );

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Local storage files (when S3 is not configured)
  const uploadsDir = path.resolve(process.cwd(), "uploads");
  app.use("/uploads", express.static(uploadsDir));
  console.log(`[Storage] driver=${getStorageDriver()} uploadsDir=${uploadsDir}`);
  const { getMailDriver } = await import("../mailer");
  console.log(`[Email] driver=${getMailDriver()}`);

  // OAuth callback under /api/oauth/callback (501 if Manus OAuth disabled)
  registerOAuthRoutes(app);

  // Healthcheck for Railway/Render (DB ping best-effort)
  app.get("/api/health", async (_req, res) => {
    let database: "ok" | "unavailable" = "unavailable";
    try {
      const { getDb } = await import("../db");
      const db = await getDb();
      database = db ? "ok" : "unavailable";
    } catch {
      database = "unavailable";
    }
    const body = {
      ok: true,
      status: "up",
      database,
      storage: getStorageDriver(),
      time: new Date().toISOString(),
    };
    // 200 even if DB down so the container can boot; monitor `database` field
    res.status(200).json(body);
  });

  // Booking action route (confirm/reject from email)
  app.get("/api/booking-action", async (req, res) => {
    try {
      const { id, action } = req.query;
      const bookingId = parseInt(id as string);
      if (!bookingId || !action) {
        return res.status(400).send(buildActionPage("Error", "Parámetros inválidos.", "error"));
      }
      const { getBookingById, updateBookingStatus } = await import("../db");
      const { sendBookingStatusToClient } = await import("../email");
      const booking = await getBookingById(bookingId);
      if (!booking) {
        return res.status(404).send(buildActionPage("No encontrada", "La reserva no existe.", "error"));
      }
      if (booking.status !== "pending") {
        const statusText = booking.status === "confirmed" ? "confirmada" : "rechazada";
        return res.send(buildActionPage("Ya procesada", `Esta reserva ya fue ${statusText} anteriormente.`, "info"));
      }
      if (action === "confirm") {
        await updateBookingStatus(bookingId, "confirmed");
        await sendBookingStatusToClient({
          clientName: booking.name,
          clientEmail: booking.email,
          serviceType: booking.serviceType,
          date: booking.date,
          time: booking.time,
          status: "confirmed",
        });
        const calendarUrl = buildGoogleCalendarUrl({
          serviceType: booking.serviceType,
          date: booking.date,
          time: booking.time,
          name: booking.name,
        });
        return res.send(buildActionPage("Cita Confirmada", `La cita de ${booking.name} para ${booking.serviceType} el ${booking.date} a las ${booking.time} ha sido confirmada. Se ha enviado un email de confirmaci\u00f3n al cliente.`, "success", calendarUrl));
      } else if (action === "reject") {
        await updateBookingStatus(bookingId, "cancelled");
        await sendBookingStatusToClient({
          clientName: booking.name,
          clientEmail: booking.email,
          serviceType: booking.serviceType,
          date: booking.date,
          time: booking.time,
          status: "rejected",
        });
        return res.send(buildActionPage("Cita Rechazada", `La cita de ${booking.name} para ${booking.serviceType} el ${booking.date} a las ${booking.time} ha sido rechazada. Se ha notificado al cliente por email.`, "rejected"));
      }
      return res.status(400).send(buildActionPage("Error", "Acción no válida.", "error"));
    } catch (err) {
      console.error("[BookingAction] Error:", err);
      return res.status(500).send(buildActionPage("Error", "Ocurrió un error al procesar la acción.", "error"));
    }
  });
  // Scheduled: 24h reminder emails for confirmed bookings
  app.post("/api/scheduled/sendReminders", async (req, res) => {
    try {
      assertCronAuthorized(req);
      const result = await runSendReminders();
      res.json(result);
    } catch (err: any) {
      const status = err?.status || 500;
      console.error("[Reminder] Error:", err);
      res.status(status).json({
        error: err.message || "Unknown error",
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Scheduled: Weekly newsletter every Monday
  app.post("/api/scheduled/sendNewsletter", async (req, res) => {
    try {
      assertCronAuthorized(req);
      const result = await runSendNewsletter();
      res.json(result);
    } catch (err: any) {
      const status = err?.status || 500;
      console.error("[Newsletter] Error:", err);
      res.status(status).json({
        error: err.message || "Unknown error",
        timestamp: new Date().toISOString(),
      });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000", 10);
  // In production use the assigned PORT only (Railway/Render healthchecks).
  // In development, fall back to the next free port if busy.
  const port =
    process.env.NODE_ENV === "production"
      ? preferredPort
      : await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  // Jobs without Manus: in-process timers + optional external cron hitting /api/scheduled/*
  startInternalJobTimers();

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
  });
}

startServer().catch(console.error);
