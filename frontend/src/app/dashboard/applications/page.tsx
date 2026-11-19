"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  Send,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles
} from "lucide-react";

const FUNNEL_STAGES = [
  "REGISTERED",
  "ELIGIBLE",
  "APPLIED",
  "APTITUDE",
  "TECHNICAL",
  "HR",
  "SELECTED",
];

export default function ApplicationTrackingPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await apiRequest("/applications/my");
        setApplications(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  const getStageIndex = (status: string) => {
    const idx = FUNNEL_STAGES.indexOf(status.toUpperCase());
    return idx >= 0 ? idx : 2;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
            <Send className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>7-Stage Recruitment Funnel Tracker</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Placement Applications</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Track interview milestones, current screening rounds, and recruiter decisions in real time.
          </p>
        </div>

        <Link href="/dashboard/opportunities">
          <GlassButton size="sm" className="gap-2 shrink-0">
            <span>Explore More Drives</span>
            <ArrowRight className="w-4 h-4" />
          </GlassButton>
        </Link>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {applications.length > 0 ? (
          applications.map((app) => {
            const currentStageIdx = getStageIndex(app.status);
            const isSelected = app.status === "SELECTED";
            const isRejected = app.status === "REJECTED";

            return (
              <GlassCard
                key={app.id}
                glow={isSelected ? "cyan" : "none"}
                className="p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#A5B4FC]">
                        {app.job?.company?.name || "Company"}
                      </span>
                      <span className="text-[11px] text-[#64748B]">•</span>
                      <span className="text-xs font-semibold text-white">
                        {app.job?.title || "Role"}
                      </span>
                    </div>
                    <span className="text-xs text-[#94A3B8]">
                      CTC: ₹{app.job?.ctc_lpa} LPA • Applied on {new Date(app.applied_at).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-center ${
                      isSelected
                        ? "bg-emerald-500/20 text-[#34D399] border border-emerald-500/30"
                        : isRejected
                        ? "bg-red-500/20 text-[#FB7185] border border-red-500/30"
                        : "bg-[#7565F6]/20 text-[#A5B4FC] border border-[#7565F6]/30"
                    }`}
                  >
                    {app.status} • {app.current_round}
                  </span>
                </div>

                {/* 7-Stage Visual Funnel Progression */}
                <div className="py-6">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#64748B] mb-2 uppercase">
                    {FUNNEL_STAGES.map((stg, idx) => (
                      <span
                        key={stg}
                        className={idx <= currentStageIdx ? "text-[#22D3EE] font-bold" : ""}
                      >
                        {stg}
                      </span>
                    ))}
                  </div>

                  {/* Funnel Progress Steps */}
                  <div className="grid grid-cols-7 gap-1">
                    {FUNNEL_STAGES.map((stg, idx) => {
                      const isComplete = idx <= currentStageIdx;
                      return (
                        <div
                          key={stg}
                          className={`h-2 rounded-full transition-all ${
                            isComplete
                              ? "bg-gradient-to-r from-[#7565F6] to-[#22D3EE]"
                              : "bg-white/10"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Feedback or Notes */}
                {app.feedback && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8] flex items-start gap-2">
                    <span className="text-[#22D3EE] font-bold">Recruiter Feedback:</span>
                    <span>{app.feedback}</span>
                  </div>
                )}
              </GlassCard>
            );
          })
        ) : (
          <GlassCard className="p-12 text-center text-xs text-[#94A3B8]">
            <Briefcase className="w-8 h-8 text-[#64748B] mx-auto mb-3" />
            <p className="font-semibold text-white text-sm">No applications submitted yet.</p>
            <p className="mt-1">Check out available campus drives in Opportunities to submit your first application.</p>
            <Link href="/dashboard/opportunities" className="inline-block mt-4">
              <GlassButton size="sm">Browse Opportunities</GlassButton>
            </Link>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
