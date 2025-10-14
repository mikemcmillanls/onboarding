# Account Executive SLA Strategy & Capacity Planning

**Version:** 1.0
**Status:** Final for Phase 1 MVP
**Last Updated:** October 2025
**Owner:** Product Lead

---

## Executive Summary

**Core Question:** Is "15 minutes" a realistic SLA for AE response time to high-value leads?

**Recommendation for Phase 1:** **2-Hour Response SLA During Business Hours with Immediate Acknowledgment**

**Rationale:** While "15 minutes" creates urgency and demonstrates responsiveness, it's operationally unrealistic given AE workload variability (calls, demos, deal closings). A 2-hour SLA with immediate automated acknowledgment balances speed-to-lead benefits with sustainable AE capacity planning.

**Key Strategy:**
- **Immediate:** Automated email/SMS acknowledgment when lead is assigned
- **Within 30 minutes:** AE claims lead and reviews profile
- **Within 2 hours:** AE makes first contact attempt (call + email)
- **Fallback:** Flexible scheduling option if merchant prefers callback

---

## The Problem with "15 Minutes"

### Why Fast Response Matters

Industry research shows:
- **5-minute response:** 100x more likely to qualify lead vs. 30-minute response
- **Speed-to-lead correlation:** First responder wins 35-50% of deals
- **Merchant expectation:** In an instant-gratification world, prospects expect near-immediate engagement

**Business Impact:** We lose high-value deals if we're slow to respond.

### Why "15 Minutes" is Operationally Risky

**AE Workload Reality:**
- Active demo calls: 1-2 hours each
- Contract negotiations: Deep focus time
- Existing customer escalations: Unpredictable timing
- Internal meetings: Product training, sales huddles
- Admin work: CRM updates, quote building

**Peak Lead Volume Scenario:**
- 5 new high-value leads come in during lunch hour
- All existing AEs are on calls or out of office
- Who responds in 15 minutes?

**SLA Miss Consequences:**
- Consistently missing SLA damages credibility internally
- Creates pressure to rush calls, reducing quality
- Leads to AE burnout or corner-cutting

**Verdict:** 15-minute SLA is aspirational but not sustainable as a committed promise.

---

## Phase 1 Recommendation: 2-Hour Blended Response SLA

### The Blended Approach

Instead of a single "first contact" SLA, use a **multi-touchpoint strategy**:

| Timing | Action | Owner | Purpose |
|--------|--------|-------|---------|
| **Immediate** (0 min) | Automated acknowledgment email/SMS | System | Set expectations, reduce anxiety |
| **Within 30 min** | AE claims lead, reviews profile | AE | Internal routing, prep for outreach |
| **Within 2 hours** | First contact attempt (call + follow-up email) | AE | Human engagement, qualify needs |
| **Within 4 hours** | Second contact attempt if no answer | AE | Persistence increases reach rate |
| **Within 24 hours** | Third attempt + voicemail + scheduling link | AE | Offer flexibility for busy merchants |

### Immediate Acknowledgment (0 Minutes)

**Automated Message Content:**

**Subject:** "Your Lightspeed account is being set up - [AE Name] will call soon"

**Body:**
> Hi [Merchant Name],
>
> Thank you for your interest in Lightspeed POS + Payments! We're excited to help you grow your business.
>
> **What happens next:**
> - Your dedicated Account Executive, [AE Name], will call you within 2 hours
> - In the meantime, [AE Name] is reviewing your business profile to provide tailored recommendations
> - Prefer to schedule a specific time? Book here: [Calendly link]
>
> **Need immediate help?**
> - Call us: 1-800-XXX-XXXX
> - Live chat: [link]
>
> We look forward to speaking soon!
>
> [AE Name]
> Account Executive, Lightspeed

**SMS Version:**
> Hi [Name]! Your Lightspeed specialist [AE Name] will call within 2 hours. Prefer to schedule? [short link]

**Why This Works:**
- Merchant feels acknowledged immediately (reduces anxiety)
- Sets clear expectation (2 hours vs. "someone will call you")
- Personalizes with AE name (builds connection)
- Offers control (scheduling option for busy merchants)
- Provides backup channel (phone, chat) for urgent needs

---

### First Contact Attempt (Within 2 Hours)

**AE Workflow:**

1. **Lead Assignment Notification** (Slack, email, CRM alert)
   - Merchant profile summary (GTV, locations, vertical)
   - Cohort assignment (Assisted vs. Managed)
   - Any notes from account creation form

2. **AE Claims Lead (Within 30 Min)**
   - Click "Claim" in CRM to assign to self
   - Review merchant profile and prep talking points
   - Check for any urgent flags (competitor evaluation, time-sensitive need)

3. **First Call Attempt (Within 2 Hours)**
   - Call from business line (not personal cell)
   - If answered: Qualify needs, build rapport, discuss next steps
   - If voicemail: Leave brief message + follow-up email

**Voicemail Script:**
> "Hi [Merchant Name], this is [AE Name] from Lightspeed. I just sent you a quick email about your account setup. I'd love to chat for 10 minutes about your POS needs and how we can help. I'll try you again in a couple hours, or feel free to grab time on my calendar - the link is in my email. Talk soon!"

**Follow-Up Email (Sent Immediately After Call Attempt):**

**Subject:** "Quick follow-up - Let's discuss your Lightspeed setup"

**Body:**
> Hi [Merchant Name],
>
> I just tried calling you at [phone number] but couldn't connect. No worries - I know you're busy running [business type]!
>
> I reviewed your account and have some ideas on how Lightspeed can help you [specific value prop based on vertical/GTV].
>
> **Let's connect:**
> - I'll try calling again around [time 2 hours from now]
> - Or, pick a time that works for you: [Calendly link]
> - Prefer email? Just reply with your questions
>
> Looking forward to chatting!
>
> [AE Name]
> [Phone] | [Email]

---

### If No Contact Within 2 Hours (Fallback Protocol)

**Scenario:** AE is on a long demo call, lead comes in 90 minutes ago, approaching 2-hour SLA

**Fallback Options:**

1. **Queue Redistribution (Recommended)**
   - If lead is unclaimed after 1.5 hours, send alert to backup AE or sales manager
   - Backup AE makes first contact
   - Original AE can reclaim after their call ends

2. **IC Holding Pattern**
   - If all AEs are unavailable, IC team can send holding message
   - "Your AE is wrapping up with another customer and will call within 30 minutes"
   - IC doesn't qualify or sell - just maintains contact

3. **Extend SLA Gracefully**
   - System automatically sends update: "Your AE is finishing a call and will reach you by [new time]"
   - Transparency reduces frustration
   - Offer immediate callback scheduling

---

## Business Hours Definition

### Phase 1: Business Hours Coverage

**Coverage Model:**
- **Monday-Friday:** 8 AM - 8 PM (merchant's local time zone)
- **Saturday:** 10 AM - 4 PM (limited team, 4-hour SLA)
- **Sunday:** Closed (leads queued for Monday morning)

**Time Zone Handling:**
- Leads auto-routed to AE in appropriate time zone
- If merchant in Pacific time zone signs up at 7 PM PT (10 PM ET), acknowledgment email includes: "Your AE will call first thing tomorrow morning"

**After-Hours Lead Handling:**
- Immediate automated acknowledgment (still sent)
- Updated messaging: "Your AE will call within 2 hours of office opening tomorrow"
- Urgent needs: Provide emergency hotline for Enterprise customers (Managed cohort only)

### Phase 2 Consideration: Extended/24-7 Coverage

**Not Recommended for Phase 1 Due To:**
- Small AE team size (expect 3-5 AEs at launch)
- Cost of after-hours staffing
- Low lead volume in early days (insufficient to justify 24-7)

**When to Consider:**
- Lead volume >100/day
- International expansion (APAC, EU time zones)
- Competitive pressure (if competitors offer 24-7 response)
- High after-hours lead value (data shows they convert better)

---

## AE Capacity Planning & Workload Model

### Capacity Model Inputs

**Average AE Workload (Per Week):**

| Activity | Time per Activity | Volume per Week | Total Hours |
|----------|-------------------|-----------------|-------------|
| **New Lead Calls** | 30 min | 15-20 leads | 7.5-10 hrs |
| **Discovery Demos** | 60 min | 5-7 demos | 5-7 hrs |
| **Quote Building** | 45 min | 5-7 quotes | 3.75-5.25 hrs |
| **Negotiation/Follow-up** | 30 min | 8-10 touches | 4-5 hrs |
| **Contract Closing** | 45 min | 3-5 closes | 2.25-3.75 hrs |
| **Escalations/Support** | Variable | 3-5 hours | 3-5 hrs |
| **Admin/CRM** | Variable | 2-3 hours | 2-3 hrs |
| **Meetings/Training** | Variable | 3-4 hours | 3-4 hrs |
| **Total** | | | **31-43 hrs** |

**Conclusion:** AEs are near full capacity with existing workflows. Adding "respond within 15 minutes" creates constant interruption stress.

### Capacity Thresholds

**Per AE:**
- **Maximum active pipeline:** 25-30 merchants at any stage
- **Maximum new leads per day:** 3-5 (15-25 per week)
- **Maximum concurrent demos:** 2-3 per day

**Team Capacity (5 AEs):**
- **Total new leads per week:** 75-100
- **Total demos per week:** 25-35
- **Total closes per week:** 15-25

**Overflow Protocol:**
- If inbound leads exceed 100/week, temporarily extend SLA to 4 hours or hire additional AE
- Monitor lead-to-AE ratio weekly
- Flag capacity constraints in weekly sales meetings

---

## SLA by Cohort & Lead Source

### Assisted Cohort ($500K-$2M GTV)

**Standard SLA:** 2-hour response time

**Why:**
- High-value but not yet enterprise pricing
- AE consultation adds value but isn't mission-critical
- Can self-serve purchase if AE unavailable

**Fallback:**
- If AE unavailable within 2 hours, merchant can proceed with self-checkout
- AE follows up post-purchase to offer post-sale support
- No deal loss risk

---

### Managed Cohort ($2M+ GTV)

**Elevated SLA:** 1-hour response time

**Why:**
- High revenue potential warrants premium service
- More likely to evaluate competitors (losing these deals is costly)
- Expect white-glove treatment from moment of signup

**Capacity Allocation:**
- Senior AEs prioritize Managed leads
- Managed leads get priority queue placement
- If 1-hour SLA is missed, Sales VP is notified automatically

**Fallback:**
- If AE unavailable within 1 hour, Sales Manager takes call personally
- Alternative: Offer to schedule with C-level prospect's EA directly

---

### Hot Leads (Inbound, High-Intent)

**Examples:**
- "Request Demo" from pricing page (explicit CTA)
- Referred by existing customer
- Attended webinar and submitted lead form
- High web engagement score (viewed pricing 3+ times, compared plans)

**Elevated SLA:** 30-minute response time

**Why:**
- High intent signals they're ready to buy now
- Likely comparing multiple vendors simultaneously
- Speed-to-lead advantage is most pronounced here

**Capacity Allocation:**
- These leads jump to front of queue
- Slack notification to all AEs + Sales Manager
- First available AE claims lead

---

### Warm Leads (Marketing Qualified, Lower Intent)

**Examples:**
- Downloaded content (ebook, guide)
- Subscribed to newsletter
- Requested pricing information (but didn't start signup)

**Standard SLA:** 24-hour response time

**Why:**
- Lower purchase urgency
- Longer nurture cycle expected
- Better to respond thoughtfully than quickly

**Handling:**
- Marketing automation sends immediate drip sequence
- AE reaches out within 24 hours to qualify and segment
- If not ready to buy, move to nurture campaign

---

## SLA Monitoring & Accountability

### Real-Time SLA Dashboard (AE Team View)

**Key Metrics:**
- Leads awaiting first contact (sorted by time elapsed)
- SLA compliance rate (% of leads contacted within target time)
- AE-specific SLA performance (leaderboard)
- Escalation alerts (leads approaching SLA breach)

**Alerting:**
- **90 minutes elapsed:** Yellow alert to assigned AE
- **1.5 hours elapsed:** Red alert + notify Sales Manager
- **2 hours elapsed:** Auto-escalate to backup AE queue

---

### Weekly SLA Performance Review

**Team Metrics:**

| Metric | Target | Action if Below Target |
|--------|--------|------------------------|
| **Assisted SLA Compliance** | 95%+ within 2 hours | Review lead volume, adjust staffing |
| **Managed SLA Compliance** | 98%+ within 1 hour | Prioritize senior AE capacity |
| **Average Response Time** | <90 minutes | Identify bottlenecks (too many meetings?) |
| **Contact Rate** | 80%+ reach merchant | Review call timing, voicemail script |

**Individual AE Performance:**
- Track SLA compliance per AE (coaching opportunity if below 90%)
- Recognize top performers (fastest response + highest contact rate)
- Address patterns (e.g., AE always misses SLA on Fridays = meeting schedule issue)

---

## Fallback Strategies When AE Unavailable

### Option 1: Callback Scheduling (Preferred)

**When to Use:** AE team is at capacity, merchant is okay waiting

**Merchant Experience:**
- "All of our AEs are currently with customers. Would you like to schedule a call?"
- Calendly link shows AE availability in next 48 hours
- Merchant picks time, gets confirmation email

**Pros:**
- Reduces pressure on AEs to drop everything
- Merchant feels in control
- Higher show-up rate for scheduled calls vs. cold outreach

**Cons:**
- Slower time-to-contact
- Merchant may engage with competitor while waiting

---

### Option 2: Callback Queue (Urgent Requests)

**When to Use:** Merchant indicates urgency, doesn't want to schedule

**Merchant Experience:**
- "An AE will call you back as soon as one is available, typically within 30 minutes"
- Merchant gets SMS when AE is ready to call
- Merchant can click "Call me now" in SMS (triggers immediate AE outreach)

**Pros:**
- Balances urgency with AE capacity
- Merchant knows they're in queue (reduces anxiety)
- AE calls when truly available (higher quality conversation)

**Cons:**
- Requires real-time queue management system
- Risk merchant doesn't answer when AE calls back

---

### Option 3: IC Bridge Call (Assisted Selling)

**When to Use:** High-value lead, all AEs busy, merchant needs immediate help

**Merchant Experience:**
- "Let me connect you with an Implementation Consultant who can answer your questions right now"
- IC takes call, qualifies needs, provides product overview
- IC schedules AE follow-up for pricing/contract discussion

**Pros:**
- Immediate human contact (prevents merchant from going to competitor)
- IC can answer technical questions
- AE inherits warm, qualified lead

**Cons:**
- IC time is valuable (should be spent on onboarding, not pre-sales)
- Risk of handoff friction (merchant has to repeat info to AE)

**Recommendation:** Use sparingly, only for Managed cohort leads when all AEs are unavailable

---

## Special Scenarios

### Scenario 1: Lead Signs Up at 11 PM

**Handling:**
- Immediate automated acknowledgment: "Thanks for signing up! Your AE will call tomorrow morning between 9-11 AM."
- Lead queued for first available AE the next morning
- High-value leads (Managed) get first priority in morning queue

**Why Not Offer 24-7 for These Leads?**
- Low volume doesn't justify overnight staffing
- Merchants signing up late at night are often doing research (not expecting immediate call)
- Morning follow-up is acceptable

---

### Scenario 2: Lead is International (Non-US Time Zone)

**Handling (Phase 1):**
- If we serve Canadian/US merchants only: Same time zone logic applies
- If international expansion: Route to AE in closest time zone
- Automated message adjusts language: "Your AE will call during your business hours"

**Handling (Phase 2+):**
- Regional AE teams in EMEA, APAC, LATAM
- Follow sun model (24-7 coverage globally)

---

### Scenario 3: Existing Customer Adding Payments

**Special Handling:**
- Existing relationship = higher trust, less urgency for immediate contact
- Can extend SLA to 4 hours (customer is already using X-Series)
- But: Opportunity to upsell is time-sensitive (act while interest is hot)

**Recommended SLA:** 2 hours (same as Assisted), but lower penalty if missed

**Approach:**
- AE references existing relationship in outreach
- "I see you've been with Lightspeed since [date] - excited to talk about adding Payments!"

---

## Phase 1 MVP Recommendation Summary

### What to Implement Now

1. **2-Hour SLA for Assisted Cohort**
   - Immediate automated acknowledgment
   - Within 30 min: AE claims and preps
   - Within 2 hours: First contact attempt

2. **1-Hour SLA for Managed Cohort**
   - Priority queue routing
   - Sales Manager backup if SLA at risk

3. **Business Hours Coverage**
   - Monday-Friday 8 AM - 8 PM
   - Saturday 10 AM - 4 PM (4-hour SLA)
   - Sunday: Closed (queued for Monday)

4. **Fallback: Flexible Scheduling**
   - Calendly link in all automated messages
   - Merchant can self-schedule if prefers specific time

5. **SLA Monitoring Dashboard**
   - Real-time queue view for AE team
   - Escalation alerts at 90 min (Assisted), 45 min (Managed)

### Defer to Phase 2

- 24-7 coverage (insufficient volume to justify)
- AI-powered lead routing (predictive assignment based on AE performance + merchant profile)
- Chatbot pre-qualification (to reduce AE workload)
- SMS-based instant scheduling (text-to-schedule flow)

### Success Metrics

| Metric | Target | Purpose |
|--------|--------|---------|
| **SLA Compliance Rate** | 95%+ | Are we meeting commitments? |
| **Average Response Time** | <90 minutes | Are we being efficient? |
| **Contact Rate** | 80%+ | Are we reaching merchants? |
| **Call-to-Demo Conversion** | 60%+ | Is quality of contact high? |
| **Demo-to-Close Conversion** | 40%+ | Are AEs closing effectively? |

---

## Risk Mitigation

### Risk 1: Can't Meet 2-Hour SLA During High Volume

**Mitigation:**
- Temporary hire: Bring on contract AE during launch surge
- Extend SLA: Communicate proactively ("Higher than usual volume, expect call within 4 hours")
- Self-serve promotion: Encourage Assisted cohort to complete purchase without AE (discount incentive)

### Risk 2: Merchant Expects Immediate Response Despite Messaging

**Mitigation:**
- Clear expectation setting in all communications
- Offer alternative: "Need help now? Try live chat or call 1-800-XXX-XXXX"
- Train AEs on handling: "Thanks for your patience - let's make this time count!"

### Risk 3: AEs Game the System (Claim Lead but Don't Contact)

**Mitigation:**
- Track "claim time" vs. "first contact time" separately
- If AE claims but doesn't contact within 1 hour, lead auto-releases back to queue
- Coaching for AEs with pattern of claiming without contacting

---

## Document Control

**Approved By:** Product Lead, Sales VP, Operations Lead
**Review Cycle:** Weekly for first month, then monthly
**Next Review:** November 2025
**Related Documents:**
- `/docs/phase-1/product/cohort-thresholds.md`
- `/docs/phase-1/product/intervention-triggers.md`
- `/docs/phase-1/product/ic-pricing-model.md`
