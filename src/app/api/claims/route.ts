/* ───────────────────────────────────────────────────────
   GET /api/claims — List claims with filters, search, pagination
   POST /api/claims — Create a new claim
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const orgId = sp.get("org") || "demo";
    const status = sp.get("status");
    const payer = sp.get("payer");
    const search = sp.get("search");
    const sort = sp.get("sort") || "submittedAt";
    const order = sp.get("order") === "asc" ? 1 : -1;
    const page = parseInt(sp.get("page") || "1");
    const limit = Math.min(parseInt(sp.get("limit") || "50"), 100);
    const skip = (page - 1) * limit;

    const col = await getCollection(Collections.CLAIMS);

    const filter: Record<string, unknown> = { orgId };
    if (status) filter.status = status;
    if (payer) filter.payer = payer;
    if (search) {
      filter.$or = [
        { claimId: { $regex: search, $options: "i" } },
        { patientId: { $regex: search, $options: "i" } },
        { provider: { $regex: search, $options: "i" } },
        { cptCode: { $regex: search, $options: "i" } },
      ];
    }

    const [claims, total] = await Promise.all([
      col.find(filter).sort({ [sort]: order }).skip(skip).limit(limit).toArray(),
      col.countDocuments(filter),
    ]);

    return NextResponse.json({
      claims,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Claims GET error:", error);
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const col = await getCollection(Collections.CLAIMS);

    const doc = {
      ...body,
      orgId: body.orgId || "demo",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(doc);
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Claims POST error:", error);
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 });
  }
}
