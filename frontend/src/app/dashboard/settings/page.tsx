"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { useAuth } from "@/lib/authContext";
import {
  Settings,
  Shield,
  Bell,
  Eye,
  Lock,
  User,
  CheckCircle2,
  Save
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    driveAlerts: true,
    assessmentReminders: true,
    interviewSchedule: true,
    mentorMessages: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>System & Account Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Account & Security Settings</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Manage privacy policies, notification frequencies, and institutional data access boundaries.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account Details */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
            <User className="w-4 h-4 text-[#22D3EE]" />
            <span>Profile Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#94A3B8] block mb-1">Full Name</label>
              <input
                type="text"
                defaultValue={user?.full_name || "Priya Patel"}
                className="w-full px-3 py-2.5 glass-input text-xs"
              />
            </div>
            <div>
              <label className="text-xs text-[#94A3B8] block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                defaultValue={user?.email || "priya@student.edu"}
                className="w-full px-3 py-2.5 glass-input text-xs opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
            <Bell className="w-4 h-4 text-[#FBBF24]" />
            <span>Recruitment Alerts & Notifications</span>
          </h3>

          <div className="space-y-3">
            {Object.entries({
              driveAlerts: "Campus Recruitment Drive Announcements",
              assessmentReminders: "Weekly Aptitude & Coding Remediation Reminders",
              interviewSchedule: "Live Interview Round Schedules & Rescheduling Notices",
              mentorMessages: "Faculty Mentor Feedback Broadcasts",
            }).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
              >
                <span className="text-xs text-white">{label}</span>
                <input
                  type="checkbox"
                  checked={(notifications as any)[key]}
                  onChange={(e) =>
                    setNotifications({ ...notifications, [key]: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#7565F6] rounded"
                />
              </label>
            ))}
          </div>
        </GlassCard>

        {/* Privacy & Security Access Control */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#34D399]" />
            <span>Access Control & Compliance Policy</span>
          </h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            In compliance with campus academic data privacy guidelines, predictive machine learning models are designed strictly to support human placement preparation and do not automatically reject candidates. Students retain sole access to their confidential personal test transcripts.
          </p>
        </GlassCard>

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs text-[#34D399] flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved successfully
            </span>
          )}
          <GlassButton type="submit" size="md" className="gap-2 ml-auto">
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </GlassButton>
        </div>
      </form>
    </div>
  );
}
