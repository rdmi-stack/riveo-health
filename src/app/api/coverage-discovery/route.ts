/* ───────────────────────────────────────────────────────
   Coverage Discovery API
   POST /api/coverage-discovery — Find hidden insurance for self-pay patients
   GET /api/coverage-discovery — List discoveries
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { chatCompletion } from "@/lib/openai";

const COL = "coverage_discoveries";
async function col() { return (await getDb()).collection(COL); }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patients, orgId = "demo" } = body;

    if (!Array.isArray(patients) || patients.length === 0) {
      return NextResponse.json({ error: "patients array required" }, { status: 400 });
    }

    const batch = patients.slice(0, 20).map((p: any, i: number) =>
      `Patient ${i + 1}: Age=${p.age || "unknown"}, Employment=${p.employment || "unknown"}, SpouseEmployment=${p.spouseEmployment || "unknown"}, CurrentCoverage=${p.currentCoverage || "self-pay"}, RecentLifeEvent=${p.recentLifeEvent || "none"}, IncomeRange=${p.incomeRange || "unknown"}, State=${p.state || "unknown"}, Veteran=${p.isVeteran ? "yes" : "no"}, Disabled=${p.isDisabled ? "yes" : "no"}, Balance=$${p.balance || 0}`
    ).join("\n");

    const prompt = `You are a healthcare coverage discovery specialist. For each self-pay patient, identify potential insurance coverage sources they may not have disclosed or may be eligible for.

${batch}

Return JSON:
{
  "discoveries": [
    {
      "patientIndex": number,
      "possibleCoverage": [
        {
          "type": "employer" | "spouse_employer" | "medicaid" | "medicare" | "va" | "tricare" | "marketplace" | "cobra" | "state_program" | "charity_care",
          "program": "Specific program name",
          "likelihood": number (0-100),
          "estimatedValue": number (annual coverage value),
          "eligibilityCriteria": "Why this patient may qualify",
          "nextStep": "Specific action to verify and enroll",
          "documentationNeeded": "What documents to request from the patient"
        }
      ],
      "totalPotentialCoverage": number,
      "priority": "high" | "medium" | "low"
    }
  ],
  "batchSummary": {
    "totalPatients": number,
    "patientsWithPotentialCoverage": number,
    "totalPotentialRecovery": number,
    "topCoverageTypes": [{"type": string, "count": number}]
  }
}`;

    const aiResponse = await chatCompletion(
      "You are a healthcare coverage discovery expert. Identify ALL possible insurance coverage sources including employer plans, government programs (Medicaid, Medicare, VA, TRICARE), marketplace plans, COBRA, state-specific programs, and charity care. Be thorough — missed coverage costs hospitals billions annually.",
      prompt,
      { temperature: 0.2, maxTokens: 3000, responseFormat: "json" }
    );

    let discoveries;
    try { discoveries = JSON.parse(aiResponse); } catch { discoveries = { rawResponse: aiResponse }; }

    // Save
    const c = await col();
    await c.insertOne({ orgId, patientsScanned: patients.length, discoveries: discoveries.discoveries || [], summary: discoveries.batchSummary || null, createdAt: new Date() });

    return NextResponse.json({ success: true, ...discoveries });
  } catch (error) {
    console.error("Coverage discovery error:", error);
    return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const c = await col();
    const items = await c.find({ orgId }).sort({ createdAt: -1 }).limit(20).toArray();
    return NextResponse.json({ scans: items });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
