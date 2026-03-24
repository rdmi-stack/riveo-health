/* ───────────────────────────────────────────────────────
   Charge Capture Audit API
   POST /api/charge-capture — AI analyzes clinical notes to find unbilled services
   GET /api/charge-capture — List found missed charges
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { chatCompletion, maskPHI } from "@/lib/openai";

const COL = "charge_capture_findings";
async function col() { return (await getDb()).collection(COL); }

// ── Analyze clinical note for missed charges ───────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicalNote, existingCharges = [], patientId, encounterId, provider, orgId = "demo" } = body;

    if (!clinicalNote || clinicalNote.length < 30) {
      return NextResponse.json({ error: "Clinical note must be at least 30 characters" }, { status: 400 });
    }

    const maskedNote = maskPHI(clinicalNote);
    const chargesList = existingCharges.length > 0
      ? `\nAlready billed CPT codes: ${existingCharges.join(", ")}`
      : "\nNo existing charges provided — analyze all billable services in the note.";

    const prompt = `You are a charge capture auditor. Analyze this clinical documentation and identify ALL billable services, procedures, and supplies that should generate charges. Compare against any already-billed codes to find MISSED charges.

Clinical Note:
${maskedNote}
${chargesList}

Return JSON:
{
  "documentedServices": [
    {
      "service": "Description of the service documented",
      "cptCode": "Appropriate CPT code",
      "icdSupport": "ICD-10 code supporting medical necessity",
      "evidence": "Exact quote from note supporting this charge",
      "estimatedCharge": number,
      "alreadyBilled": boolean,
      "confidence": number (0-100)
    }
  ],
  "missedCharges": [
    {
      "service": "What was missed",
      "cptCode": "CPT that should have been billed",
      "estimatedRevenue": number,
      "evidence": "Quote from note proving this was performed",
      "reason": "Why this is commonly missed",
      "priority": "high" | "medium" | "low"
    }
  ],
  "summary": {
    "totalDocumentedServices": number,
    "alreadyBilled": number,
    "missedCharges": number,
    "estimatedMissedRevenue": number,
    "chargeCapturRate": "percentage of services that were billed"
  }
}`;

    const aiResponse = await chatCompletion(
      "You are a healthcare charge capture auditor with CPC certification-level knowledge. Identify all billable services from clinical documentation. Be thorough — missed charges cost practices $2-5M annually.",
      prompt,
      { temperature: 0.1, maxTokens: 2500, responseFormat: "json" }
    );

    let findings;
    try { findings = JSON.parse(aiResponse); } catch { findings = { rawResponse: aiResponse }; }

    // Save findings
    if (findings.missedCharges?.length > 0) {
      const c = await col();
      await c.insertOne({
        orgId,
        patientId: patientId || null,
        encounterId: encounterId || null,
        provider: provider || null,
        missedCharges: findings.missedCharges,
        summary: findings.summary,
        status: "review",
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, findings });
  } catch (error) {
    console.error("Charge capture error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

// ── List findings ──────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const c = await col();
    const items = await c.find({ orgId }).sort({ createdAt: -1 }).limit(50).toArray();
    const totalMissed = items.reduce((s: number, i: any) => s + (i.summary?.estimatedMissedRevenue || 0), 0);
    return NextResponse.json({ findings: items, totalMissedRevenue: totalMissed });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
