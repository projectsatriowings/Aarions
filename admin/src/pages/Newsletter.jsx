import React, { useState, useEffect } from "react";
import { Mail, Calendar, CheckCircle, XCircle } from "lucide-react";
import api from "../services/api";

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await api.get("/newsletter");
        if (res.data.success) {
          setSubscribers(res.data.subscribers);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold">Newsletter Subscribers</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Review active and inactive email list registrations</p>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500" />
        </div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-400 font-light">No newsletter subscribers listed.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-850/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                  <th className="py-3 px-4 font-semibold">Subscriber Email</th>
                  <th className="py-3 px-4 font-semibold">Subscribed Date</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/5">
                    <td className="py-3 px-4 flex items-center space-x-2 font-bold text-zinc-800 dark:text-zinc-200">
                      <Mail className="w-4 h-4 text-zinc-400" />
                      <span>{sub.email}</span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 font-medium">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{new Date(sub.subscribedAt || sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                        sub.status === "subscribed"
                          ? "bg-green-500/10 border-green-500/25 text-green-500"
                          : "bg-red-500/10 border-red-500/25 text-red-500"
                      }`}>
                        {sub.status === "subscribed" ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                            Subscribed
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1 text-red-500" />
                            Unsubscribed
                          </>
                        )}
                      </span>
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
