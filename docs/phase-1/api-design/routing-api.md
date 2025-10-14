# Routing and Queue Management API Specification

## Overview
The Routing API manages the assignment and queuing of leads to Account Executives (AEs) and Implementation Consultants (ICs), handles notification triggers, and provides queue visibility for sales and support teams. This API enables intelligent routing based on cohort assignment, availability, and workload distribution.

## Authentication & Authorization

### Authentication Method
- **JWT Bearer Tokens** for AE, IC, and admin access
- **API Keys** for system-to-system integration

### Authorization Levels
- `ae:queue:read` - View AE queue
- `ae:queue:assign` - Assign leads from AE queue
- `ic:queue:read` - View IC queue
- `ic:queue:assign` - Assign merchants to IC sessions
- `admin:routing` - Full access to routing and queue management
- `system:routing` - System-level access for automated routing

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Idempotency-Key: <uuid> (required for POST operations)
```

## Rate Limiting
- **AE/IC requests:** 200 requests/minute per user
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

## AE Queue Management

## 1. Get AE Queue

**Endpoint:** `GET /api/v1/queues/ae`

**Description:** Retrieves the queue of leads awaiting AE assignment or contact. Includes prioritization, SLA tracking, and lead context.

**Authorization:** `ae:queue:read` or `admin:routing`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `assigned_to` | string | No | Current user | Filter by AE user ID (admins only) |
| `status` | string | No | - | Filter by queue status: PENDING, ASSIGNED, CONTACTED, CLOSED |
| `priority` | string | No | - | Filter by priority: LOW, MEDIUM, HIGH, URGENT |
| `cohort_type` | string | No | - | Filter by cohort: ASSISTED, MANAGED |
| `sort` | string | No | `priority` | Sort by: priority, created_at, est_revenue, wait_time |
| `limit` | integer | No | 50 | Results per page (max 100) |
| `offset` | integer | No | 0 | Pagination offset |

### Response Schema (200 OK)

```json
{
  "queue": [
    {
      "queue_entry_id": "qe_abc123",
      "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
      "status": "PENDING",
      "priority": "HIGH",
      "cohort": {
        "type": "MANAGED",
        "selling_plan": "AE_NEGOTIATED",
        "setup_plan": "PAID_IC"
      },
      "lead_info": {
        "email": "merchant@example.com",
        "business_name": "John's Fine Dining LLC",
        "business_category": "RESTAURANT",
        "contact": {
          "name": "John Doe",
          "phone": "+1-555-123-4567",
          "email": "merchant@example.com",
          "preferred_contact_method": "PHONE"
        },
        "profile": {
          "annual_revenue": 2500000,
          "number_of_locations": 12,
          "region": "US"
        }
      },
      "context": {
        "current_step": 2,
        "step_name": "Account Creation",
        "kyb_status": null,
        "quote_value_estimate": 75000,
        "source": {
          "channel": "WEBSITE",
          "campaign_id": "spring_2025",
          "utm_source": "google"
        }
      },
      "timing": {
        "added_to_queue_at": "2025-10-09T12:00:00Z",
        "wait_time_minutes": 5,
        "sla_contact_by": "2025-10-09T12:15:00Z",
        "sla_status": "ON_TIME",
        "time_until_sla_breach_minutes": 10
      },
      "assignment": {
        "assigned_to": null,
        "auto_assign_eligible": true,
        "suggested_ae": {
          "id": "ae_xyz789",
          "name": "Sarah Johnson",
          "reason": "Specializes in restaurant vertical, lowest current workload"
        }
      },
      "communication_history": [],
      "created_at": "2025-10-09T12:00:00Z"
    },
    {
      "queue_entry_id": "qe_def456",
      "lead_id": "lead_abc987xyz654",
      "status": "ASSIGNED",
      "priority": "MEDIUM",
      "cohort": {
        "type": "ASSISTED",
        "selling_plan": "AE_GUIDED",
        "setup_plan": "FREE_IC"
      },
      "lead_info": {
        "email": "owner@retailstore.com",
        "business_name": "Boutique Retail Co",
        "business_category": "RETAIL",
        "contact": {
          "name": "Jane Smith",
          "phone": "+1-555-987-6543",
          "email": "owner@retailstore.com"
        },
        "profile": {
          "annual_revenue": 750000,
          "number_of_locations": 3
        }
      },
      "context": {
        "current_step": 4,
        "step_name": "Software Requirements",
        "kyb_status": "APPROVED",
        "quote_value_estimate": 15000
      },
      "timing": {
        "added_to_queue_at": "2025-10-09T11:30:00Z",
        "wait_time_minutes": 35,
        "sla_contact_by": "2025-10-09T11:45:00Z",
        "sla_status": "BREACHED",
        "time_since_sla_breach_minutes": 20
      },
      "assignment": {
        "assigned_to": {
          "id": "ae_abc123",
          "name": "Mike Wilson",
          "email": "mike.w@lightspeed.com",
          "phone": "+1-555-111-2222"
        },
        "assigned_at": "2025-10-09T11:32:00Z"
      },
      "communication_history": [
        {
          "id": "comm_001",
          "type": "ASSIGNMENT_NOTIFICATION",
          "timestamp": "2025-10-09T11:32:00Z",
          "sent_to": "ae_abc123"
        }
      ],
      "created_at": "2025-10-09T11:30:00Z"
    }
  ],
  "summary": {
    "total_in_queue": 47,
    "by_status": {
      "PENDING": 12,
      "ASSIGNED": 28,
      "CONTACTED": 7,
      "CLOSED": 0
    },
    "by_priority": {
      "URGENT": 3,
      "HIGH": 15,
      "MEDIUM": 22,
      "LOW": 7
    },
    "sla_metrics": {
      "within_sla": 35,
      "at_risk": 8,
      "breached": 4,
      "average_wait_time_minutes": 12,
      "longest_wait_time_minutes": 45
    },
    "estimated_total_value": 1250000
  },
  "current_user": {
    "id": "ae_xyz789",
    "name": "Sarah Johnson",
    "assigned_leads": 15,
    "max_concurrent_leads": 25,
    "capacity_remaining": 10
  },
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 47,
    "has_more": false
  }
}
```

### Queue Status Enum
```
PENDING - Awaiting AE assignment
ASSIGNED - Assigned to AE, awaiting contact
CONTACTED - AE has contacted lead
CLOSED - AE engagement complete (converted or disqualified)
```

### Priority Calculation Logic
```javascript
function calculatePriority(lead) {
  let score = 0;

  // Revenue-based scoring
  if (lead.annual_revenue >= 2000000) score += 40;
  else if (lead.annual_revenue >= 500000) score += 20;
  else score += 10;

  // Cohort-based scoring
  if (lead.cohort_type === 'MANAGED') score += 30;
  else if (lead.cohort_type === 'ASSISTED') score += 20;

  // Time-based urgency
  const waitMinutes = getWaitTime(lead);
  if (waitMinutes > 30) score += 20;
  else if (waitMinutes > 15) score += 10;

  // Source quality
  if (lead.source.channel === 'REFERRAL') score += 10;

  // Priority assignment
  if (score >= 80) return 'URGENT';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}
```

---

## 2. Assign Lead to AE

**Endpoint:** `POST /api/v1/queues/ae/{leadId}/assign`

**Description:** Assigns a lead from the AE queue to a specific AE or to the current user. Triggers notification and SLA tracking.

**Authorization:** `ae:queue:assign` or `admin:routing`

**Idempotency:** Required via `X-Idempotency-Key` header

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `leadId` | string | Yes | Lead ID to assign |

### Request Schema

```json
{
  "assign_to": "ae_xyz789",
  "assignment_reason": "MANUAL",
  "notes": "High-value restaurant lead, needs custom pricing discussion",
  "schedule_callback": {
    "callback_time": "2025-10-09T15:00:00Z",
    "timezone": "America/New_York"
  }
}
```

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `assign_to` | string | No | Valid AE user ID | AE to assign (defaults to current user) |
| `assignment_reason` | enum | No | See enum below | Reason for assignment |
| `notes` | string | No | Max 1000 chars | Assignment notes |
| `schedule_callback` | object | No | - | Scheduled callback details |

### Assignment Reason Enum
```
MANUAL - Manually assigned by user
AUTO_ROUND_ROBIN - Automatically assigned via round-robin
AUTO_SPECIALIZATION - Assigned based on vertical specialization
AUTO_AVAILABILITY - Assigned based on capacity
REASSIGNMENT - Reassigned from another AE
ESCALATION - Escalated from self-serve path
```

### Response Schema (200 OK)

```json
{
  "queue_entry_id": "qe_abc123",
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "assignment": {
    "assigned_to": {
      "id": "ae_xyz789",
      "name": "Sarah Johnson",
      "email": "sarah.j@lightspeed.com",
      "phone": "+1-555-987-6543"
    },
    "assigned_at": "2025-10-09T12:05:00Z",
    "assigned_by": {
      "id": "admin_001",
      "name": "Queue Manager"
    },
    "assignment_reason": "MANUAL"
  },
  "status": "ASSIGNED",
  "priority": "HIGH",
  "sla": {
    "contact_by": "2025-10-09T12:20:00Z",
    "time_to_contact_minutes": 15
  },
  "scheduled_callback": {
    "callback_time": "2025-10-09T15:00:00Z",
    "timezone": "America/New_York",
    "calendar_event_created": true,
    "calendar_event_id": "cal_evt_123"
  },
  "notifications_sent": [
    {
      "type": "EMAIL",
      "recipient": "ae_xyz789",
      "template": "AE_LEAD_ASSIGNMENT",
      "sent_at": "2025-10-09T12:05:00Z"
    },
    {
      "type": "SMS",
      "recipient": "ae_xyz789",
      "message": "New high-priority lead assigned: John Doe - John's Fine Dining LLC",
      "sent_at": "2025-10-09T12:05:00Z"
    }
  ],
  "lead_info": {
    "email": "merchant@example.com",
    "business_name": "John's Fine Dining LLC",
    "contact": {
      "name": "John Doe",
      "phone": "+1-555-123-4567"
    }
  },
  "next_actions": [
    {
      "action": "CONTACT_LEAD",
      "description": "Contact lead within 15 minutes",
      "due_by": "2025-10-09T12:20:00Z",
      "priority": "HIGH"
    },
    {
      "action": "LOG_COMMUNICATION",
      "description": "Log outcome of initial contact",
      "url": "/api/v1/queues/ae/lead_7f8d9e1a2b3c4d5e6f/communication"
    }
  ]
}
```

### Error Responses

**409 Conflict - Already Assigned**
```json
{
  "error": {
    "code": "LEAD_ALREADY_ASSIGNED",
    "message": "Lead is already assigned to another AE",
    "details": {
      "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
      "assigned_to": {
        "id": "ae_abc123",
        "name": "Mike Wilson"
      },
      "assigned_at": "2025-10-09T11:30:00Z",
      "can_reassign": true
    },
    "timestamp": "2025-10-09T12:05:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

**422 Unprocessable Entity - Capacity Exceeded**
```json
{
  "error": {
    "code": "AE_CAPACITY_EXCEEDED",
    "message": "AE has reached maximum concurrent lead capacity",
    "details": {
      "ae_id": "ae_xyz789",
      "current_assigned": 25,
      "max_capacity": 25,
      "can_override": true
    },
    "timestamp": "2025-10-09T12:05:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

---

## 3. Log AE Communication

**Endpoint:** `POST /api/v1/queues/ae/{leadId}/communication`

**Description:** Logs communication between AE and lead. Updates queue status and tracks outcomes.

**Authorization:** `ae:queue:assign` or `admin:routing`

**Idempotency:** Required via `X-Idempotency-Key` header

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `leadId` | string | Yes | Lead ID |

### Request Schema

```json
{
  "communication_type": "PHONE_CALL",
  "outcome": "CONNECTED",
  "duration_minutes": 15,
  "notes": "Discussed software and hardware requirements. Merchant interested in 2 locations with integrated payments. Scheduled follow-up call for Thursday.",
  "next_steps": [
    {
      "action": "GENERATE_QUOTE",
      "due_date": "2025-10-10T12:00:00Z"
    },
    {
      "action": "SCHEDULE_FOLLOWUP",
      "scheduled_for": "2025-10-12T14:00:00Z"
    }
  ],
  "lead_sentiment": "POSITIVE",
  "probability_to_close": 75,
  "estimated_close_date": "2025-10-15T12:00:00Z"
}
```

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `communication_type` | enum | Yes | See enum below | Type of communication |
| `outcome` | enum | Yes | See enum below | Outcome of communication |
| `duration_minutes` | integer | No | 0-999 | Duration in minutes |
| `notes` | string | Yes | 10-2000 chars | Communication notes |
| `next_steps` | array | No | - | Planned next actions |
| `lead_sentiment` | enum | No | VERY_NEGATIVE, NEGATIVE, NEUTRAL, POSITIVE, VERY_POSITIVE | Lead's sentiment |
| `probability_to_close` | integer | No | 0-100 | Estimated close probability % |
| `estimated_close_date` | string | No | ISO 8601 future date | Estimated close date |

### Communication Type Enum
```
PHONE_CALL, EMAIL, SMS, VIDEO_CALL, IN_PERSON, VOICEMAIL
```

### Outcome Enum
```
CONNECTED - Successfully connected and had conversation
NO_ANSWER - Did not answer (voicemail left)
NO_ANSWER_NO_VM - Did not answer, no voicemail
SCHEDULED_CALLBACK - Scheduled callback for later
QUALIFIED - Lead qualified and moving forward
DISQUALIFIED - Lead disqualified
CLOSED_WON - Deal closed/won
CLOSED_LOST - Deal lost
```

### Response Schema (201 Created)

```json
{
  "communication_id": "comm_abc123",
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "queue_entry_id": "qe_abc123",
  "communication_type": "PHONE_CALL",
  "outcome": "CONNECTED",
  "duration_minutes": 15,
  "logged_at": "2025-10-09T12:30:00Z",
  "logged_by": {
    "id": "ae_xyz789",
    "name": "Sarah Johnson"
  },
  "queue_status_updated": {
    "previous_status": "ASSIGNED",
    "new_status": "CONTACTED",
    "updated_at": "2025-10-09T12:30:00Z"
  },
  "sla_metrics": {
    "contact_sla_met": true,
    "time_to_first_contact_minutes": 25,
    "sla_threshold_minutes": 30
  },
  "next_steps_created": [
    {
      "action_id": "act_001",
      "action": "GENERATE_QUOTE",
      "due_date": "2025-10-10T12:00:00Z",
      "status": "PENDING"
    },
    {
      "action_id": "act_002",
      "action": "SCHEDULE_FOLLOWUP",
      "scheduled_for": "2025-10-12T14:00:00Z",
      "calendar_event_id": "cal_evt_456"
    }
  ]
}
```

---

## 4. Trigger AE Notification

**Endpoint:** `POST /api/v1/notifications/ae`

**Description:** Sends notification to AE for various events (new lead, SLA warning, etc.). Used by the system for automated notifications.

**Authorization:** `system:routing` or `admin:routing`

**Idempotency:** Required via `X-Idempotency-Key` header

### Request Schema

```json
{
  "ae_id": "ae_xyz789",
  "notification_type": "NEW_LEAD_ASSIGNED",
  "priority": "HIGH",
  "channels": ["EMAIL", "SMS", "PUSH"],
  "data": {
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "lead_name": "John Doe",
    "business_name": "John's Fine Dining LLC",
    "estimated_value": 75000,
    "contact_by": "2025-10-09T12:15:00Z"
  },
  "template_overrides": {
    "subject": "URGENT: High-value lead assigned - $75K opportunity",
    "custom_message": "Restaurant vertical, 12 locations"
  }
}
```

### Notification Type Enum
```
NEW_LEAD_ASSIGNED - New lead assigned to AE
SLA_WARNING - Approaching SLA deadline
SLA_BREACH - SLA deadline missed
LEAD_ACTIVITY - Lead took action (viewed quote, etc.)
QUOTE_APPROVED - Lead approved quote
PAYMENT_COMPLETED - Lead completed payment
ESCALATION - Lead escalated to AE
CALLBACK_REMINDER - Scheduled callback reminder
```

### Response Schema (202 Accepted)

```json
{
  "notification_id": "notif_abc123",
  "ae_id": "ae_xyz789",
  "notification_type": "NEW_LEAD_ASSIGNED",
  "priority": "HIGH",
  "delivery_status": [
    {
      "channel": "EMAIL",
      "status": "SENT",
      "sent_at": "2025-10-09T12:05:00Z",
      "recipient": "sarah.j@lightspeed.com"
    },
    {
      "channel": "SMS",
      "status": "SENT",
      "sent_at": "2025-10-09T12:05:00Z",
      "recipient": "+1-555-987-6543"
    },
    {
      "channel": "PUSH",
      "status": "SENT",
      "sent_at": "2025-10-09T12:05:00Z",
      "device_count": 2
    }
  ],
  "created_at": "2025-10-09T12:05:00Z"
}
```

---

## IC Queue Management

## 5. Get IC Queue

**Endpoint:** `GET /api/v1/queues/ic`

**Description:** Retrieves the queue of merchants requiring IC support. Includes merchants who need assistance with setup steps (data import, hardware setup, integrations).

**Authorization:** `ic:queue:read` or `admin:routing`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `assigned_to` | string | No | Current user | Filter by IC user ID (admins only) |
| `status` | string | No | - | Filter by status: PENDING, SCHEDULED, IN_SESSION, COMPLETED |
| `support_type` | string | No | - | Filter by support type: DATA_IMPORT, HARDWARE_SETUP, INTEGRATION, GENERAL |
| `cohort_type` | string | No | - | Filter by cohort |
| `urgency` | string | No | - | Filter by urgency: LOW, MEDIUM, HIGH, CRITICAL |
| `step_number` | integer | No | - | Filter by onboarding step |
| `sort` | string | No | `urgency` | Sort by: urgency, created_at, scheduled_date |
| `limit` | integer | No | 50 | Results per page |
| `offset` | integer | No | 0 | Pagination offset |

### Response Schema (200 OK)

```json
{
  "queue": [
    {
      "queue_entry_id": "icq_abc123",
      "merchant_id": "merch_001",
      "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
      "status": "PENDING",
      "support_type": "HARDWARE_SETUP",
      "urgency": "HIGH",
      "cohort": {
        "type": "ASSISTED",
        "setup_plan": "FREE_IC"
      },
      "merchant_info": {
        "email": "merchant@example.com",
        "business_name": "John's Restaurant",
        "contact": {
          "name": "John Doe",
          "phone": "+1-555-123-4567",
          "email": "merchant@example.com",
          "preferred_contact_method": "PHONE"
        }
      },
      "onboarding_context": {
        "current_step": 9,
        "step_name": "Hardware Setup",
        "journey_status": "SETTING_UP",
        "days_in_step": 3,
        "completion_percentage": 80,
        "blockers": [
          {
            "type": "HARDWARE_SETUP_NOT_STARTED",
            "description": "Hardware delivered but setup not initiated",
            "severity": "MEDIUM"
          }
        ]
      },
      "support_details": {
        "requested_services": [
          "Terminal setup",
          "Printer configuration",
          "First test transaction"
        ],
        "estimated_session_duration_minutes": 45,
        "complexity": "MEDIUM",
        "requires_technical_specialist": false
      },
      "hardware_info": {
        "delivery_date": "2025-10-06T14:30:00Z",
        "items": [
          {
            "sku": "LS-TERMINAL-001",
            "name": "Lightspeed Terminal",
            "quantity": 2,
            "setup_status": "NOT_STARTED"
          },
          {
            "sku": "LS-PRINTER-001",
            "name": "Receipt Printer",
            "quantity": 2,
            "setup_status": "NOT_STARTED"
          }
        ]
      },
      "timing": {
        "added_to_queue_at": "2025-10-08T10:00:00Z",
        "wait_time_hours": 50,
        "preferred_schedule": {
          "days": ["MONDAY", "TUESDAY", "WEDNESDAY"],
          "time_range": "9AM-5PM",
          "timezone": "America/New_York"
        }
      },
      "assignment": {
        "assigned_to": null,
        "auto_assign_eligible": true,
        "suggested_ic": {
          "id": "ic_xyz789",
          "name": "Tom Anderson",
          "reason": "Available, restaurant specialization"
        }
      },
      "created_at": "2025-10-08T10:00:00Z"
    },
    {
      "queue_entry_id": "icq_def456",
      "merchant_id": "merch_002",
      "lead_id": "lead_abc987",
      "status": "SCHEDULED",
      "support_type": "DATA_IMPORT",
      "urgency": "MEDIUM",
      "cohort": {
        "type": "MANAGED",
        "setup_plan": "PAID_IC"
      },
      "merchant_info": {
        "email": "owner@retailchain.com",
        "business_name": "Retail Chain Co",
        "contact": {
          "name": "Jane Smith",
          "phone": "+1-555-987-6543"
        }
      },
      "onboarding_context": {
        "current_step": 8,
        "step_name": "Data Import",
        "journey_status": "SETTING_UP",
        "completion_percentage": 70
      },
      "support_details": {
        "requested_services": [
          "Product catalog import (10,000+ SKUs)",
          "Customer database import",
          "Historical sales data"
        ],
        "estimated_session_duration_minutes": 120,
        "complexity": "HIGH",
        "requires_technical_specialist": true
      },
      "session_info": {
        "session_id": "sess_abc123",
        "scheduled_for": "2025-10-09T14:00:00Z",
        "duration_minutes": 120,
        "meeting_url": "https://meet.lightspeed.com/session/sess_abc123",
        "calendar_event_id": "cal_evt_789"
      },
      "assignment": {
        "assigned_to": {
          "id": "ic_abc123",
          "name": "Lisa Martinez",
          "email": "lisa.m@lightspeed.com",
          "specialization": "DATA_IMPORT"
        },
        "assigned_at": "2025-10-08T16:00:00Z"
      },
      "timing": {
        "added_to_queue_at": "2025-10-08T15:00:00Z",
        "wait_time_hours": 23
      },
      "created_at": "2025-10-08T15:00:00Z"
    }
  ],
  "summary": {
    "total_in_queue": 38,
    "by_status": {
      "PENDING": 15,
      "SCHEDULED": 18,
      "IN_SESSION": 3,
      "COMPLETED": 2
    },
    "by_support_type": {
      "DATA_IMPORT": 12,
      "HARDWARE_SETUP": 18,
      "INTEGRATION": 5,
      "GENERAL": 3
    },
    "by_urgency": {
      "CRITICAL": 2,
      "HIGH": 10,
      "MEDIUM": 20,
      "LOW": 6
    },
    "average_wait_time_hours": 28,
    "longest_wait_time_hours": 72
  },
  "current_user": {
    "id": "ic_xyz789",
    "name": "Tom Anderson",
    "scheduled_sessions": 5,
    "available_hours_this_week": 15,
    "specializations": ["HARDWARE_SETUP", "RESTAURANT"]
  },
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 38,
    "has_more": false
  }
}
```

### Support Type Enum
```
DATA_IMPORT - Historical data import assistance
HARDWARE_SETUP - Hardware configuration and testing
INTEGRATION - Third-party integration setup
TRAINING - General training session
TROUBLESHOOTING - Technical issue resolution
GENERAL - General onboarding support
```

### Urgency Calculation
```javascript
function calculateUrgency(merchant) {
  let score = 0;

  // Cohort-based
  if (merchant.cohort_type === 'MANAGED') score += 30;
  else if (merchant.cohort_type === 'ASSISTED') score += 15;

  // Time in step
  if (merchant.days_in_step >= 5) score += 40;
  else if (merchant.days_in_step >= 3) score += 25;
  else if (merchant.days_in_step >= 2) score += 15;

  // Blocker severity
  if (merchant.blockers.some(b => b.severity === 'HIGH')) score += 20;

  // Step criticality
  if ([9, 10].includes(merchant.current_step)) score += 15;

  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}
```

---

## 6. Schedule IC Session

**Endpoint:** `POST /api/v1/scheduling/ic`

**Description:** Schedules an IC session with a merchant. Creates calendar event, sends invitations, and updates queue status.

**Authorization:** `ic:queue:assign` or `admin:routing`

**Idempotency:** Required via `X-Idempotency-Key` header

### Request Schema

```json
{
  "merchant_id": "merch_001",
  "ic_id": "ic_xyz789",
  "session_type": "HARDWARE_SETUP",
  "scheduled_for": "2025-10-10T14:00:00Z",
  "duration_minutes": 60,
  "timezone": "America/New_York",
  "agenda": [
    "Configure payment terminal",
    "Set up receipt printer",
    "Run first test transaction",
    "Verify bank account for payouts"
  ],
  "meeting_platform": "ZOOM",
  "send_invitations": true,
  "notes": "Merchant has 2 terminals to configure"
}
```

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `merchant_id` | string | Yes | Valid merchant ID | Merchant to schedule |
| `ic_id` | string | No | Valid IC user ID | IC to assign (defaults to current user) |
| `session_type` | enum | Yes | See support type enum | Type of session |
| `scheduled_for` | string | Yes | ISO 8601 future timestamp | Session start time |
| `duration_minutes` | integer | Yes | 15-240 | Session duration |
| `timezone` | string | Yes | IANA timezone | Merchant timezone |
| `agenda` | array | No | Array of strings | Session agenda items |
| `meeting_platform` | enum | No | ZOOM, TEAMS, GOOGLE_MEET, PHONE | Platform |
| `send_invitations` | boolean | No | Default: true | Send calendar invitations |
| `notes` | string | No | Max 1000 chars | Session notes |

### Response Schema (201 Created)

```json
{
  "session_id": "sess_abc123",
  "queue_entry_id": "icq_abc123",
  "merchant_id": "merch_001",
  "merchant_info": {
    "email": "merchant@example.com",
    "business_name": "John's Restaurant",
    "contact": {
      "name": "John Doe",
      "phone": "+1-555-123-4567"
    }
  },
  "ic": {
    "id": "ic_xyz789",
    "name": "Tom Anderson",
    "email": "tom.a@lightspeed.com"
  },
  "session_details": {
    "session_type": "HARDWARE_SETUP",
    "scheduled_for": "2025-10-10T14:00:00Z",
    "scheduled_for_local": "2025-10-10T10:00:00-04:00",
    "duration_minutes": 60,
    "timezone": "America/New_York",
    "agenda": [
      "Configure payment terminal",
      "Set up receipt printer",
      "Run first test transaction",
      "Verify bank account for payouts"
    ]
  },
  "meeting": {
    "platform": "ZOOM",
    "meeting_url": "https://zoom.us/j/1234567890",
    "meeting_id": "123-456-7890",
    "meeting_password": "abc123",
    "dial_in_numbers": [
      "+1-555-123-4567"
    ]
  },
  "calendar_events": [
    {
      "recipient": "merchant@example.com",
      "calendar_event_id": "cal_evt_merchant_001",
      "ics_file_url": "https://api.lightspeed.com/calendar/cal_evt_merchant_001.ics",
      "sent_at": "2025-10-09T13:00:00Z"
    },
    {
      "recipient": "tom.a@lightspeed.com",
      "calendar_event_id": "cal_evt_ic_001",
      "ics_file_url": "https://api.lightspeed.com/calendar/cal_evt_ic_001.ics",
      "sent_at": "2025-10-09T13:00:00Z"
    }
  ],
  "notifications_sent": [
    {
      "type": "EMAIL",
      "recipient": "merchant@example.com",
      "template": "IC_SESSION_SCHEDULED",
      "sent_at": "2025-10-09T13:00:00Z"
    },
    {
      "type": "SMS",
      "recipient": "+1-555-123-4567",
      "message": "Your setup session is scheduled for Oct 10 at 10:00 AM EST with Tom Anderson",
      "sent_at": "2025-10-09T13:00:00Z"
    }
  ],
  "queue_updated": {
    "previous_status": "PENDING",
    "new_status": "SCHEDULED"
  },
  "reminders_scheduled": [
    {
      "reminder_type": "EMAIL",
      "send_at": "2025-10-10T12:00:00Z",
      "recipient": "merchant@example.com"
    },
    {
      "reminder_type": "SMS",
      "send_at": "2025-10-10T13:30:00Z",
      "recipient": "+1-555-123-4567"
    }
  ],
  "created_at": "2025-10-09T13:00:00Z"
}
```

---

## 7. Update Session Status

**Endpoint:** `PUT /api/v1/scheduling/ic/sessions/{sessionId}`

**Description:** Updates IC session status (start, complete, cancel, reschedule). Logs session outcomes and updates queue.

**Authorization:** `ic:queue:assign` or `admin:routing`

**Idempotency:** Required via `X-Idempotency-Key` header

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string | Yes | Session ID |

### Request Schema - Start Session

```json
{
  "action": "START",
  "actual_start_time": "2025-10-10T14:02:00Z"
}
```

### Request Schema - Complete Session

```json
{
  "action": "COMPLETE",
  "actual_end_time": "2025-10-10T15:15:00Z",
  "outcome": {
    "status": "SUCCESS",
    "items_completed": [
      "Terminal 1 configured and tested",
      "Terminal 2 configured and tested",
      "Printer 1 configured",
      "Printer 2 configured",
      "Test transaction successful",
      "Bank account verified"
    ],
    "items_pending": [],
    "merchant_satisfaction": 5,
    "requires_followup": false,
    "notes": "All hardware successfully configured. Merchant ready for production."
  }
}
```

### Request Schema - Cancel/Reschedule

```json
{
  "action": "RESCHEDULE",
  "reason": "Merchant requested different time",
  "new_scheduled_time": "2025-10-12T14:00:00Z",
  "send_notifications": true
}
```

### Response Schema (200 OK) - Complete

```json
{
  "session_id": "sess_abc123",
  "status": "COMPLETED",
  "session_summary": {
    "scheduled_for": "2025-10-10T14:00:00Z",
    "actual_start_time": "2025-10-10T14:02:00Z",
    "actual_end_time": "2025-10-10T15:15:00Z",
    "actual_duration_minutes": 73,
    "scheduled_duration_minutes": 60
  },
  "outcome": {
    "status": "SUCCESS",
    "completion_rate": 100,
    "merchant_satisfaction": 5
  },
  "queue_updated": {
    "previous_status": "IN_SESSION",
    "new_status": "COMPLETED",
    "removed_from_queue": true
  },
  "progress_updated": {
    "step_number": 9,
    "previous_status": "IN_PROGRESS",
    "new_status": "COMPLETED",
    "journey_completion_percentage": 90
  },
  "followup_actions": [],
  "updated_at": "2025-10-10T15:15:00Z"
}
```

---

## Implementation Notes

### Auto-Assignment Algorithm

```python
def auto_assign_lead_to_ae(lead):
    """
    Automatically assign lead to best available AE
    """
    # Get available AEs
    aes = get_available_aes()

    # Filter by specialization
    if lead.business_category:
        specialized_aes = [
            ae for ae in aes
            if lead.business_category in ae.specializations
        ]
        if specialized_aes:
            aes = specialized_aes

    # Filter by capacity
    aes_with_capacity = [
        ae for ae in aes
        if ae.current_assigned < ae.max_capacity
    ]

    if not aes_with_capacity:
        # No capacity, use round-robin anyway
        aes_with_capacity = aes

    # Sort by workload (ascending)
    aes_sorted = sorted(
        aes_with_capacity,
        key=lambda ae: ae.current_assigned
    )

    # Return top candidate
    return aes_sorted[0] if aes_sorted else None
```

### SLA Tracking

```python
SLA_THRESHOLDS = {
    'MANAGED': {
        'first_contact': 15,  # minutes
        'quote_delivery': 120,  # minutes
    },
    'ASSISTED': {
        'first_contact': 30,
        'quote_delivery': 240,
    },
    'SELF_SERVE': {
        'first_contact': None,  # No SLA
        'quote_delivery': None,
    }
}

def check_sla_status(queue_entry):
    """Check if queue entry is within SLA"""
    cohort = queue_entry.cohort_type
    threshold = SLA_THRESHOLDS[cohort]['first_contact']

    if not threshold:
        return 'NO_SLA'

    wait_time = (
        datetime.now() - queue_entry.added_to_queue_at
    ).total_seconds() / 60

    if wait_time < threshold * 0.8:
        return 'ON_TIME'
    elif wait_time < threshold:
        return 'AT_RISK'
    else:
        return 'BREACHED'
```

### Notification Preferences

```python
NOTIFICATION_RULES = {
    'NEW_LEAD_ASSIGNED': {
        'URGENT': ['EMAIL', 'SMS', 'PUSH'],
        'HIGH': ['EMAIL', 'PUSH'],
        'MEDIUM': ['EMAIL'],
        'LOW': ['EMAIL']
    },
    'SLA_WARNING': {
        'default': ['EMAIL', 'PUSH']
    },
    'SLA_BREACH': {
        'default': ['EMAIL', 'SMS', 'PUSH']
    }
}
```

### Calendar Integration

The API integrates with calendar systems (Google Calendar, Outlook) via:
- ICS file generation for calendar invites
- Calendar API integration for event creation
- Automated reminder scheduling (24 hours, 30 minutes before)

### Performance Optimization

1. **Queue Caching**
   - Cache queue data for 30 seconds
   - Invalidate on assignment/status changes

2. **Database Indexes**
   ```sql
   CREATE INDEX idx_queue_status ON ae_queue(status, priority, added_at);
   CREATE INDEX idx_queue_assignment ON ae_queue(assigned_to, status);
   CREATE INDEX idx_ic_queue_urgency ON ic_queue(urgency, status, scheduled_for);
   ```

3. **Real-time Updates**
   - Use WebSockets for queue updates to AE/IC dashboards
   - Push notifications for new assignments

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-09 | Initial API specification |
