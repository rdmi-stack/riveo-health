"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Target, BarChart3 } from "lucide-react";

function fmt$(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics?org=demo")
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  if (!data?.summary) return <div className="text-center text-slate-500 py-20">No data available. Load demo data from the Overview page.</div>;

  const s = data.summary;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
        <p className="text-sm text-slate-400">Revenue cycle performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2"><DollarSign className="w-4 h-4" /> Net Collection Rate</div>
          <p className="text-3xl font-bold text-white">{(s.collectionRate * 100).toFixed(1)}%</p>
          <p className="text-xs text-slate-500 mt-1">Industry avg: 95-98%</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2"><AlertTriangle className="w-4 h-4" /> Denial Rate</div>
          <p className={`text-3xl font-bold ${s.denialRate > 0.10 ? "text-red-400" : s.denialRate > 0.05 ? "text-amber-400" : "text-green-400"}`}>
            {(s.denialRate * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Industry avg: 5-10%</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2"><TrendingDown className="w-4 h-4" /> Revenue Lost to Denials</div>
          <p className="text-3xl font-bold text-red-400">{fmt$(s.totalBilled - s.totalPaid)}</p>
          <p className="text-xs text-slate-500 mt-1">{s.totalDenied} denied claims</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2"><Target className="w-4 h-4" /> Claims Processed</div>
          <p className="text-3xl font-bold text-white">{s.totalClaims.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Last 90 days</p>
        </div>
      </div>

      {/* Claims by Status */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary-light" /> Claims by Status</h3>
          <div className="space-y-3">
            {data.statusBreakdown.map((s: any, i: number) => {
              const total = data.summary.totalClaims;
              const pct = total > 0 ? (s.count / total * 100) : 0;
              const colors: Record<string, string> = {
                paid: "from-green-500 to-emerald-500",
                denied: "from-red-500 to-rose-500",
                pending: "from-amber-500 to-yellow-500",
                partial: "from-blue-500 to-cyan-500",
              };
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 capitalize">{s._id}</span>
                    <span className="text-white">{s.count} ({pct.toFixed(1)}%) — {fmt$(s.amount)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${colors[s._id] || "from-slate-500 to-slate-400"}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Denial Codes */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" /> Top Denial Codes</h3>
          <div className="space-y-2">
            {data.denialsByReason.slice(0, 8).map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400">{d._id}</span>
                  <span className="text-sm text-slate-300">{d.count} claims</span>
                </div>
                <span className="text-sm font-medium text-white">{fmt$(d.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payer Performance */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-8">
        <h3 className="font-semibold text-white mb-4">Payer Denial Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/10">
                <th className="text-left pb-3 font-medium">Payer</th>
                <th className="text-right pb-3 font-medium">Denied Claims</th>
                <th className="text-right pb-3 font-medium">Denied Amount</th>
                <th className="text-right pb-3 font-medium">% of Total Denials</th>
              </tr>
            </thead>
            <tbody>
              {data.denialsByPayer.map((p: any, i: number) => {
                const totalDenials = data.denialsByPayer.reduce((s: number, x: any) => s + x.count, 0);
                return (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 text-slate-300">{p._id}</td>
                    <td className="py-3 text-right text-white">{p.count}</td>
                    <td className="py-3 text-right text-red-400">{fmt$(p.amount)}</td>
                    <td className="py-3 text-right text-slate-400">{(p.count / totalDenials * 100).toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Trend */}
      {data.monthlyTrend.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-400" /> Monthly Trend</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-white/10">
                  <th className="text-left pb-3 font-medium">Month</th>
                  <th className="text-right pb-3 font-medium">Claims</th>
                  <th className="text-right pb-3 font-medium">Billed</th>
                  <th className="text-right pb-3 font-medium">Collected</th>
                  <th className="text-right pb-3 font-medium">Denied</th>
                  <th className="text-right pb-3 font-medium">Denial Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlyTrend.map((m: any, i: number) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 text-slate-300">{m._id}</td>
                    <td className="py-3 text-right text-white">{m.claims}</td>
                    <td className="py-3 text-right text-white">{fmt$(m.billed)}</td>
                    <td className="py-3 text-right text-green-400">{fmt$(m.paid)}</td>
                    <td className="py-3 text-right text-red-400">{m.denied}</td>
                    <td className="py-3 text-right">
                      <span className={`${(m.denied / m.claims) > 0.12 ? "text-red-400" : "text-amber-400"}`}>
                        {(m.denied / m.claims * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
