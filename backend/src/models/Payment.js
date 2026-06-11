import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentId: {
      type: String, // Razorpay payment ID
    },
    orderId: {
      type: String, // Razorpay order ID
      required: true,
    },
    signature: {
      type: String, // Razorpay signature
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "captured", "failed", "refunded"],
      default: "pending",
    },
    refundId: {
      type: String,
    },
    errorDetails: {
      type: mongoose.Schema.Types.Mixed,
    },
    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
