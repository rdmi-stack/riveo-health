/* ───────────────────────────────────────────────────────
   Patient Cost Estimation / Price Transparency API
   POST /api/estimate — Generate Good Faith Estimate
   GET /api/estimate — List past estimates
   No Surprises Act (NSA) compliant
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { chatCompletion } from "@/lib/openai";

const COL = "patient_estimates";
async function col() { return (await getDb()).collection(COL); }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientId, patientName, payer, planType, memberId,
      services = [], // [{ cptCode, description, quantity }]
      deductibleRemaining, copay, coinsurance,
      facilityType = "office", providerName, orgId = "demo",
    } = body;

    if (!services.length) {
      return NextResponse.json({ error: "At least one service is required" }, { status: 400 });
    }

    const servicesList = services.map((s: any, i: number) =>
      `Service ${i + 1}: CPT=${s.cptCode}, Desc=${s.description || "N/A"}, Qty=${s.quantity || 1}`
    ).join("\n");

    const prompt = `Generate a patient cost estimate (Good Faith Estimate per No Surprises Act) for these services.

Patient: ${patientName || "N/A"}
Payer: ${payer || "Self-Pay"}
Plan Type: ${planType || "PPO"}
Facility: ${facilityType}
Provider: ${providerName || "N/A"}
Deductible Remaining: $${deductibleRemaining || "unknown"}
Copay: $${copay || "unknown"}
Coinsurance: ${coinsurance || "unknown"}%

Services:
${servicesList}

Return JSON:
{
  "estimateId": "GFE-XXXXXX",
  "services": [
    {
      "cptCode": "code",
      "description": "Service description",
      "quantity": number,
      "providerCharge": number,
      "allowedAmount": number,
      "insurancePays": number,
      "patientResponsibility": number,
      "breakdown": {
        "copay": number,
        "deductible": number,
        "coinsurance": number
      },
      "notes": "Any relevant notes"
    }
  ],
  "summary": {
    "totalProviderCharges": number,
    "totalAllowedAmount": number,
    "totalInsurancePays": number,
    "totalPatientResponsibility": number,
    "deductibleApplied": number,
    "copayApplied": number,
    "coinsuranceApplied": number
  },
  "disclaimer": "Standard No Surprises Act disclaimer text",
  "validFor": "30 days",
  "paymentOptions": [
    { "option": "Pay in full", "amount": number, "discount": "5% prompt pay discount" },
    { "option": "3-month plan", "monthly": number },
    { "option": "6-month plan", "monthly": number },
    { "option": "12-month plan", "monthly": number }
  ],
  "financialAssistance": {
    "mayQualify": boolean,
    "programs": ["List of applicable programs"],
    "message": "Information about financial assistance"
  }
}`;

    const aiResponse = await chatCompletion(
      "You are a healthcare price transparency specialist. Generate accurate, detailed patient cost estimates compliant with the No Surprises Act. Use realistic Medicare/commercial rates for CPT codes. Include payment plan options and financial assistance screening.",
      prompt,
      { temperature: 0.2, maxTokens: 2500, responseFormat: "json" }
    );

    let estimate;
    try { estimate = JSON.parse(aiResponse); } catch { estimate = { error: "Parse failed" }; }

    // Save
    const c = await col();
    const doc = {
      orgId,
      patientId: patientId || null,
      patientName: patientName || null,
      payer: payer || "Self-Pay",
      services,
      estimate,
      totalPatientResponsibility: estimate.summary?.totalPatientResponsibility || 0,
      status: "generated",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };
    const result = await c.insertOne(doc);

    return NextResponse.json({ success: true, id: result.insertedId.toString(), ...estimate });
  } catch (error) {
    console.error("Estimate error:", error);
    return NextResponse.json({ error: "Estimation failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const c = await col();
    const items = await c.find({ orgId }).sort({ createdAt: -1 }).limit(30).toArray();
    return NextResponse.json({ estimates: items });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
