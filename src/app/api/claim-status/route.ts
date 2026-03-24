/* Claim Status Auto-Polling — POST: check status, GET: list updates */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { chatCompletion } from "@/lib/openai";

const COL = "claim_status_checks";
async function col() { return (await getDb()).collection(COL); }

export async function POST(req: NextRequest) {
  try {
    const { claims, orgId = "demo" } = await req.json();
    if (!Array.isArray(claims) || !claims.length) return NextResponse.json({ error: "claims required" }, { status: 400 });

    const batch = claims.slice(0, 20).map((c: any, i: number) =>
      `Claim ${i + 1}: ID=${c.claimId}, Payer=${c.payer}, Submitted=${c.submittedDate || "unknown"}, Amount=$${c.billedAmount}`
    ).join("\n");

    const aiResponse = await chatCompletion(
      "You are a claim status checking system. Simulate realistic payer responses for claim status inquiries. Include specific status codes (277 transaction), dates, and actionable next steps.",
      `Check status for these claims:\n\n${batch}\n\nReturn JSON:\n{\n  "statusResults": [\n    {\n      "claimIndex": number,\n      "claimId": string,\n      "payerStatus": "received" | "in_review" | "pending_info" | "approved" | "paid" | "denied" | "rejected",\n      "statusCode": "277 status category code",\n      "statusDate": "date of status",\n      "estimatedPaymentDate": "date or null",\n      "amountApproved": number,\n      "actionRequired": boolean,\n      "actionDescription": "What to do if action needed",\n      "notes": "Additional payer notes"\n    }\n  ],\n  "summary": {"total": number, "actionRequired": number, "approved": number, "pending": number, "denied": number}\n}`,
      { temperature: 0.3, maxTokens: 2000, responseFormat: "json" }
    );

    let statusData;
    try { statusData = JSON.parse(aiResponse); } catch { statusData = { error: "Parse failed" }; }

    const c = await col();
    await c.insertOne({ orgId, checkedAt: new Date(), claimsChecked: claims.length, results: statusData, createdAt: new Date() });

    return NextResponse.json({ success: true, ...statusData });
  } catch (error) {
    console.error("Claim status error:", error);
    return NextResponse.json({ error: "Status check failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const c = await col();
    const items = await c.find({ orgId }).sort({ createdAt: -1 }).limit(10).toArray();
    return NextResponse.json({ checks: items });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
