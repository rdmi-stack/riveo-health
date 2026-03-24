/* ───────────────────────────────────────────────────────
   Payer Rules Intelligence Database
   POST /api/payer-rules — Add/detect new rule from denial
   GET /api/payer-rules — List rules with filters
   Auto-updates when any client encounters a new payer rule
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { chatCompletion } from "@/lib/openai";

const COL = "payer_rules";
async function col() { return (await getDb()).collection(COL); }

// ── Detect & add rule from denial pattern ──────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payer, denialCode, denialReason, cptCode, icdCode, claimDetails, orgId = "demo" } = body;

    if (!payer || !denialCode) {
      return NextResponse.json({ error: "payer and denialCode required" }, { status: 400 });
    }

    // Check if rule already exists
    const c = await col();
    const existing = await c.findOne({ payer, denialCode, cptCode: cptCode || null, status: "active" });

    if (existing) {
      // Increment occurrence count
      await c.updateOne({ _id: existing._id }, {
        $inc: { occurrences: 1 },
        $set: { lastSeenAt: new Date() },
        $addToSet: { affectedOrgs: orgId },
      });
      return NextResponse.json({ success: true, action: "incremented", rule: existing });
    }

    // AI generates the rule from the denial
    const prompt = `A claim was denied. Extract the payer-specific billing rule that caused this denial.

Payer: ${payer}
Denial Code: ${denialCode}
Denial Reason: ${denialReason || "Not specified"}
CPT Code: ${cptCode || "N/A"}
ICD-10: ${icdCode || "N/A"}
Details: ${claimDetails || "None"}

Return JSON:
{
  "ruleName": "Short descriptive name for this rule",
  "ruleDescription": "Detailed description of the payer's rule/requirement",
  "category": "eligibility" | "authorization" | "coding" | "documentation" | "timely_filing" | "bundling" | "modifier" | "medical_necessity" | "coordination_of_benefits",
  "affectedCPTs": ["List of CPT codes this rule applies to"],
  "affectedSpecialties": ["Specialties most impacted"],
  "preventionAction": "Exact steps to prevent this denial in the future",
  "checkBeforeSubmit": "What to verify before submitting claims affected by this rule",
  "payerSpecificNotes": "Any payer-specific nuances or exceptions",
  "effectiveDate": "When this rule appears to have taken effect (if known)",
  "severity": "high" | "medium" | "low"
}`;

    const aiResponse = await chatCompletion(
      "You are a payer contract and billing rules expert. Extract precise, actionable billing rules from denial data. These rules will be applied to prevent future denials across all clients.",
      prompt,
      { temperature: 0.1, maxTokens: 1500, responseFormat: "json" }
    );

    let ruleData;
    try { ruleData = JSON.parse(aiResponse); } catch { ruleData = { ruleName: denialReason, ruleDescription: denialReason }; }

    const newRule = {
      payer,
      denialCode,
      cptCode: cptCode || null,
      icdCode: icdCode || null,
      ...ruleData,
      occurrences: 1,
      affectedOrgs: [orgId],
      source: "denial_detection",
      status: "active",
      lastSeenAt: new Date(),
      createdAt: new Date(),
    };

    const result = await c.insertOne(newRule);

    return NextResponse.json({
      success: true,
      action: "created",
      ruleId: result.insertedId.toString(),
      rule: ruleData,
    }, { status: 201 });
  } catch (error) {
    console.error("Payer rules error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// ── List payer rules ───────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const payer = sp.get("payer");
    const category = sp.get("category");
    const search = sp.get("search");

    const c = await col();
    const filter: Record<string, unknown> = { status: "active" };
    if (payer) filter.payer = payer;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { ruleName: { $regex: search, $options: "i" } },
        { ruleDescription: { $regex: search, $options: "i" } },
        { denialCode: { $regex: search, $options: "i" } },
      ];
    }

    const rules = await c.find(filter).sort({ occurrences: -1 }).limit(100).toArray();
    const payers = await c.distinct("payer");
    const categories = await c.distinct("category");

    return NextResponse.json({ rules, total: rules.length, payers, categories });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
