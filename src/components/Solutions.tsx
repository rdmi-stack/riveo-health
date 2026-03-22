"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Stethoscope,
  HandCoins,
  FileCheck,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const solutions = [
  {
    id: "hospitals",
    icon: Building2,
    label: "Hospitals & Health Systems",
    shortLabel: "Hospitals",
    image: "/solutions/hospital.jpg",
    color: "from-indigo-500 to-indigo-600",
    lightBg: "bg-indigo-500",
    headline: "Enterprise revenue intelligence for multi-facility health systems",
    description:
      "Single pane of glass into revenue performance across every facility. AI monitors every claim, flags anomalies, and resolves denials before they hit your bottom line.",
    benefits: [
      "Unified dashboard across all facilities",
      "AI denial prevention (up to 60% reduction)",
      "Automate 80% of patient interactions",
      "Epic, Cerner, MEDITECH integrations",
    ],
    metrics: [
      { value: "60%", label: "Denial Reduction" },
      { value: "80%", label: "Interactions Automated" },
      { value: "< 7 days", label: "Go-Live" },
    ],
    href: "/solutions/hospitals",
  },
  {
    id: "practices",
    icon: Stethoscope,
    label: "Physician Practices",
    shortLabel: "Practices",
    image: "/solutions/practice.jpg",
    color: "from-cyan-500 to-cyan-600",
    lightBg: "bg-cyan-500",
    headline: "Let doctors focus on patients, not paperwork",
    description:
      "From appointment scheduling to final payment, Riveo Health automates the entire revenue cycle. AI resolves billing issues before staff even see them.",
    benefits: [
      "Automated reminders & follow-ups",
      "AI billing query resolution",
      "Real-time insurance verification",
      "Patient payment portals",
    ],
    metrics: [
      { value: "40%", label: "Less Admin Work" },
      { value: "97%", label: "Clean Claim Rate" },
      { value: "$499", label: "Starting Price" },
    ],
    href: "/solutions/practices",
  },
  {
    id: "rcm",
    icon: HandCoins,
    label: "RCM Companies",
    shortLabel: "RCM Firms",
    image: "/solutions/rcm.jpg",
    color: "from-violet-500 to-violet-600",
    lightBg: "bg-violet-500",
    headline: "White-label AI that supercharges your RCM business",
    description:
      "Offer AI-powered revenue cycle management to your clients under your brand. Scale without hiring. Retain clients with better outcomes.",
    benefits: [
      "White-label deployment",
      "Multi-tenant architecture",
      "AI claim scrubbing per client",
      "Client performance analytics",
    ],
    metrics: [
      { value: "3x", label: "Claims per FTE" },
      { value: "White", label: "Label Ready" },
      { value: "Multi", label: "Tenant" },
    ],
    href: "/solutions/rcm",
  },
  {
    id: "billing",
    icon: FileCheck,
    label: "Billing Services",
    shortLabel: "Billing",
    image: "/solutions/billing.jpg",
    color: "from-amber-500 to-amber-600",
    lightBg: "bg-amber-500",
    headline: "Transform manual billing into AI-driven revenue machines",
    description:
      "End-to-end automation from charge capture to payment posting. AI coding, denial management, and real-time analytics replace manual workflows.",
    benefits: [
      "AI auto-coding (ICD-10/CPT)",
      "Automated denial management",
      "End-to-end workflow automation",
      "Real-time revenue analytics",
    ],
    metrics: [
      { value: "97%", label: "First-Pass Rate" },
      { value: "< 2s", label: "Per-Claim AI" },
      { value: "50+", label: "Reports" },
    ],
    href: "/solutions/billing",
  },
];

export default function Solutions() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = solutions[activeIndex];

  return (
    <section id="solutions" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Solutions
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-surface-dark tracking-tight">
            Built for everyone in{" "}
            <span className="gradient-text">healthcare revenue</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            From 5-provider practices to 500-bed health systems — Riveo Health adapts to your scale.
          </p>
        </div>

        {/* Solution Selector Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {solutions.map((sol, i) => {
            const Icon = sol.icon;
            const isActive = i === activeIndex;
            return (
              <button
                key={sol.id}
                onClick={() => setActiveIndex(i)}
                className={`relative rounded-2xl p-5 text-left transition-all duration-300 border-2 ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-transparent bg-white hover:border-gray-200 hover:shadow-md"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${
                    isActive ? "gradient-bg" : "bg-gray-100"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                </div>
                <p className={`text-sm font-bold ${isActive ? "text-primary" : "text-surface-dark"}`}>
                  {sol.shortLabel}
                </p>
                <p className="text-xs text-text-muted mt-0.5 hidden sm:block">
                  {sol.label}
                </p>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-primary rotate-45 rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Solution — Visual Showcase */}
        <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid lg:grid-cols-2 min-h-[520px]">
            {/* Left: Image + Metrics */}
            <div className="relative overflow-hidden">
              <Image
                src={active.image}
                alt={active.label}
                fill
                className="object-cover"
                key={active.id}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/20" />

              {/* Badge */}
              <div className="absolute top-6 left-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${active.color} shadow-lg`}>
                  <active.icon className="w-3.5 h-3.5" />
                  {active.shortLabel}
                </div>
              </div>

              {/* Metrics on image */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="grid grid-cols-3 gap-4">
                  {active.metrics.map((m) => (
                    <div key={m.label} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                      <p className="text-2xl font-bold text-white">{m.value}</p>
                      <p className="text-xs text-slate-300 mt-0.5">{m.label}</p>
                    </div>
                  ))}
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

              {/* Benefits */}
              <ul className="space-y-3 mb-8">
                {active.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-surface-dark">{b}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={active.href}
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white gradient-bg rounded-full hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-primary bg-primary/5 border border-primary/20 rounded-full hover:bg-primary/10 transition-all"
                >
                  Get a free audit
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: All Solutions link */}
        <div className="mt-12 text-center">
          <Link
            href="/solutions"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            View all solutions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
