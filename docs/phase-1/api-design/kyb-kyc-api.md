# KYB/KYC and Payments Integration API Specification

## Overview
The KYB/KYC API handles business verification (Know Your Business), identity verification (Know Your Customer), bank account verification, and payment activation for merchant onboarding. This API integrates with the Lightspeed Payments service and covers Steps 3, 7, and 9 of the onboarding journey.

## Authentication & Authorization

### Authentication Method
- **JWT Bearer Tokens** for merchant access
- **Service-to-Service Auth** using mutual TLS and signed requests for payment service integration

### Authorization Levels
- `merchant:kyb:write` - Submit KYB data
- `merchant:kyb:read` - Read KYB status
- `merchant:kyc:write` - Submit KYC data
- `merchant:kyc:read` - Read KYC status
- `merchant:banking:write` - Submit bank account information
- `payments:admin` - Full access to all payment operations
- `system:webhooks` - Receive webhook callbacks

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
X-Idempotency-Key: <uuid> (required for POST operations)
X-Request-ID: <uuid> (for distributed tracing)
```

## Security Considerations

### PII and Sensitive Data
- **SSN, EIN, Bank Account Numbers** must be encrypted in transit (TLS 1.3+)
- Sensitive fields are masked in responses (e.g., `ssn: "***-**-1234"`)
- Full data only accessible by payment service backend
- PCI DSS Level 1 compliance required for card data handling

### Data Retention
- KYB/KYC data retained for 7 years (regulatory requirement)
- Bank account verification data retained for audit trail
- Merchant can request data deletion after account closure (with legal review)

## Rate Limiting
- **Merchant requests:** 20 requests/minute per merchant
- **System integration:** 500 requests/minute
- **Webhook delivery:** No rate limit, but exponential backoff on failures

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
| 409 | `CONFLICT` | Duplicate submission or state conflict |
| 422 | `UNPROCESSABLE_ENTITY` | Business validation failed |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |
| 502 | `PAYMENT_SERVICE_ERROR` | Downstream payment service error |
| 503 | `SERVICE_UNAVAILABLE` | Service temporarily unavailable |

---

## API Endpoints

## 1. Submit KYB Data (Step 3)

**Endpoint:** `POST /api/v1/payments/kyb`

**Description:** Submits business entity information for Know Your Business verification. This is a critical gate before hardware purchase. Called during Step 3: Qualify for LS Payments.

**Authorization:** `merchant:kyb:write`

**Idempotency:** Required via `X-Idempotency-Key` header

### Request Schema

```json
{
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "business": {
    "legal_name": "John's Fine Dining LLC",
    "dba_name": "John's Restaurant",
    "business_structure": "LLC",
    "ein": "12-3456789",
    "formation_date": "2020-01-15",
    "business_category": "RESTAURANT",
    "mcc": "5812",
    "website": "https://johnsrestaurant.com",
    "business_description": "Full-service restaurant offering contemporary American cuisine",
    "registered_address": {
      "line1": "123 Main St",
      "line2": "Suite 100",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102",
      "country": "US"
    },
    "phone": "+1-555-123-4567",
    "email": "info@johnsrestaurant.com"
  },
  "business_metrics": {
    "annual_revenue": 850000,
    "average_transaction_size": 75,
    "monthly_transaction_volume": 10000,
    "highest_transaction_size": 500
  },
  "regulatory": {
    "accepts_international_payments": false,
    "high_risk_industry": false,
    "requires_age_verification": true,
    "sells_tobacco": false,
    "sells_alcohol": true
  }
}
```

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `lead_id` | string | Yes | Valid lead ID | Associated lead |
| `business.legal_name` | string | Yes | 1-200 chars | Legal business name |
| `business.dba_name` | string | No | 1-200 chars | Doing Business As name |
| `business.business_structure` | enum | Yes | See enum below | Legal entity type |
| `business.ein` | string | Yes | XX-XXXXXXX format | Employer Identification Number |
| `business.formation_date` | string | Yes | ISO 8601 date, past date | Date business formed |
| `business.business_category` | enum | Yes | See PRD categories | Business vertical |
| `business.mcc` | string | Yes | 4-digit MCC code | Merchant Category Code |
| `business.website` | string | No | Valid URL | Business website |
| `business.business_description` | string | Yes | 50-500 chars | Description of business |
| `business.registered_address` | object | Yes | Valid US address | Legal business address |
| `business.phone` | string | Yes | E.164 format | Business phone |
| `business.email` | string | Yes | Valid email | Business email |
| `business_metrics.annual_revenue` | integer | Yes | > 0 | Annual revenue in USD |
| `business_metrics.average_transaction_size` | integer | Yes | > 0 | Average transaction in USD |
| `business_metrics.monthly_transaction_volume` | integer | Yes | > 0 | Monthly transaction count |
| `business_metrics.highest_transaction_size` | integer | Yes | > 0 | Highest expected transaction |
| `regulatory.*` | boolean | Yes | - | Regulatory flags |

### Business Structure Enum
```
SOLE_PROPRIETORSHIP, PARTNERSHIP, LLC, C_CORPORATION,
S_CORPORATION, NON_PROFIT, GOVERNMENT
```

### Response Schema (202 Accepted)

```json
{
  "kyb_request_id": "kyb_abc123def456",
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "status": "PENDING",
  "submitted_at": "2025-10-09T12:00:00Z",
  "expected_decision_at": "2025-10-09T12:05:00Z",
  "processing_time_estimate_seconds": 300,
  "verification_steps": [
    {
      "step": "BUSINESS_REGISTRY_CHECK",
      "status": "IN_PROGRESS",
      "description": "Verifying business with state registry"
    },
    {
      "step": "EIN_VERIFICATION",
      "status": "IN_PROGRESS",
      "description": "Validating EIN with IRS database"
    },
    {
      "step": "OFAC_SCREENING",
      "status": "PENDING",
      "description": "Screening against sanctions lists"
    },
    {
      "step": "RISK_ASSESSMENT",
      "status": "PENDING",
      "description": "Automated risk scoring"
    }
  ],
  "next_steps": {
    "action": "WAIT",
    "message": "Your business verification is in progress. You'll receive an email when complete.",
    "can_proceed": false,
    "check_status_url": "/api/v1/payments/kyb/kyb_abc123def456/status"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `kyb_request_id` | string | Unique KYB request identifier |
| `status` | enum | PENDING, IN_REVIEW, APPROVED, REJECTED, REQUIRES_INFO |
| `submitted_at` | string | ISO 8601 timestamp |
| `expected_decision_at` | string | ISO 8601 timestamp (estimate) |
| `verification_steps` | array | Individual verification checks |
| `next_steps.action` | enum | WAIT, PROVIDE_INFO, CONTACT_SUPPORT, PROCEED |
| `next_steps.can_proceed` | boolean | Whether merchant can continue onboarding |

### Error Responses

**409 Conflict - Duplicate Submission**
```json
{
  "error": {
    "code": "KYB_ALREADY_SUBMITTED",
    "message": "KYB verification already in progress for this lead",
    "details": {
      "existing_kyb_request_id": "kyb_existing123",
      "status": "PENDING",
      "submitted_at": "2025-10-09T11:50:00Z"
    },
    "timestamp": "2025-10-09T12:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

**422 Unprocessable Entity - Validation Failed**
```json
{
  "error": {
    "code": "KYB_VALIDATION_FAILED",
    "message": "Business information validation failed",
    "details": {
      "field_errors": {
        "business.ein": ["EIN format invalid. Expected XX-XXXXXXX"],
        "business.registered_address": ["Unable to verify address. Please check and resubmit."],
        "business_metrics.annual_revenue": ["Revenue too low for payment processing (minimum $10,000)"]
      }
    },
    "timestamp": "2025-10-09T12:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

---

## 2. Get KYB Status

**Endpoint:** `GET /api/v1/payments/kyb/{kyb_request_id}/status`

**Description:** Retrieves current status of KYB verification request. Merchants poll this endpoint or receive webhook updates.

**Authorization:** `merchant:kyb:read`

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `kyb_request_id` | string | Yes | KYB request ID (format: `kyb_*`) |

### Response Schema (200 OK) - Pending

```json
{
  "kyb_request_id": "kyb_abc123def456",
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "status": "PENDING",
  "submitted_at": "2025-10-09T12:00:00Z",
  "updated_at": "2025-10-09T12:02:00Z",
  "verification_steps": [
    {
      "step": "BUSINESS_REGISTRY_CHECK",
      "status": "COMPLETED",
      "completed_at": "2025-10-09T12:01:00Z",
      "result": "VERIFIED"
    },
    {
      "step": "EIN_VERIFICATION",
      "status": "COMPLETED",
      "completed_at": "2025-10-09T12:02:00Z",
      "result": "VERIFIED"
    },
    {
      "step": "OFAC_SCREENING",
      "status": "IN_PROGRESS",
      "description": "Screening against sanctions lists"
    },
    {
      "step": "RISK_ASSESSMENT",
      "status": "PENDING",
      "description": "Automated risk scoring"
    }
  ],
  "next_steps": {
    "action": "WAIT",
    "message": "Verification in progress. Expected completion in 3 minutes.",
    "can_proceed": false
  }
}
```

### Response Schema (200 OK) - Approved

```json
{
  "kyb_request_id": "kyb_abc123def456",
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "status": "APPROVED",
  "submitted_at": "2025-10-09T12:00:00Z",
  "updated_at": "2025-10-09T12:05:00Z",
  "decision_at": "2025-10-09T12:05:00Z",
  "risk_assessment": {
    "risk_level": "LOW",
    "risk_score": 15,
    "risk_factors": []
  },
  "verification_steps": [
    {
      "step": "BUSINESS_REGISTRY_CHECK",
      "status": "COMPLETED",
      "result": "VERIFIED"
    },
    {
      "step": "EIN_VERIFICATION",
      "status": "COMPLETED",
      "result": "VERIFIED"
    },
    {
      "step": "OFAC_SCREENING",
      "status": "COMPLETED",
      "result": "CLEAR"
    },
    {
      "step": "RISK_ASSESSMENT",
      "status": "COMPLETED",
      "result": "LOW_RISK"
    }
  ],
  "approved_services": [
    "CARD_PRESENT",
    "CARD_NOT_PRESENT",
    "ACH"
  ],
  "processing_limits": {
    "daily_limit": 50000,
    "monthly_limit": 1000000,
    "per_transaction_limit": 5000
  },
  "next_steps": {
    "action": "PROCEED",
    "message": "Your business is approved for Lightspeed Payments. Continue to purchase hardware.",
    "can_proceed": true,
    "next_step_url": "/onboarding/step/4"
  }
}
```

### Response Schema (200 OK) - Rejected

```json
{
  "kyb_request_id": "kyb_abc123def456",
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "status": "REJECTED",
  "submitted_at": "2025-10-09T12:00:00Z",
  "updated_at": "2025-10-09T12:05:00Z",
  "decision_at": "2025-10-09T12:05:00Z",
  "rejection_reasons": [
    {
      "code": "HIGH_RISK_INDUSTRY",
      "message": "Business category not currently supported for payment processing",
      "severity": "CRITICAL"
    },
    {
      "code": "OFAC_MATCH",
      "message": "Business or owner appears on sanctions list",
      "severity": "CRITICAL"
    }
  ],
  "appeal_available": false,
  "next_steps": {
    "action": "CONTACT_SUPPORT",
    "message": "Unfortunately, we cannot process payments for your business at this time. Contact support for more information.",
    "can_proceed": false,
    "support_email": "merchant-support@lightspeed.com"
  }
}
```

### Response Schema (200 OK) - Requires Additional Information

```json
{
  "kyb_request_id": "kyb_abc123def456",
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "status": "REQUIRES_INFO",
  "submitted_at": "2025-10-09T12:00:00Z",
  "updated_at": "2025-10-09T12:05:00Z",
  "required_information": [
    {
      "field": "business.formation_documents",
      "type": "DOCUMENT_UPLOAD",
      "description": "Please upload Articles of Incorporation or LLC Formation documents",
      "required_by": "2025-10-12T12:00:00Z"
    },
    {
      "field": "business.business_license",
      "type": "DOCUMENT_UPLOAD",
      "description": "Please upload your business license or permit",
      "required_by": "2025-10-12T12:00:00Z"
    }
  ],
  "next_steps": {
    "action": "PROVIDE_INFO",
    "message": "We need additional documentation to verify your business. Please upload the requested documents.",
    "can_proceed": false,
    "upload_url": "/api/v1/payments/kyb/kyb_abc123def456/documents"
  }
}
```

### Status Enum
```
PENDING - Initial submission, verification in progress
IN_REVIEW - Manual review required
APPROVED - KYB verification approved
REJECTED - KYB verification rejected
REQUIRES_INFO - Additional information needed
EXPIRED - Request expired (no response within timeframe)
```

---

## 3. Submit KYC Data (Step 7)

**Endpoint:** `POST /api/v1/payments/kyc`

**Description:** Submits identity verification data for business representatives and owners. Called during Step 7: Lightspeed Payments Activation. Multiple individuals may need to be verified.

**Authorization:** `merchant:kyc:write`

**Idempotency:** Required via `X-Idempotency-Key` header

### Request Schema

```json
{
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "kyb_request_id": "kyb_abc123def456",
  "persons": [
    {
      "person_type": "REPRESENTATIVE",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@johnsrestaurant.com",
      "phone": "+1-555-123-4567",
      "date_of_birth": "1980-05-15",
      "ssn": "123-45-6789",
      "ownership_percentage": 100,
      "title": "CEO",
      "address": {
        "line1": "456 Oak Ave",
        "line2": "Apt 2B",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94103",
        "country": "US"
      },
      "is_control_person": true
    },
    {
      "person_type": "OWNER",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@example.com",
      "phone": "+1-555-987-6543",
      "date_of_birth": "1985-08-22",
      "ssn": "987-65-4321",
      "ownership_percentage": 40,
      "title": "COO",
      "address": {
        "line1": "789 Pine St",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94104",
        "country": "US"
      },
      "is_control_person": true
    }
  ],
  "locations": [
    {
      "location_number": 1,
      "dba_name": "John's Restaurant Downtown",
      "address": {
        "line1": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94102",
        "country": "US"
      },
      "phone": "+1-555-111-2222",
      "is_primary": true
    },
    {
      "location_number": 2,
      "dba_name": "John's Restaurant Marina",
      "address": {
        "line1": "555 Beach St",
        "city": "San Francisco",
        "state": "CA",
        "postal_code": "94123",
        "country": "US"
      },
      "phone": "+1-555-333-4444",
      "is_primary": false
    }
  ]
}
```

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `lead_id` | string | Yes | Valid lead ID | Associated lead |
| `kyb_request_id` | string | Yes | Valid KYB ID, status=APPROVED | Associated KYB request |
| `persons` | array | Yes | 1-10 persons | Business representatives and owners |
| `persons[].person_type` | enum | Yes | REPRESENTATIVE, OWNER, BENEFICIAL_OWNER | Person's role |
| `persons[].first_name` | string | Yes | 1-100 chars | First name |
| `persons[].last_name` | string | Yes | 1-100 chars | Last name |
| `persons[].email` | string | Yes | Valid email | Email address |
| `persons[].phone` | string | Yes | E.164 format | Phone number |
| `persons[].date_of_birth` | string | Yes | ISO 8601 date, 18+ years old | Date of birth |
| `persons[].ssn` | string | Yes | XXX-XX-XXXX format | Social Security Number |
| `persons[].ownership_percentage` | integer | Yes | 0-100 | Ownership % (0 for representatives) |
| `persons[].title` | string | Yes | 1-100 chars | Job title/role |
| `persons[].address` | object | Yes | Valid US address | Residential address |
| `persons[].is_control_person` | boolean | Yes | - | Has significant control over business |
| `locations` | array | Yes | 1-100 locations | Business locations for processing |
| `locations[].location_number` | integer | Yes | Unique per request | Location identifier |
| `locations[].dba_name` | string | Yes | 1-200 chars | Location DBA name |
| `locations[].address` | object | Yes | Valid address | Location address |
| `locations[].phone` | string | Yes | E.164 format | Location phone |
| `locations[].is_primary` | boolean | Yes | One must be true | Primary location flag |

### Validation Rules
- All persons with 25%+ ownership must be included
- At least one REPRESENTATIVE required
- Total ownership percentages should sum to ~100% (tolerance: +/- 5%)
- SSN must be unique across all KYC submissions
- At least one location required

### Response Schema (202 Accepted)

```json
{
  "kyc_request_id": "kyc_xyz789abc123",
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "kyb_request_id": "kyb_abc123def456",
  "status": "PENDING",
  "submitted_at": "2025-10-09T13:00:00Z",
  "expected_decision_at": "2025-10-09T13:10:00Z",
  "persons_submitted": [
    {
      "person_id": "per_rep123",
      "person_type": "REPRESENTATIVE",
      "name": "John Doe",
      "status": "PENDING",
      "verification_steps": [
        {
          "step": "IDENTITY_VERIFICATION",
          "status": "IN_PROGRESS"
        },
        {
          "step": "OFAC_SCREENING",
          "status": "PENDING"
        },
        {
          "step": "CREDIT_CHECK",
          "status": "PENDING"
        }
      ]
    },
    {
      "person_id": "per_own456",
      "person_type": "OWNER",
      "name": "Jane Smith",
      "status": "PENDING",
      "verification_steps": [
        {
          "step": "IDENTITY_VERIFICATION",
          "status": "IN_PROGRESS"
        },
        {
          "step": "OFAC_SCREENING",
          "status": "PENDING"
        }
      ]
    }
  ],
  "locations_submitted": [
    {
      "location_id": "loc_001",
      "location_number": 1,
      "dba_name": "John's Restaurant Downtown",
      "status": "PENDING_ACTIVATION"
    },
    {
      "location_id": "loc_002",
      "location_number": 2,
      "dba_name": "John's Restaurant Marina",
      "status": "PENDING_ACTIVATION"
    }
  ],
  "next_steps": {
    "action": "WAIT",
    "message": "Identity verification in progress. Payments will be activated once approved.",
    "can_proceed": true,
    "can_process_payments": false,
    "check_status_url": "/api/v1/payments/kyc/kyc_xyz789abc123/status"
  }
}
```

### Error Responses

**422 Unprocessable Entity - KYB Not Approved**
```json
{
  "error": {
    "code": "KYB_NOT_APPROVED",
    "message": "Cannot submit KYC until KYB is approved",
    "details": {
      "kyb_request_id": "kyb_abc123def456",
      "kyb_status": "PENDING",
      "required_status": "APPROVED"
    },
    "timestamp": "2025-10-09T13:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

**422 Unprocessable Entity - Ownership Mismatch**
```json
{
  "error": {
    "code": "OWNERSHIP_VALIDATION_FAILED",
    "message": "Ownership percentages validation failed",
    "details": {
      "total_ownership": 85,
      "expected_range": "95-105",
      "missing_owners": "Owners with 25%+ ownership must be included"
    },
    "timestamp": "2025-10-09T13:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

---

## 4. Get KYC Status

**Endpoint:** `GET /api/v1/payments/kyc/{kyc_request_id}/status`

**Description:** Retrieves current status of KYC verification for all submitted persons and payment activation status.

**Authorization:** `merchant:kyc:read`

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `kyc_request_id` | string | Yes | KYC request ID (format: `kyc_*`) |

### Response Schema (200 OK) - Approved

```json
{
  "kyc_request_id": "kyc_xyz789abc123",
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "status": "APPROVED",
  "submitted_at": "2025-10-09T13:00:00Z",
  "updated_at": "2025-10-09T13:10:00Z",
  "decision_at": "2025-10-09T13:10:00Z",
  "persons": [
    {
      "person_id": "per_rep123",
      "person_type": "REPRESENTATIVE",
      "name": "John D***",
      "status": "APPROVED",
      "verified_at": "2025-10-09T13:08:00Z",
      "verification_steps": [
        {
          "step": "IDENTITY_VERIFICATION",
          "status": "COMPLETED",
          "result": "VERIFIED"
        },
        {
          "step": "OFAC_SCREENING",
          "status": "COMPLETED",
          "result": "CLEAR"
        },
        {
          "step": "CREDIT_CHECK",
          "status": "COMPLETED",
          "result": "APPROVED"
        }
      ]
    },
    {
      "person_id": "per_own456",
      "person_type": "OWNER",
      "name": "Jane S***",
      "status": "APPROVED",
      "verified_at": "2025-10-09T13:09:00Z",
      "verification_steps": [
        {
          "step": "IDENTITY_VERIFICATION",
          "status": "COMPLETED",
          "result": "VERIFIED"
        },
        {
          "step": "OFAC_SCREENING",
          "status": "COMPLETED",
          "result": "CLEAR"
        }
      ]
    }
  ],
  "payment_activation": {
    "status": "ACTIVATED_PENDING_BANK",
    "activated_at": "2025-10-09T13:10:00Z",
    "can_accept_payments": true,
    "payouts_enabled": false,
    "payout_hold_reason": "BANK_ACCOUNT_NOT_VERIFIED",
    "locations": [
      {
        "location_id": "loc_001",
        "dba_name": "John's Restaurant Downtown",
        "payment_status": "ACTIVE",
        "merchant_account_id": "mcht_acc_001",
        "activated_at": "2025-10-09T13:10:00Z"
      },
      {
        "location_id": "loc_002",
        "dba_name": "John's Restaurant Marina",
        "payment_status": "ACTIVE",
        "merchant_account_id": "mcht_acc_002",
        "activated_at": "2025-10-09T13:10:00Z"
      }
    ]
  },
  "next_steps": {
    "action": "PROCEED",
    "message": "Payments activated! Complete bank account verification to enable payouts.",
    "can_proceed": true,
    "next_step": "BANK_VERIFICATION",
    "next_step_url": "/onboarding/step/9"
  }
}
```

### Response Schema (200 OK) - Requires Manual Review

```json
{
  "kyc_request_id": "kyc_xyz789abc123",
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "status": "IN_REVIEW",
  "submitted_at": "2025-10-09T13:00:00Z",
  "updated_at": "2025-10-09T13:10:00Z",
  "persons": [
    {
      "person_id": "per_rep123",
      "person_type": "REPRESENTATIVE",
      "name": "John D***",
      "status": "IN_REVIEW",
      "review_reasons": [
        {
          "code": "IDENTITY_MISMATCH",
          "message": "Unable to automatically verify identity. Manual review required.",
          "severity": "MEDIUM"
        }
      ],
      "required_documents": [
        {
          "type": "GOVERNMENT_ID",
          "description": "Please upload a copy of your driver's license or passport",
          "upload_url": "/api/v1/payments/kyc/kyc_xyz789abc123/persons/per_rep123/documents"
        }
      ]
    }
  ],
  "payment_activation": {
    "status": "PENDING_REVIEW",
    "can_accept_payments": false,
    "payouts_enabled": false
  },
  "next_steps": {
    "action": "PROVIDE_INFO",
    "message": "Please upload requested documents for identity verification.",
    "can_proceed": true,
    "estimated_review_time": "24-48 hours"
  }
}
```

---

## 5. Verify Bank Account (Step 9)

**Endpoint:** `POST /api/v1/payments/bank-verification`

**Description:** Submits bank account information for payout verification. Called during Step 9: Setup Hardware. Enables payouts after verification completes.

**Authorization:** `merchant:banking:write`

**Idempotency:** Required via `X-Idempotency-Key` header

### Request Schema

```json
{
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "kyc_request_id": "kyc_xyz789abc123",
  "bank_account": {
    "account_holder_name": "John's Fine Dining LLC",
    "account_type": "BUSINESS_CHECKING",
    "routing_number": "123456789",
    "account_number": "9876543210",
    "bank_name": "Chase Bank",
    "verification_method": "MICRO_DEPOSIT"
  },
  "payout_preferences": {
    "payout_schedule": "DAILY",
    "minimum_payout_amount": 100
  }
}
```

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `lead_id` | string | Yes | Valid lead ID | Associated lead |
| `kyc_request_id` | string | Yes | Valid KYC ID, status=APPROVED | Associated KYC request |
| `bank_account.account_holder_name` | string | Yes | Must match business name | Account holder name |
| `bank_account.account_type` | enum | Yes | BUSINESS_CHECKING, BUSINESS_SAVINGS | Account type |
| `bank_account.routing_number` | string | Yes | 9 digits, valid routing number | ABA routing number |
| `bank_account.account_number` | string | Yes | 4-17 digits | Bank account number |
| `bank_account.bank_name` | string | No | 1-100 chars | Bank name (auto-detected) |
| `bank_account.verification_method` | enum | Yes | MICRO_DEPOSIT, INSTANT | Verification method |
| `payout_preferences.payout_schedule` | enum | No | DAILY, WEEKLY, MONTHLY | Payout frequency |
| `payout_preferences.minimum_payout_amount` | integer | No | >= 0 | Minimum payout threshold |

### Account Type Enum
```
BUSINESS_CHECKING, BUSINESS_SAVINGS
```

### Verification Method Enum
```
MICRO_DEPOSIT - Send two small deposits for verification (2-3 business days)
INSTANT - Instant verification via Plaid/banking partner (immediate)
```

### Response Schema (202 Accepted) - Micro-Deposit Method

```json
{
  "bank_verification_id": "bank_ver_abc123",
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "status": "PENDING_VERIFICATION",
  "bank_account": {
    "account_id": "bank_acc_xyz789",
    "account_holder_name": "John's Fine Dining LLC",
    "account_type": "BUSINESS_CHECKING",
    "routing_number": "123456789",
    "account_number_last4": "3210",
    "bank_name": "Chase Bank"
  },
  "verification": {
    "method": "MICRO_DEPOSIT",
    "status": "DEPOSITS_SENT",
    "deposits_sent_at": "2025-10-09T14:00:00Z",
    "expected_arrival": "2025-10-11T09:00:00Z",
    "verification_deadline": "2025-10-19T14:00:00Z",
    "attempts_remaining": 3
  },
  "next_steps": {
    "action": "WAIT_AND_VERIFY",
    "message": "Two small deposits will arrive in 2-3 business days. Enter the amounts to verify your account.",
    "verify_url": "/api/v1/payments/bank-verification/bank_ver_abc123/verify-amounts"
  }
}
```

### Response Schema (200 OK) - Instant Verification

```json
{
  "bank_verification_id": "bank_ver_abc123",
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "status": "VERIFIED",
  "bank_account": {
    "account_id": "bank_acc_xyz789",
    "account_holder_name": "John's Fine Dining LLC",
    "account_type": "BUSINESS_CHECKING",
    "routing_number": "123456789",
    "account_number_last4": "3210",
    "bank_name": "Chase Bank"
  },
  "verification": {
    "method": "INSTANT",
    "status": "VERIFIED",
    "verified_at": "2025-10-09T14:00:00Z"
  },
  "payout_status": {
    "enabled": true,
    "enabled_at": "2025-10-09T14:00:00Z",
    "schedule": "DAILY",
    "next_payout_date": "2025-10-10T09:00:00Z"
  },
  "next_steps": {
    "action": "PROCEED",
    "message": "Bank account verified! Payouts are now enabled.",
    "can_process_payments": true,
    "payouts_enabled": true
  }
}
```

### Error Responses

**422 Unprocessable Entity - Invalid Bank Account**
```json
{
  "error": {
    "code": "INVALID_BANK_ACCOUNT",
    "message": "Bank account validation failed",
    "details": {
      "field_errors": {
        "bank_account.routing_number": ["Invalid routing number"],
        "bank_account.account_holder_name": ["Name does not match business name on file"]
      }
    },
    "timestamp": "2025-10-09T14:00:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

---

## 6. Verify Micro-Deposit Amounts

**Endpoint:** `POST /api/v1/payments/bank-verification/{bank_verification_id}/verify-amounts`

**Description:** Verifies bank account by confirming micro-deposit amounts sent to the account.

**Authorization:** `merchant:banking:write`

**Idempotency:** Required via `X-Idempotency-Key` header

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bank_verification_id` | string | Yes | Bank verification ID |

### Request Schema

```json
{
  "deposit_amount_1": 32,
  "deposit_amount_2": 45
}
```

### Request Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `deposit_amount_1` | integer | Yes | 1-99 cents | First deposit amount |
| `deposit_amount_2` | integer | Yes | 1-99 cents | Second deposit amount |

### Response Schema (200 OK) - Success

```json
{
  "bank_verification_id": "bank_ver_abc123",
  "status": "VERIFIED",
  "verified_at": "2025-10-11T10:30:00Z",
  "payout_status": {
    "enabled": true,
    "enabled_at": "2025-10-11T10:30:00Z",
    "schedule": "DAILY",
    "next_payout_date": "2025-10-12T09:00:00Z"
  },
  "next_steps": {
    "action": "PROCEED",
    "message": "Bank account verified! Payouts are now enabled.",
    "payouts_enabled": true
  }
}
```

### Response Schema (422 Unprocessable Entity) - Failed

```json
{
  "error": {
    "code": "VERIFICATION_FAILED",
    "message": "Deposit amounts do not match",
    "details": {
      "attempts_remaining": 2,
      "max_attempts": 3,
      "lockout_message": "After 3 failed attempts, you'll need to re-submit bank account information."
    },
    "timestamp": "2025-10-11T10:30:00Z",
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d"
  }
}
```

---

## 7. Activate Payouts

**Endpoint:** `POST /api/v1/payments/activate-payouts`

**Description:** Manually triggers payout activation after all verification steps complete. Typically called automatically by the system, but can be called manually if needed.

**Authorization:** `payments:admin` or `system:integration`

### Request Schema

```json
{
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "kyc_request_id": "kyc_xyz789abc123",
  "bank_verification_id": "bank_ver_abc123"
}
```

### Response Schema (200 OK)

```json
{
  "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
  "merchant_id": "merch_001",
  "payout_status": {
    "enabled": true,
    "enabled_at": "2025-10-11T10:35:00Z",
    "schedule": "DAILY",
    "next_payout_date": "2025-10-12T09:00:00Z"
  },
  "payment_status": {
    "can_accept_payments": true,
    "payouts_enabled": true,
    "fully_activated": true
  },
  "locations": [
    {
      "location_id": "loc_001",
      "merchant_account_id": "mcht_acc_001",
      "payment_status": "FULLY_ACTIVE",
      "payouts_enabled": true
    },
    {
      "location_id": "loc_002",
      "merchant_account_id": "mcht_acc_002",
      "payment_status": "FULLY_ACTIVE",
      "payouts_enabled": true
    }
  ]
}
```

---

## Webhook Events

All webhook events are delivered via POST to merchant-configured webhook URLs with the following structure:

### Webhook Delivery Headers
```
Content-Type: application/json
X-Webhook-Signature: sha256=<hmac_signature>
X-Webhook-ID: <unique_event_id>
X-Webhook-Timestamp: <unix_timestamp>
X-Webhook-Retry: <retry_attempt_number>
```

### Webhook Signature Verification
```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

---

## 8. KYB Decision Webhook

**Event Type:** `kyb.decision`

**Trigger:** When KYB verification completes (approved, rejected, or requires info)

### Webhook Payload

```json
{
  "event_id": "evt_webhook_123",
  "event_type": "kyb.decision",
  "timestamp": "2025-10-09T12:05:00Z",
  "data": {
    "kyb_request_id": "kyb_abc123def456",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "status": "APPROVED",
    "decision_at": "2025-10-09T12:05:00Z",
    "risk_assessment": {
      "risk_level": "LOW",
      "risk_score": 15
    },
    "approved_services": [
      "CARD_PRESENT",
      "CARD_NOT_PRESENT",
      "ACH"
    ],
    "processing_limits": {
      "daily_limit": 50000,
      "monthly_limit": 1000000
    }
  }
}
```

---

## 9. KYC Decision Webhook

**Event Type:** `kyc.decision`

**Trigger:** When KYC verification completes for all persons

### Webhook Payload

```json
{
  "event_id": "evt_webhook_124",
  "event_type": "kyc.decision",
  "timestamp": "2025-10-09T13:10:00Z",
  "data": {
    "kyc_request_id": "kyc_xyz789abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "status": "APPROVED",
    "decision_at": "2025-10-09T13:10:00Z",
    "persons": [
      {
        "person_id": "per_rep123",
        "status": "APPROVED"
      },
      {
        "person_id": "per_own456",
        "status": "APPROVED"
      }
    ],
    "payment_activation": {
      "status": "ACTIVATED_PENDING_BANK",
      "can_accept_payments": true,
      "payouts_enabled": false
    }
  }
}
```

---

## 10. Bank Verification Webhook

**Event Type:** `bank.verified`

**Trigger:** When bank account verification completes

### Webhook Payload

```json
{
  "event_id": "evt_webhook_125",
  "event_type": "bank.verified",
  "timestamp": "2025-10-11T10:30:00Z",
  "data": {
    "bank_verification_id": "bank_ver_abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "status": "VERIFIED",
    "verified_at": "2025-10-11T10:30:00Z",
    "payout_status": {
      "enabled": true,
      "enabled_at": "2025-10-11T10:30:00Z",
      "schedule": "DAILY"
    }
  }
}
```

---

## 11. Payout Activated Webhook

**Event Type:** `payout.activated`

**Trigger:** When payouts are fully enabled for all locations

### Webhook Payload

```json
{
  "event_id": "evt_webhook_126",
  "event_type": "payout.activated",
  "timestamp": "2025-10-11T10:35:00Z",
  "data": {
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
    "activated_at": "2025-10-11T10:35:00Z",
    "payout_schedule": "DAILY",
    "next_payout_date": "2025-10-12T09:00:00Z",
    "locations": [
      {
        "location_id": "loc_001",
        "merchant_account_id": "mcht_acc_001"
      },
      {
        "location_id": "loc_002",
        "merchant_account_id": "mcht_acc_002"
      }
    ]
  }
}
```

---

## Implementation Notes

### KYB/KYC Processing Flow

```
1. Submit KYB (Step 3)
   ↓
2. KYB Automated Checks (30 sec - 5 min)
   - Business registry verification
   - EIN verification
   - OFAC screening
   - Risk assessment
   ↓
3. KYB Decision → Webhook
   - APPROVED → Continue to purchase
   - REJECTED → End flow
   - REQUIRES_INFO → Request documents
   ↓
4. Purchase Hardware/Software (Steps 4-6)
   ↓
5. Submit KYC (Step 7)
   ↓
6. KYC Automated Checks (1-10 min)
   - Identity verification per person
   - OFAC screening per person
   - Credit checks
   ↓
7. KYC Decision → Webhook
   - APPROVED → Activate payments (no payouts yet)
   - IN_REVIEW → Request documents
   ↓
8. Payments Active, Payouts Held
   ↓
9. Submit Bank Account (Step 9)
   ↓
10. Bank Verification
    - Instant: Immediate
    - Micro-deposit: 2-3 days
    ↓
11. Payouts Activated → Webhook
```

### Security Best Practices

1. **PII Encryption**
   - Encrypt SSN, account numbers at rest
   - Use field-level encryption in database
   - Mask sensitive data in logs and responses

2. **API Security**
   - Implement request signing for service-to-service calls
   - Use short-lived JWT tokens (15 min)
   - Rotate API keys quarterly
   - Implement IP whitelisting for webhooks

3. **Webhook Security**
   - Always verify webhook signatures
   - Implement replay attack prevention (timestamp check)
   - Use HTTPS only for webhook endpoints
   - Implement idempotency for webhook processing

4. **Compliance**
   - Log all KYB/KYC decisions for audit trail
   - Retain data for 7 years (PATRIOT Act)
   - Implement data deletion workflows (GDPR)
   - Monitor for suspicious activity patterns

### Error Handling Strategy

1. **Retry Logic**
   - Implement exponential backoff for payment service calls
   - Max 3 retries for verification requests
   - Queue failed webhooks for retry (max 7 days)

2. **Graceful Degradation**
   - If payment service unavailable, queue requests
   - Show estimated processing time to merchant
   - Send email notification when verification completes

3. **Monitoring**
   - Alert on KYB/KYC approval rate drops
   - Monitor verification processing times
   - Track webhook delivery success rates
   - Alert on high rejection rates by category

### Performance Optimization

1. **Caching**
   - Cache KYB/KYC status for 1 minute
   - Cache bank verification status for 30 seconds
   - Invalidate on webhook receipt

2. **Async Processing**
   - All verification checks are asynchronous
   - Use job queue for verification processing
   - Implement webhook for status updates

3. **Database Optimization**
   - Index: `lead_id`, `kyb_request_id`, `kyc_request_id`, `status`
   - Partition large tables by date
   - Archive completed verifications after 90 days

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-09 | Initial API specification |
