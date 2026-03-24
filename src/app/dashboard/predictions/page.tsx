"use client";

import { useState, useEffect } from "react";
import {
  Shield, Loader2, AlertTriangle, CheckCircle, Clock,
  ArrowRight, Brain, TrendingUp, FileText, Zap, RefreshCw,
} from "lucide-react";

function fmt$(n: number) { return `$${n.toLocaleString()}`; }

const RISK_CONFIG = {
  high: { color: "bg-red-500/10 text-red-400 border-red-500/20", icon: AlertTriangle, label: "High Risk" },
  medium: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Clock, label: "Medium Risk" },
  low: { color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle, label: "Low Risk" },
};

export default function PredictionsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [predictions, setPredictions] = useState<any>(null);
  const [fetchingClaims, setFetchingClaims] = useState(true);

  useEffect(() => {
    fetch("/api/claims?org=demo&status=pending&limit=20")
      .then(r => r.json())
      .then(data => {
        // If no pending claims, get recent paid/denied as sample
        if (data.claims?.length > 0) {
          setClaims(data.claims);
        } else {
          fetch("/api/claims?org=demo&limit=20")
            .then(r => r.json())
            .then(d => setClaims(d.claims || []));
        }
      })
      .finally(() => setFetchingClaims(false));
  }, []);

  async function runPrediction() {
    if (claims.length === 0) return;
    setPredicting(true);
    setPredictions(null);
    try {
      const batch = claims.slice(0, 15).map(c => ({
        payer: c.payer,
        cptCode: c.cptCode,
        icdCode: c.icdCode,
        billedAmount: c.billedAmount,
        provider: c.provider,
        dateOfService: c.dateOfService,
      }));
      const res = await fetch("/api/claims/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claims: batch }),
      });
      const data = await res.json();
      if (data.success) setPredictions(data.prediction);
    } catch (e) {
      console.error("Prediction error:", e);
    } finally {
      setPredicting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Denial Prediction</h1>
          <p className="text-sm text-slate-400">AI scores each claim before submission — flag high-risk, fix before denied</p>
        </div>
        <button onClick={runPrediction} disabled={predicting || claims.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40">
          {predicting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {predicting ? "Analyzing..." : "Run Prediction on Claims"}
        </button>
      </div>

      {/* How it works */}
      {!predictions && !predicting && (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: FileText, title: "Pre-Submit Scan", desc: "AI reviews every claim against 2,000+ payer rules before it leaves your office" },
            { icon: AlertTriangle, title: "Risk Scoring", desc: "Each claim gets a 0-100 risk score with specific denial reasons flagged" },
            { icon: Zap, title: "Fix Before Denial", desc: "Actionable fixes for high-risk claims — prevent the denial, don't chase it after" },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/10 bg-white/5">
              <item.icon className="w-8 h-8 text-primary-light mb-3" />
              <h3 className="font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {predicting && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-16 text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-primary-light">Scoring {Math.min(claims.length, 15)} claims...</p>
          <p className="text-sm text-slate-400 mt-1">GPT-5.4 is checking payer rules, code validity, and denial patterns</p>
        </div>
      )}

      {/* Results */}
      {predictions && !predicting && (
        <div>
          {/* Batch Summary */}
          {predictions.batchSummary && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{predictions.batchSummary.totalClaims}</p>
                <p className="text-xs text-slate-500">Claims Scanned</p>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
                <p className="text-2xl font-bold text-red-400">{predictions.batchSummary.highRisk}</p>
                <p className="text-xs text-slate-500">High Risk</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{predictions.batchSummary.mediumRisk}</p>
                <p className="text-xs text-slate-500">Medium Risk</p>
              </div>
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{predictions.batchSummary.lowRisk}</p>
                <p className="text-xs text-slate-500">Low Risk</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{fmt$(predictions.batchSummary.totalAtRiskAmount || 0)}</p>
                <p className="text-xs text-slate-500">At-Risk Amount</p>
              </div>
            </div>
          )}

          {/* Individual Predictions */}
          <div className="space-y-3">
            {predictions.predictions?.map((p: any, i: number) => {
              const claim = claims[p.claimIndex] || claims[i];
              const rc = RISK_CONFIG[p.riskLevel as keyof typeof RISK_CONFIG] || RISK_CONFIG.medium;
              return (
                <div key={i} className={`rounded-xl border ${rc.color.split(" ").find((c: string) => c.startsWith("border-"))} bg-white/5 p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rc.color}`}>
                        <rc.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-mono text-xs text-slate-400">{claim?.claimId || `Claim ${i + 1}`}</p>
                        <p className="text-sm text-white">{claim?.payer} · {claim?.cptCode} · {fmt$(claim?.billedAmount || 0)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${p.riskScore > 70 ? "text-red-400" : p.riskScore > 40 ? "text-amber-400" : "text-green-400"}`}>
                        {p.riskScore}
                      </div>
                      <p className="text-[10px] text-slate-500">Risk Score</p>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  {p.riskFactors?.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {p.riskFactors.map((f: any, j: number) => (
                        <div key={j} className="flex items-start gap-2 text-sm">
                          <span className={`text-xs px-1.5 py-0.5 rounded mt-0.5 shrink-0 ${
                            f.severity === "high" ? "bg-red-500/10 text-red-400" : f.severity === "medium" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                          }`}>{f.severity}</span>
                          <div>
                            <p className="text-slate-300">{f.factor}</p>
                            <p className="text-xs text-green-400 mt-0.5">Fix: {f.fix}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      p.recommendation === "hold" ? "bg-red-500/10 text-red-400" :
                      p.recommendation === "review" ? "bg-amber-500/10 text-amber-400" :
                      "bg-green-500/10 text-green-400"
                    }`}>
                      {p.recommendation === "hold" ? "Hold — Fix Before Submitting" :
                       p.recommendation === "review" ? "Review Before Submitting" :
                       "Safe to Submit"}
                    </span>
                    {p.actionRequired && (
                      <p className="text-xs text-slate-500 max-w-xs text-right">{p.actionRequired}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Re-run */}
          <div className="mt-6 text-center">
            <button onClick={runPrediction}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all mx-auto text-sm">
              <RefreshCw className="w-4 h-4" /> Re-run Prediction
            </button>
          </div>
        </div>
      )}

      {/* No claims */}
      {!fetchingClaims && claims.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-white font-medium">No claims to analyze</p>
          <p className="text-sm text-slate-500 mt-1">Import claims data or load demo data from the Overview page first.</p>
        </div>
      )}
    </div>
  );
}
