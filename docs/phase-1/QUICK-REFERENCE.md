# Phase 1: Quick Reference Guide

**Total Documentation:** 18,640 lines across 18 files

## 📋 Start Here

1. **[PHASE-1-SUMMARY.md](./PHASE-1-SUMMARY.md)** - Executive overview of Phase 1 deliverables
2. **[architecture/system-architecture.md](./architecture/system-architecture.md)** - Core system design
3. **[product/cohort-thresholds.md](./product/cohort-thresholds.md)** - How merchants are segmented

## 🏗️ Architecture Documents

| Document | Lines | Purpose |
|----------|-------|---------|
| [system-architecture.md](./architecture/system-architecture.md) | 867 | High-level system design, tech stack, deployment strategy |
| [data-models.md](./architecture/data-models.md) | 1,336 | Database schemas, entity relationships |
| [integration-patterns.md](./architecture/integration-patterns.md) | 1,717 | How we integrate with 6 external systems |
| [event-flows.md](./architecture/event-flows.md) | 1,634 | Event-driven architecture, state transitions |

**Key Decisions:**
- Microservices with Kafka event bus
- PostgreSQL + Redis + Temporal.io
- Kubernetes deployment on AWS

## 🔌 API Specifications

| Document | Lines | Purpose |
|----------|-------|---------|
| [lead-management-api.md](./api-design/lead-management-api.md) | 1,037 | Create leads, assign cohorts |
| [kyb-kyc-api.md](./api-design/kyb-kyc-api.md) | 1,369 | Payment verification APIs (Steps 3, 7, 9) |
| [progress-tracking-api.md](./api-design/progress-tracking-api.md) | 1,320 | Track merchant journey progress |
| [routing-api.md](./api-design/routing-api.md) | 1,232 | AE/IC queue management |
| [webhook-api.md](./api-design/webhook-api.md) | 1,410 | Webhooks for external systems |

**Key Standards:**
- RESTful with OpenAPI specs
- JWT auth for merchants, API keys for services
- Rate limiting: 100 req/min per merchant

## 📊 Product Decisions

| Document | Lines | Purpose |
|----------|-------|---------|
| [cohort-thresholds.md](./product/cohort-thresholds.md) | 347 | How to segment merchants (Self-Serve, Assisted, Managed) |
| [intervention-triggers.md](./product/intervention-triggers.md) | 525 | When to escalate stalled merchants |
| [ae-sla-strategy.md](./product/ae-sla-strategy.md) | 553 | AE response times and capacity |
| [ic-pricing-model.md](./product/ic-pricing-model.md) | 464 | Implementation consultant pricing |
| [trial-vs-buy.md](./product/trial-vs-buy.md) | 381 | Buy-first approach (no trial for MVP) |

**Key Thresholds:**
- Self-Serve: <$500K GTV, 1-3 locations
- Assisted: $500K-$2M GTV, 3-10 locations
- Managed: >$2M GTV, 10+ locations

## 🎨 Design Documentation

| Document | Lines | Purpose |
|----------|-------|---------|
| [design-system.md](./design/design-system.md) | 637 | Colors, typography, spacing, components |
| [merchant-dashboard-wireframes.md](./design/merchant-dashboard-wireframes.md) | 1,605 | Merchant-facing UI for 10 steps |
| [ae-ic-dashboard-wireframes.md](./design/ae-ic-dashboard-wireframes.md) | 862 | Internal admin dashboards |
| [flow-variations.md](./design/flow-variations.md) | 1,025 | How UX differs by cohort |

**Key Technologies:**
- Next.js 14+ with App Router
- shadcn/ui + Tailwind CSS
- Mobile-first responsive design

## 🎯 Critical Requirements

### 1. KYB Before Hardware
```
Step 3 (KYB) ✅ → Step 5 (Hardware Order)
```
**Why:** Prevent shipping to ineligible merchants

### 2. Payouts Held Until Bank Verification
```
Step 7 (KYC) → Payments Activated 🔒 Payouts Held
Step 9 (Bank Verification) → ✅ Payouts Enabled
```
**Why:** Compliance requirement for payment processing

### 3. Cohort-Based Routing
```
Lead Created → Profiling Engine → Cohort Assigned →
[Self-Serve Flow] OR [AE Queue] OR [Managed Queue]
```
**Why:** Right level of support for each merchant

## 🔍 Key Concepts

### 10-Step Journey
1. Browse and Buy Decision
2. Account Creation → **Cohort Assignment**
3. KYB Qualification → **Gate for Hardware**
4. Define Software Requirements
5. Define Hardware Requirements
6. Payment for Software + Hardware
7. Payments Activation (KYC) → **Payouts Held**
8. Data Import
9. Hardware Setup → **Bank Verification → Payouts Enabled**
10. Final Config & Integrations

### 7 Core Services
1. **Lead Profiling Engine** - Cohort assignment
2. **Smart Routing Logic** - AE/IC queue management
3. **Progress Tracking** - Journey state machine
4. **Data Sync Layer** - External integrations
5. **Onboarding Orchestrator** - Workflow coordination
6. **Order Management** - Billing and fulfillment
7. **Unified Dashboard** - Merchant and admin UIs

## 📈 Success Metrics

| Metric | Target | Current Baseline |
|--------|--------|-----------------|
| Lead-to-Customer Conversion | +25% | TBD |
| Purchase-to-Active Conversion | +30% | TBD |
| Time to First Transaction | -40% | TBD |
| Self-Serve Completion Rate | 80%+ | TBD |
| High-GTV Retention | 95%+ | TBD |

## 🛠️ Tech Stack at a Glance

```yaml
Backend:
  Language: Node.js (TypeScript)
  Framework: Express/Fastify
  Database: PostgreSQL 15+
  Cache: Redis 7+
  Queue: Kafka or AWS SQS
  Orchestration: Temporal.io

Frontend:
  Framework: Next.js 14+
  UI: shadcn/ui + Tailwind CSS
  State: React Query + Zustand
  Testing: Vitest + Playwright

Infrastructure:
  Hosting: Kubernetes (AWS EKS)
  CI/CD: GitHub Actions
  Monitoring: Datadog/Prometheus
  Logging: ELK Stack
```

## 📚 Documentation Map

```
phase-1/
├── PHASE-1-SUMMARY.md         ← Start here
├── QUICK-REFERENCE.md         ← You are here
├── architecture/
│   ├── system-architecture.md ← Core system design
│   ├── data-models.md         ← Database schemas
│   ├── integration-patterns.md ← External system integrations
│   └── event-flows.md         ← Event-driven architecture
├── api-design/
│   ├── lead-management-api.md ← Lead CRUD APIs
│   ├── kyb-kyc-api.md         ← Payment verification
│   ├── progress-tracking-api.md ← Journey tracking
│   ├── routing-api.md         ← AE/IC queues
│   └── webhook-api.md         ← External webhooks
├── product/
│   ├── cohort-thresholds.md   ← Segmentation rules
│   ├── intervention-triggers.md ← Escalation logic
│   ├── ae-sla-strategy.md     ← AE response times
│   ├── ic-pricing-model.md    ← IC pricing
│   └── trial-vs-buy.md        ← Buy-first approach
└── design/
    ├── design-system.md       ← UI foundations
    ├── merchant-dashboard-wireframes.md ← Merchant UI
    ├── ae-ic-dashboard-wireframes.md ← Admin UI
    └── flow-variations.md     ← Cohort-specific UX
```

## ✅ Phase 1 Checklist

- [x] System architecture designed
- [x] Data models defined
- [x] API specifications documented
- [x] Integration patterns established
- [x] Event flows mapped
- [x] Product decisions finalized
- [x] Cohort thresholds defined
- [x] Design system created
- [x] Dashboard wireframes completed
- [x] Technology stack selected

**Status:** ✅ PHASE 1 COMPLETE - Ready for Phase 2

## 🚀 Next Steps

1. **Engineering Review:** Review all documents, validate feasibility
2. **Infrastructure Setup:** Provision environments, repos, CI/CD
3. **Team Assignments:** Assign service owners, form teams
4. **Phase 2 Planning:** Break down into sprints, set milestones

**Phase 2 Focus:** Build core services (Lead Profiling, Routing, Progress Tracking, Data Sync)

---

**Questions?** Refer to full documents for detailed specifications.
**Last Updated:** October 2025
