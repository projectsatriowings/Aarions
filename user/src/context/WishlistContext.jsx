import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper: map API wishlist items to frontend format (with .id field)
  const mapApiWishlist = (apiWishlist) => {
    if (!apiWishlist || !apiWishlist.products) return [];
    return apiWishlist.products.map((prod) => ({
      ...prod,
      id: prod._id || prod.id,
    }));
  };

  // Load wishlist on mount or auth change
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        setLoading(true);
        try {
          const res = await api.get("/wishlist");
          if (res.data.success) {
            setWishlistItems(mapApiWishlist(res.data.wishlist));
          }
        } catch (error) {
          console.error("Failed to load wishlist from server:", error.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Guest mode
        const saved = localStorage.getItem("aarions_wishlist");
        setWishlistItems(saved ? JSON.parse(saved) : []);
      }
    };
    loadWishlist();
  }, [user]);

  // Sync guest wishlist to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem("aarions_wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const toggleWishlist = async (product) => {
    const prodId = product._id || product.id;
    const exists = wishlistItems.some((item) => item.id === prodId || item._id === prodId);

    if (user) {
      try {
        if (exists) {
          const res = await api.delete(`/wishlist/${prodId}`);
          if (res.data.success) {
            setWishlistItems(mapApiWishlist(res.data.wishlist));
          }
        } else {
          const res = await api.post("/wishlist", { productId: prodId });
          if (res.data.success) {
            setWishlistItems(mapApiWishlist(res.data.wishlist));
          }
        }
      } catch (error) {
        console.error("API error toggling wishlist:", error.message);
      }
    } else {
      // Local state toggle
      setWishlistItems((prevItems) => {
        if (exists) {
          return prevItems.filter((item) => (item.id || item._id) !== prodId);
        }
        return [...prevItems, { ...product, id: prodId }];
      });
    }
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some((item) => item.id === productId || item._id === productId);
  };

  const removeFromWishlist = async (productId) => {
    if (user) {
      try {
        const res = await api.delete(`/wishlist/${productId}`);
        if (res.data.success) {
          setWishlistItems(mapApiWishlist(res.data.wishlist));
        }
      } catch (error) {
        console.error("API error removing from wishlist:", error.message);
      }
    } else {
      setWishlistItems((prevItems) => prevItems.filter((item) => (item.id || item._id) !== productId));
    }
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        wishlistCount,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
export default WishlistContext;
