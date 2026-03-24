/* ───────────────────────────────────────────────────────
   POST /api/claims/import — Bulk import claims from CSV
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId = "demo", claims } = body;

    if (!Array.isArray(claims) || claims.length === 0) {
      return NextResponse.json({ error: "claims array is required" }, { status: 400 });
    }

    const claimsCol = await getCollection(Collections.CLAIMS);
    const denialsCol = await getCollection(Collections.DENIALS);

    const now = new Date();
    const claimDocs = claims.map((c: any, i: number) => ({
      orgId,
      claimId: c.claimId || `IMP-${Date.now()}-${i}`,
      patientId: c.patientId || "",
      dateOfService: c.dateOfService ? new Date(c.dateOfService) : now,
      payer: c.payer || "Unknown",
      cptCode: c.cptCode || "",
      icdCode: c.icdCode || "",
      billedAmount: parseFloat(c.billedAmount) || 0,
      allowedAmount: parseFloat(c.allowedAmount) || 0,
      paidAmount: parseFloat(c.paidAmount) || 0,
      status: c.status || "pending",
      denialCode: c.denialCode || null,
      denialReason: c.denialReason || null,
      provider: c.provider || "",
      submittedAt: c.dateSubmitted ? new Date(c.dateSubmitted) : now,
      importedAt: now,
      createdAt: now,
    }));

    await claimsCol.insertMany(claimDocs);

    // Auto-create denial records for denied claims
    const deniedClaims = claimDocs.filter((c: any) => c.status === "denied");
    if (deniedClaims.length > 0) {
      const denialDocs = deniedClaims.map((c: any) => ({
        orgId,
        claimId: c.claimId,
        patientId: c.patientId,
        payer: c.payer,
        billedAmount: c.billedAmount,
        denialCode: c.denialCode || "Unknown",
        denialReason: c.denialReason || "Review required",
        priority: c.billedAmount > 500 ? "high" : c.billedAmount > 200 ? "medium" : "low",
        status: "new",
        dateOfService: c.dateOfService,
        submittedAt: c.submittedAt,
        createdAt: now,
      }));
      await denialsCol.insertMany(denialDocs);
    }

    return NextResponse.json({
      success: true,
      imported: claimDocs.length,
      denialsCreated: deniedClaims.length,
    }, { status: 201 });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
