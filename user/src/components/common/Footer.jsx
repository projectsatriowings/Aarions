import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();
  const quickLinks = [
    { label: "About Us", to: "/about" },
    { label: "Shop", to: "/shop" },
    { label: "Blog", to: "/blog" },
    { label: "Track Order", to: "/orders" },
    { label: "Contact Us", to: "/contact" },
    { label: "Privacy Policy", to: "/privacy-policy" },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: settings?.socialLinks?.facebook || "#",
      icon: (
        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.14H5.71v3.82H9.5v12.22h4.77V11.28h3.83z" />
        </svg>
      )
    },
    {
      label: "Instagram",
      href: settings?.socialLinks?.instagram || "#",
      icon: (
        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      )
    },
    {
      label: "Twitter",
      href: settings?.socialLinks?.twitter || "#",
      icon: (
        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      label: "YouTube",
      href: settings?.socialLinks?.youtube || "#",
      icon: (
        <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12z" />
        </svg>
      )
    }
  ];

  const activeSocialLinks = socialLinks.filter(s => s.href && s.href !== "#" && s.href.trim() !== "");

  const certifications = settings?.certifications
    ? settings.certifications.split(",").map(c => c.trim()).filter(Boolean)
    : ["FSSAI", "ISO 22000", "Organic India", "Non-GMO"];
  const paymentMethods = settings?.paymentMethods
    ? settings.paymentMethods.split(",").map(p => p.trim()).filter(Boolean)
    : ["Visa", "Mastercard", "UPI", "Razorpay", "PhonePe"];

  return (
    <footer className="footer-shell text-white border-t border-brand-gold/15">
      {/* Main Footer Grid */}
      <div className="site-container-fluid py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="inline-flex items-center">
              <span className="font-playfair text-2xl font-bold tracking-wider text-brand-gold uppercase">
                {settings?.brandName || "Aarions Store"}
              </span>
            </Link>

            <p className="text-white/60 text-sm sm:text-[0.95rem] leading-7 max-w-sm font-light">
              {settings?.footerAboutText || "Bringing nature's finest products to your family. Pure honey, ghee, masalas, and spices — crafted with tradition, tested with science."}
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {activeSocialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-brand-gold hover:border-brand-gold/40 hover:bg-brand-gold/10 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3">
            <h4 className="font-semibold text-white text-sm tracking-[0.24em] uppercase mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-white/60 text-sm leading-6 hover:text-brand-gold transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Column */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="font-semibold text-white text-sm tracking-[0.24em] uppercase mb-6 font-display">
              Contact Us
            </h4>
            <ul className="space-y-4 w-full text-sm font-light text-white/60">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  {(!settings?.address || settings.address === "Aarions Corporate Office, India")
                    ? "No.1A, G1, Ground Floor, Gurudev Complex, 57th St, Venkatraman Nagar, Korattur, Chennai, Tamil Nadu 600080"
                    : settings.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-gold flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>
                  {(!settings?.contactPhone || settings.contactPhone === "+91 98765 43210")
                    ? "+91 98432 70810"
                    : settings.contactPhone}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-brand-gold flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href={`mailto:${settings?.contactEmail || "info@aarions.in"}`}
                  className="hover:text-brand-gold transition-colors"
                  title="Contact Aarions Support"
                  dangerouslySetInnerHTML={{
                    __html: (settings?.contactEmail || "info@aarions.in")
                      .split("")
                      .map((c) => "&#" + c.charCodeAt(0) + ";")
                      .join("")
                  }}
                />
              </li>
            </ul>

            {/* Certifications Pills */}
            <div className="pt-4 space-y-3">
              <p className="text-white/40 text-xs tracking-[0.2em] uppercase">
                Certifications
              </p>
              <div className="flex flex-wrap gap-2.5">
                {certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium whitespace-nowrap hover:bg-white/10 transition-colors cursor-default"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="footer-bottom border-t border-white/10 py-6">
        <div className="site-container-fluid">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-white/40">
            <p className="text-center sm:text-left leading-6">
              © {new Date().getFullYear()} {settings?.footerCopyright || settings?.brandName || "Aarions"}. All rights reserved. Designed & Developed by{" "}
              <a
                href={settings?.developerUrl || "https://www.myyakobu.com/"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-gold transition-colors font-semibold"
              >
                {settings?.developerName || "Yakobu Business Solutions"}
              </a>
            </p>

            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
              <span className="text-white/30 mr-1">Secure payments via</span>
              {paymentMethods.map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 text-[10px] font-medium"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
