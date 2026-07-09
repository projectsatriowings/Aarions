import React, { useState, useEffect } from "react";
import { Settings, Save, AlertCircle, Loader2, ArrowUp, ArrowDown, Upload, X, Plus } from "lucide-react";
import api, { getImageUrl } from "../services/api";
import Loader from "../components/Loader";

const sectionLabels = {
  certifications: "Certifications Bar",
  categories: "Featured Categories Grid",
  featuredProducts: "Featured Products Grid",
  whyChooseUs: "Why Choose Us Bento",
  benefits: "Journey to Purity Timeline",
  bestSellers: "Best Sellers Carousel",
  testimonials: "Testimonials Carousel",
  blogs: "Blog & Journal Section",
  newsletter: "Newsletter Card"
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("general");
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);

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
    footerAboutText: "",
    footerCopyright: "",
    certifications: "",
    developerName: "",
    developerUrl: "",
    paymentMethods: "",
    // Homepage toggles
    showCertifications: true,
    showCategories: true,
    showFeaturedProducts: true,
    showWhyChooseUs: true,
    showBenefits: true,
    showBestSellers: true,
    showTestimonials: true,
    showBlogs: true,
    showNewsletter: true,
    homepageSectionOrder: "",
    // Hero banner text & slides
    heroBadgeText: "",
    heroTitleLine1: "",
    heroTitleLine2: "",
    heroTitleLine2Suffix: "",
    heroTitleLine3: "",
    heroSubtitle: "",
    heroButtonText: "",
    heroImages: "",
    // About Page configurations
    aboutHeroTitleLine1: "",
    aboutHeroTitleLine2: "",
    aboutHeroSubtitle: "",
    aboutParagraph1: "",
    aboutParagraph2: "",
    aboutHeroImage: "",
    // Contact Page configurations
    contactHeroTitle: "",
    contactHeroSubtitle: "",
    contactDescription: "",
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
          footerAboutText: s.footerAboutText || "",
          footerCopyright: s.footerCopyright || "",
          certifications: s.certifications || "",
          developerName: s.developerName || "",
          developerUrl: s.developerUrl || "",
          paymentMethods: s.paymentMethods || "",
          // Homepage toggles
          showCertifications: s.showCertifications !== undefined ? s.showCertifications : true,
          showCategories: s.showCategories !== undefined ? s.showCategories : true,
          showFeaturedProducts: s.showFeaturedProducts !== undefined ? s.showFeaturedProducts : true,
          showWhyChooseUs: s.showWhyChooseUs !== undefined ? s.showWhyChooseUs : true,
          showBenefits: s.showBenefits !== undefined ? s.showBenefits : true,
          showBestSellers: s.showBestSellers !== undefined ? s.showBestSellers : true,
          showTestimonials: s.showTestimonials !== undefined ? s.showTestimonials : true,
          showBlogs: s.showBlogs !== undefined ? s.showBlogs : true,
          showNewsletter: s.showNewsletter !== undefined ? s.showNewsletter : true,
          homepageSectionOrder: s.homepageSectionOrder || "certifications,categories,featuredProducts,whyChooseUs,benefits,bestSellers,testimonials,blogs,newsletter",
          // Hero banner text & slides
          heroBadgeText: s.heroBadgeText || "",
          heroTitleLine1: s.heroTitleLine1 || "",
          heroTitleLine2: s.heroTitleLine2 || "",
          heroTitleLine2Suffix: s.heroTitleLine2Suffix || "",
          heroTitleLine3: s.heroTitleLine3 || "",
          heroSubtitle: s.heroSubtitle || "",
          heroButtonText: s.heroButtonText || "",
          heroImages: s.heroImages || "",
          // About Page configurations
          aboutHeroTitleLine1: s.aboutHeroTitleLine1 || "",
          aboutHeroTitleLine2: s.aboutHeroTitleLine2 || "",
          aboutHeroSubtitle: s.aboutHeroSubtitle || "",
          aboutParagraph1: s.aboutParagraph1 || "",
          aboutParagraph2: s.aboutParagraph2 || "",
          aboutHeroImage: s.aboutHeroImage || "",
          // Contact Page configurations
          contactHeroTitle: s.contactHeroTitle || "",
          contactHeroSubtitle: s.contactHeroSubtitle || "",
          contactDescription: s.contactDescription || "",
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMoveSection = (index, direction) => {
    const sections = formData.homepageSectionOrder ? formData.homepageSectionOrder.split(",") : [];
    if (sections.length === 0) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const temp = sections[index];
    sections[index] = sections[newIndex];
    sections[newIndex] = temp;

    setFormData((prev) => ({
      ...prev,
      homepageSectionOrder: sections.join(","),
    }));
  };

  const handleRemoveHeroImage = (idx) => {
    const images = formData.heroImages ? formData.heroImages.split(",").map(i => i.trim()).filter(Boolean) : [];
    const updated = images.filter((_, i) => i !== idx);
    setFormData((prev) => ({
      ...prev,
      heroImages: updated.join(","),
    }));
  };

  const handleAddHeroImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHeroImage(true);
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await api.post("/settings/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        const images = formData.heroImages ? formData.heroImages.split(",").map(i => i.trim()).filter(Boolean) : [];
        const updated = [...images, res.data.url];
        setFormData((prev) => ({
          ...prev,
          heroImages: updated.join(","),
        }));
      }
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const handleUploadAboutImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAboutImage(true);
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await api.post("/settings/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setFormData((prev) => ({
          ...prev,
          aboutHeroImage: res.data.url,
        }));
      }
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingAboutImage(false);
    }
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
      footerAboutText: formData.footerAboutText,
      footerCopyright: formData.footerCopyright,
      certifications: formData.certifications,
      developerName: formData.developerName,
      developerUrl: formData.developerUrl,
      paymentMethods: formData.paymentMethods,
      // Homepage toggles
      showCertifications: formData.showCertifications,
      showCategories: formData.showCategories,
      showFeaturedProducts: formData.showFeaturedProducts,
      showWhyChooseUs: formData.showWhyChooseUs,
      showBenefits: formData.showBenefits,
      showBestSellers: formData.showBestSellers,
      showTestimonials: formData.showTestimonials,
      showBlogs: formData.showBlogs,
      showNewsletter: formData.showNewsletter,
      homepageSectionOrder: formData.homepageSectionOrder,
      // Hero banner text & slides
      heroBadgeText: formData.heroBadgeText,
      heroTitleLine1: formData.heroTitleLine1,
      heroTitleLine2: formData.heroTitleLine2,
      heroTitleLine2Suffix: formData.heroTitleLine2Suffix,
      heroTitleLine3: formData.heroTitleLine3,
      heroSubtitle: formData.heroSubtitle,
      heroButtonText: formData.heroButtonText,
      heroImages: formData.heroImages,
      // About Page configurations
      aboutHeroTitleLine1: formData.aboutHeroTitleLine1,
      aboutHeroTitleLine2: formData.aboutHeroTitleLine2,
      aboutHeroSubtitle: formData.aboutHeroSubtitle,
      aboutParagraph1: formData.aboutParagraph1,
      aboutParagraph2: formData.aboutParagraph2,
      aboutHeroImage: formData.aboutHeroImage,
      // Contact Page configurations
      contactHeroTitle: formData.contactHeroTitle,
      contactHeroSubtitle: formData.contactHeroSubtitle,
      contactDescription: formData.contactDescription,
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
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Configure global announcements, contact channels, page layouts, and search SEO metadata</p>
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

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6 text-xs uppercase font-bold tracking-wider">
        {[
          { id: "general", label: "General & Contacts" },
          { id: "homepage", label: "Homepage & Hero" },
          { id: "pages", label: "About & Contact Pages" },
          { id: "footer", label: "Footer & SEO Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id)}
            className={`pb-3 transition-colors ${
              activeSubTab === tab.id
                ? "border-b-2 border-amber-500 text-amber-500"
                : "text-zinc-400 hover:text-zinc-650"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Forms Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-xs">
        
        {/* Core Settings Area (Left-Mid) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* ══ SUB-TAB: GENERAL ══ */}
          {activeSubTab === "general" && (
            <>
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

              {/* Support Channels */}
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
            </>
          )}

          {/* ══ SUB-TAB: HOMEPAGE & HERO ══ */}
          {activeSubTab === "homepage" && (
            <>
              {/* Visibility Toggles */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-playfair text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Homepage Sections Visibility</h3>
                <p className="text-[10px] text-zinc-500 leading-normal mb-4 font-light">Toggle on/off the modules rendered on the storefront homepage.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "showCertifications", label: "Certifications Bar" },
                    { name: "showCategories", label: "Featured Categories Grid" },
                    { name: "showFeaturedProducts", label: "Featured Products Grid" },
                    { name: "showWhyChooseUs", label: "Why Choose Us Bento" },
                    { name: "showBenefits", label: "Journey to Purity Timeline" },
                    { name: "showBestSellers", label: "Best Sellers Carousel" },
                    { name: "showTestimonials", label: "Testimonials Carousel" },
                    { name: "showBlogs", label: "Blog & Journal Section" },
                    { name: "showNewsletter", label: "Newsletter Card" },
                  ].map((s) => (
                    <label key={s.name} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 rounded-xl">
                      <input
                        type="checkbox"
                        name={s.name}
                        checked={!!formData[s.name]}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-amber-500 rounded border-zinc-300 cursor-pointer"
                      />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hero Banner settings */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-playfair text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Hero Wording & Slideshow</h3>
                
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-zinc-500">Hero Eyebrow Badge</label>
                  <input
                    type="text"
                    name="heroBadgeText"
                    value={formData.heroBadgeText}
                    onChange={handleInputChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">Title Line 1</label>
                    <input
                      type="text"
                      name="heroTitleLine1"
                      value={formData.heroTitleLine1}
                      onChange={handleInputChange}
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">Title Line 2 (Gradient)</label>
                    <input
                      type="text"
                      name="heroTitleLine2"
                      value={formData.heroTitleLine2}
                      onChange={handleInputChange}
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">Title Line 2 Suffix</label>
                    <input
                      type="text"
                      name="heroTitleLine2Suffix"
                      value={formData.heroTitleLine2Suffix}
                      onChange={handleInputChange}
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-zinc-500">Title Line 3 (Italicized)</label>
                  <input
                    type="text"
                    name="heroTitleLine3"
                    value={formData.heroTitleLine3}
                    onChange={handleInputChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-zinc-500">Hero Subtitle Description</label>
                  <textarea
                    name="heroSubtitle"
                    value={formData.heroSubtitle}
                    onChange={handleInputChange}
                    rows={2}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">Button Text</label>
                    <input
                      type="text"
                      name="heroButtonText"
                      value={formData.heroButtonText}
                      onChange={handleInputChange}
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">Homepage Slideshow Images</label>
                    
                    {/* List of current slides */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {(formData.heroImages ? formData.heroImages.split(",").map(i => i.trim()).filter(Boolean) : []).map((imgUrl, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 h-24 bg-zinc-100 dark:bg-zinc-800/30">
                          <img src={getImageUrl(imgUrl)} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveHeroImage(idx)}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-90 transition-opacity cursor-pointer shadow"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Upload new slide button */}
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-amber-500 rounded-xl h-24 cursor-pointer transition-colors bg-zinc-50/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                        {uploadingHeroImage ? (
                          <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                        ) : (
                          <>
                            <Plus className="w-5 h-5 text-zinc-400" />
                            <span className="text-[9px] font-bold text-zinc-400 uppercase mt-1">Add Image</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAddHeroImage}
                          className="hidden"
                          disabled={uploadingHeroImage}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Homepage Layout Section Ordering */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-playfair text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Homepage Sections Order</h3>
                <p className="text-[10px] text-zinc-500 leading-normal mb-4 font-light">Change the order in which sections appear on the homepage using Up & Down arrows.</p>
                
                <div className="space-y-2">
                  {(formData.homepageSectionOrder ? formData.homepageSectionOrder.split(",") : []).map((secKey, idx, arr) => (
                    <div key={secKey} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {idx + 1}. {sectionLabels[secKey] || secKey}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSection(idx, "up")}
                          className="p-1 hover:bg-zinc-250 dark:hover:bg-zinc-700 rounded text-zinc-500 disabled:opacity-30 transition-colors cursor-pointer"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === arr.length - 1}
                          onClick={() => handleMoveSection(idx, "down")}
                          className="p-1 hover:bg-zinc-250 dark:hover:bg-zinc-700 rounded text-zinc-500 disabled:opacity-30 transition-colors cursor-pointer"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ══ SUB-TAB: ABOUT & CONTACT PAGES ══ */}
          {activeSubTab === "pages" && (
            <>
              {/* About settings */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-playfair text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">About Page Content</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">About Hero Subtitle (Eyebrow)</label>
                    <input
                      type="text"
                      name="aboutHeroSubtitle"
                      value={formData.aboutHeroSubtitle}
                      onChange={handleInputChange}
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">About Hero Title Line 1</label>
                    <input
                      type="text"
                      name="aboutHeroTitleLine1"
                      value={formData.aboutHeroTitleLine1}
                      onChange={handleInputChange}
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">About Hero Title Line 2 (Gradient)</label>
                    <input
                      type="text"
                      name="aboutHeroTitleLine2"
                      value={formData.aboutHeroTitleLine2}
                      onChange={handleInputChange}
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">About Side Hero Image</label>
                    <div className="flex items-center space-x-4">
                      {formData.aboutHeroImage && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                          <img src={getImageUrl(formData.aboutHeroImage)} alt="About Hero" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className="flex items-center justify-center px-4 py-2 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-semibold text-zinc-700 dark:text-zinc-300">
                        {uploadingAboutImage ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        <span>{formData.aboutHeroImage ? "Change Image" : "Upload Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadAboutImage}
                          className="hidden"
                          disabled={uploadingAboutImage}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-zinc-500">About Story Paragraph 1</label>
                  <textarea
                    name="aboutParagraph1"
                    value={formData.aboutParagraph1}
                    onChange={handleInputChange}
                    rows={3}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-zinc-500">About Story Paragraph 2 (Highlighted border box)</label>
                  <textarea
                    name="aboutParagraph2"
                    value={formData.aboutParagraph2}
                    onChange={handleInputChange}
                    rows={3}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>
              </div>

              {/* Contact settings */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-playfair text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Contact Page Content</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">Contact Hero Subtitle (Eyebrow)</label>
                    <input
                      type="text"
                      name="contactHeroSubtitle"
                      value={formData.contactHeroSubtitle}
                      onChange={handleInputChange}
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">Contact Hero Title</label>
                    <input
                      type="text"
                      name="contactHeroTitle"
                      value={formData.contactHeroTitle}
                      onChange={handleInputChange}
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-zinc-500">Contact Supporting Description</label>
                  <textarea
                    name="contactDescription"
                    value={formData.contactDescription}
                    onChange={handleInputChange}
                    rows={2}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* ══ SUB-TAB: FOOTER & SEO ══ */}
          {activeSubTab === "footer" && (
            <>
              {/* Footer configurations */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-playfair text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Footer Branding & Copyright Details</h3>
                
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-zinc-500">Footer About Text</label>
                  <textarea
                    name="footerAboutText"
                    value={formData.footerAboutText}
                    onChange={handleInputChange}
                    rows={2}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    placeholder="Brief description about company shown in storefront footer..."
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-zinc-500">Footer Copyright Owner / Brand Name</label>
                  <input
                    type="text"
                    name="footerCopyright"
                    value={formData.footerCopyright}
                    onChange={handleInputChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    placeholder="e.g. Aarions Store"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-zinc-500">Footer Certifications (comma separated)</label>
                  <input
                    type="text"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    placeholder="e.g. FSSAI, ISO 22000, Organic India, Non-GMO"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-zinc-500">Secure Payments Badges (comma separated)</label>
                  <input
                    type="text"
                    name="paymentMethods"
                    value={formData.paymentMethods}
                    onChange={handleInputChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                    placeholder="e.g. Visa, Mastercard, UPI, Razorpay, PhonePe"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">Developer Company Name</label>
                    <input
                      type="text"
                      name="developerName"
                      value={formData.developerName}
                      onChange={handleInputChange}
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                      placeholder="e.g. Yakobu Business Solutions"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-zinc-500">Developer Website URL</label>
                    <input
                      type="text"
                      name="developerUrl"
                      value={formData.developerUrl}
                      onChange={handleInputChange}
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                      placeholder="e.g. https://www.myyakobu.com/"
                    />
                  </div>
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
            </>
          )}

        </div>

        {/* Action column (Right) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Social Channels card (rendered only on general tab to save space elsewhere) */}
          {activeSubTab === "general" && (
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
          )}

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
