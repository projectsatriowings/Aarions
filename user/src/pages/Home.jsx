import React, { useState } from "react";
import { motion } from "framer-motion";
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
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
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

      {/* 2. Certifications & Trust Pillars */}
      <Certifications />

      {/* 3. Featured Categories Grid */}
      <FeaturedCategories />

      {/* 4. Featured Products (8 Grid) */}
      <FeaturedProducts onQuickView={handleQuickView} />

      {/* 5. Why Choose Us (Bento Layout + Counters) */}
      <WhyChooseUs />

      {/* 6. Journey to Purity (Dark Timeline Section) */}
      <Benefits />

      {/* 7. Best Sellers Carousel Section */}
      <BestSellers onQuickView={handleQuickView} />

      {/* 8. Testimonials Section */}
      <Testimonials />

      {/* 9. Blog / Journal Section */}
      <BlogSection />

      {/* 10. Newsletter Card Section */}
      <Newsletter />

      {/* Quick View Modal Overlay */}
      {selectedProduct && (
        <QuickViewModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </motion.div>
  );
}
