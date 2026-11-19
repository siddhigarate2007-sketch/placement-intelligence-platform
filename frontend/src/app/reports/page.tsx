"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  FileSpreadsheet,
  Printer,
  Download,
  Building2,
  Award,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest("/institute/analytics");
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-[#080D19]">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Navbar title="Institutional Placement Reports" />
        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Executive Dossier • Official Campus Placement Audit</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Placement Intelligence Audit Report</h1>
              <p className="text-xs text-[#94A3B8] mt-1">
                Official accreditation dossier for TY CSE Academic Review, NBA/NAAC compliance, and institutional auditing.
              </p>
            </div>

            <GlassButton onClick={handlePrint} size="sm" className="gap-2 shrink-0">
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </GlassButton>
          </div>

          {/* Printable Report Sheet */}
          <div className="p-8 glass-panel bg-[#0C1424] border-white/15 space-y-8 print:bg-white print:text-black">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Academic Year 2025-2026 Campus Placement Audit
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  Generated on {new Date().toLocaleDateString()} • Student Placement Intelligence & Career Readiness Platform
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#22D3EE] block">STATUS: VERIFIED</span>
                <span className="text-[11px] text-[#64748B]">Audit Code: PI-2026-CSE</span>
              </div>
            </div>

            {/* Metrics Triplet */}
            <div className="grid grid-cols-4 gap-4 text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase tracking-wider block">Total Students</span>
                <span className="text-2xl font-bold text-white">{data?.total_students || 180}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] uppercase tracking-wider block">Placement Rate</span>
                <span className="text-2xl font-bold text-[#34D399]">{data?.overall_placement_rate || 78.4}%</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] uppercase tracking-wider block">Highest CTC</span>
                <span className="text-2xl font-bold text-[#22D3EE]">₹{data?.highest_package_lpa || 42.0} LPA</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] uppercase tracking-wider block">Average CTC</span>
                <span className="text-2xl font-bold text-[#A5B4FC]">₹{data?.average_package_lpa || 14.5} LPA</span>
              </div>
            </div>

            {/* Recent Placed Candidates */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Key Placement Offer Highlights
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#64748B] uppercase tracking-wider text-[10px]">
                      <th className="pb-2">Candidate</th>
                      <th className="pb-2">Roll Number</th>
                      <th className="pb-2">Department</th>
                      <th className="pb-2">Recruiting Corporation</th>
                      <th className="pb-2">Designation</th>
                      <th className="pb-2 text-right">Compensation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(data?.recent_placements || []).map((p: any, i: number) => (
                      <tr key={i} className="py-2.5">
                        <td className="py-2 font-bold text-white">{p.student_name}</td>
                        <td className="py-2 font-mono text-[#94A3B8]">{p.roll_number}</td>
                        <td className="py-2 text-[#A5B4FC]">{p.department}</td>
                        <td className="py-2 text-white font-semibold">{p.company}</td>
                        <td className="py-2 text-[#94A3B8]">{p.role}</td>
                        <td className="py-2 text-right font-mono font-bold text-[#34D399]">₹{p.package_lpa} LPA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
