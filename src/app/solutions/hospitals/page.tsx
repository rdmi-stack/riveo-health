import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Building2,
  Users,
  ShieldCheck,
  FileStack,
  LayoutDashboard,
  Brain,
  MessageSquare,
  BarChart3,
  ChevronRight,
  TrendingDown,
  Bot,
  Rocket,
} from "lucide-react";

export const metadata = {
  title: "Hospitals & Health Systems | Riveo Health",
  description:
    "Enterprise revenue optimization for multi-facility health systems. AI-powered denial prevention, unified dashboards, and real-time analytics.",
};

const painPoints = [
  {
    icon: Building2,
    title: "Multi-Facility Complexity",
    description:
      "Managing revenue across dozens of locations with different payer mixes, specialties, and workflows creates blind spots and inconsistencies.",
  },
  {
    icon: FileStack,
    title: "High Claim Volumes",
    description:
      "Processing thousands of claims daily with manual review processes leads to bottlenecks, errors, and delayed reimbursements.",
  },
  {
    icon: Users,
    title: "Staff Turnover",
    description:
      "Chronic staffing shortages and turnover in billing departments means constant retraining and lost institutional knowledge.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Burden",
    description:
      "Evolving payer rules, regulatory requirements, and audit demands stretch compliance teams thin across the system.",
  },
];

const solutions = [
  {
    icon: LayoutDashboard,
    title: "Unified Dashboard Across Facilities",
    description:
      "A single command center for every facility, department, and provider. Real-time visibility into revenue performance, denial trends, and collection status across your entire system.",
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: Brain,
    title: "AI-Powered Denial Prevention",
    description:
      "Predictive models analyze every claim before submission, catching errors that cause denials. Machine learning improves continuously from your specific payer mix and patterns.",
    color: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: MessageSquare,
    title: "Automated Patient Engagement",
    description:
      "AI agents handle scheduling, reminders, billing inquiries, and payment plans across all channels -- reducing call center volume while improving patient satisfaction.",
    color: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: BarChart3,
    title: "Real-Time Revenue Analytics",
    description:
      "Drill into revenue data by facility, department, provider, or payer in real time. Identify trends, flag anomalies, and benchmark performance across the system.",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

const metrics = [
  { icon: TrendingDown, value: "Up to 60%", label: "Denial rate reduction" },
  { icon: Bot, value: "80%", label: "Patient interactions automated" },
  { icon: Rocket, value: "<7 days", label: "Go-live implementation" },
];

export default function HospitalsPage() {
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
              <Link href="/solutions" className="hover:text-white transition-colors">
                Solutions
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-cyan-400 font-medium">Hospitals</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-indigo-200 mb-8">
              <Building2 className="w-4 h-4" />
              Hospitals &amp; Health Systems
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Enterprise revenue optimization for{" "}
              <span className="text-cyan-300">health systems</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Unify revenue operations across every facility, reduce denials at
              scale, and give your finance team real-time visibility into the
              entire revenue cycle.
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
                Pain points unique to health systems
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Large-scale healthcare organizations face revenue cycle
                challenges that compound with every new facility, provider, and
                payer contract.
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
                AI-native solutions built for enterprise scale
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
              Ready to unify your revenue operations?
            </h2>
            <p className="mt-6 text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              Book a personalized demo and get a free revenue leakage audit for
              your health system. See results in days, not months.
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
