import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  ArrowRight, 
  Calendar, 
  Package, 
  Clock, 
  Sparkles, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  ShieldCheck,
  Truck
} from "lucide-react";
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

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          bgClass: "bg-amber-500/10 text-amber-700 border-amber-500/25",
          icon: <Clock className="w-3.5 h-3.5" />,
          label: "Pending"
        };
      case "Confirmed":
        return {
          bgClass: "bg-blue-500/10 text-blue-700 border-blue-500/25",
          icon: <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-500" />,
          label: "Confirmed"
        };
      case "Packed":
        return {
          bgClass: "bg-sky-500/10 text-sky-700 border-sky-500/25",
          icon: <Package className="w-3.5 h-3.5" />,
          label: "Packed"
        };
      case "Shipped":
        return {
          bgClass: "bg-indigo-500/10 text-indigo-700 border-indigo-500/25",
          icon: <Truck className="w-3.5 h-3.5" />,
          label: "Shipped"
        };
      case "Out For Delivery":
        return {
          bgClass: "bg-purple-500/10 text-purple-700 border-purple-500/25",
          icon: <MapPin className="w-3.5 h-3.5 text-purple-500" />,
          label: "Out For Delivery"
        };
      case "Delivered":
        return {
          bgClass: "bg-green-500/10 text-green-700 border-green-500/25",
          icon: <CheckCircle className="w-3.5 h-3.5 text-green-600" />,
          label: "Delivered"
        };
      case "Cancelled":
        return {
          bgClass: "bg-rose-500/10 text-rose-700 border-rose-500/25",
          icon: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
          label: "Cancelled"
        };
      default:
        return {
          bgClass: "bg-gray-500/10 text-gray-700 border-gray-500/25",
          icon: <ShoppingBag className="w-3.5 h-3.5" />,
          label: status
        };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 90, 
        damping: 14 
      } 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-40 pb-24 bg-transparent"
    >
      <div className="site-container-prose">
        
        {/* Header Section */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full">
            Aarions Pantry
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl font-extrabold text-brand-brown tracking-tight">
            Order History
          </h1>
          <p className="text-xs text-brand-brown/55 font-light tracking-wide max-w-sm mx-auto">
            Trace your premium organic purchases, delivery statuses, and transaction details.
          </p>
          <div className="relative flex items-center justify-center pt-2">
            <div className="h-[1px] w-20 bg-brand-gold/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mx-2" />
            <div className="h-[1px] w-20 bg-brand-gold/30" />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-brand-gold" />
            <span className="text-xs text-brand-brown/40 font-medium tracking-wider uppercase">Loading your orders...</span>
          </div>
        ) : error ? (
          <div className="p-5 text-center text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl shadow-sm max-w-md mx-auto">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-10 text-center space-y-6 max-w-md mx-auto bg-white border border-brand-gold/15 rounded-3xl shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
            <div className="p-5 bg-brand-cream/60 border border-brand-gold/10 rounded-full w-fit mx-auto text-brand-gold shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-playfair text-xl font-bold text-brand-brown">Your order history is empty</h3>
              <p className="text-xs text-brand-brown/60 leading-relaxed font-light">
                It seems you haven't placed any orders yet. Let's fill your kitchen with organic honey, A2 cow ghee, and stoneground spices.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold to-brand-darkGold text-brand-brown text-xs tracking-widest uppercase font-bold py-4 px-8 rounded-full hover:brightness-105 transition-all shadow-lg shadow-brand-gold/20 active:scale-95"
            >
              <span>Explore Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {orders.map((order) => (
              <motion.div
                key={order._id}
                variants={itemVariants}
                className="group relative bg-white border border-brand-gold/15 rounded-3xl p-6 md:p-8 transition-all duration-300 hover:border-brand-gold/40 hover:shadow-[0_20px_50px_rgba(45,31,23,0.06),0_1px_2px_rgba(232,163,23,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden"
              >
                {/* Left hover indicator line */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-gold to-brand-darkGold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Left Section: Order details in clean grid */}
                <div className="space-y-5 flex-grow">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-playfair font-bold text-lg text-brand-brown tracking-tight">
                      Order #{order._id.substring(12).toUpperCase()}
                    </span>
                    {(() => {
                      const config = getStatusConfig(order.status);
                      return (
                        <span className={`inline-flex items-center gap-1.5 text-[9px] tracking-wider font-bold px-3 py-1.5 rounded-full border uppercase ${config.bgClass}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      );
                    })()}
                  </div>
                  
                  {/* Subtle divider */}
                  <div className="h-[1px] w-full bg-gradient-to-r from-brand-gold/15 via-brand-gold/5 to-transparent" />
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/40 block">Order Date</span>
                      <div className="flex items-center gap-1.5 text-brand-brown/85 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-brand-gold/80" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/40 block">Total Items</span>
                      <div className="flex items-center gap-1.5 text-brand-brown/85 font-medium">
                        <Package className="w-3.5 h-3.5 text-brand-gold/80" />
                        <span>
                          {order.items.length} {order.items.length === 1 ? "Product" : "Products"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 col-span-2 sm:col-span-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/40 block">Amount Paid</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-brand-brown">
                          ₹{order.totalAmount}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-150 font-bold uppercase tracking-wider">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          PAID
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Thumbnails and Action CTA */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center md:items-stretch lg:items-center justify-between md:justify-end gap-6 pt-5 md:pt-0 border-t md:border-t-0 border-brand-gold/10">
                  {/* Overlapping circle avatars */}
                  <div className="flex items-center -space-x-3 overflow-hidden self-center">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="relative group/thumb">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md ring-1 ring-brand-gold/10 group-hover/thumb:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 rounded-full bg-brand-cream border-2 border-white flex items-center justify-center text-[10px] font-bold text-brand-brown shadow-md ring-1 ring-brand-gold/10">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full btn-gradient text-xs font-bold tracking-widest uppercase active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
