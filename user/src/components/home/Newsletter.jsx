import React, { useState } from "react";
import { Mail, Sparkles, CheckCircle } from "lucide-react";
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

  const benefits = [
    "No spam ever",
    "Unsubscribe anytime",
    "Early access deals",
    "10% welcome discount"
  ];

  return (
    <section className="section-pad bg-[#FFF8EC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Newsletter Bento Wrapper */}
        <div className="premium-newsletter-card max-w-4xl mx-auto rounded-3xl p-8 md:p-12 lg:p-14 text-center relative overflow-hidden">
          
          {/* Subtle Ambient Radial Flares */}
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(232,163,23,0.09) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(178,58,46,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            {/* Header Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(232,163,23,0.14)",
                border: "1px solid rgba(232,163,23,0.24)",
              }}
            >
              <Mail className="w-6 h-6 text-brand-gold" />
            </div>

            {/* Eyebrow */}
            <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
              Stay in the Loop
            </span>

            {/* Title */}
            <h2
              className="font-display font-bold text-white mx-auto mb-4"
              style={{
                fontSize: "clamp(1.85rem, 4vw, 3rem)",
                lineHeight: 1.1,
                maxWidth: "600px",
              }}
            >
              Get Exclusive Offers & <span className="text-gradient">Wellness Tips</span>
            </h2>

            {/* Description */}
            <p
              className="text-white/55 text-sm lg:text-base leading-relaxed mx-auto mb-8"
              style={{ maxWidth: "500px" }}
            >
              Join 5,000+ subscribers. Receive early access to new products, seasonal recipes, and subscriber-only discounts.
            </p>

            {/* Form / State Handler */}
            {submitted ? (
              <div
                className="glass-dark rounded-2xl p-8 mx-auto space-y-3 animate-fade-in"
                style={{ maxWidth: "480px" }}
              >
                <div className="w-14 h-14 rounded-full bg-[#355E3B]/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-[#4A7D52]" />
                </div>
                <h3 className="font-display font-bold text-white text-xl">
                  You're in! 🎉
                </h3>
                <p className="text-white/55 text-sm">
                  Check your inbox for a welcome gift — 10% off your first order.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 mx-auto items-stretch"
                style={{ maxWidth: "520px" }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/35 text-sm focus:outline-none focus:border-brand-gold/40 flex-grow font-light transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary justify-center py-4 px-8"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Checklist Badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {benefits.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full"
                  style={{
                    color: "rgba(255, 255, 255, 0.48)",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)"
                  }}
                >
                  <svg className="w-3 h-3 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
