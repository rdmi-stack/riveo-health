/* ───────────────────────────────────────────────────────
   HIPAA Audit Logger — Tracks every user action
   Every read, write, update, delete is logged with:
   who, what, when, where, from which IP
   ─────────────────────────────────────────────────────── */

import { getCollection, Collections } from "./mongodb";
import { NextRequest } from "next/server";

export interface AuditEntry {
  userId: string;
  orgId: string;
  userEmail: string;
  action: "create" | "read" | "update" | "delete" | "login" | "logout" | "export" | "import" | "ai_query" | "settings_change";
  entityType: "claim" | "denial" | "patient" | "user" | "organization" | "report" | "audit" | "auth" | "settings";
  entityId?: string;
  description: string;
  details?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// ── Log an audit entry ─────────────────────────────────

export async function logAudit(entry: Omit<AuditEntry, "timestamp">) {
  try {
    const col = await getCollection(Collections.AUDIT_LOG);
    await col.insertOne({
      ...entry,
      timestamp: new Date(),
    });
  } catch (error) {
    // Never let audit logging failure break the main flow
    console.error("Audit log error:", error);
  }
}

// ── Helper: extract IP and user agent from request ─────

export function getRequestMeta(req: NextRequest) {
  return {
    ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
    userAgent: req.headers.get("user-agent") || "unknown",
  };
}

// ── Convenience loggers ────────────────────────────────

export async function logLogin(userId: string, orgId: string, email: string, req: NextRequest, success: boolean) {
  const meta = getRequestMeta(req);
  await logAudit({
    userId,
    orgId,
    userEmail: email,
    action: "login",
    entityType: "auth",
    description: success ? `User ${email} logged in successfully` : `Failed login attempt for ${email}`,
    details: { success },
    ...meta,
  });
}

export async function logClaimAction(
  action: AuditEntry["action"],
  userId: string, orgId: string, email: string,
  claimId: string, description: string, req: NextRequest,
  details?: Record<string, unknown>
) {
  const meta = getRequestMeta(req);
  await logAudit({
    userId, orgId, userEmail: email,
    action,
    entityType: "claim",
    entityId: claimId,
    description,
    details,
    ...meta,
  });
}

export async function logDenialAction(
  action: AuditEntry["action"],
  userId: string, orgId: string, email: string,
  denialId: string, description: string, req: NextRequest,
  details?: Record<string, unknown>
) {
  const meta = getRequestMeta(req);
  await logAudit({
    userId, orgId, userEmail: email,
    action,
    entityType: "denial",
    entityId: denialId,
    description,
    details,
    ...meta,
  });
}

export async function logAIQuery(
  userId: string, orgId: string, email: string,
  entityId: string, queryType: string, req: NextRequest
) {
  const meta = getRequestMeta(req);
  await logAudit({
    userId, orgId, userEmail: email,
    action: "ai_query",
    entityType: "denial",
    entityId,
    description: `AI ${queryType} analysis requested for ${entityId}`,
    ...meta,
  });
}

export async function logDataExport(
  userId: string, orgId: string, email: string,
  exportType: string, recordCount: number, req: NextRequest
) {
  const meta = getRequestMeta(req);
  await logAudit({
    userId, orgId, userEmail: email,
    action: "export",
    entityType: "report",
    description: `Exported ${recordCount} ${exportType} records`,
    details: { exportType, recordCount },
    ...meta,
  });
}

export async function logDataImport(
  userId: string, orgId: string, email: string,
  importCount: number, denialsCreated: number, req: NextRequest
) {
  const meta = getRequestMeta(req);
  await logAudit({
    userId, orgId, userEmail: email,
    action: "import",
    entityType: "claim",
    description: `Imported ${importCount} claims, ${denialsCreated} denials auto-created`,
    details: { importCount, denialsCreated },
    ...meta,
  });
}
