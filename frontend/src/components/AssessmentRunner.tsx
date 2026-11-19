"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Sparkles
} from "lucide-react";

interface AssessmentRunnerProps {
  category: "APTITUDE" | "TECHNICAL" | "CODING" | "COMMUNICATION";
  title: string;
}

export function AssessmentRunner({ category, title }: AssessmentRunnerProps) {
  const [assessment, setAssessment] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(1500); // 25 min default
  const [result, setResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAssessment() {
      try {
        const list = await apiRequest("/assessments/");
        const target = list.find((a: any) => a.category === category) || list[0];
        setAssessment(target);
        if (target) {
          setTimeLeft(target.duration_minutes * 60);
        }
      } catch (err) {
        console.error("Failed to fetch assessment:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAssessment();
  }, [category]);

  // Timer countdown
  useEffect(() => {
    if (result || !assessment) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [result, assessment]);

  const selectAnswer = (questionId: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [String(questionId)]: option,
    }));
  };

  const handleSubmit = async () => {
    if (!assessment) return;
    setIsSubmitting(true);
    try {
      const res = await apiRequest(`/assessments/${assessment.id}/submit`, {
        method: "POST",
        body: JSON.stringify({ responses: answers }),
      });
      setResult(res);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <GlassCard className="p-8 text-center text-xs text-[#94A3B8]">
        Loading assessment questions...
      </GlassCard>
    );
  }

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return (
      <GlassCard className="p-8 text-center text-xs text-[#94A3B8]">
        No active questions found for this assessment benchmark.
      </GlassCard>
    );
  }

  // Finished state: detailed results
  if (result) {
    return (
      <div className="space-y-6">
        <GlassCard glow={result.passed ? "cyan" : "violet"} className="p-8 text-center">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#7565F6] to-[#22D3EE] items-center justify-center mb-4 shadow-lg shadow-[#7565F6]/30">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Assessment Completed!</h2>
          <p className="text-xs text-[#94A3B8] mt-1">{result.feedback}</p>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto my-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">Score</span>
              <span className="text-xl font-bold text-white">{result.score} / {result.total_marks}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">Percentage</span>
              <span className="text-xl font-bold text-[#22D3EE]">{result.percentage}%</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">Result</span>
              <span className={`text-xl font-bold ${result.passed ? "text-[#34D399]" : "text-[#FB7185]"}`}>
                {result.passed ? "PASSED" : "NEEDS PRACTICE"}
              </span>
            </div>
          </div>

          <GlassButton
            onClick={() => {
              setResult(null);
              setAnswers({});
              setCurrentIdx(0);
              setTimeLeft(assessment.duration_minutes * 60);
            }}
            variant="outline"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </GlassButton>
        </GlassCard>

        {/* Detailed Solutions */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white">Detailed Solutions & Explanations</h3>
          {result.detailed_results.map((res: any, idx: number) => (
            <GlassCard key={idx} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs font-semibold text-[#94A3B8]">Question {idx + 1}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  res.is_correct ? "bg-emerald-500/15 text-[#34D399]" : "bg-red-500/15 text-[#FB7185]"
                }`}>
                  {res.is_correct ? "Correct (+5 marks)" : "Incorrect (0 marks)"}
                </span>
              </div>
              <p className="text-sm text-white font-medium mt-2">{res.question_text}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-[#64748B] block">Your Answer:</span>
                  <span className={`font-semibold ${res.is_correct ? "text-[#34D399]" : "text-[#FB7185]"}`}>
                    {res.student_answer || "Unanswered"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-[#64748B] block">Correct Answer:</span>
                  <span className="font-semibold text-[#34D399]">{res.correct_answer}</span>
                </div>
              </div>

              {res.explanation && (
                <div className="mt-3 p-3 rounded-xl bg-[#7565F6]/10 border border-[#7565F6]/20 text-xs text-[#A5B4FC]">
                  <span className="font-bold block mb-1">Explanation:</span>
                  {res.explanation}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentIdx];
  const qIdStr = String(currentQ.id);

  return (
    <div className="space-y-6">
      {/* Test Controls Bar */}
      <div className="flex items-center justify-between p-4 glass-panel">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#22D3EE] font-semibold">
            {assessment.category} BENCHMARK
          </span>
          <h2 className="text-lg font-bold text-white mt-0.5">{title}</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-[#FBBF24]">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question Card */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <span className="text-xs font-semibold text-[#94A3B8]">
            Question {currentIdx + 1} of {assessment.questions.length}
          </span>
          <span className="text-xs text-[#64748B]">Marks: {currentQ.marks}</span>
        </div>

        <h3 className="text-base font-semibold text-white leading-relaxed mb-6">
          {currentQ.question_text}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {(currentQ.options || []).map((opt: string, idx: number) => {
            const isSelected = answers[qIdStr] === opt;
            return (
              <button
                key={idx}
                onClick={() => selectAnswer(currentQ.id, opt)}
                className={`w-full p-4 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between border ${
                  isSelected
                    ? "bg-[#7565F6]/20 border-[#7565F6] text-white shadow-sm"
                    : "bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{opt}</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? "border-[#7565F6] bg-[#7565F6]" : "border-white/20"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
          <GlassButton
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </GlassButton>

          {currentIdx === assessment.questions.length - 1 ? (
            <GlassButton
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="sm"
              className="gap-2 bg-gradient-to-r from-[#34D399] to-[#059669]"
            >
              <span>{isSubmitting ? "Grading..." : "Submit Assessment"}</span>
              <CheckCircle2 className="w-4 h-4" />
            </GlassButton>
          ) : (
            <GlassButton
              onClick={() => setCurrentIdx((prev) => Math.min(assessment.questions.length - 1, prev + 1))}
              size="sm"
              className="gap-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </GlassButton>
          )}
        </div>
      </GlassCard>

      {/* Question Quick Palette */}
      <GlassCard className="p-4">
        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-2">
          Question Navigator
        </span>
        <div className="flex flex-wrap gap-2">
          {assessment.questions.map((q: any, idx: number) => {
            const isAnswered = !!answers[String(q.id)];
            const isCurrent = idx === currentIdx;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                  isCurrent
                    ? "border-[#22D3EE] bg-[#22D3EE]/20 text-[#22D3EE]"
                    : isAnswered
                    ? "border-[#7565F6] bg-[#7565F6]/20 text-white"
                    : "border-white/10 bg-white/5 text-[#64748B] hover:text-white"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
