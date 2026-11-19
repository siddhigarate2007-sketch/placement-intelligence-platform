"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  Cpu,
  Sparkles,
  Award,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Layers,
  Upload,
  FileSpreadsheet
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function MLModelManagementPage() {
  const [comparison, setComparison] = useState<any>(null);
  const [retraining, setRetraining] = useState<boolean>(false);
  const [retrainMsg, setRetrainMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchComparison = async () => {
    try {
      const data = await apiRequest("/ml/comparison");
      setComparison(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

  const triggerRetrain = async () => {
    setRetraining(true);
    setRetrainMsg(null);
    try {
      const res = await apiRequest("/ml/retrain", { method: "POST" });
      setRetrainMsg(res.message);
      setTimeout(fetchComparison, 4000);
    } catch (err: any) {
      setRetrainMsg(err.message || "Failed to trigger retraining");
    } finally {
      setRetraining(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://127.0.0.1:8000/api/v1/ml/upload-dataset", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Upload failed");
      }

      const data = await res.json();
      setUploadMsg(data.message);
      fetchComparison();
    } catch (err: any) {
      setUploadMsg(`Error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const chartData = (comparison?.models || []).map((m: any) => ({
    name: m.algorithm,
    Accuracy: Math.round(m.test_accuracy * 100),
    F1: Math.round(m.test_f1 * 100),
    "ROC-AUC": Math.round(m.test_roc_auc * 100),
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Machine Learning Pipeline Registry • 6 Algorithms Benchmarked</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">ML Model Comparison & Dataset Management</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Upload custom student datasets or retrain 6 candidate architectures with 5-Fold Stratified Cross-Validation.
          </p>
        </div>

        <GlassButton
          onClick={triggerRetrain}
          disabled={retraining}
          className="gap-2 shrink-0 shadow-glow-violet"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 ${retraining ? "animate-spin" : ""}`} />
          <span>{retraining ? "Training Pipeline..." : "Trigger Full Retrain"}</span>
        </GlassButton>
      </div>

      {/* Upload Custom Dataset Card */}
      <GlassCard glow="cyan" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#22D3EE]" />
              <span>Import Your Custom Placement Dataset (.CSV)</span>
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Select your own college or Kaggle placement CSV. The system automatically standardizes column headers and retrains all 6 models.
            </p>
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7565F6] to-[#22D3EE] text-white text-xs font-semibold shadow-lg shadow-[#7565F6]/25 hover:opacity-95 transition-all gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              <span>{uploading ? "Ingesting & Training..." : "Upload CSV Dataset"}</span>
            </span>
          </label>
        </div>

        {uploadMsg && (
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#A5B4FC]">
            {uploadMsg}
          </div>
        )}
      </GlassCard>

      {retrainMsg && (
        <div className="p-3.5 rounded-xl bg-[#7565F6]/15 border border-[#7565F6]/30 text-xs text-[#A5B4FC] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#22D3EE]" />
          <span>{retrainMsg}</span>
        </div>
      )}

      {/* Cross-Architecture Comparison Chart */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Benchmarked Evaluation Metrics (% Scale)
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Comparison of Accuracy, F1-Score, and ROC-AUC on held-out test split (N={comparison?.test_samples || 500})
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-3 py-1 rounded-full border border-[#22D3EE]/25">
            Champion: {comparison?.champion_model || "LogisticRegression"}
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
              <YAxis domain={[80, 100]} stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111C32", borderColor: "rgba(255,255,255,0.15)", borderRadius: "0.5rem" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Bar dataKey="Accuracy" fill="#7565F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="F1" fill="#22D3EE" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ROC-AUC" fill="#34D399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Models Table */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">Candidate Architecture Registry</h3>
          <span className="text-xs text-[#64748B] font-mono">Stratified 5-Fold K-Fold</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Algorithm</th>
                <th className="pb-3 font-semibold">CV Acc (Mean ± Std)</th>
                <th className="pb-3 font-semibold">Test Accuracy</th>
                <th className="pb-3 font-semibold">Precision</th>
                <th className="pb-3 font-semibold">Recall</th>
                <th className="pb-3 font-semibold">F1-Score</th>
                <th className="pb-3 font-semibold">ROC-AUC</th>
                <th className="pb-3 font-semibold text-right">Deployment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(comparison?.models || []).map((m: any) => (
                <tr key={m.key} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5">
                    <span className="font-bold text-white block">{m.algorithm}</span>
                    <span className="text-[10px] text-[#64748B] font-mono">{m.version}</span>
                  </td>
                  <td className="py-3 text-[#94A3B8] font-mono">
                    {(m.cv_accuracy_mean * 100).toFixed(1)}% ± {(m.cv_accuracy_std * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 text-white font-mono font-bold">
                    {(m.test_accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 text-[#A5B4FC] font-mono">
                    {(m.test_precision * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 text-[#A5B4FC] font-mono">
                    {(m.test_recall * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 text-[#22D3EE] font-mono font-bold">
                    {(m.test_f1 * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 text-[#34D399] font-mono font-bold">
                    {(m.test_roc_auc * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 text-right">
                    {m.is_champion ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#34D399] border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> ACTIVE CHAMPION
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#64748B] px-2 py-0.5 rounded bg-white/5">
                        Candidate
                      </span>
                    )}
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
