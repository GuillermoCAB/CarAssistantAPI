import emailjs from "@emailjs/browser";

if (!process.env.EMAILJS_API_KEY) {
  throw new Error("EMAILJS_API_KEY must be defined");
}

emailjs.init(process.env.EMAILJS_API_KEY);

async function sendEmail(to: string, subject: string, text: string) {
  const msg = {
    to,
    subject,
    text,
  };

  await emailjs.send("service_j6bzfjj", "template_aj4o5t5", msg);
}

export default sendEmail;
