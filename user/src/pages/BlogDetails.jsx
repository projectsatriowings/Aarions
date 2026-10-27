import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { blogs as staticBlogs } from "../data/blogs";
import Newsletter from "../components/home/Newsletter";
import api, { getImageUrl } from "../services/api";
import Loader from "../components/common/Loader";

export default function BlogDetails() {
  const { id } = useParams(); // 'id' holds the slug parameter

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 pb-12 bg-transparent"
    >
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



      </div>

      {/* Subscribe bottom widget */}
      <Newsletter />
    </motion.div>
  );
}
