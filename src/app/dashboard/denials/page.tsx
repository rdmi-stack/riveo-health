"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle, Loader2, Brain, ChevronDown, ChevronUp,
  CheckCircle, Clock, ArrowRight, Sparkles, XCircle,
} from "lucide-react";

function fmt$(n: number) { return `$${n.toLocaleString()}`; }

export default function DenialsPage() {
  const [denials, setDenials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<Record<string, any>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchDenials = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ org: "demo" });
      if (statusFilter) params.set("status", statusFilter);
      if (priorityFilter) params.set("priority", priorityFilter);
      const res = await fetch(`/api/denials?${params}`);
      const data = await res.json();
      setDenials(data.denials || []);
      setPagination(data.pagination || { total: 0, page: 1, pages: 1 });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => { fetchDenials(); }, [fetchDenials]);

  async function analyzeWithAI(denial: any) {
    setAnalyzing(denial._id);
    try {
      const res = await fetch("/api/denials/analyze", {
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
      setAnalyses(prev => ({ ...prev, [denial._id]: data.analysis }));
      setExpandedId(denial._id);
    } catch {
      alert("AI analysis failed. Please try again.");
    } finally {
      setAnalyzing(null);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      await fetch("/api/denials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      setDenials(prev => prev.map(d => d._id === id ? { ...d, status: newStatus } : d));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Denial Management</h1>
          <p className="text-sm text-slate-400">{pagination.total} denials to review</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none appearance-none">
          <option value="" className="bg-slate-900">All Statuses</option>
          <option value="new" className="bg-slate-900">New</option>
          <option value="in_progress" className="bg-slate-900">In Progress</option>
          <option value="resolved" className="bg-slate-900">Resolved</option>
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none appearance-none">
          <option value="" className="bg-slate-900">All Priorities</option>
          <option value="high" className="bg-slate-900">High</option>
          <option value="medium" className="bg-slate-900">Medium</option>
          <option value="low" className="bg-slate-900">Low</option>
        </select>
      </div>

      {/* Denials List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : denials.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
          <CheckCircle className="w-10 h-10 mb-2 text-green-500" />
          <p className="text-white font-medium">No denials to review</p>
          <p className="text-sm">All caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {denials.map((d) => {
            const isExpanded = expandedId === d._id;
            const analysis = analyses[d._id];
            return (
              <div key={d._id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                {/* Row Header */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : d._id)}
                >
                  {/* Priority badge */}
                  <span className={`w-2 h-8 rounded-full shrink-0 ${
                    d.priority === "high" ? "bg-red-500" : d.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                  }`} />

                  <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-6 gap-2 items-center">
                    <div>
                      <p className="font-mono text-xs text-slate-400">{d.claimId}</p>
                      <p className="text-xs text-slate-500">{d.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">{d.payer}</p>
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-xs font-mono">{d.denialCode}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{fmt$(d.billedAmount)}</p>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        d.status === "new" ? "bg-slate-500/10 text-slate-400" :
                        d.status === "in_progress" ? "bg-amber-500/10 text-amber-400" :
                        "bg-green-500/10 text-green-400"
                      }`}>{d.status.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); analyzeWithAI(d); }}
                        disabled={analyzing === d._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary-light hover:bg-primary/20 transition-all disabled:opacity-50"
                      >
                        {analyzing === d._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                        AI Fix
                      </button>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-white/10">
                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                      {/* Denial Info */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Denial Reason</p>
                          <p className="text-sm text-slate-300">{d.denialReason}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Suggested Fix</p>
                          <p className="text-sm text-slate-300">{d.suggestedFix}</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          {d.status === "new" && (
                            <button
                              onClick={() => updateStatus(d._id, "in_progress")}
                              disabled={updatingId === d._id}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all"
                            >
                              <Clock className="w-3 h-3" /> Mark In Progress
                            </button>
                          )}
                          {d.status !== "resolved" && (
                            <button
                              onClick={() => updateStatus(d._id, "resolved")}
                              disabled={updatingId === d._id}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                            >
                              <CheckCircle className="w-3 h-3" /> Resolve
                            </button>
                          )}
                        </div>
                      </div>

                      {/* AI Analysis */}
                      {analysis && (
                        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-primary-light" />
                            <span className="text-xs font-semibold text-primary-light uppercase tracking-wider">AI Analysis (GPT-5.4)</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-xs text-slate-500">Explanation</p>
                              <p className="text-slate-300">{analysis.explanation}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Root Cause</p>
                              <p className="text-slate-300">{analysis.rootCause}</p>
                            </div>
                            {analysis.fixSteps && (
                              <div>
                                <p className="text-xs text-slate-500">Fix Steps</p>
                                <ol className="list-decimal list-inside text-slate-300 space-y-0.5">
                                  {analysis.fixSteps.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                </ol>
                              </div>
                            )}
                            <div className="flex gap-4 pt-2">
                              <div>
                                <p className="text-xs text-slate-500">Appeal Likelihood</p>
                                <p className={`font-bold ${(analysis.appealLikelihood || 0) > 70 ? "text-green-400" : "text-amber-400"}`}>
                                  {analysis.appealLikelihood}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Est. Recovery</p>
                                <p className="font-bold text-green-400">{fmt$(analysis.estimatedRecovery || 0)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Days to Act</p>
                                <p className="font-bold text-amber-400">{analysis.daysToAct || "N/A"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {!analysis && analyzing !== d._id && (
                        <div className="flex flex-col items-center justify-center rounded-lg bg-white/5 border border-white/10 p-6 text-center">
                          <Brain className="w-8 h-8 text-slate-600 mb-2" />
                          <p className="text-sm text-slate-500">Click &quot;AI Fix&quot; to get GPT-5.4 analysis</p>
                          <p className="text-xs text-slate-600">with fix steps, appeal strategy, and recovery estimate</p>
                        </div>
                      )}

                      {analyzing === d._id && (
                        <div className="flex flex-col items-center justify-center rounded-lg bg-primary/5 border border-primary/20 p-6">
                          <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                          <p className="text-sm text-primary-light">Analyzing with GPT-5.4...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
