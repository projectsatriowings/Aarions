import React, { useRef, useEffect } from "react";
import { Leaf, Sprout, ShieldCheck, Heart, Lock, Truck } from "lucide-react";

export default function Certifications() {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const certs = [
    { icon: Leaf, label: "100% Natural", desc: "No chemicals or additives" },
    { icon: Sprout, label: "Farm Sourced", desc: "Direct from trusted farms" },
    { icon: ShieldCheck, label: "Lab Tested", desc: "Certified quality standards" },
    { icon: Heart, label: "No Preservatives", desc: "Pure and unadulterated" },
    { icon: Lock, label: "Secure Payments", desc: "Safe & encrypted checkout" },
    { icon: Truck, label: "Fast Delivery", desc: "Pan India shipping" },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-white py-20 relative overflow-hidden border-b border-brand-gold/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
          {certs.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="reveal glass-card glass-card-hover premium-sheen flex flex-col items-center text-center gap-3 p-5 rounded-2xl cursor-default relative overflow-hidden group"
              >
                {/* Large Background Count Index (Elegantly styled in gold) */}
                <div className="absolute top-2 right-3 font-playfair font-black text-xl text-brand-gold/15 select-none transition-all duration-300 group-hover:text-brand-gold/30 group-hover:scale-110">
                  0{idx + 1}
                </div>

                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center transition-all duration-300 group-hover:bg-brand-gold/20 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
                  <Icon className="w-5.5 h-5.5 text-brand-gold" />
                </div>
                
                <div className="space-y-1">
                  <div className="font-semibold text-brand-brown text-sm leading-tight group-hover:text-brand-gold transition-colors duration-300">
                    {c.label}
                  </div>
                  <div className="text-brand-brown/50 text-[11px] leading-snug">
                    {c.desc}
                  </div>
                </div>

                {/* Subtle golden bottom highlight line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

            );
          })}
        </div>
      </div>
    </section>
  );
}
