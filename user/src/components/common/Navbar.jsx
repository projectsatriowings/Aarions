import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Menu, X, Search, ChevronRight, User, LogOut, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import { getImageUrl } from "../../services/api";


export default function Navbar() {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navbarSearchQuery, setNavbarSearchQuery] = useState("");
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and search bar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About Us", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  const isHome = location.pathname === "/";
  const showGlass = !isHome || isScrolled || isSearchOpen;
  const textColorClass = showGlass ? "text-brand-brown" : "text-white";

  return (
    <>
      <nav
        className={`fixed left-0 w-full z-[100] transition-all duration-500 ${
          isScrolled ? "top-0" : "top-9"
        } ${
          showGlass
            ? "glass-effect py-3 shadow-md shadow-brand-brown/5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="site-container-fluid">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo.png?v=3" 
                  alt="Aarions Logo" 
                  className={`h-14 w-auto object-contain transition-all duration-300 ${
                    showGlass ? "" : "brightness-0 invert"
                  }`}
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8 lg:space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm tracking-widest uppercase font-medium transition-colors duration-300 relative py-1 group ${
                    isLinkActive(link.path)
                      ? "text-brand-gold"
                      : `${textColorClass} hover:text-brand-gold`
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-gold transform transition-transform duration-300 origin-left ${
                      isLinkActive(link.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Icons Actions */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`${textColorClass} hover:text-brand-gold transition-colors duration-300 p-1`}
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className={`${textColorClass} hover:text-brand-gold transition-colors duration-300 p-1 relative`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.8]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-brand-cream">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className={`${textColorClass} hover:text-brand-gold transition-colors duration-300 p-1 relative`}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-brand-cream">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User / Login */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-1 transition-colors duration-300"
                    aria-label="User menu"
                  >
                    {user.avatar && !avatarError ? (
                      <img
                        src={getImageUrl(user.avatar)}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                        className="w-8 h-8 rounded-full border-2 border-brand-gold object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-brand-gold bg-brand-brown flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold uppercase leading-none">
                          {user.name ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "U"}
                        </span>
                      </div>
                    )}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 glass-effect rounded-xl shadow-xl border border-brand-gold/10 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-brand-gold/10">
                        <p className="font-semibold text-brand-brown text-sm capitalize">{user.name}</p>
                        <p className="text-brand-brown/50 text-xs truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-brand-brown hover:text-brand-gold transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        My Orders
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-brand-brown hover:text-brand-gold transition-colors border-b border-brand-gold/10"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-brand-brown hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border transition-all duration-300 ${
                    showGlass
                      ? "border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-brown"
                      : "border-white/40 text-white hover:border-brand-gold hover:text-brand-gold"
                  }`}
                  id="nav-login-btn"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden ${textColorClass} hover:text-brand-gold transition-colors duration-300 p-1`}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 stroke-[1.8]" />
                ) : (
                  <Menu className="w-6 h-6 stroke-[1.8]" />
                )}
              </button>
            </div>
          </div>
        </div>


        {/* Desktop Search Bar (Expandable) */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 w-full bg-brand-cream/95 backdrop-blur-md border-b border-brand-gold/15 py-3 sm:py-4 px-4 sm:px-6 shadow-md z-[90]"
            >
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (navbarSearchQuery.trim()) {
                    navigate(`/shop?search=${encodeURIComponent(navbarSearchQuery.trim())}`);
                    setIsSearchOpen(false);
                    setNavbarSearchQuery("");
                  }
                }}
                className="max-w-3xl mx-auto flex items-center bg-white border border-brand-gold/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2"
              >
                <Search className="w-4 h-4 sm:w-5 h-5 text-brand-brown/50 mr-1.5 sm:mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search premium honey, bilona ghee, traditional spices..."
                  value={navbarSearchQuery}
                  onChange={(e) => setNavbarSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-brand-brown text-xs sm:text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-[10px] sm:text-xs tracking-wider uppercase text-brand-brown/60 hover:text-brand-gold ml-1.5 sm:ml-2 cursor-pointer flex-shrink-0"
                >
                  Close
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[150] md:hidden bg-brand-brown/40 backdrop-blur-sm">
          <div className="fixed right-0 top-0 w-80 h-full bg-brand-cream shadow-2xl flex flex-col p-6 animate-slide-in">
            <div className="flex items-center justify-between border-b border-brand-gold/10 pb-4 mb-6">
              <span className="font-playfair text-xl font-bold tracking-wider text-brand-brown">
                AARIONS
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-brand-brown hover:text-brand-gold transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col space-y-6 flex-grow">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg tracking-widest uppercase font-medium flex items-center justify-between transition-colors duration-300 ${
                    isLinkActive(link.path)
                      ? "text-brand-gold"
                      : "text-brand-brown hover:text-brand-gold"
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-brand-gold" />
                </Link>
              ))}
            </div>

            <div className="border-t border-brand-gold/10 pt-6 mt-auto space-y-4">
              {user ? (
                <div className="space-y-4 w-full">
                  <div className="flex items-center gap-3">
                    {user.avatar && !avatarError ? (
                      <img
                        src={getImageUrl(user.avatar)}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                        className="w-9 h-9 rounded-full border-2 border-brand-gold object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full border-2 border-brand-gold bg-brand-brown flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold uppercase leading-none">
                          {user.name ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "U"}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-brand-brown capitalize">{user.name}</p>
                      <p className="text-xs text-brand-brown/50 truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3 border-y border-brand-gold/10 py-3">
                    <Link
                      to="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm font-medium text-brand-brown hover:text-brand-gold flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm font-medium text-brand-brown hover:text-brand-gold flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </div>
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="text-xs text-red-500 flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg border border-brand-gold text-brand-gold text-sm font-semibold hover:bg-brand-gold hover:text-brand-brown transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-lg bg-brand-gold text-brand-brown text-sm font-semibold hover:bg-brand-darkGold transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              <div className="text-xs text-brand-brown/50 uppercase tracking-widest">Support & Contact</div>
              <p className="text-sm text-brand-brown">
                {settings?.contactPhone || "+91 98432 70810"} <br />
                {settings?.contactEmail || "info@aarions.in"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
