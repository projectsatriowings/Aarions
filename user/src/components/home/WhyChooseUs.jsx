import React, { useRef, useEffect, useState } from "react";
import { Leaf, Scroll, ShieldCheck, Award, Gift, Users, Star } from "lucide-react";

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
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, index) => {
              setTimeout(() => el.classList.add("visible"), index * 80);
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

  return (
    <section
      ref={sectionRef}
      className="section-pad bg-[#FFF8EC] relative overflow-hidden"
    >
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
        <div className="text-center mb-10 lg:mb-14 reveal">
          <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
            Our Commitment
          </span>
          <h2 className="font-display font-bold text-brand-brown text-3xl sm:text-4xl lg:text-5xl mb-3">
            Why Choose Aarions?
          </h2>
          <p className="text-brand-brown/60 text-base lg:text-lg max-w-xl mx-auto font-light">
            We're not just selling products — we're building a lifestyle around natural purity.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {bentoItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="reveal group premium-bento-card p-8 cursor-default flex flex-col justify-between h-full"
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
              </div>
            );
          })}
        </div>

        {/* Counters Block */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 mb-4">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx} 
                className="reveal glass-card glass-card-hover premium-sheen p-6 lg:p-8 rounded-3xl text-center relative overflow-hidden flex flex-col items-center justify-center group cursor-default"
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
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

