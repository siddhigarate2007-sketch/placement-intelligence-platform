import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import { AmbientGlow } from "@/components/AmbientGlow";

export const metadata: Metadata = {
  title: "Student Placement Intelligence & Career Readiness Platform",
  description: "Advanced Career Intelligence with Explainable ML Placement Prediction, Multi-Architecture Benchmarks, Skill-Gap Remediation, and Campus Recruitment Analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080D19] text-[#F8FAFC] antialiased selection:bg-[#7565F6] selection:text-white min-h-screen">
        <AuthProvider>
          <AmbientGlow />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
