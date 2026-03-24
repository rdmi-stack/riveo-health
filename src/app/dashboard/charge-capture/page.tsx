"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, DollarSign, AlertTriangle, CheckCircle, FileText, Brain, Zap } from "lucide-react";

function fmt$(n: number) { return `$${n?.toLocaleString() || 0}`; }

const SAMPLE_NOTE = `Chief Complaint: Follow-up after ER visit for fall, wrist pain.
HPI: 67-year-old female seen for follow-up after ER visit 3 days ago for fall at home. Right wrist pain and swelling. X-ray in ER showed distal radius fracture. Splint applied in ER. Patient reports 6/10 pain, controlled with Tylenol. No numbness or tingling.
Exam: Right wrist — mild swelling, splint in place and intact. Neurovascular intact distally. Range of motion limited by splint.
X-ray review: Reviewed ER X-rays — non-displaced distal radius fracture, no intra-articular involvement.
Assessment: Non-displaced distal radius fracture, right wrist.
Plan: Continue splint x 2 more weeks. Prescription for short arm cast at 2-week follow-up. Rx: Ibuprofen 600mg TID. Occupational therapy referral for hand strengthening after cast removal. Return in 2 weeks for cast application. Workers comp paperwork completed and signed.`;

export default function ChargeCaptureAuditPage() {
  const [note, setNote] = useState("");
  const [existingCodes, setExistingCodes] = useState("99213");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/charge-capture?org=demo").then(r => r.json()).then(d => setHistory(d.findings || []));
  }, []);

  async function analyze() {
    if (note.length < 30) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/charge-capture", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicalNote: note, existingCharges: existingCodes.split(",").map(s => s.trim()).filter(Boolean) }),
      });
      const data = await res.json();
      if (data.success) setResult(data.findings);
    } finally { setLoading(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Charge Capture Audit</h1>
          <p className="text-sm text-slate-400">Find services performed but never billed — AI compares clinical notes vs charges</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <label className="text-sm text-slate-300 mb-2 block">Clinical Note</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={12}
              placeholder="Paste clinical documentation for the encounter..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary resize-none" />
            <div className="mt-3">
              <label className="text-sm text-slate-300 mb-1.5 block">Already Billed CPT Codes (comma-separated)</label>
              <input value={existingCodes} onChange={e => setExistingCodes(e.target.value)}
                placeholder="e.g., 99213, 73110"
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <button onClick={() => setNote(SAMPLE_NOTE)} className="text-xs text-primary-light hover:text-accent">Load sample note</button>
              <button onClick={analyze} disabled={loading || note.length < 30}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 disabled:opacity-40">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? "Auditing..." : "Audit for Missed Charges"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          {!result && !loading && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
              <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">Paste a clinical note to find missed charges</p>
              <p className="text-xs text-slate-600 mt-1">AI compares documented services vs billed codes</p>
            </div>
          )}
          {loading && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-12 text-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
              <p className="text-primary-light font-medium">Auditing encounter for missed charges...</p>
            </div>
          )}
          {result && !loading && (
            <div className="space-y-4">
              {/* Summary */}
              {result.summary && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-2xl font-bold text-red-400">{result.summary.missedCharges}</p><p className="text-[10px] text-slate-500">Missed Charges</p></div>
                    <div><p className="text-2xl font-bold text-red-400">{fmt$(result.summary.estimatedMissedRevenue)}</p><p className="text-[10px] text-slate-500">Missed Revenue</p></div>
                    <div><p className="text-2xl font-bold text-amber-400">{result.summary.chargeCapturRate}</p><p className="text-[10px] text-slate-500">Capture Rate</p></div>
                  </div>
                </div>
              )}

              {/* Missed charges */}
              {result.missedCharges?.length > 0 && (
                <div className="rounded-xl border border-red-500/20 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Missed Charges Found</h3>
                  {result.missedCharges.map((mc: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-white/5 mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400">{mc.cptCode}</code>
                          <span className="text-sm text-white">{mc.service}</span>
                        </div>
                        <span className="text-sm font-bold text-red-400">{fmt$(mc.estimatedRevenue)}</span>
                      </div>
                      <p className="text-xs text-slate-400 italic">&quot;{mc.evidence}&quot;</p>
                      <p className="text-xs text-amber-400 mt-1">Why missed: {mc.reason}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Already billed */}
              {result.documentedServices?.filter((s: any) => s.alreadyBilled).length > 0 && (
                <div className="rounded-xl border border-green-500/20 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Already Billed (Confirmed)</h3>
                  {result.documentedServices.filter((s: any) => s.alreadyBilled).map((s: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 p-2 text-sm text-slate-400">
                      <code className="text-xs font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-400">{s.cptCode}</code>
                      {s.service}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold text-white mb-3">Recent Audit History</h3>
          <div className="space-y-2">
            {history.slice(0, 5).map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{new Date(h.createdAt).toLocaleDateString()}</span>
                  <span className="text-sm text-white">{h.summary?.missedCharges || 0} missed charges</span>
                </div>
                <span className="text-sm font-bold text-red-400">{fmt$(h.summary?.estimatedMissedRevenue || 0)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
