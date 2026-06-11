import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { authorizePermissions } from "../middleware/permission.js";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
  getAdminMe,
  getCustomersAdmin,
} from "../controllers/adminAuthController.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminCategories,
} from "../controllers/categoryController.js";
import {
  getAdminOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  getAdminPayments,
  refundPayment,
} from "../controllers/paymentController.js";
import {
  createCoupon,
  getAdminCoupons,
  deleteCoupon,
} from "../controllers/couponController.js";
import {
  getAdminReviews,
  moderateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAdminBlogs,
} from "../controllers/blogController.js";
import {
  getAdminQueries,
  updateQuery,
} from "../controllers/contactController.js";
import { getAdminSubscribers } from "../controllers/newsletterController.js";
import { updateSettings } from "../controllers/settingsController.js";
import { getDashboardMetrics } from "../controllers/dashboardController.js";

const router = express.Router();

// ---------------- PUBLIC ADMIN ROUTES ----------------
router.post("/auth/login", loginAdmin);
router.post("/auth/logout", logoutAdmin);
router.post("/auth/refresh", refreshAdminToken);

// ---------------- PROTECTED ADMIN ROUTES ----------------
router.use(protectAdmin);

// Auth Profile Check
router.get("/auth/me", getAdminMe);
router.post("/auth/register-admin", authorizePermissions("manage_users"), registerAdmin);

// Dashboard Metrics
router.get("/dashboard", getDashboardMetrics);

// Products Management
router.post(
  "/products",
  authorizePermissions("manage_products"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createProduct
);
router.put(
  "/products/:id",
  authorizePermissions("manage_products"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateProduct
);
router.delete("/products/:id", authorizePermissions("manage_products"), deleteProduct);

// Categories Management
router.get("/categories", getAdminCategories);
router.post(
  "/categories",
  authorizePermissions("manage_categories"),
  upload.single("image"),
  createCategory
);
router.put(
  "/categories/:id",
  authorizePermissions("manage_categories"),
  upload.single("image"),
  updateCategory
);
router.delete("/categories/:id", authorizePermissions("manage_categories"), deleteCategory);

// Orders Management
router.get("/orders", authorizePermissions("manage_orders"), getAdminOrders);
router.put("/orders/:id/status", authorizePermissions("manage_orders"), updateOrderStatus);

// Payments & Transactions
router.get("/payments", authorizePermissions("manage_orders"), getAdminPayments);
router.post("/payments/:id/refund", authorizePermissions("manage_orders"), refundPayment);

// Coupon Codes
router.get("/coupons", authorizePermissions("manage_coupons"), getAdminCoupons);
router.post("/coupons", authorizePermissions("manage_coupons"), createCoupon);
router.delete("/coupons/:id", authorizePermissions("manage_coupons"), deleteCoupon);

// Product Reviews Moderation
router.get("/reviews", authorizePermissions("manage_reviews"), getAdminReviews);
router.put("/reviews/:id/approve", authorizePermissions("manage_reviews"), moderateReview);
router.delete("/reviews/:id", authorizePermissions("manage_reviews"), deleteReview);

// Blogs Management
router.get("/blogs", authorizePermissions("manage_blogs"), getAdminBlogs);
router.post("/blogs", authorizePermissions("manage_blogs"), upload.single("image"), createBlog);
router.put("/blogs/:id", authorizePermissions("manage_blogs"), upload.single("image"), updateBlog);
router.delete("/blogs/:id", authorizePermissions("manage_blogs"), deleteBlog);

// Support & Contact Inquiries
router.get("/contact", authorizePermissions("manage_queries"), getAdminQueries);
router.put("/contact/:id", authorizePermissions("manage_queries"), updateQuery);

// Newsletter Subscribers
router.get("/newsletter", authorizePermissions("manage_newsletter"), getAdminSubscribers);

// Customers Directory
router.get("/customers", authorizePermissions("manage_users"), getCustomersAdmin);

// Website Global Settings
router.put("/settings", authorizePermissions("manage_settings"), upload.single("logo"), updateSettings);

export default router;
