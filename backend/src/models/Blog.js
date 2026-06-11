import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    summary: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Featured image is required"],
    },
    category: {
      type: String,
      required: [true, "Blog category is required"],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    readingTime: {
      type: String, // e.g. "5 mins read"
    },
  },
  {
    timestamps: true,
  }
);

// Calculate reading time before saving
blogSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const wordsPerMinute = 200;
    const words = this.content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    this.readingTime = `${minutes} min read`;
  }
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
