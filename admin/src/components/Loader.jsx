import React from "react";

export default function Loader({ fullPage = false }) {
  const containerClass = fullPage
    ? "fixed inset-0 min-h-screen bg-zinc-50 dark:bg-zinc-950 z-50 flex items-center justify-center transition-colors duration-300"
    : "flex items-center justify-center py-16 w-full";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Orbiting spinner ring */}
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/10 border-t-amber-500 animate-spin" />
          
          {/* Inner brand logo circle */}
          <div className="w-14 h-14 relative flex items-center justify-center animate-pulse p-1">
            <img 
              src="/logo.png?v=3" 
              alt="Aarions" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-1">
          <span className="text-[10px] tracking-[0.35em] font-bold uppercase text-zinc-900 dark:text-zinc-100 animate-pulse font-playfair">
            Aarions
          </span>
          <span className="text-[8px] tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 font-medium">
            Loading portal
          </span>
        </div>
      </div>
    </div>
  );
}
