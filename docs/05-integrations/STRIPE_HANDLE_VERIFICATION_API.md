# Handle Verification with the API

Learn how Connect platforms can use webhooks and the API to handle verification of connected accounts.

**Source**: [Stripe Documentation - Handle verification with the API](https://docs.stripe.com/connect/handling-api-verification)

---

## Overview

Connect platforms that onboard connected accounts using the API must provide Stripe with required information for [Know Your Customer](https://support.stripe.com/questions/know-your-customer) (KYC) purposes and to enable [account capabilities](https://docs.stripe.com/connect/account-capabilities). They must collect the information themselves and use the Accounts and Persons APIs to provide it to Stripe. We then verify the information, asking for more details when needed.

> **Stripe Risk Reviews**
>
> Stripe risk reviews of an account can add extra requirements, which you can't fulfill using the API. Instead, enable your connected accounts to respond using embedded components, Stripe-hosted onboarding, or remediation links. You can also use your platform Dashboard to respond to risk reviews on behalf of your connected accounts.

---

## Verification Process

Before enabling charges and **payouts** (a payout is the transfer of funds to an external account, usually a bank account, in the form of a deposit) for a connected account, Stripe needs certain information that varies based on:

- The origin country of the connected accounts
- The [service agreement type](https://docs.stripe.com/connect/service-agreement-types) applicable to the connected accounts
- The [capabilities](https://docs.stripe.com/connect/account-capabilities) requested for the connected accounts
- The [business_type](https://docs.stripe.com/api/accounts/object#account_object-business_type) (for example, individual or company) and [company.structure](https://docs.stripe.com/api/accounts/object#account_object-company-structure) (for example, `public_corporation` or `private_partnership`)

Platforms need to choose the proper [onboarding flow](https://docs.stripe.com/connect/identity-verification#onboarding-flows) for their business and users to meet the KYC requirements. Broadly speaking, this means providing all the requisite information upfront or incrementally. Either way, set up your integration to watch for and respond to requests from Stripe.

### Setup Steps

1. **Establish a webhook URL**: Set up a [Connect webhook](https://docs.stripe.com/connect/webhooks) URL in your [webhook settings](https://dashboard.stripe.com/account/webhooks) to watch for activity, especially events of the `account.updated` type. When using the [Persons API](https://docs.stripe.com/api/persons), you should also watch for `person.updated` events.

2. **Check requirements immediately**: Immediately after creating an account, check the `Account` object's [requirements.currently_due](https://docs.stripe.com/api/accounts/object#account_object-requirements-currently_due) attribute for any additional requirements. Obtain any required information from the user and update the connected account.

3. **Monitor for updates**: Continue watching for `account.updated` event notifications to see if the `requirements` hash changes, and reach out to your user for additional information as needed.

**Important**: When you provide additional information, you don't need to resubmit any previously verified details. For example, if the `dob` is already verified, you don't need to provide it again in subsequent updates.

> When `requirements.currently_due` isn't empty, additional information is required. Connected accounts might be blocked from creating charges, receiving payouts, or performing certain tasks if you don't provide this information in a timely manner.

### Change Information After Verification

After an individual or company is verified, you can [change some of their information](https://docs.stripe.com/connect/update-verified-information), with limitations. See the [Update Account](https://docs.stripe.com/api/accounts/update) API for limitations based on the configuration of the connected account. [Contact support](https://support.stripe.com/contact) to make changes outside of these limitations.

---

## Determine if Verification is Needed

When you receive an `account.updated` event to your webhook or [fetch an account](https://docs.stripe.com/api#retrieve_account) with the API, you receive an [Account](https://docs.stripe.com/api/accounts/object) object. The `Account` object's `charges_enabled` and `payouts_enabled` attributes indicate whether the account can create charges and accept payouts.

### Requirements Hash Structure

The `Account` object has a `requirements` hash, representing the requirements needed to verify the account.

The `requirements` hash has the following arrays:

| Field | Description |
|-------|-------------|
| `eventually_due` | Requirements that you might need to collect, depending on whether the corresponding thresholds are reached. After a requirement becomes required, it also appears in the `currently_due` list. If a requirement becomes required and its due date is before the existing `current_deadline`, the `current_deadline` changes to the corresponding threshold's enforcement date. |
| `currently_due` | Requirements that you must collect by the `current_deadline` for the account to remain `active`. The `currently_due` requirement is a subset of `eventually_due`. |
| `past_due` | Requirements that have disabled capabilities because they weren't verified before the `current_deadline`. The `past_due` requirement is a subset of `currently_due`. |
| `errors` | Details about validation and verification failures that require particular requirements in `currently_due` or `past_due` to be collected again. |
| `disabled_reason` | Describes why the account isn't enabled and why it can't process charges or transfers. |
| `current_deadline` | Date that the requirements in `currently_due` must be collected by to keep the account `active`. It represents the earliest deadline across all of the account's requested capabilities and risk requirements, including any hidden capabilities. |
| `pending_verification` | Requirements that might become required, depending on the results of verification or review. It's an empty array unless an asynchronous verification is pending. Unsuccessful verification moves a requirement to `eventually_due`, `currently_due`, or `past_due`. A requirement subject to both failed and pending verifications can also remain in `pending_verification`. |

### Error Object Structure

The `errors` array contains:
- **`requirement`**: Identifies the requirement corresponding to the error.
- **`code`**: An enum value describing why the requirement is invalid or can't be verified.
- **`reason`**: An English message describing the error in more detail. The reason string can also suggest how to resolve the error.

### Example Requirements Hash

{% raw %}
```json
{
  "id": "{{CONNECTED_ACCOUNT_ID}}",
  "object": "account",
  "requirements": {
      "disabled_reason": null,
      "current_deadline": 1529085600,
      "past_due": [],
      "currently_due": [
          "company.tax_id",
          "company.verification.document",
          "tos_acceptance.date",
          "tos_acceptance.ip"
      ],
      "eventually_due": [
          "company.address.city",
          "company.address.line1",
          "company.address.postal_code",
          "company.address.state",
          "company.tax_id",
          "company.verification.document",
          "external_account",
          "tos_acceptance.date",
          "tos_acceptance.ip"
      ],
      "errors": [
          {
            "requirement": "company.verification.document",
            "reason": "The company name on the account couldn't be verified. Either update your business name or upload a document containing the business name.",
            "code": "failed_name_match"
          }
      ]
  }
}
```
{% endraw %}

### Handling Deadlines and Disabled Accounts

If `requirements.currently_due` contains entries, check `requirements.current_deadline`. The `current_deadline` is a Unix timestamp identifying when information is needed. Usually, if Stripe doesn't receive the information by the `current_deadline`, payouts on the account are disabled. However, other consequences might apply in some situations. For example, if payouts are already disabled and the account is unresponsive to our inquiries, Stripe might also disable the ability to process charges.

### Disabled Reason Values

Separately, the [requirements.disabled_reason](https://docs.stripe.com/api/accounts/object#account_object-requirements-disabled_reason) property can have a value. The value is a string describing the reason why this account is unable to make payouts or charges. In some instances, platforms and connected accounts can submit a form to resolve or appeal the reason.

- Connected accounts with access to the full Stripe Dashboard, including Standard accounts, can access additional information (if available) in the Dashboard.
- Platforms can look up an account on the [Connected accounts](https://docs.stripe.com/connect/dashboard/review-actionable-accounts) page to determine an account's `disabled_reason`. You might be able to provide additional information on behalf of your connected accounts. If the disabled reason is associated with an appeal, you can generate a link to a form for the account to resolve the appeal.

| Reason | Meaning |
|--------|---------|
| `action_required.requested_capabilities` | You need to request capabilities for the connected account. For details, see [Request and unrequest capabilities](https://docs.stripe.com/connect/account-capabilities#requesting-unrequesting). |
| `listed` | The account might be on a prohibited persons or companies list (Stripe investigates and either rejects or reinstates the account accordingly). |
| `rejected.fraud` | The account is rejected because of suspected fraud or illegal activity. |
| `rejected.incomplete_verification` | The account is rejected from incomplete verification requirements within the required threshold. |
| `rejected.listed` | The account is rejected because it's on a third-party prohibited persons or companies list (such as financial services provider or government). |
| `rejected.other` | The account is rejected for another reason. |
| `rejected.terms_of_service` | The account is rejected because of suspected terms of service violations. |
| `requirements.past_due` | Additional verification information is required to enable capabilities on this account. |
| `requirements.pending_verification` | Stripe is currently verifying information on the connected account. No action is required. Inspect the [requirements.pending_verification](https://docs.stripe.com/api/accounts/object#account_object-requirements-pending_verification) array to see the information being verified. |
| `under_review` | The account is under review by Stripe. |

---

## Validation and Verification Errors

The `Account` object includes a [requirements.errors](https://docs.stripe.com/api/accounts/object#account_object-requirements-errors) array that explains why the validation or verification requirements haven't been met, which you need to enable your account and capabilities. The `errors` array has the following attributes:

- **`requirement`**: Specifies which information from the `currently_due` array is needed.
- **`code`**: Indicates the type of error that occurred. See the [API reference](https://docs.stripe.com/api/accounts/object#account_object-requirements-errors-code) for all possible error codes.
- **`reason`**: Explains why the error occurred and how to resolve the error.

### Example Errors Array

{% raw %}
```json
{
  "id": "{{CONNECTED_ACCOUNT_ID}}",
  "object": "account",
  "requirements": {
      "current_deadline": 1234567800,
      "currently_due": [
          "company.address.line1",
          "{{PERSON_ID}}.verification.document"
      ],
      "errors": [
          {
            "requirement": "company.address.line1",
            "code": "invalid_street_address",
            "reason": "The provided street address cannot be found. Please verify the street name and number are correct in \"10 Downing Street\""
          },
          {
            "requirement": "{{PERSON_ID}}.verification.document",
            "code": "verification_document_failed_greyscale",
            "reason": "Greyscale documents cannot be read. Please upload a color copy of the document."
          }
      ]
  }
}
```
{% endraw %}

If verification or validation is unsuccessful but no requirements are currently due, a webhook triggers indicating that required information is eventually due.

---

## Business Information Verification

When information about a business is submitted, Stripe verifies the new information. For example, Stripe might verify that the provided business URL is valid, reachable, and includes information about the business. To check the status of verification information regarding a business, retrieve the `Account` object's `requirements` hash.

### Business Information Errors

| Error | Resolution |
|-------|------------|
| `invalid_business_profile_name` | Business names must be easy for people to understand and must consist of recognizable words. |
| `invalid_business_profile_name_denylisted` | Generic or well-known business names aren't supported. Make sure the provided business name matches the account's business. |
| `invalid_product_description_length` | A product description must be at least 10 characters. |
| `invalid_product_description_url_match` | A product description must be different from the URL of the business. |
| `invalid_url_denylisted`<br>`invalid_url_format`<br>`invalid_url_web_presence_detected`<br>`invalid_url_website_business_information_mismatch`<br>`invalid_url_website_empty`<br>`invalid_url_website_inaccessible`<br>`invalid_url_website_inaccessible_geoblocked`<br>`invalid_url_website_inaccessible_password_protected`<br>`invalid_url_website_incomplete`<br>`invalid_url_website_incomplete_cancellation_policy`<br>`invalid_url_website_incomplete_customer_service_details`<br>`invalid_url_website_incomplete_legal_restrictions`<br>`invalid_url_website_incomplete_refund_policy`<br>`invalid_url_website_incomplete_return_policy`<br>`invalid_url_website_incomplete_terms_and_conditions`<br>`invalid_url_website_incomplete_under_construction`<br>`invalid_url_website_other` | See [Handle URL verification errors](#handle-url-verification-errors) below. |

---

## Statement Descriptors

Stripe validates the statement descriptor and statement descriptor prefix when [set on an account](https://docs.stripe.com/connect/statement-descriptors). For example, Stripe might verify that the provided statement descriptor matches the description of the business. When validating the statement descriptor matches the business description, Stripe uses the first 22 characters of the statement descriptor, representing the part that is provided to the card networks. A business description is a close match of the account's `business_profile.name`, `business_profile.url`, or the name of the company or individual.

To retrieve the status of verification information regarding statement descriptors, review the `requirements` on the `Account` object.

### Statement Descriptor Errors

| Error | Resolution |
|-------|------------|
| `invalid_statement_descriptor_length` | A statement descriptor must be at least 5 characters. |
| `invalid_statement_descriptor_business_mismatch` | A statement descriptor must be similar to the business name, legal entity name, or URL of the account. |
| `invalid_statement_descriptor_denylisted`<br>`invalid_statement_descriptor_prefix_denylisted` | Generic or well-known statement descriptors aren't supported. |
| `invalid_statement_descriptor_prefix_mismatch` | The statement descriptor prefix must be similar to your statement descriptor, business name, legal entity name, or URL. |

---

## Business Representatives

You must collect and submit information about the people associated with a connected account. The process depends on whether your connected accounts are companies or individuals:

- **Companies only**: Use the [Persons](https://docs.stripe.com/api/persons) API to add the information to a `Person` object associated with the `Account` object.
- **Individuals only**: You can use the [Persons](https://docs.stripe.com/api/persons) API or the [individual](https://docs.stripe.com/api/accounts/object#account_object-individual) hash on the `Account` object.
- **A combination of individuals and companies**: Use the [Persons](https://docs.stripe.com/api/persons) API to add the information to a `Person` object associated with the account. That lets you use the same process for all of your connected accounts, regardless of their type.

To retrieve the status of verification information regarding a person, use the [requirements](https://docs.stripe.com/api/persons/object#person_object-requirements) hash.

### Person Verification Errors

| Error | Resolution |
|-------|------------|
| `invalid_address_city_state_postal_code` | Stripe couldn't validate the combination of the city, state, and postal code in the provided address. |
| `invalid_address_highway_contract_box` | The address of the person must be a valid physical address from which the account conducts business and can't be a Highway Contract Box. |
| `invalid_address_private_mailbox` | The address of the person must be a valid physical address from which the account conducts business and can't be a private mailbox. |
| `invalid_dob_age_under_minimum` | The person must be at least 13 years old. |
| `invalid_dob_age_over_maximum` | The person's date of birth must be within the past 120 years. |
| `invalid_phone_number` | Stripe couldn't validate the phone number on the account. Make sure the formatting matches the country of the person. |
| `invalid_street_address` | Stripe couldn't validate the street name and/or number for the provided address. |
| `invalid_tax_id`<br>`invalid_tax_id_format` | Tax IDs must be a unique set of 9 numbers without dashes or other special characters. |

---

## Acceptable Verification Documents by Country

To learn about specific document requirements, view [Acceptable verification documents by country](https://docs.stripe.com/acceptable-verification-documents).

---

## Company Information

During the verification process, you might need to collect information about the company for an account.

To retrieve the status of verification information regarding an account's company, use the `Account` object's [company.verification](https://docs.stripe.com/api/accounts/object#account_object-company-verification) subhash:

{% raw %}
```json
{
  "id": "{{CONNECTED_ACCOUNT_ID}}",
  "object": "account",
  "company": {
    "verification": {
      "document": null
    }
  }
}
```
{% endraw %}

You can look up the definition for each verification attribute on the `Account` object.

---

## Handle Document Verification Problems

Problems with identity documents, either with uploaded files themselves or with using them to validate other information, cause many requirement verification errors. To help you recognize and handle the most common problems, the tables below list requirement error `code` values related to document issues and provide guidance for resolving them.

### Document File Errors

| Code | Resolution |
|------|------------|
| `verification_document_corrupt`<br>`verification_document_failed_copy`<br>`verification_document_failed_greyscale`<br>`verification_document_incomplete`<br>`verification_document_not_readable`<br>`verification_document_not_uploaded`<br>`verification_document_not_signed`<br>`verification_document_missing_back`<br>`verification_document_missing_front`<br>`verification_document_too_large` | The upload failed due to a problem with the file itself. Ask your account user to provide a new file that meets these requirements:<br>• Color image (8,000 pixels by 8,000 pixels or smaller)<br>• 10 MB or less<br>• Identity documents are JPG or PNG format<br>• Address or legal entity documents are JPG, PNG, or PDF format<br>• Legal entity documents must include all pages<br>• Must not be password protected |
| `verification_document_country_not_supported`<br>`verification_document_invalid`<br>`verification_document_type_not_supported` | The provided file isn't an acceptable form of ID from a supported country, or isn't a type of legal entity document that is expected. Ask your account user to provide a new file that meets that requirement. For a list, see [Acceptable ID types by country](https://docs.stripe.com/connect/handling-api-verification#acceptable-verification-documents). |
| `verification_failed_other`<br>`verification_document_failed_other` | Your team can contact Stripe to learn more about why identity verification failed. |
| `verification_document_expired`<br>`verification_document_issue_or_expiry_date_missing` | The issue or expiry date is missing on the document, or the document is expired. If it's an identity document, its expiration date must be after the date the document was submitted. If it's an address document, the issue date must be within the last six months. |

### Identity Verification Errors

| Code | Resolution |
|------|------------|
| `verification_failed_keyed_identity` | The name on the account couldn't be verified. Ask your account user to verify that they have provided their full legal name and to also provide a photo ID matching that name. |
| `verification_document_name_mismatch`<br>`verification_document_dob_mismatch`<br>`verification_document_address_mismatch`<br>`verification_document_id_number_mismatch`<br>`verification_document_photo_mismatch` | The information on the ID document doesn't match the information provided by the account user. Ask them to verify and correct the provided information on the account. |
| `verification_document_fraudulent`<br>`verification_document_manipulated` | The document might have been altered. Contact Stripe Support for more information. |

### Business Verification Errors

| Code | Resolution |
|------|------------|
| `verification_failed_keyed_match`<br>`verification_failed_document_match` | The information on the account couldn't be verified. Your account user can either upload a document to confirm their account details, or update their information on their account. |
| `verification_failed_tax_id_not_issued`<br>`verification_failed_tax_id_match` | The information that your account user provided couldn't be verified with the IRS. Ask them to correct any possible errors in the company name or tax ID, or upload a document that contains those fields. (US only) |
| `verification_failed_id_number_match`<br>`verification_failed_name_match`<br>`verification_failed_address_match` | The information on the document doesn't match the information provided by the account user. Ask them to verify and correct the provided information on the account, or upload a document with information that matches the account. |
| `verification_document_address_missing`<br>`verification_document_id_number_missing`<br>`verification_document_name_missing` | The uploaded document is missing a required field. Ask your account user to upload another document that contains the missing field. |
| `verification_legal_entity_structure_mismatch` | Business type or structure seems to be incorrect. Provide the correct business type and structure for this account. |

### Relationship Verification Errors

| Code | Resolution |
|------|------------|
| `information_missing` | Refer to the error message to understand what information was missing in the document or keyed-in data. If related to holding companies with significant ownership, the error code also provides the missing holding companies we've identified. For more information, refer to our [beneficial ownership verification for holding companies](https://support.stripe.com/questions/beneficial-ownership-verification-for-holding-companies) support article. |
| `verification_failed_authorizer_authority` | We couldn't verify the authority of the provided authorizer. Change the authorizer to a person who is registered as an authorized representative. Refer to our [Representative authority verification](https://support.stripe.com/questions/representative-authority-verification) support article. |
| `verification_failed_representative_authority` | We couldn't verify the authority of the account representative. Add an authorizer to the account and provide a Letter of Authorization signed by the authorizer. Refer to our [Representative authority verification](https://support.stripe.com/questions/representative-authority-verification) support article. |
| `verification_missing_owners` | Business owners not provided. Provide information for all business owners or invite them to provide it themselves. The owners we have identified as missing are: [Name1, Name2]. |
| `verification_missing_directors` | Directors are missing from the account. Update the account and upload a registration document with current directors. |
| `verification_document_directors_mismatch` | Directors from the document are missing from the account. Update the account and upload a registration document with current directors. |
| `verification_rejected_ownership_exemption_reason` | The ownership exemption reason was rejected. Choose a different exemption reason or upload a proof of ultimate beneficial ownership document instead. |

> **Important**: Don't resubmit a file that previously failed. Duplicate uploads immediately trigger an error and aren't rechecked.

---

## Handle URL Verification Errors

URLs for e-commerce businesses need to conform to certain card network standards. In order to comply with these standards, Stripe conducts a number of verifications when reviewing URLs. To learn about best practices for URLs and common elements for e-commerce businesses, see the [website checklist](https://docs.stripe.com/get-started/checklist/website).

In many cases, you can resolve business URL verification errors by [generating a remediation link](https://docs.stripe.com/connect/dashboard/remediation-links) from your platform Dashboard. Otherwise, update the `Account` object's [business_profile.url](https://docs.stripe.com/api/accounts/update#update_account-business_profile-url). If you resolve the error another way, such as by fixing a problem with the company's website, trigger re-verification by changing the URL on the `Account` object to any other value, then immediately changing it back.

Not all URL-related issues can be resolved using the API. Certain types of URL verification errors require additional information on how to access the connected account's website or to attest that the account is exempt from URL requirements. These types of issues require you or your connected account to provide supplemental information.

If you can't resolve the issue, direct your connected account to [contact Stripe Support](https://support.stripe.com/contact).

> **E-commerce Website Requirement**
>
> Stripe's Terms of Service require all e-commerce businesses to populate their account's [business_profile.url](https://docs.stripe.com/api/accounts/object#account_object-business_profile-url) property with a working URL of their business website when activating the account with the `card_payments` capability. An account is considered an e-commerce business if it promotes or sells any products or services through an online website, social media profile, or mobile application. If the account doesn't operate a website to promote their business, sell products, or accept payments, they're required to provide the [business_profile.product_description](https://docs.stripe.com/api/accounts/object#account_object-business_profile-product_description) instead. A product description needs to detail the type of products being sold, as well as the manner in which the account charges its customers (for example, in-person transactions). For more information, see the [Business website for account activation FAQ](https://support.stripe.com/questions/business-website-for-account-activation-faq).

### URL Verification Error Codes

| Error | Resolution |
|-------|------------|
| `invalid_url_denylisted` | The provided URL matches a generic business website that Stripe believes is unrelated to the account. To resolve the issue, provide a URL that is specific to the business. |
| `invalid_url_format` | The provided URL is in the incorrect format. To resolve the issue, provide a correctly formatted URL, such as `https://example.com`. |
| `invalid_url_website_inaccessible` | We can't reach the website at the provided URL. If you block certain regions from viewing your website, temporarily remove the blocker until your website has been verified. |
| `invalid_url_website_business_information_mismatch` | Information on the website at the provided URL doesn't match the information on the Stripe account. |
| `invalid_url_website_incomplete` | The website at the provided URL is missing either a business name or a clear description of goods and services offered. |
| `invalid_url_website_other` | We are unable to verify the account's business using a website, social media profile, or mobile application at the provided URL. |
| `invalid_url_web_presence_detected` | We have detected that the account uses a website, social media profile, or mobile application to sell or promote products or services, but a URL hasn't been provided. To resolve the issue, provide a URL. |
| `invalid_url_website_incomplete_customer_service_details` | The website doesn't contain customer service details. |
| `invalid_url_website_incomplete_return_policy` | The website doesn't contain a return policy and process. |
| `invalid_url_website_incomplete_refund_policy` | The website doesn't contain a refund policy. |
| `invalid_url_website_incomplete_cancellation_policy` | The website doesn't contain a cancellation policy. |
| `invalid_url_website_incomplete_legal_restrictions` | The website doesn't contain applicable disclosures for products and services that are subject to legal or export restrictions. |
| `invalid_url_website_incomplete_terms_and_conditions` | The website doesn't contain terms and conditions. |
| `invalid_url_website_incomplete_under_construction` | We are unable to verify the website at the provided URL, because the website is still under construction. |
| `invalid_url_website_inaccessible_password_protected` | We are unable to verify the website at the provided URL, because the website is password-protected. |
| `invalid_url_website_inaccessible_geoblocked` | We are unable to verify the website at the provided URL, because certain regions are blocked from accessing it. If you block certain regions from viewing your website, temporarily remove the blocker until your website has been verified. |
| `invalid_url_website_empty` | We are unable to verify the website at the provided URL, because the website has no content. |

---

## Handle Liveness Requirements

An account can have one or more [Person](https://docs.stripe.com/api/persons) objects with a `proof_of_liveness` requirement. A `proof_of_liveness` requirement might require collection of an electronic ID credential such as [MyInfo](https://www.singpass.gov.sg/main/individuals/) in Singapore, or by using Stripe Identity to collect a document or selfie. We recommend using Stripe-hosted or embedded onboarding to satisfy all variations of the `proof_of_liveness` requirement.

### Hosted Onboarding

[Stripe-hosted onboarding](https://docs.stripe.com/connect/hosted-onboarding) can complete all variations of `proof_of_liveness` requirements.

[Create an Account Link](https://docs.stripe.com/connect/hosted-onboarding#create-account-link) using the connected account ID, and send the account to the `url` returned.

{% raw %}
```bash
curl https://api.stripe.com/v1/account_links \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d account="{{CONNECTEDACCOUNT_ID}}" \
  --data-urlencode refresh_url="https://example.com/refresh" \
  --data-urlencode return_url="https://example.com/return" \
  -d type=account_onboarding \
  -d "collection_options[fields]"=currently_due
```
{% endraw %}

The account receives a prompt to complete the `proof_of_liveness` requirement, along with any other currently due requirements. Listen to the `account.updated` event sent to your webhook endpoint to be notified when the account completes requirements and updates their information. After the account completes the requirement, the account is redirected to the `return_url` specified.

### Embedded Onboarding

[Embedded onboarding](https://docs.stripe.com/connect/embedded-onboarding) can complete all forms of `proof_of_liveness` requirements.

When [creating an Account Session](https://docs.stripe.com/api/account_sessions/create), enable account onboarding by specifying `account_onboarding` in the `components` parameter.

If you don't need to collect bank account information, disable `external_account_collection`. This typically applies to Connect platforms that want to use third-party external account collection providers.

{% raw %}
```bash
curl https://api.stripe.com/v1/account_sessions \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d account="{{CONNECTEDACCOUNT_ID}}" \
  -d "components[account_onboarding][enabled]"=true \
  -d "components[account_onboarding][features][external_account_collection]"=false
```
{% endraw %}

After creating the Account Session and [initializing ConnectJS](https://docs.stripe.com/connect/get-started-connect-embedded-components#account-sessions), you can render the Account onboarding component in the front end:

**JavaScript**:
```js
const accountOnboarding = stripeConnectInstance.create('account-onboarding');
accountOnboarding.setOnExit(() => {
  console.log('User exited the onboarding flow');
});
container.appendChild(accountOnboarding);
```

**React**:
```jsx
import * as React from "react";
import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";

const AccountOnboardingUI = () => {
  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <ConnectAccountOnboarding
        onExit={() => {
          console.log("The account has exited onboarding");
        }}
      />
    </ConnectComponentsProvider>
  );
}
```

The account receives a prompt to complete the `proof_of_liveness` requirement, along with any other currently due requirements. Listen to the `account.updated` event sent to your webhook endpoint to be notified when the account completes requirements and updates their information. After the account completes the requirements, ConnectJS calls your `onExit` JavaScript handler.

---

## Handle Identity Verification

In some cases, depending on how much of an account's identity information Stripe has been able to verify, we might ask you to upload one or more documents. Required documents appear in the `Account` object's `requirements` hash.

### Required Document Types

The following entries in `requirements.currently_due` identify documents that you must upload:

- **`person.verification.document`**: Requires a color scan or photo of an acceptable form of ID.
- **`person.verification.additional_document`**: Requires a color scan or photo of a document verifying the user's address, such as a utility bill.
- **`company.verification.document`**: Requires a proof of entity document establishing the business' entity ID number, such as the company's articles of incorporation.

Uploading a document is a two-step process:

1. Upload the file to Stripe
2. Attach the file to the account

> **Security Note**: For security reasons, Stripe doesn't accept copies of IDs sent by email.

### Step 1: Upload a File

To upload a file, use the [Create File](https://docs.stripe.com/api/files/create) API by using a POST to send the file data as part of a `multipart/form-data` request.

**File Requirements**:
- Color image (8,000 pixels by 8,000 pixels or smaller)
- 10 MB or less
- Identity documents are JPG or PNG format
- Address or legal entity documents are JPG, PNG, or PDF format

Pass the file data in the `file` parameter and set the [purpose](https://docs.stripe.com/api/files/create#create_file-purpose) parameter according to the `Account` or `Person` object that will hold the document.

**Example**:
{% raw %}
```bash
curl https://files.stripe.com/v1/files \
  -u <<YOUR_SECRET_KEY>>: \
  -H "Stripe-Account: {{CONNECTED_STRIPE_ACCOUNT_ID}}" \
  -F "purpose"="identity_document" \
  -F "file"="@/path/to/a/file"
```
{% endraw %}

This request uploads the file and returns a token:

{% raw %}
```json
{
  "id": "{{FILE_ID}}",
  "created": 1403047735,
  "size": 4908
}
```
{% endraw %}

Use the token's `id` value to attach the file to a connected account for identity verification.

### Step 2: Attach the File

After you upload the file and receive a representative token, update the `Account` or `Person` object and provide the file ID in the appropriate parameter.

**Example for ID document**:
{% raw %}
```bash
curl https://api.stripe.com/v1/accounts/{{CONNECTEDACCOUNT_ID}}/persons/{{PERSON_ID}} \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d "verification[document][front]"="{{FILE_ID}}"
```
{% endraw %}

**Example for company document**:
{% raw %}
```bash
curl https://api.stripe.com/v1/accounts/{{CONNECTEDACCOUNT_ID}} \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d "company[verification][document][front]"="{{FILE_ID}}"
```
{% endraw %}

This update changes `verification.status` to `pending`. If an additional person needs to be verified, use the [Persons](https://docs.stripe.com/api/persons) API to update them.

### Confirm ID Verification

Satisfying all identity verification requirements for a person or company triggers a `v2.core.account_person.updated` or `v2.core.account[identity].updated` webhook notification, signaling that the verification process is complete.

Stripe can take anywhere from a few minutes to a few business days to verify an image, depending on its readability.

If the verification attempt fails, the associated requirement entry contains an error with a `code` and `description` describing the cause. The `description` contains a human-readable message such as "The image supplied isn't readable," which is safe to present to your account user but isn't localized. The `code` value is a string such as `verification_document_not_readable`, which you can use to localize error messages for your account users.

Verification failure also triggers a `v2.core.account_person.updated` or `v2.core.account[identity].updated` webhook notification.

### Hosted Document Collection with Stripe Identity

You can use [Stripe Identity](https://docs.stripe.com/identity) to fulfill a `person.verification.document` requirement to collect a document and attach it directly to the account.

> **Note**: You can't collect `person.verification.additional_document` and `company.verification.document` with Stripe Identity.

[Create a VerificationSession](https://docs.stripe.com/api/identity/verification_sessions/create). Specify the `related_person` parameter to associate the collected verification data with the `Person` object requiring the `document`.

{% raw %}
```bash
curl https://api.stripe.com/v1/identity/verification_sessions \
  -u "<<YOUR_SECRET_KEY>>:" \
  -d type=document \
  -d "related_person[account]"="{{CONNECTEDACCOUNT_ID}}" \
  -d "related_person[person]"="{{PERSON_ID}}"
```
{% endraw %}

After you create the VerificationSession, use the returned `client_secret` to [show the Identity modal to the user](https://docs.stripe.com/identity/verify-identity-documents?platform=web&type=modal#show-modal) or redirect the user to the `url`. Verification completion automatically updates the account.

We send an `account.updated` event to your webhook endpoint when the account completes the identity check and updates their information.

---

## Handle Risk Verifications

Stripe reports risk and compliance requirements in the [accounts.requirements](https://docs.stripe.com/api/accounts/object#account_object-requirements) attribute. These requirements follow the schema: `<id>.<requirement_description>.<resolution_path>`:

- **`id`**: Uniquely identifies information needed by Stripe or our financial partners. This identifier is always prefixed with `interv_` to indicate that it is a risk verification requirement.
- **`requirement_description`**: Specifically describes the information needed to complete the requirement, such as `identity_verification`, `rejection_appeal`, and so on.
- **`resolution_path`**: Specifies how you or your connected account can provide the requested information:
  - **`challenge`**: Connected accounts must directly respond to challenge prompts. They often require sensitive information, such as a bank account, or information that only the account owner can provide, such as a selfie.
  - **`form`**: Connected accounts can complete form requests, or you can complete them on their behalf.
  - **`support`**: The requirement isn't directly actionable. Contact [Stripe Support](https://support.stripe.com/).

### Example Risk Requirement

{% raw %}
```json
{
  "id": "{{CONNECTED_ACCOUNT_ID}}",
  "object": "account",
  "requirements": {
      "current_deadline": 1234567800,
      "currently_due": [
          "{{REQUIREMENT_ID}}.restricted_or_prohibited_industry_diligence.form"
      ],
      "pending_verification": []
  }
}
```
{% endraw %}

After satisfying a resolution path, the value of the requirement's resolution path might change to `support` and the requirement also appears in the `pending_verification` section of the requirements hash. Stripe verifies the submitted information and either dismisses the requirement as resolved or posts a new currently due requirement.

{% raw %}
```json
{
  "id": "{{CONNECTED_ACCOUNT_ID}}",
  "object": "account",
  "requirements": {
      "current_deadline": 1234567800,
      "currently_due": [],
      "pending_verification": [
        "{{REQUIREMENT_ID}}.restricted_or_prohibited_industry_diligence.support"
      ]
  }
}
```
{% endraw %}

### Remediation Methods

You can remediate risk and compliance requirements in any of the following ways, depending on the type of requirement:

- **Connect embedded components**: You can [embed Connect components](https://docs.stripe.com/connect/get-started-connect-embedded-components) directly into your website. When a requirement surfaces, direct your users to the [account onboarding](https://docs.stripe.com/connect/supported-embedded-components/account-onboarding) embedded component, where they're prompted to complete outstanding requirements directly in your UI. Alternatively, use the [Notification banner](https://docs.stripe.com/connect/supported-embedded-components/notification-banner) embedded component to prompt your users for any outstanding requirements.

- **Stripe hosted onboarding**: You can generate links to direct your connected accounts to complete outstanding requirements programmatically through account links or manually in your [platform Dashboard](https://docs.stripe.com/connect/dashboard/review-actionable-accounts).

- **Complete on behalf of your accounts**: You can use your [platform Dashboard](https://docs.stripe.com/connect/dashboard/review-actionable-accounts) to identify and complete form-based risk requirements from connected account detail on behalf of your accounts.

### Risk Requirement Descriptions

| Value | Description |
|-------|-------------|
| `business_model_verification` | We require additional information about the nature of the business to verify that we can support the account. |
| `restricted_or_prohibited_industry_diligence` | The business might operate in [a restricted category](https://stripe.com/legal/restricted-businesses) (for example, selling alcohol, insurance, or financial products). Stripe might require more information about the nature of the business or licensing information to verify that we can support the account. |
| `intellectual_property_usage` | The business might be selling products or services that are protected by copyright. We require additional information to verify that the account is authorized to sell those products. |
| `supportability_rejection_appeal` | The Stripe terms of service prohibit supporting the business. The account can appeal this determination. |
| `other_supportability_inquiry` | We require additional information to verify that we can support the account. |
| `credit_review` | We require additional information about the nature of the business to verify that we can support the account. |
| `reserve_appeal` | We've applied a reserve to the account. The reserve doesn't impact the account's ability to accept payments with Stripe. The account can appeal our determination. |
| `identity_verification` | The person responsible for the account must verify their identity by uploading an ID document and a selfie. |
| `url_inquiry` | The business URL must reflect the products and services that it provides. Stripe might require them to change the URL before we can support the account. |
| `address_verification` | We need to verify the address of the business through document upload. |
| `domain_verification` | We need to verify that the account owner controls the URL or domain that they provided. |
| `bank_account_verification` | We need to verify bank account details associated with the business. |
| `customer_service_contact` | We need to verify customer service contact information associated with the business. |
| `fulfillment_policy` | We need to verify the business's fulfillment policy. |
| `product_description` | The business's Stripe account must include an accurate product description. |
| `statement_descriptor` | We need a statement descriptor that accurately reflects the business. |
| `capability_disable_appeal` | The Stripe Terms of Service prohibit supporting specific capabilities associated with this business. The account can appeal this determination. |
| `rejection_appeal` | The Stripe Terms of Service prohibit supporting the business due to the level of risk it presents. The account can appeal this determination. |
| `platform_concern` | The platform initiated an intervention on its own connected account. It can be a real intervention or an API integration test. |
| `other_compliance_inquiry` | We require additional compliance information that doesn't fit any of the other descriptions. |
| `other_business_inquiry` | We require additional business information that doesn't fit any of the other descriptions. |

---

## Related Documentation

- [Identity verification for connected accounts](https://docs.stripe.com/connect/identity-verification)
- [Account tokens](https://docs.stripe.com/connect/account-tokens)
- [Testing Connect](https://docs.stripe.com/connect/testing)
- [Testing account identity verification](https://docs.stripe.com/connect/testing-verification)
- [Required verification information](./STRIPE_VERIFICATION_REQUIREMENTS.md)
- [Handle verification updates](./STRIPE_HANDLE_VERIFICATION_UPDATES.md)

---

**Last Updated**: January 2025
**Source**: Stripe Documentation
**Maintainer**: Engineering Team
