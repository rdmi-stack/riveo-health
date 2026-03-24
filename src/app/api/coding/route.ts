/* ───────────────────────────────────────────────────────
   POST /api/coding — AI auto-coding
   Clinical notes → ICD-10/CPT code suggestions (GPT-5.4)
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, SYSTEM_PROMPTS, maskPHI } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicalNote, specialty, encounterType } = body;

    if (!clinicalNote || clinicalNote.length < 20) {
      return NextResponse.json({ error: "Clinical note must be at least 20 characters" }, { status: 400 });
    }

    const maskedNote = maskPHI(clinicalNote);

    const prompt = `Analyze this clinical documentation and suggest accurate medical codes.

Specialty: ${specialty || "General"}
Encounter Type: ${encounterType || "Office Visit"}

Clinical Note:
${maskedNote}

Return JSON with this exact structure:
{
  "icdCodes": [
    {
      "code": "ICD-10-CM code",
      "description": "Full code description",
      "confidence": number (0-100),
      "supportingText": "Quote from the note that supports this code",
      "specificity": "Is there a more specific code available? If yes, what additional documentation is needed?"
    }
  ],
  "cptCodes": [
    {
      "code": "CPT code",
      "description": "Full code description",
      "confidence": number (0-100),
      "modifier": "Applicable modifier if any (25, 59, etc.) or null",
      "emLevel": "For E/M codes: what level is supported and why",
      "supportingText": "Quote from the note that supports this code"
    }
  ],
  "codingAlerts": [
    {
      "type": "undercoding" | "overcoding" | "missing_documentation" | "bundling_risk" | "modifier_needed",
      "severity": "high" | "medium" | "low",
      "message": "What the issue is and how to fix it",
      "revenueImpact": "Estimated dollar impact if not addressed"
    }
  ],
  "summary": {
    "totalIcdCodes": number,
    "totalCptCodes": number,
    "alertCount": number,
    "estimatedReimbursement": "Dollar range based on codes",
    "documentationQuality": "excellent" | "good" | "fair" | "poor",
    "documentationGaps": ["List of missing documentation elements"]
  }
}`;

    const aiResponse = await chatCompletion(SYSTEM_PROMPTS.MEDICAL_CODING, prompt, {
      temperature: 0.1,
      maxTokens: 3000,
      responseFormat: "json",
    });

    let coding;
    try {
      coding = JSON.parse(aiResponse);
    } catch {
      coding = { rawResponse: aiResponse, parseError: true };
    }

    return NextResponse.json({ success: true, coding });
  } catch (error) {
    console.error("Coding API error:", error);
    return NextResponse.json({ error: "Coding analysis failed" }, { status: 500 });
  }
}
