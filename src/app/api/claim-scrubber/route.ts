/* Claim Scrubber — Rules-based pre-submission validation */
import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const { claims } = await req.json();
    if (!Array.isArray(claims) || !claims.length) return NextResponse.json({ error: "claims required" }, { status: 400 });

    const batch = claims.slice(0, 20).map((c: any, i: number) =>
      `Claim ${i + 1}: Payer=${c.payer}, CPT=${c.cptCode}, ICD=${c.icdCode}, Mod=${c.modifier || "none"}, Billed=$${c.billedAmount}, DOS=${c.dateOfService || "today"}, NPI=${c.npi || "present"}, PatientDOB=${c.patientDob || "present"}`
    ).join("\n");

    const aiResponse = await chatCompletion(
      "You are a claim scrubbing rules engine. Check each claim against CMS, payer-specific, and industry billing rules. Flag EVERY issue that would cause a denial or delay. Be thorough — check coding, demographics, authorization, timely filing, bundling, modifier usage, medical necessity, and missing fields.",
      `Scrub these claims:\n\n${batch}\n\nReturn JSON:\n{\n  "results": [\n    {\n      "claimIndex": number,\n      "status": "clean" | "warning" | "error",\n      "errors": [{"rule": "Rule name", "severity": "error"|"warning", "field": "Affected field", "message": "Issue description", "fix": "How to fix"}],\n      "cleanToSubmit": boolean\n    }\n  ],\n  "summary": {"total": number, "clean": number, "warnings": number, "errors": number, "rulesChecked": number}\n}`,
      { temperature: 0.1, maxTokens: 2500, responseFormat: "json" }
    );

    let scrub;
    try { scrub = JSON.parse(aiResponse); } catch { scrub = { error: "Parse failed" }; }
    return NextResponse.json({ success: true, ...scrub });
  } catch (error) {
    console.error("Scrubber error:", error);
    return NextResponse.json({ error: "Scrub failed" }, { status: 500 });
  }
}
