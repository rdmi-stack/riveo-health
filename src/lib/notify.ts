/* ───────────────────────────────────────────────────────
   Notification Helper — Create notifications from anywhere
   ─────────────────────────────────────────────────────── */

import { getDb } from "./mongodb";

const COL = "notifications";

type Severity = "info" | "warning" | "error" | "success";
type NType = "denial" | "claim" | "payment" | "auth" | "system" | "compliance" | "prior_auth" | "underpayment" | "collection";

export async function createNotification(opts: {
  orgId: string;
  type: NType;
  title: string;
  message: string;
  severity?: Severity;
  link?: string;
  entityType?: string;
  entityId?: string;
}) {
  try {
    const db = await getDb();
    await db.collection(COL).insertOne({
      ...opts,
      severity: opts.severity || "info",
      read: false,
      dismissed: false,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Notification create error:", error);
  }
}

// ── Pre-built notification templates ───────────────────

export async function notifyNewDenial(orgId: string, claimId: string, payer: string, amount: number, denialCode: string) {
  await createNotification({
    orgId, type: "denial", severity: amount > 500 ? "error" : "warning",
    title: `Claim ${claimId} denied by ${payer}`,
    message: `$${amount.toLocaleString()} claim denied — ${denialCode}. Review and take action.`,
    link: "/dashboard/denials", entityType: "denial", entityId: claimId,
  });
}

export async function notifyUnderpayment(orgId: string, count: number, totalVariance: number) {
  await createNotification({
    orgId, type: "underpayment", severity: "warning",
    title: `${count} underpaid claims detected`,
    message: `$${totalVariance.toLocaleString()} in potential underpayments found. Review and file appeals.`,
    link: "/dashboard/underpayment",
  });
}

export async function notifyPriorAuthExpiring(orgId: string, patientId: string, procedure: string, daysLeft: number) {
  await createNotification({
    orgId, type: "prior_auth", severity: daysLeft <= 3 ? "error" : "warning",
    title: `Prior auth expiring in ${daysLeft} days`,
    message: `Authorization for ${procedure} (${patientId}) expires soon. Renew now to avoid denial.`,
    link: "/dashboard/prior-auth", entityType: "prior_auth", entityId: patientId,
  });
}

export async function notifyPaymentReceived(orgId: string, claimId: string, amount: number, payer: string) {
  await createNotification({
    orgId, type: "payment", severity: "success",
    title: `Payment received: $${amount.toLocaleString()}`,
    message: `${payer} paid claim ${claimId}.`,
    link: "/dashboard/claims", entityType: "claim", entityId: claimId,
  });
}

export async function notifyCollectionEscalation(orgId: string, patientId: string, balance: number, step: number) {
  await createNotification({
    orgId, type: "collection", severity: "info",
    title: `Collection step ${step} for ${patientId}`,
    message: `$${balance.toLocaleString()} balance advanced to step ${step}/7 in pre-collection workflow.`,
    link: "/dashboard/pre-collection", entityType: "patient", entityId: patientId,
  });
}

export async function notifyComplianceAlert(orgId: string, title: string, message: string) {
  await createNotification({ orgId, type: "compliance", severity: "error", title, message, link: "/dashboard/settings" });
}

export async function notifyLoginFromNewDevice(orgId: string, email: string, ip: string) {
  await createNotification({
    orgId, type: "auth", severity: "info",
    title: `New login from ${email}`,
    message: `Logged in from IP ${ip}. If this wasn't you, change your password immediately.`,
    link: "/dashboard/settings",
  });
}
