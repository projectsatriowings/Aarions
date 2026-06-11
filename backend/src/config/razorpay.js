import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

let razorpayInstance = null;
let isRazorpayConfigured = false;

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (keyId && keyId !== "your_razorpay_key_id" && keyId !== "rzp_test_dummykeyid123" && keySecret) {
  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    isRazorpayConfigured = true;
    console.log("Razorpay SDK initialized successfully.");
  } catch (error) {
    console.error("Razorpay SDK initialization failed:", error.message);
  }
} else {
  console.warn("Razorpay credentials missing or default. Payment APIs will run in Sandbox Simulation Mode.");
}

export { razorpayInstance, isRazorpayConfigured };
export default razorpayInstance;
