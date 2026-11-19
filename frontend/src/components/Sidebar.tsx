"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  FileCheck2,
  FileText,
  MapPin,
  Briefcase,
  CheckCircle2,
  Send,
  User,
  Settings,
  ShieldCheck,
  GraduationCap,
  BarChart3,
  Cpu,
  Bell,
  Layers,
  FileSpreadsheet
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const role = user?.role || "STUDENT";

  const studentLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Placement Prediction", href: "/dashboard/prediction", icon: Sparkles, badge: "ML" },
    { label: "Skill Gap Analysis", href: "/dashboard/skill-gap", icon: TrendingUp },
    { label: "Assessments Center", href: "/dashboard/assessments", icon: FileCheck2 },
    { label: "AI Mock Interview", href: "/dashboard/assessments/mock-interview", icon: Layers },
    { label: "Resume ATS Analyzer", href: "/dashboard/resume", icon: FileText },
    { label: "Personalized Roadmap", href: "/dashboard/roadmap", icon: MapPin },
    { label: "Opportunities", href: "/dashboard/opportunities", icon: Briefcase },
    { label: "Eligibility Checker", href: "/dashboard/eligibility", icon: CheckCircle2 },
    { label: "Application Tracker", href: "/dashboard/applications", icon: Send },
    { label: "Profile & Academics", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const officerLinks = [
    { label: "Recruitment Funnel", href: "/officer", icon: LayoutDashboard },
    { label: "Student Directory", href: "/officer/students", icon: GraduationCap },
    { label: "Company Drives", href: "/officer/companies", icon: Briefcase },
    { label: "Institute Analytics", href: "/officer/analytics", icon: BarChart3 },
    { label: "ML Model Management", href: "/officer/ml-models", icon: Cpu, badge: "6 Models" },
  ];

  const facultyLinks = [
    { label: "Department Dashboard", href: "/faculty", icon: LayoutDashboard },
    { label: "At-Risk Mentoring", href: "/faculty#at-risk", icon: TrendingUp },
    { label: "Branch Analytics", href: "/officer/analytics", icon: BarChart3 },
  ];

  const activeLinks = role === "OFFICER" ? officerLinks : role === "FACULTY" ? facultyLinks : studentLinks;

  return (
    <aside className="w-64 min-h-screen bg-[#0C1424]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col fixed left-0 top-0 bottom-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7565F6] to-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#7565F6]/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-semibold text-sm tracking-tight text-white leading-tight">
            PlacementIntel
          </h1>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#22D3EE]">
            Career AI 2.0
          </span>
        </div>
      </div>

      {/* Role Pill */}
      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <span className="text-[11px] text-[#94A3B8] font-medium">Active Workspace</span>
        <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-[#7565F6]/15 text-[#A5B4FC] border border-[#7565F6]/30">
          {role}
        </span>
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-[#64748B] px-3 mb-2">
          {role === "OFFICER" ? "Placement Cell" : role === "FACULTY" ? "Faculty Mentor" : "Student Preparation"}
        </div>
        {activeLinks.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group",
                isActive
                  ? "bg-[#7565F6]/15 text-white border border-[#7565F6]/35 shadow-sm"
                  : "text-[#94A3B8] hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-[#22D3EE]" : "text-[#64748B] group-hover:text-white"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#22D3EE]/15 text-[#22D3EE] font-semibold border border-[#22D3EE]/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 text-[10px] uppercase tracking-wider font-semibold text-[#64748B] px-3 mb-2">
          Institutional Tools
        </div>
        <Link
          href="/notifications"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all",
            pathname === "/notifications" && "bg-[#7565F6]/15 text-white border border-[#7565F6]/35"
          )}
        >
          <Bell className="w-4 h-4 text-[#64748B]" />
          <span>Notifications</span>
        </Link>
        <Link
          href="/reports"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all",
            pathname === "/reports" && "bg-[#7565F6]/15 text-white border border-[#7565F6]/35"
          )}
        >
          <FileSpreadsheet className="w-4 h-4 text-[#64748B]" />
          <span>Reports & Analytics</span>
        </Link>
      </div>

      {/* User Badge */}
      <div className="p-4 border-t border-white/10 bg-[#080D19]/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7565F6] to-[#A5B4FC] flex items-center justify-center font-bold text-xs text-white">
            {user?.full_name ? user.full_name[0] : "P"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {user?.full_name || "Priya Patel"}
            </p>
            <p className="text-[11px] text-[#94A3B8] truncate">
              {user?.email || "priya@student.edu"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
