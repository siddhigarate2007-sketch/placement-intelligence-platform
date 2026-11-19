"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertCircle,
  ArrowRight,
  Check
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifs = async () => {
    try {
      const res = await apiRequest("/notifications/");
      setNotifications(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markRead = async (id: number) => {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#080D19]">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Navbar title="Notifications Center" />
        <main className="flex-1 p-8 overflow-y-auto space-y-6 max-w-4xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
              <Bell className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Placement Alerts & Drive Dispatches</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Notifications Center</h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Stay informed on upcoming recruitment rounds, roadmap milestone deadlines, and mentorship alerts.
            </p>
          </div>

          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((n) => {
                const isSuccess = n.type === "SUCCESS";
                const isWarning = n.type === "WARNING";
                const isAlert = n.type === "ALERT";

                return (
                  <GlassCard
                    key={n.id}
                    className={`p-5 transition-all ${
                      n.is_read ? "opacity-75" : "border-l-4 border-l-[#7565F6]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#34D399]" />}
                          {isWarning && <AlertCircle className="w-5 h-5 text-[#FBBF24]" />}
                          {isAlert && <AlertTriangle className="w-5 h-5 text-[#FB7185]" />}
                          {!isSuccess && !isWarning && !isAlert && <Info className="w-5 h-5 text-[#22D3EE]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{n.title}</h4>
                            {!n.is_read && (
                              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs text-[#94A3B8] mt-1">{n.message}</p>
                          <span className="text-[10px] text-[#64748B] mt-2 block">
                            {new Date(n.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {n.action_url && (
                          <Link href={n.action_url}>
                            <GlassButton size="sm" variant="outline" className="gap-1.5 text-xs">
                              <span>View</span>
                              <ArrowRight className="w-3 h-3" />
                            </GlassButton>
                          </Link>
                        )}
                        {!n.is_read && (
                          <button
                            onClick={() => markRead(n.id)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#64748B] hover:text-white transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              })
            ) : (
              <GlassCard className="p-8 text-center text-xs text-[#94A3B8]">
                No new notifications.
              </GlassCard>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
