/* ───────────────────────────────────────────────────────
   Personalized Patient Billing Engine
   POST /api/patient-billing — Generate optimal billing strategy per patient
   GET /api/patient-billing — List billing campaigns
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { chatCompletion } from "@/lib/openai";

const COL = "patient_billing_campaigns";
async function col() { return (await getDb()).collection(COL); }

// ── Generate personalized billing strategy ─────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patients, orgId = "demo" } = body;

    if (!Array.isArray(patients) || patients.length === 0) {
      return NextResponse.json({ error: "patients array required" }, { status: 400 });
    }

    const batch = patients.slice(0, 20).map((p: any, i: number) =>
      `Patient ${i + 1}: Balance=$${p.balance}, Age=${p.ageGroup || "unknown"}, PayHistory=${p.paymentHistory || "unknown"}, Channel=${p.preferredChannel || "unknown"}, DaysPastDue=${p.daysPastDue || 0}, InsuranceStatus=${p.hasInsurance ? "insured" : "self-pay"}`
    ).join("\n");

    const prompt = `You are a patient collections optimizer. For each patient, determine the optimal billing communication strategy that maximizes payment probability while maintaining a positive patient relationship.

${batch}

For each patient return JSON:
{
  "strategies": [
    {
      "patientIndex": number,
      "recommendedChannel": "sms" | "email" | "mail" | "phone" | "portal",
      "messageType": "friendly_reminder" | "payment_plan_offer" | "hardship_screening" | "final_notice" | "balance_explanation",
      "messageTone": "empathetic" | "informative" | "urgent" | "celebratory",
      "optimalSendTime": "morning" | "afternoon" | "evening",
      "optimalSendDay": "weekday" | "weekend",
      "paymentPlanRecommendation": { "offered": boolean, "months": number, "monthlyAmount": number } | null,
      "sampleMessage": "The actual message to send (personalized, specific dollar amount, clear CTA)",
      "followUpDays": number,
      "escalationTrigger": "What happens if no response",
      "collectProbability": number (0-100),
      "notes": "Why this strategy for this patient"
    }
  ],
  "batchInsights": {
    "avgCollectProbability": number,
    "recommendedChannelBreakdown": {"sms": number, "email": number, "mail": number, "phone": number},
    "patientsNeedingHardship": number,
    "totalExpectedRecovery": number
  }
}`;

    const aiResponse = await chatCompletion(
      "You are a healthcare patient collections expert who maximizes revenue recovery while maintaining patient satisfaction. Use behavioral economics principles — loss aversion, social proof, anchoring, and choice architecture.",
      prompt,
      { temperature: 0.3, maxTokens: 3000, responseFormat: "json" }
    );

    let strategies;
    try { strategies = JSON.parse(aiResponse); } catch { strategies = { rawResponse: aiResponse }; }

    // Save campaign
    const c = await col();
    await c.insertOne({
      orgId,
      patientsCount: patients.length,
      strategies: strategies.strategies || [],
      insights: strategies.batchInsights || null,
      status: "generated",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, ...strategies });
  } catch (error) {
    console.error("Patient billing error:", error);
    return NextResponse.json({ error: "Strategy generation failed" }, { status: 500 });
  }
}

// ── List campaigns ─────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const c = await col();
    const items = await c.find({ orgId }).sort({ createdAt: -1 }).limit(20).toArray();
    return NextResponse.json({ campaigns: items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
