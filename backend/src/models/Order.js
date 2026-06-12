import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  selectedVariant: {
    type: String, // e.g. "250 ml", "100g"
    required: true,
  },
});

const trackingEventSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["razorpay", "cod"],
      default: "razorpay",
    },
    paymentInfo: {
      id: { type: String }, // Razorpay Payment ID or Transaction ID
      orderId: { type: String }, // Razorpay Order ID
      status: { type: String, default: "pending" },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    discountPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Confirmed", "Packed", "Shipped", "Out For Delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
    trackingNumber: {
      type: String,
    },
    carrier: {
      type: String,
    },
    expectedDeliveryDate: {
      type: Date,
    },
    trackingHistory: [trackingEventSchema],
    couponApplied: {
      type: String,
    },
    refundedAmount: {
      type: Number,
      default: 0.0,
    },
    refundStatus: {
      type: String,
      enum: ["none", "pending", "refunded"],
      default: "none",
    },
    notes: {
      type: String,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-add tracking events on status change
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    const defaultComments = {
      Pending: "Order has been placed and is pending processing.",
      Confirmed: "Order has been confirmed and is being processed.",
      Packed: "Order items have been packed and prepared for shipping.",
      Shipped: "Order has been handed over to the shipping carrier.",
      "Out For Delivery": "Order is out with the local courier for delivery.",
      Delivered: "Order was delivered successfully.",
      Cancelled: "Order was cancelled.",
    };
    this.trackingHistory.push({
      status: this.status,
      timestamp: new Date(),
      comment: defaultComments[this.status] || `Order state updated to ${this.status}`,
    });
    if (this.status === "Delivered") {
      this.deliveredAt = new Date();
    }
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
export { orderItemSchema };
