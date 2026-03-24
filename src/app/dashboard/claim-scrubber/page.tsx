"use client";
import { useState } from "react";
import { Shield, Loader2, CheckCircle, XCircle, AlertTriangle, Brain, Plus, Trash2 } from "lucide-react";

const DEFAULT_CLAIM = { payer: "UnitedHealthcare", cptCode: "99214", icdCode: "I10", modifier: "", billedAmount: 220, dateOfService: new Date().toISOString().split("T")[0] };

export default function ClaimScrubberPage() {
  const [claims, setClaims] = useState([{ ...DEFAULT_CLAIM }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  function add() { setClaims([...claims, { ...DEFAULT_CLAIM, cptCode: "99213", billedAmount: 150 }]); }
  function remove(i: number) { setClaims(claims.filter((_, j) => j !== i)); }
  function update(i: number, f: string, v: any) { const a = [...claims]; (a[i] as any)[f] = v; setClaims(a); }

  async function scrub() {
    setLoading(true); setResult(null);
    const res = await fetch("/api/claim-scrubber", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ claims }) });
    const data = await res.json();
    if (data.success) setResult(data);
    setLoading(false);
  }

  const ICON_MAP = { clean: CheckCircle, warning: AlertTriangle, error: XCircle };
  const COLOR_MAP = { clean: "text-emerald-600 bg-emerald-50 border-emerald-200", warning: "text-amber-600 bg-amber-50 border-amber-200", error: "text-rose-600 bg-rose-50 border-rose-200" };

  return (
    <div>
      <div className="mb-6"><h1 className="text-[20px] font-bold text-gray-900">Claim Scrubber</h1><p className="text-[13px] text-gray-400">Rules-based validation before submission — catch errors that cause denials</p></div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3"><h3 className="text-[13px] font-semibold text-gray-900">Claims to Scrub ({claims.length})</h3><button onClick={add} className="text-[11px] text-indigo-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button></div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {claims.map((c, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-center p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-[11px]">
                <select value={c.payer} onChange={e => update(i, "payer", e.target.value)} className="px-2 py-1.5 rounded bg-white border border-gray-200 text-gray-900 appearance-none focus:outline-none">
                  {["UnitedHealthcare", "BCBS", "Aetna", "Cigna", "Medicare", "Medicaid"].map(p => <option key={p}>{p}</option>)}
                </select>
                <input value={c.cptCode} onChange={e => update(i, "cptCode", e.target.value)} placeholder="CPT" className="px-2 py-1.5 rounded bg-white border border-gray-200 text-gray-900 font-mono focus:outline-none" />
                <input value={c.icdCode} onChange={e => update(i, "icdCode", e.target.value)} placeholder="ICD-10" className="px-2 py-1.5 rounded bg-white border border-gray-200 text-gray-900 font-mono focus:outline-none" />
                <input type="number" value={c.billedAmount} onChange={e => update(i, "billedAmount", parseInt(e.target.value))} className="px-2 py-1.5 rounded bg-white border border-gray-200 text-gray-900 focus:outline-none" />
                {claims.length > 1 && <button onClick={() => remove(i)} className="p-1 text-gray-300 hover:text-rose-500 justify-self-end"><Trash2 className="w-3 h-3" /></button>}
              </div>
            ))}
          </div>
          <button onClick={scrub} disabled={loading} className="mt-4 w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium text-[13px] hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />} {loading ? "Scrubbing..." : "Scrub Claims"}
          </button>
        </div>
        <div>
          {!result && !loading && <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><Shield className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-500">Add claims and click Scrub</p></div>}
          {loading && <div className="bg-white rounded-xl border border-indigo-200 p-12 text-center"><Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-3" /><p className="text-indigo-600">Checking against payer rules...</p></div>}
          {result && !loading && (
            <div className="space-y-3">
              {result.summary && (
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-white rounded-lg border border-gray-200 p-3 text-center"><p className="text-[16px] font-bold text-gray-900">{result.summary.total}</p><p className="text-[9px] text-gray-400">Checked</p></div>
                  <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-3 text-center"><p className="text-[16px] font-bold text-emerald-600">{result.summary.clean}</p><p className="text-[9px] text-gray-400">Clean</p></div>
                  <div className="bg-amber-50 rounded-lg border border-amber-200 p-3 text-center"><p className="text-[16px] font-bold text-amber-600">{result.summary.warnings}</p><p className="text-[9px] text-gray-400">Warnings</p></div>
                  <div className="bg-rose-50 rounded-lg border border-rose-200 p-3 text-center"><p className="text-[16px] font-bold text-rose-600">{result.summary.errors}</p><p className="text-[9px] text-gray-400">Errors</p></div>
                </div>
              )}
              {result.results?.map((r: any, i: number) => {
                const Icon = ICON_MAP[r.status as keyof typeof ICON_MAP] || AlertTriangle;
                const color = COLOR_MAP[r.status as keyof typeof COLOR_MAP] || COLOR_MAP.warning;
                return (
                  <div key={i} className={`rounded-xl border p-4 ${color}`}>
                    <div className="flex items-center gap-2 mb-2"><Icon className="w-4 h-4" /><span className="text-[12px] font-semibold">Claim {r.claimIndex + 1}: {claims[r.claimIndex]?.cptCode} — {r.status.toUpperCase()}</span></div>
                    {r.errors?.length > 0 ? r.errors.map((e: any, j: number) => (
                      <div key={j} className="ml-6 mb-1.5 text-[11px]"><p className="font-medium">{e.rule} ({e.field})</p><p className="opacity-80">{e.message}</p><p className="text-emerald-700 mt-0.5">Fix: {e.fix}</p></div>
                    )) : <p className="ml-6 text-[11px] opacity-80">No issues found — ready to submit</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
