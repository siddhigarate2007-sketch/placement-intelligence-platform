"use client";

import React from "react";
import { AssessmentRunner } from "@/components/AssessmentRunner";

export default function AptitudeAssessmentPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <AssessmentRunner
        category="APTITUDE"
        title="Campus Placement Aptitude Benchmark 2026"
      />
    </div>
  );
}
