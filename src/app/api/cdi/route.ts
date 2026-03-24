/* ───────────────────────────────────────────────────────
   Clinical Documentation Integrity (CDI) AI
   POST /api/cdi — Review clinical notes for documentation gaps
   that impact coding accuracy and reimbursement
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, maskPHI } from "@/lib/openai";
import { getDb } from "@/lib/mongodb";

const COL = "cdi_reviews";
async function col() { return (await getDb()).collection(COL); }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicalNote, currentCodes = [], specialty, orgId = "demo" } = body;

    if (!clinicalNote || clinicalNote.length < 30) {
      return NextResponse.json({ error: "Clinical note required (min 30 chars)" }, { status: 400 });
    }

    const maskedNote = maskPHI(clinicalNote);
    const codesInfo = currentCodes.length > 0 ? `\nCurrently coded: ${currentCodes.join(", ")}` : "";

    const prompt = `You are a Clinical Documentation Integrity (CDI) specialist. Review this clinical documentation and identify opportunities to improve documentation that would support more accurate (not upcoded) billing.

Specialty: ${specialty || "General"}
${codesInfo}

Clinical Note:
${maskedNote}

Return JSON:
{
  "documentationScore": number (0-100, how well the note supports billing),
  "queries": [
    {
      "type": "specificity" | "laterality" | "acuity" | "causation" | "complication" | "severity" | "status" | "linkage",
      "question": "Specific query for the physician",
      "currentDocumentation": "What the note currently says",
      "suggestedDocumentation": "What should be added/clarified",
      "codingImpact": "How this change affects coding",
      "revenueImpact": "estimated" | "significant" | "moderate" | "minor",
      "codeWithout": "Code assigned without the clarification",
      "codeWith": "Code that could be assigned with proper documentation"
    }
  ],
  "strengths": ["What the documentation does well"],
  "emLevelAnalysis": {
    "supportedLevel": "E/M level the current documentation supports",
    "potentialLevel": "E/M level that could be supported with better documentation",
    "gaps": ["Specific documentation elements missing for higher level"]
  },
  "riskAdjustment": {
    "hccOpportunities": [
      {
        "condition": "Condition documented but not coded for HCC",
        "hccCode": "HCC category",
        "documentationNeeded": "What to add"
      }
    ]
  },
  "summary": {
    "totalQueries": number,
    "estimatedRevenueOpportunity": "Dollar range if all queries are addressed",
    "priority": "high" | "medium" | "low"
  }
}`;

    const aiResponse = await chatCompletion(
      "You are a CDI specialist with CCS, CDIP certification-level knowledge. Identify documentation improvement opportunities that support accurate coding and appropriate reimbursement. Never suggest upcoding — only suggest documentation that reflects the true clinical picture.",
      prompt,
      { temperature: 0.1, maxTokens: 3000, responseFormat: "json" }
    );

    let review;
    try { review = JSON.parse(aiResponse); } catch { review = { rawResponse: aiResponse }; }

    // Save review
    const c = await col();
    await c.insertOne({ orgId, specialty, queriesCount: review.queries?.length || 0, documentationScore: review.documentationScore, summary: review.summary, createdAt: new Date() });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("CDI error:", error);
    return NextResponse.json({ error: "CDI review failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const c = await col();
    const reviews = await c.find({ orgId }).sort({ createdAt: -1 }).limit(20).toArray();
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
