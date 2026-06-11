import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import customerRoutes from "./src/routes/customerRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ---------------- SECURITY MIDDLEWARE ----------------
// Helmet
app.use(helmet({
  crossOriginResourcePolicy: false, // allows serving local static uploads
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  process.env.ADMIN_URL || "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5176",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS policy"));
      }
    },
    credentials: true,
  })
);

// Sanitize MongoDB inputs against injection
app.use(mongoSanitize());

// Prevents cross-site scripting (XSS)
app.use(xss());

// IP Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 200, // limit each IP to 200 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", limiter);

// ---------------- STATIC UPLOADS DIRECTORY ----------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/spices", express.static(path.join(__dirname, "../user/public/spices")));

// ---------------- ROUTE MOUNTING ----------------
app.use("/api", customerRoutes);
app.use("/api/admin", adminRoutes);

// ---------------- 404 CATCHER ----------------
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Resource route not found",
  });
});

// ---------------- GLOBAL ERROR HANDLER ----------------
app.use(errorHandler);

export default app;
