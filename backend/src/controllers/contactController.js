import ContactQuery from "../models/ContactQuery.js";
import AuditLog from "../models/AuditLog.js";
import { ErrorResponse } from "../middleware/errorHandler.js";

// @desc    Submit new contact query (Customer)
// @route   POST /api/contact
// @access  Public
export const submitQuery = async (req, res, next) => {
  const { name, email, phone, message } = req.body;

  try {
    if (!name || !email || !message) {
      return next(new ErrorResponse("Please fill all required fields", 400));
    }

    const query = await ContactQuery.create({
      name,
      email,
      phone,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Query submitted successfully. We will contact you soon.",
      query,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact queries (Admin)
// @route   GET /api/admin/contact
// @access  Private/Admin
export const getAdminQueries = async (req, res, next) => {
  try {
    const queries = await ContactQuery.find().sort("-createdAt");

    res.status(200).json({
      success: true,
      queries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve or update query status (Admin)
// @route   PUT /api/admin/contact/:id
// @access  Private/Admin
export const updateQuery = async (req, res, next) => {
  const { status, notes } = req.body;

  try {
    let query = await ContactQuery.findById(req.params.id);
    if (!query) {
      return next(new ErrorResponse("Query not found", 404));
    }

    const updateFields = {};
    if (status) {
      updateFields.status = status;
      if (status === "resolved") {
        updateFields.resolvedBy = req.admin._id;
        updateFields.resolvedAt = new Date();
      }
    }
    if (notes !== undefined) {
      updateFields.notes = notes;
    }

    query = await ContactQuery.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "update_contact_query",
      targetModel: "ContactQuery",
      targetId: query._id,
      details: `Updated query status to: "${query.status}". Notes: ${query.notes || "None"}`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      query,
    });
  } catch (error) {
    next(error);
  }
};
