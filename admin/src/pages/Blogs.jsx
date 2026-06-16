import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Loader2, AlertCircle, Eye } from "lucide-react";
import api, { getImageUrl } from "../services/api";

// Helper to convert rich HTML content from DB into normal plain text for the editor
const htmlToPlainText = (html) => {
  if (!html) return "";
  if (!html.includes("<p") && !html.includes("<ul") && !html.includes("<h3") && !html.includes("<li")) {
    return html.trim(); // Already plain text
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Convert headings
    doc.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((el) => {
      el.replaceWith(`\n\n${el.textContent.trim()}\n\n`);
    });

    // Convert bullet lists
    doc.querySelectorAll("ul").forEach((ul) => {
      const listItems = Array.from(ul.querySelectorAll("li"))
        .map((li) => {
          let text = li.innerHTML
            .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
            .replace(/<b>(.*?)<\/b>/gi, "**$1**");
          const temp = document.createElement("div");
          temp.innerHTML = text;
          return `• ${temp.textContent.trim()}`;
        })
        .join("\n");
      ul.replaceWith(`\n\n${listItems}\n\n`);
    });

    // Convert paragraphs
    doc.querySelectorAll("p").forEach((p) => {
      let text = p.innerHTML
        .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
        .replace(/<b>(.*?)<\/b>/gi, "**$1**");
      const temp = document.createElement("div");
      temp.innerHTML = text;
      p.replaceWith(`\n\n${temp.textContent.trim()}\n\n`);
    });

    // Extract text content
    let text = doc.body.textContent || doc.body.innerText || "";
    // Clean up multiple newlines
    text = text.replace(/\n{3,}/g, "\n\n").trim();
    return text;
  } catch (err) {
    console.error("HTML to Plain Text conversion failed:", err);
    return html;
  }
};

// Helper to convert user's plain text input back to styled HTML for DB storage
const plainTextToHtml = (text) => {
  if (!text) return "";
  
  const blocks = text.split(/\n\n+/).map(b => b.trim()).filter(Boolean);
  
  return blocks.map((block) => {
    // Check if block is a bulleted list
    if (block.startsWith("•") || block.startsWith("-") || block.startsWith("*")) {
      const items = block
        .split("\n")
        .map((line) => line.replace(/^[•\-*\s]+/, "").trim())
        .filter(Boolean)
        .map((item) => {
          const htmlItem = item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
          return `  <li>${htmlItem}</li>`;
        })
        .join("\n");
      return `<ul class="list-disc pl-6 mb-6 leading-relaxed flex flex-col gap-2">\n${items}\n</ul>`;
    }

    // Check if block is a heading (short line, no final period)
    const isHeading = block.length < 60 && !block.endsWith(".") && !block.endsWith("?") && !block.endsWith("!");
    if (isHeading) {
      return `<h3 class="font-display font-bold text-2xl text-[#2D1F17] mt-8 mb-4">${block}</h3>`;
    }

    // Default to paragraph
    const paragraphText = block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return `<p class="mb-6 leading-relaxed">${paragraphText}</p>`;
  }).join("\n");
};

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    summary: "",
    content: "",
    isPublished: false,
  });

  const [imageFile, setImageFile] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/blogs");
      if (res.data.success) {
        setBlogs(res.data.blogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      const res = await api.delete(`/blogs/${id}`);
      if (res.data.success) {
        fetchBlogs();
      }
    } catch (err) {
      alert("Failed to delete blog post.");
    }
  };

  const handleOpenModal = (blog = null) => {
    setFormError("");
    if (blog) {
      setEditBlog(blog);
      setFormData({
        title: blog.title || "",
        category: blog.category || "",
        summary: blog.summary || "",
        content: htmlToPlainText(blog.content || ""),
        isPublished: !!blog.isPublished,
      });
    } else {
      setEditBlog(null);
      setFormData({
        title: "",
        category: "Honey",
        summary: "",
        content: "",
        isPublished: false,
      });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    const dataObj = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (key === "content") {
        dataObj.append(key, plainTextToHtml(val));
      } else {
        dataObj.append(key, val);
      }
    });

    if (imageFile) {
      dataObj.append("image", imageFile);
    }

    try {
      let res;
      if (editBlog) {
        res = await api.put(`/blogs/${editBlog._id}`, dataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/blogs", dataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        setShowModal(false);
        fetchBlogs();
      }
    } catch (err) {
      setFormError(err.response?.data?.error || "Error processing blog post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold">Blog Article Manager</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Compose healthy recipes, organic stories, and lifestyle articles</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center space-x-1.5 btn-gradient text-xs font-bold uppercase tracking-widest py-3 px-5 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Write Blog</span>
        </button>
      </div>

      {/* Blogs Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-400 font-light">No articles created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <div
              key={b._id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div className="relative h-44 bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={getImageUrl(b.image)}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-3 right-3 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                  b.isPublished
                    ? "bg-green-500/10 border-green-500/25 text-green-500"
                    : "bg-amber-500/10 border-amber-500/25 text-amber-500"
                }`}>
                  {b.isPublished ? "Published" : "Draft"}
                </span>
                <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded uppercase">
                  {b.category}
                </span>
              </div>

              {/* Details and Actions */}
              <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">{b.title}</h3>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed font-light">{b.summary}</p>
                  <p className="text-[8px] text-zinc-400 mt-2 font-light">Author: <span className="font-bold">{b.author?.name}</span> • {b.readingTime || "2 min read"}</p>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/40">
                  <button
                    onClick={() => handleOpenModal(b)}
                    className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 text-zinc-500 hover:text-amber-500 rounded-lg transition-colors"
                    title="Edit blog post"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-red-500/40 text-zinc-500 hover:text-red-500 rounded-lg transition-colors"
                    title="Delete blog post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-xl flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-playfair text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editBlog ? `Edit Post: ${editBlog.title}` : "Compose New Article"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/25 text-red-500 font-semibold rounded-xl flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Article Title</label>
                  <input
                    type="text"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Category</label>
                  <input
                    type="text"
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="Honey / Wellness / Cooking"
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Summary / Excerpt</label>
                <input
                  type="text"
                  name="summary"
                  value={formData.summary}
                  onChange={handleFormChange}
                  placeholder="Short 1-sentence teaser summary"
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:uppercase file:font-bold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Body Content (Use standard paragraphs and bullet points)</label>
                <textarea
                  required
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  rows={8}
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none font-sans"
                  placeholder="Type normal paragraphs. Use double-newline to separate paragraphs. Use • or - at the beginning of lines for lists."
                />
              </div>

              <label className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleFormChange}
                  className="accent-amber-500"
                />
                <span className="text-zinc-650 dark:text-zinc-400">Publish immediately (visible to store readers)</span>
              </label>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-zinc-250 dark:border-zinc-800 text-zinc-500 uppercase font-bold tracking-widest py-3 px-5 rounded-xl hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gradient font-bold uppercase tracking-widest py-3 px-5 rounded-xl disabled:opacity-50 flex items-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      <span>Saving Article...</span>
                    </>
                  ) : (
                    <span>Save Post</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
