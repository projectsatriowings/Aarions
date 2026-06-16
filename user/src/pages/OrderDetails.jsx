import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  PackageOpen, 
  Clock, 
  Sparkles, 
  Package, 
  Copy, 
  Check 
} from "lucide-react";
import api from "../services/api";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      setError("Failed to retrieve order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this organic order?")) return;
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${id}/cancel`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Order cancellation failed.");
    } finally {
      setCancelling(false);
    }
  };

  const handleCopyTracking = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stepper statuses setup
  const statuses = ["Pending", "Confirmed", "Packed", "Shipped", "Out For Delivery", "Delivered"];
  const currentStatusIndex = order ? statuses.indexOf(order.status) : -1;

  const getStepIcon = (stat) => {
    switch (stat) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Confirmed":
        return <Sparkles className="w-4 h-4" />;
      case "Packed":
        return <Package className="w-4 h-4" />;
      case "Shipped":
        return <Truck className="w-4 h-4" />;
      case "Out For Delivery":
        return <MapPin className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-48 flex flex-col items-center justify-center bg-[#FFFDF9] space-y-4"
      >
        <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-brand-gold" />
        <span className="text-xs text-brand-brown/40 font-medium tracking-wider uppercase">Fetching Details...</span>
      </motion.div>
    );
  }

  if (error || !order) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="min-h-screen pt-48 pb-24 bg-gradient-to-b from-[#FFFDF9] to-brand-cream/15 flex items-center justify-center text-center px-4"
      >
        <div className="max-w-md p-8 bg-white border border-brand-gold/15 rounded-3xl shadow-sm space-y-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-brand-gold" />
          <AlertTriangle className="w-12 h-12 text-brand-gold mx-auto" />
          <h2 className="font-playfair text-xl font-bold text-brand-brown">Order Not Found</h2>
          <p className="text-xs text-brand-brown/60 leading-relaxed font-light">
            {error || "We could not locate this order inside our records."}
          </p>
          <Link
            to="/orders"
            className="inline-flex items-center space-x-2 btn-gradient text-xs tracking-widest uppercase font-semibold py-3.5 px-6 rounded-full active:scale-95"
          >
            <span>Back to Orders</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  const discountPercent = order.discountPrice ? Math.round((order.discountPrice / order.itemsPrice) * 100) : 0;
  const gstPercentage = order.itemsPrice ? Math.round((order.taxPrice / order.itemsPrice) * 100) : 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-40 pb-24 bg-transparent"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link 
          to="/orders" 
          className="group inline-flex items-center gap-2.5 text-xs uppercase tracking-widest font-extrabold text-brand-brown/65 hover:text-brand-gold transition-colors mb-8 duration-300"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-brand-gold/20 bg-white shadow-sm group-hover:border-brand-gold/45 group-hover:-translate-x-0.5 transition-all duration-300">
            <ArrowLeft className="w-3.5 h-3.5" />
          </span>
          <span>Back to My Orders</span>
        </Link>

        {/* Order Header Card */}
        <div className="p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white border border-brand-gold/15 rounded-3xl relative overflow-hidden shadow-sm hover:shadow-[0_20px_45px_rgba(45,31,23,0.04)] transition-all duration-500">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-gold to-brand-darkGold" />
          <div className="space-y-1.5">
            <span className="inline-block text-[9px] uppercase tracking-widest font-extrabold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full">
              Transaction Record
            </span>
            <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-brand-brown tracking-tight">
              Order #{order._id.substring(12).toUpperCase()}
            </h1>
            <p className="text-xs text-brand-brown/50 font-medium">
              Placed on: {new Date(order.createdAt).toLocaleString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {!["Shipped", "Out For Delivery", "Delivered", "Cancelled"].includes(order.status) && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="border border-rose-200 hover:border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] uppercase font-extrabold tracking-widest py-3.5 px-6 rounded-full transition-all duration-350 disabled:opacity-50 shadow-sm active:scale-95 cursor-pointer"
              >
                Cancel Order
              </button>
            )}
            <div className="flex flex-col items-end bg-gradient-to-br from-[#FFFDF9] to-white border border-brand-gold/15 px-6 py-4 rounded-2xl shadow-inner min-w-[150px]">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-brand-brown/40">Total Amount</span>
              <span className="text-2xl font-extrabold text-brand-gold tracking-tight">₹{order.totalAmount}</span>
              <span className="text-[8px] text-green-700 bg-green-50 px-1.5 py-0.5 mt-1 rounded border border-green-150 font-bold uppercase tracking-wider">SECURED</span>
            </div>
          </div>
        </div>

        {/* Delivery Progress Timeline Stepper */}
        {order.status === "Cancelled" ? (
          <div className="bg-rose-50/70 border border-rose-200 p-8 rounded-3xl text-center mb-8 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-rose-500" />
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="font-playfair text-lg font-bold text-rose-950">This order has been cancelled</h3>
            <p className="text-xs text-rose-700/85 font-light max-w-md mx-auto leading-relaxed">
              We have restored the pantry stocks. Any captures on your payment card will be refunded automatically to your source account within 3-5 business days.
            </p>
          </div>
        ) : (
          <div className="p-6 sm:p-8 mb-8 space-y-8 bg-white border border-brand-gold/15 rounded-3xl relative overflow-hidden shadow-sm">
            <h3 className="text-xs uppercase tracking-widest font-extrabold text-brand-brown/65 flex items-center border-b border-brand-gold/10 pb-4">
              <Truck className="w-4 h-4 text-brand-gold mr-2" />
              Real-Time Tracking Status
            </h3>

            {/* Stepper Progress Bar */}
            <div className="relative pt-6 pb-2">
              {/* Background track line */}
              <div className="hidden md:block absolute top-[22px] left-[8%] right-[8%] h-[3px] bg-brand-gold/10 -translate-y-1/2 z-0 rounded-full" />
              {/* Dynamic filled progress line */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 84}%` }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="hidden md:block absolute top-[22px] left-[8%] h-[3px] bg-gradient-to-r from-brand-gold to-brand-darkGold -translate-y-1/2 z-0 rounded-full" 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
                {statuses.map((stat, idx) => {
                  const isDone = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  return (
                    <div key={stat} className="flex md:flex-col items-center gap-4 md:gap-3 text-center relative z-10 group">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.08, type: "spring" }}
                        className={`relative w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${
                          isDone
                            ? "bg-brand-brown border-brand-gold text-brand-gold shadow-md"
                            : "bg-white border-brand-gold/15 text-brand-brown/30"
                        } ${isCurrent ? "scale-105" : ""}`}
                      >
                        {isCurrent && (
                          <span className="absolute inset-0 rounded-full bg-brand-gold/20 animate-ping -z-10" />
                        )}
                        {getStepIcon(stat)}
                      </motion.div>
                      <div className="text-left md:text-center space-y-0.5">
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isDone ? "text-brand-brown" : "text-brand-brown/40"}`}>{stat}</h4>
                        <span className="text-[9px] uppercase tracking-widest text-brand-brown/30 font-semibold block">Step {idx + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Detailed items table, details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Order Items Table (Left Column) */}
          <div className="lg:col-span-8 p-6 sm:p-8 space-y-6 bg-white border border-brand-gold/15 rounded-3xl shadow-sm">
            <h3 className="font-playfair text-lg font-bold text-brand-brown border-b border-brand-gold/10 pb-4">
              Ordered Items
            </h3>
            
            <div className="divide-y divide-brand-gold/5">
              {order.items.map((item) => (
                <div key={item._id} className="py-5 flex items-center justify-between gap-4 text-xs group">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-brand-gold/15 flex-shrink-0 relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-playfair font-bold text-brand-brown text-base truncate">{item.name}</h4>
                    <p className="text-[10px] text-brand-brown/45 mt-0.5 font-medium">Variant: {item.selectedVariant || "Default Weight"}</p>
                    <p className="text-[10px] text-brand-brown/45 font-medium">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-0.5">
                    <span className="font-bold text-brand-brown text-base">₹{item.price * item.quantity}</span>
                    <p className="text-[10px] text-brand-brown/40 font-medium">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-brand-gold/10 pt-5 text-xs space-y-3 max-w-sm ml-auto font-medium">
              <div className="flex justify-between text-brand-brown/65">
                <span>Items Subtotal</span>
                <span className="font-semibold text-brand-brown">₹{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-brand-brown/65">
                <span>GST ({gstPercentage}%)</span>
                <span className="font-semibold text-brand-brown">₹{order.taxPrice}</span>
              </div>
              <div className="flex justify-between text-brand-brown/65">
                <span>Shipping Fee</span>
                <span className="font-semibold text-brand-brown">₹{order.shippingPrice}</span>
              </div>
              {order.discountPrice > 0 && (
                <div className="flex justify-between text-green-600 bg-green-50/50 px-2 py-1 rounded border border-green-100/60 font-semibold">
                  <span>Promo Discount ({order.couponApplied || "Discount"})</span>
                  <span>-₹{order.discountPrice}</span>
                </div>
              )}
              <div className="h-[1px] w-full border-t border-dashed border-brand-gold/25 my-1" />
              <div className="flex justify-between text-base font-extrabold text-brand-brown pt-1">
                <span>Final Paid Amount</span>
                <span className="text-brand-gold">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Carrier Info (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Expected Delivery Card */}
            {order.expectedDeliveryDate && (
              <div className="p-6 bg-white border border-brand-gold/15 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[3px] bg-brand-gold/50" />
                <h3 className="text-xs uppercase tracking-widest font-extrabold text-brand-brown/65 flex items-center border-b border-brand-gold/10 pb-3.5 mb-4">
                  <Truck className="w-4 h-4 text-brand-gold mr-2" />
                  Estimated Delivery
                </h3>
                <div className="text-xs text-brand-brown/70 leading-relaxed font-light space-y-2">
                  <p className="text-xl font-extrabold text-brand-gold tracking-tight">
                    {new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-[10px] text-brand-brown/50 font-medium">Our delivery partner will make attempts to deliver on or before this date.</p>
                </div>
              </div>
            )}

            {/* Delivery address */}
            <div className="p-6 bg-white border border-brand-gold/15 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[3px] bg-brand-gold/50" />
              <h3 className="text-xs uppercase tracking-widest font-extrabold text-brand-brown/65 flex items-center border-b border-brand-gold/10 pb-3.5 mb-4">
                <MapPin className="w-4 h-4 text-brand-gold mr-2" />
                Delivery Address
              </h3>
              
              <div className="text-xs text-brand-brown/70 leading-relaxed font-light space-y-1">
                <p className="font-bold text-brand-brown text-sm">{order.shippingAddress.street}</p>
                <p className="font-medium">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p className="font-medium">PIN: {order.shippingAddress.postalCode}</p>
                <div className="h-[1px] w-full bg-brand-gold/10 my-3" />
                <p className="font-semibold text-brand-brown/50 text-[10px] uppercase tracking-wider">Contact Phone</p>
                <p className="font-bold text-brand-brown">{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Shipment details */}
            {order.trackingNumber && (
              <div className="p-6 bg-white border border-brand-gold/15 rounded-3xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[3px] bg-brand-gold/50" />
                <h3 className="text-xs uppercase tracking-widest font-extrabold text-brand-brown/65 flex items-center border-b border-brand-gold/10 pb-3.5 mb-4">
                  <PackageOpen className="w-4 h-4 text-brand-gold mr-2" />
                  Shipment Tracking
                </h3>
                
                <div className="text-xs text-brand-brown/70 leading-relaxed font-light space-y-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-brand-brown/50 text-[10px] uppercase tracking-wider">Courier Service</p>
                    <p className="font-bold text-brand-brown text-sm">{order.carrier || "Delivery Partner"}</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <p className="font-semibold text-brand-brown/50 text-[10px] uppercase tracking-wider">Tracking Code</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-gold bg-brand-gold/5 px-2.5 py-1 rounded border border-brand-gold/15 text-xs">
                        {order.trackingNumber}
                      </span>
                      <button 
                        onClick={() => handleCopyTracking(order.trackingNumber)}
                        className="p-1.5 hover:bg-brand-cream/80 border border-brand-gold/10 rounded-md transition-colors cursor-pointer text-brand-brown/70 hover:text-brand-gold"
                        title="Copy Code"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-[9px] text-brand-brown/40 font-medium leading-relaxed pt-1.5 border-t border-brand-gold/5">
                    Use this tracking code on the courier's official portal to view transit checkpoint timestamps.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}
