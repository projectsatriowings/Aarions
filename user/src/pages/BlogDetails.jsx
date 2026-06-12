import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import { blogs as staticBlogs } from "../data/blogs";
import Newsletter from "../components/home/Newsletter";
import api, { getImageUrl } from "../services/api";

export default function BlogDetails() {
  const { id } = useParams(); // 'id' holds the slug parameter

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareMessage, setShareMessage] = useState("");

  const fallbackCopyText = (text, successMsg) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // avoid scrolling to bottom
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setShareMessage(successMsg);
    } catch (err) {
      setShareMessage("Failed to copy link.");
    }
    document.body.removeChild(textArea);
    setTimeout(() => setShareMessage(""), successMsg.includes("Instagram") ? 3500 : 2500);
  };

  const copyToClipboard = (text, successMsg) => {
    let resolved = false;

    // Timeout fallback after 150ms
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        fallbackCopyText(text, successMsg);
      }
    }, 150);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            setShareMessage(successMsg);
            setTimeout(() => setShareMessage(""), successMsg.includes("Instagram") ? 3500 : 2500);
          }
        })
        .catch((err) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            fallbackCopyText(text, successMsg);
          }
        });
    } else {
      resolved = true;
      clearTimeout(timer);
      fallbackCopyText(text, successMsg);
    }
  };

  const handleShareLink = () => {
    copyToClipboard(window.location.href, "Link copied to clipboard!");
  };

  const handleShareInstagram = () => {
    copyToClipboard(window.location.href, "Link copied! Share it on your Instagram story.");
  };

  const handleShareFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/blogs/${id}`);
        if (res.data.success) {
          setBlog(res.data.blog);
        }
      } catch (err) {
        console.error("Failed to load blog details from API, falling back to static.", err);
        const found = staticBlogs.find((b) => b.id === id || b.slug === id);
        setBlog(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-48 pb-24 flex items-center justify-center bg-brand-cream/30 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-48 pb-24 flex items-center justify-center bg-brand-cream/30 text-center">
        <div className="max-w-md p-8 bg-white border border-brand-gold/10 rounded-2xl shadow-sm space-y-4">
          <h2 className="font-playfair text-2xl font-bold text-brand-brown">Article Not Found</h2>
          <p className="text-xs text-brand-brown/60">
            The article you are looking for has been archived or relocated.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 bg-brand-brown text-white text-xs tracking-widest uppercase font-semibold py-3.5 px-6 rounded-lg hover:bg-brand-gold hover:text-brand-brown transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 pb-12 bg-brand-cream/20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back button */}
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-brand-brown/60 hover:text-brand-gold transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 text-brand-gold" />
          <span>Back to Journal</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 mb-8">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded w-fit block">
            {blog.category}
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-brown leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-brand-brown/50 font-semibold border-y border-brand-gold/10 py-4 mt-6">
            <span className="flex items-center">
              <User className="w-3.5 h-3.5 mr-1.5 text-brand-gold" />
              {blog.author?.name || blog.author || "Aarions Team"}
            </span>
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-brand-gold" />
              {blog.date || new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
              })}
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-brand-gold" />
              {blog.readTime || blog.readingTime || "3 min read"}
            </span>
          </div>
        </div>

        {/* Feature Cover Image */}
        <div className="rounded-3xl overflow-hidden aspect-[16/9] mb-12 shadow-sm border border-brand-gold/10 bg-brand-cream/20">
          <img
            src={getImageUrl(blog.image)}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Body Content */}
        <div 
          className="prose prose-stone max-w-none text-sm sm:text-base text-brand-brown/70 leading-relaxed font-light space-y-4"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Sharing footer */}
        <div className="border-t border-brand-gold/10 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-brown/50">
            Share this Article
          </span>
          <div className="flex flex-col sm:items-end gap-2">
            <AnimatePresence>
              {shareMessage && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-16 sm:right-0 bg-brand-brown text-brand-gold text-[11px] tracking-wide font-semibold px-3.5 py-1.5 rounded-xl border border-brand-gold/25 shadow-lg z-10"
                >
                  {shareMessage}
                </motion.span>
              )}
            </AnimatePresence>
            <div className="flex space-x-3">
              <button
                onClick={handleShareLink}
                className="p-2 border border-brand-gold/20 rounded-full hover:bg-brand-gold hover:text-brand-brown transition-all duration-300 text-brand-brown cursor-pointer"
                aria-label="Share Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleShareInstagram}
                className="p-2 border border-brand-gold/20 rounded-full hover:bg-brand-gold hover:text-brand-brown transition-all duration-300 text-brand-brown cursor-pointer"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </button>
              <button
                onClick={handleShareFacebook}
                className="p-2 border border-brand-gold/20 rounded-full hover:bg-brand-gold hover:text-brand-brown transition-all duration-300 text-brand-brown cursor-pointer"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Subscribe bottom widget */}
      <Newsletter />
    </motion.div>
  );
}
