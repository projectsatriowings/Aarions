import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/common/ProductCard";
import QuickViewModal from "../components/common/QuickViewModal";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 pb-24 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-brand-brown">
              Your Wishlist
            </h1>
            <div className="h-[1px] w-12 bg-brand-gold mt-4" />
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-brand-brown hover:text-brand-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-brand-gold" />
            <span>Back to Shop</span>
          </Link>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <motion.div
                key={product.id || product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard
                  product={product}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="p-12 sm:p-20 text-center max-w-md mx-auto space-y-6 premium-card">
            <div className="p-5 bg-brand-gold/10 rounded-full w-fit mx-auto text-brand-gold">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="font-playfair text-2xl sm:text-3xl font-semibold text-brand-brown">Your Wishlist is Empty</h2>
            <p className="text-xs sm:text-sm text-brand-brown/60 leading-relaxed font-light">
              Save your favorite items here to review later. Browse our collection of pure honey, ghee, and masalas to get started.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="btn-gradient text-xs tracking-widest uppercase font-semibold py-4 px-8 rounded-xl inline-block"
              >
                Explore Products
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Quick View Modal Overlay */}
      {selectedProduct && (
        <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </motion.div>
  );
}
