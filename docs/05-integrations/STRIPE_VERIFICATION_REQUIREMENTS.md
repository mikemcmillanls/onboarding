# Stripe Connect Verification Requirements

Reference documentation for required verification information when onboarding connected accounts using Stripe Connect.

**Source**: [Stripe Documentation - Required verification information](https://docs.stripe.com/connect/required-verification-information)

---

## Overview

Onboarding connected accounts to a Connect platform requires collecting and verifying certain information for each account. The required information depends on various factors:

- **Country** of the connected account
- **Service agreement type** applicable to the connected accounts
- **Capabilities** requested (card_payments, transfers, etc.)
- **Business type** (individual or company)
- **Company structure** (public_corporation, private_partnership, etc.)

---

## Key Concepts

### Account Types

**Standard and Express Accounts**:
- Stripe collects required information through the account's Dashboard
- You can speed up onboarding by pre-filling the Account object

**Custom Accounts**:
- No access to Stripe Dashboard
- Your onboarding flow must identify and collect all required information

### Processing Live Charges vs. Payouts

**Two-Stage Activation**:
1. **Card Payments Capability** - Accept payments from customers
2. **Payouts Capability** - Receive funds to external bank account

Different verification levels may be required for each stage.

---

## United States Requirements

### Individual Accounts

**For Card Payments (Initial)**:
- `individual.first_name`
- `individual.last_name`
- `individual.email`
- `individual.phone`
- `individual.dob` (date of birth)
- `individual.address.city`
- `individual.address.state`
- `individual.address.postal_code`
- `individual.ssn_last_4` (last 4 digits of SSN)

**For Payouts (Within 30 days)**:
- Full `individual.address` (including street)
- If verification fails with `ssn_last_4`:
  - Full SSN via `individual.id_number`
  - ID document scan (front and back)

### Company Accounts

**For Card Payments**:
- `company.name`
- `company.address.city`
- `company.address.state`
- `company.address.postal_code`
- `company.phone`
- `business_profile.url`
- **Representative** (person activating the account):
  - Must have significant control/management responsibility
  - Must be owner or executive (`relationship.owner` or `relationship.executive` = true)
  - Full name, DOB, SSN (last 4), address, email, phone

**For Payouts (Within 30 days)**:
- Full `company.address`
- `company.tax_id` (EIN)
- **25% Owners**:
  - All individuals owning 25%+ of company
  - Full name, DOB, full SSN, full address, phone
  - Set `company.owners_provided` = true when complete

**Representative Verification**:
- If verification fails with `ssn_last_4`:
  - Full SSN via `person.id_number`
  - ID document scan if no SSN or verification fails

**Owner Verification (at 750K USD threshold)**:
- For all 25%+ owners, collect:
  - `address`
  - `dob` (full)
  - `id_number` (full SSN)
  - `phone`
  - ID document if verification fails or no SSN

### Supported Business Structures

**Private Companies**:
- `multi_member_llc`
- `single_member_llc`
- `private_partnership`
- `private_corporation`
- `unincorporated_association`

**Public Companies** (no owner requirements):
- `public_corporation`
- `public_partnership`

**Government Entities**:
- `governmental_unit`
- `government_instrumentality`
- `tax_exempt_government_instrumentality`

**Non-Profits**:
- `incorporated_non_profit`
- `unincorporated_non_profit`

**Sole Proprietors**:
- `sole_proprietorship` (has business ID separate from personal ID)
- Can set `business_type` to `company` with `company.structure` = `sole_proprietorship`

---

## Canada Requirements

### Company Accounts

**Representative**:
- Must be a beneficial owner authorized to sign
- Set `relationship.executive` = true or `relationship.owner` = true (if owns 25%+)

**Directors**:
- For companies (excluding partnerships), collect all directors
- Directors are members of governing board
- Set `company.directors_provided` = true when complete
- Verification against registry:
  - **Match found**: No additional action
  - **No match**: Upload proof of registration document

**Beneficial Owners (Executives and Owners)**:
- Executives: Exercise significant management control
- Owners: Own 25%+ of company
- Set both `company.owners_provided` and `company.executives_provided` = true
- ID document required if verification fails

**Account Verification**:
- Proof-of-entity document if verification fails
- Uses `company.verification.document.front` and `company.verification.document.back`

**Charity Registration**:
- If registration status can't be verified
- Upload proof-of-entity via `documents.company_registration_verification.files`

### Universal Beneficial Ownership Verification

After supplying beneficial owner info, checked against National Registry of Businesses (NRB):

**Three Outcomes**:
1. **Found and matches**: No action required
2. **Found but doesn't match**: No action required (discrepancy reported to NRB)
3. **Not found**: Provide attestation using `company.ownership_declaration`:
   - `date`
   - `ip_address`
   - `user_agent`

### Enhanced Identity Verification (Individuals)

**Proof of Liveness Required**:
- Selfie + ID document via Stripe Identity
- Requires Connect Onboarding or Embedded Onboarding integration

**Alternative (without liveness)**:
- ID document scan: `verification.document.front/back`
- Address document scan: `verification.additional_document.front/back`
- Cannot use same document for both

---

## Singapore Requirements

### Business Representative Verification

**Enhanced Identity Verification**:
- **SingPass MyInfo** (for Singapore residents)
- **Stripe Identity** (if no MyInfo access)
- Requires Connect Onboarding or Embedded Onboarding

**Address Verification**:
- Required for all business types
- Proof of address document if verification fails

### Proof of Authority

Stripe verifies representative has sufficient authority. If verification fails:

**Error Code**: `verification_failed_representative_authority`

**Solution**:
1. Add person with authority as `Person` with `relationship.authorizer` = true
2. Person with authority signs Letter of Authorization (using provided template)
3. Upload signed letter as `documents.company_authorization` on representative's Person

### Legal Entity Verification

**Verifies**:
- Business name
- UEN (Unique Entity Number)
- Legal entity type

**Mismatch Handling**:
- Error: `verification_legal_entity_structure_mismatch`
- Action: Update business type/structure OR provide company document

**UEN Data Source**: Singapore Open Data License (data.gov.sg)

### Ultimate Beneficial Ownership

**Private Companies**:
- Identify individuals with 25%+ ownership as UBO
- Use Stripe-hosted or Embedded Onboarding to preview/confirm
- Add all UBOs as Persons with `relationship.owner` = true
- If can't determine: Submit proof of UBO document
  - Must include holding company ownership docs if applicable
  - Alternative: Single UBO attestation document
- **No 25%+ owners**: All directors are UBOs

**Partnerships**:
- Must verify all partners, managers, and 25%+ owners
- Add as Persons with `relationship.owner` = true

**Exemptions**:
Valid via `company.ownership_exemption_reason`:
- `qualified_entity_exceeds_ownership_threshold`: Government/public company/financial institution owns 75%+
- `qualifies_as_financial_institution`: Regulated by Monetary Authority of Singapore

**Error Codes**:
- `verification_missing_owners`: Missing beneficial owners
- `verification_document_directors_mismatch`: Missing directors
- `verification_requires_additional_proof_of_registration`: Additional ownership info needed

### Non-Profit UBO Requirements

**Key Executives and Directors Considered UBOs**:
- President, Director, CEO, Treasurer, Secretary, Chairman, Trustee
- Assistant, Deputy, or Vice versions of above positions
- Newly added positions

**Verification**:
- Stripe identifies directors/executives of registered charities (preview in onboarding)
- Other non-profits: Provide proof of UBO document
- Add all with `relationship.director` = true

**Error Code**: `verification_document_directors_mismatch`

### Account Closure Policy

**Singapore Payment Services Act Compliance**:
- Accounts unverified for 120+ business days will be permanently closed
- Monthly reports: "Unverified account list" and "Closed unverified account list"
- Balance released to bank account if closed
- Cannot reactivate after closure
- `disabled_reason` = `rejected.other`

---

## Thailand Requirements

### Additional Identity Verification

**Regulatory Requirement**:
- Selfie + ID document via Stripe Identity
- Requires Connect Onboarding integration
- **Mandatory** for: individuals, sole proprietors, unregistered partnerships

### Registered Address

**Household Registration Address**:
- From 'Tabien Bann' (Blue book for Thai nationals, Yellow book for non-Thai nationals)
- Use `person.registered_address` parameter
- Non-Thai nationals: Current residential address

### ID Number Requirements

**Thai ID Card**:
- **ID Number**: 13-digit code (front of card) → `person.id_number`
- **Laser Code**: Back of card → `person.id_number_secondary`
- **Only for Thai nationals** (leave empty for non-Thai)

### Individual Accounts

If verification fails or not Thai national:
- ID document scan via `individual.verification.document.front/back`

### Company Representative

If verification fails or not Thai national:
- ID document scan via `person.verification.document.front/back`

### Beneficial Owners

**Definition**:
- Companies/Registered Partnerships: All 25%+ owners
- If no 25%+ owners: Individual exercising significant control
- Otherwise: Senior management

**Verification**:
- ID document if verification fails or not Thai national
- Use `person.verification.document.front/back`

### Company Verification

If company verification fails:
- Company verification document (issued <6 months ago)
- Use `company.verification.document.front/back`

---

## UAE Requirements

### Processing & Payouts

**Before Live Charges/Payouts**:
- Trade License (verified)
- Proof of Bank Account (verified)
- Identity documents for: Representative, Beneficial Owners, Executives
- Memorandum of Association (except sole/free zone establishments)

### Identity Documents

**Required Documents**:
- **Passport**: All individuals
- **Emirates ID**: UAE nationals & residents → `verification.document`
- **Residence Visa**: Foreign nationals (UAE resident) → `documents` parameter

### Document Expiry Management

**28-Day Grace Period**:
- Trade License expiry
- Emirates ID expiry (UAE nationals/residents)
- Passport expiry (primary ID for others)
- Expired docs appear in `requirements.currently_due`
- Capabilities disabled if not updated

### Ultimate Beneficial Owners

**25%+ Ownership Rule**:
- Verify all individuals with 25%+ ownership
- **Holding Company (25%+ ownership)**:
  - Memorandum of Association for both holding company and primary business
  - Documents must show persons where `relationship.owner` = true

### Company Representative

**Authorization Requirements**:
- Significant responsibility to control/manage/direct organization
- Authorized to agree to Stripe's terms
- Must be owner OR executive:
  - `relationship.owner` = true, OR
  - `relationship.executive` = true
- **Sole/Free Zone Establishments**: Must be owner

### VAT Information

**UAE VAT Rules**:
- **Valid UAE VAT ID provided**: No UAE VAT charged on Stripe fees
- **No valid UAE VAT ID**: 5% UAE VAT charged on Stripe fees
- Local self-assessment obligations may apply

### Power of Attorney

**When Required**:
- Representative not on Trade License or Memorandum of Association
- **Must Upload**:
  - Power of Attorney showing authority to act for company, OR
  - Notarized letter of authorization

### Supported Business Structures

**Only `company` business type**:
- `sole_establishment`
- `free_zone_establishment`
- `llc`
- `free_zone_llc`

---

## Japan Requirements

### ID Documents

**Identity Verification**:
- Documents must be issued in Japan
- Must show representative's residency status
- Use `verification.document.front` and `verification.document.back`

### Language Requirements

**Kana and Kanji Variations Required**:

Both language variations needed for:
- `first_name_kana` / `first_name_kanji`
- `last_name_kana` / `last_name_kanji`
- `name_kana` / `name_kanji`
- `address_kana` / `address_kanji`

**Note**: Use these instead of base parameters (`first_name`, `last_name`, etc.)

### Japanese Address Format

**Required Fields**:
- `postal_code` (always required)
- Stripe auto-fills `state`, `city`, `town` for valid postal code
- `line2`: Building name + room number (optional if no building)

**Example Structure**:
```
〒150-0001 東京都渋谷区神宮前1-5-8 神宮前タワービルディング22F

address_kana:
  postal_code: "1500001"
  state: "ﾄｳｷﾖｳﾄ" (Prefecture)
  city: "ｼﾌﾞﾔ" (City/Ward)
  town: "ｼﾞﾝｸﾞｳﾏｴ 1-" (Town/cho-me)
  line1: "5-8" (Block/Building)
  line2: "ｼﾞﾝｸﾞｳﾏｴﾀﾜｰﾋﾞﾙﾃﾞｨﾝｸﾞ22F" (Building details)

address_kanji:
  postal_code: "１５００００１"
  state: "東京都"
  city: "渋谷区"
  town: "神宮前　１丁目"
  line1: "５－８"
  line2: "神宮前タワービルディング22F"
```

### Statement Descriptors

**Three Script Versions**:
- Latin characters: `settings.payments.statement_descriptor`
- Kanji: `settings.payments.statement_descriptor_kanji`
- Kana: `settings.payments.statement_descriptor_kana`

**Prefix Versions**:
- `settings.card_payments.statement_descriptor_prefix`
- `settings.card_payments.statement_descriptor_prefix_kanji`
- `settings.card_payments.statement_descriptor_prefix_kana`

---

## Mexico Requirements

### Company Types

**`company` refers to**:
- Sociedad Anónima (S.A.)
- Sociedad de Responsabilidad Limitada (S. de R.L.)
- Sociedad Anónima Promotora de Inversión (S.A.P.I.)
- Sociedad por Acciones Simplificada (S.A.S.)

### Verification Documents

**Individual Accounts**:
- ID document if verification fails, no `individual.id_number`, or sanctions concerns
- Use `individual.verification.document.front/back`

**Company Representative**:
- Must be authorized signatory with legal powers
- ID document if verification fails, no `representative.id_number`, or sanctions concerns
- Use `verification.document.front/back`

**Owners (25%+ ownership)**:
- Collect all 25%+ owners
- Set `company.owners_provided` = true when complete
- ID document if verification fails, no `owners.id_number`, or sanctions concerns
- Optional: `relationship.owner` = true and `relationship.percent_ownership`

**Company Verification**:
- Proof-of-entity document if verification fails or sanctions concerns
- Use `company.verification.document.front/back`

---

## General Requirements Across Countries

### Account Verification

If Stripe can't verify the business entity, doesn't have `company.tax_id`, or sanctions concerns:
- Collect proof of entity document
- Use `company.verification.document.front` and `company.verification.document.back`

### Representative Requirements

**Who Can Be Representative**:
- Beneficial owner authorized to sign for company
- Set `relationship.executive` = true
- OR set `relationship.owner` = true (if owns 25%+)

**Verification**:
- ID document scan if verification fails or sanctions concerns
- Use `verification.document.front/back`
- Optional: `relationship.representative` and `relationship.percent_ownership`

### Director Requirements

**For companies (excluding partnerships)**:
- Collect information on all directors
- Directors = governing board members
- Set `company.directors_provided` = true when complete
- ID document if sanctions concerns

### Beneficial Owner Requirements

**Two Types**:
1. **Executives**: Significant management control
2. **Owners**: 25%+ ownership

**When Complete**:
- Set `company.owners_provided` = true
- Set `company.executives_provided` = true

**Verification**:
- ID document if verification fails or sanctions concerns
- Optional: `relationship.owner` and `relationship.percent_ownership`

### Partnerships

**Additional Requirement**:
- Must provide `relationship.percent_ownership` for any owners

---

## U.S. Specific Thresholds

### Tax ID Threshold

**Payout Threshold**:
- Must provide `company.tax_id` (EIN) before reaching threshold
- Threshold: 10,000 USD or 3,000 USD (industry-dependent)
- Payouts disabled if EIN not verified before threshold

### Individual Information Threshold

**For Individuals**:
- Must provide before reaching threshold (10K or 3K USD):
  - `individual.dob.day`
  - `individual.dob.month`
  - `individual.dob.year`
  - `individual.ssn_last_4`

### Full SSN Threshold (500K USD)

**At 500K USD lifetime charges**:
- Collect last 4 digits of SSN/ITIN for US-resident owners
- Attempt to obtain full 9-digit SSN programmatically
- If unsuccessful: Must provide full 9 digits

**Update**:
- Individuals: `individual.id_number`
- Others with legal guardian/representative/owner: `person.id_number`

### Support Phone Requirement

**For Custom Accounts**:
- No Stripe-hosted dashboard
- Stripe responsible for negative balances
- Must provide `business_profile.support_phone` for `card_payments`

---

## Tax Reporting (U.S.)

### IRS Form 1099 Requirements

**Default `transfers` capability**:
- Does NOT collect all information for Form 1099-K or 1099-MISC

**If you have filing requirements**:
1. Request appropriate tax reporting capability
2. Collect necessary tax information at proper thresholds

### Additional Tax Information (U.S.)

**If can't verify `company.tax_id`**:
- Upload IRS Letter 147C OR IRS SS-4 confirmation letter
- Use `company.verification.document.front`
- Must include `company.name` and `company.tax_id`

---

## Minor Representatives

### Legal Guardian Requirements

**When representative is a minor**:
- Verify legal guardian
- Create Person with `relationship.legal_guardian` = true
- Guardian must sign Stripe ToS (store in `additional_tos_acceptances`)

**Guardian Verification**:
- If verification fails with `ssn_last_4`: Full SSN via `person.id_number`
- ID document if verification fails or no SSN
- Use `verification.document.front/back`

---

## Document Upload Process

### File Upload

**Step 1: Upload File**
```bash
curl https://files.stripe.com/v1/files \
  -u SECRET_KEY: \
  -H "Stripe-Account: CONNECTED_ACCOUNT_ID" \
  -F "purpose=account_requirement" \
  -F "file=@/path/to/file"
```

**Response**:
```json
{
  "id": "file_xxx",
  "created": 1403047735,
  "size": 4908
}
```

**Step 2: Attach to Account**
```bash
curl https://api.stripe.com/v1/accounts/CONNECTED_ACCOUNT_ID \
  -u SECRET_KEY: \
  -d "documents[proof_of_registration][files][]=file_xxx"
```

---

## Error Handling

### Common Error Codes

- `verification_failed_representative_authority`: Representative lacks authority
- `verification_legal_entity_structure_mismatch`: Business type/structure mismatch
- `verification_missing_owners`: Missing beneficial owners
- `verification_document_directors_mismatch`: Missing directors
- `verification_requires_additional_proof_of_registration`: Additional ownership docs needed
- `verification_rejected_ownership_exemption_reason`: Exemption reason rejected
- `verification_document_name_mismatch`: Document name doesn't match
- `verification_document_type_not_supported`: Document type not accepted

### Requirements Object

**Key Fields**:
- `requirements.currently_due`: Must provide now
- `requirements.past_due`: Overdue requirements
- `requirements.pending_verification`: Under review
- `requirements.errors`: Verification errors
- `requirements.disabled_reason`: Why capabilities disabled
- `requirements.alternatives`: Alternative fields to satisfy requirement

---

## Integration Recommendations

### Best Practices

1. **Use Connect Onboarding or Embedded Onboarding**:
   - Handles complex verification flows
   - Identity verification (selfies, liveness)
   - Automatic UBO detection
   - Document collection

2. **Start with Standard/Express for Simpler Cases**:
   - Stripe handles verification
   - Less integration work
   - Pre-fill data to speed up

3. **Custom Accounts for Full Control**:
   - Build complete onboarding flow
   - Handle all verification requirements
   - Monitor requirements object
   - Handle all error codes

4. **Progressive Information Collection**:
   - Collect minimum for card_payments first
   - Collect additional info for payouts
   - Meet thresholds before deadlines

5. **Monitor Requirements**:
   - Regularly check `requirements` object
   - Handle `currently_due` and `past_due`
   - Respond to verification errors
   - Track capability status

---

## Related Resources

- [Stripe Connect Documentation](https://docs.stripe.com/connect)
- [Account Capabilities](https://docs.stripe.com/connect/account-capabilities)
- [Handling API Verification](https://docs.stripe.com/connect/handling-api-verification)
- [Acceptable Verification Documents](https://docs.stripe.com/connect/handling-api-verification#acceptable-verification-documents)
- [Identity Verification](https://docs.stripe.com/connect/identity-verification)

---

**Last Updated**: January 2025
**Source**: Stripe Documentation
**Maintainer**: Engineering Team
