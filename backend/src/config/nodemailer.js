import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter;

const isConfigured =
  process.env.SMTP_USER &&
  process.env.SMTP_USER !== "your_email@gmail.com" &&
  process.env.SMTP_USER !== "dummyuser";

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  // Fallback to mock console transporter in development
  transporter = {
    sendMail: async (mailOptions) => {
      console.log("---------------- NODEMAILER SIMULATOR ----------------");
      console.log(`From:    ${mailOptions.from || process.env.FROM_EMAIL}`);
      console.log(`To:      ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Body (Text):\n${mailOptions.text || "(no text content)"}`);
      if (mailOptions.html) {
        console.log(`Body (HTML):\n${mailOptions.html}`);
      }
      console.log("------------------------------------------------------");
      return { messageId: `mock-id-${Date.now()}` };
    },
  };
  console.log("Nodemailer SMTP missing. Email API will log messages to console.");
}

export const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"${process.env.FROM_NAME || "Aarions"}" <${process.env.FROM_EMAIL || "noreply@aarions.com"}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Email] Sent successfully to ${to}. Subject: "${subject}". Message ID: ${info.messageId}`);
  return info;
};

export default transporter;
