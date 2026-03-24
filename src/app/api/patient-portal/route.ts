/* ───────────────────────────────────────────────────────
   Patient Portal API
   GET /api/patient-portal — Get patient bills, balance, payments
   POST /api/patient-portal — Make payment or set up plan
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const COL_BILLS = "patient_bills";
const COL_PAYMENTS = "patient_payments";
const COL_MESSAGES = "patient_messages";

// ── Get patient data ───────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const patientId = sp.get("patientId") || "PAT-DEMO";
    const section = sp.get("section") || "overview";
    const orgId = sp.get("org") || "demo";
    const db = await getDb();

    if (section === "overview") {
      const bills = await db.collection(COL_BILLS).find({ orgId, patientId }).sort({ createdAt: -1 }).limit(20).toArray();
      const payments = await db.collection(COL_PAYMENTS).find({ orgId, patientId }).sort({ createdAt: -1 }).limit(10).toArray();
      const totalBalance = bills.reduce((s: number, b: any) => s + (b.balance || 0), 0);
      const totalPaid = payments.reduce((s: number, p: any) => s + (p.amount || 0), 0);

      return NextResponse.json({
        patientId,
        totalBalance,
        totalPaid,
        billCount: bills.length,
        bills,
        payments,
        paymentPlan: bills.find((b: any) => b.paymentPlan?.active) || null,
      });
    }

    if (section === "messages") {
      const messages = await db.collection(COL_MESSAGES).find({ orgId, patientId }).sort({ createdAt: -1 }).limit(30).toArray();
      return NextResponse.json({ messages });
    }

    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  } catch (error) {
    console.error("Patient portal GET error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// ── Make payment or create plan ────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, patientId = "PAT-DEMO", orgId = "demo" } = body;
    const db = await getDb();

    if (action === "pay") {
      const { billId, amount, method = "card" } = body;
      if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

      await db.collection(COL_PAYMENTS).insertOne({
        orgId, patientId, billId, amount, method,
        status: "completed",
        confirmationNumber: `PAY-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date(),
      });

      // Update bill balance
      if (billId) {
        await db.collection(COL_BILLS).updateOne(
          { _id: (await import("mongodb")).ObjectId.createFromHexString(billId) },
          { $inc: { balance: -amount }, $set: { updatedAt: new Date() } }
        );
      }

      return NextResponse.json({ success: true, message: "Payment processed successfully" });
    }

    if (action === "setup_plan") {
      const { billId, months, monthlyAmount } = body;
      if (!months || !monthlyAmount) return NextResponse.json({ error: "months and monthlyAmount required" }, { status: 400 });

      await db.collection(COL_BILLS).updateOne(
        { _id: (await import("mongodb")).ObjectId.createFromHexString(billId) },
        { $set: { paymentPlan: { active: true, months, monthlyAmount, startDate: new Date(), nextPayment: new Date(Date.now() + 30 * 86400000) }, updatedAt: new Date() } }
      );

      return NextResponse.json({ success: true, message: `Payment plan set: ${months} payments of $${monthlyAmount}/month` });
    }

    if (action === "message") {
      const { message } = body;
      if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

      await db.collection(COL_MESSAGES).insertOne({
        orgId, patientId, from: "patient", message, read: false, createdAt: new Date(),
      });

      return NextResponse.json({ success: true, message: "Message sent to billing department" });
    }

    if (action === "seed_demo") {
      // Create demo bills for testing
      const bills = [
        { orgId, patientId, description: "Office Visit — Dr. Sarah Chen", dateOfService: "2026-02-15", cptCode: "99214", totalCharge: 320, insurancePaid: 250, balance: 70, status: "due", createdAt: new Date(Date.now() - 20 * 86400000) },
        { orgId, patientId, description: "Lab Work — Comprehensive Metabolic Panel", dateOfService: "2026-02-15", cptCode: "80053", totalCharge: 180, insurancePaid: 140, balance: 40, status: "due", createdAt: new Date(Date.now() - 20 * 86400000) },
        { orgId, patientId, description: "MRI Knee — Right", dateOfService: "2026-01-28", cptCode: "73721", totalCharge: 1850, insurancePaid: 1400, balance: 450, status: "due", createdAt: new Date(Date.now() - 40 * 86400000) },
        { orgId, patientId, description: "Follow-up Visit — Dr. James Wilson", dateOfService: "2026-03-01", cptCode: "99213", totalCharge: 180, insurancePaid: 150, balance: 30, status: "due", createdAt: new Date(Date.now() - 10 * 86400000) },
        { orgId, patientId, description: "X-Ray Chest — 2 Views", dateOfService: "2025-12-10", cptCode: "71046", totalCharge: 120, insurancePaid: 120, balance: 0, status: "paid", createdAt: new Date(Date.now() - 90 * 86400000) },
      ];
      await db.collection(COL_BILLS).deleteMany({ orgId, patientId });
      await db.collection(COL_BILLS).insertMany(bills);
      return NextResponse.json({ success: true, bills: bills.length });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Patient portal POST error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
