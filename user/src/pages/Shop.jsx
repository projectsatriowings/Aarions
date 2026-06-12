import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, Search, RotateCcw, LayoutGrid } from "lucide-react";
import { products as staticProducts } from "../data/products";
import ProductCard from "../components/common/ProductCard";
import QuickViewModal from "../components/common/QuickViewModal";
import api from "../services/api";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
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
                {dbCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`text-left text-xs uppercase tracking-wider py-2 px-3 rounded-lg font-semibold transition-all duration-300 flex justify-between items-center ${
                      selectedCategory === cat.slug
                        ? "bg-brand-brown text-brand-cream"
                        : "text-brand-brown hover:bg-brand-cream hover:text-brand-gold"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.productCount !== undefined && (
                      <span className="text-[10px] opacity-75 font-mono">({cat.productCount})</span>
                    )}
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
                Showing {dbProducts.length} premium products
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
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold" />
              </div>
            ) : dbProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dbProducts.map((product) => (
                  <motion.div
                    key={product._id || product.id}
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
