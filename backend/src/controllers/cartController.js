import Cart from "../models/Cart.js";
import { ErrorResponse } from "../middleware/errorHandler.js";

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart) {
      // Lazy initialize if not found
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addCartItem = async (req, res, next) => {
  const { productId, quantity, selectedVariant } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Check if item variant already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.selectedVariant === selectedVariant
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity || 1);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity || 1),
        selectedVariant,
      });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");

    res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404));
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return next(new ErrorResponse("Cart item not found", 404));
    }

    item.quantity = Number(quantity);

    await cart.save();
    const populatedCart = await cart.populate("items.product");

    res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404));
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);

    await cart.save();
    const populatedCart = await cart.populate("items.product");

    res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return next(new ErrorResponse("Cart not found", 404));
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};
