import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Building2,
  Stethoscope,
  HandCoins,
  FileCheck,
  ShieldAlert,
  Zap,
  MessageSquare,
  Code2,
  Users,
  SearchCheck,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Solutions | Riveo Health",
  description:
    "AI-native revenue cycle solutions for hospitals, physician practices, RCM companies, and billing services. Built to adapt to any scale.",
};

const solutions = [
  {
    icon: Building2,
    title: "Hospitals & Health Systems",
    href: "/solutions/hospitals",
    description:
      "Enterprise-grade revenue optimization across multi-facility health systems with unified dashboards and AI-powered denial prevention.",
    stat: "Up to 60%",
    statLabel: "denial rate reduction",
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
    borderColor: "border-indigo-200",
    hoverBorder: "hover:border-indigo-300",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Stethoscope,
    title: "Physician Practices",
    href: "/solutions/practices",
    description:
      "Streamlined billing and patient engagement so doctors can focus on care. Automated scheduling, AI billing, and simplified payments.",
    stat: "40%",
    statLabel: "less admin overhead",
    color: "bg-cyan-100",
    iconColor: "text-cyan-600",
    borderColor: "border-cyan-200",
    hoverBorder: "hover:border-cyan-300",
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    icon: HandCoins,
    title: "RCM Companies",
    href: "/solutions/rcm",
    description:
      "White-label AI that supercharges your RCM business. Multi-tenant architecture, AI claim scrubbing, and client analytics at scale.",
    stat: "3x",
    statLabel: "more claims per FTE",
    color: "bg-violet-100",
    iconColor: "text-violet-600",
    borderColor: "border-violet-200",
    hoverBorder: "hover:border-violet-300",
    gradient: "from-violet-500 to-violet-600",
  },
  {
    icon: FileCheck,
    title: "Billing Services",
    href: "/solutions/billing",
    description:
      "Transform manual billing into AI-driven revenue machines. End-to-end automation, intelligent coding, and real-time denial management.",
    stat: "97%",
    statLabel: "first-pass acceptance",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200",
    hoverBorder: "hover:border-amber-300",
    gradient: "from-amber-500 to-amber-600",
  },
];

const challenges = [
  {
    icon: ShieldAlert,
    title: "Reduce Denial Rates",
    description:
      "AI-powered claim scrubbing catches errors before submission, preventing denials at the source.",
  },
  {
    icon: Zap,
    title: "Accelerate Collections",
    description:
      "Automated follow-ups and intelligent prioritization to close the gap between service and payment.",
  },
  {
    icon: MessageSquare,
    title: "Automate Patient Comms",
    description:
      "Multi-channel AI agents handle scheduling, reminders, billing questions, and payment plans 24/7.",
  },
  {
    icon: Code2,
    title: "Improve Coding Accuracy",
    description:
      "AI auto-coding with ICD-10 and CPT validation eliminates manual coding errors and missed charges.",
  },
  {
    icon: Users,
    title: "Scale Without Hiring",
    description:
      "Handle 3x the claim volume with the same team through intelligent automation and AI workflows.",
  },
  {
    icon: SearchCheck,
    title: "Find Revenue Leakage",
    description:
      "Comprehensive audits surface missed charges, underpayments, and billing gaps across your entire operation.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section className="relative pt-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-1.5 text-sm text-slate-400 mb-8">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-cyan-400 font-medium">Solutions</span>
            </nav>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Built for everyone in{" "}
              <span className="text-cyan-300">healthcare revenue</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Whether you run a single practice or a multi-facility health
              system, Riveo Health adapts to your scale, your workflows, and
              your goals. One AI-native platform, purpose-built for every
              organization in the revenue cycle.
            </p>
          </div>
        </section>

        {/* ===== SOLUTIONS GRID ===== */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                By Organization Type
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                Find the right solution for your organization
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {solutions.map((sol) => {
                const Icon = sol.icon;
                return (
                  <Link
                    key={sol.title}
                    href={sol.href}
                    className={`group relative bg-white rounded-2xl p-8 border-2 ${sol.borderColor} ${sol.hoverBorder} hover:shadow-xl transition-all duration-300 overflow-hidden`}
                  >
                    {/* Decorative gradient corner */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${sol.gradient} opacity-[0.04] rounded-bl-full`} />

                    <div className="relative flex items-start gap-5">
                      <div
                        className={`w-16 h-16 rounded-2xl ${sol.color} flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-8 h-8 ${sol.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-surface-dark mb-2 group-hover:text-primary transition-colors">
                          {sol.title}
                        </h3>
                        <p className="text-text-secondary leading-relaxed mb-5">
                          {sol.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-surface-dark">
                              {sol.stat}
                            </span>
                            <span className="text-sm text-text-muted">
                              {sol.statLabel}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                            Learn more
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== COMMON CHALLENGES ===== */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Common Challenges
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                Problems we solve across every organization
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                No matter your size or specialty, these revenue cycle challenges
                are universal. Riveo Health addresses them all from a single
                platform.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {challenges.map((challenge, idx) => {
                const Icon = challenge.icon;
                const colors = [
                  "from-indigo-500 to-indigo-600",
                  "from-cyan-500 to-cyan-600",
                  "from-violet-500 to-violet-600",
                  "from-amber-500 to-amber-600",
                  "from-emerald-500 to-emerald-600",
                  "from-rose-500 to-rose-600",
                ];
                return (
                  <div
                    key={challenge.title}
                    className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center mb-5`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-surface-dark mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Get your free revenue audit
            </h2>
            <p className="mt-6 text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              See exactly where your revenue is leaking -- denial patterns,
              missed charges, and collection gaps specific to your organization.
              No commitment required.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl"
              >
                Get your free audit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-colors"
              >
                Talk to our team
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
