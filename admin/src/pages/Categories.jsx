import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import api, { getImageUrl } from "../services/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories"); // calling /api/admin/categories
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("../products?limit=50");
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? All associated products might loose category references.")) return;
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data.success) {
        fetchCategories();
        fetchProducts(); // Refresh product associations
      }
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  const handleOpenModal = (category = null) => {
    setFormError("");
    if (category) {
      setEditCategory(category);
      setFormData({
        name: category.name || "",
        description: category.description || "",
        isActive: category.isActive !== undefined ? category.isActive : true,
      });
      // Pre-select products in this category
      const associatedProductIds = products
        .filter(p => p.category === category.slug || p.categoryRef === category._id)
        .map(p => p._id);
      setSelectedProductIds(associatedProductIds);
    } else {
      setEditCategory(null);
      setFormData({
        name: "",
        description: "",
        isActive: true,
      });
      setSelectedProductIds([]);
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
    dataObj.append("name", formData.name);
    dataObj.append("description", formData.description);
    dataObj.append("isActive", formData.isActive);
    dataObj.append("productIds", JSON.stringify(selectedProductIds));

    if (imageFile) {
      dataObj.append("image", imageFile);
    }

    try {
      let res;
      if (editCategory) {
        res = await api.put(`/categories/${editCategory._id}`, dataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/categories", dataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        setShowModal(false);
        fetchCategories();
        fetchProducts(); // Refresh local product states
      }
    } catch (err) {
      setFormError(err.response?.data?.error || "Error processing category settings.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold">Categories Registry</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Manage e-commerce structural layout classifications (Honey, Ghee, Spices, Masala)</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center space-x-1.5 btn-gradient text-xs font-bold uppercase tracking-widest py-3 px-5 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-400 font-light">No categories created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              {/* Category Image Preview */}
              <div className="relative h-36 bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={getImageUrl(cat.image) || "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80"}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                  cat.isActive ? "bg-green-500/10 border-green-500/25 text-green-500" : "bg-red-500/10 border-red-500/25 text-red-500"
                }`}>
                  {cat.isActive ? "Active" : "Disabled"}
                </span>
              </div>

              {/* Details & Actions */}
              <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">{cat.name}</h3>
                  <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
                    {cat.productCount || 0} Products
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-normal font-light">{cat.description || "No description set."}</p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/40">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 text-zinc-500 hover:text-amber-500 rounded-lg transition-colors"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-red-500/40 text-zinc-500 hover:text-red-500 rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-playfair text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editCategory ? `Edit Category: ${editCategory.name}` : "Create New Category"}
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

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Category Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Category Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:uppercase file:font-bold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Associate Products with this Category</label>
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2 bg-zinc-50 dark:bg-zinc-800/30">
                  {products.map((prod) => {
                    const isChecked = selectedProductIds.includes(prod._id);
                    return (
                      <label key={prod._id} className="flex items-center space-x-2.5 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-850 p-1.5 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProductIds(prev => [...prev, prod._id]);
                            } else {
                              setSelectedProductIds(prev => prev.filter(id => id !== prod._id));
                            }
                          }}
                          className="accent-amber-500"
                        />
                        <div className="flex items-center space-x-2">
                          <img
                            src={getImageUrl(prod.image) || "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=50&q=80"}
                            alt={prod.name}
                            className="w-6 h-6 object-cover rounded-md border border-zinc-200 dark:border-zinc-700"
                          />
                          <span className="text-[11px] font-medium text-zinc-750 dark:text-zinc-300">
                            {prod.name} {prod.category ? `(${prod.categoryLabel})` : "(Uncategorized)"}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                  {products.length === 0 && (
                    <p className="text-[10px] text-zinc-400 text-center py-2">No products available.</p>
                  )}
                </div>
              </div>

              <label className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                  className="accent-amber-500"
                />
                <span className="text-zinc-650 dark:text-zinc-400">Mark Category as Active (displays in store catalogs)</span>
              </label>

              {/* Action Buttons */}
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
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Saving Registry...</span>
                    </>
                  ) : (
                    <span>Save Category</span>
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
