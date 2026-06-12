import React, { useState, useRef, useEffect } from "react";
import { Star, CheckCircle } from "lucide-react";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);

  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Bengaluru",
      rating: 5,
      review: "The Sidr honey is absolutely extraordinary. I've never tasted anything like it. Rich, complex, and medicinal — completely worth every rupee. Aarions has become my go-to for premium natural products.",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150",
      product: "Sidr Honey",
      verified: true
    },
    {
      id: 2,
      name: "Rajesh Menon",
      location: "Chennai",
      rating: 5,
      review: "The Gir Cow Ghee is as pure as it gets. You can smell the difference the moment you open the jar. My family has been using it for 6 months and we won't go back to anything else.",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150",
      product: "Gir Cow Ghee",
      verified: true
    },
    {
      id: 3,
      name: "Ananya Krishnan",
      location: "Hyderabad",
      rating: 5,
      review: "Mutton masala changed the way I cook! Restaurant quality at home, no exaggeration. Fast delivery, beautiful packaging, and the quality is unmatched. Highly recommend Aarions.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150",
      product: "Mutton Masala",
      verified: true
    },
    {
      id: 4,
      name: "Vikram Nair",
      location: "Kochi",
      rating: 5,
      review: "The Lakadong turmeric has the most intense golden color I've seen. Lab certified 5% curcumin content is real. I've noticed significant anti-inflammatory benefits after regular use.",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150",
      product: "Turmeric Powder",
      verified: true
    },
    {
      id: 5,
      name: "Meena Iyer",
      location: "Coimbatore",
      rating: 5,
      review: "Forest honey is my morning ritual now. No sugar, just this with warm water. My energy levels have improved and it tastes heavenly. The packaging is also premium and gift-worthy.",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150",
      product: "Forest Honey",
      verified: true
    }
  ];

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered, reviews.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, index) => {
              setTimeout(() => el.classList.add("visible"), index * 100);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const slideLeft = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const slideRight = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  // Get active subset of 3 items (previous, active, next)
  const activeReviews = [
    reviews[(activeIndex - 1 + reviews.length) % reviews.length],
    reviews[activeIndex],
    reviews[(activeIndex + 1) % reviews.length]
  ];

  return (
    <section
      ref={sectionRef}
      className="section-pad bg-[#FFF8EC] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14 reveal">
          <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-3 block">
            Customer Love
          </span>
          <h2 className="font-display font-bold text-brand-brown mb-3 text-3xl sm:text-4xl lg:text-5xl">
            What Our Customers Say
          </h2>
          <p className="text-brand-brown/60 text-base lg:text-lg max-w-xl mx-auto font-light">
            Join over 5,000 families who trust Aarions for their daily natural living needs.
          </p>
        </div>

        {/* Carousel Grid */}
        <div
          className="reveal grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {activeReviews.map((rev, idx) => {
            const isActive = idx === 1;

            return (
              <div
                key={rev.id}
                onClick={() => {
                  if (idx === 0) slideLeft();
                  if (idx === 2) slideRight();
                }}
                className={`glass-card glass-card-hover p-6 lg:p-8 cursor-pointer flex flex-col justify-between h-full transition-all duration-500 ${
                  isActive
                    ? "scale-105 z-10 border-brand-gold/40 bg-white/90 shadow-lg"
                    : "opacity-55 hover:opacity-90 bg-white/30 border-white/20"
                }`}
              >
                {/* Quote details */}
                <div className="flex-1 flex flex-col mb-6">
                  {/* Big quotation mark */}
                  <svg 
                    className="w-8 h-8 mb-4 opacity-20 flex-shrink-0" 
                    style={{ color: "#E8A317", fill: "#E8A317" }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 17h3l2-4V7h-6v6h3zM3 17h3l2-4V7H2v6h3z" />
                  </svg>
                  <p className="text-brand-brown/75 leading-relaxed text-sm lg:text-base flex-1 font-light italic">
                    "{rev.review}"
                  </p>
                </div>

                {/* Footer details */}
                <div className="mt-auto">
                  {/* Star Ratings */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>

                  {/* Divider line & details */}
                  <div className="flex items-center gap-3 pt-4 border-t border-brand-gold/10">
                    <img
                      src={rev.image}
                      alt={rev.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-brand-brown text-sm flex items-center gap-1">
                        <span>{rev.name}</span>
                        {rev.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-[#355E3B] fill-[#355E3B]/10 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-brand-brown/50 text-xs mt-0.5">
                        {rev.location} • Verified Buyer of {rev.product}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-6 bg-brand-gold" : "w-1.5 bg-brand-gold/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
