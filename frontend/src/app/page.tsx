"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import {
  Sparkles,
  Cpu,
  TrendingUp,
  FileCheck,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Compass,
  FileSpreadsheet
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080D19] relative overflow-hidden flex flex-col justify-between">
      {/* Navigation Header */}
      <nav className="h-20 border-b border-white/10 bg-[#0C1424]/40 backdrop-blur-xl px-8 md:px-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7565F6] to-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#7565F6]/40">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block">
              PlacementIntel
            </span>
            <span className="text-[10px] text-[#22D3EE] font-mono tracking-widest block uppercase">
              Career Readiness Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register">
            <GlassButton size="sm">Get Started</GlassButton>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 md:px-16 max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-6">
          <BrainCircuit className="w-4 h-4 text-[#22D3EE]" />
          <span>Production AI Platform • 6 Machine Learning Architectures Benchmarked</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-[#F8FAFC] tracking-tight leading-[1.15]">
          Predict Campus Placement. <br />
          <span className="bg-gradient-to-r from-[#7565F6] via-[#22D3EE] to-[#A5B4FC] bg-clip-text text-transparent">
            Identify Skill Gaps. Guarantee Career Readiness.
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-[#94A3B8] max-w-3xl mx-auto leading-relaxed">
          The next-generation intelligence system that empowers engineering students to master technical assessments,
          simulate behavioral interviews, optimize resumes for ATS, and provides educational institutions with
          a complete 7-stage recruitment funnel.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/dashboard">
            <GlassButton size="lg" className="gap-3 shadow-glow-violet">
              <span>Launch Student Portal</span>
              <ArrowRight className="w-5 h-5" />
            </GlassButton>
          </Link>
          <Link href="/officer">
            <GlassButton size="lg" variant="secondary" className="gap-2">
              <BarChart3 className="w-5 h-5 text-[#22D3EE]" />
              <span>Placement Officer Portal</span>
            </GlassButton>
          </Link>
        </div>

        {/* High Level Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 text-left">
          <GlassCard className="p-5">
            <span className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">ML Test Accuracy</span>
            <h4 className="text-2xl font-black text-[#22D3EE] mt-1">93.8%</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">Stratified 5-Fold Cross-Val</p>
          </GlassCard>
          <GlassCard className="p-5">
            <span className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Evaluated Models</span>
            <h4 className="text-2xl font-black text-[#7565F6] mt-1">6 Algorithms</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">XGBoost, RF, SVM, GB, DT, LR</p>
          </GlassCard>
          <GlassCard className="p-5">
            <span className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Recruitment Funnel</span>
            <h4 className="text-2xl font-black text-[#34D399] mt-1">7 Stages</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">Eligibility to Offer Tracking</p>
          </GlassCard>
          <GlassCard className="p-5">
            <span className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold">Highest Package</span>
            <h4 className="text-2xl font-black text-[#FBBF24] mt-1">₹42.0 LPA</h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">Tier-1 Cloud SDE Roles</p>
          </GlassCard>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto relative z-10 w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#22D3EE]">Engineered For Excellence</span>
          <h2 className="text-3xl font-bold text-white mt-2">Comprehensive Career Intelligence Suite</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard hoverEffect glow="violet" className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#7565F6]/20 border border-[#7565F6]/30 flex items-center justify-center text-[#A5B4FC] mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Explainable AI Predictions</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Real machine learning inference utilizing SHAP (SHapley Additive exPlanations) to uncover exact positive and negative factors driving placement probability.
              </p>
            </div>
            <Link href="/dashboard/prediction" className="mt-6 inline-flex items-center text-xs font-semibold text-[#A5B4FC] hover:text-white gap-1">
              Explore Prediction Model <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </GlassCard>

          <GlassCard hoverEffect glow="cyan" className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#22D3EE]/20 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Skill-Gap & Action Roadmap</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Automated detection of weaknesses across coding, aptitude, communication, and project depth, followed by an actionable 6-week milestones blueprint.
              </p>
            </div>
            <Link href="/dashboard/roadmap" className="mt-6 inline-flex items-center text-xs font-semibold text-[#22D3EE] hover:text-white gap-1">
              View Personalized Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </GlassCard>

          <GlassCard hoverEffect className="flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#34D399]/20 border border-[#34D399]/30 flex items-center justify-center text-[#34D399] mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Company Eligibility Engine</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Deterministic criteria matching against live company cutoff criteria: CGPA, 10th/12th cutoffs, backlogs, branch restrictions, and coding benchmarks.
              </p>
            </div>
            <Link href="/dashboard/eligibility" className="mt-6 inline-flex items-center text-xs font-semibold text-[#34D399] hover:text-white gap-1">
              Test Company Eligibility <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-8 text-center text-xs text-[#64748B] bg-[#0C1424]/60">
        <p>© 2026 Student Placement Intelligence & Career Readiness Platform. Midnight Glass Design System.</p>
        <p className="mt-1">FastAPI • Scikit-learn • XGBoost • SHAP • Next.js • Tailwind CSS • PostgreSQL</p>
      </footer>
    </div>
  );
}
