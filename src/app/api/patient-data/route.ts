/* ───────────────────────────────────────────────────────
   Patient Data API — Erasure + Export (DPDP + HIPAA)
   DELETE /api/patient-data — Right to erasure
   GET /api/patient-data — Export patient data (portability)
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { erasePatientData, exportPatientData, logPHIAccess } from "@/lib/compliance";

// ── Right to Erasure (DPDP Act Section 12) ─────────────
export async function DELETE(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const patientId = sp.get("patientId");
    const orgId = sp.get("org") || "demo";
    const requestedBy = sp.get("requestedBy") || "admin";

    if (!patientId) {
      return NextResponse.json({ error: "patientId required" }, { status: 400 });
    }

    const result = await erasePatientData(patientId, orgId, requestedBy);

    return NextResponse.json({
      success: true,
      message: `Patient ${patientId} data scheduled for erasure`,
      scheduledPurge: result.scheduledPurge,
      affectedRecords: result.affectedRecords,
      note: "Data will be soft-deleted immediately and permanently purged after 30-day grace period per retention policy.",
    });
  } catch (error) {
    console.error("Erasure error:", error);
    return NextResponse.json({ error: "Erasure failed" }, { status: 500 });
  }
}

// ── Data Export / Portability (DPDP Act Section 13) ────
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const patientId = sp.get("patientId");
    const orgId = sp.get("org") || "demo";

    if (!patientId) {
      return NextResponse.json({ error: "patientId required" }, { status: 400 });
    }

    // Log PHI access
    await logPHIAccess({
      userId: "api", orgId, userEmail: "",
      action: "export", dataType: "patient", recordId: patientId,
      patientId, ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
      reason: "Patient data export request (DPDP Act data portability)",
    });

    const data = await exportPatientData(patientId, orgId);

    return NextResponse.json({
      success: true,
      export: data,
      note: "This export contains all patient data held by this organization. Provided under DPDP Act Section 13 (Right to Data Portability).",
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
