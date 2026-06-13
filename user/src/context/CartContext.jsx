import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import api from "../services/api";

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
    </CartContext.Provider>
  );
};
export default CartContext;
