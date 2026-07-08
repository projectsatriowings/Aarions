import React, { useState, useEffect, useRef } from "react";
import {
  Plus, Edit2, Trash2, Search, X, Loader2, AlertCircle,
  Package, Tag, BarChart2, BookOpen, Leaf, Upload, CheckSquare,
  ChevronRight, Info, Star, Sparkles, ShieldCheck
} from "lucide-react";
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
          className="inline-flex items-center space-x-1.5 btn-gradient text-xs font-bold uppercase tracking-widest py-3 px-5 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex items-center bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 w-full max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 mr-2" />
          <input className="modal-input"
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

      {/* Add / Edit Product Modal — Redesigned */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className="relative bg-white dark:bg-zinc-950 w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: "92vh" }}
          >
            {/* ── Gradient Header Bar ── */}
            <div
              className="flex items-center justify-between px-7 py-5"
              style={{ background: "linear-gradient(135deg, #8B1E1A 0%, #C8870F 100%)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-playfair text-lg font-bold text-white leading-tight">
                    {editProduct ? "Edit Product" : "Add New Product"}
                  </h3>
                  {editProduct && (
                    <p className="text-white/60 text-[10px] font-medium tracking-wide mt-0.5">{editProduct.name}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* ── Tab Nav ── */}
            <ProductModalTabs
              formData={formData}
              formError={formError}
              categories={categories}
              imageFile={imageFile}
              setImageFile={setImageFile}
              submitting={submitting}
              handleFormChange={handleFormChange}
              handleCategorySelect={handleCategorySelect}
              handleFormSubmit={handleFormSubmit}
              onClose={() => setShowModal(false)}
              editProduct={editProduct}
            />
          </div>
        </div>
      )}

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Module-level style constants and sub-components.
   IMPORTANT: Field & SectionHead MUST live outside ProductModalTabs.
   If defined inside, React creates a new component identity on every
   render (every keystroke), unmounting the focused input and causing
   the "only one letter types" bug.
───────────────────────────────────────────────────────────── */

/* Shared inline styles (bypasses Tailwind purge) */
const MODAL_S = {
  input: {
    width: "100%",
    border: "1.5px solid #E5E1D8",
    borderRadius: "10px",
    padding: "9px 14px",
    fontSize: "12px",
    outline: "none",
    fontFamily: "Inter, sans-serif",
    transition: "border-color .15s",
    boxSizing: "border-box",
  },
  label: {
    display: "block",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#44403C",
    marginBottom: "5px",
  },
  sectionHead: {
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "#1C1917",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    marginBottom: "14px",
    paddingBottom: "10px",
    borderBottom: "1.5px solid #F0EBE0",
  },
  card: {
    background: "#FFFCF5",
    border: "1.5px solid #EDE8DE",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
  },
};

/* Field wrapper — stable module-level component */
function ModalField({ label, children, full }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <label style={MODAL_S.label}>{label}</label>
      {children}
    </div>
  );
}

/* Section heading — stable module-level component */
function ModalSectionHead({ icon: Icon, color, children }) {
  return (
    <div style={MODAL_S.sectionHead}>
      <span style={{ display:"inline-flex", background: color + "18", borderRadius:"7px", padding:"5px" }}>
        <Icon style={{ width:"13px", height:"13px", color }} />
      </span>
      <span>{children}</span>
    </div>
  );
}

function ProductModalTabs({
  formData, formError, categories, imageFile, setImageFile,
  submitting, handleFormChange, handleCategorySelect, handleFormSubmit, onClose, editProduct,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const tabs = [
    { label: "Basic Info",        icon: Package,  desc: "Name, pricing & stock" },
    { label: "Content & Details", icon: BookOpen, desc: "Story, features & nutrition" },
    { label: "Media & Tags",      icon: Upload,   desc: "Image & product flags" },
  ];

  /* S & Field are now module-level — see MODAL_S, ModalField, ModalSectionHead above */
  const S = MODAL_S;

  return (
    <form
      onSubmit={handleFormSubmit}
      style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden", minHeight:0 }}
    >
      {/* Error Banner */}
      {formError && (
        <div style={{ margin:"16px 24px 0", padding:"12px 16px", background:"#FEF2F2", border:"1.5px solid #FECACA", borderRadius:"12px", display:"flex", alignItems:"center", gap:"8px" }}>
          <AlertCircle style={{ width:"15px", height:"15px", color:"#DC2626", flexShrink:0 }} />
          <span style={{ fontSize:"12px", fontWeight:600, color:"#DC2626" }}>{formError}</span>
        </div>
      )}

      {/* Body */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ── Sidebar ── */}
        <div style={{ width:"200px", flexShrink:0, borderRight:"1.5px solid #F0EBE0", background:"#FFFCF5", padding:"16px", display:"flex", flexDirection:"column", gap:"6px" }}>
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const active = activeTab === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveTab(i)}
                style={{
                  width:"100%",
                  textAlign:"left",
                  padding:"12px 12px",
                  borderRadius:"12px",
                  border:"none",
                  cursor:"pointer",
                  transition:"all .18s",
                  background: active ? "linear-gradient(135deg,#8B1E1A 0%,#C8870F 100%)" : "transparent",
                  display:"flex",
                  alignItems:"center",
                  gap:"10px",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F5EFE6"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{
                  display:"inline-flex",
                  width:"30px", height:"30px",
                  borderRadius:"8px",
                  alignItems:"center", justifyContent:"center",
                  flexShrink:0,
                  background: active ? "rgba(255,255,255,.2)" : "#EDE8DE",
                }}>
                  <Icon style={{ width:"14px", height:"14px", color: active ? "#fff" : "#78716C" }} />
                </span>
                <div>
                  <div style={{ fontSize:"11px", fontWeight:700, color: active ? "#fff" : "#1C1917", lineHeight:1.2 }}>{tab.label}</div>
                  <div style={{ fontSize:"9px", fontWeight:500, color: active ? "rgba(255,255,255,.75)" : "#78716C", marginTop:"2px", lineHeight:1.2 }}>{tab.desc}</div>
                </div>
              </button>
            );
          })}

          {/* Progress dots */}
          <div style={{ marginTop:"auto", paddingTop:"16px", borderTop:"1.5px solid #F0EBE0", textAlign:"center" }}>
            <div style={{ fontSize:"9px", fontWeight:600, color:"#A8A29E", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"8px" }}>
              Step {activeTab + 1} of {tabs.length}
            </div>
            <div style={{ display:"flex", gap:"5px", justifyContent:"center" }}>
              {tabs.map((_, i) => (
                <div key={i} style={{
                  height:"5px",
                  borderRadius:"99px",
                  transition:"all .3s",
                  width: activeTab === i ? "20px" : "6px",
                  background: activeTab === i ? "#8B1E1A" : "#D6D3D1",
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Content Area ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"24px" }}>

          {/* ══ TAB 0: Basic Info ══ */}
          {activeTab === 0 && (
            <>
              <div style={S.card}>
                <ModalSectionHead icon={Tag} color="#8B1E1A">Identification</ModalSectionHead>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                  <ModalField label="Product Name *" full>
                    <input className="modal-input"
                      type="text" required name="name" value={formData.name}
                      onChange={handleFormChange} placeholder="e.g. A2 Gir Cow Ghee"
                      style={S.input}
                      onFocus={e => e.target.style.borderColor="#C8870F"}
                      onBlur={e => e.target.style.borderColor="#E5E1D8"}
                    />
                  </ModalField>
                  <ModalField label="Category *">
                    <select className="modal-input"
                      required value={formData.category} onChange={handleCategorySelect}
                      style={S.input}
                      onFocus={e => e.target.style.borderColor="#C8870F"}
                      onBlur={e => e.target.style.borderColor="#E5E1D8"}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
                    </select>
                  </ModalField>
                  <ModalField label="SKU Code *">
                    <input className="modal-input"
                      type="text" required name="sku" value={formData.sku}
                      onChange={handleFormChange}
                      style={{ ...S.input, fontFamily:"monospace" }}
                      onFocus={e => e.target.style.borderColor="#C8870F"}
                      onBlur={e => e.target.style.borderColor="#E5E1D8"}
                    />
                  </ModalField>
                  <ModalField label="Default Weight / Volume *">
                    <input className="modal-input"
                      type="text" required name="weight" value={formData.weight}
                      onChange={handleFormChange} placeholder="e.g. 500 ml"
                      style={S.input}
                      onFocus={e => e.target.style.borderColor="#C8870F"}
                      onBlur={e => e.target.style.borderColor="#E5E1D8"}
                    />
                  </ModalField>
                  <ModalField label="Badge Label" full>
                    <input className="modal-input"
                      type="text" name="badge" value={formData.badge}
                      onChange={handleFormChange} placeholder="e.g. Hot / Rare / New"
                      style={S.input}
                      onFocus={e => e.target.style.borderColor="#C8870F"}
                      onBlur={e => e.target.style.borderColor="#E5E1D8"}
                    />
                  </ModalField>
                </div>
              </div>

              <div style={S.card}>
                <ModalSectionHead icon={BarChart2} color="#C8870F">Pricing & Stock</ModalSectionHead>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px" }}>
                  <ModalField label="Sale Price (₹) *">
                    <input className="modal-input" type="number" required name="price" value={formData.price} onChange={handleFormChange} placeholder="0" style={S.input}
                      onFocus={e => e.target.style.borderColor="#C8870F"} onBlur={e => e.target.style.borderColor="#E5E1D8"} />
                  </ModalField>
                  <ModalField label="Original Price (₹)">
                    <input className="modal-input" type="number" name="originalPrice" value={formData.originalPrice} onChange={handleFormChange} placeholder="0" style={S.input}
                      onFocus={e => e.target.style.borderColor="#C8870F"} onBlur={e => e.target.style.borderColor="#E5E1D8"} />
                  </ModalField>
                  <ModalField label="Stock Quantity *">
                    <input className="modal-input" type="number" required name="inventory" value={formData.inventory} onChange={handleFormChange} placeholder="100" style={S.input}
                      onFocus={e => e.target.style.borderColor="#C8870F"} onBlur={e => e.target.style.borderColor="#E5E1D8"} />
                  </ModalField>
                </div>
              </div>

              <div style={S.card}>
                <ModalSectionHead icon={Info} color="#78716C">Short Description</ModalSectionHead>
                <label style={S.label}>Shown on product listing cards *</label>
                <textarea className="modal-input" required name="description" value={formData.description} onChange={handleFormChange}
                  rows={3} placeholder="A brief, engaging description for the product card..."
                  style={{ ...S.input, resize:"vertical" }}
                  onFocus={e => e.target.style.borderColor="#C8870F"} onBlur={e => e.target.style.borderColor="#E5E1D8"}
                />
              </div>
            </>
          )}

          {/* ══ TAB 1: Content & Details ══ */}
          {activeTab === 1 && (
            <>
              <div style={S.card}>
                <ModalSectionHead icon={BookOpen} color="#8B1E1A">Product Story</ModalSectionHead>
                <label style={S.label}>Origin, tradition & unique narrative (shown in "Product Story" tab)</label>
                <textarea className="modal-input" name="details" value={formData.details} onChange={handleFormChange} rows={4}
                  placeholder="Describe the origin, tradition, and unique story of this product..."
                  style={{ ...S.input, resize:"vertical" }}
                  onFocus={e => e.target.style.borderColor="#C8870F"} onBlur={e => e.target.style.borderColor="#E5E1D8"}
                />
              </div>

              <div style={S.card}>
                <ModalSectionHead icon={Sparkles} color="#C8870F">Features & Benefits</ModalSectionHead>
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  <div>
                    <label style={S.label}>Key Highlights (comma-separated — shown as checklist)</label>
                    <input className="modal-input" type="text" name="features" value={formData.features} onChange={handleFormChange}
                      placeholder="e.g. Bilona Churned, A2 Gir Cow Milk, Rich in vitamins" style={S.input}
                      onFocus={e => e.target.style.borderColor="#C8870F"} onBlur={e => e.target.style.borderColor="#E5E1D8"} />
                  </div>
                  <div>
                    <label style={S.label}>Health Benefits (comma-separated)</label>
                    <input className="modal-input" type="text" name="benefits" value={formData.benefits} onChange={handleFormChange}
                      placeholder="e.g. Boosts immunity, Improves digestion, Rich in antioxidants" style={S.input}
                      onFocus={e => e.target.style.borderColor="#C8870F"} onBlur={e => e.target.style.borderColor="#E5E1D8"} />
                  </div>
                </div>
              </div>

              <div style={S.card}>
                <ModalSectionHead icon={ShieldCheck} color="#8B1E1A">Purity & Sourcing</ModalSectionHead>
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  <div>
                    <label style={S.label}>Purity & Processing Details (shown in "Purity" tab)</label>
                    <textarea className="modal-input" name="usage" value={formData.usage} onChange={handleFormChange} rows={3}
                      placeholder="How it's made, sourced, and quality-tested..." style={{ ...S.input, resize:"vertical" }}
                      onFocus={e => e.target.style.borderColor="#C8870F"} onBlur={e => e.target.style.borderColor="#E5E1D8"} />
                  </div>
                  <div>
                    <label style={S.label}>Ingredient / Quality Labels (comma-separated tags)</label>
                    <input className="modal-input" type="text" name="ingredients" value={formData.ingredients} onChange={handleFormChange}
                      placeholder="e.g. Lab Tested, Zero Preservatives, 100% Traceable" style={S.input}
                      onFocus={e => e.target.style.borderColor="#C8870F"} onBlur={e => e.target.style.borderColor="#E5E1D8"} />
                  </div>
                </div>
              </div>

              <div style={S.card}>
                <ModalSectionHead icon={Leaf} color="#16A34A">Nutritional Table</ModalSectionHead>
                <label style={S.label}>One entry per line — format: Label: Value (shown in Nutritional tab)</label>
                <textarea className="modal-input"
                  name="nutrients" value={formData.nutrients} onChange={handleFormChange} rows={6}
                  placeholder={"Energy: 897 kcal\nTotal Fat: 99.7g\nSaturated Fat: 61.9g\nProtein: 0.5g\nCarbohydrates: 0.5g"}
                  style={{ ...S.input, fontFamily:"monospace", resize:"vertical" }}
                  onFocus={e => e.target.style.borderColor="#C8870F"} onBlur={e => e.target.style.borderColor="#E5E1D8"}
                />
              </div>
            </>
          )}

          {/* ══ TAB 2: Media & Tags ══ */}
          {activeTab === 2 && (
            <>
              <div style={S.card}>
                <ModalSectionHead icon={Upload} color="#C8870F">Product Image</ModalSectionHead>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    position:"relative", cursor:"pointer", borderRadius:"14px",
                    border:"2px dashed #D6D0C4", minHeight:"160px",
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    gap:"8px", background:"#FDFAF4", transition:"border-color .2s", overflow:"hidden",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor="#C8870F"}
                  onMouseLeave={e => e.currentTarget.style.borderColor="#D6D0C4"}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" style={{ width:"100%", height:"200px", objectFit:"cover" }} />
                  ) : (
                    <>
                      <div style={{ width:"48px", height:"48px", borderRadius:"12px", background:"#EDE8DE", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Upload style={{ width:"20px", height:"20px", color:"#A8A29E" }} />
                      </div>
                      <p style={{ fontSize:"12px", fontWeight:600, color:"#57534E" }}>Click to upload product image</p>
                      <p style={{ fontSize:"10px", color:"#A8A29E" }}>PNG, JPG, WEBP — max 5MB</p>
                    </>
                  )}
                </div>
                <input className="modal-input" ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => setImageFile(e.target.files[0])} />
                {previewUrl && (
                  <button type="button"
                    onClick={() => { setImageFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                    style={{ marginTop:"8px", fontSize:"10px", fontWeight:600, color:"#DC2626", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:"4px" }}
                  >
                    <X style={{ width:"11px", height:"11px" }} /> Remove image
                  </button>
                )}
              </div>

              <div style={S.card}>
                <ModalSectionHead icon={Star} color="#8B1E1A">Product Flags</ModalSectionHead>
                <p style={{ fontSize:"11px", color:"#78716C", marginBottom:"16px", lineHeight:1.5 }}>
                  Toggle which sections and badges this product appears in on the storefront.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {[
                    { name:"isBestSeller", label:"Best Seller",     desc:"Shown in the Best Sellers section",       accent:"#8B1E1A", icon:"🏆" },
                    { name:"isNew",        label:"New Arrival",      desc:"Displays a 'New' badge on the card",      accent:"#059669", icon:"✨" },
                    { name:"isFeatured",   label:"Featured Product", desc:"Shown in the Featured Products section",  accent:"#C8870F", icon:"⭐" },
                  ].map(({ name, label, desc, accent, icon }) => {
                    const on = !!formData[name];
                    return (
                      <div
                        key={name}
                        onClick={() => handleFormChange({ target: { name, type:"checkbox", checked: !on } })}
                        style={{
                          display:"flex", alignItems:"center", justifyContent:"space-between",
                          padding:"14px 16px", borderRadius:"14px", cursor:"pointer",
                          border:`1.5px solid ${on ? accent + "50" : "#EDE8DE"}`,
                          background: on ? accent + "0C" : "#FDFAF4",
                          transition:"all .25s",
                          userSelect:"none",
                        }}
                      >
                        {/* Left: icon + text */}
                        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                          <div style={{
                            width:"36px", height:"36px", borderRadius:"10px", flexShrink:0,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            background: on ? accent + "18" : "#EDE8DE",
                            fontSize:"16px",
                            transition:"background .25s",
                          }}>
                            {icon}
                          </div>
                          <div>
                            <div style={{ fontSize:"12px", fontWeight:700, color:"#1C1917", lineHeight:1.3 }}>{label}</div>
                            <div style={{ fontSize:"10px", color:"#78716C", marginTop:"2px" }}>{desc}</div>
                          </div>
                        </div>

                        {/* Right: custom toggle pill */}
                        <div style={{
                          flexShrink: 0,
                          width: "48px",
                          height: "26px",
                          borderRadius: "99px",
                          background: on
                            ? `linear-gradient(135deg, ${accent} 0%, ${accent}DD 100%)`
                            : "#D6D3D1",
                          boxShadow: on ? `0 2px 8px ${accent}55` : "inset 0 1px 3px rgba(0,0,0,.1)",
                          position: "relative",
                          transition: "background .25s, box-shadow .25s",
                        }}>
                          {/* Knob */}
                          <div style={{
                            position: "absolute",
                            top: "3px",
                            left: on ? "25px" : "3px",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: "#fff",
                            boxShadow: "0 2px 6px rgba(0,0,0,.25)",
                            transition: "left .25s cubic-bezier(.34,1.56,.64,1)",
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Sticky Footer ── */}
      <div style={{ flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 24px", borderTop:"1.5px solid #F0EBE0", background:"#FFFCF5" }}>
        <div>
          {activeTab > 0 && (
            <button type="button" onClick={() => setActiveTab(t => t - 1)}
              style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:"#78716C", background:"none", border:"1.5px solid #E5E1D8", borderRadius:"10px", padding:"9px 18px", cursor:"pointer" }}>
              ← Back
            </button>
          )}
        </div>
        <div style={{ display:"flex", gap:"10px" }}>
          <button type="button" onClick={onClose}
            style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:"#78716C", background:"none", border:"1.5px solid #E5E1D8", borderRadius:"10px", padding:"9px 18px", cursor:"pointer" }}>
            Cancel
          </button>
          {activeTab < tabs.length - 1 ? (
            <button key="next-btn" type="button" onClick={() => setActiveTab(t => t + 1)}
              style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:"#fff", background:"linear-gradient(135deg,#8B1E1A 0%,#C8870F 100%)", border:"none", borderRadius:"10px", padding:"9px 22px", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" }}>
              Next <ChevronRight style={{ width:"14px", height:"14px" }} />
            </button>
          ) : (
            <button key="submit-btn" type="submit" disabled={submitting}
              style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:"#fff", background:"linear-gradient(135deg,#8B1E1A 0%,#C8870F 100%)", border:"none", borderRadius:"10px", padding:"9px 22px", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", opacity: submitting ? 0.6 : 1 }}>
              {submitting ? <><Loader2 style={{ width:"14px", height:"14px" }} className="animate-spin" /> Saving...</> : <>{editProduct ? "Update Product" : "Save Product"}</>}
            </button>
          )}
        </div>
      </div>

    </form>
  );
}
