import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    adminUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
    action: {
      type: String,
      required: [true, "Action is required"], // e.g. 'update_product', 'change_order_status', 'delete_review'
      trim: true,
    },
    targetModel: {
      type: String,
      required: [true, "Target model name is required"], // e.g. 'Product', 'Order', 'Review'
      trim: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    details: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
export { auditLogSchema };
