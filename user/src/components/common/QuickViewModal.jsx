import React, { useState } from "react";
import { X, Star, ShoppingBag, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../services/api";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-brand-brown/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 15 }}
        transition={{ type: "spring", damping: 26, stiffness: 220 }}
        className="relative bg-brand-cream border border-brand-gold/15 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-brand-brown rounded-full shadow-md transition-all duration-300"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Left */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-[500px] relative bg-brand-cream/30 overflow-hidden group">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 cursor-zoom-in"
          />
        </div>

        {/* Product Details Right */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs tracking-widest uppercase font-semibold text-brand-gold">
              {product.categoryLabel}
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-semibold text-brand-brown mt-2 leading-tight">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center space-x-2 mt-3">
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
              <span className="text-sm text-brand-brown/60 font-medium">
                {product.rating} ({product.reviewsCount} verified reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 mt-4">
              <span className="text-2xl font-bold text-brand-brown">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-brand-brown/40 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            <p className="text-sm text-brand-brown/70 leading-relaxed mt-4 font-light">
              {product.description}
            </p>

            {/* Bullet Highlights */}
            {product.features && (
              <ul className="mt-5 space-y-2">
                {product.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-center text-xs text-brand-brown/85 font-medium">
                    <Check className="w-3.5 h-3.5 text-brand-gold mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-6 border-t border-brand-gold/10 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-brand-gold/20 bg-white rounded-lg p-1.5 self-stretch sm:self-auto justify-between sm:justify-start">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-brand-brown/60 hover:text-brand-brown text-lg font-semibold"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-semibold text-brand-brown">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-brand-brown/60 hover:text-brand-brown text-lg font-semibold"
              >
                +
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddToCart}
              className={`flex-grow flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md w-full ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-brand-brown hover:bg-brand-gold hover:text-brand-brown text-white"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart - ₹{product.price * quantity}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
