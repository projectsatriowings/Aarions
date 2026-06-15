import React, { useRef, useEffect, useState } from "react";
import { Leaf, Scroll, ShieldCheck, Award, Gift, Users, Star } from "lucide-react";
import { motion } from "framer-motion";

// Pure React Count-Up Component triggered on viewport intersection
function AnimatedCounter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    
    const match = String(value).match(/^([\d.]+)(.*)$/);
    if (!match) {
      setCount(value);
      return;
    }
    
    const targetNum = parseFloat(match[1]);
    const isDecimal = match[1].includes(".");
    
    const startTime = performance.now();
    let animationFrameId;
    
    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const easeProgress = progress * (2 - progress); // Ease Out Quad
      const currentVal = easeProgress * targetNum;
      
      setCount(isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(targetNum);
      }
    };
    
    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, value, duration]);

  const suffix = String(value).replace(/^[\d.]+/, "");

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  );
}

export default function WhyChooseUs() {
  const bentoItems = [
    {
      icon: Leaf,
      title: "Pure Ingredients",
      desc: "Every ingredient traced to its source. No fillers, no adulterants — ever.",
      color: "#355E3B",
      bg: "rgba(53, 94, 59, 0.08)"
    },
    {
      icon: Scroll,
      title: "Traditional Recipes",
      desc: "Ancient wisdom meets modern standards. Our masalas follow centuries-old family recipes.",
      color: "#E8A317",
      bg: "rgba(232, 163, 23, 0.08)"
    },
    {
      icon: ShieldCheck,
      title: "Quality Tested",
      desc: "Every batch lab-tested for purity, potency, and food safety compliance.",
      color: "#B23A2E",
      bg: "rgba(178, 58, 46, 0.08)"
    },
    {
      icon: Award,
      title: "Ethically Sourced",
      desc: "We partner with verified farms and beekeepers who share our values of sustainability.",
      color: "#C8870F",
      bg: "rgba(200, 135, 15, 0.08)"
    },
    {
      icon: Gift,
      title: "Premium Packaging",
      desc: "Designed to preserve freshness and make an impression — eco-friendly and stunning.",
      color: "#4A3428",
      bg: "rgba(74, 52, 40, 0.08)"
    },
    {
      icon: Users,
      title: "5000+ Families Trust Us",
      desc: "From Chennai to Mumbai, thousands of families rely on Aarions daily.",
      color: "#355E3B",
      bg: "rgba(53, 94, 59, 0.08)"
    }
  ];

  const stats = [
    { 
      value: "5000+", 
      label: "Happy Customers", 
      sub: "and growing",
      icon: Users,
      glowColor: "rgba(53, 94, 59, 0.12)",
      bg: "rgba(53, 94, 59, 0.08)"
    },
    { 
      value: "13+", 
      label: "Premium Products", 
      sub: "carefully curated",
      icon: Gift,
      glowColor: "rgba(232, 163, 23, 0.12)",
      bg: "rgba(232, 163, 23, 0.08)"
    },
    { 
      value: "4.9/5", 
      label: "Average Rating", 
      sub: "across all products",
      icon: Star,
      glowColor: "rgba(178, 58, 46, 0.12)",
      bg: "rgba(178, 58, 46, 0.08)"
    },
    { 
      value: "100%", 
      label: "Natural & Pure", 
      sub: "zero compromise",
      icon: Leaf,
      glowColor: "rgba(53, 94, 59, 0.12)",
      bg: "rgba(53, 94, 59, 0.08)"
    }
  ];

  // Animation Variants
  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 13 }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 65, damping: 12 }
    }
  };

  return (
    <section className="section-pad bg-[#FFF8EC] relative overflow-hidden">
      {/* Background Ambient Glowing Orbs */}
      <div 
        className="absolute rounded-full pointer-events-none opacity-30 blur-3xl z-0"
        style={{
          top: "10%",
          left: "5%",
          width: "20rem",
          height: "20rem",
          background: "radial-gradient(circle, rgba(232,163,23,0.15) 0%, transparent 70%)"
        }}
      />
      <div 
        className="absolute rounded-full pointer-events-none opacity-30 blur-3xl z-0"
        style={{
          bottom: "10%",
          right: "5%",
          width: "25rem",
          height: "25rem",
          background: "radial-gradient(circle, rgba(53,94,59,0.12) 0%, transparent 70%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10 lg:mb-14"
        >
          <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
            Our Commitment
          </span>
          <h2 className="font-display font-bold text-brand-brown text-3xl sm:text-4xl lg:text-5xl mb-3">
            Why Choose Aarions?
          </h2>
          <p className="text-brand-brown/60 text-base lg:text-lg max-w-xl mx-auto font-light">
            We're not just selling products — we're building a lifestyle around natural purity.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {bentoItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="group premium-bento-card p-8 cursor-pointer flex flex-col justify-between h-full hover:shadow-lg hover:shadow-brand-gold/5"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
                    style={{ backgroundColor: item.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="font-display font-bold text-brand-brown text-xl mb-3">
                    {item.title}
                  </h3>
                  <p className="text-brand-brown/65 leading-relaxed text-sm lg:text-base font-light">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Counters Block */}
        <motion.div 
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 mb-4"
        >
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div 
                key={idx} 
                variants={statVariants}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="glass-card glass-card-hover premium-sheen p-6 lg:p-8 rounded-3xl text-center relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer"
              >
                {/* Glow backdrop effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${s.glowColor} 0%, transparent 70%)`
                  }}
                />
                
                {/* Top thin accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold to-brand-darkGold opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Floating icon */}
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0"
                  style={{ backgroundColor: s.bg }}
                >
                  <Icon className="w-5.5 h-5.5 text-brand-gold" />
                </div>
                
                <div className="font-display font-bold text-3xl lg:text-4xl text-gradient tracking-tight mb-1">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="text-brand-brown/80 text-sm font-semibold tracking-wide">
                  {s.label}
                </div>
                <div className="text-brand-brown/40 text-xs mt-0.5">
                  {s.sub}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
