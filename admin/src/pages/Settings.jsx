import React, { useState, useEffect } from "react";
import { Settings, Save, AlertCircle, Loader2 } from "lucide-react";
import api from "../services/api";
import Loader from "../components/Loader";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    brandName: "",
    announcementText: "",
    shippingFee: 60,
    gstPercentage: 5,
    contactEmail: "",
    contactPhone: "",
    address: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get("../settings"); // calls public settings GET
      if (res.data.success) {
        const s = res.data.settings;
        setSettings(s);
        setFormData({
          brandName: s.brandName || "Aarions",
          announcementText: s.announcementText || "",
          shippingFee: s.shippingFee !== undefined ? s.shippingFee : 60,
          gstPercentage: s.gstPercentage !== undefined ? s.gstPercentage : 5,
          contactEmail: s.contactEmail || "",
          contactPhone: s.contactPhone || "",
          address: s.address || "",
          facebook: s.socialLinks?.facebook || "",
          instagram: s.socialLinks?.instagram || "",
          twitter: s.socialLinks?.twitter || "",
          youtube: s.socialLinks?.youtube || "",
          seoTitle: s.seoTitle || "",
          seoDescription: s.seoDescription || "",
          seoKeywords: s.seoKeywords || "",
        });
      }
    } catch (err) {
      setError("Failed to retrieve system settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    const payload = {
      brandName: formData.brandName,
      announcementText: formData.announcementText,
      shippingFee: Number(formData.shippingFee),
      gstPercentage: Number(formData.gstPercentage),
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      address: formData.address,
      socialLinks: {
        facebook: formData.facebook,
        instagram: formData.instagram,
        twitter: formData.twitter,
        youtube: formData.youtube,
      },
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      seoKeywords: formData.seoKeywords,
    };

    try {
      const res = await api.put("/settings", payload); // PUT /api/admin/settings
      if (res.data.success) {
        setSuccess("Website settings updated successfully!");
        setSettings(res.data.settings);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold">Website Configurations</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Configure global announcements, contact channels, and search SEO metadata</p>
        </div>
      </div>

      {success && (
        <div className="p-4 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-xl">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/25 rounded-xl">
          {error}
        </div>
      )}

      {/* Forms Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-xs">
        
        {/* Core & Contact Settings (Left-Mid) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-playfair text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">General & Announcements</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase font-semibold text-zinc-500">Brand Display Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase font-semibold text-zinc-500">Announcement Bar Text</label>
                <input
                  type="text"
                  name="announcementText"
                  value={formData.announcementText}
                  onChange={handleInputChange}
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase font-semibold text-zinc-500">Shipping Fee (₹)</label>
                <input
                  type="number"
                  name="shippingFee"
                  value={formData.shippingFee}
                  onChange={handleInputChange}
                  min="0"
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase font-semibold text-zinc-500">GST Percentage (%)</label>
                <input
                  type="number"
                  name="gstPercentage"
                  value={formData.gstPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact coordinates */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-playfair text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Support Channels</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase font-semibold text-zinc-500">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase font-semibold text-zinc-500">Support Phone</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase font-semibold text-zinc-500">Office Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>
          </div>

          {/* Search SEO settings */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-playfair text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Search SEO & Discoverability</h3>
            
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase font-semibold text-zinc-500">SEO Default Title</label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleInputChange}
                className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase font-semibold text-zinc-500">SEO Meta Description</label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleInputChange}
                rows={3}
                className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase font-semibold text-zinc-500">SEO Keywords (comma separated)</label>
              <input
                type="text"
                name="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleInputChange}
                className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links & Submit (Right) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Socials card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-playfair text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Social Channels</h3>
            
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase font-semibold text-zinc-500">Facebook URL</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase font-semibold text-zinc-500">Instagram URL</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>
             <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase font-semibold text-zinc-500">Twitter URL</label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] uppercase font-semibold text-zinc-500">YouTube URL</label>
              <input
                type="text"
                name="youtube"
                value={formData.youtube}
                onChange={handleInputChange}
                className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-3">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">Save Configurations</h4>
            <p className="text-[10px] text-zinc-500 leading-normal font-light">Updates are applied globally across public storefront APIs immediately.</p>
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center btn-gradient text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl disabled:opacity-50 mt-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
