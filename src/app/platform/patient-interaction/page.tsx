import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Mic,
  Smartphone,
  Mail,
  Zap,
  Clock,
  CheckCircle2,
  Sparkles,
  Users,
  HeadphonesIcon,
} from "lucide-react";

export const metadata = {
  title: "Patient Interaction Agent | Riveo Health",
  description:
    "AI-powered patient communication across chat, voice, WhatsApp, SMS, and email. 70% auto-resolved queries with sub-3-second response times.",
};

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat",
    desc: "Intelligent chatbot that handles billing inquiries, appointment scheduling, insurance verification, and payment plan setup in natural language.",
    gradient: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50",
    tc: "text-indigo-600",
    border: "border-indigo-100",
  },
  {
    icon: Mic,
    title: "Voice Agent",
    desc: "AI-powered voice assistant that answers inbound calls, triages patient needs, and resolves common questions without hold times.",
    gradient: "from-cyan-500 to-teal-500",
    bg: "bg-cyan-50",
    tc: "text-cyan-600",
    border: "border-cyan-100",
  },
  {
    icon: Smartphone,
    title: "WhatsApp & SMS",
    desc: "Automated outreach and two-way conversations on the channels patients prefer. Appointment reminders, balance notifications, and payment links.",
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    tc: "text-violet-600",
    border: "border-violet-100",
  },
  {
    icon: Mail,
    title: "Email Automation",
    desc: "Personalized email workflows for statements, pre-visit instructions, payment confirmations, and follow-up communications.",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    tc: "text-amber-600",
    border: "border-amber-100",
  },
];

const steps = [
  {
    icon: MessageSquare,
    label: "Patient sends a query",
    desc: "Via chat, voice, SMS, WhatsApp, or email",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Zap,
    label: "AI understands intent",
    desc: "NLP classifies and extracts key details in real time",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: CheckCircle2,
    label: "Resolves or escalates",
    desc: "Auto-resolves 70% of queries; routes the rest to staff",
    color: "from-emerald-500 to-green-500",
  },
];

const metrics = [
  { value: "70%", label: "Queries auto-resolved", icon: Sparkles },
  { value: "<3s", label: "Average response time", icon: Clock },
  { value: "24/7", label: "Always-on availability", icon: HeadphonesIcon },
];

export default function PatientInteractionPage() {
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
            <Link
              href="/platform"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Platform
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">Patient Interaction Agent</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Every patient touchpoint.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">Automated.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              AI-powered communication across every channel patients use &mdash;
              from the first inquiry to the final payment confirmation.
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
                Multi-channel AI communication
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Meet patients where they are with intelligent automation across every communication channel.
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

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                How It Works
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
                From query to resolution in seconds
              </h2>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-[60px] left-[calc(16.67%+60px)] right-[calc(16.67%+60px)] h-0.5 bg-gradient-to-r from-indigo-300 via-violet-300 to-emerald-300" />

              <div className="grid md:grid-cols-3 gap-8">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="flex flex-col items-center text-center group">
                      <div className={`w-[120px] h-[120px] rounded-3xl bg-white flex flex-col items-center justify-center mb-5 relative z-10 border border-gray-200 shadow-lg group-hover:shadow-xl transition-all`}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-2`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-bold text-primary uppercase tracking-widest">
                          Step {i + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-surface-dark mb-2">
                        {step.label}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed max-w-[240px]">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
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
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
              Transform patient communication
            </h2>
            <p className="mt-6 text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              See how the Patient Interaction Agent can reduce call volume,
              accelerate payments, and improve patient satisfaction.
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
