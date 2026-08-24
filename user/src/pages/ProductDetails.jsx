import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ShieldCheck, Check, ShoppingBag, ArrowLeft } from "lucide-react";
import { products as staticProducts } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/common/ProductCard";
import api, { getImageUrl } from "../services/api";
import Loader from "../components/common/Loader";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("story");
  const [added, setAdded] = useState(false);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (product && product._id) {
      const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
          const res = await api.get(`/reviews/product/${product._id}`);
          if (res.data.success) {
            setReviews(res.data.reviews || []);
          }
        } catch (err) {
          console.error("Failed to fetch reviews", err);
        } finally {
          setLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [product, reviewMessage]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewError("Please write a comment.");
      return;
    }
    setSubmittingReview(true);
    setReviewError("");
    setReviewMessage("");
    try {
      const res = await api.post("/reviews", {
        productId: product._id,
        rating: userRating,
        comment,
      });
      if (res.data.success) {
        setReviewMessage("Your review has been submitted and is pending administrative moderation.");
        setComment("");
        setUserRating(5);
      }
    } catch (err) {
      setReviewError(err.response?.data?.error || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Fetch Product Details from API
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.related || []);
        }
      } catch (err) {
        console.error("Failed to load product details from API, falling back to static.", err);
        // Static fallback
        const found = staticProducts.find((p) => p.id === id || p.slug === id);
        setProduct(found || null);
        if (found) {
          const related = staticProducts
            .filter((p) => p.category === found.category && p.id !== found.id)
            .slice(0, 3);
          setRelatedProducts(related);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  // Scroll to top on mount or product id change
  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setActiveTab("story");
  }, [id]);

  if (loading) {
    return <Loader fullPage />;
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-48 pb-24 flex items-center justify-center bg-brand-cream/30 text-center">
        <div className="max-w-md p-8 bg-white border border-brand-gold/10 rounded-2xl shadow-sm space-y-4">
          <h2 className="font-playfair text-2xl font-bold text-brand-brown">Product Not Found</h2>
          <p className="text-xs text-brand-brown/60">
            The organic product you are looking for does not exist in our registry.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 btn-gradient text-xs tracking-widest uppercase font-semibold py-3.5 px-6 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  const isFav = isInWishlist(product._id || product.id);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 pb-24 bg-transparent"
    >
      <div className="site-container">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-brand-brown/50">
          <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand-gold transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-brand-brown">{product.name}</span>
        </div>

        {/* Product Visual & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start p-6 sm:p-8 lg:p-12 premium-card">
          
          {/* Left Column: Product Image Showcase */}
          <div className="lg:col-span-6 relative aspect-square rounded-2xl overflow-hidden bg-brand-cream/10 border border-brand-gold/5 group">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 cursor-zoom-in"
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 bg-brand-brown text-brand-gold text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full">
                Best Seller
              </span>
            )}
          </div>

          {/* Right Column: Detailed Product Purchase Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs tracking-widest uppercase font-bold text-brand-gold">
                {product.categoryLabel}
              </span>
              <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-brand-brown leading-tight mt-2">
                {product.name}
              </h1>

              {/* Stars & Reviews */}
              <div className="flex items-center space-x-2.5 mt-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-current"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-brand-brown/60 font-semibold">
                  {product.rating} ({product.reviewsCount} customer reviews)
                </span>
              </div>
            </div>

            {/* Price display */}
            <div className="flex items-baseline space-x-3 pt-2">
              <span className="text-3xl font-bold text-brand-brown">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-brand-brown/40 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-brand-brown/75 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Checklist Highlights */}
            {product.features && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 py-4 border-y border-brand-gold/10">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-xs text-brand-brown/85 font-medium">
                    <Check className="w-4 h-4 text-brand-gold mr-2.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Purchase action block */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              
              {/* Quantity selector */}
              <div className="flex items-center border border-brand-gold/20 bg-brand-cream/10 rounded-lg p-1.5 justify-between sm:justify-start">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-brand-brown/60 hover:text-brand-brown text-lg font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-semibold text-brand-brown">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-brand-brown/60 hover:text-brand-brown text-lg font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className={`flex-grow flex items-center justify-center space-x-2 py-4 px-8 rounded-lg text-xs tracking-widest uppercase font-semibold transition-all duration-300 shadow-md ${
                  added
                    ? "bg-green-600 text-white"
                    : "btn-gradient"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 animate-ping-once" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart - ₹{product.price * quantity}</span>
                  </>
                )}
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-lg border transition-all duration-300 flex items-center justify-center ${
                  isFav
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-brand-gold/20 hover:border-brand-gold/60 text-brand-brown"
                }`}
                aria-label="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Quick delivery badge */}
            <div className="flex items-center space-x-2 pt-2 text-[10px] text-brand-brown/50 tracking-wider uppercase font-semibold">
              <ShieldCheck className="w-4 h-4 text-brand-gold" />
              <span>Ships next business day • Chennai Store Sourced</span>
            </div>
          </div>
        </div>

        {/* Tab specifications section (Details, Churning method, nutrients) */}
        <div className="mt-16 p-6 sm:p-10 max-w-5xl 2xl:max-w-6xl mx-auto premium-card">
          {/* Tab buttons */}
          <div className="flex border-b border-brand-gold/10 pb-4 overflow-x-auto no-scrollbar gap-6">
            {[
              { id: "story", label: "Product Story" },
              { id: "method", label: "Purity & Processing" },
              { id: "usage", label: "Usage & Benefits" },
              { id: "nutrients", label: "Nutritional Value" },
              { id: "reviews", label: "Customer Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm tracking-widest uppercase font-semibold whitespace-nowrap pb-2.5 transition-colors relative ${
                  activeTab === tab.id
                    ? "text-brand-brown"
                    : "text-brand-brown/40 hover:text-brand-gold"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-gold"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="pt-8 min-h-[150px]">
            <AnimatePresence mode="wait">
              {activeTab === "story" && (
                <motion.div
                  key="story"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 text-sm text-brand-brown/70 leading-relaxed font-light"
                >
                  <p>
                    {product.details || (
                      <span className="italic text-brand-brown/40">No product story added yet.</span>
                    )}
                  </p>
                </motion.div>
              )}

              {activeTab === "method" && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="font-playfair text-lg font-semibold text-brand-brown">
                    Pure Craftsmanship
                  </h3>
                  <p className="text-sm text-brand-brown/70 leading-relaxed font-light">
                    {product.usage || "Every batch follows strict quality standards to maintain live enzymes and preserve natural goodness."}
                  </p>
                  {product.ingredients && (
                    <div className="flex flex-wrap gap-4 pt-2">
                      {product.ingredients.split(",").map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] uppercase font-bold tracking-widest bg-brand-cream border border-brand-gold/10 text-brand-brown px-3 py-1.5 rounded"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "usage" && (
                <motion.div
                  key="usage"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold">Suggested Usage</h4>
                    <p className="text-sm text-brand-brown/70 leading-relaxed font-light">
                      {product.usage || (
                        <span className="italic text-brand-brown/40">No usage instructions added yet.</span>
                      )}
                    </p>
                  </div>
                  {product.benefits && product.benefits.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold">Health Advantages</h4>
                      <ul className="space-y-2">
                        {product.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-xs text-brand-brown/85 font-medium">
                            <Check className="w-3.5 h-3.5 text-brand-gold mr-2.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="italic text-xs text-brand-brown/40">No health benefits listed yet.</p>
                  )}
                </motion.div>
              )}

              {activeTab === "nutrients" && (
                <motion.div
                  key="nutrients"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-md"
                >
                  <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold mb-4">
                    Typical Nutritional Information (Per 100g)
                  </h4>
                  {product.nutrients && Object.keys(product.nutrients).length > 0 ? (
                    <div className="border border-brand-gold/10 rounded-xl overflow-hidden divide-y divide-brand-gold/10 bg-brand-cream/5">
                      {Object.entries(product.nutrients).map(([nutrient, value]) => (
                        <div key={nutrient} className="flex justify-between px-4 py-3 text-xs">
                          <span className="font-semibold text-brand-brown/60">{nutrient}</span>
                          <span className="font-bold text-brand-brown">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="italic text-xs text-brand-brown/40">No nutritional information added yet.</p>
                  )}
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Reviews List */}
                    <div className="md:col-span-7 space-y-6">
                      <h3 className="font-playfair text-lg font-semibold text-brand-brown">
                        Customer Reviews ({reviews.length})
                      </h3>
                      {loadingReviews ? (
                        <div className="flex justify-center py-6">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-gold" />
                        </div>
                      ) : reviews.length === 0 ? (
                        <p className="text-xs text-brand-brown/50 font-light italic">
                          No approved reviews for this product yet. Be the first to review!
                        </p>
                      ) : (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                          {reviews.map((rev) => (
                            <div key={rev._id} className="border-b border-brand-gold/10 pb-4 last:border-b-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-[10px] font-bold text-brand-brown">
                                    {rev.user?.name ? rev.user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-semibold text-brand-brown">{rev.user?.name || "Anonymous User"}</h5>
                                    <p className="text-[9px] text-brand-brown/40">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex text-amber-400">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${i < rev.rating ? "fill-current" : "text-gray-200"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-brand-brown/70 mt-2 font-light leading-relaxed">
                                {rev.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Write Review Form */}
                    <div className="md:col-span-5 bg-brand-cream/5 border border-brand-gold/10 p-5 rounded-2xl space-y-4">
                      <h3 className="font-playfair text-lg font-semibold text-brand-brown">
                        Write a Review
                      </h3>
                      {user ? (
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase font-bold tracking-wider text-brand-brown/60 mb-2">
                              Your Rating
                            </label>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setUserRating(star)}
                                  className="text-amber-400 hover:scale-110 transition-transform"
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      star <= userRating ? "fill-current" : "text-gray-200"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold tracking-wider text-brand-brown/60 mb-2">
                              Your Review
                            </label>
                            <textarea
                              rows="4"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Write details about your experience with this organic product..."
                              className="w-full text-xs p-3 border border-brand-gold/20 rounded-xl outline-none focus:border-brand-brown bg-white placeholder-brand-brown/30 text-brand-brown font-light"
                            ></textarea>
                          </div>

                          {reviewError && (
                            <p className="text-xs text-red-500 font-semibold">{reviewError}</p>
                          )}

                          {reviewMessage && (
                            <p className="text-xs text-green-600 font-medium">{reviewMessage}</p>
                          )}

                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="w-full btn-gradient text-[10px] tracking-widest uppercase font-semibold py-3.5 px-4 rounded-lg flex items-center justify-center"
                          >
                            {submittingReview ? "Submitting..." : "Submit Review"}
                          </button>
                        </form>
                      ) : (
                        <div className="text-center py-6 space-y-3">
                          <p className="text-xs text-brand-brown/60 font-light">
                            You must be logged in to review this product.
                          </p>
                          <Link
                            to="/login"
                            className="inline-block btn-gradient text-[10px] tracking-widest uppercase font-semibold py-2.5 px-6 rounded-lg"
                          >
                            Login Now
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-brand-gold/10 pt-16">
            <h2 className="font-playfair text-2xl font-bold text-brand-brown text-center mb-10">
              Related Organic Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mx-auto">
              {relatedProducts.map((p) => {
                const discountPercent = p.originalPrice
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 0;
                return (
                  <Link
                    key={p._id || p.id}
                    to={`/product/${p._id}`}
                    className="group flex flex-col space-y-3 cursor-pointer"
                  >
                    {/* Image Box */}
                    <div className="aspect-square w-full rounded-2xl overflow-hidden bg-brand-cream/10 border border-brand-gold/15 relative flex items-center justify-center">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Luxury Gold Hover Overlay */}
                      <div className="absolute inset-0 bg-brand-brown/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="text-[10px] tracking-widest uppercase font-bold text-brand-gold bg-brand-brown border border-brand-gold/30 px-4 py-2 rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-350">
                          View details
                        </span>
                      </div>

                      {discountPercent > 0 && (
                        <span className="absolute top-3 left-3 bg-brand-gold text-brand-brown text-[9px] font-extrabold px-2 py-1 rounded-md shadow-sm">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Meta Details */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold text-brand-gold/80">
                        <span>{p.categoryLabel || p.category}</span>
                      </div>
                      
                      <h3 className="font-playfair text-base font-bold text-brand-brown group-hover:text-brand-gold transition-colors duration-305">
                        {p.name}
                      </h3>

                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-sm font-extrabold text-brand-brown">₹{p.price}</span>
                        {p.originalPrice > p.price && (
                          <span className="text-xs line-through text-brand-brown/40 font-light">
                            ₹{p.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
