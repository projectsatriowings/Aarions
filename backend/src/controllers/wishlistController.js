import Wishlist from "../models/Wishlist.js";
import { ErrorResponse } from "../middleware/errorHandler.js";

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req, res, next) => {
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }

    if (wishlist.products.includes(productId)) {
      return res.status(200).json({
        success: true,
        message: "Product already in wishlist",
        wishlist: await wishlist.populate("products"),
      });
    }

    wishlist.products.push(productId);
    await wishlist.save();
    const populated = await wishlist.populate("products");

    res.status(200).json({
      success: true,
      wishlist: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return next(new ErrorResponse("Wishlist not found", 404));
    }

    wishlist.products = wishlist.products.filter(
      (prod) => prod.toString() !== req.params.productId
    );

    await wishlist.save();
    const populated = await wishlist.populate("products");

    res.status(200).json({
      success: true,
      wishlist: populated,
    });
  } catch (error) {
    next(error);
  }
};
