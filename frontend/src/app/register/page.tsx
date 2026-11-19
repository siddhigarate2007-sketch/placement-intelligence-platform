"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { Sparkles, Lock, Mail, User, BookOpen, GraduationCap, ShieldAlert } from "lucide-react";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    department_code: "CSE",
    roll_number: "",
    batch_year: 2026,
    role: "STUDENT",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(formData);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check your details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080D19] flex items-center justify-center p-6 relative">
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7565F6] to-[#22D3EE] items-center justify-center shadow-lg shadow-[#7565F6]/40 mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h2>
          <p className="text-xs text-[#94A3B8] mt-1">Join the campus placement intelligence portal</p>
        </div>

        <GlassCard className="p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Aditi Deshmukh"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="aditi@student.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Department</label>
                <select
                  value={formData.department_code}
                  onChange={(e) => setFormData({ ...formData, department_code: e.target.value })}
                  className="w-full px-3 py-2.5 glass-input text-xs bg-[#0C1424]"
                >
                  <option value="CSE">Computer Science & Engg</option>
                  <option value="IT">Information Technology</option>
                  <option value="ECE">Electronics & Communication</option>
                  <option value="AIDS">AI & Data Science</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Roll Number</label>
                <input
                  type="text"
                  placeholder="22CSE150"
                  value={formData.roll_number}
                  onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                  className="w-full px-3 py-2.5 glass-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
                />
              </div>
            </div>

            <GlassButton type="submit" disabled={isLoading} className="w-full mt-4" size="md">
              {isLoading ? "Creating Account..." : "Register & Start Preparation"}
            </GlassButton>
          </form>

          <div className="mt-6 text-center text-xs text-[#94A3B8]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#22D3EE] hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
