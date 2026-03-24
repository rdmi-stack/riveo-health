/* ───────────────────────────────────────────────────────
   Notifications API
   GET — List notifications for user/org
   POST — Create notification
   PATCH — Mark as read / dismiss
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COL = "notifications";
async function col() { return (await getDb()).collection(COL); }

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const orgId = sp.get("org") || "demo";
    const unreadOnly = sp.get("unread") === "true";
    const limit = Math.min(parseInt(sp.get("limit") || "30"), 100);

    const c = await col();
    const filter: Record<string, unknown> = { orgId };
    if (unreadOnly) filter.read = false;

    const [items, unreadCount] = await Promise.all([
      c.find(filter).sort({ createdAt: -1 }).limit(limit).toArray(),
      c.countDocuments({ orgId, read: false }),
    ]);

    return NextResponse.json({ notifications: items, unreadCount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId = "demo", type, title, message, severity = "info", link, entityType, entityId } = body;

    if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

    const c = await col();
    const doc = {
      orgId,
      type: type || "system",
      title,
      message: message || "",
      severity,
      link: link || null,
      entityType: entityType || null,
      entityId: entityId || null,
      read: false,
      dismissed: false,
      createdAt: new Date(),
    };

    const result = await c.insertOne(doc);
    return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, orgId } = body;

    const c = await col();

    if (action === "read" && id) {
      await c.updateOne({ _id: new ObjectId(id) }, { $set: { read: true, readAt: new Date() } });
    } else if (action === "read_all" && orgId) {
      await c.updateMany({ orgId, read: false }, { $set: { read: true, readAt: new Date() } });
    } else if (action === "dismiss" && id) {
      await c.updateOne({ _id: new ObjectId(id) }, { $set: { dismissed: true, dismissedAt: new Date() } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
