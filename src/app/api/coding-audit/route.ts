/* ───────────────────────────────────────────────────────
   Coding Audit (AI Second Reviewer)
   POST /api/coding-audit — Reviews coded claims for accuracy before submission
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, maskPHI } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicalNote, assignedCodes, specialty } = body;

    if (!clinicalNote || !assignedCodes) {
      return NextResponse.json({ error: "clinicalNote and assignedCodes required" }, { status: 400 });
    }

    const maskedNote = maskPHI(clinicalNote);
    const codes = Array.isArray(assignedCodes) ? assignedCodes.join(", ") : assignedCodes;

    const prompt = `You are a coding audit specialist performing a second-pass review. A coder (human or AI) has already assigned codes. Your job is to verify accuracy, find errors, and ensure compliance.

Specialty: ${specialty || "General"}
Assigned Codes: ${codes}

Clinical Documentation:
${maskedNote}

Return JSON:
{
  "overallAccuracy": number (0-100),
  "auditResult": "pass" | "needs_correction" | "fail",
  "codeReview": [
    {
      "code": "The assigned code",
      "verdict": "correct" | "incorrect" | "unsupported" | "undercoded" | "overcoded",
      "evidence": "Quote from note that supports or contradicts this code",
      "issue": "Description of the problem (null if correct)",
      "suggestedCode": "Correct code if different (null if correct)",
      "complianceRisk": "low" | "medium" | "high",
      "auditFlag": boolean
    }
  ],
  "missingCodes": [
    {
      "code": "Code that should have been assigned but wasn't",
      "reason": "Why this code is supported by the documentation",
      "evidence": "Quote from note"
    }
  ],
  "bundlingIssues": [
    {
      "codes": ["List of codes with bundling conflict"],
      "issue": "Description of the bundling problem",
      "resolution": "How to fix"
    }
  ],
  "complianceSummary": {
    "correctCodes": number,
    "incorrectCodes": number,
    "missingCodes": number,
    "bundlingIssues": number,
    "overallRisk": "low" | "medium" | "high",
    "recommendedAction": "submit" | "correct_and_submit" | "hold_for_review"
  }
}`;

    const aiResponse = await chatCompletion(
      "You are a certified coding auditor (CPC, CCS level). Perform a thorough second-pass review of assigned medical codes against clinical documentation. Check for: accuracy, specificity, bundling errors, modifier appropriateness, documentation support, and compliance risk. Be precise.",
      prompt,
      { temperature: 0.1, maxTokens: 2500, responseFormat: "json" }
    );

    let audit;
    try { audit = JSON.parse(aiResponse); } catch { audit = { rawResponse: aiResponse }; }

    return NextResponse.json({ success: true, audit });
  } catch (error) {
    console.error("Coding audit error:", error);
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}
