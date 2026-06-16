import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { DollarSign, ShoppingBag, Users, AlertTriangle, ArrowUpRight, Sparkles, Calendar, TrendingUp, Layers } from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/dashboard");
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        setError("Failed to fetch dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Process sales data to handle single-data-point states beautifully
  const processedSalesChart = React.useMemo(() => {
    const salesChart = data?.salesChart;
    if (!salesChart || salesChart.length === 0) return [];
    if (salesChart.length === 1) {
      const paddedData = [];
      const [year, month] = salesChart[0].name.split("-").map(Number);
      for (let i = 5; i >= 1; i--) {
        let m = month - i;
        let y = year;
        if (m <= 0) {
          m += 12;
          y -= 1;
        }
        const monthStr = m < 10 ? `0${m}` : `${m}`;
        paddedData.push({
          name: `${y}-${monthStr}`,
          revenue: 0,
          orders: 0
        });
      }
      paddedData.push(salesChart[0]);
      return paddedData;
    }
    return salesChart;
  }, [data?.salesChart]);

  if (loading) {
    return <Loader />;
  }

  if (error || !data) {
    return (
      <div className="p-4 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
        {error || "Failed to load dashboard data."}
      </div>
    );
  }

  const { kpis, salesChart, categoryChart, popularProducts, recentOrders, recentLogs } = data;

  // Premium brand-aligned color palette: Burgundy, Gold, Dark Gold, Brown, Muted Brown
  const COLORS = ["#8B1E1A", "#E8A317", "#C8870F", "#2D1F17", "#A89B93"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const formattedLabel = label ? (() => {
        const parts = label.split("-");
        if (parts.length === 2) {
          const [year, month] = parts;
          const date = new Date(year, month - 1);
          return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        }
        return label;
      })() : "";

      return (
        <div className="bg-[#2D1F17]/95 backdrop-blur-md border border-[#E8A317]/25 p-3 rounded-2xl shadow-xl text-xs space-y-1.5 text-[#FFF8EC]">
          <p className="font-semibold text-[#A89B93] border-b border-white/5 pb-1">{formattedLabel}</p>
          <div className="flex items-center gap-4 justify-between">
            <span className="text-[#E8A317] font-bold">Revenue:</span>
            <span className="font-bold text-white">₹{payload[0].value.toLocaleString()}</span>
          </div>
          {payload[0].payload.orders !== undefined && (
            <div className="flex items-center gap-4 justify-between pt-0.5">
              <span className="text-[#A89B93]">Total Orders:</span>
              <span className="font-bold text-white">{payload[0].payload.orders}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const formatXAxis = (tick) => {
    const parts = tick.split("-");
    if (parts.length === 2) {
      const [year, month] = parts;
      const date = new Date(year, month - 1);
      return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    }
    return tick;
  };

  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}k`;
    }
    return `₹${value}`;
  };

  // Framer Motion Animation Settings
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      
      {/* Welcome / Header Banner */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D1F17] via-[#3E2D23] to-[#1A120D] border border-amber-500/10 p-6 sm:p-8 shadow-xl">
        {/* Decorative ambient glow */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 -mb-10 w-48 h-48 bg-amber-600/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-500">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-widest font-sans">Aarions Admin Hub</span>
            </div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#FFF8EC]">
              Dashboard Overview
            </h1>
            <p className="text-xs text-[#A89B93] font-light max-w-xl leading-relaxed">
              Real-time indicators of Aarions organic products ecosystem. Manage stock, review orders, and monitor sales activity.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#FFF8EC]/5 border border-[#FFF8EC]/10 rounded-2xl text-[10px] text-[#FFF8EC]/90 font-semibold tracking-wide backdrop-blur-md shadow-lg">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <motion.div variants={itemVariants} className="bg-[#FFFDF9] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm hover:-translate-y-1 hover:border-amber-500/25 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">Total Revenue</span>
              <h3 className="text-2xl font-bold text-[#2D1F17] dark:text-zinc-100">₹{kpis.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% vs last month</span>
          </div>
        </motion.div>

        {/* Orders Card */}
        <motion.div variants={itemVariants} className="bg-[#FFFDF9] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm hover:-translate-y-1 hover:border-amber-500/25 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">Total Orders</span>
              <h3 className="text-2xl font-bold text-[#2D1F17] dark:text-zinc-100">{kpis.totalOrders}</h3>
            </div>
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-650 rounded-xl shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+8.2% vs last month</span>
          </div>
        </motion.div>

        {/* Customers Card */}
        <motion.div variants={itemVariants} className="bg-[#FFFDF9] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm hover:-translate-y-1 hover:border-amber-500/25 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">Active Customers</span>
              <h3 className="text-2xl font-bold text-[#2D1F17] dark:text-zinc-100">{kpis.totalUsers}</h3>
            </div>
            <div className="p-2.5 bg-green-500/10 border border-green-500/20 text-green-650 rounded-xl shadow-sm">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span>Registered client accounts</span>
          </div>
        </motion.div>

        {/* Low Stock Card */}
        <motion.div variants={itemVariants} className="bg-[#FFFDF9] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm hover:-translate-y-1 hover:border-amber-500/25 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start w-full">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">Low Stock Alert</span>
              <h3 className="text-2xl font-bold text-[#2D1F17] dark:text-zinc-100">{kpis.lowStockProducts}</h3>
            </div>
            <div className={`p-2.5 rounded-xl shadow-sm ${
              kpis.lowStockProducts > 0 
                ? "bg-red-500/10 border border-red-500/20 text-red-500" 
                : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-550"
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${
            kpis.lowStockProducts > 0 ? "text-red-650" : "text-[#2D1F17]"
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{kpis.lowStockProducts > 0 ? "Immediate restock required" : "All products well-stocked"}</span>
          </div>
        </motion.div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2/3 width) */}
        <motion.div variants={itemVariants} className="bg-[#FFFDF9] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500/15 transition-all duration-300 lg:col-span-2 min-w-0 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-200/40 dark:border-zinc-800/40 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-sm text-[#2D1F17] dark:text-zinc-150">Monthly Sales Timeline</h3>
            </div>
          </div>
          <div className="h-[280px] w-full min-w-0">
            {processedSalesChart.length === 0 ? (
              <div className="flex justify-center items-center h-full text-xs text-zinc-450 font-light">No timelines recorded. Start checkout.</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={processedSalesChart} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B1E1A" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#E8A317" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#2D1F17" strokeOpacity={0.06} vertical={false} />
                  <XAxis dataKey="name" stroke="#6B5D55" fontSize={10} tickLine={false} axisLine={false} dy={8} tickFormatter={formatXAxis} />
                  <YAxis stroke="#6B5D55" fontSize={10} tickLine={false} axisLine={false} dx={-4} tickFormatter={formatYAxis} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(139, 30, 26, 0.15)", strokeWidth: 1.5 }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B1E1A"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Sales (₹)"
                    activeDot={{ r: 6, stroke: "#FFFDF9", strokeWidth: 2, fill: "#8B1E1A" }}
                    dot={{ r: 3, stroke: "#8B1E1A", strokeWidth: 1.5, fill: "#FFFDF9" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Category Share Chart (1/3 width) */}
        <motion.div variants={itemVariants} className="bg-[#FFFDF9] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500/15 transition-all duration-300 min-w-0 space-y-4">
          <div className="border-b border-zinc-200/40 dark:border-zinc-800/40 pb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <h3 className="font-semibold text-sm text-[#2D1F17] dark:text-zinc-150">Category Revenue Distribution</h3>
          </div>
          <div className="h-[280px] w-full min-w-0 flex flex-col justify-center items-center">
            {categoryChart.length === 0 ? (
              <div className="text-xs text-zinc-450 font-light">No category transactions mapped.</div>
            ) : (
              <>
                <div className="w-full h-[200px] min-w-0 relative">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={categoryChart}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryChart.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} contentStyle={{ background: "#2D1F17", border: "none", borderRadius: "12px", fontSize: "11px", color: "#FFF8EC", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center donut label */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-500">Total</span>
                    <span className="text-sm font-bold text-[#2D1F17] dark:text-zinc-150">
                      ₹{categoryChart.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                {/* Legend list */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-[10px] font-semibold text-zinc-500 max-w-[220px]">
                  {categoryChart.map((entry, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="truncate max-w-[80px] text-zinc-650 dark:text-zinc-400">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Additional Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Orders Volume Bar Chart */}
        <motion.div variants={itemVariants} className="bg-[#FFFDF9] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500/15 transition-all duration-300 min-w-0 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-200/40 dark:border-zinc-800/40 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-sm text-[#2D1F17] dark:text-zinc-150">Monthly Orders Volume</h3>
            </div>
          </div>
          <div className="h-[260px] w-full min-w-0">
            {processedSalesChart.length === 0 ? (
              <div className="flex justify-center items-center h-full text-xs text-zinc-450 font-light">No order history recorded.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={processedSalesChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B1E1A" stopOpacity={0.95}/>
                      <stop offset="95%" stopColor="#C8870F" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#2D1F17" strokeOpacity={0.06} vertical={false} />
                  <XAxis dataKey="name" stroke="#6B5D55" fontSize={10} tickLine={false} axisLine={false} dy={8} tickFormatter={formatXAxis} />
                  <YAxis stroke="#6B5D55" fontSize={10} tickLine={false} axisLine={false} dx={-4} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#2D1F17", border: "none", borderRadius: "12px", fontSize: "11px", color: "#FFF8EC" }}
                    cursor={{ fill: "rgba(139, 30, 26, 0.05)" }}
                    formatter={(value) => [`${value} Orders`, "Volume"]}
                    labelFormatter={(label) => {
                      const parts = label.split("-");
                      if (parts.length === 2) {
                        const [year, month] = parts;
                        const date = new Date(year, month - 1);
                        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
                      }
                      return label;
                    }}
                  />
                  <Bar dataKey="orders" fill="url(#colorOrders)" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Top Performing Products Horizontal Bar Chart */}
        <motion.div variants={itemVariants} className="bg-[#FFFDF9] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500/15 transition-all duration-300 min-w-0 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-200/40 dark:border-zinc-800/40 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-sm text-[#2D1F17] dark:text-zinc-150">Top Selling Products</h3>
            </div>
          </div>
          <div className="h-[260px] w-full min-w-0">
            {popularProducts.length === 0 ? (
              <div className="flex justify-center items-center h-full text-xs text-zinc-450 font-light">No items sold yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={popularProducts}
                  layout="vertical"
                  margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorUnits" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#8B1E1A" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#E8A317" stopOpacity={0.95}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#2D1F17" strokeOpacity={0.06} horizontal={false} />
                  <XAxis type="number" stroke="#6B5D55" fontSize={10} tickLine={false} axisLine={false} dy={4} allowDecimals={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#6B5D55"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={110}
                    tickFormatter={(name) => name.length > 15 ? `${name.substring(0, 15)}...` : name}
                  />
                  <Tooltip
                    contentStyle={{ background: "#2D1F17", border: "none", borderRadius: "12px", fontSize: "11px", color: "#FFF8EC" }}
                    cursor={{ fill: "rgba(139, 30, 26, 0.05)" }}
                    formatter={(value, name) => [
                      name === "unitsSold" ? `${value} units` : `₹${value.toLocaleString()}`, 
                      name === "unitsSold" ? "Units Sold" : "Total Sales"
                    ]}
                  />
                  <Bar dataKey="unitsSold" fill="url(#colorUnits)" radius={[0, 6, 6, 0]} maxBarSize={16} name="unitsSold" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recents Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800/40 pb-3">
            <h3 className="font-semibold text-sm">Recent Orders Feed</h3>
            <Link to="/orders" className="text-[10px] uppercase font-bold text-amber-500 hover:underline flex items-center gap-0.5">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800/60 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-2.5 font-semibold">Order ID</th>
                  <th className="py-2.5 font-semibold">Customer</th>
                  <th className="py-2.5 font-semibold text-right">Amount</th>
                  <th className="py-2.5 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/40">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                    <td className="py-3 font-semibold text-amber-500">
                      <Link to={`/orders?search=${ord._id}`}>#{ord._id.substring(18).toUpperCase()}</Link>
                    </td>
                    <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">{ord.user?.name || "Deleted"}</td>
                    <td className="py-3 font-bold text-right text-zinc-900 dark:text-zinc-100">₹{ord.totalAmount}</td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        ord.status === "Delivered" ? "bg-green-500/10 text-green-500" :
                        ord.status === "Cancelled" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          ord.status === "Delivered" ? "bg-green-500" :
                          ord.status === "Cancelled" ? "bg-red-500" : "bg-amber-500"
                        } animate-pulse`} />
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Audit Activity Logs */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-800/40 pb-3">
            <h3 className="font-semibold text-sm">Recent Staff Activity Logs</h3>
          </div>
          <div className="space-y-4">
            {recentLogs.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center font-light">No security events logged.</p>
            ) : (
              <div className="relative pl-4 border-l border-zinc-150 dark:border-zinc-800/80 space-y-5">
                {recentLogs.map((log) => (
                  <div key={log._id} className="relative flex gap-3 text-xs items-start">
                    {/* Timeline Dot Indicator */}
                    <div className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-amber-500 border border-zinc-50 dark:border-zinc-900 shadow-sm" />
                    
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 flex-shrink-0 bg-white">
                      <img src={log.adminUser?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Admin"} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                          {log.adminUser?.name || "Deleted Admin"} 
                          <span className="font-normal text-zinc-500 dark:text-zinc-400 ml-1">
                            performed <span className="font-bold text-amber-500 uppercase tracking-wide text-[9px] px-1.5 py-0.5 bg-amber-500/10 rounded-md border border-amber-500/15">{log.action.replace("_", " ")}</span>
                          </span>
                        </p>
                        <span className="text-[8px] text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded flex-shrink-0">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-550 dark:text-zinc-400 font-light leading-normal">{log.details}</p>
                      <div className="flex items-center gap-2 text-[8px] text-zinc-400/80 font-mono">
                        <span>IP: {log.ipAddress}</span>
                        <span>•</span>
                        <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
