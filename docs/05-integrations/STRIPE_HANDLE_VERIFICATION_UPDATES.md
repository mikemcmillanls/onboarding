# Handle Stripe Verification Updates

Guide for maintaining compliance with changing verification requirements for connected accounts.

**Source**: [Stripe Documentation - Handle verification updates](https://docs.stripe.com/connect/handle-verification-updates)

---

## Overview

Before connected accounts can accept payments and send payouts, you must fulfill Know Your Customer (KYC) requirements by collecting certain information and sending it to Stripe for verification.

**Stripe frequently updates KYC requirements** due to changes from:
- Financial regulators
- Card networks
- Financial institutions

### Required Actions When Updates Occur

1. **Modify onboarding flow** to account for changed requirements
2. **Collect updated information** from affected connected accounts
3. **Handle verification responses** appropriately
4. **Handle risk-related requirements** by notifying accounts and guiding resolution

**Notifications**: Stripe will notify you of upcoming requirements updates that affect your connected accounts.

---

## API Version Considerations

### Recommended: API Version 2023-10-16+

**In version 2023-10-16 and later**:
- `account.requirements.errors` array specifies latest verification error types in `code` attribute
- **Recommendation**: Upgrade to 2023-10-16 and use `requirements.errors`

**In earlier versions**:
- `requirements.errors` includes `detailed_code` field for incompatible errors
- `detailed_code` doesn't appear in API reference

### Other Version Requirements

**Account or remediation links**:
- Set API version to **2021-09-07 or later**

**Webhook events** (`account.updated`):
- Set webhooks API version to **2021-09-07 or later**

---

## Onboarding Flow Options

### Comparison Table

| Flow Type | Description | Update Responsibility |
|-----------|-------------|----------------------|
| **API-based** | Custom flows using Stripe APIs. Must meet all onboarding requirements. | You identify changes and update flows. |
| **Embedded** (Recommended) | Highly themeable UI in embedded component. Accounts stay in your application. | Stripe automatically updates components. |
| **Stripe-hosted** | Redirect to Stripe for onboarding in co-branded interface. | Stripe automatically updates hosted onboarding. |

### Key Insight

If you use **embedded components** or **Stripe-hosted onboarding**:
- Requirements changes don't require you to update your onboarding flow
- Skip to [collecting updated information section](#collect-updated-information-from-accounts-with-outstanding-requirements)

If you use **API-based onboarding**:
- Follow steps below OR replace with embedded/Stripe-hosted onboarding

**Important**: You can't use the API to respond to Stripe risk reviews. Enable connected accounts to respond using:
- Embedded components
- Stripe-hosted onboarding
- Remediation links
- Dashboard (on their behalf)

---

## Modify API-Based Onboarding Flow

### Step 1: Preview Updated Verification Requirements

**Monitor the `future_requirements` Hash**

When verification requirements change, you must collect updated information by a certain deadline. Failure to fulfill changed requirements can disable capabilities.

**Preview upcoming changes** before `current_deadline`:

{% raw %}
```json
{
  "id": "{{CONNECTED_ACCOUNT_ID}}",
  "object": "account",
  "future_requirements": {
    "current_deadline": 1656608400,
    "currently_due": [
      "company.tax_id"
    ],
    "disabled_reason": null,
    "errors": [],
    "eventually_due": [
      "company.tax_id"
    ],
    "past_due": [],
    "pending_verification": []
  },
  ...
}
```
{% endraw %}

**Using Stripe Data (Sigma)**:
- Retrieve `future_requirements` via [Sigma query](https://docs.stripe.com/stripe-data/query-connect-data#account-requirements)

### Step 2: Add Required Fields to Onboarding Flow

**Evaluate whether to add to onboarding flow**:

**Add if**:
- New requirement always applies to a capability your flow requests
- Your flow must collect this information for all new accounts

**Consider not adding if**:
- Update only applies when account reaches a threshold
- Not common for your accounts to reach that threshold
- Can collect later when threshold reached

**To avoid disruption**:
- Address all requirements in `future_requirements.currently_due`
- Prepare for `future_requirements.eventually_due` (threshold-based requirements)

### Step 3: Test Updated Onboarding Flow

**Simulate future requirements** using test account:

#### Create Test Account (With Controller Properties)

```bash
curl https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d "controller[stripe_dashboard][type]"=none \
  -d "controller[fees][payer]"=application \
  -d "controller[losses][payments]"=application \
  -d "controller[requirement_collection]"=application \
  -d country=US \
  -d business_type=individual \
  -d "capabilities[card_payments][requested]"=true \
  -d "capabilities[transfers][requested]"=true \
  --data-urlencode email="jenny.rosen+enforce_future_requirements@example.com"
```

**Key**: Use `+enforce_future_requirements` in email to populate `requirements` hash with all known future requirements.

#### Create Test Account (With Account Type)

```bash
curl https://api.stripe.com/v1/accounts \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d type=custom \
  -d country=US \
  -d business_type=individual \
  -d "capabilities[card_payments][requested]"=true \
  -d "capabilities[transfers][requested]"=true \
  --data-urlencode email="jenny.rosen+enforce_future_requirements@example.com"
```

**Verify Your Flow**:
1. Onboard the test account
2. Check its `requirements` hash
3. If flow covers all requirements: `currently_due` list will be empty

### Step 4: Listen for Account Status Changes

**Listen to `account.updated` event** to detect status changes.

After onboarding, inspect:
- `requirements.currently_due`
- `requirements.pending_verification`
- `requirements.disabled_reason`

**Enable functionality when**:
- Both `currently_due` and `pending_verification` are empty
- `requirements.disabled_reason` is null
- `payouts_enabled` is true → Account can receive payouts
- `charges_enabled` is true → Unlock payments

**Example Check**:

{% raw %}
```bash
curl https://api.stripe.com/v1/accounts/{{CONNECTEDACCOUNT_ID}} \
  -u "<<YOUR_SECRET_KEY>>:"
```
{% endraw %}

**Successful Response**:

{% raw %}
```json
{
  "id": "{{CONNECTED_ACCOUNT_ID}}",
  "object": "account",
  "charges_enabled": true,
  "payouts_enabled": true,
  "requirements": {
    "alternatives": [],
    "current_deadline": null,
    "currently_due": [],
    "disabled_reason": null,
    "errors": [],
    "eventually_due": [],
    "past_due": [],
    "pending_verification": []
  },
  ...
}
```
{% endraw %}

---

## Collect Updated Information from Accounts with Outstanding Requirements

Use one of these methods:
1. Embedded components
2. Stripe-hosted onboarding
3. Stripe API

**Recommended**: Integrate embedded components OR direct accounts to Stripe-hosted onboarding using Account Links.

### Process Overview

#### Step 1: Adjust Integration for New Verification Responses

**When Stripe receives updated information**:
- Takes time to verify associated account fields
- Related functionality remains disabled until verification completes

**To detect verification updates**:
1. Listen for `account.updated` events
2. Inspect for verification errors
3. Resolve errors before deadline or capabilities become disabled

**If capability disabled**:
- Check `requirements.disabled_reason` in capability's `requirements` hash
- Find account on [Connected accounts page](https://docs.stripe.com/connect/dashboard/review-actionable-accounts) in Dashboard
- Investigate or provide required information

#### Step 2: Identify Accounts with Outstanding Requirements

**Via Dashboard**:
1. Go to [Connected accounts](https://dashboard.stripe.com/connect/accounts-list)
2. View list of accounts with current/future outstanding requirements
3. Filter by account issue and status
4. See required information and deadlines

**Via API**:
- Check account's `future_requirements` hash
- Use [Sigma query](https://docs.stripe.com/stripe-data/query-connect-data)

#### Step 3: Prepare for Enforcement

**On enforcement date** (`future_requirements.current_deadline`):
1. Contents of `future_requirements` move to `requirements` hash
2. Stripe generates `account.updated` event
3. May cause more accounts to require review

**Action**: Use enforcement date as reminder to check [Connected accounts page](https://docs.stripe.com/connect/dashboard/review-actionable-accounts) in Dashboard.

#### Step 4: Send Accounts to Information Collection Flow

**When to act**:
- Account has `currently_due` requirements
- Account has verification errors
- Must address by `current_deadline`

**Consequences of missing deadline**:
- Requirements move from `currently_due` to `past_due`
- Associated capabilities become disabled
- Remain disabled until information provided and errors resolved

**Important**: Future requirements can immediately affect capabilities when they become current requirements. Address all requirements before deadlines, even if still in `future_requirements`.

### Collection Methods

**Choose based on your integration**:

#### 1. API-Based Onboarding
- Use your custom onboarding flow
- Optionally collect `future_requirements` as well

#### 2. Embedded Onboarding
- Render the embedded onboarding component for affected accounts
- Highly themeable and customizable
- Accounts stay in your application

#### 3. Stripe-Hosted Onboarding
- Use Account Links API to generate single-use link
- Send connected accounts to link from your application
- Co-branded Stripe interface

**Example Account Link Creation**:

{% raw %}
```bash
curl https://api.stripe.com/v1/account_links \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d account={{CONNECTED_ACCOUNT_ID}} \
  -d refresh_url="https://yourdomain.com/refresh" \
  -d return_url="https://yourdomain.com/return" \
  -d type=account_onboarding
```
{% endraw %}

#### 4. Remediation Links
- Generate via Dashboard
- Connected accounts use to provide required information
- Good for one-off updates

---

## Requirements Object Structure

### Current Requirements (`requirements`)

**Key Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `current_deadline` | timestamp | Deadline to provide currently_due information |
| `currently_due` | array | Fields needed now to keep capabilities enabled |
| `past_due` | array | Overdue fields (capabilities may be disabled) |
| `pending_verification` | array | Fields submitted and awaiting verification |
| `errors` | array | Verification errors that must be resolved |
| `eventually_due` | array | Fields needed when account reaches thresholds |
| `disabled_reason` | string | Why capabilities are disabled (if applicable) |
| `alternatives` | array | Alternative fields that can satisfy requirements |

### Future Requirements (`future_requirements`)

**Same structure as `requirements`**, but for upcoming changes:

```json
{
  "future_requirements": {
    "current_deadline": 1656608400,
    "currently_due": ["company.tax_id"],
    "disabled_reason": null,
    "errors": [],
    "eventually_due": ["company.tax_id"],
    "past_due": [],
    "pending_verification": []
  }
}
```

**On enforcement date**:
- Contents move from `future_requirements` to `requirements`
- `account.updated` event generated

---

## Verification Errors

### Error Structure (API 2023-10-16+)

```json
{
  "requirements": {
    "errors": [
      {
        "code": "verification_failed_representative_authority",
        "reason": "Representative doesn't have sufficient authority",
        "requirement": "representative.verification.document"
      }
    ]
  }
}
```

### Common Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `verification_failed_representative_authority` | Representative lacks authority | Change representative or provide authorization |
| `verification_document_name_mismatch` | Document name doesn't match | Provide correct document |
| `verification_missing_owners` | Missing beneficial owners | Add all 25%+ owners |
| `verification_document_directors_mismatch` | Missing directors | Add all directors |
| `verification_failed_other` | General verification failure | Review error reason and provide correct info |

**See full error handling**: [Handling API Verification](https://docs.stripe.com/connect/handling-api-verification)

---

## Capability States

### States

| State | Description |
|-------|-------------|
| `inactive` | Not yet requested |
| `pending` | Requested, awaiting requirements |
| `active` | Fully enabled |
| `disabled` | Disabled due to missing requirements or errors |

### Monitoring Capability Status

**Check capability object**:

```json
{
  "capabilities": {
    "card_payments": {
      "status": "active",
      "requested": true
    },
    "transfers": {
      "status": "pending",
      "requested": true,
      "requirements": {
        "currently_due": ["company.tax_id"],
        "disabled_reason": null,
        "errors": []
      }
    }
  }
}
```

**When capability is `disabled`**:
- Check `requirements.disabled_reason`
- Review `requirements.errors`
- Provide missing information
- Resolve verification errors

---

## Best Practices

### 1. Proactive Collection

**For Embedded/Hosted Onboarding**:
- Collect information to fulfill future requirements proactively
- **Embedded**: Use `collectionOptions` attribute
- **Hosted**: Use `collection_options` parameter

**Example** (Account Links):

{% raw %}
```bash
curl https://api.stripe.com/v1/account_links \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d account={{CONNECTED_ACCOUNT_ID}} \
  -d type=account_onboarding \
  -d "collection_options[future_requirements]"=include
```
{% endraw %}

### 2. Regular Monitoring

**Set up automated checks**:
- Listen to `account.updated` webhooks
- Check requirements daily/weekly
- Monitor `future_requirements` for upcoming changes
- Track deadlines (`current_deadline`)

### 3. Early Communication

**Notify accounts early**:
- Send notification when `future_requirements` appear
- Provide clear deadline
- Explain what's needed and why
- Make collection flow easy to access

### 4. Testing

**Test regularly**:
- Use `+enforce_future_requirements` in test emails
- Verify onboarding flow handles all requirements
- Test verification error handling
- Ensure webhook handlers work correctly

### 5. Dashboard Reviews

**Regular dashboard checks**:
- Review [Connected accounts page](https://dashboard.stripe.com/connect/accounts-list)
- Filter by accounts with outstanding requirements
- Check for accounts approaching deadlines
- Review disabled capabilities

---

## Webhook Events

### `account.updated`

**When triggered**:
- Account information changes
- Verification status updates
- Requirements change
- Capabilities status changes

**Use to**:
- Detect when verification completes
- Identify new requirements
- Monitor capability status changes
- Handle verification errors

**Example payload** (relevant fields):

```json
{
  "type": "account.updated",
  "data": {
    "object": {
      "id": "acct_xxx",
      "requirements": {
        "currently_due": [],
        "errors": []
      },
      "future_requirements": {
        "currently_due": ["company.tax_id"]
      },
      "capabilities": {
        "card_payments": {
          "status": "active"
        }
      }
    }
  }
}
```

---

## Common Scenarios

### Scenario 1: New Requirement Announced

**Timeline**:
1. **Day 1**: Stripe announces new requirement, sets enforcement date 90 days out
2. **Day 1-30**: You receive notification, review `future_requirements`
3. **Day 30**: Update onboarding flow (if needed), begin collecting from existing accounts
4. **Day 60**: Test with `+enforce_future_requirements` accounts
5. **Day 90**: Enforcement date - `future_requirements` → `requirements`

### Scenario 2: Account Reaches Threshold

**Example**: Account reaches $10,000 USD, needs EIN

1. `future_requirements.eventually_due` moves to `currently_due`
2. `account.updated` event triggered
3. You detect change via webhook
4. Send account to collection flow
5. Account provides EIN
6. Stripe verifies
7. Requirement cleared, capability remains active

### Scenario 3: Verification Fails

**Example**: Representative ID document rejected

1. Stripe attempts verification
2. Verification fails
3. Error appears in `requirements.errors`
4. `account.updated` event triggered
5. You notify account of issue
6. Account uploads new document
7. Stripe re-verifies
8. Requirement cleared or additional errors surface

---

## Integration Checklist

### Initial Setup

- [ ] Choose onboarding method (API-based, embedded, or hosted)
- [ ] Set API version to 2023-10-16 or later
- [ ] Set webhook version to 2021-09-07 or later
- [ ] Implement `account.updated` webhook handler
- [ ] Create test accounts with `+enforce_future_requirements`

### Ongoing Maintenance

- [ ] Monitor `future_requirements` for upcoming changes
- [ ] Check [Connected accounts page](https://dashboard.stripe.com/connect/accounts-list) regularly
- [ ] Test onboarding flow with future requirements
- [ ] Update flows as needed for new requirements
- [ ] Communicate with accounts about upcoming changes
- [ ] Track requirement deadlines

### Error Handling

- [ ] Handle verification errors in `requirements.errors`
- [ ] Display clear error messages to users
- [ ] Provide guidance for resolving errors
- [ ] Monitor disabled capabilities
- [ ] Implement retry logic for failed verifications

### Testing

- [ ] Test with various business types
- [ ] Test with different countries
- [ ] Test threshold-based requirements
- [ ] Test verification failure scenarios
- [ ] Test deadline enforcement

---

## Related Documentation

- [Required Verification Information](./STRIPE_VERIFICATION_REQUIREMENTS.md)
- [Handling API Verification](https://docs.stripe.com/connect/handling-api-verification)
- [Testing Connect](https://docs.stripe.com/connect/testing)
- [Testing Account Identity Verification](https://docs.stripe.com/connect/testing-verification)
- [Connect Dashboard - Review Actionable Accounts](https://docs.stripe.com/connect/dashboard/review-actionable-accounts)
- [Remediation Links](https://docs.stripe.com/connect/dashboard/remediation-links)

---

**Last Updated**: January 2025
**Source**: Stripe Documentation
**Maintainer**: Engineering Team
