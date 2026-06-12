import React, { useState, useEffect } from "react";
import { Mail, Calendar } from "lucide-react";
import api from "../services/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Fetch users from the backend customers directory endpoint
        const res = await api.get("/customers");
        if (res.data.success) {
          setCustomers(res.data.customers);
        }
      } catch (err) {
        console.warn("Customers API not configured. Falling back to dummy accounts.");
        setCustomers([
          { _id: "1", name: "Aarion Customer 1", email: "customer@aarions.com", createdAt: new Date() },
          { _id: "2", name: "Sarah Connor", email: "sarah@gmail.com", createdAt: new Date(Date.now() - 24*60*60*1000) }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold">Customer Directory</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Review active customer user profiles and contact logs</p>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-amber-500" />
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-xs text-zinc-400 font-light">No customers registered yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-850/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                  <th className="py-3 px-4 font-semibold">Customer Name</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/5">
                    <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-850">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cust.name)}`} alt="Avatar" />
                      </div>
                      <span>{cust.name}</span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 font-medium">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{cust.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 font-medium">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{new Date(cust.createdAt).toLocaleDateString()}</span>
                      </div>
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
