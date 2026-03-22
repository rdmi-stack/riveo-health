"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  XCircle,
  Clock,
  Users,
  X,
  Check,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const painPoints = [
  {
    stat: "$125K+",
    description: "Lost per practice annually",
    source: "MGMA",
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    stat: "18-25%",
    description: "Claims denied first time",
    source: "AMA",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    stat: "52 days",
    description: "Average days in A/R",
    source: "HFMA",
    icon: Clock,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    stat: "30+ hrs",
    description: "Weekly manual follow-ups",
    source: "HBMA",
    icon: Users,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

const comparison = [
  {
    feature: "Architecture",
    legacy: "AI bolted onto 20-year-old software",
    riveo: "AI-native from day one",
  },
  {
    feature: "Implementation",
    legacy: "3-6 month rollouts",
    riveo: "Live in 7 days",
  },
  {
    feature: "Claim Scrubbing",
    legacy: "Manual review by staff",
    riveo: "Automated AI validation",
  },
  {
    feature: "Denials",
    legacy: "Reactive — fix after denied",
    riveo: "Predictive — prevent before submission",
  },
  {
    feature: "Coding",
    legacy: "Manual coders ($50K+ salary each)",
    riveo: "AI auto-coding in < 2 seconds",
  },
  {
    feature: "Data",
    legacy: "Siloed across 10+ tools",
    riveo: "Unified intelligence platform",
  },
  {
    feature: "Pricing",
    legacy: "Locked contracts, per-user fees",
    riveo: "Month-to-month, usage-based",
  },
];

const proofs = [
  { value: "50M+", label: "Claims trained on" },
  { value: "40+", label: "EHR integrations" },
  { value: "97%", label: "Coding accuracy" },
  { value: "< 2s", label: "Per-claim analysis" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-red-500 uppercase tracking-widest mb-4">
            The Problem
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-surface-dark tracking-tight">
            Healthcare billing is{" "}
            <span className="text-red-500">broken</span>.{" "}
            <br className="hidden sm:block" />
            We built the fix.
          </h2>
        </div>

        {/* Pain Points — Horizontal scroll cards */}
        <div className="relative mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {painPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.stat}
                  className={`relative p-6 rounded-2xl border border-gray-100 bg-white transition-all duration-700 hover:shadow-lg ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${point.bg} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-5 h-5 ${point.color}`} />
                  </div>
                  <p className="text-3xl font-black text-surface-dark">
                    {point.stat}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    {point.description}
                  </p>
                  <p className="text-[10px] text-text-muted mt-3 uppercase tracking-wider">
                    Source: {point.source}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Table — Interactive hover */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-surface-dark">
              Legacy RCM vs.{" "}
              <span className="gradient-text">Riveo Health</span>
            </h3>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Table Header */}
            <div className="grid grid-cols-[140px_1fr_1fr] gap-0 mb-2">
              <div />
              <div className="px-6 py-3 text-center">
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                  Legacy Tools
                </span>
              </div>
              <div className="px-6 py-3 text-center">
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
                  Riveo Health
                </span>
              </div>
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {comparison.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-[140px_1fr_1fr] gap-0 rounded-xl overflow-hidden transition-all duration-500 cursor-default ${
                    hoveredRow === i
                      ? "shadow-lg scale-[1.01]"
                      : "shadow-none scale-100"
                  } ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-4"
                  }`}
                  style={{ transitionDelay: `${i * 80 + 300}ms` }}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Feature label */}
                  <div className="px-4 py-4 bg-slate-50 flex items-center">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      {row.feature}
                    </span>
                  </div>

                  {/* Legacy */}
                  <div
                    className={`px-6 py-4 flex items-center gap-2 transition-colors ${
                      hoveredRow === i ? "bg-red-50" : "bg-red-50/40"
                    }`}
                  >
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="text-sm text-red-600">{row.legacy}</span>
                  </div>

                  {/* Riveo */}
                  <div
                    className={`px-6 py-4 flex items-center gap-2 transition-colors ${
                      hoveredRow === i ? "bg-green-50" : "bg-green-50/40"
                    }`}
                  >
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-sm font-medium text-green-700">
                      {row.riveo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technology Proof — Dark banner */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-10 md:p-14">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            {/* Left */}
            <div className="max-w-md">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-cyan-400" />
                <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Technology Proof
                </p>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
                Don&apos;t take our word for it.
                <br />
                <span className="text-cyan-300">
                  Look at the numbers.
                </span>
              </h3>
              <Link
                href="/demo"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all"
              >
                See it in action
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: Proof grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {proofs.map((p, i) => (
                <div
                  key={p.label}
                  className={`bg-white/[0.06] backdrop-blur-sm rounded-2xl px-6 py-5 border border-white/[0.06] transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-90"
                  }`}
                  style={{ transitionDelay: `${i * 100 + 600}ms` }}
                >
                  <p className="text-3xl font-black text-white">{p.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{p.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
