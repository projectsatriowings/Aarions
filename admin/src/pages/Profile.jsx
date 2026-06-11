import React, { useState, useEffect } from "react";
import { User, ShieldCheck, Key, Eye, Clock, Activity } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import api from "../services/api";

export default function Profile() {
  const { admin } = useAdminAuth();
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    const fetchMyLogs = async () => {
      try {
        const res = await api.get("/dashboard"); // logs are aggregated here
        if (res.data.success) {
          // Filter audit logs for this admin
          const myLogs = res.data.recentLogs.filter(
            (log) => log.adminUser?._id === admin?.id || log.adminUser === admin?.id
          );
          setLogs(myLogs);
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err.message);
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchMyLogs();
  }, [admin]);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold">My Admin Profile</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Review account role permissions and activity logs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-xs">
        
        {/* Profile Card (1/3 width) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="text-center space-y-3">
            <div className="relative w-24 h-24 rounded-full border border-amber-500/35 overflow-hidden mx-auto bg-zinc-50 dark:bg-zinc-850">
              <img src={admin?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Admin"} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">{admin?.name}</h3>
              <p className="text-zinc-500 dark:text-zinc-400">{admin?.email}</p>
            </div>
            <span className="inline-flex items-center text-[10px] font-bold px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full uppercase">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              Role: {admin?.role}
            </span>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800/40 pt-4 space-y-2">
            <h4 className="font-bold text-zinc-800 dark:text-zinc-200 uppercase text-[9px] tracking-wider">Account Information</h4>
            <div className="space-y-1.5 text-zinc-500 dark:text-zinc-400 font-light">
              <p>Status: <span className="text-green-500 font-semibold uppercase">{admin?.status}</span></p>
            </div>
          </div>
        </div>

        {/* Permissions & Logs (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Permissions Matrix */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-playfair text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">Granted System Permissions</h3>
            
            <div className="flex flex-wrap gap-2.5">
              {admin?.role === "superadmin" ? (
                <span className="bg-green-500/10 border border-green-500/20 text-green-500 px-3.5 py-1.5 rounded-xl uppercase font-bold tracking-wider">
                  ALL_ACCESS (SUPERADMIN ROLE)
                </span>
              ) : (
                admin?.permissions?.map((p) => (
                  <span key={p} className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-650 dark:text-zinc-350 px-3 py-1.5 rounded-lg font-mono uppercase tracking-wide">
                    {p}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-playfair text-base font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center">
              <Clock className="w-4.5 h-4.5 mr-2 text-zinc-400" />
              My Recent Activity Logs
            </h3>

            {loadingLogs ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500" />
              </div>
            ) : logs.length === 0 ? (
              <p className="text-zinc-400 py-6 text-center font-light">No actions recorded in this session's feed.</p>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log._id} className="flex items-start gap-3 border-b border-zinc-100 dark:border-zinc-800/40 pb-3 last:border-b-0 last:pb-0">
                    <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-zinc-850 dark:text-zinc-200 uppercase tracking-wide text-[10px]">
                        {log.action.replace("_", " ")}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-light leading-relaxed">{log.details}</p>
                      <span className="text-[8px] text-zinc-400/80 font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
