/* ERA/Remittance Auto-Posting — POST: process ERA, GET: list posted */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { chatCompletion } from "@/lib/openai";

const COL = "remittance_postings";
async function col() { return (await getDb()).collection(COL); }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, orgId = "demo" } = body;

    if (action === "process") {
      const { eraData } = body;
      // eraData: [{ claimId, payer, billedAmount, allowedAmount, paidAmount, adjustments, remarkCodes }]
      if (!Array.isArray(eraData) || !eraData.length) return NextResponse.json({ error: "eraData required" }, { status: 400 });

      const postings: any[] = [];
      const exceptions: any[] = [];

      for (const era of eraData.slice(0, 50)) {
        const variance = Math.abs((era.allowedAmount || 0) - (era.paidAmount || 0));
        const isException = variance > 5 || era.paidAmount === 0;

        const posting = {
          orgId, claimId: era.claimId, payer: era.payer || "Unknown",
          billedAmount: era.billedAmount || 0, allowedAmount: era.allowedAmount || 0,
          paidAmount: era.paidAmount || 0, adjustmentAmount: (era.billedAmount || 0) - (era.paidAmount || 0),
          remarkCodes: era.remarkCodes || [], adjustments: era.adjustments || [],
          status: isException ? "exception" : "posted",
          exceptionReason: isException ? (era.paidAmount === 0 ? "Zero payment" : `Variance: $${variance.toFixed(2)}`) : null,
          postedAt: isException ? null : new Date(), createdAt: new Date(),
        };
        postings.push(posting);
        if (isException) exceptions.push(posting);
      }

      const c = await col();
      await c.insertMany(postings);

      return NextResponse.json({
        success: true, processed: postings.length,
        autoPosted: postings.length - exceptions.length,
        exceptions: exceptions.length,
        totalPosted: postings.filter(p => p.status === "posted").reduce((s, p) => s + p.paidAmount, 0),
        totalExceptions: exceptions.reduce((s, e) => s + e.billedAmount, 0),
      });
    }

    if (action === "seed_demo") {
      const payers = ["Medicare", "BCBS", "UnitedHealthcare", "Aetna", "Cigna"];
      const demos = Array.from({ length: 30 }, (_, i) => {
        const billed = 100 + Math.floor(Math.random() * 800);
        const allowed = Math.round(billed * (0.6 + Math.random() * 0.3));
        const isException = Math.random() < 0.15;
        const paid = isException ? (Math.random() < 0.5 ? 0 : Math.round(allowed * 0.5)) : allowed;
        return {
          orgId, claimId: `CLM-${String(i + 1).padStart(5, "0")}`,
          payer: payers[Math.floor(Math.random() * payers.length)],
          billedAmount: billed, allowedAmount: allowed, paidAmount: paid,
          adjustmentAmount: billed - paid, remarkCodes: isException ? ["CO-45", "PR-1"] : [],
          status: isException ? "exception" : "posted",
          exceptionReason: isException ? (paid === 0 ? "Zero payment" : "Underpayment variance") : null,
          postedAt: isException ? null : new Date(), createdAt: new Date(),
        };
      });
      const c = await col();
      await c.deleteMany({ orgId });
      await c.insertMany(demos);
      return NextResponse.json({ success: true, count: demos.length });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Remittance error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const orgId = sp.get("org") || "demo";
    const status = sp.get("status");
    const c = await col();
    const filter: Record<string, unknown> = { orgId };
    if (status) filter.status = status;
    const items = await c.find(filter).sort({ createdAt: -1 }).limit(50).toArray();
    const posted = items.filter((i: any) => i.status === "posted");
    const exceptions = items.filter((i: any) => i.status === "exception");
    return NextResponse.json({
      postings: items,
      stats: {
        total: items.length, autoPosted: posted.length, exceptions: exceptions.length,
        totalPosted: posted.reduce((s: number, p: any) => s + (p.paidAmount || 0), 0),
        totalExceptions: exceptions.reduce((s: number, e: any) => s + (e.billedAmount || 0), 0),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
