export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

export interface BlogPost {
  slug: string;
  title: string;
  category: "Blog" | "Case Study" | "Guide" | "Webinar";
  description: string;
  image: string;
  author: string;
  authorRole: string;
  authorInitials: string;
  date: string;
  readTime: string;
  cta: string;
  featured?: boolean;
  content: ContentBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-ai-transforms-multi-specialty-revenue-cycles",
    title:
      "How AI transforms revenue cycles for multi-specialty practices",
    category: "Guide",
    description:
      "Multi-specialty practices face unique revenue cycle challenges — fragmented billing systems, inconsistent coding, and complex payer contracts. Learn how AI-powered automation addresses each of these pain points and what results to expect.",
    image: "/blog/case-study.jpg",
    author: "Riveo Health Team",
    authorRole: "Revenue Cycle Insights",
    authorInitials: "RH",
    date: "Mar 15, 2026",
    readTime: "8 min read",
    cta: "Read the full guide",
    featured: true,
    content: [
      {
        type: "heading",
        text: "The Challenge: Revenue Cycles Under Pressure",
      },
      {
        type: "paragraph",
        text: "Multi-specialty practices that have grown through acquisitions often inherit a patchwork of billing systems, inconsistent coding practices, and fragmented payer contracts. The result is predictable: days in accounts receivable balloon, denial rates climb, and billing teams spend a disproportionate amount of their time on manual claim rework instead of high-value tasks.",
      },
      {
        type: "paragraph",
        text: "The financial impact is significant. Industry data shows that the average mid-size practice leaves 5-10% of net revenue on the table annually due to under-coding, missed charge capture, timely filing failures, and denials that are never appealed. Staff burnout compounds the problem — experienced billers are increasingly difficult to recruit and retain in a tight labor market.",
      },
      {
        type: "heading",
        text: "What to Look for in an AI-Powered RCM Platform",
      },
      {
        type: "paragraph",
        text: "When evaluating RCM technology vendors, three factors matter most. First, the platform should offer end-to-end automation from eligibility verification through final payment posting, eliminating the need to stitch together point solutions. Second, the AI claim-scrubbing engine should be trained on large volumes of historical claims across hundreds of payer rule sets for accurate pre-submission validation. Third, implementation should be fast — ideally measured in days, not months — with dedicated onboarding support.",
      },
      {
        type: "heading",
        text: "A Phased Implementation Approach",
      },
      {
        type: "paragraph",
        text: "Riveo Health follows a phased rollout designed for minimal disruption. Phase one integrates with your existing EHR and migrates historical claims data to establish baseline analytics. Phase two activates AI claim scrubbing, automated eligibility verification, and intelligent denial management workflows. The final phase introduces patient billing automation, real-time financial dashboards, and predictive analytics for revenue forecasting.",
      },
      {
        type: "paragraph",
        text: "A key success factor is customization by department. Orthopedics, for instance, has complex modifier requirements that need specialized rule sets, while primary care clinics benefit from optimized E/M level coding logic. Riveo Health configures workflows for each specialty's unique payer mix and coding requirements.",
      },
      {
        type: "heading",
        text: "What Results Can You Expect?",
      },
      {
        type: "paragraph",
        text: "Based on industry benchmarks for AI-powered revenue cycle automation, multi-specialty practices can typically expect improvements across several key areas:",
      },
      {
        type: "list",
        items: [
          "Significant reduction in days in A/R through faster clean-claim submission",
          "Lower denial rates with first-pass claim acceptance rates above 90%",
          "Recovery of previously written-off revenue through automated denial appeals and underpayment identification",
          "Increased billing staff productivity, allowing teams to handle growing volumes without adding headcount",
          "Reduced patient billing inquiries through proactive, automated payment communications",
        ],
      },
      {
        type: "paragraph",
        text: "The most meaningful metric for most practices is net collection rate. Organizations that adopt comprehensive AI-powered RCM consistently see improvement in this metric, translating directly to revenue growth without increasing patient volume.",
      },
      {
        type: "heading",
        text: "Getting Started",
      },
      {
        type: "paragraph",
        text: "The first step is understanding where your revenue cycle stands today. Riveo Health offers a free revenue leakage audit that identifies your specific areas of opportunity — missed charges, under-coding, underpayments, and process bottlenecks. From there, you can make an informed decision about where AI automation will deliver the greatest impact for your organization.",
      },
    ],
  },
  {
    slug: "ai-claim-scrubbing-reduces-denials",
    title: "How AI-powered claim scrubbing reduces denials by 60%",
    category: "Blog",
    description:
      "Pre-submission validation catches coding errors, missing modifiers, and payer-specific rule violations before they cost you money. Here's how it works under the hood.",
    image: "/blog/claims-ai.jpg",
    author: "Priya Sharma",
    authorRole: "Head of Product, Riveo Health",
    authorInitials: "PS",
    date: "Mar 12, 2026",
    readTime: "5 min read",
    cta: "Read the guide",
    content: [
      {
        type: "heading",
        text: "The Hidden Cost of Claim Denials",
      },
      {
        type: "paragraph",
        text: "Claim denials remain the single largest source of preventable revenue loss in healthcare. According to the American Hospital Association, the average cost to rework a denied claim is $25 to $118, and nearly 65% of denied claims are never resubmitted. For a mid-size practice processing 50,000 claims per year with a 15% denial rate, that translates to roughly $750,000 in annual write-offs — money that was earned through patient care but never collected due to administrative errors.",
      },
      {
        type: "paragraph",
        text: "The root causes are well understood: incorrect patient demographics, eligibility lapses, missing or incorrect modifiers, diagnosis-procedure mismatches, duplicate billing, and failure to meet payer-specific documentation requirements. What makes these problems so persistent is their sheer volume and variability. Each of the 900+ commercial payers in the United States maintains its own set of billing rules, many of which change quarterly. Keeping a human billing team current on all of these rules is practically impossible.",
      },
      {
        type: "heading",
        text: "How AI Claim Scrubbing Works",
      },
      {
        type: "paragraph",
        text: "AI-powered claim scrubbing applies machine learning models trained on hundreds of millions of historical claims to validate every claim before it is submitted to a payer. Unlike traditional rules-based scrubbers that rely on static, manually maintained rule libraries, AI scrubbers learn from actual adjudication outcomes. When a claim with a specific combination of CPT codes, modifiers, diagnosis codes, and payer is denied, the model incorporates that signal and begins flagging similar claims preemptively.",
      },
      {
        type: "paragraph",
        text: "The Riveo Health claim scrubbing engine operates in three layers. The first layer performs structural validation: checking for missing fields, invalid code formats, and data integrity issues. The second layer applies payer-specific rules, including modifier requirements, prior authorization checks, bundling and unbundling logic, and medical necessity screening based on LCD/NCD policies. The third layer uses predictive modeling to score each claim for denial risk based on patterns that may not be captured by explicit rules — subtle correlations between provider, facility, diagnosis, and payer that historically lead to adverse adjudication outcomes.",
      },
      {
        type: "heading",
        text: "Real-World Performance Metrics",
      },
      {
        type: "paragraph",
        text: "Based on industry research and platform testing, AI claim scrubbing has demonstrated consistent and measurable impact. Average denial rates drop from 12-18% to 4-7% within the first 60 days of deployment. First-pass acceptance rates improve from 78% to 94% on average. The median time from service to payment decreases by 11 days as clean claims move through adjudication without interruption.",
      },
      {
        type: "list",
        items: [
          "Modifier errors caught before submission: 94% detection rate",
          "Eligibility-related denials prevented: 87% reduction",
          "Bundling/unbundling corrections applied automatically: 12,000+ rules across major payers",
          "Average ROI realized within 45 days of deployment",
        ],
      },
      {
        type: "heading",
        text: "Beyond Scrubbing: Continuous Learning",
      },
      {
        type: "paragraph",
        text: "What truly differentiates AI-powered scrubbing from legacy approaches is the feedback loop. Every remittance advice, every ERA, every denial reason code is fed back into the model. The system does not just catch known errors — it identifies emerging denial patterns as payers update their policies. When payers tighten prior authorization requirements — as UnitedHealthcare did for outpatient imaging in Q1 2026 — AI-powered scrubbers can reflect the policy change in automated rules within 48 hours, while practices relying on manual rule updates are still dealing with a spike in denials weeks later.",
      },
      {
        type: "paragraph",
        text: "For revenue cycle leaders evaluating AI claim scrubbing solutions, the key questions to ask are: How many historical claims has the model been trained on? How frequently is the model updated? Does the system provide explainable recommendations so coders can learn from flagged issues? And critically, does the platform integrate bidirectionally with your EHR and practice management system to enable real-time, pre-submission scrubbing at the point of charge capture? The answers to these questions will determine whether you are adopting genuine AI or simply a rebranded rules engine.",
      },
    ],
  },
  {
    slug: "automate-patient-billing-communications",
    title: "Best practices to automate patient billing communications",
    category: "Blog",
    description:
      "Reduce inbound call volume by 70% while improving patient satisfaction with AI-driven multi-channel outreach across SMS, email, and WhatsApp.",
    image: "/blog/patient-comms.jpg",
    author: "James Rodriguez",
    authorRole: "Customer Success Lead, Riveo Health",
    authorInitials: "JR",
    date: "Mar 8, 2026",
    readTime: "6 min read",
    cta: "Discover how",
    content: [
      {
        type: "heading",
        text: "Why Patient Billing Communication Is Broken",
      },
      {
        type: "paragraph",
        text: "Patient financial responsibility now accounts for over 30% of healthcare revenue, up from just 10% a decade ago. As high-deductible health plans have become the norm, patients are shouldering a larger share of costs — and they expect the same transparent, digital-first billing experience they get from every other industry. Unfortunately, most healthcare organizations are still relying on mailed paper statements, confusing EOBs, and understaffed call centers to manage patient billing communications.",
      },
      {
        type: "paragraph",
        text: "The consequences are predictable. The average healthcare organization collects only 50-70% of patient responsibility balances. Inbound call volumes for billing inquiries consume enormous staff resources, with the average billing-related phone call costing $8-12 to handle. Patient satisfaction scores suffer, and in an era of online reviews and consumer choice, poor billing experiences directly impact patient retention and referral volume.",
      },
      {
        type: "heading",
        text: "The Multi-Channel Automation Framework",
      },
      {
        type: "paragraph",
        text: "Effective patient billing automation is not about sending more messages — it is about sending the right message, through the right channel, at the right time. Riveo Health uses a patient preference engine that learns each individual's communication preferences based on their engagement history. A patient who consistently opens email statements within 24 hours receives email-first outreach. A patient who ignores emails but responds to text messages within minutes gets SMS-first communication. This channel optimization alone improves engagement rates by 40-60% compared to one-size-fits-all approaches.",
      },
      {
        type: "paragraph",
        text: "The communication sequence follows a carefully designed cadence. Within 24 hours of claim adjudication, the patient receives a clear, plain-language explanation of what their insurance covered and what they owe. The message includes a one-tap link to a mobile-optimized payment portal with options for full payment, payment plans, and financial assistance applications. Follow-up reminders are spaced at intervals optimized through A/B testing — typically at 7, 14, and 28 days — with escalating urgency but always maintaining a respectful, empathetic tone.",
      },
      {
        type: "heading",
        text: "AI-Powered Conversational Billing",
      },
      {
        type: "paragraph",
        text: "Beyond automated outreach, Riveo Health deploys conversational AI agents that can handle the majority of patient billing inquiries without human intervention. These agents understand natural language questions like \"Why do I owe this much?\" or \"Can I set up a payment plan?\" and provide accurate, personalized responses drawn from the patient's actual claims and payment history. The AI agent can process payments, establish installment plans, verify insurance coverage, and escalate complex cases to human representatives with full context — eliminating the frustrating \"please hold while I look up your account\" experience.",
      },
      {
        type: "list",
        items: [
          "Inbound call volume reduced by 68-74% with automated billing communication",
          "Patient collection rates improved from 58% to 82% on average",
          "Time to first patient payment decreased from 45 days to 12 days",
          "Patient satisfaction scores for billing experience improved by 35 points (NPS)",
          "Staff time reallocated from phone calls to high-value denial management work",
        ],
      },
      {
        type: "heading",
        text: "Compliance and Empathy at Scale",
      },
      {
        type: "paragraph",
        text: "Automated billing communications must navigate a complex regulatory landscape including the No Surprises Act, state-level balance billing protections, TCPA regulations for electronic communications, and HIPAA requirements for protected health information. Riveo Health builds compliance into every message template and channel, with automatic suppression of communications during active insurance disputes, pending prior authorization reviews, or when a patient has initiated a financial hardship application. The goal is to make every patient interaction feel helpful rather than harassing — because a patient who feels respected is far more likely to pay their balance and return for future care.",
      },
    ],
  },
  {
    slug: "revenue-leakage-guide",
    title: "The complete guide to finding and fixing revenue leakage",
    category: "Guide",
    description:
      "Most practices lose $125K+ per year to missed charges, under-coding, and timely filing failures. This guide shows you exactly where to look and how to fix it.",
    image: "/blog/revenue-leakage.jpg",
    author: "Riveo Health Team",
    authorRole: "Revenue Cycle Insights",
    authorInitials: "RH",
    date: "Mar 3, 2026",
    readTime: "10 min read",
    cta: "Download the guide",
    content: [
      {
        type: "heading",
        text: "What Is Revenue Leakage and Why Does It Matter?",
      },
      {
        type: "paragraph",
        text: "Revenue leakage in healthcare refers to the systematic loss of earned revenue due to process failures, coding inaccuracies, missed charges, contractual underpayments, and administrative errors throughout the revenue cycle. Unlike denied claims — which are visible and trackable — revenue leakage is often invisible. It hides in the gap between what a practice should collect and what it actually collects, and most organizations significantly underestimate its magnitude.",
      },
      {
        type: "paragraph",
        text: "Industry research consistently shows that the average physician practice loses between 5% and 10% of net revenue to leakage. For a practice generating $10 million annually, that is $500,000 to $1 million walking out the door every year. For health systems, the numbers are even more dramatic — large IDNs routinely identify $20-50 million in recoverable leakage during comprehensive audits. The insidious nature of leakage is that each individual instance may be small, but they compound across thousands of patient encounters into substantial financial impact.",
      },
      {
        type: "heading",
        text: "The Five Primary Sources of Revenue Leakage",
      },
      {
        type: "list",
        items: [
          "Missed charge capture: Services rendered but never billed, particularly common in ancillary departments, multi-provider encounters, and same-day add-on procedures",
          "Under-coding: Providers who habitually code at lower E/M levels than documentation supports, often due to fear of audits or lack of coding education",
          "Timely filing failures: Claims that miss payer submission deadlines due to workflow bottlenecks, resulting in automatic write-offs with zero recourse",
          "Contractual underpayments: Payers reimbursing below contracted rates, which goes undetected without automated contract compliance monitoring",
          "Credentialing gaps: Providers treating patients before payer credentialing is complete, resulting in retroactive denial of all claims during the gap period",
        ],
      },
      {
        type: "heading",
        text: "Diagnosing Leakage: Where to Start",
      },
      {
        type: "paragraph",
        text: "The first step in addressing revenue leakage is measurement. You cannot fix what you cannot see. Begin with a charge capture audit: compare scheduled appointments against billed encounters for a 90-day period. Any scheduled visit that does not have a corresponding claim represents a potential missed charge. In our experience, practices typically find a 3-8% gap in this analysis, with the highest rates in procedural specialties where ancillary services like imaging, lab work, and supplies are frequently overlooked.",
      },
      {
        type: "paragraph",
        text: "Next, conduct a coding accuracy assessment. Pull a statistically significant sample of charts — at least 100 per provider — and have them independently reviewed by a certified coder. Compare the audit results against what was actually billed. Pay particular attention to E/M leveling: studies show that 20-30% of evaluation and management visits are under-coded by at least one level, representing an average loss of $30-50 per visit. For a provider seeing 25 patients per day, that adds up to $150,000-$250,000 in annual under-coding per physician.",
      },
      {
        type: "heading",
        text: "Building a Leakage Prevention Framework",
      },
      {
        type: "paragraph",
        text: "Effective leakage prevention requires technology, process design, and accountability working together. On the technology side, implement real-time charge capture validation that flags missing charges before the billing window closes. Deploy AI-assisted coding that suggests appropriate code levels based on documentation. Activate automated contract compliance monitoring that compares every remittance against expected reimbursement and generates variance alerts for underpayments exceeding a defined threshold.",
      },
      {
        type: "paragraph",
        text: "On the process side, establish a weekly revenue integrity huddle where coding, billing, and clinical leadership review key leakage metrics: charge lag, coding distribution curves, timely filing rates, and underpayment recovery. Assign clear ownership for each leakage category and set measurable reduction targets. The organizations that treat revenue integrity as a continuous discipline rather than an annual audit consistently outperform their peers in net collection rate and revenue per encounter.",
      },
      {
        type: "heading",
        text: "The Role of AI in Closing the Leakage Gap",
      },
      {
        type: "paragraph",
        text: "Manual auditing and rules-based monitoring will always be necessary, but they cannot scale to cover every claim and every encounter. This is where AI-powered revenue integrity platforms like Riveo Health deliver transformational value. By analyzing every charge, every code, every remittance, and every contract term in real time, AI can identify leakage patterns that would take human auditors months to uncover. More importantly, AI moves the intervention point upstream — catching missed charges at the point of care, flagging under-coding before claim submission, and identifying underpayments the day a remittance is posted rather than months later during a retrospective audit.",
      },
    ],
  },
  {
    slug: "icd10-auto-coding-clinical-notes",
    title:
      "ICD-10 auto-coding: How AI converts clinical notes to accurate codes in seconds",
    category: "Blog",
    description:
      "Manual coding errors account for 30-40% of claim rejections. See how AI-powered coding handles modifiers, bundling rules, and payer-specific requirements automatically.",
    image: "/blog/medical-coding.jpg",
    author: "Priya Sharma",
    authorRole: "Head of Product, Riveo Health",
    authorInitials: "PS",
    date: "Feb 26, 2026",
    readTime: "7 min read",
    cta: "Learn more",
    content: [
      {
        type: "heading",
        text: "The Coding Bottleneck in Modern Healthcare",
      },
      {
        type: "paragraph",
        text: "Medical coding is the critical translation layer between clinical documentation and revenue. Every patient encounter must be accurately represented by a combination of ICD-10 diagnosis codes, CPT/HCPCS procedure codes, and appropriate modifiers before a claim can be submitted. The complexity of this task is staggering: the ICD-10-CM code set contains over 72,000 diagnosis codes, CPT includes more than 10,000 procedure codes, and the rules governing their valid combinations, sequencing, and modifier usage fill thousands of pages of payer-specific guidelines.",
      },
      {
        type: "paragraph",
        text: "The healthcare industry faces a severe shortage of certified medical coders. AAPC estimates that the United States needs 30,000 additional coders to meet current demand, and the gap is widening as experienced coders retire and healthcare volume grows. This shortage drives up costs — experienced coders now command salaries exceeding $65,000, and outsourced coding services charge $5-8 per chart — while also increasing turnaround times. Many practices experience coding backlogs of 48-72 hours, directly delaying claim submission and extending days in A/R.",
      },
      {
        type: "heading",
        text: "How AI Auto-Coding Works",
      },
      {
        type: "paragraph",
        text: "AI auto-coding uses natural language processing (NLP) to read clinical documentation — progress notes, operative reports, discharge summaries, and diagnostic results — and extract codeable information. Modern NLP models go far beyond simple keyword matching. They understand clinical context, negation (\"patient denies chest pain\" should not generate a chest pain diagnosis code), temporal relationships (\"history of\" versus \"current\" conditions), and the hierarchical structure of medical terminology.",
      },
      {
        type: "paragraph",
        text: "The Riveo Health auto-coding engine processes clinical notes through a multi-stage pipeline. First, the NLP model identifies clinical concepts and maps them to candidate codes. Second, a specificity optimizer checks whether the documentation supports the highest level of code specificity — for instance, distinguishing between type 2 diabetes without complications (E11.9) and type 2 diabetes with diabetic chronic kidney disease (E11.22) based on the full clinical picture. Third, a compliance validator ensures correct code sequencing, verifies that diagnosis codes support the medical necessity of reported procedures, and applies payer-specific bundling and modifier rules.",
      },
      {
        type: "heading",
        text: "Accuracy and the Human-AI Collaboration Model",
      },
      {
        type: "paragraph",
        text: "A common concern with AI coding is accuracy. Can a machine really match a certified coder? The data shows that well-trained AI models achieve 92-96% accuracy on straightforward encounters such as primary care E/M visits, routine imaging, and standard lab panels. For complex cases — multi-system surgical procedures, interventional radiology, or oncology treatment protocols — accuracy ranges from 82-88%, which is why the optimal deployment model is human-AI collaboration rather than full automation.",
      },
      {
        type: "paragraph",
        text: "In this model, the AI handles the high-volume, lower-complexity coding that consumes most of a coding team's time, while flagging complex cases for human review with pre-populated code suggestions and supporting documentation excerpts. This approach typically reduces coding turnaround time from 48 hours to under 4 hours while maintaining or improving accuracy. Human coders shift from production coding to quality assurance and complex case review — work that is more intellectually engaging and better utilizes their expertise.",
      },
      {
        type: "heading",
        text: "Impact on Revenue Cycle Performance",
      },
      {
        type: "list",
        items: [
          "Coding turnaround reduced from 48-72 hours to under 4 hours",
          "Coding accuracy improved from 88% (manual average) to 95% (AI-assisted)",
          "Claim rejection rate due to coding errors decreased by 62%",
          "Coder productivity increased 3x, enabling existing staff to handle growing volumes",
          "Under-coding identified and corrected on 18% of E/M visits, increasing average reimbursement by $34 per encounter",
        ],
      },
      {
        type: "heading",
        text: "Preparing Your Organization for AI Coding",
      },
      {
        type: "paragraph",
        text: "Successful AI coding implementation requires three prerequisites. First, your clinical documentation must be accessible in a structured or semi-structured digital format — practices still relying on dictated, unstructured notes will need to address documentation quality before AI can deliver reliable results. Second, your coding team needs to be engaged as partners in the implementation, not treated as being replaced. The most successful deployments position AI as a productivity multiplier that eliminates tedious work and lets coders focus on complex, high-value cases. Third, you need robust feedback loops: every code that a human coder overrides should flow back into the model as training data, enabling continuous improvement specific to your organization's specialty mix and documentation patterns.",
      },
    ],
  },
  {
    slug: "realtime-revenue-dashboards-demo",
    title: "Live demo: Real-time revenue dashboards that CFOs actually use",
    category: "Webinar",
    description:
      "Stop waiting for month-end reports. See how Riveo Health gives you live visibility into claims pipeline, denial trends, and payer performance.",
    image: "/blog/analytics-dashboard.jpg",
    author: "James Rodriguez",
    authorRole: "Customer Success Lead, Riveo Health",
    authorInitials: "JR",
    date: "Feb 20, 2026",
    readTime: "45 min watch",
    cta: "Watch the replay",
    content: [
      {
        type: "heading",
        text: "Why Month-End Reporting Is No Longer Enough",
      },
      {
        type: "paragraph",
        text: "For decades, healthcare financial leaders have managed their revenue cycle by looking in the rearview mirror. Month-end close processes that take 10-15 business days to complete mean that by the time a CFO sees their denial rate, days in A/R, or net collection rate, the data is already three to six weeks old. In an industry where a single payer policy change can trigger a denial spike affecting thousands of claims overnight, this lag is not just inconvenient — it is financially dangerous.",
      },
      {
        type: "paragraph",
        text: "The shift to real-time revenue analytics is driven by the same forces that transformed financial services and e-commerce: the recognition that timely information enables proactive intervention. A denial trend identified on day one can be addressed before it impacts hundreds of additional claims. A drop in first-pass acceptance rate visible within hours of a payer policy change allows immediate workflow adjustment. An uptick in coding rejections for a specific provider can trigger same-day education and correction rather than a retrospective audit weeks later.",
      },
      {
        type: "heading",
        text: "Inside the Riveo Health Analytics Dashboard",
      },
      {
        type: "paragraph",
        text: "The Riveo Health real-time dashboard is organized around four core views designed for different stakeholders. The Executive View provides CFOs and practice administrators with a high-level financial snapshot: current days in A/R, net collection rate, denial rate, and cash flow projections — all updated in real time as claims move through the adjudication lifecycle. Trend indicators show directional movement compared to the prior period, and anomaly alerts highlight any metric that deviates from its expected range by more than two standard deviations.",
      },
      {
        type: "paragraph",
        text: "The Operations View gives revenue cycle managers drill-down visibility into work queues, staff productivity, and bottleneck identification. How many claims are in each stage of the pipeline? Which denial categories are trending up? Which payers have the longest average adjudication times? This view enables real-time workload balancing and priority management — ensuring that the highest-value, most time-sensitive items receive attention first.",
      },
      {
        type: "heading",
        text: "Payer Performance Intelligence",
      },
      {
        type: "paragraph",
        text: "One of the most powerful capabilities demonstrated in this webinar is payer performance benchmarking. Riveo Health aggregates anonymized reimbursement data from publicly available sources and industry databases to show how each payer performs relative to contracted rates and industry benchmarks. This intelligence is invaluable during contract negotiations: rather than relying on internal data alone, practice leaders can see how their rates compare to regional averages and identify specific CPT codes where they are being systematically underpaid.",
      },
      {
        type: "list",
        items: [
          "Real-time tracking of 47 revenue cycle KPIs across all payers",
          "Anomaly detection alerts within 2 hours of trend deviation",
          "Payer scorecards comparing contracted versus actual reimbursement",
          "Predictive cash flow forecasting with 94% accuracy at 30-day horizon",
          "Custom report builder with automated distribution scheduling",
        ],
      },
      {
        type: "heading",
        text: "From Data to Action: Closed-Loop Analytics",
      },
      {
        type: "paragraph",
        text: "The real value of a dashboard is not the data it displays — it is the actions it enables. Riveo Health dashboards are designed with what we call closed-loop analytics: every metric, chart, and alert is connected to an actionable workflow. Clicking on a denial rate spike does not just show you the numbers — it takes you directly to the affected claims, pre-sorted by recovery potential, with AI-generated appeal templates ready for review and submission. This tight integration between insight and action is what transforms analytics from a reporting tool into an operational accelerator.",
      },
      {
        type: "paragraph",
        text: "During this 45-minute webinar, we walk through each dashboard view with live data, demonstrate the anomaly detection and alerting system, show how to build custom reports for board presentations, and share best practices from CFOs who have made the transition from monthly reporting to real-time revenue management. The recording also includes a 15-minute Q&A session covering implementation timelines, data security architecture, and integration requirements for common EHR platforms.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
