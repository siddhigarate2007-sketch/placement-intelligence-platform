"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Code2,
  BookOpen,
  MessageSquare,
  Briefcase,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function SkillGapAnalysisPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [recsRes, profRes] = await Promise.allSettled([
          apiRequest("/recommendations/"),
          apiRequest("/students/me"),
        ]);
        if (recsRes.status === "fulfilled") setRecommendations(recsRes.value);
        if (profRes.status === "fulfilled") setProfile(profRes.value);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const benchmarkComparison = [
    { skill: "Coding & DSA", current: profile?.coding_score || 58, benchmark: 75 },
    { skill: "Quantitative Aptitude", current: profile?.aptitude_score || 68, benchmark: 75 },
    { skill: "Core Technical (DBMS/OS)", current: profile?.technical_score || 65, benchmark: 70 },
    { skill: "Communication & HR", current: profile?.communication_score || 74, benchmark: 70 },
    { skill: "Academics (CGPA)", current: Math.round((profile?.cgpa || 7.4) * 10), benchmark: 75 },
    { skill: "Practical Portfolio", current: ((profile?.projects_count || 1) * 25), benchmark: 75 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22D3EE]/15 border border-[#22D3EE]/30 text-[#22D3EE] text-xs font-semibold mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Diagnostic Skill-Gap Engine • Recruitment Benchmarking</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Competency Gap Analysis</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Identifies precise deficiencies preventing selection in Tier-1 product drives and prescribes targeted interventions.
        </p>
      </div>

      {/* Benchmark Comparison Chart */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Current Competency vs. Tier-1 Industry Cutoff</h3>
            <p className="text-xs text-[#94A3B8]">Gap differential indicates prioritized areas for rapid skill development</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkComparison} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <XAxis dataKey="skill" stroke="#94A3B8" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111C32", borderColor: "rgba(255,255,255,0.15)", borderRadius: "0.5rem" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Bar dataKey="current" name="Your Score" fill="#7565F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmark" name="Tier-1 Requirement" fill="#22D3EE" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Actionable Weakness Breakdown List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#FBBF24]" />
          <span>Specific Skill Gap Diagnostics & Actionable Protocols</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <GlassCard key={rec.id || idx} hoverEffect className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      rec.severity === "HIGH"
                        ? "bg-red-500/15 text-red-300 border-red-500/30"
                        : rec.severity === "MEDIUM"
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {rec.severity} Priority Gap
                  </span>
                  <span className="text-xs font-mono text-[#22D3EE]">
                    +{rec.target_score_improvement}% Expected Gain
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mt-3">{rec.title}</h4>
                <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">{rec.description}</p>

                {/* Steps */}
                <div className="mt-4 space-y-2">
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
                    Remediation Steps:
                  </span>
                  {(rec.actionable_steps || []).map((step: string, sIdx: number) => (
                    <div key={sIdx} className="flex items-start gap-2 text-xs text-[#F8FAFC]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#64748B] capitalize">{rec.category.toLowerCase()} Domain</span>
                <Link href="/dashboard/roadmap">
                  <GlassButton size="sm" variant="outline" className="gap-1.5">
                    <span>Add to Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
