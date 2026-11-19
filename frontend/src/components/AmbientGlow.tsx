import React from "react";

export function AmbientGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft violet glow top left */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#7565F6]/15 rounded-full blur-[130px]" />
      {/* Cyan accent glow top right */}
      <div className="absolute top-20 -right-20 w-[30rem] h-[30rem] bg-[#22D3EE]/10 rounded-full blur-[140px]" />
      {/* Indigo glow bottom center */}
      <div className="absolute -bottom-40 left-1/3 w-[36rem] h-[36rem] bg-[#A5B4FC]/10 rounded-full blur-[150px]" />
    </div>
  );
}
