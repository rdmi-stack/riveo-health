import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Stethoscope,
  Users,
  Puzzle,
  HelpCircle,
  DollarSign,
  CalendarCheck,
  Brain,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  ClipboardMinus,
  Sparkles,
  Tag,
} from "lucide-react";

export const metadata = {
  title: "Physician Practices | Riveo Health",
  description:
    "Streamlined billing and patient engagement for physician practices. Automated scheduling, AI billing queries, and simplified payments.",
};

const painPoints = [
  {
    icon: Users,
    title: "Small Teams, Big Workloads",
    description:
      "Office staff juggle front desk, billing, insurance, and patient calls with no bandwidth for optimization.",
  },
  {
    icon: Puzzle,
    title: "Billing Complexity",
    description:
      "Navigating payer rules, prior authorizations, and coding requirements is overwhelming for lean teams.",
  },
  {
    icon: HelpCircle,
    title: "Patient Payment Confusion",
    description:
      "Patients struggle to understand their bills, leading to delayed payments and increased collection costs.",
  },
  {
    icon: DollarSign,
    title: "Admin Overhead",
    description:
      "Manual eligibility checks, claim follow-ups, and phone tag consume hours that could be spent on patient care.",
  },
];

const solutions = [
  {
    icon: CalendarCheck,
    title: "Automated Reminders & Scheduling",
    description:
      "AI handles appointment scheduling, reminders, and follow-ups across SMS, email, and voice. Reduce no-shows and free up front desk staff for patient care.",
    color: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: Brain,
    title: "AI Billing Queries",
    description:
      "Patients get instant, accurate answers to billing questions through AI-powered chat and voice agents -- 24/7, without waiting on hold.",
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: ShieldCheck,
    title: "Insurance Verification",
    description:
      "Automated eligibility checks and prior authorization management before appointments, eliminating surprise denials and patient frustration.",
    color: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: CreditCard,
    title: "Patient Payment Portals",
    description:
      "Simple, mobile-friendly payment experiences with flexible payment plans. Patients pay faster when billing is clear and convenient.",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

const metrics = [
  { icon: ClipboardMinus, value: "40%", label: "Less admin overhead" },
  { icon: Sparkles, value: "97%", label: "Clean claim rate" },
  { icon: Tag, value: "$499/mo", label: "Starting price" },
];

export default function PracticesPage() {
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
          <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
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
              <span className="text-cyan-400 font-medium">Practices</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-cyan-200 mb-8">
              <Stethoscope className="w-4 h-4" />
              Physician Practices
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Streamlined billing so doctors can{" "}
              <span className="text-cyan-300">focus on care</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Automate the billing complexity that bogs down your practice.
              From scheduling to collections, Riveo Health handles the revenue
              cycle so your team can focus on patients.
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
                Why billing is so hard for practices
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Small and mid-size practices face unique revenue cycle challenges
                that enterprise tools were never designed to solve.
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
                Purpose-built for physician practices
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
              Let your team focus on patients, not paperwork
            </h2>
            <p className="mt-6 text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              See how Riveo Health can reduce your admin burden by 40% and
              accelerate patient payments. Start with a free revenue audit.
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
