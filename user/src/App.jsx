import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";

// Layout & Common Components
import AnnouncementBar from "./components/common/AnnouncementBar";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import CustomCursor from "./components/common/CustomCursor";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Contact from "./pages/Contact";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";
import AccountSettings from "./pages/AccountSettings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
// Auth pages that should NOT show navbar/footer
const AUTH_ROUTES = ["/login", "/signup"];

function AppShell() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <>
      <CustomCursor />
      <ScrollToTop />

      {isAuthPage ? (
        /* Auth Layout – full screen, no header/footer */
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </AnimatePresence>
      ) : (
        /* Main Layout – with header & footer */
        <div className="flex flex-col min-h-screen bg-transparent">
          <AnnouncementBar />
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/profile" element={<AccountSettings />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <WishlistProvider>
              <AppShell />
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}
