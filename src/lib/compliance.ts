/* ───────────────────────────────────────────────────────
   HIPAA + DPDP (India) Compliance Engine
   Handles: session policy, password policy, data retention,
   consent tracking, breach notification, data access logging
   ─────────────────────────────────────────────────────── */

import { getDb } from "./mongodb";

// ── HIPAA Session Policy ───────────────────────────────
export const SESSION_POLICY = {
  maxSessionDuration: 8 * 60 * 60 * 1000,    // 8 hours max session
  inactivityTimeout: 15 * 60 * 1000,          // 15 min inactivity logout (HIPAA requirement)
  tokenExpiry: "8h",                           // JWT expiry matches session
  maxConcurrentSessions: 3,                    // Max devices per user
};

// ── Password Policy (HIPAA §164.312(d)) ────────────────
export const PASSWORD_POLICY = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
  maxAge: 90,                                  // Days before password change required
  preventReuse: 6,                             // Can't reuse last 6 passwords
  lockoutAttempts: 5,                          // Lock after 5 failed attempts
  lockoutDuration: 30 * 60 * 1000,            // 30 min lockout
};

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < PASSWORD_POLICY.minLength) errors.push(`Minimum ${PASSWORD_POLICY.minLength} characters`);
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) errors.push("At least one lowercase letter");
  if (PASSWORD_POLICY.requireNumber && !/[0-9]/.test(password)) errors.push("At least one number");
  if (PASSWORD_POLICY.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("At least one special character");
  return { valid: errors.length === 0, errors };
}

// ── Data Retention Policy ──────────────────────────────
export const RETENTION_POLICY = {
  claims: 7 * 365,           // 7 years (HIPAA minimum for medical billing records)
  auditLogs: 6 * 365,        // 6 years (HIPAA requirement)
  chatConversations: 3 * 365, // 3 years
  sessionLogs: 365,           // 1 year
  deletedPatientData: 30,     // 30 days grace period before permanent delete
};

// ── Data Access Log (PHI Access Tracking) ──────────────
export async function logPHIAccess(entry: {
  userId: string;
  orgId: string;
  userEmail: string;
  action: "view" | "create" | "update" | "delete" | "export" | "print";
  dataType: "claim" | "patient" | "denial" | "clinical_note" | "payment" | "report";
  recordId: string;
  patientId?: string;
  ipAddress: string;
  userAgent: string;
  reason?: string;
}) {
  try {
    const db = await getDb();
    await db.collection("phi_access_log").insertOne({
      ...entry,
      timestamp: new Date(),
      retainUntil: new Date(Date.now() + RETENTION_POLICY.auditLogs * 24 * 60 * 60 * 1000),
    });
  } catch (error) {
    console.error("PHI access log error:", error);
  }
}

// ── Consent Management (DPDP Act Mandatory) ────────────
export interface ConsentRecord {
  patientId: string;
  orgId: string;
  consentType: "data_processing" | "data_sharing" | "ai_analysis" | "communication" | "marketing";
  granted: boolean;
  grantedAt?: Date;
  revokedAt?: Date;
  method: "written" | "electronic" | "verbal";
  version: string;
  ipAddress?: string;
}

export async function recordConsent(consent: ConsentRecord) {
  const db = await getDb();
  await db.collection("consent_records").insertOne({
    ...consent,
    timestamp: new Date(),
  });
}

export async function checkConsent(patientId: string, orgId: string, consentType: string): Promise<boolean> {
  const db = await getDb();
  const latest = await db.collection("consent_records").findOne(
    { patientId, orgId, consentType },
    { sort: { timestamp: -1 } }
  );
  return latest?.granted === true;
}

export async function revokeConsent(patientId: string, orgId: string, consentType: string) {
  const db = await getDb();
  await db.collection("consent_records").insertOne({
    patientId, orgId, consentType,
    granted: false,
    revokedAt: new Date(),
    method: "electronic",
    version: "1.0",
    timestamp: new Date(),
  });
}

// ── Breach Notification (HIPAA + DPDP Mandatory) ───────
export interface BreachRecord {
  orgId: string;
  reportedBy: string;
  breachType: "unauthorized_access" | "data_loss" | "system_compromise" | "unauthorized_disclosure" | "other";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  affectedRecords: number;
  affectedPatients: number;
  discoveredAt: Date;
  containedAt?: Date;
  status: "reported" | "investigating" | "contained" | "notified" | "resolved";
}

export async function reportBreach(breach: BreachRecord) {
  const db = await getDb();
  const result = await db.collection("breach_records").insertOne({
    ...breach,
    reportedAt: new Date(),
    // HIPAA: Must notify HHS within 60 days for breaches affecting 500+ individuals
    // DPDP: Must notify DPA within 72 hours
    hipaaDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    dpdpDeadline: new Date(Date.now() + 72 * 60 * 60 * 1000),
  });
  return result.insertedId.toString();
}

// ── Right to Erasure (DPDP Act Mandatory) ──────────────
export async function erasePatientData(patientId: string, orgId: string, requestedBy: string) {
  const db = await getDb();
  const now = new Date();
  const purgeDate = new Date(now.getTime() + RETENTION_POLICY.deletedPatientData * 24 * 60 * 60 * 1000);

  // Mark data for deletion (soft delete with grace period)
  const collections = ["claims", "denials", "chat_conversations", "prior_auths", "resubmissions"];
  const results: Record<string, number> = {};

  for (const col of collections) {
    const res = await db.collection(col).updateMany(
      { orgId, patientId },
      { $set: { _deleted: true, _deletedAt: now, _purgeAfter: purgeDate, _deletedBy: requestedBy } }
    );
    results[col] = res.modifiedCount;
  }

  // Log the erasure request
  await db.collection("erasure_requests").insertOne({
    patientId, orgId, requestedBy,
    status: "scheduled",
    scheduledPurge: purgeDate,
    affectedRecords: results,
    requestedAt: now,
  });

  // Log PHI access
  await logPHIAccess({
    userId: requestedBy, orgId, userEmail: "",
    action: "delete", dataType: "patient", recordId: patientId,
    patientId, ipAddress: "system", userAgent: "erasure_engine",
    reason: "Right to erasure request (DPDP Act)",
  });

  return { success: true, scheduledPurge: purgeDate, affectedRecords: results };
}

// ── Data Export / Portability (DPDP Act Mandatory) ─────
export async function exportPatientData(patientId: string, orgId: string) {
  const db = await getDb();
  const data: Record<string, any[]> = {};

  const collections = ["claims", "denials", "chat_conversations", "consent_records"];
  for (const col of collections) {
    data[col] = await db.collection(col).find(
      { orgId, patientId, _deleted: { $ne: true } }
    ).toArray();
  }

  return {
    exportDate: new Date().toISOString(),
    patientId,
    format: "JSON",
    data,
    recordCounts: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.length])),
  };
}
