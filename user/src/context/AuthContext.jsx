import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("aarions_access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get("/auth/me");
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Session restoration failed:", error.message);
        localStorage.removeItem("aarions_access_token");
        localStorage.removeItem("aarions_user");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.success) {
        const { accessToken, user: userData } = response.data;
        setUser(userData);
        localStorage.setItem("aarions_access_token", accessToken);
        localStorage.setItem("aarions_user", JSON.stringify(userData));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Login failed. Please try again.",
      };
    }
  };

  const loginWithGoogle = async (googleToken) => {
    try {
      const response = await api.post("/auth/google", { token: googleToken });
      if (response.data.success) {
        const { accessToken, user: userData } = response.data;
        setUser(userData);
        localStorage.setItem("aarions_access_token", accessToken);
        localStorage.setItem("aarions_user", JSON.stringify(userData));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Google sign-in failed. Please try again.",
      };
    }
  };

  const signup = async (name, email, password, phoneNumber) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        phoneNumber,
      });
      if (response.data.success) {
        const { accessToken, user: userData } = response.data;
        setUser(userData);
        localStorage.setItem("aarions_access_token", accessToken);
        localStorage.setItem("aarions_user", JSON.stringify(userData));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Registration failed.",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error.message);
    } finally {
      setUser(null);
      localStorage.removeItem("aarions_access_token");
      localStorage.removeItem("aarions_user");
    }
  };

  const updateProfile = async (formData) => {
    try {
      const response = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem("aarions_user", JSON.stringify(updatedUser));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Failed to update profile",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, signup, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
export default AuthContext;
