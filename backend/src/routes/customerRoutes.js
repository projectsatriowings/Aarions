import express from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  register,
  login,
  googleLogin,
  logout,
  refreshToken,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import {
  getProducts,
  getProduct,
  getSearchSuggestions,
} from "../controllers/productController.js";
import { getCategories } from "../controllers/categoryController.js";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import {
  placeOrder,
  cancelOrder,
  getMyOrders,
  getOrderDetails,
} from "../controllers/orderController.js";
import {
  createRazorpayOrder,
  verifyPaymentSignature,
} from "../controllers/paymentController.js";
import { addReview, getProductReviews } from "../controllers/reviewController.js";
import { getBlogs, getBlogDetails } from "../controllers/blogController.js";
import { submitQuery } from "../controllers/contactController.js";
import { subscribeNewsletter, unsubscribeNewsletter } from "../controllers/newsletterController.js";
import { getSettings } from "../controllers/settingsController.js";
import { applyCoupon } from "../controllers/couponController.js";
import {
  getAddresses,
  addAddress,
  setDefaultAddress,
  deleteAddress,
} from "../controllers/addressController.js";


const router = express.Router();

// ---------------- AUTH ROUTES ----------------
router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/google", googleLogin);
router.post("/auth/logout", logout);
router.post("/auth/refresh", refreshToken);
router.post("/auth/forgotpassword", forgotPassword);
router.put("/auth/resetpassword/:resettoken", resetPassword);
router.get("/auth/me", protect, getMe);
router.put("/auth/profile", protect, upload.single("avatar"), updateProfile);

// ---------------- PRODUCT ROUTES ----------------
router.get("/products", getProducts);
router.get("/products/search/suggestions", getSearchSuggestions);
router.get("/products/:idOrSlug", getProduct);

// ---------------- CATEGORY ROUTES ----------------
router.get("/categories", getCategories);

// ---------------- CART ROUTES ----------------
router.get("/cart", protect, getCart);
router.post("/cart", protect, addCartItem);
router.put("/cart/:itemId", protect, updateCartItem);
router.delete("/cart/:itemId", protect, removeCartItem);
router.delete("/cart", protect, clearCart);

// ---------------- WISHLIST ROUTES ----------------
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist", protect, addToWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

// ---------------- ORDER ROUTES ----------------
router.post("/orders", protect, placeOrder);
router.get("/orders", protect, getMyOrders);
router.get("/orders/:id", protect, getOrderDetails);
router.put("/orders/:id/cancel", protect, cancelOrder);

// ---------------- PAYMENT ROUTES ----------------
router.post("/payments/create-order", protect, createRazorpayOrder);
router.post("/payments/verify", protect, verifyPaymentSignature);

// ---------------- COUPON ROUTES ----------------
router.post("/coupons/apply", protect, applyCoupon);

// ---------------- REVIEW ROUTES ----------------
router.post("/reviews", protect, addReview);
router.get("/reviews/product/:productId", getProductReviews);

// ---------------- BLOG ROUTES ----------------
router.get("/blogs", getBlogs);
router.get("/blogs/:slug", getBlogDetails);

// ---------------- CONTACT ROUTES ----------------
router.post("/contact", submitQuery);

// ---------------- NEWSLETTER ROUTES ----------------
router.post("/newsletter/subscribe", subscribeNewsletter);
router.post("/newsletter/unsubscribe", unsubscribeNewsletter);

// ---------------- SETTINGS ROUTES ----------------
router.get("/settings", getSettings);

// ---------------- ADDRESS ROUTES ----------------
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:id/default", protect, setDefaultAddress);
router.delete("/addresses/:id", protect, deleteAddress);

export default router;
