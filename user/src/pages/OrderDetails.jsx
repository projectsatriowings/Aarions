import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Truck, AlertTriangle, CheckCircle, PackageOpen } from "lucide-react";
import api from "../services/api";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

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

  // Stepper statuses setup
  const statuses = ["Pending", "Confirmed", "Packed", "Shipped", "Out For Delivery", "Delivered"];
  const currentStatusIndex = order ? statuses.indexOf(order.status) : -1;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-48 flex justify-center bg-brand-cream/10"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-brown" />
      </motion.div>
    );
  }

  if (error || !order) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="min-h-screen pt-48 pb-24 bg-brand-cream/10 flex items-center justify-center text-center"
      >
        <div className="max-w-md p-8 bg-white border border-brand-gold/10 rounded-2xl shadow-sm space-y-4">
          <AlertTriangle className="w-12 h-12 text-brand-gold mx-auto" />
          <h2 className="font-playfair text-xl font-bold text-brand-brown">Details Not Found</h2>
          <p className="text-xs text-brand-brown/60">
            {error || "We could not locate this order inside our records."}
          </p>
          <Link
            to="/orders"
            className="inline-flex items-center space-x-2 bg-brand-brown text-white text-xs tracking-widest uppercase font-semibold py-3.5 px-6 rounded-lg hover:bg-brand-gold hover:text-brand-brown transition-colors"
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
      className="min-h-screen pt-40 pb-24 bg-brand-cream/10"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/orders" className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-brand-brown/50 hover:text-brand-gold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>

        {/* Order Header Card */}
        <div className="bg-white border border-brand-gold/10 p-6 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-brand-gold">Transaction Record</span>
            <h1 className="font-playfair text-2xl font-bold text-brand-brown mt-1">Order #{order._id}</h1>
            <p className="text-[10px] text-brand-brown/50 font-medium">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!["Shipped", "Out For Delivery", "Delivered", "Cancelled"].includes(order.status) && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="border border-red-200 text-red-500 hover:bg-red-50 text-[10px] uppercase font-bold tracking-widest py-3 px-5 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel Order
              </button>
            )}
            <span className="text-sm font-bold text-brand-brown bg-brand-cream/35 border border-brand-gold/10 px-4 py-2.5 rounded-lg">
              Total Amount: ₹{order.totalAmount}
            </span>
          </div>
        </div>

        {/* Delivery Progress Timeline Stepper */}
        {order.status === "Cancelled" ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl shadow-sm text-center mb-8 space-y-2">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
            <h3 className="font-bold text-red-800 text-sm">This order has been cancelled</h3>
            <p className="text-xs text-red-700 font-light">Stock amounts have been restored and refunds (if payment captured) will process in 3-5 business days.</p>
          </div>
        ) : (
          <div className="bg-white border border-brand-gold/10 p-6 sm:p-8 rounded-2xl shadow-sm mb-8 space-y-6">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-brand-brown/60 flex items-center">
              <Truck className="w-4 h-4 text-brand-gold mr-2" />
              Real-Time Tracking Status
            </h3>

            {/* Stepper Progress Bar */}
            <div className="relative pt-6 pb-2">
              <div className="hidden md:block absolute top-[43px] left-8 right-8 h-1 bg-brand-gold/10 -translate-y-1/2 z-0" />
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
                {statuses.map((stat, idx) => {
                  const isDone = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  return (
                    <div key={stat} className="flex md:flex-col items-center gap-4 md:gap-3 text-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                          isDone
                            ? "bg-brand-brown border-brand-brown text-brand-gold"
                            : "bg-white border-brand-gold/20 text-brand-brown/30"
                        } ${isCurrent ? "ring-4 ring-brand-gold/30" : ""}`}
                      >
                        {isDone ? <CheckCircle className="w-5 h-5 fill-current text-brand-brown" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                      </div>
                      <div className="text-left md:text-center">
                        <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDone ? "text-brand-brown" : "text-brand-brown/40"}`}>{stat}</h4>
                        <span className="text-[10px] text-brand-brown/40 font-light hidden md:inline">Step {idx + 1}</span>
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
          <div className="lg:col-span-8 bg-white border border-brand-gold/10 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="font-playfair text-lg font-semibold text-brand-brown border-b border-brand-gold/10 pb-3">
              Ordered Items
            </h3>
            
            <div className="divide-y divide-brand-gold/5">
              {order.items.map((item) => (
                <div key={item._id} className="py-4 flex items-center justify-between gap-4 text-xs">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-brand-gold/10" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-brand-brown text-sm">{item.name}</h4>
                    <p className="text-[10px] text-brand-brown/45">Packaging: {item.selectedVariant || "Default Weight"}</p>
                    <p className="text-[10px] text-brand-brown/45">Sourcing Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-brand-brown">₹{item.price * item.quantity}</span>
                    <p className="text-[10px] text-brand-brown/40">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-brand-gold/10 pt-4 text-xs space-y-2.5 max-w-sm ml-auto">
              <div className="flex justify-between text-brand-brown/65">
                <span>Items Subtotal</span>
                <span>₹{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-brand-brown/65">
                <span>GST ({gstPercentage}%)</span>
                <span>₹{order.taxPrice}</span>
              </div>
              <div className="flex justify-between text-brand-brown/65">
                <span>Shipping Fee</span>
                <span>₹{order.shippingPrice}</span>
              </div>
              {order.discountPrice > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Promo Discount ({order.couponApplied || "Discount"})</span>
                  <span>-₹{order.discountPrice}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-brand-brown border-t border-brand-gold/10 pt-2.5">
                <span>Final Paid Amount</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Carrier Info (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Expected Delivery Card */}
            {order.expectedDeliveryDate && (
              <div className="bg-white border border-brand-gold/10 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-brand-brown/60 flex items-center border-b border-brand-gold/10 pb-3">
                  <Truck className="w-4 h-4 text-brand-gold mr-2" />
                  Estimated Delivery
                </h3>
                <div className="text-xs text-brand-brown/70 leading-relaxed font-light space-y-2">
                  <p className="text-lg font-extrabold text-brand-gold">
                    {new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-[10px] text-brand-brown/50">Our delivery partner will make attempts to deliver on or before this date.</p>
                </div>
              </div>
            )}

            {/* Delivery address */}
            <div className="bg-white border border-brand-gold/10 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-brand-brown/60 flex items-center border-b border-brand-gold/10 pb-3">
                <MapPin className="w-4 h-4 text-brand-gold mr-2" />
                Delivery Address
              </h3>
              
              <div className="text-xs text-brand-brown/70 leading-relaxed font-light space-y-1">
                <p className="font-bold text-brand-brown">{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>PIN: {order.shippingAddress.postalCode}</p>
                <p className="pt-2 font-medium text-brand-brown/50">Contact Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Shipment details */}
            {order.trackingNumber && (
              <div className="bg-white border border-brand-gold/10 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-brand-brown/60 flex items-center border-b border-brand-gold/10 pb-3">
                  <PackageOpen className="w-4 h-4 text-brand-gold mr-2" />
                  Shipment Tracking
                </h3>
                
                <div className="text-xs text-brand-brown/70 leading-relaxed font-light space-y-1">
                  <p className="font-semibold text-brand-brown">Courier Service: <span className="font-bold">{order.carrier || "Delivery partner"}</span></p>
                  <p>Tracking Code: <span className="font-bold text-brand-gold">{order.trackingNumber}</span></p>
                  <p className="text-[10px] text-brand-brown/40 pt-1">Copy code and search in shipping courier website to see physical checkpoints.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}
