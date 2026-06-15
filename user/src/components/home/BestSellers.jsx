import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Star, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { products as staticProducts } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import api, { getImageUrl } from "../../services/api";
import Loader from "../common/Loader";

export default function BestSellers({ onQuickView }) {
  const carouselRef = useRef(null);
  const sectionRef = useRef(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await api.get("/products?limit=50");
        if (res.data.success) {
          const bs = res.data.products.filter((p) =>
            p.isBestSeller || ["Best Seller", "Wild Harvested", "Luxury", "Rare"].includes(p.badge)
          );
          setBestSellers(bs);
        }
      } catch (err) {
        console.error("Failed to load best sellers from API, falling back to static.", err);
        const bs = staticProducts.filter((p) =>
          ["Best Seller", "Wild Harvested", "Luxury", "Rare"].includes(p.badge)
        );
        setBestSellers(bs);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  useEffect(() => {
    if (loading || bestSellers.length <= 1 || isHovered || !isIntersecting) return;

    const interval = setInterval(() => {
      const container = carouselRef.current;
      if (container) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 320, behavior: "smooth" });
        }
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [loading, bestSellers, isHovered, isIntersecting]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [loading]);

  const handleScroll = (direction) => {
    const container = carouselRef.current;
    if (container) {
      const scrollAmount = direction * 320;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 60, damping: 13 }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="bs-section py-16 md:py-20 bg-gradient-to-b from-[#FFF8EC] to-[#FFFDF9] relative overflow-hidden"
    >
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-brand-cream/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6 mb-14">
          <motion.div 
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-3 text-left"
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-brand-gold">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>Most Popular</span>
            </div>
            <h2 className="font-display font-extrabold text-brand-brown text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-none">
              Best Sellers
            </h2>
            <p className="text-brand-brown/60 text-sm sm:text-base font-light tracking-wide max-w-md">
              Loved by thousands of natural living enthusiasts
            </p>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 flex-shrink-0 self-start sm:self-auto">
            <div className="bs-arrows flex gap-2">
              <button
                className="bs-arrow w-11 h-11 rounded-full bg-white border border-brand-gold/20 hover:border-brand-gold hover:bg-brand-gold hover:text-white text-brand-brown flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                onClick={() => handleScroll(-1)}
                aria-label="Previous Slide"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="bs-arrow w-11 h-11 rounded-full bg-white border border-brand-gold/20 hover:border-brand-gold hover:bg-brand-gold hover:text-white text-brand-brown flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                onClick={() => handleScroll(1)}
                aria-label="Next Slide"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <Link
              to="/shop"
              className="group hidden sm:inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-brown hover:text-brand-gold transition-all duration-300 border border-brand-gold/35 hover:border-brand-gold rounded-full px-6 py-2.5 bg-white shadow-sm hover:shadow"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Carousel Area */}
        {loading ? (
          <Loader />
        ) : (
          <motion.div
            ref={carouselRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="bs-carousel pb-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {bestSellers.map((product) => {
              const isFav = isInWishlist(product._id || product.id);
              const discountPercent = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              );

              return (
                <motion.div
                  key={product._id || product.id}
                  variants={cardVariants}
                  className="bs-card-wrap flex-shrink-0"
                >
                  {/* Luxury Editorial Product Card */}
                  <div className="group bg-white border border-brand-gold/12 hover:border-brand-gold/30 rounded-[2.5rem] overflow-hidden flex flex-col h-full relative cursor-default shadow-[0_12px_36px_rgba(45,31,23,0.06)] hover:shadow-[0_24px_48px_rgba(45,31,23,0.12),0_8px_16px_rgba(232,163,23,0.04)] hover:-translate-y-2.5 transition-all duration-500 p-3.5">
                    
                    {/* Image Frame with double border style nested inside the card */}
                    <div className="relative aspect-square overflow-hidden rounded-[2.1rem] bg-brand-cream/5 border border-brand-gold/5 p-1.5 transition-all duration-500">
                      
                      {/* Bestseller Badge */}
                      {product.isBestSeller && (
                        <div className="absolute top-4 left-4 z-10 pointer-events-none">
                          <span className="bg-[#2D1F17] text-[#E8A317] text-[8px] tracking-[0.2em] uppercase font-bold px-3 py-1 rounded-full shadow-md">
                            Best Seller
                          </span>
                        </div>
                      )}

                      {/* Fallback badges */}
                      {!product.isBestSeller && product.badge && (
                        <div className="absolute top-4 left-4 z-10 pointer-events-none">
                          <span className="bg-brand-gold text-[#2D1F17] text-[8px] tracking-[0.2em] uppercase font-bold px-3 py-1 rounded-full shadow-md">
                            {product.badge}
                          </span>
                        </div>
                      )}
 
                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-brand-gold/10 text-brand-brown hover:text-red-500 hover:bg-white transition-all duration-300 shadow-sm"
                        aria-label="Add to Wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors duration-300 ${
                            isFav ? "fill-red-500 text-red-500" : "text-brand-brown/70"
                          }`}
                        />
                      </button>

                      {/* Image container */}
                      <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-brand-cream/10">
                        <Link to={`/product/${product._id || product.id}`}>
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                          />
                        </Link>
                      </div>

                      {/* Luxury Action Overlay (Center icons with backdrop blur) */}
                      <div className="absolute inset-0 bg-[#2D1F17]/15 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-450 flex items-center justify-center space-x-3 rounded-[1.8rem] z-20">
                        <button
                          onClick={() => onQuickView(product)}
                          className="p-3 bg-white hover:bg-brand-gold text-brand-brown hover:text-brand-brown rounded-full shadow-md transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 cursor-pointer"
                          title="Quick View"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="p-3 bg-white hover:bg-brand-gold text-brand-brown hover:text-brand-brown rounded-full shadow-md transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75 cursor-pointer"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Editorial Details Container */}
                    <div className="mt-5 px-3 pb-2 flex flex-col flex-grow text-left">
                      {/* Category Label */}
                      <span className="text-[9px] tracking-[0.22em] uppercase font-bold text-brand-gold/90 mb-1">
                        {product.categoryLabel || "Pure & Organic"}
                      </span>

                      {/* Title */}
                      <Link
                        to={`/product/${product._id || product.id}`}
                        className="font-bold text-base text-brand-brown hover:text-brand-gold transition-colors duration-300 line-clamp-1 leading-tight"
                      >
                        {product.name}
                      </Link>

                      {/* Rating block */}
                      <div className="flex items-center space-x-1.5 mt-2.5">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(product.rating || 5)
                                  ? "fill-current"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-brand-brown/40 font-semibold mt-0.5">
                          ({product.reviewsCount || 0})
                        </span>
                      </div>

                      {/* Divider line */}
                      <div className="w-full h-px bg-brand-gold/5 mt-4 mb-3" />

                      {/* Price & Add to Cart Section */}
                      <div className="flex items-center justify-between mt-auto pt-1">
                        <div className="flex flex-col">
                          <span className="text-base font-extrabold text-brand-brown leading-none">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-xs text-brand-brown/30 line-through">
                                ₹{product.originalPrice}
                              </span>
                              {discountPercent > 0 && (
                                <span className="text-[9px] text-[#C8870F] font-bold bg-[#FFF8EC] border border-brand-gold/15 px-1.5 py-0.5 rounded-full">
                                  {discountPercent}% Off
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Premium Add Button */}
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="px-4.5 py-2 bg-brand-brown hover:bg-brand-gold text-white hover:text-brand-brown text-[10px] font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Mobile View All CTA */}
        <div className="text-center mt-8 sm:hidden reveal">
          <Link
            to="/shop"
            className="btn-primary w-full justify-center py-3.5"
          >
            <span>View All Best Sellers</span>
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
