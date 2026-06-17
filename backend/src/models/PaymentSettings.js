import mongoose from "mongoose";

const paymentSettingsSchema = new mongoose.Schema(
  {
    razorpayKeyId: {
      type: String,
      default: "",
      trim: true,
    },
    razorpayKeySecret: {
      type: String,
      default: "",
      trim: true,
    },
    isTestMode: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentSettings = mongoose.model("PaymentSettings", paymentSettingsSchema);
export default PaymentSettings;
