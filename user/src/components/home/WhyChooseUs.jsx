import React, { useRef, useEffect, useState } from "react";
import { Leaf, FlaskConical, CookingPot, Users, Award, Gift, Star, ArrowRight, Droplet, Heart, ShieldCheck } from "lucide-react";
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
      desc: "Carefully sourced from trusted farms. No fillers, no adulterants — only nature's finest.",
      color: "#355E3B",
      bg: "#EAF2ED",
      imgSrc: "/pure_ingredients.png",
      imgType: "transparent"
    },
    {
      icon: FlaskConical,
      title: "Quality Tested",
      desc: "Every batch is lab-tested for purity, potency and safety. Because you deserve the best.",
      color: "#C8870F",
      bg: "#FCF4E5",
      imgSrc: "/quality_tested.png",
      imgType: "transparent"
    },
    {
      icon: CookingPot,
      title: "Traditional Recipes",
      desc: "Our products follow ancient recipes and time-honored methods for maximum goodness.",
      color: "#8A5E48",
      bg: "#F6EFEB",
      imgSrc: "/traditional_recipes.png",
      imgType: "transparent"
    },
    {
      icon: Users,
      title: "5000+ Families Trust Us",
      desc: "From Chennai to Mumbai, thousands of families rely on Aarions for pure wellness.",
      color: "#A07050",
      bg: "#F9EFE5",
      imgSrc: "/happy_families.png",
      imgType: "family-card"
    },
    {
      icon: Award,
      title: "Ethically Sourced",
      desc: "We work directly with farmers and beekeepers who share our values and vision.",
      color: "#2E5E4E",
      bg: "#E8F0EC",
      imgSrc: "/ethically_sourced.png",
      imgType: "farmer-cutout"
    },
    {
      icon: Gift,
      title: "Premium Packaging",
      desc: "Designed to preserve freshness, nutrition and crafted to make an impression.",
      color: "#5D4E43",
      bg: "#F3EDE6",
      imgSrc: "/premium_packaging.png",
      imgType: "transparent"
    }
  ];

  const stats = [
    { 
      value: "5000+", 
      label: "Happy Customers", 
      sub: "and growing",
      icon: Users,
      bg: "#FCF4E5",
      color: "#C8870F"
    },
    { 
      value: "13+", 
      label: "Premium Products", 
      sub: "carefully curated",
      icon: Gift,
      bg: "#FCF4E5",
      color: "#C8870F"
    },
    { 
      value: "4.9/5", 
      label: "Average Rating", 
      sub: "across all products",
      icon: Star,
      bg: "#F6EFEB",
      color: "#C8870F"
    },
    { 
      value: "100%", 
      label: "Natural & Pure", 
      sub: "zero compromise",
      icon: Leaf,
      bg: "#EAF2ED",
      color: "#C8870F"
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
    <section 
      className="section-pad bg-[#FFF8EC] relative overflow-hidden py-20 lg:py-28"
      style={{
        backgroundImage: "radial-gradient(rgba(232, 163, 23, 0.04) 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px"
      }}
    >
      {/* Sketched leafy branches left */}
      <div className="absolute left-0 top-[12%] w-[150px] md:w-[220px] pointer-events-none select-none opacity-20 md:opacity-40 z-0">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-brand-gold/60 stroke-[1.5]">
          <path d="M 0,90 Q 20,80 40,65 Q 60,50 80,20 Q 90,5 95,0" />
          <path d="M 40,65 Q 20,55 10,48 M 40,65 Q 35,45 38,35" />
          <path d="M 10,48 C 5,45 8,40 18,43 C 28,46 25,51 10,48 Z" className="fill-brand-gold/5" />
          <path d="M 38,35 C 34,30 38,25 46,30 C 54,35 50,40 38,35 Z" className="fill-brand-gold/5" />
          <path d="M 60,50 Q 45,35 50,28 M 60,50 Q 65,35 72,30" />
          <path d="M 50,28 C 45,24 50,18 58,22 C 66,26 62,32 50,28 Z" className="fill-brand-gold/5" />
          <path d="M 72,30 C 70,24 76,20 82,26 C 88,32 82,36 72,30 Z" className="fill-brand-gold/5" />
          <path d="M 80,20 Q 70,8 75,2 M 80,20 Q 88,10 93,8" />
          <path d="M 75,2 C 72,-3 78,-5 82,0 C 86,5 82,7 75,2 Z" className="fill-brand-gold/5" />
          <path d="M 93,8 C 93,2 99,2 97,8 C 95,14 93,14 93,8 Z" className="fill-brand-gold/5" />
        </svg>
      </div>

      {/* Sketched leafy branches right */}
      <div className="absolute right-0 top-[22%] w-[150px] md:w-[220px] pointer-events-none select-none opacity-20 md:opacity-40 z-0 scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-brand-gold/60 stroke-[1.5]">
          <path d="M 0,90 Q 20,80 40,65 Q 60,50 80,20 Q 90,5 95,0" />
          <path d="M 40,65 Q 20,55 10,48 M 40,65 Q 35,45 38,35" />
          <path d="M 10,48 C 5,45 8,40 18,43 C 28,46 25,51 10,48 Z" className="fill-brand-gold/5" />
          <path d="M 38,35 C 34,30 38,25 46,30 C 54,35 50,40 38,35 Z" className="fill-brand-gold/5" />
          <path d="M 60,50 Q 45,35 50,28 M 60,50 Q 65,35 72,30" />
          <path d="M 50,28 C 45,24 50,18 58,22 C 66,26 62,32 50,28 Z" className="fill-brand-gold/5" />
          <path d="M 72,30 C 70,24 76,20 82,26 C 88,32 82,36 72,30 Z" className="fill-brand-gold/5" />
          <path d="M 80,20 Q 70,8 75,2 M 80,20 Q 88,10 93,8" />
          <path d="M 75,2 C 72,-3 78,-5 82,0 C 86,5 82,7 75,2 Z" className="fill-brand-gold/5" />
          <path d="M 93,8 C 93,2 99,2 97,8 C 95,14 93,14 93,8 Z" className="fill-brand-gold/5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-14 lg:mb-20 relative flex flex-col items-center"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[1px] w-8 bg-brand-gold/60" />
            <span className="text-brand-gold text-xs font-bold tracking-[0.25em] uppercase">
              Our Commitment
            </span>
            <div className="h-[1px] w-8 bg-brand-gold/60" />
          </div>
          
          <h2 className="font-display font-bold text-brand-brown text-3xl sm:text-4xl lg:text-[45px] mb-4 leading-tight">
            Why Choose Aarions?
          </h2>
          
          {/* Symmetrical Wheat spikes divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-14 bg-brand-gold/20" />
            <svg viewBox="0 0 100 20" className="w-20 h-5 fill-brand-gold/80">
              <line x1="10" y1="10" x2="90" y2="10" stroke="#E8A317" strokeWidth="1.5" />
              <path d="M 30,10 C 25,5 22,10 30,10 Z M 40,10 C 35,5 32,10 40,10 Z M 50,10 C 45,5 42,10 50,10 Z M 60,10 C 55,5 52,10 60,10 Z M 70,10 C 65,5 62,10 70,10 Z" />
              <path d="M 30,10 C 25,15 22,10 30,10 Z M 40,10 C 35,15 32,10 40,10 Z M 50,10 C 45,15 42,10 50,10 Z M 60,10 C 55,15 52,10 60,10 Z M 70,10 C 65,15 62,10 70,10 Z" />
              <path d="M 80,10 C 75,5 72,10 80,10 Z M 80,10 C 75,15 72,10 80,10 Z" />
            </svg>
            <div className="h-[1px] w-14 bg-brand-gold/20" />
          </div>

          <p className="text-brand-brown/85 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
            We go beyond selling products. We bring you a promise of purity, rooted in tradition and backed by trust.
          </p>
        </motion.div>

        {/* Bento Grid (3-column, 2-row layout) */}
        <motion.div 
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {bentoItems.map((item, idx) => {
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover="hover"
                className="group relative rounded-[2rem] bg-white border border-brand-gold/10 hover:border-brand-gold/30 shadow-[0_8px_30px_rgba(45,31,23,0.02)] hover:shadow-[0_24px_50px_rgba(45,31,23,0.08)] transition-all duration-500 cursor-pointer overflow-hidden h-full flex flex-col justify-between"
              >
                {/* Double-border luxury inner frame */}
                <div className="absolute inset-2 rounded-[1.5rem] border border-brand-gold/5 pointer-events-none group-hover:border-brand-gold/15 transition-colors duration-500 z-0" />

                {/* Soft glow backdrop */}
                <motion.div 
                  variants={{
                    hover: { opacity: 0.12, scale: 1.2, transition: { duration: 0.4 } }
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  className="absolute -right-20 -bottom-20 w-48 h-48 rounded-full pointer-events-none blur-3xl z-0"
                  style={{ background: item.color }}
                />

                <div className="relative p-7 sm:p-8 flex justify-between gap-4 h-full z-10">
                  <div className="flex-1 flex flex-col justify-between h-full relative z-10">
                    <div>
                      {/* Icon with spring scale and rotate on hover */}
                      <motion.div
                        variants={{
                          hover: { scale: 1.12, rotate: 8, transition: { type: "spring", stiffness: 300, damping: 15 } }
                        }}
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-6 flex-shrink-0"
                        style={{ backgroundColor: item.bg }}
                      >
                        <Icon className="w-5.5 h-5.5" style={{ color: item.color }} />
                      </motion.div>
                      
                      {/* Title */}
                      <h3 className="font-display font-bold text-brand-brown text-[19px] sm:text-[20px] mb-3 group-hover:text-brand-gold transition-colors duration-300">
                        {item.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-brand-brown/70 leading-relaxed text-xs sm:text-[13px] font-medium max-w-[175px]">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Visual graphics side alignment with spring scale/zoom */}
                  {item.imgType === "transparent" && (
                    <div className="w-32 h-32 md:w-36 md:h-36 self-center select-none flex-shrink-0 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-brand-gold/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                      <motion.img 
                        variants={{
                          hover: { scale: 1.1, y: -4, rotate: 2, transition: { type: "spring", stiffness: 200, damping: 14 } }
                        }}
                        src={item.imgSrc} 
                        alt={item.title}
                        className="max-w-full max-h-full object-contain relative z-10" 
                      />
                    </div>
                  )}

                  {item.imgType === "family-card" && (
                    <div className="relative w-[110px] h-[110px] md:w-[125px] md:h-[125px] self-center flex-shrink-0 select-none">
                      <motion.img 
                        variants={{
                          hover: { scale: 1.08, y: -3, rotate: -1, transition: { type: "spring", stiffness: 200, damping: 14 } }
                        }}
                        src={item.imgSrc} 
                        alt={item.title}
                        className="w-full h-full object-cover rounded-2xl border-2 border-brand-gold/15 group-hover:border-brand-gold/30 transition-colors duration-500 shadow-sm"
                      />
                      {/* Badge overlay at bottom */}
                      <div className="absolute bottom-[-6px] left-[5%] right-[5%] bg-gradient-to-r from-brand-gold to-brand-darkGold text-brand-brown font-extrabold text-[8px] md:text-[9px] py-1 rounded-full shadow-md text-center flex items-center justify-center gap-0.5 whitespace-nowrap z-20">
                        <span className="text-[10px]">★</span>
                        <span>5000+ Happy Families</span>
                      </div>
                    </div>
                  )}

                  {item.imgType === "farmer-cutout" && (
                    <div className="w-[110px] h-[110px] md:w-[125px] md:h-[125px] self-center flex-shrink-0 select-none rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-2xl rounded-bl-2xl overflow-hidden border border-brand-gold/15 shadow-sm group-hover:border-brand-gold/30 transition-all duration-500">
                      <motion.img 
                        variants={{
                          hover: { scale: 1.08, transition: { duration: 0.5 } }
                        }}
                        src={item.imgSrc} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Counters / Stats cards block */}
        <motion.div 
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div 
                key={idx} 
                variants={statVariants}
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="bg-white border border-brand-gold/10 border-t-[3.5px] border-t-brand-gold/80 p-6 sm:p-8 rounded-[2rem] text-center shadow-[0_8px_30px_rgba(45,31,23,0.015)] hover:shadow-[0_18px_40px_rgba(45,31,23,0.06)] transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer"
              >
                {/* Icon inside circular background */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0"
                  style={{ backgroundColor: s.bg }}
                >
                  <Icon className="w-5.5 h-5.5" style={{ color: s.color }} />
                </div>
                
                <div className="font-display font-bold text-3xl sm:text-4xl text-brand-darkGold tracking-tight mb-2">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="text-brand-brown text-sm sm:text-base font-extrabold mb-0.5">
                  {s.label}
                </div>
                <div className="text-brand-brown/50 text-[11px] sm:text-xs">
                  {s.sub}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Promise Trust Banner */}
        <div className="mt-16 bg-[#FAF3E7] rounded-[2.5rem] border border-brand-gold/15 p-4 flex flex-col lg:flex-row items-stretch gap-6 overflow-hidden relative">
          
          {/* Left "Our Promise" brown callout */}
          <div className="bg-[#2D1F17] rounded-[2rem] p-6 lg:w-[320px] text-white flex items-center gap-4 relative overflow-hidden flex-shrink-0 z-10 shadow-lg shadow-brand-brown/10">
            {/* Outline leaf in hand icon */}
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-[1.5]">
                <path d="M12 2C8 6 6 9 6 12s2 5 6 7c4-2 6-4 6-7s-2-6-6-10z" />
                <path d="M12 2v17" />
                <path d="M3 22h18" />
              </svg>
            </div>
            
            <div className="flex-1">
              <h4 className="font-display font-bold text-brand-gold text-lg mb-1">
                Our Promise
              </h4>
              <p className="text-white/80 text-[11px] leading-relaxed font-light">
                Pure. Honest. Natural. That's the Aarions way.
              </p>
            </div>
          </div>

          {/* Right 4-column Trust Checklist */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-6 py-4 items-center z-10">
            {[
              {
                icon: Leaf,
                title: "100% Natural",
                desc: "Only nature, nothing artificial",
                color: "#355E3B"
              },
              {
                icon: Droplet,
                title: "No Additives",
                desc: "No chemicals, no preservatives",
                color: "#E8A317"
              },
              {
                icon: Heart,
                title: "Made with Care",
                desc: "Crafted with love and intention",
                color: "#B23A2E"
              },
              {
                icon: ShieldCheck,
                title: "Safe & Trusted",
                desc: "Your health, our responsibility",
                color: "#2E5E4E"
              }
            ].map((t, idx) => {
              const TIcon = t.icon;
              return (
                <div key={idx} className="flex flex-col sm:flex-row items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-brand-gold border border-brand-gold/10 shadow-sm flex-shrink-0">
                    <TIcon className="w-4.5 h-4.5" style={{ color: t.color }} />
                  </div>
                  <div>
                    <h5 className="font-display font-extrabold text-brand-brown text-sm mb-0.5">
                      {t.title}
                    </h5>
                    <p className="text-brand-brown/50 text-[10px] sm:text-[11px] font-medium leading-tight">
                      {t.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sketched farm landscape overlay on the right background */}
          <div className="absolute right-0 bottom-0 top-0 w-[200px] opacity-15 pointer-events-none select-none z-0 hidden md:block">
            <svg viewBox="0 0 100 50" className="w-full h-full fill-none stroke-brand-gold/60 stroke-[1]">
              <path d="M 0,45 Q 25,35 50,45 Q 75,30 100,45" />
              <path d="M 10,40 Q 30,30 60,40" />
              <path d="M 70,38 L 78,33 L 86,38 L 86,45 L 70,45 Z" />
              <path d="M 70,38 L 86,38" />
              <circle cx="45" cy="22" r="5" strokeDasharray="2,2" />
              <path d="M 15,38 L 15,42 M 13,38 Q 15,32 17,38" />
              <path d="M 28,37 L 28,42 M 25,37 Q 28,30 31,37" />
            </svg>
          </div>

        </div>

      </div>
    </section>
  );
}
