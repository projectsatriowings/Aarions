import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { blogs as staticBlogs } from "../../data/blogs";
import api, { getImageUrl } from "../../services/api";

export default function BlogSection() {
  const sectionRef = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs?limit=3");
        if (res.data.success) {
          setBlogs(res.data.blogs);
        }
      } catch (err) {
        console.error("Failed to load blogs from API, falling back to static.", err);
        setBlogs(staticBlogs.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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
  }, [loading]);

  return (
    <section
      ref={sectionRef}
      className="section-pad bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 lg:mb-12">
          <div className="reveal text-left space-y-2">
            <span className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-2 block">
              Aarions Journal
            </span>
            <h2 className="font-display font-bold text-brand-brown text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Latest Articles
            </h2>
            <p className="text-brand-brown/60 max-w-md font-light">
              Discover wellness benefits, traditional recipes, and the stories behind our products.
            </p>
          </div>

          <Link
            to="/blog"
            className="fp-view-all reveal self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-brand-brown hover:text-brand-gold transition-colors duration-300"
          >
            <span>View All</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold" />
          </div>
        ) : (
          <div className="blog-grid items-stretch">
            {blogs.map((blog, idx) => (
              <article
                key={blog._id || blog.id}
                className="premium-blog-card reveal group flex flex-col h-full"
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                {/* Media Image */}
                <div className="blog-card__media relative overflow-hidden h-56">
                  <img
                    src={getImageUrl(blog.image)}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="badge-primary">
                      {blog.category || "Wellness"}
                    </span>
                  </div>
                  <div
                    className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    style={{
                      background: "linear-gradient(to top, rgba(45,31,23,0.4), transparent)",
                    }}
                  />
                </div>

                {/* Body */}
                <div className="blog-card__body p-6 flex flex-col justify-between flex-grow">
                  <div>
                    {/* Meta details */}
                    <div className="blog-card__meta text-xs text-brand-brown/50 mb-3 flex items-center gap-4">
                      <span className="blog-card__meta-item flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-brand-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        }) : blog.date}
                      </span>
                      <span className="blog-card__meta-item flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-brand-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {blog.author?.name || blog.author || "Aarions Team"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="blog-card__title font-display font-bold text-brand-brown text-xl mb-3 group-hover:text-brand-gold transition-colors duration-300 leading-snug">
                      <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>

                    {/* Summary */}
                    <p className="blog-card__summary text-brand-brown/65 leading-relaxed text-sm font-light mb-6 line-clamp-3">
                      {blog.excerpt || blog.summary}
                    </p>
                  </div>

                  {/* Footer read article */}
                  <div className="blog-card__footer mt-auto pt-4 border-t border-brand-gold/10 flex items-center justify-between">
                    <span className="text-xs text-brand-brown/50">
                      {blog.readingTime || blog.readTime || "5 min read"}
                    </span>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-brand-brown hover:text-brand-gold group-hover:translate-x-1 transition-all duration-300"
                    >
                      <span>Read More</span>
                      <svg className="w-3.5 h-3.5 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
