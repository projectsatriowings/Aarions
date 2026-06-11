import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

let isConfigured = false;

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== "your_cloudinary_cloud_name" &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== "123456789"
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  isConfigured = true;
} else {
  console.warn("Cloudinary credentials missing or default. Media upload will fall back to local directory.");
}

export { cloudinary, isConfigured };
