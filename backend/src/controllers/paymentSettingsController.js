import PaymentSettings from "../models/PaymentSettings.js";
import AuditLog from "../models/AuditLog.js";

// @desc    Get payment settings (Admin)
// @route   GET /api/admin/payments/settings
// @access  Private/Admin
export const getPaymentSettings = async (req, res, next) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = await PaymentSettings.create({});
    }

    // Mask secret for UI security
    const maskedSecret = settings.razorpayKeySecret
      ? "••••••••••••••••" + settings.razorpayKeySecret.substring(Math.max(0, settings.razorpayKeySecret.length - 4))
      : "";

    res.status(200).json({
      success: true,
      settings: {
        razorpayKeyId: settings.razorpayKeyId || "",
        razorpayKeySecret: maskedSecret,
        isTestMode: settings.isTestMode,
        isActive: settings.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment settings (Admin)
// @route   PUT /api/admin/payments/settings
// @access  Private/Admin
export const updatePaymentSettings = async (req, res, next) => {
  const { razorpayKeyId, razorpayKeySecret, isTestMode, isActive } = req.body;

  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = await PaymentSettings.create({});
    }

    settings.razorpayKeyId = razorpayKeyId;
    if (isTestMode !== undefined) settings.isTestMode = isTestMode;
    if (isActive !== undefined) settings.isActive = isActive;

    // Only update the secret if the user typed a new one (not masked) or cleared it
    if (razorpayKeySecret === "") {
      settings.razorpayKeySecret = "";
    } else if (razorpayKeySecret && !razorpayKeySecret.startsWith("••••")) {
      settings.razorpayKeySecret = razorpayKeySecret;
    }

    await settings.save();

    // Create Audit Log entry
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "update_payment_settings",
      targetModel: "PaymentSettings",
      targetId: settings._id,
      details: "Updated Razorpay Payment Gateway settings",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Mask the secret for response
    const maskedSecret = settings.razorpayKeySecret
      ? "••••••••••••••••" + settings.razorpayKeySecret.substring(Math.max(0, settings.razorpayKeySecret.length - 4))
      : "";

    res.status(200).json({
      success: true,
      message: "Payment settings updated successfully",
      settings: {
        razorpayKeyId: settings.razorpayKeyId || "",
        razorpayKeySecret: maskedSecret,
        isTestMode: settings.isTestMode,
        isActive: settings.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};
