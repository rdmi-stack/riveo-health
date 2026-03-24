/* AI Voice Agent — POST: handle call, GET: call history */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { chatCompletion, SYSTEM_PROMPTS } from "@/lib/openai";

const COL = "voice_calls";
async function col() { return (await getDb()).collection(COL); }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, orgId = "demo" } = body;

    if (action === "handle_call") {
      const { callerMessage, callerPhone, patientId, callHistory = [] } = body;
      if (!callerMessage) return NextResponse.json({ error: "callerMessage required" }, { status: 400 });

      const context = callHistory.length > 0
        ? `Previous messages:\n${callHistory.map((m: any) => `${m.role}: ${m.content}`).join("\n")}\n\n`
        : "";

      const aiResponse = await chatCompletion(
        SYSTEM_PROMPTS.PATIENT_BILLING + "\n\nYou are also a voice agent. Keep responses concise (2-3 sentences max) and conversational for phone. Always offer to transfer to a human if the caller requests.",
        `${context}Caller says: "${callerMessage}"\n\nRespond naturally as a billing assistant on the phone:`,
        { temperature: 0.4, maxTokens: 300 }
      );

      const c = await col();
      await c.insertOne({
        orgId, patientId, callerPhone, callerMessage,
        aiResponse, callHistory: [...callHistory, { role: "user", content: callerMessage }, { role: "assistant", content: aiResponse }],
        status: "active", createdAt: new Date(),
      });

      return NextResponse.json({ success: true, response: aiResponse });
    }

    if (action === "seed_demo") {
      const c = await col();
      const demos = [
        { orgId, patientId: "PAT-0012", callerPhone: "+15551234567", callerMessage: "I got a bill for $320 and I don't understand why", aiResponse: "I can help with that. The $320 charge is from your office visit on February 15th. Your insurance covered $250, and the remaining $70 is your copay plus coinsurance. Would you like me to break that down further?", status: "completed", duration: 180, resolution: "explained_bill", createdAt: new Date(Date.now() - 3600000) },
        { orgId, patientId: "PAT-0034", callerPhone: "+15559876543", callerMessage: "Can I set up a payment plan for my MRI bill?", aiResponse: "Absolutely! Your MRI balance is $450. I can offer you a 3-month plan at $150 per month, or a 6-month plan at $75 per month. Both are interest-free. Which would you prefer?", status: "completed", duration: 240, resolution: "payment_plan_setup", createdAt: new Date(Date.now() - 7200000) },
        { orgId, patientId: "PAT-0056", callerPhone: "+15551112222", callerMessage: "My insurance should have covered this, why am I getting a bill?", aiResponse: "Let me look into that for you. I see the claim was submitted to Aetna on January 28th. It appears it was denied due to a missing prior authorization. I can help file an appeal — would you like me to do that?", status: "completed", duration: 300, resolution: "appeal_initiated", createdAt: new Date(Date.now() - 10800000) },
      ];
      await c.deleteMany({ orgId });
      await c.insertMany(demos);
      return NextResponse.json({ success: true, count: demos.length });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Voice agent error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("org") || "demo";
    const c = await col();
    const items = await c.find({ orgId }).sort({ createdAt: -1 }).limit(30).toArray();
    const resolutions = items.reduce((acc: any, i: any) => { acc[i.resolution || "unknown"] = (acc[i.resolution || "unknown"] || 0) + 1; return acc; }, {});
    return NextResponse.json({ calls: items, total: items.length, resolutions });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
