# Data Models: Cohort-Based Merchant Onboarding

**Version:** 1.0
**Last Updated:** October 2025
**Status:** Database Schema Design Document
**Audience:** Backend Engineers, Data Engineers, DBAs

---

## Table of Contents

1. [Overview](#overview)
2. [Database Strategy](#database-strategy)
3. [Core Domain Models](#core-domain-models)
4. [Cohort & Routing Models](#cohort--routing-models)
5. [Progress Tracking Models](#progress-tracking-models)
6. [Order & Billing Models](#order--billing-models)
7. [Integration Models](#integration-models)
8. [Audit & Compliance Models](#audit--compliance-models)
9. [Indexes & Performance Optimization](#indexes--performance-optimization)
10. [Data Migration & Versioning](#data-migration--versioning)
11. [Entity Relationship Diagrams](#entity-relationship-diagrams)

---

## Overview

This document defines the complete database schema for the Cohort-Based Merchant Onboarding system. The schema supports:

- **10-step merchant journey** from lead capture to activation
- **3 distinct cohort paths** (Self-Serve, Assisted, Managed)
- **Multi-system integration** (Marketing → CRM → X-Series → Payments)
- **Compliance requirements** (KYB before hardware, payouts held until bank verification)
- **Comprehensive audit trails** for KYB/KYC decisions

**Schema Organization:**
- **Primary Database:** PostgreSQL 15+ (ACID transactions, JSON support)
- **Bounded Contexts:** Separate schemas per domain for logical isolation
- **Event Store:** Dedicated tables for event sourcing pattern
- **Analytics:** Denormalized views for reporting

---

## Database Strategy

### Database Per Service vs Shared Database

**Approach:** Hybrid - Shared PostgreSQL instance with logical schema separation per service

```
PostgreSQL Instance
├── onboarding_lead_schema      (Lead Profiling Service)
├── onboarding_order_schema     (Order Management Service)
├── onboarding_progress_schema  (Progress Tracking Service)
├── onboarding_routing_schema   (Routing Logic Service)
└── onboarding_events_schema    (Event Store - shared)
```

**Rationale:**
- Maintains service boundaries via schemas
- Enables cross-service queries for analytics (read-only user)
- Simplifies operational overhead (single DB to backup/monitor)
- Future migration to separate DBs is straightforward

### Data Consistency Patterns

**Strong Consistency (Within Service):**
- ACID transactions for operations within a service schema
- Example: Creating order + order_items in single transaction

**Eventual Consistency (Across Services):**
- Event-driven synchronization between services
- Idempotent event handlers to handle retries
- Example: Lead created → Event → CRM sync (async)

### Data Retention Policy

| Data Type | Retention | Archive Strategy |
|-----------|-----------|------------------|
| Active Merchants | Indefinite | Online (hot storage) |
| Completed Journeys | 2 years | Online, then archive to cold storage |
| Abandoned Leads | 1 year | Archive to cold storage |
| Events | 90 days | Stream to analytics DB (ClickHouse/BigQuery) |
| Audit Logs | 7 years | WORM storage for compliance |

---

## Core Domain Models

### Schema: `onboarding_lead_schema`

### Table: `leads`

Core entity representing a potential merchant from initial capture through qualification.

```sql
CREATE TABLE leads (
    -- Primary Key
    lead_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- External References
    external_lead_id VARCHAR(255),  -- ID from marketing system
    crm_lead_id VARCHAR(255),       -- Salesforce lead ID

    -- Basic Information
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password_hash VARCHAR(255),

    -- Business Information
    business_name VARCHAR(255),
    business_category VARCHAR(100),  -- Restaurant, Retail, Golf, etc.
    business_type VARCHAR(50),       -- LLC, Corporation, Sole Proprietor, etc.
    annual_revenue_estimate DECIMAL(15,2),
    number_of_locations INTEGER,

    -- Geographic Information
    country_code VARCHAR(2) DEFAULT 'US',
    region VARCHAR(100),
    language_code VARCHAR(5) DEFAULT 'en',
    timezone VARCHAR(50),

    -- Lead Source & Attribution
    source VARCHAR(50),              -- organic, paid, referral, partner
    campaign_id VARCHAR(255),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),

    -- Lifecycle State
    status VARCHAR(50) NOT NULL,     -- new, contacted, qualified, converted, lost
    stage VARCHAR(50),               -- qualify_leads, buying_experience, guided_setup

    -- Cohort Assignment (calculated)
    cohort VARCHAR(50),              -- self_serve, assisted, managed
    selling_plan VARCHAR(50),        -- self_serve, ae_assisted, ae_managed
    setup_plan VARCHAR(50),          -- self_serve, ic_free, ic_paid
    gtv_score DECIMAL(5,2),          -- 0-100 calculated GTV potential score
    complexity_score DECIMAL(5,2),   -- 0-100 calculated complexity score
    risk_score DECIMAL(5,2),         -- 0-100 calculated risk score

    -- Assignment
    assigned_ae_id UUID,             -- References internal users table
    assigned_ic_id UUID,             -- References internal users table
    ae_contacted_at TIMESTAMP,
    ic_contacted_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    qualified_at TIMESTAMP,          -- When KYB approved
    converted_at TIMESTAMP,          -- When purchased

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Constraints
    CONSTRAINT valid_status CHECK (status IN (
        'new', 'contacted', 'qualified', 'disqualified', 'converted', 'lost'
    )),
    CONSTRAINT valid_cohort CHECK (cohort IN (
        'self_serve', 'assisted', 'managed', NULL
    ))
);

-- Indexes
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_cohort ON leads(cohort) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_assigned_ae ON leads(assigned_ae_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_crm_id ON leads(crm_lead_id);

-- Updated timestamp trigger
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

### Table: `merchants`

Represents a lead that has converted to a paying customer.

```sql
CREATE TABLE merchants (
    -- Primary Key
    merchant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship
    lead_id UUID NOT NULL REFERENCES leads(lead_id),

    -- External System IDs
    x_series_account_id VARCHAR(255) UNIQUE,
    payments_account_id VARCHAR(255) UNIQUE,
    billing_customer_id VARCHAR(255),

    -- Business Legal Entity (from KYB - Step 3)
    legal_business_name VARCHAR(255) NOT NULL,
    business_structure VARCHAR(50),  -- LLC, Corporation, Partnership, Sole Proprietor
    ein VARCHAR(20),                 -- Encrypted
    registered_address_line1 VARCHAR(255),
    registered_address_line2 VARCHAR(255),
    registered_city VARCHAR(100),
    registered_state VARCHAR(50),
    registered_postal_code VARCHAR(20),
    registered_country VARCHAR(2) DEFAULT 'US',

    -- KYB Status
    kyb_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    kyb_submitted_at TIMESTAMP,
    kyb_approved_at TIMESTAMP,
    kyb_rejected_at TIMESTAMP,
    kyb_rejection_reason TEXT,
    kyb_review_required BOOLEAN DEFAULT FALSE,

    -- KYC Status (Overall)
    kyc_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    kyc_all_approved_at TIMESTAMP,

    -- Payments Activation
    payments_activated BOOLEAN DEFAULT FALSE,
    payments_activated_at TIMESTAMP,
    payouts_enabled BOOLEAN DEFAULT FALSE,
    payouts_enabled_at TIMESTAMP,

    -- Subscription Details (from Step 4)
    subscription_tier VARCHAR(50),
    number_of_location_licenses INTEGER,
    number_of_register_licenses INTEGER,

    -- Journey Tracking
    current_step INTEGER DEFAULT 1,  -- 1-10
    journey_status VARCHAR(50) NOT NULL DEFAULT 'in_progress',
    journey_started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    journey_completed_at TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE,
    activated_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT valid_kyb_status CHECK (kyb_status IN (
        'pending', 'submitted', 'approved', 'rejected', 'review_required'
    )),
    CONSTRAINT valid_kyc_status CHECK (kyc_status IN (
        'pending', 'submitted', 'approved', 'rejected', 'review_required'
    )),
    CONSTRAINT valid_journey_status CHECK (journey_status IN (
        'in_progress', 'completed', 'abandoned', 'blocked'
    )),
    CONSTRAINT kyb_before_purchase CHECK (
        kyb_status = 'approved' OR x_series_account_id IS NULL
    )
);

-- Indexes
CREATE INDEX idx_merchants_lead_id ON merchants(lead_id);
CREATE INDEX idx_merchants_x_series_id ON merchants(x_series_account_id);
CREATE INDEX idx_merchants_payments_id ON merchants(payments_account_id);
CREATE INDEX idx_merchants_journey_status ON merchants(journey_status);
CREATE INDEX idx_merchants_current_step ON merchants(current_step);
CREATE INDEX idx_merchants_kyb_status ON merchants(kyb_status);
CREATE UNIQUE INDEX idx_merchants_ein ON merchants(ein) WHERE ein IS NOT NULL;

-- Trigger
CREATE TRIGGER update_merchants_updated_at
    BEFORE UPDATE ON merchants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

### Table: `merchant_locations`

Represents physical business locations for a merchant.

```sql
CREATE TABLE merchant_locations (
    -- Primary Key
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id) ON DELETE CASCADE,

    -- External References
    x_series_location_id VARCHAR(255),
    payments_location_id VARCHAR(255),

    -- Location Details
    location_name VARCHAR(255),      -- DBA (Doing Business As)
    location_number INTEGER,         -- 1, 2, 3... for multi-location
    is_primary BOOLEAN DEFAULT FALSE,

    -- Address
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(2) DEFAULT 'US',

    -- Contact
    phone VARCHAR(50),
    email VARCHAR(255),

    -- Activation
    is_active BOOLEAN DEFAULT FALSE,
    activated_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_locations_merchant_id ON merchant_locations(merchant_id);
CREATE UNIQUE INDEX idx_locations_primary ON merchant_locations(merchant_id)
    WHERE is_primary = TRUE;
CREATE INDEX idx_locations_x_series_id ON merchant_locations(x_series_location_id);
```

---

### Table: `merchant_persons`

Represents business representatives and owners for KYC (Step 7).

```sql
CREATE TABLE merchant_persons (
    -- Primary Key
    person_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id) ON DELETE CASCADE,

    -- External References
    payments_person_id VARCHAR(255),

    -- Person Type
    person_type VARCHAR(50) NOT NULL, -- representative, owner, both

    -- Personal Information (Encrypted)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    ssn VARCHAR(255),                -- Encrypted SSN
    date_of_birth DATE,              -- Encrypted

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'US',

    -- Business Role
    title VARCHAR(100),
    ownership_percentage DECIMAL(5,2),  -- 0.00 to 100.00

    -- KYC Status
    kyc_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    kyc_submitted_at TIMESTAMP,
    kyc_approved_at TIMESTAMP,
    kyc_rejected_at TIMESTAMP,
    kyc_rejection_reason TEXT,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT valid_person_type CHECK (person_type IN (
        'representative', 'owner', 'both'
    )),
    CONSTRAINT valid_ownership_pct CHECK (
        ownership_percentage >= 0 AND ownership_percentage <= 100
    ),
    CONSTRAINT valid_kyc_status CHECK (kyc_status IN (
        'pending', 'submitted', 'approved', 'rejected', 'review_required'
    ))
);

-- Indexes
CREATE INDEX idx_persons_merchant_id ON merchant_persons(merchant_id);
CREATE INDEX idx_persons_type ON merchant_persons(person_type);
CREATE INDEX idx_persons_kyc_status ON merchant_persons(kyc_status);
```

---

### Table: `merchant_bank_accounts`

Payout bank account details (Step 9 - enables payouts).

```sql
CREATE TABLE merchant_bank_accounts (
    -- Primary Key
    bank_account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id) ON DELETE CASCADE,

    -- External References
    payments_bank_id VARCHAR(255),

    -- Bank Account Details (Encrypted)
    account_holder_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50),        -- checking, savings
    account_number VARCHAR(255) NOT NULL,  -- Encrypted
    routing_number VARCHAR(255) NOT NULL,  -- Encrypted
    bank_name VARCHAR(255),

    -- Verification
    verification_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    verification_method VARCHAR(50), -- plaid, micro_deposits, instant
    verified_at TIMESTAMP,
    verification_failed_at TIMESTAMP,
    verification_failure_reason TEXT,

    -- Status
    is_primary BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT valid_verification_status CHECK (verification_status IN (
        'pending', 'in_progress', 'verified', 'failed'
    ))
);

-- Indexes
CREATE INDEX idx_bank_accounts_merchant_id ON merchant_bank_accounts(merchant_id);
CREATE UNIQUE INDEX idx_bank_accounts_primary ON merchant_bank_accounts(merchant_id)
    WHERE is_primary = TRUE;
```

---

## Cohort & Routing Models

### Schema: `onboarding_routing_schema`

### Table: `cohort_rules`

Defines rules for assigning cohorts based on merchant attributes.

```sql
CREATE TABLE cohort_rules (
    rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Rule Definition
    rule_name VARCHAR(255) NOT NULL,
    rule_description TEXT,
    priority INTEGER NOT NULL,       -- Lower number = higher priority

    -- Conditions (JSONB for flexibility)
    conditions JSONB NOT NULL,
    /*
    Example:
    {
        "gtv_min": 2000000,
        "gtv_max": null,
        "locations_min": 10,
        "verticals": ["restaurant", "retail"],
        "countries": ["US", "CA"]
    }
    */

    -- Assignment
    cohort VARCHAR(50) NOT NULL,
    selling_plan VARCHAR(50) NOT NULL,
    setup_plan VARCHAR(50) NOT NULL,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    effective_from TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    effective_to TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_cohort CHECK (cohort IN (
        'self_serve', 'assisted', 'managed'
    ))
);

-- Index
CREATE INDEX idx_cohort_rules_priority ON cohort_rules(priority)
    WHERE is_active = TRUE;
```

---

### Table: `routing_queues`

Manages AE/IC assignment queues.

```sql
CREATE TABLE routing_queues (
    queue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Queue Definition
    queue_name VARCHAR(100) NOT NULL,  -- ae_high_priority, ic_onboarding, etc.
    queue_type VARCHAR(50) NOT NULL,   -- ae, ic

    -- Queue Configuration
    sla_minutes INTEGER,               -- Target response time
    max_queue_size INTEGER,
    auto_assign BOOLEAN DEFAULT TRUE,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

### Table: `queue_assignments`

Tracks lead/merchant assignment to queues and agents.

```sql
CREATE TABLE queue_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- References
    lead_id UUID REFERENCES leads(lead_id),
    merchant_id UUID REFERENCES merchants(merchant_id),
    queue_id UUID NOT NULL REFERENCES routing_queues(queue_id),

    -- Assignment
    assigned_to_user_id UUID,        -- AE or IC user ID
    assigned_at TIMESTAMP,
    auto_assigned BOOLEAN DEFAULT FALSE,

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'queued',
    priority INTEGER DEFAULT 0,      -- Higher = more urgent

    -- SLA Tracking
    queued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    first_contact_at TIMESTAMP,
    resolved_at TIMESTAMP,
    sla_breached BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_status CHECK (status IN (
        'queued', 'assigned', 'contacted', 'in_progress', 'resolved', 'escalated'
    ))
);

-- Indexes
CREATE INDEX idx_queue_assignments_queue_id ON queue_assignments(queue_id);
CREATE INDEX idx_queue_assignments_assigned_to ON queue_assignments(assigned_to_user_id);
CREATE INDEX idx_queue_assignments_status ON queue_assignments(status);
CREATE INDEX idx_queue_assignments_queued_at ON queue_assignments(queued_at);
```

---

## Progress Tracking Models

### Schema: `onboarding_progress_schema`

### Table: `journey_steps`

Master table defining the 10 onboarding steps.

```sql
CREATE TABLE journey_steps (
    step_id INTEGER PRIMARY KEY,     -- 1-10

    -- Step Definition
    step_name VARCHAR(100) NOT NULL,
    step_description TEXT,
    stage VARCHAR(50) NOT NULL,      -- qualify_leads, buying_experience, guided_setup

    -- Display
    display_order INTEGER NOT NULL,
    icon VARCHAR(50),

    -- Configuration
    is_required BOOLEAN DEFAULT TRUE,
    estimated_duration_minutes INTEGER,

    -- Dependencies
    depends_on_steps INTEGER[],      -- Array of step_ids that must complete first

    CONSTRAINT valid_stage CHECK (stage IN (
        'qualify_leads', 'buying_experience', 'guided_setup'
    ))
);

-- Seed data
INSERT INTO journey_steps (step_id, step_name, stage, display_order, is_required, depends_on_steps) VALUES
(1, 'Browse and Buy Decision', 'qualify_leads', 1, true, '{}'),
(2, 'Account Creation', 'qualify_leads', 2, true, '{1}'),
(3, 'Qualify for LS Payments (KYB)', 'qualify_leads', 3, true, '{2}'),
(4, 'Define Software Requirements', 'buying_experience', 4, true, '{3}'),
(5, 'Define Hardware Requirements', 'buying_experience', 5, true, '{4}'),
(6, 'Payment for Software & Hardware', 'buying_experience', 6, true, '{5}'),
(7, 'Lightspeed Payments Activation (KYC)', 'guided_setup', 7, true, '{6}'),
(8, 'Data Import', 'guided_setup', 8, false, '{7}'),
(9, 'Setup Hardware', 'guided_setup', 9, true, '{7}'),
(10, 'Final Config & Integrations', 'guided_setup', 10, false, '{9}');
```

---

### Table: `merchant_step_progress`

Tracks individual merchant progress through each step.

```sql
CREATE TABLE merchant_step_progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id) ON DELETE CASCADE,
    step_id INTEGER NOT NULL REFERENCES journey_steps(step_id),

    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending',

    -- Timestamps
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    blocked_at TIMESTAMP,
    abandoned_at TIMESTAMP,

    -- Duration Tracking
    time_spent_seconds INTEGER DEFAULT 0,

    -- Data Collected (flexible JSON storage)
    step_data JSONB,
    /*
    Example for Step 3 (KYB):
    {
        "business_structure": "LLC",
        "legal_business_name": "Acme Corp",
        "ein": "12-3456789",
        "registered_address": {...}
    }
    */

    -- Error Tracking
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    last_error_at TIMESTAMP,

    -- Intervention
    intervention_required BOOLEAN DEFAULT FALSE,
    intervention_reason TEXT,
    intervention_triggered_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_status CHECK (status IN (
        'pending', 'in_progress', 'completed', 'blocked', 'skipped', 'failed'
    )),

    -- Unique constraint: one progress record per merchant per step
    UNIQUE(merchant_id, step_id)
);

-- Indexes
CREATE INDEX idx_step_progress_merchant_id ON merchant_step_progress(merchant_id);
CREATE INDEX idx_step_progress_status ON merchant_step_progress(status);
CREATE INDEX idx_step_progress_step_id ON merchant_step_progress(step_id);
CREATE INDEX idx_step_progress_intervention ON merchant_step_progress(intervention_required)
    WHERE intervention_required = TRUE;
```

---

### Table: `stall_alerts`

Tracks detected stalls and intervention triggers.

```sql
CREATE TABLE stall_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    step_id INTEGER REFERENCES journey_steps(step_id),

    -- Alert Details
    alert_type VARCHAR(50) NOT NULL,  -- stalled, abandoned, error_threshold
    severity VARCHAR(50) NOT NULL,    -- low, medium, high, critical

    -- Timing
    stall_detected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    days_stalled INTEGER,

    -- Context
    current_status VARCHAR(50),
    last_activity_at TIMESTAMP,
    error_count INTEGER,

    -- Resolution
    alert_status VARCHAR(50) NOT NULL DEFAULT 'open',
    assigned_to_user_id UUID,
    assigned_at TIMESTAMP,
    resolved_at TIMESTAMP,
    resolution_action TEXT,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_alert_type CHECK (alert_type IN (
        'stalled', 'abandoned', 'error_threshold', 'sla_breach'
    )),
    CONSTRAINT valid_alert_status CHECK (alert_status IN (
        'open', 'assigned', 'in_progress', 'resolved', 'dismissed'
    ))
);

-- Indexes
CREATE INDEX idx_stall_alerts_merchant_id ON stall_alerts(merchant_id);
CREATE INDEX idx_stall_alerts_status ON stall_alerts(alert_status);
CREATE INDEX idx_stall_alerts_severity ON stall_alerts(severity, alert_status);
```

---

## Order & Billing Models

### Schema: `onboarding_order_schema`

### Table: `orders`

Represents a purchase order (Step 6).

```sql
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    lead_id UUID REFERENCES leads(lead_id),

    -- External References
    billing_invoice_id VARCHAR(255),

    -- Order Details
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_type VARCHAR(50) NOT NULL,  -- initial, upgrade, renewal

    -- Pricing
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    -- Payment
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),       -- credit_card, ach, wire_transfer
    paid_at TIMESTAMP,
    payment_reference VARCHAR(255),

    -- Fulfillment
    fulfillment_status VARCHAR(50) NOT NULL DEFAULT 'pending',

    -- Sales Context
    created_by_user_id UUID,         -- AE who created (if applicable)
    is_self_serve BOOLEAN DEFAULT TRUE,

    -- Billing
    billing_address_line1 VARCHAR(255),
    billing_address_line2 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(50),
    billing_postal_code VARCHAR(20),
    billing_country VARCHAR(2),

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_payment_status CHECK (payment_status IN (
        'pending', 'authorized', 'captured', 'failed', 'refunded', 'cancelled'
    )),
    CONSTRAINT valid_fulfillment_status CHECK (fulfillment_status IN (
        'pending', 'processing', 'partially_fulfilled', 'fulfilled', 'cancelled'
    ))
);

-- Indexes
CREATE INDEX idx_orders_merchant_id ON orders(merchant_id);
CREATE UNIQUE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

---

### Table: `order_items`

Line items for each order.

```sql
CREATE TABLE order_items (
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,

    -- Item Details
    item_type VARCHAR(50) NOT NULL,  -- software_license, hardware, service, add_on
    product_sku VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Quantity & Pricing
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    line_total DECIMAL(15,2) NOT NULL,

    -- Fulfillment
    fulfillment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    fulfilled_at TIMESTAMP,

    -- External References
    x_series_license_id VARCHAR(255),
    hardware_order_item_id VARCHAR(255),

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_item_type CHECK (item_type IN (
        'software_license', 'hardware', 'service', 'add_on'
    ))
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_type ON order_items(item_type);
```

---

### Table: `hardware_shipments`

Tracks hardware shipment (Step 5 fulfillment).

```sql
CREATE TABLE hardware_shipments (
    shipment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationship
    order_id UUID NOT NULL REFERENCES orders(order_id),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),

    -- External References
    shipping_provider_id VARCHAR(255),
    tracking_number VARCHAR(255),

    -- Shipping Address
    ship_to_name VARCHAR(255) NOT NULL,
    ship_to_address_line1 VARCHAR(255) NOT NULL,
    ship_to_address_line2 VARCHAR(255),
    ship_to_city VARCHAR(100) NOT NULL,
    ship_to_state VARCHAR(50) NOT NULL,
    ship_to_postal_code VARCHAR(20) NOT NULL,
    ship_to_country VARCHAR(2) NOT NULL,
    ship_to_phone VARCHAR(50),

    -- Shipment Details
    shipping_carrier VARCHAR(100),
    shipping_method VARCHAR(100),     -- standard, expedited, overnight
    estimated_delivery_date DATE,
    actual_delivery_date DATE,

    -- Status
    shipment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_shipment_status CHECK (shipment_status IN (
        'pending', 'processing', 'shipped', 'in_transit', 'delivered',
        'failed_delivery', 'returned', 'cancelled'
    ))
);

-- Indexes
CREATE INDEX idx_shipments_order_id ON hardware_shipments(order_id);
CREATE INDEX idx_shipments_merchant_id ON hardware_shipments(merchant_id);
CREATE INDEX idx_shipments_tracking ON hardware_shipments(tracking_number);
CREATE INDEX idx_shipments_status ON hardware_shipments(shipment_status);
```

---

## Integration Models

### Schema: `onboarding_events_schema`

### Table: `integration_events`

Event log for all system integrations (event sourcing pattern).

```sql
CREATE TABLE integration_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Event Metadata
    event_type VARCHAR(100) NOT NULL,
    event_version VARCHAR(10) NOT NULL DEFAULT '1.0',
    aggregate_type VARCHAR(50) NOT NULL,  -- lead, merchant, order
    aggregate_id UUID NOT NULL,

    -- Payload
    event_payload JSONB NOT NULL,

    -- Correlation
    correlation_id UUID,              -- Links related events
    causation_id UUID,                -- Event that caused this event

    -- Publishing
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    publish_attempts INTEGER DEFAULT 0,
    last_publish_error TEXT,

    -- Timestamps
    occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Partitioning hint
    partition_key VARCHAR(50)
);

-- Indexes
CREATE INDEX idx_events_aggregate ON integration_events(aggregate_type, aggregate_id);
CREATE INDEX idx_events_type ON integration_events(event_type);
CREATE INDEX idx_events_occurred_at ON integration_events(occurred_at DESC);
CREATE INDEX idx_events_unpublished ON integration_events(published)
    WHERE published = FALSE;
CREATE INDEX idx_events_correlation ON integration_events(correlation_id);

-- Partitioning by month (for scalability)
-- CREATE TABLE integration_events_2025_10 PARTITION OF integration_events
--     FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
```

---

### Table: `external_system_sync`

Tracks synchronization status with external systems.

```sql
CREATE TABLE external_system_sync (
    sync_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Entity
    entity_type VARCHAR(50) NOT NULL,    -- lead, merchant, order
    entity_id UUID NOT NULL,

    -- External System
    external_system VARCHAR(50) NOT NULL, -- crm, x_series, payments, hardware, billing
    external_entity_id VARCHAR(255),

    -- Sync Status
    sync_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    last_sync_at TIMESTAMP,
    next_retry_at TIMESTAMP,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,

    -- Error Tracking
    last_error TEXT,
    last_error_at TIMESTAMP,

    -- Sync Direction
    direction VARCHAR(50) NOT NULL,      -- to_external, from_external, bidirectional

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_sync_status CHECK (sync_status IN (
        'pending', 'in_progress', 'synced', 'failed', 'conflict'
    )),

    -- Unique constraint
    UNIQUE(entity_type, entity_id, external_system)
);

-- Indexes
CREATE INDEX idx_sync_entity ON external_system_sync(entity_type, entity_id);
CREATE INDEX idx_sync_system ON external_system_sync(external_system);
CREATE INDEX idx_sync_status ON external_system_sync(sync_status);
CREATE INDEX idx_sync_retry ON external_system_sync(next_retry_at)
    WHERE sync_status = 'failed' AND retry_count < max_retries;
```

---

## Audit & Compliance Models

### Schema: `onboarding_audit_schema`

### Table: `kyb_kyc_audit_log`

Comprehensive audit trail for all KYB/KYC decisions.

```sql
CREATE TABLE kyb_kyc_audit_log (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Subject
    merchant_id UUID REFERENCES merchants(merchant_id),
    person_id UUID REFERENCES merchant_persons(person_id),

    -- Check Type
    check_type VARCHAR(50) NOT NULL,  -- kyb, kyc

    -- Check Details
    check_provider VARCHAR(100),      -- stripe, plaid, lexisnexis
    check_reference VARCHAR(255),     -- External provider reference

    -- Request
    request_payload JSONB,

    -- Response
    response_payload JSONB,
    decision VARCHAR(50) NOT NULL,    -- approved, rejected, review_required
    risk_score DECIMAL(5,2),
    decision_reason TEXT,

    -- Human Review
    reviewed_by_user_id UUID,
    reviewed_at TIMESTAMP,
    reviewer_notes TEXT,
    manual_override BOOLEAN DEFAULT FALSE,

    -- Timing
    submitted_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP NOT NULL,

    -- Compliance
    retention_until DATE,             -- Required retention for compliance

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_check_type CHECK (check_type IN ('kyb', 'kyc')),
    CONSTRAINT valid_decision CHECK (decision IN (
        'approved', 'rejected', 'review_required', 'pending'
    ))
);

-- Indexes
CREATE INDEX idx_kyb_kyc_merchant ON kyb_kyc_audit_log(merchant_id);
CREATE INDEX idx_kyb_kyc_person ON kyb_kyc_audit_log(person_id);
CREATE INDEX idx_kyb_kyc_type ON kyb_kyc_audit_log(check_type);
CREATE INDEX idx_kyb_kyc_decision ON kyb_kyc_audit_log(decision);
CREATE INDEX idx_kyb_kyc_submitted ON kyb_kyc_audit_log(submitted_at DESC);
```

---

### Table: `data_access_audit_log`

Logs all access to sensitive PII/PCI data.

```sql
CREATE TABLE data_access_audit_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Actor
    user_id UUID NOT NULL,
    user_email VARCHAR(255),
    user_role VARCHAR(50),

    -- Action
    action VARCHAR(50) NOT NULL,      -- read, update, delete, export
    entity_type VARCHAR(50) NOT NULL, -- merchant, person, bank_account
    entity_id UUID NOT NULL,

    -- Context
    ip_address INET,
    user_agent TEXT,
    api_endpoint VARCHAR(255),
    request_id UUID,

    -- Data Accessed
    fields_accessed TEXT[],           -- Array of field names

    -- Justification
    access_reason TEXT,               -- Why was this accessed?
    ticket_reference VARCHAR(100),    -- Support ticket, etc.

    -- Timestamp
    accessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_action CHECK (action IN (
        'read', 'create', 'update', 'delete', 'export', 'decrypt'
    ))
);

-- Indexes
CREATE INDEX idx_data_access_user ON data_access_audit_log(user_id);
CREATE INDEX idx_data_access_entity ON data_access_audit_log(entity_type, entity_id);
CREATE INDEX idx_data_access_time ON data_access_audit_log(accessed_at DESC);
```

---

## Indexes & Performance Optimization

### Composite Indexes for Common Queries

```sql
-- Dashboard: Active merchants by cohort and current step
CREATE INDEX idx_merchants_active_cohort_step
    ON merchants(journey_status, cohort, current_step)
    WHERE journey_status = 'in_progress';

-- Analytics: Conversion funnel by date range
CREATE INDEX idx_step_progress_completed_date
    ON merchant_step_progress(step_id, completed_at)
    WHERE status = 'completed';

-- Queue management: Queued items by priority and SLA
CREATE INDEX idx_queue_priority_sla
    ON queue_assignments(queue_id, priority DESC, queued_at)
    WHERE status IN ('queued', 'assigned');

-- Stall detection: Merchants in progress by last activity
CREATE INDEX idx_merchants_last_activity
    ON merchants(journey_status, updated_at)
    WHERE journey_status = 'in_progress';
```

### Partial Indexes for Status Queries

```sql
-- Only index non-deleted leads
CREATE INDEX idx_leads_active ON leads(status, cohort)
    WHERE deleted_at IS NULL;

-- Only index incomplete steps
CREATE INDEX idx_incomplete_steps ON merchant_step_progress(merchant_id, step_id)
    WHERE status NOT IN ('completed', 'skipped');
```

### JSONB Indexes for Flexible Queries

```sql
-- Index specific JSONB fields for fast lookups
CREATE INDEX idx_step_data_kyb_status
    ON merchant_step_progress((step_data->>'kyb_status'))
    WHERE step_id = 3;

-- GIN index for full JSONB search
CREATE INDEX idx_event_payload_gin
    ON integration_events USING GIN (event_payload);
```

---

## Data Migration & Versioning

### Schema Versioning Strategy

**Tool:** Flyway or Liquibase for schema migrations

**Migration File Naming:**
```
V{version}__{description}.sql

Examples:
V001__create_leads_table.sql
V002__create_merchants_table.sql
V003__add_cohort_fields_to_leads.sql
```

### Backward Compatibility

**Adding Columns:**
- Always add as nullable or with default values
- Update application code before removing old columns

**Changing Columns:**
- Use expand-contract pattern:
  1. Add new column
  2. Dual-write to both columns
  3. Backfill old data
  4. Switch reads to new column
  5. Remove old column

**Example Migration:**
```sql
-- V010__add_gtv_score_to_leads.sql
ALTER TABLE leads ADD COLUMN gtv_score DECIMAL(5,2);

-- Backfill with default value
UPDATE leads SET gtv_score = 50.0 WHERE gtv_score IS NULL;

-- Make NOT NULL after backfill
ALTER TABLE leads ALTER COLUMN gtv_score SET NOT NULL;
```

---

## Entity Relationship Diagrams

### Core Domain Relationships

```
┌─────────────┐         ┌──────────────┐         ┌──────────────────┐
│    leads    │ 1     1 │  merchants   │ 1     * │merchant_locations│
│             │────────▶│              │────────▶│                  │
│  lead_id    │         │  merchant_id │         │   location_id    │
└─────────────┘         └──────────────┘         └──────────────────┘
                               │ 1
                               │
                               │ *
                        ┌──────▼────────┐
                        │merchant_persons│
                        │                │
                        │   person_id    │
                        └────────────────┘
                               │ 1
                               │
                               │ *
                     ┌─────────▼──────────────┐
                     │merchant_bank_accounts  │
                     │                        │
                     │   bank_account_id      │
                     └────────────────────────┘
```

### Progress Tracking Relationships

```
┌──────────────┐         ┌────────────────────────┐
│  merchants   │ 1     * │merchant_step_progress  │
│              │────────▶│                        │
│  merchant_id │         │      progress_id       │
└──────────────┘         └────────────────────────┘
                                   │ *
                                   │
                                   │ 1
                         ┌─────────▼────────┐
                         │ journey_steps    │
                         │                  │
                         │    step_id       │
                         └──────────────────┘
```

### Order Management Relationships

```
┌──────────────┐         ┌─────────────┐         ┌──────────────┐
│  merchants   │ 1     * │   orders    │ 1     * │ order_items  │
│              │────────▶│             │────────▶│              │
│  merchant_id │         │  order_id   │         │order_item_id │
└──────────────┘         └─────────────┘         └──────────────┘
                                │ 1
                                │
                                │ *
                      ┌─────────▼──────────────┐
                      │ hardware_shipments     │
                      │                        │
                      │     shipment_id        │
                      └────────────────────────┘
```

---

## Next Steps

1. **Database Provisioning:**
   - Set up PostgreSQL 15+ with required extensions (uuid-ossp, pgcrypto)
   - Configure connection pooling with PgBouncer
   - Set up read replicas for analytics queries

2. **Security Implementation:**
   - Implement column-level encryption for PII/PCI fields
   - Set up row-level security policies for multi-tenancy
   - Configure audit logging triggers

3. **Data Seeding:**
   - Load reference data (journey_steps, cohort_rules)
   - Create test data sets for development/staging
   - Import historical leads/merchants (if applicable)

4. **Performance Tuning:**
   - Analyze query patterns and add additional indexes
   - Set up query performance monitoring
   - Configure auto-vacuum and table statistics

5. **Migration Planning:**
   - Document data import process from legacy systems
   - Plan for zero-downtime schema changes
   - Set up rollback procedures

---

**Document Owner:** Data Architecture Team
**Review Cycle:** Quarterly or on major schema changes
**Feedback:** data-architecture@lightspeed.com
