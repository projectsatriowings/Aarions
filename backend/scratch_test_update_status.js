import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Order from "./src/models/Order.js";
import User from "./src/models/User.js";
import { sendOrderStatusUpdateEmail } from "./src/utils/emailHelper.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected successfully!");

  const orderId = "6a2baa2f8e5aa480566aca2c"; // Order #6ACA2C from the user's screen
  console.log(`Fetching order #${orderId}...`);
  const order = await Order.findById(orderId);
  
  if (!order) {
    console.error("Order not found!");
    process.exit(1);
  }

  console.log("Order found. Current status:", order.status);
  
  // Set to Packed
  order.status = "Packed";
  await order.save();
  console.log("Updated order status to: Packed");

  console.log("Populating user details...");
  await order.populate("user", "name email");

  if (!order.user) {
    console.error("No user reference found on this order!");
    process.exit(1);
  }

  console.log(`User found: ${order.user.name} <${order.user.email}>`);

  console.log("Sending status update email...");
  try {
    await sendOrderStatusUpdateEmail(order, order.user);
    console.log("SUCCESS! Status update email sent.");
  } catch (err) {
    console.error("FAILED to send email:");
    console.error(err);
  }

  mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
