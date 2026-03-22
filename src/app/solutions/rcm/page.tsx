import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  HandCoins,
  Users,
  ShieldAlert,
  Swords,
  TrendingDown,
  Tag,
  Layers,
  Brain,
  BarChart3,
  ChevronRight,
  Zap,
  Server,
} from "lucide-react";

export const metadata = {
  title: "RCM Companies | Riveo Health",
  description:
    "White-label AI that supercharges your RCM business. Multi-tenant architecture, AI claim scrubbing, and client performance analytics.",
};

const painPoints = [
  {
    icon: Users,
    title: "Scaling Staff Linearly",
    description:
      "Every new client requires more headcount. Your margins shrink as you grow because labor costs scale with volume.",
  },
  {
    icon: ShieldAlert,
    title: "Client Retention",
    description:
      "Clients expect better outcomes every year. Without AI capabilities, you risk losing accounts to competitors who offer them.",
  },
  {
    icon: TrendingDown,
    title: "Margin Compression",
    description:
      "Rising labor costs, payer complexity, and client pricing pressure are squeezing margins across the industry.",
  },
  {
    icon: Swords,
    title: "Competitive Pressure",
    description:
      "New AI-native entrants are disrupting the market. Legacy processes and tools are becoming a liability, not an advantage.",
  },
];

const solutions = [
  {
    icon: Tag,
    title: "White-Label Deployment",
    description:
      "Deploy Riveo Health under your own brand. Your clients see your name, your logo, and your interface -- powered by our AI engine behind the scenes.",
    color: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: Layers,
    title: "Multi-Tenant Architecture",
    description:
      "Manage all your clients from a single platform with complete data isolation. Onboard new clients in hours, not weeks, with tenant-level configuration.",
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: Brain,
    title: "AI Claim Scrubbing",
    description:
      "Every claim is validated by AI before submission -- catching coding errors, missing modifiers, and payer-specific issues that cause denials.",
    color: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: BarChart3,
    title: "Client Performance Analytics",
    description:
      "Give each client a branded dashboard showing their revenue performance, denial trends, and collection metrics. Demonstrate your value with data.",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

const metrics = [
  { icon: Zap, value: "3x", label: "Claims per FTE" },
  { icon: Tag, value: "White-label", label: "Ready to deploy under your brand" },
  { icon: Server, value: "Multi-tenant", label: "Architecture with data isolation" },
];

export default function RCMPage() {
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
              <span className="text-cyan-400 font-medium">RCM Companies</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-violet-200 mb-8">
              <HandCoins className="w-4 h-4" />
              RCM Companies
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              White-label AI that supercharges your{" "}
              <span className="text-cyan-300">RCM business</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Stop scaling headcount linearly with claim volume. Riveo Health
              gives your RCM company AI superpowers -- deployed under your brand,
              with multi-tenant architecture built for your business model.
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
                The pressure RCM companies face today
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed">
                The RCM industry is at an inflection point. Companies that
                embrace AI will thrive. Those that don&apos;t will be left
                behind.
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
                AI infrastructure for your RCM business
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
              Ready to supercharge your RCM business?
            </h2>
            <p className="mt-6 text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              See how Riveo Health can help you process 3x more claims per FTE
              and retain more clients with AI-powered results.
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
