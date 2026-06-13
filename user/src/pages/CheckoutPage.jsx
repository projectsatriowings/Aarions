import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Tag, CreditCard, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import api from "../services/api";

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (cartItems.length === 0 && !success) {
      navigate("/cart");
    }
    if (user && user.phoneNumber) {
      setAddress((prev) => ({ ...prev, phone: user.phoneNumber }));
    }
  }, [cartItems, user, isLoading, navigate, success, location]);

  useEffect(() => {
    if (location.state?.couponCode) {
      setCouponCode(location.state.couponCode);
      const autoApply = async () => {
        try {
          const res = await api.post("/coupons/apply", {
            code: location.state.couponCode,
            orderAmount: cartTotal,
          });
          if (res.data.success) {
            setAppliedCoupon(res.data.code);
            setDiscount(res.data.discount);
          }
        } catch (err) {
          console.warn("Failed to auto-apply checkout coupon:", err.message);
        }
      };
      autoApply();
    }
  }, [location.state, cartTotal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/coupons/apply", {
        code: couponCode,
        orderAmount: cartTotal,
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.code);
        setDiscount(res.data.discount);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid coupon code");
    }
  };

  const shippingPriceSetting = settings?.shippingFee !== undefined ? Number(settings.shippingFee) : 60;
  const shippingPrice = cartTotal === 0 ? 0 : shippingPriceSetting;
  const gstPercentage = settings?.gstPercentage !== undefined ? Number(settings.gstPercentage) : 5;
  const taxPrice = cartTotal === 0 ? 0 : Math.round(cartTotal * (gstPercentage / 100));
  const finalAmount = cartTotal + shippingPrice + taxPrice - discount;

  // Dynamically load Razorpay SDK script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!address.street || !address.city || !address.state || !address.postalCode || !address.phone) {
      setError("Please fill in all shipping fields.");
      window.scrollTo(0, 0);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // 1. Create a pending order on the backend to register item counts & reserve stock
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          selectedVariant: item.weight || "100g",
        })),
        shippingAddress: address,
        paymentMethod: "razorpay",
        itemsPrice: cartTotal,
        taxPrice,
        shippingPrice,
        discountPrice: discount,
        totalAmount: finalAmount,
        couponApplied: appliedCoupon,
      };

      const orderRes = await api.post("/orders", orderPayload);
      const orderData = orderRes.data.order;

      // 2. Call backend to fetch Razorpay Order ID
      const paymentRes = await api.post("/payments/create-order", {
        amount: finalAmount,
      });

      const { orderId, mock } = paymentRes.data;

      // 3. Load Razorpay overlay
      if (mock) {
        // Backend returned mock simulation (Dummy Keys configured)
        // Simulate immediate verify callback
        const verifyRes = await api.post("/payments/verify", {
          razorpay_order_id: orderId,
          razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 9)}`,
          razorpay_signature: "mock_signature",
          orderId: orderData._id,
        });

        if (verifyRes.data.success) {
          setCreatedOrder(verifyRes.data.order);
          clearCart();
          setSuccess(true);
        }
        setSubmitting(false);
      } else {
        // Load Real Razorpay SDK
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setError("Failed to load payment gateways. Check your connection.");
          setSubmitting(false);
          return;
        }

        const options = {
          key: paymentRes.data.key || "rzp_test_dummykeyid123", // fallback
          amount: paymentRes.data.amount,
          currency: "INR",
          name: "Aarions Organic Products",
          description: "Premium organic products check out",
          order_id: orderId,
          handler: async function (response) {
            try {
              const verifyRes = await api.post("/payments/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData._id,
              });

              if (verifyRes.data.success) {
                setCreatedOrder(verifyRes.data.order);
                clearCart();
                setSuccess(true);
              }
            } catch (err) {
              setError("Payment verification failed. Contact support.");
            } finally {
              setSubmitting(false);
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: address.phone ? address.phone.replace(/\D/g, "") : "",
          },
          theme: {
            color: "#5c3d2e",
          },
          modal: {
            ondismiss: function () {
              setSubmitting(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to process payment checkout. Verify details.");
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-48 pb-24 bg-brand-cream/10 flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white border border-brand-gold/10 p-8 rounded-3xl text-center space-y-6 shadow-sm"
        >
          <div className="flex justify-center text-green-600">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          <div className="space-y-2">
            <h1 className="font-playfair text-3xl font-semibold text-brand-brown">Order Placed!</h1>
            <p className="text-xs text-brand-brown/60">
              Thank you for shopping organic. Your order has been successfully recorded.
            </p>
          </div>
          <div className="bg-brand-cream/20 p-4 rounded-xl text-left divide-y divide-brand-gold/10 text-xs">
            <div className="py-2 flex justify-between">
              <span className="font-semibold text-brand-brown/50">Order ID:</span>
              <span className="font-bold text-brand-brown">#{createdOrder?._id}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="font-semibold text-brand-brown/50">Amount Paid:</span>
              <span className="font-bold text-brand-brown">₹{createdOrder?.totalAmount}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="font-semibold text-brand-brown/50">Deliver to:</span>
              <span className="font-bold text-brand-brown truncate max-w-[180px]">{address.street}, {address.city}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-3 pt-2">
            <Link
              to="/orders"
              className="bg-brand-brown text-white text-xs tracking-widest uppercase font-semibold py-3.5 rounded-lg hover:bg-brand-gold hover:text-brand-brown transition-colors shadow-sm"
            >
              Track Order
            </Link>
            <Link
              to="/shop"
              className="border border-brand-gold/20 text-brand-brown text-xs tracking-widest uppercase font-semibold py-3.5 rounded-lg hover:bg-brand-cream transition-colors"
            >
              Continue Sourcing
            </Link>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-40 pb-24 bg-brand-cream/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/cart" className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-brand-brown/50 hover:text-brand-gold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>

        {error && (
          <div className="p-4 mb-8 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Shipping form (Left Column) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-brand-gold/10 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              <h2 className="font-playfair text-xl font-semibold text-brand-brown border-b border-brand-gold/10 pb-4">
                Shipping Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/50">Recipient Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="bg-brand-cream/20 border border-brand-gold/10 rounded-xl px-4 py-3 text-xs text-brand-brown outline-none focus:border-brand-gold/60"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/50">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleInputChange}
                    placeholder="Apartment, plot, door number"
                    className="bg-brand-cream/20 border border-brand-gold/10 rounded-xl px-4 py-3 text-xs text-brand-brown outline-none focus:border-brand-gold/60"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/50">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    placeholder="Chennai / Delhi"
                    className="bg-brand-cream/20 border border-brand-gold/10 rounded-xl px-4 py-3 text-xs text-brand-brown outline-none focus:border-brand-gold/60"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/50">State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    placeholder="Tamil Nadu"
                    className="bg-brand-cream/20 border border-brand-gold/10 rounded-xl px-4 py-3 text-xs text-brand-brown outline-none focus:border-brand-gold/60"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/50">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleInputChange}
                    placeholder="600001"
                    className="bg-brand-cream/20 border border-brand-gold/10 rounded-xl px-4 py-3 text-xs text-brand-brown outline-none focus:border-brand-gold/60"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/50">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    readOnly
                    className="bg-brand-cream/10 border border-brand-gold/10 rounded-xl px-4 py-3 text-xs text-brand-brown/50 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Summary (Right Column) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Promo Codes */}
            <div className="bg-white border border-brand-gold/10 p-6 rounded-2xl shadow-sm space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-brand-brown/60 flex items-center">
                <Tag className="w-4 h-4 text-brand-gold mr-2" />
                Promo Discount Code
              </h3>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-brand-cream/20 border border-brand-gold/10 rounded-xl px-4 py-2.5 text-xs text-brand-brown outline-none flex-grow uppercase"
                />
                <button
                  type="submit"
                  className="bg-brand-brown hover:bg-brand-gold hover:text-brand-brown text-white text-[10px] uppercase font-bold tracking-widest px-4 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
              {appliedCoupon && (
                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-md inline-block font-semibold">
                  Coupon "{appliedCoupon}" applied! Saved ₹{discount}
                </span>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="bg-white border border-brand-gold/10 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-playfair text-lg font-semibold text-brand-brown border-b border-brand-gold/10 pb-3">
                Order Summary
              </h3>

              {/* Items short list */}
              <div className="max-h-[160px] overflow-y-auto divide-y divide-brand-gold/5 pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-2 flex justify-between text-xs items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover border border-brand-gold/5" />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-brand-brown truncate max-w-[150px]">{item.name}</h4>
                      <p className="text-[10px] text-brand-brown/40">{item.weight || "100g"} x {item.quantity}</p>
                    </div>
                    <span className="font-bold text-brand-brown">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Subtotal, tax, shipping, discount */}
              <div className="space-y-2.5 pt-3 border-t border-brand-gold/10 text-xs">
                <div className="flex justify-between text-brand-brown/60">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-brand-brown/60">
                  <span>Shipping Fee</span>
                  <span>{shippingPrice === 0 ? "Free" : `₹${shippingPrice}`}</span>
                </div>
                <div className="flex justify-between text-brand-brown/60">
                  <span>GST ({gstPercentage}%)</span>
                  <span>₹{taxPrice}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Coupon Deductions</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-brand-brown border-t border-brand-gold/10 pt-3">
                  <span>Grand Total</span>
                  <span>₹{finalAmount}</span>
                </div>
              </div>

              {/* Payment button */}
              <button
                onClick={handlePayment}
                disabled={submitting}
                className="w-full flex items-center justify-center bg-brand-brown hover:bg-brand-gold hover:text-brand-brown text-white text-xs font-semibold uppercase tracking-widest py-4 rounded-xl transition-all shadow-md mt-4 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Processing Gateway...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span>Pay with Razorpay (₹{finalAmount})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-brand-brown/45 font-medium pt-2">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span>256-bit Secure SSL checkout gateway</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
}
