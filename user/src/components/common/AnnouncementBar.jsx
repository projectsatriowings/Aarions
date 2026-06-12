import React, { useState, useEffect } from "react";
import { Sparkles, Truck, ShieldCheck } from "lucide-react";

export default function AnnouncementBar() {
  const announcements = [
    {
      text: "Authentic Bilona Churned A2 Gir Cow Ghee now back in stock",
      icon: <Sparkles className="w-4 h-4 mr-2 text-brand-gold inline" />,
    },
    {
      text: "100% Lab Tested & Organic Certified Products",
      icon: <ShieldCheck className="w-4 h-4 mr-2 text-brand-gold inline" />,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-brand-brown text-brand-cream py-2 px-4 text-center text-xs tracking-wider uppercase overflow-hidden relative h-9 flex items-center justify-center border-b border-brand-gold/10">
      <div
        className="flex items-center justify-center transition-all duration-700 ease-in-out transform"
        key={currentIndex}
      >
        {announcements[currentIndex].icon}
        <span>{announcements[currentIndex].text}</span>
      </div>
    </div>
  );
}
