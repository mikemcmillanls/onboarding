# Webhook API Specification

## Overview
The Webhook API defines all webhook events published by the onboarding system to notify external services and internal systems about key events in the merchant onboarding journey. Webhooks enable real-time integration between onboarding, X-Series provisioning, payments, hardware fulfillment, and other services.

## Webhook Architecture

### Delivery Mechanism
- **Protocol:** HTTPS POST requests to registered webhook URLs
- **Format:** JSON payload
- **Security:** HMAC-SHA256 signature verification
- **Retry Policy:** Exponential backoff (max 7 days)
- **Timeout:** 30 seconds per delivery attempt

### Webhook Registration

Webhooks are registered per service integration:

```json
{
  "webhook_url": "https://service.example.com/webhooks/onboarding",
  "events": ["kyb.approved", "payment.completed", "hardware.shipped"],
  "secret": "whsec_abc123...",
  "enabled": true,
  "description": "X-Series provisioning service webhook"
}
```

### Security

#### HMAC Signature Verification

All webhook deliveries include a signature in the `X-Webhook-Signature` header:

```
X-Webhook-Signature: sha256=<hmac_hex_digest>
```

**Signature Generation:**
```python
import hmac
import hashlib
import json

def generate_signature(payload, secret):
    """Generate HMAC signature for webhook payload"""
    payload_string = json.dumps(payload, separators=(',', ':'))
    signature = hmac.new(
        secret.encode('utf-8'),
        payload_string.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return f"sha256={signature}"
```

**Signature Verification:**
```python
def verify_signature(payload, signature_header, secret):
    """Verify webhook signature"""
    expected_signature = generate_signature(payload, secret)
    return hmac.compare_digest(expected_signature, signature_header)
```

#### Additional Security Headers

```
X-Webhook-ID: <unique_event_id>
X-Webhook-Timestamp: <unix_timestamp>
X-Webhook-Retry: <retry_attempt_number>
Content-Type: application/json
User-Agent: Lightspeed-Webhooks/1.0
```

#### Replay Attack Prevention

Consumers should:
1. Verify the timestamp is within acceptable range (e.g., 5 minutes)
2. Store processed webhook IDs to prevent duplicate processing
3. Reject webhooks with timestamps too old or in the future

### Retry Policy

**Retry Schedule:**
```
Attempt 1: Immediate
Attempt 2: 1 minute later
Attempt 3: 5 minutes later
Attempt 4: 15 minutes later
Attempt 5: 1 hour later
Attempt 6: 6 hours later
Attempt 7: 24 hours later
Attempt 8-14: Daily for 7 days
```

**Success Criteria:**
- HTTP status code 200-299
- Response received within 30 seconds

**Failure Handling:**
- After 14 failed attempts, webhook is marked as failed
- System sends alert to webhook owner
- Webhook can be manually retried via API

### Webhook Response

Recipients should respond with:

**Success Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "received": true,
  "processed": true,
  "timestamp": "2025-10-09T12:00:00Z"
}
```

**Temporary Failure (will retry):**
```http
HTTP/1.1 503 Service Unavailable
Retry-After: 300

{
  "error": "Service temporarily unavailable",
  "retry_after": 300
}
```

**Permanent Failure (will not retry):**
```http
HTTP/1.1 400 Bad Request

{
  "error": "Invalid event type"
}
```

---

## Common Webhook Payload Structure

All webhooks follow this base structure:

```json
{
  "event_id": "evt_abc123xyz789",
  "event_type": "string",
  "event_version": "1.0",
  "timestamp": "2025-10-09T12:00:00Z",
  "environment": "production",
  "data": {
    // Event-specific payload
  },
  "metadata": {
    "trace_id": "uuid",
    "source_service": "onboarding-api",
    "idempotency_key": "uuid"
  }
}
```

---

## Webhook Events

## 1. KYB/KYC Decision Webhooks

### KYB Approved

**Event Type:** `kyb.approved`

**Description:** Fired when KYB verification is approved. Signals that merchant is eligible for payment processing.

**Payload:**
```json
{
  "event_id": "evt_kyb_approved_123",
  "event_type": "kyb.approved",
  "event_version": "1.0",
  "timestamp": "2025-10-09T12:05:00Z",
  "environment": "production",
  "data": {
    "kyb_request_id": "kyb_abc123def456",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": null,
    "business": {
      "legal_name": "John's Fine Dining LLC",
      "ein": "**-***6789",
      "business_structure": "LLC",
      "business_category": "RESTAURANT",
      "mcc": "5812"
    },
    "decision": {
      "status": "APPROVED",
      "decision_at": "2025-10-09T12:05:00Z",
      "risk_assessment": {
        "risk_level": "LOW",
        "risk_score": 15,
        "risk_factors": []
      }
    },
    "approved_services": [
      "CARD_PRESENT",
      "CARD_NOT_PRESENT",
      "ACH"
    ],
    "processing_limits": {
      "daily_limit": 50000,
      "monthly_limit": 1000000,
      "per_transaction_limit": 5000
    }
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "payments-service"
  }
}
```

### KYB Rejected

**Event Type:** `kyb.rejected`

**Description:** Fired when KYB verification is rejected. Merchant cannot proceed with payment processing.

**Payload:**
```json
{
  "event_id": "evt_kyb_rejected_456",
  "event_type": "kyb.rejected",
  "event_version": "1.0",
  "timestamp": "2025-10-09T12:05:00Z",
  "environment": "production",
  "data": {
    "kyb_request_id": "kyb_abc123def456",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "business": {
      "legal_name": "Business Name LLC",
      "business_category": "RESTAURANT"
    },
    "decision": {
      "status": "REJECTED",
      "decision_at": "2025-10-09T12:05:00Z",
      "rejection_reasons": [
        {
          "code": "HIGH_RISK_INDUSTRY",
          "message": "Business category not currently supported",
          "severity": "CRITICAL"
        }
      ]
    },
    "appeal_available": false
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "payments-service"
  }
}
```

### KYB Requires Information

**Event Type:** `kyb.requires_information`

**Description:** Fired when KYB verification requires additional documentation or information.

**Payload:**
```json
{
  "event_id": "evt_kyb_info_789",
  "event_type": "kyb.requires_information",
  "event_version": "1.0",
  "timestamp": "2025-10-09T12:05:00Z",
  "environment": "production",
  "data": {
    "kyb_request_id": "kyb_abc123def456",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "decision": {
      "status": "REQUIRES_INFO",
      "decision_at": "2025-10-09T12:05:00Z"
    },
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
    "upload_url": "https://api.lightspeed.com/v1/payments/kyb/kyb_abc123def456/documents"
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "payments-service"
  }
}
```

### KYC Approved

**Event Type:** `kyc.approved`

**Description:** Fired when KYC verification is approved for all persons. Signals that payment activation can proceed.

**Payload:**
```json
{
  "event_id": "evt_kyc_approved_101",
  "event_type": "kyc.approved",
  "event_version": "1.0",
  "timestamp": "2025-10-09T13:10:00Z",
  "environment": "production",
  "data": {
    "kyc_request_id": "kyc_xyz789abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
    "kyb_request_id": "kyb_abc123def456",
    "decision": {
      "status": "APPROVED",
      "decision_at": "2025-10-09T13:10:00Z"
    },
    "persons": [
      {
        "person_id": "per_rep123",
        "person_type": "REPRESENTATIVE",
        "status": "APPROVED",
        "verified_at": "2025-10-09T13:08:00Z"
      },
      {
        "person_id": "per_own456",
        "person_type": "OWNER",
        "status": "APPROVED",
        "verified_at": "2025-10-09T13:09:00Z"
      }
    ],
    "payment_activation": {
      "status": "ACTIVATED_PENDING_BANK",
      "activated_at": "2025-10-09T13:10:00Z",
      "can_accept_payments": true,
      "payouts_enabled": false,
      "payout_hold_reason": "BANK_ACCOUNT_NOT_VERIFIED"
    },
    "locations": [
      {
        "location_id": "loc_001",
        "merchant_account_id": "mcht_acc_001",
        "payment_status": "ACTIVE"
      },
      {
        "location_id": "loc_002",
        "merchant_account_id": "mcht_acc_002",
        "payment_status": "ACTIVE"
      }
    ]
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "payments-service"
  }
}
```

### KYC Rejected

**Event Type:** `kyc.rejected`

**Description:** Fired when KYC verification is rejected for one or more persons.

**Payload:**
```json
{
  "event_id": "evt_kyc_rejected_102",
  "event_type": "kyc.rejected",
  "event_version": "1.0",
  "timestamp": "2025-10-09T13:10:00Z",
  "environment": "production",
  "data": {
    "kyc_request_id": "kyc_xyz789abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "decision": {
      "status": "REJECTED",
      "decision_at": "2025-10-09T13:10:00Z"
    },
    "persons": [
      {
        "person_id": "per_rep123",
        "person_type": "REPRESENTATIVE",
        "status": "REJECTED",
        "rejection_reasons": [
          {
            "code": "OFAC_MATCH",
            "message": "Person appears on sanctions list",
            "severity": "CRITICAL"
          }
        ]
      }
    ],
    "payment_activation": {
      "status": "BLOCKED",
      "can_accept_payments": false,
      "payouts_enabled": false
    }
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "payments-service"
  }
}
```

### KYC Requires Review

**Event Type:** `kyc.requires_review`

**Description:** Fired when KYC verification requires manual review or additional documentation.

**Payload:**
```json
{
  "event_id": "evt_kyc_review_103",
  "event_type": "kyc.requires_review",
  "event_version": "1.0",
  "timestamp": "2025-10-09T13:10:00Z",
  "environment": "production",
  "data": {
    "kyc_request_id": "kyc_xyz789abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "decision": {
      "status": "IN_REVIEW",
      "decision_at": "2025-10-09T13:10:00Z"
    },
    "persons": [
      {
        "person_id": "per_rep123",
        "person_type": "REPRESENTATIVE",
        "status": "IN_REVIEW",
        "review_reasons": [
          {
            "code": "IDENTITY_MISMATCH",
            "message": "Unable to automatically verify identity",
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
    "estimated_review_time": "24-48 hours"
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "payments-service"
  }
}
```

---

## 2. Payment Processing Webhooks

### Payment Completed

**Event Type:** `payment.completed`

**Description:** Fired when merchant completes payment for software, hardware, and/or launch package.

**Payload:**
```json
{
  "event_id": "evt_payment_201",
  "event_type": "payment.completed",
  "event_version": "1.0",
  "timestamp": "2025-10-09T14:00:00Z",
  "environment": "production",
  "data": {
    "payment_id": "pay_abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
    "invoice_id": "inv_xyz789",
    "payment_method": {
      "type": "CREDIT_CARD",
      "last4": "4242",
      "brand": "VISA"
    },
    "amount": {
      "total": 4997.00,
      "currency": "USD",
      "breakdown": {
        "software_subscription": 299.00,
        "hardware": 3998.00,
        "launch_package": 700.00,
        "tax": 0,
        "shipping": 0
      }
    },
    "billing_address": {
      "line1": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102",
      "country": "US"
    },
    "shipping_address": {
      "line1": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102",
      "country": "US"
    },
    "items": [
      {
        "sku": "SUB-2LOC-4REG",
        "name": "X-Series Subscription - 2 Locations, 4 Registers",
        "quantity": 1,
        "unit_price": 299.00,
        "total": 299.00,
        "type": "SUBSCRIPTION"
      },
      {
        "sku": "LS-TERMINAL-001",
        "name": "Lightspeed Terminal",
        "quantity": 2,
        "unit_price": 499.00,
        "total": 998.00,
        "type": "HARDWARE"
      },
      {
        "sku": "LS-PRINTER-001",
        "name": "Receipt Printer",
        "quantity": 2,
        "unit_price": 299.00,
        "total": 598.00,
        "type": "HARDWARE"
      },
      {
        "sku": "LAUNCH-PKG-RESTAURANT",
        "name": "Restaurant Launch Package",
        "quantity": 1,
        "unit_price": 700.00,
        "total": 700.00,
        "type": "SERVICE"
      }
    ],
    "subscription": {
      "subscription_id": "sub_xyz789",
      "start_date": "2025-10-09",
      "billing_cycle": "MONTHLY",
      "recurring_amount": 299.00
    },
    "payment_status": "SUCCEEDED",
    "paid_at": "2025-10-09T14:00:00Z"
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "billing-service"
  }
}
```

### Payment Failed

**Event Type:** `payment.failed`

**Description:** Fired when payment attempt fails.

**Payload:**
```json
{
  "event_id": "evt_payment_202",
  "event_type": "payment.failed",
  "event_version": "1.0",
  "timestamp": "2025-10-09T14:00:00Z",
  "environment": "production",
  "data": {
    "payment_id": "pay_abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "invoice_id": "inv_xyz789",
    "amount": {
      "total": 4997.00,
      "currency": "USD"
    },
    "payment_method": {
      "type": "CREDIT_CARD",
      "last4": "4242",
      "brand": "VISA"
    },
    "failure": {
      "code": "CARD_DECLINED",
      "message": "Your card was declined",
      "decline_code": "insufficient_funds",
      "network_reason": "Insufficient funds"
    },
    "payment_status": "FAILED",
    "failed_at": "2025-10-09T14:00:00Z",
    "retry_available": true,
    "retry_url": "https://app.lightspeed.com/payment/retry/pay_abc123"
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "billing-service"
  }
}
```

### Bank Account Verified

**Event Type:** `bank.verified`

**Description:** Fired when merchant's bank account is verified for payouts.

**Payload:**
```json
{
  "event_id": "evt_bank_203",
  "event_type": "bank.verified",
  "event_version": "1.0",
  "timestamp": "2025-10-11T10:30:00Z",
  "environment": "production",
  "data": {
    "bank_verification_id": "bank_ver_abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
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
      "status": "VERIFIED",
      "verified_at": "2025-10-11T10:30:00Z"
    },
    "payout_status": {
      "enabled": true,
      "enabled_at": "2025-10-11T10:30:00Z",
      "schedule": "DAILY",
      "next_payout_date": "2025-10-12T09:00:00Z"
    }
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "payments-service"
  }
}
```

### Payouts Activated

**Event Type:** `payout.activated`

**Description:** Fired when payouts are fully enabled for all merchant locations.

**Payload:**
```json
{
  "event_id": "evt_payout_204",
  "event_type": "payout.activated",
  "event_version": "1.0",
  "timestamp": "2025-10-11T10:35:00Z",
  "environment": "production",
  "data": {
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
    "bank_account_id": "bank_acc_xyz789",
    "payout_details": {
      "enabled": true,
      "activated_at": "2025-10-11T10:35:00Z",
      "schedule": "DAILY",
      "next_payout_date": "2025-10-12T09:00:00Z",
      "minimum_payout_amount": 100
    },
    "locations": [
      {
        "location_id": "loc_001",
        "merchant_account_id": "mcht_acc_001",
        "payout_enabled": true
      },
      {
        "location_id": "loc_002",
        "merchant_account_id": "mcht_acc_002",
        "payout_enabled": true
      }
    ]
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "payments-service"
  }
}
```

---

## 3. Hardware Shipment Webhooks

### Hardware Order Created

**Event Type:** `hardware.order_created`

**Description:** Fired when hardware order is created after payment completion.

**Payload:**
```json
{
  "event_id": "evt_hw_301",
  "event_type": "hardware.order_created",
  "event_version": "1.0",
  "timestamp": "2025-10-09T14:05:00Z",
  "environment": "production",
  "data": {
    "order_id": "hw_order_abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
    "payment_id": "pay_abc123",
    "shipping_address": {
      "name": "John Doe",
      "company": "John's Fine Dining LLC",
      "line1": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102",
      "country": "US",
      "phone": "+1-555-123-4567"
    },
    "items": [
      {
        "sku": "LS-TERMINAL-001",
        "name": "Lightspeed Terminal",
        "quantity": 2,
        "serial_numbers": []
      },
      {
        "sku": "LS-PRINTER-001",
        "name": "Receipt Printer",
        "quantity": 2,
        "serial_numbers": []
      }
    ],
    "order_status": "PENDING_FULFILLMENT",
    "estimated_ship_date": "2025-10-10T12:00:00Z",
    "estimated_delivery_date": "2025-10-13T17:00:00Z",
    "created_at": "2025-10-09T14:05:00Z"
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "hardware-fulfillment"
  }
}
```

### Hardware Shipped

**Event Type:** `hardware.shipped`

**Description:** Fired when hardware is shipped from warehouse.

**Payload:**
```json
{
  "event_id": "evt_hw_302",
  "event_type": "hardware.shipped",
  "event_version": "1.0",
  "timestamp": "2025-10-10T15:30:00Z",
  "environment": "production",
  "data": {
    "order_id": "hw_order_abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
    "shipment": {
      "carrier": "FEDEX",
      "tracking_number": "1234567890",
      "tracking_url": "https://www.fedex.com/track?tracknumbers=1234567890",
      "service_level": "GROUND",
      "shipped_at": "2025-10-10T15:30:00Z",
      "estimated_delivery": "2025-10-13T17:00:00Z"
    },
    "items": [
      {
        "sku": "LS-TERMINAL-001",
        "name": "Lightspeed Terminal",
        "quantity": 2,
        "serial_numbers": ["SN-TERM-001", "SN-TERM-002"]
      },
      {
        "sku": "LS-PRINTER-001",
        "name": "Receipt Printer",
        "quantity": 2,
        "serial_numbers": ["SN-PRINT-001", "SN-PRINT-002"]
      }
    ],
    "order_status": "SHIPPED"
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "hardware-fulfillment"
  }
}
```

### Hardware Delivered

**Event Type:** `hardware.delivered`

**Description:** Fired when hardware is confirmed delivered.

**Payload:**
```json
{
  "event_id": "evt_hw_303",
  "event_type": "hardware.delivered",
  "event_version": "1.0",
  "timestamp": "2025-10-13T14:22:00Z",
  "environment": "production",
  "data": {
    "order_id": "hw_order_abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
    "shipment": {
      "carrier": "FEDEX",
      "tracking_number": "1234567890",
      "delivered_at": "2025-10-13T14:22:00Z",
      "signed_by": "J. Doe",
      "delivery_location": "FRONT_DOOR"
    },
    "items": [
      {
        "sku": "LS-TERMINAL-001",
        "quantity": 2,
        "serial_numbers": ["SN-TERM-001", "SN-TERM-002"]
      },
      {
        "sku": "LS-PRINTER-001",
        "quantity": 2,
        "serial_numbers": ["SN-PRINT-001", "SN-PRINT-002"]
      }
    ],
    "order_status": "DELIVERED"
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "hardware-fulfillment"
  }
}
```

### Hardware Delivery Failed

**Event Type:** `hardware.delivery_failed`

**Description:** Fired when delivery attempt fails.

**Payload:**
```json
{
  "event_id": "evt_hw_304",
  "event_type": "hardware.delivery_failed",
  "event_version": "1.0",
  "timestamp": "2025-10-13T16:00:00Z",
  "environment": "production",
  "data": {
    "order_id": "hw_order_abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
    "shipment": {
      "carrier": "FEDEX",
      "tracking_number": "1234567890"
    },
    "failure": {
      "reason": "NO_ONE_AVAILABLE",
      "message": "Delivery attempted, no one available to receive",
      "attempted_at": "2025-10-13T16:00:00Z",
      "next_attempt": "2025-10-14T16:00:00Z"
    },
    "order_status": "DELIVERY_FAILED",
    "action_required": true,
    "action_message": "Contact carrier to arrange redelivery or pickup"
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "hardware-fulfillment"
  }
}
```

---

## 4. X-Series Provisioning Webhooks

### X-Series Account Provisioned

**Event Type:** `xseries.account_provisioned`

**Description:** Fired when X-Series account is created and provisioned.

**Payload:**
```json
{
  "event_id": "evt_xs_401",
  "event_type": "xseries.account_provisioned",
  "event_version": "1.0",
  "timestamp": "2025-10-09T12:15:00Z",
  "environment": "production",
  "data": {
    "xseries_account_id": "xs_acc_abc123",
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
    "account_details": {
      "account_name": "John's Fine Dining LLC",
      "account_email": "merchant@example.com",
      "region": "US",
      "timezone": "America/New_York",
      "currency": "USD"
    },
    "subscription": {
      "subscription_id": "sub_xyz789",
      "plan": "PROFESSIONAL",
      "location_licenses": 2,
      "register_licenses": 4,
      "start_date": "2025-10-09",
      "status": "ACTIVE"
    },
    "locations": [
      {
        "location_id": "loc_001",
        "name": "Downtown Location",
        "is_primary": true,
        "status": "ACTIVE"
      },
      {
        "location_id": "loc_002",
        "name": "Marina Location",
        "is_primary": false,
        "status": "ACTIVE"
      }
    ],
    "access": {
      "dashboard_url": "https://dashboard.lightspeedpos.com/account/xs_acc_abc123",
      "api_credentials_created": true
    },
    "provisioned_at": "2025-10-09T12:15:00Z"
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "xseries-provisioning"
  }
}
```

### X-Series Data Import Completed

**Event Type:** `xseries.data_import_completed`

**Description:** Fired when historical data import completes.

**Payload:**
```json
{
  "event_id": "evt_xs_402",
  "event_type": "xseries.data_import_completed",
  "event_version": "1.0",
  "timestamp": "2025-10-14T16:45:00Z",
  "environment": "production",
  "data": {
    "import_id": "import_abc123",
    "xseries_account_id": "xs_acc_abc123",
    "merchant_id": "merch_001",
    "import_details": {
      "import_type": "FULL",
      "started_at": "2025-10-14T15:00:00Z",
      "completed_at": "2025-10-14T16:45:00Z",
      "duration_minutes": 105
    },
    "imported_data": {
      "products": {
        "total": 523,
        "successful": 520,
        "failed": 3,
        "skipped": 0
      },
      "customers": {
        "total": 1247,
        "successful": 1247,
        "failed": 0,
        "skipped": 0
      },
      "sales_history": {
        "total": 15623,
        "successful": 15623,
        "failed": 0,
        "skipped": 0
      }
    },
    "status": "COMPLETED",
    "errors": [
      {
        "data_type": "PRODUCT",
        "record_id": "sku_123",
        "error": "Duplicate SKU, skipped"
      }
    ]
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "xseries-import-service"
  }
}
```

---

## 5. Onboarding Journey Webhooks

### Lead Created

**Event Type:** `onboarding.lead_created`

**Description:** Fired when new lead is created during account creation step.

**Payload:**
```json
{
  "event_id": "evt_onb_501",
  "event_type": "onboarding.lead_created",
  "event_version": "1.0",
  "timestamp": "2025-10-09T12:00:00Z",
  "environment": "production",
  "data": {
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "email": "merchant@example.com",
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
    "source": {
      "channel": "WEBSITE",
      "campaign_id": "spring_2025"
    },
    "created_at": "2025-10-09T12:00:00Z"
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "onboarding-api"
  }
}
```

### Cohort Assigned

**Event Type:** `onboarding.cohort_assigned`

**Description:** Fired when cohort is assigned or reassigned to a lead.

**Payload:**
```json
{
  "event_id": "evt_onb_502",
  "event_type": "onboarding.cohort_assigned",
  "event_version": "1.0",
  "timestamp": "2025-10-09T12:00:00Z",
  "environment": "production",
  "data": {
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "cohort": {
      "type": "ASSISTED",
      "selling_plan": "AE_GUIDED",
      "setup_plan": "FREE_IC",
      "assignment_reason": "Annual revenue $850K with 6 locations"
    },
    "is_reassignment": false,
    "previous_cohort": null,
    "assigned_at": "2025-10-09T12:00:00Z"
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "onboarding-api"
  }
}
```

### Step Completed

**Event Type:** `onboarding.step_completed`

**Description:** Fired when merchant completes an onboarding step.

**Payload:**
```json
{
  "event_id": "evt_onb_503",
  "event_type": "onboarding.step_completed",
  "event_version": "1.0",
  "timestamp": "2025-10-09T12:15:00Z",
  "environment": "production",
  "data": {
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
    "step": {
      "step_number": 4,
      "step_name": "Software Requirements",
      "started_at": "2025-10-09T12:05:00Z",
      "completed_at": "2025-10-09T12:15:00Z",
      "duration_seconds": 600
    },
    "progress": {
      "completion_percentage": 40,
      "steps_completed": 4,
      "steps_remaining": 6,
      "current_step": 5
    }
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "onboarding-api"
  }
}
```

### Journey Completed

**Event Type:** `onboarding.journey_completed`

**Description:** Fired when merchant completes all onboarding steps and is fully activated.

**Payload:**
```json
{
  "event_id": "evt_onb_504",
  "event_type": "onboarding.journey_completed",
  "event_version": "1.0",
  "timestamp": "2025-10-15T16:00:00Z",
  "environment": "production",
  "data": {
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
    "journey_summary": {
      "started_at": "2025-10-09T12:00:00Z",
      "completed_at": "2025-10-15T16:00:00Z",
      "total_duration_days": 6,
      "total_duration_hours": 148
    },
    "cohort": {
      "type": "ASSISTED",
      "selling_plan": "AE_GUIDED",
      "setup_plan": "FREE_IC"
    },
    "account_details": {
      "xseries_account_id": "xs_acc_abc123",
      "payment_activated": true,
      "payouts_enabled": true,
      "hardware_configured": true,
      "data_imported": true
    },
    "metrics": {
      "first_transaction_processed": true,
      "first_transaction_at": "2025-10-14T10:30:00Z",
      "total_steps": 10,
      "steps_completed": 10,
      "ae_sessions": 2,
      "ic_sessions": 1
    }
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "onboarding-api"
  }
}
```

### Journey Stalled

**Event Type:** `onboarding.journey_stalled`

**Description:** Fired when merchant's onboarding journey is detected as stalled.

**Payload:**
```json
{
  "event_id": "evt_onb_505",
  "event_type": "onboarding.journey_stalled",
  "event_version": "1.0",
  "timestamp": "2025-10-12T10:00:00Z",
  "environment": "production",
  "data": {
    "lead_id": "lead_7f8d9e1a2b3c4d5e6f",
    "merchant_id": "merch_001",
    "stall_info": {
      "severity": "HIGH",
      "current_step": 6,
      "step_name": "Payment & Purchase",
      "days_stalled": 3,
      "last_activity_at": "2025-10-09T14:00:00Z",
      "last_activity_type": "QUOTE_VIEWED"
    },
    "stall_reasons": [
      {
        "reason": "PAYMENT_NOT_COMPLETED",
        "description": "Quote generated but payment not initiated"
      }
    ],
    "recommended_interventions": [
      {
        "intervention_type": "AE_CALL",
        "priority": "HIGH"
      }
    ]
  },
  "metadata": {
    "trace_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "source_service": "onboarding-api"
  }
}
```

---

## Webhook Management API

### Register Webhook

**Endpoint:** `POST /api/v1/webhooks`

**Description:** Register a new webhook endpoint.

**Request:**
```json
{
  "webhook_url": "https://service.example.com/webhooks/onboarding",
  "events": [
    "kyb.approved",
    "payment.completed",
    "hardware.shipped"
  ],
  "description": "X-Series provisioning service webhook",
  "enabled": true
}
```

**Response:**
```json
{
  "webhook_id": "wh_abc123",
  "webhook_url": "https://service.example.com/webhooks/onboarding",
  "secret": "whsec_abc123xyz789...",
  "events": [
    "kyb.approved",
    "payment.completed",
    "hardware.shipped"
  ],
  "enabled": true,
  "created_at": "2025-10-09T12:00:00Z"
}
```

### Test Webhook

**Endpoint:** `POST /api/v1/webhooks/{webhookId}/test`

**Description:** Send a test event to webhook endpoint.

**Response:**
```json
{
  "test_id": "test_abc123",
  "webhook_id": "wh_abc123",
  "event_type": "test.webhook",
  "delivery_status": "SUCCESS",
  "response_code": 200,
  "response_time_ms": 145,
  "delivered_at": "2025-10-09T12:00:00Z"
}
```

---

## Implementation Guidelines

### Best Practices for Webhook Consumers

1. **Respond Quickly**
   - Return 200 status immediately
   - Process webhook asynchronously if needed
   - Don't wait for downstream operations

2. **Handle Duplicates**
   - Use `event_id` for idempotency
   - Store processed event IDs
   - Handle duplicate webhooks gracefully

3. **Verify Signatures**
   - Always verify HMAC signature
   - Reject requests with invalid signatures
   - Check timestamp to prevent replay attacks

4. **Handle Failures Gracefully**
   - Return 5xx for temporary failures (will retry)
   - Return 4xx for permanent failures (will not retry)
   - Log all webhook processing errors

5. **Monitor Webhook Health**
   - Track webhook delivery success rates
   - Alert on repeated failures
   - Monitor processing times

### Example Webhook Consumer (Node.js)

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

app.post('/webhooks/onboarding', express.json(), async (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const secret = process.env.WEBHOOK_SECRET;

  // Verify signature
  if (!verifyWebhookSignature(req.body, signature, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Check timestamp (within 5 minutes)
  const timestamp = parseInt(req.headers['x-webhook-timestamp']);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > 300) {
    return res.status(400).json({ error: 'Timestamp too old' });
  }

  // Check for duplicate
  const eventId = req.body.event_id;
  if (await isEventProcessed(eventId)) {
    return res.status(200).json({ received: true, duplicate: true });
  }

  // Respond immediately
  res.status(200).json({ received: true, processed: false });

  // Process asynchronously
  processWebhook(req.body).catch(err => {
    console.error('Webhook processing error:', err);
  });
});

async function processWebhook(webhook) {
  // Mark as processing
  await markEventProcessing(webhook.event_id);

  try {
    // Handle event based on type
    switch (webhook.event_type) {
      case 'payment.completed':
        await handlePaymentCompleted(webhook.data);
        break;
      case 'kyb.approved':
        await handleKybApproved(webhook.data);
        break;
      // ... other event types
    }

    // Mark as processed
    await markEventProcessed(webhook.event_id);
  } catch (error) {
    // Log error and mark as failed
    await markEventFailed(webhook.event_id, error);
  }
}
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-09 | Initial webhook specification |
