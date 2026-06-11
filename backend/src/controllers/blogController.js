import Blog from "../models/Blog.js";
import AuditLog from "../models/AuditLog.js";
import { ErrorResponse } from "../middleware/errorHandler.js";
import { uploadImage } from "../middleware/upload.js";

// @desc    Get all published blogs (Customer)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;

    const query = { isPublished: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const blogs = await Blog.find(query)
      .populate("author", "name avatar")
      .sort("-publishedAt")
      .skip(skip)
      .limit(Number(limit));

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog details
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogDetails = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true }).populate(
      "author",
      "name avatar"
    );

    if (!blog) {
      return next(new ErrorResponse("Blog post not found", 404));
    }

    // Get related blogs (same category, excluding this one)
    const related = await Blog.find({
      category: blog.category,
      _id: { $ne: blog._id },
      isPublished: true,
    })
      .select("title slug image publishedAt summary")
      .limit(3);

    res.status(200).json({
      success: true,
      blog,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blogs (Admin panel - includes draft)
// @route   GET /api/admin/blogs
// @access  Private/Admin
export const getAdminBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate("author", "name email").sort("-createdAt");

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog post (Admin)
// @route   POST /api/admin/blogs
// @access  Private/Admin
export const createBlog = async (req, res, next) => {
  try {
    const blogData = { ...req.body };
    blogData.author = req.admin._id;

    if (!blogData.slug && blogData.title) {
      blogData.slug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    if (req.file) {
      blogData.image = await uploadImage(req.file);
    }

    const blog = await Blog.create(blogData);

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "create_blog",
      targetModel: "Blog",
      targetId: blog._id,
      details: `Created blog post "${blog.title}"`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post (Admin)
// @route   PUT /api/admin/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(new ErrorResponse("Blog post not found", 404));
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = await uploadImage(req.file);
    }

    if (updateData.title) {
      updateData.slug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "update_blog",
      targetModel: "Blog",
      targetId: blog._id,
      details: `Updated blog post "${blog.title}"`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post (Admin)
// @route   DELETE /api/admin/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(new ErrorResponse("Blog post not found", 404));
    }

    await Blog.findByIdAndDelete(req.params.id);

    // Audit Log
    await AuditLog.create({
      adminUser: req.admin._id,
      action: "delete_blog",
      targetModel: "Blog",
      targetId: blog._id,
      details: `Deleted blog post "${blog.title}"`,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      success: true,
      message: "Blog post removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
