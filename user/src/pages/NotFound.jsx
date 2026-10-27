import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Home, ShoppingBag, ArrowRight } from "lucide-react";

export default function NotFound() {
  const popularCategories = [
    { label: "Raw Honey", to: "/shop?category=honey" },
    { label: "A2 Desi Ghee", to: "/shop?category=ghee" },
    { label: "Traditional Masalas", to: "/shop?category=masala" },
    { label: "Organic Spices", to: "/shop?category=spices" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[75vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream/40"
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/25 text-brand-gold text-xs font-semibold uppercase tracking-widest">
          <Compass className="w-3.5 h-3.5" />
          <span>Error 404 • Page Not Found</span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-brand-brown tracking-tight">
            Lost Your Way?
          </h1>
          <p className="text-brand-brown/70 text-base sm:text-lg max-w-lg mx-auto font-light leading-relaxed">
            The page you are looking for may have been moved, renamed, or is temporarily unavailable. Let us help you find pure organic goodness.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-brown text-white font-medium hover:bg-brand-red transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Home className="w-4 h-4 text-brand-gold" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-brown/20 bg-white/80 text-brand-brown font-medium hover:border-brand-gold hover:text-brand-gold transition-all duration-300 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Popular Categories */}
        <div className="pt-8 border-t border-brand-gold/15">
          <p className="text-xs uppercase tracking-wider font-semibold text-brand-brown/50 mb-4">
            Popular Collections
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {popularCategories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                className="px-4 py-2 rounded-full bg-white border border-brand-gold/20 text-brand-brown text-xs font-medium hover:border-brand-gold hover:bg-brand-gold/10 transition-colors shadow-2xs"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

