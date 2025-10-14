# Integration Patterns: Cohort-Based Merchant Onboarding

**Version:** 1.0
**Last Updated:** October 2025
**Status:** Integration Architecture Design Document
**Audience:** Backend Engineers, Integration Engineers, DevOps

---

## Table of Contents

1. [Integration Overview](#integration-overview)
2. [Integration Architecture Principles](#integration-architecture-principles)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [External System Integrations](#external-system-integrations)
5. [Event-Driven Architecture](#event-driven-architecture)
6. [API Integration Patterns](#api-integration-patterns)
7. [Error Handling & Retry Strategies](#error-handling--retry-strategies)
8. [Data Consistency Patterns](#data-consistency-patterns)
9. [Integration Security](#integration-security)
10. [Monitoring & Observability](#monitoring--observability)

---

## Integration Overview

The Cohort-Based Merchant Onboarding system integrates with six external systems to orchestrate the complete merchant journey:

| External System | Purpose | Integration Type | Direction |
|----------------|---------|------------------|-----------|
| **Marketing System** | Lead capture from website | REST API + Webhooks | Inbound |
| **CRM (Salesforce)** | AE/IC lead management | REST API + Event Sync | Bidirectional |
| **X-Series Provisioning** | Account & license creation | REST API | Outbound |
| **Payments Service** | KYB/KYC checks, activation | REST API + Webhooks | Bidirectional |
| **Hardware Ordering** | Equipment fulfillment | REST API + Webhooks | Outbound |
| **Billing System** | Invoice & payment processing | REST API + Webhooks | Bidirectional |

**Integration Characteristics:**
- **Total Integration Points:** 6 external systems
- **Primary Pattern:** Event-driven with REST APIs
- **Message Bus:** Apache Kafka for reliable event delivery
- **Data Sync:** Near real-time (< 5 seconds latency)
- **Error Handling:** Exponential backoff with circuit breakers

---

## Integration Architecture Principles

### 1. Loose Coupling via Events
- Services communicate primarily through domain events
- No direct database access between services
- API calls only for synchronous operations requiring immediate response

### 2. Resilient Integration
- All integrations must handle failures gracefully
- Implement retry logic with exponential backoff
- Use circuit breakers to prevent cascading failures
- Dead letter queues for failed messages requiring manual intervention

### 3. Idempotency
- All event handlers and API endpoints must be idempotent
- Use idempotency keys for critical operations (payments, provisioning)
- Enable safe retries without side effects

### 4. Data Ownership
- Each service owns its data and exposes it via APIs
- No shared databases between services
- Eventual consistency is acceptable for non-critical data

### 5. API-First Design
- All integrations use well-documented APIs (OpenAPI/AsyncAPI specs)
- Version all APIs to support backward compatibility
- Use semantic versioning (v1, v2, etc.)

### 6. Observability
- All integration points instrumented with metrics, logs, traces
- Track success/failure rates, latency, throughput
- Alert on degraded performance or failures

---

## Data Flow Diagrams

### End-to-End Merchant Journey Data Flow

```
┌──────────────┐
│   Marketing  │ 1. Lead Capture
│    Website   │────────┐
└──────────────┘        │
                        ▼
                ┌───────────────┐
                │ Onboarding    │ 2. Lead Creation
                │ System        │────────┐
                └───────────────┘        │
                        │                ▼
                        │        ┌───────────────┐
                        │        │      CRM      │ 3. Lead Sync
                        │        │  (Salesforce) │
                        │        └───────────────┘
                        │
                        │ 4. Cohort Assignment & Routing
                        ▼
        ┌───────────────────────────────┐
        │   [Self-Serve] OR [AE Queue]  │
        └───────────────────────────────┘
                        │
                        │ 5. KYB Check (Step 3)
                        ▼
                ┌───────────────┐
                │   Payments    │ 6. KYB Approval
                │   Service     │────────┐
                └───────────────┘        │
                                         ▼
                                 ┌───────────────┐
                                 │ Onboarding    │ 7. Enable Purchase
                                 │ System        │
                                 └───────────────┘
                                         │
                        ┌────────────────┼────────────────┐
                        ▼                ▼                ▼
                ┌───────────┐    ┌──────────┐    ┌──────────────┐
                │ X-Series  │    │ Billing  │    │   Hardware   │
                │Provision  │    │ System   │    │   Ordering   │
                └───────────┘    └──────────┘    └──────────────┘
                        │                │                │
                        │ 8. Account     │ 9. Payment     │ 10. Shipment
                        │    Created     │    Processed   │     Initiated
                        └────────────────┼────────────────┘
                                         │
                                         ▼
                                 ┌───────────────┐
                                 │ Onboarding    │ 11. Trigger Setup
                                 │ System        │
                                 └───────────────┘
                                         │
                                         │ 12. KYC Check (Step 7)
                                         ▼
                                 ┌───────────────┐
                                 │   Payments    │ 13. KYC Approval
                                 │   Service     │     + Activate
                                 └───────────────┘
                                         │
                                         │ 14. Bank Verification (Step 9)
                                         ▼
                                 ┌───────────────┐
                                 │   Payments    │ 15. Enable Payouts
                                 │   Service     │
                                 └───────────────┘
                                         │
                                         │ 16. Complete Onboarding
                                         ▼
                                 ┌───────────────┐
                                 │Active Merchant│
                                 └───────────────┘
```

---

### Critical Data Flows

#### Flow 1: Lead Capture to CRM Sync

```
Marketing Website
      │
      │ POST /api/webhooks/lead-capture
      ▼
┌─────────────────┐
│ Onboarding API  │
│  Gateway        │
└─────────────────┘
      │
      │ Validate & Enrich
      ▼
┌─────────────────┐
│ Lead Profiling  │ 1. Create lead record
│    Service      │ 2. Calculate scores
└─────────────────┘ 3. Assign cohort
      │
      │ Emit: lead.created
      ▼
┌─────────────────┐
│  Kafka Topic    │
│ lead-events     │
└─────────────────┘
      │
      ├─────────────────────┬─────────────────────┐
      ▼                     ▼                     ▼
┌──────────┐        ┌──────────────┐      ┌─────────────┐
│ Data Sync│        │    Routing   │      │  Dashboard  │
│ Service  │        │    Service   │      │   Service   │
└──────────┘        └──────────────┘      └─────────────┘
      │
      │ Transform to CRM schema
      ▼
┌─────────────────┐
│   Salesforce    │
│      API        │
└─────────────────┘
      │
      │ POST /services/data/v57.0/sobjects/Lead
      ▼
┌─────────────────┐
│  CRM Lead       │ Lead Created
│  Record         │ lead_id stored
└─────────────────┘
```

---

#### Flow 2: KYB Approval → Purchase Enablement

```
Merchant Dashboard
      │
      │ Submit KYB data (Step 3)
      ▼
┌─────────────────┐
│ Onboarding      │ 1. Store merchant data
│ Orchestrator    │ 2. Prepare KYB request
└─────────────────┘
      │
      │ POST /api/v1/kyb/submit
      ▼
┌─────────────────┐
│   Payments      │ 3. Run KYB checks
│   Service       │    - Business verification
└─────────────────┘    - Risk assessment
      │
      │ Webhook: kyb.completed
      ▼
┌─────────────────┐
│ Onboarding API  │ 4. Receive webhook
│  Gateway        │ 5. Validate signature
└─────────────────┘
      │
      │ Emit: kyb.approved
      ▼
┌─────────────────┐
│  Kafka Topic    │
│ payment-events  │
└─────────────────┘
      │
      ├─────────────────────┬─────────────────────┐
      ▼                     ▼                     ▼
┌──────────┐        ┌──────────────┐      ┌─────────────┐
│Progress  │        │ Orchestrator │      │   CRM       │
│Tracker   │        │   Service    │      │   Sync      │
└──────────┘        └──────────────┘      └─────────────┘
                          │
                          │ Update merchant.kyb_status
                          │ Enable Step 4 (Software Requirements)
                          ▼
                    ┌──────────────┐
                    │  Dashboard   │ Show next step
                    │   Service    │ enabled
                    └──────────────┘
```

---

#### Flow 3: Payment → Multi-System Provisioning

```
Merchant Dashboard
      │
      │ Complete payment (Step 6)
      ▼
┌─────────────────┐
│ Onboarding      │ 1. Create order
│ Order Service   │ 2. Process payment
└─────────────────┘
      │
      │ POST /api/v1/payments/process
      ▼
┌─────────────────┐
│  Billing        │ 3. Charge payment method
│  System         │ 4. Generate invoice
└─────────────────┘
      │
      │ Webhook: payment.succeeded
      ▼
┌─────────────────┐
│ Onboarding      │ 5. Receive confirmation
│ Orchestrator    │ 6. Emit: order.paid
└─────────────────┘
      │
      │ Kafka: order.paid event
      ▼
┌─────────────────┐
│ Event Bus       │
└─────────────────┘
      │
      ├─────────────────────┬─────────────────────┬─────────────────────┐
      ▼                     ▼                     ▼                     ▼
┌──────────┐        ┌──────────────┐      ┌─────────────┐     ┌──────────┐
│X-Series  │        │   Hardware   │      │  Progress   │     │   CRM    │
│Provision │        │   Ordering   │      │  Tracker    │     │   Sync   │
└──────────┘        └──────────────┘      └─────────────┘     └──────────┘
      │                     │
      │ POST /api/v1/       │ POST /api/v1/
      │ accounts/create     │ orders/create
      ▼                     ▼
┌──────────┐        ┌──────────────┐
│X-Series  │        │   Hardware   │
│ Account  │        │   Shipment   │
└──────────┘        └──────────────┘
      │                     │
      │ Emit: account.      │ Emit: shipment.
      │       created       │       created
      └─────────────────────┴─────────────────────┐
                                                   ▼
                                          ┌─────────────┐
                                          │ Onboarding  │
                                          │   System    │
                                          └─────────────┘
                                                   │
                                                   │ Update merchant
                                                   │ Enable Step 7 (KYC)
                                                   ▼
                                          ┌─────────────┐
                                          │  Dashboard  │
                                          └─────────────┘
```

---

## External System Integrations

### Integration 1: Marketing System

**Purpose:** Capture leads from marketing website and campaigns

**Integration Pattern:** Webhook (Inbound) + REST API (Query)

**Data Flow:** Marketing → Onboarding

#### Webhook: Lead Capture

**Endpoint:** `POST /api/v1/webhooks/marketing/lead-capture`

**Request Payload:**
```json
{
  "lead_id": "mkt_lead_123abc",
  "source": "website",
  "campaign_id": "fall_promo_2025",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "brand_search",
  "contact": {
    "email": "merchant@example.com",
    "phone": "+1-555-0123",
    "first_name": "Jane",
    "last_name": "Smith"
  },
  "business": {
    "category": "restaurant",
    "estimated_revenue": 750000,
    "num_locations": 2
  },
  "region": "US-CA",
  "language": "en",
  "timestamp": "2025-10-09T14:30:00Z"
}
```

**Response:**
```json
{
  "status": "accepted",
  "lead_id": "550e8400-e29b-41d4-a716-446655440000",
  "external_lead_id": "mkt_lead_123abc",
  "cohort": "assisted",
  "next_step": "account_creation"
}
```

**Error Handling:**
- **Duplicate lead (same email):** Return 200 with existing lead_id
- **Invalid data:** Return 400 with validation errors
- **System error:** Return 503 with retry-after header

**Security:**
- HMAC signature validation in `X-Marketing-Signature` header
- IP allowlisting for marketing system

---

### Integration 2: CRM (Salesforce)

**Purpose:** Sync leads/merchants for AE/IC management

**Integration Pattern:** REST API (Bidirectional) + Event-Driven Sync

**Data Flow:** Onboarding ↔ Salesforce

#### Salesforce Object Mapping

| Onboarding Entity | Salesforce Object | Sync Direction |
|------------------|-------------------|----------------|
| Lead | Lead | Bidirectional |
| Merchant | Account | Onboarding → SF |
| Order | Opportunity | Onboarding → SF |
| Step Progress | Custom Object: Onboarding_Progress__c | Onboarding → SF |

#### API Operations

**1. Create Lead in Salesforce**

**Endpoint:** `POST https://instance.salesforce.com/services/data/v57.0/sobjects/Lead`

**Request:**
```json
{
  "Email": "merchant@example.com",
  "FirstName": "Jane",
  "LastName": "Smith",
  "Company": "Acme Restaurant",
  "Phone": "+1-555-0123",
  "Status": "New",
  "LeadSource": "Website",
  "Annual_Revenue__c": 750000,
  "Cohort__c": "Assisted",
  "GTV_Score__c": 72.5,
  "External_Lead_ID__c": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "id": "00Q5g00000ABC123",
  "success": true,
  "errors": []
}
```

**2. Update Lead Assignment**

When AE assigned in Salesforce, sync back to Onboarding via webhook or polling.

**Salesforce Outbound Message (Webhook):**
```xml
<notifications>
  <OrganizationId>00D5g000000XXXX</OrganizationId>
  <Notification>
    <Id>04l5g000000YYYY</Id>
    <sObject xsi:type="sf:Lead">
      <sf:Id>00Q5g00000ABC123</sf:Id>
      <sf:OwnerId>0055g000000ZZZZ</sf:OwnerId>
      <sf:External_Lead_ID__c>550e8400-e29b-41d4-a716-446655440000</sf:External_Lead_ID__c>
    </sObject>
  </Notification>
</notifications>
```

**Onboarding Response:**
```json
{
  "status": "processed",
  "lead_id": "550e8400-e29b-41d4-a716-446655440000",
  "assigned_ae_id": "ae_user_123",
  "updated_at": "2025-10-09T15:00:00Z"
}
```

#### Sync Strategy

**Pattern:** Event-driven sync with Change Data Capture (CDC)

**Onboarding → Salesforce:**
- Event triggers: `lead.created`, `lead.updated`, `merchant.converted`
- Frequency: Near real-time (<5 seconds)
- Retry: Exponential backoff (1s, 2s, 4s, 8s, 16s)
- Dead Letter Queue after 5 failed attempts

**Salesforce → Onboarding:**
- Salesforce Platform Events or Outbound Messages
- Polling fallback every 5 minutes for missed events

**Conflict Resolution:**
- Salesforce is source of truth for AE/IC assignments
- Onboarding is source of truth for journey progress
- Last-write-wins for non-critical fields
- Manual resolution queue for critical conflicts

---

### Integration 3: X-Series Provisioning

**Purpose:** Create merchant accounts and provision licenses

**Integration Pattern:** REST API (Outbound) + Idempotency

**Data Flow:** Onboarding → X-Series

#### API Operations

**1. Create Account**

**Endpoint:** `POST /api/v2/accounts`

**Authentication:** Bearer token (OAuth 2.0)

**Request:**
```json
{
  "idempotency_key": "order_550e8400-e29b-41d4-a716-446655440000",
  "account": {
    "business_name": "Acme Restaurant",
    "legal_business_name": "Acme Restaurant LLC",
    "email": "merchant@example.com",
    "phone": "+1-555-0123",
    "business_type": "restaurant",
    "registered_address": {
      "line1": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102",
      "country": "US"
    }
  },
  "subscription": {
    "tier": "professional",
    "billing_cycle": "monthly",
    "licenses": {
      "location": 2,
      "register": 4
    }
  },
  "locations": [
    {
      "name": "Acme Downtown",
      "address": {
        "line1": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94102",
        "country": "US"
      },
      "is_primary": true
    }
  ],
  "metadata": {
    "onboarding_merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "onboarding_order_id": "order_123abc"
  }
}
```

**Response:**
```json
{
  "account_id": "x_acct_789xyz",
  "status": "active",
  "subscription_id": "x_sub_456def",
  "locations": [
    {
      "location_id": "x_loc_111aaa",
      "name": "Acme Downtown",
      "is_primary": true
    }
  ],
  "created_at": "2025-10-09T15:30:00Z"
}
```

**Error Handling:**
- **409 Conflict:** Account already exists (idempotency key matched)
- **400 Bad Request:** Invalid data, return specific field errors
- **500 Server Error:** Retry with exponential backoff

**Idempotency:**
- Use `idempotency_key` to prevent duplicate account creation
- X-Series returns existing account if idempotency key matches
- Safe to retry on network failures

**Retry Logic:**
```javascript
maxRetries: 5
retryDelays: [1s, 2s, 4s, 8s, 16s]
retryableErrors: [500, 502, 503, 504, network_timeout]
nonRetryableErrors: [400, 401, 403, 422]
```

---

### Integration 4: Payments Service

**Purpose:** KYB/KYC checks, payment activation, payout management

**Integration Pattern:** REST API + Webhooks (Bidirectional)

**Data Flow:** Onboarding ↔ Payments

#### KYB Flow (Step 3)

**1. Submit KYB Application**

**Endpoint:** `POST /api/v1/kyb/applications`

**Request:**
```json
{
  "idempotency_key": "kyb_merchant_550e8400",
  "business": {
    "legal_name": "Acme Restaurant LLC",
    "structure": "llc",
    "ein": "12-3456789",
    "industry_code": "5812",
    "registered_address": {
      "line1": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102",
      "country": "US"
    },
    "phone": "+1-555-0123",
    "website": "https://acmerestaurant.com"
  },
  "metadata": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response:**
```json
{
  "application_id": "kyb_app_abc123",
  "status": "pending",
  "estimated_completion": "2025-10-09T16:00:00Z",
  "webhook_url": "https://onboarding.lightspeed.com/api/v1/webhooks/payments/kyb"
}
```

**2. KYB Completion Webhook**

**Endpoint:** `POST /api/v1/webhooks/payments/kyb` (Onboarding receives)

**Request from Payments:**
```json
{
  "event_id": "evt_xyz789",
  "event_type": "kyb.application.completed",
  "created_at": "2025-10-09T15:45:00Z",
  "data": {
    "application_id": "kyb_app_abc123",
    "status": "approved",
    "decision": "approved",
    "risk_score": 25.5,
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "payments_business_id": "pay_biz_456def"
  }
}
```

**Webhook Verification:**
```javascript
// Validate HMAC signature
const signature = req.headers['x-payments-signature'];
const payload = req.rawBody;
const computedSignature = hmac_sha256(payload, webhookSecret);

if (signature !== computedSignature) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

**Onboarding Response:**
```json
{
  "received": true,
  "event_id": "evt_xyz789"
}
```

#### KYC Flow (Step 7)

**1. Submit KYC for Persons**

**Endpoint:** `POST /api/v1/kyc/persons`

**Request:**
```json
{
  "business_id": "pay_biz_456def",
  "person": {
    "person_type": "representative",
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@acmerestaurant.com",
    "date_of_birth": "1985-06-15",
    "ssn_last_4": "6789",
    "ssn_full": "123-45-6789",
    "address": {
      "line1": "456 Oak Ave",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94110",
      "country": "US"
    },
    "phone": "+1-555-0456"
  },
  "metadata": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "person_id": "person_uuid_123"
  }
}
```

**Response:**
```json
{
  "person_id": "pay_person_789ghi",
  "kyc_status": "pending",
  "created_at": "2025-10-09T16:00:00Z"
}
```

**2. KYC Completion Webhook**

Similar to KYB webhook pattern.

#### Bank Account Verification (Step 9)

**1. Add Bank Account**

**Endpoint:** `POST /api/v1/payouts/bank-accounts`

**Request:**
```json
{
  "business_id": "pay_biz_456def",
  "bank_account": {
    "account_holder_name": "Acme Restaurant LLC",
    "account_type": "checking",
    "account_number": "123456789",
    "routing_number": "021000021",
    "country": "US"
  },
  "verification_method": "instant",
  "metadata": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response:**
```json
{
  "bank_account_id": "pay_bank_101abc",
  "verification_status": "verified",
  "last_4": "6789",
  "payouts_enabled": true
}
```

**3. Payout Enablement Webhook**

**Event:** `bank_account.verified`

Triggers update to `merchant.payouts_enabled = true` in Onboarding.

---

### Integration 5: Hardware Ordering System

**Purpose:** Fulfill hardware orders and track shipments

**Integration Pattern:** REST API + Webhooks (Outbound)

**Data Flow:** Onboarding → Hardware

#### API Operations

**1. Create Hardware Order**

**Endpoint:** `POST /api/v1/hardware/orders`

**Request:**
```json
{
  "idempotency_key": "order_550e8400_hardware",
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "order_reference": "order_123abc",
  "items": [
    {
      "sku": "POS-TERMINAL-PRO",
      "quantity": 2,
      "unit_price": 499.99
    },
    {
      "sku": "RECEIPT-PRINTER-80MM",
      "quantity": 2,
      "unit_price": 149.99
    }
  ],
  "shipping_address": {
    "name": "Jane Smith",
    "line1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postal_code": "94102",
    "country": "US",
    "phone": "+1-555-0123"
  },
  "shipping_method": "standard"
}
```

**Response:**
```json
{
  "hardware_order_id": "hw_order_999zzz",
  "status": "processing",
  "estimated_ship_date": "2025-10-11",
  "estimated_delivery_date": "2025-10-15",
  "items": [
    {
      "item_id": "hw_item_001",
      "sku": "POS-TERMINAL-PRO",
      "quantity": 2,
      "status": "in_stock"
    }
  ]
}
```

**2. Shipment Tracking Webhook**

**Endpoint:** `POST /api/v1/webhooks/hardware/shipment-update`

**Request from Hardware System:**
```json
{
  "event_type": "shipment.shipped",
  "hardware_order_id": "hw_order_999zzz",
  "shipment": {
    "shipment_id": "ship_777xxx",
    "carrier": "FedEx",
    "tracking_number": "1234567890",
    "shipped_at": "2025-10-11T09:00:00Z",
    "estimated_delivery": "2025-10-15"
  },
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Onboarding Action:**
- Update `hardware_shipments` table
- Emit event: `hardware.shipped`
- Notify merchant via email/SMS
- Enable Step 9 (Setup Hardware) when delivered

---

### Integration 6: Billing System

**Purpose:** Process payments and manage invoicing

**Integration Pattern:** REST API + Webhooks (Bidirectional)

**Data Flow:** Onboarding ↔ Billing

#### API Operations

**1. Create Invoice**

**Endpoint:** `POST /api/v1/invoices`

**Request:**
```json
{
  "idempotency_key": "invoice_order_123abc",
  "customer": {
    "email": "merchant@example.com",
    "name": "Jane Smith",
    "metadata": {
      "merchant_id": "550e8400-e29b-41d4-a716-446655440000"
    }
  },
  "line_items": [
    {
      "description": "X-Series Professional - 2 Locations",
      "quantity": 1,
      "unit_amount": 299.00
    },
    {
      "description": "POS Terminal Pro",
      "quantity": 2,
      "unit_amount": 499.99
    }
  ],
  "due_date": "2025-10-09",
  "metadata": {
    "order_id": "order_123abc"
  }
}
```

**Response:**
```json
{
  "invoice_id": "inv_abc123xyz",
  "invoice_number": "INV-2025-001234",
  "total": 1298.98,
  "status": "open",
  "hosted_invoice_url": "https://billing.lightspeed.com/invoices/inv_abc123xyz"
}
```

**2. Process Payment**

**Endpoint:** `POST /api/v1/payments`

**Request:**
```json
{
  "invoice_id": "inv_abc123xyz",
  "payment_method_id": "pm_card_456def",
  "amount": 1298.98,
  "currency": "USD",
  "metadata": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "order_id": "order_123abc"
  }
}
```

**Response:**
```json
{
  "payment_id": "pay_789ghi",
  "status": "succeeded",
  "amount": 1298.98,
  "invoice_id": "inv_abc123xyz",
  "receipt_url": "https://billing.lightspeed.com/receipts/pay_789ghi"
}
```

**3. Payment Webhook**

**Endpoint:** `POST /api/v1/webhooks/billing/payment-status`

**Request from Billing:**
```json
{
  "event_type": "payment.succeeded",
  "payment": {
    "payment_id": "pay_789ghi",
    "invoice_id": "inv_abc123xyz",
    "amount": 1298.98,
    "status": "succeeded",
    "metadata": {
      "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
      "order_id": "order_123abc"
    }
  }
}
```

**Onboarding Action:**
- Update order status: `payment_status = 'captured'`
- Emit event: `order.paid`
- Trigger provisioning workflows

---

## Event-Driven Architecture

### Event Bus: Apache Kafka

**Cluster Configuration:**
- **Topics:** Domain-specific (lead-events, merchant-events, order-events, payment-events)
- **Partitions:** Partitioned by merchant_id for ordered processing
- **Replication:** 3x replication for durability
- **Retention:** 7 days for events, indefinite for audit events

### Event Schema Standards

**Schema Format:** JSON with JSON Schema validation

**Event Envelope:**
```json
{
  "event_id": "evt_550e8400-e29b-41d4-a716-446655440000",
  "event_type": "merchant.kyb_approved",
  "event_version": "1.0",
  "timestamp": "2025-10-09T15:45:00Z",
  "source": "onboarding-orchestrator-service",
  "correlation_id": "corr_123abc",
  "causation_id": "evt_previous_event",
  "aggregate_type": "merchant",
  "aggregate_id": "550e8400-e29b-41d4-a716-446655440000",
  "data": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "kyb_status": "approved",
    "risk_score": 25.5,
    "approved_at": "2025-10-09T15:45:00Z"
  },
  "metadata": {
    "user_id": "system",
    "ip_address": "10.0.1.5"
  }
}
```

### Key Event Types

#### Lead Events (Topic: `lead-events`)
- `lead.created` - New lead captured
- `lead.profiled` - Cohort assigned
- `lead.routed_to_ae` - Assigned to AE queue
- `lead.contacted` - First contact made
- `lead.qualified` - KYB approved
- `lead.converted` - Became paying merchant

#### Merchant Events (Topic: `merchant-events`)
- `merchant.created` - Merchant account created
- `merchant.kyb_submitted` - KYB application submitted
- `merchant.kyb_approved` - KYB approved
- `merchant.kyb_rejected` - KYB rejected
- `merchant.kyc_submitted` - KYC submitted
- `merchant.kyc_approved` - All KYC checks passed
- `merchant.payments_activated` - Can accept payments
- `merchant.payouts_enabled` - Can receive payouts
- `merchant.activated` - Fully onboarded

#### Order Events (Topic: `order-events`)
- `order.created` - Order initiated
- `order.paid` - Payment successful
- `order.refunded` - Payment refunded
- `order.fulfilled` - All items fulfilled

#### Step Progress Events (Topic: `progress-events`)
- `step.started` - Merchant began step
- `step.completed` - Step finished
- `step.failed` - Step encountered error
- `merchant.stalled` - No progress for X days
- `merchant.abandoned` - Inactive for Y days

### Event Consumer Patterns

**Pattern 1: Competing Consumers (Scalability)**
```
Kafka Topic: lead-events
└── Consumer Group: lead-to-crm-sync
    ├── Instance 1 (processes partition 0, 1)
    ├── Instance 2 (processes partition 2, 3)
    └── Instance 3 (processes partition 4, 5)
```

**Pattern 2: Multiple Consumer Groups (Parallel Processing)**
```
Kafka Topic: order.paid
├── Consumer Group: x-series-provisioning
├── Consumer Group: hardware-ordering
├── Consumer Group: crm-sync
└── Consumer Group: analytics
```

**Pattern 3: Event Sourcing (State Reconstruction)**
```
All merchant.* events → Event Store → Rebuild merchant state
```

---

## API Integration Patterns

### Pattern 1: Synchronous Request-Response

**Use Case:** Operations requiring immediate feedback

**Example:** Creating a lead, submitting KYB

**Implementation:**
```javascript
async function submitKYB(merchantData) {
  try {
    const response = await paymentsClient.post('/api/v1/kyb/applications', {
      idempotency_key: `kyb_${merchantData.merchant_id}`,
      business: merchantData.business,
      timeout: 30000 // 30 seconds
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      // Idempotency: Already exists
      return error.response.data;
    }
    throw error;
  }
}
```

---

### Pattern 2: Asynchronous with Callback (Webhooks)

**Use Case:** Long-running operations (KYB checks, hardware shipment)

**Flow:**
1. Submit request (returns immediately with `pending`)
2. External system processes asynchronously
3. Webhook callback when complete
4. Onboarding processes callback

**Implementation:**
```javascript
// 1. Submit request
const kybApp = await submitKYB(merchantData);
// Returns: { application_id: 'kyb_123', status: 'pending' }

// 2. Webhook handler
app.post('/api/v1/webhooks/payments/kyb', async (req, res) => {
  // Verify signature
  if (!verifyWebhookSignature(req)) {
    return res.status(401).send();
  }

  // Acknowledge immediately
  res.status(200).json({ received: true });

  // Process asynchronously
  await processKYBCompletion(req.body);
});

// 3. Process event
async function processKYBCompletion(event) {
  const { merchant_id, status, risk_score } = event.data;

  await db.merchants.update({
    merchant_id,
    kyb_status: status,
    kyb_approved_at: status === 'approved' ? new Date() : null
  });

  await eventBus.publish('merchant.kyb_approved', {
    merchant_id,
    risk_score
  });
}
```

---

### Pattern 3: Event-Driven Integration

**Use Case:** Loosely coupled integrations, multiple consumers

**Flow:**
1. Service emits domain event to Kafka
2. Multiple consumers react independently
3. No direct coupling between services

**Implementation:**
```javascript
// Publisher (Onboarding Orchestrator)
async function handlePaymentSuccess(orderData) {
  await eventBus.publish('order.paid', {
    order_id: orderData.order_id,
    merchant_id: orderData.merchant_id,
    total_amount: orderData.total_amount,
    items: orderData.items
  });
}

// Consumer 1 (X-Series Provisioning)
eventBus.subscribe('order.paid', async (event) => {
  const { merchant_id, items } = event.data;
  const softwareLicenses = items.filter(i => i.type === 'software_license');

  await provisionXSeriesAccount(merchant_id, softwareLicenses);
});

// Consumer 2 (Hardware Ordering)
eventBus.subscribe('order.paid', async (event) => {
  const { merchant_id, items } = event.data;
  const hardwareItems = items.filter(i => i.type === 'hardware');

  if (hardwareItems.length > 0) {
    await createHardwareOrder(merchant_id, hardwareItems);
  }
});
```

---

## Error Handling & Retry Strategies

### Retry Policy

**Exponential Backoff with Jitter:**
```javascript
const retryConfig = {
  maxRetries: 5,
  baseDelay: 1000,      // 1 second
  maxDelay: 32000,      // 32 seconds
  jitterFactor: 0.1     // ±10% randomness
};

async function retryWithBackoff(fn, config = retryConfig) {
  let attempt = 0;

  while (attempt < config.maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;

      if (!isRetryableError(error) || attempt >= config.maxRetries) {
        throw error;
      }

      const delay = Math.min(
        config.baseDelay * Math.pow(2, attempt),
        config.maxDelay
      );

      const jitter = delay * config.jitterFactor * (Math.random() - 0.5);
      await sleep(delay + jitter);
    }
  }
}

function isRetryableError(error) {
  const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
  return (
    retryableStatusCodes.includes(error.response?.status) ||
    error.code === 'ETIMEDOUT' ||
    error.code === 'ECONNRESET'
  );
}
```

### Circuit Breaker Pattern

**Purpose:** Prevent cascading failures by stopping requests to failing services

**Implementation:**
```javascript
const circuitBreaker = {
  state: 'closed',        // closed, open, half_open
  failureCount: 0,
  failureThreshold: 5,
  resetTimeout: 60000,    // 1 minute
  lastFailureTime: null
};

async function callWithCircuitBreaker(fn) {
  if (circuitBreaker.state === 'open') {
    const timeSinceFailure = Date.now() - circuitBreaker.lastFailureTime;

    if (timeSinceFailure > circuitBreaker.resetTimeout) {
      circuitBreaker.state = 'half_open';
    } else {
      throw new Error('Circuit breaker is OPEN');
    }
  }

  try {
    const result = await fn();

    if (circuitBreaker.state === 'half_open') {
      circuitBreaker.state = 'closed';
      circuitBreaker.failureCount = 0;
    }

    return result;
  } catch (error) {
    circuitBreaker.failureCount++;
    circuitBreaker.lastFailureTime = Date.now();

    if (circuitBreaker.failureCount >= circuitBreaker.failureThreshold) {
      circuitBreaker.state = 'open';
    }

    throw error;
  }
}
```

### Dead Letter Queue (DLQ)

**Purpose:** Store failed messages for manual review and reprocessing

**Flow:**
```
Event → Consumer (attempt 1) → Failure → Retry
     → Consumer (attempt 2) → Failure → Retry
     → Consumer (attempt 3) → Failure → Retry
     → Consumer (attempt 4) → Failure → Retry
     → Consumer (attempt 5) → Failure → Dead Letter Queue
```

**DLQ Table Schema:**
```sql
CREATE TABLE dead_letter_queue (
    dlq_id UUID PRIMARY KEY,
    topic VARCHAR(100),
    partition INTEGER,
    offset BIGINT,
    event_payload JSONB,
    error_message TEXT,
    retry_count INTEGER,
    first_failed_at TIMESTAMP,
    last_failed_at TIMESTAMP,
    reprocessed BOOLEAN DEFAULT FALSE
);
```

**Reprocessing:**
```javascript
async function reprocessDLQ(dlq_id) {
  const message = await db.deadLetterQueue.findById(dlq_id);

  try {
    await handleEvent(message.event_payload);

    await db.deadLetterQueue.update({
      dlq_id,
      reprocessed: true
    });
  } catch (error) {
    // Still failing, leave in DLQ for investigation
    throw error;
  }
}
```

---

## Data Consistency Patterns

### Pattern 1: Saga Pattern (Distributed Transactions)

**Use Case:** Multi-service transactions (order payment + provisioning + hardware)

**Implementation:** Choreography-based saga with compensating transactions

**Example: Order Purchase Saga**
```
Step 1: Charge Payment
  Success → Step 2
  Failure → End (no compensation needed)

Step 2: Provision X-Series Account
  Success → Step 3
  Failure → Compensate: Refund Payment

Step 3: Create Hardware Order
  Success → End
  Failure → Compensate: Cancel X-Series, Refund Payment
```

**Code:**
```javascript
async function executePurchaseSaga(orderData) {
  const sagaState = {
    order_id: orderData.order_id,
    steps_completed: [],
    compensation_needed: []
  };

  try {
    // Step 1: Charge payment
    const payment = await billingClient.processPayment(orderData);
    sagaState.steps_completed.push('payment');
    sagaState.compensation_needed.push({
      step: 'payment',
      compensate: () => billingClient.refundPayment(payment.id)
    });

    // Step 2: Provision X-Series
    const xAccount = await xSeriesClient.createAccount(orderData);
    sagaState.steps_completed.push('x_series');
    sagaState.compensation_needed.push({
      step: 'x_series',
      compensate: () => xSeriesClient.deleteAccount(xAccount.id)
    });

    // Step 3: Order hardware
    const hwOrder = await hardwareClient.createOrder(orderData);
    sagaState.steps_completed.push('hardware');

    return { success: true, sagaState };

  } catch (error) {
    // Compensate in reverse order
    for (const step of sagaState.compensation_needed.reverse()) {
      try {
        await step.compensate();
      } catch (compError) {
        console.error(`Compensation failed for ${step.step}:`, compError);
        // Log to DLQ for manual intervention
      }
    }

    throw error;
  }
}
```

---

### Pattern 2: Outbox Pattern (Reliable Event Publishing)

**Purpose:** Ensure events are published atomically with database changes

**Flow:**
```
1. Begin Transaction
2. Update application table (e.g., merchants)
3. Insert event into outbox table
4. Commit Transaction
5. Background job publishes from outbox to Kafka
6. Delete from outbox after successful publish
```

**Schema:**
```sql
CREATE TABLE event_outbox (
    outbox_id UUID PRIMARY KEY,
    aggregate_type VARCHAR(50),
    aggregate_id UUID,
    event_type VARCHAR(100),
    event_payload JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP
);

CREATE INDEX idx_outbox_unpublished ON event_outbox(published, created_at)
    WHERE published = FALSE;
```

**Implementation:**
```javascript
async function approveKYB(merchant_id, approval_data) {
  await db.transaction(async (trx) => {
    // Update merchant
    await trx('merchants').where({ merchant_id }).update({
      kyb_status: 'approved',
      kyb_approved_at: new Date()
    });

    // Insert into outbox
    await trx('event_outbox').insert({
      outbox_id: uuidv4(),
      aggregate_type: 'merchant',
      aggregate_id: merchant_id,
      event_type: 'merchant.kyb_approved',
      event_payload: {
        merchant_id,
        kyb_status: 'approved',
        risk_score: approval_data.risk_score
      }
    });
  });

  // Transaction committed - event guaranteed to be in outbox
}

// Background job (runs every 1 second)
async function publishOutboxEvents() {
  const events = await db('event_outbox')
    .where({ published: false })
    .orderBy('created_at')
    .limit(100);

  for (const event of events) {
    try {
      await kafkaProducer.send({
        topic: getTopicForEventType(event.event_type),
        messages: [{
          key: event.aggregate_id,
          value: JSON.stringify(event.event_payload)
        }]
      });

      await db('event_outbox').where({ outbox_id: event.outbox_id }).update({
        published: true,
        published_at: new Date()
      });
    } catch (error) {
      console.error('Failed to publish event:', error);
      // Will retry on next run
    }
  }
}
```

---

## Integration Security

### API Authentication

**Pattern:** OAuth 2.0 Client Credentials for service-to-service

**Implementation:**
```javascript
// Obtain token
const tokenResponse = await axios.post(
  'https://auth.lightspeed.com/oauth/token',
  {
    grant_type: 'client_credentials',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: 'payments:write kyb:write'
  }
);

const accessToken = tokenResponse.data.access_token;

// Use token
const response = await axios.post(
  'https://payments.lightspeed.com/api/v1/kyb/applications',
  kybData,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }
);
```

**Token Caching:**
```javascript
const tokenCache = {
  token: null,
  expiresAt: null
};

async function getAccessToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const response = await fetchNewToken();
  tokenCache.token = response.access_token;
  tokenCache.expiresAt = Date.now() + (response.expires_in * 1000) - 60000; // 1 min buffer

  return tokenCache.token;
}
```

### Webhook Verification

**HMAC Signature Validation:**
```javascript
function verifyWebhookSignature(req) {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];
  const rawBody = req.rawBody;

  // Prevent replay attacks (reject if >5 minutes old)
  if (Date.now() - parseInt(timestamp) > 300000) {
    return false;
  }

  const payload = `${timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### Secrets Management

**Use:** AWS Secrets Manager or HashiCorp Vault

```javascript
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

async function getSecret(secretName) {
  const client = new SecretsManagerClient({ region: "us-east-1" });

  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretName })
  );

  return JSON.parse(response.SecretString);
}

// Usage
const paymentsApiKey = await getSecret('onboarding/payments/api-key');
```

---

## Monitoring & Observability

### Integration Metrics

**Key Metrics to Track:**

| Metric | Description | Alert Threshold |
|--------|-------------|----------------|
| Integration Success Rate | % of successful API calls | <95% |
| Integration Latency (p95) | Response time for external APIs | >5s |
| Event Processing Lag | Time from event publish to consumption | >30s |
| Retry Rate | % of requests requiring retries | >20% |
| Circuit Breaker Trips | Number of circuit breaker openings | >5/hour |
| Webhook Delivery Failures | Failed webhook deliveries | >10/hour |

### Distributed Tracing

**Trace Context Propagation:**
```javascript
// Generate trace context
const traceId = uuidv4();
const spanId = uuidv4();

// Propagate in HTTP headers
await axios.post(url, data, {
  headers: {
    'X-Trace-Id': traceId,
    'X-Span-Id': spanId,
    'X-Parent-Span-Id': parentSpanId
  }
});

// Propagate in Kafka messages
await kafkaProducer.send({
  topic: 'merchant-events',
  messages: [{
    key: merchant_id,
    value: JSON.stringify(eventData),
    headers: {
      'trace-id': traceId,
      'span-id': spanId
    }
  }]
});
```

**Jaeger Integration:**
```javascript
const { initTracer } = require('jaeger-client');

const tracer = initTracer({
  serviceName: 'onboarding-service',
  sampler: {
    type: 'probabilistic',
    param: 0.1  // Sample 10% of traces
  }
});

// Create span
const span = tracer.startSpan('payments.kyb.submit');
span.setTag('merchant_id', merchant_id);

try {
  const result = await submitKYB(merchant_id);
  span.setTag('kyb_status', result.status);
  return result;
} catch (error) {
  span.setTag('error', true);
  span.log({ event: 'error', message: error.message });
  throw error;
} finally {
  span.finish();
}
```

### Integration Dashboards

**Grafana Dashboard Panels:**
1. Integration Health Matrix (success rate per integration)
2. API Latency Heatmap (p50, p95, p99)
3. Event Processing Lag Graph
4. Error Rate by Integration
5. Circuit Breaker Status
6. Webhook Delivery Success Rate

---

## Next Steps

1. **API Contract Testing:**
   - Implement contract tests with Pact or Spring Cloud Contract
   - Validate API compatibility between services

2. **Integration Testing:**
   - Set up end-to-end integration test suite
   - Mock external services for local development

3. **Chaos Engineering:**
   - Implement fault injection for resilience testing
   - Test circuit breakers and retry logic under load

4. **Documentation:**
   - Publish OpenAPI specs for all REST APIs
   - Document AsyncAPI specs for event schemas

5. **Performance Optimization:**
   - Load test critical integration paths
   - Optimize event processing throughput

---

**Document Owner:** Integration Architecture Team
**Review Cycle:** Quarterly or on major integration changes
**Feedback:** integration-architecture@lightspeed.com
