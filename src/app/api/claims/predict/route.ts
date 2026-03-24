/* ───────────────────────────────────────────────────────
   POST /api/claims/predict — Denial prediction
   Score each claim 0-100 risk BEFORE submission (GPT-5.4)
   ─────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, SYSTEM_PROMPTS } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claims } = body;

    if (!Array.isArray(claims) || claims.length === 0) {
      return NextResponse.json({ error: "claims array is required" }, { status: 400 });
    }

    // Limit batch size
    const batch = claims.slice(0, 20);

    const claimsSummary = batch.map((c: any, i: number) => (
      `Claim ${i + 1}: Payer=${c.payer}, CPT=${c.cptCode}, ICD=${c.icdCode}, Billed=$${c.billedAmount}, Provider=${c.provider || "N/A"}, DOS=${c.dateOfService || "N/A"}`
    )).join("\n");

    const prompt = `Analyze these claims BEFORE submission and predict denial risk for each.

${claimsSummary}

For each claim, return JSON:
{
  "predictions": [
    {
      "claimIndex": number (0-based),
      "riskScore": number (0-100, where 100 = certain denial),
      "riskLevel": "high" | "medium" | "low",
      "denialProbability": number (0-100 percentage),
      "likelyDenialCodes": ["CARC codes that would be used if denied"],
      "riskFactors": [
        {
          "factor": "What specific issue increases denial risk",
          "severity": "high" | "medium" | "low",
          "fix": "What to do before submitting to prevent denial"
        }
      ],
      "recommendation": "submit" | "review" | "hold",
      "actionRequired": "Specific action to take before submitting"
    }
  ],
  "batchSummary": {
    "totalClaims": number,
    "highRisk": number,
    "mediumRisk": number,
    "lowRisk": number,
    "totalAtRiskAmount": number,
    "topRiskFactor": "Most common risk factor across all claims"
  }
}`;

    const aiResponse = await chatCompletion(SYSTEM_PROMPTS.DENIAL_ANALYSIS, prompt, {
      temperature: 0.1,
      maxTokens: 3000,
      responseFormat: "json",
    });

    let prediction;
    try {
      prediction = JSON.parse(aiResponse);
    } catch {
      prediction = { rawResponse: aiResponse, parseError: true };
    }

    return NextResponse.json({ success: true, prediction });
  } catch (error) {
    console.error("Prediction API error:", error);
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
  }
}
