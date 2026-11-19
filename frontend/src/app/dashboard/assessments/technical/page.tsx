"use client";

import React from "react";
import { AssessmentRunner } from "@/components/AssessmentRunner";

export default function TechnicalAssessmentPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <AssessmentRunner
        category="TECHNICAL"
        title="Core CS Fundamentals & Engineering Benchmark"
      />
    </div>
  );
}
