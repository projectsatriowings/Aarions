import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Compass, 
  Home, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  Search, 
  Sparkles, 
  BookOpen, 
  PhoneCall, 
  CheckCircle2, 
  Flame 
} from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Manage SEO meta tags for 404
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "404 - Page Not Found | Aarions Organic";

    let robotsMeta = document.querySelector('meta[name="robots"]');
    const prevRobots = robotsMeta ? robotsMeta.getAttribute("content") : "index, follow";
    if (robotsMeta) {
      robotsMeta.setAttribute("content", "noindex, follow");
    }

    return () => {
      document.title = prevTitle;
      if (robotsMeta) {
        robotsMeta.setAttribute("content", prevRobots);
      }
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/shop");
    }
  };

  const popularCategories = [
    { label: "Raw Honey", to: "/shop?category=honey", badge: "Pure & Wild" },
    { label: "A2 Desi Ghee", to: "/shop?category=ghee", badge: "Bilona Churned" },
    { label: "Traditional Masalas", to: "/shop?category=masala", badge: "Hand-blended" },
    { label: "Organic Spices", to: "/shop?category=spices", badge: "Cold-Ground" },
  ];

  const quickNavCards = [
    {
      icon: Flame,
      title: "Best Sellers",
      desc: "Our most trusted pure staples loved by 5000+ families",
      to: "/shop",
      tag: "Top Rated"
    },
    {
      icon: BookOpen,
      title: "Wellness Journal",
      desc: "Ayurvedic wellness remedies, recipes & pure living guides",
      to: "/blog",
      tag: "Read Articles"
    },
    {
      icon: Sparkles,
      title: "Our Purity Promise",
      desc: "Discover our ancient methods & zero-chemical commitment",
      to: "/about",
      tag: "Farm to Table"
    },
    {
      icon: PhoneCall,
      title: "Customer Support",
      desc: "Need assistance with an order or product inquiry?",
      to: "/contact",
      tag: "Get in Touch"
    }
  ];

  const spotlightProducts = [
    {
      id: "1",
      name: "Gir Cow Ghee (Bilona)",
      category: "A2 Desi Ghee",
      price: "₹300",
      image: "/ghee-hero-sm.webp"
    },
    {
      id: "4",
      name: "Wild Forest Honey",
      category: "Raw Honey",
      price: "₹180",
      image: "/honey-hero-sm.webp"
    },
    {
      id: "7",
      name: "Lakadong High Curcumin Turmeric",
      category: "Organic Spices",
      price: "₹180",
      image: "/spices-hero-sm.webp"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[85vh] flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-cream/60 via-brand-cream/20 to-white relative overflow-hidden"
    >
      {/* Subtle organic decorative background rings */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-brand-red/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full text-center space-y-10 relative z-10">
        
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-brown text-xs font-semibold uppercase tracking-widest shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-brand-gold animate-spin-slow" />
          <span>Error 404 • Page Not Found</span>
        </div>

        {/* Headline & Explanation */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl font-bold text-brand-brown tracking-tight">
            Lost in the Fields?
          </h1>
          <p className="text-brand-brown/75 text-base sm:text-lg font-light leading-relaxed">
            The page you are looking for may have been moved, renamed, or is temporarily taking a rest. Don't worry — nature's purest harvest is just a click away.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="max-w-xl mx-auto w-full">
          <form onSubmit={handleSearch} className="relative flex items-center shadow-lg rounded-full overflow-hidden border border-brand-gold/25 bg-white transition-all focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/20">
            <div className="pl-5 text-brand-brown/40">
              <Search className="w-5 h-5 text-brand-gold" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for honey, ghee, spices, masalas..."
              className="w-full py-4 pl-3 pr-28 text-sm text-brand-brown placeholder-brand-brown/40 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-5 py-2.5 rounded-full bg-brand-brown text-brand-cream text-xs font-semibold hover:bg-brand-gold hover:text-brand-brown transition-colors duration-300"
            >
              Search Shop
            </button>
          </form>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-brand-brown/20 bg-white/80 text-brand-brown text-sm font-medium hover:border-brand-brown transition-all duration-300 shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-brown text-white text-sm font-medium hover:bg-brand-red transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Home className="w-4 h-4 text-brand-gold" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-brand-brown text-sm font-bold hover:bg-brand-darkGold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Popular Collections Badges */}
        <div className="pt-6 border-t border-brand-gold/15">
          <p className="text-xs uppercase tracking-widest font-bold text-brand-brown/60 mb-4">
            Popular Collections
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {popularCategories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-gold/25 text-brand-brown text-xs font-medium hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-200 shadow-2xs hover:-translate-y-0.5"
              >
                <span>{cat.label}</span>
                <span className="text-[10px] text-brand-gold font-bold group-hover:text-brand-brown transition-colors">
                  • {cat.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Helpful Explore Cards */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {quickNavCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.to}
                className="group p-5 rounded-2xl bg-white border border-brand-gold/15 hover:border-brand-gold hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-3 group-hover:bg-brand-gold group-hover:text-brand-brown transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-playfair font-bold text-brand-brown text-base mb-1 group-hover:text-brand-gold transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-brand-brown/65 leading-relaxed font-light">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between text-[11px] font-semibold text-brand-gold group-hover:translate-x-0.5 transition-transform">
                  <span>{card.tag}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Curated Product Spotlight */}
        <div className="pt-6 pb-2 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-bold text-brand-gold block">
                Recommended For You
              </span>
              <h2 className="font-playfair font-bold text-xl text-brand-brown">
                Customer Favorites
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold text-brand-brown hover:text-brand-gold transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {spotlightProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-brand-gold/15 hover:border-brand-gold hover:shadow-md transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-cream/15 border border-brand-gold/10 flex-shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-brand-gold block truncate">
                    {p.category}
                  </span>
                  <h4 className="font-medium text-xs text-brand-brown truncate group-hover:text-brand-gold transition-colors">
                    {p.name}
                  </h4>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-brown">{p.price}</span>
                    <span className="text-[10px] font-semibold text-brand-gold group-hover:underline flex items-center gap-0.5">
                      View <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </motion.section>
  );
}
