"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Brain,
  Layers,
  ShieldCheck,
  Zap,
  Database,
  Clock,
  Activity,
} from "lucide-react";

const comparisonData = [
  {
    feature: "Architecture",
    legacy: "Bolt-on AI",
    riveo: "AI-native from day one",
  },
  {
    feature: "Implementation",
    legacy: "3-6 months",
    riveo: "7 days",
  },
  {
    feature: "Claim Scrubbing",
    legacy: "Manual review",
    riveo: "Automated AI validation",
  },
  {
    feature: "Denial Management",
    legacy: "Reactive",
    riveo: "Predictive prevention",
  },
  {
    feature: "Coding",
    legacy: "Manual coders",
    riveo: "AI auto-coding (ICD/CPT)",
  },
  {
    feature: "Patient Comms",
    legacy: "Call center",
    riveo: "AI multi-channel (chat, voice, SMS)",
  },
  {
    feature: "Data",
    legacy: "Siloed across tools",
    riveo: "Unified platform",
  },
  {
    feature: "Pricing",
    legacy: "Per-user, locked contracts",
    riveo: "Usage-based, month-to-month",
  },
];

const differentiators = [
  {
    icon: Brain,
    title: "AI-Native Architecture",
    description:
      "Not a chatbot bolted onto 20-year-old software. Riveo Health was built from the ground up with AI at its core -- every workflow, every decision point, every automation is powered by purpose-built models trained on healthcare revenue data.",
    points: [
      "Models trained on 50M+ real healthcare claims",
      "Continuous learning from your specific payer mix",
      "Sub-2-second analysis on every claim",
    ],
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: Layers,
    title: "Unified Platform",
    description:
      "One system replacing 10+ disconnected tools. Stop paying for a billing system, a coding tool, a denial manager, a patient communication platform, and an analytics dashboard separately. Riveo Health is all of them -- unified, integrated, and intelligent.",
    points: [
      "Single source of truth for all revenue data",
      "Eliminate data reconciliation across tools",
      "40+ EHR and payer integrations out of the box",
    ],
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: ShieldCheck,
    title: "Risk-Free Engagement",
    description:
      "Free audit, no contracts, ROI guarantee. We believe in earning your trust through results, not locking you in with multi-year agreements. Start with a free revenue leakage audit, go month-to-month, and hold us accountable to measurable outcomes.",
    points: [
      "Free revenue leakage audit before you commit",
      "Month-to-month pricing, cancel anytime",
      "ROI guarantee backed by performance metrics",
    ],
    gradient: "from-emerald-500 to-teal-500",
  },
];

const proofPoints = [
  { value: "50M+", label: "Claims trained", icon: Database },
  { value: "40+", label: "EHR integrations", icon: Activity },
  { value: "97%", label: "Coding accuracy", icon: CheckCircle2 },
  { value: "< 2s", label: "Analysis time", icon: Clock },
];

export default function WhyRiveoPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[105px]">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-28 lg:py-36">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-500/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-indigo-200 mb-8 backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              Competitive Advantage
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl mx-auto">
              Why healthcare leaders choose{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                Riveo Health
              </span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Legacy RCM vendors bolt AI onto decades-old infrastructure. Riveo
              Health is AI-native from day one -- purpose-built to maximize
              revenue, eliminate denials, and automate the entire cycle.
            </p>
            <div className="mt-10">
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl"
              >
                See It In Action
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== COMPARISON TABLE ===== */}
        <section className="py-24 lg:py-28 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                Side by Side
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-surface-dark">
                Legacy RCM vs Riveo Health
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed text-lg max-w-2xl mx-auto">
                See how a modern, AI-native approach compares to the legacy
                tools most health systems are stuck with today.
              </p>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
              {/* Header */}
              <div className="grid grid-cols-3 bg-slate-900">
                <div className="px-6 py-5 text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Feature
                </div>
                <div className="px-6 py-5 text-sm font-bold text-red-400 uppercase tracking-wider text-center">
                  Legacy RCM
                </div>
                <div className="px-6 py-5 text-sm font-bold text-emerald-400 uppercase tracking-wider text-center">
                  Riveo Health
                </div>
              </div>

              {/* Rows */}
              {comparisonData.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-3 items-center ${
                    i % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  } ${
                    i < comparisonData.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  } hover:bg-indigo-50/30 transition-colors duration-200`}
                >
                  <div className="px-6 py-5 text-sm font-semibold text-surface-dark">
                    {row.feature}
                  </div>
                  <div className="px-6 py-5 flex items-center justify-center gap-2.5 text-sm text-text-secondary">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <XCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <span>{row.legacy}</span>
                  </div>
                  <div className="px-6 py-5 flex items-center justify-center gap-2.5 text-sm font-medium text-surface-dark">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span>{row.riveo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== KEY DIFFERENTIATORS ===== */}
        <section className="py-24 lg:py-28 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                What Sets Us Apart
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-surface-dark">
                Key Differentiators
              </h2>
            </div>

            <div className="space-y-24">
              {differentiators.map((item, i) => {
                const Icon = item.icon;
                const isReversed = i % 2 !== 0;
                return (
                  <div
                    key={item.title}
                    className={`flex flex-col ${
                      isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                    } items-center gap-12 lg:gap-20`}
                  >
                    {/* Icon side */}
                    <div className="lg:w-5/12 flex justify-center">
                      <div className="relative group">
                        <div className={`w-48 h-48 rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300`}>
                          <Icon className="w-24 h-24 text-white/90" />
                        </div>
                        <div className={`absolute -inset-3 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-20 blur-xl -z-10`} />
                        <div className={`absolute -inset-6 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-10 blur-2xl -z-20`} />
                      </div>
                    </div>

                    {/* Content side */}
                    <div className="lg:w-7/12">
                      <h3 className="text-2xl md:text-3xl font-extrabold text-surface-dark mb-4">
                        {item.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed mb-8 text-lg">
                        {item.description}
                      </p>
                      <ul className="space-y-4">
                        {item.points.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-3 text-surface-dark"
                          >
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="font-medium">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== TECHNOLOGY PROOF POINTS ===== */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-primary to-cyan-600" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-bold text-indigo-200 uppercase tracking-widest mb-12">
              By the Numbers
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {proofPoints.map((point) => {
                const PointIcon = point.icon;
                return (
                  <div key={point.label} className="text-center group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                      <PointIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                      {point.value}
                    </p>
                    <p className="mt-2 text-sm text-indigo-100 font-semibold uppercase tracking-wide">
                      {point.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-24 lg:py-28 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/20">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-surface-dark mb-6 tracking-tight">
              Ready to see the difference?
            </h2>
            <p className="text-lg text-text-secondary mb-10 leading-relaxed">
              Book a personalized demo and get a free revenue leakage audit. See
              exactly how Riveo Health can transform your revenue cycle in 7
              days, not 6 months.
            </p>
            <Link
              href="/demo"
              className="group inline-flex items-center gap-2 px-10 py-5 text-lg font-semibold text-white gradient-bg rounded-full hover:opacity-90 transition-opacity shadow-xl shadow-primary/25"
            >
              See It In Action
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
