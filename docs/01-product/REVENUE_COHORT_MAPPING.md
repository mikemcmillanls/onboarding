# Revenue Range and Cohort Mapping

This document defines the revenue ranges used in the account creation flow and how they map to merchant cohorts.

## Revenue Range Dropdown Options

These are the 7 revenue range options presented to merchants during account creation (Page 2 of `/get-started`):

| Revenue Range Value | Label | Min | Max | Default Cohort |
|---|---|---|---|---|
| under-100k | Under $100,000 | 0 | 100,000 | Self-Serve |
| 100k-250k | $100,000 - $250,000 | 100,000 | 250,000 | Self-Serve |
| 250k-500k | $250,000 - $500,000 | 250,000 | 500,000 | Self-Serve |
| 500k-1m | $500,000 - $1M | 500,000 | 1,000,000 | Assisted |
| 1m-2m | $1M - $2M | 1,000,000 | 2,000,000 | Assisted |
| 2m-5m | $2M - $5M | 2,000,000 | 5,000,000 | Managed |
| over-5m | Over $5M | 5,000,000 | 999,999,999 | Managed |

## Cohort Assignment Logic

### Primary Factor: Annual Revenue

**Self-Serve Cohort**:
- Revenue < $500,000
- Ranges: under-100k, 100k-250k, 250k-500k

**Assisted Cohort**:
- Revenue $500,000 - $2,000,000
- Ranges: 500k-1m, 1m-2m

**Managed Cohort**:
- Revenue ≥ $2,000,000
- Ranges: 2m-5m, over-5m

### Override Factor: Location Count

Location count can override revenue-based cohort assignment:

- **< 3 locations**: May assign Self-Serve regardless of revenue
- **3-10 locations**: May assign Assisted regardless of revenue
- **≥ 10 locations**: Typically assigns Managed regardless of revenue

## Implementation Reference

- **Form Options**: `lib/merchant-mock-data.ts:101-109`
- **Cohort Logic**: `lib/merchant-mock-data.ts:265-284`
- **Component**: `components/get-started/business-form.tsx`

## Related Documentation

- [User Flow 1: Signup and Provisioning](../02-design/USER_FLOW_01_SIGNUP_AND_PROVISIONING.md) - Complete signup flow documentation
- [Sales Context](../04-reference/SALES_CONTEXT.md) - Sales team insights on merchant segments
- [CLAUDE.md](../../CLAUDE.md) - High-level cohort definitions

---

**Document Status**: Initial creation
**Last Updated**: 2025-10-16
