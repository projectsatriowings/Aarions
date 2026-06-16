import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, Search, RotateCcw, LayoutGrid } from "lucide-react";
import { products as staticProducts } from "../data/products";
import ProductCard from "../components/common/ProductCard";
import QuickViewModal from "../components/common/QuickViewModal";
import api from "../services/api";
import Loader from "../components/common/Loader";

export default function Shop() {
  const [searchParams, useSearchParamsHook] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return searchParams.get("category") || "all";
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get("search") || "";
  });
  const [priceRange, setPriceRange] = useState(500); // Max product price set to 500
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [dbProducts, setDbProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dbProducts.length / 9);

  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * 9;
    return dbProducts.slice(startIndex, startIndex + 9);
  }, [dbProducts, currentPage]);

  // Read category and search query from URL params on load/change
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("all");
    }

    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Fetch Categories from Backend API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        if (res.data.success) {
          const totalCount = res.data.categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
          setDbCategories([
            { name: "All Products", slug: "all", productCount: totalCount },
            ...res.data.categories
          ]);
        }
      } catch (err) {
        console.error("Failed to load categories from API, falling back to static.", err);
        setDbCategories([
          { name: "All Products", slug: "all" },
          { name: "Pure Honey", slug: "honey" },
          { name: "A2 & Buffalo Ghee", slug: "ghee" },
          { name: "Spices & Masalas", slug: "spices" }
        ]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products from Backend API dynamically based on filters
  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory,
          maxPrice: priceRange,
          search: searchQuery,
          sort: sortBy,
          limit: 100, // Fetch up to 100 products to ensure all matching items are displayed
        };
        const res = await api.get("/products", { params });
        if (active && res.data.success) {
          setDbProducts(res.data.products);
        }
      } catch (err) {
        console.error("Failed to load products from API, falling back to static.", err);
        // Fallback to local static filter logic if API fails
        const filtered = staticProducts.filter((product) => {
          const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;
          const matchesPrice = product.price <= priceRange;
          const searchWords = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
          const matchesSearch = searchWords.length === 0 || searchWords.every(word => {
            return (
              product.name.toLowerCase().includes(word) ||
              product.description.toLowerCase().includes(word) ||
              product.categoryLabel.toLowerCase().includes(word)
            );
          });
          return matchesCategory && matchesPrice && matchesSearch;
        });
        if (active) {
          setDbProducts(filtered);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => {
      active = false;
    };
  }, [selectedCategory, priceRange, searchQuery, sortBy]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, searchQuery, sortBy]);

  const handleCategoryChange = (slug) => {
    if (slug === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", slug);
    }
    useSearchParamsHook(searchParams);
    setSelectedCategory(slug);
    setPriceRange(500); // Reset price range to default maximum to show all products
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setPriceRange(500);
    setSortBy("recommended");
    searchParams.delete("category");
    searchParams.delete("search"); // Delete search parameter so it does not restore
    useSearchParamsHook(searchParams);
    setSelectedCategory("all");
  };

  // Animation Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 14 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 pb-24 bg-transparent relative overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(rgba(232, 163, 23, 0.04) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px"
      }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div 
        className="absolute rounded-full pointer-events-none opacity-30 blur-3xl z-0"
        style={{
          top: "10%",
          left: "5%",
          width: "25rem",
          height: "25rem",
          background: "radial-gradient(circle, rgba(232,163,23,0.12) 0%, transparent 70%)"
        }}
      />
      <div 
        className="absolute rounded-full pointer-events-none opacity-30 blur-3xl z-0"
        style={{
          bottom: "10%",
          right: "5%",
          width: "30rem",
          height: "30rem",
          background: "radial-gradient(circle, rgba(53,94,59,0.1) 0%, transparent 70%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner/Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[1px] w-8 bg-brand-gold/60" />
            <span className="text-brand-gold text-xs font-bold tracking-[0.25em] uppercase animate-pulse">
              Aarions Pantry
            </span>
            <div className="h-[1px] w-8 bg-brand-gold/60" />
          </div>
          
          <h1 className="font-display font-bold text-brand-brown text-4xl sm:text-5xl mb-4 leading-tight">
            Our Organic Harvest
          </h1>
          
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[1px] w-14 bg-brand-gold/20" />
            <span className="text-brand-gold text-xs">🌾</span>
            <div className="h-[1px] w-14 bg-brand-gold/20" />
          </div>

          <p className="text-brand-brown/70 text-sm leading-relaxed font-light">
            Bring home the integrity of traditional farming. Every jar of ghee, bottle of honey, and bag of spices is crafted for pure wellness.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <div className="lg:col-span-1 space-y-8 bg-gradient-to-br from-white/95 to-brand-cream/15 border border-brand-gold/15 p-6 rounded-3xl h-fit shadow-md shadow-brand-brown/5 backdrop-blur-md relative overflow-hidden">
            {/* Inner luxury border */}
            <div className="absolute inset-2 rounded-[1.5rem] border border-brand-gold/5 pointer-events-none z-0" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-brand-gold/10">
                <span className="flex items-center font-display text-lg font-bold text-brand-brown tracking-wide">
                  <SlidersHorizontal className="w-4 h-4 text-brand-gold mr-2" />
                  Filters
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-brown hover:bg-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full transition-all duration-300 flex items-center"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </button>
              </div>

              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-brand-brown/50">Search</label>
                <div className="relative flex items-center bg-white/50 border border-brand-gold/10 rounded-xl px-3.5 py-2.5 focus-within:border-brand-gold/45 focus-within:ring-2 focus-within:ring-brand-gold/10 transition-all duration-300">
                  <Search className="w-4 h-4 text-brand-brown/40 mr-2" />
                  <input
                    type="text"
                    placeholder="Find ghee, honey, masala..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none w-full text-xs text-brand-brown placeholder-brand-brown/30 font-medium"
                  />
                </div>
              </div>

              {/* Category Selector */}
              <div id="categories" className="space-y-3">
                <label className="text-xs uppercase tracking-wider font-bold text-brand-brown/50 block">Categories</label>
                <div className="flex flex-col space-y-1.5">
                  {dbCategories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`text-left text-xs uppercase tracking-wider py-2.5 px-3.5 rounded-xl font-bold transition-all duration-300 flex justify-between items-center cursor-pointer ${
                        selectedCategory === cat.slug
                          ? "bg-brand-brown text-brand-cream shadow-md shadow-brand-brown/10 scale-[1.02] translate-x-1"
                          : "text-brand-brown/80 hover:bg-brand-gold/10 hover:text-brand-gold hover:translate-x-1.5"
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.productCount !== undefined && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                          selectedCategory === cat.slug
                            ? "bg-brand-gold text-brand-brown"
                            : "bg-brand-gold/15 text-brand-darkGold"
                        }`}>
                          {cat.productCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="uppercase tracking-wider text-brand-brown/50">Max Price</span>
                  <span className="text-brand-brown font-mono font-bold">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="25"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1 bg-brand-gold/20 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                />
                <div className="flex justify-between text-[10px] text-brand-brown/40 font-bold font-mono">
                  <span>₹100</span>
                  <span>₹500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid + Sorting (Right Column) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header info / Sorting select */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-brand-gold/10 px-6 py-4 rounded-2xl shadow-sm gap-4 relative overflow-hidden">
              <span className="text-xs text-brand-brown/70 font-semibold tracking-wide">
                Showing <span className="font-bold text-brand-darkGold font-mono">{dbProducts.length}</span> premium products
              </span>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-brand-brown/50 tracking-wider uppercase font-semibold">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-brand-cream/40 text-xs text-brand-brown font-semibold py-2 px-3.5 rounded-xl border border-brand-gold/15 outline-none cursor-pointer hover:border-brand-gold transition-colors duration-300"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Layout */}
            {loading ? (
              <Loader />
            ) : displayedProducts.length > 0 ? (
              <div className="space-y-10">
                
                {/* Staggered dynamic grid list */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {displayedProducts.map((product) => (
                    <motion.div
                      key={product._id || product.id}
                      variants={itemVariants}
                    >
                      <ProductCard
                        product={product}
                        onQuickView={(p) => setSelectedProduct(p)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-10 border-t border-brand-gold/10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-xl border border-brand-gold/15 bg-white flex items-center justify-center text-brand-brown hover:border-brand-gold hover:text-brand-gold disabled:opacity-35 disabled:hover:border-brand-gold/15 disabled:hover:text-brand-brown transition-all duration-300 font-bold cursor-pointer"
                    >
                      &larr;
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold font-mono transition-all duration-300 cursor-pointer ${
                          currentPage === page
                            ? "bg-brand-brown border border-brand-brown text-brand-cream shadow-md shadow-brand-brown/10 scale-105"
                            : "bg-white border border-brand-gold/15 text-brand-brown hover:border-brand-gold hover:text-brand-gold"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-xl border border-brand-gold/15 bg-white flex items-center justify-center text-brand-brown hover:border-brand-gold hover:text-brand-gold disabled:opacity-35 disabled:hover:border-brand-gold/15 disabled:hover:text-brand-brown transition-all duration-300 font-bold cursor-pointer"
                    >
                      &rarr;
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Empty State
              <div className="bg-white border border-brand-gold/10 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm mt-8 relative overflow-hidden">
                <div className="absolute inset-2 rounded-[1.5rem] border border-brand-gold/5 pointer-events-none" />
                <div className="p-4 bg-brand-gold/10 rounded-full w-fit mx-auto text-brand-gold">
                  <LayoutGrid className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="font-display text-xl font-bold text-brand-brown">No products match</h3>
                <p className="text-xs text-brand-brown/60 leading-relaxed font-medium">
                  Try relaxing your price filters, clearing your search keywords, or selecting a different organic category.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn-gradient text-xs tracking-widest uppercase font-semibold py-3.5 px-6 rounded-xl cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Quick View Modal Overlay */}
      {selectedProduct && (
        <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </motion.div>
  );
}
