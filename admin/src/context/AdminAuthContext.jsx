import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("aarions_admin_token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get("/auth/me");
        if (response.data.success) {
          setAdmin(response.data.admin);
        }
      } catch (error) {
        console.error("Session restoration failed:", error.message);
        localStorage.removeItem("aarions_admin_token");
        localStorage.removeItem("aarions_admin_user");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.success) {
        const { accessToken, admin: adminData } = response.data;
        setAdmin(adminData);
        localStorage.setItem("aarions_admin_token", accessToken);
        localStorage.setItem("aarions_admin_user", JSON.stringify(adminData));
        return { success: true };
      }
      // API responded but success was false — return a proper error object
      return {
        success: false,
        message: response.data?.error || response.data?.message || "Login failed. Please try again.",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Login failed. Verify credentials.",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error.message);
    } finally {
      setAdmin(null);
      localStorage.removeItem("aarions_admin_token");
      localStorage.removeItem("aarions_admin_user");
    }
  };

  const hasPermission = (permission) => {
    if (!admin) return false;
    if (admin.role === "superadmin") return true;
    return admin.permissions?.includes(permission);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, hasPermission, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
export default AdminAuthContext;
