"use client";

import { useState, useEffect } from "react";
import { BookOpen, Loader2, Search, Brain, AlertTriangle, CheckCircle, Plus, Filter } from "lucide-react";

const SEVERITY_COLORS: Record<string, string> = { high: "bg-red-500/10 text-red-400", medium: "bg-amber-500/10 text-amber-400", low: "bg-blue-500/10 text-blue-400" };
const CATEGORY_COLORS: Record<string, string> = {
  eligibility: "bg-blue-500/10 text-blue-400", authorization: "bg-purple-500/10 text-purple-400",
  coding: "bg-cyan-500/10 text-cyan-400", documentation: "bg-amber-500/10 text-amber-400",
  timely_filing: "bg-red-500/10 text-red-400", bundling: "bg-green-500/10 text-green-400",
  modifier: "bg-pink-500/10 text-pink-400", medical_necessity: "bg-orange-500/10 text-orange-400",
  coordination_of_benefits: "bg-slate-500/10 text-slate-400",
};

export default function PayerRulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [payerFilter, setPayerFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [payers, setPayers] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [seeding, setSeeding] = useState(false);

  async function fetchRules() {
    setLoading(true);
    const params = new URLSearchParams();
    if (payerFilter) params.set("payer", payerFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (searchQuery) params.set("search", searchQuery);
    const res = await fetch(`/api/payer-rules?${params}`);
    const data = await res.json();
    setRules(data.rules || []);
    setPayers(data.payers || []);
    setCategories(data.categories || []);
    setLoading(false);
  }

  useEffect(() => { fetchRules(); }, [payerFilter, categoryFilter]);

  async function seedRules() {
    setSeeding(true);
    const sampleDenials = [
      { payer: "UnitedHealthcare", denialCode: "CO-197", denialReason: "Prior authorization not obtained", cptCode: "73721" },
      { payer: "Blue Cross Blue Shield", denialCode: "CO-16", denialReason: "Missing referring provider NPI", cptCode: "99214" },
      { payer: "Aetna", denialCode: "CO-4", denialReason: "Modifier 25 required for E/M with procedure", cptCode: "99213" },
      { payer: "Medicare", denialCode: "CO-97", denialReason: "Service bundled with primary procedure", cptCode: "36415" },
      { payer: "Cigna", denialCode: "CO-22", denialReason: "Patient coverage terminated", cptCode: "99215" },
      { payer: "UnitedHealthcare", denialCode: "CO-29", denialReason: "Claim filed after 90-day timely filing limit", cptCode: "99203" },
      { payer: "Medicare", denialCode: "CO-50", denialReason: "ABN not obtained for non-covered service", cptCode: "93000" },
      { payer: "Aetna", denialCode: "CO-18", denialReason: "Duplicate claim — same DOS same CPT", cptCode: "71046" },
    ];
    for (const d of sampleDenials) {
      await fetch("/api/payer-rules", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
    }
    await fetchRules();
    setSeeding(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Payer Rules Intelligence</h1>
          <p className="text-sm text-slate-400">Auto-updating database of payer-specific rules learned from denials across all clients</p>
        </div>
        <button onClick={seedRules} disabled={seeding} className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40">
          {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          {seeding ? "Learning..." : "Learn from Sample Denials"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchRules()} placeholder="Search rules..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none" />
        </div>
        <select value={payerFilter} onChange={e => setPayerFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none appearance-none">
          <option value="" className="bg-slate-900">All Payers</option>
          {payers.map(p => <option key={p} className="bg-slate-900">{p}</option>)}
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none appearance-none">
          <option value="" className="bg-slate-900">All Categories</option>
          {categories.map(c => <option key={c} className="bg-slate-900">{c}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-2xl font-bold text-white">{rules.length}</p><p className="text-xs text-slate-500">Active Rules</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-2xl font-bold text-primary-light">{payers.length}</p><p className="text-xs text-slate-500">Payers Covered</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{rules.reduce((s, r) => s + (r.occurrences || 0), 0)}</p><p className="text-xs text-slate-500">Denials Prevented</p>
        </div>
      </div>

      {/* Rules list */}
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div> :
      rules.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-white font-medium">No rules learned yet</p>
          <p className="text-sm text-slate-500">Rules are auto-detected from denial patterns. Click &quot;Learn from Sample Denials&quot; to populate.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((r, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{r.ruleName}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${SEVERITY_COLORS[r.severity] || SEVERITY_COLORS.medium}`}>{r.severity}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${CATEGORY_COLORS[r.category] || "bg-white/10 text-slate-400"}`}>{r.category?.replace(/_/g, " ")}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-500">{r.occurrences}x seen</span>
                  <span className="text-xs text-slate-600 ml-2">{r.payer}</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-2">{r.ruleDescription}</p>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <div className="p-2 rounded bg-green-500/5 border border-green-500/10">
                  <p className="text-[10px] text-green-400 mb-0.5">Prevention</p>
                  <p className="text-xs text-slate-300">{r.preventionAction}</p>
                </div>
                <div className="p-2 rounded bg-blue-500/5 border border-blue-500/10">
                  <p className="text-[10px] text-blue-400 mb-0.5">Check Before Submit</p>
                  <p className="text-xs text-slate-300">{r.checkBeforeSubmit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                <span>Code: {r.denialCode}</span>
                {r.affectedCPTs?.length > 0 && <span>CPTs: {r.affectedCPTs.join(", ")}</span>}
                {r.affectedOrgs?.length > 1 && <span className="text-primary-light">{r.affectedOrgs.length} orgs affected</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
