import React from "react";
import { motion } from "framer-motion";
import { Leaf, Sprout, ShieldCheck, Heart, Lock, Truck } from "lucide-react";

export default function Certifications() {
  const certs = [
    { icon: Leaf, label: "100% Natural", desc: "No chemicals or additives" },
    { icon: Sprout, label: "Farm Sourced", desc: "Direct from trusted farms" },
    { icon: ShieldCheck, label: "Lab Tested", desc: "Certified quality standards" },
    { icon: Heart, label: "No Preservatives", desc: "Pure and unadulterated" },
    { icon: Lock, label: "Secure Payments", desc: "Safe & encrypted checkout" },
    { icon: Truck, label: "Fast Delivery", desc: "Pan India shipping" },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 12,
      },
    },
  };

  return (
    <section className="bg-transparent py-16 relative overflow-hidden border-y border-brand-gold/15">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-cream/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {certs.map((c, idx) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.label}
                variants={cardVariants}
                className="bg-white/50 backdrop-blur-md border border-brand-gold/15 hover:border-brand-gold/30 p-6 rounded-2xl flex flex-col items-center text-center gap-4 group cursor-default relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-gold/5"
              >
                {/* Embedded Metallic Index Label */}
                <div className="absolute top-3 right-4 font-playfair font-black text-2xl text-brand-gold/15 select-none transition-all duration-300 group-hover:text-brand-gold/30 group-hover:scale-115 group-hover:-translate-y-0.5">
                  0{idx + 1}
                </div>

                {/* Double Ring Golden Icon Container */}
                <div className="p-1 border border-dashed border-brand-gold/25 rounded-full transition-colors duration-300 group-hover:border-brand-gold/40">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-brand-darkGold flex items-center justify-center text-white shadow-md transition-transform duration-505 group-hover:rotate-12">
                    <Icon className="w-5.5 h-5.5 text-brand-brown" />
                  </div>
                </div>
                
                <div className="space-y-1 flex-grow">
                  <h4 className="font-playfair font-bold text-brand-brown text-sm leading-tight group-hover:text-brand-gold transition-colors duration-300">
                    {c.label}
                  </h4>
                  <p className="text-brand-brown/70 text-[11px] leading-snug font-light">
                    {c.desc}
                  </p>
                </div>

                {/* Golden Bottom Sheen Line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
