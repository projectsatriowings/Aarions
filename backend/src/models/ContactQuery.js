import mongoose from "mongoose";

const contactQuerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },
    notes: {
      type: String, // Internal resolution comments
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const ContactQuery = mongoose.model("ContactQuery", contactQuerySchema);
export default ContactQuery;
