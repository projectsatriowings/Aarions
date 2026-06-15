import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

export default function BrandStorySection() {
  return (
    <section className="py-16 md:py-20 bg-brand-cream/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Editorial Image Composition */}
          <div className="lg:col-span-6 relative">
            {/* Background luxury border offset decoration */}
            <div className="absolute -top-4 -left-4 w-full h-full border border-brand-gold/25 rounded-3xl pointer-events-none translate-x-1 translate-y-1 hidden sm:block" />

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 rounded-3xl overflow-hidden shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80" // High-end organic agricultural farm
                alt="Aarions Organic Farming"
                className="w-full object-cover h-[350px] sm:h-[450px]"
              />
              {/* Soft overlay gradient */}
              <div className="absolute inset-0 bg-brand-brown/5 mix-blend-multiply" />
            </motion.div>

            {/* Overlapping small detail badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-6 -right-4 sm:right-6 bg-brand-brown text-brand-cream p-5 rounded-2xl shadow-xl z-20 max-w-xs border border-brand-gold/10 hidden sm:block"
            >
              <p className="font-playfair text-lg italic text-brand-gold font-medium">"From Indian pastures directly to your table."</p>
              <p className="text-[10px] uppercase tracking-wider text-brand-cream/60 mt-2 font-semibold">Our Farming Commitment</p>
            </motion.div>
          </div>

          {/* Right Side: Narrative and Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs tracking-widest uppercase font-semibold text-brand-gold">
              Our Heritage & Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-semibold text-brand-brown leading-tight">
              A Premium Organic Brand Where Tradition Meets Modern Wellness
            </h2>
            <div className="h-[1px] w-16 bg-brand-gold mt-4" />
            
            <p className="text-sm text-brand-brown/75 leading-relaxed font-light">
              At Aarions, we believe that food is medicine, and purity is the highest luxury. Our products are born out of a desire to reclaim the richness of Indian culinary heritage. By collaborating directly with local beekeepers and sustainable farmers in Chennai and across India, we deliver food that is clean, potent, and true to its origin.
            </p>
            <p className="text-sm text-brand-brown/75 leading-relaxed font-light">
              We reject high-speed industrial grinding, micro-filtration, and chemical bleaching. Instead, we embrace the slow warmth of firewood curd-churning, iron-pan spice roasting, and gravity-filtered raw honey harvesting.
            </p>

            {/* Key Pillars Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start">
                <Check className="w-4 h-4 text-brand-gold mr-3 mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-brand-brown/85 font-medium">100% Raw Forest Honey</span>
              </div>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-brand-gold mr-3 mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-brand-brown/85 font-medium">Ayurvedic Bilona A2 Ghee</span>
              </div>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-brand-gold mr-3 mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-brand-brown/85 font-medium">Cold-Ground Pure Spices</span>
              </div>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-brand-gold mr-3 mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-brand-brown/85 font-medium">No Preservatives or Sugars</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-6">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-brand-brown hover:text-brand-gold font-semibold text-xs sm:text-sm tracking-widest uppercase transition-colors duration-300 group"
              >
                <span>Discover Our Entire Process</span>
                <ArrowRight className="w-4 h-4 text-brand-gold group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
