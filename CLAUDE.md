# Riveo Health — AI-Native Healthcare Revenue & Interaction OS

## Role

You are the **CEO-level AI strategist** for Riveo Health. You understand the full business — product, market, GTM, technology, and competitive landscape. Every decision should optimize for **market dominance in healthcare RCM** and **path to $1B ARR**.

---

## Company Overview

**Brand**: Riveo Health
**Tagline**: Revenue OS
**Domain**: riveohealth.com
**Category**: AI-native Healthcare Revenue Cycle Management (RCM)

### Mission
Eliminate revenue leakage and administrative burden so healthcare providers can focus on patient care.

### Vision
Become the operating system that powers every healthcare financial transaction.

### Core Principle
Don't build software. Build a **revenue control system**.

---

## Product Architecture (5 Layers)

### Layer 1: Patient Interaction Agent
- AI Chat, Voice, WhatsApp, SMS, Email
- Booking, billing queries, insurance support, payment reminders
- Tech: LLMs (Claude/OpenAI), Whisper/Deepgram, ElevenLabs

### Layer 2: Revenue Intelligence Engine
- Claim creation, validation, submission
- Denial tracking, root cause analysis, auto-resubmission
- Payment tracking, automated follow-ups

### Layer 3: AI Decision Engine
- Clinical notes → ICD-10/CPT auto-coding
- Denial prediction model (95%+ accuracy)
- Next best action recommendations
- Conversational AI for staff/patient queries

### Layer 4: Analytics & Insights
- Real-time revenue dashboards
- Revenue leakage detection ($78K avg found per audit)
- Payer performance tracking
- Staff productivity metrics, 50+ custom reports

### Layer 5: Integrations
- EHR/HIS: Epic, Cerner, athenahealth, eClinicalWorks (40+)
- Insurance APIs, clearinghouses
- Payment gateways, CRM systems
- Standards: HL7 FHIR, REST, webhooks

---

## Technology Stack

### Frontend (This Codebase)
- **Next.js 16** + **TypeScript** + **Tailwind CSS 4**
- **React** — Dashboard, Billing UI, Agent UI, White-label portals

### Backend
- **Python (FastAPI)** — AI services, ML pipelines
- **Node.js (NestJS)** — APIs, real-time services
- **Architecture**: Microservices, event-driven, multi-tenant

### AI / LLM Layer
- **Primary Model**: Claude Opus (Anthropic API) — reasoning, conversation, workflow intelligence
- **Orchestration**: LangChain / LlamaIndex (or custom orchestrator)
- **Voice STT**: Deepgram / Whisper
- **Voice TTS**: ElevenLabs / Azure Speech
- **Vector DB**: Pinecone / Weaviate — patient context, claim history, knowledge retrieval

### Data Layer
- **Primary DB**: MongoDB Atlas (cloud-native, document-based)
- **Cache**: Redis
- **Event Streaming**: Kafka
- **Search**: Elasticsearch
- **Data Warehouse**: Snowflake / BigQuery

### Cloud & Infrastructure
- **Providers**: AWS / GCP
- **Observability**: Datadog / Prometheus

### AI Data Flow (PHI-Safe Architecture)
```
Frontend → Backend (secure layer) → Data Processor (mask/structure PHI) → Claude API → Post-Processor (validation) → Frontend
```
- Never send raw PHI to LLM — always mask/tokenize patient data
- Send structured JSON (patient_id, condition, issue) instead of raw text
- Human-in-loop for all critical medical/clinical decisions
- Audit logs for every AI interaction

### MVP Stack (Start With)
| Layer | Tool |
|-------|------|
| AI | Claude Opus (Anthropic API) |
| Backend | FastAPI (Python) |
| Frontend | Next.js 16 + React |
| Database | MongoDB Atlas |
| Vector DB | Pinecone |
| Cache | Redis |
| Cloud | AWS |

### Scale Stack (After Traction)
- Add: Kafka, Elasticsearch, Snowflake, custom fine-tuned models
- Multi-tenant infrastructure, event-driven architecture
- Prompt versioning, A/B testing, feedback loops

---

## Key Metrics & Proof Points

These are technology/testing benchmarks (NOT client results — we are a new company):

- **97%** first-pass claim acceptance rate (in testing)
- **95%** coding accuracy (AI auto-coding)
- **< 2 sec** per-claim AI analysis
- **50M+** claims data trained on
- **40+** EHR integrations ready
- **< 7 days** implementation time
- **99.9%** uptime SLA

---

## Target Customers

| Segment | Description | Pricing Range |
|---------|-------------|---------------|
| Hospitals & Health Systems | Multi-facility, high volume | $5K-$10K/month |
| Physician Practices | 5-200 physicians | $2K-$5K/month |
| RCM Companies | White-label platform | Custom |
| Billing Services | End-to-end automation | $2K-$5K/month |

---

## Ideal Customer Profile (ICP) & Buyer Personas

### Primary ICP: Mid-Size Physician Practices (Best First Target)
- **Size**: 5-50 physicians, 1-5 locations
- **Revenue**: $5M-$50M annually
- **Claims volume**: 5,000-50,000/month
- **Why them first**: Big enough to have real pain, small enough to decide fast. No enterprise procurement. Billing manager has authority to buy
- **Red flag clients**: Solo practitioners (can't afford it), 500+ bed hospitals (12-month sales cycle)

### Persona 1: Billing Manager / Revenue Cycle Director (Primary Buyer)
- **Title**: Billing Manager, RCM Director, Revenue Cycle Manager
- **Age**: 35-55, mostly women (80%+ of billing workforce)
- **Daily pain**:
  - Starts day with 200+ denied claims to work
  - Spends 3-4 hrs/day on phone with insurance companies
  - Manually posts payments, follows up on AR aging 90+ days
  - Trains new staff every 3 months (turnover is constant)
  - Gets blamed when collections drop
- **What they Google**: "how to reduce claim denials", "RCM automation software", "medical billing AI"
- **What triggers purchase**: Denial rate spikes above 10%, staff quits, revenue drops, audit reveals leakage
- **How to sell them**: Show the free audit results → "You're leaking $78K/year. We fix that in 7 days"
- **Objection**: "We've used [current software] for years, switching is scary"
- **Counter**: Month-to-month, no contracts. We run alongside your current system first

### Persona 2: CFO / Practice Administrator (Economic Buyer)
- **Title**: CFO, Practice Administrator, Office Manager, VP of Finance
- **Daily pain**:
  - Cash flow unpredictable — doesn't know what's coming in next month
  - Board/partners asking why revenue is flat when patient volume is up
  - Can't get real-time visibility into financial performance
  - Paying 5-8% of collections to outsourced billing company and not sure they're good
- **What triggers purchase**: Board pressure on margins, considering switching billing companies, revenue declining despite volume growth
- **How to sell them**: ROI calculator → "We cost $5K/month and recover $15K+/month in leakage. 3x ROI from day 30"
- **Objection**: "How do I know AI won't make errors with our claims?"
- **Counter**: Human-in-loop for all critical decisions. 97% first-pass rate in testing. You approve everything

### Persona 3: RCM Company Owner (White-Label Buyer)
- **Title**: CEO/Owner of billing company, VP of Operations at RCM firm
- **Size**: Managing billing for 10-100+ practices
- **Daily pain**:
  - Hiring and retaining billers is impossible (low pay, high burnout)
  - Margins shrinking — clients demanding more, paying same
  - Competitors starting to advertise "AI-powered" (even if it's not real)
  - Scaling means hiring more people linearly
- **What triggers purchase**: Client churn, margin pressure, competitor threat, can't hire fast enough
- **How to sell them**: "White-label our AI under your brand. Handle 3x the clients with the same team. Your margins go from 15% to 40%"
- **Objection**: "Will you steal our clients?"
- **Counter**: White-label only. Your brand, your relationship. We're infrastructure, not competition

### Persona 4: Hospital CIO / VP of Revenue Cycle (Enterprise Buyer — Phase 2)
- **Title**: CIO, VP Revenue Cycle, Chief Revenue Officer
- **Daily pain**:
  - $5M-$50M+ in annual denials
  - 15+ systems that don't talk to each other
  - IT team stretched thin, can't build in-house
  - Board mandating "AI strategy" but no clear path
- **What triggers purchase**: New CIO wanting quick wins, merger/acquisition creating system chaos, CMS reimbursement changes
- **How to sell them**: Pilot with one department (ED or Ortho), prove ROI in 30 days, expand
- **Sales cycle**: 4-8 months. Requires security review, BAA, IT approval
- **Don't target first** — come back to hospitals after 20+ practice wins as proof

### Buying Signals (When to Strike)
- Job posting for "Medical Biller" or "RCM Manager" (they're struggling with staff)
- Practice posting negative reviews about billing/wait times
- New practice administrator hired (new leaders buy new tools)
- Practice recently switched EHR (open to more change)
- RCM company advertising on job boards heavily (scaling pain)
- Conference attendees at HFMA, MGMA, HIMSS events

---

## Business Model

### Phase 1: RCM Contracts (Current)
- Monthly SaaS subscription
- ₹1L-₹2L/month (India), $2K-$10K/month (US)

### Phase 2: Platform SaaS
- Subscription + automation fees
- White-label licensing

### Phase 3: Financial Infrastructure
- % of payments processed
- % of claims processed
- Transaction layer revenue

---

## Pricing Strategy (Detailed)

### Pricing Philosophy
- **Land cheap, expand on value** — Get in the door with affordable base, upsell as ROI is proven
- **Month-to-month always** — No annual contracts. Confidence signal. Reduces buying friction
- **ROI-first conversation** — Never sell price, sell the delta ("You're losing $400K, we cost $60K")

### US Pricing Tiers

| Tier | Target | Monthly Price | What's Included |
|------|--------|:---:|-----------------|
| **Starter** | Small practices (1-5 docs) | $1,500-$2,000 | Claims management, denial tracking, basic analytics, email support |
| **Growth** | Mid practices (5-25 docs) | $3,000-$5,000 | + AI coding, patient interaction agent, payment automation, priority support |
| **Enterprise** | Large practices / hospitals (25+ docs) | $5,000-$10,000 | + Custom integrations, dedicated CSM, white-glove onboarding, SLA |
| **White-Label** | RCM companies | Custom ($10K-$50K+) | Full platform under their brand, API access, multi-tenant, volume pricing |

### India Pricing Tiers

| Tier | Target | Monthly Price |
|------|--------|:---:|
| **Starter** | Small clinics / nursing homes | ₹50K-₹1L |
| **Growth** | Mid hospitals (50-200 beds) | ₹1L-₹2L |
| **Enterprise** | Large hospitals / chains | ₹2L-₹5L |

### Pilot / Free Audit Strategy (The Hook)
1. **Free Revenue Audit** (no commitment) — Analyze 30-90 days of claims data, show leakage amount
2. **30-Day Pilot** (paid, discounted 50%) — Run live with one department or location
3. **Full Rollout** — If pilot shows ROI, expand to full org at standard pricing
- **Conversion target**: 60%+ from audit → pilot, 80%+ from pilot → full

### Upsell Path
| Stage | Trigger | Upsell |
|-------|---------|--------|
| Month 1-3 | Base RCM running | + Patient Interaction Agent ($500-$1K/mo) |
| Month 3-6 | Seeing denial reduction | + AI Coding Engine ($500-$1K/mo) |
| Month 6-12 | Full trust established | + Analytics & Custom Reports ($500-$1K/mo) |
| Month 12+ | Deeply embedded | + Payment Processing (% of collections) |

### Competitive Pricing Comparison
| Solution | Monthly Cost | What You Get |
|----------|:---:|--------------|
| Outsourced billing company | 5-8% of collections ($5K-$50K+/mo) | Humans doing manual work, slow, error-prone |
| Athenahealth | $3K-$15K/mo | SaaS platform, no AI agents |
| R1 RCM / Ensemble | $10K-$100K+/mo | Service + people on-site |
| **Riveo Health** | **$1.5K-$10K/mo** | **AI-native, faster, more accurate, lower cost** |

### Pricing Rules
- Never discount more than 30% (even for pilots)
- Annual prepay gets 15% discount (only if client asks — never offer first)
- White-label minimum commitment: 6 months (only exception to month-to-month)
- Free audit is ALWAYS free — never charge for the hook
- Price on value, not cost — if we save $400K/year, $60K/year is a no-brainer

---

## Go-To-Market Strategy

### Sales Motion
1. **Outreach** → Target CFO / billing heads
2. **Discovery** → Understand their pain
3. **Free Revenue Audit** → Show leakage (this is the hook)
4. **Live Demo** → Personalized to their org
5. **Close** → Month-to-month, no contracts

### Distribution
- Direct sales to healthcare orgs
- White-label through RCM firms
- Partner network (consultants, integrators)
- **Key insight**: Distribution > Product

### Sales Cycle
- India: 3-6 weeks
- US: 4-8 weeks

---

## Competitive Landscape

| Competitor | Category | Size | Delivery Model |
|-----------|----------|------|----------------|
| R1 RCM | Service | ~$2B revenue | Service + On-site (outsourced staff deployed at hospitals, some cloud tools) |
| Ensemble Health (Waystar) | Service | ~$13B valuation | SaaS + Service hybrid (cloud platform + managed services) |
| Athenahealth | SaaS | ~$2B ARR | Pure SaaS / cloud-native (closest to our approach, but no AI agent layer) |
| Optum | Infrastructure | $200B+ division | On-premise + Cloud hybrid (legacy installs + newer cloud offerings) |
| Change Healthcare | Infrastructure | $3-4B | On-premise → Cloud migration (historically on-premise, slowly moving) |
| Epic (billing module) | EHR | Dominant market | On-premise (installed on hospital servers, hospitals manage infra) |
| Cerner (Oracle Health) | EHR | Large | On-premise → Cloud (Oracle pushing cloud migration) |

### Competitor Delivery Model Summary

| Category | Delivery | Revenue Model |
|----------|----------|---------------|
| **Legacy players** (Epic, Cerner, Change) | On-premise / hybrid | License + maintenance fees |
| **Service players** (R1, Ensemble) | People + some SaaS | Per-FTE or % of collections |
| **Modern SaaS** (Athenahealth) | Cloud-native | Subscription (% of revenue or flat fee) |
| **Riveo Health (Us)** | Cloud-native SaaS + AI agents | Subscription → transaction fees |

### Why We Win
- Legacy on-premise installs take **6-12 months** to deploy — we deploy in **< 7 days**
- Service companies require **hiring staff** at client sites — we use AI agents
- Hybrid models create **maintenance overhead** — we auto-update, zero client maintenance
- No major competitor is fully **AI-native + cloud-only + agent-driven**
- Athenahealth is closest (SaaS) but lacks the AI agent layer
- Industry in **forced migration**: margins squeezed, labor shortages make service models unsustainable, cloud-native + AI is the only model that scales without linear headcount

### Our Gap / Moat
No AI-native company combining **Interaction + Revenue + Financial Infrastructure**.

### Moat Strategy
1. **Data moat** — Claims + outcomes data grows with every transaction
2. **Workflow lock-in** — Deep integration into daily operations
3. **Partner ecosystem** — Network effect via RCM firms
4. **Financial layer** — Processing payments creates platform effect

---

## Market Opportunity

- Global Healthcare: $10T+ total spend
- Admin & Billing Layer: $2T-$3T
- RCM Market: $150B-$200B globally
- Payments + Claims Infra: $300B-$500B+

---

## Path to $1B ARR

| Phase | Focus | Revenue Target |
|-------|-------|----------------|
| 1 | RCM Engine | $10M-$30M ARR |
| 2 | SaaS Platform | $100M-$300M ARR |
| 3 | Payments + Network | $1B+ ARR |

---

## Scaling Targets

| Milestone | Clients | Team Size |
|-----------|---------|-----------|
| 30 days | 5 clients | 6-8 people |
| 90 days | 20-30 clients | 15-20 people |
| 1 year | 200+ clients | 30-60 people |
| Scale | 1000+ clients | 80-150 people |

---

## Product Roadmap

### Q2 2026 (Apr-Jun) — Foundation & First Clients
**Theme**: Ship core RCM, land 5 paying clients

| Priority | Feature | Status |
|:---:|---------|--------|
| P0 | Claims management (create, validate, submit) | Build |
| P0 | Denial tracking & alerting dashboard | Build |
| P0 | Basic analytics (denial rate, AR aging, collections) | Build |
| P0 | EHR integration (athenahealth + 2 more) | Build |
| P1 | Patient billing inquiry agent (chat) | Build |
| P1 | Insurance eligibility verification | Build |
| P1 | Client onboarding flow (data import, setup wizard) | Build |
| P2 | Payment posting automation | Design |

**Success metric**: 5 paying clients, <5% churn, NPS 50+

### Q3 2026 (Jul-Sep) — AI Engine & Patient Interaction
**Theme**: AI becomes the differentiator

| Priority | Feature | Status |
|:---:|---------|--------|
| P0 | AI auto-coding (ICD-10/CPT from clinical notes) | Build |
| P0 | Denial prediction model (flag high-risk claims before submission) | Build |
| P0 | Patient interaction agent — voice + SMS + WhatsApp | Build |
| P1 | Auto-resubmission for denied claims | Build |
| P1 | Payment reminder automation (multi-channel) | Build |
| P1 | Payer performance analytics | Build |
| P2 | Prior authorization automation | Design |
| P2 | Staff productivity dashboard | Design |

**Success metric**: 20+ clients, 95%+ AI coding accuracy, measurable denial reduction

### Q4 2026 (Oct-Dec) — Scale & White-Label
**Theme**: Platform for others to build on

| Priority | Feature | Status |
|:---:|---------|--------|
| P0 | White-label platform (multi-tenant, custom branding) | Build |
| P0 | API layer for RCM companies to integrate | Build |
| P0 | Prior authorization automation (full) | Build |
| P1 | Revenue leakage detection engine (free audit tool) | Build |
| P1 | Advanced reporting (50+ reports, custom builder) | Build |
| P1 | Contract underpayment detection | Build |
| P2 | Patient payment plans & financing | Design |
| P2 | Credentialing management | Design |

**Success metric**: 50+ clients, 3+ white-label partners, $500K+ ARR

### Q1 2027 (Jan-Mar) — Intelligence & Expansion
**Theme**: From tool to operating system

| Priority | Feature | Status |
|:---:|---------|--------|
| P0 | Real-time revenue forecasting (AI-powered) | Build |
| P0 | Patient payment processing (become payment layer) | Build |
| P0 | 20+ EHR integrations live | Build |
| P1 | Claims routing optimization (clearinghouse intelligence) | Build |
| P1 | Benchmarking (compare client performance vs industry) | Build |
| P1 | Mobile app for practice owners (revenue at a glance) | Build |
| P2 | Referral management | Design |
| P2 | Compliance monitoring (CMS rule changes auto-alerts) | Design |

**Success metric**: 200+ clients, $2M+ ARR, hospital pilot started

### Future (2027+) — Financial Infrastructure
- Payment processing (% of every transaction)
- Claims clearinghouse (route claims directly)
- Healthcare lending / financing for patients
- Payer contract negotiation AI
- M&A: Acquire niche RCM tools, integrate into platform

### Roadmap Rules
- **P0** = Must ship this quarter. No excuses
- **P1** = Should ship. Slip to next quarter if needed
- **P2** = Design only. Build next quarter
- **Never build without a client asking for it** (except core infrastructure)
- **Every feature must show ROI** — if you can't tie it to dollars saved/recovered, don't build it
- **Ship weekly** — small releases, continuous deployment

---

## 8-Week Execution Playbook (Research-Backed)

Based on real early-stage playbooks of Waystar, Cedar, Akasa, Collectly, Infinx, Fathom, Nym Health, Abridge + YC/a16z/General Catalyst healthcare recommendations.

### Core Principle: What Actually Works vs What Founders Think Works

| What founders think works | What actually works |
|--------------------------|-------------------|
| Build full platform, then sell | Pick ONE wedge workflow, sell that |
| Cold email 1000 prospects | Get 3-5 design partners through relationships |
| Launch at conferences | Embed yourself in one clinic's billing office |
| "AI-powered RCM platform" pitch | "You lost $78K last year to denials. We fix that." |
| Full automation from day 1 | AI + humans behind the scenes guaranteeing results |
| Sell to hospitals first | Sell to 5-50 physician practices first |

### The Wedge (Pick ONE — Do Nothing Else for 8 Weeks)

| Wedge | Who did this | Why it works |
|-------|-------------|-------------|
| **Denial prevention & auto-resubmission** | Akasa, Waystar | Most painful, clearest dollar ROI |
| Patient billing agent (SMS/WhatsApp) | Cedar, Collectly | Visible, easy to demo, improves collections |
| Prior authorization automation | Infinx | Most hated workflow, 14 hrs/week wasted (AMA) |

**Recommended wedge**: Denial prevention & auto-resubmission

### Week 1-2: Find Design Partners

A design partner = a practice that lets you sit with their billing team, use your tool for free, and give feedback. NOT a customer yet.

**How successful companies found them:**
- **Founder's network** (Abridge founder worked at UPMC → became client #1)
- **Local geography** (Waystar sold to Louisville practices first, Waymark started with Michigan Blue Cross)
- **LinkedIn warm intros** through mutual connections (not cold outreach)
- **1 advisor with a rolodex** — former billing manager or RCM consultant, offer equity (Akasa hired salespeople with existing health system relationships)
- **Direct ask**: "Can I sit with your billing team for one day? I'll buy lunch" (YC's standard advice)

**Deliverables**: Wedge chosen, 10-20 warm conversations, 1-2 design partners agreed

### Week 3-4: Embed in Billing Office & Build Wedge MVP

**What Olive AI and Infinx did**: Literally sat in billing offices watching staff work, then built automation for exactly what they saw.

**Embedding schedule:**
- Day 1: Watch billing staff process denials. Write down every click, call, frustration. Don't pitch
- Day 2: Map exact workflow — claim denied → read reason → call payer → fix → resubmit. Count minutes per step
- Day 3: Identify 80/20 — which 3-5 denial reasons make up 80% of denials
- Day 4-5: Show rough prototype, get reaction

**Wedge MVP (not a platform):**
```
Upload denied claims (CSV or PMS connect)
    ↓
AI analyzes: denial reason, root cause, suggested fix
    ↓
Dashboard: denials by reason, priority-ranked, pre-filled corrections
    ↓
One-click resubmit (or staff reviews + submits)
```

**Critical — AI + humans behind the scenes**: Infinx had staff handling prior auths while their AI learned. You manually review AI outputs for first 5 clients. Promise results, not technology.

**Run in shadow mode** (what Nym Health did): AI codes alongside human coders so practice compares accuracy. No risk.

**Deliverables**: 2-3 days spent in billing office, wedge MVP built, shadow mode running at 1-2 design partners

### Week 5-6: Free Revenue Audit & Letters of Intent

**What Cedar did**: Performance-based pricing — only paid on incremental revenue collected. Zero risk to buyer.

**Run the free audit** using design partner's actual data:
- Current denial rate vs projected with Riveo
- % of denials currently reworked vs with Riveo (95%+)
- Days to resubmit (current vs 2 days)
- Annual revenue impact ($78K-$200K)

**Get LOIs** (YC's advice — get written commitments before product is perfect):
> "If Riveo Health delivers denial rate reduction from X% to Y% within 30 days, [Practice Name] agrees to subscribe at $X/month on month-to-month basis."

**First client pricing models (what actually worked):**
- **Performance-based** (Cedar): 15-25% of incremental revenue recovered, zero risk to client
- **Free 30-day pilot** (Fathom, Collectly): Free trial → $1,500-$3K/month
- **Discounted pilot** (Akasa): 50% off for 60 days, full price after

**Deliverables**: 3-5 free audits delivered, shadow mode results showing AI accuracy, 3-5 LOIs

### Week 7-8: First Paying Clients & Referral Loop

**Convert LOIs to paying clients** (what Collectly did — signed SMB practices in days, not months):
- Present pilot results with their actual numbers
- Simple contract: month-to-month, one page, no legal review needed for $2K/month SaaS
- Onboard: import data, connect PMS, train billing manager (1 hour, not whole staff)
- Weekly 15-min check-in with billing manager for first 60 days (Akasa did white-glove support early)

**"Do things that don't scale" phase:**
- Personally review AI outputs before they reach client
- Manually fix AI errors
- Call billing manager weekly
- Track every metric obsessively

**Start referral loop:**
- Ask happy client: "Who else should be using this?" (everyone did this)
- Post anonymized results on LinkedIn (Collectly, Cedar)
- Billing managers all know each other — tap their network (Waystar)
- Present at local MGMA/HFMA chapter

**Deliverables**: 2-3 paying clients, $3K-$5K MRR, product iterating on real feedback, 5-10 prospect pipeline

### 8-Week KPI Targets

| Metric | Week 2 | Week 4 | Week 6 | Week 8 |
|--------|:------:|:------:|:------:|:------:|
| Design partners | 2-3 | 3-5 | 3-5 | 3-5 |
| Billing offices visited | 1 | 2-3 | 3-5 | 5+ |
| Free audits delivered | 0 | 1-2 | 3-5 | 5-8 |
| LOIs / commitments | 0 | 0 | 3-5 | 5+ |
| Paying clients | 0 | 0 | 0-1 | 2-3 |
| MRR | $0 | $0 | $0-$1.5K | $3K-$5K |

### 6 Proven Patterns (From Real Companies)

1. **ONE wedge, not a platform** — Akasa: claim status only. Infinx: prior auth only. Nothing else for 8 weeks
2. **Relationships, not cold outreach** — Cedar: Zocdoc network. Abridge: worked at UPMC. Use your personal network + 1 advisor
3. **Sit in the billing office** — Olive: watched staff click through EHRs. 2-3 days observing changes everything
4. **Shadow mode before live mode** — Nym: AI coded alongside humans for comparison. Let them prove ROI themselves
5. **AI + humans behind the scenes** — Infinx: offshore staff + AI. Manually review outputs for first 5 clients
6. **SMB first, enterprise later** — Waystar, Collectly, Fathom: small practices first. No hospitals until 20+ practice clients

### Anti-Pattern: How Olive AI Went From $4B to Dead

- Over-raised, over-hired (500 → 1,500 employees too fast)
- Expanded to 10 products before nailing one
- RPA was brittle — bots broke when EHR interfaces changed
- Revenue concentrated in few large health systems
- **Lesson**: Don't raise too much too early. Don't hire too fast. Don't expand before nailing one wedge

---

## Website Structure (This Codebase)

### Tech: Next.js 16 + TypeScript + Tailwind CSS 4

### Pages (30 total):

**Homepage**: `/` — Hero (video bg, typing animation, count-up stats), Platform (tabbed interactive), Solutions, Architecture, Results (calculator), Problem/Comparison, Insights, CTA

**Platform** (6 pages):
- `/platform` — Overview
- `/platform/patient-interaction`
- `/platform/revenue-intelligence`
- `/platform/ai-engine`
- `/platform/analytics`
- `/platform/integrations`

**Solutions** (5 pages):
- `/solutions` — Overview
- `/solutions/hospitals`
- `/solutions/practices`
- `/solutions/rcm`
- `/solutions/billing`

**Company** (7 pages):
- `/about` — Mission, vision, values
- `/careers` — 9 open roles
- `/why-riveo` — Competitive comparison
- `/partners` — Partner program
- `/contact` — Contact form
- `/newsroom` — Press releases
- `/login` — Client login (UI only)

**Resources**: `/blog` — Listing + 6 article pages

**Trust**: `/security`, `/hipaa`, `/privacy`, `/terms`

**Other**: `/demo` — Request a Demo (dedicated page), `/support` — Support center

---

## Healthcare Industry Pain Points (Sales & Content Ammunition)

### Denial & Claims Crisis
- **Claim denial rate**: Average 10-15% across the industry — Source: MGMA
- **Denial cost to rework**: $25-$118 per denied claim to appeal — Source: AAPC
- **Denials never appealed**: 60-65% of denials are never reworked (written off as loss) — Source: HFMA
- **Initial denial rate rising**: Up 20%+ since 2020, payers tightening policies — Source: HFMA
- **Prior authorization burden**: Average 35 prior auths per physician per week, 14 hrs of staff time — Source: AMA
- **Prior auth delays**: 93% of physicians report care delays due to prior auth — Source: AMA

### Revenue Leakage
- **Average revenue leakage**: 3-5% of net revenue lost to billing errors, missed charges, and coding mistakes — Source: HFMA
- **For a $10M practice**: That's $300K-$500K/year walking out the door
- **Undercoding**: 30-40% of providers undercode (leave money on the table) — Source: AAPC
- **Charge capture failure**: 1-5% of charges never make it to a claim — Source: MGMA
- **Credentialing delays**: Average 90-150 days, each day = lost revenue for new providers — Source: MGMA

### Staffing Crisis
- **Medical biller turnover**: 30-40% annually — Source: HBMA
- **Cost to replace one biller**: $4,000-$7,000 (recruiting, training, lost productivity) — Source: MGMA
- **Time to train new biller**: 3-6 months to full productivity — Source: HBMA
- **Biller salary increasing**: Up 15-20% since 2021 due to shortage — Source: AAPC
- **Average biller handles**: 1,200-1,500 claims/month (AI can handle 50,000+) — Source: Industry average

### Patient Financial Experience
- **Patient responsibility growing**: Patients now owe 30%+ of total healthcare costs (up from 10% in 2000) — Source: KFF
- **Patient bad debt**: $220B+ in unpaid medical bills in US — Source: Consumer Financial Protection Bureau
- **Patients avoiding care**: 40% of Americans skipped or delayed care due to cost concerns — Source: KFF
- **Surprise billing complaints**: Despite No Surprises Act, billing confusion remains #1 patient complaint — Source: CMS
- **Payment plan demand**: 70%+ of patients want payment plans but most practices don't offer them — Source: Salucro

### Operational Burden
- **Admin costs**: 34.2% of total US healthcare spending goes to administration — Source: Annals of Internal Medicine
- **That's $1.2T+/year** spent on paperwork, not patient care
- **Physician burnout**: 63% report burnout, #1 cause is administrative burden — Source: AMA
- **Time with patients**: Physicians spend only 27% of their time on direct patient care — Source: AMA
- **EHR clicks**: Average physician makes 4,000+ clicks per day in EHR — Source: KLAS

### Payer Behavior (Getting Worse)
- **Auto-denial algorithms**: Major payers using AI to auto-deny claims at scale — Source: ProPublica/Cigna investigation
- **Payment delays**: Average time to payment increased from 30 to 45+ days — Source: MGMA
- **Downcoding**: Payers downcode 15-20% of claims to pay less — Source: AAPC
- **Contract underpayment**: 30-40% of claims are underpaid vs contracted rates — Source: HFMA
- **Rule changes**: Payers change billing rules 2-3x/year without clear communication — Source: AMA

### The Killer Stats (Use in Sales Pitches & Website)
- "You're losing $300K-$500K/year to billing errors alone"
- "60% of your denials are never even appealed — that's cash in the trash"
- "Your staff spends 14 hours/week just on prior authorizations"
- "34 cents of every healthcare dollar goes to paperwork, not patients"
- "Insurance companies are using AI to deny your claims — shouldn't you use AI to fight back?"

---

## Objection Handling (Top 12 Sales Objections)

### 1. "We already have a billing system / software"
**Response**: "We don't replace your billing system — we make it smarter. We sit on top of your existing setup. Think of us as the AI brain that catches what your current system misses. Our average audit finds $78K in annual leakage that existing software missed."

### 2. "We're too small for this"
**Response**: "Small practices actually lose a higher percentage of revenue to billing errors because they don't have dedicated RCM staff. A 5-physician practice losing 3-5% of revenue is losing $150K-$400K/year. Our Starter plan costs $1,500/month — that's $18K/year to recover $150K+."

### 3. "AI can't handle the complexity of medical billing"
**Response**: "You're right that medical billing is complex — that's exactly why humans make so many errors. Our AI is trained on 50M+ claims. It doesn't get tired, doesn't forget payer rules, and catches patterns humans can't see. But we always keep human oversight for critical decisions. You approve everything."

### 4. "How do I know my patient data is safe?"
**Response**: "We're HIPAA compliant, SOC 2 Type II certified, with AES-256 encryption, BAA agreements, and role-based access control. Patient data never goes directly to AI — we mask and tokenize everything. We can share our security documentation and compliance certifications before you commit."

### 5. "We tried AI/automation before and it didn't work"
**Response**: "Most 'AI' billing tools are really just rules engines with a chatbot on top. We're AI-native — built from the ground up around intelligence, not bolted on. What specific tool did you try? I can show you exactly how our approach is different. Also — no contract. Try for 30 days and see the numbers."

### 6. "We can't afford it right now"
**Response**: "I understand budgets are tight. That's actually why we exist — you're currently paying the 'hidden tax' of revenue leakage. Let's do the free audit first. No cost, no commitment. If we find less than 2x our monthly fee in leakage, I'll tell you we're not a fit. Fair?"

### 7. "What if you go out of business?"
**Response**: "Valid concern for any startup. Three things: First, month-to-month — you can leave anytime with your data. Second, your data is always yours, exportable in standard formats. Third, we're infrastructure, not a silo — we work with your existing systems so there's no single point of failure."

### 8. "Our billers will resist this / fear losing their jobs"
**Response**: "We don't replace billers — we make them 3x more productive. Your best biller handles 1,500 claims/month. With Riveo, she handles 5,000+ and focuses on complex cases that actually need human judgment. Staff love it because we eliminate the tedious work — phone holds with insurance, manual data entry, rework. They do the interesting stuff."

### 9. "We need to see references / case studies"
**Response**: "We're transparent — we're a new company and won't fabricate case studies. What we can show you is: (1) your own data through the free audit, (2) our technology benchmarks — 97% first-pass rate, 95% coding accuracy, (3) a 30-day paid pilot where you see real results with your real claims before committing."

### 10. "Our outsourced billing company handles everything"
**Response**: "How happy are you with their results? What's your current denial rate and days in AR? Most outsourced billing companies charge 5-8% of collections — on $5M that's $250K-$400K/year. We typically cost 70-80% less and catch errors they miss because we use AI to review every single claim, not just the ones a human gets to."

### 11. "We need to integrate with [specific EHR] — do you support it?"
**Response**: "We support 40+ EHR systems including Epic, Cerner, athenahealth, eClinicalWorks, and more through HL7 FHIR and direct integrations. Which system are you on? If we don't have it yet, our average new integration takes 2-3 weeks. We'll build it as part of your onboarding."

### 12. "I need to check with my partners / board / IT"
**Response**: "Absolutely. Would it help if I prepared a one-page ROI summary using your actual numbers from the free audit? Partners respond to dollars — 'we're leaking $X, this costs $Y, ROI is Z within 30 days' is usually the fastest way to get alignment. I can also join a call with your team to answer technical/security questions."

### Objection Handling Rules
- **Never argue** — Acknowledge the concern first, then reframe
- **Always bring it back to money** — Every objection ends with ROI
- **Free audit is the universal answer** — "Let's just look at the data, no commitment"
- **Month-to-month is the safety net** — Use it to defuse every risk objection
- **Never bash competitors by name** — Focus on the approach difference (legacy vs AI-native)

---

## Key Design Decisions

- **No fake testimonials or case studies** — We are new. All proof points are technology benchmarks, not client results.
- **Pain-point focused** — Lead with the problem (industry stats with sources: MGMA, AMA, HFMA, AAPC, KLAS)
- **"Built Different" positioning** — Legacy RCM vs AI-native comparison is our core message
- **Free audit as hook** — Every CTA drives toward the free revenue leakage audit
- **Source citations** — All industry claims cite their source (MGMA, AMA, HFMA, HBMA, AAPC, KLAS, Accenture)
- **Month-to-month, no contracts** — Risk reversal is a key trust builder

---

## Security & Compliance

- HIPAA compliant
- SOC 2 Type II certified
- GDPR ready
- End-to-end encryption (AES-256 at rest, TLS 1.3 in transit)
- Role-based access control (RBAC)
- BAA agreements
- 99.9% uptime SLA

---

## Strategic Insights (McKinsey / Deloitte Research-Backed)

### Market Validation
- McKinsey (Jan 9, 2026): AI enablement of provider revenue cycle could reduce cost to collect by **30%-60%**, improve payment accuracy, shift staff to higher-value work
- Deloitte (Feb 2026): Health systems prioritizing agentic AI in both care delivery and revenue cycle — market moving from experimentation to operational deployment
- US healthcare margins squeezed since 2019; buyers prioritize products that improve collections, reduce admin burden, or protect margin

### Domination Thesis
Build a **Healthcare Revenue + Interaction OS** centered on RCM/admin automation first, then extend into consumer-facing agents, then into payments/claims/financial infrastructure.

### Winning Sequence
1. **Win admin/revenue workflows** (RCM, denials, prior auth, billing, collections)
2. **Expand into interaction & service operations** (multi-channel agents tied to workflows + outcomes)
3. **Move into payments, claims routing, financial infrastructure** (platform effect)

### Key Strategic Rules
- **Hard-dollar ROI** is far more compelling than broad "AI transformation" pitches
- **Agent that only answers questions = weak** — agent that books appointments, resolves billing, triggers payment reminders, escalates denial risk, learns from outcomes = defensible
- **Distribution > Product** — scale through existing channels (RCM firms, consultants, BPOs, niche vendors)
- **Diagnostics centers** are NOT the best primary wedge (McKinsey: low growth vs brighter outpatient areas)
- **White-label selectively** as distribution strategy, not identity
- **Workflow integration + data + measurable ROI + multi-channel agent layer** = most research-backed moat

### AI Compliance Rules
- Use Claude API (enterprise), never public UI for PHI
- Always mask/tokenize PHI before sending to LLM
- Maintain audit logs for every AI interaction
- Human-in-loop for diagnosis, prescriptions, critical clinical decisions
- HIPAA compliance + BAA required for US market
- Build US-level compliance from day 1 (even for India)
- The product is a **healthcare system using AI inside**, not an AI tool

---

## Important Rules

1. **Never fabricate client names, testimonials, or case studies** — We have no clients yet
2. **Always cite sources** for industry statistics
3. **Focus on product capability**, not social proof
4. **The free revenue audit** is the primary conversion mechanism
5. **Month-to-month pricing** — Never mention long contracts
6. **Brand name is "Riveo Health"** — Subtitle is "Revenue OS"
7. **AI-native, not AI-bolted** — This is the core differentiator
8. **Distribution > Product** — GTM strategy matters more than features
9. **Start as RCM → Grow into Platform → Become Financial Infrastructure**
