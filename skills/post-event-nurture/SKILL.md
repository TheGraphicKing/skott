---
name: post-event-nurture
description: Build post-event nurture sequences including a 5-touch email sequence, LinkedIn follow-up, and sales handoff criteria
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill designs the complete post-event follow-up system. Most event pipeline is lost not at the event but in the week after, when follow-up is slow, generic, or non-existent. This skill produces a ready-to-deploy 5-touch email sequence, LinkedIn follow-up templates, and clear sales handoff criteria — personalized by lead tier and engagement level.

## When to Use
- Within 24 hours after any event concludes
- When event leads are sitting in CRM without a follow-up sequence
- When sales reports that event leads are "going cold"
- As the final step in the event-launch workflow

## How to Execute

### Step 1: Segment the Attendee List
Before writing a single nurture email, segment based on event engagement:

**Segment A — Attendees who engaged (attended + spoke with rep / asked Q&A question)**
→ Most personalized, fastest follow-up, shortest path to sales conversation

**Segment B — Attendees who registered and attended (no direct engagement)**
→ Standard nurture; lead with event content value, build to CTA

**Segment C — Registered but did not attend (no-shows)**
→ Different opening (acknowledge they missed it); offer recording; slightly longer nurture arc

### Step 2: 5-Touch Email Sequence

Write one sequence per segment. Each email must:
- Have a distinct subject line (no "Following up" or "Checking in")
- Reference something specific to the event
- Provide value in every touch (not just a sales ask)
- Have a single, clear CTA

**Sequence Structure**:

**Touch 1 — Day 1 (within 24 hours)**:
- Segment A: Personal, specific reference to your conversation or their question
- Segment B/C: Thank you + key takeaway from the event + link to recording/slides
- CTA: "Watch the recording" or "Here's the one thing I'd add from our conversation..."
- Tone: Warm, conversational — not sales

**Touch 2 — Day 3**:
- Lead with value: the most relevant resource to their role/pain point
- For Segment A: Reference their specific challenge if captured in notes
- CTA: One resource (case study, playbook, or relevant blog post)
- Tone: Helpful advisor

**Touch 3 — Day 7**:
- Social proof: a customer story or stat relevant to their industry
- Brief Lyzr capability mention (natural, not forced)
- CTA: "Worth a 20-minute conversation?" (first direct ask)
- Tone: Confident, peer-level

**Touch 4 — Day 14**:
- New angle: address a common objection or a question you know this segment asks
- Frame Lyzr differently than the previous emails (different pillar or use case)
- CTA: Offer something specific — "I'll send you our ROI calculator for [their industry]"
- Tone: Problem-solving

**Touch 5 — Day 21**:
- Break-up email format: respectful, no pressure, leaves the door open
- Subject: Something like "Should I close your file?"
- Body: Short (3-4 sentences). Acknowledge timing may not be right. Offer one last resource. Let them know how to re-engage.
- CTA: "Hit reply if [specific pain point] becomes a priority" — very low friction
- Tone: Direct, human

### Step 3: LinkedIn Follow-Up Templates
LinkedIn adds a channel touch and feels more personal than another email.

**Connection Request Message** (for Tier 1 leads not already connected):
"Hi [Name], great connecting at [event name]. Really appreciated your question about [topic]. I'll send over [specific resource] — think it maps to exactly what you described."

**Post-Connection Follow-Up Message** (after they accept, or for existing connections):
"Following up on [event] — wanted to share [specific resource] based on our conversation. No agenda — just thought it was relevant. Happy to grab 15 minutes if you'd find it useful."

**No-Response Re-Engage** (if no email response after touch 3):
"Noticed you haven't seen my emails — totally fine. Dropping one more thing here: [one-line value statement + link]. If [pain point] is something you're working on, worth a quick look."

### Step 4: Sales Handoff Criteria
Define exactly when a nurture lead becomes a sales-ready lead (SQL):

**Auto-handoff triggers** (route to SDR immediately when any occur):
- Clicked "Book a demo" or "Talk to sales" link in any nurture email
- Visited pricing page 2+ times after the event (with website tracking)
- Replied to any nurture email with a question or interest signal
- LinkedIn message shows explicit buying signal

**SDR-review triggers** (flag for SDR to decide):
- Opened 4+ emails without clicking
- Segment A lead with no response after touch 3
- High-ICP company with no engagement after 14 days (SDR can try a cold call)

**Recycle to long-term nurture**:
- Completed full 5-touch sequence with no engagement
- Out-of-office replies suggesting timing issue (re-enter sequence in 60-90 days)
- Disqualified during sales conversation (wrong ICP)

### Step 5: CRM Setup
For each sequence:
- Create sequence in email automation tool (HubSpot, Outreach, etc.)
- Tag all contacts with event name and segment
- Set enrollment trigger (list membership by segment)
- Set exit criteria: any reply, any meeting booked, any hard bounce
- Set up conversion tracking: sequence → demo → SQL → Closed Won

## Output Format

**Post-Event Nurture Plan — [Event Name]**

**Segments**:
- Segment A (engaged attendees): [count] contacts
- Segment B (attended, no engagement): [count] contacts
- Segment C (no-shows): [count] contacts

**Email Sequence — Segment A**:
[Full 5 emails with subject lines, body copy, and CTAs]

**Email Sequence — Segment B**:
[Full 5 emails]

**Email Sequence — Segment C**:
[Full 5 emails with no-show-specific opener]

**LinkedIn Templates**:
[Connection request, post-connection, and re-engage versions]

**Sales Handoff Rules**:
[Table of triggers as defined above]

**Success Metrics**:
- Email open rate target: >35%
- Click rate target: >8%
- Reply rate target: >5%
- Demo booked rate target: >3% of total event leads
- SQLs generated from event (90-day window): [X]
