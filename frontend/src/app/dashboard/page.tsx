"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { StatCard } from "@/components/StatCard";
import { ReadinessGauge } from "@/components/ReadinessGauge";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/authContext";
import {
  Sparkles,
  BookOpen,
  Code2,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Briefcase,
  Layers,
  ChevronRight,
  Clock
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [readinessData, setReadinessData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profRes, readRes, recsRes, appsRes] = await Promise.allSettled([
          apiRequest("/students/me"),
          apiRequest("/predictions/readiness"),
          apiRequest("/recommendations/"),
          apiRequest("/applications/my"),
        ]);

        if (profRes.status === "fulfilled") setProfile(profRes.value);
        if (readRes.status === "fulfilled") setReadinessData(readRes.value);
        if (recsRes.status === "fulfilled") setRecommendations(recsRes.value);
        if (appsRes.status === "fulfilled") setApplications(appsRes.value);
      } catch (e) {
        console.error("Dashboard data load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Radar chart data for student competencies
  const competencyRadar = [
    { subject: "Aptitude", score: profile?.aptitude_score || 68, fullMark: 100 },
    { subject: "Coding", score: profile?.coding_score || 58, fullMark: 100 },
    { subject: "Technical", score: profile?.technical_score || 65, fullMark: 100 },
    { subject: "Comm.", score: profile?.communication_score || 74, fullMark: 100 },
    { subject: "Academics", score: (profile?.cgpa || 7.4) * 10, fullMark: 100 },
  ];

  const readinessScore = readinessData?.readiness_score || 72.4;
  const placementProb = readinessData?.probability_percentage || 68.0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel border-[#7565F6]/25 bg-gradient-to-r from-[#111C32] to-[#0C1424]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Hello, {profile?.user?.full_name || user?.full_name || "Priya Patel"}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#7565F6]/20 text-[#A5B4FC] border border-[#7565F6]/30 font-medium">
              {profile?.roll_number || "22IT078"}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">
            Department of Information Technology • Batch of 2026 • Campus Placement Phase 1
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/prediction">
            <GlassButton size="sm" className="gap-2">
              <Sparkles className="w-4 h-4 text-[#22D3EE]" />
              <span>Evaluate Placement Probability</span>
            </GlassButton>
          </Link>
        </div>
      </div>

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Placement Readiness Index"
          value={`${readinessScore}%`}
          subtitle="Multi-competency blend"
          icon={TrendingUp}
          trend={readinessScore >= 70 ? "+4.2% this week" : "Needs attention"}
          trendDirection={readinessScore >= 70 ? "up" : "down"}
          accentColor="cyan"
        />
        <StatCard
          title="ML Placement Probability"
          value={`${placementProb}%`}
          subtitle="Model: Gradient Boosting"
          icon={Sparkles}
          trend="Champion Architecture"
          trendDirection="up"
          accentColor="violet"
        />
        <StatCard
          title="Cumulative CGPA"
          value={profile?.cgpa ? `${profile.cgpa} / 10` : "7.4 / 10"}
          subtitle="0 Active Backlogs"
          icon={BookOpen}
          trend="Eligible for Tier-1"
          trendDirection="up"
          accentColor="emerald"
        />
        <StatCard
          title="Active Applications"
          value={applications.length || 1}
          subtitle="In Recruitment Funnel"
          icon={Briefcase}
          trend="1 in Technical Round"
          trendDirection="up"
          accentColor="indigo"
        />
      </div>

      {/* Readiness & Competency Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circular Gauge Card */}
        <GlassCard className="flex flex-col items-center justify-center p-6">
          <h3 className="text-sm font-semibold text-white mb-4 self-start">Placement Readiness Status</h3>
          <ReadinessGauge score={readinessScore} size={190} />
          <div className="w-full mt-6 pt-4 border-t border-white/10 flex justify-between text-xs text-[#94A3B8]">
            <span>Decision Boundary: 50%</span>
            <span className="text-[#34D399] font-medium">Tier-1 Target: &gt;75%</span>
          </div>
        </GlassCard>

        {/* Competency Radar Visualizer */}
        <GlassCard className="p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-white">Multidimensional Competency Radar</h3>
              <p className="text-xs text-[#94A3B8]">Benchmark profile across five placement dimensions</p>
            </div>
            <Link href="/dashboard/skill-gap" className="text-xs text-[#22D3EE] hover:underline flex items-center gap-1 font-medium">
              Detailed Gap Analysis <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={competencyRadar}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255, 255, 255, 0.15)" />
                <Radar
                  name="Student Competency"
                  dataKey="score"
                  stroke="#7565F6"
                  fill="#7565F6"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10 text-center text-xs">
            <div>
              <span className="text-[#64748B] block text-[10px]">Coding</span>
              <span className="text-[#FBBF24] font-bold">{profile?.coding_score || 58}/100</span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px]">Aptitude</span>
              <span className="text-[#A5B4FC] font-bold">{profile?.aptitude_score || 68}/100</span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px]">Technical</span>
              <span className="text-[#34D399] font-bold">{profile?.technical_score || 65}/100</span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px]">Communication</span>
              <span className="text-[#22D3EE] font-bold">{profile?.communication_score || 74}/100</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Weakness & Immediate Remediation Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Action Items */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#FBBF24]" />
              <span>Prioritized Improvement Actions</span>
            </h3>
            <Link href="/dashboard/roadmap" className="text-xs text-[#22D3EE] hover:underline font-medium">
              View 6-Week Roadmap
            </Link>
          </div>

          <div className="space-y-3">
            {recommendations.length > 0 ? (
              recommendations.slice(0, 3).map((rec, i) => (
                <div
                  key={rec.id || i}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-[#FBBF24] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{rec.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-[#A5B4FC] font-mono">
                        +{rec.target_score_improvement}% Boost
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-2">{rec.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8]">
                Loading personalized improvement actions...
              </div>
            )}
          </div>
        </GlassCard>

        {/* Funnel & Application Progress */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#22D3EE]" />
              <span>Active Placement Application</span>
            </h3>
            <Link href="/dashboard/applications" className="text-xs text-[#22D3EE] hover:underline font-medium">
              All Applications
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-[#0C1424] border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Amazon AWS</h4>
                <p className="text-xs text-[#94A3B8]">Cloud Support Associate • ₹28.5 LPA</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#7565F6]/20 text-[#A5B4FC] text-xs font-semibold border border-[#7565F6]/40">
                Technical Round 2
              </span>
            </div>

            {/* Stage Progress Tracker */}
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-[11px] text-[#94A3B8]">
                <span>Screening</span>
                <span>Aptitude</span>
                <span className="text-[#22D3EE] font-bold">Tech R2 (Active)</span>
                <span>HR Round</span>
                <span>Offer</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#7565F6] to-[#22D3EE] rounded-full w-3/5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Scheduled for Friday, 11:00 AM
              </span>
              <Link href="/dashboard/assessments/mock-interview">
                <GlassButton size="sm" variant="outline">
                  Practice Mock Interview
                </GlassButton>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
