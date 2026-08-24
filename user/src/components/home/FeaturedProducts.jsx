import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Star, 
  ShoppingBag, 
  Eye, 
  Heart, 
  Plus, 
  Minus, 
  Check
} from "lucide-react";
import { products as staticProducts } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import api from "../../services/api";
import Loader from "../common/Loader";
import { getImageUrl } from "../../services/api";

// Elegant Decorative Luxury SVG Leaf
const LuxuryLeaf = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10C58 28 66 38 78 50C88 60 92 72 88 84C84 94 72 98 60 92C52 88 48 88 40 92C28 98 16 94 12 84C8 72 12 60 22 50C34 38 42 28 50 10Z" />
    <path d="M50 22C52 40 55 58 50 78" stroke="#FFF8EC" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.25" />
  </svg>
);

// Floating Sparkles
const GoldenSparkle = ({ className, delay = 0 }) => (
  <motion.svg 
    animate={{ 
      scale: [0.8, 1.2, 0.8],
      opacity: [0.3, 0.8, 0.3],
      rotate: [0, 180, 360]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
  </motion.svg>
);

export default function FeaturedProducts({ onQuickView }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroProduct, setHeroProduct] = useState(null);
  const [heroQty, setHeroQty] = useState(1);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const resFeatured = await api.get("/products?isFeatured=true");
        const resAll = await api.get("/products?limit=12");

        let featuredList = [];
        if (resFeatured.data.success && resFeatured.data.products?.length > 0) {
          featuredList = resFeatured.data.products;
        }

        let allList = [];
        if (resAll.data.success && resAll.data.products?.length > 0) {
          allList = resAll.data.products;
        }

        if (featuredList.length > 0) {
          const bestseller = featuredList.find(p => p.isBestSeller) || featuredList[0];
          setHeroProduct(bestseller);

          const otherFeatured = featuredList.filter(p => p._id !== bestseller._id);
          const fillProducts = allList.filter(
            p => p._id !== bestseller._id && !otherFeatured.some(f => f._id === p._id)
          );

          setProducts([bestseller, ...otherFeatured, ...fillProducts]);
        } else {
          if (allList.length > 0) {
            setProducts(allList);
            const bestseller = allList.find(p => p.isBestSeller) || allList[0];
            setHeroProduct(bestseller);
          } else {
            fallbackToStatic();
          }
        }
      } catch (err) {
        console.error("Failed to load featured products from API, falling back to static.", err);
        fallbackToStatic();
      } finally {
        setLoading(false);
      }
    };

    const fallbackToStatic = () => {
      const sliced = staticProducts.slice(0, 9);
      setProducts(sliced);
      const bestseller = sliced.find(p => p.isBestSeller) || sliced[0];
      setHeroProduct(bestseller);
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-transparent flex items-center justify-center min-h-[400px]">
        <Loader />
      </section>
    );
  }

  // Carousel products excludes the main hero bestseller showcase product
  const carouselProducts = products.filter(
    (p) => (p._id || p.id) !== (heroProduct?._id || heroProduct?.id)
  );

  const isHeroFav = heroProduct ? isInWishlist(heroProduct._id || heroProduct.id) : false;
  const heroDiscount = heroProduct && heroProduct.originalPrice
    ? Math.round(((heroProduct.originalPrice - heroProduct.price) / heroProduct.originalPrice) * 100)
    : 0;

  const heroBenefits = heroProduct?.features && heroProduct.features.length > 0
    ? heroProduct.features.slice(0, 4)
    : ["100% Organic Purity", "Traditionally Handcrafted", "Zero Preservatives", "Directly Farm Sourced"];

  return (
    <section className="relative overflow-hidden bg-transparent py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-brand-gold/10">
      
      {/* Background Decorative Textures & Glows for main section */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-gradient-to-br from-brand-gold/5 via-transparent to-transparent blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-gradient-to-tr from-brand-gold/5 via-transparent to-transparent blur-[120px]" />
        <LuxuryLeaf className="absolute -top-12 -left-12 w-48 h-48 text-brand-gold/3 rotate-[45deg]" />
        <LuxuryLeaf className="absolute bottom-24 right-[-4rem] w-64 h-64 text-brand-gold/3 rotate-[-75deg]" />
      </div>

      <div className="site-container relative z-10">
        
        {/* ================= 1. PREMIUM HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-gold/25 bg-white/40 backdrop-blur-sm text-brand-darkGold text-[10px] tracking-[0.25em] uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
              Handpicked For You
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-brand-brown tracking-tight leading-tight">
              Featured Products
            </h2>
            <p className="text-sm md:text-base text-brand-brown/70 font-light leading-relaxed">
              Experience the pinnacle of natural craftsmanship. Pure, nutrient-dense products created in harmony with time-tested heritage and scientific purity.
            </p>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3.5 px-6 py-3.5 btn-gradient text-xs font-semibold uppercase tracking-widest rounded-full"
          >
            <span>Explore Collection</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>

        {/* ================= 2. HERO FEATURED PRODUCT ================= */}
        {heroProduct && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center bg-white/40 backdrop-blur-md rounded-[32px] p-8 sm:p-12 border border-brand-gold/10 shadow-lg shadow-brand-brown/[0.02] mb-24">
            
            {/* Left: Product Image Container */}
            <div className="lg:col-span-6 flex justify-center relative">
              
              {/* Floating luxury decorations around image */}
              <div className="absolute inset-0 pointer-events-none">
                <GoldenSparkle className="absolute top-4 left-6 w-5 h-5 text-brand-gold/40" delay={0.2} />
                <GoldenSparkle className="absolute bottom-10 right-4 w-6 h-6 text-brand-gold/40" delay={0.8} />
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-[-2rem] w-12 h-12 rounded-full border border-brand-gold/10 bg-brand-cream/60 flex items-center justify-center text-brand-gold/60 shadow-sm"
                >
                  <LuxuryLeaf className="w-6 h-6 rotate-45" />
                </motion.div>
              </div>

              {/* Main Image Wrapper */}
              <div className="relative group w-full max-w-[420px] aspect-square rounded-[24px] overflow-hidden bg-brand-cream/30 border border-brand-gold/5 shadow-2xl shadow-brand-brown/10">
                <Link to={`/product/${heroProduct._id || heroProduct.id}`} className="block w-full h-full">
                  <img
                    src={getImageUrl(heroProduct.image)}
                    alt={heroProduct.name}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                </Link>
                {heroDiscount > 0 && (
                  <span className="absolute top-4 left-4 bg-brand-gold text-brand-brown text-[10px] tracking-widest uppercase font-bold px-3 py-1.5 rounded-full shadow-md">
                    {heroDiscount}% Off
                  </span>
                )}
                {/* Wishlist Button floating over image */}
                <button
                  onClick={() => toggleWishlist(heroProduct)}
                  className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm border border-brand-gold/5 text-brand-brown hover:text-red-500 hover:bg-white transition-all duration-300 shadow-md"
                  aria-label="Add to Wishlist"
                >
                  <Heart
                    className={`w-4.5 h-4.5 transition-colors duration-300 ${
                      isHeroFav ? "fill-red-500 text-red-500" : "text-brand-brown/70"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Right: Product Detail Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-darkGold">
                  {heroProduct.categoryLabel || "Bestseller Collection"}
                </span>
                <h3 className="text-3xl sm:text-4xl font-playfair font-bold text-brand-brown leading-tight">
                  <Link to={`/product/${heroProduct._id || heroProduct.id}`} className="hover:text-brand-gold transition-colors">
                    {heroProduct.name}
                  </Link>
                </h3>
              </div>

              {/* Reviews Count & Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-brand-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(heroProduct.rating || 5)
                          ? "fill-current"
                          : "text-brand-gold/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-brand-brown/50 font-medium">
                  ({heroProduct.reviewsCount || 0} reviews)
                </span>
              </div>

              {/* Story/Description */}
              <p className="text-sm sm:text-base text-brand-brown/70 font-light leading-relaxed">
                {heroProduct.description ? heroProduct.description.split('.').slice(0, 2).join('.') + '.' : "Traditionally churned and crafted to perfection, preserving all essential vitamins and raw enzymes to enhance your health."}
              </p>

              {/* Custom Organic Benefit Checklist */}
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 border-t border-b border-brand-gold/10 py-5">
                {heroBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-brand-brown/80 font-medium">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Pricing, Qty, and Actions */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                
                {/* Price Display */}
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-brand-brown">₹{heroProduct.price}</span>
                    {heroProduct.originalPrice && (
                      <span className="text-sm text-brand-brown/40 line-through">₹{heroProduct.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-brand-brown/40 tracking-wider">Includes taxes • {heroProduct.weight || "250g"}</span>
                </div>

                {/* Premium Quantity Selector */}
                <div className="flex items-center bg-white border border-brand-gold/15 rounded-full p-1.5 shadow-sm">
                  <button
                    onClick={() => setHeroQty(q => Math.max(1, q - 1))}
                    className="p-1.5 text-brand-brown/60 hover:text-brand-gold hover:bg-brand-cream/40 rounded-full transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-semibold text-brand-brown select-none w-8 text-center">{heroQty}</span>
                  <button
                    onClick={() => setHeroQty(q => q + 1)}
                    className="p-1.5 text-brand-brown/60 hover:text-brand-gold hover:bg-brand-cream/40 rounded-full transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Main Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => addToCart(heroProduct, heroQty)}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4 btn-gradient text-xs font-semibold uppercase tracking-widest rounded-full"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>
                <Link
                  to={`/product/${heroProduct._id || heroProduct.id}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-brand-cream border border-brand-gold/25 text-brand-brown text-xs font-semibold uppercase tracking-widest rounded-full transition-all duration-300"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Product</span>
                </Link>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ================= 3. TRENDING PRODUCTS SHOWCASE (INFINITE MARQUEE) ================= */}
      <div className="w-full bg-[#F8F4EC] border-t border-brand-gold/15 py-10 md:py-12 px-4 sm:px-6 lg:px-8 mt-8 -mx-4 sm:-mx-6 lg:-mx-8 relative overflow-hidden">
        
        {/* Subtle Decorative Elements: gold circles, gradients, glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-48 h-48 rounded-full border border-[#D4A017]/10" />
          <div className="absolute bottom-10 right-20 w-72 h-72 rounded-full border border-[#D4A017]/5" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-tr from-[#D4A017]/4 to-transparent rounded-full blur-[80px]" />
          <div className="absolute -top-12 right-1/4 w-80 h-80 bg-gradient-to-bl from-[#D4A017]/3 to-transparent rounded-full blur-[70px]" />
        </div>

        {styleBlock}

        <div className="site-container relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-block text-[#D4A017] text-[10px] tracking-[0.3em] font-bold uppercase">
              TRENDING NOW
            </span>
            <h3 className="text-3xl sm:text-4xl font-playfair font-bold text-[#2D1F17] leading-tight">
              Trending Organic Products
            </h3>
            <p className="text-xs sm:text-sm text-[#2D1F17]/70 font-light max-w-md mx-auto leading-relaxed">
              Explore our highly coveted community favorites, formulated traditionally and packed with organic excellence.
            </p>
          </div>

          {/* Marquee Infinite scroll track */}
          <div className="relative overflow-hidden w-full select-none py-6">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] pointer-events-none md:pointer-events-auto touch-none md:touch-auto">
              
              {/* Set 1 */}
              <div className="flex shrink-0">
                {carouselProducts.map((product) => {
                  const isFav = isInWishlist(product._id || product.id);
                  const discountPercent = product.originalPrice
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 10;
                  return (
                    <div 
                      key={product._id || product.id} 
                      className="w-[220px] md:w-[280px] lg:w-[300px] px-3 shrink-0"
                    >
                      <div className="group relative bg-white border border-[#D4A017]/10 hover:border-[#D4A017]/40 rounded-[24px] overflow-hidden flex flex-col h-full transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-[#D4A017]/10">
                        
                        {/* Image Design */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-brand-cream/10 rounded-t-[24px]">
                          <Link to={`/product/${product._id || product.id}`} className="block w-full h-full pointer-events-auto">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                            />
                          </Link>

                          {/* Discount percentage badge */}
                          {discountPercent > 0 && (
                            <span className="absolute top-4 left-4 bg-[#D4A017] text-white text-[9px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full shadow-sm">
                              {discountPercent}% OFF
                            </span>
                          )}

                          {/* Wishlist icon */}
                          <button
                            onClick={() => toggleWishlist(product)}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/95 text-[#2D1F17] hover:text-red-500 hover:bg-white transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100 pointer-events-auto"
                            aria-label="Add to Wishlist"
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors duration-300 ${
                                isFav ? "fill-red-500 text-red-500" : "text-[#2D1F17]/70"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Card Content with whitespace */}
                        <div className="p-5 flex flex-col flex-grow bg-white rounded-b-[24px]">
                          
                          {/* Product Category badge */}
                          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#D4A017]">
                            {product.categoryLabel || "Pure & Organic"}
                          </span>

                          {/* Product Name */}
                          <h4 className="mt-1 font-playfair text-[0.95rem] md:text-[1.05rem] font-bold text-[#2D1F17] leading-snug line-clamp-1">
                            <Link to={`/product/${product._id || product.id}`} className="hover:text-[#D4A017] transition-colors pointer-events-auto">
                              {product.name}
                            </Link>
                          </h4>

                          {/* Rating with stars */}
                          <div className="flex items-center gap-1 mt-2">
                            <div className="flex text-[#D4A017]">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(product.rating || 5)
                                      ? "fill-current"
                                      : "opacity-25"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-[#2D1F17]/50 font-medium">({product.reviewsCount || 0})</span>
                          </div>

                          {/* Price & Quick Add */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-cream/40">
                            <div className="flex flex-col">
                              <span className="text-sm md:text-base font-bold text-[#2D1F17]">₹{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-[11px] text-[#2D1F17]/40 line-through">₹{product.originalPrice}</span>
                              )}
                            </div>
                            
                            {/* Quick Add Button */}
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="px-3 py-1.5 bg-[#2D1F17] hover:bg-[#D4A017] text-white hover:text-[#2D1F17] rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-sm cursor-pointer pointer-events-auto"
                            >
                              Add
                            </button>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Set 2 (Duplicated for Seamless Infinite Loop) */}
              <div className="flex shrink-0" aria-hidden="true">
                {carouselProducts.map((product) => {
                  const isFav = isInWishlist(product._id || product.id);
                  const discountPercent = product.originalPrice
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 10;
                  return (
                    <div 
                      key={`${product._id || product.id}-dup`} 
                      className="w-[220px] md:w-[280px] lg:w-[300px] px-3 shrink-0"
                    >
                      <div className="group relative bg-white border border-[#D4A017]/10 hover:border-[#D4A017]/40 rounded-[24px] overflow-hidden flex flex-col h-full transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-[#D4A017]/10">
                        
                        {/* Image Design */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-brand-cream/10 rounded-t-[24px]">
                          <div className="block w-full h-full">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                            />
                          </div>

                          {/* Discount percentage badge */}
                          {discountPercent > 0 && (
                            <span className="absolute top-4 left-4 bg-[#D4A017] text-white text-[9px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full shadow-sm">
                              {discountPercent}% OFF
                            </span>
                          )}

                          {/* Wishlist icon */}
                          <div
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/95 text-[#2D1F17] shadow-sm opacity-0 group-hover:opacity-100"
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors duration-300 ${
                                isFav ? "fill-red-500 text-red-500" : "text-[#2D1F17]/70"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Card Content with whitespace */}
                        <div className="p-5 flex flex-col flex-grow bg-white rounded-b-[24px]">
                          
                          {/* Product Category badge */}
                          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#D4A017]">
                            {product.categoryLabel || "Pure & Organic"}
                          </span>

                          {/* Product Name */}
                          <h4 className="mt-1 font-playfair text-[0.95rem] md:text-[1.05rem] font-bold text-[#2D1F17] leading-snug line-clamp-1">
                            {product.name}
                          </h4>

                          {/* Rating with stars */}
                          <div className="flex items-center gap-1 mt-2">
                            <div className="flex text-[#D4A017]">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(product.rating || 5)
                                      ? "fill-current"
                                      : "opacity-25"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-[#2D1F17]/50 font-medium">({product.reviewsCount || 0})</span>
                          </div>

                          {/* Price & Quick Add */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-cream/40">
                            <div className="flex flex-col">
                              <span className="text-sm md:text-base font-bold text-[#2D1F17]">₹{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-[11px] text-[#2D1F17]/40 line-through">₹{product.originalPrice}</span>
                              )}
                            </div>
                            
                            {/* Quick Add Button placeholder inside duplicate set */}
                            <div
                              className="px-3 py-1.5 bg-[#2D1F17] text-white rounded-lg text-[10px] font-bold tracking-widest uppercase"
                            >
                              Add
                            </div>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

// Arrow icon helper
function ArrowRightIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}

// Hardware-accelerated css styles for marquee
const styleBlock = (
  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes marquee {
      0% { transform: translate3d(0, 0, 0); }
      100% { transform: translate3d(-50%, 0, 0); }
    }
    .animate-marquee {
      animation: marquee 22s linear infinite;
    }
  `}} />
);
