"use client";
import { useState, useEffect } from "react";
import { Phone, Loader2, Mic, Send, User, Bot, Clock } from "lucide-react";

export default function VoiceAgentPage() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simInput, setSimInput] = useState("");
  const [simHistory, setSimHistory] = useState<any[]>([]);
  const [resolutions, setResolutions] = useState<any>({});

  async function fetchData() { setLoading(true); const r = await fetch("/api/voice-agent?org=demo"); const d = await r.json(); setCalls(d.calls || []); setResolutions(d.resolutions || {}); setLoading(false); }
  useEffect(() => { fetchData(); }, []);
  async function seed() { setSeeding(true); await fetch("/api/voice-agent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "seed_demo" }) }); await fetchData(); setSeeding(false); }

  async function simulate() {
    if (!simInput.trim()) return;
    const userMsg = simInput; setSimInput(""); setSimulating(true);
    setSimHistory(prev => [...prev, { role: "user", content: userMsg }]);
    const res = await fetch("/api/voice-agent", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "handle_call", callerMessage: userMsg, callHistory: simHistory }) });
    const data = await res.json();
    if (data.response) setSimHistory(prev => [...prev, { role: "assistant", content: data.response }]);
    setSimulating(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-[20px] font-bold text-gray-900">AI Voice Agent</h1><p className="text-[13px] text-gray-400">AI handles inbound patient billing calls — explains bills, sets up plans, initiates appeals</p></div>
        <button onClick={seed} disabled={seeding} className="px-3 py-1.5 text-[11px] rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">{seeding ? "Loading..." : "Load Demo Calls"}</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Call simulator */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-1 flex items-center gap-2"><Mic className="w-4 h-4 text-indigo-600" /> Call Simulator</h3>
          <p className="text-[11px] text-gray-400 mb-4">Test the voice agent — type what a patient would say on the phone</p>
          <div className="h-64 overflow-y-auto mb-3 space-y-2.5 p-3 rounded-lg bg-gray-50 border border-gray-100">
            {simHistory.length === 0 && <p className="text-[12px] text-gray-300 text-center py-8">Start a simulated call...</p>}
            {simHistory.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0"><Bot className="w-3 h-3 text-indigo-600" /></div>}
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-[12px] ${m.role === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-700 rounded-bl-sm"}`}>{m.content}</div>
                {m.role === "user" && <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0"><User className="w-3 h-3 text-gray-500" /></div>}
              </div>
            ))}
            {simulating && <div className="flex gap-2"><div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center"><Loader2 className="w-3 h-3 text-indigo-600 animate-spin" /></div><div className="px-3 py-2 rounded-xl bg-white border border-gray-200 rounded-bl-sm"><Loader2 className="w-3 h-3 text-indigo-500 animate-spin" /></div></div>}
          </div>
          <form onSubmit={e => { e.preventDefault(); simulate(); }} className="flex gap-2">
            <input value={simInput} onChange={e => setSimInput(e.target.value)} placeholder="Type what the patient says..."
              className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-300 text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            <button type="submit" disabled={simulating || !simInput.trim()} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"><Send className="w-4 h-4" /></button>
          </form>
        </div>

        {/* Call history + stats */}
        <div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl border border-gray-200 p-3 text-center"><p className="text-[18px] font-bold text-gray-900">{calls.length}</p><p className="text-[9px] text-gray-400">Total Calls</p></div>
            <div className="bg-white rounded-xl border border-emerald-200 p-3 text-center"><p className="text-[18px] font-bold text-emerald-600">{Object.values(resolutions).reduce((s: number, v: any) => s + v, 0) as number}</p><p className="text-[9px] text-gray-400">Resolved</p></div>
            <div className="bg-white rounded-xl border border-indigo-200 p-3 text-center"><p className="text-[18px] font-bold text-indigo-600">{"<"}3s</p><p className="text-[9px] text-gray-400">Avg Response</p></div>
          </div>
          {/* Resolution breakdown */}
          {Object.keys(resolutions).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
              <h4 className="text-[12px] font-semibold text-gray-900 mb-2">Resolutions</h4>
              <div className="space-y-1.5">{Object.entries(resolutions).map(([k, v]) => (
                <div key={k} className="flex justify-between text-[11px]"><span className="text-gray-500">{k.replace(/_/g, " ")}</span><span className="font-semibold text-gray-900">{v as number}</span></div>
              ))}</div>
            </div>
          )}
          {/* Recent calls */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="text-[12px] font-semibold text-gray-900 mb-2">Recent Calls</h4>
            {loading ? <Loader2 className="w-4 h-4 text-indigo-500 animate-spin mx-auto" /> :
            calls.length === 0 ? <p className="text-[11px] text-gray-400 text-center py-4">No calls yet</p> :
            <div className="space-y-2">{calls.slice(0, 5).map((c, i) => (
              <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex justify-between mb-1"><span className="text-[11px] font-medium text-gray-700">{c.patientId}</span><span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration ? `${Math.floor(c.duration / 60)}m ${c.duration % 60}s` : "—"}</span></div>
                <p className="text-[11px] text-gray-500 mb-1">&quot;{c.callerMessage}&quot;</p>
                <p className="text-[10px] text-indigo-600">{c.resolution?.replace(/_/g, " ") || c.status}</p>
              </div>
            ))}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
