"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { StatCard } from "@/components/StatCard";
import { apiRequest } from "@/lib/api";
import {
  GraduationCap,
  AlertTriangle,
  BookOpen,
  Users,
  CheckCircle2
} from "lucide-react";

export default function FacultyDashboardPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/students/all");
        setStudents(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Only consider non-placed students who need academic or skill remediation
  const atRiskStudents = students.filter(
    (s) => s.placement_status !== "PLACED" && (s.backlogs > 0 || s.coding_score < 60 || s.aptitude_score < 60)
  );

  return (
    <div className="min-h-screen flex bg-[#080D19]">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Navbar title="Faculty Mentorship Portal" />
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/30 text-[#FBBF24] text-xs font-semibold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Department Mentorship Portal • Student Support</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Faculty Academic Mentorship</h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Monitor department candidate progress and provide targeted guidance before upcoming recruitment drives.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Department Students"
              value={students.length || 3}
              subtitle="Batch of 2026 Mentees"
              icon={Users}
              trend="100% Tracked"
              trendDirection="up"
              accentColor="cyan"
            />
            <StatCard
              title="Needs Remediation"
              value={atRiskStudents.length}
              subtitle="Students needing skill support"
              icon={AlertTriangle}
              trend="Active Mentoring"
              trendDirection="down"
              accentColor="amber"
            />
            <StatCard
              title="Average Department CGPA"
              value="7.82 / 10"
              subtitle="Above 7.0 Placement Cutoff"
              icon={BookOpen}
              trend="+0.15 this semester"
              trendDirection="up"
              accentColor="emerald"
            />
          </div>

          {/* Flagged Students Card */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FBBF24]" />
                  <span>Students Identified for Preparation Support</span>
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Candidates requiring skill improvement or backlog clearance to meet Tier-1 corporate cutoff criteria
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {atRiskStudents.length > 0 ? (
                atRiskStudents.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-white font-mono">{s.roll_number}</span>
                        <span className="text-xs text-[#A5B4FC] bg-[#7565F6]/15 px-2 py-0.5 rounded border border-[#7565F6]/25">
                          CGPA: {s.cgpa} / 10
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-1">
                        Aptitude: {s.aptitude_score}% • Coding: {s.coding_score}% • Technical: {s.technical_score}%
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {s.backlogs > 0 && (
                        <span className="text-[10px] px-2.5 py-1 rounded-lg bg-red-500/15 text-[#FB7185] font-semibold border border-red-500/30">
                          {s.backlogs} Active Backlog(s)
                        </span>
                      )}
                      {s.coding_score < 60 && (
                        <span className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-500/15 text-[#FBBF24] font-semibold border border-amber-500/30">
                          Coding Below Cutoff ({s.coding_score}%)
                        </span>
                      )}
                      {s.aptitude_score < 60 && (
                        <span className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-500/15 text-[#FBBF24] font-semibold border border-amber-500/30">
                          Aptitude Below Cutoff ({s.aptitude_score}%)
                        </span>
                      )}
                      {s.backlogs === 0 && s.coding_score >= 60 && s.aptitude_score >= 60 && (
                        <span className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/15 text-[#34D399] font-semibold border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Meets Baseline
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-[#94A3B8]">
                  <CheckCircle2 className="w-8 h-8 text-[#34D399] mx-auto mb-2 opacity-80" />
                  <span>All active department candidates currently meet recruitment benchmark thresholds.</span>
                </div>
              )}
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
