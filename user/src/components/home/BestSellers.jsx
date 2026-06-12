import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { products as staticProducts } from "../../data/products";
import ProductCard from "../common/ProductCard";
import api from "../../services/api";

export default function BestSellers({ onQuickView }) {
  const carouselRef = useRef(null);
  const sectionRef = useRef(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await api.get("/products?limit=50");
        if (res.data.success) {
          const bs = res.data.products.filter((p) =>
            p.isBestSeller || ["Best Seller", "Wild Harvested", "Luxury", "Rare"].includes(p.badge)
          );
          setBestSellers(bs);
        }
      } catch (err) {
        console.error("Failed to load best sellers from API, falling back to static.", err);
        const bs = staticProducts.filter((p) =>
          ["Best Seller", "Wild Harvested", "Luxury", "Rare"].includes(p.badge)
        );
        setBestSellers(bs);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  useEffect(() => {
    if (loading || bestSellers.length <= 1 || isHovered || !isIntersecting) return;

    const interval = setInterval(() => {
      const container = carouselRef.current;
      if (container) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 310, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [loading, bestSellers, isHovered, isIntersecting]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, index) => {
              setTimeout(() => el.classList.add("visible"), index * 70);
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

  const handleScroll = (direction) => {
    const container = carouselRef.current;
    if (container) {
      const scrollAmount = direction * 310;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="bs-section py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-end justify-between gap-4 mb-10 lg:mb-12">
          <div className="reveal space-y-2 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-brand-gold">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>Most Popular</span>
            </div>
            <h2 className="font-display font-bold text-brand-brown text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Best Sellers
            </h2>
            <p className="text-brand-brown/50 text-sm mt-1 max-w-md">
              Loved by thousands of natural living enthusiasts
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 flex-shrink-0 self-start sm:self-auto">
            <div className="bs-arrows">
              <button
                className="bs-arrow"
                onClick={() => handleScroll(-1)}
                aria-label="Previous Slide"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="bs-arrow"
                onClick={() => handleScroll(1)}
                aria-label="Next Slide"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <Link
              to="/shop"
              className="fp-view-all hidden sm:inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-brand-brown hover:text-brand-gold transition-colors duration-300"
            >
              <span>View All</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Carousel Area */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold" />
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="bs-carousel reveal pb-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {bestSellers.map((product) => (
              <div
                key={product._id || product.id}
                className="bs-card-wrap flex-shrink-0"
              >
                <ProductCard product={product} onQuickView={onQuickView} />
              </div>
            ))}
          </div>
        )}

        {/* Mobile View All CTA */}
        <div className="text-center mt-6 sm:hidden reveal">
          <Link
            to="/shop"
            className="btn-primary w-full justify-center"
          >
            <span>View All Best Sellers</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
