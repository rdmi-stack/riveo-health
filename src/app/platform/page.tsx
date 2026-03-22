import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  MessageSquare,
  BarChart3,
  Brain,
  LineChart,
  Plug,
  ShieldCheck,
  Lock,
  Server,
  Zap,
  Database,
  Globe,
  Cpu,
  Layers,
  Target,
  TrendingUp,
  Activity,
} from "lucide-react";

export const metadata = {
  title: "Platform | Riveo Health",
  description:
    "One AI-native platform for your entire revenue cycle. Replace 10+ disconnected tools with Riveo Health's unified healthcare RCM platform.",
};

const modules = [
  {
    icon: MessageSquare,
    title: "Patient Interaction Agent",
    desc: "AI-powered chat, voice, and messaging that handles patient queries, scheduling, and billing conversations around the clock.",
    stat: "70%",
    statLabel: "auto-resolved",
    href: "/platform/patient-interaction",
    gradient: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50",
    tc: "text-indigo-600",
    border: "border-indigo-100",
    glow: "bg-indigo-500/5",
  },
  {
    icon: BarChart3,
    title: "Revenue Intelligence Engine",
    desc: "End-to-end claim lifecycle management with AI-powered scrubbing, denial prevention, and automated resubmission workflows.",
    stat: "97%",
    statLabel: "clean claim rate",
    href: "/platform/revenue-intelligence",
    gradient: "from-cyan-500 to-teal-500",
    bg: "bg-cyan-50",
    tc: "text-cyan-600",
    border: "border-cyan-100",
    glow: "bg-cyan-500/5",
  },
  {
    icon: Brain,
    title: "AI Decision Engine",
    desc: "Automated medical coding, denial prediction, and next-best-action recommendations powered by healthcare-trained LLMs.",
    stat: "95%",
    statLabel: "coding accuracy",
    href: "/platform/ai-engine",
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    tc: "text-violet-600",
    border: "border-violet-100",
    glow: "bg-violet-500/5",
  },
  {
    icon: LineChart,
    title: "Analytics & Insights",
    desc: "Real-time dashboards, revenue leakage detection, payer performance benchmarks, and staff productivity tracking.",
    stat: "$78K",
    statLabel: "avg leakage found",
    href: "/platform/analytics",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    tc: "text-amber-600",
    border: "border-amber-100",
    glow: "bg-amber-500/5",
  },
  {
    icon: Plug,
    title: "Integrations",
    desc: "Pre-built connectors for Epic, Cerner, athena, eCW, clearinghouses, payer APIs, and payment gateways via HL7/FHIR.",
    stat: "40+",
    statLabel: "integrations",
    href: "/platform/integrations",
    gradient: "from-emerald-500 to-green-500",
    bg: "bg-emerald-50",
    tc: "text-emerald-600",
    border: "border-emerald-100",
    glow: "bg-emerald-500/5",
  },
];

const bottomStats = [
  { icon: Database, value: "50M+", label: "Claims processed" },
  { icon: Plug, value: "40+", label: "Integrations" },
  { icon: Target, value: "97%", label: "Accuracy rate" },
  { icon: Zap, value: "<2s", label: "Analysis time" },
];

const dataLayers = [
  { label: "Intake", icon: MessageSquare, color: "from-indigo-500 to-blue-500" },
  { label: "Intelligence", icon: Brain, color: "from-violet-500 to-purple-500" },
  { label: "Revenue", icon: BarChart3, color: "from-cyan-500 to-teal-500" },
  { label: "Analytics", icon: LineChart, color: "from-amber-500 to-orange-500" },
  { label: "Integration", icon: Plug, color: "from-emerald-500 to-green-500" },
];

export default function PlatformPage() {
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
          <div className="absolute top-40 left-1/2 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">The Riveo Health Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              One AI-native platform for your entire{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">revenue cycle</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Stop juggling 10+ disconnected tools. Riveo Health unifies patient
              interactions, claims management, coding, analytics, and
              integrations into a single intelligent platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white gradient-bg rounded-full hover:opacity-90 transition-opacity shadow-xl shadow-primary/20"
              >
                See it in action
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== PLATFORM MODULES ===== */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Platform Modules
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                Five integrated layers. One unified platform.
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Each module is powerful on its own. Together, they form the most
                comprehensive AI-native RCM platform available.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <Link
                    key={mod.title}
                    href={mod.href}
                    className={`group relative bg-white rounded-2xl p-8 border ${mod.border} hover:shadow-xl transition-all duration-300 overflow-hidden`}
                  >
                    {/* Gradient top bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${mod.gradient}`} />
                    {/* Subtle glow on hover */}
                    <div className={`absolute -top-20 -right-20 w-40 h-40 ${mod.glow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative">
                      <div className="flex items-start justify-between mb-6">
                        <div
                          className={`w-14 h-14 rounded-2xl ${mod.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <Icon className={`w-7 h-7 ${mod.tc}`} />
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold bg-gradient-to-r ${mod.gradient} bg-clip-text text-transparent`}>
                            {mod.stat}
                          </p>
                          <p className="text-xs text-text-secondary font-medium">{mod.statLabel}</p>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-surface-dark mb-3 group-hover:text-primary transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed mb-5">
                        {mod.desc}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                        Explore module
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== HOW DATA FLOWS ===== */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Architecture
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                How data flows through Riveo
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Data flows seamlessly between every layer, eliminating silos and
                giving your team a single source of truth.
              </p>
            </div>

            {/* Visual data flow */}
            <div className="relative max-w-5xl mx-auto">
              {/* Connection line */}
              <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-300 via-violet-300 via-cyan-300 via-amber-300 to-emerald-300" />

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                {dataLayers.map((layer, i) => {
                  const Icon = layer.icon;
                  return (
                    <div key={layer.label} className="flex flex-col items-center text-center group">
                      <div className={`w-[120px] h-[120px] rounded-3xl bg-white flex flex-col items-center justify-center relative z-10 border border-gray-200 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center mb-2`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-bold text-surface-dark">{layer.label}</p>
                      </div>
                      {i < dataLayers.length - 1 && (
                        <div className="md:hidden w-px h-8 bg-gradient-to-b from-gray-300 to-gray-100 mt-2" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium text-surface-dark">
                    Unified data layer &mdash; every module shares real-time context
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECURITY CALLOUT ===== */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-10 md:p-14 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl" />

              <div className="relative flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Enterprise Security</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Enterprise-grade security at every layer
                  </h3>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    Your data is protected by HIPAA-compliant infrastructure,
                    SOC 2 Type II certification, end-to-end encryption, and
                    rigorous access controls. Security is not an add-on &mdash;
                    it is foundational to everything we build.
                  </p>
                  <div className="flex flex-wrap gap-4 mb-8">
                    {[
                      { icon: ShieldCheck, label: "HIPAA Compliant" },
                      { icon: Lock, label: "SOC 2 Type II" },
                      { icon: Server, label: "End-to-End Encryption" },
                    ].map((badge) => {
                      const BadgeIcon = badge.icon;
                      return (
                        <div
                          key={badge.label}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10"
                        >
                          <BadgeIcon className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-medium text-white">
                            {badge.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <Link
                    href="/security"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Learn about our security practices
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== BOTTOM STATS ===== */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Platform at Scale
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                Built for healthcare&apos;s most demanding workflows
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bottomStats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="relative bg-white rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
                      {s.value}
                    </p>
                    <p className="text-text-secondary font-medium">{s.label}</p>
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
              See it in action
            </h2>
            <p className="mt-6 text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              Schedule a personalized walkthrough and discover how Riveo Health
              can transform your revenue cycle from end to end.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl"
              >
                Request a Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-colors"
              >
                Talk to Sales
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
