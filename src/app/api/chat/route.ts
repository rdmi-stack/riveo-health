/* ───────────────────────────────────────────────────────
   POST /api/chat — Patient billing chat agent (GPT-5.4)
   Embeddable chat for patient billing questions
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, SYSTEM_PROMPTS, maskPHI } from "@/lib/openai";
import { getCollection } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [], orgId = "demo", patientId } = body;

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const maskedMessage = maskPHI(message);

    // Build conversation context
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPTS.PATIENT_BILLING },
    ];

    // Add conversation history (last 10 messages)
    const recent = conversationHistory.slice(-10);
    for (const msg of recent) {
      messages.push({ role: msg.role, content: msg.content });
    }
    messages.push({ role: "user", content: maskedMessage });

    const response = await chatCompletion(
      SYSTEM_PROMPTS.PATIENT_BILLING,
      messages.filter(m => m.role !== "system").map(m => `${m.role}: ${m.content}`).join("\n\n") + "\n\nRespond to the patient's latest message:",
      { temperature: 0.4, maxTokens: 800 }
    );

    // Save to conversation log
    const col = await getCollection("chat_conversations");
    await col.insertOne({
      orgId,
      patientId: patientId || null,
      userMessage: maskedMessage,
      aiResponse: response,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      reply: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}

// GET — Retrieve chat history for a patient
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const orgId = sp.get("org") || "demo";
    const limit = Math.min(parseInt(sp.get("limit") || "50"), 100);

    const col = await getCollection("chat_conversations");
    const conversations = await col.find({ orgId }).sort({ timestamp: -1 }).limit(limit).toArray();

    return NextResponse.json({ conversations });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
