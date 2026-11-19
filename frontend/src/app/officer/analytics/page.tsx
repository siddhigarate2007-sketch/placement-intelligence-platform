"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { StatCard } from "@/components/StatCard";
import { apiRequest } from "@/lib/api";
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  PieChart as PieIcon,
  Download,
  Building2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function InstituteAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/institute/analytics");
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const deptData = (data?.department_metrics || []).map((d: any) => ({
    name: d.department.split(" ")[0],
    PlacedRate: d.placement_rate,
    AvgPackage: d.avg_salary_lpa,
  }));

  const tierData = [
    { name: "Tier 1 (>15 LPA)", value: 4, color: "#7565F6" },
    { name: "Tier 2 (8-15 LPA)", value: 2, color: "#22D3EE" },
    { name: "Tier 3 (4-8 LPA)", value: 1, color: "#34D399" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>Executive Intelligence & Institutional Analytics</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Institute-Level Placement Analytics</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          High-dimensional performance diagnostics across academic branches, compensation brackets, and skill distributions.
        </p>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Placement Rate"
          value={`${data?.overall_placement_rate || 78.4}%`}
          subtitle="Target Benchmark: 85%"
          icon={TrendingUp}
          trend="+6.1% vs prev year"
          trendDirection="up"
          accentColor="cyan"
        />
        <StatCard
          title="Highest Campus Offer"
          value={`₹${data?.highest_package_lpa || 42.0} LPA`}
          subtitle="Microsoft Azure Cloud SDE"
          icon={Award}
          trend="Record Campus Package"
          trendDirection="up"
          accentColor="violet"
        />
        <StatCard
          title="Average Salary Package"
          value={`₹${data?.average_package_lpa || 14.5} LPA`}
          subtitle={`Median: ₹${data?.median_package_lpa || 12.0} LPA`}
          icon={Briefcase}
          trend="+18% CTC Growth"
          trendDirection="up"
          accentColor="emerald"
        />
        <StatCard
          title="Active Corporate Partners"
          value={data?.active_companies || 6}
          subtitle="Tier-1 & Tier-2 Partners"
          icon={Building2}
          trend="4 Drives Scheduled"
          trendDirection="up"
          accentColor="amber"
        />
      </div>

      {/* Department Breakdown & Tier Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <GlassCard className="p-6 lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Department-Wise Placement Conversion</h3>
              <p className="text-xs text-[#94A3B8]">Placement rate (%) and average salary (LPA) by branch</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111C32", borderColor: "rgba(255,255,255,0.15)", borderRadius: "0.5rem" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="PlacedRate" name="Placement Rate (%)" fill="#7565F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="AvgPackage" name="Avg CTC (LPA)" fill="#22D3EE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-4 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-white mb-2">Hiring Tier Distribution</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#111C32", borderColor: "rgba(255,255,255,0.15)", borderRadius: "0.5rem" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] space-y-1 text-[#94A3B8] pt-2 border-t border-white/10">
            <div className="flex justify-between"><span>Tier 1 (&gt;15 LPA):</span><span className="text-white font-bold">4 Companies</span></div>
            <div className="flex justify-between"><span>Tier 2 (8-15 LPA):</span><span className="text-white font-bold">2 Companies</span></div>
          </div>
        </GlassCard>
      </div>

      {/* Recruiter Skill Demand Trends */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4">
          Industry Demand vs. Student Proficiency Benchmark
        </h3>
        <div className="space-y-4">
          {(data?.skill_demand_trends || []).map((trend: any, idx: number) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-white">{trend.skill}</span>
                <span className="text-[#94A3B8]">
                  Recruiter Demand: <strong className="text-[#22D3EE]">{trend.demand_percentage}%</strong> | Student Proficiency: <strong className="text-[#7565F6]">{trend.student_proficiency}%</strong>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
                <div className="h-full bg-[#22D3EE] rounded-l-full" style={{ width: `${trend.demand_percentage}%` }} />
                <div className="h-full bg-[#7565F6] rounded-r-full" style={{ width: `${trend.student_proficiency}%` }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
