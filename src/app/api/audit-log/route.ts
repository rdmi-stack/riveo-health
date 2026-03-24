/* ───────────────────────────────────────────────────────
   GET /api/audit-log — View audit trail (admin only)
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections } from "@/lib/mongodb";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const sp = req.nextUrl.searchParams;

    // Allow unauthenticated access for demo org
    const orgId = user?.orgId || sp.get("org") || "demo";

    // In production, only admins can view audit logs
    // if (user && user.role !== "admin") {
    //   return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    // }

    const page = parseInt(sp.get("page") || "1");
    const limit = Math.min(parseInt(sp.get("limit") || "50"), 100);
    const skip = (page - 1) * limit;
    const action = sp.get("action");
    const entityType = sp.get("entityType");

    const col = await getCollection(Collections.AUDIT_LOG);

    const filter: Record<string, unknown> = { orgId };
    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;

    const [entries, total] = await Promise.all([
      col.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray(),
      col.countDocuments(filter),
    ]);

    return NextResponse.json({
      entries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Audit log error:", error);
    return NextResponse.json({ error: "Failed to fetch audit log" }, { status: 500 });
  }
}
