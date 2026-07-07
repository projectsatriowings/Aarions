import { sendEmail } from "../config/nodemailer.js";
import WebsiteSettings from "../models/WebsiteSettings.js";

/**
 * Send order confirmation email to customer
 * @param {Object} order - Order document
 * @param {Object} user - User document
 */
export const sendOrderConfirmationEmail = async (order, user) => {
  // Get website settings for dynamic contact info
  let settings;
  try {
    settings = await WebsiteSettings.findOne();
  } catch (err) {
    console.error("Failed to load website settings in emailHelper:", err.message);
  }
  const contactPhone = settings?.contactPhone || "+91 98432 70810";
  const contactEmail = settings?.contactEmail || "info@aarions.in";

  const orderIdShort = order._id.toString().substring(18).toUpperCase();
  const itemsListHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #E8A317/10; font-size: 14px; color: #2D1F17;">
          <strong>${item.name}</strong><br/>
          <span style="font-size: 11px; color: #6B5D55;">Variant: ${item.selectedVariant || "Standard"}</span>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #E8A317/10; font-size: 14px; color: #2D1F17; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #E8A317/10; font-size: 14px; color: #2D1F17; text-align: right;">
          ₹${item.price * item.quantity}
        </td>
      </tr>`
    )
    .join("");

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
          <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #2D1F17; font-size: 20px; margin-top: 0;">Order Placed Successfully!</h2>
          <p style="font-size: 14px; color: #6B5D55; line-height: 1.6; font-weight: 300;">
            Hi <strong>${user.name}</strong>,
          </p>
          <p style="font-size: 14px; color: #6B5D55; line-height: 1.6; font-weight: 300;">
            Thank you for shopping with Aarions. Your order has been placed and is currently being processed. Here are your transaction details:
          </p>

          <!-- Order info box -->
          <div style="background-color: #FFF8EC; border-radius: 10px; padding: 15px; margin: 20px 0; border: 1px solid rgba(232, 163, 23, 0.08);">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 4px 0; color: #6B5D55;">Order ID:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: bold; color: #2D1F17;">#${orderIdShort}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6B5D55;">Date:</td>
                <td style="padding: 4px 0; text-align: right; color: #2D1F17;">${new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6B5D55;">Payment Method:</td>
                <td style="padding: 4px 0; text-align: right; text-transform: uppercase; color: #2D1F17;">${order.paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6B5D55;">Payment Status:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: bold; color: ${order.paymentMethod === "cod" ? "#E8A317" : "#10B981"};">
                  ${order.paymentMethod === "cod" ? "Pending (Cash on Delivery)" : "Paid"}
                </td>
              </tr>
            </table>
          </div>

          <!-- Items Table -->
          <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; border-bottom: 2px solid #E8A317; padding-bottom: 5px; margin-top: 25px; color: #2D1F17;">Ordered Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="font-size: 11px; text-transform: uppercase; color: #6B5D55; letter-spacing: 1px;">
                <th style="padding: 10px 0; text-align: left; border-bottom: 1px solid #E8A317;">Item</th>
                <th style="padding: 10px 0; text-align: center; border-bottom: 1px solid #E8A317; width: 60px;">Qty</th>
                <th style="padding: 10px 0; text-align: right; border-bottom: 1px solid #E8A317; width: 100px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
          </table>

          <!-- Price Calculation Details -->
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #6B5D55; margin-top: 15px;">
            <tr>
              <td style="padding: 4px 0;">Subtotal:</td>
              <td style="padding: 4px 0; text-align: right; color: #2D1F17;">₹${order.itemsPrice}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;">Shipping Fee:</td>
              <td style="padding: 4px 0; text-align: right; color: #2D1F17;">₹${order.shippingPrice}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;">GST (${order.itemsPrice ? Math.round((order.taxPrice / order.itemsPrice) * 100) : 5}%):</td>
              <td style="padding: 4px 0; text-align: right; color: #2D1F17;">₹${order.taxPrice}</td>
            </tr>
            ${
              order.discountPrice > 0
                ? `
            <tr>
              <td style="padding: 4px 0; color: #10B981;">Coupon Discount:</td>
              <td style="padding: 4px 0; text-align: right; color: #10B981;">-₹${order.discountPrice}</td>
            </tr>`
                : ""
            }
            <tr style="font-size: 16px; font-weight: bold; border-top: 1px dashed #E8A317; color: #2D1F17;">
              <td style="padding: 12px 0 0 0;">Total Paid:</td>
              <td style="padding: 12px 0 0 0; text-align: right; color: #2D1F17;">₹${order.totalAmount}</td>
            </tr>
          </table>

          <!-- Shipping Address -->
          <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; border-bottom: 2px solid #E8A317; padding-bottom: 5px; margin-top: 30px; color: #2D1F17;">Shipping Details</h3>
          <p style="font-size: 13px; color: #6B5D55; line-height: 1.5; font-weight: 300;">
            ${order.shippingAddress.street}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}<br/>
            Contact Number: ${order.shippingAddress.phone}
          </p>

        </div>

        <!-- Footer -->
        <div style="background-color: #2D1F17; padding: 20px; text-align: center; font-size: 11px; color: #A89B93;">
          <p style="margin: 0 0 10px 0;">Have queries? Reach us at ${contactEmail} or call ${contactPhone}</p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Aarions. All rights reserved.</p>
        </div>

      </div>
    </div>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: `Order Placed Successfully - #${orderIdShort}`,
      html: emailHtml,
      text: `Hi ${user.name},\n\nYour order #${orderIdShort} has been placed successfully for a total of ₹${order.totalAmount}.\n\nThank you for choosing Aarions.`,
    });
  } catch (error) {
    console.error("Failed to send order placement email:", error.message);
  }
};

/**
 * Send order status update email to customer
 * @param {Object} order - Order document
 * @param {Object} user - User document
 */
export const sendOrderStatusUpdateEmail = async (order, user) => {
  // Get website settings for dynamic contact info
  let settings;
  try {
    settings = await WebsiteSettings.findOne();
  } catch (err) {
    console.error("Failed to load website settings in emailHelper:", err.message);
  }
  const contactPhone = settings?.contactPhone || "+91 98432 70810";
  const contactEmail = settings?.contactEmail || "info@aarions.in";

  const orderIdShort = order._id.toString().substring(18).toUpperCase();
  
  // Generate items HTML
  const itemsListHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid rgba(232, 163, 23, 0.1); font-size: 14px; color: #2D1F17;">
          <strong>${item.name}</strong><br/>
          <span style="font-size: 11px; color: #6B5D55;">Variant: ${item.selectedVariant || "Standard"}</span>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid rgba(232, 163, 23, 0.1); font-size: 14px; color: #2D1F17; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid rgba(232, 163, 23, 0.1); font-size: 14px; color: #2D1F17; text-align: right;">
          ₹${item.price * item.quantity}
        </td>
      </tr>`
    )
    .join("");

  // Format details for the status message
  let statusMessage = "";
  let trackingHtml = "";

  switch (order.status) {
    case "Confirmed":
      statusMessage = "Your payment has been verified, and your order has been confirmed! We are preparing to pack it.";
      break;
    case "Packed":
      statusMessage = "Great news! Your order has been packed and is ready to be handed over to the courier partner.";
      break;
    case "Shipped":
      statusMessage = "Excellent! Your order has been shipped and is on its way to you.";
      if (order.trackingNumber && order.carrier) {
        trackingHtml = `
          <div style="background-color: #FFFDF9; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(232, 163, 23, 0.15); box-shadow: 0 2px 6px rgba(45,31,23,0.02); font-size: 13px;">
            <h4 style="margin: 0 0 10px 0; font-family: 'Playfair Display', Georgia, serif; color: #2D1F17; font-size: 14px; border-bottom: 1px solid rgba(232, 163, 23, 0.1); padding-bottom: 5px;">Courier & Tracking Info</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #6B5D55; font-weight: 300;">Courier Partner:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #2D1F17;">${order.carrier}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6B5D55; font-weight: 300;">Tracking Number:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #2D1F17; font-family: monospace;">${order.trackingNumber}</td>
              </tr>
            </table>
          </div>
        `;
      }
      break;
    case "Out For Delivery":
      statusMessage = "Your order is out for delivery today. Keep your phone handy!";
      break;
    case "Delivered":
      statusMessage = "Hooray! Your Aarions order has been delivered. We hope you enjoy our premium organic products.";
      break;
    case "Cancelled":
      statusMessage = "Your order has been cancelled. If this was a mistake, or you need support regarding refunds, please contact us.";
      break;
    default:
      statusMessage = `Your order status has been updated to: ${order.status}`;
  }

  // Expected Delivery HTML block
  let expectedDeliveryHtml = "";
  if (order.expectedDeliveryDate) {
    const formattedDate = new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    expectedDeliveryHtml = `
      <div style="background-color: #FFFDF9; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(232, 163, 23, 0.15); box-shadow: 0 2px 6px rgba(45,31,23,0.02); font-size: 13px;">
        <h4 style="margin: 0 0 10px 0; font-family: 'Playfair Display', Georgia, serif; color: #2D1F17; font-size: 14px; border-bottom: 1px solid rgba(232, 163, 23, 0.1); padding-bottom: 5px;">Estimated Arrival</h4>
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #E8A317;">${formattedDate}</p>
        <p style="margin: 5px 0 0 0; font-size: 11px; color: #6B5D55; font-weight: 300; line-height: 1.4;">Our delivery partner will make attempts to deliver on or before this date.</p>
      </div>
    `;
  }

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
          
          <p style="font-size: 14px; color: #2D1F17; margin-top: 20px;">
            Order Status: <span style="text-transform: uppercase; font-weight: 900; font-size: 16px; color: #E8A317; background-color: rgba(45, 31, 23, 0.05); padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(232, 163, 23, 0.2); letter-spacing: 1px; display: inline-block; margin-left: 5px;">${order.status}</span>
          </p>

          <p style="font-size: 14px; color: #6B5D55; line-height: 1.6; font-weight: 300;">
            Hi <strong>${user.name}</strong>,
          </p>
          <p style="font-size: 14px; color: #6B5D55; line-height: 1.6; font-weight: 300;">
            ${statusMessage}
          </p>

          ${expectedDeliveryHtml}
          ${trackingHtml}

          <!-- Ordered Items -->
          <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; border-bottom: 2px solid #E8A317; padding-bottom: 5px; margin-top: 25px; color: #2D1F17;">Ordered Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="font-size: 11px; text-transform: uppercase; color: #6B5D55; letter-spacing: 1px;">
                <th style="padding: 10px 0; text-align: left; border-bottom: 1px solid #E8A317;">Item</th>
                <th style="padding: 10px 0; text-align: center; border-bottom: 1px solid #E8A317; width: 60px;">Qty</th>
                <th style="padding: 10px 0; text-align: right; border-bottom: 1px solid #E8A317; width: 100px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
          </table>

          <!-- Order Summary Details -->
          <div style="background-color: #FFF8EC; border-radius: 10px; padding: 15px; margin: 25px 0; border: 1px solid rgba(232, 163, 23, 0.08); font-size: 13px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 2px 0; color: #6B5D55;">Order ID:</td>
                <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #2D1F17;">#${orderIdShort}</td>
              </tr>
              <tr>
                <td style="padding: 2px 0; color: #6B5D55;">Total Amount:</td>
                <td style="padding: 2px 0; text-align: right; font-weight: bold; color: #2D1F17;">₹${order.totalAmount}</td>
              </tr>
              <tr>
                <td style="padding: 2px 0; color: #6B5D55;">Shipping Address:</td>
                <td style="padding: 2px 0; text-align: right; color: #2D1F17;">
                  ${order.shippingAddress.city}, ${order.shippingAddress.state}
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
          <p style="margin: 0 0 10px 0;">Have queries? Reach us at ${contactEmail} or call ${contactPhone}</p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Aarions. All rights reserved.</p>
        </div>

      </div>
    </div>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: `Order #${orderIdShort} Status Update: ${order.status}`,
      html: emailHtml,
      text: `Hi ${user.name},\n\nYour order #${orderIdShort} status has been updated to: ${order.status}.\n\nThank you for choosing Aarions.`,
    });
  } catch (error) {
    console.error("Failed to send order status update email:", error.message);
  }
};
