"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Upload,
  Settings,
  TrendingUp,
  Shield,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  3-Step Process                                                     */
/* ------------------------------------------------------------------ */

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Connect",
    subtitle: "Your systems, our AI",
    description:
      "We plug into your existing EHR, PM system, and clearinghouse. No rip-and-replace. No disruption. Your team keeps working while we set up.",
    detail: "Under 7 days to go live",
    image: "/steps/connect.jpg",
    color: "#6366F1",
  },
  {
    number: "02",
    icon: Settings,
    title: "Learn",
    subtitle: "AI adapts to you",
    description:
      "Riveo Health analyzes your claims history, denial patterns, and payer rules. It builds a custom AI model tuned to your specific revenue cycle.",
    detail: "Gets smarter with every claim",
    image: "/steps/ai-learns.jpg",
    color: "#06B6D4",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Recover",
    subtitle: "Revenue flows back",
    description:
      "Claims go out cleaner. Denials drop. Follow-ups happen automatically. Your team focuses on exceptions — not routine work.",
    detail: "ROI visible within 30 days",
    image: "/steps/revenue.jpg",
    color: "#10B981",
  },
];

/* ------------------------------------------------------------------ */
/*  Promise Items                                                      */
/* ------------------------------------------------------------------ */

const promises = [
  { text: "No long-term contracts", included: true },
  { text: "Month-to-month flexibility", included: true },
  { text: "Free revenue leakage audit", included: true },
  { text: "7-day implementation", included: true },
  { text: "Dedicated account manager", included: true },
  { text: "ROI guarantee in 30 days", included: true },
  { text: "Hidden fees", included: false },
  { text: "Setup charges", included: false },
  { text: "Long sales cycles", included: false },
  { text: "Data lock-in", included: false },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Company() {
  const [visibleStep, setVisibleStep] = useState(-1);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let i = 0;
          const interval = setInterval(() => {
            setVisibleStep(i);
            i++;
            if (i >= steps.length) clearInterval(interval);
          }, 400);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="company" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            How It Works
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-surface-dark tracking-tight">
            Go live in days.{" "}
            <span className="gradient-text">See ROI in weeks.</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Three steps. Seven days. No disruption to your team.
          </p>
        </div>

        {/* 3-Step Visual Process */}
        <div ref={stepsRef} className="space-y-6 max-w-5xl mx-auto mb-24">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isVisible = i <= visibleStep;
            return (
              <div
                key={step.number}
                className={`transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-[280px_1fr] min-h-[200px]">
                    {/* Image */}
                    <div className="relative hidden md:block">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
                      {/* Step number overlay */}
                      <div className="absolute top-4 left-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg"
                          style={{ backgroundColor: step.color }}
                        >
                          {step.number}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-1 md:hidden">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: step.color }}
                        >
                          {step.number}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <h3 className="text-2xl font-bold text-surface-dark">
                          {step.title}
                        </h3>
                        <span className="text-sm text-text-muted">
                          — {step.subtitle}
                        </span>
                      </div>
                      <p className="text-text-secondary leading-relaxed mb-4 max-w-lg">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">
                          {step.detail}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {i < steps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div
                      className={`w-px h-8 transition-all duration-500 ${
                        isVisible ? "bg-primary/30" : "bg-transparent"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Promise Section — Unique two-column YES/NO layout */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left: The Promise */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">
                Our Promise
              </p>
              <h3 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
                We bet on your success.
                <br />
                <span className="text-cyan-300">Not your contract.</span>
              </h3>
              <p className="text-slate-300 leading-relaxed mb-8 max-w-md">
                If you don&apos;t see measurable improvement in your denial rate
                and collection speed within 30 days, we work with you at no
                additional cost until you do.
              </p>
              <Link
                href="/demo"
                className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-white rounded-full hover:bg-slate-100 transition-colors shadow-lg w-fit"
              >
                Start risk-free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: Yes/No Grid */}
            <div className="p-10 lg:p-14 bg-white/[0.03]">
              <div className="grid grid-cols-2 gap-x-8 gap-y-0">
                {/* Yes column */}
                <div>
                  <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    What you get
                  </p>
                  <ul className="space-y-3.5">
                    {promises
                      .filter((p) => p.included)
                      .map((p) => (
                        <li
                          key={p.text}
                          className="flex items-center gap-2.5 text-sm text-slate-200"
                        >
                          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                          {p.text}
                        </li>
                      ))}
                  </ul>
                </div>

                {/* No column */}
                <div>
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" />
                    What we don&apos;t do
                  </p>
                  <ul className="space-y-3.5">
                    {promises
                      .filter((p) => !p.included)
                      .map((p) => (
                        <li
                          key={p.text}
                          className="flex items-center gap-2.5 text-sm text-slate-400 line-through decoration-slate-600"
                        >
                          <XCircle className="w-4 h-4 text-red-400/60 shrink-0" />
                          {p.text}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/[0.06]">
                {[
                  { icon: Shield, text: "HIPAA Compliant" },
                  { icon: Shield, text: "SOC 2 Type II" },
                  { icon: Clock, text: "99.9% Uptime" },
                ].map((badge) => {
                  const BadgeIcon = badge.icon;
                  return (
                    <div
                      key={badge.text}
                      className="flex items-center gap-1.5 text-xs text-slate-500"
                    >
                      <BadgeIcon className="w-3.5 h-3.5 text-cyan-500" />
                      {badge.text}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
