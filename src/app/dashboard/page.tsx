"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  FileText,
  AlertTriangle,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";

interface Analytics {
  summary: {
    totalClaims: number;
    totalBilled: number;
    totalPaid: number;
    totalDenied: number;
    denialRate: number;
    collectionRate: number;
    outstandingAR: number;
  };
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

function StatCard({ title, value, subtitle, icon: Icon, trend, color }: {
  title: string; value: string; subtitle: string;
  icon: React.ElementType; trend?: "up" | "down"; color: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <div className="flex items-center gap-1 text-xs">
        {trend === "up" && <ArrowUpRight className="w-3 h-3 text-green-400" />}
        {trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-400" />}
        <span className={trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-slate-500"}>
          {subtitle}
        </span>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/analytics?org=demo");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Failed to fetch analytics:", e);
    } finally {
      setLoading(false);
    }
  }

  async function seedData() {
    setSeeding(true);
    try {
      await fetch("/api/seed?org=demo");
      await fetchData();
    } finally {
      setSeeding(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const d = data?.summary;
  const isEmpty = !d || d.totalClaims === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <FileText className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Claims Data Yet</h2>
        <p className="text-slate-400 mb-6 max-w-md">
          Import your claims data or load demo data to see your revenue dashboard in action.
        </p>
        <div className="flex gap-3">
          <button
            onClick={seedData}
            disabled={seeding}
            className="px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {seeding ? "Loading..." : "Load Demo Data (500 Claims)"}
          </button>
          <Link
            href="/dashboard/import"
            className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-all"
          >
            Import CSV
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Dashboard</h1>
          <p className="text-sm text-slate-400">Last 90 days overview</p>
        </div>
        <div className="flex gap-2">
          <button onClick={seedData} disabled={seeding} className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            {seeding ? "Refreshing..." : "Refresh Demo Data"}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Billed" value={fmt$(d!.totalBilled)} subtitle="Last 90 days"
          icon={DollarSign} color="bg-indigo-500"
        />
        <StatCard
          title="Total Collected" value={fmt$(d!.totalPaid)}
          subtitle={`${(d!.collectionRate * 100).toFixed(1)}% collection rate`}
          icon={TrendingUp} trend="up" color="bg-green-500"
        />
        <StatCard
          title="Denied Claims" value={d!.totalDenied.toLocaleString()}
          subtitle={`${(d!.denialRate * 100).toFixed(1)}% denial rate`}
          icon={AlertTriangle} trend="down" color="bg-red-500"
        />
        <StatCard
          title="Outstanding A/R" value={fmt$(d!.outstandingAR)}
          subtitle="Pending collection"
          icon={Clock} color="bg-amber-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Denials by Reason */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Top Denial Reasons</h3>
            <Link href="/dashboard/denials" className="text-xs text-primary-light hover:text-accent flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {data!.denialsByReason.slice(0, 6).map((d, i) => {
              const maxCount = data!.denialsByReason[0]?.count || 1;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{d._id}</span>
                    <span className="text-white font-medium">{d.count} claims · {fmt$(d.amount)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-700"
                      style={{ width: `${(d.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Denials by Payer */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold text-white mb-4">Denials by Payer</h3>
          <div className="space-y-3">
            {data!.denialsByPayer.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{p._id}</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-white">{p.count}</span>
                  <span className="text-xs text-slate-500 ml-1.5">{fmt$(p.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Denials */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Recent Denials</h3>
          <Link href="/dashboard/denials" className="text-xs text-primary-light hover:text-accent flex items-center gap-1">
            Manage all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/5">
                <th className="text-left pb-3 font-medium">Claim ID</th>
                <th className="text-left pb-3 font-medium">Payer</th>
                <th className="text-left pb-3 font-medium">Denial Code</th>
                <th className="text-right pb-3 font-medium">Amount</th>
                <th className="text-left pb-3 font-medium">Priority</th>
                <th className="text-left pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data!.recentDenials.map((d, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-3 text-slate-300 font-mono text-xs">{d.claimId}</td>
                  <td className="py-3 text-slate-300">{d.payer}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-xs font-mono">{d.denialCode}</span>
                  </td>
                  <td className="py-3 text-right text-white font-medium">${d.billedAmount}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      d.priority === "high" ? "bg-red-500/10 text-red-400" :
                      d.priority === "medium" ? "bg-amber-500/10 text-amber-400" :
                      "bg-blue-500/10 text-blue-400"
                    }`}>{d.priority}</span>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      d.status === "new" ? "bg-slate-500/10 text-slate-400" :
                      d.status === "in_progress" ? "bg-amber-500/10 text-amber-400" :
                      "bg-green-500/10 text-green-400"
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
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold text-white mb-4">Monthly Claims Trend</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {data!.monthlyTrend.map((m, i) => (
              <div key={i} className="text-center p-3 rounded-lg bg-white/5">
                <p className="text-xs text-slate-500 mb-1">{m._id}</p>
                <p className="text-lg font-bold text-white">{m.claims}</p>
                <p className="text-xs text-slate-400">claims</p>
                <div className="mt-2 flex justify-between text-[10px]">
                  <span className="text-green-400">{fmt$(m.paid)}</span>
                  <span className="text-red-400">{m.denied} denied</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
