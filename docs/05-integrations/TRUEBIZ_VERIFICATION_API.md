# TrueBiz Business Verification API

Complete API documentation for integrating TrueBiz business verification into the merchant onboarding flow.

**Status**: Reference Documentation
**Last Updated**: January 2025
**Purpose**: Business verification and risk assessment for merchant onboarding

---

## Table of Contents

1. [Overview](#overview)
2. [API Request](#api-request)
3. [API Response](#api-response)
4. [Integration Strategy](#integration-strategy)
5. [Use Cases](#use-cases)
6. [Risk Assessment](#risk-assessment)

---

## Overview

TrueBiz is a business verification service that validates business legitimacy, ownership, and operational status. It provides comprehensive data about a business based on its website domain and optional supplementary information.

**Key Capabilities**:
- Domain registration and hosting verification
- Business formation and registration validation
- Website content analysis (privacy policy, terms of service, etc.)
- Social media and online presence validation
- Employee count and revenue estimation
- Customer review aggregation
- Risk scoring and fraud detection
- Industry classification (NAICS, SIC, MCC codes)

**Use in Onboarding Flow**:
- Called during KYB (Know Your Business) verification
- Validates merchant-provided business information
- Flags high-risk or suspicious businesses
- Enriches merchant profile with additional data
- Helps determine cohort assignment and risk levels

---

## API Request

### Endpoint

```
POST https://api.truebiz.com/v1/verify
```

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

### Request Body

**Required Fields**:
- `domain` (string) - Business website domain

**Optional Fields** (highly recommended for better matching):
- `submitted_business_name` (string)
- `submitted_description` (string)
- `address_line_1` (string)
- `address_line_2` (string)
- `city` (string)
- `state_province` (string)
- `postal_code` (string)
- `country` (string)
- `submitted_email` (string)
- `submitted_phone` (string)
- `submitted_full_name` (string) - Business representative name

### Example Request

```json
{
  "domain": "example.net",
  "submitted_business_name": "Bob's Burritos",
  "submitted_description": "Bob's Burritos is a local institution proudly serving top quality Mexican street food to the Memphis area since 1967.",
  "address_line_1": "123 Main St.",
  "address_line_2": "Suite 100",
  "city": "Memphis",
  "state_province": "TN",
  "postal_code": "37501",
  "country": "USA",
  "submitted_email": "bob@yahoo.com",
  "submitted_phone": "(901) 555-5555",
  "submitted_full_name": "Bob Smith"
}
```

### Request from Merchant Data

When calling from our onboarding flow, map merchant data as follows:

```typescript
const truebizRequest = {
  domain: merchantData.businessUrl, // From Step 2, Section C
  submitted_business_name: merchantData.businessName, // From signup
  submitted_description: merchantData.productDescription, // From Step 2, Section C
  address_line_1: merchantData.businessAddress.line1, // From signup
  address_line_2: merchantData.businessAddress.line2, // From signup (if exists)
  city: merchantData.businessAddress.city, // From signup
  state_province: merchantData.businessAddress.state, // From signup
  postal_code: merchantData.businessAddress.postalCode, // From signup
  country: "USA", // Default for US merchants
  submitted_email: merchantData.businessEmail, // From signup
  submitted_phone: merchantData.businessPhone, // From signup
  submitted_full_name: `${merchantData.representative.firstName} ${merchantData.representative.lastName}` // From Step 2
};
```

---

## API Response

### Response Structure

The response contains comprehensive business data organized into the following sections:

1. **Basic Information** - Name, description, formation type
2. **Domain Data** - Registration, hosting, SSL, traffic
3. **Application Match** - How submitted data matches found data
4. **Website Content** - Privacy policy, terms, content analysis
5. **Contact Information** - Addresses, phone numbers, emails
6. **Business Metrics** - Employee count, revenue, founded year
7. **Industry Classification** - NAICS, SIC, MCC codes
8. **Social Presence** - Social media profiles, reviews
9. **Risk Assessment** - Validity, notice, and risk flags
10. **Connected Entities** - Related businesses

### Complete Response Example

```json
{
  "name": "Acme, Inc.",
  "domain": {
    "name": "acme.com",
    "registration_date": "1992-07-14",
    "last_update_date": "2021-12-15",
    "expiration_date": "2028-07-12",
    "is_resolvable": true,
    "is_registered": true,
    "is_parked": false,
    "is_known_free_email_host": false,
    "is_known_social_media_domain": false,
    "is_known_marketplace_domain": false,
    "is_known_top_domain": false,
    "is_known_hosting_provider_domain": false,
    "is_non_business": false,
    "is_ssl_valid": true,
    "is_webserver_responsive": true,
    "screenshot": {
      "fullpage_image_link": null,
      "cropped_image_link": null
    },
    "historical_archives": [
      {
        "url": "2021-12-15",
        "taken_date": "2021-12-15"
      }
    ],
    "registrar": {
      "name": "MarkMonitor, Inc.",
      "country": "United States",
      "website": "https://markmonitor.com"
    },
    "hosting_providers": [
      {
        "name": "Google",
        "country": "United States"
      }
    ],
    "has_robots_txt": true,
    "has_apex_and_www": true,
    "estimated_tech_spend": 1000,
    "estimated_tech_spend_history": [
      {
        "spend": 850,
        "detected_date": "2022-06-01"
      }
    ],
    "website_tech_activity": [
      {
        "year": 2023,
        "month": 6,
        "added": 4,
        "removed": 1,
        "total": 25
      }
    ],
    "domains_with_matching_credentials": [
      {
        "domain": "example.com",
        "technologies": [
          "google-analytics",
          "olark"
        ]
      }
    ],
    "inbound_linking_domains_count": 5,
    "inbound_redirects": [
      "example.xyz"
    ],
    "cohosted_domains": [
      "example.xyz"
    ]
  },
  "application": {
    "phone_has_business_connections": true,
    "email_has_business_connections": true,
    "address_has_business_connections": true,
    "person_has_business_connections": true,
    "description": {
      "text": "A used bookstore that also sells coffee and records",
      "match_type": "Full match"
    }
  },
  "formation_type": "Corporation",
  "has_closed_indicators": null,
  "website_content": {
    "evaluated_url": "https://www.acme.com/",
    "title": "Acme Inc. | World's Best Manufacturer of Anvils",
    "description": "Having trouble with a pesky road runner?  Buy an Acme Anvil and have no problems tomorrow!",
    "has_placeholder_text": false,
    "privacy_policy_link": "https://acme.com/privacy",
    "is_privacy_policy_suspicious": false,
    "terms_of_service_link": "https://acme.com/terms",
    "is_terms_of_service_suspicious": false,
    "return_policy_link": "https://acme.com/return",
    "refund_policy_link": "https://acme.com/refund",
    "cancellation_policy_link": "https://acme.com/cancellation",
    "shipping_policy_link": "https://acme.com/shipping",
    "opengraph_image_link": "https://acme.com/image.png",
    "primary_language": "English",
    "has_subscriptions": true,
    "is_under_construction": null,
    "pages_linked_from_homepage": 15,
    "content_flags": [
      "Animal Cruelty"
    ],
    "custom_content_flags": [
      "Animal Cruelty"
    ],
    "detected_brands": [
      {
        "name": "Nike",
        "count": 10,
        "action": "warn"
      }
    ],
    "policy_analysis": {
      "sources": [
        {
          "type": "Privacy Policy",
          "url": "https://www.example.com/privacy",
          "title": "Acme Inc. Privacy Policy",
          "company_name": "Acme Inc.",
          "language": "en",
          "last_updated": "2021-01-01",
          "change_policy": "Example Co reserves the right to make changes to this Privacy Policy. Any updates will be posted on our website.",
          "policy_contact": "support@example.com",
          "synopsis": "This privacy policy outlines the types of personal information that is received and collected and how it is used. It also outlines the steps we take to protect your personal information.",
          "has_placeholder_text": false
        }
      ],
      "analyses": [
        {
          "question": "Does the policy detail the website's privacy policy and how the data of customers is protected, used or disclosed?",
          "answer": "Yes",
          "sources": [
            "https://www.acme.com/privacy",
            "https://www.acme.com/privacy2"
          ]
        }
      ]
    },
    "duplicate_websites": [
      {
        "url": "https://acmeanvils.com",
        "percent_matched": 96
      }
    ],
    "payment_processors": [
      "Stripe"
    ],
    "multi_level_marketing_name": "Amway"
  },
  "website_traffic": {
    "visits_per_month": 10000,
    "time_on_site": 15.55,
    "pages_per_visit": 3.75,
    "bounce_rate": 15.55,
    "historical_visits_per_month": [
      {
        "year": 0,
        "month": 0,
        "visits": 0
      }
    ],
    "source_shares": {
      "search": 0,
      "social": 0,
      "display_ads": 0,
      "direct": 0,
      "referrals": 0,
      "mail": 0
    },
    "top_country_shares": [
      {
        "value": 0,
        "change": 0,
        "name": "string",
        "abbr": "string"
      }
    ],
    "paid_search_share": 0.5,
    "google_results_count": 10000,
    "top_referring_sites": [
      {
        "url": "https://referrer.co",
        "traffic_share": 0.35
      }
    ],
    "paid_search_visits": 1000,
    "top_keywords": {
      "organic": [
        "anvils",
        "cartoon anvils"
      ],
      "paid": [
        "example",
        "example2"
      ]
    },
    "anomalous_keywords": [
      "firearms",
      "gummy bears"
    ]
  },
  "primary_address": {
    "full_address": "5000 Market Street, #9616, San Francisco, CA 94103, United States",
    "line_1": "5000 Market Street",
    "line_2": "#9616",
    "city": "San Francisco",
    "state_province": "CA",
    "postal_code": "94103",
    "country": "United States",
    "postal_service_flags": [],
    "is_shared_with_registered_agent": null,
    "coordinates": {
      "lon": -122.4179707,
      "lat": 37.7756852
    },
    "coordinates_accuracy": "ROOFTOP",
    "google_maps_link": "https://maps.google.com/?q=37.7756852,-122.4179707",
    "is_valid": true,
    "source": "website"
  },
  "additional_addresses": [
    {
      "full_address": "5000 Market Street, #9616, San Francisco, CA 94103, United States",
      "line_1": "5000 Market Street",
      "line_2": "#9616",
      "city": "San Francisco",
      "state_province": "CA",
      "postal_code": "94103",
      "country": "United States",
      "postal_service_flags": [],
      "is_shared_with_registered_agent": null,
      "coordinates": {
        "lon": -122.4179707,
        "lat": 37.7756852
      },
      "coordinates_accuracy": "ROOFTOP",
      "google_maps_link": "https://maps.google.com/?q=37.7756852,-122.4179707",
      "is_valid": true,
      "source": "website"
    }
  ],
  "founded_year": 1955,
  "description": "Acme, Inc. is a large manufacturing company best known for it's quality anvils.",
  "industry": {
    "primary_industry": "Iron and Steel Forging",
    "tags": [
      "Steelworks",
      "Anvils",
      "Coyotes"
    ],
    "primary_naics": "332111",
    "additional_naics_codes": [
      "512110"
    ],
    "primary_sic": "3462",
    "additional_sic_codes": [
      "7819"
    ],
    "primary_mcc": {
      "code": "3499",
      "description": "Fabricated Metal Products, Not Elsewhere Classified"
    },
    "additional_mcc_codes": [
      {
        "code": "7812",
        "description": "Motion Picture and Video Tape Production and Distribution"
      }
    ]
  },
  "primary_phone_number": {
    "number": "+15558675309",
    "is_valid": true,
    "line_type": "Landline",
    "country_name": "United States",
    "country_code": "US",
    "links_to_company": [
      {
        "type": "Direct",
        "duration": "P2Y10M"
      }
    ]
  },
  "additional_phone_numbers": [
    {
      "number": "+15558675309",
      "is_valid": true,
      "line_type": "Landline",
      "country_name": "United States",
      "country_code": "US",
      "links_to_company": [
        {
          "type": "Direct",
          "duration": "P2Y10M"
        }
      ]
    }
  ],
  "foot_traffic": {
    "projections": [
      {
        "name": "string",
        "hours": [
          null
        ]
      }
    ],
    "traffic_score": "UNKNOWN",
    "hours_open": [
      [
        0
      ]
    ]
  },
  "email_addresses": [
    {
      "address": "partners@acme.com",
      "is_valid": true
    }
  ],
  "customer_reviews": {
    "analysis": {
      "text": "The company has a good reputation with customers.",
      "level_of_concern": "low",
      "flags": []
    },
    "providers": [
      {
        "provider": "yelp",
        "meta": {
          "url": "https://www.yelp.com/biz/acme-anvil",
          "name": "AcmeInc",
          "review_count": 3339,
          "review_average": 4.3
        }
      },
      {
        "provider": "google",
        "meta": {
          "url": "https://www.google.com/maps/place/?q=place_id:ChIJE_P9I5yAhYARkssH6GvVJ2g",
          "name": "Acme",
          "review_count": 11239,
          "review_average": 4.5
        }
      },
      {
        "provider": "trustpilot",
        "meta": {
          "url": "https://www.trustpilot.com/review/www.acme.com",
          "name": "Acme",
          "review_count": 22678,
          "review_average": 4.3
        }
      }
    ]
  },
  "news_articles": [
    {
      "title": "Acme, Inc. announces it is filing for bankruptcy.",
      "link": "https://example.com/news/acme-inc-files-for-bankruptcy",
      "date": "2025-10-10T13:20:00.015Z",
      "snippet": "CEO Wiley E. Coyote announced that Acme, Inc. is filing for bankruptcy tomorrow at 9 AM.",
      "thumbnail": "https://example.com/thumn/acme-vault-empty.png",
      "concerns": [
        "Bankruptcy"
      ]
    }
  ],
  "social_media_profiles": [
    "https://facebook.com/acme",
    "https://linkedin.com/company/acme-inc",
    "https://crunchbase.com/organization/acme",
    "https://twitter.com/acme",
    "https://www.google.com/maps/place/?q=place_id:ChIJE_P9I5yAhYARkssH6GvVJ2g"
  ],
  "social_media_detailed_profiles": [
    {
      "url": "https://facebook.com/acme",
      "follower_count": 22232239,
      "like_count": 22160933,
      "last_posted_content_at": "2023-07-01T10:23:00Z"
    }
  ],
  "metrics": {
    "estimated_employee_count_range": "5,000+",
    "estimated_annual_revenue_range": "1B+"
  },
  "people": [
    {
      "name": "Wiley E. Coyote",
      "job_title": "Chief Executive Officer",
      "linkedin_url": "https://www.linkedin.com/in/wiley-e-coyote/",
      "profile_picture": "https://media.licdn.com/dms/image/D4D03AQGDnwFEps6idg/profile-displayphoto-shrink_200_200/0/1673360179524?e=1688601600&v=beta&t=bpXAkQdRR7liIMck3FQ7maRE-XeMwtChfWt73oB7YZ0",
      "state_province": "California",
      "city": "San Francisco",
      "country": "United States"
    }
  ],
  "ecommerce": {
    "platform": "shopify",
    "product_count": 100,
    "vendor_count": 20,
    "average_price": 15.55,
    "minimum_price": 9.99,
    "maximum_price": 100.99,
    "currency_code": "USD",
    "last_updated_date": "2023-03-23"
  },
  "connected_entities": [
    {
      "name": "Roadrunner Restaurants",
      "url": "http://roadrunner-restaurants.com",
      "sources": [
        "Referring site"
      ]
    }
  ],
  "pdf_report_link": "http://example.com",
  "ui_portal_link": "http://example.com",
  "recommendation": null,
  "risks": {
    "validity": [
      {
        "category": "business",
        "subcategory": "classification",
        "name": "is_industry_classified",
        "score": 10000,
        "description": "Is TrueBiz able to find any supplemental data suggesting the business interacts in a high risk area?",
        "classification_type": "Validity"
      },
      {
        "category": "business",
        "subcategory": "classification",
        "name": "is_no_classification_data_found",
        "score": 10000,
        "description": "Is TrueBiz able to find any industry classification data for this business?",
        "classification_type": "Validity"
      },
      {
        "category": "business",
        "subcategory": "metadata",
        "name": "is_founded_recently",
        "score": 10000,
        "description": "Has the business been founded recently?",
        "classification_type": "Validity"
      },
      {
        "category": "business",
        "subcategory": "metrics",
        "name": "is_company_size_and_revenue_metrics_aligned",
        "score": 10000,
        "description": "Are the business metrics around employee count and revenue within expectations?",
        "classification_type": "Validity"
      },
      {
        "category": "website",
        "subcategory": "registration",
        "name": "is_registered",
        "score": 10000,
        "description": "Is the domain registered with a domain registrar?",
        "classification_type": "Validity"
      },
      {
        "category": "website",
        "subcategory": "registration",
        "name": "is_registration_expired",
        "score": 10000,
        "description": "Is the domain registration expired?",
        "classification_type": "Validity"
      },
      {
        "category": "website",
        "subcategory": "availability",
        "name": "is_resolvable",
        "score": 10000,
        "description": "Is the domain resolvable to an IP address?",
        "classification_type": "Validity"
      },
      {
        "category": "website",
        "subcategory": "availability",
        "name": "is_webserver_responsive",
        "score": 10000,
        "description": "Does the domain's responding web server(s) serve a simple HTTP or HTTPS request on port 80 or 443.",
        "classification_type": "Validity"
      },
      {
        "category": "website",
        "subcategory": "availability",
        "name": "is_ssl_valid",
        "score": 10000,
        "description": "Is the domain's responding web server(s) using a valid, properly configured SSL certificate?",
        "classification_type": "Validity"
      },
      {
        "category": "website",
        "subcategory": "reputation",
        "name": "is_known_free_email_host",
        "score": 10000,
        "description": "Is the domain associated with a known, free email provider?",
        "classification_type": "Validity"
      },
      {
        "category": "website",
        "subcategory": "reputation",
        "name": "is_tld_non_business",
        "score": 10000,
        "description": "Is the top level domain a known, non-business TLD?",
        "classification_type": "Validity"
      },
      {
        "category": "website",
        "subcategory": "reputation",
        "name": "is_known_social_media_domain",
        "score": 10000,
        "description": "Is the domain owned by a known social media company?",
        "classification_type": "Validity"
      }
    ],
    "notice": [],
    "risk": []
  },
  "is_blocked": false,
  "block_details": {
    "created_at": "2023-12-25T19:30:25.000+00:00",
    "expires_at": "2030-12-29T23:59:59.000+00:00",
    "explanation": "string"
  },
  "tracking_id": "00000000-0000-0000-0000-000000000000",
  "external_tracking_ref": "abc_defg12345678"
}
```

---

## Integration Strategy

### When to Call TrueBiz

TrueBiz should be called at **two points** in the onboarding flow:

**1. During Step 2 (Business Details) - Immediate Validation**
- **Trigger**: When merchant completes Business Details form
- **Purpose**: Real-time validation of business legitimacy
- **Decision**: Approve, flag for review, or reject immediately
- **Data Available**: Domain, business name, address, description

**2. During Purchase (Step 5.5) - Pre-Stripe Submission**
- **Trigger**: Before creating Stripe Connect account
- **Purpose**: Final risk assessment before activating payments
- **Decision**: Proceed with Stripe account creation or block
- **Data Available**: All verification data + ToS acceptance

### Integration Flow

```typescript
// Step 1: Call TrueBiz after Business Details form submission
async function validateBusinessDetails(merchantData) {

  // Call TrueBiz API
  const truebizResult = await callTrueBizAPI({
    domain: merchantData.businessUrl,
    submitted_business_name: merchantData.businessName,
    submitted_description: merchantData.productDescription,
    // ... other fields
  });

  // Assess risk
  const riskAssessment = assessTrueBizRisk(truebizResult);

  if (riskAssessment.action === 'REJECT') {
    // Show rejection message to merchant
    return {
      approved: false,
      reason: riskAssessment.reason,
      message: "We're unable to process your application at this time."
    };
  }

  if (riskAssessment.action === 'REVIEW') {
    // Flag for manual review
    await flagForManualReview(merchantData.id, riskAssessment);
    return {
      approved: false,
      reason: 'manual_review',
      message: "We need to review your application. You'll hear from us within 24 hours."
    };
  }

  // Auto-approve
  await saveTrueBizData(merchantData.id, truebizResult);
  return {
    approved: true,
    enrichedData: extractEnrichedData(truebizResult)
  };
}
```

### Risk Assessment Logic

```typescript
function assessTrueBizRisk(truebizResult) {
  const flags = [];
  let riskScore = 0;

  // Critical flags (auto-reject)
  if (truebizResult.is_blocked) {
    return {
      action: 'REJECT',
      reason: 'business_blocked',
      flags: ['Business is blocked in TrueBiz database']
    };
  }

  if (truebizResult.has_closed_indicators) {
    return {
      action: 'REJECT',
      reason: 'business_closed',
      flags: ['Business has closed indicators']
    };
  }

  // Domain validity checks
  if (!truebizResult.domain?.is_registered) {
    riskScore += 50;
    flags.push('Domain not registered');
  }

  if (!truebizResult.domain?.is_webserver_responsive) {
    riskScore += 30;
    flags.push('Website not responsive');
  }

  if (!truebizResult.domain?.is_ssl_valid) {
    riskScore += 20;
    flags.push('Invalid SSL certificate');
  }

  // Website content checks
  if (truebizResult.website_content?.has_placeholder_text) {
    riskScore += 25;
    flags.push('Website has placeholder text');
  }

  if (!truebizResult.website_content?.privacy_policy_link) {
    riskScore += 15;
    flags.push('No privacy policy found');
  }

  if (truebizResult.website_content?.is_privacy_policy_suspicious) {
    riskScore += 20;
    flags.push('Suspicious privacy policy');
  }

  // Content flags (high risk categories)
  if (truebizResult.website_content?.content_flags?.length > 0) {
    riskScore += 40;
    flags.push(`Content flags: ${truebizResult.website_content.content_flags.join(', ')}`);
  }

  // Multi-level marketing flag
  if (truebizResult.website_content?.multi_level_marketing_name) {
    riskScore += 30;
    flags.push(`MLM detected: ${truebizResult.website_content.multi_level_marketing_name}`);
  }

  // Duplicate websites
  if (truebizResult.website_content?.duplicate_websites?.length > 0) {
    const highMatchDupes = truebizResult.website_content.duplicate_websites.filter(d => d.percent_matched > 90);
    if (highMatchDupes.length > 0) {
      riskScore += 25;
      flags.push(`Duplicate websites found: ${highMatchDupes.map(d => d.url).join(', ')}`);
    }
  }

  // News article concerns
  if (truebizResult.news_articles?.some(a => a.concerns?.length > 0)) {
    const concerns = truebizResult.news_articles
      .flatMap(a => a.concerns)
      .filter(Boolean);
    riskScore += 30;
    flags.push(`News concerns: ${concerns.join(', ')}`);
  }

  // Application match validation
  if (truebizResult.application?.description?.match_type === 'No match') {
    riskScore += 20;
    flags.push('Business description does not match website');
  }

  if (!truebizResult.application?.address_has_business_connections) {
    riskScore += 15;
    flags.push('Address not connected to business');
  }

  // Customer review concerns
  if (truebizResult.customer_reviews?.analysis?.level_of_concern === 'high') {
    riskScore += 25;
    flags.push(`Review concerns: ${truebizResult.customer_reviews.analysis.text}`);
  }

  // Risk scoring from TrueBiz
  const highRiskFlags = truebizResult.risks?.risk || [];
  if (highRiskFlags.length > 0) {
    riskScore += highRiskFlags.length * 10;
    flags.push(...highRiskFlags.map(r => r.description));
  }

  // Determine action
  if (riskScore >= 100) {
    return { action: 'REJECT', reason: 'high_risk', flags, riskScore };
  } else if (riskScore >= 50) {
    return { action: 'REVIEW', reason: 'medium_risk', flags, riskScore };
  } else {
    return { action: 'APPROVE', reason: 'low_risk', flags, riskScore };
  }
}
```

---

## Use Cases

### Use Case 1: Enrich Merchant Profile

Extract valuable data from TrueBiz response to enhance merchant profile:

```typescript
function extractEnrichedData(truebizResult) {
  return {
    // Industry classification
    primaryIndustry: truebizResult.industry?.primary_industry,
    naicsCode: truebizResult.industry?.primary_naics,
    mccCode: truebizResult.industry?.primary_mcc?.code,

    // Business metrics
    estimatedEmployeeCount: truebizResult.metrics?.estimated_employee_count_range,
    estimatedRevenue: truebizResult.metrics?.estimated_annual_revenue_range,
    foundedYear: truebizResult.founded_year,

    // Contact validation
    primaryPhoneValid: truebizResult.primary_phone_number?.is_valid,
    emailValid: truebizResult.email_addresses?.[0]?.is_valid,
    addressValid: truebizResult.primary_address?.is_valid,

    // Online presence
    socialMediaProfiles: truebizResult.social_media_profiles || [],
    customerReviewAverage: calculateAverageReview(truebizResult.customer_reviews),
    websiteTrafficPerMonth: truebizResult.website_traffic?.visits_per_month,

    // E-commerce detection
    hasEcommerce: !!truebizResult.ecommerce,
    ecommercePlatform: truebizResult.ecommerce?.platform,
    productCount: truebizResult.ecommerce?.product_count,

    // Payment processing
    existingPaymentProcessors: truebizResult.website_content?.payment_processors || [],

    // Formation
    formationType: truebizResult.formation_type,

    // Domain info
    domainAge: calculateDomainAge(truebizResult.domain?.registration_date)
  };
}
```

### Use Case 2: Cohort Assignment Enhancement

Use TrueBiz data to refine cohort assignment:

```typescript
function enhanceCohortAssignment(merchantData, truebizData) {
  let cohort = merchantData.cohort; // From initial signup

  // Upgrade to Managed if large company detected
  if (truebizData.metrics?.estimated_employee_count_range === '5,000+' ||
      truebizData.metrics?.estimated_annual_revenue_range === '1B+') {
    cohort = 'managed';
  }

  // Upgrade to Assisted if established business with good metrics
  if (truebizData.founded_year && (new Date().getFullYear() - truebizData.founded_year) > 10) {
    if (truebizData.website_traffic?.visits_per_month > 50000) {
      if (cohort === 'self-serve') {
        cohort = 'assisted';
      }
    }
  }

  // Downgrade to Self-Serve if very small/new
  if (truebizData.metrics?.estimated_employee_count_range === '1-10' &&
      truebizData.website_traffic?.visits_per_month < 1000) {
    if (cohort === 'assisted') {
      cohort = 'self-serve';
    }
  }

  return cohort;
}
```

### Use Case 3: Fraud Prevention

Detect potential fraud indicators:

```typescript
function detectFraudIndicators(truebizResult) {
  const fraudFlags = [];

  // Recently created domain
  const domainAge = calculateDomainAge(truebizResult.domain?.registration_date);
  if (domainAge < 30) {
    fraudFlags.push({
      severity: 'high',
      indicator: 'very_new_domain',
      message: `Domain registered ${domainAge} days ago`
    });
  }

  // Parked domain
  if (truebizResult.domain?.is_parked) {
    fraudFlags.push({
      severity: 'critical',
      indicator: 'parked_domain',
      message: 'Domain is parked (not actively used)'
    });
  }

  // No website traffic
  if (truebizResult.website_traffic?.visits_per_month === 0) {
    fraudFlags.push({
      severity: 'high',
      indicator: 'no_traffic',
      message: 'Website has no recorded traffic'
    });
  }

  // Under construction
  if (truebizResult.website_content?.is_under_construction) {
    fraudFlags.push({
      severity: 'medium',
      indicator: 'under_construction',
      message: 'Website is under construction'
    });
  }

  // No social media presence
  if (!truebizResult.social_media_profiles || truebizResult.social_media_profiles.length === 0) {
    fraudFlags.push({
      severity: 'low',
      indicator: 'no_social_presence',
      message: 'No social media profiles found'
    });
  }

  // Mismatched business information
  if (!truebizResult.application?.phone_has_business_connections) {
    fraudFlags.push({
      severity: 'high',
      indicator: 'phone_mismatch',
      message: 'Phone number not connected to business'
    });
  }

  if (!truebizResult.application?.email_has_business_connections) {
    fraudFlags.push({
      severity: 'high',
      indicator: 'email_mismatch',
      message: 'Email not connected to business'
    });
  }

  // Known free email host as business domain
  if (truebizResult.domain?.is_known_free_email_host) {
    fraudFlags.push({
      severity: 'critical',
      indicator: 'free_email_domain',
      message: 'Using free email provider as business domain'
    });
  }

  return fraudFlags;
}
```

---

## Risk Assessment

### Risk Score Calculation

TrueBiz provides risk scores in three categories:

1. **Validity Risks** - Basic legitimacy checks
2. **Notice Risks** - Warning signs that need attention
3. **Risk Flags** - High-risk indicators

Each risk has:
- `category` - Type of risk (business, website, etc.)
- `subcategory` - Specific area
- `name` - Risk identifier
- `score` - Numeric score (10000 = pass, lower = fail)
- `description` - Human-readable explanation
- `classification_type` - Validity, Notice, or Risk

### Recommended Thresholds

```typescript
const RISK_THRESHOLDS = {
  // Validity checks (must pass)
  CRITICAL_VALIDITY: [
    'is_registered',
    'is_resolvable',
    'is_webserver_responsive',
    'is_ssl_valid'
  ],

  // Auto-reject conditions
  AUTO_REJECT: {
    is_blocked: true,
    has_closed_indicators: true,
    is_parked: true,
    is_known_free_email_host: true,
    domain_age_days: 7 // Domain registered within 7 days
  },

  // Manual review triggers
  MANUAL_REVIEW: {
    risk_score_threshold: 50,
    missing_privacy_policy: true,
    suspicious_privacy_policy: true,
    content_flags_count: 1,
    duplicate_websites_high_match: 90,
    news_concerns_count: 1,
    customer_review_concern: 'high',
    mlm_detected: true
  },

  // Business size thresholds for cohort assignment
  COHORT_THRESHOLDS: {
    large_company_employees: '1,000+',
    large_company_revenue: '100M+',
    established_years: 10,
    high_traffic_monthly: 50000
  }
};
```

### Blocking Scenarios

**Immediate Block** (merchant cannot proceed):
- `is_blocked = true` in TrueBiz database
- `has_closed_indicators = true`
- Domain is parked
- Free email host used as business domain
- Critical content flags (illegal activity, fraud)

**Manual Review** (hold for 24 hours):
- Risk score 50-99
- Missing required policies (privacy, terms)
- Suspicious policy content
- News articles with bankruptcy/fraud concerns
- High customer review concerns
- MLM detected
- Significant mismatches in application data

**Auto-Approve** (proceed immediately):
- Risk score < 50
- All validity checks pass
- Business information matches submitted data
- Established online presence
- Good customer reviews

---

## Best Practices

### 1. Cache TrueBiz Results

```typescript
// Store TrueBiz response in database
await db.truebizVerifications.create({
  merchantId: merchant.id,
  requestData: truebizRequest,
  responseData: truebizResult,
  riskScore: riskAssessment.riskScore,
  action: riskAssessment.action,
  flags: riskAssessment.flags,
  createdAt: new Date()
});

// Don't call TrueBiz multiple times for same merchant
```

### 2. Handle API Timeouts

```typescript
const truebizResult = await callTrueBizAPI(data, {
  timeout: 30000, // 30 second timeout
  retries: 2 // Retry twice on failure
});

if (!truebizResult) {
  // Fallback: Allow merchant to proceed but flag for review
  await flagForManualReview(merchant.id, {
    reason: 'truebiz_api_timeout',
    message: 'TrueBiz API did not respond'
  });
}
```

### 3. Monitor API Costs

TrueBiz charges per API call. Monitor usage:

```typescript
// Track API calls
await db.apiUsage.create({
  service: 'truebiz',
  merchantId: merchant.id,
  cost: 0.50, // Example: $0.50 per call
  timestamp: new Date()
});

// Alert if approaching monthly limit
```

### 4. Display Enriched Data Carefully

Don't show merchants all TrueBiz data (privacy concerns):

```typescript
// GOOD: Show validated data
✓ Business verified
✓ Domain registered since 1992
✓ 4.5 star average review rating

// BAD: Don't expose detailed analytics
✗ "We detected 10,000 visits per month to your site"
✗ "Your estimated revenue is $1B+"
✗ "We found your CEO's LinkedIn profile"
```

### 5. Re-verify Periodically

```typescript
// Re-run TrueBiz verification for active merchants
if (merchant.lastTruebizCheck < Date.now() - 90 * 24 * 60 * 60 * 1000) {
  // 90 days since last check
  const freshResult = await callTrueBizAPI(merchant);
  await updateRiskAssessment(merchant.id, freshResult);
}
```

---

## Error Handling

### API Error Responses

```typescript
// Handle TrueBiz API errors
try {
  const result = await callTrueBizAPI(data);
} catch (error) {
  if (error.status === 400) {
    // Bad request - invalid domain or required field missing
    return { error: 'invalid_domain', message: 'Please check your website URL' };
  }

  if (error.status === 401) {
    // Unauthorized - API key issue
    await alertEngineeringTeam('TrueBiz API key invalid');
    return { error: 'service_unavailable' };
  }

  if (error.status === 429) {
    // Rate limit exceeded
    await alertEngineeringTeam('TrueBiz rate limit hit');
    // Queue for retry
    await queueForRetry(merchant.id, data);
    return { error: 'rate_limit' };
  }

  if (error.status === 500) {
    // TrueBiz internal error
    // Allow merchant to proceed, flag for review
    await flagForManualReview(merchant.id, {
      reason: 'truebiz_error',
      message: 'TrueBiz service error'
    });
    return { error: 'service_error', allowProceed: true };
  }
}
```

---

## Testing

### Test Data

Use these domains for testing:

```typescript
const TEST_DOMAINS = {
  // Valid business
  valid: 'stripe.com',

  // Parked domain (should reject)
  parked: 'example-parked-domain.com',

  // Recently registered (should flag)
  new: 'brand-new-business.com',

  // Free email host (should reject)
  freeEmail: 'gmail.com',

  // No website traffic (should flag)
  noTraffic: 'no-visitors.com'
};
```

### Mock Response for Tests

```typescript
// Use a fixed mock response for unit tests
const mockTruebizResponse = {
  name: "Test Business Inc.",
  domain: { is_registered: true, is_resolvable: true, /* ... */ },
  risks: { validity: [], notice: [], risk: [] },
  is_blocked: false,
  // ... other fields
};
```

---

**Document Status**: Reference Documentation
**Next Steps**:
1. Integrate TrueBiz API into onboarding flow
2. Build risk assessment logic
3. Create manual review workflow
4. Monitor API usage and costs

**Owner**: Engineering Team
**Last Updated**: January 2025
