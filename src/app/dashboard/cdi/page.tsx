"use client";

import { useState } from "react";
import { FileText, Loader2, Brain, AlertTriangle, CheckCircle, ArrowRight, Zap } from "lucide-react";

const SAMPLE_NOTE = `Chief Complaint: Shortness of breath, worsening over 2 weeks.
HPI: 72-year-old male with history of CHF presents with progressive dyspnea on exertion. Now short of breath walking to the bathroom. Sleeping on 3 pillows. 5lb weight gain in 1 week. Missed last 2 doses of furosemide.
ROS: + orthopnea, + PND, + lower extremity edema. Denies chest pain, palpitations.
Exam: BP 148/92, HR 98, RR 22, SpO2 92% on RA. JVD present. Bilateral crackles lower 1/3. 2+ pitting edema bilateral LE. S3 gallop.
Assessment: CHF exacerbation. Plan: Admit, IV furosemide, daily weights, I&O, BNP, echo.`;

export default function CDIPage() {
  const [note, setNote] = useState("");
  const [specialty, setSpecialty] = useState("Internal Medicine");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function analyze() {
    if (note.length < 30) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/cdi", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clinicalNote: note, specialty }) });
      const data = await res.json();
      if (data.success) setResult(data.review);
    } finally { setLoading(false); }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Clinical Documentation Integrity (CDI)</h1>
        <p className="text-sm text-slate-400">AI reviews clinical notes for documentation gaps that impact coding and reimbursement</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={14} placeholder="Paste clinical note..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary resize-none" />
          <div className="flex items-center justify-between mt-3">
            <button onClick={() => setNote(SAMPLE_NOTE)} className="text-xs text-primary-light hover:text-accent">Load sample</button>
            <button onClick={analyze} disabled={loading || note.length < 30}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 disabled:opacity-40">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              {loading ? "Reviewing..." : "Run CDI Review"}
            </button>
          </div>
        </div>
        <div>
          {!result && !loading && <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center"><FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" /><p className="text-slate-500">Paste a clinical note to get CDI analysis</p></div>}
          {loading && <div className="rounded-xl border border-primary/20 bg-primary/5 p-12 text-center"><Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" /><p className="text-primary-light">Reviewing documentation integrity...</p></div>}
          {result && !loading && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                <div><p className="text-xs text-slate-500">Doc Score</p><p className="text-2xl font-bold text-white">{result.documentationScore}/100</p></div>
                <div><p className="text-xs text-slate-500">Queries</p><p className="text-2xl font-bold text-amber-400">{result.queries?.length || 0}</p></div>
                <div><p className="text-xs text-slate-500">Revenue Opportunity</p><p className="text-lg font-bold text-green-400">{result.summary?.estimatedRevenueOpportunity || "N/A"}</p></div>
              </div>
              {result.emLevelAnalysis && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs text-primary-light mb-1">E/M Level Analysis</p>
                  <p className="text-sm text-white">Current: <strong>{result.emLevelAnalysis.supportedLevel}</strong> → Potential: <strong className="text-green-400">{result.emLevelAnalysis.potentialLevel}</strong></p>
                  {result.emLevelAnalysis.gaps?.map((g: string, i: number) => <p key={i} className="text-xs text-slate-400 mt-1 flex items-center gap-1"><ArrowRight className="w-3 h-3 text-amber-400" />{g}</p>)}
                </div>
              )}
              {result.queries?.map((q: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${q.revenueImpact === "significant" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>{q.type}</span>
                    <span className="text-xs text-slate-500">{q.revenueImpact} impact</span>
                  </div>
                  <p className="text-sm text-white mb-1">{q.question}</p>
                  <p className="text-xs text-slate-400">Current: {q.currentDocumentation}</p>
                  <p className="text-xs text-green-400 mt-1">Suggested: {q.suggestedDocumentation}</p>
                  {q.codeWith && <p className="text-xs text-slate-500 mt-1">Code impact: {q.codeWithout} → <span className="text-green-400">{q.codeWith}</span></p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
