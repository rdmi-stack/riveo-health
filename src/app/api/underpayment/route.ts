/* ───────────────────────────────────────────────────────
   Contract Underpayment Detection API
   POST /api/underpayment — Scan claims for underpayments
   GET /api/underpayment — List detected underpayments
   PATCH /api/underpayment — Update status (appealed/resolved)
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { chatCompletion, SYSTEM_PROMPTS } from "@/lib/openai";
import { ObjectId } from "mongodb";

const COL = "underpayments";

async function col() { return (await getDb()).collection(COL); }
async function claimsCol() { return (await getDb()).collection("claims"); }

// ── Scan claims for underpayments ──────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orgId = body.orgId || "demo";

    // Get paid claims with amount discrepancies
    const claims = await (await claimsCol()).find({
      orgId,
      status: { $in: ["paid", "partial"] },
      billedAmount: { $gt: 0 },
    }).limit(100).toArray();

    if (claims.length === 0) {
      return NextResponse.json({ success: true, found: 0, message: "No paid claims to analyze" });
    }

    // Find claims where paid < expected (billed * expected rate)
    const underpaid: any[] = [];
    for (const c of claims) {
      const expectedRate = getExpectedRate(c.payer, c.cptCode);
      const expectedPayment = Math.round(c.billedAmount * expectedRate);
      const variance = expectedPayment - c.paidAmount;
      const variancePct = c.paidAmount > 0 ? variance / expectedPayment : 1;

      if (variance > 10 && variancePct > 0.05) { // More than $10 and 5% underpaid
        underpaid.push({
          orgId,
          claimId: c.claimId,
          patientId: c.patientId,
          payer: c.payer,
          cptCode: c.cptCode,
          billedAmount: c.billedAmount,
          expectedPayment,
          actualPayment: c.paidAmount,
          variance,
          variancePct: Math.round(variancePct * 100),
          status: "detected",
          dateOfService: c.dateOfService,
          createdAt: new Date(),
        });
      }
    }

    if (underpaid.length > 0) {
      // Clear old detections for this org and insert new
      const c = await col();
      await c.deleteMany({ orgId, status: "detected" });
      await c.insertMany(underpaid);

      // Get AI analysis on the top underpayments
      const topUnderpaid = underpaid.sort((a, b) => b.variance - a.variance).slice(0, 10);
      const summary = topUnderpaid.map(u =>
        `Claim ${u.claimId}: Payer=${u.payer}, CPT=${u.cptCode}, Billed=$${u.billedAmount}, Expected=$${u.expectedPayment}, Paid=$${u.actualPayment}, Variance=$${u.variance}`
      ).join("\n");

      const aiAnalysis = await chatCompletion(
        "You are a healthcare contract compliance analyst. Analyze these underpaid claims and provide actionable recovery strategies.",
        `These claims appear to be underpaid vs expected contracted rates:\n\n${summary}\n\nReturn JSON:\n{\n  "totalUnderpayment": number,\n  "topIssues": [{"issue": string, "affectedClaims": number, "totalVariance": number, "action": string}],\n  "appealStrategy": string,\n  "estimatedRecovery": number,\n  "priorityActions": [string]\n}`,
        { temperature: 0.2, maxTokens: 1500, responseFormat: "json" }
      );

      let analysis;
      try { analysis = JSON.parse(aiAnalysis); } catch { analysis = null; }

      return NextResponse.json({
        success: true,
        found: underpaid.length,
        totalVariance: underpaid.reduce((s, u) => s + u.variance, 0),
        analysis,
      });
    }

    return NextResponse.json({ success: true, found: 0, message: "No underpayments detected" });
  } catch (error) {
    console.error("Underpayment scan error:", error);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}

// ── List underpayments ─────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const orgId = sp.get("org") || "demo";
    const status = sp.get("status");
    const c = await col();
    const filter: Record<string, unknown> = { orgId };
    if (status) filter.status = status;
    const [items, total] = await Promise.all([
      c.find(filter).sort({ variance: -1 }).limit(100).toArray(),
      c.countDocuments(filter),
    ]);
    const totalVariance = items.reduce((s: number, i: any) => s + (i.variance || 0), 0);
    return NextResponse.json({ underpayments: items, total, totalVariance });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// ── Update status ──────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { id, status, notes } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const c = await col();
    const update: Record<string, unknown> = { status, updatedAt: new Date() };
    if (notes) update.notes = notes;
    if (status === "appealed") update.appealedAt = new Date();
    if (status === "recovered") update.recoveredAt = new Date();
    await c.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ── Expected payment rates by payer/CPT ────────────────
function getExpectedRate(payer: string, cptCode: string): number {
  const rates: Record<string, number> = {
    "Medicare": 0.78, "Medicaid": 0.62,
    "Blue Cross Blue Shield": 0.82, "UnitedHealthcare": 0.80,
    "Aetna": 0.81, "Cigna": 0.79, "Humana": 0.77,
  };
  const base = rates[payer] || 0.78;
  // Higher-value procedures have tighter rates
  if (cptCode?.startsWith("992")) return base + 0.05; // E/M visits
  if (cptCode?.startsWith("7")) return base - 0.05; // Imaging
  return base;
}
