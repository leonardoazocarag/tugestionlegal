import fs from "fs";

const p = "server/email.ts";
let s = fs.readFileSync(p, "utf8");

function replaceBlock(startNeedle, endNeedle, replacement) {
  const start = s.indexOf(startNeedle);
  if (start < 0) throw new Error("start not found: " + startNeedle.slice(0, 60));
  const end = s.indexOf(endNeedle, start);
  if (end < 0) throw new Error("end not found after start");
  s = s.slice(0, start) + replacement + s.slice(end);
}

// 1) booking admin preamble
replaceBlock(
  `export async function sendBookingNotificationToAdmin(data: BookingEmailData): Promise<boolean> {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.error("[Email] Cannot send booking notification: SMTP not configured");
      return false;
    }
    const creds = getSmtpCredentials();
    console.log("[Email] Sending booking notification to:", creds.user, "for booking ID:", data.bookingId);

    const info = await withSmtpTimeout(
      transporter.sendMail({
      from: \`"Tu Gestión Legal" <\${creds.user}>\`,
      to: creds.user,
      subject: \`Nueva reserva de cita - \${data.clientName}\`,
      html: \``,
  `</html>\`,
    })
    );`,
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
      html: \``
);

// Fix closing after first html - the replace left broken. Re-read approach.
console.log("partial - abort, rewriting file with simpler string ops");
