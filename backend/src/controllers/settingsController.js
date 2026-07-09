import WebsiteSettings from "../models/WebsiteSettings.js";
import AuditLog from "../models/AuditLog.js";
import { ErrorResponse } from "../middleware/errorHandler.js";
import { uploadImage } from "../middleware/upload.js";

// @desc    Get website settings (Public)
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSettings.findOne();

    if (!settings) {
      settings = await WebsiteSettings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website settings (Admin)
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSettings.findOne();

    if (!settings) {
      settings = await WebsiteSettings.create({});
    }

    const updateData = { ...req.body };

    // Parse sub-objects if sent as JSON strings via form-data
    if (typeof updateData.socialLinks === "string") updateData.socialLinks = JSON.parse(updateData.socialLinks);
    if (typeof updateData.themeSettings === "string") updateData.themeSettings = JSON.parse(updateData.themeSettings);

    if (req.file) {
      updateData.logo = await uploadImage(req.file);
    }

    settings = await WebsiteSettings.findByIdAndUpdate(settings._id, updateData, {
      new: true,
      runValidators: true,
    });

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "update_website_settings",
      targetModel: "WebsiteSettings",
      targetId: settings._id,
      details: "Updated general website and SEO settings",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload general image (Admin)
// @route   POST /api/admin/settings/upload
// @access  Private/Admin
export const uploadGeneralImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse("Please upload a file", 400));
    }
    const imageUrl = await uploadImage(req.file);
    res.status(200).json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    next(error);
  }
};
