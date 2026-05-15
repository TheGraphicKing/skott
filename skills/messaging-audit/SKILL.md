---
name: messaging-audit
description: Audit messaging consistency across channels, identifying contradictions, positioning drift, and outdated claims, with an issues list and corrections
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill audits all customer-facing messaging across channels to identify inconsistencies, contradictions, positioning drift, and outdated claims. A fragmented message confuses buyers and weakens conversion. This audit produces a concrete issues list with specific corrections so the team can restore a single, coherent voice.

## When to Use
- Quarterly messaging health check
- After a product pivot, rebrand, or pricing change
- When sales reports that prospects are confused about what Lyzr does
- Before a major campaign launch
- When new team members or agencies are writing for the brand
- As the first step in the brand-audit workflow

## How to Execute

### Step 1: Collect All Messaging Touchpoints
Inventory every channel where Lyzr has customer-facing messaging:

**Digital Channels**:
- Homepage hero headline and subheadline
- Product/feature pages
- Pricing page
- About us and company description
- Blog post introductions and conclusions
- Meta descriptions (as seen in search results)

**Paid Channels**:
- Google Ads headlines and descriptions
- LinkedIn ad copy (all active campaigns)
- Meta ad copy
- Retargeting ad copy

**Social Channels**:
- LinkedIn company page "About" section
- Twitter/X bio
- LinkedIn posts (last 30 days)
- Reddit contributions

**Sales Materials**:
- Email subject lines and opening copy
- Cold outreach sequences
- Sales deck title slides and key slides
- Proposal templates

**Partner/Distribution**:
- G2 and Capterra profiles
- Press releases (last 12 months)
- Guest posts and bylines
- Partner co-marketing materials

### Step 2: Extract Core Claims
From each touchpoint, extract:
- The primary positioning claim (the one-line description of what Lyzr is)
- The stated value proposition (what benefit is promised)
- The target audience implied by the copy
- Any specific claims: capabilities, integrations, customer count, ROI stats

### Step 3: Compare Against Source of Truth
The source of truth is:
- /knowledge/brand-guidelines.md
- The currently approved ICP profiles in /knowledge/icp-profiles.md
- The current product capability set (confirm with product team if needed)

Evaluate each claim against:
1. **Accuracy**: Is this claim still true? Has the product changed?
2. **Consistency**: Is the same claim made in the same way across channels?
3. **Positioning alignment**: Does this align with the three messaging pillars?
4. **ICP alignment**: Is the audience implied by this messaging the right ICP?

### Step 4: Identify Issue Types

**Contradiction**: Channel A says X, Channel B says the opposite or something incompatible
- Example: Homepage says "no-code setup" but sales deck mentions "developer configuration required"

**Positioning Drift**: Messaging on older channels reflects an outdated product angle or audience
- Example: An old blog post positions Lyzr as an "AI content tool" rather than an "agentic OS"

**Outdated Claim**: A specific stat, feature, or integration mentioned that no longer applies
- Example: "Integrates with 12 platforms" when you now support 40+; or referencing a deprecated feature

**Inconsistent Nomenclature**: The product or company name is referred to differently across channels
- Example: "Lyzr platform", "Lyzr AI", "Lyzr AgenticOS", "Lyzr OS" used interchangeably without a standard

**ICP Mismatch**: Copy that speaks to SMBs, consumers, or the wrong persona in a channel targeting enterprise buyers

**Missing Pillar**: A channel-level touchpoint that doesn't communicate any of the three messaging pillars

### Step 5: Prioritize Issues
Rate each issue by:
- **Severity**: Does it actively mislead a buyer? (High) Or just inconsistent? (Medium/Low)
- **Reach**: How many people see this touchpoint per month?
- **Fix effort**: One sentence edit vs. requires team discussion and redesign?

### Step 6: Write Specific Corrections
For each issue, provide the exact replacement copy — not a suggestion to "revise" or "clarify." The correction should be ready to implement.

## Output Format

**Messaging Audit Report — [Date]**
Channels audited: [list] | Scope: [full audit / paid only / web only]

**Summary**:
- Total issues found: [X]
- Critical (active contradictions or false claims): [X]
- Moderate (positioning drift or outdated): [X]
- Minor (inconsistent nomenclature): [X]

**Issues List**:

| # | Issue Type | Channel | Current Messaging | Problem | Corrected Version |
|---|-----------|---------|------------------|---------|------------------|
| 1 | Contradiction | Homepage vs. Sales Deck | Homepage: "No-code deployment" / Deck: "Requires API configuration" | Contradictory technical claim will confuse late-stage buyers | Standardize to: "Deploy without writing code — API access available for custom integrations" |
| 2 | Outdated Claim | G2 Profile | "Integrates with 12 tools" | Now 40+ integrations; underselling capability | Update to: "40+ native integrations including HubSpot, Salesforce, Marketo, and Google Analytics" |
| 3 | Missing Pillar | LinkedIn Ads | No mention of enterprise security or compliance | Pillar 2 (Enterprise-Grade) absent from all paid creative | Add trust statement: "SOC 2 compliant. Built for enterprise security requirements." |

**Approved Standard Phrasings** (to be used consistently across all channels):
- Company name: Lyzr
- Product name: Lyzr AgenticOS (full) / Lyzr (short form)
- One-line description: [approved version]
- Value proposition: [approved version]

**Recommended Governance**:
- [Suggestion for how to prevent messaging drift going forward — e.g., quarterly audit cadence, messaging approval checklist]
