import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Send, Check, ChevronDown, HelpCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      q: "Does your honey crystallize over time?",
      a: "Yes. Crystallization is a natural characteristic of 100% pure, raw, unfiltered honey. It occurs because natural sugars (glucose and fructose) bind with trace pollens. If your honey crystallizes, simply place the glass jar in warm water for a few minutes to liquify it. Avoid microwaving.",
    },
    {
      q: "What makes Bilona Ghee different from commercial ghee?",
      a: "Commercial ghee is made by heating industrial cream at high speeds. Bilona Ghee is made curd-first. We boil A2 Gir Cow milk, set it to curd, churn the curd using a bi-directional wooden paddle (Bilona) to obtain butter (makhan), and clarify the butter on slow firewood. This preserves short-chain fatty acids, enzymes, and granular texture.",
    },
    {
      q: "Are your spices and masalas cold-ground?",
      a: "Yes. Industrial grinding generates temperatures exceeding 80°C, which evaporates volatile flavor oils. We cold-grind sun-dried ingredients in low-temperature mills to ensure that 100% of the natural essential oils and aromas are retained in the packets.",
    },
    {
      q: "Do you ship all over India?",
      a: "Yes, we ship to all pin codes across India. Orders are processed within 24 hours from our Chennai head office and usually reach major metro cities within 3-5 business days. Shipping is free on orders above ₹999.",
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
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs tracking-widest uppercase font-semibold text-brand-gold">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-playfair font-semibold text-brand-brown">
            Contact Aarions
          </h1>
          <div className="h-[1px] w-12 bg-brand-gold mx-auto mt-4" />
          <p className="text-sm text-brand-brown/60 leading-relaxed font-light">
            Have questions about our traditional processing, customized wellness honey, or bulk orders? Reach out to us.
          </p>
        </div>

        {/* Contact info grid & form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Coordinates & Addresses */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-brand-gold/10 p-8 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-playfair text-xl font-semibold text-brand-brown">General Information</h3>
              
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-brand-gold mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-brand-brown/50">Call Support</h4>
                  <p className="text-sm font-semibold text-brand-brown mt-0.5">+91 98432 70810</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-5 h-5 text-brand-gold mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-brand-brown/50">Email Inquiries</h4>
                  <p className="text-sm font-semibold text-brand-brown mt-0.5">info@aarions.in</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-brand-gold/10 p-8 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-playfair text-xl font-semibold text-brand-brown">Our Locations</h3>

              {/* Head office */}
              <div className="flex items-start pb-4 border-b border-brand-gold/5">
                <MapPin className="w-5 h-5 text-brand-gold mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-brand-gold">Head Office & Store</h4>
                  <p className="text-xs sm:text-sm text-brand-brown/85 mt-1 leading-relaxed font-light">
                    No.1A, G1, Ground Floor, Gurudev Complex, 57th St, Venkatraman Nagar, Korattur, Chennai, Tamil Nadu 600080
                  </p>
                </div>
              </div>

              {/* Village office */}
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-brand-gold mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-brand-gold">Farming Sourcing Hub</h4>
                  <p className="text-xs sm:text-sm text-brand-brown/85 mt-1 leading-relaxed font-light">
                    2/159, Main Road, Indirapuram, Nelvoy Post, Maduranthagam Taluk, Chengalpattu District, 603107
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-white border border-brand-gold/10 p-8 rounded-3xl shadow-sm">
            <h3 className="font-playfair text-2xl font-semibold text-brand-brown mb-6">Send Us a Message</h3>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-6 text-center space-y-3 animate-fade-in">
                <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-playfair text-lg font-bold">Message Received</h4>
                <p className="text-xs text-green-700/80 max-w-sm mx-auto font-light">
                  Thank you for writing. Our organic support team will review your message and reply via email within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/60">Full Name</label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="w-full bg-brand-cream/30 border border-brand-gold/15 rounded-xl px-4 py-3 text-sm text-brand-brown outline-none focus:border-brand-gold focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/60">Email Address</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="Your email"
                      className="w-full bg-brand-cream/30 border border-brand-gold/15 rounded-xl px-4 py-3 text-sm text-brand-brown outline-none focus:border-brand-gold focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/60">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    className="w-full bg-brand-cream/30 border border-brand-gold/15 rounded-xl px-4 py-3 text-sm text-brand-brown outline-none focus:border-brand-gold focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/60">Message</label>
                  <textarea
                    required
                    rows="4"
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    placeholder="Describe your inquiry (product queries, custom orders, bulk requirements)..."
                    className="w-full bg-brand-cream/30 border border-brand-gold/15 rounded-xl px-4 py-3 text-sm text-brand-brown outline-none focus:border-brand-gold focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-brown hover:bg-brand-gold hover:text-brand-brown text-white text-xs tracking-widest uppercase font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="mt-24 max-w-4xl mx-auto border-t border-brand-gold/10 pt-16">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-playfair font-semibold text-brand-brown">
              Frequently Asked Questions
            </h2>
            <div className="h-[1px] w-12 bg-brand-gold mx-auto" />
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-brand-gold/10 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-playfair text-base sm:text-lg font-semibold text-brand-brown hover:text-brand-gold transition-colors"
                >
                  <span className="flex items-center">
                    <HelpCircle className="w-4 h-4 text-brand-gold mr-3 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-gold transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 pt-1 text-xs sm:text-sm text-brand-brown/70 leading-relaxed font-light border-t border-brand-gold/5">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
