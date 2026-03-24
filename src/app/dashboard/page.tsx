"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign, TrendingDown, TrendingUp, FileText, AlertTriangle, Clock,
  ArrowRight, ArrowUpRight, ArrowDownRight, Loader2, Brain, Sparkles, Zap,
} from "lucide-react";

interface Analytics {
  summary: { totalClaims: number; totalBilled: number; totalPaid: number; totalDenied: number; denialRate: number; collectionRate: number; outstandingAR: number };
  denialsByReason: { _id: string; count: number; amount: number }[];
  denialsByPayer: { _id: string; count: number; amount: number }[];
  recentDenials: any[];
  monthlyTrend: { _id: string; claims: number; billed: number; paid: number; denied: number }[];
  statusBreakdown: { _id: string; count: number; amount: number }[];
}

function fmt$(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export default function DashboardHome() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/analytics?org=demo");
      setData(await res.json());
    } catch {} finally { setLoading(false); }
  }

  async function seedData() {
    setSeeding(true);
    try { await fetch("/api/seed?org=demo"); await fetchData(); } finally { setSeeding(false); }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
        <p className="text-sm text-slate-400">Loading dashboard...</p>
      </div>
    </div>
  );

  const d = data?.summary;
  if (!d || d.totalClaims === 0) return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
        <FileText className="w-10 h-10 text-indigo-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Welcome to Riveo Health</h2>
      <p className="text-slate-400 mb-6 max-w-sm">Import your claims data or load demo data to see your revenue intelligence dashboard.</p>
      <div className="flex gap-3">
        <button onClick={seedData} disabled={seeding}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-indigo-500/20">
          {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {seeding ? "Loading..." : "Load Demo Data"}
        </button>
        <Link href="/dashboard/import" className="px-6 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/[0.04] transition-all">
          Import CSV
        </Link>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-bold text-white">Revenue Dashboard</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Last 90 days · All payers</p>
        </div>
        <button onClick={seedData} disabled={seeding} className="px-3 py-1.5 text-[11px] rounded-lg border border-white/[0.08] text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all">
          {seeding ? "Refreshing..." : "Refresh Demo"}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Total Billed", value: fmt$(d.totalBilled), sub: "Last 90 days", icon: DollarSign, gradient: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-500/15" },
          { title: "Collected", value: fmt$(d.totalPaid), sub: `${(d.collectionRate * 100).toFixed(1)}% rate`, icon: TrendingUp, gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/15", trend: "up" },
          { title: "Denied Claims", value: d.totalDenied.toLocaleString(), sub: `${(d.denialRate * 100).toFixed(1)}% denial rate`, icon: AlertTriangle, gradient: "from-rose-500 to-rose-600", shadow: "shadow-rose-500/15", trend: "down" },
          { title: "Outstanding A/R", value: fmt$(d.outstandingAR), sub: "Pending collection", icon: Clock, gradient: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/15" },
        ].map((card, i) => (
          <div key={i} className="group relative rounded-2xl border border-white/[0.06] bg-[#0F1423] p-5 hover:border-white/[0.12] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{card.title}</span>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.shadow}`}>
                <card.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-[26px] font-bold text-white tracking-tight leading-none mb-1.5">{card.value}</p>
            <div className="flex items-center gap-1 text-[12px]">
              {card.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />}
              {card.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />}
              <span className={card.trend === "up" ? "text-emerald-400" : card.trend === "down" ? "text-rose-400" : "text-slate-500"}>{card.sub}</span>
            </div>
            {/* Subtle glow on hover */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Denial Breakdown */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#0F1423] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-rose-500 to-amber-500" />
              <h3 className="text-[14px] font-semibold text-white">Top Denial Reasons</h3>
            </div>
            <Link href="/dashboard/denials" className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3.5">
            {data!.denialsByReason.slice(0, 6).map((d, i) => {
              const maxCount = data!.denialsByReason[0]?.count || 1;
              const pct = (d.count / maxCount) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between text-[12px] mb-1.5">
                    <span className="text-slate-300 font-medium">{d._id}</span>
                    <span className="text-white font-semibold tabular-nums">{d.count} <span className="text-slate-500 font-normal">· {fmt$(d.amount)}</span></span>
                  </div>
                  <div className="h-[6px] rounded-full bg-white/[0.04] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-rose-500/80 to-amber-500/80 transition-all duration-1000" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payer Performance */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0F1423] p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-500" />
            <h3 className="text-[14px] font-semibold text-white">By Payer</h3>
          </div>
          <div className="space-y-3">
            {data!.denialsByPayer.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: ["#818cf8", "#22d3ee", "#f472b6", "#fb923c", "#a78bfa", "#34d399"][i] || "#64748b" }} />
                  <span className="text-[12px] text-slate-300">{p._id}</span>
                </div>
                <div className="text-right">
                  <span className="text-[12px] font-semibold text-white tabular-nums">{p.count}</span>
                  <span className="text-[11px] text-slate-500 ml-1.5">{fmt$(p.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Denials */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0F1423] overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-rose-500 to-rose-600" />
            <h3 className="text-[14px] font-semibold text-white">Recent Denials</h3>
          </div>
          <Link href="/dashboard/denials" className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            Manage all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] text-slate-500 uppercase tracking-wider">
                <th className="text-left px-6 py-3 font-semibold">Claim</th>
                <th className="text-left px-6 py-3 font-semibold">Payer</th>
                <th className="text-left px-6 py-3 font-semibold">Code</th>
                <th className="text-right px-6 py-3 font-semibold">Amount</th>
                <th className="text-left px-6 py-3 font-semibold">Priority</th>
                <th className="text-left px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {data!.recentDenials.map((d, i) => (
                <tr key={i} className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3.5 text-[12px] font-mono text-slate-400">{d.claimId}</td>
                  <td className="px-6 py-3.5 text-[12px] text-slate-300">{d.payer}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 text-[11px] font-mono">{d.denialCode}</span>
                  </td>
                  <td className="px-6 py-3.5 text-right text-[12px] font-semibold text-white tabular-nums">${d.billedAmount}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      d.priority === "high" ? "bg-rose-500/10 text-rose-400" :
                      d.priority === "medium" ? "bg-amber-500/10 text-amber-400" :
                      "bg-blue-500/10 text-blue-400"
                    }`}><span className={`w-1 h-1 rounded-full ${d.priority === "high" ? "bg-rose-400" : d.priority === "medium" ? "bg-amber-400" : "bg-blue-400"}`} />{d.priority}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                      d.status === "new" ? "bg-slate-500/10 text-slate-400" :
                      d.status === "in_progress" ? "bg-amber-500/10 text-amber-400" :
                      "bg-emerald-500/10 text-emerald-400"
                    }`}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Trend */}
      {data!.monthlyTrend.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-[#0F1423] p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600" />
            <h3 className="text-[14px] font-semibold text-white">Monthly Trend</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {data!.monthlyTrend.map((m, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all">
                <p className="text-[11px] text-slate-500 mb-1">{m._id}</p>
                <p className="text-[18px] font-bold text-white leading-none">{m.claims}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">claims</p>
                <div className="mt-2.5 flex justify-between text-[10px] px-1">
                  <span className="text-emerald-400">{fmt$(m.paid)}</span>
                  <span className="text-rose-400">{m.denied} denied</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Powered Badge */}
      <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-600">
        <Brain className="w-3.5 h-3.5" />
        Powered by GPT-5.4 · 14 AI features active · HIPAA + DPDP compliant
      </div>
    </div>
  );
}
