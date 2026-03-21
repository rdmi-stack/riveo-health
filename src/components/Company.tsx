"use client";

import {
  Shield,
  Rocket,
  Users,
  Clock,
  Upload,
  Settings,
  TrendingUp,
} from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Security You Can Trust",
    description:
      "HIPAA, GDPR, SOC 2 Type II certified. Your patient data is protected with enterprise-grade encryption and access controls.",
  },
  {
    icon: Rocket,
    title: "AI That Actually Works",
    description:
      "Not a chatbot bolted onto legacy software. Riveo Health is built from scratch with AI at the core to solve real billing problems.",
  },
  {
    icon: Users,
    title: "Built Around Your Workflow",
    description:
      "Every feature exists because a billing manager, CFO, or coder asked for it. We build what you need, not what looks good in a demo.",
  },
  {
    icon: Clock,
    title: "ROI in 30 Days",
    description:
      "Most clients recover more revenue in the first month than they spend all year. We measure our success by your recovered dollars.",
  },
];

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Connect Your Systems",
    description:
      "We integrate with your existing EHR, practice management, and clearinghouse in under a week. No rip-and-replace. No disruption to your team.",
  },
  {
    step: "02",
    icon: Settings,
    title: "AI Learns Your Patterns",
    description:
      "Riveo Health analyzes your claims history, denial patterns, and payer rules to build a custom model tuned to your organization's revenue cycle.",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Watch Revenue Recover",
    description:
      "Claims go out cleaner, denials drop, follow-ups happen automatically, and your team focuses on exceptions — not routine work.",
  },
];

export default function Company() {
  return (
    <section id="company" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Why Riveo Health
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-surface-dark tracking-tight">
            Stop losing revenue to{" "}
            <span className="gradient-text">
              broken billing workflows.
            </span>
          </h2>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed">
            Healthcare teams spend too many hours chasing claims, fixing
            denials, and reconciling payments. Riveo Health handles the heavy
            lifting so your team can focus on what matters.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-surface-dark mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-surface-dark text-center mb-4">
            How It Works
          </h3>
          <p className="text-center text-text-secondary mb-12 max-w-2xl mx-auto">
            Go live in days, not months. Three simple steps to transform your
            revenue cycle.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-shadow text-center"
                >
                  <div className="text-5xl font-black text-primary/10 mb-4">
                    {s.step}
                  </div>
                  <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-surface-dark mb-3">
                    {s.title}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {s.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Promise Banner */}
        <div className="mt-20 bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-10 md:p-14 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Our Promise to You
          </h3>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            If you don&apos;t see measurable improvement in your denial rate and
            collection speed within 30 days, we&apos;ll work with you at no
            additional cost until you do.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                title: "No Long Contracts",
                desc: "Month-to-month available. Stay because it works, not because you're locked in.",
              },
              {
                title: "Dedicated Support",
                desc: "A named account manager who knows your organization and your payers.",
              },
              {
                title: "Transparent Pricing",
                desc: "No hidden fees. You see exactly what you pay for and the ROI you're getting.",
              },
            ].map((m) => (
              <div
                key={m.title}
                className="p-6 bg-white/5 rounded-xl border border-white/10"
              >
                <h4 className="text-base font-bold mb-2">{m.title}</h4>
                <p className="text-sm text-slate-400">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
