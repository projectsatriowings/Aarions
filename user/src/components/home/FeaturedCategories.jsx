import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getImageUrl } from "../../services/api";
import Loader from "../common/Loader";

export default function FeaturedCategories() {
  const sectionRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const staticCategories = [
    {
      id: 1,
      name: "Ghee",
      slug: "ghee",
      count: 3,
      description: "Traditional clarifying butter churned from pure cream",
      image: "/products/ghir_ghee.webp",
      color: "#E8A317"
    },
    {
      id: 2,
      name: "Honey",
      slug: "honey",
      count: 6,
      description: "Pure raw honey sourced from forests and mountains",
      image: "/aarions-raw-honey.webp",
      color: "#E8A317"
    },
    {
      id: 3,
      name: "Masalas",
      slug: "masala",
      count: 6,
      description: "Authentic spice blends crafted from traditional recipes",
      image: "/products/mutton_masala.webp",
      color: "#E8A317"
    },
    {
      id: 4,
      name: "Spices",
      slug: "spices",
      count: 3,
      description: "Single-origin premium spices slow-ground to preserve oils",
      image: "/products/turmeric_powder.webp",
      color: "#E8A317"
    }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        if (res.data.success) {
          const mapped = res.data.categories.map((cat, idx) => ({
            id: cat._id || idx,
            name: cat.name,
            slug: cat.slug,
            count: cat.productCount !== undefined ? cat.productCount : 0,
            description: cat.description || `Premium organic ${cat.name.toLowerCase()} sourced traditionally.`,
            image: cat.image || "/logo.webp?v=3",
          }));
          setCategories(mapped);
        }
      } catch (err) {
        console.error("Failed to load categories from API, falling back to static.", err);
        setCategories(staticCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, index) => {
              setTimeout(() => el.classList.add("visible"), index * 100);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [loading]);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 bg-transparent overflow-hidden"
    >
      <div className="site-container">
        
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16 reveal">
          <span className="inline-block text-brand-gold text-sm font-semibold tracking-widest uppercase mb-3">
            Our Range
          </span>
          <h2 className="font-display font-bold text-brand-brown mb-3 text-3xl sm:text-4xl lg:text-5xl">
            Shop Organic Categories: Pure Honey, Ghee & Spices
          </h2>
          <p className="text-brand-brown/60 text-base lg:text-lg max-w-xl mx-auto font-light">
            From wild-harvested honeys to stone-ground spices — every category crafted with intention.
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="reveal group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-2.5 transition-all duration-500 h-96 w-full block"
              >
                {/* Background Image & Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/95 via-brand-brown/50 to-brand-brown/10" />
                </div>

                {/* Text / Overlay Details */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div className="space-y-2">
                      <div
                        className="text-xs font-bold tracking-widest uppercase"
                        style={{ color: "#E8A317" }}
                      >
                        {cat.count} Products
                      </div>
                      <h3 className="font-display font-bold text-white text-xl sm:text-2xl leading-none">
                        {cat.name}
                      </h3>
                      <p className="text-white/80 text-xs leading-relaxed font-light line-clamp-3">
                        {cat.description}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 ml-3 flex-shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
