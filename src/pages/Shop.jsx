import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, Search, RotateCcw, LayoutGrid } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "../components/common/ProductCard";
import QuickViewModal from "../components/common/QuickViewModal";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState(500); // Max product price set to 500
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const categories = [
    { name: "All Products", slug: "all" },
    { name: "Pure Honey", slug: "honey" },
    { name: "A2 & Buffalo Ghee", slug: "ghee" },
    { name: "Spices & Masalas", slug: "spices" }
  ];

  const handleCategoryChange = (slug) => {
    if (slug === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", slug);
    }
    setSearchParams(searchParams);
    setSelectedCategory(slug);
    setPriceRange(500); // Reset price range to default maximum to show all products
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setPriceRange(500);
    setSortBy("recommended");
    searchParams.delete("category");
    searchParams.delete("search"); // Delete search parameter so it does not restore
    setSearchParams(searchParams);
    setSelectedCategory("all");
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Spices & Masalas slug matches both spices and masala categories
        const matchesCategory =
          selectedCategory === "all" ||
          (selectedCategory === "spices" && (product.category === "spices" || product.category === "masala")) ||
          product.category === selectedCategory;

        const matchesPrice = product.price <= priceRange;

        // Pattern searching: split search term by spaces and match all words (AND search)
        const searchWords = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
        const matchesSearch = searchWords.length === 0 || searchWords.every(word => {
          return (
            product.name.toLowerCase().includes(word) ||
            product.description.toLowerCase().includes(word) ||
            product.categoryLabel.toLowerCase().includes(word) ||
            (product.ingredients && product.ingredients.toLowerCase().includes(word))
          );
        });

        return matchesCategory && matchesPrice && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        // Default / Recommended: Best sellers first, then rating
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [selectedCategory, priceRange, searchQuery, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 pb-24 bg-brand-cream/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner/Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs tracking-widest uppercase font-semibold text-brand-gold">
            Aarions Pantry
          </span>
          <h1 className="text-4xl sm:text-5xl font-playfair font-semibold text-brand-brown">
            Our Organic Harvest
          </h1>
          <div className="h-[1px] w-12 bg-brand-gold mx-auto mt-4" />
          <p className="text-sm text-brand-brown/60 leading-relaxed font-light">
            Bring home the integrity of traditional farming. Every jar of ghee, bottle of honey, and bag of spices is crafted for pure wellness.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <div className="lg:col-span-1 space-y-8 bg-white border border-brand-gold/10 p-6 rounded-2xl h-fit shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-brand-gold/10">
              <span className="flex items-center font-playfair text-lg font-semibold text-brand-brown">
                <SlidersHorizontal className="w-4 h-4 text-brand-gold mr-2" />
                Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[10px] uppercase tracking-wider font-semibold text-brand-gold hover:underline flex items-center"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-brand-brown/50">Search</label>
              <div className="relative flex items-center bg-brand-cream/40 border border-brand-gold/10 rounded-xl px-3 py-2.5">
                <Search className="w-4 h-4 text-brand-brown/40 mr-2" />
                <input
                  type="text"
                  placeholder="Find ghee, honey, masala..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-xs text-brand-brown placeholder-brand-brown/30"
                />
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-brand-brown/50 block">Categories</label>
              <div className="flex flex-col space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`text-left text-xs uppercase tracking-wider py-2 px-3 rounded-lg font-semibold transition-all duration-300 ${
                      selectedCategory === cat.slug
                        ? "bg-brand-brown text-brand-cream"
                        : "text-brand-brown hover:bg-brand-cream hover:text-brand-gold"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="uppercase tracking-wider text-brand-brown/50">Max Price</span>
                <span className="text-brand-brown">₹{priceRange}</span>
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
              <div className="flex justify-between text-[10px] text-brand-brown/40 font-medium">
                <span>₹100</span>
                <span>₹500</span>
              </div>
            </div>
          </div>

          {/* Products Grid + Sorting (Right Column) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header info / Sorting select */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-brand-gold/10 px-6 py-4 rounded-xl shadow-sm gap-4">
              <span className="text-xs text-brand-brown/60 font-medium tracking-wide">
                Showing {filteredProducts.length} premium products
              </span>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-brand-brown/50 tracking-wider uppercase font-semibold">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-brand-cream/50 text-xs text-brand-brown font-semibold py-1.5 px-3 rounded-lg border border-brand-gold/10 outline-none cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Layout */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
              <div className="bg-white border border-brand-gold/10 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm mt-8">
                <div className="p-4 bg-brand-gold/10 rounded-full w-fit mx-auto text-brand-gold">
                  <LayoutGrid className="w-8 h-8" />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-brand-brown">No products match</h3>
                <p className="text-xs text-brand-brown/60 leading-relaxed font-light">
                  Try relaxing your price filters, clearing your search keywords, or selecting a different organic category.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-brand-brown hover:bg-brand-gold hover:text-brand-brown text-white text-xs tracking-widest uppercase font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
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
