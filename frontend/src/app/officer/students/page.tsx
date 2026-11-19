"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Download,
  BookOpen
} from "lucide-react";

export default function OfficerStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [department, setDepartment] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let query = "/students/all?";
      if (department) query += `department_code=${department}&`;
      if (statusFilter) query += `placement_status=${statusFilter}&`;
      const res = await apiRequest(query);
      setStudents(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [department, statusFilter]);

  const filtered = students.filter((s) => {
    if (!search) return true;
    return (
      s.roll_number?.toLowerCase().includes(search.toLowerCase()) ||
      s.user?.full_name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Institutional Student Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Directory & Performance Records</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Access verified candidate transcripts, coding scores, and individual placement outcomes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Roll No or Student Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 glass-input text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-3 py-2 glass-input text-xs bg-[#0C1424]"
            >
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="AIDS">AI-DS</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 glass-input text-xs bg-[#0C1424]"
            >
              <option value="">All Statuses</option>
              <option value="PLACED">Placed</option>
              <option value="NOT_PLACED">Not Placed</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Students Table */}
      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Roll Number</th>
                <th className="pb-3 font-semibold">Academic Profile</th>
                <th className="pb-3 font-semibold">Aptitude</th>
                <th className="pb-3 font-semibold">Coding</th>
                <th className="pb-3 font-semibold">Technical</th>
                <th className="pb-3 font-semibold">Backlogs</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-mono font-bold text-white">{s.roll_number}</td>
                  <td className="py-3">
                    <span className="text-white font-semibold block">CGPA: {s.cgpa} / 10</span>
                    <span className="text-[10px] text-[#94A3B8]">10th: {s.tenth_percentage}% • 12th: {s.twelfth_percentage}%</span>
                  </td>
                  <td className="py-3">
                    <span className="text-white font-medium">{s.aptitude_score}/100</span>
                  </td>
                  <td className="py-3">
                    <span className={`font-semibold ${s.coding_score >= 65 ? "text-[#34D399]" : "text-[#FBBF24]"}`}>
                      {s.coding_score}/100
                    </span>
                  </td>
                  <td className="py-3 text-[#A5B4FC]">{s.technical_score}/100</td>
                  <td className="py-3">
                    <span className={s.backlogs > 0 ? "text-[#FB7185] font-bold" : "text-[#94A3B8]"}>
                      {s.backlogs}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        s.placement_status === "PLACED"
                          ? "bg-emerald-500/20 text-[#34D399]"
                          : "bg-[#7565F6]/20 text-[#A5B4FC]"
                      }`}
                    >
                      {s.placement_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
