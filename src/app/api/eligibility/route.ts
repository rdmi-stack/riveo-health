/* ───────────────────────────────────────────────────────
   Real-time Eligibility Verification API
   POST /api/eligibility — Verify patient insurance coverage
   GET /api/eligibility — List verification history

   Checks: active coverage, copay, deductible, coinsurance,
   out-of-pocket max, secondary insurance, prior auth requirements
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { chatCompletion } from "@/lib/openai";

const COL = "eligibility_checks";
async function col() { return (await getDb()).collection(COL); }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientId, firstName, lastName, dob, memberId,
      payer, groupNumber, subscriberRelation = "self",
      serviceType, cptCode, dateOfService, npi,
      orgId = "demo",
    } = body;

    if (!payer || !memberId) {
      return NextResponse.json({ error: "payer and memberId are required" }, { status: 400 });
    }

    // In production: call real payer API (Availity, Change Healthcare, Waystar)
    // For MVP: AI-simulated response based on realistic payer data

    const prompt = `Simulate a real-time eligibility verification response for this patient.
Generate a realistic, detailed 270/271 eligibility response.

Patient: ${firstName || "N/A"} ${lastName || "N/A"}
DOB: ${dob || "N/A"}
Payer: ${payer}
Member ID: ${memberId}
Group: ${groupNumber || "N/A"}
Subscriber Relation: ${subscriberRelation}
Service Type: ${serviceType || "Office Visit"}
CPT Code: ${cptCode || "99213"}
Date of Service: ${dateOfService || new Date().toISOString().split("T")[0]}
Provider NPI: ${npi || "N/A"}

Return JSON:
{
  "eligible": boolean,
  "status": "active" | "inactive" | "pending" | "terminated",
  "planInfo": {
    "planName": "Full plan name",
    "planType": "PPO" | "HMO" | "EPO" | "POS" | "Medicare" | "Medicaid",
    "effectiveDate": "YYYY-MM-DD",
    "terminationDate": "YYYY-MM-DD or null",
    "groupName": "Employer/group name",
    "groupNumber": "Group number"
  },
  "benefits": {
    "copay": number (in dollars),
    "coinsurance": number (percentage, e.g., 20),
    "deductible": { "individual": number, "family": number, "met": number, "remaining": number },
    "outOfPocketMax": { "individual": number, "family": number, "met": number, "remaining": number },
    "coverageLevel": "In-Network" | "Out-of-Network"
  },
  "serviceSpecific": {
    "covered": boolean,
    "priorAuthRequired": boolean,
    "referralRequired": boolean,
    "preExistingWaiting": boolean,
    "limitations": "Any service-specific limitations",
    "estimatedPatientResponsibility": number
  },
  "secondaryInsurance": {
    "detected": boolean,
    "payerName": "Secondary payer or null",
    "memberId": "Secondary member ID or null",
    "coordinationOfBenefits": "primary" | "secondary" | "none"
  },
  "alerts": [
    {
      "type": "coverage_gap" | "auth_required" | "referral_needed" | "deductible_not_met" | "out_of_network" | "plan_change" | "secondary_found",
      "severity": "high" | "medium" | "low",
      "message": "Specific alert message"
    }
  ],
  "verificationId": "Unique verification reference number",
  "verifiedAt": "ISO timestamp",
  "payerResponseTime": "milliseconds"
}`;

    const aiResponse = await chatCompletion(
      "You are a healthcare eligibility verification system. Generate realistic, detailed eligibility responses that match real 270/271 transaction data. Use realistic plan names, copay amounts, deductible levels, and coverage details for the specified payer.",
      prompt,
      { temperature: 0.3, maxTokens: 2000, responseFormat: "json" }
    );

    let verification;
    try { verification = JSON.parse(aiResponse); } catch { verification = { eligible: false, error: "Parse error" }; }

    // Save to DB
    const c = await col();
    const doc = {
      orgId,
      patientId: patientId || null,
      patientName: `${firstName || ""} ${lastName || ""}`.trim(),
      payer,
      memberId,
      serviceType: serviceType || "Office Visit",
      cptCode: cptCode || null,
      result: verification,
      eligible: verification.eligible,
      alerts: verification.alerts || [],
      createdAt: new Date(),
    };
    const result = await c.insertOne(doc);

    return NextResponse.json({
      success: true,
      verificationId: result.insertedId.toString(),
      ...verification,
    });
  } catch (error) {
    console.error("Eligibility error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

// ── Verification history ───────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const orgId = sp.get("org") || "demo";
    const patientId = sp.get("patientId");
    const limit = Math.min(parseInt(sp.get("limit") || "30"), 100);

    const c = await col();
    const filter: Record<string, unknown> = { orgId };
    if (patientId) filter.patientId = patientId;

    const items = await c.find(filter).sort({ createdAt: -1 }).limit(limit).toArray();
    const stats = {
      total: items.length,
      eligible: items.filter((i: any) => i.eligible).length,
      ineligible: items.filter((i: any) => !i.eligible).length,
      alertsRaised: items.reduce((s: number, i: any) => s + (i.alerts?.length || 0), 0),
    };

    return NextResponse.json({ verifications: items, stats });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
