import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  DollarSign,
  Users,
  TrendingUp,
  Brain,
  Layers,
  Rocket,
  Lightbulb,
  ShieldCheck,
  Minimize2,
  Heart,
  Zap,
  CircuitBoard,
  Timer,
} from "lucide-react";

export const metadata = {
  title: "About | Riveo Health",
  description:
    "Riveo Health is building the financial infrastructure layer of healthcare. Learn about our mission, vision, and approach to AI-native revenue cycle management.",
};

const problemStats = [
  {
    icon: DollarSign,
    stat: "$262B",
    label: "wasted annually",
    desc: "Administrative complexity in U.S. healthcare drives hundreds of billions in unnecessary spending every year.",
    source: "JAMA, 2022",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-500/10",
    iconColor: "text-red-500",
  },
  {
    icon: Users,
    stat: "30%",
    label: "of admin staff considering leaving",
    desc: "Burnout from repetitive manual billing tasks is driving a staffing crisis in healthcare revenue cycle operations.",
    source: "MGMA, 2023",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    icon: TrendingUp,
    stat: "23%",
    label: "increase in denials since 2020",
    desc: "Claim denial rates are surging as payer rules grow more complex and provider teams can't keep up manually.",
    source: "Change Healthcare, 2023",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-500/10",
    iconColor: "text-rose-500",
  },
];

const approaches = [
  {
    tag: "01",
    title: "AI-Native, Not AI-Bolted",
    desc: "Most RCM platforms bolt AI features onto decades-old architecture. Riveo Health was built from scratch with AI at the core of every workflow -- from claim creation to denial resolution. The result is a system that thinks, learns, and adapts in real time.",
    color: "from-indigo-500 to-cyan-500",
    icon: Brain,
    visualElements: [
      { label: "NLP Engine", w: "w-full" },
      { label: "Claim AI", w: "w-3/4" },
      { label: "Denial Predictor", w: "w-5/6" },
      { label: "Auto-Coder", w: "w-2/3" },
    ],
  },
  {
    tag: "02",
    title: "One Platform, Not Ten Tools",
    desc: "The average health system juggles 10-15 disconnected revenue cycle tools. Riveo Health replaces the entire fragmented stack with a single unified platform -- one login, one data layer, one source of truth for every dollar.",
    color: "from-cyan-500 to-teal-500",
    icon: Layers,
    visualElements: [
      { label: "Billing", w: "w-full" },
      { label: "Coding", w: "w-full" },
      { label: "Denials", w: "w-full" },
      { label: "Analytics", w: "w-full" },
    ],
  },
  {
    tag: "03",
    title: "Results in Days, Not Months",
    desc: "Traditional RCM implementations take 6-12 months. We integrate with your existing EHR in 7 days and deliver measurable ROI within 30. No rip-and-replace. No disruption to your team.",
    color: "from-teal-500 to-indigo-500",
    icon: Timer,
    visualElements: [
      { label: "Day 1 - Connect", w: "w-1/4" },
      { label: "Day 3 - Configure", w: "w-1/2" },
      { label: "Day 7 - Live", w: "w-3/4" },
      { label: "Day 30 - ROI", w: "w-full" },
    ],
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "We push the boundaries of what AI can do for healthcare revenue. Status quo is not in our vocabulary.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    desc: "HIPAA compliance, SOC 2 Type II, end-to-end encryption. Trust is earned through rigorous standards, not promises.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Minimize2,
    title: "Simplicity",
    desc: "Complex problems deserve elegant solutions. We obsess over making the powerful feel effortless.",
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    icon: Heart,
    title: "Impact",
    desc: "Every feature we build is measured by one metric: does it help providers spend more time on patient care?",
    gradient: "from-rose-500 to-pink-500",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section className="relative pt-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-indigo-200 mb-8 backdrop-blur-sm">
              <CircuitBoard className="w-4 h-4" />
              About Riveo Health
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
              We&apos;re building the financial
              infrastructure layer of{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                healthcare
              </span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Healthcare revenue is broken -- drowning in manual processes,
              fragmented tools, and preventable errors. We&apos;re on a mission
              to fix it with AI that works from day one.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl"
              >
                See Our Platform
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/careers"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/20 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Join the Team
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== MISSION & VISION ===== */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Why We Exist
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-dark tracking-tight">
                Mission &amp; Vision
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Mission */}
              <div className="relative group">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white rounded-2xl p-10 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                    <Rocket className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-surface-dark mb-4">
                    Our Mission
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    Eliminate revenue leakage and administrative burden so
                    healthcare providers can focus on what matters most --
                    patient care.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="relative group">
                <div className="absolute -inset-[1px] bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white rounded-2xl p-10 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-surface-dark mb-4">
                    Our Vision
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    Become the operating system that powers every healthcare
                    financial transaction -- intelligent, automated, and
                    seamless.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== THE PROBLEM WE SOLVE ===== */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                The Challenge
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-dark tracking-tight">
                The Problem We Solve
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed text-lg">
                Healthcare revenue cycle management is plagued by systemic
                inefficiencies that cost the industry billions every year.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {problemStats.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.stat}
                    className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${point.color}`} />
                    <div className={`w-14 h-14 rounded-2xl ${point.bgColor} flex items-center justify-center mb-6`}>
                      <Icon className={`w-7 h-7 ${point.iconColor}`} />
                    </div>
                    <p className={`text-4xl sm:text-5xl font-extrabold bg-gradient-to-r ${point.color} bg-clip-text text-transparent mb-2`}>
                      {point.stat}
                    </p>
                    <p className="text-sm font-semibold text-surface-dark uppercase tracking-wide mb-3">
                      {point.label}
                    </p>
                    <p className="text-text-secondary leading-relaxed text-sm mb-4">
                      {point.desc}
                    </p>
                    <p className="text-xs text-text-muted font-medium italic">
                      Source: {point.source}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== OUR APPROACH ===== */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Our Approach
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-dark tracking-tight">
                A fundamentally different way to solve RCM
              </h2>
            </div>

            <div className="space-y-32">
              {approaches.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.tag}
                    className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                  >
                    {/* Text */}
                    <div className={i % 2 !== 0 ? "lg:order-2" : ""}>
                      <span
                        className={`inline-block text-sm font-extrabold bg-gradient-to-r ${item.color} bg-clip-text text-transparent uppercase tracking-widest mb-4`}
                      >
                        {item.tag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-surface-dark tracking-tight mb-6">
                        {item.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed text-lg">
                        {item.desc}
                      </p>
                    </div>

                    {/* Visual */}
                    <div className={i % 2 !== 0 ? "lg:order-1" : ""}>
                      <div
                        className={`relative rounded-2xl bg-gradient-to-br ${item.color} p-[2px] shadow-2xl`}
                      >
                        <div className="bg-slate-950 rounded-2xl p-8 sm:p-10">
                          <div className="flex items-center gap-2 mb-6">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex gap-1.5 ml-auto">
                              <div className="w-3 h-3 rounded-full bg-red-500/60" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                              <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            </div>
                          </div>
                          <div className="space-y-3">
                            {item.visualElements.map((el, j) => (
                              <div key={j} className="flex items-center gap-3">
                                <Zap className={`w-4 h-4 shrink-0 ${j === item.visualElements.length - 1 ? "text-emerald-400" : "text-slate-500"}`} />
                                <span className="text-xs text-slate-400 font-mono w-28 shrink-0">
                                  {el.label}
                                </span>
                                <div className="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full bg-gradient-to-r ${item.color} ${el.w}`}
                                    style={{ opacity: 0.4 + (j * 0.2) }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-mono">riveo.engine.v3</span>
                            <span className={`text-xs font-semibold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>ACTIVE</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== VALUES ===== */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                What Drives Us
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-dark tracking-tight">
                Our Values
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((val) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.title}
                    className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${val.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${val.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="relative text-lg font-bold text-surface-dark mb-3">
                      {val.title}
                    </h3>
                    <p className="relative text-sm text-text-secondary leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== CTA BANNER ===== */}
        <section className="py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Want to join us?
            </h2>
            <p className="mt-6 text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              We&apos;re building a team of people who believe healthcare
              deserves better financial infrastructure. Come shape the future
              with us.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/careers"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl"
              >
                View Open Roles
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-colors"
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
