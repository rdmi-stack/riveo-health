import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Server,
  Eye,
  ClipboardCheck,
  Siren,
  BadgeCheck,
  ArrowRight,
  Download,
} from "lucide-react";

export const metadata = {
  title: "Security | Riveo Health",
  description:
    "Enterprise-grade security for healthcare data. Learn about Riveo Health's security practices, certifications, and compliance standards.",
};

const certifications = [
  {
    icon: BadgeCheck,
    title: "SOC 2 Type II",
    description:
      "Independently audited controls for security, availability, and confidentiality of customer data.",
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
    border: "border-indigo-100",
    accent: "from-indigo-500 to-indigo-600",
  },
  {
    icon: ShieldCheck,
    title: "HIPAA Compliant",
    description:
      "Full compliance with HIPAA Privacy, Security, and Breach Notification Rules for protected health information.",
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    border: "border-emerald-100",
    accent: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Lock,
    title: "GDPR Ready",
    description:
      "Data processing agreements, right to erasure, and privacy-by-design principles for EU data subjects.",
    color: "bg-violet-50",
    iconColor: "text-violet-600",
    border: "border-violet-100",
    accent: "from-violet-500 to-violet-600",
  },
];

const securityPractices = [
  {
    icon: Lock,
    title: "Data Encryption",
    description:
      "AES-256 encryption at rest and TLS 1.3 for all data in transit. All sensitive data is encrypted end-to-end with keys managed through AWS KMS.",
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: ShieldCheck,
    title: "Access Control",
    description:
      "Role-based access control (RBAC), multi-factor authentication (MFA), and single sign-on (SSO) support via SAML 2.0 and OpenID Connect.",
    color: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    icon: Server,
    title: "Infrastructure",
    description:
      "Hosted on AWS with multi-region redundancy, automated failover, and a 99.9% uptime SLA. All infrastructure is managed with infrastructure-as-code.",
    color: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: Eye,
    title: "Monitoring",
    description:
      "24/7 threat detection with automated alerting, real-time log aggregation, and anomaly detection powered by AI-driven security analytics.",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance",
    description:
      "Regular third-party audits, annual penetration testing, and comprehensive vendor security assessments to maintain the highest standards.",
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Siren,
    title: "Incident Response",
    description:
      "Documented incident response plan with defined severity levels, escalation procedures, and 72-hour breach notification in compliance with regulations.",
    color: "bg-rose-50",
    iconColor: "text-rose-600",
  },
];

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
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
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">
                Enterprise-Grade Security
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Security is built into
              <br />
              <span className="text-cyan-300">everything we do</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Protecting healthcare data is not an afterthought — it is
              foundational to our platform. We employ enterprise-grade security
              measures to keep your data safe, compliant, and available.
            </p>
          </div>
        </section>

        {/* Certifications */}
        <section className="relative -mt-8 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certifications.map((cert) => {
                const Icon = cert.icon;
                return (
                  <div
                    key={cert.title}
                    className={`bg-white rounded-2xl p-8 border ${cert.border} shadow-xl shadow-black/5 text-center hover:shadow-2xl transition-shadow duration-300`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl ${cert.color} flex items-center justify-center mx-auto mb-6`}
                    >
                      <Icon className={`w-8 h-8 ${cert.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-surface-dark">
                      {cert.title}
                    </h3>
                    <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                      {cert.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security Practices */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                Security Practices
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-surface-dark tracking-tight">
                How We Protect Your Data
              </h2>
              <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
                Multiple layers of security controls working together to safeguard
                your most sensitive healthcare information.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityPractices.map((practice) => {
                const Icon = practice.icon;
                return (
                  <div
                    key={practice.title}
                    className="group bg-slate-50 border border-gray-100 rounded-2xl p-7 hover:shadow-lg hover:border-gray-200 hover:bg-white transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${practice.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                    >
                      <Icon
                        className={`w-6 h-6 ${practice.iconColor}`}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-dark">
                      {practice.title}
                    </h3>
                    <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                      {practice.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust Stats */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
              <ClipboardCheck className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">
                Continuous Assurance
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-dark tracking-tight">
              We take security seriously
            </h2>
            <p className="mt-6 text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
              Our platform undergoes regular third-party audits and penetration
              testing to ensure the highest level of protection for your data.
              Every member of our team completes annual security training, and
              our practices are continuously updated to address emerging threats.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { value: "99.9%", label: "Uptime SLA" },
                { value: "< 72hrs", label: "Breach Notification" },
                { value: "Annual", label: "Penetration Testing" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <p className="text-3xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-secondary mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Have security questions?
            </h2>
            <p className="mt-4 text-lg text-indigo-200 max-w-xl mx-auto leading-relaxed">
              Our security team is happy to answer any questions about how we
              protect your data and maintain compliance.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl"
              >
                Contact Us
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Security Whitepaper
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
