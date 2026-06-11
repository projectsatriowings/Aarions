import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import { ErrorResponse } from "../middleware/errorHandler.js";
import { sendEmail } from "../config/nodemailer.js";
import { uploadImage } from "../middleware/upload.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Send Response with cookie and tokens
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = user.getAccessToken();
  const refreshToken = user.getRefreshToken();

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res
    .status(statusCode)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        verified: user.verified,
      },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse("Email already registered", 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
    });

    // Initialize empty Cart & Wishlist for the user
    await Cart.create({ user: user._id, items: [] });
    await Wishlist.create({ user: user._id, products: [] });

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse("Please provide email and password", 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res, next) => {
  res.cookie("refreshToken", "none", {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return next(new ErrorResponse("No refresh token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("User not found", 401));
    }

    const accessToken = user.getAccessToken();

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return next(new ErrorResponse("Invalid refresh token", 401));
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  const { name, phoneNumber } = req.body;

  try {
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phoneNumber) fieldsToUpdate.phoneNumber = phoneNumber;

    if (req.file) {
      const avatarUrl = await uploadImage(req.file);
      fieldsToUpdate.avatar = avatarUrl;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("There is no user with that email", 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash and set resetPasswordToken field
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set expire: 10 mins
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to:\n\n ${resetUrl}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
        html: `<p>Please click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
      });

      res.status(200).json({ success: true, message: "Email sent" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid token or token expired", 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Google Sign-In / Sign-Up
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new ErrorResponse("Google access token is required", 400));
  }

  try {
    // 1. Verify token validity and obtain audience/client ID
    const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
    if (!tokenInfoRes.ok) {
      return next(new ErrorResponse("Invalid Google token or verification failed", 401));
    }
    const tokenInfo = await tokenInfoRes.json();

    // 2. Validate token audience against server-configured GOOGLE_CLIENT_ID
    const expectedClientId = process.env.GOOGLE_CLIENT_ID;
    const aud = tokenInfo.aud || tokenInfo.audience;
    const azp = tokenInfo.azp || tokenInfo.issued_to;

    if (!expectedClientId || expectedClientId === "your_google_client_id_here") {
      console.warn("GOOGLE_CLIENT_ID is not configured in environment variables.");
    } else if (aud !== expectedClientId && azp !== expectedClientId) {
      return next(new ErrorResponse("Google authentication audience verification failed", 401));
    }

    // 3. Fetch user profile from google userinfo endpoint
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!profileRes.ok) {
      return next(new ErrorResponse("Failed to fetch Google user profile", 401));
    }
    const profile = await profileRes.json();
    const { sub, name, email, picture } = profile;

    if (!email) {
      return next(new ErrorResponse("Email address not found in Google account profile", 400));
    }

    // 4. Check if user already exists
    let user = await User.findOne({
      $or: [
        { googleId: sub },
        { email: email.toLowerCase() }
      ]
    });

    if (user) {
      // Update googleId link if empty
      if (!user.googleId) {
        user.googleId = sub;
      }
      user.lastLogin = new Date();
      // If user profile picture is default initial placeholder, update to google avatar
      if (picture && (!user.avatar || user.avatar.includes("dicebear.com"))) {
        user.avatar = picture;
      }
      await user.save();
    } else {
      // Register a new customer
      const randomPassword = crypto.randomBytes(16).toString("hex");
      user = await User.create({
        name: name || "Google User",
        email: email.toLowerCase(),
        password: randomPassword,
        googleId: sub,
        avatar: picture || undefined,
        verified: true
      });

      // Create associated Cart & Wishlist for the user
      await Cart.create({ user: user._id, items: [] });
      await Wishlist.create({ user: user._id, products: [] });
    }

    // 5. Generate and return JWT session tokens
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
