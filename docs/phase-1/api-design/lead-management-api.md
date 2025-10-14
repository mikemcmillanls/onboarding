# Lead Management API Specification

## Overview
The Lead Management API handles lead creation, merchant data management, cohort assignment, and profile updates throughout the onboarding journey. This API serves as the foundation for Steps 2-4 of the merchant onboarding process.

## Authentication & Authorization

### Authentication Method
- **JWT Bearer Tokens** for authenticated merchant and internal system access
- **API Keys** for system-to-system integration (e.g., marketing site, CRM)

### Authorization Levels
- `merchant:read` - Read own lead/merchant data
- `merchant:write` - Update own lead/merchant data
- `admin:leads` - Full access to all leads (AE, IC, admin users)
- `system:integration` - System-level access for automated processes

### Headers
```
Authorization: Bearer <jwt_token>
X-API-Key: <api_key>
Content-Type: application/json
X-Idempotency-Key: <uuid> (required for POST/PUT operations)
```

## Rate Limiting
- **Merchant/User requests:** 100 requests/minute per user
- **System integration:** 1000 requests/minute per API key
- **Rate limit headers returned:**
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1633024800
  ```

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

### Standard Error Codes
| HTTP Status | Error Code | Description |
|------------|------------|-------------|
| 400 | `INVALID_REQUEST` | Request validation failed |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource conflict (duplicate, state conflict) |
| 422 | `UNPROCESSABLE_ENTITY` | Business logic validation failed |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |
| 503 | `SERVICE_UNAVAILABLE` | Service temporarily unavailable |

---

## API Endpoints

## 1. Create Lead

**Endpoint:** `POST /api/v1/leads`

**Description:** Creates a new lead record during Step 2 (Account Creation). This endpoint implements intelligent routing logic to assign selling plans based on merchant profile.

**Authorization:** Public (with rate limiting) or `system:integration`

**Idempotency:** Required via `X-Idempotency-Key` header

### Request Schema

```json
{
  "email": "merchant@example.com",
  "password": "string",
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1-555-123-4567",
    "business_category": "RESTAURANT",
    "business_type": "LLC",
    "annual_revenue": 750000,
    "number_of_locations": 5,
    "region": "US",
    "language": "en"
  },
  "source": {
    "channel": "WEBSITE",
    "campaign_id": "spring_2025",
    "price_bracket": "STANDARD",
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "brand"
  }
}
```

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `email` | string | Yes | Valid email format, unique | Merchant email address |
| `password` | string | Yes | Min 8 chars, 1 uppercase, 1 number, 1 special | Account password |
| `profile.first_name` | string | Yes | 1-100 chars | First name |
| `profile.last_name` | string | Yes | 1-100 chars | Last name |
| `profile.phone` | string | Yes | E.164 format | Contact phone |
| `profile.business_category` | enum | Yes | See categories below | Business vertical |
| `profile.business_type` | enum | Yes | See types below | Legal structure |
| `profile.annual_revenue` | integer | Yes | >= 0 | Estimated annual revenue (USD) |
| `profile.number_of_locations` | integer | Yes | >= 1 | Number of business locations |
| `profile.region` | string | Yes | ISO 3166-1 alpha-2 | Country code |
| `profile.language` | string | Yes | ISO 639-1 | Preferred language |
| `source.channel` | enum | No | WEBSITE, PARTNER, REFERRAL, SALES_CALL | Lead source |
| `source.campaign_id` | string | No | Max 100 chars | Marketing campaign ID |
| `source.price_bracket` | enum | No | STARTER, STANDARD, PREMIUM | Initial price bracket interest |
| `source.utm_*` | string | No | Max 255 chars | UTM parameters |

### Business Category Enum
```
RESTAURANT, RETAIL, GOLF, HOSPITALITY, PROFESSIONAL_SERVICES,
HEALTH_BEAUTY, AUTOMOTIVE, OTHER
```

### Business Type Enum
```
SOLE_PROPRIETORSHIP, PARTNERSHIP, LLC, CORPORATION,
S_CORPORATION, NON_PROFIT, OTHER
```

### Response Schema (201 Created)

```json
{
  "id": "lead_7f8d9e1a2b3c4d5e6f",
  "merchant_id": null,
  "email": "merchant@example.com",
  "status": "PENDING_QUALIFICATION",
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1-555-123-4567",
    "business_category": "RESTAURANT",
    "business_type": "LLC",
    "annual_revenue": 750000,
    "number_of_locations": 5,
    "region": "US",
    "language": "en"
  },
  "cohort": {
    "type": "ASSISTED",
    "selling_plan": "AE_GUIDED",
    "setup_plan": "FREE_IC",
    "assigned_at": "2025-10-09T12:00:00Z",
    "assignment_reason": "Annual revenue $750K with 5 locations qualifies for assisted path"
  },
  "routing": {
    "next_step": "AE_ASSIGNMENT",
    "ae_queue_position": 3,
    "estimated_contact_time": "2025-10-09T12:15:00Z",
    "can_self_schedule": true,
    "scheduling_url": "https://app.lightspeed.com/schedule/ae?token=abc123"
  },
  "source": {
    "channel": "WEBSITE",
    "campaign_id": "spring_2025",
    "price_bracket": "STANDARD"
  },
  "created_at": "2025-10-09T12:00:00Z",
  "updated_at": "2025-10-09T12:00:00Z"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique lead identifier (prefix: `lead_`) |
| `merchant_id` | string\|null | Merchant ID after conversion (null for leads) |
| `status` | enum | Current lead status (see status enum) |
| `cohort.type` | enum | SELF_SERVE, ASSISTED, MANAGED |
| `cohort.selling_plan` | enum | AUTOMATED, AE_GUIDED, AE_NEGOTIATED |
| `cohort.setup_plan` | enum | SELF_SERVE, FREE_IC, PAID_IC |
| `routing.next_step` | enum | Next action required (KYB_QUALIFICATION, AE_ASSIGNMENT, etc.) |
| `routing.ae_queue_position` | integer\|null | Position in AE queue (if applicable) |

### Status Enum
```
PENDING_QUALIFICATION - Lead created, awaiting KYB
QUALIFIED - KYB approved, ready for purchase
DISQUALIFIED - KYB rejected
AE_ASSIGNED - Assigned to AE
IN_PURCHASE - Actively purchasing
PURCHASED - Payment completed
CONVERTED - Fully onboarded merchant
ABANDONED - Lead abandoned/expired
```

### Error Responses

**400 Bad Request - Validation Error**
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Request validation failed",
    "details": {
      "field_errors": {
        "email": ["Email already exists"],
        "profile.phone": ["Invalid phone number format"],
        "profile.annual_revenue": ["Must be a positive number"]
      }
    },
    "timestamp": "2025-10-09T12:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

**409 Conflict - Duplicate Email**
```json
{
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "An account with this email already exists",
    "details": {
      "email": "merchant@example.com",
      "existing_lead_id": "lead_existing123",
      "suggested_action": "LOGIN"
    },
    "timestamp": "2025-10-09T12:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

**429 Rate Limit Exceeded**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many lead creation attempts. Please try again later.",
    "details": {
      "retry_after": 60,
      "limit": "5 requests per minute"
    },
    "timestamp": "2025-10-09T12:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

---

## 2. Get Lead Details

**Endpoint:** `GET /api/v1/leads/{id}`

**Description:** Retrieves comprehensive lead information including profile, cohort assignment, progress status, and next steps.

**Authorization:** `merchant:read` (own data) or `admin:leads`

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Lead ID (format: `lead_*`) |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `include` | string | No | - | Comma-separated relations to include: `timeline,documents,ae_notes` |

### Response Schema (200 OK)

```json
{
  "id": "lead_7f8d9e1a2b3c4d5e6f",
  "merchant_id": null,
  "email": "merchant@example.com",
  "status": "QUALIFIED",
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1-555-123-4567",
    "business_category": "RESTAURANT",
    "business_type": "LLC",
    "annual_revenue": 750000,
    "number_of_locations": 5,
    "region": "US",
    "language": "en"
  },
  "business": {
    "legal_name": "John's Fine Dining LLC",
    "dba_name": "John's Restaurant",
    "ein": "12-3456789",
    "business_structure": "LLC",
    "registered_address": {
      "line1": "123 Main St",
      "line2": "Suite 100",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102",
      "country": "US"
    },
    "kyb_status": "APPROVED",
    "kyb_completed_at": "2025-10-09T12:05:00Z"
  },
  "cohort": {
    "type": "ASSISTED",
    "selling_plan": "AE_GUIDED",
    "setup_plan": "FREE_IC",
    "assigned_at": "2025-10-09T12:00:00Z",
    "assignment_reason": "Annual revenue $750K with 5 locations qualifies for assisted path",
    "can_override": false
  },
  "assignment": {
    "ae": {
      "id": "ae_abc123",
      "name": "Sarah Johnson",
      "email": "sarah.j@lightspeed.com",
      "phone": "+1-555-987-6543",
      "assigned_at": "2025-10-09T12:01:00Z"
    },
    "ic": null
  },
  "progress": {
    "current_step": 4,
    "total_steps": 10,
    "completed_steps": [1, 2, 3],
    "next_step": {
      "number": 4,
      "name": "Define Software Requirements",
      "description": "Configure subscription and provision X-Series account"
    },
    "completion_percentage": 30
  },
  "source": {
    "channel": "WEBSITE",
    "campaign_id": "spring_2025",
    "price_bracket": "STANDARD",
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "brand"
  },
  "created_at": "2025-10-09T12:00:00Z",
  "updated_at": "2025-10-09T12:05:00Z",
  "qualified_at": "2025-10-09T12:05:00Z",
  "expires_at": "2025-11-09T12:00:00Z"
}
```

### With Timeline Included (`?include=timeline`)

```json
{
  "id": "lead_7f8d9e1a2b3c4d5e6f",
  // ... standard fields ...
  "timeline": [
    {
      "id": "evt_123",
      "event_type": "LEAD_CREATED",
      "timestamp": "2025-10-09T12:00:00Z",
      "actor": {
        "type": "SYSTEM",
        "id": null,
        "name": "Automated System"
      },
      "data": {
        "cohort_assigned": "ASSISTED"
      }
    },
    {
      "id": "evt_124",
      "event_type": "KYB_SUBMITTED",
      "timestamp": "2025-10-09T12:03:00Z",
      "actor": {
        "type": "MERCHANT",
        "id": "lead_7f8d9e1a2b3c4d5e6f",
        "name": "John Doe"
      },
      "data": {
        "kyb_request_id": "kyb_xyz789"
      }
    },
    {
      "id": "evt_125",
      "event_type": "KYB_APPROVED",
      "timestamp": "2025-10-09T12:05:00Z",
      "actor": {
        "type": "SYSTEM",
        "id": "payments_service",
        "name": "Payments Service"
      },
      "data": {
        "kyb_request_id": "kyb_xyz789",
        "risk_score": 25
      }
    },
    {
      "id": "evt_126",
      "event_type": "AE_ASSIGNED",
      "timestamp": "2025-10-09T12:01:00Z",
      "actor": {
        "type": "SYSTEM",
        "id": "routing_engine",
        "name": "Routing Engine"
      },
      "data": {
        "ae_id": "ae_abc123",
        "ae_name": "Sarah Johnson"
      }
    }
  ]
}
```

### Error Responses

**404 Not Found**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Lead not found",
    "details": {
      "lead_id": "lead_invalid"
    },
    "timestamp": "2025-10-09T12:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

**403 Forbidden**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this lead",
    "details": {
      "required_permission": "admin:leads"
    },
    "timestamp": "2025-10-09T12:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

---

## 3. Update Lead Data

**Endpoint:** `PUT /api/v1/leads/{id}`

**Description:** Updates lead profile information. Supports partial updates. Re-evaluates cohort assignment if revenue or location data changes.

**Authorization:** `merchant:write` (own data) or `admin:leads`

**Idempotency:** Required via `X-Idempotency-Key` header

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Lead ID (format: `lead_*`) |

### Request Schema

```json
{
  "profile": {
    "phone": "+1-555-999-8888",
    "annual_revenue": 850000,
    "number_of_locations": 6
  },
  "business": {
    "legal_name": "John's Fine Dining LLC",
    "dba_name": "John's Restaurant",
    "ein": "12-3456789",
    "business_structure": "LLC",
    "registered_address": {
      "line1": "123 Main St",
      "line2": "Suite 100",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102",
      "country": "US"
    }
  }
}
```

### Request Fields

All fields are optional (partial update supported). Only include fields to be updated.

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `profile.phone` | string | E.164 format | Contact phone |
| `profile.annual_revenue` | integer | >= 0 | Updated revenue estimate |
| `profile.number_of_locations` | integer | >= 1 | Updated location count |
| `business.legal_name` | string | 1-200 chars | Legal business name |
| `business.dba_name` | string | 1-200 chars | DBA name |
| `business.ein` | string | Valid EIN format | Employer ID |
| `business.business_structure` | enum | See business type enum | Legal structure |
| `business.registered_address.*` | object | Valid address | Business address |

### Response Schema (200 OK)

```json
{
  "id": "lead_7f8d9e1a2b3c4d5e6f",
  "merchant_id": null,
  "email": "merchant@example.com",
  "status": "QUALIFIED",
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1-555-999-8888",
    "business_category": "RESTAURANT",
    "business_type": "LLC",
    "annual_revenue": 850000,
    "number_of_locations": 6,
    "region": "US",
    "language": "en"
  },
  "business": {
    "legal_name": "John's Fine Dining LLC",
    "dba_name": "John's Restaurant",
    "ein": "12-3456789",
    "business_structure": "LLC",
    "registered_address": {
      "line1": "123 Main St",
      "line2": "Suite 100",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102",
      "country": "US"
    }
  },
  "cohort": {
    "type": "ASSISTED",
    "selling_plan": "AE_GUIDED",
    "setup_plan": "FREE_IC",
    "assigned_at": "2025-10-09T12:00:00Z",
    "assignment_reason": "Annual revenue $850K with 6 locations qualifies for assisted path",
    "reassigned": false
  },
  "created_at": "2025-10-09T12:00:00Z",
  "updated_at": "2025-10-09T12:10:00Z"
}
```

### Cohort Reassignment Logic

When critical fields change (annual_revenue, number_of_locations), the system may reassign the cohort:

**Response with Cohort Change (200 OK)**
```json
{
  "id": "lead_7f8d9e1a2b3c4d5e6f",
  // ... other fields ...
  "cohort": {
    "type": "MANAGED",
    "selling_plan": "AE_NEGOTIATED",
    "setup_plan": "PAID_IC",
    "assigned_at": "2025-10-09T12:10:00Z",
    "assignment_reason": "Annual revenue $2.5M with 12 locations qualifies for managed path",
    "reassigned": true,
    "previous_cohort": {
      "type": "ASSISTED",
      "assigned_at": "2025-10-09T12:00:00Z"
    }
  },
  "updated_at": "2025-10-09T12:10:00Z"
}
```

### Error Responses

**400 Bad Request - Invalid State**
```json
{
  "error": {
    "code": "INVALID_STATE",
    "message": "Cannot update lead in current status",
    "details": {
      "current_status": "CONVERTED",
      "reason": "Lead has been converted to merchant. Use merchant API to update."
    },
    "timestamp": "2025-10-09T12:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

**422 Unprocessable Entity - Business Validation**
```json
{
  "error": {
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Business validation failed",
    "details": {
      "field_errors": {
        "business.ein": ["EIN already exists for another merchant"],
        "business.registered_address": ["Address validation failed: invalid postal code"]
      }
    },
    "timestamp": "2025-10-09T12:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

---

## 4. Assign Cohort to Lead

**Endpoint:** `POST /api/v1/leads/{id}/cohort`

**Description:** Manually assigns or overrides cohort assignment for a lead. Typically used by AEs/ICs to override automated cohort logic.

**Authorization:** `admin:leads` (AE, IC, or admin users only)

**Idempotency:** Required via `X-Idempotency-Key` header

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Lead ID (format: `lead_*`) |

### Request Schema

```json
{
  "cohort_type": "MANAGED",
  "selling_plan": "AE_NEGOTIATED",
  "setup_plan": "PAID_IC",
  "reason": "High-value opportunity with complex integration needs",
  "override_automated": true
}
```

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `cohort_type` | enum | Yes | SELF_SERVE, ASSISTED, MANAGED | Cohort classification |
| `selling_plan` | enum | Yes | AUTOMATED, AE_GUIDED, AE_NEGOTIATED | Sales approach |
| `setup_plan` | enum | Yes | SELF_SERVE, FREE_IC, PAID_IC | Implementation support level |
| `reason` | string | Yes | 10-500 chars | Justification for assignment/override |
| `override_automated` | boolean | No | Default: false | Whether this overrides automated assignment |

### Cohort Type Rules

| Cohort | Valid Selling Plans | Valid Setup Plans |
|--------|-------------------|------------------|
| SELF_SERVE | AUTOMATED | SELF_SERVE |
| ASSISTED | AE_GUIDED | SELF_SERVE, FREE_IC |
| MANAGED | AE_GUIDED, AE_NEGOTIATED | FREE_IC, PAID_IC |

### Response Schema (200 OK)

```json
{
  "id": "lead_7f8d9e1a2b3c4d5e6f",
  "cohort": {
    "type": "MANAGED",
    "selling_plan": "AE_NEGOTIATED",
    "setup_plan": "PAID_IC",
    "assigned_at": "2025-10-09T12:15:00Z",
    "assigned_by": {
      "id": "user_ae123",
      "name": "Sarah Johnson",
      "role": "ACCOUNT_EXECUTIVE"
    },
    "assignment_reason": "High-value opportunity with complex integration needs",
    "is_override": true,
    "automated_recommendation": {
      "type": "ASSISTED",
      "selling_plan": "AE_GUIDED",
      "setup_plan": "FREE_IC",
      "reason": "Annual revenue $850K with 6 locations"
    }
  },
  "routing": {
    "next_step": "AE_ASSIGNMENT",
    "requires_ae": true,
    "requires_ic": true
  },
  "updated_at": "2025-10-09T12:15:00Z"
}
```

### Error Responses

**422 Unprocessable Entity - Invalid Combination**
```json
{
  "error": {
    "code": "INVALID_COHORT_COMBINATION",
    "message": "Invalid selling plan and setup plan combination",
    "details": {
      "cohort_type": "SELF_SERVE",
      "selling_plan": "AE_NEGOTIATED",
      "reason": "SELF_SERVE cohort cannot use AE_NEGOTIATED selling plan",
      "valid_combinations": [
        {
          "cohort_type": "SELF_SERVE",
          "selling_plan": "AUTOMATED",
          "setup_plan": "SELF_SERVE"
        }
      ]
    },
    "timestamp": "2025-10-09T12:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

**403 Forbidden - Insufficient Permissions**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to assign cohorts",
    "details": {
      "required_permission": "admin:leads",
      "current_permissions": ["merchant:read", "merchant:write"]
    },
    "timestamp": "2025-10-09T12:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

---

## 5. List Leads

**Endpoint:** `GET /api/v1/leads`

**Description:** Retrieves a paginated list of leads with filtering and sorting capabilities. Used by AEs/ICs to view their queues and by admins for monitoring.

**Authorization:** `admin:leads`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | string | No | - | Filter by status (comma-separated for multiple) |
| `cohort_type` | string | No | - | Filter by cohort: SELF_SERVE, ASSISTED, MANAGED |
| `assigned_to` | string | No | - | Filter by assigned AE/IC user ID |
| `created_after` | string | No | - | ISO 8601 timestamp |
| `created_before` | string | No | - | ISO 8601 timestamp |
| `search` | string | No | - | Search by email, name, business name |
| `sort` | string | No | `created_at` | Sort field: created_at, updated_at, annual_revenue |
| `order` | string | No | `desc` | Sort order: asc, desc |
| `page` | integer | No | 1 | Page number (1-indexed) |
| `limit` | integer | No | 25 | Results per page (max 100) |

### Response Schema (200 OK)

```json
{
  "data": [
    {
      "id": "lead_7f8d9e1a2b3c4d5e6f",
      "email": "merchant@example.com",
      "status": "QUALIFIED",
      "profile": {
        "first_name": "John",
        "last_name": "Doe",
        "business_category": "RESTAURANT",
        "annual_revenue": 850000,
        "number_of_locations": 6
      },
      "cohort": {
        "type": "ASSISTED",
        "selling_plan": "AE_GUIDED",
        "setup_plan": "FREE_IC"
      },
      "assignment": {
        "ae": {
          "id": "ae_abc123",
          "name": "Sarah Johnson"
        }
      },
      "created_at": "2025-10-09T12:00:00Z",
      "updated_at": "2025-10-09T12:10:00Z"
    }
    // ... more leads
  ],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total_results": 150,
    "total_pages": 6,
    "has_next": true,
    "has_previous": false
  },
  "filters_applied": {
    "status": ["QUALIFIED"],
    "cohort_type": "ASSISTED"
  }
}
```

---

## OpenAPI Schema Summary

```yaml
openapi: 3.0.0
info:
  title: Lead Management API
  version: 1.0.0
  description: API for managing merchant leads and cohort assignments

servers:
  - url: https://api.lightspeed.com/v1
    description: Production
  - url: https://api.staging.lightspeed.com/v1
    description: Staging

security:
  - BearerAuth: []
  - ApiKeyAuth: []

paths:
  /leads:
    post:
      summary: Create Lead
      operationId: createLead
      tags: [Leads]
      security:
        - ApiKeyAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateLeadRequest'
      responses:
        '201':
          description: Lead created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LeadResponse'
    get:
      summary: List Leads
      operationId: listLeads
      tags: [Leads]
      security:
        - BearerAuth: []
      parameters:
        - $ref: '#/components/parameters/StatusFilter'
        - $ref: '#/components/parameters/CohortFilter'
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/Limit'
      responses:
        '200':
          description: Leads retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LeadListResponse'

  /leads/{id}:
    get:
      summary: Get Lead Details
      operationId: getLead
      tags: [Leads]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Lead details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LeadResponse'
    put:
      summary: Update Lead
      operationId: updateLead
      tags: [Leads]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateLeadRequest'
      responses:
        '200':
          description: Lead updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LeadResponse'

  /leads/{id}/cohort:
    post:
      summary: Assign Cohort
      operationId: assignCohort
      tags: [Leads]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AssignCohortRequest'
      responses:
        '200':
          description: Cohort assigned successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CohortResponse'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
```

---

## Implementation Notes

### Idempotency Handling
- All state-changing operations (POST, PUT) require `X-Idempotency-Key` header
- Idempotency keys are valid for 24 hours
- Duplicate requests with same key return cached response (same status code and body)
- Store: `{idempotency_key: {response_status, response_body, created_at}}`

### Cohort Assignment Logic

```python
def assign_cohort(lead):
    annual_revenue = lead.profile.annual_revenue
    num_locations = lead.profile.number_of_locations

    # Managed tier
    if annual_revenue >= 2_000_000 or num_locations >= 10:
        return {
            'type': 'MANAGED',
            'selling_plan': 'AE_NEGOTIATED',
            'setup_plan': 'PAID_IC'
        }

    # Assisted tier
    elif annual_revenue >= 500_000 or num_locations >= 3:
        return {
            'type': 'ASSISTED',
            'selling_plan': 'AE_GUIDED',
            'setup_plan': 'FREE_IC'
        }

    # Self-serve tier
    else:
        return {
            'type': 'SELF_SERVE',
            'selling_plan': 'AUTOMATED',
            'setup_plan': 'SELF_SERVE'
        }
```

### Data Validation Best Practices
- Validate email format and check uniqueness before creating lead
- Normalize phone numbers to E.164 format
- Validate EIN format: XX-XXXXXXX
- Validate addresses using address verification service (Google Maps, SmartyStreets)
- Sanitize all string inputs to prevent XSS

### Audit Logging
All API operations should be logged with:
- Request ID / Trace ID
- User/System actor
- Timestamp
- Operation type
- Changed fields (for updates)
- IP address
- User agent

### Performance Considerations
- Index fields: `email`, `status`, `cohort.type`, `assignment.ae.id`, `created_at`
- Cache lead details for 5 minutes
- Invalidate cache on updates
- Use database read replicas for GET operations
- Implement pagination for all list endpoints

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-09 | Initial API specification |
