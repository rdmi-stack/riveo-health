"use client";

import { useState } from "react";
import {
  MessageSquare,
  Brain,
  BarChart3,
  Plug,
  Lock,
  ArrowRight,
  CheckCircle,
  Bot,
  FileSearch,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Phone,
  Mail,
  Smartphone,
  Mic,
  Code,
  Lightbulb,
  LayoutDashboard,
  PieChart,
  Activity,
  Server,
  Shield,
} from "lucide-react";

const tabs = [
  {
    id: "interaction",
    label: "Patient Interaction",
    icon: MessageSquare,
    headline: "Every patient touchpoint. Automated.",
    subheadline:
      "Your front desk is overwhelmed. Phones ring nonstop. Patients wait days for billing answers. Riveo Health handles it all — instantly, across every channel.",
    painPoint:
      "Healthcare orgs lose 15-20% of patients due to poor communication and billing confusion.",
    features: [
      {
        icon: Bot,
        title: "AI Chat Agent",
        desc: "Answers billing questions, checks insurance eligibility, and schedules appointments in real-time via web chat.",
      },
      {
        icon: Mic,
        title: "Voice Agent",
        desc: "Call center automation that understands medical terminology, routes calls intelligently, and resolves 70% of queries without human intervention.",
      },
      {
        icon: Smartphone,
        title: "WhatsApp & SMS",
        desc: "Send payment reminders, appointment confirmations, and collect patient responses where they already are.",
      },
      {
        icon: Mail,
        title: "Email Automation",
        desc: "Statement delivery, EOB explanations, and payment follow-ups that feel personal — at scale.",
      },
    ],
    metrics: [
      { value: "70%", label: "Queries auto-resolved" },
      { value: "< 3s", label: "Avg. response time" },
      { value: "24/7", label: "Always available" },
    ],
    visual: "interaction",
  },
  {
    id: "revenue",
    label: "Revenue Cycle",
    icon: DollarSign,
    headline: "From claim to cash. Zero blind spots.",
    subheadline:
      "Your claims team is buried in spreadsheets. Denials pile up. Follow-ups slip through cracks. Riveo Health tracks every dollar from charge capture to deposit.",
    painPoint:
      "The average practice loses $125,000/year to preventable claim denials and missed follow-ups.",
    features: [
      {
        icon: FileSearch,
        title: "Claim Scrubbing",
        desc: "AI validates every claim against payer-specific rules, catches coding errors, and fixes issues before submission.",
      },
      {
        icon: AlertTriangle,
        title: "Denial Prevention",
        desc: "Predicts which claims will be denied with 95% accuracy. Flags issues so you fix them before they cost you money.",
      },
      {
        icon: RefreshCw,
        title: "Auto-Resubmission",
        desc: "Denied claims are corrected and resubmitted automatically with proper appeal documentation. No manual work.",
      },
      {
        icon: Phone,
        title: "Payment Follow-ups",
        desc: "Automated patient and payer follow-up sequences that recover revenue you'd otherwise write off.",
      },
    ],
    metrics: [
      { value: "97%", label: "Clean claim rate" },
      { value: "60%", label: "Fewer denials" },
      { value: "18 days", label: "Avg. days in A/R" },
    ],
    visual: "revenue",
  },
  {
    id: "intelligence",
    label: "AI Intelligence",
    icon: Brain,
    headline: "AI that thinks like your best coder and biller — combined.",
    subheadline:
      "Stop relying on tribal knowledge. Riveo Health learns your payer mix, denial patterns, and coding nuances to make every claim smarter than the last.",
    painPoint:
      "Manual coding errors and missed modifiers account for 30-40% of all claim rejections.",
    features: [
      {
        icon: Code,
        title: "Auto-Coding Engine",
        desc: "Converts clinical notes to accurate ICD-10/CPT codes in seconds. Handles modifiers, bundling rules, and payer-specific requirements.",
      },
      {
        icon: AlertTriangle,
        title: "Denial Prediction",
        desc: "Machine learning model trained on millions of claims predicts rejection probability and tells you exactly what to fix.",
      },
      {
        icon: Lightbulb,
        title: "Next Best Action",
        desc: "AI recommends whether to appeal, resubmit, call the payer, or escalate — based on what actually works for each scenario.",
      },
      {
        icon: Bot,
        title: "Conversational Intelligence",
        desc: "Understands patient and staff queries in natural language. Learns your organization's terminology and workflows.",
      },
    ],
    metrics: [
      { value: "95%", label: "Coding accuracy" },
      { value: "2 sec", label: "Per-claim analysis" },
      { value: "40%", label: "Less manual review" },
    ],
    visual: "intelligence",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    headline: "See where every dollar goes. And where it doesn't.",
    subheadline:
      "Your monthly reports tell you what happened last month. Riveo Health shows you what's happening right now — and what to do about it.",
    painPoint:
      "Most practices don't discover revenue leakage until quarterly reviews. By then, it's too late to recover.",
    features: [
      {
        icon: LayoutDashboard,
        title: "Real-Time Dashboards",
        desc: "Live view of claims pipeline, payment status, denial trends, and team performance. No more waiting for month-end reports.",
      },
      {
        icon: PieChart,
        title: "Revenue Leakage Detection",
        desc: "AI continuously scans for missed charges, under-coded visits, and unbilled procedures that are costing you money.",
      },
      {
        icon: Activity,
        title: "Payer Performance",
        desc: "Track which payers deny most, which take longest to pay, and where your contracts are underperforming.",
      },
      {
        icon: BarChart3,
        title: "Staff Productivity",
        desc: "Measure biller and coder performance, identify bottlenecks, and optimize resource allocation across your team.",
      },
    ],
    metrics: [
      { value: "$340K", label: "Avg. leakage found" },
      { value: "Real-time", label: "Data updates" },
      { value: "50+", label: "Custom reports" },
    ],
    visual: "analytics",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: Plug,
    headline: "Plugs into what you already use. No rip-and-replace.",
    subheadline:
      "You shouldn't have to change your EHR, clearinghouse, or PM system to get smarter. Riveo Health connects to your existing stack in days, not months.",
    painPoint:
      "Healthcare orgs use 10-15 disconnected systems on average. Data silos kill revenue.",
    features: [
      {
        icon: Server,
        title: "EHR / PM Integration",
        desc: "Native connectors for Epic, Cerner, athenahealth, eClinicalWorks, and 40+ other systems. Bi-directional data sync.",
      },
      {
        icon: Shield,
        title: "Clearinghouse & Payer APIs",
        desc: "Direct payer connections and clearinghouse integrations for real-time eligibility, claim status, and ERA processing.",
      },
      {
        icon: DollarSign,
        title: "Payment Gateways",
        desc: "Accept payments via credit card, ACH, payment plans, and digital wallets. Automated posting back to your PM system.",
      },
      {
        icon: Lock,
        title: "HIPAA-Compliant Infrastructure",
        desc: "HL7 FHIR, encrypted APIs, BAA agreements, and SOC 2 Type II certification. Enterprise security by default.",
      },
    ],
    metrics: [
      { value: "40+", label: "EHR integrations" },
      { value: "< 7 days", label: "Setup time" },
      { value: "99.9%", label: "Uptime SLA" },
    ],
    visual: "integrations",
  },
];

function InteractionVisual() {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-600">Live Conversation</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-end">
            <div className="bg-indigo-50 text-indigo-900 text-sm px-4 py-2 rounded-2xl rounded-br-md max-w-[80%]">
              Hi, I received a bill for $450 but my insurance should cover this visit?
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-gray-50 text-gray-800 text-sm px-4 py-2 rounded-2xl rounded-bl-md max-w-[80%]">
              I checked your claim #CLM-4821. Your insurer processed it with a $40 copay. The $450 charge was sent in error. I&apos;ve corrected your balance to $40. Would you like to pay now?
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-indigo-50 text-indigo-900 text-sm px-4 py-2 rounded-2xl rounded-br-md">
              Yes please!
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-gray-50 text-gray-800 text-sm px-4 py-2 rounded-2xl rounded-bl-md max-w-[80%]">
              Done! Payment of $40 processed. Receipt sent to your email. Anything else I can help with?
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["WhatsApp", "SMS", "Voice"].map((ch) => (
          <div key={ch} className="bg-white rounded-lg border border-gray-100 p-3 text-center shadow-sm">
            <p className="text-xs font-semibold text-gray-500">{ch}</p>
            <p className="text-lg font-bold text-surface-dark">Active</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenueVisual() {
  const claims = [
    { id: "CLM-9284", status: "Paid", amount: "$1,240", color: "text-green-600", bg: "bg-green-50" },
    { id: "CLM-9285", status: "Scrubbed", amount: "$3,450", color: "text-blue-600", bg: "bg-blue-50" },
    { id: "CLM-9286", status: "Flagged", amount: "$890", color: "text-amber-600", bg: "bg-amber-50" },
    { id: "CLM-9287", status: "Resubmitted", amount: "$2,100", color: "text-violet-600", bg: "bg-violet-50" },
    { id: "CLM-9288", status: "Paid", amount: "$760", color: "text-green-600", bg: "bg-green-50" },
  ];
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-surface-dark">Claims Pipeline</span>
          <span className="text-xs text-green-600 font-medium">$284K collected this week</span>
        </div>
        <div className="divide-y divide-gray-50">
          {claims.map((c) => (
            <div key={c.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-gray-500">{c.id}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.color}`}>{c.status}</span>
              </div>
              <span className="text-sm font-semibold text-surface-dark">{c.amount}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">CLM-9286 flagged</p>
          <p className="text-xs text-amber-600">Missing modifier -25. Auto-corrected and ready for resubmission.</p>
        </div>
      </div>
    </div>
  );
}

function IntelligenceVisual() {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Clinical Note</p>
        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 italic">
          &quot;Patient presents with acute exacerbation of chronic obstructive pulmonary disease. Administered nebulizer treatment. Chest X-ray ordered. Follow-up in 2 weeks.&quot;
        </p>
      </div>
      <div className="flex items-center justify-center py-1">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full">
          <Brain className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span className="text-xs font-semibold text-indigo-600">AI Processing...</span>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Generated Codes</p>
        <div className="space-y-2">
          {[
            { code: "J44.1", desc: "COPD with acute exacerbation", confidence: "98%" },
            { code: "94640", desc: "Nebulizer treatment", confidence: "99%" },
            { code: "71046", desc: "Chest X-ray, 2 views", confidence: "97%" },
            { code: "99214", desc: "E/M Level 4, established", confidence: "94%" },
          ].map((c) => (
            <div key={c.code} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-bold text-indigo-600">{c.code}</span>
                <span className="text-sm text-gray-600">{c.desc}</span>
              </div>
              <span className="text-xs font-semibold text-green-600">{c.confidence}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsVisual() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Net Collection Rate", value: "96.4%", change: "+2.1%", up: true },
          { label: "Days in A/R", value: "18.3", change: "-12 days", up: true },
          { label: "Denial Rate", value: "8.2%", change: "-14.3%", up: true },
          { label: "Revenue This Month", value: "$1.8M", change: "+$240K", up: true },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className="text-xl font-bold text-surface-dark">{m.value}</p>
            <p className="text-xs font-semibold text-green-600">{m.change}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Revenue Leakage Detected</p>
        <div className="space-y-2">
          {[
            { issue: "Unbilled procedures (E/M upcoding potential)", amount: "$47,200" },
            { issue: "Missed modifier opportunities", amount: "$18,900" },
            { issue: "Timely filing at risk (14 claims)", amount: "$12,400" },
          ].map((l) => (
            <div key={l.issue} className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg">
              <span className="text-sm text-red-700">{l.issue}</span>
              <span className="text-sm font-bold text-red-600">{l.amount}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
          <span className="text-sm font-semibold text-gray-600">Total Recoverable</span>
          <span className="text-base font-bold text-red-600">$78,500</span>
        </div>
      </div>
    </div>
  );
}

function IntegrationsVisual() {
  const systems = [
    { name: "Epic", status: "Connected", type: "EHR" },
    { name: "Availity", status: "Connected", type: "Clearinghouse" },
    { name: "Blue Cross", status: "Connected", type: "Payer" },
    { name: "Stripe", status: "Connected", type: "Payments" },
    { name: "athenahealth", status: "Connected", type: "PM" },
    { name: "Change HC", status: "Connected", type: "Clearinghouse" },
  ];
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-sm font-semibold text-surface-dark">Connected Systems</span>
        </div>
        <div className="divide-y divide-gray-50">
          {systems.map((s) => (
            <div key={s.name} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm font-medium text-surface-dark">{s.name}</span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{s.type}</span>
              </div>
              <span className="text-xs font-medium text-green-600">{s.status}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <div>
          <p className="text-sm font-semibold text-green-800">All systems synced</p>
          <p className="text-xs text-green-600">Last sync: 2 minutes ago. HIPAA compliant. Encrypted.</p>
        </div>
      </div>
    </div>
  );
}

const visuals: Record<string, () => React.JSX.Element> = {
  interaction: InteractionVisual,
  revenue: RevenueVisual,
  intelligence: IntelligenceVisual,
  analytics: AnalyticsVisual,
  integrations: IntegrationsVisual,
};

export default function Platform() {
  const [activeTab, setActiveTab] = useState("interaction");
  const active = tabs.find((t) => t.id === activeTab)!;
  const Visual = visuals[active.visual];

  return (
    <section id="platform" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Platform
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-surface-dark tracking-tight">
            Every piece of your revenue cycle.{" "}
            <span className="gradient-text">One platform.</span>
          </h2>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed">
            Stop juggling 10 tools that don&apos;t talk to each other.
            Riveo Health replaces the chaos with a single AI-powered system
            that handles everything from patient calls to claim deposits.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "gradient-bg text-white shadow-lg shadow-primary/25"
                    : "bg-gray-50 text-text-secondary hover:bg-gray-100 hover:text-surface-dark"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <div>
            {/* Pain point callout */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8">
              <p className="text-sm text-red-700 font-medium">
                <span className="font-bold">The Problem:</span>{" "}
                {active.painPoint}
              </p>
            </div>

            <h3 className="text-3xl font-bold text-surface-dark leading-tight mb-4">
              {active.headline}
            </h3>
            <p className="text-text-secondary leading-relaxed mb-8">
              {active.subheadline}
            </p>

            {/* Feature list */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {active.features.map((f) => {
                const FIcon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-indigo-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FIcon className="w-5 h-5 text-primary" />
                      <h4 className="text-sm font-bold text-surface-dark">
                        {f.title}
                      </h4>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Metrics */}
            <div className="flex gap-6 pt-6 border-t border-gray-100">
              {active.metrics.map((m) => (
                <div key={m.label}>
                  <p className="text-2xl font-bold gradient-text">{m.value}</p>
                  <p className="text-xs text-text-muted mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="sticky top-28">
              <Visual />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white gradient-bg rounded-full hover:opacity-90 transition-all shadow-xl shadow-primary/25"
          >
            See the full platform in action
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
