import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Eye, Calendar, DollarSign, Package } from "lucide-react";
import api from "../services/api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        setError("Failed to retrieve your order history.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-600 border border-amber-200";
      case "Confirmed":
      case "Packed":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "Shipped":
      case "Out For Delivery":
        return "bg-indigo-50 text-indigo-600 border border-indigo-200";
      case "Delivered":
        return "bg-green-50 text-green-600 border border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-600 border border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-40 pb-24 bg-brand-cream/10"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-gold">My Account</span>
          <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-brand-brown">Order History</h1>
          <div className="h-[1px] w-10 bg-brand-gold mx-auto mt-2" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-brown" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-brand-gold/10 p-12 rounded-3xl text-center space-y-5 shadow-sm max-w-md mx-auto">
            <div className="p-4 bg-brand-gold/10 rounded-full w-fit mx-auto text-brand-gold">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-playfair text-lg font-semibold text-brand-brown">No orders yet</h3>
            <p className="text-xs text-brand-brown/60 leading-relaxed font-light">
              You haven't purchased any organic products yet. Explore our pantry to find traditionally churned ghee, raw forest honey, and more.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-brand-brown text-white text-xs tracking-widest uppercase font-semibold py-3.5 px-6 rounded-lg hover:bg-brand-gold hover:text-brand-brown transition-colors shadow-sm"
            >
              <span>Explore Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-brand-gold/10 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Order Meta Info */}
                <div className="space-y-3.5 flex-grow">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-xs text-brand-brown">Order #{order._id.substring(12).toUpperCase()}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div className="flex items-center text-brand-brown/60 space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-brand-brown/60 space-x-1.5">
                      <Package className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{order.items.length} {order.items.length === 1 ? "Product" : "Products"}</span>
                    </div>
                    <div className="flex items-center text-brand-brown font-semibold space-x-1.5 col-span-2 sm:col-span-1">
                      <DollarSign className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Total Paid: ₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Images Preview & Details CTA */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-brand-gold/5 pt-4 md:pt-0">
                  <div className="flex -space-x-2.5 overflow-hidden">
                    {order.items.slice(0, 3).map((item, index) => (
                      <img
                        key={index}
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 rounded-full object-cover border border-white ring-1 ring-brand-gold/10"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-brand-cream border border-white flex items-center justify-center text-[10px] font-bold text-brand-brown ring-1 ring-brand-gold/10">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-brand-gold hover:text-brand-brown transition-colors uppercase tracking-wider"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
