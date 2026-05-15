---
name: lead-capture
description: Design and optimize lead capture at events including badge scanning, form design, and qualification criteria, outputting a lead capture checklist
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill designs the lead capture system for events — ensuring every potential buyer is captured, qualified, and routed correctly. Poor lead capture at events is one of the highest-ROI problems to fix: you've already spent budget to be there, and unqualified or untracked leads destroy attribution and sales follow-up quality.

## When to Use
- Planning booth presence at a conference or trade show
- Designing a webinar registration and attendee data strategy
- Setting up lead capture for a roundtable or field event
- Auditing an existing lead capture process that has low SQL conversion
- As part of the event-launch workflow (step 2)

## How to Execute

### Step 1: Define Lead Qualification Criteria
Before capturing any lead, define what a qualified lead looks like for this specific event:

**Minimum Qualification (all must be true)**:
- Company size: [X]+ employees (based on ICP — typically 200+ for Lyzr)
- Industry: matches ICP verticals (B2B SaaS, FinTech, Enterprise Tech, Agency)
- Role: Marketing leader (CMO, VP Marketing, Marketing Director, Marketing Ops Manager)
- Engagement: attended the session / spoke with a rep / scanned badge proactively

**Disqualifying signals** (do not route to sales):
- Student, academic, or freelancer
- Competitor employee
- Role is clearly not a buyer (intern, entry-level, non-marketing function)
- Company is outside all ICP criteria

### Step 2: Badge Scanning Setup (In-Person Events)
For conferences that provide badge scanning:
- Ensure the event app or badge scanner is configured before the event
- Train all booth staff on how to scan (no missed leads from tech failure)
- Set up qualifying questions in the scanner app (most support 3-5 custom questions):
  - "What's your current marketing AI tool?" (intent signal)
  - "What's the biggest challenge in your marketing ops?" (pain point)
  - "Are you evaluating platforms in the next 6 months?" (timeline)
- Assign a lead quality rating at point of capture (1-5 scale, done by booth staff)
- Export leads daily — don't wait until after the event

### Step 3: Form Design (Virtual Events and Webinars)
Registration form fields (progressive profiling approach):
- **Required**: First name, last name, work email, company name, job title
- **Optional but shown**: Company size (dropdown), primary marketing challenge (dropdown with 5 options), phone (optional)
- **Hidden/enrichment**: Enrich company data post-registration with Clearbit or similar (industry, revenue, tech stack)

Form design best practices:
- Single-page form for webinars (conversion drops with each additional field)
- Progress indicator for multi-step forms at in-person events
- GDPR/CCPA consent checkbox with clear language
- Confirmation email triggers immediately after submission (sets expectations)

### Step 4: Lead Routing Rules
Define routing before the event:

| Qualification Level | Criteria | Routing |
|--------------------|----------|---------|
| Tier 1 (Hot) | ICP match + expressed buying intent or timeline <90 days | Immediate SDR outreach within 4 hours |
| Tier 2 (Warm) | ICP match, no expressed timeline | Enter 5-touch post-event nurture sequence |
| Tier 3 (Cool) | Partial ICP match | Enter general marketing nurture |
| Disqualified | Outside ICP | Do not route to sales; tag in CRM |

### Step 5: CRM Integration and Tagging
Every captured lead must be entered into CRM with:
- Source: event name + date (UTM equivalent for offline)
- Lead status: MQL / Open / Do Not Contact
- Campaign tag: ties to the event for attribution reporting
- Engagement notes: what was discussed at the booth or in the session
- Follow-up date: assigned at point of capture, not later

### Step 6: Post-Event Data Hygiene
Within 24 hours of the event closing:
- Export full lead list and cross-reference with CRM (deduplicate)
- Enrich any records with missing company data
- Apply qualification scoring based on firmographic data
- Route Tier 1 leads to SDRs immediately
- Trigger nurture sequences for Tier 2-3

## Output Format

**Lead Capture Checklist for [Event Name]**:

**Pre-Event Setup**:
- [ ] Qualification criteria defined and shared with all booth/event staff
- [ ] Badge scanner configured with qualifying questions
- [ ] Registration form fields finalized and tested
- [ ] CRM tags and lead routing rules set up
- [ ] All staff briefed on lead capture process and qualification scoring

**During Event**:
- [ ] Badge scanning active at booth and all sessions
- [ ] Staff qualifying and scoring leads at point of capture
- [ ] Lead notes entered in real-time (not from memory later)
- [ ] Daily lead export completed

**Post-Event (within 24 hours)**:
- [ ] Full lead list exported and uploaded to CRM
- [ ] Leads deduplicated and enriched
- [ ] Tier 1 leads routed to SDRs
- [ ] Tier 2/3 nurture sequences triggered
- [ ] Lead count and quality reported to marketing leadership

**Targets**:
- Total leads captured: [X]
- Tier 1 (hot): [X] (target: ~15-20% of total)
- Tier 2 (warm): [X] (target: ~40-50% of total)
- Expected SQLs from event: [X] (within 90 days)
