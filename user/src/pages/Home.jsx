import React, { useState, useRef, useEffect } from "react";
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

function LazySection({ children, minHeight = "350px" }) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof navigator !== "undefined" && /bot|crawl|slurp|spider/i.test(navigator.userAgent)) {
      return true;
    }
    return false;
  });
  const ref = useRef(null);

  useEffect(() => {
    if (isVisible) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={ref} style={{ minHeight: isVisible ? undefined : minHeight }}>
      {isVisible ? children : null}
    </div>
  );
}

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
        return settings?.showBestSellers !== false ? (
          <LazySection key="bestSellers">
            <BestSellers onQuickView={handleQuickView} />
          </LazySection>
        ) : null;
      case "testimonials":
        return settings?.showTestimonials !== false ? (
          <LazySection key="testimonials">
            <Testimonials />
          </LazySection>
        ) : null;
      case "blogs":
        return settings?.showBlogs !== false ? (
          <LazySection key="blogs">
            <BlogSection />
          </LazySection>
        ) : null;
      case "newsletter":
        return settings?.showNewsletter !== false ? (
          <LazySection key="newsletter" minHeight="250px">
            <Newsletter />
          </LazySection>
        ) : null;
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
