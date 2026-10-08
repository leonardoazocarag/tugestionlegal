import fs from "fs";

const p = "server/email.ts";
let s = fs.readFileSync(p, "utf8");

// --- booking admin ---
s = s.replace(
  /export async function sendBookingNotificationToAdmin\(data: BookingEmailData\): Promise<boolean> \{\s*try \{\s*const transporter = createTransporter\(\);\s*if \(!transporter\) \{\s*console\.error\("\[Email\] Cannot send booking notification: SMTP not configured"\);\s*return false;\s*\}\s*const creds = getSmtpCredentials\(\);\s*console\.log\("\[Email\] Sending booking notification to:", creds\.user, "for booking ID:", data\.bookingId\);\s*const info = await withSmtpTimeout\(\s*transporter\.sendMail\(\{\s*from: `"Tu Gestión Legal" <\$\{creds\.user\}>`,\s*to: creds\.user,\s*subject: `Nueva reserva de cita - \$\{data\.clientName\}`,\s*html: `/s,
  `export async function sendBookingNotificationToAdmin(data: BookingEmailData): Promise<boolean> {
  try {
    if (!isMailConfigured()) {
      console.error("[Email] Cannot send booking notification: mail not configured");
      return false;
    }
    const admin = getAdminNotifyEmail();
    console.log("[Email] Sending booking notification to:", admin, "for booking ID:", data.bookingId);

    const info = await sendMail({
      to: admin,
      subject: \`Nueva reserva de cita - \${data.clientName}\`,
      html: `
);

// This approach with regex is fragile. Use line-based transforms instead.
console.log("abort regex approach");
