import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Download,
  Mail,
  Newspaper,
  Calendar,
  ExternalLink,
  FileText,
  Sparkles,
} from "lucide-react";

const pressReleases = [
  {
    title: "Riveo Health Launches AI-Native Revenue Cycle Platform",
    date: "March 18, 2026",
    tag: "Product Launch",
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
    accent: "from-indigo-500 to-indigo-600",
    description:
      "Riveo Health officially launches its AI-native revenue cycle management platform, designed from the ground up to automate claim scrubbing, denial prevention, coding, and patient communications for healthcare organizations of all sizes.",
  },
  {
    title: "Riveo Health Opens Partnership Program for RCM Firms",
    date: "March 10, 2026",
    tag: "Partnerships",
    tagColor: "bg-cyan-50 text-cyan-700 border-cyan-100",
    accent: "from-cyan-500 to-teal-500",
    description:
      "Riveo Health announces a new partnership program enabling revenue cycle management firms to integrate AI-native capabilities into their existing workflows with white-label options and dedicated support.",
  },
  {
    title: "The Future of Healthcare Revenue: Why AI-Native Matters",
    date: "March 3, 2026",
    tag: "Thought Leadership",
    tagColor: "bg-violet-50 text-violet-700 border-violet-100",
    accent: "from-violet-500 to-purple-600",
    description:
      "Riveo Health publishes its inaugural thought leadership report exploring why AI-native architecture delivers fundamentally different outcomes compared to legacy RCM systems with bolt-on AI features.",
  },
];

const newsPlaceholders = [
  {
    outlet: "Healthcare IT News",
    title: "How AI-Native Platforms Are Reshaping Revenue Cycle Management",
  },
  {
    outlet: "Becker\u2019s Health IT",
    title: "5 Startups to Watch in Healthcare AI for 2026",
  },
  {
    outlet: "Modern Healthcare",
    title: "The Rise of Intelligent Automation in RCM",
  },
];

export default function NewsroomPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section className="relative pt-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.07] border border-white/[0.12] rounded-full text-sm font-medium text-cyan-300 mb-8 backdrop-blur-sm">
              <Newspaper className="w-4 h-4" />
              Press &amp; Updates
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              Newsroom
            </h1>
            <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Latest news, announcements, and press resources from Riveo Health.
            </p>
          </div>
        </section>

        {/* ===== PRESS RELEASES ===== */}
        <section className="py-24 lg:py-28 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-14">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
                Announcements
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-surface-dark tracking-tight">
                Press Releases
              </h2>
            </div>

            <div className="space-y-6">
              {pressReleases.map((release) => (
                <a
                  key={release.title}
                  href="#"
                  className="group block relative rounded-2xl border border-gray-100 bg-white p-8 lg:p-10 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                  {/* Left accent bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${release.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${release.tagColor}`}
                    >
                      {release.tag}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-text-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      {release.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-surface-dark group-hover:text-primary transition-colors mb-3 leading-snug">
                    {release.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-5">
                    {release.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                    Read more
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRESS KIT + MEDIA CONTACT ===== */}
        <section className="py-24 lg:py-28 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
                Resources
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-surface-dark tracking-tight">
                Press Resources
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Press Kit Download */}
              <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 lg:p-10 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500" />

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-surface-dark mb-3">
                  Press Kit
                </h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Download our brand assets, logos, and executive bios.
                  Everything you need for media coverage and partnership
                  materials.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white gradient-bg rounded-full hover:opacity-90 transition-opacity shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Download Press Kit
                </a>
              </div>

              {/* Media Contact */}
              <div className="group relative rounded-2xl border border-gray-100 bg-white p-8 lg:p-10 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-surface-dark mb-3">
                  Media Contact
                </h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  For press inquiries, interview requests, or additional
                  information, reach out to our communications team.
                </p>
                <a
                  href="mailto:press@riveohealth.com"
                  className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  press@riveohealth.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== IN THE NEWS ===== */}
        <section className="py-24 lg:py-28 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
                Coverage
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-surface-dark tracking-tight">
                In The News
              </h2>
            </div>

            <div className="space-y-4">
              {newsPlaceholders.map((item) => (
                <div
                  key={item.title}
                  className="group flex items-center justify-between gap-6 p-6 rounded-2xl border border-gray-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:border-gray-200 transition-all duration-300"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1.5">
                      {item.outlet}
                    </p>
                    <p className="text-base font-semibold text-surface-dark group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-text-muted group-hover:text-primary shrink-0 transition-colors" />
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-text-muted">
                More coverage coming soon as Riveo Health continues to grow.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
