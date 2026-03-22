import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Heart,
  Brain,
  Sparkles,
  Globe,
  MapPin,
  Clock,
  Tag,
  Mail,
  Briefcase,
  Zap,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Careers | Riveo Health",
  description:
    "Join Riveo Health and build the future of healthcare revenue cycle management. Explore open roles in engineering, product, go-to-market, and operations.",
};

const benefits = [
  {
    icon: Heart,
    title: "Mission That Matters",
    desc: "Healthcare impacts everyone. The software we build helps providers get paid fairly so they can focus on saving lives -- not fighting insurance companies.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: Brain,
    title: "Cutting-Edge Tech",
    desc: "Work with AI, LLMs, real-time streaming systems, and modern infrastructure. If it exists on the frontier, we are probably building with it.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: Sparkles,
    title: "Early Stage Impact",
    desc: "Shape the product, the culture, and the company. Every person here has an outsized impact on what Riveo Health becomes.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Remote-First",
    desc: "Work from anywhere. We hire the best people regardless of geography and trust them to do their best work on their own terms.",
    gradient: "from-cyan-500 to-teal-500",
  },
];

const departments: {
  name: string;
  roles: { title: string; location: string; type: string }[];
}[] = [
  {
    name: "Engineering",
    roles: [
      {
        title: "Senior Full-Stack Engineer",
        location: "Remote",
        type: "Full-time",
      },
      { title: "ML/AI Engineer", location: "Remote", type: "Full-time" },
      { title: "Platform Engineer", location: "Remote", type: "Full-time" },
    ],
  },
  {
    name: "Product",
    roles: [
      {
        title: "Product Manager -- RCM",
        location: "Remote",
        type: "Full-time",
      },
      { title: "Product Designer", location: "Remote", type: "Full-time" },
    ],
  },
  {
    name: "Go-to-Market",
    roles: [
      {
        title: "Account Executive -- Healthcare",
        location: "Remote",
        type: "Full-time",
      },
      {
        title: "Content Marketing Manager",
        location: "Remote",
        type: "Full-time",
      },
    ],
  },
  {
    name: "Operations",
    roles: [
      {
        title: "Healthcare Domain Expert",
        location: "Remote",
        type: "Full-time",
      },
      {
        title: "Customer Success Manager",
        location: "Remote",
        type: "Full-time",
      },
    ],
  },
];

const departmentColors: Record<string, string> = {
  Engineering: "bg-indigo-50 text-indigo-600",
  Product: "bg-cyan-50 text-cyan-600",
  "Go-to-Market": "bg-emerald-50 text-emerald-600",
  Operations: "bg-amber-50 text-amber-600",
};

const departmentAccents: Record<string, string> = {
  Engineering: "group-hover:border-indigo-300",
  Product: "group-hover:border-cyan-300",
  "Go-to-Market": "group-hover:border-emerald-300",
  Operations: "group-hover:border-amber-300",
};

export default function CareersPage() {
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
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-indigo-200 mb-8 backdrop-blur-sm">
              <Users className="w-4 h-4" />
              Careers at Riveo Health
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
              Build the future of{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                healthcare revenue
              </span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Join a mission-driven team reimagining how healthcare gets paid.
              We&apos;re looking for people who want to solve hard problems that
              actually matter.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#open-positions"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl"
              >
                View Open Roles
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#why-work-here"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/20 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                Why Riveo Health
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* ===== WHY WORK HERE ===== */}
        <section id="why-work-here" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Why Riveo Health
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-dark tracking-tight">
                Why Work Here
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed text-lg">
                We&apos;re not just building software -- we&apos;re building a
                company where exceptional people do the best work of their
                careers.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.title}
                    className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="relative text-lg font-bold text-surface-dark mb-3">
                      {b.title}
                    </h3>
                    <p className="relative text-sm text-text-secondary leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== OPEN POSITIONS ===== */}
        <section id="open-positions" className="py-24 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Open Positions
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-surface-dark tracking-tight">
                Find your role
              </h2>
              <p className="mt-4 text-text-secondary leading-relaxed text-lg">
                We&apos;re hiring across engineering, product, go-to-market, and
                operations. All roles are remote-first.
              </p>
            </div>

            <div className="space-y-12">
              {departments.map((dept) => (
                <div key={dept.name}>
                  <div className="flex items-center gap-3 mb-5">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-surface-dark">
                      {dept.name}
                    </h3>
                    <span className="text-xs font-medium text-text-muted bg-slate-200 px-2.5 py-1 rounded-full">
                      {dept.roles.length} {dept.roles.length === 1 ? "role" : "roles"}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {dept.roles.map((role) => (
                      <Link
                        key={role.title}
                        href="#"
                        className={`group flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl ${departmentAccents[dept.name] || "group-hover:border-indigo-200"} transition-all duration-300`}
                      >
                        <div className="mb-3 sm:mb-0">
                          <h4 className="text-base font-semibold text-surface-dark group-hover:text-primary transition-colors">
                            {role.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${departmentColors[dept.name] || "bg-indigo-50 text-indigo-600"}`}>
                              <Tag className="w-3 h-3" />
                              {dept.name}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-slate-100 px-3 py-1.5 rounded-full">
                              <MapPin className="w-3 h-3" />
                              {role.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-slate-100 px-3 py-1.5 rounded-full">
                              <Clock className="w-3 h-3" />
                              {role.type}
                            </span>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-3 transition-all shrink-0">
                          Apply
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== BOTTOM CTA ===== */}
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
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Don&apos;t see your role?
            </h2>
            <p className="mt-6 text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              We&apos;re always looking for exceptional people. If you&apos;re
              passionate about fixing healthcare revenue and think you&apos;d be
              a great fit, we want to hear from you.
            </p>

            <div className="mt-10">
              <a
                href="mailto:careers@riveohealth.com"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl"
              >
                <Mail className="w-5 h-5" />
                careers@riveohealth.com
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
