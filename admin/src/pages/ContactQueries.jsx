import React, { useState, useEffect } from "react";
import { Search, Eye, X, Loader2, AlertCircle, HelpCircle } from "lucide-react";
import api from "../services/api";

export default function ContactQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [updating, setUpdating] = useState(false);
  
  const [statusInput, setStatusInput] = useState("");
  const [notesInput, setNotesInput] = useState("");

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contact");
      if (res.data.success) {
        setQueries(res.data.queries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleOpenDetails = (q) => {
    setSelectedQuery(q);
    setStatusInput(q.status);
    setNotesInput(q.notes || "");
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.put(`/contact/${selectedQuery._id}`, {
        status: statusInput,
        notes: notesInput,
      });
      if (res.data.success) {
        setShowModal(false);
        fetchQueries();
      }
    } catch (err) {
      alert("Failed to update query ticket details.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "in-progress":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "resolved":
        return "bg-green-500/10 text-green-500 border border-green-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold">Contact Inquiries</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Review and resolve customer support and contact forms queries</p>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500" />
        </div>
      ) : queries.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-400 font-light">No support tickets found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-850/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                  <th className="py-3 px-4 font-semibold">User Details</th>
                  <th className="py-3 px-4 font-semibold">Message</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {queries.map((q) => (
                  <tr key={q._id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/5">
                    <td className="py-3 px-4">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{q.name}</h4>
                      <p className="text-[10px] text-zinc-400">{q.email}</p>
                      <p className="text-[10px] text-zinc-400">{q.phone || "No Phone"}</p>
                    </td>
                    <td className="py-3 px-4 text-zinc-655 dark:text-zinc-400 font-light max-w-xs truncate" title={q.message}>
                      {q.message}
                    </td>
                    <td className="py-3 px-4 text-zinc-500 font-medium">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${getStatusColor(q.status)}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetails(q)}
                        className="inline-flex items-center space-x-1 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40 text-zinc-500 hover:text-amber-500 py-1.5 px-3 rounded-lg transition-colors font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedQuery && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-playfair text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Resolve Contact Query
              </h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4 text-xs">
              <div className="bg-zinc-50 dark:bg-zinc-800/10 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl leading-relaxed text-zinc-650 dark:text-zinc-400 space-y-2">
                <p><span className="font-bold text-zinc-900 dark:text-zinc-100">From:</span> {selectedQuery.name} ({selectedQuery.email})</p>
                <p className="border-t border-zinc-200/50 dark:border-zinc-850 pt-2 font-light">"{selectedQuery.message}"</p>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Ticket Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                >
                  <option value="pending">Pending Review</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved / Closed</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Resolution Notes (Internal)</label>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  rows={4}
                  placeholder="Details of email replied, follow-ups done..."
                  className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-250 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none"
                />
              </div>

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
                  disabled={updating}
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold uppercase tracking-widest py-3 px-5 rounded-xl transition-colors disabled:opacity-50 flex items-center"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      <span>Saving Ticket...</span>
                    </>
                  ) : (
                    <span>Save Resolution</span>
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
