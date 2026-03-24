/* ───────────────────────────────────────────────────────
   POST /api/denials/analyze — AI denial analysis with GPT-5.4
   Analyzes a denied claim and suggests fix + appeal strategy
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, SYSTEM_PROMPTS, maskPHI } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claimId, payer, cptCode, icdCode, billedAmount, denialCode, denialReason, provider } = body;

    if (!claimId || !denialCode) {
      return NextResponse.json({ error: "claimId and denialCode are required" }, { status: 400 });
    }

    const prompt = maskPHI(`Analyze this denied claim and provide a fix strategy:

Claim ID: ${claimId}
Payer: ${payer}
CPT Code: ${cptCode}
ICD-10 Code: ${icdCode}
Billed Amount: $${billedAmount}
Denial Code: ${denialCode}
Denial Reason: ${denialReason}
Provider: ${provider}

Return JSON:
{
  "explanation": "Clear explanation of why this was denied",
  "rootCause": "The underlying root cause",
  "fixSteps": ["Step 1...", "Step 2...", "Step 3..."],
  "appealLikelihood": number (0-100 percentage),
  "appealTemplate": "Draft appeal letter paragraph",
  "preventionTip": "How to prevent this denial in the future",
  "estimatedRecovery": number (dollar amount likely to recover),
  "urgency": "high" | "medium" | "low",
  "daysToAct": number (days before appeal window closes)
}`);

    const aiResponse = await chatCompletion(
      SYSTEM_PROMPTS.DENIAL_ANALYSIS,
      prompt,
      { temperature: 0.2, maxTokens: 1500, responseFormat: "json" }
    );

    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch {
      analysis = { explanation: aiResponse, parseError: true };
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Denial analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
