import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: "violet" | "cyan" | "none";
  hoverEffect?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = "none",
  hoverEffect = false,
  ...props
}: GlassCardProps) {
  const glowClasses = {
    violet: "shadow-glow-violet border-primary-violet/30",
    cyan: "shadow-glow-cyan border-cyan-accent/30",
    none: "",
  };

  return (
    <div
      className={cn(
        "glass-panel p-6 relative overflow-hidden transition-all duration-300",
        hoverEffect && "glass-panel-hover",
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
