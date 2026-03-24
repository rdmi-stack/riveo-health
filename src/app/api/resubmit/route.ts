/* ───────────────────────────────────────────────────────
   POST /api/resubmit — Auto-resubmission workflow
   AI fixes denied claim → creates corrected version → queues for approval
   GET /api/resubmit — List resubmission queue
   PATCH /api/resubmit — Approve/reject resubmission
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { chatCompletion, SYSTEM_PROMPTS } from "@/lib/openai";
import { ObjectId } from "mongodb";

const COLLECTION = "resubmissions";

async function getResubCol() {
  const db = await getDb();
  return db.collection(COLLECTION);
}

// ── Generate corrected claim ───────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claimId, payer, cptCode, icdCode, billedAmount, denialCode, denialReason, provider, orgId = "demo" } = body;

    if (!claimId || !denialCode) {
      return NextResponse.json({ error: "claimId and denialCode required" }, { status: 400 });
    }

    const prompt = `A claim was denied. Generate a corrected claim for resubmission.

Original Claim:
- Claim ID: ${claimId}
- Payer: ${payer}
- CPT: ${cptCode}
- ICD-10: ${icdCode}
- Billed: $${billedAmount}
- Provider: ${provider || "N/A"}
- Denial Code: ${denialCode}
- Denial Reason: ${denialReason}

Return JSON:
{
  "corrections": [
    {
      "field": "Which field to change (cptCode, icdCode, modifier, documentation, etc.)",
      "originalValue": "What it was",
      "correctedValue": "What it should be",
      "reason": "Why this change fixes the denial"
    }
  ],
  "additionalDocumentation": "Any documentation that should be attached to the resubmission",
  "resubmissionNotes": "Notes to include with the corrected claim",
  "appealRequired": boolean,
  "appealLetter": "If appeal required, draft appeal text. Otherwise null",
  "recoveryProbability": number (0-100),
  "estimatedRecovery": number (dollar amount),
  "timelineDays": number (estimated days to resolution),
  "priority": "urgent" | "standard"
}`;

    const aiResponse = await chatCompletion(SYSTEM_PROMPTS.DENIAL_ANALYSIS, prompt, {
      temperature: 0.2,
      maxTokens: 2000,
      responseFormat: "json",
    });

    let correction;
    try {
      correction = JSON.parse(aiResponse);
    } catch {
      correction = { rawResponse: aiResponse, parseError: true };
    }

    // Save to resubmission queue
    const col = await getResubCol();
    const doc = {
      orgId,
      originalClaimId: claimId,
      payer,
      cptCode,
      icdCode,
      billedAmount,
      denialCode,
      denialReason,
      provider: provider || "",
      aiCorrection: correction,
      recoveryProbability: correction.recoveryProbability || null,
      estimatedRecovery: correction.estimatedRecovery || null,
      status: "pending_approval", // pending_approval → approved → resubmitted → resolved | rejected
      createdAt: new Date(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      correction,
    }, { status: 201 });
  } catch (error) {
    console.error("Resubmit error:", error);
    return NextResponse.json({ error: "Resubmission generation failed" }, { status: 500 });
  }
}

// ── List resubmission queue ────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const orgId = sp.get("org") || "demo";
    const status = sp.get("status");
    const page = parseInt(sp.get("page") || "1");
    const limit = Math.min(parseInt(sp.get("limit") || "50"), 100);

    const col = await getResubCol();
    const filter: Record<string, unknown> = { orgId };
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
      col.countDocuments(filter),
    ]);

    return NextResponse.json({
      resubmissions: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ── Approve/reject resubmission ────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, notes } = body; // action: approve | reject | resubmit | resolve

    if (!id || !action) return NextResponse.json({ error: "id and action required" }, { status: 400 });

    const col = await getResubCol();
    const statusMap: Record<string, string> = {
      approve: "approved",
      reject: "rejected",
      resubmit: "resubmitted",
      resolve: "resolved",
    };

    const update: Record<string, unknown> = {
      status: statusMap[action] || action,
      updatedAt: new Date(),
    };
    if (notes) update.notes = notes;
    if (action === "approve") update.approvedAt = new Date();
    if (action === "resubmit") update.resubmittedAt = new Date();
    if (action === "resolve") update.resolvedAt = new Date();

    await col.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
