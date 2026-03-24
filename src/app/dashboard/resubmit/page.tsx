"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw, Loader2, CheckCircle, XCircle, Clock, Send,
  Brain, AlertTriangle, ArrowRight, FileText, ChevronDown, ChevronUp,
} from "lucide-react";

function fmt$(n: number) { return `$${n?.toLocaleString() || 0}`; }

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  pending_approval: { color: "bg-amber-500/10 text-amber-400", label: "Pending Approval" },
  approved: { color: "bg-blue-500/10 text-blue-400", label: "Approved" },
  resubmitted: { color: "bg-cyan-500/10 text-cyan-400", label: "Resubmitted" },
  resolved: { color: "bg-green-500/10 text-green-400", label: "Resolved" },
  rejected: { color: "bg-red-500/10 text-red-400", label: "Rejected" },
};

export default function ResubmitPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [denials, setDenials] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/resubmit?org=demo").then(r => r.json()),
      fetch("/api/denials?org=demo&status=new&limit=10").then(r => r.json()),
    ]).then(([resub, den]) => {
      setQueue(resub.resubmissions || []);
      setDenials(den.denials || []);
    }).finally(() => setLoading(false));
  }, []);

  async function generateResubmission(denial: any) {
    setGenerating(denial._id);
    try {
      const res = await fetch("/api/resubmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimId: denial.claimId,
          payer: denial.payer,
          billedAmount: denial.billedAmount,
          denialCode: denial.denialCode,
          denialReason: denial.denialReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh queue
        const updated = await fetch("/api/resubmit?org=demo").then(r => r.json());
        setQueue(updated.resubmissions || []);
        setDenials(prev => prev.filter(d => d._id !== denial._id));
      }
    } finally {
      setGenerating(null);
    }
  }

  async function updateStatus(id: string, action: string) {
    await fetch("/api/resubmit", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setQueue(prev => prev.map(q => q._id === id ? {
      ...q,
      status: action === "approve" ? "approved" : action === "reject" ? "rejected" : action === "resubmit" ? "resubmitted" : "resolved",
    } : q));
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Auto-Resubmission</h1>
          <p className="text-sm text-slate-400">AI fixes denied claims → you approve → auto-resubmit</p>
        </div>
      </div>

      {/* Workflow */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { label: "AI Generates Fix", icon: Brain, desc: "GPT-5.4 creates corrected claim" },
          { label: "You Approve", icon: CheckCircle, desc: "Review and approve the correction" },
          { label: "Auto-Resubmit", icon: Send, desc: "Corrected claim sent to payer" },
          { label: "Revenue Recovered", icon: RefreshCw, desc: "Track until payment received" },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <s.icon className="w-6 h-6 text-primary-light mx-auto mb-2" />
            <p className="text-xs font-semibold text-white">{s.label}</p>
            <p className="text-[10px] text-slate-500 mt-1">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Unworked denials — generate resubmissions */}
      {denials.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 mb-6">
          <h3 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> {denials.length} Denials Ready for Auto-Fix
          </h3>
          <div className="space-y-2">
            {denials.slice(0, 5).map((d) => (
              <div key={d._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-slate-400">{d.claimId}</span>
                  <span className="text-sm text-slate-300">{d.payer}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-mono">{d.denialCode}</span>
                  <span className="text-sm text-white font-medium">{fmt$(d.billedAmount)}</span>
                </div>
                <button onClick={() => generateResubmission(d)} disabled={generating === d._id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg gradient-bg text-white hover:opacity-90 disabled:opacity-50">
                  {generating === d._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                  Generate Fix
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resubmission Queue */}
      {queue.length > 0 ? (
        <div className="space-y-3">
          <h3 className="font-semibold text-white">Resubmission Queue ({queue.length})</h3>
          {queue.map((q) => {
            const isExpanded = expandedId === q._id;
            const sc = STATUS_MAP[q.status] || STATUS_MAP.pending_approval;
            return (
              <div key={q._id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/5" onClick={() => setExpandedId(isExpanded ? null : q._id)}>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-slate-400">{q.originalClaimId}</span>
                    <span className="text-sm text-slate-300">{q.payer}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-mono">{q.denialCode}</span>
                    <span className="text-sm text-white font-medium">{fmt$(q.billedAmount)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {q.recoveryProbability && (
                      <span className={`text-xs font-bold ${q.recoveryProbability > 70 ? "text-green-400" : "text-amber-400"}`}>{q.recoveryProbability}%</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </div>
                </div>
                {isExpanded && q.aiCorrection && (
                  <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-3">
                    {/* Corrections */}
                    {q.aiCorrection.corrections?.map((c: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-white/5">
                        <p className="text-xs text-slate-500">{c.field}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-red-400 line-through">{c.originalValue}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span className="text-sm text-green-400 font-medium">{c.correctedValue}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{c.reason}</p>
                      </div>
                    ))}
                    {q.aiCorrection.resubmissionNotes && (
                      <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                        <p className="text-xs text-blue-400 mb-1">Resubmission Notes</p>
                        <p className="text-sm text-slate-300">{q.aiCorrection.resubmissionNotes}</p>
                      </div>
                    )}
                    {q.aiCorrection.appealLetter && (
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-xs text-primary-light mb-1">Appeal Letter Draft</p>
                        <p className="text-sm text-slate-300">{q.aiCorrection.appealLetter}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      {q.status === "pending_approval" && (
                        <>
                          <button onClick={() => updateStatus(q._id, "approve")}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20">
                            <CheckCircle className="w-3 h-3" /> Approve & Queue
                          </button>
                          <button onClick={() => updateStatus(q._id, "reject")}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </>
                      )}
                      {q.status === "approved" && (
                        <button onClick={() => updateStatus(q._id, "resubmit")}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20">
                          <Send className="w-3 h-3" /> Mark Resubmitted
                        </button>
                      )}
                      {q.status === "resubmitted" && (
                        <button onClick={() => updateStatus(q._id, "resolve")}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20">
                          <CheckCircle className="w-3 h-3" /> Mark Resolved (Paid)
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : denials.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <p className="text-white font-medium">No pending resubmissions</p>
          <p className="text-sm text-slate-500">Denied claims will appear here for auto-fix and resubmission.</p>
        </div>
      )}
    </div>
  );
}
