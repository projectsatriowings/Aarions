import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating between 1 and 5 is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Review comment cannot be empty"],
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index so a user can only write one review per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Post hook to update Product's average rating & review counts on save
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: "$product",
        reviewsCount: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model("Product").findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].averageRating * 10) / 10,
        reviewsCount: stats[0].reviewsCount,
      });
    } else {
      await mongoose.model("Product").findByIdAndUpdate(productId, {
        rating: 0,
        reviewsCount: 0,
      });
    }
  } catch (error) {
    console.error("Error updating average rating:", error);
  }
};

reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post("remove", function () {
  this.constructor.calculateAverageRating(this.product);
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
