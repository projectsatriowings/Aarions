import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogs } from "../data/blogs";

export default function Blog() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-40 pb-24 bg-brand-cream/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs tracking-widest uppercase font-semibold text-brand-gold">
            Aarions Chronicle
          </span>
          <h1 className="text-4xl sm:text-5xl font-playfair font-semibold text-brand-brown">
            The Journal of Pure Living
          </h1>
          <div className="h-[1px] w-12 bg-brand-gold mx-auto mt-4" />
          <p className="text-sm text-brand-brown/60 leading-relaxed font-light">
            Insights on Ayurvedic nutrition, beekeeping, sustainable farming practices, and clean food recipes from our kitchen.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-brand-gold/10 hover:shadow-xl transition-all duration-500 flex flex-col group h-full"
            >
              {/* Image Container */}
              <div className="aspect-[16/10] overflow-hidden bg-brand-cream/20 relative">
                <Link to={`/blog/${blog.id}`}>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </Link>
                {/* Category overlay */}
                <span className="absolute bottom-4 left-4 bg-brand-brown text-brand-gold text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
                  {blog.category}
                </span>
              </div>

              {/* Text Body */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-3 text-[10px] text-brand-brown/50 font-semibold">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-brand-gold" />
                      {blog.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-brand-gold" />
                      {blog.readTime}
                    </span>
                  </div>

                  <h2 className="font-playfair text-xl font-semibold text-brand-brown group-hover:text-brand-gold transition-colors duration-300 leading-snug">
                    <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-brand-brown/70 leading-relaxed font-light line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold tracking-widest uppercase text-brand-brown hover:text-brand-gold group"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </motion.div>
  );
}
