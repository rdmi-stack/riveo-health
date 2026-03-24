# Riveo Health — Milestone-Based Development & Implementation Plan

> **This is the engineering execution plan.** Every milestone has a clear deliverable,
> success criteria, team requirement, and estimated duration. Ship or die.

---

## Overview: 6 Milestones to $1M ARR

```
M1: Foundation     →  M2: Wedge MVP     →  M3: AI Engine     →  M4: Platform     →  M5: Scale     →  M6: Infrastructure
(Week 1-3)           (Week 4-8)            (Week 9-14)          (Week 15-22)        (Week 23-34)     (Week 35-52)

Website live         First 5 clients       20+ clients          50+ clients          200+ clients     500+ clients
Form backend         Claims dashboard      AI coding            White-label          Mobile app       Payment processing
Deploy + CRM         Denial tracking       Patient agent        API layer            20+ EHRs         Claims routing
                     1 EHR integration     Denial prediction    Advanced reports     Benchmarking     Financial infra
```

---

## Milestone 1: Foundation & Go-Live

**Duration**: Week 1-3 (21 days)
**Team**: Founder only (or +1 developer)
**Goal**: Website live, forms working, sales tools ready, backend scaffolded

### Deliverables

#### Week 1: Deploy & Connect

| # | Task | Tech | Time | Done |
|:-:|------|------|:----:|:----:|
| 1.1 | Deploy website to Vercel | Vercel CLI, DNS config | 1 day | |
| 1.2 | Connect riveohealth.com domain + SSL | Vercel/Cloudflare | 1 day | |
| 1.3 | Set up form backend — contact, demo, audit requests → email + CRM | Resend API or SendGrid + HubSpot webhook | 1 day | |
| 1.4 | Google Analytics 4 + Microsoft Clarity setup | GA4 tag, Clarity script | 0.5 day | |
| 1.5 | Set up HubSpot CRM — pipeline stages, contact properties | HubSpot free | 0.5 day | |
| 1.6 | Set up WhatsApp Business + auto-reply | WhatsApp Business app | 0.5 day | |
| 1.7 | Create offline demo environment on tablet | Next.js export or screen recordings | 0.5 day | |

#### Week 2: Backend Scaffold

| # | Task | Tech | Time | Done |
|:-:|------|------|:----:|:----:|
| 1.8 | Initialize backend repo | Python 3.12 + FastAPI | 0.5 day | |
| 1.9 | Set up MongoDB Atlas cluster (free tier to start) | MongoDB Atlas | 0.5 day | |
| 1.10 | Set up Redis instance | Redis Cloud (free tier) or AWS ElastiCache | 0.5 day | |
| 1.11 | Create user authentication system (JWT + RBAC) | FastAPI + PyJWT + bcrypt | 2 days | |
| 1.12 | Create tenant/organization model (multi-tenant from day 1) | MongoDB collections: orgs, users, roles | 1 day | |
| 1.13 | Set up Anthropic Claude API integration — base service with PHI masking | Anthropic SDK + custom masking pipeline | 1 day | |
| 1.14 | Set up CI/CD pipeline | GitHub Actions → AWS (or Vercel for frontend) | 0.5 day | |

#### Week 3: Sales Materials & Audit Backend

| # | Task | Tech | Time | Done |
|:-:|------|------|:----:|:----:|
| 1.15 | Build audit report PDF generator (from audit tool results → branded PDF) | ReportLab or WeasyPrint (Python) | 2 days | |
| 1.16 | Build audit API endpoint — accept claims CSV, return analysis | FastAPI + audit-engine logic (port from frontend) | 1.5 days | |
| 1.17 | Print 100 one-page leave-behinds (laminated) | Design in Figma/Canva → print shop | 1 day | |
| 1.18 | Record 3-minute product demo video | Screen recording + Loom | 0.5 day | |
| 1.19 | SEO meta tags review across all pages | Next.js metadata exports | 0.5 day | |
| 1.20 | Set up error monitoring | Sentry (free tier) | 0.5 day | |

### Success Criteria
- [ ] Website live at riveohealth.com with working forms
- [ ] Demo/contact form submissions arrive in HubSpot CRM + email
- [ ] Backend API running with auth, multi-tenant scaffold, Claude API connected
- [ ] Audit tool can generate downloadable PDF report
- [ ] Offline demo works on tablet without internet
- [ ] CRM pipeline configured with all stages
- [ ] Analytics tracking page views and form submissions

### Tech Stack at M1

```
Frontend:  Next.js 16 + TypeScript + Tailwind (deployed on Vercel)
Backend:   FastAPI (Python 3.12)
Database:  MongoDB Atlas (free tier)
Cache:     Redis Cloud (free tier)
AI:        Anthropic Claude API (pay per use)
Auth:      JWT + bcrypt
Hosting:   Vercel (frontend) + AWS EC2 or Railway (backend)
CI/CD:     GitHub Actions
Monitoring: Sentry + GA4 + Clarity
CRM:       HubSpot (free)
```

---

## Milestone 2: Wedge MVP — Denial Management Dashboard

**Duration**: Week 4-8 (35 days)
**Team**: Founder + 1 full-stack developer + 1 field sales rep
**Goal**: Working product that 5 clients can use daily to manage claims and denials

### Architecture

```
┌─────────────────────────────────────┐
│         Client Dashboard            │
│     (Next.js 16 + TypeScript)       │
├─────────────────────────────────────┤
│              API Layer              │
│       (FastAPI + WebSocket)         │
├──────────┬──────────┬───────────────┤
│ Claims   │ Denials  │ Analytics     │
│ Service  │ Service  │ Service       │
├──────────┴──────────┴───────────────┤
│         MongoDB Atlas               │
│  (claims, denials, orgs, users)     │
├──────────┬──────────────────────────┤
│  Claude  │     EHR Integration      │
│  API     │     (1 system)           │
└──────────┴──────────────────────────┘
```

### Deliverables

#### Week 4-5: Core Data Models & Claims Engine

| # | Task | Tech | Time | Done |
|:-:|------|------|:----:|:----:|
| 2.1 | Design MongoDB schemas — claims, denials, payers, patients, payments | MongoDB + Pydantic models | 1 day | |
| 2.2 | Build claims CRUD API — create, read, update, list, filter, search | FastAPI + MongoDB | 2 days | |
| 2.3 | Build claims import — CSV upload, ERA/835 parser, batch import | FastAPI + custom parsers | 3 days | |
| 2.4 | Build denial detection — auto-flag denied claims, parse denial codes (CARC/RARC) | Python + regex + CARC code database | 2 days | |
| 2.5 | Build payer management — add payers, track rules, map to claims | FastAPI + MongoDB | 1 day | |
| 2.6 | Build client onboarding API — org setup, data import wizard, user invite | FastAPI + email service | 1.5 days | |

#### Week 5-6: Client Dashboard (Frontend)

| # | Task | Tech | Time | Done |
|:-:|------|------|:----:|:----:|
| 2.7 | Build app layout — sidebar nav, header, multi-tenant routing | Next.js 16 App Router + middleware | 1.5 days | |
| 2.8 | Build claims dashboard — table with filters (status, payer, date, amount), search, pagination | React + TanStack Table | 2 days | |
| 2.9 | Build claim detail view — full claim info, history, denial reason, suggested fix | React + API integration | 1.5 days | |
| 2.10 | Build denial management view — denied claims queue, priority sorting, bulk actions | React + WebSocket for real-time | 2 days | |
| 2.11 | Build analytics dashboard — denial rate, AR aging, collections, top denial reasons (charts) | React + Recharts or Chart.js | 2 days | |
| 2.12 | Build onboarding wizard — step-by-step setup for new clients | React multi-step form | 1 day | |

#### Week 6-7: AI Denial Analysis + EHR Integration

| # | Task | Tech | Time | Done |
|:-:|------|------|:----:|:----:|
| 2.13 | Build AI denial analysis — Claude reads denial + claim → explains reason + suggests fix | Anthropic API + prompt engineering + PHI masking | 3 days | |
| 2.14 | Build denial resubmission helper — pre-fill corrected claim based on AI suggestion | FastAPI + Claude + claim templates | 2 days | |
| 2.15 | Build first EHR integration (pick based on design partner's system) | HL7 FHIR API or direct API (athenahealth/eClinicalWorks) | 5 days | |
| 2.16 | Build claim status sync — pull claim status updates from clearinghouse/payer | Scheduled job + API polling | 2 days | |

#### Week 7-8: Polish, Test & Onboard First Clients

| # | Task | Tech | Time | Done |
|:-:|------|------|:----:|:----:|
| 2.17 | Build notification system — email/in-app alerts for new denials, status changes | FastAPI + WebSocket + Resend | 1.5 days | |
| 2.18 | Build audit log — track every action for HIPAA compliance | MongoDB + middleware | 1 day | |
| 2.19 | Build export — claims/denials/reports to CSV/PDF | Python ReportLab + FastAPI | 1 day | |
| 2.20 | Security review — HTTPS, CORS, rate limiting, input validation, SQL injection checks | FastAPI middleware + security audit | 1 day | |
| 2.21 | Write integration tests — API endpoints, auth flows, data import | Pytest + httpx | 1.5 days | |
| 2.22 | Write E2E tests — dashboard flows, claim management, denial workflow | Playwright | 1.5 days | |
| 2.23 | Onboard first 3-5 design partners — import their data, train them, gather feedback | Manual + onboarding wizard | 3 days | |
| 2.24 | Bug fixes + iteration based on design partner feedback | All | 2 days | |

### Success Criteria
- [ ] 3-5 clients using the dashboard daily
- [ ] Claims import working (CSV + 1 EHR)
- [ ] Denied claims auto-flagged with AI-suggested fixes
- [ ] Analytics showing denial rate, AR aging, top reasons
- [ ] Client onboarding takes < 1 day
- [ ] Audit log records every user action
- [ ] Zero critical bugs in production

### Database Schema (M2)

```
organizations {
  _id, name, type, plan, settings, created_at
}

users {
  _id, org_id, email, password_hash, role, last_login
}

claims {
  _id, org_id, claim_id, patient_id, payer_id,
  date_of_service, cpt_codes[], icd_codes[],
  billed_amount, allowed_amount, paid_amount,
  status: "submitted|accepted|denied|paid|partial|pending",
  denial_code, denial_reason, ai_analysis,
  submitted_at, paid_at, created_at, updated_at
}

denials {
  _id, org_id, claim_id, denial_code, denial_reason,
  ai_suggested_fix, priority: "high|medium|low",
  status: "new|in_progress|resubmitted|resolved|written_off",
  assigned_to, resolved_at, created_at
}

payers {
  _id, org_id, name, payer_id, type, rules[],
  avg_denial_rate, avg_days_to_pay
}

audit_log {
  _id, org_id, user_id, action, entity_type, entity_id,
  details, ip_address, timestamp
}
```

---

## Milestone 3: AI Engine & Patient Interaction

**Duration**: Week 9-14 (42 days)
**Team**: 2 developers + 1 AI/ML engineer + 1 field sales rep + 1 SDR
**Goal**: AI becomes the differentiator — auto-coding, denial prediction, patient agent

### Deliverables

#### AI Auto-Coding (Week 9-10)

| # | Task | Tech | Time | Done |
|:-:|------|------|:----:|:----:|
| 3.1 | Build clinical note ingestion — accept notes from EHR or manual upload | FastAPI + document parser | 2 days | |
| 3.2 | Build AI coding engine — clinical notes → ICD-10/CPT suggestions | Claude API + medical prompt engineering | 4 days | |
| 3.3 | Build coding review UI — suggested codes with confidence scores, accept/edit/reject | React + diff view | 2 days | |
| 3.4 | Build coding accuracy tracker — compare AI codes vs final submitted codes | MongoDB aggregation pipeline | 1 day | |
| 3.5 | Train prompt on specialty-specific coding patterns | Prompt tuning + few-shot examples per specialty | 2 days | |

#### Denial Prediction (Week 10-11)

| # | Task | Tech | Time | Done |
|:-:|------|------|:----:|:----:|
| 3.6 | Build feature extraction — claim attributes that predict denials (payer, code combos, timing, provider) | Python + pandas + feature engineering | 3 days | |
| 3.7 | Build denial prediction model — score each claim 0-100 risk before submission | Claude API (reasoning) + rule engine hybrid | 3 days | |
| 3.8 | Build pre-submission review — flag high-risk claims, show why, suggest fixes | FastAPI + React UI | 2 days | |
| 3.9 | Build claim scrubbing rules engine — 2000+ payer-specific rules | Python rule engine + MongoDB rules collection | 3 days | |

#### Patient Interaction Agent (Week 11-13)

| # | Task | Tech | Time | Done |
|:-:|------|------|:----:|:----:|
| 3.10 | Build chat agent backend — conversational AI for patient billing questions | Claude API + LangChain + conversation memory | 3 days | |
| 3.11 | Build chat widget — embeddable on client's website or portal | React widget + WebSocket | 2 days | |
| 3.12 | Build SMS agent — payment reminders, billing questions via SMS | Twilio API + message queue | 2 days | |
| 3.13 | Build WhatsApp agent — same as SMS but on WhatsApp Business API | WhatsApp Cloud API + message templates | 3 days | |
| 3.14 | Build email agent — automated billing communications, statement delivery | Resend API + email templates | 1.5 days | |
| 3.15 | Build patient payment link generation — create secure pay-now links | Stripe/Razorpay integration + secure token generation | 2 days | |
| 3.16 | Build conversation analytics — track resolution rate, patient satisfaction, common questions | MongoDB + aggregation | 1 day | |

#### Auto-Resubmission & Payment Automation (Week 13-14)

| # | Task | Tech | Time | Done |
|:-:|------|------|:----:|:----:|
| 3.17 | Build auto-resubmission workflow — AI fixes → human approval → auto-submit corrected claim | FastAPI + approval queue + clearinghouse API | 3 days | |
| 3.18 | Build payment posting automation — match payments to claims, flag discrepancies | Python + ERA/835 parser + reconciliation logic | 3 days | |
| 3.19 | Build payer performance analytics — denial rate, days to pay, underpayment rate by payer | MongoDB aggregation + React charts | 2 days | |
| 3.20 | Build automated follow-up sequences — unpaid claims at 15/30/45/60 days | Celery task queue + email/SMS triggers | 2 days | |
| 3.21 | Add 2 more EHR integrations | HL7 FHIR + vendor-specific APIs | 4 days | |

### Success Criteria
- [ ] AI coding accuracy 92%+ for standard encounters
- [ ] Denial prediction catches 70%+ of claims that would be denied
- [ ] Patient chat agent resolves 60%+ of billing inquiries without human
- [ ] SMS/WhatsApp payment reminders increase collection rate by 20%+
- [ ] Auto-resubmission working for top 5 denial reasons
- [ ] 20+ clients on the platform
- [ ] 3 EHR integrations live

### New Tech Added at M3

```
+ LangChain (AI orchestration)
+ Pinecone (vector DB for patient context + claim history retrieval)
+ Twilio (SMS)
+ WhatsApp Cloud API
+ Stripe / Razorpay (payment links)
+ Celery + Redis (background task queue)
```

---

## Milestone 4: Platform — White-Label & API

**Duration**: Week 15-22 (56 days)
**Team**: 3 developers + 1 AI/ML + 1 DevOps + 2 sales reps + 1 SDR
**Goal**: Platform that RCM companies can white-label and integrate via API

### Deliverables

| # | Task | Time | Done |
|:-:|------|:----:|:----:|
| 4.1 | Build white-label system — custom branding (logo, colors, domain) per tenant | 5 days | |
| 4.2 | Build public REST API — full claims, denials, analytics, patients API with docs | 5 days | |
| 4.3 | Build API authentication — API keys, OAuth 2.0, rate limiting, usage tracking | 3 days | |
| 4.4 | Build API documentation portal — Swagger/OpenAPI + interactive docs | 2 days | |
| 4.5 | Build webhook system — notify partners of claim status changes, denials, payments | 2 days | |
| 4.6 | Build prior authorization automation — submit PA requests, track status, auto-follow-up | 8 days | |
| 4.7 | Build contract underpayment detection — compare payments vs contracted rates | 4 days | |
| 4.8 | Build advanced reporting — 50+ report templates, custom report builder, scheduled reports | 6 days | |
| 4.9 | Build role-based dashboards — Admin, Biller, Manager, Provider, Executive views | 3 days | |
| 4.10 | Build credentialing tracker — provider credentialing status, expiration alerts | 3 days | |
| 4.11 | Add 5 more EHR integrations (total: 8) | 8 days | |
| 4.12 | Build data export/migration tools — clients can export all data anytime | 2 days | |
| 4.13 | Performance optimization — database indexing, caching, query optimization | 3 days | |
| 4.14 | SOC 2 Type II audit preparation — policies, procedures, evidence collection | 5 days | |
| 4.15 | Load testing — verify system handles 100+ concurrent orgs, 1M+ claims | 2 days | |

### Success Criteria
- [ ] 3+ RCM companies using white-label platform
- [ ] Public API with 10+ endpoints, documented, rate-limited
- [ ] Prior authorization automation reducing auth time by 70%+
- [ ] 50+ clients total
- [ ] 8 EHR integrations live
- [ ] System handles 1M+ claims without performance degradation
- [ ] SOC 2 audit in progress
- [ ] $500K+ ARR

### Architecture at M4

```
┌──────────────────────────────────────────────────┐
│                   Load Balancer                   │
│                  (AWS ALB/Nginx)                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Frontend  │  │ Frontend  │  │ Frontend  │      │
│  │ (Riveo)   │  │ (WL: A)  │  │ (WL: B)  │      │
│  └─────┬─────┘  └─────┬────┘  └─────┬────┘      │
│        └───────────────┼─────────────┘           │
│                        ▼                          │
│  ┌─────────────────────────────────────────┐     │
│  │            API Gateway                   │     │
│  │     (Auth, Rate Limit, Routing)          │     │
│  └──────┬──────┬──────┬──────┬─────────────┘     │
│         ▼      ▼      ▼      ▼                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │
│  │Claims│ │Denial│ │  AI  │ │Patient│            │
│  │ Svc  │ │ Svc  │ │Engine│ │ Agent │            │
│  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘            │
│     └────────┼────────┼────────┘                  │
│              ▼        ▼                           │
│  ┌─────────────┐  ┌─────────────┐                │
│  │  MongoDB     │  │   Redis     │                │
│  │  Atlas       │  │   Cache     │                │
│  └─────────────┘  └─────────────┘                │
│              ▼        ▼                           │
│  ┌─────────────┐  ┌─────────────┐                │
│  │  Pinecone   │  │   Kafka     │                │
│  │  (Vectors)  │  │  (Events)   │                │
│  └─────────────┘  └─────────────┘                │
└──────────────────────────────────────────────────┘
                      ▼
          ┌──────────────────────┐
          │    EHR Integrations  │
          │  (8 systems via FHIR │
          │   + direct APIs)     │
          └──────────────────────┘
```

---

## Milestone 5: Scale — 200+ Clients

**Duration**: Week 23-34 (84 days)
**Team**: 5 developers + 1 AI/ML + 1 DevOps + 3 sales + 2 SDR + 1 CSM
**Goal**: Scale to 200+ clients, 20+ EHR integrations, mobile app, benchmarking

### Deliverables

| # | Task | Time | Done |
|:-:|------|:----:|:----:|
| 5.1 | Build mobile app — practice owners see revenue, denials, alerts on phone | React Native or Expo | 15 days | |
| 5.2 | Build benchmarking engine — compare client metrics vs industry and peer group | MongoDB aggregation + anonymized data | 5 days | |
| 5.3 | Build real-time revenue forecasting — AI predicts next 30/60/90 day collections | Claude API + time-series analysis | 5 days | |
| 5.4 | Build claims routing optimization — smart clearinghouse selection per claim | Rule engine + ML model | 5 days | |
| 5.5 | Add 12 more EHR integrations (total: 20+) | FHIR + vendor APIs | 20 days | |
| 5.6 | Build self-service onboarding — client signs up, imports data, goes live without hand-holding | React wizard + automated data validation | 5 days | |
| 5.7 | Build client success dashboard — health scores, usage metrics, risk of churn | MongoDB + analytics pipeline | 3 days | |
| 5.8 | Build internal admin panel — manage all tenants, monitor system health, feature flags | React + FastAPI | 4 days | |
| 5.9 | Implement Kafka for event-driven architecture — decouple services | Apache Kafka + event schemas | 5 days | |
| 5.10 | Implement Elasticsearch for full-text search across claims, patients, notes | Elasticsearch + sync pipeline | 4 days | |
| 5.11 | Database sharding / optimization for 10M+ claims | MongoDB Atlas scaling + index optimization | 3 days | |
| 5.12 | SOC 2 Type II certification complete | Audit firm + evidence package | External timeline | |
| 5.13 | Compliance monitoring — CMS rule changes auto-detected, alerts to clients | Web scraping + NLP + notification system | 5 days | |

### Success Criteria
- [ ] 200+ clients
- [ ] Mobile app live on iOS + Android
- [ ] 20+ EHR integrations
- [ ] Self-service onboarding (no manual intervention needed)
- [ ] $2M+ ARR
- [ ] System handling 10M+ claims
- [ ] SOC 2 Type II certified
- [ ] Hospital pilot started

---

## Milestone 6: Financial Infrastructure

**Duration**: Week 35-52 (126 days)
**Team**: 8+ developers + 2 AI/ML + 2 DevOps + 5 sales + 3 SDR + 2 CSM
**Goal**: Become the financial infrastructure layer — payments, claims routing, lending

### Deliverables

| # | Task | Time | Done |
|:-:|------|:----:|:----:|
| 6.1 | Build payment processing layer — process patient payments, take % of transaction | Stripe Connect / Razorpay (India) | 15 days | |
| 6.2 | Build claims clearinghouse capabilities — route claims directly to payers | Payer EDI connections + ANSI X12 | 20 days | |
| 6.3 | Build patient financing — offer payment plans, partner with lending providers | Lending API integration + underwriting logic | 15 days | |
| 6.4 | Build payer contract negotiation AI — analyze contracts, suggest better terms | Claude API + contract parsing + benchmarking data | 10 days | |
| 6.5 | Build marketplace — third-party apps and integrations on Riveo platform | API marketplace + app review system | 10 days | |
| 6.6 | Build data warehouse for analytics at scale | Snowflake / BigQuery + ETL pipeline | 10 days | |
| 6.7 | Build provider network intelligence — which providers perform best with which payers | ML model + claims outcome data | 8 days | |
| 6.8 | GDPR compliance for international expansion | Legal + technical implementation | 10 days | |
| 6.9 | Multi-region deployment — US + India + potentially other markets | AWS multi-region + data residency | 10 days | |

### Success Criteria
- [ ] Processing payments (% of every transaction = new revenue stream)
- [ ] Claims routing live (clearinghouse bypass for top payers)
- [ ] Patient financing offered through platform
- [ ] 500+ clients
- [ ] $5M+ ARR
- [ ] Platform marketplace with 5+ third-party integrations

---

## Hiring Plan by Milestone

| Milestone | Team Size | New Hires |
|:---------:|:---------:|-----------|
| **M1** | 1-2 | (Founder + possibly 1 dev) |
| **M2** | 3-4 | +1 full-stack dev, +1 field sales rep |
| **M3** | 6-8 | +1 dev, +1 AI/ML engineer, +1 SDR |
| **M4** | 10-14 | +2 devs, +1 DevOps, +1 sales rep, +1 SDR |
| **M5** | 18-24 | +2 devs, +2 sales, +1 CSM, +1 SDR |
| **M6** | 30-40 | +3 devs, +2 AI/ML, +1 DevOps, +2 sales, +2 CSM, +1 product manager |

### Who to Hire First (Priority Order)

1. **Full-stack developer** (M2) — builds the core product with you
2. **Field sales rep** (M2) — starts selling while you build
3. **AI/ML engineer** (M3) — builds coding engine, denial prediction
4. **SDR** (M3) — books meetings for sales rep
5. **Second developer** (M3) — accelerate feature delivery
6. **DevOps engineer** (M4) — infrastructure, CI/CD, security, scaling
7. **Customer success manager** (M5) — retention, onboarding at scale

---

## Revenue Projections by Milestone

| Milestone | Clients | Avg MRR/Client | Total MRR | ARR |
|:---------:|:-------:|:--------------:|:---------:|:---:|
| M1 (Week 3) | 0 | - | $0 | $0 |
| M2 (Week 8) | 5 | $2,500 | $12.5K | $150K |
| M3 (Week 14) | 20 | $3,000 | $60K | $720K |
| M4 (Week 22) | 50 | $3,500 | $175K | $2.1M |
| M5 (Week 34) | 200 | $3,500 | $700K | $8.4M |
| M6 (Week 52) | 500 | $4,000 + tx fees | $2M+ | $24M+ |

---

## Risk Register

| Risk | Impact | Probability | Mitigation |
|------|:------:|:-----------:|------------|
| EHR integration takes longer than expected | High | High | Start with 1 EHR only. Use HL7 FHIR standard where possible. Budget 2x estimated time |
| First clients churn before M3 | High | Medium | Weekly check-ins. Fix issues within 24 hours. Over-deliver on service |
| AI coding accuracy below 90% | Medium | Medium | Start with simple encounter types. Human-in-loop for all codes. Improve with real data |
| Competitor launches similar AI-native product | Medium | Medium | Speed of execution is the moat. First to integrate deeply with 20+ EHRs wins |
| Can't hire AI/ML engineer | Medium | High | Use Claude API as primary engine (no custom models needed initially). Hire later |
| Security breach or data loss | Critical | Low | Encryption at rest + transit. Daily backups. Audit logs. SOC 2 prep from M1 |
| Sales cycle longer than expected | High | Medium | Free audit shortens cycle. Month-to-month removes commitment fear. Pilot first |
| Running out of money before M3 | Critical | Medium | Keep team lean (2-3 people until M2 complete). Revenue from M2 funds M3 |

---

## Definition of Done (For Every Feature)

Every feature shipped must have:

- [ ] Working backend API with input validation
- [ ] Frontend UI connected and tested
- [ ] PHI masking applied (if touching patient data)
- [ ] Audit log entries for all write operations
- [ ] Error handling (no unhandled exceptions)
- [ ] At least 1 integration test
- [ ] Tested with real client data (not just synthetic)
- [ ] Documented in internal knowledge base
- [ ] Deployed to staging → tested → promoted to production
- [ ] Client-facing changes communicated via in-app notification or email

---

## Decision Log Template

Track every major technical decision:

```
Date: YYYY-MM-DD
Decision: [What was decided]
Context: [Why this decision was needed]
Options Considered: [What alternatives were evaluated]
Chosen: [Which option and why]
Consequences: [What this means for the codebase/product]
Revisit: [When to re-evaluate this decision]
```

---

## Sprint Cadence

| Activity | Frequency | Duration |
|----------|-----------|----------|
| Daily standup | Every day | 15 min (async on Slack/WhatsApp is fine) |
| Sprint planning | Every 2 weeks | 1 hour |
| Sprint demo | Every 2 weeks | 30 min (show working software to team + 1 client) |
| Sprint retro | Every 2 weeks | 30 min |
| Client feedback review | Weekly | 30 min (what are clients asking for? what's broken?) |
| Roadmap review | Monthly | 1 hour (are we on track for the milestone?) |

---

## The One Rule

**Ship something to a real client every 2 weeks.** Not to staging. Not to a demo environment. To a real person using it for their real work. If 2 weeks pass without a client seeing something new, you're building wrong.
