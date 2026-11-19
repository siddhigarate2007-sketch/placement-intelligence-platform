"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  FileCheck2,
  Code2,
  Cpu,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  Layers
} from "lucide-react";

export default function AssessmentsCenterPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const [aRes, pRes] = await Promise.allSettled([
          apiRequest("/assessments/"),
          apiRequest("/students/me"),
        ]);
        if (aRes.status === "fulfilled") setAssessments(aRes.value);
        if (pRes.status === "fulfilled") setProfile(pRes.value);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const cards = [
    {
      title: "Quantitative & Logical Aptitude",
      category: "APTITUDE",
      score: profile?.aptitude_score || 68,
      duration: "25 Mins",
      questions: 5,
      href: "/dashboard/assessments/aptitude",
      icon: FileCheck2,
      accent: "cyan",
      desc: "Speed, work & time, sequence series, logic puzzles for Round 1 screening.",
    },
    {
      title: "Data Structures & Algorithmic Problem Solving",
      category: "CODING",
      score: profile?.coding_score || 58,
      duration: "45 Mins",
      questions: 2,
      href: "/dashboard/assessments/coding",
      icon: Code2,
      accent: "violet",
      desc: "HashMaps, binary trees, dynamic programming, and complexity constraints.",
    },
    {
      title: "Core CS Engineering Benchmark",
      category: "TECHNICAL",
      score: profile?.technical_score || 65,
      duration: "30 Mins",
      questions: 5,
      href: "/dashboard/assessments/technical",
      icon: Cpu,
      accent: "emerald",
      desc: "DBMS Normalization, OS Deadlocks, TCP/IP networking, and OOP principles.",
    },
    {
      title: "Verbal & Professional Communication",
      category: "COMMUNICATION",
      score: profile?.communication_score || 74,
      duration: "20 Mins",
      questions: 5,
      href: "/dashboard/assessments/communication",
      icon: MessageSquare,
      accent: "amber",
      desc: "Vocabulary, candor, reading comprehension, and business etiquette.",
    },
    {
      title: "AI Interactive Mock Interview",
      category: "MOCK_INTERVIEW",
      score: profile?.communication_score || 75,
      duration: "15 Mins",
      questions: "Interactive",
      href: "/dashboard/assessments/mock-interview",
      icon: Layers,
      accent: "indigo",
      desc: "Simulate technical and HR behavioral panel questions with STAR rubric scoring.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
          <FileCheck2 className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>Automated Assessment Engine • Benchmark Diagnostics</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Assessments & Interview Center</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Take timed diagnostic evaluations. Completed scores automatically update your placement readiness index.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <GlassCard key={idx} hoverEffect className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <Icon className="w-5 h-5 text-[#22D3EE]" />
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#7565F6]/15 text-[#A5B4FC] border border-[#7565F6]/30">
                    {card.score}/100 Score
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{card.title}</h3>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{card.desc}</p>

                <div className="flex items-center gap-4 mt-4 text-[11px] text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {card.duration}
                  </span>
                  <span>•</span>
                  <span>{card.questions} Questions</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Link href={card.href}>
                  <GlassButton size="sm" className="w-full gap-2">
                    <span>Start Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
