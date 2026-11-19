import React from "react";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function GlassButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: GlassButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#080D19] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#7565F6] to-[#6351EB] text-white hover:opacity-95 shadow-lg shadow-[#7565F6]/25 border border-white/10",
    secondary:
      "bg-[#111C32]/80 hover:bg-[#162440] text-[#F8FAFC] border border-white/10 hover:border-white/20",
    outline:
      "border border-white/20 hover:border-primary-violet text-[#F8FAFC] hover:bg-primary-violet/10",
    danger:
      "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30",
    ghost: "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5",
  };

  return (
    <button
      className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
