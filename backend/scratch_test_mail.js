import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Loaded SMTP Settings:");
console.log("Host:", process.env.SMTP_HOST);
console.log("Port:", process.env.SMTP_PORT);
console.log("User:", process.env.SMTP_USER);
console.log("Pass length:", process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const mailOptions = {
  from: `"${process.env.FROM_NAME || "Aarions"}" <${process.env.FROM_EMAIL}>`,
  to: "sharikarajan07uec@gmail.com",
  subject: "Aarions SMTP Diagnostic Test",
  text: "Hello! This is a diagnostic test to verify your Gmail SMTP credentials.",
};

console.log("Attempting to send email...");
transporter.sendMail(mailOptions)
  .then((info) => {
    console.log("SUCCESS! Email sent successfully.");
    console.log("Response:", info.response);
    console.log("Message ID:", info.messageId);
    process.exit(0);
  })
  .catch((err) => {
    console.error("FAILURE! Email sending failed.");
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
    console.error(err);
    process.exit(1);
  });
