import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AdminUser from "../models/AdminUser.js";
import { ErrorResponse } from "./errorHandler.js";

// Protect Customer Routes
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Fetch user and attach to request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse("User no longer exists", 401));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

// Protect Admin Routes
export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.adminAccessToken) {
    token = req.cookies.adminAccessToken;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this administrative route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Fetch admin user and attach to request
    req.admin = await AdminUser.findById(decoded.id);

    if (!req.admin) {
      return next(new ErrorResponse("Admin profile not found", 401));
    }

    if (req.admin.status !== "active") {
      return next(new ErrorResponse("This administrative account is inactive", 403));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this administrative route", 401));
  }
};
