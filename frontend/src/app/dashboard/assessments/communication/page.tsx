"use client";

import React from "react";
import { AssessmentRunner } from "@/components/AssessmentRunner";

export default function CommunicationAssessmentPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <AssessmentRunner
        category="COMMUNICATION"
        title="Professional Communication & Verbal Reasoning"
      />
    </div>
  );
}
