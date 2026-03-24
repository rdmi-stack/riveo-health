"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign, TrendingUp, AlertTriangle, Clock,
  ArrowRight, ArrowUpRight, ArrowDownRight, Loader2, FileText, Sparkles, Brain,
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
  async function fetchData() { try { setData(await (await fetch("/api/analytics?org=demo")).json()); } catch {} finally { setLoading(false); } }
  async function seedData() { setSeeding(true); try { await fetch("/api/seed?org=demo"); await fetchData(); } finally { setSeeding(false); } }

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  const d = data?.summary;
  if (!d || d.totalClaims === 0) return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-indigo-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to Riveo Health</h2>
      <p className="text-gray-500 mb-6 max-w-sm">Import your claims data or load demo data to see your revenue dashboard.</p>
      <div className="flex gap-3">
        <button onClick={seedData} disabled={seeding}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
          {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {seeding ? "Loading..." : "Load Demo Data"}
        </button>
        <Link href="/dashboard/import" className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">Import CSV</Link>
      </div>
    </div>
  );

  const PAYER_COLORS = ["#6366f1", "#06b6d4", "#f43f5e", "#f59e0b", "#8b5cf6", "#10b981"];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900">Revenue Dashboard</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">Last 90 days · All payers</p>
        </div>
        <button onClick={seedData} disabled={seeding} className="px-3 py-1.5 text-[11px] rounded-md border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all">
          {seeding ? "Refreshing..." : "Refresh Demo"}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Billed", value: fmt$(d.totalBilled), sub: "Last 90 days", icon: DollarSign, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
          { title: "Collected", value: fmt$(d.totalPaid), sub: `${(d.collectionRate * 100).toFixed(1)}% rate`, icon: TrendingUp, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", trend: "up" as const },
          { title: "Denied Claims", value: d.totalDenied.toLocaleString(), sub: `${(d.denialRate * 100).toFixed(1)}% denial rate`, icon: AlertTriangle, iconBg: "bg-rose-50", iconColor: "text-rose-600", trend: "down" as const },
          { title: "Outstanding A/R", value: fmt$(d.outstandingAR), sub: "Pending collection", icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{card.title}</span>
              <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-[17px] h-[17px] ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-[26px] font-bold text-gray-900 tracking-tight leading-none mb-1">{card.value}</p>
            <div className="flex items-center gap-1 text-[12px]">
              {card.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />}
              {card.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />}
              <span className={card.trend === "up" ? "text-emerald-600" : card.trend === "down" ? "text-rose-600" : "text-gray-400"}>{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two column */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        {/* Denial reasons */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-gray-900">Top Denial Reasons</h3>
            <Link href="/dashboard/denials" className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {data!.denialsByReason.slice(0, 6).map((d, i) => {
              const max = data!.denialsByReason[0]?.count || 1;
              return (
                <div key={i}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-gray-700 font-medium">{d._id}</span>
                    <span className="text-gray-900 font-semibold tabular-nums">{d.count} <span className="text-gray-400 font-normal">· {fmt$(d.amount)}</span></span>
                  </div>
                  <div className="h-[5px] rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-amber-400" style={{ width: `${(d.count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Payer */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-4">By Payer</h3>
          <div className="space-y-2.5">
            {data!.denialsByPayer.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: PAYER_COLORS[i] || "#94a3b8" }} />
                  <span className="text-[12px] text-gray-600">{p._id}</span>
                </div>
                <div>
                  <span className="text-[12px] font-semibold text-gray-900 tabular-nums">{p.count}</span>
                  <span className="text-[11px] text-gray-400 ml-1.5">{fmt$(p.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Denials */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-[14px] font-semibold text-gray-900">Recent Denials</h3>
          <Link href="/dashboard/denials" className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium">Manage <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-[11px] text-gray-400 uppercase tracking-wider bg-gray-50/80">
              <th className="text-left px-5 py-2.5 font-semibold">Claim</th>
              <th className="text-left px-5 py-2.5 font-semibold">Payer</th>
              <th className="text-left px-5 py-2.5 font-semibold">Code</th>
              <th className="text-right px-5 py-2.5 font-semibold">Amount</th>
              <th className="text-left px-5 py-2.5 font-semibold">Priority</th>
              <th className="text-left px-5 py-2.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {data!.recentDenials.map((d, i) => (
              <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3 text-[12px] font-mono text-gray-500">{d.claimId}</td>
                <td className="px-5 py-3 text-[12px] text-gray-700">{d.payer}</td>
                <td className="px-5 py-3"><span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 text-[11px] font-mono font-medium">{d.denialCode}</span></td>
                <td className="px-5 py-3 text-right text-[12px] font-semibold text-gray-900 tabular-nums">${d.billedAmount}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    d.priority === "high" ? "bg-rose-50 text-rose-700" : d.priority === "medium" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"
                  }`}><span className={`w-1 h-1 rounded-full ${d.priority === "high" ? "bg-rose-500" : d.priority === "medium" ? "bg-amber-500" : "bg-blue-500"}`} />{d.priority}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    d.status === "new" ? "bg-gray-100 text-gray-600" : d.status === "in_progress" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                  }`}>{d.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monthly Trend */}
      {data!.monthlyTrend.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Monthly Trend</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {data!.monthlyTrend.map((m, i) => (
              <div key={i} className="text-center p-3.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all">
                <p className="text-[11px] text-gray-400">{m._id}</p>
                <p className="text-[18px] font-bold text-gray-900 leading-none mt-1">{m.claims}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">claims</p>
                <div className="mt-2 flex justify-between text-[10px] px-0.5">
                  <span className="text-emerald-600">{fmt$(m.paid)}</span>
                  <span className="text-rose-500">{m.denied} denied</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-gray-300">
        <Brain className="w-3.5 h-3.5" /> AI-Powered · HIPAA + DPDP Compliant
      </div>
    </div>
  );
}
