---
name: seo-writing
description: Write SEO-optimized content with proper H1/H2/H3 structure, keyword density, meta description, and internal linking strategy
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill applies technical SEO writing craft to produce content that ranks. It covers the mechanics of on-page optimization — structure, keyword placement, meta elements, schema — layered on top of content that humans actually want to read. SEO writing is not keyword stuffing; it is structuring expertise in the format search engines and AI answer engines reward.

## When to Use
- Writing new blog posts targeting specific keywords
- Rewriting existing content that needs SEO improvement
- Producing landing pages, pillar pages, or comparison pages for organic search
- After keyword-research has defined the target keyword cluster
- As the fourth step in the content-pipeline workflow (after content-generation)

## How to Execute

### Step 1: Pre-Writing SEO Setup
Before writing a single word, establish:

**Keyword map**:
- Primary keyword (H1, URL, meta title, first 100 words, 2+ H2s)
- Secondary keywords (3-6 terms; distribute in H2s and body)
- LSI/semantic terms (vocabulary Google expects on this topic — not keywords, but related vocabulary)

**SERP analysis**:
- Average word count of top 3 results (match or exceed for competitive terms)
- Featured snippet format: paragraph, list, or table? Match it to win the snippet.
- People Also Ask questions: each one is a potential H2 or FAQ item

**URL structure**:
- Short, keyword-inclusive, no dates: /blog/agentic-ai-marketing not /blog/2025/01/15/what-is-agentic-ai-for-marketers-complete-guide

### Step 2: Title Tag (Meta Title)
Write a title tag (displayed in SERPs, different from H1):
- 50-60 characters (max 60 to avoid truncation)
- Primary keyword near the front
- Power words that earn clicks: "Guide", "Checklist", "2025", "For [Persona]", "Without [Pain]"
- Test options: question format vs. list format vs. how-to format

### Step 3: Meta Description
- 140-155 characters
- Primary keyword present (Google bolds matching terms in search results)
- Clear value proposition in the first half
- Implicit or explicit CTA in the second half
- Do not start with the company name

### Step 4: H1
- Contains primary keyword (can be a natural variation, not exact match required)
- One H1 per page — never two
- Typically longer and more descriptive than the title tag
- Should compel the reader to keep reading

### Step 5: Body Structure with H2/H3 Hierarchy

**H2 structure rules**:
- Each H2 represents a major section (think: table of contents items)
- At least 2 H2s should contain the primary or a secondary keyword naturally
- H2s should answer the questions in "People Also Ask" for the target keyword
- Never skip from H2 to H4 — maintain logical hierarchy

**H3 structure rules**:
- H3s break down H2 sections into subsections
- Use for step-by-step content, feature breakdowns, comparison points
- Can be question-format to capture long-tail voice search

**Content blocks within sections**:
- Use short paragraphs (3-4 sentences max)
- Lead each paragraph with the key point — readers scan
- Use bullet lists for features, steps, or comparisons (3+ items)
- Use numbered lists for ordered processes
- Use bold to highlight key terms (1-2 per section, not every sentence)

### Step 6: Keyword Placement Mechanics

**Primary keyword placement checklist**:
- [ ] Title tag
- [ ] Meta description
- [ ] H1
- [ ] First sentence or first paragraph (within first 100 words)
- [ ] At least 2 H2s
- [ ] Conclusion or summary section
- [ ] Image alt text (once, where natural)
- [ ] URL slug

**Keyword density**:
- Primary keyword: 0.3-0.8% of total word count (for 2,000 words: ~6-16 uses)
- Never forced — if it sounds awkward, use a natural variation
- Secondary keywords: 1-3 uses each, spread throughout

### Step 7: Internal Linking
- Add 3-5 internal links per piece
- Use descriptive anchor text (not "click here" or "read more")
- Link to pages that are topically related and ideally more authoritative
- Include at least one link to a high-priority conversion page (demo, pricing, or core product page) when contextually appropriate
- Note any existing pages that should link TO this new content

### Step 8: Featured Snippet Optimization
To win featured snippets, include:
- **Paragraph snippet** (definitional queries): A 40-60 word definition paragraph immediately following the H2 that matches the query
- **List snippet** (how-to / best X queries): A clean numbered or bulleted list under a matching H2
- **Table snippet** (comparison queries): An HTML table with the comparison data

### Step 9: Schema Markup Recommendations
Specify the appropriate schema type:
- Article or BlogPosting: all blog posts
- HowTo: step-by-step guides
- FAQ: pages with Q&A sections
- Product: feature or product pages
- Review/AggregateRating: comparison or review content

## Output Format

Deliver:

**SEO Metadata Block**:
```
Title Tag: [50-60 chars]
Meta Description: [140-155 chars]
URL Slug: /[slug]
Primary Keyword: [keyword]
Secondary Keywords: [list]
Schema: [type]
```

**Full Content**: [Complete piece with all H1/H2/H3 properly marked, internal link anchors indicated with [LINK TO: page name] notation]

**Internal Link Map**:
- This page should link TO: [page] | anchor: [text]
- These pages should link TO this page: [page] | anchor: [text]

**Featured Snippet Target**: [Which H2 is positioned to win a snippet, and in what format]
