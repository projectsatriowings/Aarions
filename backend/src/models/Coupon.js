import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount cannot be negative"],
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: [0, "Minimum order amount cannot be negative"],
    },
    maxDiscountAmount: {
      type: Number, // Caps the maximum deduction if discountType is 'percentage'
      min: [0, "Max discount amount cannot be negative"],
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    usageLimit: {
      type: Number, // Total times this coupon can be used globally
      default: null,
    },
    usageCount: {
      type: Number,
      default: 0,
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

// Method to validate coupon validity
couponSchema.methods.isValid = function (orderAmount) {
  const now = new Date();
  if (!this.isActive) return false;
  if (now < this.startDate || now > this.endDate) return false;
  if (this.usageLimit !== null && this.usageCount >= this.usageLimit) return false;
  if (orderAmount < this.minOrderAmount) return false;
  return true;
};

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
