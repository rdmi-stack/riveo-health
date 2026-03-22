import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  FileCheck,
  ClipboardList,
  AlertTriangle,
  Layers,
  HeartCrack,
  Workflow,
  Brain,
  ShieldCheck,
  BarChart3,
  ChevronRight,
  Sparkles,
  Timer,
  FileBarChart,
} from "lucide-react";

export const metadata = {
  title: "Billing Services | Riveo Health",
  description:
    "Transform manual billing into AI-driven revenue machines. End-to-end automation, coding AI, denial management, and real-time analytics.",
};

const painPoints = [
  {
    icon: ClipboardList,
    title: "Manual Processes",
    description:
      "Too many billing tasks still require human hands -- data entry, claim follow-ups, payment posting, and reconciliation eat up staff hours.",
  },
  {
    icon: AlertTriangle,
    title: "Coding Errors",
    description:
      "Manual coding leads to costly mistakes -- wrong modifiers, missed charges, and incorrect ICD-10 codes that trigger denials.",
  },
  {
    icon: Layers,
    title: "Denial Backlogs",
    description:
      "Denied claims pile up faster than teams can work them. Without intelligent prioritization, revenue sits uncollected for months.",
  },
  {
    icon: HeartCrack,
    title: "Staff Burnout",
    description:
      "Repetitive, high-volume billing work drives turnover. Teams spend more time on rework than on productive revenue recovery.",
  },
];

const solutions = [
  {
    icon: Workflow,
    title: "End-to-End Automation",
    description:
      "Automate the entire billing lifecycle from charge capture to payment posting. AI handles claim creation, submission, follow-ups, and reconciliation with minimal human intervention.",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: Brain,
    title: "AI Coding Engine",
    description:
      "AI-powered coding engine validates ICD-10, CPT, and modifier assignments in real time. Catches errors before submission and suggests corrections based on clinical documentation.",
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: ShieldCheck,
    title: "Denial Management",
    description:
      "Intelligent denial prevention catches issues pre-submission. When denials do occur, AI prioritizes by recovery potential, auto-drafts appeals, and tracks resolution.",
    color: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: BarChart3,
    title: "Revenue Analytics",
    description:
      "Real-time dashboards showing collection rates, denial trends, aging reports, and payer performance. Identify bottlenecks and revenue opportunities at a glance.",
    color: "bg-violet-100",
    iconColor: "text-violet-600",
  },
];

const metrics = [
  { icon: Sparkles, value: "97%", label: "First-pass acceptance rate" },
  { icon: Timer, value: "<2s", label: "Per claim processing" },
  { icon: FileBarChart, value: "50+", label: "Built-in reports" },
];

export default function BillingPage() {
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
          <div className="absolute top-20 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-1.5 text-sm text-slate-400 mb-8">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/solutions" className="hover:text-white transition-colors">
                Solutions
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-cyan-400 font-medium">Billing Services</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-amber-200 mb-8">
              <FileCheck className="w-4 h-4" />
              Billing Services
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Transform manual billing into{" "}
              <span className="text-cyan-300">AI-driven revenue machines</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Stop losing revenue to coding errors, denial backlogs, and manual
              processes. Riveo Health automates the entire billing lifecycle with
              AI that learns from every claim.
            </p>
            <div className="mt-10">
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white gradient-bg rounded-full hover:opacity-90 transition-opacity shadow-xl shadow-primary/25"
              >
                Request a Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== THE CHALLENGE ===== */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                The Challenge
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                Why billing services struggle to scale
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Manual billing workflows create a ceiling on growth and a floor
                on errors. Breaking through requires fundamentally different
                technology.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {painPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-surface-dark mb-2">
                      {point.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== HOW RIVEO HEALTH HELPS ===== */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                How Riveo Health Helps
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                AI automation for every billing workflow
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {solutions.map((sol) => {
                const Icon = sol.icon;
                return (
                  <div
                    key={sol.title}
                    className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${sol.color} flex items-center justify-center mb-5`}
                    >
                      <Icon className={`w-7 h-7 ${sol.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-surface-dark mb-3 group-hover:text-primary transition-colors">
                      {sol.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {sol.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== KEY METRICS BAR ===== */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 via-primary to-cyan-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 md:gap-4">
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="text-center">
                    <div className="flex justify-center mb-3">
                      <Icon className="w-8 h-8 text-white/80" />
                    </div>
                    <p className="text-3xl md:text-4xl font-extrabold text-white">
                      {m.value}
                    </p>
                    <p className="mt-2 text-sm text-indigo-100 font-medium">
                      {m.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== CTA BANNER ===== */}
        <section className="py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Ready to automate your billing workflows?
            </h2>
            <p className="mt-6 text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              See how Riveo Health can deliver 97% first-pass acceptance rates
              and eliminate manual billing bottlenecks. Start with a free audit.
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
                href="/solutions"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-colors"
              >
                View all solutions
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
