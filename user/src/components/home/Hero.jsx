import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../context/SettingsContext";

export default function Hero() {
  const { settings } = useSettings();
  const bgImages = settings?.heroImages
    ? settings.heroImages.split(",").map(img => img.trim()).filter(Boolean)
    : [
        "/bg-ghee.webp",
        "/bg-honey.webp",
        "/bg-spices.webp",
        "/bg-masala.webp",
        "/auth-honey.webp",
        "/auth-spices-dark.webp"
      ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % (bgImages.length || 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [bgImages.length]);

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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center overflow-hidden bg-brand-brown"
      style={{ minHeight: "100svh" }}
    >
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBgIndex}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0 }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={bgImages[currentBgIndex]}
              alt="Organic Farm Background"
              width="1920"
              height="1080"
              loading="eager"
              fetchpriority="high"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Luxury Dark Brown Gradient Overlays */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none" 
        style={{
          background: "linear-gradient(135deg, rgba(45,31,23,0.92) 0%, rgba(45,31,23,0.72) 55%, rgba(26,14,8,0.85) 100%)"
        }}
      />
      <div 
        className="absolute inset-0 z-1 pointer-events-none" 
        style={{
          background: "linear-gradient(to top, rgba(45,31,23,0.6) 0%, transparent 50%)"
        }}
      />

      {/* Ambient Radial Flares */}
      <div 
        className="absolute rounded-full pointer-events-none z-1" 
        style={{
          top: "25%",
          right: "20%",
          width: "24rem",
          height: "24rem",
          background: "radial-gradient(circle, rgba(232,163,23,0.12) 0%, transparent 70%)"
        }}
      />
      <div 
        className="absolute rounded-full pointer-events-none hidden lg:block z-1" 
        style={{
          bottom: "30%",
          left: "10%",
          width: "16rem",
          height: "16rem",
          background: "radial-gradient(circle, rgba(178,58,46,0.08) 0%, transparent 70%)"
        }}
      />

      {/* Decorative Gold Circles */}
      <div 
        className="absolute spin-slow pointer-events-none hidden xl:block z-1" 
        style={{ top: "5rem", left: "4rem", opacity: 0.18 }}
      >
        <div className="rounded-full border border-brand-gold" style={{ width: "8rem", height: "8rem" }} />
        <div className="rounded-full border absolute border-brand-gold/50" style={{ inset: "1rem" }} />
        <div className="rounded-full border absolute border-brand-gold/25" style={{ inset: "2rem" }} />
      </div>

      {/* Main Hero Content Grid */}
      <div className="relative z-10 site-container-fluid py-24 md:py-32 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Eyebrow badge */}
            <div 
              className="glass-dark animate-fade-up flex items-center gap-2 rounded-full"
              style={{ display: "inline-flex", padding: "0.5rem 1rem" }}
            >
              <span className="pulse-glow rounded-full bg-brand-gold" style={{ width: "0.5rem", height: "0.5rem", display: "inline-block" }} />
              <span style={{ color: "#E8A317", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em" }}>
                {settings?.heroBadgeText || "Premium Natural Products Since 2020"}
              </span>
            </div>

            {/* Heading */}
            <h1 
              className="font-display font-bold text-white leading-tight tracking-tight animate-fade-up"
              style={{ fontSize: "clamp(2.25rem, 5.2vw, 4.5rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              {settings?.heroTitleLine1 || "Pure Organic Honey,"} <br />
              <span className="text-gradient">{settings?.heroTitleLine2 || "A2 Ghee"}</span>
              {settings?.heroTitleLine2Suffix || " & Authentic Spices."} <br />
              <em className="not-italic" style={{ color: "rgba(255,248,236,0.88)", fontStyle: "italic" }}>
                {settings?.heroTitleLine3 || "Healthy Living Products."}
              </em>
            </h1>

            {/* Supporting paragraph */}
            <p 
              className="mb-8 font-light"
              style={{ color: "rgba(255,255,255,0.68)", fontSize: "clamp(0.95rem, 2vw, 1.15rem)", lineHeight: 1.75, maxWidth: "620px" }}
            >
              {settings?.heroSubtitle || "Bringing nature's finest honey, ghee, masalas, and spices directly from farm to your family's kitchen."}
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              <Link to="/shop" className="btn-primary">
                <span>{settings?.heroButtonText || "Shop Collection"}</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

            </div>

          </div>

          {/* Right Column: Floating Product Cards (Desktop only) */}
          <div className="hidden lg:block lg:col-span-5 relative h-[480px] w-full self-center">
            
            {/* 1. Gir Cow Ghee (Top Right) */}
            <div className="absolute float-slow pointer-events-none" style={{ top: "10px", right: "20px" }}>
              <div className="relative">
                <div 
                  className="rounded-full overflow-hidden border-2"
                  style={{ width: "8.5rem", height: "8.5rem", borderColor: "rgba(232, 163, 23, 0.2)", boxShadow: "0 10px 30px rgba(232,163,23,0.15)" }}
                >
                  <img 
                    src="/ghee-hero.webp" 
                    alt="Gir Cow Ghee" 
                    width="136"
                    height="136"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className="glass-dark rounded-lg absolute z-20 whitespace-nowrap shadow-md" 
                  style={{ bottom: "-0.25rem", left: "50%", transform: "translateX(-50%)", padding: "0.35rem 0.75rem" }}
                >
                  <div style={{ color: "#E8A317", fontSize: "0.68rem", fontWeight: 700 }}>Gir Cow Ghee</div>
                </div>
              </div>
            </div>

            {/* 2. Forest Honey (Bottom Left) */}
            <div className="absolute float-slow pointer-events-none" style={{ bottom: "20px", left: "10px" }}>
              <div className="relative">
                <div 
                  className="rounded-2xl overflow-hidden border-2"
                  style={{ width: "10rem", height: "10rem", borderColor: "rgba(232, 163, 23, 0.2)", boxShadow: "0 10px 30px rgba(232,163,23,0.15)" }}
                >
                  <img 
                    src="/honey-hero.webp" 
                    alt="Forest Honey" 
                    width="160"
                    height="160"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className="glass-dark rounded-xl absolute z-20 shadow-md" 
                  style={{ bottom: "-0.5rem", left: "-0.5rem", padding: "0.5rem 0.75rem", width: "10rem" }}
                >
                  <div style={{ color: "#E8A317", fontSize: "0.75rem", fontWeight: 700 }}>Forest Honey</div>
                  <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.72rem" }}>₹180 / 500g</div>
                </div>
              </div>
            </div>

            {/* 3. Spices Circle (Middle Center-Right) */}
            <div className="absolute float-fast pointer-events-none" style={{ top: "160px", left: "185px" }}>
              <div className="relative">
                <div 
                  className="rounded-full overflow-hidden border-2"
                  style={{ width: "7rem", height: "7rem", borderColor: "rgba(178,58,46,0.25)", boxShadow: "0 10px 30px rgba(178,58,46,0.15)" }}
                >
                  <img 
                    src="/spices-hero.webp" 
                    alt="Organic Spices" 
                    width="112"
                    height="112"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className="glass-dark rounded-lg absolute z-20 whitespace-nowrap shadow-md" 
                  style={{ bottom: "-0.25rem", left: "50%", transform: "translateX(-50%)", padding: "0.35rem 0.65rem" }}
                >
                  <div style={{ color: "#E8A317", fontSize: "0.62rem", fontWeight: 700 }}>Organic Spices</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
