# Event Flows: Cohort-Based Merchant Onboarding

**Version:** 1.0
**Last Updated:** October 2025
**Status:** Event Flow Design Document
**Audience:** Backend Engineers, QA Engineers, Product Managers

---

## Table of Contents

1. [Overview](#overview)
2. [Event Flow Conventions](#event-flow-conventions)
3. [Critical Path Event Flows](#critical-path-event-flows)
4. [State Machine Definitions](#state-machine-definitions)
5. [Cohort-Specific Flows](#cohort-specific-flows)
6. [Error & Edge Case Flows](#error--edge-case-flows)
7. [Intervention & Escalation Flows](#intervention--escalation-flows)
8. [Compliance & Audit Flows](#compliance--audit-flows)
9. [Event Sequence Diagrams](#event-sequence-diagrams)
10. [Testing Scenarios](#testing-scenarios)

---

## Overview

This document defines the complete event flows for the Cohort-Based Merchant Onboarding system, covering:

- **10-step journey flows** from lead creation to merchant activation
- **State transitions** for leads, merchants, steps, and orders
- **Cohort-specific paths** (Self-Serve, Assisted, Managed)
- **Critical compliance flows** (KYB before hardware, payouts after bank verification)
- **Intervention triggers** (stall detection, error escalation)

**Key Principles:**
- **Event-driven orchestration:** All significant state changes emit events
- **Idempotent handlers:** Events can be safely replayed
- **Ordered processing:** Events partitioned by merchant_id for consistency
- **Audit trail:** All events persisted for compliance and debugging

---

## Event Flow Conventions

### Event Naming Convention

**Pattern:** `{aggregate}.{action}[.{status}]`

**Examples:**
- `lead.created` - Lead entity created
- `merchant.kyb_approved` - KYB approval completed
- `step.completed` - Journey step finished
- `order.payment.failed` - Payment failed for order

### Event Structure

**Standard Event Envelope:**
```json
{
  "event_id": "evt_uuid",
  "event_type": "merchant.kyb_approved",
  "event_version": "1.0",
  "timestamp": "2025-10-09T15:45:00Z",
  "source": "onboarding-orchestrator",
  "correlation_id": "corr_uuid",
  "causation_id": "evt_previous_uuid",
  "aggregate_type": "merchant",
  "aggregate_id": "merchant_uuid",
  "data": { /* event-specific payload */ },
  "metadata": { /* actor, IP, etc. */ }
}
```

### State Transition Notation

```
[Current State] --[Event]--> [New State]
```

**Example:**
```
[Lead: new] --[lead.profiled]--> [Lead: qualified]
[Merchant: kyb_pending] --[kyb.approved]--> [Merchant: kyb_approved]
```

---

## Critical Path Event Flows

### Flow 1: Lead Creation → Cohort Assignment → Routing

**Business Rule:** All leads must be profiled and assigned a cohort before proceeding

**Event Sequence:**

```
┌─────────────────────────────────────────────────────────────────┐
│ FLOW: Lead Capture to Routing Assignment                       │
└─────────────────────────────────────────────────────────────────┘

[1] Marketing Website
     │
     │ User fills form, clicks "Get Started"
     │
     ▼
[2] POST /api/v1/webhooks/marketing/lead-capture
     │
     │ Validates payload, enriches data
     │
     ▼
[3] CREATE lead record in database
     │
     │ lead.status = 'new'
     │ lead.stage = 'qualify_leads'
     │
     ▼
[4] EMIT: lead.created
     │
     ├─────────────────┬─────────────────┬─────────────────┐
     │                 │                 │                 │
     ▼                 ▼                 ▼                 ▼
[5a] CRM Sync     [5b] Analytics   [5c] Lead        [5d] Dashboard
     (to SF)           Ingest          Profiling         Notification
                                       Engine
                                          │
                                          │ Calculate scores
                                          │ Apply cohort rules
                                          │
                                          ▼
                                    [6] UPDATE lead
                                          cohort = 'assisted'
                                          selling_plan = 'ae_assisted'
                                          gtv_score = 72.5
                                          │
                                          ▼
                                    [7] EMIT: lead.profiled
                                          │
                                          ├─────────────┬─────────────┐
                                          │             │             │
                                          ▼             ▼             ▼
                                    [8a] Routing  [8b] CRM     [8c] Dashboard
                                         Service       Update       Update
                                          │
                                          │ Evaluate routing rules
                                          │
                                          ▼
                            ┌─────────────────────────────┐
                            │ IF gtv_score > 70           │
                            │   THEN route to AE queue    │
                            │ ELSE self-serve flow        │
                            └─────────────────────────────┘
                                          │
                                          ▼
                                    [9] CREATE queue_assignment
                                          queue_id = 'ae_high_priority'
                                          status = 'queued'
                                          │
                                          ▼
                                    [10] EMIT: lead.routed_to_ae
                                          │
                                          ├─────────────┬─────────────┐
                                          │             │             │
                                          ▼             ▼             ▼
                                    [11a] AE        [11b] CRM    [11c] Notification
                                          Dashboard      Update       to AE
                                          (shows new     (assign      (email/SMS)
                                          lead in        to queue)
                                          queue)
```

**Event Details:**

**Event 4: lead.created**
```json
{
  "event_type": "lead.created",
  "data": {
    "lead_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "merchant@example.com",
    "business_category": "restaurant",
    "annual_revenue_estimate": 750000,
    "source": "website",
    "campaign_id": "fall_promo_2025"
  }
}
```

**Event 7: lead.profiled**
```json
{
  "event_type": "lead.profiled",
  "data": {
    "lead_id": "550e8400-e29b-41d4-a716-446655440000",
    "cohort": "assisted",
    "selling_plan": "ae_assisted",
    "setup_plan": "ic_free",
    "gtv_score": 72.5,
    "complexity_score": 45.0,
    "risk_score": 22.0
  }
}
```

**Event 10: lead.routed_to_ae**
```json
{
  "event_type": "lead.routed_to_ae",
  "data": {
    "lead_id": "550e8400-e29b-41d4-a716-446655440000",
    "queue_id": "ae_high_priority",
    "assignment_id": "assign_uuid",
    "priority": 10,
    "sla_minutes": 15
  }
}
```

**State Transitions:**
```
lead.status:  [new] --[lead.created]--> [new]
              [new] --[lead.profiled]--> [contacted]
              [contacted] --[lead.routed_to_ae]--> [contacted]

queue_assignment.status: [N/A] --[lead.routed_to_ae]--> [queued]
```

---

### Flow 2: KYB Approval → Hardware Purchase Enablement

**Business Rule:** KYB MUST complete BEFORE hardware purchase (Step 3 before Step 5)

**Event Sequence:**

```
┌─────────────────────────────────────────────────────────────────┐
│ FLOW: KYB Approval Unlocks Purchase                            │
└─────────────────────────────────────────────────────────────────┘

[1] Merchant Dashboard (Step 3)
     │
     │ Merchant submits KYB form
     │
     ▼
[2] POST /api/v1/merchants/{id}/kyb
     │
     │ Validate business data
     │
     ▼
[3] CREATE merchant record
     │
     │ kyb_status = 'pending'
     │
     ▼
[4] EMIT: merchant.kyb_submitted
     │
     ▼
[5] Onboarding Orchestrator
     │
     │ Prepare KYB request
     │
     ▼
[6] POST /api/v1/kyb/applications (Payments Service)
     │
     │ External KYB checks (async)
     │
     ▼
[7] RETURN: { application_id, status: 'pending' }
     │
     │ (Time passes - 30 seconds to 5 minutes)
     │
     ▼
[8] Payments Service completes KYB
     │
     │ Webhook callback
     │
     ▼
[9] POST /api/v1/webhooks/payments/kyb (Onboarding receives)
     │
     │ Verify webhook signature
     │
     ▼
[10] UPDATE merchant
      kyb_status = 'approved'
      kyb_approved_at = NOW()
      payments_account_id = 'pay_biz_123'
      │
      ▼
[11] EMIT: merchant.kyb_approved
      │
      ├─────────────────┬─────────────────┬─────────────────┐
      │                 │                 │                 │
      ▼                 ▼                 ▼                 ▼
[12a] Progress     [12b] CRM        [12c] Dashboard  [12d] Audit
      Tracker           Sync             Update           Log
      │
      │ Update step 3 status
      │
      ▼
[13] UPDATE merchant_step_progress
      step_id = 3
      status = 'completed'
      completed_at = NOW()
      │
      ▼
[14] EMIT: step.completed
      │
      ▼
[15] Orchestrator
      │
      │ Check dependencies
      │ Step 4 requires Step 3 ✓
      │ Step 5 requires Step 3 ✓
      │
      ▼
[16] ENABLE Step 4 (Software Requirements)
      ENABLE Step 5 (Hardware Requirements)
      │
      ▼
[17] Dashboard shows Steps 4 & 5 unlocked
```

**Event Details:**

**Event 4: merchant.kyb_submitted**
```json
{
  "event_type": "merchant.kyb_submitted",
  "data": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "kyb_application_id": "kyb_app_123",
    "business_name": "Acme Restaurant LLC",
    "ein": "encrypted_ein_value",
    "submitted_at": "2025-10-09T15:00:00Z"
  }
}
```

**Event 11: merchant.kyb_approved**
```json
{
  "event_type": "merchant.kyb_approved",
  "data": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "kyb_application_id": "kyb_app_123",
    "payments_account_id": "pay_biz_456",
    "risk_score": 25.5,
    "approved_at": "2025-10-09T15:05:00Z"
  }
}
```

**Event 14: step.completed**
```json
{
  "event_type": "step.completed",
  "data": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "step_id": 3,
    "step_name": "Qualify for LS Payments (KYB)",
    "completed_at": "2025-10-09T15:05:00Z",
    "time_spent_seconds": 180
  }
}
```

**State Transitions:**
```
merchant.kyb_status: [pending] --[merchant.kyb_submitted]--> [submitted]
                     [submitted] --[merchant.kyb_approved]--> [approved]

merchant_step_progress.status: [in_progress] --[step.completed]--> [completed]

merchant.current_step: [3] --[step.completed]--> [4]
```

**Critical Validation:**
```sql
-- Database constraint ensures KYB approval before purchase
CONSTRAINT kyb_before_purchase CHECK (
  kyb_status = 'approved' OR x_series_account_id IS NULL
)
```

---

### Flow 3: Payment Completion → X-Series Provisioning → Hardware Shipment

**Business Rule:** Payment triggers parallel provisioning of X-Series and hardware shipment

**Event Sequence:**

```
┌─────────────────────────────────────────────────────────────────┐
│ FLOW: Payment Success Triggers Multi-System Provisioning       │
└─────────────────────────────────────────────────────────────────┘

[1] Merchant Dashboard (Step 6)
     │
     │ Merchant reviews quote, enters payment
     │
     ▼
[2] POST /api/v1/orders/{id}/payment
     │
     │ Validate payment details
     │ Verify KYB approved ✓
     │
     ▼
[3] POST /api/v1/payments (Billing Service)
     │
     │ Process credit card
     │
     ▼
[4] Billing Service: Payment succeeded
     │
     │ Webhook callback
     │
     ▼
[5] POST /api/v1/webhooks/billing/payment-status
     │
     │ Verify signature
     │
     ▼
[6] UPDATE order
      payment_status = 'captured'
      paid_at = NOW()
      │
      ▼
[7] EMIT: order.paid
      │
      ├─────────────────┬─────────────────┬─────────────────┬─────────────────┐
      │                 │                 │                 │                 │
      ▼                 ▼                 ▼                 ▼                 ▼
[8a] X-Series     [8b] Hardware     [8c] Progress   [8d] CRM       [8e] Email
     Provisioning      Ordering          Tracker         Sync           Service
     │                 │                 │
     │                 │                 │ Update Step 6
     │                 │                 │ status = 'completed'
     │                 │                 │
     │                 │                 ▼
     │                 │            [9c] EMIT: step.completed
     │                 │                      (step_id = 6)
     │                 │
     ▼                 ▼
[9a] POST /api/v2/  [9b] POST /api/v1/
     accounts/create      hardware/orders
     │                    │
     │ X-Series creates   │ Hardware system
     │ account & licenses │ creates shipment
     │                    │
     ▼                    ▼
[10a] RETURN:        [10b] RETURN:
      account_id           hardware_order_id
      subscription_id      estimated_delivery
      │                    │
      ▼                    ▼
[11a] UPDATE         [11b] CREATE
      merchant              hardware_shipment
      x_series_id           tracking_number
      │                    │
      ▼                    ▼
[12a] EMIT:          [12b] EMIT:
      account.created      hardware.ordered
      │                    │
      └─────────┬──────────┘
                │
                ▼
      [13] Orchestrator
                │
                │ Both provisioning tasks complete
                │
                ▼
      [14] UPDATE merchant
                current_step = 7
                │
                ▼
      [15] EMIT: merchant.provisioned
                │
                ▼
      [16] Dashboard shows Step 7 (KYC) enabled
```

**Event Details:**

**Event 7: order.paid**
```json
{
  "event_type": "order.paid",
  "data": {
    "order_id": "order_123abc",
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "total_amount": 1298.98,
    "currency": "USD",
    "payment_id": "pay_789ghi",
    "items": [
      {
        "type": "software_license",
        "sku": "x_series_pro",
        "quantity": 2
      },
      {
        "type": "hardware",
        "sku": "pos_terminal_pro",
        "quantity": 2
      }
    ]
  }
}
```

**Event 12a: account.created**
```json
{
  "event_type": "account.created",
  "data": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "x_series_account_id": "x_acct_789xyz",
    "subscription_id": "x_sub_456def",
    "tier": "professional",
    "locations": [
      {
        "location_id": "x_loc_111aaa",
        "name": "Acme Downtown"
      }
    ]
  }
}
```

**Event 12b: hardware.ordered**
```json
{
  "event_type": "hardware.ordered",
  "data": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "hardware_order_id": "hw_order_999zzz",
    "shipment_id": "ship_777xxx",
    "estimated_delivery": "2025-10-15",
    "items": [
      {
        "sku": "pos_terminal_pro",
        "quantity": 2
      }
    ]
  }
}
```

**State Transitions:**
```
order.payment_status: [pending] --[order.paid]--> [captured]
order.fulfillment_status: [pending] --[order.paid]--> [processing]

merchant.x_series_account_id: [NULL] --[account.created]--> [x_acct_789xyz]
merchant.current_step: [6] --[merchant.provisioned]--> [7]

hardware_shipment.status: [N/A] --[hardware.ordered]--> [processing]
```

---

### Flow 4: KYC Completion → Bank Verification → Payout Enablement

**Business Rule:** Payouts held until bank verification (Step 7 activates, Step 9 enables payouts)

**Event Sequence:**

```
┌─────────────────────────────────────────────────────────────────┐
│ FLOW: KYC + Bank Verification Enables Payouts                  │
└─────────────────────────────────────────────────────────────────┘

[1] Merchant Dashboard (Step 7)
     │
     │ Merchant enters business rep & owner details
     │
     ▼
[2] POST /api/v1/merchants/{id}/kyc
     │
     │ Validate person data
     │
     ▼
[3] CREATE merchant_persons (representative + owners)
     │
     │ kyc_status = 'pending'
     │
     ▼
[4] EMIT: merchant.kyc_submitted
     │
     ▼
[5] Onboarding Orchestrator
     │
     │ For each person
     │
     ▼
[6] POST /api/v1/kyc/persons (Payments Service)
     │
     │ External KYC checks (async)
     │
     ▼
[7] RETURN: { person_id, kyc_status: 'pending' }
     │
     │ (Time passes)
     │
     ▼
[8] Payments Service completes KYC for all persons
     │
     │ Multiple webhook callbacks
     │
     ▼
[9] POST /api/v1/webhooks/payments/kyc (for each person)
     │
     ▼
[10] UPDATE merchant_persons
      kyc_status = 'approved'
      kyc_approved_at = NOW()
      │
      ▼
[11] CHECK: All persons approved?
      │
      │ Yes
      │
      ▼
[12] UPDATE merchant
      kyc_status = 'approved'
      kyc_all_approved_at = NOW()
      │
      ▼
[13] EMIT: merchant.kyc_approved
      │
      ├─────────────────┬─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
[14a] Progress     [14b] CRM        [14c] Payments
      Tracker           Sync             Service
      │                                   │
      │ Update Step 7                     │ Activate payments
      │ status = 'completed'              │ per location
      │                                   │
      ▼                                   ▼
[15a] EMIT:                         [15c] UPDATE merchant
      step.completed                       payments_activated = true
      (step_id = 7)                        payouts_enabled = FALSE
                                           │
                                           │ NOTE: Payouts still disabled
                                           │       until bank verification
                                           │
                                           ▼
                                      [16] EMIT: payments.activated
                                           │
                                           ▼
                                      [17] Dashboard shows:
                                           - Step 7 complete ✓
                                           - Step 9 unlocked
                                           - Warning: "Add bank account to enable payouts"

┌─────────────────────────────────────────────────────────────────┐
│ Step 9: Bank Verification (Later in Journey)                   │
└─────────────────────────────────────────────────────────────────┘

[18] Merchant Dashboard (Step 9)
      │
      │ Merchant enters bank account details
      │
      ▼
[19] POST /api/v1/merchants/{id}/bank-account
      │
      │ Validate bank details
      │
      ▼
[20] POST /api/v1/payouts/bank-accounts (Payments Service)
      │
      │ Bank verification (instant or micro-deposits)
      │
      ▼
[21] RETURN: { bank_account_id, verification_status }
      │
      ▼
┌─────┴─────┐
│ IF instant │
│ verification │
└─────┬─────┘
      │ Yes
      ▼
[22a] Immediate verification
      │
      ▼
[23a] EMIT: bank_account.verified
      │
      └──────────────┐
                     │
      ┌──────────────┘
      │ OR
      │
      │ No (micro-deposits)
      ▼
[22b] Micro-deposits sent
      │
      │ Merchant confirms amounts (1-2 days later)
      │
      ▼
[23b] POST /api/v1/bank-accounts/{id}/verify
      │
      ▼
[24b] EMIT: bank_account.verified

[25] UPDATE merchant_bank_accounts
      verification_status = 'verified'
      verified_at = NOW()
      │
      ▼
[26] UPDATE merchant
      payouts_enabled = TRUE
      payouts_enabled_at = NOW()
      │
      ▼
[27] EMIT: merchant.payouts_enabled
      │
      ├─────────────────┬─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
[28a] Progress     [28b] Payments   [28c] Email
      Tracker           Service          Service
      │                 │                 │
      │ Update Step 9   │ Enable payouts  │ Notify merchant
      │ status =        │ in Payments     │ "Ready to accept
      │ 'completed'     │ system          │  payments!"
      │                 │
      ▼                 ▼
[29a] EMIT:        [29b] Merchant can now
      step.completed     receive payouts
      (step_id = 9)
```

**Event Details:**

**Event 13: merchant.kyc_approved**
```json
{
  "event_type": "merchant.kyc_approved",
  "data": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "kyc_all_approved_at": "2025-10-09T16:30:00Z",
    "persons_verified": [
      {
        "person_id": "person_123",
        "person_type": "representative",
        "kyc_status": "approved"
      },
      {
        "person_id": "person_456",
        "person_type": "owner",
        "kyc_status": "approved"
      }
    ]
  }
}
```

**Event 16: payments.activated**
```json
{
  "event_type": "payments.activated",
  "data": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "payments_account_id": "pay_biz_456",
    "locations_activated": [
      {
        "location_id": "x_loc_111aaa",
        "payments_location_id": "pay_loc_789"
      }
    ],
    "payouts_enabled": false,
    "activated_at": "2025-10-09T16:35:00Z"
  }
}
```

**Event 27: merchant.payouts_enabled**
```json
{
  "event_type": "merchant.payouts_enabled",
  "data": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "bank_account_id": "pay_bank_101abc",
    "verification_method": "instant",
    "payouts_enabled_at": "2025-10-09T18:00:00Z"
  }
}
```

**State Transitions:**
```
merchant.kyc_status: [pending] --[merchant.kyc_submitted]--> [submitted]
                     [submitted] --[merchant.kyc_approved]--> [approved]

merchant.payments_activated: [false] --[payments.activated]--> [true]
merchant.payouts_enabled: [false] --[merchant.payouts_enabled]--> [true]

merchant_bank_accounts.verification_status:
    [pending] --[bank_account.verified]--> [verified]
```

---

### Flow 5: Stall Detection → Intervention Trigger

**Business Rule:** Detect merchants stalled for >3 days, trigger intervention

**Event Sequence:**

```
┌─────────────────────────────────────────────────────────────────┐
│ FLOW: Stall Detection and Intervention                         │
└─────────────────────────────────────────────────────────────────┘

[1] Scheduled Job (runs every hour)
     │
     │ Query merchants with no progress
     │
     ▼
[2] SELECT merchants WHERE
      journey_status = 'in_progress'
      AND updated_at < NOW() - INTERVAL '3 days'
     │
     ▼
[3] FOR EACH stalled merchant
     │
     ▼
[4] CREATE stall_alert
      alert_type = 'stalled'
      days_stalled = 3
      severity = 'medium'
      │
      ▼
[5] EMIT: merchant.stalled
      │
      ├─────────────────┬─────────────────┬─────────────────┐
      │                 │                 │                 │
      ▼                 ▼                 ▼                 ▼
[6a] Routing       [6b] CRM        [6c] Notification [6d] Dashboard
      Service           Sync             Service          Update
      │
      │ Evaluate intervention rules
      │
      ▼
┌─────┴─────┐
│ IF cohort  │
│ = assisted │
│ OR managed │
└─────┬─────┘
      │ Yes
      ▼
[7] CREATE queue_assignment
      queue_id = 'ic_intervention'
      status = 'queued'
      priority = HIGH
      │
      ▼
[8] EMIT: merchant.routed_to_ic
      │
      ├─────────────────┬─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
[9a] IC Dashboard  [9b] Email      [9c] CRM
      (new task)        to IC            Update
      │
      ▼
[10] IC contacts merchant
      │
      ▼
[11] UPDATE queue_assignment
      status = 'contacted'
      first_contact_at = NOW()
      │
      ▼
[12] EMIT: intervention.contacted
      │
      ▼
[13] IC guides merchant through stuck step
      │
      ▼
[14] Merchant completes step
      │
      ▼
[15] EMIT: step.completed
      │
      ▼
[16] UPDATE stall_alert
      alert_status = 'resolved'
      resolved_at = NOW()
      resolution_action = 'IC assisted with Step 7'
      │
      ▼
[17] EMIT: stall_alert.resolved

┌─────────────────────────────────────────────────────────────────┐
│ ALTERNATIVE: Self-Serve Intervention                           │
└─────────────────────────────────────────────────────────────────┘

      IF cohort = 'self_serve'
      │
      ▼
[7b] EMIT: merchant.nudge_required
      │
      ├─────────────────┬─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
[8b] Email         [9b] SMS          [10b] In-app
      "Need help?"      Reminder          Notification
      │
      ▼
[11b] IF still no progress after 2 more days
       │
       ▼
[12b] Escalate to IC queue
       EMIT: merchant.routed_to_ic
```

**Event Details:**

**Event 5: merchant.stalled**
```json
{
  "event_type": "merchant.stalled",
  "data": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "current_step": 7,
    "days_stalled": 3,
    "last_activity_at": "2025-10-06T12:00:00Z",
    "cohort": "assisted",
    "severity": "medium"
  }
}
```

**Event 8: merchant.routed_to_ic**
```json
{
  "event_type": "merchant.routed_to_ic",
  "data": {
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "queue_id": "ic_intervention",
    "assignment_id": "assign_uuid",
    "reason": "stalled_3_days",
    "priority": 10,
    "sla_minutes": 240
  }
}
```

**Event 17: stall_alert.resolved**
```json
{
  "event_type": "stall_alert.resolved",
  "data": {
    "alert_id": "alert_uuid",
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "resolved_at": "2025-10-09T18:30:00Z",
    "resolution_action": "IC assisted with KYC submission",
    "assigned_to_user_id": "ic_user_456"
  }
}
```

**State Transitions:**
```
stall_alert.alert_status: [open] --[intervention.contacted]--> [in_progress]
                          [in_progress] --[stall_alert.resolved]--> [resolved]

queue_assignment.status: [queued] --[intervention.contacted]--> [contacted]
                         [contacted] --[stall_alert.resolved]--> [resolved]
```

---

## State Machine Definitions

### Lead State Machine

**States:** `new`, `contacted`, `qualified`, `disqualified`, `converted`, `lost`

**Transitions:**
```
[new]
  --[lead.created]--> [new]
  --[lead.profiled]--> [contacted]

[contacted]
  --[lead.routed_to_ae]--> [contacted]
  --[ae.contacted]--> [contacted]
  --[kyb.approved]--> [qualified]
  --[kyb.rejected]--> [disqualified]

[qualified]
  --[order.paid]--> [converted]

[converted]
  (terminal state - lead becomes merchant)

[disqualified] or [lost]
  (terminal states)
```

**State Diagram:**
```
    ┌─────┐
    │ new │
    └──┬──┘
       │ lead.profiled
       ▼
  ┌──────────┐
  │contacted │
  └─────┬────┘
        │
   ┌────┴────┐
   │         │
   │ kyb.    │ kyb.
   │approved │rejected
   │         │
   ▼         ▼
┌─────────┐ ┌─────────────┐
│qualified│ │disqualified │
└────┬────┘ └─────────────┘
     │ order.paid
     ▼
┌──────────┐
│converted │
└──────────┘
```

---

### Merchant Journey State Machine

**States:** `in_progress`, `completed`, `abandoned`, `blocked`

**Transitions:**
```
[in_progress]
  --[step.completed (step 1-9)]--> [in_progress]
  --[step.completed (step 10)]--> [completed]
  --[merchant.abandoned]--> [abandoned]
  --[kyb.rejected OR kyc.rejected]--> [blocked]

[completed]
  --[merchant.activated]--> [completed]
  (terminal state)

[abandoned]
  --[merchant.reactivated]--> [in_progress]

[blocked]
  --[manual.review.approved]--> [in_progress]
```

**State Diagram:**
```
┌────────────┐
│in_progress │◀───────┐
└─────┬──────┘        │
      │               │
 ┌────┴────┬──────────┴──────┐
 │         │                 │
 │step.    │merchant.        │manual.
 │completed│abandoned        │review.
 │(1-9)    │                 │approved
 │         │                 │
 │         ▼                 │
 │    ┌──────────┐           │
 │    │abandoned │           │
 │    └──────────┘           │
 │                           │
 │step.           ┌────────┐ │
 │completed       │blocked │─┘
 │(10)            └────────┘
 │                     ▲
 │                     │ kyb/kyc.rejected
 ▼                     │
┌──────────┐    ┌──────┴──────┐
│completed │    │in_progress  │
└──────────┘    └─────────────┘
```

---

### Step Progress State Machine

**States:** `pending`, `in_progress`, `completed`, `blocked`, `skipped`, `failed`

**Transitions:**
```
[pending]
  --[step.started]--> [in_progress]
  --[step.skipped]--> [skipped]

[in_progress]
  --[step.completed]--> [completed]
  --[step.failed]--> [failed]
  --[step.blocked]--> [blocked]

[blocked]
  --[manual.review.approved]--> [in_progress]

[failed]
  --[step.retried]--> [in_progress]

[completed]
  (terminal state)

[skipped]
  (terminal state for optional steps)
```

---

### Order State Machine

**Payment Status:** `pending`, `authorized`, `captured`, `failed`, `refunded`, `cancelled`

**Fulfillment Status:** `pending`, `processing`, `partially_fulfilled`, `fulfilled`, `cancelled`

**Payment Transitions:**
```
[pending]
  --[payment.authorized]--> [authorized]
  --[payment.failed]--> [failed]

[authorized]
  --[payment.captured]--> [captured]
  --[payment.cancelled]--> [cancelled]

[captured]
  --[payment.refunded]--> [refunded]

[failed]
  --[payment.retried]--> [pending]
```

**Fulfillment Transitions:**
```
[pending]
  --[order.paid]--> [processing]

[processing]
  --[x_series.provisioned]--> [partially_fulfilled]
  --[hardware.shipped]--> [partially_fulfilled]

[partially_fulfilled]
  --[all.items.fulfilled]--> [fulfilled]
```

---

## Cohort-Specific Flows

### Self-Serve Path

**Characteristics:**
- Fully automated routing
- No AE/IC assignment
- Email/SMS nudges for stalls
- Escalation to IC only if stalled >5 days

**Event Flow Differences:**
```
lead.profiled (cohort = 'self_serve')
  → NO lead.routed_to_ae event
  → Dashboard shows self-serve UI
  → Automated email welcome sequence

merchant.stalled (cohort = 'self_serve')
  → merchant.nudge_required event
  → Email/SMS reminders
  → IF stalled >5 days → merchant.routed_to_ic
```

---

### Assisted Path

**Characteristics:**
- Routed to AE for initial sale
- Free IC support for setup
- Proactive intervention on stalls

**Event Flow Differences:**
```
lead.profiled (cohort = 'assisted')
  → lead.routed_to_ae event
  → AE receives notification within 15 min SLA
  → AE guides through Steps 4-6

order.paid (cohort = 'assisted')
  → merchant.ic_assigned event
  → IC receives onboarding task

merchant.stalled (cohort = 'assisted')
  → Immediate merchant.routed_to_ic
  → IC contacts within 4 hours
```

---

### Managed Path

**Characteristics:**
- Dedicated AE for custom pricing
- Paid IC implementation package
- White-glove support throughout

**Event Flow Differences:**
```
lead.profiled (cohort = 'managed')
  → lead.routed_to_ae event (high priority queue)
  → AE receives notification within 5 min SLA
  → AE builds custom quote

order.paid (cohort = 'managed')
  → merchant.ic_assigned event (premium IC)
  → IC schedules kickoff call

merchant.stalled (cohort = 'managed')
  → Immediate escalation to account manager
  → Daily check-ins until resolved
```

---

## Error & Edge Case Flows

### Error Case 1: KYB Rejection

**Event Sequence:**
```
[1] Payments Service completes KYB
     kyb_status = 'rejected'
     │
     ▼
[2] Webhook: kyb.completed (status: rejected)
     │
     ▼
[3] UPDATE merchant
      kyb_status = 'rejected'
      kyb_rejection_reason = 'High-risk industry'
      │
      ▼
[4] EMIT: merchant.kyb_rejected
      │
      ├─────────────────┬─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
[5a] Dashboard     [5b] Email       [5c] CRM
      Show error        Notify           Update
      message           merchant         Opp status
      │
      ▼
[6] UPDATE merchant
      journey_status = 'blocked'
      │
      ▼
[7] CREATE manual_review_queue_item
      review_type = 'kyb_rejection'
      │
      ▼
[8] EMIT: merchant.manual_review_required
      │
      ▼
[9] Compliance team reviews
      │
      ├─────────────────┐
      │ Approved        │ Rejected
      ▼                 ▼
[10a] EMIT:         [10b] EMIT:
      kyb.manual_        merchant.
      approved           disqualified
```

---

### Error Case 2: Payment Failure

**Event Sequence:**
```
[1] Billing Service: Payment failed
     │
     ▼
[2] Webhook: payment.failed
      error_code = 'card_declined'
      │
      ▼
[3] UPDATE order
      payment_status = 'failed'
      │
      ▼
[4] EMIT: order.payment_failed
      │
      ├─────────────────┬─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
[5a] Dashboard     [5b] Email       [5c] Analytics
      Show error        Notify
      + retry form      merchant
      │
      ▼
[6] Merchant retries payment
      │
      ▼
[7] POST /api/v1/orders/{id}/payment (retry)
      │
      ▼
[8] Payment succeeds
      │
      ▼
[9] EMIT: order.paid
      (continue normal flow)
```

---

### Error Case 3: X-Series Provisioning Failure

**Event Sequence:**
```
[1] order.paid event consumed
     │
     ▼
[2] POST /api/v2/accounts/create (X-Series)
     │
     │ Returns 500 error
     │
     ▼
[3] Retry with exponential backoff (5 attempts)
     │
     │ All retries fail
     │
     ▼
[4] EMIT: account.creation_failed
      │
      ├─────────────────┬─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
[5a] Dead Letter   [5b] Alert       [5c] Dashboard
      Queue             Ops team          Show pending
                                          status
      │
      ▼
[6] Ops team investigates
      │
      ▼
[7] Manual provisioning OR retry
      │
      ▼
[8] EMIT: account.created (manual)
      (continue normal flow)
```

---

## Intervention & Escalation Flows

### Intervention Trigger Rules

**Trigger Conditions:**

| Cohort | Stall Duration | Action |
|--------|---------------|--------|
| Self-Serve | 3 days | Email/SMS nudge |
| Self-Serve | 5 days | Route to IC queue |
| Assisted | 3 days | Route to IC queue |
| Managed | 1 day | Alert account manager |

**Error Threshold Triggers:**

| Error Type | Threshold | Action |
|-----------|-----------|--------|
| Payment failure | 3 attempts | Route to support |
| KYC failure | 1 rejection | Manual review |
| X-Series provisioning | 5 retries | Ops team alert |

---

## Compliance & Audit Flows

### Audit Event Flow

**All KYB/KYC decisions logged:**

```
[1] KYB/KYC decision made
     │
     ▼
[2] INSERT INTO kyb_kyc_audit_log
      check_type = 'kyb'
      decision = 'approved'
      request_payload = {...}
      response_payload = {...}
      │
      ▼
[3] EMIT: audit.kyb_decision_logged
      │
      ▼
[4] Compliance data warehouse
      (for regulatory reporting)
```

**Data Access Audit Flow:**

```
[1] User accesses PII data
     GET /api/v1/merchants/{id}/kyc
     │
     ▼
[2] INSERT INTO data_access_audit_log
      user_id = 'admin_123'
      action = 'read'
      entity_type = 'merchant_persons'
      fields_accessed = ['ssn', 'date_of_birth']
      access_reason = 'Support ticket #12345'
      │
      ▼
[3] EMIT: audit.data_access_logged
      │
      ▼
[4] Security monitoring
      (detect anomalous access)
```

---

## Event Sequence Diagrams

### Complete 10-Step Journey (Self-Serve)

```
Merchant  │  Dashboard  │  Orchestrator  │  Payments  │  X-Series  │  Hardware
    │            │             │              │            │            │
    │ Step 1     │             │              │            │            │
    ├───────────▶│             │              │            │            │
    │            │ lead.       │              │            │            │
    │            │ created     │              │            │            │
    │            ├────────────▶│              │            │            │
    │            │             │ lead.        │            │            │
    │            │             │ profiled     │            │            │
    │            │             │              │            │            │
    │ Step 2     │             │              │            │            │
    ├───────────▶│ account.    │              │            │            │
    │            │ created     │              │            │            │
    │            ├────────────▶│              │            │            │
    │            │             │              │            │            │
    │ Step 3     │             │              │            │            │
    ├───────────▶│ kyb data    │              │            │            │
    │            ├────────────▶│ POST /kyb    │            │            │
    │            │             ├─────────────▶│            │            │
    │            │             │  (async)     │            │            │
    │            │◀────────────┤ kyb.         │            │            │
    │            │  approved   │ approved     │            │            │
    │            │             │              │            │            │
    │ Step 4-5   │             │              │            │            │
    ├───────────▶│ software &  │              │            │            │
    │            │ hardware    │              │            │            │
    │            │ selected    │              │            │            │
    │            │             │              │            │            │
    │ Step 6     │             │              │            │            │
    ├───────────▶│ payment     │              │            │            │
    │            ├────────────▶│ order.paid   │            │            │
    │            │             ├──────────────┼───────────▶│            │
    │            │             │              │  provision │            │
    │            │             ├──────────────┼────────────┼───────────▶│
    │            │             │              │            │  create    │
    │            │             │              │            │  order     │
    │            │◀────────────┤              │◀───────────│            │
    │            │             │              │ account.   │            │
    │            │             │              │ created    │            │
    │            │             │              │            │◀───────────│
    │            │             │              │            │ hardware.  │
    │            │             │              │            │ ordered    │
    │ Step 7     │             │              │            │            │
    ├───────────▶│ kyc data    │              │            │            │
    │            ├────────────▶│ POST /kyc    │            │            │
    │            │             ├─────────────▶│            │            │
    │            │             │  (async)     │            │            │
    │            │◀────────────┤ kyc.         │            │            │
    │            │  approved   │ approved     │            │            │
    │            │             │ payments.    │            │            │
    │            │             │ activated    │            │            │
    │            │             │              │            │            │
    │ Step 8     │             │              │            │            │
    ├───────────▶│ data import │              │            │            │
    │            │  (optional) │              │            │            │
    │            │             │              │            │            │
    │ Step 9     │             │              │            │            │
    ├───────────▶│ bank        │              │            │            │
    │            │ account     │              │            │            │
    │            ├────────────▶│ POST /bank   │            │            │
    │            │             ├─────────────▶│            │            │
    │            │◀────────────┤ bank.        │            │            │
    │            │  verified   │ verified     │            │            │
    │            │             │ payouts.     │            │            │
    │            │             │ enabled      │            │            │
    │            │             │              │            │            │
    │ Step 10    │             │              │            │            │
    ├───────────▶│ final setup │              │            │            │
    │            ├────────────▶│ merchant.    │            │            │
    │            │             │ activated    │            │            │
    │            │             │              │            │            │
```

---

## Testing Scenarios

### Test Scenario 1: Happy Path (Self-Serve)

**Given:** New lead from marketing
**When:** Merchant completes all 10 steps without errors
**Then:**
- All events emitted in correct order
- All state transitions valid
- Merchant status = 'active'
- Payouts enabled

**Event Assertions:**
```javascript
expect(events).toContainEvents([
  'lead.created',
  'lead.profiled',
  'merchant.kyb_submitted',
  'merchant.kyb_approved',
  'step.completed (step 3)',
  'order.paid',
  'account.created',
  'hardware.ordered',
  'merchant.kyc_approved',
  'payments.activated',
  'bank_account.verified',
  'merchant.payouts_enabled',
  'merchant.activated'
]);
```

---

### Test Scenario 2: KYB Rejection → Manual Review → Approval

**Given:** Lead submits KYB
**When:** KYB rejected due to high-risk industry
**Then:**
- `merchant.kyb_rejected` event emitted
- Journey status = 'blocked'
- Manual review queue created
**When:** Compliance approves manually
**Then:**
- `kyb.manual_approved` event emitted
- Journey status = 'in_progress'
- Can continue to purchase

---

### Test Scenario 3: Stall Detection → IC Intervention

**Given:** Assisted merchant stuck on Step 7 for 3 days
**When:** Stall detection job runs
**Then:**
- `merchant.stalled` event emitted
- `merchant.routed_to_ic` event emitted
- IC receives notification
**When:** IC contacts merchant
**Then:**
- `intervention.contacted` event emitted
**When:** Merchant completes step
**Then:**
- `step.completed` event emitted
- `stall_alert.resolved` event emitted

---

### Test Scenario 4: Payment Failure → Retry → Success

**Given:** Merchant attempts payment
**When:** Card declined
**Then:**
- `order.payment_failed` event emitted
- Dashboard shows error + retry form
**When:** Merchant retries with valid card
**Then:**
- `order.paid` event emitted
- Provisioning workflows triggered

---

### Test Scenario 5: X-Series Provisioning Failure → Manual Resolution

**Given:** Order paid
**When:** X-Series API returns 500 error
**Then:**
- Retry 5 times with exponential backoff
- All retries fail
- `account.creation_failed` event emitted
- Message sent to dead letter queue
**When:** Ops team manually provisions
**Then:**
- `account.created` event emitted (manual)
- Journey continues normally

---

## Next Steps

1. **Event Schema Registry:**
   - Publish all event schemas to schema registry (Confluent Schema Registry)
   - Enforce schema validation on publish/consume

2. **Event Replay Capability:**
   - Build tooling to replay events for debugging
   - Support reprocessing failed events from DLQ

3. **Event Monitoring:**
   - Set up dashboards for event throughput, lag, failures
   - Alert on missing expected events

4. **Integration Testing:**
   - Build end-to-end tests covering all critical flows
   - Use event assertions to validate flows

5. **Documentation:**
   - Generate AsyncAPI docs from event schemas
   - Publish event catalog for developers

---

**Document Owner:** Event Architecture Team
**Review Cycle:** Quarterly or on major flow changes
**Feedback:** event-architecture@lightspeed.com
