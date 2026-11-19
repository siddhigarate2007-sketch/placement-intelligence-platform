import React from "react";

interface ReadinessGaugeProps {
  score: number; // 0 to 100
  size?: number;
  label?: string;
}

export function ReadinessGauge({ score, size = 180, label = "Readiness Index" }: ReadinessGaugeProps) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = "#34D399"; // success
  let category = "Placement Ready";
  if (score < 50) {
    color = "#FB7185";
    category = "At-Risk";
  } else if (score < 75) {
    color = "#FBBF24";
    category = "Needs Preparation";
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold text-white tracking-tight">
          {score}%
        </span>
        <span className="text-[11px] font-semibold tracking-wider uppercase mt-0.5" style={{ color }}>
          {category}
        </span>
      </div>
      <span className="text-xs text-[#94A3B8] font-medium mt-3">{label}</span>
    </div>
  );
}
