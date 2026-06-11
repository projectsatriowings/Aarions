import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Calendar, Users, Heart, Award } from "lucide-react";

export default function About() {
  const values = [
    {
      title: "Sustainable Sourcing",
      desc: "By collaborating with wild honey hunters and small village dairy farmers, we promote fair wages and protect natural ecosystems.",
      icon: <Heart className="w-5 h-5 text-brand-gold" />,
    },
    {
      title: "Ancient Wooden Churning",
      desc: "Our A2 Ghee is prepared strictly via the wooden Bilona method. We boil the milk, set curd, churn butter, and clarify it slowly on firewood.",
      icon: <Award className="w-5 h-5 text-brand-gold" />,
    },
    {
      title: "Zero Chemical Policy",
      desc: "No preservatives, synthetic colorants, starch fillers, or high-fructose corn syrup. We preserve the organic signature of our ingredients.",
      icon: <ShieldCheck className="w-5 h-5 text-brand-gold" />,
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
      title: "Restoring the Bilona tradition",
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
      className="min-h-screen pt-40 pb-24 bg-brand-cream/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs tracking-widest uppercase font-semibold text-brand-gold">
              Our Story & Heritage
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-semibold text-brand-brown leading-tight">
              Purity Sourced From <br />
              <span className="text-brand-darkGold italic">Traditional Roots.</span>
            </h1>
            <div className="h-[1px] w-16 bg-brand-gold mt-4" />
            <p className="text-sm text-brand-brown/75 leading-relaxed font-light">
              Aarions was born out of a simple, personal quest: the search for real, unadulterated food. In a market flooded with chemically polished spices, syrup-diluted honey, and hydrogenated fats, we wanted to create a brand that acts as an honest gateway to ancient dietary wellness.
            </p>
            <p className="text-sm text-brand-brown/75 leading-relaxed font-light">
              Our search took us from urban shelves to deep forest hives and rural cow sheds. We realized that the secret to health isn't in laboratories, but in preserving the slow, wise techniques developed by our grandparents.
            </p>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-brand-gold/20 rounded-3xl hidden sm:block" />
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80"
              alt="Organic spices collection"
              className="w-full object-cover rounded-3xl h-[350px] sm:h-[400px] shadow-lg relative z-10"
            />
          </div>
        </div>

        {/* Pillars / Values Section */}
        <div className="bg-white border border-brand-gold/10 p-8 sm:p-12 rounded-3xl shadow-sm mb-24 max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-playfair font-semibold text-brand-brown">
              Our Core Principles
            </h2>
            <p className="text-xs text-brand-brown/50 uppercase tracking-widest">
              Uncompromising standards for daily nourishment
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val) => (
              <div key={val.title} className="text-center space-y-3">
                <div className="p-3.5 bg-brand-gold/10 rounded-full w-fit mx-auto text-brand-gold">
                  {val.icon}
                </div>
                <h3 className="font-playfair text-lg font-semibold text-brand-brown">{val.title}</h3>
                <p className="text-xs sm:text-sm text-brand-brown/70 leading-relaxed font-light">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Timeline */}
        <div className="mb-24 max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-playfair font-semibold text-brand-brown">
              The Journey of Aarions
            </h2>
            <div className="h-[1px] w-12 bg-brand-gold mx-auto" />
          </div>

          <div className="relative border-l border-brand-gold/20 pl-8 ml-4 sm:ml-8 space-y-12">
            {timeline.map((step, idx) => (
              <motion.div
                key={step.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative"
              >
                {/* Bullet node marker */}
                <div className="absolute -left-[41px] top-1 bg-brand-cream border-2 border-brand-gold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                  <Calendar className="w-3 h-3 text-brand-brown" />
                </div>
                {/* Year Label */}
                <span className="text-sm font-bold text-brand-gold tracking-widest uppercase">
                  {step.year}
                </span>
                <h3 className="font-playfair text-lg sm:text-xl font-semibold text-brand-brown mt-1">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-brown/70 mt-2 leading-relaxed font-light max-w-2xl">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust Badges Certifications */}
        <div className="text-center bg-brand-brown text-brand-cream py-16 px-6 rounded-3xl border border-brand-gold/15 shadow-xl max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-gold">
              Quality Assurance
            </span>
            <h2 className="text-2xl sm:text-3xl font-playfair font-semibold">
              Certified Safe, Tested Pure
            </h2>
            <p className="text-xs text-brand-cream/60 max-w-md mx-auto font-light leading-relaxed">
              We comply with national and international hygiene and organic protocols. Every batch is certified before it is packed.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <div className="border border-brand-cream/10 rounded-xl px-5 py-4 bg-white/5 flex flex-col items-center">
              <span className="font-playfair text-xl font-semibold text-brand-gold">FSSAI</span>
              <span className="text-[9px] uppercase tracking-wider text-brand-cream/40 mt-1 font-bold">Registry No. 22424</span>
            </div>
            <div className="border border-brand-cream/10 rounded-xl px-5 py-4 bg-white/5 flex flex-col items-center">
              <span className="font-playfair text-xl font-semibold text-brand-gold">USDA</span>
              <span className="text-[9px] uppercase tracking-wider text-brand-cream/40 mt-1 font-bold">Organic Standard</span>
            </div>
            <div className="border border-brand-cream/10 rounded-xl px-5 py-4 bg-white/5 flex flex-col items-center">
              <span className="font-playfair text-xl font-semibold text-brand-gold">ISO 22000</span>
              <span className="text-[9px] uppercase tracking-wider text-brand-cream/40 mt-1 font-bold">Food Safety Mgmt</span>
            </div>
            <div className="border border-brand-cream/10 rounded-xl px-5 py-4 bg-white/5 flex flex-col items-center">
              <span className="font-playfair text-xl font-semibold text-brand-gold">AGMARK</span>
              <span className="text-[9px] uppercase tracking-wider text-brand-cream/40 mt-1 font-bold">Grade A Quality</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
