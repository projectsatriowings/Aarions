import React from "react";
import { motion } from "framer-motion";
import { Trees, Leaf, ShieldAlert, Gift, Heart } from "lucide-react";

export default function Benefits() {
  const journeySteps = [
    {
      step: "Step 1",
      title: "Farm & Source",
      desc: "We partner with verified organic farms and trusted beekeepers across India who follow sustainable practices.",
      image: "https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?w=600",
      color: "#355E3B",
      icon: Trees
    },
    {
      step: "Step 2",
      title: "Harvest & Collect",
      desc: "Honey is extracted using traditional cold-spinning methods. Spices are hand-harvested at peak potency.",
      image: "https://images.pexels.com/photos/302163/pexels-photo-302163.jpeg?w=600",
      color: "#E8A317",
      icon: Leaf
    },
    {
      step: "Step 3",
      title: "Lab Testing",
      desc: "Every batch undergoes rigorous quality testing. We check purity, potency, and compliance with FSSAI standards.",
      image: "https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?w=600",
      color: "#B23A2E",
      icon: ShieldAlert
    },
    {
      step: "Step 4",
      title: "Premium Packaging",
      desc: "Packed in premium, airtight containers designed to preserve freshness and reflect the quality within.",
      image: "https://aarions.netlify.app/ghee.png",
      color: "#C8870F",
      icon: Gift
    },
    {
      step: "Step 5",
      title: "Swift Delivery",
      desc: "Orders processed same-day and delivered across India. Temperature-controlled for delicate products.",
      image: "/delivery.webp",
      color: "#4A3428",
      icon: TruckIcon
    },
    {
      step: "Step 6",
      title: "Happy Families",
      desc: "Pure, natural products that your family can trust — from our farm, directly to your kitchen.",
      image: "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?w=600",
      color: "#355E3B",
      icon: Heart
    }
  ];

  // Custom simple truck icon to avoid lucide imports
  function TruckIcon(props) {
    return (
      <svg
        {...props}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    );
  }

  // Animation Variants
  const headerVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 1.8, ease: "easeInOut" }
    }
  };

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.25 }
    }
  };

  const textVariants = (isEven) => ({
    hidden: { opacity: 0, x: isEven ? -45 : 45 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 55, damping: 14 }
    }
  });

  const imageVariants = (isEven) => ({
    hidden: { opacity: 0, x: isEven ? 45 : -45, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 45, damping: 13 }
    }
  });

  return (
    <section className="section-pad overflow-hidden relative" style={{ background: "linear-gradient(135deg, #2D1F17 0%, #1D140F 50%, #300604 100%)" }}>
      {/* Decorative ambient lighting */}
      <div 
        className="absolute rounded-full pointer-events-none" 
        style={{
          top: "10%",
          left: "5%",
          width: "25rem",
          height: "25rem",
          background: "radial-gradient(circle, rgba(232,163,23,0.05) 0%, transparent 70%)"
        }}
      />
      <div 
        className="absolute rounded-full pointer-events-none" 
        style={{
          bottom: "10%",
          right: "5%",
          width: "25rem",
          height: "25rem",
          background: "radial-gradient(circle, rgba(53,94,59,0.05) 0%, transparent 70%)"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
            From Source to Table
          </span>
          <h2 className="font-display font-bold text-white text-3xl sm:text-4xl lg:text-5xl mb-3">
            Our Journey to Purity
          </h2>
          <p className="text-white/50 text-base lg:text-lg max-w-xl mx-auto font-light">
            Every product carries a story of care, craftsmanship, and unwavering commitment to quality.
          </p>
        </motion.div>

        {/* Timeline Path */}
        <div className="relative">
          {/* Vertical Line on Desktop */}
          <motion.div 
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-gold/80 via-brand-gold/30 to-transparent hidden lg:block origin-top"
            style={{ transform: "translateX(-50%)" }}
          />

          {/* Timeline steps */}
          <div className="space-y-16 lg:space-y-24">
            {journeySteps.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={step.step}
                  className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
                >
                  {/* Timeline Center Node Dot on Desktop */}
                  <motion.div 
                    variants={nodeVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    whileHover={{ scale: 1.3 }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 bg-[#2D1F17] hidden lg:flex items-center justify-center z-10 cursor-pointer shadow-lg shadow-brand-gold/10"
                    style={{ borderColor: step.color }}
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: step.color }}
                    />
                  </motion.div>

                  {/* Text Container */}
                  <motion.div 
                    variants={textVariants(isEven)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className={`space-y-3 ${isEven ? "lg:text-right lg:pr-16" : "lg:pl-16 lg:order-2 text-left"}`}
                  >
                    {/* Step pill badge */}
                    <div 
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ 
                        color: step.color, 
                        backgroundColor: step.color + "1a",
                        border: `1px solid ${step.color}33`
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{step.step}</span>
                    </div>

                    <h3 className="font-display font-bold text-white text-2xl lg:text-3xl">
                      {step.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed text-sm lg:text-base font-light max-w-xl lg:ml-auto lg:mr-0">
                      {step.desc}
                    </p>
                  </motion.div>

                  {/* Image Container */}
                  <motion.div 
                    variants={imageVariants(isEven)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className={`${isEven ? "lg:pl-16" : "lg:pr-16 lg:order-1"}`}
                  >
                    <motion.div 
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl border border-white/10 group cursor-pointer"
                      style={{ minHeight: "220px" }}
                    >
                      <img
                        src={step.image}
                        alt={step.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Hover subtle glow overlay */}
                      <div className="absolute inset-0 bg-brand-brown/10 group-hover:bg-brand-brown/0 transition-colors duration-300" />
                    </motion.div>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
