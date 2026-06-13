import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let sendEmail;

const isResendConfigured = process.env.RESEND_API_KEY;
const isSmtpConfigured =
  process.env.SMTP_USER &&
  process.env.SMTP_USER !== "your_email@gmail.com" &&
  process.env.SMTP_USER !== "dummyuser";

if (isResendConfigured) {
  console.log("Nodemailer: Configured to send emails via Resend HTTP API.");
  
  sendEmail = async ({ to, subject, text, html }) => {
    const fromAddress = process.env.FROM_EMAIL || "onboarding@resend.dev";
    const payload = {
      from: `"${process.env.FROM_NAME || "Aarions"}" <${fromAddress}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html,
    };

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send email via Resend");
      }

      console.log(`[Email via Resend] Sent successfully to ${to}. Subject: "${subject}". ID: ${data.id}`);
      return { messageId: data.id };
    } catch (error) {
      console.error("[Email via Resend] Failed:", error.message);
      throw error;
    }
  };
} else if (isSmtpConfigured) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Verify connection configuration on startup
  transporter.verify((error, success) => {
    if (error) {
      console.error("Nodemailer SMTP Verification Error:", error.message);
      console.error("Please double-check your SMTP_USER and SMTP_PASS App Password in your environment variables.");
    } else {
      console.log("Nodemailer SMTP Connection verified successfully! Ready to send emails.");
    }
  });

  sendEmail = async ({ to, subject, text, html }) => {
    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Aarions"}" <${process.env.FROM_EMAIL || "noreply@aarions.com"}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email via SMTP] Sent successfully to ${to}. Subject: "${subject}". Message ID: ${info.messageId}`);
    return info;
  };
} else {
  // Fallback to mock console transporter in development
  const transporterMock = {
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

  sendEmail = async ({ to, subject, text, html }) => {
    const mailOptions = {
      from: `"${process.env.FROM_NAME || "Aarions"}" <${process.env.FROM_EMAIL || "noreply@aarions.com"}>`,
      to,
      subject,
      text,
      html,
    };
    const info = await transporterMock.sendMail(mailOptions);
    return info;
  };
}

export { sendEmail };
