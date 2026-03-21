"use client";

import {
  Layers,
  ArrowDown,
  Cpu,
  Database,
  Globe,
  Shield,
} from "lucide-react";

const archLayers = [
  {
    icon: Globe,
    title: "Interface Layer",
    subtitle: "Patient & Staff Touchpoints",
    items: ["Chat Agent", "Voice Agent", "Email Agent", "WhatsApp Bot"],
    color: "border-indigo-500",
    bg: "bg-indigo-500",
  },
  {
    icon: Layers,
    title: "Application Layer",
    subtitle: "Core Business Systems",
    items: [
      "RCM Engine",
      "Denial Management",
      "Payments & Collections",
      "Workflow Automation",
    ],
    color: "border-cyan-500",
    bg: "bg-cyan-500",
  },
  {
    icon: Cpu,
    title: "Intelligence Layer",
    subtitle: "AI Core",
    items: [
      "Coding AI (ICD/CPT)",
      "Denial Prediction",
      "Next Best Action",
      "Conversational AI",
    ],
    color: "border-violet-500",
    bg: "bg-violet-500",
  },
  {
    icon: Database,
    title: "Data Layer",
    subtitle: "Unified Data Platform",
    items: [
      "Patient Records",
      "Claims Data",
      "Payment History",
      "Interaction Logs",
    ],
    color: "border-emerald-500",
    bg: "bg-emerald-500",
  },
  {
    icon: Shield,
    title: "Integration & Security",
    subtitle: "Enterprise Connectors",
    items: [
      "EHR/HIS Systems",
      "Insurance APIs",
      "HL7 / FHIR",
      "HIPAA / GDPR",
    ],
    color: "border-amber-500",
    bg: "bg-amber-500",
  },
];

export default function Architecture() {
  return (
    <section
      id="architecture"
      className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-4">
            Architecture
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Built for scale.{" "}
            <span className="text-accent">Designed for healthcare.</span>
          </h2>
          <p className="mt-6 text-lg text-slate-400 leading-relaxed">
            Microservices-based, event-driven architecture with multi-tenant
            support, horizontal scaling, and white-label capabilities.
          </p>
        </div>

        {/* Architecture Stack */}
        <div className="max-w-4xl mx-auto space-y-4">
          {archLayers.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <div key={layer.title}>
                <div
                  className={`relative bg-white/5 backdrop-blur-sm border-l-4 ${layer.color} rounded-xl p-6 hover:bg-white/10 transition-colors`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${layer.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <h3 className="text-lg font-bold">{layer.title}</h3>
                        <span className="text-sm text-slate-400">
                          {layer.subtitle}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {layer.items.map((item) => (
                          <span
                            key={item}
                            className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-slate-300"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {i < archLayers.length - 1 && (
                  <div className="flex justify-center my-1">
                    <ArrowDown className="w-5 h-5 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tech stack */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Backend", tech: "Node.js / Python FastAPI" },
            { label: "Frontend", tech: "React / Next.js" },
            { label: "AI Engine", tech: "LangChain / Custom Agents" },
            { label: "Cloud", tech: "AWS / GCP" },
          ].map((t) => (
            <div
              key={t.label}
              className="text-center p-6 bg-white/5 rounded-xl border border-white/10"
            >
              <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-2">
                {t.label}
              </p>
              <p className="text-sm text-slate-300 font-medium">{t.tech}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
