"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare,
  Brain,
  BarChart3,
  Plug,
  Shield,
  ArrowRight,
  Bot,
  Mic,
  Smartphone,
  Mail,
  FileSearch,
  AlertTriangle,
  RefreshCw,
  Phone,
  Code,
  Lightbulb,
  LayoutDashboard,
  PieChart,
  Server,
  Lock,
} from "lucide-react";

const modules = [
  {
    id: "interaction",
    icon: MessageSquare,
    label: "Patient Interaction",
    headline: "Every patient touchpoint. Automated.",
    description:
      "AI agents handle billing queries, appointment scheduling, insurance verification, and payment reminders — across chat, voice, WhatsApp, and email. 24/7.",
    image: "/platform/interaction.jpg",
    color: "from-indigo-500 to-indigo-600",
    lightBg: "bg-indigo-500",
    metrics: [
      { value: "70%", label: "Auto-resolved" },
      { value: "< 3s", label: "Response time" },
      { value: "24/7", label: "Availability" },
    ],
    capabilities: [
      { icon: Bot, text: "AI Chat Agent" },
      { icon: Mic, text: "Voice Automation" },
      { icon: Smartphone, text: "WhatsApp & SMS" },
      { icon: Mail, text: "Email Outreach" },
    ],
    href: "/platform/patient-interaction",
  },
  {
    id: "revenue",
    icon: BarChart3,
    label: "Revenue Cycle",
    headline: "From claim to cash. Zero blind spots.",
    description:
      "End-to-end claim lifecycle management — from pre-submission scrubbing to denial prevention to automated resubmission. Every dollar tracked.",
    image: "/platform/revenue.jpg",
    color: "from-cyan-500 to-cyan-600",
    lightBg: "bg-cyan-500",
    metrics: [
      { value: "97%", label: "Clean claim rate" },
      { value: "60%", label: "Fewer denials" },
      { value: "18 days", label: "Avg. A/R" },
    ],
    capabilities: [
      { icon: FileSearch, text: "Claim Scrubbing" },
      { icon: AlertTriangle, text: "Denial Prevention" },
      { icon: RefreshCw, text: "Auto-Resubmission" },
      { icon: Phone, text: "Payment Follow-ups" },
    ],
    href: "/platform/revenue-intelligence",
  },
  {
    id: "ai",
    icon: Brain,
    label: "AI Engine",
    headline: "AI that thinks like your best coder and biller.",
    description:
      "Converts clinical notes to ICD/CPT codes in seconds. Predicts denials before submission. Recommends the next best action for every claim.",
    image: "/platform/ai.jpg",
    color: "from-violet-500 to-violet-600",
    lightBg: "bg-violet-500",
    metrics: [
      { value: "95%", label: "Coding accuracy" },
      { value: "< 2s", label: "Per-claim analysis" },
      { value: "40%", label: "Less manual review" },
    ],
    capabilities: [
      { icon: Code, text: "Auto-Coding (ICD/CPT)" },
      { icon: AlertTriangle, text: "Denial Prediction" },
      { icon: Lightbulb, text: "Next Best Action" },
      { icon: Bot, text: "Conversational AI" },
    ],
    href: "/platform/ai-engine",
  },
  {
    id: "analytics",
    icon: LayoutDashboard,
    label: "Analytics",
    headline: "See where every dollar goes.",
    description:
      "Real-time dashboards, revenue leakage detection, and payer performance tracking. Stop waiting for month-end reports.",
    image: "/platform/analytics.jpg",
    color: "from-emerald-500 to-emerald-600",
    lightBg: "bg-emerald-500",
    metrics: [
      { value: "$78K", label: "Avg. leakage found" },
      { value: "Real-time", label: "Data updates" },
      { value: "50+", label: "Reports" },
    ],
    capabilities: [
      { icon: LayoutDashboard, text: "Live Dashboards" },
      { icon: PieChart, text: "Leakage Detection" },
      { icon: BarChart3, text: "Payer Analytics" },
      { icon: Bot, text: "Staff Metrics" },
    ],
    href: "/platform/analytics",
  },
  {
    id: "integrations",
    icon: Plug,
    label: "Integrations",
    headline: "Plugs into what you already use.",
    description:
      "Native connectors for 40+ EHR/PM systems, clearinghouses, and payment gateways. HL7 FHIR compliant. Live in 7 days.",
    image: "/platform/integrations.jpg",
    color: "from-amber-500 to-amber-600",
    lightBg: "bg-amber-500",
    metrics: [
      { value: "40+", label: "Integrations" },
      { value: "< 7 days", label: "Setup time" },
      { value: "99.9%", label: "Uptime" },
    ],
    capabilities: [
      { icon: Server, text: "EHR / PM Systems" },
      { icon: Shield, text: "Payer APIs" },
      { icon: Lock, text: "HL7 / FHIR" },
      { icon: Plug, text: "Payment Gateways" },
    ],
    href: "/platform/integrations",
  },
];

export default function Platform() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = modules[activeIndex];

  return (
    <section id="platform" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Platform
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-surface-dark tracking-tight">
            One platform. Five powerful modules.
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Everything you need to control your revenue cycle — in one place.
          </p>
        </div>

        {/* Module Selector — Visual Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            const isActive = i === activeIndex;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveIndex(i)}
                className={`relative rounded-2xl p-5 text-left transition-all duration-300 border-2 ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                    isActive ? "gradient-bg" : "bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`}
                  />
                </div>
                <p
                  className={`text-sm font-bold ${
                    isActive ? "text-primary" : "text-surface-dark"
                  }`}
                >
                  {mod.label}
                </p>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-primary rotate-45 rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Module — Visual Showcase */}
        <div className="relative bg-slate-50 rounded-3xl overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-2 min-h-[500px]">
            {/* Left: Image + Overlay Metrics */}
            <div className="relative overflow-hidden">
              <Image
                src={active.image}
                alt={active.label}
                fill
                className="object-cover"
                key={active.id}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-transparent lg:bg-gradient-to-t lg:from-slate-900/90 lg:via-slate-900/50 lg:to-slate-900/20" />

              {/* Metrics floating on image */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex gap-6">
                  {active.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="text-2xl sm:text-3xl font-bold text-white">
                        {m.value}
                      </p>
                      <p className="text-xs text-slate-300 mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module badge on image */}
              <div className="absolute top-6 left-6">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${active.color} shadow-lg`}
                >
                  <active.icon className="w-3.5 h-3.5" />
                  {active.label}
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-surface-dark leading-tight mb-4">
                {active.headline}
              </h3>
              <p className="text-text-secondary leading-relaxed mb-8">
                {active.description}
              </p>

              {/* Capability Icons Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {active.capabilities.map((cap) => {
                  const CapIcon = cap.icon;
                  return (
                    <div
                      key={cap.text}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm"
                    >
                      <div className={`w-9 h-9 rounded-lg ${active.lightBg} bg-opacity-10 flex items-center justify-center`}>
                        <CapIcon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-surface-dark">
                        {cap.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <Link
                href={active.href}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                Explore {active.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom: See full platform CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/platform"
            className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white gradient-bg rounded-full hover:opacity-90 transition-all shadow-xl shadow-primary/25"
          >
            See the full platform
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
