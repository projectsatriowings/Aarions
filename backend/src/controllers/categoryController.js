import Category from "../models/Category.js";
import Product from "../models/Product.js";
import AuditLog from "../models/AuditLog.js";
import { ErrorResponse } from "../middleware/errorHandler.js";
import { uploadImage } from "../middleware/upload.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true });
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({
          $or: [{ categoryRef: cat._id }, { category: cat.slug }],
          status: "active",
        });
        return {
          ...cat.toObject(),
          productCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Get all categories (including inactive)
// @route   GET /api/admin/categories
// @access  Private/Admin
export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({
          $or: [{ categoryRef: cat._id }, { category: cat.slug }],
        });
        return {
          ...cat.toObject(),
          productCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Check if exists
    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return next(new ErrorResponse("Category with similar name already exists", 400));
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image: imageUrl,
    });

    // Handle product associations if provided
    const { productIds } = req.body;
    if (productIds) {
      try {
        const ids = JSON.parse(productIds);
        if (Array.isArray(ids) && ids.length > 0) {
          await Product.updateMany(
            { _id: { $in: ids } },
            {
              category: slug,
              categoryLabel: name,
              categoryRef: category._id,
            }
          );
        }
      } catch (parseErr) {
        console.error("Failed to parse productIds in createCategory:", parseErr);
      }
    }

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "create_category",
      targetModel: "Category",
      targetId: category._id,
      details: `Created category "${category.name}"`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return next(new ErrorResponse("Category not found", 404));
    }

    const { name, description, isActive } = req.body;
    const updateData = {};

    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (req.file) {
      updateData.image = await uploadImage(req.file);
    }

    category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    // If name/slug updated, propagate the changes to all associated products
    if (updateData.name || updateData.slug) {
      await Product.updateMany(
        { categoryRef: category._id },
        {
          category: category.slug,
          categoryLabel: category.name,
        }
      );
    }

    // Handle product associations if provided
    const { productIds } = req.body;
    if (productIds) {
      try {
        const ids = JSON.parse(productIds);
        if (Array.isArray(ids)) {
          // Remove category reference from products that were previously in this category but are no longer selected.
          await Product.updateMany(
            { categoryRef: category._id, _id: { $nin: ids } },
            {
              category: "",
              categoryLabel: "",
              categoryRef: null,
            }
          );
          // Add category reference to all products in the selected list.
          if (ids.length > 0) {
            await Product.updateMany(
              { _id: { $in: ids } },
              {
                category: category.slug,
                categoryLabel: category.name,
                categoryRef: category._id,
              }
            );
          }
        }
      } catch (parseErr) {
        console.error("Failed to parse productIds in updateCategory:", parseErr);
      }
    }

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "update_category",
      targetModel: "Category",
      targetId: category._id,
      details: `Updated category "${category.name}"`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new ErrorResponse("Category not found", 404));
    }

    await Category.findByIdAndDelete(req.params.id);

    // Clear category references from associated products
    await Product.updateMany(
      { $or: [{ categoryRef: category._id }, { category: category.slug }] },
      {
        category: "",
        categoryLabel: "",
        categoryRef: null,
      }
    );

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "delete_category",
      targetModel: "Category",
      targetId: category._id,
      details: `Deleted category "${category.name}"`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
