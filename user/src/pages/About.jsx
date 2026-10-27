import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Calendar, Heart, Award } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function About() {
  const { settings } = useSettings();
  const values = [
    {
      title: "Sustainable Sourcing",
      desc: "By collaborating with wild honey hunters and small village dairy farmers, we promote fair wages and protect natural ecosystems.",
      icon: <Heart className="w-5.5 h-5.5 text-brand-gold" />,
      imgSrc: "/ethically_sourced.webp",
      badgeText: "Ethically Sourced"
    },
    {
      title: "Ancient Wooden Churning",
      desc: "Our A2 Ghee is prepared strictly via the wooden Bilona method. We boil the milk, set curd, churn butter, and clarify it slowly on firewood.",
      icon: <Award className="w-5.5 h-5.5 text-brand-gold" />,
      imgSrc: "/traditional_recipes.webp",
      badgeText: "Bilona Tradition"
    },
    {
      title: "Zero Chemical Policy",
      desc: "No preservatives, synthetic colorants, starch fillers, or high-fructose corn syrup. We preserve the organic signature of our ingredients.",
      icon: <ShieldCheck className="w-5.5 h-5.5 text-brand-gold" />,
      imgSrc: "/quality_tested.webp",
      badgeText: "Lab Certified"
    },
  ];

  const timeline = [
    {
      year: "2024",
      title: "The Seed of Purity",
      desc: "Aarions was founded in Chennai with a simple goal: to find pure, raw forest honey for health-focused families directly from tribal bee gatherers.",
    },
    {
      year: "2025",
      title: "Restoring the Bilona Tradition",
      desc: "We expanded our catalog to A2 Gir Cow Ghee, setting up small farmer co-operatives in Tamil Nadu to churn curd traditionally rather than heat cream industrially.",
    },
    {
      year: "2026",
      title: "Vitals & Beyond",
      desc: "Today, Aarions supplies over 5,000 kitchens across India with clean honey, authentic ghee, traditional cold-ground masalas, and daily wellness teas.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 pb-24 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Hero Banner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-28 relative">
          {/* Ambient lighting glows behind hero */}
          <div className="absolute top-1/2 left-[-10%] w-[35rem] h-[35rem] bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 right-[-10%] w-[25rem] h-[25rem] bg-brand-red/5 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 z-0" />
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="lg:col-span-7 space-y-6 relative z-10"
          >
            <motion.span 
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="text-xs tracking-[0.25em] uppercase font-bold text-brand-red block"
            >
              {settings?.aboutHeroSubtitle || "Our Story & Heritage"}
            </motion.span>
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
              }}
              className="text-4xl sm:text-5xl lg:text-6.5xl font-playfair font-bold text-brand-brown leading-[1.12]"
            >
              {settings?.aboutHeroTitleLine1 || "Purity Sourced From"} <br />
              <span className="text-gradient font-bold italic">{settings?.aboutHeroTitleLine2 || "Traditional Roots."}</span>
            </motion.h1>
            
            {/* Stylized wheat separator decoration */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
              }}
              className="flex items-center gap-3 pt-2"
            >
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-brand-gold" />
              <span className="text-brand-gold font-playfair text-lg">🌾</span>
              <div className="h-[1px] w-32 bg-gradient-to-l from-transparent to-brand-gold" />
            </motion.div>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="text-sm sm:text-base text-brand-brown/70 leading-relaxed font-light"
            >
              {settings?.aboutParagraph1 || "Aarions was born out of a simple, personal quest: the search for real, unadulterated food. In a market flooded with chemically polished spices, syrup-diluted honey, and hydrogenated fats, we wanted to create a brand that acts as an honest gateway to ancient dietary wellness."}
            </motion.p>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="text-sm text-brand-brown/70 leading-relaxed font-normal border-l-[3.5px] border-brand-red pl-5 py-0.5"
            >
              {settings?.aboutParagraph2 || "Our search took us from urban shelves to deep forest hives and rural cow sheds. We realized that the secret to health isn't in laboratories, but in preserving the slow, wise techniques developed by our grandparents."}
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 relative group z-10"
          >
            {/* Double Frame Overlay */}
            <div className="absolute -top-3.5 -left-3.5 w-full h-full border border-brand-gold/25 rounded-3xl pointer-events-none translate-x-1 translate-y-1 hidden sm:block group-hover:border-brand-red/30 transition-colors duration-500" />
            <div className="overflow-hidden rounded-3xl border border-brand-gold/15 shadow-xl relative">
              <img
                src={settings?.aboutHeroImage || "/about_hero_ghee_honey.webp"}
                alt="Aarions A2 Ghee and Forest Honey"
                className="w-full object-cover h-[350px] sm:h-[430px] transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              
              {/* Floating Badge */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md border border-brand-gold/20 px-4 py-2 rounded-xl shadow-md flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
                <span className="text-[10px] tracking-wider uppercase font-bold text-brand-brown">
                  Est. 2020 • Rooted in Trust
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pillars / Core Principles Bento Grid */}
        <div className="mb-28 max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-[10px] text-brand-red font-bold uppercase tracking-[0.25em] block">
              Our Foundation
            </span>
            <h2 className="text-3xl sm:text-4.5xl font-playfair font-bold text-brand-brown">
              Our Core Principles
            </h2>
            <p className="text-xs text-brand-brown/50 uppercase tracking-[0.15em] font-medium">
              Uncompromising standards for daily nourishment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {values.map((val, idx) => (
              <motion.div 
                key={val.title} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.15, type: "spring", stiffness: 90, damping: 14 }}
                className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-white to-brand-cream/10 border border-brand-gold/12 hover:border-brand-gold/30 p-7 pt-9 flex flex-col h-full shadow-[0_12px_36px_rgba(45,31,23,0.02)] hover:shadow-[0_24px_50px_rgba(139,30,26,0.06)] hover:-translate-y-2 transition-all duration-500 cursor-default"
              >
                {/* Capsule Badge */}
                <span className="absolute top-6 right-6 bg-brand-gold/10 text-brand-darkGold text-[8px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-brand-gold/10">
                  {val.badgeText}
                </span>
                
                <div className="space-y-4 flex-grow relative z-10">
                  <motion.div 
                    whileHover={{ rotate: 12, scale: 1.08 }}
                    className="p-3 bg-brand-gold/10 text-brand-gold rounded-xl w-fit"
                  >
                    {val.icon}
                  </motion.div>
                  <h3 className="font-playfair text-xl font-bold text-brand-brown">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-brand-brown/70 leading-relaxed font-light pr-4">{val.desc}</p>
                </div>
                
                {/* Illustration Image Container at bottom of Bento card */}
                <div className="mt-8 relative h-36 overflow-hidden rounded-2xl border border-brand-gold/5 bg-brand-cream/5">
                  <img 
                    src={val.imgSrc} 
                    alt={val.title} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Alternating Interactive Timeline */}
        <div className="mb-28 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-2"
          >
            <span className="text-[10px] text-brand-red font-bold uppercase tracking-[0.25em] block">
              Growth & Heritage
            </span>
            <h2 className="text-3xl sm:text-4.5xl font-playfair font-bold text-brand-brown">
              The Journey of Aarions
            </h2>
            <div className="h-[1px] w-12 bg-brand-gold mx-auto mt-4" />
          </motion.div>

          <div className="relative">
            {/* Center timeline axis line (gradient) */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-red via-brand-gold to-transparent -translate-x-1/2 z-0" />

            <div className="space-y-12 sm:space-y-16">
              {timeline.map((step, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={step.year} className="relative flex flex-col sm:flex-row items-start z-10">
                    {/* Pulsing ring marker */}
                    <div className="absolute left-4 sm:left-1/2 top-7 sm:top-1/2 w-6 h-6 rounded-full bg-brand-cream border-[3.5px] border-brand-gold -translate-x-1/2 -translate-y-1/2 z-10 shadow flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                    </div>

                    {/* Left column (empty on desktop for odd, filled for even) */}
                    <div className={`w-full sm:w-1/2 pl-12 sm:pl-0 sm:pr-12 text-left sm:text-right ${isEven ? "" : "sm:opacity-0 sm:pointer-events-none"}`}>
                      {isEven && (
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
                          className="glass-card hover:border-brand-gold/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative"
                        >
                          <span className="inline-block bg-brand-red text-white text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full shadow-sm mb-3">
                            {step.year}
                          </span>
                          <h3 className="font-playfair text-xl font-bold text-brand-brown">
                            {step.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-brand-brown/70 mt-2.5 leading-relaxed font-light">
                            {step.desc}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Right column (filled for odd, empty on desktop for even) */}
                    <div className={`w-full sm:w-1/2 pl-12 sm:pl-12 text-left ${!isEven ? "" : "sm:opacity-0 sm:pointer-events-none"}`}>
                      {!isEven && (
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
                          className="glass-card hover:border-brand-gold/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative"
                        >
                          <span className="inline-block bg-brand-red text-white text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full shadow-sm mb-3">
                            {step.year}
                          </span>
                          <h3 className="font-playfair text-xl font-bold text-brand-brown">
                            {step.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-brand-brown/70 mt-2.5 leading-relaxed font-light">
                            {step.desc}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quality Assurance Certified Dark-Glass Portal */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gradient-to-br from-[#2D1F17] via-[#221711] to-[#3A0C08] text-brand-cream py-16 px-6 sm:px-12 rounded-[2.5rem] border border-brand-gold/20 shadow-2xl max-w-4xl mx-auto space-y-8 relative overflow-hidden"
        >
          {/* Ambient lighting inside dark card */}
          <div className="absolute top-[-30%] right-[-30%] w-[35rem] aspect-square rounded-full bg-brand-gold/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-30%] left-[-30%] w-[25rem] aspect-square rounded-full bg-brand-red/10 blur-[100px] pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-brand-gold block">
              Quality Assurance
            </span>
            <h2 className="text-3xl sm:text-4.5xl font-playfair font-bold">
              Certified Safe, Tested Pure
            </h2>
            <p className="text-xs sm:text-sm text-brand-cream/60 max-w-lg mx-auto font-light leading-relaxed">
              We comply with national and international hygiene and organic protocols. Every batch is certified before it is packed.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {[
              { label: "FSSAI", desc: "Registry No. 22424" },
              { label: "USDA", desc: "Organic Standard" },
              { label: "ISO 22000", desc: "Food Safety Mgmt" },
              { label: "AGMARK", desc: "Grade A Quality" }
            ].map((cert, idx) => (
              <motion.div 
                key={cert.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.05, borderColor: "rgba(232, 163, 23, 0.4)", backgroundColor: "rgba(255, 248, 236, 0.08)" }}
                className="border border-brand-cream/10 rounded-2xl px-5 py-6 bg-white/5 flex flex-col items-center cursor-default transition-all duration-300 shadow-sm"
              >
                <span className="font-playfair text-xl sm:text-2xl font-bold text-brand-gold">{cert.label}</span>
                <span className="text-[9px] uppercase tracking-wider text-brand-cream/40 mt-1.5 font-bold">{cert.desc}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
