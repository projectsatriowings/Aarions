import Coupon from "../models/Coupon.js";
import AuditLog from "../models/AuditLog.js";
import { ErrorResponse } from "../middleware/errorHandler.js";

// @desc    Apply coupon (Customer)
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = async (req, res, next) => {
  const { code, orderAmount } = req.body;

  try {
    if (!code) {
      return next(new ErrorResponse("Please provide a coupon code", 400));
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return next(new ErrorResponse("Invalid coupon code", 404));
    }

    if (!coupon.isValid(orderAmount)) {
      return next(
        new ErrorResponse("Coupon is expired, inactive, or order amount threshold not met", 400)
      );
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = coupon.discountValue;
    }

    res.status(200).json({
      success: true,
      message: `Coupon code "${coupon.code}" applied successfully`,
      discount,
      code: coupon.code,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/admin/coupons
// @access  Private/Admin
export const getAdminCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort("-createdAt");
    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new coupon (Admin)
// @route   POST /api/admin/coupons
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscountAmount,
    startDate,
    endDate,
    usageLimit,
  } = req.body;

  try {
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return next(new ErrorResponse("Coupon code already exists", 400));
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      usageLimit,
    });

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "create_coupon",
      targetModel: "Coupon",
      targetId: coupon._id,
      details: `Created coupon: "${coupon.code}" (${coupon.discountValue} ${coupon.discountType === "percentage" ? "%" : "flat"})`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      success: true,
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return next(new ErrorResponse("Coupon not found", 404));
    }

    await Coupon.findByIdAndDelete(req.params.id);

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "delete_coupon",
      targetModel: "Coupon",
      targetId: coupon._id,
      details: `Deleted coupon "${coupon.code}"`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      message: `Coupon "${coupon.code}" removed successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active/available coupons (Customer)
// @route   GET /api/coupons
// @access  Private
export const getAvailableCoupons = async (req, res, next) => {
  try {
    const now = new Date();
    // Fetch coupons that are active, and within date range
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    // Filter out coupons whose usageLimit is exceeded
    const availableCoupons = coupons.filter((coupon) => {
      if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
        return false;
      }
      return true;
    });

    res.status(200).json({
      success: true,
      coupons: availableCoupons,
    });
  } catch (error) {
    next(error);
  }
};
