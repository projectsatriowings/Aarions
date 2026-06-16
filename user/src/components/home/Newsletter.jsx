import React, { useState } from "react";
import { Mail, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      setLoading(true);
      try {
        const res = await api.post("/newsletter/subscribe", { email });
        if (res.data.success) {
          setSubmitted(true);
          setEmail("");
        }
      } catch (err) {
        console.error("Newsletter subscription failed:", err);
        alert(err.response?.data?.error || "Subscription failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="py-12 md:py-16 bg-transparent relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[45%] aspect-square rounded-full bg-brand-gold/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[45%] aspect-square rounded-full bg-brand-gold/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative bg-gradient-to-br from-[#2D1F17] to-[#1A0E08] border border-brand-gold/25 rounded-[40px] p-8 md:p-12 lg:p-16 overflow-hidden shadow-2xl shadow-brand-brown/40">
          
          {/* Subtle inset border overlay */}
          <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[40px] z-0" />
          
          {/* Decorative luxury background leaf */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none translate-x-12 -translate-y-12 z-0">
            <svg viewBox="0 0 100 100" fill="currentColor" className="text-brand-gold w-full h-full">
              <path d="M50 10C58 28 66 38 78 50C88 60 92 72 88 84C84 94 72 98 60 92C52 88 48 88 40 92C28 98 16 94 12 84C8 72 12 60 22 50C34 38 42 28 50 10Z" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Column: Editorial context & highlights */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-brand-gold/25 bg-brand-gold/5 text-brand-gold text-[10px] tracking-[0.25em] uppercase font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                  Stay in the Loop
                </span>
                <h2 className="font-playfair text-4xl sm:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
                  Get Exclusive Offers & <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-[#f7cc5e]">Wellness Tips</span>
                </h2>
                <p className="text-white/60 text-sm lg:text-base font-light leading-relaxed max-w-xl">
                  Join 5,000+ wellness seekers in our inner circle. Receive seasonal organic recipes, traditional pantry tips, and subscriber-only welcome privileges.
                </p>
              </div>

              {/* Organic trust benefits block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center border border-brand-gold/15">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">10% Welcome Gift</h4>
                    <p className="text-white/45 text-[11px] font-light mt-0.5 leading-normal">
                      Get a special discount code sent straight to your inbox instantly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center border border-brand-gold/15">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">Harvest Alerts</h4>
                    <p className="text-white/45 text-[11px] font-light mt-0.5 leading-normal">
                      Be first to harvest limited-run forest honey and fresh churned ghee batches.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Glassmorphic interactive input card */}
            <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl p-6 sm:p-8 shadow-inner">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto border border-green-500/20 shadow-md">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-playfair text-xl font-bold text-white">You're in! 🎉</h3>
                    <p className="text-white/55 text-xs font-light leading-relaxed max-w-xs mx-auto">
                      Thank you for joining. Check your inbox for your 10% welcome discount code.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-white text-base font-bold tracking-wide">Join Our Newsletter</h3>
                    <p className="text-white/45 text-xs font-light">Zero spam. Unsubscribe with a single click anytime.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-brand-gold/45 focus-within:bg-white/[0.07] transition-all duration-300">
                      <Mail className="w-4.5 h-4.5 text-white/35 mr-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="bg-transparent outline-none w-full text-xs text-white placeholder-white/30 font-light"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-brand-gold to-brand-darkGold text-brand-brown text-xs font-extrabold tracking-widest uppercase hover:brightness-105 transition-all duration-300 shadow-lg shadow-brand-gold/15 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-brand-brown/30 border-t-brand-brown rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Subscribe Now</span>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex justify-center items-center gap-4 text-[9px] uppercase tracking-wider text-white/30 font-semibold pt-2 border-t border-white/5">
                    <span>No spam ever</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span>Unsubscribe anytime</span>
                  </div>
                </form>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
