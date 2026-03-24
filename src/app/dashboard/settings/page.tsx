"use client";

import { useState } from "react";
import { Building2, Users, Shield, Bell, Database, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400">Manage your organization and preferences</p>
      </div>

      {saved && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" /> Settings saved successfully
        </div>
      )}

      {/* Organization */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-primary-light" />
          <h3 className="font-semibold text-white">Organization</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Practice Name</label>
            <input defaultValue="Demo Medical Group" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Specialty</label>
            <input defaultValue="Multi-Specialty" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Physicians</label>
            <input type="number" defaultValue={10} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">EHR System</label>
            <select className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none appearance-none">
              <option className="bg-slate-900">athenahealth</option>
              <option className="bg-slate-900">Epic</option>
              <option className="bg-slate-900">Cerner</option>
              <option className="bg-slate-900">eClinicalWorks</option>
              <option className="bg-slate-900">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-white">Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: "New denial alerts", desc: "Get notified when a claim is denied", defaultChecked: true },
            { label: "High-value claim alerts", desc: "Claims over $500 denied", defaultChecked: true },
            { label: "Weekly summary report", desc: "Email with key metrics every Monday", defaultChecked: false },
            { label: "Payer rule change alerts", desc: "When payer policies change", defaultChecked: true },
          ].map((n, i) => (
            <label key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <p className="text-sm text-white">{n.label}</p>
                <p className="text-xs text-slate-500">{n.desc}</p>
              </div>
              <input type="checkbox" defaultChecked={n.defaultChecked}
                className="w-4 h-4 rounded border-white/20 text-primary focus:ring-primary bg-white/5" />
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-green-400" />
          <h3 className="font-semibold text-white">Security & Compliance</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["HIPAA Compliant", "SOC 2 Type II", "AES-256 Encryption", "BAA Signed"].map(badge => (
            <div key={badge} className="flex items-center gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-xs text-green-400">{badge}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-opacity">
        Save Settings
      </button>
    </div>
  );
}
