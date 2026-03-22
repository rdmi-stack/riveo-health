import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  ArrowLeft,
  FileCode2,
  ShieldAlert,
  Navigation,
  MessageCircle,
  Brain,
  Sparkles,
  Cpu,
  Target,
  Zap,
  Eye,
} from "lucide-react";

export const metadata = {
  title: "AI Decision Engine | Riveo Health",
  description:
    "AI that thinks like your best coder and biller combined. Auto-coding, denial prediction, next best action, and conversational AI for healthcare RCM.",
};

const features = [
  {
    icon: FileCode2,
    title: "Auto-Coding (ICD/CPT)",
    desc: "Healthcare-trained AI reads clinical documentation and suggests accurate ICD-10 and CPT codes, reducing manual review and coding errors.",
    gradient: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50",
    tc: "text-indigo-600",
    border: "border-indigo-100",
  },
  {
    icon: ShieldAlert,
    title: "Denial Prediction",
    desc: "Machine learning models analyze claim attributes, payer history, and coding patterns to flag claims likely to be denied before submission.",
    gradient: "from-cyan-500 to-teal-500",
    bg: "bg-cyan-50",
    tc: "text-cyan-600",
    border: "border-cyan-100",
  },
  {
    icon: Navigation,
    title: "Next Best Action",
    desc: "Real-time recommendations for billing staff on the optimal action for every claim, denial, and patient account based on data-driven insights.",
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    tc: "text-violet-600",
    border: "border-violet-100",
  },
  {
    icon: MessageCircle,
    title: "Conversational AI",
    desc: "Natural language interface that lets staff ask questions about claims, denials, and coding in plain English and get instant, accurate answers.",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    tc: "text-amber-600",
    border: "border-amber-100",
  },
];

const capabilities = [
  { icon: Cpu, label: "Healthcare-trained LLMs", desc: "Purpose-built models trained on millions of medical records and claims" },
  { icon: Sparkles, label: "Continuous learning", desc: "Models improve with every claim, adapting to your payer mix and specialties" },
  { icon: Eye, label: "Explainable outputs", desc: "Every AI decision comes with clear reasoning your team can review and audit" },
];

const metrics = [
  { value: "95%", label: "Coding accuracy", icon: Target },
  { value: "<2s", label: "Per claim analysis", icon: Zap },
  { value: "40%", label: "Less manual review", icon: Brain },
];

export default function AIEnginePage() {
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
          <div className="absolute top-20 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
            <Link
              href="/platform"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Platform
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8">
              <Brain className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-300">AI Decision Engine</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              AI that thinks like your best coder and biller &mdash;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-cyan-300">combined.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Healthcare-trained large language models that automate coding,
              predict denials, and guide your team to the right action on every
              claim.
            </p>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Capabilities
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                Intelligence at every decision point
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Four AI-powered capabilities that augment your team and eliminate bottlenecks across the revenue cycle.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className={`group relative bg-white rounded-2xl p-8 border ${feat.border} hover:shadow-xl transition-all duration-300 overflow-hidden`}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feat.gradient}`} />
                    <div className="flex items-start gap-5">
                      <div
                        className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`w-7 h-7 ${feat.tc}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-surface-dark mb-3">
                          {feat.title}
                        </h3>
                        <p className="text-text-secondary leading-relaxed">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== UNDER THE HOOD ===== */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Under the Hood
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                Purpose-built AI for healthcare
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div key={cap.label} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all text-center group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-surface-dark mb-2">{cap.label}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{cap.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== METRICS ===== */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-8">
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.label}
                    className="relative text-center p-8 rounded-2xl bg-slate-50 border border-gray-100 overflow-hidden group hover:shadow-lg transition-all"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
                      {m.value}
                    </p>
                    <p className="text-text-secondary font-medium">{m.label}</p>
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
              Put AI to work on your revenue cycle
            </h2>
            <p className="mt-6 text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              See how the AI Decision Engine can dramatically improve coding
              accuracy and reduce the manual burden on your team.
            </p>
            <div className="mt-10">
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl"
              >
                Request a Demo
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
