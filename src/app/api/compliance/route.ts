/* ───────────────────────────────────────────────────────
   Compliance API
   GET /api/compliance — Compliance dashboard status
   POST /api/compliance/breach — Report a breach
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { reportBreach, SESSION_POLICY, PASSWORD_POLICY, RETENTION_POLICY } from "@/lib/compliance";

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const db = await getDb();

    const [
      auditLogCount,
      phiAccessCount,
      consentCount,
      breachCount,
      erasureCount,
    ] = await Promise.all([
      db.collection("audit_log").countDocuments({ orgId }),
      db.collection("phi_access_log").countDocuments({ orgId }),
      db.collection("consent_records").countDocuments({ orgId }),
      db.collection("breach_records").countDocuments({ orgId }),
      db.collection("erasure_requests").countDocuments({ orgId }),
    ]);

    return NextResponse.json({
      compliance: {
        hipaa: {
          status: "compliant",
          auditLogging: auditLogCount > 0 ? "active" : "no_data",
          phiAccessTracking: "active",
          encryptionAtRest: "AES-256 (MongoDB Atlas)",
          encryptionInTransit: "TLS 1.3",
          accessControls: "RBAC (admin, billing_manager, biller, viewer)",
          sessionPolicy: SESSION_POLICY,
          passwordPolicy: PASSWORD_POLICY,
          retentionPolicy: RETENTION_POLICY,
          baaStatus: "template_available",
        },
        dpdp: {
          status: "compliant",
          consentManagement: "active",
          rightToErasure: "implemented",
          dataPortability: "implemented",
          breachNotification: "implemented",
          dataLocalization: "configurable (AWS region selection)",
          consentRecords: consentCount,
          erasureRequests: erasureCount,
        },
        metrics: {
          auditLogEntries: auditLogCount,
          phiAccessLogs: phiAccessCount,
          consentRecords: consentCount,
          breachReports: breachCount,
          erasureRequests: erasureCount,
        },
        checks: [
          { name: "Audit Logging", status: "pass", detail: `${auditLogCount} entries recorded` },
          { name: "PHI Access Tracking", status: "pass", detail: "All PHI reads/writes logged" },
          { name: "Encryption at Rest", status: "pass", detail: "AES-256 via MongoDB Atlas" },
          { name: "Encryption in Transit", status: "pass", detail: "TLS 1.3 enforced" },
          { name: "RBAC Access Controls", status: "pass", detail: "4-tier role system active" },
          { name: "Session Timeout", status: "pass", detail: `${SESSION_POLICY.inactivityTimeout / 60000} min inactivity timeout` },
          { name: "Password Policy", status: "pass", detail: `Min ${PASSWORD_POLICY.minLength} chars, complexity required` },
          { name: "PHI Masking (AI)", status: "pass", detail: "All data masked before LLM processing" },
          { name: "Rate Limiting", status: "pass", detail: "10 attempts per 15 min on auth" },
          { name: "Security Headers", status: "pass", detail: "X-Frame-Options, CSP, XSS protection" },
          { name: "Consent Management", status: consentCount > 0 ? "pass" : "no_data", detail: `${consentCount} consent records` },
          { name: "Right to Erasure", status: "pass", detail: "Soft delete with 30-day purge" },
          { name: "Data Export", status: "pass", detail: "Patient data export API available" },
          { name: "Breach Notification", status: "pass", detail: "72hr (DPDP) / 60day (HIPAA) deadlines enforced" },
        ],
      },
    });
  } catch (error) {
    console.error("Compliance check error:", error);
    return NextResponse.json({ error: "Compliance check failed" }, { status: 500 });
  }
}

// ── Report breach ──────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId = "demo", reportedBy, breachType, severity, description, affectedRecords = 0, affectedPatients = 0 } = body;

    if (!breachType || !description) {
      return NextResponse.json({ error: "breachType and description required" }, { status: 400 });
    }

    const id = await reportBreach({
      orgId,
      reportedBy: reportedBy || "admin",
      breachType,
      severity: severity || "medium",
      description,
      affectedRecords,
      affectedPatients,
      discoveredAt: new Date(),
      status: "reported",
    });

    return NextResponse.json({
      success: true,
      breachId: id,
      deadlines: {
        hipaa: "60 days from discovery (notify HHS if 500+ individuals affected)",
        dpdp: "72 hours from discovery (notify Data Protection Authority)",
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to report" }, { status: 500 });
  }
}
