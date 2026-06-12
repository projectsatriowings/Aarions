import Product from "../models/Product.js";
import Category from "../models/Category.js";
import AuditLog from "../models/AuditLog.js";
import { ErrorResponse } from "../middleware/errorHandler.js";
import { uploadImage } from "../middleware/upload.js";

// @desc    Get all products (with filters, search, sorting)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, rating, inStock, search, sort, page = 1, limit = 12 } = req.query;

    const query = { status: "active" };

    // Apply filters
    if (category && category !== "all") {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (inStock === "true") {
      query.inStock = true;
    }

    // Search query (pattern match)
    if (search) {
      const searchWords = search.trim().split(/\s+/).filter(Boolean);
      if (searchWords.length > 0) {
        query.$and = searchWords.map((word) => ({
          $or: [
            { name: { $regex: word, $options: "i" } },
            { description: { $regex: word, $options: "i" } },
            { categoryLabel: { $regex: word, $options: "i" } },
            { ingredients: { $regex: word, $options: "i" } },
          ],
        }));
      }
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sorting
    let sortObj = {};
    if (sort === "price-low") {
      sortObj.price = 1;
    } else if (sort === "price-high") {
      sortObj.price = -1;
    } else if (sort === "rating") {
      sortObj.rating = -1;
    } else {
      // Recommended: best sellers first, then rating
      sortObj.isBestSeller = -1;
      sortObj.rating = -1;
    }

    // Log query info
    import("fs").then((fs) => {
      const logMsg = `[LOG] req.query: ${JSON.stringify(req.query)} | constructed query: ${JSON.stringify(query)}\n`;
      fs.appendFileSync("logs/query_log.txt", logMsg);
    }).catch(err => console.error("Logger err:", err));

    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by id or slug
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    // Check if ID or Slug
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug);
    } else {
      product = await Product.findOne({ slug: idOrSlug });
    }

    if (!product) {
      return next(new ErrorResponse("Product not found", 404));
    }

    // Fetch related products
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: "active",
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search Autocomplete Suggestions
// @route   GET /api/products/search/suggestions
// @access  Public
export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({ success: true, suggestions: [] });
    }

    const suggestions = await Product.find({
      name: { $regex: q, $options: "i" },
      status: "active",
    })
      .select("name slug category image price")
      .limit(5);

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Create Product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    // Extract parameters
    const productData = { ...req.body };

    // Format Maps & Arrays from string input if sent as JSON strings via form-data
    if (typeof productData.features === "string") productData.features = JSON.parse(productData.features);
    if (typeof productData.benefits === "string") productData.benefits = JSON.parse(productData.benefits);
    if (typeof productData.variants === "string") productData.variants = JSON.parse(productData.variants);
    if (typeof productData.variantPrices === "string") productData.variantPrices = JSON.parse(productData.variantPrices);
    if (typeof productData.nutrients === "string") productData.nutrients = JSON.parse(productData.nutrients);

    // Auto-generate slug from name if not provided
    if (!productData.slug && productData.name) {
      productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    // Set categoryRef if category slug is provided
    if (productData.category) {
      const categoryObj = await Category.findOne({ slug: productData.category });
      if (categoryObj) {
        productData.categoryRef = categoryObj._id;
      } else {
        productData.categoryRef = null;
      }
    }

    // Handle Uploaded Files
    if (req.files && req.files.image) {
      productData.image = await uploadImage(req.files.image[0]);
    }
    if (req.files && req.files.images) {
      const extraImages = [];
      for (const img of req.files.images) {
        const url = await uploadImage(img);
        extraImages.push(url);
      }
      productData.images = extraImages;
    }

    const product = await Product.create(productData);

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "create_product",
      targetModel: "Product",
      targetId: product._id,
      details: `Created product "${product.name}" with SKU: ${product.sku}`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Update Product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse("Product not found", 404));
    }

    const updateData = { ...req.body };

    // Format Maps & Arrays from string input if sent as JSON strings via form-data
    if (typeof updateData.features === "string") updateData.features = JSON.parse(updateData.features);
    if (typeof updateData.benefits === "string") updateData.benefits = JSON.parse(updateData.benefits);
    if (typeof updateData.variants === "string") updateData.variants = JSON.parse(updateData.variants);
    if (typeof updateData.variantPrices === "string") updateData.variantPrices = JSON.parse(updateData.variantPrices);
    if (typeof updateData.nutrients === "string") updateData.nutrients = JSON.parse(updateData.nutrients);

    // Set categoryRef if category slug is provided
    if (updateData.category) {
      const categoryObj = await Category.findOne({ slug: updateData.category });
      if (categoryObj) {
        updateData.categoryRef = categoryObj._id;
      } else {
        updateData.categoryRef = null;
      }
    } else if (updateData.category === "") {
      updateData.categoryRef = null;
    }

    // Handle Uploaded Files
    if (req.files && req.files.image) {
      updateData.image = await uploadImage(req.files.image[0]);
    }
    if (req.files && req.files.images) {
      const extraImages = [];
      for (const img of req.files.images) {
        const url = await uploadImage(img);
        extraImages.push(url);
      }
      updateData.images = extraImages;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "update_product",
      targetModel: "Product",
      targetId: product._id,
      details: `Updated product "${product.name}"`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Delete Product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse("Product not found", 404));
    }

    await Product.findByIdAndDelete(req.params.id);

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "delete_product",
      targetModel: "Product",
      targetId: product._id,
      details: `Deleted product "${product.name}" with SKU: ${product.sku}`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      message: `Product "${product.name}" removed successfully`,
    });
  } catch (error) {
    next(error);
  }
};
