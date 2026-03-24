"use client";

import { useState, useEffect } from "react";
import { DollarSign, Loader2, AlertTriangle, CheckCircle, Search, Brain, ArrowRight, FileText, TrendingUp } from "lucide-react";

function fmt$(n: number) { return `$${n?.toLocaleString() || 0}`; }

export default function UnderpaymentPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [totalVariance, setTotalVariance] = useState(0);

  useEffect(() => {
    fetch("/api/underpayment?org=demo")
      .then(r => r.json())
      .then(d => { setItems(d.underpayments || []); setTotalVariance(d.totalVariance || 0); })
      .finally(() => setLoading(false));
  }, []);

  async function runScan() {
    setScanning(true);
    setAnalysis(null);
    try {
      const res = await fetch("/api/underpayment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orgId: "demo" }) });
      const data = await res.json();
      if (data.analysis) setAnalysis(data.analysis);
      // Refresh list
      const list = await fetch("/api/underpayment?org=demo").then(r => r.json());
      setItems(list.underpayments || []);
      setTotalVariance(list.totalVariance || 0);
    } finally { setScanning(false); }
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/underpayment", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setItems(prev => prev.map(i => i._id === id ? { ...i, status } : i));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contract Underpayment Detection</h1>
          <p className="text-sm text-slate-400">Compare every payment vs contracted rates — find money payers owe you</p>
        </div>
        <button onClick={runScan} disabled={scanning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 disabled:opacity-40">
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {scanning ? "Scanning Claims..." : "Scan for Underpayments"}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-center">
          <p className="text-3xl font-bold text-red-400">{fmt$(totalVariance)}</p>
          <p className="text-xs text-slate-500">Total Underpayment Found</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-3xl font-bold text-white">{items.length}</p>
          <p className="text-xs text-slate-500">Underpaid Claims</p>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 text-center">
          <p className="text-3xl font-bold text-green-400">{fmt$(Math.round(totalVariance * 0.75))}</p>
          <p className="text-xs text-slate-500">Estimated Recoverable</p>
        </div>
      </div>

      {/* AI Analysis */}
      {analysis && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 mb-6">
          <h3 className="font-semibold text-primary-light mb-3 flex items-center gap-2"><Brain className="w-4 h-4" /> AI Recovery Analysis</h3>
          {analysis.topIssues?.map((issue: any, i: number) => (
            <div key={i} className="p-3 rounded-lg bg-white/5 mb-2">
              <div className="flex justify-between"><span className="text-sm text-slate-300">{issue.issue}</span><span className="text-sm font-bold text-red-400">{fmt$(issue.totalVariance)}</span></div>
              <p className="text-xs text-green-400 mt-1">Action: {issue.action}</p>
            </div>
          ))}
          {analysis.priorityActions?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-slate-400 mb-2">Priority Actions:</p>
              {analysis.priorityActions.map((a: string, i: number) => (
                <p key={i} className="text-xs text-slate-300 flex items-start gap-1.5 mb-1"><ArrowRight className="w-3 h-3 text-accent mt-0.5 shrink-0" />{a}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Underpayment list */}
      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div> :
      items.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <DollarSign className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-white font-medium">No underpayments detected yet</p>
          <p className="text-sm text-slate-500">Click &quot;Scan for Underpayments&quot; to analyze your paid claims against expected contracted rates.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-slate-500 border-b border-white/10 bg-white/5">
              <th className="text-left px-4 py-3">Claim</th><th className="text-left px-4 py-3">Payer</th><th className="text-left px-4 py-3">CPT</th>
              <th className="text-right px-4 py-3">Billed</th><th className="text-right px-4 py-3">Expected</th><th className="text-right px-4 py-3">Paid</th>
              <th className="text-right px-4 py-3">Variance</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Action</th>
            </tr></thead>
            <tbody>
              {items.slice(0, 50).map((u, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{u.claimId}</td>
                  <td className="px-4 py-3 text-slate-300">{u.payer}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{u.cptCode}</td>
                  <td className="px-4 py-3 text-right text-white">{fmt$(u.billedAmount)}</td>
                  <td className="px-4 py-3 text-right text-slate-400">{fmt$(u.expectedPayment)}</td>
                  <td className="px-4 py-3 text-right text-amber-400">{fmt$(u.actualPayment)}</td>
                  <td className="px-4 py-3 text-right font-bold text-red-400">{fmt$(u.variance)}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${u.status === "detected" ? "bg-red-500/10 text-red-400" : u.status === "appealed" ? "bg-amber-500/10 text-amber-400" : "bg-green-500/10 text-green-400"}`}>{u.status}</span></td>
                  <td className="px-4 py-3">
                    {u.status === "detected" && <button onClick={() => updateStatus(u._id, "appealed")} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary-light hover:bg-primary/20">Appeal</button>}
                    {u.status === "appealed" && <button onClick={() => updateStatus(u._id, "recovered")} className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20">Recovered</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
