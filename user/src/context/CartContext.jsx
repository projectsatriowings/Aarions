import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import api, { getImageUrl } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Helper: map API cart item array to the flat frontend format
  const mapApiCart = (apiCart) => {
    if (!apiCart || !apiCart.items) return [];
    return apiCart.items
      .filter((item) => item.product) // filter out orphans
      .map((item) => ({
        ...item.product,
        id: item.product._id || item.product.id,
        itemId: item._id, // database line-item ID
        quantity: item.quantity,
      }));
  };

  // Load cart on auth change or mount
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        setLoading(true);
        try {
          const res = await api.get("/cart");
          if (res.data.success) {
            setCartItems(mapApiCart(res.data.cart));
          }
        } catch (error) {
          console.error("Failed to fetch cart from server:", error.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Guest mode
        const savedCart = localStorage.getItem("aarions_cart");
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      }
    };
    loadCart();
  }, [user]);

  // Sync localStorage for guest users
  useEffect(() => {
    if (!user) {
      localStorage.setItem("aarions_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    const defaultWeight = product.weight || "100g";

    try {
      const res = await api.post("/cart", {
        productId: product._id || product.id,
        quantity,
        selectedVariant: defaultWeight,
      });
      if (res.data.success) {
        setCartItems(mapApiCart(res.data.cart));
        // Show success toast popup
        setToast({
          show: true,
          product,
          quantity,
        });
      }
    } catch (error) {
      console.error("API error adding to cart:", error.message);
    }
  };

  const removeFromCart = async (productId) => {
    const item = cartItems.find((item) => item.id === productId || item._id === productId);

    if (user && item && item.itemId) {
      try {
        const res = await api.delete(`/cart/${item.itemId}`);
        if (res.data.success) {
          setCartItems(mapApiCart(res.data.cart));
        }
      } catch (error) {
        console.error("API error removing from cart:", error.message);
      }
    } else {
      // Local state fallback
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId && item._id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const item = cartItems.find((item) => item.id === productId || item._id === productId);

    if (user && item && item.itemId) {
      try {
        const res = await api.put(`/cart/${item.itemId}`, { quantity });
        if (res.data.success) {
          setCartItems(mapApiCart(res.data.cart));
        }
      } catch (error) {
        console.error("API error updating cart quantity:", error.message);
      }
    } else {
      // Local state fallback
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          (item.id === productId || item._id === productId) ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        const res = await api.delete("/cart");
        if (res.data.success) {
          setCartItems([]);
        }
      } catch (error) {
        console.error("API error clearing cart:", error.message);
      }
    } else {
      setCartItems([]);
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        loading,
      }}
    >
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-[200] flex items-center gap-4 bg-zinc-950/95 border border-brand-gold/20 text-white pl-4 pr-5 py-3.5 rounded-2xl shadow-xl max-w-sm backdrop-blur-md"
          >
            {toast.product?.image && (
              <img
                src={getImageUrl(toast.product.image)}
                alt={toast.product.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                <p className="text-[10px] tracking-widest uppercase font-semibold text-brand-gold font-display">Added to Cart</p>
              </div>
              <p className="text-xs text-white/90 truncate font-medium mt-1">{toast.product.name}</p>
              <p className="text-[10px] text-white/60 mt-0.5 font-light">
                Qty: {toast.quantity} • {toast.product.weight || "100g"}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
};
export default CartContext;
