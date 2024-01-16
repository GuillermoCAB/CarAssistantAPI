import emailjs from "@emailjs/nodejs";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.EMAILJS_API_KEY) {
  throw new Error("EMAILJS_API_KEY must be defined");
}
if (!process.env.EMAILJS_API_PRIVATE_KEY) {
  throw new Error("EMAILJS_API_PRIVATE_KEY must be defined");
}

async function sendEmail(to: string, subject: string, text: string) {
  const msg = {
    to,
    subject,
    text,
  };

  const config = {
    publicKey: process.env.EMAILJS_API_KEY,
    privateKey: process.env.EMAILJS_API_PRIVATE_KEY,
  };

  await emailjs.send("service_j6bzfjj", "template_aj4o5t5", msg, config);
}

export default sendEmail;
