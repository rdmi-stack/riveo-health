/* ───────────────────────────────────────────────────────
   OpenAI Client — GPT integration with PHI-safe defaults
   ─────────────────────────────────────────────────────── */

import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "";

// Don't throw at module load — breaks build-time static generation
// Errors surface at runtime when chatCompletion() is called
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export default openai;

// ── System prompts ─────────────────────────────────────

export const SYSTEM_PROMPTS = {
  DENIAL_ANALYSIS: `You are a healthcare revenue cycle expert AI assistant for Riveo Health.
You analyze denied medical claims and provide:
1. Clear explanation of why the claim was denied (based on CARC/RARC codes)
2. Specific steps to fix and resubmit the claim
3. Likelihood of successful appeal (percentage)
4. Recommended timeline for action

Rules:
- Never reference specific patient names or PHI in your response
- Use claim IDs and patient IDs only
- Cite specific payer rules when possible
- Be concise and actionable
- Format as structured JSON when asked`,

  MEDICAL_CODING: `You are an expert medical coder (CPC, CCS certified level knowledge).
Given clinical documentation, you suggest accurate ICD-10-CM and CPT codes.

Rules:
- Suggest the most specific code supported by the documentation
- Flag potential undercoding or overcoding risks
- Include confidence score (0-100) for each suggestion
- Never fabricate codes — only suggest valid ICD-10-CM and CPT codes
- Note when documentation is insufficient for a specific code
- Return structured JSON format`,

  PATIENT_BILLING: `You are a friendly, professional patient billing assistant for a healthcare practice.
You help patients understand their bills, insurance coverage, and payment options.

Rules:
- Use simple, non-medical language
- Never share other patients' information
- Offer payment plan options when bills are large
- Be empathetic — billing is stressful for patients
- Direct complex insurance questions to the billing department
- Never provide medical advice`,

  AUDIT_ANALYSIS: `You are a healthcare revenue cycle auditor for Riveo Health.
You analyze claims data to identify revenue leakage, denial patterns, and improvement opportunities.

Rules:
- Focus on actionable insights with dollar amounts
- Cite industry benchmarks (MGMA, HFMA, AAPC sources)
- Prioritize recommendations by potential revenue impact
- Be specific about root causes, not just symptoms
- Return structured JSON format`,
};

// ── Helper: Chat completion with defaults ──────────────

export async function chatCompletion(
  systemPrompt: string,
  userMessage: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: "text" | "json";
  }
) {
  if (!openai) throw new Error("OpenAI API key not configured");
  const response = await openai.chat.completions.create({
    model: options?.model || "gpt-5.4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: options?.temperature ?? 0.3,
    max_completion_tokens: options?.maxTokens ?? 2000,
    ...(options?.responseFormat === "json" && {
      response_format: { type: "json_object" },
    }),
  });

  return response.choices[0]?.message?.content || "";
}

// ── Helper: PHI masking before sending to AI ───────────

export function maskPHI(text: string): string {
  let masked = text;

  // Mask SSN patterns
  masked = masked.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN-MASKED]");

  // Mask phone numbers
  masked = masked.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[PHONE-MASKED]");

  // Mask email addresses
  masked = masked.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL-MASKED]");

  // Mask dates of birth (common formats)
  masked = masked.replace(/\b(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}\b/g, "[DOB-MASKED]");

  // Mask MRN patterns (6-10 digit numbers that look like IDs)
  masked = masked.replace(/\bMRN[:\s]*\d{6,10}\b/gi, "[MRN-MASKED]");

  return masked;
}
