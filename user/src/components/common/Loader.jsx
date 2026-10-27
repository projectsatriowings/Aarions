import React from "react";

export default function Loader({ fullPage = false }) {
  const containerClass = fullPage
    ? "fixed inset-0 min-h-screen bg-brand-cream z-[200] flex items-center justify-center transition-colors duration-300"
    : "flex items-center justify-center py-16 w-full";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Orbiting spinner ring */}
          <div className="absolute inset-0 rounded-full border-2 border-brand-gold/10 border-t-brand-gold animate-spin" />
          
          {/* Inner brand logo circle */}
          <div className="w-14 h-14 relative flex items-center justify-center animate-pulse p-1">
            <img 
              src="/logo.webp?v=3" 
              alt="Aarions" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-1">
          <span className="text-[10px] tracking-[0.35em] font-bold uppercase text-brand-brown animate-pulse font-playfair">
            Aarions
          </span>
          <span className="text-[8px] tracking-[0.2em] uppercase text-brand-brown/50 font-medium">
            Loading purity
          </span>
        </div>
      </div>
    </div>
  );
}
