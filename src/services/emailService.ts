import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY must be defined");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to: string, subject: string, text: string) {
  const msg = {
    to, // Change to your recipient
    from: "youremail@example.com", // Change to your verified sender
    subject,
    text,
  };

  await sgMail.send(msg);
}

export default sendEmail;
