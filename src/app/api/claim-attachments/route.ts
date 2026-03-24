/* ───────────────────────────────────────────────────────
   Claim Attachment Automation
   POST /api/claim-attachments — AI identifies required attachments per claim
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claims } = body;

    if (!Array.isArray(claims) || claims.length === 0) {
      return NextResponse.json({ error: "claims array required" }, { status: 400 });
    }

    const batch = claims.slice(0, 15).map((c: any, i: number) =>
      `Claim ${i + 1}: Payer=${c.payer}, CPT=${c.cptCode}, ICD=${c.icdCode}, Billed=$${c.billedAmount}, Type=${c.encounterType || "office visit"}`
    ).join("\n");

    const aiResponse = await chatCompletion(
      "You are a healthcare claims attachment specialist. Determine which claims require supporting documentation and what specific documents are needed per payer requirements.",
      `Analyze these claims and identify which need attachments before submission:\n\n${batch}\n\nReturn JSON:\n{\n  "attachmentAnalysis": [\n    {\n      "claimIndex": number,\n      "attachmentRequired": boolean,\n      "requiredDocuments": [\n        {\n          "documentType": "operative_report" | "clinical_notes" | "lab_results" | "imaging" | "referral" | "prior_auth" | "medical_necessity_letter" | "pathology" | "therapy_notes",\n          "reason": "Why this document is required",\n          "payerRule": "Specific payer rule requiring this",\n          "format": "PDF" | "CDA" | "HL7",\n          "priority": "required" | "recommended"\n        }\n      ],\n      "missingAttachmentDenialRisk": number (0-100),\n      "autoAttachable": boolean,\n      "notes": "Additional context"\n    }\n  ],\n  "summary": {\n    "totalClaims": number,\n    "claimsNeedingAttachments": number,\n    "totalDocumentsNeeded": number,\n    "highRiskClaims": number\n  }\n}`,
      { temperature: 0.1, maxTokens: 2500, responseFormat: "json" }
    );

    let analysis;
    try { analysis = JSON.parse(aiResponse); } catch { analysis = { rawResponse: aiResponse }; }

    return NextResponse.json({ success: true, ...analysis });
  } catch (error) {
    console.error("Attachment analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
