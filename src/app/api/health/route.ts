/* Health check endpoint — verifies MongoDB + OpenAI connections */

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  const checks: Record<string, string> = {
    status: "ok",
    timestamp: new Date().toISOString(),
    mongodb: "unknown",
    openai: "unknown",
  };

  // Check MongoDB
  try {
    const client = await clientPromise;
    await client.db("riveohealth").command({ ping: 1 });
    checks.mongodb = "connected";
  } catch (e) {
    checks.mongodb = `error: ${e instanceof Error ? e.message : "unknown"}`;
    checks.status = "degraded";
  }

  // Check OpenAI key exists
  checks.openai = process.env.OPENAI_API_KEY ? "configured" : "missing";
  if (!process.env.OPENAI_API_KEY) checks.status = "degraded";

  const statusCode = checks.status === "ok" ? 200 : 503;
  return NextResponse.json(checks, { status: statusCode });
}
