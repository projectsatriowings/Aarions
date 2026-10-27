import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag, CheckCircle2, Ticket } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { settings } = useSettings();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Fetch available coupons
  useEffect(() => {
    if (!user) return;
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/coupons");
        if (res.data.success) {
          setAvailableCoupons(res.data.coupons);
        }
      } catch (err) {
        console.warn("Failed to fetch coupons:", err.message);
      }
    };
    fetchCoupons();
  }, [user]);

  const applyCouponByCode = async (codeToApply) => {
    if (!user) {
      setCouponError("Please sign in to apply a coupon code.");
      setCouponApplied(false);
      setAppliedDiscount(0);
      return;
    }
    setCouponError("");
    try {
      const res = await api.post("/coupons/apply", {
        code: codeToApply,
        orderAmount: cartTotal,
      });
      if (res.data.success) {
        setAppliedDiscount(res.data.discount);
        setCouponApplied(true);
        setCouponError("");
      }
    } catch (err) {
      setCouponError(err.response?.data?.error || "Invalid coupon code");
      setCouponApplied(false);
      setAppliedDiscount(0);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    await applyCouponByCode(couponCode);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout", { state: { couponCode: couponApplied ? couponCode : "" } });
  };

  const shippingFeeSetting = settings?.shippingFee !== undefined ? Number(settings.shippingFee) : 60;
  const shippingFee = cartTotal === 0 ? 0 : shippingFeeSetting;
  const gstPercentage = settings?.gstPercentage !== undefined ? Number(settings.gstPercentage) : 5;
  const taxPrice = cartTotal === 0 ? 0 : Math.round(cartTotal * (gstPercentage / 100));
  const grandTotal = cartTotal + shippingFee + taxPrice - appliedDiscount;

  if (checkoutSuccess) {
    return (
      <div className="min-h-screen pt-48 pb-24 flex items-center justify-center bg-brand-cream/30 text-center">
        <div className="max-w-md p-8 bg-white border border-brand-gold/15 rounded-3xl shadow-xl space-y-6 max-w-md mx-4 animate-fade-in">
          <div className="p-4 bg-green-100 rounded-full w-fit mx-auto text-green-600">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="font-playfair text-3xl font-semibold text-brand-brown">Order Placed Successfully</h2>
          <p className="text-xs sm:text-sm text-brand-brown/70 leading-relaxed font-light">
            Thank you for shopping with Aarions. Your order has been registered, and we have sent a confirmation message to your email.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              onClick={() => setCheckoutSuccess(false)}
              className="inline-flex items-center space-x-2 btn-gradient text-xs tracking-widest uppercase font-semibold py-3.5 px-6 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Shop</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 pb-24 bg-transparent"
    >
      <div className="site-container">
        
        {/* Title */}
        <div className="mb-12">
          <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-brand-brown">
            Your Shopping Cart
          </h1>
          <div className="h-[1px] w-12 bg-brand-gold mt-4" />
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="premium-card overflow-hidden divide-y divide-brand-gold/5">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex items-center gap-4 sm:gap-6">
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-cream/10 border border-brand-gold/5 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow min-w-0">
                      <span className="text-[9px] tracking-widest uppercase font-semibold text-brand-gold">
                        {item.categoryLabel}
                      </span>
                      <Link
                        to={`/product/${item.id}`}
                        className="block font-playfair text-base sm:text-lg font-semibold text-brand-brown hover:text-brand-gold transition-colors truncate mt-0.5"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs font-semibold text-brand-brown/50 block mt-1">
                        ₹{item.price} each
                      </span>
                    </div>

                    {/* Quantity Selector & Item Total */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 flex-shrink-0">
                      
                      {/* Plus/minus buttons */}
                      <div className="flex items-center border border-brand-gold/20 rounded-lg p-1 bg-brand-cream/10">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-brand-brown/60 hover:text-brand-brown font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-brand-brown">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-brand-brown/60 hover:text-brand-brown font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Total price for product */}
                      <span className="text-sm sm:text-base font-bold text-brand-brown min-w-[60px] text-right">
                        ₹{item.price * item.quantity}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-brand-brown/40 hover:text-red-500 transition-colors p-1.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Controls Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-brand-brown hover:text-brand-gold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-brand-gold" />
                  <span>Continue Shopping</span>
                </Link>

                <button
                  onClick={clearCart}
                  className="text-xs uppercase tracking-widest font-bold text-brand-brown/50 hover:text-red-500 transition-colors"
                >
                  Clear Cart Contents
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Coupon code box */}
              <div className="p-6 space-y-4 premium-card">
                <h3 className="font-playfair text-lg font-semibold text-brand-brown flex items-center">
                  <Ticket className="w-4 h-4 text-brand-gold mr-2" />
                  Promo Code
                </h3>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow bg-brand-cream/30 border border-brand-gold/15 rounded-lg px-3.5 py-2 text-xs text-brand-brown outline-none focus:border-brand-gold focus:bg-white transition-all uppercase placeholder:normal-case"
                  />
                  <button
                    type="submit"
                    className="btn-gradient text-xs tracking-wider uppercase font-semibold px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {couponApplied && (
                  <div className="flex items-center justify-between bg-green-50/50 border border-green-200/50 rounded-xl p-2.5 mt-1.5 animate-fade-in">
                    <span className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                      <span className="font-mono bg-green-100 px-1.5 py-0.5 rounded uppercase border border-green-200">
                        {couponCode}
                      </span>
                      Applied!
                    </span>
                    <span className="text-xs font-bold text-green-700">
                      Saved ₹{appliedDiscount}
                    </span>
                  </div>
                )}
                {couponError && (
                  <div className="text-xs text-red-500 font-semibold animate-fade-in">
                    {couponError}
                  </div>
                )}

                {/* Available Coupons list */}
                {user && availableCoupons.length > 0 && (
                  <div className="pt-3.5 border-t border-brand-gold/10 space-y-2">
                    <h4 className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/50">
                      Available Coupons
                    </h4>
                    <div className="flex flex-col gap-2">
                      {availableCoupons.map((coupon) => {
                        const isEligible = cartTotal >= coupon.minOrderAmount;
                        const missingAmount = coupon.minOrderAmount - cartTotal;
                        
                        return (
                          <div 
                            key={coupon._id}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                              isEligible 
                                ? "bg-brand-cream/15 border-brand-gold/15 hover:border-brand-gold/40 cursor-pointer" 
                                : "bg-gray-50/50 border-gray-100 opacity-60"
                            }`}
                            onClick={() => {
                              if (isEligible) {
                                setCouponCode(coupon.code);
                                applyCouponByCode(coupon.code);
                              }
                            }}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-brand-brown bg-brand-gold/10 px-1.5 py-0.5 rounded border border-brand-gold/20 uppercase">
                                  {coupon.code}
                                </span>
                                <span className="font-medium text-brand-brown/80">
                                  {coupon.discountType === "percentage" 
                                    ? `${coupon.discountValue}% Off` 
                                    : `₹${coupon.discountValue} Off`}
                                </span>
                              </div>
                              <p className="text-[10px] text-brand-brown/40">
                                {coupon.minOrderAmount > 0 
                                  ? `Min purchase: ₹${coupon.minOrderAmount}` 
                                  : "No minimum purchase"}
                                {coupon.maxDiscountAmount && ` • Max discount: ₹${coupon.maxDiscountAmount}`}
                              </p>
                            </div>
                            
                            <div>
                              {isEligible ? (
                                <span className="text-[10px] font-bold text-brand-gold tracking-wider uppercase bg-brand-gold/10 px-2 py-1 rounded-full hover:bg-brand-gold hover:text-white transition-colors duration-300">
                                  Apply
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium text-brand-brown/40 bg-gray-100 px-2 py-1 rounded-full">
                                  Add ₹{missingAmount} more
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="p-6 space-y-4 premium-card">
                <h3 className="font-playfair text-lg font-semibold text-brand-brown">Order Summary</h3>
                
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-brown/60">Subtotal</span>
                    <span className="font-bold text-brand-brown">₹{cartTotal}</span>
                  </div>
                  
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{appliedDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-brand-brown/60">Shipping</span>
                    <span className="font-bold text-brand-brown">
                      {shippingFee === 0 ? "Free" : `₹${shippingFee}`}
                    </span>
                  </div>

                  {cartTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-brand-brown/60">GST ({gstPercentage}%)</span>
                      <span className="font-bold text-brand-brown">₹{taxPrice}</span>
                    </div>
                  )}

                  <div className="border-t border-brand-gold/10 pt-4 flex justify-between text-sm sm:text-base">
                    <span className="font-semibold text-brand-brown">Estimated Total</span>
                    <span className="font-bold text-brand-brown">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-gradient text-xs tracking-widest uppercase font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 mt-4"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-[9px] text-brand-brown/40 text-center uppercase tracking-widest mt-3 font-medium">
                  Tax included in prices where applicable
                </div>
              </div>

            </div>
          </div>
        ) : (
          // Empty State
          <div className="bg-white border border-brand-gold/10 rounded-3xl p-12 sm:p-20 text-center max-w-md mx-auto space-y-6 shadow-sm">
            <div className="p-5 bg-brand-gold/10 rounded-full w-fit mx-auto text-brand-gold">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-playfair text-2xl sm:text-3xl font-semibold text-brand-brown">Your Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-brand-brown/60 leading-relaxed font-light">
              It looks like you haven't added any premium honey, A2 ghee, or traditional spices yet. Explore our catalog to begin.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="btn-gradient text-xs tracking-widest uppercase font-semibold py-4 px-8 rounded-xl inline-block"
              >
                Go to Shop
              </Link>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
