---
name: budget-optimization
description: Rebalance marketing budget across channels based on ROAS and pipeline contribution, producing a reallocation table with dollar amounts and rationale
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill analyzes current budget allocation against channel performance data and produces a concrete reallocation recommendation. The output is a decision-ready table showing exactly where money should move, by how much, and why — grounded in ROAS, CPA, pipeline contribution, and strategic priority.

## When to Use
- Monthly or quarterly budget review cycles
- When a channel underperforms for 2+ consecutive periods
- After campaign-analysis surfaces significant ROAS gaps between channels
- Before a new quarter or fiscal year budget planning session
- When total budget is cut or increased and reallocation is needed

## How to Execute
1. **Baseline the current state**: Document current monthly spend per channel with associated ROAS, CPA, pipeline contribution ($), and MQL volume.

2. **Calculate efficiency scores**: For each channel, compute:
   - Efficiency Index = ROAS / Target ROAS (>1.0 means outperforming)
   - Pipeline Efficiency = Pipeline $ per $1 spent
   - Scalability signal: Is performance holding at current spend or declining? (diminishing returns check)

3. **Identify reallocation candidates**:
   - **Cut or reduce**: Channels with Efficiency Index < 0.7 for 2+ periods, or where spend is in diminishing returns territory
   - **Hold**: Channels meeting targets but showing no headroom to scale
   - **Increase**: Channels with Efficiency Index > 1.3 and scalability headroom remaining

4. **Apply strategic overlays**: Pure ROAS math doesn't tell the whole story. Adjust for:
   - Brand awareness channels (don't cut based on direct ROAS alone)
   - New channel experiments (give at least 90 days before cutting)
   - Seasonal timing (don't cut a channel right before its peak season)
   - Pipeline lag (some channels have 60-90 day attribution delays)

5. **Model reallocation scenarios**: Run two scenarios:
   - Conservative: Shift ≤15% of total budget
   - Aggressive: Shift ≤30% of total budget
   Select or blend based on the CMO's risk tolerance.

6. **Write rationale for each move**: Every dollar shift needs a one-sentence "because" statement backed by data.

7. **Estimate impact**: Project expected change in MQLs, pipeline, and ROAS under the new allocation. Use regression from historical performance data, not wishful thinking.

## Output Format

**Current vs. Recommended Allocation**:

| Channel | Current Spend | Current ROAS | Recommended Spend | Change | Rationale |
|---------|--------------|--------------|-------------------|--------|-----------|
| Google Ads | $XX,XXX | X.Xx | $XX,XXX | +$X,XXX | CTR improving, CPA 18% below target |
| LinkedIn | $XX,XXX | X.Xx | $XX,XXX | -$X,XXX | ROAS 0.8x for 3 months; audience saturation |
| Meta | $XX,XXX | X.Xx | $XX,XXX | $0 | On target; no headroom to scale without new creative |
| Content Syndication | $XX,XXX | X.Xx | $XX,XXX | -$X,XXX | Low MQL quality; 90% below SQL conversion rate |

**Projected Impact**:
- MQLs: [current] → [projected] ([delta]%)
- Pipeline: [current] → [projected] ([delta]%)
- Blended ROAS: [current] → [projected]

**Key Assumptions**:
- [List 3-5 assumptions the model depends on]

**Risks**:
- [Any risk to the reallocation plan]
