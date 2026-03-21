"use client";

import { TrendingUp, DollarSign, Clock, ShieldCheck, ArrowDown, ArrowUp } from "lucide-react";

const outcomes = [
  {
    icon: ArrowDown,
    metric: "60%",
    label: "Fewer Claim Denials",
    description:
      "AI-powered claim scrubbing catches errors before submission, dramatically reducing denial rates across all payer types.",
    color: "from-indigo-500 to-indigo-600",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
  {
    icon: ArrowUp,
    metric: "3x",
    label: "Faster Collections",
    description:
      "Automated follow-ups, real-time eligibility checks, and intelligent workflows cut your days in A/R by more than half.",
    color: "from-cyan-500 to-cyan-600",
    lightColor: "bg-cyan-50",
    textColor: "text-cyan-600",
  },
  {
    icon: ShieldCheck,
    metric: "97%",
    label: "First-Pass Acceptance",
    description:
      "Claims go out clean the first time. Our AI validates coding, modifiers, and payer rules before anything is submitted.",
    color: "from-violet-500 to-violet-600",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
  },
];

const beforeAfter = [
  {
    label: "Denial Rate",
    before: "18-25%",
    after: "7-10%",
    icon: ShieldCheck,
  },
  {
    label: "Days in A/R",
    before: "45-60 days",
    after: "18-25 days",
    icon: Clock,
  },
  {
    label: "Cost to Collect",
    before: "5-7% of revenue",
    after: "2-3% of revenue",
    icon: DollarSign,
  },
  {
    label: "Staff Hours on Follow-ups",
    before: "30+ hrs/week",
    after: "8 hrs/week",
    icon: TrendingUp,
  },
];

export default function Results() {
  return (
    <section id="results" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Results
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-surface-dark tracking-tight">
            Real outcomes.{" "}
            <span className="gradient-text">Measurable ROI.</span>
          </h2>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed">
            Healthcare organizations using Riveo Health see dramatic improvements
            in revenue capture, operational efficiency, and financial
            performance — often within the first 30 days.
          </p>
        </div>

        {/* Outcome Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {outcomes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="relative overflow-hidden bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-xl ${item.lightColor} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${item.textColor}`} />
                  </div>
                  <p
                    className={`text-5xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                  >
                    {item.metric}
                  </p>
                  <p className="text-lg font-semibold text-surface-dark mt-2">
                    {item.label}
                  </p>
                  <p className="text-sm text-text-secondary mt-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Before / After */}
        <div>
          <h3 className="text-2xl font-bold text-surface-dark text-center mb-4">
            Before Riveo Health vs. After
          </h3>
          <p className="text-center text-text-secondary mb-12 max-w-2xl mx-auto">
            See how our customers&apos; key revenue metrics change once they go
            live with Riveo Health.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {beforeAfter.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-surface-dark mb-4">
                    {item.label}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg">
                      <span className="text-xs font-medium text-red-400 uppercase">
                        Before
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        {item.before}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-emerald-50 rounded-lg">
                      <span className="text-xs font-medium text-emerald-400 uppercase">
                        After
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        {item.after}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
