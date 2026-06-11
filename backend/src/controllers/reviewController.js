import Review from "../models/Review.js";
import Product from "../models/Product.js";
import AuditLog from "../models/AuditLog.js";
import { ErrorResponse } from "../middleware/errorHandler.js";

// @desc    Add product review
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorResponse("Product not found", 404));
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({ user: req.user.id, product: productId });
    if (alreadyReviewed) {
      return next(new ErrorResponse("Product already reviewed by this account", 400));
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating: Number(rating),
      comment,
      isApproved: false, // Moderated by default
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully and is pending administrative moderation",
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get approved product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate("user", "name avatar")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name sku slug")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject review (Admin)
// @route   PUT /api/admin/reviews/:id/approve
// @access  Private/Admin
export const moderateReview = async (req, res, next) => {
  const { isApproved } = req.body;

  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new ErrorResponse("Review not found", 404));
    }

    review.isApproved = !!isApproved;
    await review.save();

    // Trigger average rating recalculation
    await Review.calculateAverageRating(review.product);

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "moderate_review",
      targetModel: "Review",
      targetId: review._id,
      details: `${isApproved ? "Approved" : "Rejected"} review by user ID ${review.user} for product ID ${review.product}`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      message: `Review has been successfully ${isApproved ? "approved" : "rejected"}`,
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review (Admin/Owner)
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new ErrorResponse("Review not found", 404));
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate average rating
    await Review.calculateAverageRating(productId);

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "delete_review",
      targetModel: "Review",
      targetId: review._id,
      details: `Deleted review from product ID ${productId}`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      message: "Review removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
