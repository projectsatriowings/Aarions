'use strict';

const { verifyAccessToken } = require('../services/token.service');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

/**
 * protect — Verifies JWT access token from Authorization header or cookie.
 * Attaches req.user on success. Rejects with 401 on failure.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header (Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Fall back to cookie
    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new ApiError(401, 'Authentication required. Please log in.'));
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Fetch fresh user (ensures account not deleted/banned since token issued)
    const user = await User.findById(decoded.id).select(
      '-password -refreshToken'
    );

    if (!user) {
      return next(
        new ApiError(401, 'The user belonging to this token no longer exists.')
      );
    }

    if (!user.isActive) {
      return next(
        new ApiError(403, 'Your account has been deactivated. Contact support.')
      );
    }

    // Check if password was changed after token was issued
    if (
      user.passwordChangedAt &&
      decoded.iat < Math.floor(user.passwordChangedAt.getTime() / 1000)
    ) {
      return next(
        new ApiError(401, 'Password recently changed. Please log in again.')
      );
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * optionalAuth — Attaches req.user if a valid access token is present,
 * but NEVER rejects the request. Useful for public routes that show
 * extra data when a user is logged in (e.g., wishlist status on products).
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token && req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(); // No token — continue as guest
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select(
      '-password -refreshToken'
    );

    if (user && user.isActive) {
      req.user = user;
    }

    next();
  } catch {
    // Any token error — silently ignore and continue as guest
    next();
  }
};

/**
 * restrictTo — Role-based access control factory.
 * Usage: restrictTo('admin', 'manager')
 */
const restrictTo = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Role '${req.user.role}' is not permitted.`
        )
      );
    }
    next();
  };
};

module.exports = { protect, optionalAuth, restrictTo };
