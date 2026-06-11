import React, { useState, useEffect } from "react";
import { Check, X, Trash2, MessageSquare, Star } from "lucide-react";
import api from "../services/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reviews");
      if (res.data.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModeration = async (id, isApproved) => {
    try {
      const res = await api.put(`/reviews/${id}/approve`, { isApproved });
      if (res.data.success) {
        fetchReviews();
      }
    } catch (err) {
      alert("Failed to update review status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review permanently?")) return;
    try {
      const res = await api.delete(`/reviews/${id}`);
      if (res.data.success) {
        fetchReviews();
      }
    } catch (err) {
      alert("Failed to delete review.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold">Review Moderation</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Approve, reject, or remove customer product ratings</p>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-400 font-light">No customer reviews submitted yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-850/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Rating</th>
                  <th className="py-3 px-4 font-semibold">Comment</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/5">
                    <td className="py-3 px-4">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{rev.user?.name || "Deleted Profile"}</h4>
                      <p className="text-[10px] text-zinc-400">{rev.user?.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{rev.product?.name || "Deleted Product"}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current" : "text-zinc-200 dark:text-zinc-700"}`} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-655 dark:text-zinc-400 font-light max-w-xs truncate" title={rev.comment}>
                      {rev.comment}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        rev.isApproved
                          ? "bg-green-500/10 border-green-500/25 text-green-500"
                          : "bg-amber-500/10 border-amber-500/25 text-amber-500"
                      }`}>
                        {rev.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {!rev.isApproved ? (
                        <button
                          onClick={() => handleModeration(rev._id, true)}
                          className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-green-500/40 text-zinc-500 hover:text-green-500 rounded-lg transition-colors"
                          title="Approve review"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModeration(rev._id, false)}
                          className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 text-zinc-500 hover:text-amber-500 rounded-lg transition-colors"
                          title="Revoke approval"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="p-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-red-500/40 text-zinc-500 hover:text-red-500 rounded-lg transition-colors"
                        title="Delete review permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
