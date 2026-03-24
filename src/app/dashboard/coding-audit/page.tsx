"use client";

import { useState } from "react";
import { Shield, Loader2, Brain, CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react";

const SAMPLE = { note: "58yo male, follow-up HTN and DM2. BP 134/82 controlled on lisinopril. A1C 7.2. Continue lisinopril 20mg. Increase metformin 1000mg BID. Return 3 months.", codes: "99213, E11.9, I10" };

export default function CodingAuditPage() {
  const [note, setNote] = useState("");
  const [codes, setCodes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function audit() {
    if (!note || !codes) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/coding-audit", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicalNote: note, assignedCodes: codes, specialty: "General" }) });
      const data = await res.json();
      if (data.success) setResult(data.audit);
    } finally { setLoading(false); }
  }

  const VERDICT_STYLES: Record<string, { icon: React.ElementType; color: string }> = {
    correct: { icon: CheckCircle, color: "text-green-400" },
    incorrect: { icon: XCircle, color: "text-red-400" },
    unsupported: { icon: AlertTriangle, color: "text-red-400" },
    undercoded: { icon: AlertTriangle, color: "text-amber-400" },
    overcoded: { icon: XCircle, color: "text-red-400" },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Coding Audit (AI Second Reviewer)</h1>
        <p className="text-sm text-slate-400">Verify assigned codes against clinical documentation before submission</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Clinical Note</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={10} placeholder="Paste clinical documentation..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Assigned Codes (comma-separated)</label>
            <input value={codes} onChange={e => setCodes(e.target.value)} placeholder="e.g., 99213, E11.9, I10"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="flex justify-between">
            <button onClick={() => { setNote(SAMPLE.note); setCodes(SAMPLE.codes); }} className="text-xs text-primary-light hover:text-accent">Load sample</button>
            <button onClick={audit} disabled={loading || !note || !codes}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 disabled:opacity-40">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {loading ? "Auditing..." : "Run Coding Audit"}
            </button>
          </div>
        </div>
        <div>
          {!result && !loading && <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center"><Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" /><p className="text-slate-500">Enter note + codes to run audit</p></div>}
          {loading && <div className="rounded-xl border border-primary/20 bg-primary/5 p-12 text-center"><Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" /><p className="text-primary-light">Auditing codes against documentation...</p></div>}
          {result && !loading && (
            <div className="space-y-4">
              {/* Summary */}
              <div className={`rounded-xl border p-5 ${result.auditResult === "pass" ? "border-green-500/20 bg-green-500/5" : result.auditResult === "fail" ? "border-red-500/20 bg-red-500/5" : "border-amber-500/20 bg-amber-500/5"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {result.auditResult === "pass" ? <CheckCircle className="w-8 h-8 text-green-400" /> : result.auditResult === "fail" ? <XCircle className="w-8 h-8 text-red-400" /> : <AlertTriangle className="w-8 h-8 text-amber-400" />}
                    <div>
                      <p className="text-lg font-bold text-white capitalize">{result.auditResult?.replace(/_/g, " ")}</p>
                      <p className="text-xs text-slate-400">Accuracy: {result.overallAccuracy}%</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${result.complianceSummary?.overallRisk === "low" ? "bg-green-500/10 text-green-400" : result.complianceSummary?.overallRisk === "high" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
                    {result.complianceSummary?.recommendedAction?.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Code review */}
              {result.codeReview?.map((c: any, i: number) => {
                const style = VERDICT_STYLES[c.verdict] || VERDICT_STYLES.correct;
                return (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <style.icon className={`w-4 h-4 ${style.color}`} />
                      <code className="text-sm font-mono text-white">{c.code}</code>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${style.color} bg-white/5`}>{c.verdict}</span>
                      {c.auditFlag && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">AUDIT FLAG</span>}
                    </div>
                    {c.evidence && <p className="text-xs text-slate-400 bg-white/5 rounded p-2 mb-1">&quot;{c.evidence}&quot;</p>}
                    {c.issue && <p className="text-xs text-red-400">{c.issue}</p>}
                    {c.suggestedCode && <p className="text-xs text-green-400">Suggested: {c.suggestedCode}</p>}
                  </div>
                );
              })}

              {/* Missing codes */}
              {result.missingCodes?.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <p className="text-xs font-semibold text-amber-400 mb-2">Missing Codes</p>
                  {result.missingCodes.map((m: any, i: number) => (
                    <div key={i} className="text-xs text-slate-300 mb-1"><code className="text-amber-400">{m.code}</code> — {m.reason}</div>
                  ))}
                </div>
              )}

              {/* Compliance */}
              {result.complianceSummary && (
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-green-500/5"><p className="text-lg font-bold text-green-400">{result.complianceSummary.correctCodes}</p><p className="text-[10px] text-slate-500">Correct</p></div>
                  <div className="p-2 rounded-lg bg-red-500/5"><p className="text-lg font-bold text-red-400">{result.complianceSummary.incorrectCodes}</p><p className="text-[10px] text-slate-500">Incorrect</p></div>
                  <div className="p-2 rounded-lg bg-amber-500/5"><p className="text-lg font-bold text-amber-400">{result.complianceSummary.missingCodes}</p><p className="text-[10px] text-slate-500">Missing</p></div>
                  <div className="p-2 rounded-lg bg-blue-500/5"><p className="text-lg font-bold text-blue-400">{result.complianceSummary.bundlingIssues}</p><p className="text-[10px] text-slate-500">Bundling</p></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
