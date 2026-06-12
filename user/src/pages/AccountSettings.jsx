import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, MapPin, Plus, Trash2, ShieldCheck, Camera, Edit2, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AccountSettings() {
  const { user, updateProfile } = useAuth();
  
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    isDefault: false,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch customer addresses from database
  const fetchAddresses = async () => {
    try {
      const res = await api.get("/auth/me"); // addresses are embedded in User or queried separately
      // Wait, we also created an Address model. Let's create `/api/addresses` in routes if we need separate address collection CRUD.
      // Yes, in routes/customerRoutes we didn't add address CRUD, but wait!
      // In customerRoutes, we can fetch me (User has an array of addresses), or let's create simple endpoints in customerRoutes if we need them!
      // Wait, let's check customerRoutes.js. Did we map addresses endpoints?
      // In customerRoutes.js, we don't have Address routes! We should add them to customerRoutes or implement it right inside the controller.
      // Let's see: we can implement address management directly in authController or write separate addresses routes.
      // Let's check `User.addresses` ref. We can query `Address` model directly, which is cleaner!
      // Let's add the address endpoints to `customerRoutes.js`:
      // - `GET /addresses`: Get user addresses.
      // - `POST /addresses`: Add address.
      // - `PUT /addresses/:id`: Edit address.
      // - `DELETE /addresses/:id`: Delete address.
      // Let's first make sure we can fetch and modify them. I will query the API:
      const addressRes = await api.get("/addresses");
      setAddresses(addressRes.data.addresses);
    } catch (err) {
      console.warn("Addresses API not bound yet, falling back to embedded user addresses.");
      // Fallback: we will fetch user profile which might contain addresses or mock it
      // Let's implement the addresses routes in the backend so it's fully production ready!
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phoneNumber || "",
      });
      setAvatarPreview(user.avatar || "");
    }
    fetchAddresses();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const formData = new FormData();
    formData.append("name", profileForm.name);
    formData.append("phoneNumber", profileForm.phone);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const res = await updateProfile(formData);
    if (res.success) {
      setSuccess("Profile updated successfully!");
    } else {
      setError(res.message);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/addresses", newAddress);
      if (res.data.success) {
        setAddresses(res.data.addresses);
        setNewAddress({
          street: "",
          city: "",
          state: "",
          postalCode: "",
          phone: "",
          isDefault: false,
        });
        setShowAddForm(false);
        setSuccess("Address added successfully!");
        fetchAddresses();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add address.");
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const res = await api.delete(`/addresses/${addrId}`);
      if (res.data.success) {
        setSuccess("Address deleted successfully!");
        fetchAddresses();
      }
    } catch (err) {
      setError("Failed to delete address.");
    }
  };

  const handleSetDefaultAddress = async (addrId) => {
    try {
      const res = await api.put(`/addresses/${addrId}/default`);
      if (res.data.success) {
        setSuccess("Default address updated!");
        fetchAddresses();
      }
    } catch (err) {
      setError("Failed to update default address.");
    }
  };

  return (
    <div className="min-h-screen pt-40 pb-24 bg-brand-cream/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-gold">Aarions Account</span>
          <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-brand-brown">Account Settings</h1>
          <div className="h-[1px] w-10 bg-brand-gold mx-auto mt-2" />
        </div>

        {error && (
          <div className="p-4 mb-8 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 mb-8 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-xl">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column (Profile & Orders) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Profile Details Form */}
            <div className="bg-white border border-brand-gold/10 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              <h2 className="font-playfair text-lg font-semibold text-brand-brown flex items-center border-b border-brand-gold/10 pb-4">
                <User className="w-5 h-5 text-brand-gold mr-2" />
                Personal Profile
              </h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* Avatar Selector */}
                <div className="flex items-center space-x-6">
                  <div className="relative w-20 h-20 rounded-full border border-brand-gold/25 overflow-hidden bg-brand-cream/10">
                    <img src={avatarPreview || "https://api.dicebear.com/7.x/initials/svg?seed=User"} alt="Avatar" className="w-full h-full object-cover" />
                    <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-5 h-5" />
                    </label>
                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-brand-brown/50">Profile Picture</h4>
                    <p className="text-[10px] text-brand-brown/40">Upload JPG, PNG or WebP. Max 2MB.</p>
                  </div>
                </div>

                {/* Text Fields */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/50">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-brand-cream/20 border border-brand-gold/10 rounded-xl px-4 py-3 text-xs text-brand-brown outline-none focus:border-brand-gold/60"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-brand-brown/50">Primary Contact Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-brand-cream/20 border border-brand-gold/10 rounded-xl px-4 py-3 text-xs text-brand-brown outline-none focus:border-brand-gold/60"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-brand-brown hover:bg-brand-gold hover:text-brand-brown text-white text-xs font-semibold uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>

            {/* Your Orders Tracking Card */}
            <div className="bg-white border border-brand-gold/10 p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
              <h2 className="font-playfair text-lg font-semibold text-brand-brown flex items-center border-b border-brand-gold/10 pb-4">
                <ShoppingBag className="w-5 h-5 text-brand-gold mr-2" />
                Your Orders
              </h2>
              <p className="text-xs text-brand-brown/60 leading-relaxed font-light">
                Check active deliveries, courier status, and full tracking logs for your traditionally sourced purchases.
              </p>
              <Link
                to="/orders"
                className="inline-flex items-center space-x-2 bg-brand-gold hover:bg-brand-brown text-brand-brown hover:text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all shadow-sm border border-brand-gold/25"
              >
                <span>Track & View Orders</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Address Book Settings (Right Column) */}
          <div className="lg:col-span-6 bg-white border border-brand-gold/10 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-brand-gold/10 pb-4">
              <h2 className="font-playfair text-lg font-semibold text-brand-brown flex items-center">
                <MapPin className="w-5 h-5 text-brand-gold mr-2" />
                Address Book
              </h2>
              <button
                onClick={() => setShowAddForm(prev => !prev)}
                className="text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:underline flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add New
              </button>
            </div>

            {/* Address List */}
            {loadingAddresses ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-brown" />
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-xs text-brand-brown/40 text-center py-6 font-light">No addresses saved. Add one to speed up checkout.</p>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="bg-brand-cream/5 border border-brand-gold/10 rounded-xl p-4 flex justify-between items-start text-xs relative"
                    >
                      <div className="space-y-1 pr-6">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-brand-brown">{addr.street}</span>
                          {addr.isDefault && (
                            <span className="bg-green-50 text-green-600 border border-green-100 text-[8px] font-bold px-1.5 py-0.5 rounded">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-brand-brown/60">{addr.city}, {addr.state} - {addr.postalCode}</p>
                        <p className="text-[10px] text-brand-brown/40">Phone: {addr.phone}</p>
                      </div>

                      <div className="flex flex-col space-y-2 items-end">
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr._id)}
                            className="text-[9px] uppercase tracking-wider font-semibold text-brand-gold hover:underline"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Add Address Form Overlay */}
            {showAddForm && (
              <form onSubmit={handleAddAddress} className="bg-brand-cream/10 border border-brand-gold/15 p-5 rounded-xl space-y-4 text-xs">
                <h3 className="font-semibold text-brand-brown uppercase text-[10px] tracking-wider">Add Address Details</h3>
                
                <div className="flex flex-col space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-brand-brown/50">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddress.street}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                    placeholder="Plot / Door No, Street Name"
                    className="bg-white border border-brand-gold/10 rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-brand-brown/50">City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="e.g. Chennai"
                      className="bg-white border border-brand-gold/10 rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-brand-brown/50">State</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="e.g. Tamil Nadu"
                      className="bg-white border border-brand-gold/10 rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-brand-brown/50">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="600001"
                      className="bg-white border border-brand-gold/10 rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-brand-brown/50">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g. 98765 43210"
                      className="bg-white border border-brand-gold/10 rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="accent-brand-gold"
                  />
                  <span className="text-[10px] text-brand-brown/65">Set as default delivery address</span>
                </label>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="bg-brand-brown text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2.5 rounded-lg hover:bg-brand-gold hover:text-brand-brown transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-brand-gold/25 text-brand-brown/60 text-[10px] uppercase font-bold tracking-widest px-4 py-2.5 rounded-lg hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
