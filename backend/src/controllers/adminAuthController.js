import AdminUser from "../models/AdminUser.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import { ErrorResponse } from "../middleware/errorHandler.js";
import jwt from "jsonwebtoken";

// Send Response with cookie and tokens
const sendTokenResponse = (admin, statusCode, res) => {
  const accessToken = admin.getAccessToken();
  const refreshToken = admin.getRefreshToken();

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res
    .status(statusCode)
    .cookie("adminRefreshToken", refreshToken, cookieOptions)
    .json({
      success: true,
      accessToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        avatar: admin.avatar,
        status: admin.status,
      },
    });
};

// @desc    Register Admin User (Superadmin only or seed endpoint)
// @route   POST /api/admin/auth/register
// @access  Private/Superadmin
export const registerAdmin = async (req, res, next) => {
  const { name, email, password, role, permissions } = req.body;

  try {
    // Check if admin email already registered
    const adminExists = await AdminUser.findOne({ email });
    if (adminExists) {
      return next(new ErrorResponse("Admin email already registered", 400));
    }

    // Create admin
    const admin = await AdminUser.create({
      name,
      email,
      password,
      role: role || "admin",
      permissions: permissions || ["read_all"],
    });

    // Write audit log if action done by another logged admin
    if (req.admin) {
      await AuditLog.create({
        adminUser: req.admin._id,
        action: "create_admin_user",
        targetModel: "AdminUser",
        targetId: admin._id,
        details: `Created admin user: ${admin.email} with role: ${admin.role}`,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
    }

    sendTokenResponse(admin, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login Admin User
// @route   POST /api/admin/auth/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validate inputs
    if (!email || !password) {
      return next(new ErrorResponse("Please provide email and password", 400));
    }

    // Check for admin
    const admin = await AdminUser.findOne({ email }).select("+password");
    if (!admin) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check status
    if (admin.status !== "active") {
      return next(new ErrorResponse("This administrative account is inactive", 403));
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Update login timestamps
    admin.lastLogin = new Date();
    await admin.save();

    // Log Activity
    await AuditLog.create({
      adminUser: admin._id,
      action: "login",
      targetModel: "AdminUser",
      targetId: admin._id,
      details: "Admin logged in successfully",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    sendTokenResponse(admin, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout Admin
// @route   POST /api/admin/auth/logout
// @access  Public
export const logoutAdmin = async (req, res, next) => {
  res.cookie("adminRefreshToken", "none", {
    expires: new Date(Date.now() + 10 * 1000), // 10s
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Admin logged out successfully",
  });
};

// @desc    Refresh Admin Access Token
// @route   POST /api/admin/auth/refresh
// @access  Public
export const refreshAdminToken = async (req, res, next) => {
  const token = req.cookies.adminRefreshToken;

  if (!token) {
    return next(new ErrorResponse("No refresh token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const admin = await AdminUser.findById(decoded.id);

    if (!admin || admin.status !== "active") {
      return next(new ErrorResponse("Admin session invalid or account suspended", 401));
    }

    const accessToken = admin.getAccessToken();

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return next(new ErrorResponse("Invalid refresh token", 401));
  }
};

// @desc    Get Admin details
// @route   GET /api/admin/auth/me
// @access  Private
export const getAdminMe = async (req, res, next) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
};

// @desc    Get all customers (Admin)
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getCustomersAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const customers = await User.find({ role: "customer" })
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments({ role: "customer" });

    res.status(200).json({
      success: true,
      count: customers.length,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      customers,
    });
  } catch (error) {
    next(error);
  }
};
