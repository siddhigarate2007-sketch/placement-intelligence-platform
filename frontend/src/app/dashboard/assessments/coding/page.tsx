"use client";

import React from "react";
import { AssessmentRunner } from "@/components/AssessmentRunner";

export default function CodingAssessmentPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <AssessmentRunner
        category="CODING"
        title="Algorithm & Problem Solving Assessment"
      />
    </div>
  );
}
