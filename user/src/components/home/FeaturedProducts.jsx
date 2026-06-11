import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { products as staticProducts } from "../../data/products";
import ProductCard from "../common/ProductCard";
import api from "../../services/api";

export default function FeaturedProducts({ onQuickView }) {
  const sectionRef = useRef(null);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/products?limit=8");
        if (res.data.success) {
          setFeatured(res.data.products);
        }
      } catch (err) {
        console.error("Failed to load featured products from API, falling back to static.", err);
        setFeatured(staticProducts.slice(0, 8));
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, index) => {
              setTimeout(() => el.classList.add("visible"), index * 65);
            });
          }
        });
      },
      { threshold: 0.04 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [loading]);

  return (
    <section
      ref={sectionRef}
      className="fp-section py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="fp-header reveal">
          <div className="fp-header-left space-y-2">
            <div className="fp-label">
              <svg className="w-3.5 h-3.5 text-brand-gold" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              <span>Handpicked For You</span>
            </div>
            <h2 className="fp-title">
              Featured Products
            </h2>
            <p className="fp-subtitle font-light">
              Our most loved natural products — pure ingredients, authentic flavors, trusted by thousands.
            </p>
          </div>

          <Link
            to="/shop"
            className="fp-view-all"
          >
            <span>View All Products</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold" />
          </div>
        ) : (
          <div className="fp-grid">
            {featured.map((product, idx) => (
              <div
                key={product._id || product.id}
                className="reveal"
                style={{ transitionDelay: `${(idx % 4) * 65}ms` }}
              >
                <ProductCard product={product} onQuickView={onQuickView} />
              </div>
            ))}
          </div>
        )}

        {/* Mobile View All CTA */}
        <div className="fp-mobile-cta reveal">
          <Link
            to="/shop"
            className="btn-primary w-full justify-center"
          >
            <span>Explore All Products</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
