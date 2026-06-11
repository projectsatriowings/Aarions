import React from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Star, ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getImageUrl } from "../../services/api";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFav = isInWishlist(product._id || product.id);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="group glass-card glass-card-hover glass-shimmer rounded-2xl overflow-hidden flex flex-col h-full relative">
      {/* Product Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1.5 pointer-events-none">
        {product.isBestSeller && (
          <span className="bg-brand-brown text-brand-gold text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Best Seller
          </span>
        )}
        {product.isNew && (
          <span className="bg-brand-gold text-brand-brown text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full shadow-sm">
            New
          </span>
        )}
      </div>

      {/* Wishlist Toggle Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-brand-gold/5 text-brand-brown hover:text-red-500 hover:bg-white transition-all duration-300 shadow-sm"
        aria-label="Add to Wishlist"
      >
        <Heart
          className={`w-4.5 h-4.5 transition-colors duration-300 ${
            isFav ? "fill-red-500 text-red-500" : "text-brand-brown/70"
          }`}
        />
      </button>

      {/* Image Container with Hover Effects */}
      <div className="relative aspect-square overflow-hidden bg-brand-cream/20">
        <Link to={`/product/${product._id || product.id}`}>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </Link>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-brand-brown/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <button
            onClick={() => onQuickView(product)}
            className="p-3 bg-white rounded-full text-brand-brown hover:bg-brand-gold hover:text-brand-brown transition-all duration-300 shadow-md transform translate-y-4 group-hover:translate-y-0"
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => addToCart(product, 1)}
            className="p-3 bg-white rounded-full text-brand-brown hover:bg-brand-gold hover:text-brand-brown transition-all duration-300 shadow-md transform translate-y-4 group-hover:translate-y-0 delay-75"
            title="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category */}
        <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-gold">
          {product.categoryLabel}
        </span>

        {/* Title */}
        <Link
          to={`/product/${product._id || product.id}`}
          className="mt-1.5 font-playfair text-lg font-semibold text-brand-brown hover:text-brand-gold transition-colors duration-300 leading-snug line-clamp-2 min-h-[3.5rem] flex items-start"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1.5 mt-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-current"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-brand-brown/50 font-medium">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Price & Purchase Section */}
        <div className="mt-4 pt-4 border-t border-brand-gold/5 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-brand-brown">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-brand-brown/40 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                  {discountPercent}% OFF
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="flex items-center space-x-1.5 bg-brand-brown hover:bg-brand-gold hover:text-brand-brown text-white px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm"
          >
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
