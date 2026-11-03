import React, { Suspense, lazy } from "react";
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
import Loader from "./components/common/Loader";

// Direct (eager) load for primary landing page to maximize first paint speed
import Home from "./pages/Home";

// Code-split all other pages to eliminate initial JS bloat & non-critical render delays
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const Contact = lazy(() => import("./pages/Contact"));
const CartPage = lazy(() => import("./pages/CartPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Auth pages that should NOT show navbar/footer
const AUTH_ROUTES = ["/login", "/signup"];

function AppShell() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <>
      <ScrollToTop />

      {isAuthPage ? (
        /* Auth Layout – full screen, no header/footer */
        <Suspense fallback={<Loader fullPage />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      ) : (
        /* Main Layout – with header & footer */
        <div className="flex flex-col min-h-screen bg-transparent">
          <AnnouncementBar />
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<Loader />}>
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
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
