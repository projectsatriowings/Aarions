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
  User,
  LogOut,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { getImageUrl } from "../services/api";

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
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
        className={`fixed top-0 bottom-0 left-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 z-30 flex flex-col justify-between ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col flex-grow">
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
            <Link to="/" className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-zinc-950 flex-shrink-0">
                A
              </div>
              {sidebarOpen && (
                <span className="font-playfair font-bold text-lg text-brand-brown dark:text-zinc-100 uppercase tracking-wider whitespace-nowrap">
                  Aarions Admin
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
                      ? "bg-amber-500 text-zinc-950 shadow-md font-bold"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-150"
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
        <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 py-3 px-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
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
        <header className="h-16 fixed top-0 right-0 left-0 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 z-20 transition-all duration-300"
                style={{ paddingLeft: sidebarOpen ? "272px" : "80px" }}>
          
          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* User Profile Summary */}
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-xs text-zinc-500 dark:text-zinc-400 font-semibold tracking-wide">
              Logged as: <span className="font-bold text-zinc-700 dark:text-zinc-350">{admin?.name}</span> ({admin?.role})
            </span>
            <Link to="/profile" className="w-9 h-9 rounded-full overflow-hidden border border-amber-500/30 flex items-center justify-center bg-amber-500/10">
              {admin?.avatar && !avatarError ? (
                <img
                  src={getImageUrl(admin.avatar)}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-amber-500 text-sm font-bold uppercase leading-none">
                  {admin?.name ? admin.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "A"}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow pt-24 px-6 pb-12 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
          {children}
        </main>
      </div>

    </div>
  );
}
