# System Architecture: Cohort-Based Merchant Onboarding

**Version:** 1.0
**Last Updated:** October 2025
**Status:** Architecture Design Document
**Audience:** Engineering Teams, Technical Leadership

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Principles](#architecture-principles)
3. [High-Level System Architecture](#high-level-system-architecture)
4. [Core System Components](#core-system-components)
5. [Technology Stack Recommendations](#technology-stack-recommendations)
6. [Deployment Architecture](#deployment-architecture)
7. [Scalability & Performance](#scalability--performance)
8. [Security Architecture](#security-architecture)
9. [Monitoring & Observability](#monitoring--observability)
10. [Disaster Recovery & Business Continuity](#disaster-recovery--business-continuity)

---

## Executive Summary

This document defines the technical architecture for the Cohort-Based Merchant Onboarding system - a unified platform that guides merchants through a 10-step journey from initial interest to active payment processing. The system segments merchants into cohorts (Self-Serve, Assisted, Managed) and provides tailored experiences with appropriate automation and human touch.

**Key Architectural Goals:**
- Support 3 distinct merchant paths with shared infrastructure
- Ensure KYB completion before hardware purchase (compliance requirement)
- Enable real-time progress tracking across 10 steps
- Integrate seamlessly with 6+ external systems
- Scale to handle 10,000+ simultaneous onboarding merchants
- Provide sub-second response times for interactive flows

**Architecture Style:** Event-driven microservices with synchronous APIs and asynchronous event processing

---

## Architecture Principles

### 1. Domain-Driven Design
- Organize services around business capabilities (Lead Profiling, Order Management, Onboarding Orchestration)
- Maintain clear bounded contexts with well-defined interfaces
- Avoid tight coupling between domains

### 2. Event-First Architecture
- All significant state changes emit domain events
- Enable event-driven workflows and decoupled integrations
- Support event sourcing for audit trails and replay capabilities

### 3. API-First Development
- All services expose well-documented REST/GraphQL APIs
- Internal and external integrations use the same API contracts
- Enable composability and third-party integrations

### 4. Progressive Enhancement
- Core flows must work even if non-critical services are degraded
- Graceful degradation for monitoring, analytics, and notification services
- Circuit breakers prevent cascading failures

### 5. Data Consistency Strategy
- Strong consistency within service boundaries (ACID transactions)
- Eventual consistency across services (event-driven sync)
- Idempotent event handlers to handle retries safely

### 6. Security by Design
- Zero-trust security model
- PII/PCI data encrypted at rest and in transit
- Service-to-service authentication via mTLS or JWT
- Fine-grained authorization with attribute-based access control (ABAC)

---

## High-Level System Architecture

### System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COHORT-BASED ONBOARDING SYSTEM                   │
│                                                                         │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐              │
│  │   Lead       │   │  Onboarding  │   │   Order      │              │
│  │  Profiling   │──▶│ Orchestrator │──▶│  Management  │              │
│  │   Engine     │   │              │   │              │              │
│  └──────────────┘   └──────────────┘   └──────────────┘              │
│         │                   │                   │                      │
│         │                   │                   │                      │
│         ▼                   ▼                   ▼                      │
│  ┌──────────────────────────────────────────────────────┐            │
│  │           Unified Onboarding Dashboard                │            │
│  │        (Merchant Progress Tracking UI)                │            │
│  └──────────────────────────────────────────────────────┘            │
│                                                                         │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐              │
│  │   Routing    │   │   Progress   │   │     Data     │              │
│  │    Logic     │   │   Tracking   │   │  Sync Layer  │              │
│  └──────────────┘   └──────────────┘   └──────────────┘              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                               │
                               │ Integrations
                               │
      ┌────────────────────────┼────────────────────────┐
      │                        │                        │
      ▼                        ▼                        ▼
┌──────────┐          ┌──────────────┐         ┌──────────────┐
│ Marketing│          │     CRM      │         │   X-Series   │
│  System  │          │  (Salesforce)│         │ Provisioning │
└──────────┘          └──────────────┘         └──────────────┘
      │                        │                        │
      ▼                        ▼                        ▼
┌──────────┐          ┌──────────────┐         ┌──────────────┐
│ Payments │          │   Hardware   │         │   Billing    │
│  Service │          │   Ordering   │         │   System     │
└──────────┘          └──────────────┘         └──────────────┘
```

### Component Interaction Flow

```
1. Lead Capture (Marketing) → Lead Profiling Engine
   ↓
2. Lead Profiling Engine → Cohort Assignment → Routing Logic
   ↓
3. Routing Logic → [Self-Serve Flow] OR [AE Queue]
   ↓
4. Onboarding Orchestrator → KYB Check (Payments Service)
   ↓
5. KYB Approved → Order Management → X-Series Provisioning
   ↓
6. Order Management → Billing → Hardware Ordering
   ↓
7. Hardware Shipped → KYC Check (Payments Service)
   ↓
8. Progress Tracking → Stall Detection → Intervention Routing
   ↓
9. Bank Verification → Payout Enablement
   ↓
10. Final Setup Complete → Active Merchant
```

---

## Core System Components

### 1. Lead Profiling Engine

**Responsibility:** Analyze lead data and assign appropriate cohort and journey path

**Key Capabilities:**
- Evaluate GTV signals, business vertical, complexity factors
- Apply rule-based and ML-based scoring models
- Assign selling plan (Self-Serve, Assisted, Managed)
- Assign setup plan (Self-Serve, Free IC, Paid IC)
- Calculate risk scores for compliance routing

**Technical Design:**
- **Service Type:** Stateless microservice
- **Compute Pattern:** Synchronous API + async batch re-profiling
- **Data Store:** PostgreSQL for rules, Redis for cached scores
- **API:** REST + GraphQL for dashboard queries

**Interfaces:**
```
POST /api/v1/leads/profile
GET  /api/v1/leads/{leadId}/cohort
PUT  /api/v1/leads/{leadId}/cohort (manual override)
```

**Events Emitted:**
- `lead.profiled` - Cohort assigned
- `lead.cohort_changed` - Manual override or re-profiling

---

### 2. Unified Onboarding Dashboard

**Responsibility:** Single-pane-of-glass UI for merchants to track progress and complete steps

**Key Capabilities:**
- Display 10-step progress visualization
- Context-aware next actions based on cohort
- Embedded forms for data collection
- Quote display and payment processing
- Hardware tracking and setup guides
- Support handoff (chat, IC scheduling)

**Technical Design:**
- **Framework:** React 18+ with TypeScript
- **State Management:** React Query + Zustand for global state
- **UI Components:** Design system built on Radix UI / shadcn/ui
- **Backend Integration:** GraphQL + REST APIs
- **Real-time Updates:** WebSockets for progress notifications

**Key Pages:**
- Dashboard Home (progress overview)
- Account Setup (Steps 1-3)
- Buying Experience (Steps 4-6)
- Guided Setup (Steps 7-10)
- Support Hub (chat, scheduling, docs)

---

### 3. Smart Routing Logic

**Responsibility:** Route merchants to appropriate paths and trigger interventions

**Key Capabilities:**
- Route high-GTV leads to AE queue with SLA tracking
- Route self-serve leads through automated flows
- Detect stalled progress and trigger alerts
- Escalate blocked merchants to IC/AE support
- Manage queue assignment and load balancing

**Technical Design:**
- **Service Type:** Event-driven microservice
- **Compute Pattern:** React to `lead.profiled`, `step.stalled` events
- **Data Store:** PostgreSQL for routing rules, Redis for queue state
- **Queue Management:** Redis-backed priority queues

**Routing Decision Factors:**
```yaml
High Priority Queue (AE):
  - GTV > $2M
  - Multi-location (10+)
  - Enterprise vertical
  - Custom integration needs

Medium Priority Queue (IC):
  - Self-serve stalled >3 days
  - Complex data migration needs
  - Manual review required

Self-Serve Path:
  - GTV < $500K
  - Single location
  - Standard use case
```

**Events Emitted:**
- `lead.routed_to_ae`
- `lead.routed_to_ic`
- `merchant.stalled` - Triggers intervention

---

### 4. Progress Tracking System

**Responsibility:** Track merchant progress through 10 steps, detect anomalies

**Key Capabilities:**
- Record completion of each step with timestamps
- Track state transitions (pending → in_progress → completed → blocked)
- Calculate time-in-step and total journey duration
- Identify drop-off points and abandonment patterns
- Generate alerts for stalled merchants
- Provide analytics for ops dashboards

**Technical Design:**
- **Service Type:** Event-sourced microservice
- **Compute Pattern:** Event-driven + scheduled batch jobs
- **Event Store:** PostgreSQL with event sourcing pattern
- **Analytics Store:** ClickHouse or BigQuery for time-series analysis
- **Real-time Processing:** Apache Kafka Streams or Flink

**State Machine:**
```
┌──────────┐     ┌────────────┐     ┌───────────┐     ┌─────────┐
│ Pending  │────▶│ In Progress│────▶│ Completed │────▶│ Active  │
└──────────┘     └────────────┘     └───────────┘     └─────────┘
      │                 │                                    ▲
      │                 │                                    │
      │                 ▼                                    │
      │          ┌──────────┐                                │
      └─────────▶│ Blocked  │────────────────────────────────┘
                 └──────────┘
                  (Manual Review/Intervention)
```

**Events Consumed:**
- `step.started`, `step.completed`, `step.failed`
- `kyb.approved`, `kyc.approved`, `payment.completed`

**Events Emitted:**
- `merchant.step_completed`
- `merchant.journey_completed`
- `merchant.stalled` - Not progressing for X days
- `merchant.abandoned` - No activity for Y days

---

### 5. Onboarding Orchestrator

**Responsibility:** Coordinate multi-step workflows and enforce business rules

**Key Capabilities:**
- Enforce step ordering (KYB before hardware purchase)
- Coordinate parallel processes (X-Series + Payments activation)
- Handle compensating transactions for failures
- Manage long-running workflows with saga pattern
- Retry failed integrations with exponential backoff

**Technical Design:**
- **Service Type:** Workflow orchestration service
- **Workflow Engine:** Temporal.io or AWS Step Functions
- **Compute Pattern:** Event-driven + durable workflows
- **Data Store:** Workflow state in orchestrator DB

**Critical Workflows:**
```
Workflow: Purchase and Provision
1. Validate KYB completed (blocking check)
2. Process payment (billing system)
3. Provision X-Series account (parallel)
4. Create payments account (parallel)
5. Submit hardware order
6. Send confirmation emails
7. Update progress tracker

Saga Compensation:
- Payment fails → Cancel order, refund hold
- Provisioning fails → Refund payment, cancel hardware
- Hardware unavailable → Offer alternatives, hold provisioning
```

**Events Consumed:**
- All step completion events
- Integration success/failure events

**Events Emitted:**
- `workflow.started`, `workflow.completed`, `workflow.failed`
- `workflow.compensation_triggered`

---

### 6. Data Sync Layer

**Responsibility:** Synchronize merchant data across all systems

**Key Capabilities:**
- Bidirectional sync between Onboarding DB ↔ CRM
- Forward-sync to X-Series (account provisioning)
- Forward-sync to Payments (KYB/KYC data)
- Conflict resolution for concurrent updates
- Data transformation and mapping between schemas

**Technical Design:**
- **Service Type:** Integration microservice
- **Sync Pattern:** Event-driven CDC (Change Data Capture)
- **Message Bus:** Apache Kafka for reliable event delivery
- **Data Store:** PostgreSQL with outbox pattern
- **Retry Logic:** Dead letter queues with exponential backoff

**Sync Mappings:**
```
Onboarding Lead → CRM Lead
  - Name, Email, Phone → Standard Fields
  - Cohort, GTV Estimate → Custom Fields
  - Selling Plan → Opportunity Stage

Onboarding Merchant → X-Series Account
  - Business details → Account entity
  - Locations → Location entities
  - Subscription → License allocation

Onboarding Merchant → Payments Account
  - KYB data → Business entity
  - KYC data → Person entities
  - Bank details → Payout configuration
```

**Events Consumed:**
- `lead.created`, `lead.updated`, `merchant.updated`
- `kyb.completed`, `kyc.completed`

**Events Emitted:**
- `sync.completed`, `sync.failed`
- `conflict.detected` - Requires manual resolution

---

### 7. Order Management Service

**Responsibility:** Manage subscription, hardware, and service orders

**Key Capabilities:**
- Build quotes for software + hardware + services
- Process payments via billing system
- Track order fulfillment status
- Coordinate with hardware shipping
- Handle order modifications and cancellations

**Technical Design:**
- **Service Type:** Transactional microservice
- **Compute Pattern:** Synchronous API + event emission
- **Data Store:** PostgreSQL with ACID transactions
- **API:** REST for order operations

**Order Lifecycle:**
```
Draft → Quote Generated → Payment Pending → Paid →
Hardware Ordered → Shipped → Delivered → Activated
```

---

## Technology Stack Recommendations

### Backend Services

**Primary Language:**
- **Node.js (TypeScript)** for API services (high async I/O, rapid development)
- **Go** for high-throughput services (Routing Logic, Event Processing)
- **Python** for ML-based profiling models

**API Layer:**
- **REST:** Express.js or Fastify for RESTful APIs
- **GraphQL:** Apollo Server for dashboard queries
- **gRPC:** Service-to-service communication (optional for performance)

**Databases:**

| Use Case | Technology | Rationale |
|----------|-----------|-----------|
| Transactional Data | PostgreSQL 15+ | ACID guarantees, JSON support, strong ecosystem |
| Session/Cache | Redis 7+ | Sub-millisecond latency, pub/sub for real-time |
| Event Store | PostgreSQL + Debezium CDC | Durable event log, CDC for Kafka integration |
| Analytics | ClickHouse or BigQuery | Time-series queries, fast aggregations |
| Search | Elasticsearch | Full-text search for dashboards, audit logs |

**Message Queue & Events:**
- **Apache Kafka:** Durable event streaming, high throughput
- **Alternative:** AWS SQS/SNS for simpler deployment
- **Dead Letter Queues:** For failed message handling

**Workflow Orchestration:**
- **Temporal.io:** Durable workflows, built-in retry/compensation
- **Alternative:** AWS Step Functions for AWS-native deployments

**Caching Strategy:**
- **L1 Cache:** In-memory cache per service (Node.js `node-cache`)
- **L2 Cache:** Redis for shared cache across instances
- **CDN:** CloudFront/Cloudflare for static assets

---

### Frontend Stack

**Framework:** React 18+ with TypeScript

**Build Tooling:** Vite for fast builds and HMR

**State Management:**
- **React Query (TanStack Query):** Server state, caching, mutations
- **Zustand:** Global client state (user session, UI preferences)

**UI Components:**
- **Design System:** Custom built on Radix UI primitives
- **Styling:** Tailwind CSS with design tokens
- **Forms:** React Hook Form + Zod for validation

**Real-time Updates:**
- **WebSockets:** Socket.io or native WebSockets
- **Polling Fallback:** For environments blocking WebSockets

**Testing:**
- **Unit:** Vitest
- **Integration:** Playwright
- **Component:** Storybook + Chromatic

---

### Infrastructure & DevOps

**Container Orchestration:**
- **Kubernetes (EKS/GKE/AKS):** Production-grade orchestration
- **Docker:** Container runtime
- **Helm:** Package management for K8s deployments

**CI/CD Pipeline:**
- **GitHub Actions or GitLab CI:** Build, test, deploy
- **ArgoCD:** GitOps-based continuous deployment
- **Automated Testing:** Unit, integration, E2E in pipeline

**Monitoring & Observability:**
- **Metrics:** Prometheus + Grafana
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana) or DataDog
- **Tracing:** Jaeger or AWS X-Ray for distributed tracing
- **APM:** DataDog or New Relic for application performance

**Infrastructure as Code:**
- **Terraform:** Multi-cloud infrastructure provisioning
- **Ansible:** Configuration management (if needed)

---

## Deployment Architecture

### Microservices Strategy

**Approach:** Domain-aligned microservices with shared infrastructure services

**Core Services:**
1. **Lead Profiling Service**
2. **Onboarding Orchestrator Service**
3. **Order Management Service**
4. **Progress Tracking Service**
5. **Routing Logic Service**
6. **Data Sync Service**
7. **API Gateway** (Kong or AWS API Gateway)
8. **Dashboard Backend-for-Frontend (BFF)**

**Shared Infrastructure:**
- **Auth Service:** OAuth 2.0 / OpenID Connect provider
- **Notification Service:** Email, SMS, push notifications
- **File Storage Service:** S3-compatible object storage
- **Analytics Service:** Event ingestion and reporting

### Deployment Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                         Load Balancer (ALB)                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │                             │
         ┌──────▼──────┐              ┌──────▼──────┐
         │   CDN       │              │ API Gateway │
         │ (Static)    │              │   (Kong)    │
         └─────────────┘              └──────┬──────┘
                                             │
                              ┌──────────────┼──────────────┐
                              │              │              │
                     ┌────────▼────┐  ┌──────▼──────┐  ┌───▼────┐
                     │  Dashboard  │  │   Service   │  │  Auth  │
                     │     BFF     │  │   Mesh      │  │Service │
                     └─────────────┘  └──────┬──────┘  └────────┘
                                             │
                  ┌──────────────────────────┼──────────────────────┐
                  │                          │                      │
          ┌───────▼───────┐       ┌──────────▼────────┐   ┌────────▼───────┐
          │ Lead Profiling│       │    Onboarding     │   │Order Management│
          │    Service    │       │   Orchestrator    │   │    Service     │
          └───────┬───────┘       └──────────┬────────┘   └────────┬───────┘
                  │                          │                      │
                  └──────────────────────────┼──────────────────────┘
                                             │
                                    ┌────────▼────────┐
                                    │  Kafka Cluster  │
                                    └────────┬────────┘
                                             │
                  ┌──────────────────────────┼──────────────────────┐
                  │                          │                      │
          ┌───────▼───────┐       ┌──────────▼────────┐   ┌────────▼───────┐
          │Progress Track │       │   Routing Logic   │   │  Data Sync     │
          │    Service    │       │     Service       │   │   Service      │
          └───────────────┘       └───────────────────┘   └────────────────┘
```

### Environment Strategy

**Environments:**
1. **Development:** Local Docker Compose + Kubernetes (minikube)
2. **Staging:** Full production replica with synthetic data
3. **Production:** Multi-AZ deployment with auto-scaling

**Deployment Zones:**
- **US-East:** Primary region
- **US-West:** DR region (active-passive)
- **EU:** Future expansion for compliance

### Scaling Strategy

**Horizontal Scaling:**
- All services stateless (store session in Redis)
- Auto-scaling based on CPU/memory and custom metrics (queue depth)
- Minimum 2 replicas per service for HA

**Database Scaling:**
- **Read Replicas:** PostgreSQL read replicas for analytics queries
- **Connection Pooling:** PgBouncer to manage connection limits
- **Partitioning:** Time-based partitioning for event tables

**Cache Scaling:**
- **Redis Cluster:** Horizontal partitioning for cache layer
- **CDN:** Static assets cached at edge locations

---

## Scalability & Performance

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p95) | <500ms | Dashboard operations |
| API Response Time (p99) | <1s | Complex queries |
| Event Processing Latency | <5s | Time from event to handler completion |
| Dashboard Page Load | <2s | Time to interactive |
| Concurrent Users | 10,000+ | Simultaneous dashboard users |
| Throughput | 1,000 TPS | Transactions per second |

### Scalability Patterns

**1. Database Sharding (Future):**
- Shard by merchant ID for horizontal data partitioning
- Implement when single DB exceeds capacity

**2. CQRS (Command Query Responsibility Segregation):**
- Separate write models (transactional) from read models (analytics)
- Use materialized views or separate read databases

**3. Caching Layers:**
```
Request → L1 Cache (in-memory) → L2 Cache (Redis) → Database
                ↓                        ↓              ↓
            <1ms                       <10ms         <50ms
```

**4. Event Processing:**
- Kafka consumer groups for parallel event processing
- Partition by merchant ID for ordered processing per merchant

**5. Rate Limiting:**
- API Gateway enforces rate limits per API key
- Protects backend services from overload

---

## Security Architecture

### Authentication & Authorization

**Merchant Authentication:**
- **OAuth 2.0 / OpenID Connect** via Auth0 or AWS Cognito
- **MFA Required:** For financial operations (bank setup, payment processing)
- **Session Management:** JWT tokens with short expiry (15 min), refresh tokens (7 days)

**Service-to-Service Authentication:**
- **mTLS:** Mutual TLS for service mesh communication
- **JWT:** Service tokens with scoped permissions

**Internal User Authentication:**
- **SSO:** SAML 2.0 integration with corporate IdP
- **RBAC:** Role-based access (AE, IC, Admin, Support)

### Data Protection

**Encryption:**
- **At Rest:** AES-256 encryption for all databases
- **In Transit:** TLS 1.3 for all network communication
- **Field-Level:** PII fields encrypted with customer-managed keys (CMK)

**PII/PCI Compliance:**
- **PII Fields:** SSN, DOB, EIN encrypted at application layer
- **PCI Fields:** Credit card data never stored (tokenized by payment processor)
- **Audit Logs:** All access to sensitive data logged

**Network Security:**
- **VPC Isolation:** Services in private subnets
- **Security Groups:** Least-privilege firewall rules
- **WAF:** Web Application Firewall for API Gateway
- **DDoS Protection:** Cloudflare or AWS Shield

### Vulnerability Management

- **Dependency Scanning:** Automated vulnerability scanning (Snyk, Dependabot)
- **SAST/DAST:** Static and dynamic code analysis in CI/CD
- **Penetration Testing:** Annual third-party security audits
- **Bug Bounty:** Responsible disclosure program

---

## Monitoring & Observability

### Metrics Collection

**Application Metrics:**
- Request rate, error rate, latency (RED method)
- Business metrics: conversion rates, time-to-complete, drop-off rates

**Infrastructure Metrics:**
- CPU, memory, disk, network utilization
- Database connection pool metrics
- Kafka lag and throughput

**Alerting:**
- **P1 Alerts:** Service down, data loss, security incident
- **P2 Alerts:** High error rate, performance degradation
- **P3 Alerts:** Capacity warnings, anomaly detection

### Logging Strategy

**Structured Logging:**
- JSON format with consistent schema
- Include trace ID, merchant ID, step ID for correlation

**Log Levels:**
- **ERROR:** Application errors requiring action
- **WARN:** Potential issues, degraded functionality
- **INFO:** Key business events (step completion, routing decisions)
- **DEBUG:** Detailed troubleshooting info (dev/staging only)

**Log Retention:**
- Hot storage: 7 days
- Warm storage: 90 days
- Cold archive: 7 years (compliance)

### Distributed Tracing

**Trace Propagation:**
- W3C Trace Context standard
- Trace ID passed via HTTP headers and Kafka message headers

**Trace Spans:**
- API request → Service calls → Database queries → External integrations

**Sampling:**
- 100% of errors
- 10% of successful requests (adjustable)

---

## Disaster Recovery & Business Continuity

### Backup Strategy

**Database Backups:**
- **Continuous:** Point-in-time recovery enabled
- **Snapshots:** Daily automated snapshots, retained 30 days
- **Cross-Region:** Backup replication to DR region

**Application State:**
- **Stateless Services:** No backup needed (immutable deployments)
- **Redis Cache:** Expendable (rebuilt from database)

**Configuration & Secrets:**
- **Version Controlled:** Infrastructure as Code in Git
- **Secrets:** AWS Secrets Manager or HashiCorp Vault with backups

### Disaster Recovery Plan

**RTO/RPO Targets:**
- **RTO (Recovery Time Objective):** 4 hours
- **RPO (Recovery Point Objective):** 15 minutes

**DR Scenario: Regional Outage**
1. Detect outage via health checks (<5 min)
2. Promote read replica to master in DR region (<15 min)
3. Update DNS to point to DR region (<5 min)
4. Scale up DR environment to production capacity (<30 min)
5. Verify all services operational (<15 min)
6. Communicate to stakeholders

**Failover Testing:**
- Quarterly DR drills
- Automated chaos engineering (Chaos Monkey)

### Business Continuity

**Service Degradation Modes:**

| Scenario | Impact | Mitigation |
|----------|--------|------------|
| Dashboard Down | Merchants can't see progress | SMS/email progress updates, phone support |
| CRM Sync Failed | AE doesn't see lead in CRM | Manual lead entry, batch retry |
| Payment Service Down | Can't process KYB/KYC | Queue requests, process when restored |
| X-Series Provisioning Down | Can't create accounts | Accept orders, provision when restored |

**Critical Path Protection:**
- KYB checks have 3-provider fallback
- Payment processing has backup processor
- Email delivery via multiple providers (SendGrid, AWS SES)

---

## Appendix: Decision Log

### ADR-001: Microservices vs Monolith
**Decision:** Microservices architecture
**Rationale:**
- Independent scaling of components (Lead Profiling vs Dashboard)
- Team autonomy (frontend, backend, integrations teams)
- Technology flexibility (Node.js for APIs, Go for high-throughput)

**Trade-offs:**
- Increased operational complexity
- Distributed tracing required
- More complex debugging

---

### ADR-002: PostgreSQL vs NoSQL
**Decision:** PostgreSQL as primary datastore
**Rationale:**
- Strong ACID guarantees for financial data
- Complex relational queries (cohort analysis, reporting)
- JSON support for flexible schema evolution
- Mature ecosystem and tooling

**Trade-offs:**
- Scaling requires sharding strategy
- Read-heavy queries need read replicas

---

### ADR-003: Temporal.io for Orchestration
**Decision:** Temporal.io for workflow orchestration
**Rationale:**
- Built-in retry and compensation logic
- Durable workflows survive service restarts
- Visual workflow execution tracking
- Better than custom saga implementation

**Trade-offs:**
- Additional infrastructure dependency
- Learning curve for developers
- Alternative: AWS Step Functions for AWS-only

---

### ADR-004: Event-Driven Architecture
**Decision:** Kafka-based event streaming
**Rationale:**
- Decouples services (loose coupling)
- Enables async processing (performance)
- Provides audit trail (event sourcing)
- Supports future real-time analytics

**Trade-offs:**
- Eventual consistency between services
- Increased complexity in local development
- Requires robust event schema management

---

## Next Steps

1. **Technical Feasibility Spike:**
   - Validate Temporal.io for workflow orchestration
   - Prototype lead profiling ML model
   - Load test Kafka cluster configuration

2. **Detailed Service Design:**
   - Define OpenAPI specs for all REST APIs
   - Design GraphQL schema for dashboard
   - Document Kafka event schemas

3. **Infrastructure Setup:**
   - Provision Kubernetes clusters (staging, production)
   - Set up CI/CD pipelines
   - Configure monitoring and alerting

4. **Security Review:**
   - Data classification and encryption requirements
   - Penetration testing scope
   - Compliance audit (PCI, SOC 2)

---

**Document Owner:** Chief Architect
**Review Cycle:** Quarterly or on major architectural changes
**Feedback:** architecture@lightspeed.com
