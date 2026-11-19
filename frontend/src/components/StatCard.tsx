import React from "react";
import { GlassCard } from "./GlassCard";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  accentColor?: "violet" | "cyan" | "indigo" | "emerald" | "amber";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = "up",
  accentColor = "violet",
}: StatCardProps) {
  const accentClasses = {
    violet: "from-[#7565F6]/20 to-[#7565F6]/5 text-[#A5B4FC] border-[#7565F6]/30",
    cyan: "from-[#22D3EE]/20 to-[#22D3EE]/5 text-[#22D3EE] border-[#22D3EE]/30",
    indigo: "from-[#6366F1]/20 to-[#6366F1]/5 text-[#818CF8] border-[#6366F1]/30",
    emerald: "from-[#34D399]/20 to-[#34D399]/5 text-[#34D399] border-[#34D399]/30",
    amber: "from-[#FBBF24]/20 to-[#FBBF24]/5 text-[#FBBF24] border-[#FBBF24]/30",
  };

  return (
    <GlassCard hoverEffect className="p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-[#94A3B8]">{title}</span>
          <h3 className="text-2xl font-bold text-[#F8FAFC] mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center border",
            accentClasses[accentColor]
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-4 text-xs">
          {trend && (
            <span
              className={cn(
                "font-semibold",
                trendDirection === "up" ? "text-[#34D399]" : trendDirection === "down" ? "text-[#FB7185]" : "text-[#94A3B8]"
              )}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-[#64748B]">{subtitle}</span>}
        </div>
      )}
    </GlassCard>
  );
}
