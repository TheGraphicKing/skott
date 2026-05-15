---
name: engagement-optimization
description: Diagnose low engagement rates by auditing timing, format, copy quality, and CTA strength, then output specific improvement actions
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill systematically diagnoses why engagement is underperforming across any channel — email, social, ads, or landing pages — and produces a prioritized list of specific, testable improvements. It moves beyond "boost the post" and into root-cause analysis.

## When to Use
- Email open or click rates drop more than 15% vs. previous period
- Social post reach or engagement rate falls below channel benchmarks
- Ad CTR declines despite stable spend
- Landing page bounce rate increases or form conversion drops
- Content performance is inconsistent and the cause is unclear

## How to Execute

### Step 1: Define the Engagement Problem
Clarify exactly what is underperforming:
- Which metric (open rate, CTR, engagement rate, scroll depth, form fill)?
- Which channel/asset (email campaign X, LinkedIn post series, landing page Y)?
- What is the current rate vs. target or historical baseline?
- How long has underperformance been happening?

### Step 2: Audit Timing
For email: Check send day/time against industry benchmarks (B2B: Tuesday-Thursday, 9-11am local time). Review whether send time has changed recently.
For social: Check posting time vs. peak audience activity windows per platform (LinkedIn: Tue-Thu 8-10am; Twitter/X: varies; Reddit: evenings).
For ads: Review dayparting settings — is budget being consumed at off-peak hours?

**Flag**: Any asset sent outside optimal windows without a tested reason.

### Step 3: Audit Format
- Email: Plain text vs. HTML template. Heavy images suppress mobile open rates. Single-column layouts outperform multi-column in B2B.
- Social: Image vs. video vs. text-only vs. carousel. Native video consistently outperforms linked content on LinkedIn.
- Ads: Creative format fit — is the ad format matched to the platform placement (Stories vs. Feed vs. Sidebar)?
- Landing pages: Page length vs. form placement. Is the form above the fold? Mobile responsiveness check.

### Step 4: Audit Copy Quality
Run the copy through these filters:
- **Subject line / headline**: Does it create curiosity or communicate clear value? Avoid: "Exciting news", "Check this out", vague claims.
- **Opening line**: Does it earn the next sentence? Hook must be immediate.
- **Body copy**: Is it written for the reader or for the brand? Passive voice, jargon, and feature lists kill engagement.
- **Reading level**: Target Flesch-Kincaid grade 8-10 for B2B marketing copy.
- **Personalization**: Is there meaningful personalization beyond first name?
- **Relevance**: Is the content matched to the audience segment's known interests or pain points?

### Step 5: Audit CTA Strength
Evaluate the call-to-action:
- Is there exactly one primary CTA (not three competing ones)?
- Is the CTA verb-forward and specific? ("Download the playbook" beats "Learn more")
- Is there a value statement in the CTA? ("Get your free audit" beats "Submit")
- Is the CTA visually prominent (button, contrast, whitespace)?
- For email: Is the CTA repeated 2-3 times in longer emails?

### Step 6: Check Audience-Content Fit
- Is this content matched to the right funnel stage? (Awareness content to bottom-funnel segments won't convert)
- Has the audience already seen this offer or content? (Fatigue)
- Is the segment large enough for statistical significance?

### Step 7: Prioritize Improvements
Rank identified issues by:
- Ease of fix (quick win vs. requires design/dev)
- Estimated impact on engagement rate
- Time to test and see results

## Output Format

**Diagnosis Summary**:
- Asset/campaign: [name]
- Engagement metric underperforming: [metric] at [X%] vs. [target/baseline Y%]
- Audit period: [date range]

**Issues Found** (ranked by estimated impact):

| # | Issue Category | Specific Problem | Recommended Fix | Estimated Impact | Effort |
|---|---------------|-----------------|-----------------|-----------------|--------|
| 1 | Copy — Subject Line | "Monthly Newsletter" — no value prop, zero curiosity | Rewrite: "[Recipient's industry] benchmarks: where you stack up" | +15-25% open rate | Low |
| 2 | Format | HTML template with 3 large images, rendering broken on mobile | Switch to single-column, 1 image max | +8-12% CTR | Medium |
| 3 | CTA | "Click here" with no value statement | Change to "Get the [specific resource]" | +5-10% CTR | Low |
| 4 | Timing | Sends at 5pm Friday | Move to Tuesday 9am | +10-20% open rate | Low |

**Immediate Actions** (implement this week):
1. [Specific change]
2. [Specific change]

**A/B Tests to Run**:
- Test 1: [Variable] — Variant A vs. Variant B — success metric: [metric]
- Test 2: [Variable] — Variant A vs. Variant B — success metric: [metric]
