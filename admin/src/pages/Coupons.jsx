import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, Loader2, AlertCircle, Tag } from "lucide-react";
import api from "../services/api";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscountAmount: "",
    endDate: "",
    usageLimit: "",
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/coupons");
      if (res.data.success) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this coupon code?")) return;
    try {
      const res = await api.delete(`/coupons/${id}`);
      if (res.data.success) {
        fetchCoupons();
      }
    } catch (err) {
      alert("Failed to delete coupon.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    const payload = {
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrderAmount: Number(formData.minOrderAmount),
      maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : undefined,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
    };

    try {
      const res = await api.post("/coupons", payload);
      if (res.data.success) {
        setShowModal(false);
        setFormData({
          code: "",
          discountType: "percentage",
          discountValue: "",
          minOrderAmount: "0",
          maxDiscountAmount: "",
          endDate: "",
          usageLimit: "",
        });
        fetchCoupons();
      }
    } catch (err) {
      setFormError(err.response?.data?.error || "Error processing coupon creation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold">Coupon Configurations</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Manage promotional discount campaign codes and activation thresholds</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-1.5 btn-gradient text-xs font-bold uppercase tracking-widest py-3 px-5 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupon Cards Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-400 font-light">No coupons found. Create one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c._id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Coupon Header */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center text-xs font-mono font-bold tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl uppercase">
                    <Tag className="w-3.5 h-3.5 mr-1.5" />
                    {c.code}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                    new Date(c.endDate) > new Date() && c.isActive
                      ? "bg-green-500/10 border-green-500/25 text-green-500"
                      : "bg-red-500/10 border-red-500/25 text-red-500"
                  }`}>
                    {new Date(c.endDate) > new Date() && c.isActive ? "Active" : "Expired"}
                  </span>
                </div>

                {/* Details list */}
                <div className="space-y-2 text-xs">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                    {c.discountType === "percentage" ? `${c.discountValue}% Off` : `₹${c.discountValue} Flat Discount`}
                  </p>
                  <div className="text-zinc-500 dark:text-zinc-400 space-y-1 font-light">
                    <p>Minimum Purchase: ₹{c.minOrderAmount}</p>
                    {c.maxDiscountAmount ? <p>Max Discount Cap: ₹{c.maxDiscountAmount}</p> : null}
                    <p>Expires: {new Date(c.endDate).toLocaleDateString()}</p>
                    <p>Usage: {c.usageCount} / {c.usageLimit || "Unlimited"} Times Used</p>
                  </div>
                </div>
              </div>

              {/* Trash */}
              <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800/40">
                <button
                  onClick={() => handleDelete(c._id)}
                  className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-red-500/40 text-zinc-500 hover:text-red-500 rounded-lg transition-colors"
                  title="Remove coupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-playfair text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Create Promo Coupon
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/25 text-red-500 font-semibold rounded-xl flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Coupon Code</label>
                <input
                  type="text"
                  required
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="WELCOME15"
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Discount Type</label>
                  <select
                    value={formData.discountType}
                    name="discountType"
                    onChange={handleFormChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Price (₹)</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Value</label>
                  <input
                    type="number"
                    required
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleFormChange}
                    placeholder="10"
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Min Purchase (₹)</label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={formData.minOrderAmount}
                    onChange={handleFormChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    name="maxDiscountAmount"
                    value={formData.maxDiscountAmount}
                    onChange={handleFormChange}
                    placeholder="e.g. 150"
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Expiry Date</label>
                  <input
                    type="date"
                    required
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Usage Limit (Global)</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleFormChange}
                    placeholder="e.g. 200"
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-zinc-250 dark:border-zinc-800 text-zinc-500 uppercase font-bold tracking-widest py-3 px-5 rounded-xl hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gradient font-bold uppercase tracking-widest py-3 px-5 rounded-xl disabled:opacity-50 flex items-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      <span>Creating Campaign...</span>
                    </>
                  ) : (
                    <span>Create Campaign</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
