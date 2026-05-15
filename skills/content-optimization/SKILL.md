---
name: content-optimization
description: Optimize existing content for search intent and AEO, checking keyword usage, structure, internal links, and meta tags
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill audits and rewrites existing content to maximize organic search performance and Answer Engine Optimization (AEO). It covers on-page SEO fundamentals, intent alignment, structural improvements, and internal linking — applied to content that already exists and needs to rank better or retain its current position.

## When to Use
- A page is ranking 11-30 for a high-value keyword and needs a push to page 1
- A previously top-ranked page has slipped in position
- Content is more than 12 months old and competitive SERPs have changed
- A new keyword cluster is identified that existing content partially addresses
- After an SEO audit surfaces content quality issues
- As part of the seo-sprint workflow (step 3)

## How to Execute

### Step 1: Analyze Current Performance
Collect baseline data for the page:
- Current ranking keywords and positions (Google Search Console)
- Organic clicks and impressions (last 90 days)
- Click-through rate vs. expected CTR for the position
- Bounce rate and average time on page (GA4)
- Number of backlinks to the page

### Step 2: Identify Primary and Secondary Keywords
Confirm the single primary keyword this page should be optimized for. Identify 4-8 secondary/supporting keywords (semantically related, same intent cluster). Ensure no keyword cannibalization exists — no other page on the site is targeting the same primary keyword.

### Step 3: Audit Search Intent Alignment
Examine the current SERP for the primary keyword:
- What content type dominates? (Blog post, listicle, comparison, how-to, landing page)
- What depth does the top 3 results cover?
- What specific sections or questions do top results answer?

If the existing page's format or depth doesn't match current SERP intent — that's the primary fix.

### Step 4: On-Page Element Audit

**Title Tag**:
- Contains primary keyword (ideally near the front)
- Under 60 characters to avoid truncation
- Compelling enough to earn the click (not just SEO-stuffed)
- Includes a differentiator if possible ("2025 Guide", "With Examples", "For B2B Teams")

**Meta Description**:
- 140-160 characters
- Contains primary keyword naturally
- Includes a clear value proposition and implicit CTA
- Not duplicate of title or H1

**H1**:
- Exactly one H1 per page
- Contains primary keyword
- Matches or closely mirrors the title tag intent

**Header Structure (H2/H3)**:
- Logical hierarchy, no skipped levels
- H2s cover the main SERP questions (use "People Also Ask" as a guide)
- H3s break down H2 sections
- At least one H2 contains a secondary keyword naturally

**Keyword Usage in Body**:
- Primary keyword in first 100 words
- Natural keyword density: primary keyword appears every 300-500 words (not stuffed)
- Secondary keywords distributed through the body
- LSI (Latent Semantic Indexing) terms present — the vocabulary Google expects to see on this topic

**Content Depth**:
- Compare word count to top 3 ranking pages
- Identify topics covered by competitors that the existing content misses
- Add missing sections, examples, or data points

### Step 5: AEO (Answer Engine Optimization)
Optimize for AI-generated answers and featured snippets:
- Add a concise definition paragraph in the first 200 words for definitional queries
- Use FAQ sections with questions exactly as users would phrase them
- Use structured lists (numbered or bulleted) for "how to" and "best X" queries
- Add a summary box or key takeaways section at the top or bottom
- Use clear question-and-answer formatting throughout
- Add FAQ schema markup recommendation

### Step 6: Internal Linking Audit
- Add 3-5 contextual internal links to/from this page to related content
- Ensure anchor text is descriptive (not "click here" or "read more")
- Check that the page is linked from the site's most authoritative related pages
- Identify if this page should be linked from the homepage, navigation, or pillar page hub

### Step 7: Technical On-Page Checks
- Images: alt text present, descriptive, includes keyword where natural
- Page URL: short, keyword-rich, no dates that will make it look stale
- Schema markup: Article, FAQ, or HowTo schema where applicable
- Canonical tag: correct self-referencing canonical

## Output Format

**Optimization Report for [Page URL]**:

Current stats: Position [X] | Clicks [Y]/mo | Primary keyword: [keyword]

**Priority Issues Found**:

| Issue | Current State | Recommended Change | Impact |
|-------|--------------|-------------------|--------|
| Title tag | "Marketing Tools Blog Post" | "10 Best AI Marketing Tools for B2B Teams (2025)" | High |
| Missing FAQ section | None present | Add 5-question FAQ with schema | High |
| Primary keyword density | 0.1% | Increase to 0.3-0.5% | Medium |
| Internal links to this page | 1 | Add links from 4 related high-authority pages | Medium |

**Revised On-Page Elements**:
- New Title Tag: [text]
- New Meta Description: [text]
- Suggested H2 additions: [list]

**Content Gaps to Fill**:
- [Topic/section that top competitors cover but this page doesn't]

**AEO Additions**:
- [Specific FAQ questions to add]
- [Schema markup recommendation]

**Internal Link Map**:
- Add link FROM: [page] using anchor: [text]
- Add link TO: [page] using anchor: [text]
