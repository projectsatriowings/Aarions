import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Calendar, Clock, User, Share2, Copy, Check, 
  Code, MessageCircle, Sparkles 
} from "lucide-react";
import { blogs as staticBlogs } from "../data/blogs";
import Newsletter from "../components/home/Newsletter";
import api, { getImageUrl } from "../services/api";
import Loader from "../components/common/Loader";

export default function BlogDetails() {
  const { id } = useParams(); // 'id' holds the slug parameter

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedApa, setCopiedApa] = useState(false);

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
    return <Loader fullPage />;
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
            className="inline-flex items-center space-x-2 btn-gradient text-xs tracking-widest uppercase font-semibold py-3.5 px-6 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = `https://www.aarions.in/blog/${blog.slug || id}`;
  const articleTitle = blog.title || "Aarions Organic Purity Journal";
  const authorName = blog.author?.name || blog.author || "Aarions Ayurvedic Research Team";
  const publishDate = blog.date || "2026";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const embedHtmlSnippet = `<a href="${currentUrl}" target="_blank" rel="noopener">Source: Aarions Pure Organic Foods - ${articleTitle}</a>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedHtmlSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  const apaCitation = `Aarions Team. (${publishDate}). ${articleTitle}. Aarions Journal. Retrieved from ${currentUrl}`;

  const handleCopyApa = () => {
    navigator.clipboard.writeText(apaCitation);
    setCopiedApa(true);
    setTimeout(() => setCopiedApa(false), 2500);
  };

  // Structured Data Schema for Search Engines and AI Citations
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": articleTitle,
    "description": blog.excerpt || blog.summary || "Traditional wellness and organic insights from Aarions.",
    "image": typeof blog.image === "string" && blog.image.startsWith("http") ? blog.image : `https://www.aarions.in${blog.image || "/logo.png"}`,
    "author": {
      "@type": "Organization",
      "name": authorName,
      "url": "https://www.aarions.in/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Aarions",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.aarions.in/logo.png"
      }
    },
    "datePublished": "2026-06-08",
    "dateModified": "2026-11-03",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 pb-12 bg-transparent"
    >
      {/* Dynamic JSON-LD Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="site-container-prose">
        
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

          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-brand-gold/10 py-4 mt-6">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-brand-brown/60 font-semibold">
              <span className="flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5 text-brand-gold" />
                {authorName}
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

            {/* Quick Share / Backlink Header Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-gold/30 hover:border-brand-gold text-brand-brown hover:text-brand-gold transition-colors bg-white/70 shadow-2xs"
                title="Copy canonical link to clipboard"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Link Copied" : "Copy Link"}</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(articleTitle + " - " + currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-brown/70 hover:text-emerald-600 hover:border-emerald-500/40 transition-colors bg-white/70"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-brown/70 hover:text-sky-600 hover:border-sky-500/40 transition-colors bg-white/70"
                title="Share on X (Twitter)"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-brown/70 hover:text-blue-700 hover:border-blue-500/40 transition-colors bg-white/70"
                title="Share on LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
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
          className="prose prose-stone max-w-none text-sm sm:text-base text-brand-brown/80 leading-relaxed font-light space-y-4"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* ══════════════════════════════════════════════════════════
            BACKLINK CITATION & EMBED WIDGET
            Makes it effortless for food bloggers, recipe writers,
            and journalists to cite Aarions with an authoritative backlink.
           ══════════════════════════════════════════════════════════ */}
        <div className="mt-14 mb-10 p-6 sm:p-8 rounded-2xl bg-white border border-brand-gold/20 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-brand-gold mb-3">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <h3 className="font-playfair text-xl font-bold text-brand-brown">
              Citing or Referencing This Guide?
            </h3>
          </div>
          
          <p className="text-xs sm:text-sm text-brand-brown/70 mb-5 leading-relaxed font-light">
            Writing a recipe, Ayurvedic article, nutrition study, or food journal? You are welcome to reference Aarions research and findings. Use the ready-made citation snippets below to provide proper source attribution:
          </p>

          <div className="space-y-4">
            {/* HTML Backlink Snippet */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-brand-brown/60 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-brand-gold" />
                  HTML Backlink Snippet (For Blogs &amp; Websites)
                </span>
                <button
                  onClick={handleCopyEmbed}
                  className="inline-flex items-center gap-1 text-brand-gold hover:text-brand-darkGold transition-colors cursor-pointer"
                >
                  {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmbed ? "Copied HTML!" : "Copy Snippet"}</span>
                </button>
              </div>
              <div className="bg-brand-cream/40 border border-brand-gold/15 p-3 rounded-lg text-xs font-mono text-brand-brown/80 select-all overflow-x-auto">
                {embedHtmlSnippet}
              </div>
            </div>

            {/* Standard APA / Journal Citation */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-brand-brown/60 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-brand-gold" />
                  Journalistic / Editorial Reference (APA Style)
                </span>
                <button
                  onClick={handleCopyApa}
                  className="inline-flex items-center gap-1 text-brand-gold hover:text-brand-darkGold transition-colors cursor-pointer"
                >
                  {copiedApa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedApa ? "Copied Citation!" : "Copy Text"}</span>
                </button>
              </div>
              <div className="bg-brand-cream/40 border border-brand-gold/15 p-3 rounded-lg text-xs font-serif text-brand-brown/80 select-all overflow-x-auto">
                {apaCitation}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-brand-gold/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-brand-brown/60">
            <span>
              Looking for media quotes, interviews, or lab test data? Contact our team via our{" "}
              <Link to="/contact" className="text-brand-gold font-semibold underline">
                Media & Press Desk
              </Link>
            </span>
            <span className="text-brand-gold font-medium">
              Free to use with canonical attribution
            </span>
          </div>
        </div>

      </div>

      {/* Subscribe bottom widget */}
      <Newsletter />
    </motion.div>
  );
}
