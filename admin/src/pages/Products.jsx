import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X, Loader2, AlertCircle } from "lucide-react";
import api, { getImageUrl } from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    categoryLabel: "",
    weight: "",
    inventory: "100",
    sku: "",
    description: "",
    badge: "",
    isBestSeller: false,
    isNew: false,
  });

  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`../products?page=${page}&search=${search}&limit=8`);
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("../categories");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this organic product?")) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        fetchProducts();
      }
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  const handleOpenModal = (product = null) => {
    setFormError("");
    if (product) {
      setEditProduct(product);
      setFormData({
        name: product.name || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        category: product.category || "",
        categoryLabel: product.categoryLabel || "",
        weight: product.weight || "",
        inventory: product.inventory || "100",
        sku: product.sku || "",
        description: product.description || "",
        badge: product.badge || "",
        isBestSeller: !!product.isBestSeller,
        isNew: !!product.isNew,
      });
    } else {
      setEditProduct(null);
      setFormData({
        name: "",
        price: "",
        originalPrice: "",
        category: "",
        categoryLabel: "",
        weight: "",
        inventory: "100",
        sku: `AAR-ORG-${Math.floor(1000 + Math.random() * 9000)}`,
        description: "",
        badge: "",
        isBestSeller: false,
        isNew: false,
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

  const handleCategorySelect = (e) => {
    const catSlug = e.target.value;
    const catObj = categories.find((cat) => cat.slug === catSlug);
    
    const getCategoryAbbr = (slug) => {
      if (!slug) return "ORG";
      const lower = slug.toLowerCase();
      if (lower.includes("honey")) return "HON";
      if (lower.includes("ghee")) return "GHE";
      if (lower.includes("masala")) return "MAS";
      if (lower.includes("spice")) return "SPI";
      return lower.replace(/[^a-z]/g, "").slice(0, 3).toUpperCase() || "ORG";
    };

    setFormData((prev) => {
      let currentNumber = "";
      const skuParts = (prev.sku || "").split("-");
      if (skuParts.length >= 3) {
        currentNumber = skuParts[2];
      } else {
        currentNumber = Math.floor(1000 + Math.random() * 9000).toString();
      }
      
      const abbr = getCategoryAbbr(catSlug);
      const newSku = `AAR-${abbr}-${currentNumber}`;

      return {
        ...prev,
        category: catSlug,
        categoryLabel: catObj ? catObj.name : "",
        sku: newSku,
      };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    const dataObj = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      dataObj.append(key, val);
    });

    if (imageFile) {
      dataObj.append("image", imageFile);
    }

    try {
      let res;
      if (editProduct) {
        res = await api.put(`/products/${editProduct._id}`, dataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/products", dataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        setShowModal(false);
        fetchProducts();
      }
    } catch (err) {
      setFormError(err.response?.data?.error || "Error processing product details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold">Product Catalog</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Manage organic items inventory, pricing, and variants</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold uppercase tracking-widest py-3 px-5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 w-full max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name, SKU, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
          />
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-400 font-light">No products match search criteria.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-850/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                  <th className="py-3 px-4 font-semibold">Details</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold text-right">Price</th>
                  <th className="py-3 px-4 font-semibold text-center">Stock</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/5">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={getImageUrl(prod.image)} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800" />
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{prod.name}</h4>
                        <span className="text-[10px] text-zinc-400 font-mono">{prod.weight}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 font-medium">{prod.categoryLabel}</td>
                    <td className="py-3 px-4 text-zinc-500 font-mono font-medium">{prod.sku}</td>
                    <td className="py-3 px-4 text-right font-bold">₹{prod.price}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        prod.inventory < 10 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                      }`}>
                        {prod.inventory} Available
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(prod)}
                        className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 text-zinc-500 hover:text-amber-500 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-red-500/40 text-zinc-500 hover:text-red-500 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 hover:underline disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-xs text-zinc-400">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 hover:underline disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-xl flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-playfair text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editProduct ? `Edit Product: ${editProduct.name}` : "Add New Organic Product"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/25 text-red-500 text-xs font-semibold rounded-xl flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Product Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={handleCategorySelect}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Price (INR)</label>
                  <input
                    type="number"
                    required
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Original Price (INR)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleFormChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Default Weight (e.g. 250 ml)</label>
                  <input
                    type="text"
                    required
                    name="weight"
                    value={formData.weight}
                    onChange={handleFormChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Initial Stock Inventory</label>
                  <input
                    type="number"
                    required
                    name="inventory"
                    value={formData.inventory}
                    onChange={handleFormChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">SKU Code</label>
                  <input
                    type="text"
                    required
                    name="sku"
                    value={formData.sku}
                    onChange={handleFormChange}
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Badge Label (e.g. Rare, Organic)</label>
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleFormChange}
                    placeholder="Hot / Popular"
                    className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Product Description</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                />
              </div>

              {/* Upload image */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="text-xs file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20"
                />
              </div>

              <div className="flex space-x-6 pt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={handleFormChange}
                    className="accent-amber-500"
                  />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">Best Seller Item</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleFormChange}
                    className="accent-amber-500"
                  />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">New Arrival Item</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-zinc-250 dark:border-zinc-800 text-zinc-500 text-xs uppercase font-bold tracking-widest py-3 px-5 rounded-xl hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold uppercase tracking-widest py-3 px-5 rounded-xl transition-colors disabled:opacity-50 flex items-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Saving Catalog...</span>
                    </>
                  ) : (
                    <span>Save Product</span>
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
