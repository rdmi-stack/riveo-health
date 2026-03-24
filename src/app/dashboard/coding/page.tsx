"use client";

import { useState } from "react";
import {
  Brain, Loader2, CheckCircle, AlertTriangle, ArrowRight,
  FileText, Code, Zap, ChevronDown, ChevronUp, Info,
} from "lucide-react";

const SPECIALTIES = [
  "Family Medicine", "Internal Medicine", "Orthopedics", "Cardiology",
  "Gastroenterology", "Dermatology", "Pediatrics", "OB/GYN",
  "Radiology", "Emergency Medicine", "Oncology", "Neurology", "Other",
];

const SAMPLE_NOTES = [
  {
    label: "Office Visit — Hypertension + Diabetes",
    note: `Chief Complaint: Follow-up for hypertension and type 2 diabetes.
HPI: 58-year-old male presents for routine follow-up. Blood pressure has been well controlled on current medications. Reports occasional headaches. A1C last month was 7.2%, slightly above goal. No hypoglycemic episodes. Compliant with diet and exercise.
ROS: Denies chest pain, shortness of breath, vision changes. Reports mild fatigue.
Exam: BP 134/82, HR 76, BMI 31.2. Heart RRR, no murmurs. Lungs CTA. Extremities no edema. Monofilament testing intact bilateral feet.
Assessment: 1) Essential hypertension, controlled. 2) Type 2 diabetes mellitus without complications, A1C above goal. 3) Obesity.
Plan: Continue lisinopril 20mg daily. Increase metformin to 1000mg BID. Recheck A1C in 3 months. Discussed diet modifications. Return in 3 months.`,
  },
  {
    label: "ER Visit — Chest Pain",
    note: `Chief Complaint: Chest pain x 2 hours.
HPI: 62-year-old female presents to ED with substernal chest pain radiating to left arm, onset 2 hours ago at rest. Pain 7/10, pressure-like, associated with diaphoresis and nausea. No prior history of MI. Hx of hyperlipidemia and HTN.
Exam: BP 156/94, HR 102, SpO2 97%. Diaphoretic, anxious. Heart tachycardic, regular, no murmurs. Lungs clear. Abdomen soft.
ECG: ST elevation in leads II, III, aVF. Troponin I: 0.8 ng/mL (elevated).
Assessment: STEMI — inferior wall. Activated cath lab.
Plan: Aspirin 325mg, heparin drip, clopidogrel loading dose. Emergent cardiac catheterization. Admit to CCU.`,
  },
];

export default function CodingPage() {
  const [note, setNote] = useState("");
  const [specialty, setSpecialty] = useState("Family Medicine");
  const [encounterType, setEncounterType] = useState("Office Visit");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);

  async function analyze() {
    if (note.length < 20) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/coding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicalNote: note, specialty, encounterType }),
      });
      const data = await res.json();
      if (data.success) setResult(data.coding);
    } catch (e) {
      console.error("Coding error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Medical Coding</h1>
          <p className="text-sm text-slate-400">Paste clinical notes → get accurate ICD-10 & CPT code suggestions</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-4">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1 block">Specialty</label>
                <select value={specialty} onChange={e => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none appearance-none">
                  {SPECIALTIES.map(s => <option key={s} className="bg-slate-900">{s}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1 block">Encounter Type</label>
                <select value={encounterType} onChange={e => setEncounterType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none appearance-none">
                  {["Office Visit", "Emergency", "Inpatient", "Telehealth", "Procedure", "Consultation"].map(t =>
                    <option key={t} className="bg-slate-900">{t}</option>
                  )}
                </select>
              </div>
            </div>
            <label className="text-xs text-slate-400 mb-1 block">Clinical Note</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={14}
              placeholder="Paste clinical documentation here... (Chief Complaint, HPI, ROS, Exam, Assessment, Plan)"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary resize-none" />
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-slate-500">{note.length} characters</p>
              <button onClick={analyze} disabled={loading || note.length < 20}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                {loading ? "Analyzing..." : "Generate Codes"}
              </button>
            </div>
          </div>

          {/* Sample notes */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1"><Info className="w-3 h-3" /> Try a sample note:</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_NOTES.map((s, i) => (
                <button key={i} onClick={() => setNote(s.note)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary-light hover:bg-primary/20 transition-all">
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          {!result && !loading && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
              <Code className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">Paste a clinical note and click &quot;Generate Codes&quot;</p>
              <p className="text-xs text-slate-600 mt-1">GPT-5.4 will suggest ICD-10 and CPT codes with confidence scores</p>
            </div>
          )}

          {loading && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-12 text-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
              <p className="text-primary-light font-medium">Analyzing clinical documentation...</p>
              <p className="text-xs text-slate-500 mt-1">GPT-5.4 is reviewing diagnosis, procedures, and E/M level</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Summary */}
              {result.summary && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div><p className="text-lg font-bold text-white">{result.summary.totalIcdCodes}</p><p className="text-[10px] text-slate-500">ICD-10</p></div>
                    <div><p className="text-lg font-bold text-white">{result.summary.totalCptCodes}</p><p className="text-[10px] text-slate-500">CPT</p></div>
                    <div><p className="text-lg font-bold text-amber-400">{result.summary.alertCount}</p><p className="text-[10px] text-slate-500">Alerts</p></div>
                    <div><p className={`text-lg font-bold ${result.summary.documentationQuality === "excellent" || result.summary.documentationQuality === "good" ? "text-green-400" : "text-amber-400"}`}>
                      {result.summary.documentationQuality}</p><p className="text-[10px] text-slate-500">Doc Quality</p></div>
                  </div>
                </div>
              )}

              {/* ICD-10 Codes */}
              {result.icdCodes?.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary-light" /> ICD-10-CM Diagnosis Codes
                  </h3>
                  <div className="space-y-2">
                    {result.icdCodes.map((c: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-white/5 flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary-light">{c.code}</code>
                            <span className="text-sm text-white">{c.description}</span>
                          </div>
                          <p className="text-xs text-slate-500 bg-amber-500/5 border border-amber-500/10 rounded px-2 py-1 mt-1">&quot;{c.supportingText}&quot;</p>
                          {c.specificity && <p className="text-xs text-amber-400 mt-1">{c.specificity}</p>}
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded ${c.confidence >= 90 ? "bg-green-500/10 text-green-400" : c.confidence >= 70 ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>
                          {c.confidence}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CPT Codes */}
              {result.cptCodes?.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4 text-accent" /> CPT Procedure Codes
                  </h3>
                  <div className="space-y-2">
                    {result.cptCodes.map((c: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono px-2 py-0.5 rounded bg-accent/10 text-accent">{c.code}</code>
                            {c.modifier && <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">-{c.modifier}</code>}
                            <span className="text-sm text-white">{c.description}</span>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${c.confidence >= 90 ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>{c.confidence}%</span>
                        </div>
                        {c.emLevel && <p className="text-xs text-slate-400 mt-1">{c.emLevel}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coding Alerts */}
              {result.codingAlerts?.length > 0 && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Coding Alerts
                  </h3>
                  <div className="space-y-2">
                    {result.codingAlerts.map((a: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-white/5">
                        <div className="flex items-start gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full mt-0.5 shrink-0 ${
                            a.severity === "high" ? "bg-red-500/10 text-red-400" : a.severity === "medium" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                          }`}>{a.type.replace("_", " ")}</span>
                          <div>
                            <p className="text-sm text-slate-300">{a.message}</p>
                            {a.revenueImpact && <p className="text-xs text-red-400 mt-1">Revenue impact: {a.revenueImpact}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
