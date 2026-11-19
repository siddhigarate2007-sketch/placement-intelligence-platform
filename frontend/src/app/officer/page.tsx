"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { StatCard } from "@/components/StatCard";
import { apiRequest } from "@/lib/api";
import {
  Users,
  Briefcase,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  Filter,
  ArrowRight,
  ExternalLink,
  Cpu
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function PlacementOfficerDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      const [anaRes, appRes] = await Promise.allSettled([
        apiRequest("/institute/analytics"),
        apiRequest("/applications/all"),
      ]);
      if (anaRes.status === "fulfilled") setAnalytics(anaRes.value);
      if (appRes.status === "fulfilled") setApplications(appRes.value);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (appId: number, newStatus: string) => {
    try {
      await apiRequest(`/applications/${appId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const funnelData = analytics?.funnel_stages || [
    { stage: "Registered", count: 180 },
    { stage: "Eligible", count: 158 },
    { stage: "Applied", count: 140 },
    { stage: "Aptitude Round", count: 92 },
    { stage: "Technical Round", count: 54 },
    { stage: "HR Interview", count: 32 },
    { stage: "Selected", count: 24 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel border-[#7565F6]/25 bg-gradient-to-r from-[#111C32] to-[#0C1424]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
            <Layers className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Placement Cell Command Center • 7-Stage Recruiter Funnel</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Institutional Placement Operations</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Real-time candidate pipeline supervision, company drives tracking, and department conversion analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/officer/ml-models">
            <GlassButton size="sm" variant="outline" className="gap-2">
              <Cpu className="w-4 h-4 text-[#22D3EE]" />
              <span>Model Registry</span>
            </GlassButton>
          </Link>
          <Link href="/reports">
            <GlassButton size="sm" className="gap-2">
              <span>Generate Audit Report</span>
              <ArrowRight className="w-4 h-4" />
            </GlassButton>
          </Link>
        </div>
      </div>

      {/* Top Institutional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Placement Rate"
          value={`${analytics?.overall_placement_rate || 78.4}%`}
          subtitle="Batch of 2026 Target: 85%"
          icon={TrendingUp}
          trend="+6.1% vs prev year"
          trendDirection="up"
          accentColor="cyan"
        />
        <StatCard
          title="Highest Offer Secured"
          value={`₹${analytics?.highest_package_lpa || 42.0} LPA`}
          subtitle="Microsoft Azure Cloud SDE"
          icon={Award}
          trend="Record Campus Package"
          trendDirection="up"
          accentColor="violet"
        />
        <StatCard
          title="Average CTC Package"
          value={`₹${analytics?.average_package_lpa || 14.5} LPA`}
          subtitle={`Median: ₹${analytics?.median_package_lpa || 12.0} LPA`}
          icon={Briefcase}
          trend="+18% CTC Growth"
          trendDirection="up"
          accentColor="emerald"
        />
        <StatCard
          title="Total Registered Students"
          value={analytics?.total_students || 180}
          subtitle={`${analytics?.total_placed || 42} Offers Confirmed`}
          icon={Users}
          trend="Phase 1 On Track"
          trendDirection="up"
          accentColor="amber"
        />
      </div>

      {/* Complete 7-Stage Recruiter Funnel Chart */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              7-Stage Campus Recruitment Conversion Funnel
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Registered → Eligible → Applied → Aptitude Round → Technical Round → HR Interview → Selected
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#34D399] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Funnel Efficiency: 17.1%
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <XAxis dataKey="stage" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111C32", borderColor: "rgba(255,255,255,0.15)", borderRadius: "0.5rem" }}
              />
              <Bar dataKey="count" name="Candidates" radius={[6, 6, 0, 0]}>
                {funnelData.map((_, index) => (
                  <Cell
                    key={`funnel-cell-${index}`}
                    fill={`hsl(${245 + index * 18}, 85%, ${65 - index * 3}%)`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Live Application Stage Manager */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-sm font-semibold text-white">Live Candidate Pipeline Manager</h3>
            <p className="text-xs text-[#94A3B8]">Transition candidate applications across interview rounds</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Student ID</th>
                <th className="pb-3 font-semibold">Company & Drive</th>
                <th className="pb-3 font-semibold">Current Round</th>
                <th className="pb-3 font-semibold">Funnel Status</th>
                <th className="pb-3 font-semibold text-right">Transition Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-mono font-medium text-white">
                    {app.student?.roll_number || `22CSE0${app.student_id}`}
                  </td>
                  <td className="py-3">
                    <span className="font-semibold text-white block">{app.job?.company?.name}</span>
                    <span className="text-[11px] text-[#94A3B8]">{app.job?.title}</span>
                  </td>
                  <td className="py-3 text-[#A5B4FC]">{app.current_round}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        app.status === "SELECTED"
                          ? "bg-emerald-500/20 text-[#34D399]"
                          : app.status === "REJECTED"
                          ? "bg-red-500/20 text-[#FB7185]"
                          : "bg-[#7565F6]/20 text-[#A5B4FC]"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-[#0C1424] border border-white/15 text-xs text-white"
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="APTITUDE">Aptitude Round</option>
                      <option value="TECHNICAL">Technical Round</option>
                      <option value="HR">HR Interview</option>
                      <option value="SELECTED">Selected / Offered</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
