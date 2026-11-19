"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { ReadinessGauge } from "@/components/ReadinessGauge";
import { apiRequest } from "@/lib/api";
import {
  Sparkles,
  Sliders,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  Zap,
  Layers,
  ArrowRight
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from "recharts";

export default function PlacementPredictionPage() {
  const [formData, setFormData] = useState({
    cgpa: 7.8,
    tenth_percentage: 82.0,
    twelfth_percentage: 80.0,
    backlogs: 0,
    aptitude_score: 70.0,
    coding_score: 65.0,
    technical_score: 68.0,
    communication_score: 72.0,
    internships_count: 1,
    projects_count: 2,
    certifications_count: 1,
  });

  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runPrediction = async (data = formData) => {
    setLoading(true);
    try {
      const res = await apiRequest("/predictions/predict", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setPrediction(res);
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPrediction();
  }, []);

  const handleChange = (field: string, value: number) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
  };

  // Prepare SHAP chart data
  const shapChartData = (prediction?.contributions || []).slice(0, 8).map((c: any) => ({
    feature: c.label,
    impact: c.shap_value,
    direction: c.shap_value > 0 ? "Positive" : "Negative",
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Explainable AI Engine (SHAP) • Active Champion Model</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Placement Intelligence & Prediction</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Simulate feature scenarios and observe real-time placement probability alongside feature attribution.
          </p>
        </div>
        <GlassButton
          onClick={() => runPrediction()}
          disabled={loading}
          size="sm"
          className="gap-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Re-compute Inference</span>
        </GlassButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Controls */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-[#22D3EE]" />
              <span>Feature Input Simulation</span>
            </h3>

            <div className="space-y-4">
              {/* CGPA */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#94A3B8]">CGPA (Out of 10.0)</span>
                  <span className="font-bold text-white">{formData.cgpa}</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="10.0"
                  step="0.1"
                  value={formData.cgpa}
                  onChange={(e) => handleChange("cgpa", parseFloat(e.target.value))}
                  className="w-full accent-[#7565F6] cursor-pointer"
                />
              </div>

              {/* Coding Score */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#94A3B8]">Coding Assessment Benchmark</span>
                  <span className="font-bold text-[#22D3EE]">{formData.coding_score}/100</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={formData.coding_score}
                  onChange={(e) => handleChange("coding_score", parseFloat(e.target.value))}
                  className="w-full accent-[#22D3EE] cursor-pointer"
                />
              </div>

              {/* Aptitude Score */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#94A3B8]">Quantitative & Logical Aptitude</span>
                  <span className="font-bold text-[#A5B4FC]">{formData.aptitude_score}/100</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={formData.aptitude_score}
                  onChange={(e) => handleChange("aptitude_score", parseFloat(e.target.value))}
                  className="w-full accent-[#7565F6] cursor-pointer"
                />
              </div>

              {/* Technical Score */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#94A3B8]">Core CS & Technical Concepts</span>
                  <span className="font-bold text-[#34D399]">{formData.technical_score}/100</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={formData.technical_score}
                  onChange={(e) => handleChange("technical_score", parseFloat(e.target.value))}
                  className="w-full accent-[#34D399] cursor-pointer"
                />
              </div>

              {/* Communication Score */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#94A3B8]">Verbal & Behavioral Communication</span>
                  <span className="font-bold text-white">{formData.communication_score}/100</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="1"
                  value={formData.communication_score}
                  onChange={(e) => handleChange("communication_score", parseFloat(e.target.value))}
                  className="w-full accent-[#7565F6] cursor-pointer"
                />
              </div>

              {/* Discrete Attributes */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                <div>
                  <label className="text-[11px] text-[#94A3B8] block mb-1">Internships</label>
                  <select
                    value={formData.internships_count}
                    onChange={(e) => handleChange("internships_count", parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#0C1424] border border-white/10 text-xs text-white"
                  >
                    <option value={0}>0 Internships</option>
                    <option value={1}>1 Internship</option>
                    <option value={2}>2 Internships</option>
                    <option value={3}>3+ Internships</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[#94A3B8] block mb-1">Projects</label>
                  <select
                    value={formData.projects_count}
                    onChange={(e) => handleChange("projects_count", parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#0C1424] border border-white/10 text-xs text-white"
                  >
                    <option value={1}>1 Project</option>
                    <option value={2}>2 Projects</option>
                    <option value={3}>3 Projects</option>
                    <option value={4}>4+ Projects</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[#94A3B8] block mb-1">Backlogs</label>
                  <select
                    value={formData.backlogs}
                    onChange={(e) => handleChange("backlogs", parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#0C1424] border border-white/10 text-xs text-white"
                  >
                    <option value={0}>0 Backlogs</option>
                    <option value={1}>1 Backlog</option>
                    <option value={2}>2 Backlogs</option>
                    <option value={3}>3+ Backlogs</option>
                  </select>
                </div>
              </div>

              <GlassButton
                onClick={() => runPrediction()}
                className="w-full mt-4"
                size="md"
              >
                Apply Changes & Predict
              </GlassButton>
            </div>
          </GlassCard>
        </div>

        {/* Prediction Results & Explainability */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Prediction Score Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassCard
              glow={prediction?.predicted_status === "PLACED" ? "cyan" : "violet"}
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-[#94A3B8]">
                  Predicted Placement Outcome
                </span>
                <div className="flex items-center gap-3 mt-2">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    {prediction?.predicted_status === "PLACED" ? "PLACED" : "NEEDS REMEDIATION"}
                  </h2>
                </div>
                <p className="text-xs text-[#94A3B8] mt-2">
                  Estimated Probability:{" "}
                  <span className="text-white font-bold">{prediction?.probability_percentage}%</span>
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Model Confidence:</span>
                <span className="font-semibold text-[#34D399]">{prediction?.confidence}%</span>
              </div>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col items-center justify-center">
              <ReadinessGauge score={prediction?.readiness_score || 72} size={160} label="Holistic Placement Readiness" />
            </GlassCard>
          </div>

          {/* Explainable AI (SHAP Contributions) */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#22D3EE]" />
                  <span>Explainable AI — Feature Impact (SHAP Values)</span>
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Quantifiable marginal impact of student features toward or against placement
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={shapChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <XAxis type="number" stroke="#64748B" fontSize={11} />
                  <YAxis type="category" dataKey="feature" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#111C32", borderColor: "rgba(255,255,255,0.15)", borderRadius: "0.5rem" }}
                    formatter={(val: any) => [`Impact: ${val}`, "SHAP Value"]}
                  />
                  <ReferenceLine x={0} stroke="#94A3B8" />
                  <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                    {shapChartData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.impact > 0 ? "#34D399" : "#FB7185"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Strengths & Weaknesses Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-semibold text-[#34D399] flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-4 h-4" /> Top Strengths (Positive Drivers)
                </span>
                <ul className="space-y-1 text-xs text-[#F8FAFC]">
                  {(prediction?.top_strengths || []).map((s: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>{s.label}</span>
                      <span className="text-[#34D399] font-mono">+{s.shap_value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <span className="text-xs font-semibold text-[#FB7185] flex items-center gap-1.5 mb-2">
                  <TrendingDown className="w-4 h-4" /> Key Weaknesses (Negative Drivers)
                </span>
                <ul className="space-y-1 text-xs text-[#F8FAFC]">
                  {(prediction?.top_weaknesses || []).map((w: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>{w.label}</span>
                      <span className="text-[#FB7185] font-mono">{w.shap_value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* Actionable Weakness Guidance */}
          {(prediction?.weakness_triggers || []).length > 0 && (
            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-[#FBBF24]" />
                <span>Identified Skill Gaps & Automated Triggers</span>
              </h3>
              <div className="space-y-2">
                {prediction.weakness_triggers.map((t: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FBBF24]/20 text-[#FBBF24] font-semibold border border-[#FBBF24]/30 mt-0.5">
                      {t.area}
                    </span>
                    <span className="text-xs text-[#94A3B8]">{t.reason}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                <Link href="/dashboard/roadmap">
                  <GlassButton size="sm" className="gap-2">
                    <span>Activate Targeted 6-Week Remediation Roadmap</span>
                    <ArrowRight className="w-4 h-4" />
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
