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
    <div className="group relative rounded-[2rem] bg-gradient-to-br from-white via-white to-brand-cream/25 border border-brand-gold/10 hover:border-brand-gold/25 shadow-[0_8px_30px_rgba(45,31,23,0.02)] hover:shadow-[0_20px_45px_rgba(45,31,23,0.08)] transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full">
      
      {/* Double-border luxury inner frame */}
      <div className="absolute inset-2 rounded-[1.5rem] border border-brand-gold/5 pointer-events-none group-hover:border-brand-gold/15 transition-colors duration-500 z-0" />

      {/* Product Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col space-y-1.5 pointer-events-none">
        {product.isBestSeller && (
          <span className="bg-brand-red text-white text-[9px] tracking-[0.15em] uppercase font-bold px-3 py-1 rounded-full shadow-md z-20">
            Best Seller
          </span>
        )}
        {product.isNew && (
          <span className="bg-brand-gold text-brand-brown text-[9px] tracking-[0.15em] uppercase font-bold px-3 py-1 rounded-full shadow-md z-20">
            New
          </span>
        )}
      </div>

      {/* Wishlist Toggle Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-white/90 hover:bg-brand-gold text-brand-brown hover:text-brand-brown border border-brand-gold/10 shadow-md transition-all duration-300 cursor-pointer"
        aria-label="Add to Wishlist"
      >
        <Heart
          className={`w-4 h-4 transition-colors duration-300 ${
            isFav ? "fill-red-500 text-red-500" : "text-brand-brown/70"
          }`}
        />
      </button>

      {/* Image Container with Inset Margin and Hover Zoom */}
      <div className="relative aspect-square overflow-hidden bg-brand-cream/15 m-3 rounded-[1.5rem] border border-brand-gold/5 group-hover:border-brand-gold/15 transition-all duration-500">
        <Link to={`/product/${product._id || product.id}`} className="w-full h-full block">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        </Link>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-brand-brown/15 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-3 bg-white rounded-full text-brand-brown hover:bg-brand-gold hover:text-brand-brown transition-all duration-300 shadow-md transform translate-y-4 group-hover:translate-y-0 cursor-pointer"
            title="Quick View"
          >
            <Eye className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="p-3 bg-white rounded-full text-brand-brown hover:bg-brand-gold hover:text-brand-brown transition-all duration-300 shadow-md transform translate-y-4 group-hover:translate-y-0 delay-75 cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 pt-2 flex flex-col flex-grow relative z-10">
        {/* Category Tag */}
        <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-brand-gold">
          {product.categoryLabel}
        </span>

        {/* Title */}
        <Link
          to={`/product/${product._id || product.id}`}
          className="mt-1.5 font-display text-base font-bold text-brand-brown hover:text-brand-gold transition-colors duration-300 leading-snug line-clamp-2 min-h-[2.75rem]"
        >
          {product.name}
        </Link>

        {/* Rating Stars */}
        <div className="flex items-center space-x-1.5 mt-1.5">
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
          <span className="text-xs text-brand-brown/50 font-semibold font-mono">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Price & Purchase Section */}
        <div className="mt-4 pt-4 border-t border-brand-gold/10 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-lg font-display font-extrabold text-brand-brown">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-xs text-brand-brown/40 line-through font-medium">
                  ₹{product.originalPrice}
                </span>
                <span className="text-[9px] text-green-700 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-200/50">
                  {discountPercent}% OFF
                </span>
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="flex items-center space-x-1.5 btn-gradient px-4 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

    </div>
  );
}
