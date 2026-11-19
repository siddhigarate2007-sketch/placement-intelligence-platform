"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  MapPin,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";

export default function PersonalizedRoadmapPage() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await apiRequest("/recommendations/roadmap");
        setRoadmap(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmap();
  }, []);

  const toggleMilestone = async (milestoneId: string) => {
    try {
      const res = await apiRequest(`/recommendations/roadmap/milestone/${milestoneId}/toggle`, {
        method: "POST",
      });

      // Update local state
      if (roadmap) {
        const updatedStages = roadmap.stages.map((stage: any) => ({
          ...stage,
          milestones: stage.milestones.map((m: any) =>
            m.id === milestoneId ? { ...m, is_completed: res.is_completed } : m
          ),
        }));
        setRoadmap({
          ...roadmap,
          progress_percentage: res.overall_progress_percentage,
          stages: updatedStages,
        });
      }
    } catch (err) {
      console.error("Failed to toggle milestone:", err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header with Progress Bar */}
      <div className="p-6 glass-panel border-[#7565F6]/30 bg-gradient-to-r from-[#111C32] to-[#0C1424]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Personalized Preparation Blueprint • 6-Week Structured Plan</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {roadmap?.title || "6-Week Placement Readiness Blueprint"}
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1">
              Engineered based on your diagnosed skill gaps in DSA, core CS fundamentals, and system design.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-[#94A3B8] font-medium block">Overall Completion</span>
            <span className="text-3xl font-extrabold text-[#22D3EE]">
              {roadmap?.progress_percentage || 0}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-white/10 mt-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7565F6] via-[#22D3EE] to-[#34D399] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${roadmap?.progress_percentage || 0}%` }}
          />
        </div>
      </div>

      {/* Stages Timeline */}
      <div className="space-y-6">
        {(roadmap?.stages || []).map((stage: any, sIdx: number) => (
          <GlassCard key={stage.week || sIdx} className="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7565F6] to-[#22D3EE] flex items-center justify-center font-bold text-xs text-white shadow-md">
                  W{stage.week}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Week {stage.week}: {stage.title}</h3>
                  <span className="text-xs text-[#94A3B8]">Target Milestones & Practical Execution</span>
                </div>
              </div>

              <span className="text-xs text-[#64748B] font-mono">
                {stage.milestones.filter((m: any) => m.is_completed).length} / {stage.milestones.length} Completed
              </span>
            </div>

            {/* Milestones list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stage.milestones.map((m: any) => (
                <div
                  key={m.id}
                  onClick={() => toggleMilestone(m.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                    m.is_completed
                      ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                      : "bg-white/5 border-white/10 hover:border-white/20 text-[#94A3B8]"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {m.is_completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#64748B]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-bold block ${m.is_completed ? "line-through text-white/60" : "text-white"}`}>
                      {m.title}
                    </span>
                    <p className="text-[11px] text-[#94A3B8] mt-1">{m.description}</p>
                    <div className="mt-2 text-[10px] px-2 py-0.5 rounded bg-white/5 inline-block border border-white/10 font-mono text-[#A5B4FC]">
                      Task: {m.practical_task}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
