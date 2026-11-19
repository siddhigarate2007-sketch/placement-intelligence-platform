"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Sparkles, Lock, Mail, ArrowRight, UserCheck, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("priya@student.edu");
  const [password, setPassword] = useState("Student@123");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    }
  };

  const setDemoCredentials = (role: "student_priya" | "student_aarav" | "officer" | "faculty") => {
    setError(null);
    if (role === "student_priya") {
      setEmail("priya@student.edu");
      setPassword("Student@123");
    } else if (role === "student_aarav") {
      setEmail("aarav@student.edu");
      setPassword("Student@123");
    } else if (role === "officer") {
      setEmail("officer@placement.edu");
      setPassword("Admin@123");
    } else if (role === "faculty") {
      setEmail("faculty@placement.edu");
      setPassword("Admin@123");
    }
  };

  return (
    <div className="min-h-screen bg-[#080D19] flex items-center justify-center p-6 relative">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7565F6] to-[#22D3EE] items-center justify-center shadow-lg shadow-[#7565F6]/40 mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-[#94A3B8] mt-1">Sign in to Student Placement Intelligence</p>
        </div>

        <GlassCard className="p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@placement.edu"
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
                />
              </div>
            </div>

            <GlassButton type="submit" disabled={isLoading} className="w-full mt-2" size="md">
              {isLoading ? "Authenticating..." : "Sign In to Platform"}
            </GlassButton>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="block text-[11px] uppercase tracking-wider text-[#64748B] font-semibold text-center mb-3">
              One-Click Demo Personas
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setDemoCredentials("student_priya")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
              >
                <span className="font-semibold text-white block">Priya Patel</span>
                <span className="text-[10px] text-[#A5B4FC]">Preparing Student</span>
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("student_aarav")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
              >
                <span className="font-semibold text-white block">Aarav Sharma</span>
                <span className="text-[10px] text-[#34D399]">Placed SDE-1</span>
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("officer")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
              >
                <span className="font-semibold text-white block">Placement Officer</span>
                <span className="text-[10px] text-[#22D3EE]">Full Admin / Funnel</span>
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("faculty")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
              >
                <span className="font-semibold text-white block">Faculty Mentor</span>
                <span className="text-[10px] text-[#FBBF24]">Department Analytics</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#94A3B8]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#22D3EE] hover:underline font-medium">
              Create an account
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
