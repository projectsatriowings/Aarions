import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const statusMessage = "Excellent! Your order has been shipped and is on its way to you.";
const trackingHtml = `
  <div style="background-color: #FFF8EC; border-radius: 10px; padding: 15px; margin: 20px 0; border: 1px solid rgba(232, 163, 23, 0.08); font-size: 13px;">
    <h4 style="margin: 0 0 10px 0; font-family: 'Playfair Display', Georgia, serif; color: #2D1F17; font-size: 14px;">Courier & Tracking Info</h4>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 2px 0; color: #6B5D55;">Courier Partner:</td>
        <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #2D1F17;">Bluedart</td>
      </tr>
      <tr>
        <td style="padding: 2px 0; color: #6B5D55;">Tracking Number:</td>
        <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #2D1F17; font-family: monospace;">AAR-123456789</td>
      </tr>
    </table>
  </div>
`;

const emailHtml = `
  <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #FFF8EC; padding: 30px 15px; color: #2D1F17;">
    <div style="max-w: 600px; margin: 0 auto; background-color: #FFFDF9; border: 1px solid rgba(232, 163, 23, 0.15); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(45, 31, 23, 0.03);">
      
      <!-- Header -->
      <div style="background-color: #2D1F17; padding: 25px; text-align: center;">
        <h1 style="color: #E8A317; font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 24px; letter-spacing: 1px;">AARIONS</h1>
        <p style="color: #FFF8EC; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Premium Organic Products</p>
      </div>

      <!-- Body -->
      <div style="padding: 30px 25px;">
        <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #2D1F17; font-size: 20px; margin-top: 0; border-bottom: 2px solid #E8A317; padding-bottom: 8px;">Order Status Update</h2>
        
        <p style="font-size: 14px; color: #2D1F17; font-weight: bold; margin-top: 20px;">
          Order Status: <span style="text-transform: uppercase; padding: 3px 8px; border-radius: 4px; background-color: rgba(232, 163, 23, 0.1); color: #E8A317; font-size: 12px;">Shipped</span>
        </p>

        <p style="font-size: 14px; color: #6B5D55; line-height: 1.6; font-weight: 300;">
          Hi <strong>SHARIKA RAJAN</strong>,
        </p>
        <p style="font-size: 14px; color: #6B5D55; line-height: 1.6; font-weight: 300;">
          ${statusMessage}
        </p>

        ${trackingHtml}

        <!-- Order Summary Details -->
        <div style="background-color: #FFF8EC; border-radius: 10px; padding: 15px; margin: 25px 0; border: 1px solid rgba(232, 163, 23, 0.08); font-size: 13px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 2px 0; color: #6B5D55;">Order ID:</td>
              <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #2D1F17;">#6ACA2C</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #6B5D55;">Total Amount:</td>
              <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #2D1F17;">₹239</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #6B5D55;">Shipping Address:</td>
              <td style="padding: 2px 0; text-align: right; color: #2D1F17;">
                Chennai, Tamil Nadu
              </td>
            </tr>
          </table>
        </div>

        <p style="font-size: 12px; color: #A89B93; text-align: center; margin-top: 30px;">
          You can view complete shipment details by logging into your account on our website.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #2D1F17; padding: 20px; text-align: center; font-size: 11px; color: #A89B93;">
        <p style="margin: 0 0 10px 0;">Have queries? Reach us at support@aarions.com or call +91 98765 43210</p>
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Aarions. All rights reserved.</p>
      </div>

    </div>
  </div>
`;

const mailOptions = {
  from: `"${process.env.FROM_NAME || "Aarions"}" <${process.env.FROM_EMAIL}>`,
  to: "sharikarajan07uec@gmail.com",
  subject: "Order #6ACA2C Status Update: Shipped",
  html: emailHtml,
  text: `Hi SHARIKA RAJAN,\n\nYour order #6ACA2C status has been updated to: Shipped.\n\nThank you for choosing Aarions.`,
};

console.log("Attempting to send HTML email...");
transporter.sendMail(mailOptions)
  .then((info) => {
    console.log("SUCCESS! HTML Email sent successfully.");
    console.log("Response:", info.response);
    console.log("Message ID:", info.messageId);
    process.exit(0);
  })
  .catch((err) => {
    console.error("FAILURE! HTML Email sending failed.");
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
    process.exit(1);
  });
