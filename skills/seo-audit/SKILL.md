---
name: seo-audit
description: Run a full SEO audit covering technical issues, keyword gaps, content opportunities, and backlink profile, prioritized by business impact
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill conducts a comprehensive SEO audit across four dimensions: technical health, keyword coverage, content quality and gaps, and backlink authority. Every finding is prioritized by estimated traffic and revenue impact, not just SEO theory, so the team knows what to fix first.

## When to Use
- Quarterly SEO health check
- Before a major website redesign or migration
- When organic traffic drops >15% in a period
- When launching in a new content area or market
- As the first step in an seo-sprint workflow
- When a competitor outranks you for a previously owned keyword

## How to Execute

### Step 1: Technical SEO Audit
Check the following and flag issues as Critical / High / Medium / Low:

**Crawlability**:
- robots.txt: blocking critical pages?
- XML sitemap: exists, submitted to GSC, no errors, up to date?
- Crawl errors in Google Search Console: 404s, 5xx errors, redirect chains
- Noindex tags: applied correctly? Any important pages accidentally noindexed?

**Performance**:
- Core Web Vitals: LCP, FID/INP, CLS scores (target: all green in GSC)
- Page speed: Mobile and desktop scores via Lighthouse (target: 80+)
- Image optimization: uncompressed images, missing alt text, wrong formats (use WebP)
- JavaScript rendering issues: content blocked by JS that Googlebot can't process

**Structure**:
- HTTPS: all pages secure, no mixed content warnings
- Canonical tags: correct, no self-referencing issues, no cross-domain canonical problems
- Duplicate content: URL parameter duplication, www vs. non-www, trailing slash inconsistency
- Pagination: proper rel=next/prev or load-more handling
- Internal link structure: orphan pages (no internal links), excessive redirect hops

**Mobile**:
- Mobile-first indexing readiness: content parity between mobile and desktop
- Tap targets, font sizes, viewport configuration

### Step 2: Keyword Gap Analysis
1. Pull current ranking keywords from Google Search Console (position, impressions, clicks, CTR)
2. Identify competitor ranking keywords using available tools (Ahrefs, SEMrush, or manual analysis)
3. Find gaps: keywords where competitors rank in top 10 but you don't rank in top 50
4. Cluster gaps by search intent and business relevance
5. Flag "quick win" keywords: currently ranking 11-30, high volume, strong business fit — small push could move to page 1

### Step 3: Content Quality Audit
For top 20 pages by organic traffic:
- Is the content matching current search intent for its target keyword?
- Is the content comprehensive vs. competitor pages ranking above it?
- Last updated date: is it stale (>12 months without updates for competitive topics)?
- Missing elements: FAQ section, structured data, supporting visuals, internal links to/from
- E-E-A-T signals: author bio, citations, first-hand expertise demonstrated?

Identify pages in keyword positions 4-20 ("striking distance") — these are highest-leverage optimization targets.

### Step 4: Backlink Profile Audit
- Total referring domains and domain rating distribution
- Link velocity: gaining or losing links over time?
- Toxic links: spammy domains pointing to your site (flag for disavow)
- Competitor backlink gap: which high-authority sites link to competitors but not you?
- Anchor text distribution: over-optimized exact-match anchors (manual penalty risk)
- Lost links: previously earned links that disappeared (reach out to reclaim)

## Output Format

**Technical Issues** (sorted by priority):

| Issue | Severity | Pages Affected | Estimated Traffic Impact | Fix |
|-------|----------|---------------|--------------------------|-----|
| 14 pages returning 404 | Critical | 14 | High | Redirect to relevant pages |
| LCP > 4s on mobile | High | All | High | Compress hero images, lazy load |
| 3 key pages accidentally noindexed | Critical | 3 | High | Remove noindex tag |

**Keyword Opportunities**:

| Keyword | Monthly Volume | Current Position | Competitor Position | Type | Priority |
|---------|---------------|-----------------|--------------------|----- |----------|
| "AI marketing automation" | 2,400 | 34 | 3 | Gap | High |
| "marketing ops tools" | 880 | 18 | 5 | Quick Win | High |

**Content Improvements**:
- [Page URL]: [Specific improvement — update date, add FAQ, expand section X]

**Backlink Actions**:
- Outreach targets: [X high-authority sites linking to competitors]
- Disavow candidates: [X toxic domains]
- Reclaim opportunities: [X recently lost links]

**Prioritized Action Plan**:
1. [Critical fix — do this week]
2. [High priority — do this month]
3. [Medium — this quarter]
