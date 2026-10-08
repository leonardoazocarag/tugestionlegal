import {
  getAdminNotifyEmail,
  isMailConfigured,
  sendMail,
  verifyMail,
  verifySmtp,
} from "./mailer";

export { verifySmtp, verifyMail };

interface BookingEmailData {
  bookingId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  date: string;
  time: string;
  message?: string;
  confirmUrl: string;
  rejectUrl: string;
  /** Enlace para añadir la cita a Google Calendar (p. ej. tras pago confirmado). */
  calendarUrl?: string;
}

export async function sendBookingNotificationToAdmin(data: BookingEmailData): Promise<boolean> {
  try {
    if (!isMailConfigured()) {
      console.error("[Email] Cannot send booking notification: mail not configured");
      return false;
    }
    const admin = getAdminNotifyEmail();
    console.log("[Email] Sending booking notification to:", admin, "for booking ID:", data.bookingId);

    const info = await sendMail({
      to: admin,
      subject: `Nueva reserva de cita - ${data.clientName}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#f5f0e9;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background-color:#112250;padding:30px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="color:#C19D4E;margin:0;font-size:24px;">Tu Gestión Legal</h1>
      <p style="color:#ffffff;margin:8px 0 0;font-size:14px;">Nueva Reserva de Cita</p>
    </div>
    <div style="background-color:#ffffff;padding:30px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="color:#112250;margin:0 0 20px;font-size:20px;">Datos de la Reserva</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;width:140px;font-weight:600;">Cliente:</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#112250;font-weight:500;">${data.clientName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;font-weight:600;">Email:</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#112250;">${data.clientEmail}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;font-weight:600;">Teléfono:</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#112250;">${data.clientPhone}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;font-weight:600;">Servicio:</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#112250;font-weight:600;">${data.serviceType}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;font-weight:600;">Fecha:</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#112250;">${data.date}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;font-weight:600;">Hora:</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#112250;">${data.time}</td>
        </tr>
        ${data.message ? `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#666;font-weight:600;">Mensaje:</td>
          <td style="padding:10px 0;border-bottom:1px solid #eee;color:#112250;">${data.message}</td>
        </tr>` : ""}
      </table>
      <div style="margin-top:30px;text-align:center;">
        ${data.calendarUrl ? `
        <a href="${data.calendarUrl}" target="_blank" style="display:inline-block;padding:14px 32px;background-color:#16a34a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;margin:0 8px 8px;">
          \ud83d\udcc5 A\u00f1adir a Google Calendar
        </a>` : `
        <a href="${data.confirmUrl}" style="display:inline-block;padding:14px 32px;background-color:#16a34a;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;margin:0 8px 8px;">
          \u2713 Confirmar Cita
        </a>
        <a href="${data.rejectUrl}" style="display:inline-block;padding:14px 32px;background-color:#dc2626;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;margin:0 8px 8px;">
          \u2717 Rechazar Cita
        </a>`}
      </div>
      <p style="margin-top:16px;font-size:13px;color:#666;text-align:center;">
        ${data.calendarUrl
          ? "El cliente ya pag\u00f3 y la cita est\u00e1 confirmada. A\u00f1ade el evento a tu Google Calendar con el bot\u00f3n superior."
          : "Al confirmar, podr\u00e1s a\u00f1adir la cita a tu Google Calendar directamente desde la p\u00e1gina de confirmaci\u00f3n."}
      </p>
      <p style="margin-top:20px;font-size:12px;color:#999;text-align:center;">
        También puedes gestionar las reservas desde el <a href="${data.confirmUrl.split('/api/')[0]}/admin/reservas" style="color:#C19D4E;">panel de administración</a>.
      </p>
    </div>
  </div>
</body>
</html>`,
    });
    console.log("[Email] Booking notification sent successfully. MessageId:", info.messageId);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send booking notification:", err);
    return false;
  }
}

interface BookingStatusEmailData {
  clientName: string;
  clientEmail: string;
  serviceType: string;
  date: string;
  time: string;
  status: "confirmed" | "rejected";
  /** Si true, muestra bloque de pago confirmado (flujo Stripe). */
  paid?: boolean;
}

export async function sendBookingStatusToClient(data: BookingStatusEmailData): Promise<boolean> {
  try {
    if (!isMailConfigured()) {
      console.error("[Email] Cannot send status email: mail not configured");
      return false;
    }
    const isConfirmed = data.status === "confirmed";
    const statusText = isConfirmed ? "Confirmada" : "Rechazada";
    const statusColor = isConfirmed ? "#16a34a" : "#dc2626";
    const statusIcon = isConfirmed ? "✓" : "✗";
    const statusMessage = isConfirmed
      ? `Tu cita para <strong>${data.serviceType}</strong> el <strong>${data.date}</strong> a las <strong>${data.time}</strong> ha sido confirmada. Te esperamos.`
      : `Lamentamos informarte que tu cita para <strong>${data.serviceType}</strong> el <strong>${data.date}</strong> a las <strong>${data.time}</strong> no ha podido ser confirmada. Por favor, contacta con nosotros para buscar una alternativa.`;

    console.log("[Email] Sending status email to client:", data.clientEmail, "Status:", data.status);

    const info = await sendMail({
      to: data.clientEmail,
      subject: `Cita ${statusText} - Tu Gestión Legal`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#f5f0e9;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background-color:#112250;padding:30px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="color:#C19D4E;margin:0;font-size:24px;">Tu Gestión Legal</h1>
      <p style="color:#ffffff;margin:8px 0 0;font-size:14px;">Estado de tu Reserva</p>
    </div>
    <div style="background-color:#ffffff;padding:30px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:60px;height:60px;line-height:60px;border-radius:50%;background-color:${statusColor};color:#fff;font-size:28px;">
          ${statusIcon}
        </div>
        <h2 style="color:${statusColor};margin:16px 0 0;font-size:22px;">Cita ${statusText}</h2>
      </div>
      <p style="color:#333;font-size:15px;line-height:1.6;">
        Hola <strong>${data.clientName}</strong>,
      </p>
      <p style="color:#333;font-size:15px;line-height:1.6;">
        ${statusMessage}
      </p>
      ${isConfirmed ? `
      <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
        ${data.paid ? `<p style="margin:0 0 12px;color:#166534;font-size:14px;">\u2705 <strong>Pago confirmado</strong> — Tu pago ha sido procesado correctamente.</p>` : ""}
        <p style="margin:0 0 12px;color:#166534;font-size:14px;"><strong>\ud83d\udcdd Prepara tu cita:</strong></p>
        <ul style="margin:0;padding-left:20px;color:#166534;font-size:14px;line-height:1.8;">
          <li>Lleva todas tus dudas anotadas para optimizar el tiempo de consulta.</li>
          <li>Ten preparados los documentos que consideres relevantes para tu caso.</li>
        </ul>
        <p style="margin:12px 0 0;color:#166534;font-size:13px;"><strong>Recuerda:</strong> Si necesitas cancelar o cambiar la cita, avísanos con al menos 24 horas de antelación.</p>
      </div>` : ""}
      <div style="text-align:center;margin-top:24px;">
        <a href="https://wa.me/34614002510" style="display:inline-block;padding:12px 28px;background-color:#25D366;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">
          Contactar por WhatsApp
        </a>
      </div>
      <p style="margin-top:20px;font-size:12px;color:#999;text-align:center;">
        Tu Gestión Legal - Extranjería y Gestión Documental<br>
        +34 614 00 25 10 | info@tugestionlegal.es
      </p>
    </div>
  </div>
</body>
</html>`,
    });
    console.log("[Email] Status email sent to client successfully. MessageId:", info.messageId);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send status email to client:", err);
    return false;
  }
}


interface ReminderEmailData {
  clientName: string;
  clientEmail: string;
  serviceType: string;
  date: string;
  time: string;
}

export async function sendReminderToClient(data: ReminderEmailData): Promise<boolean> {
  try {
    if (!isMailConfigured()) {
      console.error("[Email] Cannot send reminder: mail not configured");
      return false;
    }

    console.log("[Email] Sending 24h reminder to:", data.clientEmail, "for", data.date, data.time);

    const info = await sendMail({
      to: data.clientEmail,
      subject: `Recordatorio: Tu cita mañana a las ${data.time} - Tu Gestión Legal`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#f5f0e9;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background-color:#112250;padding:30px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="color:#C19D4E;margin:0;font-size:24px;">Tu Gestión Legal</h1>
      <p style="color:#ffffff;margin:8px 0 0;font-size:14px;">Recordatorio de Cita</p>
    </div>
    <div style="background-color:#ffffff;padding:30px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:60px;height:60px;line-height:60px;border-radius:50%;background-color:#C19D4E;color:#fff;font-size:28px;">
          🔔
        </div>
        <h2 style="color:#112250;margin:16px 0 0;font-size:22px;">Recordatorio de tu Cita</h2>
      </div>
      <p style="color:#333;font-size:15px;line-height:1.6;">
        Hola <strong>${data.clientName}</strong>,
      </p>
      <p style="color:#333;font-size:15px;line-height:1.6;">
        Te recordamos que tienes una cita programada para <strong>mañana</strong>:
      </p>
      <div style="background-color:#f0f4ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 8px;color:#112250;font-size:14px;"><strong>Servicio:</strong> ${data.serviceType}</p>
        <p style="margin:0 0 8px;color:#112250;font-size:14px;"><strong>Fecha:</strong> ${data.date}</p>
        <p style="margin:0;color:#112250;font-size:14px;"><strong>Hora:</strong> ${data.time}</p>
      </div>
      <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 12px;color:#166534;font-size:14px;"><strong>📝 Prepara tu cita:</strong></p>
        <ul style="margin:0;padding-left:20px;color:#166534;font-size:14px;line-height:1.8;">
          <li>Lleva todas tus dudas anotadas para optimizar el tiempo de consulta.</li>
          <li>Ten preparados los documentos que consideres relevantes para tu caso.</li>
        </ul>
      </div>
      <div style="background-color:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0;color:#92400e;font-size:14px;"><strong>Importante:</strong> Si necesitas cancelar o cambiar la cita, avísanos con la mayor antelación posible.</p>
      </div>
      <div style="text-align:center;margin-top:24px;">
        <a href="https://wa.me/34614002510" style="display:inline-block;padding:12px 28px;background-color:#25D366;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">
          Contactar por WhatsApp
        </a>
      </div>
      <p style="margin-top:20px;font-size:12px;color:#999;text-align:center;">
        Tu Gestión Legal - Extranjería y Gestión Documental<br>
        +34 614 00 25 10 | info@tugestionlegal.es
      </p>
    </div>
  </div>
</body>
</html>`,
    });
    console.log("[Email] Reminder sent successfully. MessageId:", info.messageId);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send reminder:", err);
    return false;
  }
}


interface NewsletterPost {
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  imageUrl: string | null;
  createdAt: Date;
}

export async function sendWeeklyNewsletter(
  subscribers: { email: string; name: string | null }[],
  posts: NewsletterPost[],
  siteUrl: string
): Promise<{ sent: number; failed: number }> {
  if (!isMailConfigured()) {
    console.error("[Newsletter] Cannot send: mail not configured");
    return { sent: 0, failed: subscribers.length };
  }

  let sent = 0;
  let failed = 0;

  const postsHtml = posts.map(p => `
    <div style="margin-bottom:24px;border-bottom:1px solid #e5e7eb;padding-bottom:24px;">
      ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.title}" style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;" />` : ""}
      ${p.category ? `<span style="display:inline-block;background-color:#C19D4E;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">${p.category}</span>` : ""}
      <h3 style="margin:8px 0;color:#112250;font-size:18px;line-height:1.4;">
        <a href="${siteUrl}/blog/${p.slug}" style="color:#112250;text-decoration:none;">${p.title}</a>
      </h3>
      ${p.excerpt ? `<p style="color:#555;font-size:14px;line-height:1.6;margin:8px 0;">${p.excerpt.substring(0, 200)}...</p>` : ""}
      <a href="${siteUrl}/blog/${p.slug}" style="color:#C19D4E;font-size:14px;font-weight:600;text-decoration:none;">Leer artículo completo →</a>
    </div>
  `).join("");

  for (const sub of subscribers) {
    try {
      const greeting = sub.name ? `Hola ${sub.name}` : "Hola";
      const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(sub.email)}`;

      await sendMail({
        to: sub.email,
        subject: `📰 Novedades Legales de la Semana - Tu Gestión Legal`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Georgia','Times New Roman',serif;background-color:#f5f0e9;">
  <div style="max-width:640px;margin:0 auto;padding:20px;">
    <div style="background-color:#112250;padding:30px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="color:#C19D4E;margin:0;font-size:26px;font-family:'Georgia',serif;">Tu Gestión Legal</h1>
      <p style="color:#ffffff;margin:10px 0 0;font-size:14px;letter-spacing:1px;text-transform:uppercase;">Newsletter Semanal</p>
    </div>
    <div style="background-color:#ffffff;padding:32px;border-radius:0 0 12px 12px;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      <p style="color:#333;font-size:16px;line-height:1.7;margin-bottom:24px;">
        ${greeting}, te traemos las novedades legales más relevantes de esta semana. Mantente informado sobre los cambios que pueden afectar a tu situación.
      </p>
      
      <div style="margin:24px 0;">
        ${postsHtml}
      </div>

      <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:2px solid #C19D4E;">
        <p style="color:#555;font-size:14px;margin-bottom:16px;">¿Necesitas asesoría personalizada?</p>
        <a href="${siteUrl}/reservas" style="display:inline-block;padding:14px 32px;background-color:#C19D4E;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;">
          Reservar Asesoría
        </a>
      </div>

      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;">
        <p style="font-size:12px;color:#999;margin:0;">
          Tu Gestión Legal - Extranjería y Gestión Documental<br>
          +34 614 00 25 10 | info@tugestionlegal.es
        </p>
        <p style="font-size:11px;color:#bbb;margin:8px 0 0;">
          <a href="${unsubscribeUrl}" style="color:#bbb;text-decoration:underline;">Cancelar suscripción</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`,
      });
      sent++;
    } catch (err) {
      console.error(`[Newsletter] Failed to send to ${sub.email}:`, err);
      failed++;
    }
  }

  console.log(`[Newsletter] Sent: ${sent}, Failed: ${failed}`);
  return { sent, failed };
}

export interface ClientDocumentAttachment {
  fileName: string;
  mimeType?: string;
  content: Buffer;
}

export async function sendClientDocumentsEmail(data: {
  clientName: string;
  clientEmail: string;
  description?: string;
  files: ClientDocumentAttachment[];
}): Promise<boolean> {
  try {
    if (!isMailConfigured()) {
      console.error("[Email] Cannot send client documents: mail not configured");
      return false;
    }
    const admin = getAdminNotifyEmail();
    const fileList = data.files
      .map((f) => `<li>${f.fileName}${f.content.length ? ` (${(f.content.length / 1024).toFixed(1)} KB)` : ""}</li>`)
      .join("");

    console.log(
      "[Email] Sending client documents to:",
      admin,
      "from:",
      data.clientEmail,
      "files:",
      data.files.map((f) => f.fileName).join(", ")
    );

    await sendMail({
      to: admin,
      replyTo: data.clientEmail,
      subject: `Documentos de cliente - ${data.clientName}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#f5f0e9;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background-color:#112250;padding:30px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="color:#C19D4E;margin:0;font-size:24px;">Tu Gestión Legal</h1>
      <p style="color:#ffffff;margin:8px 0 0;font-size:14px;">Documentos recibidos del cliente</p>
    </div>
    <div style="background-color:#ffffff;padding:30px;border-radius:0 0 12px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#666;width:140px;">Cliente</td>
          <td style="padding:8px 0;color:#112250;font-weight:600;">${data.clientName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;">Email</td>
          <td style="padding:8px 0;"><a href="mailto:${data.clientEmail}" style="color:#112250;">${data.clientEmail}</a></td>
        </tr>
        ${
          data.description
            ? `<tr>
          <td style="padding:8px 0;color:#666;vertical-align:top;">Descripción</td>
          <td style="padding:8px 0;color:#333;">${data.description}</td>
        </tr>`
            : ""
        }
      </table>
      <h3 style="color:#112250;margin:24px 0 8px;font-size:16px;">Archivos adjuntos</h3>
      <ul style="color:#333;padding-left:20px;margin:0;">${fileList}</ul>
      <p style="color:#888;font-size:12px;margin-top:24px;">Los documentos van adjuntos a este correo. No se almacenan en el servidor.</p>
    </div>
  </div>
</body>
</html>`,
      attachments: data.files.map((f) => ({
        filename: f.fileName,
        content: f.content,
        contentType: f.mimeType || "application/octet-stream",
      })),
    });

    console.log("[Email] Client documents sent successfully");
    return true;
  } catch (err) {
    console.error("[Email] Failed to send client documents:", err);
    return false;
  }
}
