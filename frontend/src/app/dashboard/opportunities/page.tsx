"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  Briefcase,
  MapPin,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Filter
} from "lucide-react";

export default function OpportunitiesPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);
  const [eligibilityMap, setEligibilityMap] = useState<Record<number, any>>({});
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const [applyMessage, setApplyMessage] = useState<{ id: number; text: string; error?: boolean } | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await apiRequest("/companies/jobs");
        setJobs(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const checkEligibility = async (jobId: number) => {
    try {
      const res = await apiRequest(`/companies/jobs/${jobId}/check-eligibility`);
      setEligibilityMap((prev) => ({ ...prev, [jobId]: res }));
    } catch (err) {
      console.error(err);
    }
  };

  const applyJob = async (jobId: number) => {
    setApplyingJobId(jobId);
    setApplyMessage(null);
    try {
      await apiRequest(`/applications/apply/${jobId}`, { method: "POST" });
      setApplyMessage({ id: jobId, text: "Application submitted successfully! Track in Applications tab." });
    } catch (err: any) {
      setApplyMessage({ id: jobId, text: err.message || "Failed to apply", error: true });
    } finally {
      setApplyingJobId(null);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (filterType === "ALL") return true;
    return j.job_type === filterType;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399] text-xs font-semibold mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Placement Drives • Campus Opportunities</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Internship & Job Opportunities</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Browse verified openings, run deterministic eligibility audits, and submit direct applications.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111C32] border border-white/10 text-xs self-start">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === "ALL" ? "bg-[#7565F6] text-white font-medium" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            All Drives
          </button>
          <button
            onClick={() => setFilterType("FULL_TIME")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === "FULL_TIME" ? "bg-[#7565F6] text-white font-medium" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            Full-Time (FTE)
          </button>
          <button
            onClick={() => setFilterType("INTERNSHIP")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === "INTERNSHIP" ? "bg-[#7565F6] text-white font-medium" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            Internships
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const elig = eligibilityMap[job.id];
          const isApplying = applyingJobId === job.id;
          const msg = applyMessage?.id === job.id ? applyMessage : null;

          return (
            <GlassCard key={job.id} hoverEffect className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#7565F6]/20 text-[#A5B4FC] border border-[#7565F6]/30">
                      {job.company?.name || "Company"}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-[#94A3B8] border border-white/10 font-mono">
                      {job.job_type}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30 font-semibold">
                      {job.company?.tier?.replace("_", " ") || "TIER 1"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">{job.title}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed max-w-3xl">{job.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] pt-2">
                    <span className="text-white font-semibold flex items-center gap-1">
                      CTC: ₹{job.ctc_lpa} LPA
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span>•</span>
                    <span>{job.open_positions} Open Positions</span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 justify-center">
                  <GlassButton
                    size="sm"
                    variant="outline"
                    onClick={() => checkEligibility(job.id)}
                    className="gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
                    <span>Check Eligibility</span>
                  </GlassButton>

                  <GlassButton
                    size="sm"
                    onClick={() => applyJob(job.id)}
                    disabled={isApplying}
                    className="gap-2"
                  >
                    <span>{isApplying ? "Applying..." : "Apply Now"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </GlassButton>
                </div>
              </div>

              {/* Status Message */}
              {msg && (
                <div
                  className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    msg.error
                      ? "bg-red-500/15 border-red-500/30 text-red-300"
                      : "bg-emerald-500/15 border-emerald-500/30 text-[#34D399]"
                  }`}
                >
                  {msg.error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{msg.text}</span>
                </div>
              )}

              {/* Eligibility Result Card */}
              {elig && (
                <div className="mt-5 pt-4 border-t border-white/10 p-4 rounded-xl bg-[#080D19]/80 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-white">Eligibility Criteria Status:</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        elig.eligible ? "bg-emerald-500/20 text-[#34D399]" : "bg-red-500/20 text-[#FB7185]"
                      }`}
                    >
                      {elig.eligible ? "ELIGIBLE TO APPLY" : "RESTRICTED (CRITERIA NOT MET)"}
                    </span>
                  </div>

                  {elig.blocking_reasons.length > 0 && (
                    <div className="space-y-1 mb-3">
                      {elig.blocking_reasons.map((reason: string, rIdx: number) => (
                        <div key={rIdx} className="text-xs text-red-300 flex items-center gap-1.5">
                          <span>•</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-2 border-t border-white/5">
                    {Object.entries(elig.criteria_results).map(([k, v]: [string, any]) => (
                      <div key={k} className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                        <span className="text-[#94A3B8] capitalize">{k.replace("_", " ")}</span>
                        <span className={v.passed ? "text-[#34D399] font-bold" : "text-[#FB7185] font-bold"}>
                          {v.passed ? "✓" : "✗"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
