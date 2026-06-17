import Razorpay from "razorpay";
import PaymentSettings from "../models/PaymentSettings.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import AuditLog from "../models/AuditLog.js";
import { ErrorResponse } from "../middleware/errorHandler.js";
import crypto from "crypto";
import { sendOrderConfirmationEmail } from "../utils/emailHelper.js";

// Helper to dynamically resolve active Razorpay credentials and instance
const getActiveRazorpayConfig = async () => {
  try {
    const settings = await PaymentSettings.findOne();
    if (settings && settings.isActive && settings.razorpayKeyId && settings.razorpayKeySecret) {
      return {
        keyId: settings.razorpayKeyId,
        keySecret: settings.razorpayKeySecret,
        isConfigured: true,
        instance: new Razorpay({
          key_id: settings.razorpayKeyId,
          key_secret: settings.razorpayKeySecret,
        }),
      };
    }
  } catch (err) {
    console.error("Error retrieving custom payment settings, falling back to env:", err.message);
  }

  const envKeyId = process.env.RAZORPAY_KEY_ID;
  const envKeySecret = process.env.RAZORPAY_KEY_SECRET;
  const isEnvConfigured = !!(
    envKeyId &&
    envKeyId !== "your_razorpay_key_id" &&
    envKeyId !== "rzp_test_dummykeyid123" &&
    envKeySecret
  );

  return {
    keyId: envKeyId,
    keySecret: envKeySecret,
    isConfigured: isEnvConfigured,
    instance: isEnvConfigured
      ? new Razorpay({ key_id: envKeyId, key_secret: envKeySecret })
      : null,
  };
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
  const { amount } = req.body; // Amount in INR

  try {
    const amountInPaise = Math.round(amount * 100); // convert to paisa

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const rzConfig = await getActiveRazorpayConfig();

    if (rzConfig.isConfigured) {
      const order = await rzConfig.instance.orders.create(options);
      return res.status(201).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: rzConfig.keyId,
        mock: false,
      });
    } else {
      // Razorpay Simulation Fallback for Development
      const mockOrderId = `order_mock_${crypto.randomBytes(8).toString("hex")}`;
      return res.status(201).json({
        success: true,
        orderId: mockOrderId,
        amount: amountInPaise,
        currency: "INR",
        mock: true,
        message: "Running in Sandbox simulation mode. Use fake signatures during verification.",
      });
    }
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Private
export const verifyPaymentSignature = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  try {
    let isValid = false;

    // Check if order was created as mock
    const isMock = razorpay_order_id && razorpay_order_id.startsWith("order_mock_");
    const rzConfig = await getActiveRazorpayConfig();

    if (isMock) {
      // Mock signature verification for sandbox
      isValid = true;
    } else if (rzConfig.isConfigured) {
      // Real signature verification
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", rzConfig.keySecret)
        .update(body.toString())
        .digest("hex");

      isValid = expectedSignature === razorpay_signature;
    }

    if (!isValid) {
      return next(new ErrorResponse("Payment signature verification failed", 400));
    }

    // Update order status & payment information
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {
      return next(new ErrorResponse("Associated order not found", 404));
    }

    // Reduce stock levels since the online order is now "Confirmed" (Paid)
    for (const item of dbOrder.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.inventory = Math.max(0, product.inventory - item.quantity);
        if (product.inventory === 0) {
          product.inStock = false;
        }
        await product.save();
      }
    }

    dbOrder.paymentInfo = {
      id: razorpay_payment_id || `mock_pay_${Date.now()}`,
      orderId: razorpay_order_id,
      status: "paid",
    };
    dbOrder.status = "Confirmed";
    await dbOrder.save();

    // Send order placement email to customer
    sendOrderConfirmationEmail(dbOrder, req.user);

    // Save transaction
    const payment = await Payment.create({
      user: req.user.id,
      order: dbOrder._id,
      paymentId: razorpay_payment_id || `mock_pay_${Date.now()}`,
      orderId: razorpay_order_id,
      signature: razorpay_signature || "mock_signature",
      amount: dbOrder.totalAmount,
      status: "captured",
    });

    res.status(200).json({
      success: true,
      message: "Payment successfully verified and recorded",
      order: dbOrder,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions (Admin)
// @route   GET /api/admin/payments
// @access  Private/Admin
export const getAdminPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("order", "totalAmount status")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin refund management
// @route   POST /api/admin/payments/:id/refund
// @access  Private/Admin
export const refundPayment = async (req, res, next) => {
  const { amount } = req.body;

  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return next(new ErrorResponse("Payment record not found", 404));
    }

    const order = await Order.findById(payment.order);
    if (!order) {
      return next(new ErrorResponse("Order record not found", 404));
    }

    const refundAmount = amount || payment.amount;
    const rzConfig = await getActiveRazorpayConfig();

    if (payment.paymentId.startsWith("mock_pay_")) {
      // Mock Sandbox Refund
      payment.status = "refunded";
      payment.refundId = `refund_mock_${Date.now()}`;
      await payment.save();

      order.refundStatus = "refunded";
      order.refundedAmount = refundAmount;
      await order.save();
    } else if (rzConfig.isConfigured) {
      // Real Razorpay Refund
      const response = await rzConfig.instance.payments.refund(payment.paymentId, {
        amount: Math.round(refundAmount * 100), // convert to paise
      });

      payment.status = "refunded";
      payment.refundId = response.id;
      await payment.save();

      order.refundStatus = "refunded";
      order.refundedAmount = refundAmount;
      await order.save();
    }

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "refund_payment",
      targetModel: "Payment",
      targetId: payment._id,
      details: `Refunded transaction ${payment.paymentId} for order #${order._id} of amount ₹${refundAmount}`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      payment,
      order,
    });
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
};
