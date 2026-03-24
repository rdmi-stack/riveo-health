/* ───────────────────────────────────────────────────────
   Digital Statements + Text-to-Pay API
   POST /api/statements — Generate & send digital statement
   GET /api/statements — List sent statements
   PATCH /api/statements — Update status (opened, paid, bounced)
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COL = "digital_statements";
async function col() { return (await getDb()).collection(COL); }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, orgId = "demo" } = body;

    const c = await col();

    // ── Generate statements for patients with balances ──
    if (action === "generate") {
      const { patients } = body;
      // patients: [{ patientId, name, email, phone, balance, bills: [{description, amount, dateOfService}] }]

      if (!Array.isArray(patients) || patients.length === 0) {
        return NextResponse.json({ error: "patients array required" }, { status: 400 });
      }

      const statements: any[] = [];
      for (const p of patients.slice(0, 50)) {
        const payToken = `PAY-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
        const payUrl = `/pay/${payToken}`;

        statements.push({
          orgId,
          patientId: p.patientId || `PAT-${Math.random().toString(36).slice(2, 8)}`,
          patientName: p.name || "Patient",
          email: p.email || null,
          phone: p.phone || null,
          balance: p.balance || 0,
          bills: p.bills || [],
          payToken,
          payUrl,
          channels: {
            sms: p.phone ? { status: "queued", message: `Hi ${(p.name || "").split(" ")[0]}, your balance of $${p.balance} is ready. Pay now: ${payUrl}` } : null,
            email: p.email ? { status: "queued", subject: `Your statement from Riveo Health — $${p.balance} due` } : null,
          },
          status: "sent",
          openedAt: null,
          paidAt: null,
          createdAt: new Date(),
        });
      }

      await c.insertMany(statements);

      return NextResponse.json({
        success: true,
        sent: statements.length,
        channels: {
          sms: statements.filter(s => s.channels.sms).length,
          email: statements.filter(s => s.channels.email).length,
        },
        totalBalance: statements.reduce((s, st) => s + st.balance, 0),
      });
    }

    // ── Send to a single patient ────────────────────────
    if (action === "send_single") {
      const { patientId, name, email, phone, balance, bills = [] } = body;
      const payToken = `PAY-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

      const doc = {
        orgId, patientId, patientName: name || "Patient",
        email, phone, balance: balance || 0, bills,
        payToken, payUrl: `/pay/${payToken}`,
        channels: {
          sms: phone ? { status: "sent", message: `Hi ${(name || "").split(" ")[0]}, your $${balance} statement is ready. Pay securely: /pay/${payToken}` } : null,
          email: email ? { status: "sent", subject: `Your statement — $${balance} due` } : null,
        },
        status: "sent", openedAt: null, paidAt: null, createdAt: new Date(),
      };

      const result = await c.insertOne(doc);
      return NextResponse.json({ success: true, id: result.insertedId.toString(), payUrl: doc.payUrl, payToken });
    }

    // ── Seed demo statements ────────────────────────────
    if (action === "seed_demo") {
      const demoPatients = [
        { patientId: "PAT-0012", name: "Sarah Johnson", email: "sarah@email.com", phone: "+15551234567", balance: 320, bills: [{ description: "Office Visit — Dr. Chen", amount: 320, dateOfService: "2026-02-15" }] },
        { patientId: "PAT-0034", name: "Michael Brown", email: "michael@email.com", phone: "+15559876543", balance: 1450, bills: [{ description: "MRI Knee", amount: 1200, dateOfService: "2026-01-28" }, { description: "Follow-up", amount: 250, dateOfService: "2026-02-10" }] },
        { patientId: "PAT-0056", name: "Emily Davis", email: "emily@email.com", phone: null, balance: 85, bills: [{ description: "Lab Work", amount: 85, dateOfService: "2026-03-01" }] },
        { patientId: "PAT-0078", name: "James Wilson", email: null, phone: "+15551112222", balance: 650, bills: [{ description: "X-Ray + Office Visit", amount: 650, dateOfService: "2026-02-20" }] },
        { patientId: "PAT-0091", name: "Lisa Martinez", email: "lisa@email.com", phone: "+15553334444", balance: 2100, bills: [{ description: "Surgery Follow-up", amount: 1800, dateOfService: "2026-01-15" }, { description: "Physical Therapy", amount: 300, dateOfService: "2026-02-01" }] },
        { patientId: "PAT-0103", name: "Robert Taylor", email: "robert@email.com", phone: "+15555556666", balance: 175, bills: [{ description: "Specialist Visit", amount: 175, dateOfService: "2026-03-05" }] },
      ];

      const stmts = demoPatients.map(p => {
        const payToken = `PAY-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
        return {
          orgId, ...p, payToken, payUrl: `/pay/${payToken}`,
          channels: {
            sms: p.phone ? { status: "sent", message: `Hi ${p.name.split(" ")[0]}, your $${p.balance} statement is ready.` } : null,
            email: p.email ? { status: "sent", subject: `Statement — $${p.balance} due` } : null,
          },
          status: Math.random() > 0.5 ? "opened" : "sent",
          openedAt: Math.random() > 0.5 ? new Date() : null,
          paidAt: null, createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000)),
        };
      });

      await c.deleteMany({ orgId });
      await c.insertMany(stmts);
      return NextResponse.json({ success: true, count: stmts.length });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Statements error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// ── List statements ────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const orgId = sp.get("org") || "demo";
    const status = sp.get("status");
    const c = await col();
    const filter: Record<string, unknown> = { orgId };
    if (status) filter.status = status;
    const items = await c.find(filter).sort({ createdAt: -1 }).limit(50).toArray();
    const totalSent = items.length;
    const totalOpened = items.filter((i: any) => i.openedAt).length;
    const totalPaid = items.filter((i: any) => i.paidAt).length;
    const totalBalance = items.reduce((s: number, i: any) => s + (i.paidAt ? 0 : i.balance || 0), 0);
    const totalCollected = items.filter((i: any) => i.paidAt).reduce((s: number, i: any) => s + (i.balance || 0), 0);

    return NextResponse.json({
      statements: items,
      stats: { totalSent, totalOpened, totalPaid, totalBalance, totalCollected, openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0 },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// ── Update status ──────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const c = await col();
    const update: Record<string, unknown> = { status, updatedAt: new Date() };
    if (status === "opened") update.openedAt = new Date();
    if (status === "paid") update.paidAt = new Date();
    await c.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
