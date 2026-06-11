import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import AuditLog from "../models/AuditLog.js";
import { ErrorResponse } from "../middleware/errorHandler.js";

// @desc    Subscribe to newsletter (Customer)
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      return next(new ErrorResponse("Please provide email", 400));
    }

    let subscriber = await NewsletterSubscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.status === "subscribed") {
        return res.status(200).json({
          success: true,
          message: "You are already subscribed to our newsletter",
        });
      } else {
        // Re-subscribe
        subscriber.status = "subscribed";
        subscriber.subscribedAt = new Date();
        subscriber.unsubscribedAt = undefined;
        await subscriber.save();
      }
    } else {
      subscriber = await NewsletterSubscriber.create({ email });
    }

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to Aarions Newsletter",
      subscriber,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsubscribe from newsletter (Customer)
// @route   POST /api/newsletter/unsubscribe
// @access  Public
export const unsubscribeNewsletter = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      return next(new ErrorResponse("Please provide email", 400));
    }

    const subscriber = await NewsletterSubscriber.findOne({ email });

    if (!subscriber || subscriber.status === "unsubscribed") {
      return res.status(200).json({
        success: true,
        message: "Email is not subscribed",
      });
    }

    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscribers (Admin)
// @route   GET /api/admin/newsletter
// @access  Private/Admin
export const getAdminSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort("-createdAt");
    res.status(200).json({
      success: true,
      subscribers,
    });
  } catch (error) {
    next(error);
  }
};
