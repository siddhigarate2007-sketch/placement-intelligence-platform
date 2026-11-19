"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { Bell, LogOut, Shield, User, GraduationCap, ChevronRight } from "lucide-react";
import { GlassButton } from "./GlassButton";

export function Navbar({ title = "Dashboard" }: { title?: string }) {
  const { user, logout, switchDemoRole } = useAuth();

  return (
    <header className="h-16 border-b border-white/10 bg-[#0C1424]/60 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-white/30" />
        <span className="text-[#F8FAFC] font-medium">{title}</span>
      </div>

      {/* Role Switcher & User Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher for seamless demo showcase */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-[#111C32] border border-white/10 text-xs">
          <span className="text-[11px] text-[#64748B] px-2 font-medium">Demo Persona:</span>
          <button
            onClick={() => switchDemoRole("STUDENT")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              user?.role === "STUDENT"
                ? "bg-[#7565F6] text-white font-medium"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => switchDemoRole("OFFICER")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              user?.role === "OFFICER"
                ? "bg-[#7565F6] text-white font-medium"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            Officer
          </button>
          <button
            onClick={() => switchDemoRole("FACULTY")}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              user?.role === "FACULTY"
                ? "bg-[#7565F6] text-white font-medium"
                : "text-[#94A3B8] hover:text-white"
            }`}
          >
            Faculty
          </button>
        </div>

        {/* Notifications Icon */}
        <Link
          href="/notifications"
          className="relative p-2 rounded-xl bg-[#111C32] border border-white/10 hover:border-white/20 text-[#94A3B8] hover:text-white transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
        </Link>

        {/* Logout */}
        {user ? (
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-xs text-[#94A3B8] hover:text-red-300 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        ) : (
          <Link href="/login">
            <GlassButton size="sm">Sign In</GlassButton>
          </Link>
        )}
      </div>
    </header>
  );
}
