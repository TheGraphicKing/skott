---
name: performance-reporting
description: Generate structured executive performance reports for CMO consumption covering top metrics, wins, risks, and recommended actions
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill produces polished, executive-ready marketing performance reports. Reports are structured for CMO consumption: lead with the number that matters most, explain the story behind it, flag what needs attention, and close with clear decisions needed. Eliminates data dumps — every metric must connect to a business outcome.

## When to Use
- Weekly marketing standups and async updates
- Monthly board or exec team reporting
- Quarterly business reviews (QBRs)
- After major campaign launches or events
- When escalating a performance issue to leadership

## How to Execute
1. **Define the reporting period and scope**: Confirm date range, channels/programs in scope, and the primary audience (CMO only, full exec team, board).

2. **Pull headline metrics**: Identify the 5-7 metrics that matter most for this period:
   - Pipeline generated ($)
   - MQLs and SQLs (volume and conversion rate)
   - Marketing-sourced revenue ($ and % of total)
   - CAC by channel
   - Total marketing spend vs. budget
   - Channel-level ROAS
   - Organic traffic and conversion rate

3. **Write the performance narrative** (not a data dump): Structure as:
   - **This period in one sentence**: e.g., "Marketing generated $1.2M in pipeline, 8% above target, driven by LinkedIn outperformance despite Google efficiency declining."
   - **What worked**: 2-3 specific wins with data
   - **What didn't**: 1-2 honest issues with root cause
   - **What changed vs. last period**: delta commentary, not just raw numbers

4. **Identify risks**: Flag anything that threatens next period's performance:
   - Budget pacing issues
   - Declining channel metrics
   - Content or creative fatigue
   - Competitive pressure signals

5. **Write recommended actions**: Each recommendation must be:
   - Specific (what, exactly)
   - Owned (who takes action)
   - Time-bound (by when)
   - Tied to a metric it will improve

6. **Format for executive reading time**: The CMO should be able to read the full report in under 4 minutes. Use headers, bullets, and callout boxes. No paragraph walls.

## Output Format

```
# Marketing Performance Report — [Period]
Prepared for: [Audience] | Date: [Date]

## Headline
[One-sentence summary of the period]

## Key Metrics
| Metric | This Period | Last Period | Target | Delta |
|--------|-------------|-------------|--------|-------|
| Pipeline Generated | | | | |
| MQLs | | | | |
| SQLs | | | | |
| Mktg-Sourced Revenue | | | | |
| Total Spend | | | | |
| Blended ROAS | | | | |

## Key Wins
- [Win 1 with specific numbers]
- [Win 2 with specific numbers]

## Issues & Risks
- [Issue 1]: [Root cause] → [Mitigation]
- [Risk 1]: [Likelihood] → [Contingency]

## Recommended Actions
| Action | Owner | Deadline | Expected Impact |
|--------|-------|----------|-----------------|
| | | | |

## Appendix: Channel Breakdown
[Detailed channel tables if needed]
```
