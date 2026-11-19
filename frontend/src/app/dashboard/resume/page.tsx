"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Upload,
  Cpu,
  Award,
  Layers,
  ArrowRight
} from "lucide-react";

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState(`PRIYA PATEL
Email: priya@student.edu | Phone: +91 9876543210 | Bangalore, India
LinkedIn: linkedin.com/in/priya-patel | GitHub: github.com/priya

SUMMARY
Motivated Computer Science undergraduate with hands-on expertise in Java, Spring Boot, MySQL, and full-stack software development. Passionate about cloud architectures and enterprise software systems.

EDUCATION
Bachelor of Engineering in Information Technology (CGPA: 7.4/10) - 2022 to 2026

TECHNICAL SKILLS
Languages: Java, SQL, Python, JavaScript, HTML, CSS
Databases: MySQL, PostgreSQL
Tools: Git, GitHub, Linux, Postman

PROJECTS
1. Student Attendance Management Portal
- Developed full-stack web application using Java Spring Boot and MySQL for tracking laboratory attendance.
- Automated grade reports and reduced administrative manual entry time by 40%.
- Integrated role-based authentication with bcrypt password hashing.

2. Personal Portfolio & Blog
- Built responsive static web application with HTML, Tailwind CSS and JavaScript. Hosted on GitHub Pages.`);

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const analyzeResume = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume_text", resumeText);

      // Using raw fetch for FormData
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://127.0.0.1:8000/api/v1/students/me/resume/analyze", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) throw new Error("Resume analysis failed");
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
          <FileText className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>Automated ATS Engine • Skill Extraction & Formatting Audit</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Resume ATS & Skill-Gap Analyzer</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Evaluate your resume against industry Applicant Tracking Systems (ATS). Identify keyword density and missing sections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Text Area */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#22D3EE]" />
                <span>Resume Content Editor</span>
              </h3>
              <span className="text-xs text-[#64748B]">
                {resumeText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={16}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-4 glass-input text-xs font-mono leading-relaxed"
              placeholder="Paste plain text resume content here..."
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-[#94A3B8]">
                Pro-tip: Include measurable metrics (%) to boost ATS ranking.
              </span>
              <GlassButton
                onClick={analyzeResume}
                disabled={loading}
                className="gap-2 shadow-glow-violet"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? "Analyzing ATS Compatibility..." : "Scan & Analyze Resume"}</span>
              </GlassButton>
            </div>
          </GlassCard>
        </div>

        {/* Results Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {analysis ? (
            <>
              {/* ATS Score Card */}
              <GlassCard glow="cyan" className="p-6 text-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#94A3B8]">
                  ATS Compatibility Index
                </span>
                <div className="text-5xl font-extrabold text-white my-2">
                  {analysis.ats_score}
                  <span className="text-xl font-normal text-[#94A3B8]">/100</span>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    analysis.ats_score >= 80
                      ? "bg-emerald-500/15 text-[#34D399]"
                      : analysis.ats_score >= 60
                      ? "bg-amber-500/15 text-[#FBBF24]"
                      : "bg-red-500/15 text-[#FB7185]"
                  }`}
                >
                  {analysis.ats_score >= 80 ? "Tier-1 Ready" : "Optimization Recommended"}
                </span>
              </GlassCard>

              {/* Detected Skills */}
              <GlassCard className="p-6">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  Extracted Keywords ({analysis.parsed_skills.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.parsed_skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#7565F6]/15 border border-[#7565F6]/30 text-xs text-[#A5B4FC] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassCard>

              {/* Suggestions */}
              <GlassCard className="p-6">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#FBBF24]" />
                  <span>Actionable Improvements</span>
                </h4>
                <ul className="space-y-2">
                  {analysis.suggestions.map((sug: string, idx: number) => (
                    <li key={idx} className="text-xs text-[#94A3B8] flex items-start gap-2">
                      <span className="text-[#22D3EE] font-bold">•</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </>
          ) : (
            <GlassCard className="p-8 text-center text-xs text-[#94A3B8]">
              <Sparkles className="w-8 h-8 text-[#7565F6] mx-auto mb-3 opacity-60" />
              <span>Click &quot;Scan & Analyze Resume&quot; to parse ATS sections, keywords, and improvement opportunities.</span>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
