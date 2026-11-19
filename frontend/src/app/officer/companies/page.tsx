"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  Briefcase,
  Building2,
  Plus,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  MapPin
} from "lucide-react";

export default function OfficerCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [showAddCompany, setShowAddCompany] = useState<boolean>(false);
  const [showAddJob, setShowAddJob] = useState<boolean>(false);

  // New Company state
  const [companyForm, setCompanyForm] = useState({
    name: "",
    industry: "Software & Cloud",
    tier: "TIER_1",
    location: "Bangalore",
    website: "",
    description: "",
  });

  // New Job state
  const [jobForm, setJobForm] = useState({
    company_id: 1,
    title: "",
    job_type: "FULL_TIME",
    ctc_lpa: 15.0,
    stipend_monthly: 40000.0,
    location: "Bangalore / Hybrid",
    description: "",
    deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
    open_positions: 10,
    eligibility: {
      min_cgpa: 7.5,
      min_tenth_percentage: 70.0,
      min_twelfth_percentage: 70.0,
      max_backlogs: 0,
      allowed_departments: ["CSE", "IT"],
      min_aptitude_score: 65.0,
      min_coding_score: 60.0,
      required_skills: ["Python", "SQL"],
    },
  });

  const loadData = async () => {
    try {
      const [cRes, jRes] = await Promise.allSettled([
        apiRequest("/companies/"),
        apiRequest("/companies/jobs"),
      ]);
      if (cRes.status === "fulfilled") {
        setCompanies(cRes.value);
        if (cRes.value.length > 0) {
          setJobForm((prev) => ({ ...prev, company_id: cRes.value[0].id }));
        }
      }
      if (jRes.status === "fulfilled") setJobs(jRes.value);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/companies/", {
        method: "POST",
        body: JSON.stringify(companyForm),
      });
      setShowAddCompany(false);
      setCompanyForm({
        name: "",
        industry: "Software & Cloud",
        tier: "TIER_1",
        location: "Bangalore",
        website: "",
        description: "",
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/companies/jobs", {
        method: "POST",
        body: JSON.stringify(jobForm),
      });
      setShowAddJob(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Campus Drive Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Recruiting Partners & Placement Drives</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Manage partner companies, publish job announcements, and configure eligibility rule thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GlassButton size="sm" variant="outline" onClick={() => setShowAddCompany(!showAddCompany)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Add Partner Company</span>
          </GlassButton>
          <GlassButton size="sm" onClick={() => setShowAddJob(!showAddJob)} className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Post New Drive</span>
          </GlassButton>
        </div>
      </div>

      {/* Add Company Modal/Form */}
      {showAddCompany && (
        <GlassCard glow="cyan" className="p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Register New Recruiting Partner</h3>
          <form onSubmit={handleCreateCompany} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-[#94A3B8] block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atlassian"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full px-3 py-2 glass-input text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-[#94A3B8] block mb-1">Industry Domain</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud & SaaS"
                  value={companyForm.industry}
                  onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                  className="w-full px-3 py-2 glass-input text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-[#94A3B8] block mb-1">Hiring Tier</label>
                <select
                  value={companyForm.tier}
                  onChange={(e) => setCompanyForm({ ...companyForm, tier: e.target.value })}
                  className="w-full px-3 py-2 glass-input text-xs bg-[#0C1424]"
                >
                  <option value="TIER_1">Tier 1 (Dream &gt; 15 LPA)</option>
                  <option value="TIER_2">Tier 2 (Super Dream 8-15 LPA)</option>
                  <option value="TIER_3">Tier 3 (Mass Recruiter 4-8 LPA)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <GlassButton type="button" variant="outline" size="sm" onClick={() => setShowAddCompany(false)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" size="sm">
                Save Partner Company
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Active Drives Listing */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Active Campus Placement Openings ({jobs.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <GlassCard key={job.id} hoverEffect className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-[#A5B4FC]">{job.company?.name}</span>
                  <h4 className="text-base font-bold text-white mt-1">{job.title}</h4>
                  <p className="text-xs text-[#94A3B8] mt-1">{job.description}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#22D3EE]/20 text-[#22D3EE]">
                  ₹{job.ctc_lpa} LPA
                </span>
              </div>

              {/* Eligibility Specs */}
              {job.eligibility_rule && (
                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-[#94A3B8] grid grid-cols-2 gap-2">
                  <span>Min CGPA: <strong className="text-white">{job.eligibility_rule.min_cgpa}</strong></span>
                  <span>Max Backlogs: <strong className="text-white">{job.eligibility_rule.max_backlogs}</strong></span>
                  <span>Min Coding: <strong className="text-white">{job.eligibility_rule.min_coding_score}%</strong></span>
                  <span>Branches: <strong className="text-white">{(job.eligibility_rule.allowed_departments || []).join(", ")}</strong></span>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
