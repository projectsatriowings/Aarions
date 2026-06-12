import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, ShoppingBag, Users, AlertTriangle, ArrowUpRight, ClipboardList } from "lucide-react";
import api from "../services/api";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
        {error || "Failed to load dashboard data."}
      </div>
    );
  }

  const { kpis, salesChart, categoryChart, popularProducts, recentOrders, recentLogs } = data;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Real-time indicators of Aarions organic products ecosystem</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">Total Revenue</span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">₹{kpis.totalRevenue}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">Total Orders</span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{kpis.totalOrders}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">Active Customers</span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{kpis.totalUsers}</h3>
          </div>
          <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">Low Stock Alert</span>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{kpis.lowStockProducts}</h3>
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2/3 width) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm lg:col-span-2 min-w-0 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="font-semibold text-sm">Monthly Sales Timeline</h3>
          </div>
          <div className="h-[280px] w-full min-w-0">
            {salesChart.length === 0 ? (
              <div className="flex justify-center items-center h-full text-xs text-zinc-400 font-light">No timelines recorded. Start checkout.</div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={salesChart}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#27272a", border: "none", color: "#ffffff", borderRadius: "10px", fontSize: "11px" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRevenue)" name="Sales (₹)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Share Chart (1/3 width) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm min-w-0 space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="font-semibold text-sm">Category Revenue Distribution</h3>
          </div>
          <div className="h-[280px] w-full min-w-0 flex flex-col justify-center items-center">
            {categoryChart.length === 0 ? (
              <div className="text-xs text-zinc-400 font-light">No category transactions mapped.</div>
            ) : (
              <>
                <div className="w-full h-[200px] min-w-0">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={categoryChart}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryChart.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => `₹${val}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend list */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-[10px] font-semibold text-zinc-500 max-w-[220px]">
                  {categoryChart.map((entry, idx) => (
                    <div key={idx} className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="truncate max-w-[80px]">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recents Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="font-semibold text-sm">Recent Orders Feed</h3>
            <Link to="/orders" className="text-[10px] uppercase font-bold text-amber-500 hover:underline flex items-center">
              View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-500">
                  <th className="py-2.5 font-semibold">Order ID</th>
                  <th className="py-2.5 font-semibold">Customer</th>
                  <th className="py-2.5 font-semibold text-right">Amount</th>
                  <th className="py-2.5 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                    <td className="py-3 font-semibold text-amber-500">
                      <Link to={`/orders?search=${ord._id}`}>#{ord._id.substring(18).toUpperCase()}</Link>
                    </td>
                    <td className="py-3 font-medium">{ord.user?.name || "Deleted"}</td>
                    <td className="py-3 font-bold text-right">₹{ord.totalAmount}</td>
                    <td className="py-3 text-center">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        ord.status === "Delivered" ? "bg-green-500/10 text-green-500" :
                        ord.status === "Cancelled" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Activity Logs */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="font-semibold text-sm">Recent Staff Activity Logs</h3>
          </div>
          <div className="space-y-4">
            {recentLogs.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center font-light">No security events logged.</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log._id} className="flex gap-3 text-xs items-start border-b border-zinc-100 dark:border-zinc-800/40 pb-3 last:border-b-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 flex-shrink-0">
                    <img src={log.adminUser?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Admin"} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow space-y-0.5">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">
                      {log.adminUser?.name || "Deleted Admin"} <span className="font-light text-zinc-500">performed</span> {log.action.replace("_", " ")}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-light">{log.details}</p>
                    <span className="text-[8px] text-zinc-400/70 inline-block font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
                      IP: {log.ipAddress} • {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
