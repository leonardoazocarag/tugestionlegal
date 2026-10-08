import fs from "fs";

const p = "server/email.ts";
let s = fs.readFileSync(p, "utf8");
const marker = "interface BookingEmailData";
const idx = s.indexOf(marker);
if (idx < 0) throw new Error("marker not found");

const header = `import {
  getAdminNotifyEmail,
  isMailConfigured,
  sendMail,
  verifyMail,
  verifySmtp,
} from "./mailer";

export { verifySmtp, verifyMail };

`;

s = header + s.slice(idx);
fs.writeFileSync(p, s);
console.log("header ok", s.length);
