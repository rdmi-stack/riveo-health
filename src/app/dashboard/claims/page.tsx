"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText, Search, Filter, ChevronLeft, ChevronRight,
  Loader2, Download, AlertTriangle, CheckCircle, Clock, MinusCircle,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  paid: { label: "Paid", color: "bg-green-500/10 text-green-400", icon: CheckCircle },
  denied: { label: "Denied", color: "bg-red-500/10 text-red-400", icon: AlertTriangle },
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-400", icon: Clock },
  partial: { label: "Partial", color: "bg-blue-500/10 text-blue-400", icon: MinusCircle },
};

function fmt$(n: number) { return `$${n.toLocaleString()}`; }

export default function ClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 50 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [payerFilter, setPayerFilter] = useState("");

  const fetchClaims = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ org: "demo", page: String(page), limit: "30" });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (payerFilter) params.set("payer", payerFilter);

      const res = await fetch(`/api/claims?${params}`);
      const data = await res.json();
      setClaims(data.claims || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0, limit: 30 });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, payerFilter]);

  useEffect(() => { fetchClaims(); }, [fetchClaims]);

  const exportCSV = () => {
    const headers = "Claim ID,Patient ID,Date of Service,Payer,CPT,ICD,Billed,Paid,Status,Denial Code\n";
    const rows = claims.map(c =>
      `${c.claimId},${c.patientId},${c.dateOfService?.slice(0,10)},${c.payer},${c.cptCode},${c.icdCode},${c.billedAmount},${c.paidAmount},${c.status},${c.denialCode || ""}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "riveo-claims-export.csv"; a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Claims</h1>
          <p className="text-sm text-slate-400">{pagination.total.toLocaleString()} total claims</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text" placeholder="Search claims..." value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchClaims()}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
          />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); }}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none appearance-none">
          <option value="" className="bg-slate-900">All Statuses</option>
          <option value="paid" className="bg-slate-900">Paid</option>
          <option value="denied" className="bg-slate-900">Denied</option>
          <option value="pending" className="bg-slate-900">Pending</option>
          <option value="partial" className="bg-slate-900">Partial</option>
        </select>
        <select value={payerFilter} onChange={e => { setPayerFilter(e.target.value); }}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none appearance-none">
          <option value="" className="bg-slate-900">All Payers</option>
          {["Medicare","Blue Cross Blue Shield","UnitedHealthcare","Aetna","Cigna","Medicaid"].map(p =>
            <option key={p} value={p} className="bg-slate-900">{p}</option>
          )}
        </select>
        <button onClick={() => fetchClaims()} className="px-4 py-2 rounded-lg bg-primary/10 text-primary-light text-sm font-medium hover:bg-primary/20 transition-all flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" /> Apply
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : claims.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <FileText className="w-10 h-10 mb-2" />
            <p>No claims found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-white/10 bg-white/5">
                  <th className="text-left px-4 py-3 font-medium">Claim ID</th>
                  <th className="text-left px-4 py-3 font-medium">Patient</th>
                  <th className="text-left px-4 py-3 font-medium">DOS</th>
                  <th className="text-left px-4 py-3 font-medium">Payer</th>
                  <th className="text-left px-4 py-3 font-medium">CPT</th>
                  <th className="text-left px-4 py-3 font-medium">Provider</th>
                  <th className="text-right px-4 py-3 font-medium">Billed</th>
                  <th className="text-right px-4 py-3 font-medium">Paid</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Denial</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((c, i) => {
                  const sc = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-300">{c.claimId}</td>
                      <td className="px-4 py-3 text-slate-300">{c.patientId}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{c.dateOfService?.slice(0, 10)}</td>
                      <td className="px-4 py-3 text-slate-300">{c.payer}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">{c.cptCode}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{c.provider}</td>
                      <td className="px-4 py-3 text-right text-white font-medium">{fmt$(c.billedAmount)}</td>
                      <td className="px-4 py-3 text-right text-slate-300">{fmt$(c.paidAmount)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${sc.color}`}>
                          <sc.icon className="w-3 h-3" /> {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {c.denialCode && (
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-xs font-mono">{c.denialCode}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <p className="text-xs text-slate-500">
              Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-1">
              <button disabled={pagination.page <= 1} onClick={() => fetchClaims(pagination.page - 1)}
                className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 text-xs text-slate-400">{pagination.page} / {pagination.pages}</span>
              <button disabled={pagination.page >= pagination.pages} onClick={() => fetchClaims(pagination.page + 1)}
                className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-30 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
