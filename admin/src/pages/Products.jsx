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
    isFeatured: false,
    // Product detail tab fields
    details: "",         // Product Story tab
    features: "",        // Comma-separated highlight features
    usage: "",           // Purity & Processing tab
    ingredients: "",     // Ingredients / sourcing info
    benefits: "",        // Comma-separated health benefits
    nutrients: "",       // JSON key:value nutritional table
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

  // Helper to serialize nutrients map to editable string "Energy: 897 kcal\nFat: 99g"
  const nutrientsToString = (nutrientsMap) => {
    if (!nutrientsMap || typeof nutrientsMap !== "object") return "";
    return Object.entries(nutrientsMap).map(([k, v]) => `${k}: ${v}`).join("\n");
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
        isFeatured: !!product.isFeatured,
        details: product.details || "",
        features: Array.isArray(product.features) ? product.features.join(", ") : "",
        usage: product.usage || "",
        ingredients: product.ingredients || "",
        benefits: Array.isArray(product.benefits) ? product.benefits.join(", ") : "",
        nutrients: nutrientsToString(product.nutrients),
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
        isFeatured: false,
        details: "",
        features: "",
        usage: "",
        ingredients: "",
        benefits: "",
        nutrients: "",
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

    // Serialize simple fields
    Object.entries(formData).forEach(([key, val]) => {
      if (["features", "benefits", "nutrients"].includes(key)) return; // handle separately
      dataObj.append(key, val);
    });

    // features: comma-separated → JSON array
    const featuresArr = formData.features
      ? formData.features.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    dataObj.append("features", JSON.stringify(featuresArr));

    // benefits: comma-separated → JSON array
    const benefitsArr = formData.benefits
      ? formData.benefits.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    dataObj.append("benefits", JSON.stringify(benefitsArr));

    // nutrients: "Key: Value" lines → JSON object
    const nutrientsObj = {};
    if (formData.nutrients) {
      formData.nutrients.split("\n").forEach((line) => {
        const colonIdx = line.indexOf(":");
        if (colonIdx > -1) {
          const k = line.slice(0, colonIdx).trim();
          const v = line.slice(colonIdx + 1).trim();
          if (k) nutrientsObj[k] = v;
        }
      });
    }
    dataObj.append("nutrients", JSON.stringify(nutrientsObj));

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
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{prod.name}</h4>
                          {prod.isFeatured && (
                            <span className="text-[8px] tracking-wide font-extrabold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/15 px-1.5 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                          {prod.isBestSeller && (
                            <span className="text-[8px] tracking-wide font-extrabold uppercase bg-blue-500/10 text-blue-600 border border-blue-500/15 px-1.5 py-0.5 rounded">
                              Bestseller
                            </span>
                          )}
                          {prod.isNew && (
                            <span className="text-[8px] tracking-wide font-extrabold uppercase bg-green-500/10 text-green-600 border border-green-500/15 px-1.5 py-0.5 rounded">
                              New
                            </span>
                          )}
                        </div>
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
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Product Description (shown on product card)</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                />
              </div>

              {/* ── PRODUCT DETAIL TABS CONTENT ── */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <p className="text-[10px] uppercase tracking-wider font-bold text-amber-500 mb-3">📋 Product Detail Tabs (shown on product page)</p>

                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Product Story (shown in "Product Story" tab)</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleFormChange}
                      rows={4}
                      placeholder="Describe the origin, tradition, and unique story of this product..."
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Key Features / Highlights (comma-separated, shown as checklist)</label>
                    <input
                      type="text"
                      name="features"
                      value={formData.features}
                      onChange={handleFormChange}
                      placeholder="e.g. Traditionally churned (Bilona), A2 Gir Cow Milk, Rich in vitamins"
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Purity &amp; Processing / Sourcing Details ("Purity &amp; Processing" tab)</label>
                    <textarea
                      name="usage"
                      value={formData.usage}
                      onChange={handleFormChange}
                      rows={3}
                      placeholder="Describe how the product is made, sourced, and quality-tested..."
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Ingredients / Sourcing Labels (comma-separated quality tags)</label>
                    <input
                      type="text"
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleFormChange}
                      placeholder="e.g. Third-Party Lab Checked, Zero Added Preservatives, 100% Traceable"
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Health Benefits (comma-separated, shown in "Usage &amp; Benefits" tab)</label>
                    <input
                      type="text"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleFormChange}
                      placeholder="e.g. Boosts immunity, Improves digestion, Rich in antioxidants"
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Nutritional Value (one per line: "Label: Value", shown in "Nutritional Value" tab)</label>
                    <textarea
                      name="nutrients"
                      value={formData.nutrients}
                      onChange={handleFormChange}
                      rows={5}
                      placeholder={`Energy: 897 kcal\nTotal Fat: 99.7g\nSaturated Fat: 61.9g\nProtein: 0.5g\nCarbohydrates: 0.5g`}
                      className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none text-xs font-mono"
                    />
                  </div>
                </div>
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
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleFormChange}
                    className="accent-amber-500"
                  />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">Featured Product</span>
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
