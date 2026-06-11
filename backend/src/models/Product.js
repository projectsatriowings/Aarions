import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String, // Stored as category slug for easy frontend query matching
      required: [true, "Category slug is required"],
    },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    categoryLabel: {
      type: String,
      required: [true, "Category label is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      trim: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    details: {
      type: String,
    },
    features: {
      type: [String],
      default: [],
    },
    usage: {
      type: String,
    },
    benefits: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: String,
    },
    weight: {
      type: String, // e.g. "250 ml", "100g"
      required: [true, "Default weight is required"],
    },
    image: {
      type: String,
      required: [true, "Main image is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    variants: {
      type: [String], // e.g. ["250 ml", "500 ml", "1 litre"]
      default: [],
    },
    variantPrices: {
      type: Map,
      of: Number, // e.g. {"250 ml": 300, "500 ml": 600, "1 litre": 1200}
      default: {},
    },
    nutrients: {
      type: Map,
      of: String, // e.g. {"Energy": "897 kcal", "Total Fat": "99.7g"}
      default: {},
    },
    inventory: {
      type: Number,
      required: [true, "Inventory is required"],
      default: 100,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "active",
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

// Index for search queries
productSchema.index({ name: "text", description: "text", categoryLabel: "text", ingredients: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
