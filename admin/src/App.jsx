import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import Layout from "./components/Layout";

// Pages
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Reviews from "./pages/Reviews";
import Coupons from "./pages/Coupons";
import Blogs from "./pages/Blogs";
import Newsletter from "./pages/Newsletter";
import ContactQueries from "./pages/ContactQueries";
import SettingsPage from "./pages/Settings";
import PaymentGateway from "./pages/PaymentGateway";
import Profile from "./pages/Profile";

function DashboardShell({ children }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Administrative Routes inside Dashboard Layout Shell */}
          <Route path="/" element={<DashboardShell><Dashboard /></DashboardShell>} />
          <Route path="/products" element={<DashboardShell><Products /></DashboardShell>} />
          <Route path="/categories" element={<DashboardShell><Categories /></DashboardShell>} />
          <Route path="/orders" element={<DashboardShell><Orders /></DashboardShell>} />
          <Route path="/customers" element={<DashboardShell><Customers /></DashboardShell>} />
          <Route path="/reviews" element={<DashboardShell><Reviews /></DashboardShell>} />
          <Route path="/coupons" element={<DashboardShell><Coupons /></DashboardShell>} />
          <Route path="/blogs" element={<DashboardShell><Blogs /></DashboardShell>} />
          <Route path="/newsletter" element={<DashboardShell><Newsletter /></DashboardShell>} />
          <Route path="/contact" element={<DashboardShell><ContactQueries /></DashboardShell>} />
          <Route path="/settings" element={<DashboardShell><SettingsPage /></DashboardShell>} />
          <Route path="/payment-gateway" element={<DashboardShell><PaymentGateway /></DashboardShell>} />
          <Route path="/profile" element={<DashboardShell><Profile /></DashboardShell>} />
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
}
