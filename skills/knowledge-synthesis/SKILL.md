---
name: knowledge-synthesis
description: Synthesize information from multiple sources into structured knowledge base articles, detecting contradictions, filling gaps, and maintaining version history
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill takes raw information from multiple sources — conversations, documents, research, meeting notes, data exports — and transforms it into a clean, structured, authoritative knowledge base article. It detects contradictions between sources, flags information gaps, and maintains version history so the knowledge base stays trustworthy over time.

## When to Use
- After a strategy session or workshop that produced messy notes
- When the team has produced research scattered across multiple documents
- When a new area of knowledge needs to be formalized into a reference article
- When competitor intel, ICP data, or product positioning needs to be updated and consolidated
- When multiple team members have conflicting understanding of a key topic
- Maintaining the /knowledge/ directory of the CMO AgenticOS

## How to Execute

### Step 1: Gather and Label All Sources
Before synthesizing, list every source:
- Source name (document title, URL, person who provided it)
- Source type: primary (original data, first-hand account) or secondary (summary, reported)
- Source date: when was this information created or last validated?
- Source authority: how trustworthy is this? (internal data > analyst report > blog post)

Assign a weight or priority tier to each source based on authority and recency.

### Step 2: Extract Claims and Facts
From each source, extract discrete claims and facts:
- Each claim should be one statement (not a paragraph)
- Tag each claim with its source
- Flag the confidence level: confirmed (multiple sources agree), reported (single source), inferred (derived from context)

Example:
- CLAIM: "Jasper does not offer multi-agent workflow orchestration" | Source: Product review analysis, competitor-intel.md | Confidence: Confirmed

### Step 3: Detect Contradictions
Compare claims across sources:
- If two sources make opposite claims about the same topic, flag as CONTRADICTION
- Do not silently pick one — surface the conflict and note which source is more authoritative or recent
- If possible, note which claim is more likely to be current

Example contradiction flag:
> CONFLICT: Source A (2024) states customer count is 200+. Source B (2023) states 150+. Using Source A as more recent. Recommend verifying with sales team.

### Step 4: Identify Gaps
After extracting all claims, identify what's missing:
- Questions raised by the topic that no source answers
- Information that should exist but doesn't (e.g., a competitor profile with no pricing data)
- Data that is old enough to be potentially outdated (flag any claim >12 months old for high-volatility topics like competitor pricing or market sizing)

Tag gaps as: MISSING — [description of what's needed and where to get it]

### Step 5: Synthesize Into Structured Article
Organize the synthesized content into a clean structure:
- Lead with the most important/stable information
- Use clear section headers
- Attribute uncertain claims inline: "(as of [date])" or "(reported by [source])"
- Put confirmed facts in the main body; contested or single-source claims in footnotes or a "Notes" section
- Write in third-person, authoritative tone — this is a reference document, not a blog post

### Step 6: Append Version History
At the end of every knowledge base article, maintain a version log:

```
## Version History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [date] | [name] | Initial creation |
| 1.1 | [date] | [name] | Updated competitor pricing section |
| 1.2 | [date] | [name] | Added new ICP segment: Agency vertical |
```

Set a review reminder: each knowledge article should be reviewed every 90 days for high-volatility topics (competitor intel, pricing, market data) and every 6 months for stable topics (brand guidelines, process docs).

### Step 7: Tag and Cross-Reference
At the top of each article, add:
- Topic tags: which skills or workflows reference this article?
- Last reviewed date
- Next review date
- Author and maintainer

## Output Format

**Knowledge Base Article**:

```
---
title: [Article Title]
tags: [skill/workflow tags]
created: [date]
last_reviewed: [date]
next_review: [date]
maintainer: [name/role]
---

## Summary
[2-3 sentence overview of what this article covers]

## [Main Section 1]
[Content with inline source attribution for contested claims]

## [Main Section 2]
[Content]

## Open Questions / Gaps
- MISSING: [description] — recommended source: [where to find this]
- MISSING: [description]

## Conflicts Detected
- CONFLICT: [description of the contradiction and resolution]

## Version History
[Version table]
```
