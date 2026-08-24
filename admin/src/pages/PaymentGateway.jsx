import React, { useState, useEffect } from "react";
import { CreditCard, Save, Sparkles, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle, Cpu, ShieldCheck, Key, Lock } from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";
import Loader from "../components/Loader";

export default function PaymentGateway() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    razorpayKeyId: "",
    razorpayKeySecret: "",
    isTestMode: true,
    isActive: true,
    codEnabled: true,
    upiEnabled: false,
    upiId: "",
  });

  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/payments/settings");
        if (res.data.success) {
          setFormData({
            razorpayKeyId: res.data.settings.razorpayKeyId,
            razorpayKeySecret: res.data.settings.razorpayKeySecret,
            isTestMode: res.data.settings.isTestMode,
            isActive: res.data.settings.isActive,
            codEnabled: res.data.settings.codEnabled,
            upiEnabled: res.data.settings.upiEnabled,
            upiId: res.data.settings.upiId,
          });
        }
      } catch (err) {
        setErrorMsg("Failed to retrieve payment gateway configuration.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await api.put("/payments/settings", formData);
      if (res.data.success) {
        setSuccessMsg("Payment gateway settings updated successfully!");
        setFormData({
          razorpayKeyId: res.data.settings.razorpayKeyId,
          razorpayKeySecret: res.data.settings.razorpayKeySecret,
          isTestMode: res.data.settings.isTestMode,
          isActive: res.data.settings.isActive,
          codEnabled: res.data.settings.codEnabled,
          upiEnabled: res.data.settings.upiEnabled,
          upiId: res.data.settings.upiId,
        });
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Failed to update payment settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  // Format the Key ID for display on the virtual merchant card
  const formatCardNumber = (keyId) => {
    if (!keyId) return "•••• •••• •••• ••••";
    // If it's a standard key format, show prefix and mask the middle
    if (keyId.length > 8) {
      return `${keyId.substring(0, 8)} •••• •••• ${keyId.substring(keyId.length - 4)}`;
    }
    return keyId;
  };

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
      className="space-y-8 max-w-6xl 2xl:max-w-7xl mx-auto"
    >
      {/* Page Title & Breadcrumb */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#2D1F17] dark:text-zinc-100 flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-amber-500" />
            Payment Settings
          </h1>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1.5 leading-relaxed">
            Manage your Razorpay connection, secret credentials, and secure transaction gateways.
          </p>
        </div>
      </motion.div>

      {/* Notifications */}
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-xs font-semibold text-emerald-600 shadow-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-xs font-semibold text-red-650 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Virtual Merchant Card Visualizer */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-5 flex flex-col justify-center items-center lg:items-stretch"
        >
          <div className="relative w-full max-w-[380px] h-[230px] rounded-3xl overflow-hidden shadow-2xl p-6 bg-gradient-to-br from-[#2D1F17] via-[#473023] to-[#8B1E1A] border border-white/10 flex flex-col justify-between text-[#FFF8EC]">
            {/* Ambient Lighting Glow on Card */}
            <div className="absolute right-0 top-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute left-0 bottom-0 -mb-8 -ml-8 w-40 h-40 bg-red-500/15 rounded-full blur-2xl pointer-events-none" />
            
            {/* Card Header */}
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-amber-500/80">Aarions Pay</span>
                <h4 className="font-playfair text-lg font-bold">Merchant Card</h4>
              </div>
              <div className="px-2 py-0.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-md text-[8px] font-bold tracking-widest text-[#FFF8EC] uppercase flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-amber-500" />
                <span>Secure</span>
              </div>
            </div>

            {/* Chip */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-200/30 p-1.5 flex flex-col justify-between shadow-inner">
                <Cpu className="w-full h-full text-amber-950/80 stroke-[1.5]" />
              </div>
              
              <div className="flex flex-col items-end text-right">
                <span className="text-[7px] uppercase tracking-wider text-white/50">Gateway Provider</span>
                <span className="text-xs font-black tracking-wide bg-gradient-to-r from-amber-400 to-[#FFF8EC] bg-clip-text text-transparent">Razorpay</span>
              </div>
            </div>

            {/* Card Body (Key ID Display) */}
            <div className="relative z-10 space-y-1.5">
              <span className="text-[8px] uppercase tracking-wider text-white/50 block">Active Key ID</span>
              <div className="font-mono text-sm sm:text-base font-semibold tracking-widest text-[#FFF8EC] drop-shadow-sm select-all">
                {formatCardNumber(formData.razorpayKeyId)}
              </div>
            </div>

            {/* Card Footer */}
            <div className="relative z-10 flex justify-between items-end border-t border-white/5 pt-2.5">
              <div>
                <span className="text-[7px] uppercase tracking-wider text-white/40 block">Status</span>
                <span className="text-[9px] font-bold text-amber-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  Connected to Webshop
                </span>
              </div>
              <div className="h-6 w-auto opacity-75 object-contain flex items-center">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Sleek Credentials Form */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-7 bg-[#FFFDF9] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col justify-between"
        >
          <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
            <div className="border-b border-zinc-200/40 dark:border-zinc-800 pb-4 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-amber-500" />
              <h3 className="font-semibold text-sm text-[#2D1F17] dark:text-zinc-150">Configure API Gateway Credentials</h3>
            </div>

            <div className="space-y-5">
              {/* COD Card */}
              <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-[#2D1F17] dark:text-zinc-150">Cash on Delivery (COD)</h4>
                    <p className="text-[10px] text-zinc-500 mt-1">Allow customers to pay when the package arrives.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="codEnabled" checked={formData.codEnabled} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>

              {/* Razorpay Card */}
              <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200/40 dark:border-zinc-800 pb-4">
                  <div>
                    <h4 className="font-semibold text-sm text-[#2D1F17] dark:text-zinc-150 flex items-center gap-2">Razorpay</h4>
                    <p className="text-[10px] text-zinc-500 mt-1">Accept credit cards, debit cards, and net banking.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className={`space-y-4 pt-2 transition-opacity ${!formData.isActive ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                  {/* Razorpay Key ID Input */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-zinc-400" />
                      Razorpay Key ID
                    </label>
                    <input
                      type="text"
                      name="razorpayKeyId"
                      value={formData.razorpayKeyId}
                      onChange={handleInputChange}
                      placeholder="Paste Key ID (e.g. rzp_live_...)"
                      className="bg-zinc-50 dark:bg-zinc-800/35 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl px-4 py-3 text-xs text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
                    />
                  </div>

                  {/* Razorpay Key Secret Input */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-zinc-400" />
                      Razorpay Key Secret
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showSecret ? "text" : "password"}
                        name="razorpayKeySecret"
                        value={formData.razorpayKeySecret}
                        onChange={handleInputChange}
                        placeholder={formData.razorpayKeySecret ? "••••••••••••••••" : "Paste Key Secret"}
                        className="bg-zinc-50 dark:bg-zinc-800/35 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl px-4 py-3 pr-12 text-xs text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all w-full font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-250 transition-colors"
                      >
                        {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Test Mode Toggle */}
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="isTestMode" id="isTestMode" checked={formData.isTestMode} onChange={handleInputChange} className="rounded text-amber-500 focus:ring-amber-500 bg-zinc-100 border-zinc-300" />
                    <label htmlFor="isTestMode" className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Test Mode</label>
                  </div>
                </div>
              </div>

              {/* UPI QR Card */}
              <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200/40 dark:border-zinc-800 pb-4">
                  <div>
                    <h4 className="font-semibold text-sm text-[#2D1F17] dark:text-zinc-150">UPI QR Payment</h4>
                    <p className="text-[10px] text-zinc-500 mt-1">Show a QR code for direct UPI payments.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="upiEnabled" checked={formData.upiEnabled} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className={`space-y-2 pt-2 transition-opacity ${!formData.upiEnabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Admin UPI VPA (ID)</label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    placeholder="yourname@bank"
                    className="bg-zinc-50 dark:bg-zinc-800/35 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl px-4 py-3 text-xs text-zinc-950 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all w-full"
                  />
                  {formData.upiId && !/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(formData.upiId) && (
                    <p className="text-red-500 text-[10px]">Invalid UPI ID format.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-6 border-t border-zinc-200/40 dark:border-zinc-800 mt-6">
              <button
                type="submit"
                disabled={saving || (formData.upiEnabled && formData.upiId && !/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(formData.upiId))}
                className="btn-gradient font-bold uppercase tracking-widest px-6 py-3 rounded-2xl flex items-center text-xs shadow-md shadow-amber-500/10 active:scale-95 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2.5 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2.5" />
                )}
                Save Settings
              </button>
            </div>
          </form>
        </motion.div>
        
      </div>
    </motion.div>
  );
}
