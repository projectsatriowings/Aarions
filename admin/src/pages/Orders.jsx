import React, { useState, useEffect } from "react";
import { Search, Eye, Edit3, X, Loader2, Truck, ClipboardList, DollarSign, ShoppingBag, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import api, { getImageUrl } from "../services/api";

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

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Tracking inputs
  const [statusInput, setStatusInput] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");

  // KPI states
  const [kpis, setKpis] = useState(null);
  const [kpisLoading, setKpisLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const res = await api.get("/dashboard");
        if (res.data.success) {
          setKpis(res.data.kpis);
        }
      } catch (err) {
        console.error("Failed to fetch KPIs:", err);
      } finally {
        setKpisLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?page=${page}&status=${statusFilter}&search=${search}`);
      if (res.data.success) {
        setOrders(res.data.orders);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, search]);

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setStatusInput(order.status);
    setTrackingNumber(order.trackingNumber || "");
    setCarrier(order.carrier || "");
    if (order.expectedDeliveryDate) {
      const dateObj = new Date(order.expectedDeliveryDate);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");
      setExpectedDeliveryDate(`${yyyy}-${mm}-${dd}`);
    } else {
      setExpectedDeliveryDate("");
    }
    setShowModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.put(`/orders/${selectedOrder._id}/status`, {
        status: statusInput,
        trackingNumber: trackingNumber || undefined,
        carrier: carrier || undefined,
        expectedDeliveryDate: expectedDeliveryDate || undefined,
      });

      if (res.data.success) {
        setShowModal(false);
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update order details.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Confirmed":
      case "Packed":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "Shipped":
      case "Out For Delivery":
        return "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20";
      case "Delivered":
        return "bg-green-500/10 text-green-500 border border-green-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold">Customer Orders</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Monitor delivery checkpoints, tracking codes, and billing transactions</p>
      </div>

      {/* KPI Cards Row */}
      {kpisLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-[#FFFDF9] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm h-32 animate-pulse flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-2/3">
                  <div className="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
                  <div className="h-6 bg-zinc-300 dark:bg-zinc-650 rounded w-3/4"></div>
                </div>
                <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-xl"></div>
              </div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : kpis ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
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
        </motion.div>
      ) : null}

      {/* Search and Filter */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 w-full max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 mr-2" />
          <input
            type="text"
            placeholder="Search by Order ID, Tracking Code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
        >
          <option value="">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Out For Delivery">Out For Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-400 font-light">No orders match the specified filters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-850/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Items Price</th>
                  <th className="py-3 px-4 font-semibold text-right">Total amount</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/5">
                    <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                      #{ord._id.substring(18).toUpperCase()}
                    </td>
                    <td className="py-3 px-4">
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{ord.user?.name || "Deleted Profile"}</h4>
                      <p className="text-[10px] text-zinc-400">{ord.user?.email}</p>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 font-medium">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-zinc-500">₹{ord.itemsPrice}</td>
                    <td className="py-3 px-4 text-right font-bold">₹{ord.totalAmount}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${getStatusColor(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetails(ord)}
                        className="inline-flex items-center space-x-1 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 text-zinc-500 hover:text-amber-500 py-1.5 px-3 rounded-lg transition-colors font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/20">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider text-zinc-500 hover:text-amber-500 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-6 h-6 rounded-md text-[10px] font-bold transition-all flex items-center justify-center ${
                    page === p
                      ? "bg-amber-500 text-white shadow-sm font-bold"
                      : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider text-zinc-500 hover:text-amber-500 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Status Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-xl flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-playfair text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Manage Order #{selectedOrder._id}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 text-xs">
              
              {/* Order Status Controls */}
              <form onSubmit={handleUpdateStatus} className="bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200 dark:border-zinc-850 p-5 rounded-xl space-y-4">
                <h4 className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center">
                  <Truck className="w-4 h-4 text-amber-500 mr-2" />
                  Override Delivery Status
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-zinc-500">Order State</label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out For Delivery">Out For Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-zinc-500">Tracking Code</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. AAR-983427"
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-zinc-500">Shipping Carrier</label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      placeholder="e.g. Delhivery, Bluedart"
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-zinc-500">Expected Delivery</label>
                    <input
                      type="date"
                      value={expectedDeliveryDate}
                      onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                      className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 outline-none text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn-gradient font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg flex items-center"
                  >
                    {updating ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : null}
                    Update Dispatch Details
                  </button>
                </div>
              </form>

              {/* Order Info & Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                
                {/* Shipping & Payment summary */}
                <div className="space-y-4 bg-zinc-50/50 dark:bg-zinc-800/10 border border-zinc-200/60 dark:border-zinc-800 p-4 rounded-xl">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">Customer Info</h4>
                  <div className="space-y-2 text-zinc-600 dark:text-zinc-400 font-light">
                    <p><span className="font-semibold text-zinc-900 dark:text-zinc-100">Deliver to:</span> {selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}</p>
                    <p>Phone Contact: {selectedOrder.shippingAddress.phone}</p>
                    <p className="pt-2 border-t border-zinc-200/50 dark:border-zinc-850"><span className="font-semibold text-zinc-900 dark:text-zinc-100">Gateway:</span> {selectedOrder.paymentMethod.toUpperCase()}</p>
                    <p>Transaction ID: <span className="font-mono">{selectedOrder.paymentInfo?.id || "N/A"}</span></p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2">Ordered Inventory</h4>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800 pr-1 max-h-[160px] overflow-y-auto">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="py-2 flex items-center justify-between gap-3">
                        <img src={getImageUrl(item.image)} alt={item.name} className="w-8 h-8 rounded object-cover border border-zinc-200 dark:border-zinc-800" />
                        <div className="flex-grow">
                          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[150px]">{item.name}</h5>
                          <p className="text-[10px] text-zinc-500 font-medium">{item.selectedVariant} x {item.quantity}</p>
                        </div>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
