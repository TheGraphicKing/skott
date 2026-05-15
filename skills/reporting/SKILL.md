---
name: reporting
description: Build marketing reports at daily, weekly, and monthly cadences — auto-pulling key metrics, writing narrative, and flagging anomalies
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill produces automated and semi-automated marketing reports across three cadences. Each cadence serves a different audience and decision frequency. Daily reports are operational; weekly reports drive tactical decisions; monthly reports inform strategy and budget. Every report combines data with narrative — numbers without context are noise.

## When to Use
- Setting up a new reporting cadence for a team
- Producing a one-off report at any cadence
- When the CMO requests a performance snapshot
- As the final step in performance-review or brand-audit workflows
- When an anomaly is detected and needs to be communicated with context

## How to Execute

### Step 1: Determine Report Type and Audience

**Daily Report** (ops team and channel managers):
- Purpose: Catch anomalies before they become problems
- Format: Short. Numbers-first. Flags only.
- Audience: Demand gen lead, channel owners, marketing ops

**Weekly Report** (marketing team + CMO):
- Purpose: Track pace to targets, surface wins and risks
- Format: Structured summary with channel breakdown and narrative
- Audience: CMO, team leads, sales leadership

**Monthly Report** (CMO + executive team):
- Purpose: Strategic review, budget decisions, forecasting
- Format: Full performance narrative with trend analysis and recommendations
- Audience: CMO, CEO/CRO, board prep

### Step 2: Pull the Right Metrics by Cadence

**Daily metrics** (high-volatility, actionable daily):
- Paid spend vs. daily budget (pacing check — under/over by channel)
- Leads captured (vs. daily run-rate target)
- Any ad account flags: disapproved ads, billing issues, spend spikes
- Website uptime and core page performance (if monitored)

**Weekly metrics** (pace and efficiency):
- MQLs (this week vs. last week vs. weekly target)
- Pipeline generated ($)
- Paid: spend, impressions, clicks, conversions, CPA, ROAS by channel
- Email: sends, open rate, CTR, unsubscribes
- Organic: website sessions, top landing pages, form fills
- Social: reach, engagement rate, follower growth

**Monthly metrics** (strategic, trend-focused):
- Total pipeline sourced (marketing-attributed)
- Marketing-sourced revenue and % of total revenue
- MQL → SQL → Opportunity → Close rates (full funnel)
- CAC by channel and blended
- LTV:CAC ratio (if available)
- Organic traffic trend (MoM, YoY)
- Email list health: growth rate, churn rate, engagement tier breakdown
- Content performance: top 10 pages by organic traffic, top 5 by conversions
- Brand metrics: share of voice (if tracked), branded search volume trend

### Step 3: Establish Benchmarks for Anomaly Detection
For each metric, define:
- Target (what you planned to hit)
- Green threshold: within 10% of target
- Yellow threshold: 10-25% off target — flag for monitoring
- Red threshold: >25% off target — immediate escalation

For the daily report, only surface Yellow and Red flags. Green metrics don't need commentary.

### Step 4: Write the Narrative
Numbers without narrative fail. For each report:

**Daily**: Short sentence for any Yellow/Red flag: "[Metric] is [X% above/below] today's target. [One sentence on likely cause or 'cause unknown — monitoring']. [Action being taken or 'no action needed yet']."

**Weekly**: Two paragraphs maximum:
- Para 1: What happened this week (key movement up or down, biggest win, biggest concern)
- Para 2: What it means for next week (any decisions or adjustments needed)

**Monthly**: Full narrative structure (see performance-reporting skill for detailed format):
- Executive summary (2-3 sentences)
- What drove performance (channel-by-channel)
- What underperformed and why
- What we're changing
- Forward-looking: are we on track for the quarter?

### Step 5: Automate What Can Be Automated
For recurring reports, specify which metrics should be auto-pulled:
- Google Analytics 4: website sessions, conversions, source/medium breakdown
- Google Search Console: clicks, impressions, avg. position, top queries
- Ad platform APIs or manual CSV exports: paid metrics
- CRM (HubSpot/Salesforce): MQL, SQL, pipeline, closed revenue

Document the data pull process so any team member can run the report.

## Output Format

### Daily Report Template:
```
Marketing Daily Pulse — [Date]
Prepared by: Skott

SPEND PACING
Google Ads: $X / $X daily budget ([+/-X%]) ✓ / ⚠ / ✗
LinkedIn: $X / $X ([+/-X%])
Meta: $X / $X ([+/-X%])

LEADS
Today: [X] | Daily target: [X] | Pace: [on/off]
Source breakdown: Google [X] | LinkedIn [X] | Organic [X] | Other [X]

FLAGS 🚨
[Only if Yellow or Red issues exist]
- [Metric]: [issue] — [action]

No flags = clean day.
```

### Weekly Report Template:
```
Marketing Weekly Report — Week of [date]
Prepared for: CMO + Team

HEADLINE
[One sentence summary of the week]

KEY METRICS
[Table: Metric | This Week | Last Week | Target | Delta]

CHANNEL SUMMARY
[2-3 bullets per channel: what happened, what changed]

WINS
- [Specific win with data]

ISSUES
- [Specific issue with root cause]

NEXT WEEK PRIORITIES
1. [Action]
2. [Action]
3. [Action]
```

### Monthly Report Template:
See performance-reporting skill for full format. This skill handles the data assembly and anomaly narrative; performance-reporting handles the executive-ready output.
