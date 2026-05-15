---
name: audience-analysis
description: Analyze audience segments, identify high-intent signals, and surface look-alike opportunities with targeting recommendations
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill analyzes existing customer and prospect data to identify meaningful audience segments, score them by purchase intent, and surface look-alike expansion opportunities. The output drives targeting decisions for paid campaigns, content strategy, and outbound sequences.

## When to Use
- Before launching a new paid campaign (as the first step in campaign-launch workflow)
- When campaign conversion rates decline and audience fit is suspect
- When expanding to new markets or personas
- During ICP refinement exercises
- When CRM data is stale and needs segmentation refresh

## How to Execute

### Step 1: Gather Audience Data Sources
Pull from available sources:
- CRM (HubSpot/Salesforce): firmographic data, deal stage, source, lifecycle stage
- Ad platforms: audience demographics, job titles, company sizes from LinkedIn/Meta/Google
- Website analytics: behavioral segments (pages visited, content consumed, time on site)
- Email engagement: open rates, click patterns by segment
- Product usage (if PLG): feature adoption, frequency, account health score

### Step 2: Define Segmentation Dimensions
Segment audiences across two axes:

**Firmographic** (who they are):
- Company size (employees): 1-50, 51-200, 201-1000, 1001-5000, 5000+
- Industry vertical: SaaS, FinTech, Healthcare, Retail, Agency, etc.
- Geography: NA, EMEA, APAC
- Revenue stage: Seed, Series A-C, Enterprise
- Tech stack signals: CRM used, marketing automation, data warehouse

**Behavioral** (what they do):
- Content consumption: whitepaper downloads, webinar attendance, blog visits
- Email engagement tier: active (opened 3+/last 30 days), warm, cold
- Ad engagement: clicked, viewed, retargeted
- Sales interactions: demo requested, trial started, pricing page visited

### Step 3: Score Segments by Intent
Apply intent scoring:
- **High intent**: Pricing page visit + demo request + CRM record exists = score 8-10
- **Medium intent**: Content download + email engagement = score 5-7
- **Low intent**: Single ad click or organic visit = score 1-4

Flag accounts with 3+ high-intent signals as Sales-Ready.

### Step 4: Identify Look-Alike Opportunities
From your top-converting segment (highest close rate, lowest CAC):
- Extract top 5 firmographic characteristics
- Build look-alike audience specs for LinkedIn (Matched Audiences), Meta (Custom Audiences), and Google (Customer Match)
- Identify companies in your CRM that match the profile but haven't been worked

### Step 5: Surface Underserved Segments
Look for segments with:
- High conversion rate but low volume (opportunity to scale)
- High volume but low conversion rate (message or offer mismatch)
- Zero presence (whitespace to explore)

## Output Format

**Segment Analysis Table**:

| Segment | Size | Avg. Intent Score | Conv. Rate | CAC | Priority | Recommended Action |
|---------|------|-------------------|------------|-----|----------|--------------------|
| Mid-market SaaS CMOs | 1,200 | 7.2 | 4.1% | $1,800 | High | Scale LinkedIn targeting |
| Agency Marketing Directors | 340 | 5.8 | 2.3% | $2,400 | Medium | Test new offer/angle |
| Enterprise FinTech VP Mktg | 89 | 8.9 | 6.7% | $3,100 | High | Build dedicated nurture |

**High-Intent Account List**: [Top 20 accounts by intent score]

**Look-Alike Build Spec**:
- Seed audience: [description]
- Platform: [LinkedIn / Meta / Google]
- Targeting parameters: [job titles, company size, industry, etc.]

**Recommended Next Steps**:
- Immediate (this week): [specific action]
- Short-term (this month): [specific action]
- Strategic (this quarter): [specific action]
