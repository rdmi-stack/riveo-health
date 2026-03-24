"use client";

import { useState, useEffect } from "react";
import {
  Shield, Loader2, CheckCircle, AlertTriangle, Clock, XCircle,
  ArrowRight, Brain, FileText, Plus, ChevronDown, ChevronUp, Send,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  draft: { color: "bg-slate-500/10 text-slate-400", icon: FileText, label: "Draft" },
  submitted: { color: "bg-blue-500/10 text-blue-400", icon: Send, label: "Submitted" },
  approved: { color: "bg-green-500/10 text-green-400", icon: CheckCircle, label: "Approved" },
  denied: { color: "bg-red-500/10 text-red-400", icon: XCircle, label: "Denied" },
  pending_review: { color: "bg-amber-500/10 text-amber-400", icon: Clock, label: "Peer Review" },
};

export default function PriorAuthPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [priorAuths, setPriorAuths] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [generatedPA, setGeneratedPA] = useState<any>(null);

  // Form
  const [form, setForm] = useState({
    patientId: "", payer: "UnitedHealthcare", cptCode: "", icdCode: "",
    procedure: "", provider: "", clinicalJustification: "",
  });

  useEffect(() => {
    fetch("/api/prior-auth?org=demo")
      .then(r => r.json())
      .then(data => setPriorAuths(data.priorAuths || []));
  }, []);

  async function generatePA(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    setGeneratedPA(null);
    try {
      const res = await fetch("/api/prior-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, orgId: "demo" }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedPA(data.priorAuth);
        // Refresh list
        const listRes = await fetch("/api/prior-auth?org=demo");
        const listData = await listRes.json();
        setPriorAuths(listData.priorAuths || []);
      }
    } catch (e) {
      console.error("PA error:", e);
    } finally {
      setGenerating(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/prior-auth", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setPriorAuths(prev => prev.map(p => p._id === id ? { ...p, status } : p));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Prior Authorization</h1>
          <p className="text-sm text-slate-400">AI generates auth requests that maximize approval probability</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setGeneratedPA(null); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Prior Auth
        </button>
      </div>

      {/* New PA Form */}
      {showForm && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-6">
          <h3 className="font-semibold text-white mb-4">Generate Prior Authorization Request</h3>
          <form onSubmit={generatePA} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Patient ID</label>
                <input value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}
                  placeholder="PAT-0001" className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Payer *</label>
                <select value={form.payer} onChange={e => setForm({ ...form, payer: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none appearance-none">
                  {["Medicare", "UnitedHealthcare", "Blue Cross Blue Shield", "Aetna", "Cigna", "Medicaid", "Humana", "Other"].map(p =>
                    <option key={p} className="bg-slate-900">{p}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Provider</label>
                <input value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })}
                  placeholder="Dr. Smith" className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">CPT Code *</label>
                <input required value={form.cptCode} onChange={e => setForm({ ...form, cptCode: e.target.value })}
                  placeholder="e.g., 27447" className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">ICD-10 Code</label>
                <input value={form.icdCode} onChange={e => setForm({ ...form, icdCode: e.target.value })}
                  placeholder="e.g., M17.11" className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Procedure *</label>
                <input required value={form.procedure} onChange={e => setForm({ ...form, procedure: e.target.value })}
                  placeholder="e.g., Total knee replacement" className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Clinical Justification (optional — AI will generate if blank)</label>
              <textarea value={form.clinicalJustification} onChange={e => setForm({ ...form, clinicalJustification: e.target.value })}
                rows={3} placeholder="Patient history, failed conservative treatments, clinical findings..."
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary resize-none" />
            </div>
            <button type="submit" disabled={generating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              {generating ? "Generating with GPT-5.4..." : "Generate Auth Request"}
            </button>
          </form>

          {/* AI Generated Result */}
          {generatedPA && (
            <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-green-400">Prior Auth Request Generated</h4>
                <span className={`ml-auto text-sm font-bold px-3 py-1 rounded-full ${
                  (generatedPA.approvalLikelihood || 0) >= 70 ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"
                }`}>{generatedPA.approvalLikelihood}% approval likelihood</span>
              </div>

              {generatedPA.authRequest && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Medical Necessity Statement</p>
                    <p className="text-sm text-slate-300 bg-white/5 rounded-lg p-3">{generatedPA.authRequest.medicalNecessityStatement}</p>
                  </div>
                  {generatedPA.authRequest.supportingCriteria?.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Supporting Criteria</p>
                      <ul className="space-y-1">
                        {generatedPA.authRequest.supportingCriteria.map((c: string, i: number) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400 mt-1 shrink-0" /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {generatedPA.authRequest.requiredDocuments?.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Required Documents to Attach</p>
                      <div className="flex flex-wrap gap-2">
                        {generatedPA.authRequest.requiredDocuments.map((d: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400">{d}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {generatedPA.tips?.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Tips to Increase Approval</p>
                      <ul className="space-y-1">
                        {generatedPA.tips.map((t: string, i: number) => (
                          <li key={i} className="text-xs text-amber-400 flex items-start gap-1.5">
                            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" /> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {generatedPA.estimatedTimeline && (
                    <div className="flex gap-4 pt-3 border-t border-white/10">
                      <div><p className="text-xs text-slate-500">Standard</p><p className="text-sm font-bold text-white">{generatedPA.estimatedTimeline.standardDays} days</p></div>
                      <div><p className="text-xs text-slate-500">Urgent</p><p className="text-sm font-bold text-amber-400">{generatedPA.estimatedTimeline.urgentDays} days</p></div>
                      <div><p className="text-xs text-slate-500">If Peer Review</p><p className="text-sm font-bold text-slate-400">{generatedPA.estimatedTimeline.peerReviewDays} days</p></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Existing PA List */}
      {priorAuths.length > 0 ? (
        <div className="space-y-3">
          {priorAuths.map((pa) => {
            const sc = STATUS_CONFIG[pa.status] || STATUS_CONFIG.draft;
            const isExpanded = expandedId === pa._id;
            return (
              <div key={pa._id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : pa._id)}>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2 items-center">
                    <div>
                      <p className="text-sm text-white">{pa.procedure}</p>
                      <p className="text-xs text-slate-500">{pa.patientId || "No patient"}</p>
                    </div>
                    <div><span className="text-sm text-slate-300">{pa.payer}</span></div>
                    <div><code className="text-xs font-mono text-slate-400">{pa.cptCode}</code></div>
                    <div>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${sc.color}`}>
                        <sc.icon className="w-3 h-3" /> {sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      {pa.approvalLikelihood && (
                        <span className={`text-xs font-bold ${pa.approvalLikelihood >= 70 ? "text-green-400" : "text-amber-400"}`}>
                          {pa.approvalLikelihood}%
                        </span>
                      )}
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>
                </div>
                {isExpanded && pa.aiGenerated?.authRequest && (
                  <div className="px-5 pb-5 border-t border-white/10 pt-4">
                    <p className="text-sm text-slate-300 mb-3">{pa.aiGenerated.authRequest.medicalNecessityStatement}</p>
                    <div className="flex gap-2">
                      {pa.status === "draft" && (
                        <button onClick={() => updateStatus(pa._id, "submitted")}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                          <Send className="w-3 h-3" /> Mark Submitted
                        </button>
                      )}
                      {(pa.status === "submitted" || pa.status === "pending_review") && (
                        <>
                          <button onClick={() => updateStatus(pa._id, "approved")}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20">
                            <CheckCircle className="w-3 h-3" /> Approved
                          </button>
                          <button onClick={() => updateStatus(pa._id, "denied")}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                            <XCircle className="w-3 h-3" /> Denied
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : !showForm && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <Shield className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-white font-medium">No prior authorizations yet</p>
          <p className="text-sm text-slate-500">Click &quot;New Prior Auth&quot; to generate your first AI-powered authorization request.</p>
        </div>
      )}
    </div>
  );
}
