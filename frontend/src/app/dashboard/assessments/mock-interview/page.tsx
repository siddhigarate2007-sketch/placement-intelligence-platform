"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  MessageSquare,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  HelpCircle
} from "lucide-react";

export default function MockInterviewPage() {
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [interviewType, setInterviewType] = useState<"HR" | "TECHNICAL">("HR");

  const hrQuestions = [
    {
      q: "Tell me about a challenging situation you handled during a collaborative engineering project.",
      placeholder: "Describe using the STAR format: What was the Situation, your Task, the Action you took, and the quantifiable Result?",
    },
    {
      q: "Why do you want to join our organization and what makes you stand out from other candidates?",
      placeholder: "Explain your alignment with company tech stack, engineering culture, and your unique problem-solving strengths...",
    },
  ];

  const technicalQuestions = [
    {
      q: "Explain how you would design a scalable URL shortener service (like bit.ly) handling 10,000 requests per second.",
      placeholder: "Discuss database design, hashing/Base62 algorithm, caching layers (Redis), and load balancing...",
    },
    {
      q: "Compare relational databases (PostgreSQL) versus NoSQL (MongoDB) for high-write e-commerce telemetry.",
      placeholder: "Explain ACID properties, indexing tradeoffs, replication, and data model flexibility...",
    },
  ];

  const activeQuestions = interviewType === "HR" ? hrQuestions : technicalQuestions;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        target_role: targetRole,
        interview_type: interviewType,
        answers: activeQuestions.map((item, idx) => ({
          question: item.q,
          answer: answers[idx] || "I handled this through structured problem analysis and teamwork.",
        })),
      };

      const res = await apiRequest("/assessments/mock-interview", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setEvaluation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>Semantic AI Evaluation • STAR Scoring Rubric</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Mock Interview Simulator</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Practice answering behavioral and technical questions. Receive instant scoring on fluency, confidence, and technical depth.
        </p>
      </div>

      {/* Role and Round Configuration */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Target Engineering Role</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2.5 glass-input text-xs bg-[#0C1424]"
            >
              <option value="Full Stack Engineer">Full Stack Engineer</option>
              <option value="Cloud Solutions Architect">Cloud Solutions Architect (AWS)</option>
              <option value="Backend Software Engineer">Backend Software Engineer (FastAPI/Go)</option>
              <option value="Machine Learning Engineer">Machine Learning Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Interview Round Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setInterviewType("HR");
                  setEvaluation(null);
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  interviewType === "HR"
                    ? "bg-[#7565F6] text-white border-[#7565F6]"
                    : "bg-white/5 text-[#94A3B8] border-white/10 hover:text-white"
                }`}
              >
                HR Behavioral (STAR)
              </button>
              <button
                type="button"
                onClick={() => {
                  setInterviewType("TECHNICAL");
                  setEvaluation(null);
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  interviewType === "TECHNICAL"
                    ? "bg-[#7565F6] text-white border-[#7565F6]"
                    : "bg-white/5 text-[#94A3B8] border-white/10 hover:text-white"
                }`}
              >
                Technical & System Design
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Evaluation Results if evaluated */}
      {evaluation && (
        <GlassCard glow="cyan" className="p-8">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#22D3EE] font-semibold">
                Evaluation Report
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Interview Performance: {evaluation.overall_score}/100
              </h2>
            </div>
            <GlassButton
              size="sm"
              variant="outline"
              onClick={() => {
                setEvaluation(null);
                setAnswers({});
              }}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Session</span>
            </GlassButton>
          </div>

          {/* Metric Triplet */}
          <div className="grid grid-cols-3 gap-4 my-6 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider block">Verbal Fluency</span>
              <span className="text-xl font-bold text-white">{evaluation.fluency_score}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider block">Technical Accuracy</span>
              <span className="text-xl font-bold text-[#22D3EE]">{evaluation.technical_accuracy_score}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider block">Confidence Rating</span>
              <span className="text-xl font-bold text-[#34D399]">{evaluation.confidence_score}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="text-xs font-bold text-[#34D399] flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-[#F8FAFC]">
                {evaluation.strengths.map((str: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#34D399]">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <h4 className="text-xs font-bold text-[#FBBF24] flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" /> Targeted Recommendations
              </h4>
              <ul className="space-y-1.5 text-xs text-[#F8FAFC]">
                {evaluation.improvement_areas.map((imp: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#FBBF24]">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Interactive Question Prompts */}
      <div className="space-y-6">
        {activeQuestions.map((item, idx) => (
          <GlassCard key={idx} className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#7565F6]/20 border border-[#7565F6]/30 flex items-center justify-center font-bold text-xs text-[#A5B4FC] shrink-0">
                Q{idx + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white leading-relaxed">
                  {item.q}
                </h3>
                <textarea
                  rows={4}
                  value={answers[idx] || ""}
                  onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                  placeholder={item.placeholder}
                  className="w-full mt-3 p-3 glass-input text-xs leading-relaxed"
                />
              </div>
            </div>
          </GlassCard>
        ))}

        <div className="flex justify-end">
          <GlassButton
            onClick={handleSubmit}
            disabled={loading}
            className="gap-2 shadow-glow-violet"
          >
            <span>{loading ? "Analyzing Responses with AI..." : "Submit Answers for Evaluation"}</span>
            <Send className="w-4 h-4" />
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
