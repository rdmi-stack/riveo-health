/* ───────────────────────────────────────────────────────
   GET /api/denials — List denials with filters
   PATCH /api/denials — Update denial status
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection, Collections } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const orgId = sp.get("org") || "demo";
    const status = sp.get("status");
    const priority = sp.get("priority");
    const payer = sp.get("payer");
    const page = parseInt(sp.get("page") || "1");
    const limit = Math.min(parseInt(sp.get("limit") || "50"), 100);
    const skip = (page - 1) * limit;

    const col = await getCollection(Collections.DENIALS);

    const filter: Record<string, unknown> = { orgId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (payer) filter.payer = payer;

    const [denials, total] = await Promise.all([
      col.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      col.countDocuments(filter),
    ]);

    return NextResponse.json({
      denials,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Denials GET error:", error);
    return NextResponse.json({ error: "Failed to fetch denials" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, assignedTo, notes } = body;

    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const col = await getCollection(Collections.DENIALS);
    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (status) update.status = status;
    if (assignedTo) update.assignedTo = assignedTo;
    if (notes) update.notes = notes;
    if (status === "resolved") update.resolvedAt = new Date();

    await col.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Denials PATCH error:", error);
    return NextResponse.json({ error: "Failed to update denial" }, { status: 500 });
  }
}
