"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { apiRequest } from "@/lib/api";
import {
  User,
  BookOpen,
  Code2,
  Briefcase,
  Award,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2
} from "lucide-react";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // New skill form modal state
  const [newSkill, setNewSkill] = useState({ skill_name: "", category: "PROGRAMMING", proficiency: "INTERMEDIATE" });
  const [newProject, setNewProject] = useState({ title: "", description: "", technologies: "", github_url: "" });

  const loadProfile = async () => {
    try {
      const res = await apiRequest("/students/me");
      setProfile(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.skill_name) return;
    try {
      await apiRequest("/students/me/skills", {
        method: "POST",
        body: JSON.stringify(newSkill),
      });
      setNewSkill({ skill_name: "", category: "PROGRAMMING", proficiency: "INTERMEDIATE" });
      loadProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (skillId: number) => {
    try {
      await apiRequest(`/students/me/skills/${skillId}`, { method: "DELETE" });
      loadProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    try {
      await apiRequest("/students/me/projects", {
        method: "POST",
        body: JSON.stringify(newProject),
      });
      setNewProject({ title: "", description: "", technologies: "", github_url: "" });
      loadProfile();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7565F6]/15 border border-[#7565F6]/30 text-[#A5B4FC] text-xs font-semibold mb-2">
          <User className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>Student Dossier • Academic & Technical Portfolio</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Student Profile & Academic Records</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Maintain verified academic metrics, technical skills, and demonstrable portfolio projects.
        </p>
      </div>

      {/* Academic Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">Cumulative CGPA</span>
          <h3 className="text-2xl font-bold text-white mt-1">{profile?.cgpa || 7.4} / 10</h3>
          <span className="text-[11px] text-[#34D399]">No active backlogs</span>
        </GlassCard>
        <GlassCard className="p-4">
          <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">10th Standard %</span>
          <h3 className="text-2xl font-bold text-white mt-1">{profile?.tenth_percentage || 81}%</h3>
          <span className="text-[11px] text-[#94A3B8]">Secondary Education</span>
        </GlassCard>
        <GlassCard className="p-4">
          <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">12th Standard %</span>
          <h3 className="text-2xl font-bold text-white mt-1">{profile?.twelfth_percentage || 78}%</h3>
          <span className="text-[11px] text-[#94A3B8]">Higher Secondary</span>
        </GlassCard>
        <GlassCard className="p-4">
          <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">Placement Status</span>
          <h3 className="text-xl font-bold text-[#22D3EE] mt-1 truncate">
            {profile?.placement_status || "NOT_PLACED"}
          </h3>
          <span className="text-[11px] text-[#94A3B8]">Phase 1 Active</span>
        </GlassCard>
      </div>

      {/* Verified Technical Skills */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#22D3EE]" />
            <span>Verified Skills Taxonomy ({profile?.skills?.length || 0})</span>
          </h3>
        </div>

        {/* Add Skill Mini Form */}
        <form onSubmit={handleAddSkill} className="flex flex-wrap items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Skill Name (e.g. Next.js, Docker)"
            value={newSkill.skill_name}
            onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
            className="px-3 py-2 glass-input text-xs w-48"
          />
          <select
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            className="px-3 py-2 glass-input text-xs bg-[#0C1424]"
          >
            <option value="PROGRAMMING">Programming</option>
            <option value="FRAMEWORK">Framework</option>
            <option value="DATABASE">Database</option>
            <option value="TOOL">Tool</option>
            <option value="SOFT_SKILL">Soft Skill</option>
          </select>
          <select
            value={newSkill.proficiency}
            onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
            className="px-3 py-2 glass-input text-xs bg-[#0C1424]"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
          <GlassButton type="submit" size="sm" className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </GlassButton>
        </form>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-2">
          {(profile?.skills || []).map((skill: any) => (
            <div
              key={skill.id}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 flex items-center gap-2 text-xs"
            >
              <span className="font-semibold text-white">{skill.skill_name}</span>
              <span className="text-[10px] text-[#A5B4FC] bg-[#7565F6]/15 px-1.5 py-0.5 rounded">
                {skill.proficiency}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteSkill(skill.id)}
                className="text-[#64748B] hover:text-red-400 transition-colors ml-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Flagship Projects */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
          <BookOpen className="w-4 h-4 text-[#34D399]" />
          <span>Technical Project Portfolio ({profile?.projects?.length || 0})</span>
        </h3>

        {/* Existing Projects */}
        <div className="space-y-4 mb-6">
          {(profile?.projects || []).map((proj: any) => (
            <div key={proj.id} className="p-4 rounded-xl bg-[#0C1424] border border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                  <p className="text-xs text-[#94A3B8] mt-1">{proj.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#A5B4FC] font-mono">
                      Tech: {proj.technologies}
                    </span>
                  </div>
                </div>
                {proj.github_url && (
                  <a
                    href={proj.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#22D3EE] hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Repo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Project Form */}
        <form onSubmit={handleAddProject} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <span className="text-xs font-bold text-white block">Add New Project</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="px-3 py-2 glass-input text-xs"
            />
            <input
              type="text"
              placeholder="Technologies (e.g. Next.js, FastAPI, Docker)"
              value={newProject.technologies}
              onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
              className="px-3 py-2 glass-input text-xs"
            />
          </div>
          <textarea
            rows={2}
            placeholder="Key project accomplishments and quantified outcomes..."
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full px-3 py-2 glass-input text-xs"
          />
          <div className="flex justify-end">
            <GlassButton type="submit" size="sm">
              Save Project
            </GlassButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
