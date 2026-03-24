"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ImportPage() {
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; denialsCreated: number } | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function parseCSV(text: string) {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_"));
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      const row: any = {};
      headers.forEach((h, j) => { row[h] = cols[j]?.trim() || ""; });
      const statusRaw = (row.status || "").toLowerCase();
      records.push({
        claimId: row.claim_id || row.claimid || `IMP-${i}`,
        patientId: row.patient_id || row.patientid || "",
        dateOfService: row.date_of_service || row.dos || "",
        payer: row.payer || row.insurance || "",
        cptCode: row.cpt_code || row.cpt || "",
        icdCode: row.icd_code || row.icd || "",
        billedAmount: row.billed_amount || row.billed || row.charges || "0",
        allowedAmount: row.allowed_amount || row.allowed || "0",
        paidAmount: row.paid_amount || row.paid || "0",
        status: statusRaw.includes("denied") ? "denied" : statusRaw.includes("paid") ? "paid" : statusRaw.includes("partial") ? "partial" : "pending",
        denialCode: row.denial_code || "",
        denialReason: row.denial_reason || "",
        dateSubmitted: row.date_submitted || "",
        provider: row.provider || "",
      });
    }
    return records;
  }

  async function handleFile(file: File) {
    setError("");
    setResult(null);
    if (!file.name.match(/\.csv$/i)) { setError("Please upload a CSV file."); return; }

    const text = await file.text();
    const claims = parseCSV(text);
    if (claims.length < 1) { setError("No valid claims found in file."); return; }

    setImporting(true);
    try {
      const res = await fetch("/api/claims/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId: "demo", claims }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Import failed");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Import Claims Data</h1>
        <p className="text-sm text-slate-400">Upload a CSV file to import claims into the system</p>
      </div>

      {/* Upload zone */}
      {!result && (
        <div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={e => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          onClick={() => fileRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition-all ${
            dragActive ? "border-primary bg-primary/10" : "border-white/20 bg-white/5 hover:border-white/40"
          }`}
        >
          <input ref={fileRef} type="file" accept=".csv" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          {importing ? (
            <>
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <p className="text-white font-medium">Importing claims...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />
              <p className="text-white font-medium mb-1">Drag & drop your claims CSV</p>
              <p className="text-slate-500 text-sm">or click to browse</p>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Success */}
      {result && (
        <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/5 p-8 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
          <h2 className="text-xl font-bold text-white mb-2">Import Successful!</h2>
          <p className="text-slate-400 mb-4">
            {result.imported} claims imported · {result.denialsCreated} denials auto-detected
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard/claims" className="px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 flex items-center gap-2">
              View Claims <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard/denials" className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5">
              Review Denials ({result.denialsCreated})
            </Link>
          </div>
        </div>
      )}

      {/* Expected format */}
      <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-accent" /> Expected CSV Format
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-slate-400">
          {["claim_id", "patient_id", "date_of_service", "payer", "cpt_code", "icd_code",
            "billed_amount", "paid_amount", "status", "denial_code", "denial_reason", "provider"
          ].map(col => <code key={col} className="bg-white/5 px-2 py-1 rounded text-xs">{col}</code>)}
        </div>
      </div>
    </div>
  );
}
