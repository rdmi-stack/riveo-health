/* Seed demo data — GET /api/seed?org=demo */
import { NextRequest, NextResponse } from "next/server";
import { seedDemoData } from "@/lib/seed-demo";

export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get("org") || "demo";
  try {
    const result = await seedDemoData(orgId);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  }
}
