"use client";

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
    icon: Building2,
    title: "Hospitals & Health Systems",
    description:
      "Enterprise-grade revenue optimization for multi-facility health systems managing thousands of claims daily.",
    benefits: [
      "Reduce denial rates by 60%",
      "Automate 80% of patient interactions",
      "Unified revenue dashboard across facilities",
      "Integrate with existing EHR/HIS",
    ],
    metric: "$2M+",
    metricLabel: "Avg. annual revenue recovered",
  },
  {
    icon: Stethoscope,
    title: "Physician Practices",
    description:
      "Streamlined billing and patient engagement that lets doctors focus on care, not admin.",
    benefits: [
      "Automated appointment reminders",
      "AI-powered billing queries",
      "Insurance verification",
      "Patient payment portals",
    ],
    metric: "40%",
    metricLabel: "Reduction in admin overhead",
  },
  {
    icon: HandCoins,
    title: "RCM Companies",
    description:
      "White-label AI capabilities that supercharge your existing RCM operations and scale your business.",
    benefits: [
      "White-label deployment",
      "Multi-tenant architecture",
      "AI claim scrubbing",
      "Client performance analytics",
    ],
    metric: "3x",
    metricLabel: "More claims processed per FTE",
  },
  {
    icon: FileCheck,
    title: "Billing Services",
    description:
      "Transform manual billing operations into AI-driven revenue machines with automated workflows.",
    benefits: [
      "End-to-end automation",
      "Coding AI (ICD/CPT)",
      "Denial management",
      "Revenue analytics",
    ],
    metric: "97%",
    metricLabel: "First-pass claim acceptance",
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Solutions
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-surface-dark tracking-tight">
            Built for everyone in{" "}
            <span className="gradient-text">healthcare revenue</span>
          </h2>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed">
            Whether you&apos;re a 10-bed clinic or a 10,000-bed health
            system, Riveo Health adapts to your scale and complexity.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((sol) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.title}
                className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-surface-dark mb-2">
                      {sol.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      {sol.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {sol.benefits.map((b) => (
                        <li
                          key={b}
                          className="flex items-center gap-2 text-sm text-text-secondary"
                        >
                          <CheckCircle className="w-4 h-4 text-success shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <div>
                        <p className="text-2xl font-bold gradient-text">
                          {sol.metric}
                        </p>
                        <p className="text-xs text-text-muted">
                          {sol.metricLabel}
                        </p>
                      </div>
                      <a
                        href="#contact"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
                      >
                        Learn more <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
