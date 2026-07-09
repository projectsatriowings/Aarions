import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "../context/SettingsContext";
import Hero from "../components/home/Hero";
import Certifications from "../components/home/Certifications";
import FeaturedCategories from "../components/home/FeaturedCategories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Benefits from "../components/home/Benefits"; // Journey to Purity timeline
import BestSellers from "../components/home/BestSellers"; // Carousel best sellers
import Testimonials from "../components/home/Testimonials";
import BlogSection from "../components/home/BlogSection";
import Newsletter from "../components/home/Newsletter";
import QuickViewModal from "../components/common/QuickViewModal";

export default function Home() {
  const { settings } = useSettings();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const sectionsOrder = settings?.homepageSectionOrder
    ? settings.homepageSectionOrder.split(",").map(s => s.trim()).filter(Boolean)
    : ["certifications", "categories", "featuredProducts", "whyChooseUs", "benefits", "bestSellers", "testimonials", "blogs", "newsletter"];

  const renderSection = (key) => {
    switch (key) {
      case "certifications":
        return settings?.showCertifications !== false ? <Certifications key="certifications" /> : null;
      case "categories":
        return settings?.showCategories !== false ? <FeaturedCategories key="categories" /> : null;
      case "featuredProducts":
        return settings?.showFeaturedProducts !== false ? <FeaturedProducts key="featuredProducts" onQuickView={handleQuickView} /> : null;
      case "whyChooseUs":
        return settings?.showWhyChooseUs !== false ? <WhyChooseUs key="whyChooseUs" /> : null;
      case "benefits":
        return settings?.showBenefits !== false ? <Benefits key="benefits" /> : null;
      case "bestSellers":
        return settings?.showBestSellers !== false ? <BestSellers key="bestSellers" onQuickView={handleQuickView} /> : null;
      case "testimonials":
        return settings?.showTestimonials !== false ? <Testimonials key="testimonials" /> : null;
      case "blogs":
        return settings?.showBlogs !== false ? <BlogSection key="blogs" /> : null;
      case "newsletter":
        return settings?.showNewsletter !== false ? <Newsletter key="newsletter" /> : null;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full relative"
    >
      {/* 1. Hero Showcase */}
      <Hero />

      {/* Dynamic Ordered Sections */}
      {sectionsOrder.map((sectionKey) => renderSection(sectionKey))}

      {/* Quick View Modal Overlay */}
      {selectedProduct && (
        <QuickViewModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </motion.div>
  );
}
