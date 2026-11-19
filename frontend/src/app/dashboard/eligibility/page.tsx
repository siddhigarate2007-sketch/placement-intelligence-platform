"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Award,
  ArrowRight
} from "lucide-react";

export default function CompanyEligibilityPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const list = await apiRequest("/companies/jobs");
        setJobs(list);
        if (list.length > 0) {
          setSelectedJobId(list[0].id);
          evaluate(list[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchJobs();
  }, []);

  const evaluate = async (jobId: number) => {
    setSelectedJobId(jobId);
    setLoading(true);
    try {
      const res = await apiRequest(`/companies/jobs/${jobId}/check-eligibility`);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399] text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Automated Eligibility Matrix • Policy Compliance</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Company-Specific Eligibility Checker</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Verify deterministic institutional hiring requirements before applying to avoid drive rejections.
        </p>
      </div>

      {/* Company Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {jobs.map((job) => (
          <button
            key={job.id}
            onClick={() => evaluate(job.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedJobId === job.id
                ? "bg-[#7565F6]/20 border-[#7565F6] shadow-glow-violet"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <span className="text-xs font-bold text-white block">{job.company?.name}</span>
            <span className="text-[11px] text-[#22D3EE] font-mono mt-0.5 block truncate">{job.title}</span>
            <span className="text-[10px] text-[#64748B] mt-1 block">₹{job.ctc_lpa} LPA</span>
          </button>
        ))}
      </div>

      {/* Selected Job & Detailed Evaluation */}
      {result && (
        <GlassCard glow={result.eligible ? "cyan" : "violet"} className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
                {result.company_name}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{result.job_title}</h2>
            </div>
            <div>
              <span
                className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${
                  result.eligible
                    ? "bg-emerald-500/20 text-[#34D399] border border-emerald-500/30"
                    : "bg-red-500/20 text-[#FB7185] border border-red-500/30"
                }`}
              >
                {result.eligible ? "STATUS: ELIGIBLE TO APPLY" : "STATUS: NOT ELIGIBLE"}
              </span>
            </div>
          </div>

          {/* Blocking Reasons if not eligible */}
          {result.blocking_reasons.length > 0 && (
            <div className="my-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 space-y-1.5">
              <span className="text-xs font-bold text-red-200 block mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Eligibility Disqualifiers:
              </span>
              {result.blocking_reasons.map((r: string, idx: number) => (
                <div key={idx} className="text-xs text-red-300 flex items-center gap-2">
                  <span>•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}

          {/* Criteria Checklist Grid */}
          <div className="space-y-3 mt-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Detailed Criteria Audit
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(result.criteria_results).map(([k, c]: [string, any]) => (
                <div
                  key={k}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-white block">{c.label}</span>
                    <span className="text-[11px] text-[#94A3B8]">
                      Your Record: {Array.isArray(c.actual) ? c.actual.join(", ") : String(c.actual)}
                    </span>
                  </div>
                  <div>
                    {c.passed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#34D399] bg-emerald-500/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Met
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FB7185] bg-red-500/10 px-2 py-0.5 rounded">
                        <XCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
