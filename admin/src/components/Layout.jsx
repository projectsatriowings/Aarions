import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ClipboardList,
  Users,
  MessageSquare,
  Tag,
  FileText,
  Mail,
  HelpCircle,
  Settings,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { getImageUrl } from "../services/api";
import Loader from "./Loader";

export default function Layout({ children }) {
  const { admin, logout, hasPermission, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [admin?.avatar]);

  // Enforce light theme
  useEffect(() => {
    localStorage.removeItem("aarions_admin_dark");
    document.body.classList.remove("dark-theme", "dark");
    document.documentElement.classList.remove("dark-theme", "dark");
  }, []);

  useEffect(() => {
    if (!isLoading && !admin) {
      navigate("/login");
    }
  }, [admin, isLoading, navigate]);

  if (isLoading || !admin) {
    return <Loader fullPage />;
  }

  // Sidebar Links config
  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard, permission: "read_all" },
    { label: "Products", path: "/products", icon: ShoppingBag, permission: "manage_products" },
    { label: "Categories", path: "/categories", icon: Layers, permission: "manage_categories" },
    { label: "Orders", path: "/orders", icon: ClipboardList, permission: "manage_orders" },
    { label: "Customers", path: "/customers", icon: Users, permission: "manage_users" },
    { label: "Reviews", path: "/reviews", icon: MessageSquare, permission: "manage_reviews" },
    { label: "Coupons", path: "/coupons", icon: Tag, permission: "manage_coupons" },
    { label: "Blogs", path: "/blogs", icon: FileText, permission: "manage_blogs" },
    { label: "Newsletter", path: "/newsletter", icon: Mail, permission: "manage_newsletter" },
    { label: "Contact Queries", path: "/contact", icon: HelpCircle, permission: "manage_queries" },
    { label: "Settings", path: "/settings", icon: Settings, permission: "manage_settings" },
    { label: "Payment Gateway", path: "/payment-gateway", icon: CreditCard, permission: "manage_settings" },
    { label: "Profile", path: "/profile", icon: User, permission: "read_all" },
  ];

  const filteredItems = navItems.filter((item) => hasPermission(item.permission));

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      
      {/* ───────── SIDEBAR ───────── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 bg-[#FFFDF9] border-r border-[#E8A317]/10 transition-all duration-300 z-30 flex flex-col justify-between ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col flex-grow">
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#E8A317]/10">
            <Link to="/" className="flex items-center space-x-2 overflow-hidden">
              <img 
                src="/logo.png?v=3" 
                alt="Aarions Logo" 
                className={`w-auto object-contain transition-all duration-300 ${
                  sidebarOpen ? "h-11 px-2" : "h-8 px-1"
                }`}
              />
              {sidebarOpen && (
                <span className="text-[10px] tracking-[0.15em] font-bold uppercase bg-[#8B1E1A]/10 text-[#8B1E1A] border border-[#8B1E1A]/20 px-2 py-0.5 rounded-md shrink-0">
                  Admin
                </span>
              )}
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-grow py-4 px-2 space-y-1.5 overflow-y-auto no-scrollbar">
            {filteredItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 py-3 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#8B1E1A] to-[#C8870F] text-white shadow-md shadow-[#8B1E1A]/12 font-bold"
                      : "text-[#2D1F17]/70 hover:bg-[#FFF8EC] hover:text-[#2D1F17]"
                  }`
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-2 border-t border-[#E8A317]/10 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 py-3 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-650 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ───────── MAIN VIEWPORT ───────── */}
      <div
        className={`flex-grow min-h-screen flex flex-col transition-all duration-300 ${
          sidebarOpen ? "pl-64" : "pl-16"
        }`}
      >
        {/* Top Navbar */}
        <header className={`h-16 fixed top-0 right-0 bg-[#FFF8EC]/90 backdrop-blur-md border-b border-[#E8A317]/15 flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 z-20 transition-all duration-300 ${
          sidebarOpen ? "left-64" : "left-16"
        }`}>
          
          {/* Left section: Toggle + Brand Title & ADMIN badge */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 border border-[#E8A317]/20 rounded-xl hover:bg-[#F8EED8] text-[#2D1F17] transition-all cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Summary */}
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-xs text-zinc-500 font-semibold tracking-wide">
              Logged as: <span className="font-bold text-[#2D1F17]">{admin?.name}</span> ({admin?.role})
            </span>
            <Link to="/profile" className="w-9 h-9 rounded-full overflow-hidden border border-[#8B1E1A]/30 flex items-center justify-center bg-[#8B1E1A]/10">
              {admin?.avatar && !avatarError ? (
                <img
                  src={getImageUrl(admin.avatar)}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#8B1E1A] text-sm font-bold uppercase leading-none">
                  {admin?.name ? admin.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "A"}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 xl:px-10 pb-12 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
          <div className="w-full max-w-[1920px] mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
