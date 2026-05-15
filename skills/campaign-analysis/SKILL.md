---
name: campaign-analysis
description: Analyze campaign performance across Google Ads, LinkedIn, and Meta to surface underperformers and prioritize actions
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill pulls and evaluates cross-channel paid campaign performance data. It normalizes metrics across Google Ads, LinkedIn Campaign Manager, and Meta Ads Manager, then ranks campaigns by efficiency and impact. The output gives the CMO a clear picture of which campaigns are working, which are draining budget, and what to do next.

## When to Use
- Weekly or monthly campaign performance reviews
- Before a budget reallocation decision
- When a channel shows sudden performance drop (CTR down >20%, ROAS below target)
- As the baseline step before running budget-optimization
- During QBRs or board-level performance presentations

## How to Execute
1. **Gather raw data**: Pull the following metrics for each active campaign across all three channels for the selected date range:
   - Impressions, Clicks, CTR
   - CPC (Cost Per Click)
   - Conversions, Conversion Rate
   - Cost Per Conversion (CPA)
   - Revenue attributed (or pipeline influenced)
   - ROAS (Return on Ad Spend)
   - Spend (absolute and % of total budget)

2. **Normalize across channels**: Account for platform differences. LinkedIn CPCs are typically 3-5x Google; Meta conversion attribution windows differ. Apply a consistent attribution model (last-click or linear) across all channels.

3. **Establish benchmarks**: Compare each campaign's metrics against:
   - Historical baseline (prior 30/90 days)
   - Industry benchmarks by channel (B2B SaaS)
   - Internal targets set in the campaign brief

4. **Score and rank campaigns**: Score each campaign 1-5 on:
   - Efficiency (CPA vs. target)
   - Volume (absolute conversions)
   - Trend direction (improving vs. declining)
   - Strategic importance (brand vs. demand gen)

5. **Identify underperformers**: Flag any campaign where:
   - CTR is >30% below channel average
   - ROAS is below 2.0 for demand gen (below 1.0 for any campaign)
   - CPA exceeds target by >25%
   - Conversion rate is declining week-over-week for 3+ weeks

6. **Diagnose root causes**: For each underperformer, check:
   - Ad creative fatigue (frequency >4)
   - Audience overlap or saturation
   - Landing page mismatch or poor load speed
   - Budget throttling or bid strategy issues
   - Seasonal effects

7. **Generate recommended actions**: For each campaign, produce one clear action: scale, pause, test, optimize, or monitor.

## Output Format
Produce a ranked performance table followed by an actions summary:

**Campaign Performance Table** (sorted by ROAS descending):

| Campaign | Channel | Spend | CTR | CPC | Conv. Rate | CPA | ROAS | Score | Status |
|----------|---------|-------|-----|-----|------------|-----|------|-------|--------|
| [name] | Google | $X,XXX | X.X% | $XX | X.X% | $XXX | X.Xx | 4/5 | Scale |
| ... | | | | | | | | | |

**Underperformer Deep-Dive** (for each flagged campaign):
- Campaign name and channel
- Primary issue (1 sentence)
- Root cause hypothesis
- Recommended action with specific parameters (e.g., "Pause ad set ID 12345, reallocate $2,000 to top-performing creative")

**Summary Callouts**:
- Top performer of the period
- Biggest budget waste
- Highest-leverage optimization opportunity
