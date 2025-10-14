# Progress Tracking API Specification

## Overview
The Progress Tracking API provides comprehensive journey tracking, state management, and monitoring capabilities for the 10-step merchant onboarding process. It enables real-time progress visibility, stall detection, timeline tracking, and intervention triggers for AEs and ICs.

## Authentication & Authorization

### Authentication Method
- **JWT Bearer Tokens** for merchant and internal user access
- **API Keys** for system-to-system integration

### Authorization Levels
- `merchant:progress:read` - Read own progress
- `merchant:progress:write` - Update own progress (limited operations)
- `admin:progress` - Full access to all merchant progress
- `system:progress` - System-level access for automated state transitions

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Idempotency-Key: <uuid> (required for POST/PUT operations)
X-Request-ID: <uuid> (for distributed tracing)
```

## Rate Limiting
- **Merchant requests:** 100 requests/minute per merchant
- **Admin users:** 500 requests/minute
- **System integration:** 2000 requests/minute

## Common Error Responses

### Error Response Schema
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {},
    "timestamp": "2025-10-09T12:00:00Z",
    "trace_id": "uuid"
  }
}
```

---

## 10-Step Journey State Machine

### Step Definitions

| Step | Name | Stage | Key Milestone | Prerequisites |
|------|------|-------|--------------|---------------|
| 1 | Browse and Buy Decision | Qualify Leads | Buy intent captured | None |
| 2 | Account Creation | Qualify Leads | Lead created, cohort assigned | Step 1 |
| 3 | KYB Qualification | Qualify Leads | Payments eligible | Step 2 |
| 4 | Software Requirements | Buying Experience | X-Series provisioned | Step 3 (KYB approved) |
| 5 | Hardware Requirements | Buying Experience | Hardware selected | Step 4 |
| 6 | Payment & Purchase | Buying Experience | Payment processed | Steps 4, 5 |
| 7 | Payments Activation (KYC) | Guided Setup | Payments active | Step 6 |
| 8 | Data Import | Guided Setup | Historical data imported | Step 7 |
| 9 | Hardware Setup | Guided Setup | Test payment, payouts enabled | Steps 6 (hardware shipped), 7 |
| 10 | Final Config & Upsells | Guided Setup | Ready for production | Steps 7, 8, 9 |

### Step States

Each step can be in one of the following states:

```
NOT_STARTED - Step not yet begun
IN_PROGRESS - Step currently being worked on
BLOCKED - Step cannot proceed (waiting on prerequisite or issue)
COMPLETED - Step successfully completed
SKIPPED - Step skipped (optional step or not applicable)
FAILED - Step failed and requires intervention
```

### Overall Journey Status

```
INITIATED - Journey started (Step 1-2)
QUALIFYING - Undergoing qualification (Step 3)
QUALIFIED - Approved for payments, ready to buy
PURCHASING - Actively purchasing (Steps 4-6)
PURCHASED - Payment completed, hardware ordered
SETTING_UP - In setup phase (Steps 7-10)
ACTIVE - Fully onboarded and processing payments
STALLED - Progress halted for extended period
ABANDONED - Journey abandoned (no activity for 30+ days)
FAILED - Journey failed (rejected, ineligible)
```

---

## API Endpoints

## 1. Get Merchant Progress

**Endpoint:** `GET /api/v1/merchants/{id}/progress`

**Description:** Retrieves comprehensive progress information for a merchant, including current step, completion status, blockers, and next actions.

**Authorization:** `merchant:progress:read` (own data) or `admin:progress`

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Lead ID (format: `lead_*`) or Merchant ID (format: `merch_*`) |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `include_details` | boolean | No | false | Include detailed step information |
| `include_blockers` | boolean | No | false | Include current blockers and issues |

### Response Schema (200 OK)

```json
{
  "id": "lead_7f8d9e1a2b3c4d5e6f",
  "merchant_id": null,
  "email": "merchant@example.com",
  "journey_status": "PURCHASING",
  "overall_progress": {
    "current_step": 5,
    "total_steps": 10,
    "completion_percentage": 40,
    "steps_completed": 4,
    "steps_remaining": 6,
    "estimated_completion_date": "2025-10-15T12:00:00Z"
  },
  "steps": [
    {
      "step_number": 1,
      "name": "Browse and Buy Decision",
      "stage": "QUALIFY_LEADS",
      "status": "COMPLETED",
      "started_at": "2025-10-09T11:55:00Z",
      "completed_at": "2025-10-09T11:58:00Z",
      "duration_seconds": 180
    },
    {
      "step_number": 2,
      "name": "Account Creation",
      "stage": "QUALIFY_LEADS",
      "status": "COMPLETED",
      "started_at": "2025-10-09T11:58:00Z",
      "completed_at": "2025-10-09T12:00:00Z",
      "duration_seconds": 120,
      "actions_completed": [
        "Lead created",
        "Cohort assigned: ASSISTED",
        "AE assigned: Sarah Johnson"
      ]
    },
    {
      "step_number": 3,
      "name": "KYB Qualification",
      "stage": "QUALIFY_LEADS",
      "status": "COMPLETED",
      "started_at": "2025-10-09T12:00:00Z",
      "completed_at": "2025-10-09T12:05:00Z",
      "duration_seconds": 300,
      "kyb_request_id": "kyb_abc123def456",
      "actions_completed": [
        "KYB data submitted",
        "Business verified",
        "Approved for payment processing"
      ]
    },
    {
      "step_number": 4,
      "name": "Software Requirements",
      "stage": "BUYING_EXPERIENCE",
      "status": "COMPLETED",
      "started_at": "2025-10-09T12:05:00Z",
      "completed_at": "2025-10-09T12:15:00Z",
      "duration_seconds": 600,
      "actions_completed": [
        "2 location licenses selected",
        "4 register licenses configured",
        "X-Series account provisioned"
      ]
    },
    {
      "step_number": 5,
      "name": "Hardware Requirements",
      "stage": "BUYING_EXPERIENCE",
      "status": "IN_PROGRESS",
      "started_at": "2025-10-09T12:15:00Z",
      "last_activity_at": "2025-10-09T12:15:00Z",
      "time_in_step_seconds": 300,
      "progress_indicators": {
        "hardware_bundle_viewed": true,
        "hardware_selected": false,
        "quote_generated": false
      }
    },
    {
      "step_number": 6,
      "name": "Payment & Purchase",
      "stage": "BUYING_EXPERIENCE",
      "status": "NOT_STARTED",
      "prerequisites": [
        {
          "step": 4,
          "status": "COMPLETED"
        },
        {
          "step": 5,
          "status": "IN_PROGRESS"
        }
      ]
    },
    {
      "step_number": 7,
      "name": "Payments Activation (KYC)",
      "stage": "GUIDED_SETUP",
      "status": "NOT_STARTED",
      "prerequisites": [
        {
          "step": 6,
          "status": "NOT_STARTED"
        }
      ]
    },
    {
      "step_number": 8,
      "name": "Data Import",
      "stage": "GUIDED_SETUP",
      "status": "NOT_STARTED"
    },
    {
      "step_number": 9,
      "name": "Hardware Setup",
      "stage": "GUIDED_SETUP",
      "status": "NOT_STARTED"
    },
    {
      "step_number": 10,
      "name": "Final Config & Upsells",
      "stage": "GUIDED_SETUP",
      "status": "NOT_STARTED"
    }
  ],
  "current_step": {
    "step_number": 5,
    "name": "Hardware Requirements",
    "status": "IN_PROGRESS",
    "next_actions": [
      {
        "action": "SELECT_HARDWARE_BUNDLE",
        "description": "Choose a hardware package or verify existing hardware",
        "url": "/onboarding/hardware",
        "priority": "HIGH"
      }
    ],
    "estimated_time_to_complete": "5-10 minutes",
    "support_available": {
      "ae_assigned": true,
      "ae_contact": {
        "name": "Sarah Johnson",
        "phone": "+1-555-987-6543",
        "email": "sarah.j@lightspeed.com"
      },
      "help_articles": [
        {
          "title": "Choosing the Right Hardware",
          "url": "https://help.lightspeed.com/hardware-guide"
        }
      ]
    }
  },
  "cohort": {
    "type": "ASSISTED",
    "selling_plan": "AE_GUIDED",
    "setup_plan": "FREE_IC"
  },
  "timeline": {
    "started_at": "2025-10-09T11:55:00Z",
    "last_activity_at": "2025-10-09T12:15:00Z",
    "time_since_start_seconds": 1200,
    "time_since_last_activity_seconds": 300
  },
  "health": {
    "is_stalled": false,
    "stall_risk": "LOW",
    "days_since_last_activity": 0,
    "intervention_needed": false
  }
}
```

### Response with Blockers (`?include_blockers=true`)

```json
{
  "id": "lead_7f8d9e1a2b3c4d5e6f",
  // ... standard fields ...
  "steps": [
    // ... other steps ...
    {
      "step_number": 7,
      "name": "Payments Activation (KYC)",
      "stage": "GUIDED_SETUP",
      "status": "BLOCKED",
      "started_at": "2025-10-10T10:00:00Z",
      "blockers": [
        {
          "blocker_id": "blk_123",
          "type": "VERIFICATION_FAILED",
          "severity": "HIGH",
          "message": "KYC verification requires additional documentation",
          "details": {
            "person_id": "per_rep123",
            "required_documents": [
              "GOVERNMENT_ID"
            ]
          },
          "resolution_url": "/api/v1/payments/kyc/kyc_xyz789/persons/per_rep123/documents",
          "created_at": "2025-10-10T10:15:00Z"
        }
      ]
    }
  ],
  "current_blockers": [
    {
      "blocker_id": "blk_123",
      "step_number": 7,
      "type": "VERIFICATION_FAILED",
      "severity": "HIGH",
      "message": "KYC verification requires additional documentation",
      "resolution_required": true,
      "estimated_resolution_time": "24-48 hours"
    }
  ]
}
```

### Blocker Types

```
KYB_REJECTED - KYB verification rejected
KYC_REJECTED - KYC verification rejected
VERIFICATION_FAILED - Identity/business verification failed
PAYMENT_FAILED - Payment processing failed
HARDWARE_UNAVAILABLE - Hardware out of stock
TECHNICAL_ERROR - System/integration error
MISSING_INFORMATION - Required data missing
COMPLIANCE_HOLD - Compliance review required
```

---

## 2. Update Step Completion

**Endpoint:** `POST /api/v1/merchants/{id}/progress`

**Description:** Updates progress for a specific step. Moves step to completed status and triggers state transitions.

**Authorization:** `merchant:progress:write` (limited) or `admin:progress` or `system:progress`

**Idempotency:** Required via `X-Idempotency-Key` header

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Lead/Merchant ID |

### Request Schema

```json
{
  "step_number": 5,
  "action": "COMPLETE",
  "data": {
    "hardware_bundle_id": "bundle_abc123",
    "hardware_items": [
      {
        "sku": "LS-TERMINAL-001",
        "quantity": 2,
        "name": "Lightspeed Terminal"
      },
      {
        "sku": "LS-PRINTER-001",
        "quantity": 2,
        "name": "Receipt Printer"
      }
    ],
    "total_cost": 1498.00
  },
  "notes": "Hardware bundle selected with AE assistance"
}
```

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `step_number` | integer | Yes | 1-10 | Step to update |
| `action` | enum | Yes | COMPLETE, SKIP, BLOCK, UNBLOCK, FAIL | Action to take |
| `data` | object | No | - | Step-specific data |
| `notes` | string | No | Max 1000 chars | Additional notes |

### Action Enum

```
COMPLETE - Mark step as completed
SKIP - Skip step (if optional)
BLOCK - Mark step as blocked
UNBLOCK - Remove blocker from step
FAIL - Mark step as failed
RESTART - Restart step from beginning
```

### Response Schema (200 OK)

```json
{
  "id": "lead_7f8d9e1a2b3c4d5e6f",
  "step_updated": {
    "step_number": 5,
    "name": "Hardware Requirements",
    "previous_status": "IN_PROGRESS",
    "new_status": "COMPLETED",
    "completed_at": "2025-10-09T12:20:00Z",
    "duration_seconds": 300
  },
  "journey_status": "PURCHASING",
  "overall_progress": {
    "current_step": 6,
    "total_steps": 10,
    "completion_percentage": 50,
    "steps_completed": 5,
    "steps_remaining": 5
  },
  "next_step": {
    "step_number": 6,
    "name": "Payment & Purchase",
    "status": "IN_PROGRESS",
    "started_at": "2025-10-09T12:20:00Z",
    "next_actions": [
      {
        "action": "REVIEW_QUOTE",
        "description": "Review your quote and complete payment",
        "url": "/onboarding/payment",
        "priority": "HIGH"
      }
    ]
  },
  "state_transitions": [
    {
      "from_state": "IN_PROGRESS",
      "to_state": "COMPLETED",
      "step": 5,
      "timestamp": "2025-10-09T12:20:00Z"
    },
    {
      "from_state": "NOT_STARTED",
      "to_state": "IN_PROGRESS",
      "step": 6,
      "timestamp": "2025-10-09T12:20:00Z"
    }
  ],
  "notifications_triggered": [
    {
      "type": "EMAIL",
      "recipient": "merchant@example.com",
      "template": "QUOTE_READY",
      "sent_at": "2025-10-09T12:20:00Z"
    }
  ]
}
```

### Error Responses

**422 Unprocessable Entity - Invalid State Transition**
```json
{
  "error": {
    "code": "INVALID_STATE_TRANSITION",
    "message": "Cannot complete step: prerequisites not met",
    "details": {
      "step_number": 6,
      "current_status": "NOT_STARTED",
      "requested_action": "COMPLETE",
      "missing_prerequisites": [
        {
          "step": 4,
          "status": "IN_PROGRESS",
          "required_status": "COMPLETED"
        },
        {
          "step": 5,
          "status": "NOT_STARTED",
          "required_status": "COMPLETED"
        }
      ]
    },
    "timestamp": "2025-10-09T12:20:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

**409 Conflict - Step Already Completed**
```json
{
  "error": {
    "code": "STEP_ALREADY_COMPLETED",
    "message": "Step already marked as completed",
    "details": {
      "step_number": 5,
      "current_status": "COMPLETED",
      "completed_at": "2025-10-09T12:15:00Z"
    },
    "timestamp": "2025-10-09T12:20:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

---

## 3. Get Full Activity Timeline

**Endpoint:** `GET /api/v1/merchants/{id}/timeline`

**Description:** Retrieves comprehensive timeline of all activities, state transitions, and events throughout the onboarding journey.

**Authorization:** `merchant:progress:read` (own data) or `admin:progress`

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Lead/Merchant ID |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `event_types` | string | No | - | Comma-separated event types to filter |
| `from_date` | string | No | - | ISO 8601 timestamp |
| `to_date` | string | No | - | ISO 8601 timestamp |
| `limit` | integer | No | 100 | Max events to return |
| `offset` | integer | No | 0 | Pagination offset |

### Response Schema (200 OK)

```json
{
  "id": "lead_7f8d9e1a2b3c4d5e6f",
  "timeline": [
    {
      "event_id": "evt_001",
      "event_type": "LEAD_CREATED",
      "timestamp": "2025-10-09T11:58:00Z",
      "step_number": 2,
      "actor": {
        "type": "MERCHANT",
        "id": "lead_7f8d9e1a2b3c4d5e6f",
        "name": "John Doe"
      },
      "description": "Lead account created",
      "data": {
        "email": "merchant@example.com",
        "business_category": "RESTAURANT"
      }
    },
    {
      "event_id": "evt_002",
      "event_type": "COHORT_ASSIGNED",
      "timestamp": "2025-10-09T11:58:00Z",
      "step_number": 2,
      "actor": {
        "type": "SYSTEM",
        "id": "routing_engine",
        "name": "Routing Engine"
      },
      "description": "Cohort assigned: ASSISTED",
      "data": {
        "cohort_type": "ASSISTED",
        "selling_plan": "AE_GUIDED",
        "setup_plan": "FREE_IC",
        "reason": "Annual revenue $850K with 6 locations"
      }
    },
    {
      "event_id": "evt_003",
      "event_type": "AE_ASSIGNED",
      "timestamp": "2025-10-09T11:59:00Z",
      "step_number": 2,
      "actor": {
        "type": "SYSTEM",
        "id": "queue_manager",
        "name": "Queue Manager"
      },
      "description": "Account Executive assigned",
      "data": {
        "ae_id": "ae_abc123",
        "ae_name": "Sarah Johnson",
        "ae_email": "sarah.j@lightspeed.com"
      }
    },
    {
      "event_id": "evt_004",
      "event_type": "STEP_STARTED",
      "timestamp": "2025-10-09T12:00:00Z",
      "step_number": 3,
      "actor": {
        "type": "MERCHANT",
        "id": "lead_7f8d9e1a2b3c4d5e6f",
        "name": "John Doe"
      },
      "description": "Started Step 3: KYB Qualification"
    },
    {
      "event_id": "evt_005",
      "event_type": "KYB_SUBMITTED",
      "timestamp": "2025-10-09T12:03:00Z",
      "step_number": 3,
      "actor": {
        "type": "MERCHANT",
        "id": "lead_7f8d9e1a2b3c4d5e6f",
        "name": "John Doe"
      },
      "description": "KYB verification data submitted",
      "data": {
        "kyb_request_id": "kyb_abc123def456",
        "business_name": "John's Fine Dining LLC",
        "ein": "**-***6789"
      }
    },
    {
      "event_id": "evt_006",
      "event_type": "KYB_APPROVED",
      "timestamp": "2025-10-09T12:05:00Z",
      "step_number": 3,
      "actor": {
        "type": "SYSTEM",
        "id": "payments_service",
        "name": "Payments Service"
      },
      "description": "KYB verification approved",
      "data": {
        "kyb_request_id": "kyb_abc123def456",
        "risk_level": "LOW",
        "risk_score": 15
      }
    },
    {
      "event_id": "evt_007",
      "event_type": "STEP_COMPLETED",
      "timestamp": "2025-10-09T12:05:00Z",
      "step_number": 3,
      "actor": {
        "type": "SYSTEM",
        "id": "progress_tracker",
        "name": "Progress Tracker"
      },
      "description": "Completed Step 3: KYB Qualification",
      "data": {
        "duration_seconds": 300
      }
    },
    {
      "event_id": "evt_008",
      "event_type": "AE_CONTACT",
      "timestamp": "2025-10-09T12:06:00Z",
      "step_number": 4,
      "actor": {
        "type": "USER",
        "id": "ae_abc123",
        "name": "Sarah Johnson"
      },
      "description": "AE contacted merchant via phone",
      "data": {
        "contact_method": "PHONE",
        "duration_minutes": 15,
        "outcome": "Discussed software and hardware requirements"
      }
    },
    {
      "event_id": "evt_009",
      "event_type": "STEP_STARTED",
      "timestamp": "2025-10-09T12:05:00Z",
      "step_number": 4,
      "actor": {
        "type": "SYSTEM",
        "id": "progress_tracker",
        "name": "Progress Tracker"
      },
      "description": "Started Step 4: Software Requirements"
    },
    {
      "event_id": "evt_010",
      "event_type": "X_SERIES_PROVISIONED",
      "timestamp": "2025-10-09T12:15:00Z",
      "step_number": 4,
      "actor": {
        "type": "SYSTEM",
        "id": "x_series_service",
        "name": "X-Series Provisioning"
      },
      "description": "X-Series account provisioned",
      "data": {
        "account_id": "xs_account_001",
        "location_licenses": 2,
        "register_licenses": 4
      }
    },
    {
      "event_id": "evt_011",
      "event_type": "STEP_COMPLETED",
      "timestamp": "2025-10-09T12:15:00Z",
      "step_number": 4,
      "actor": {
        "type": "MERCHANT",
        "id": "lead_7f8d9e1a2b3c4d5e6f",
        "name": "John Doe"
      },
      "description": "Completed Step 4: Software Requirements",
      "data": {
        "duration_seconds": 600
      }
    }
  ],
  "summary": {
    "total_events": 11,
    "events_by_type": {
      "STEP_STARTED": 2,
      "STEP_COMPLETED": 2,
      "KYB_SUBMITTED": 1,
      "KYB_APPROVED": 1,
      "COHORT_ASSIGNED": 1,
      "AE_ASSIGNED": 1,
      "AE_CONTACT": 1,
      "X_SERIES_PROVISIONED": 1,
      "LEAD_CREATED": 1
    },
    "events_by_actor_type": {
      "MERCHANT": 4,
      "SYSTEM": 6,
      "USER": 1
    }
  },
  "pagination": {
    "limit": 100,
    "offset": 0,
    "total": 11,
    "has_more": false
  }
}
```

### Event Types

```
LEAD_CREATED - Lead account created
COHORT_ASSIGNED - Cohort assigned to lead
AE_ASSIGNED - AE assigned to lead
IC_ASSIGNED - IC assigned to lead
STEP_STARTED - Step started
STEP_COMPLETED - Step completed
STEP_SKIPPED - Step skipped
STEP_BLOCKED - Step blocked
STEP_FAILED - Step failed
KYB_SUBMITTED - KYB data submitted
KYB_APPROVED - KYB approved
KYB_REJECTED - KYB rejected
KYC_SUBMITTED - KYC data submitted
KYC_APPROVED - KYC approved
KYC_REJECTED - KYC rejected
PAYMENT_PROCESSED - Payment completed
HARDWARE_ORDERED - Hardware order placed
HARDWARE_SHIPPED - Hardware shipped
HARDWARE_DELIVERED - Hardware delivered
X_SERIES_PROVISIONED - X-Series account created
BANK_VERIFIED - Bank account verified
PAYOUT_ACTIVATED - Payouts enabled
AE_CONTACT - AE contacted merchant
IC_SESSION_SCHEDULED - IC session scheduled
IC_SESSION_COMPLETED - IC session completed
DATA_IMPORTED - Historical data imported
STALL_DETECTED - Stall detected
INTERVENTION_TRIGGERED - Manual intervention triggered
JOURNEY_COMPLETED - Full journey completed
JOURNEY_ABANDONED - Journey abandoned
```

---

## 4. Stall Detection and Intervention

**Endpoint:** `GET /api/v1/merchants/stalled`

**Description:** Retrieves list of merchants whose onboarding has stalled based on configurable rules. Used by AE/IC teams for proactive intervention.

**Authorization:** `admin:progress`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `stall_severity` | string | No | - | Filter by severity: LOW, MEDIUM, HIGH, CRITICAL |
| `cohort_type` | string | No | - | Filter by cohort |
| `assigned_to` | string | No | - | Filter by assigned AE/IC |
| `min_days_stalled` | integer | No | 1 | Minimum days of inactivity |
| `step_number` | integer | No | - | Filter by stalled step |
| `limit` | integer | No | 50 | Results per page |
| `offset` | integer | No | 0 | Pagination offset |

### Response Schema (200 OK)

```json
{
  "stalled_merchants": [
    {
      "id": "lead_abc123",
      "email": "merchant@example.com",
      "business_name": "John's Restaurant",
      "cohort": {
        "type": "ASSISTED",
        "selling_plan": "AE_GUIDED"
      },
      "assignment": {
        "ae": {
          "id": "ae_xyz789",
          "name": "Sarah Johnson"
        }
      },
      "stall_info": {
        "severity": "HIGH",
        "current_step": 6,
        "step_name": "Payment & Purchase",
        "step_status": "IN_PROGRESS",
        "days_stalled": 3,
        "hours_since_last_activity": 72,
        "last_activity_at": "2025-10-06T15:30:00Z",
        "last_activity_type": "QUOTE_VIEWED"
      },
      "stall_reasons": [
        {
          "reason": "PAYMENT_NOT_COMPLETED",
          "description": "Quote generated but payment not initiated",
          "potential_cause": "Price concerns, decision delay, or technical issue"
        },
        {
          "reason": "NO_AE_FOLLOWUP",
          "description": "No AE contact in 48+ hours",
          "suggested_action": "AE follow-up call recommended"
        }
      ],
      "recommended_interventions": [
        {
          "intervention_type": "AE_CALL",
          "priority": "HIGH",
          "description": "AE should call to address payment concerns",
          "due_by": "2025-10-09T17:00:00Z"
        },
        {
          "intervention_type": "EMAIL_REMINDER",
          "priority": "MEDIUM",
          "description": "Send payment reminder email with support contact",
          "can_automate": true
        }
      ],
      "journey_summary": {
        "started_at": "2025-10-05T10:00:00Z",
        "days_in_journey": 4,
        "completion_percentage": 50,
        "expected_completion_date": "2025-10-12T10:00:00Z",
        "completion_date_at_risk": true
      }
    },
    {
      "id": "lead_def456",
      "email": "merchant2@example.com",
      "business_name": "Retail Store Co",
      "cohort": {
        "type": "SELF_SERVE",
        "selling_plan": "AUTOMATED"
      },
      "assignment": {
        "ae": null,
        "ic": null
      },
      "stall_info": {
        "severity": "MEDIUM",
        "current_step": 9,
        "step_name": "Hardware Setup",
        "step_status": "IN_PROGRESS",
        "days_stalled": 2,
        "hours_since_last_activity": 48,
        "last_activity_at": "2025-10-07T14:00:00Z",
        "last_activity_type": "HARDWARE_DELIVERY_CONFIRMED"
      },
      "stall_reasons": [
        {
          "reason": "HARDWARE_SETUP_NOT_STARTED",
          "description": "Hardware delivered but setup not initiated",
          "potential_cause": "Unclear setup instructions or technical difficulty"
        }
      ],
      "recommended_interventions": [
        {
          "intervention_type": "IC_OUTREACH",
          "priority": "MEDIUM",
          "description": "Offer free IC session for hardware setup assistance",
          "can_automate": false
        },
        {
          "intervention_type": "SEND_SETUP_GUIDE",
          "priority": "LOW",
          "description": "Send video setup guide and FAQ",
          "can_automate": true
        }
      ],
      "journey_summary": {
        "started_at": "2025-10-02T09:00:00Z",
        "days_in_journey": 7,
        "completion_percentage": 80,
        "expected_completion_date": "2025-10-10T09:00:00Z",
        "completion_date_at_risk": true
      }
    }
  ],
  "summary": {
    "total_stalled": 47,
    "by_severity": {
      "CRITICAL": 5,
      "HIGH": 12,
      "MEDIUM": 18,
      "LOW": 12
    },
    "by_step": {
      "3": 3,
      "6": 15,
      "7": 8,
      "9": 12,
      "10": 9
    },
    "by_cohort": {
      "SELF_SERVE": 20,
      "ASSISTED": 22,
      "MANAGED": 5
    }
  },
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 47,
    "has_more": false
  }
}
```

### Stall Severity Levels

| Severity | Criteria | Recommended Action |
|----------|----------|-------------------|
| LOW | 1-2 days inactive, early steps (1-4) | Automated email reminder |
| MEDIUM | 2-3 days inactive, middle steps (5-7) | AE/IC outreach recommended |
| HIGH | 3-5 days inactive, late steps (8-10) | Immediate AE/IC intervention |
| CRITICAL | 5+ days inactive, payment/activation steps | Urgent escalation, manager review |

### Stall Detection Rules

```javascript
// Rule definitions for stall detection
const stallRules = {
  step_3_kyb: {
    trigger: "KYB submitted, no decision in 24 hours",
    severity: "HIGH",
    intervention: "Check payment service status"
  },
  step_6_payment: {
    trigger: "Quote generated, no payment in 48 hours",
    severity: "HIGH",
    intervention: "AE follow-up call"
  },
  step_7_kyc: {
    trigger: "Payment completed, KYC not submitted in 48 hours",
    severity: "MEDIUM",
    intervention: "Email reminder with KYC link"
  },
  step_9_hardware_setup: {
    trigger: "Hardware delivered, no setup activity in 72 hours",
    severity: "MEDIUM",
    intervention: "Offer IC assistance"
  },
  general_inactivity: {
    trigger: "No activity in current step for 3+ days",
    severity: "varies by step",
    intervention: "Contextual outreach"
  },
  abandoned: {
    trigger: "No activity for 30+ days",
    severity: "CRITICAL",
    intervention: "Mark as abandoned, final outreach"
  }
};
```

---

## 5. Trigger Manual Intervention

**Endpoint:** `POST /api/v1/merchants/{id}/intervention`

**Description:** Manually triggers an intervention action for a stalled merchant. Logs intervention and tracks outcomes.

**Authorization:** `admin:progress`

**Idempotency:** Required via `X-Idempotency-Key` header

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Lead/Merchant ID |

### Request Schema

```json
{
  "intervention_type": "AE_CALL",
  "assigned_to": "ae_xyz789",
  "priority": "HIGH",
  "notes": "Merchant has pricing concerns, needs custom quote discussion",
  "scheduled_for": "2025-10-09T15:00:00Z",
  "context": {
    "stall_reason": "PAYMENT_NOT_COMPLETED",
    "days_stalled": 3,
    "step_number": 6
  }
}
```

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `intervention_type` | enum | Yes | See intervention types | Type of intervention |
| `assigned_to` | string | No | Valid user ID | User assigned to intervention |
| `priority` | enum | Yes | LOW, MEDIUM, HIGH, CRITICAL | Priority level |
| `notes` | string | No | Max 2000 chars | Intervention notes |
| `scheduled_for` | string | No | ISO 8601 timestamp | Scheduled time |
| `context` | object | No | - | Additional context |

### Intervention Types

```
AE_CALL - Account Executive phone call
IC_CALL - Implementation Consultant call
EMAIL_OUTREACH - Personalized email
EMAIL_AUTOMATED - Automated email reminder
SEND_SETUP_GUIDE - Send documentation/guides
OFFER_IC_SESSION - Offer IC assistance
ESCALATE_MANAGER - Escalate to manager
APPLY_DISCOUNT - Apply promotional discount
CUSTOM_QUOTE - Generate custom quote
TECHNICAL_SUPPORT - Assign to technical support
MARK_ABANDONED - Mark journey as abandoned
```

### Response Schema (201 Created)

```json
{
  "intervention_id": "int_abc123",
  "merchant_id": "lead_7f8d9e1a2b3c4d5e6f",
  "intervention_type": "AE_CALL",
  "status": "SCHEDULED",
  "priority": "HIGH",
  "assigned_to": {
    "id": "ae_xyz789",
    "name": "Sarah Johnson",
    "role": "ACCOUNT_EXECUTIVE"
  },
  "scheduled_for": "2025-10-09T15:00:00Z",
  "created_at": "2025-10-09T14:00:00Z",
  "created_by": {
    "id": "admin_001",
    "name": "Operations Manager"
  },
  "context": {
    "stall_reason": "PAYMENT_NOT_COMPLETED",
    "days_stalled": 3,
    "step_number": 6,
    "current_step": "Payment & Purchase"
  },
  "notes": "Merchant has pricing concerns, needs custom quote discussion",
  "expected_outcome": "Payment completed within 24 hours",
  "followup_required": true,
  "followup_due": "2025-10-10T15:00:00Z"
}
```

---

## 6. Get Intervention Status

**Endpoint:** `GET /api/v1/merchants/{id}/interventions`

**Description:** Retrieves all interventions for a merchant and their outcomes.

**Authorization:** `admin:progress`

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Lead/Merchant ID |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | string | No | - | Filter by status: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED |
| `intervention_type` | string | No | - | Filter by intervention type |

### Response Schema (200 OK)

```json
{
  "merchant_id": "lead_7f8d9e1a2b3c4d5e6f",
  "interventions": [
    {
      "intervention_id": "int_abc123",
      "intervention_type": "AE_CALL",
      "status": "COMPLETED",
      "priority": "HIGH",
      "assigned_to": {
        "id": "ae_xyz789",
        "name": "Sarah Johnson"
      },
      "scheduled_for": "2025-10-09T15:00:00Z",
      "completed_at": "2025-10-09T15:25:00Z",
      "outcome": {
        "result": "SUCCESS",
        "description": "Addressed pricing concerns, generated custom quote with 10% discount",
        "next_steps": "Merchant will review quote and pay within 24 hours",
        "merchant_sentiment": "POSITIVE"
      },
      "impact": {
        "journey_resumed": true,
        "step_progressed": true,
        "from_step": 6,
        "to_step": 6,
        "step_status_changed": false
      },
      "created_at": "2025-10-09T14:00:00Z"
    },
    {
      "intervention_id": "int_def456",
      "intervention_type": "EMAIL_AUTOMATED",
      "status": "COMPLETED",
      "priority": "MEDIUM",
      "scheduled_for": "2025-10-07T10:00:00Z",
      "completed_at": "2025-10-07T10:05:00Z",
      "outcome": {
        "result": "NO_RESPONSE",
        "email_opened": true,
        "links_clicked": 0
      },
      "created_at": "2025-10-07T10:00:00Z"
    }
  ],
  "summary": {
    "total_interventions": 2,
    "by_status": {
      "COMPLETED": 2,
      "SCHEDULED": 0
    },
    "by_outcome": {
      "SUCCESS": 1,
      "NO_RESPONSE": 1
    },
    "overall_effectiveness": "MODERATE"
  }
}
```

---

## Implementation Notes

### State Machine Implementation

```python
class OnboardingStateMachine:
    """
    State machine for managing onboarding progress
    """

    STEP_DEPENDENCIES = {
        1: [],
        2: [1],
        3: [2],
        4: [3],  # Requires KYB approved
        5: [4],
        6: [4, 5],
        7: [6],
        8: [7],
        9: [6, 7],  # Requires hardware shipped + KYC approved
        10: [7, 8, 9]
    }

    def can_start_step(self, step_number, completed_steps):
        """Check if step prerequisites are met"""
        dependencies = self.STEP_DEPENDENCIES[step_number]
        return all(dep in completed_steps for dep in dependencies)

    def get_next_step(self, current_step, completed_steps):
        """Determine next step based on current progress"""
        for step in range(current_step + 1, 11):
            if self.can_start_step(step, completed_steps):
                return step
        return None

    def calculate_completion_percentage(self, completed_steps):
        """Calculate overall completion percentage"""
        return (len(completed_steps) / 10) * 100
```

### Stall Detection Algorithm

```python
import datetime

def detect_stalls(merchants):
    """
    Detect stalled merchants and assign severity
    """
    stalled = []

    for merchant in merchants:
        if merchant.journey_status in ['ACTIVE', 'ABANDONED']:
            continue

        hours_inactive = (
            datetime.now() - merchant.last_activity_at
        ).total_seconds() / 3600

        days_inactive = hours_inactive / 24

        # Determine severity based on step and inactivity
        severity = calculate_stall_severity(
            days_inactive,
            merchant.current_step,
            merchant.step_status
        )

        if severity:
            stalled.append({
                'merchant': merchant,
                'severity': severity,
                'days_stalled': days_inactive,
                'recommended_interventions': get_interventions(
                    merchant, severity
                )
            })

    return stalled

def calculate_stall_severity(days_inactive, step, status):
    """Calculate stall severity"""
    # Critical steps (payment, activation)
    if step in [6, 7, 9]:
        if days_inactive >= 3:
            return 'HIGH'
        elif days_inactive >= 2:
            return 'MEDIUM'
        elif days_inactive >= 1:
            return 'LOW'

    # Other steps
    else:
        if days_inactive >= 5:
            return 'HIGH'
        elif days_inactive >= 3:
            return 'MEDIUM'
        elif days_inactive >= 2:
            return 'LOW'

    return None
```

### Performance Optimization

1. **Caching Strategy**
   - Cache progress summary for 30 seconds
   - Cache timeline for 1 minute
   - Invalidate cache on step updates

2. **Database Indexes**
   ```sql
   CREATE INDEX idx_progress_status ON merchant_progress(journey_status, current_step);
   CREATE INDEX idx_last_activity ON merchant_progress(last_activity_at);
   CREATE INDEX idx_cohort_assignment ON merchants(cohort_type, assigned_ae_id);
   ```

3. **Async Processing**
   - Calculate stall detection asynchronously (hourly job)
   - Generate timeline events asynchronously
   - Send notifications in background queue

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-09 | Initial API specification |
