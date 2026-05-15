---
name: keyword-research
description: Identify keyword clusters for target personas grouped by search intent (navigational, informational, commercial, transactional), with volume, difficulty, and priority
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill builds structured keyword clusters aligned to target buyer personas and funnel stages. It goes beyond keyword lists by grouping terms by intent, mapping them to content types, and scoring by the combination of volume, competition, and business relevance — so the team prioritizes keywords that drive pipeline, not just traffic.

## When to Use
- Before starting a new content program or pillar
- When entering a new product category or market
- As part of an SEO sprint or quarterly content planning cycle
- When competitors are outranking you and you need to find your angles
- When refreshing existing content strategy with updated search data

## How to Execute

### Step 1: Define Personas and Topics
Identify the 2-3 primary personas from ICP profiles (e.g., CMO at mid-market SaaS, Marketing Ops Manager, Agency Account Director). For each persona, brainstorm:
- Their primary job-to-be-done
- The questions they ask before buying
- The problems they Google when something breaks
- The tools and terms they use in daily work

Generate 10-15 seed topics per persona.

### Step 2: Expand Seed Keywords
For each seed topic, expand into keyword variations using:
- Google autocomplete and "People Also Ask" (manual or scraping)
- Related searches at the bottom of SERP
- Question formats: "how to", "what is", "best X for Y", "X vs. Y"
- Competitor content titles and headings (reverse-engineer what they rank for)
- Industry forums, Reddit, LinkedIn comments — language people actually use

Target: 50-100 raw keywords per seed topic.

### Step 3: Classify by Intent
Assign each keyword to one of four intent categories:

**Navigational** — Searching for a specific brand or destination
- Examples: "Lyzr AI login", "HubSpot pricing page"
- Content type: Brand pages, docs, login pages
- Conversion value: Low (they know where they're going)

**Informational** — Seeking knowledge, not ready to buy
- Examples: "what is agentic AI", "how does marketing automation work", "CMO responsibilities"
- Content type: Blog posts, explainers, guides, glossary
- Conversion value: Medium (build authority and nurture)

**Commercial** — Evaluating options, closer to a decision
- Examples: "best AI marketing platform", "Jasper vs Writer vs Lyzr", "marketing AI tools for enterprise"
- Content type: Comparison pages, listicles, reviews, case studies
- Conversion value: High (intent to shortlist)

**Transactional** — Ready to act now
- Examples: "Lyzr demo", "buy marketing AI software", "AI marketing platform pricing"
- Content type: Landing pages, demo pages, pricing pages, free trial pages
- Conversion value: Highest (bottom of funnel)

### Step 4: Score and Prioritize
For each keyword, capture:
- Monthly search volume (global and US/target market)
- Keyword difficulty (0-100; target <50 for new programs, <30 for early-stage)
- Business relevance score (1-5): how directly does ranking here drive pipeline?
- Current ranking position (if any)

Priority score formula: (Business Relevance × 2) + (Volume score 1-5) - (Difficulty / 20)

### Step 5: Build Keyword Clusters
Group keywords into clusters of 5-15 related terms that should be targeted by a single page or content hub. Each cluster needs:
- A primary keyword (the main H1 target)
- Supporting keywords (H2s, body mentions, related terms)
- A content type recommendation
- A target persona

### Step 6: Map to Content Calendar
Identify which clusters are:
- Existing content to optimize
- Net-new content to create
- Quick wins (you rank 11-30 already)

## Output Format

**Keyword Table by Intent Cluster**:

| Keyword | Intent | Monthly Volume | Difficulty | Business Relevance | Priority Score | Action |
|---------|--------|---------------|------------|-------------------|---------------|--------|
| "agentic AI for marketing" | Informational | 1,200 | 28 | 5 | High | Create pillar post |
| "best AI marketing platform" | Commercial | 3,600 | 55 | 5 | High | Comparison page |
| "Lyzr AI demo" | Transactional | 210 | 12 | 5 | High | Optimize demo page |
| "marketing automation workflow" | Informational | 8,100 | 42 | 3 | Medium | Blog post |

**Clusters Summary**:

| Cluster Name | Primary Keyword | # of Supporting Keywords | Content Type | Persona | Priority |
|-------------|----------------|--------------------------|-------------|---------|---------|
| Agentic AI Explainer | "what is agentic AI" | 12 | Pillar page | CMO | High |
| Platform Comparison | "AI marketing tools" | 8 | Comparison page | CMO/Ops | High |

**Quick Wins** (currently ranking 11-30):
- [Keyword]: position [X], volume [Y] — recommendation: [specific optimization]
