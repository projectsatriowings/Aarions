import multer from "multer";
import path from "path";
import fs from "fs";
import { cloudinary, isConfigured as isCloudinaryConfigured } from "../config/cloudinary.js";

// Ensure uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Config (for local saves / temporary buffer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File validation filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, webp, gif)"), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

/**
 * Helper function to upload an image.
 * If Cloudinary is configured, it uploads to Cloudinary and deletes the local file.
 * Otherwise, it returns the relative URL of the local file.
 */
export const uploadImage = async (file) => {
  if (!file) return null;

  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "aarions",
      });
      // Delete temporary local file
      fs.unlinkSync(file.path);
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed, falling back to local file:", error.message);
      // Fallback: return local path if Cloudinary fails
      return `/uploads/${file.filename}`;
    }
  }

  // Fallback to local file path
  return `/uploads/${file.filename}`;
};
