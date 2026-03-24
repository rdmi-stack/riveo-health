"use client";

import { useState, useEffect } from "react";
import {
  Plug, CheckCircle, XCircle, Clock, Loader2, RefreshCw,
  Shield, AlertTriangle, ArrowRight, Wifi, WifiOff,
} from "lucide-react";

const EHR_SYSTEMS = [
  { id: "athenahealth", name: "athenahealth", desc: "Cloud-based EHR/PM. REST API + FHIR R4.", logo: "A", color: "bg-green-500", fields: [
    { key: "practiceId", label: "Practice ID", placeholder: "e.g., 195900" },
    { key: "apiKey", label: "API Key", placeholder: "Your athenahealth API key" },
    { key: "apiSecret", label: "API Secret", placeholder: "Your API secret", type: "password" },
  ]},
  { id: "epic", name: "Epic", desc: "FHIR R4 integration via Epic App Orchard.", logo: "E", color: "bg-red-500", fields: [
    { key: "clientId", label: "Client ID", placeholder: "Epic App Orchard client ID" },
    { key: "fhirEndpoint", label: "FHIR Endpoint", placeholder: "https://fhir.epic.com/..." },
    { key: "privateKey", label: "Private Key", placeholder: "PEM private key", type: "password" },
  ]},
  { id: "cerner", name: "Oracle Health (Cerner)", desc: "FHIR R4 integration.", logo: "C", color: "bg-orange-500", fields: [
    { key: "clientId", label: "Client ID", placeholder: "Cerner client ID" },
    { key: "clientSecret", label: "Client Secret", placeholder: "Client secret", type: "password" },
    { key: "fhirEndpoint", label: "FHIR Endpoint", placeholder: "https://fhir.cerner.com/..." },
  ]},
  { id: "eclinicalworks", name: "eClinicalWorks", desc: "HL7 + REST API integration.", logo: "eC", color: "bg-blue-500", fields: [
    { key: "practiceId", label: "Practice ID", placeholder: "eCW practice ID" },
    { key: "apiToken", label: "API Token", placeholder: "Your eCW API token", type: "password" },
    { key: "endpoint", label: "API Endpoint", placeholder: "https://..." },
  ]},
  { id: "allscripts", name: "Allscripts", desc: "Unity API integration.", logo: "As", color: "bg-purple-500", fields: [
    { key: "appName", label: "App Name", placeholder: "Registered app name" },
    { key: "appUsername", label: "Username", placeholder: "API username" },
    { key: "appPassword", label: "Password", placeholder: "API password", type: "password" },
    { key: "serviceUrl", label: "Service URL", placeholder: "https://..." },
  ]},
  { id: "nextgen", name: "NextGen", desc: "REST API + FHIR.", logo: "NG", color: "bg-teal-500", fields: [
    { key: "siteId", label: "Site ID", placeholder: "NextGen site ID" },
    { key: "apiKey", label: "API Key", placeholder: "Your API key", type: "password" },
    { key: "endpoint", label: "Endpoint", placeholder: "https://..." },
  ]},
];

export default function EHRConnectPage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [selectedEHR, setSelectedEHR] = useState<string | null>(null);
  const [creds, setCreds] = useState<Record<string, string>>({});
  const [syncFreq, setSyncFreq] = useState("daily");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/ehr?org=demo")
      .then(r => r.json())
      .then(d => setConnections(d.connections || []))
      .finally(() => setLoading(false));
  }, []);

  const ehrConfig = EHR_SYSTEMS.find(e => e.id === selectedEHR);

  async function connectEHR(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEHR) return;
    setConnecting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/ehr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ehrSystem: selectedEHR, credentials: creds, syncFrequency: syncFreq }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(data.connection.message);
      setSelectedEHR(null);
      setCreds({});
      // Refresh
      const updated = await fetch("/api/ehr?org=demo").then(r => r.json());
      setConnections(updated.connections || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">EHR Integrations</h1>
          <p className="text-sm text-slate-400">Connect your EHR system to auto-sync claims, patients, and billing data</p>
        </div>
      </div>

      {/* Active connections */}
      {connections.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-white mb-3">Active Connections</h3>
          <div className="space-y-3">
            {connections.map((c, i) => (
              <div key={i} className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{c.ehrName}</p>
                    <p className="text-xs text-slate-400">Connected · Sync: {c.syncFrequency} · {c.claimsSynced || 0} claims synced</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-green-400"><CheckCircle className="w-3 h-3" /> Connected</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" /> {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Select EHR to connect */}
      {!selectedEHR && (
        <div>
          <h3 className="font-semibold text-white mb-3">Connect an EHR System</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EHR_SYSTEMS.map((ehr) => {
              const connected = connections.some(c => c.ehrSystem === ehr.id);
              return (
                <button key={ehr.id} onClick={() => { if (!connected) { setSelectedEHR(ehr.id); setCreds({}); } }}
                  disabled={connected}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    connected ? "border-green-500/20 bg-green-500/5 opacity-70" : "border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/5"
                  }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg ${ehr.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {ehr.logo}
                    </div>
                    <div>
                      <p className="font-medium text-white">{ehr.name}</p>
                      {connected && <span className="text-[10px] text-green-400">Connected</span>}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">{ehr.desc}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-slate-400">
              <Shield className="w-4 h-4 inline mr-1 text-green-500" />
              All connections use encrypted credentials (AES-256). We support HL7 FHIR R4 standard.
              Need a different EHR? <span className="text-primary-light">Contact us</span> — we add new integrations in 2-3 weeks.
            </p>
          </div>
        </div>
      )}

      {/* Connection form */}
      {selectedEHR && ehrConfig && (
        <div className="max-w-xl">
          <button onClick={() => { setSelectedEHR(null); setError(""); }}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 transition-colors">
            ← Back to EHR list
          </button>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${ehrConfig.color} flex items-center justify-center text-white text-xs font-bold`}>
                {ehrConfig.logo}
              </div>
              <div>
                <h3 className="font-semibold text-white">Connect {ehrConfig.name}</h3>
                <p className="text-xs text-slate-400">{ehrConfig.desc}</p>
              </div>
            </div>
            <form onSubmit={connectEHR} className="space-y-4">
              {ehrConfig.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-xs text-slate-400 mb-1 block">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    required
                    value={creds[field.key] || ""}
                    onChange={e => setCreds({ ...creds, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Sync Frequency</label>
                <select value={syncFreq} onChange={e => setSyncFreq(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none appearance-none">
                  <option value="realtime" className="bg-slate-900">Real-time</option>
                  <option value="hourly" className="bg-slate-900">Hourly</option>
                  <option value="daily" className="bg-slate-900">Daily</option>
                </select>
              </div>
              <button type="submit" disabled={connecting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 disabled:opacity-50">
                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plug className="w-4 h-4" />}
                {connecting ? "Connecting..." : `Connect ${ehrConfig.name}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
