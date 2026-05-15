---
name: brand-review
description: Review content against brand guidelines for tone, voice, messaging hierarchy, and visual references, outputting pass/fail per criterion with specific fixes
version: 1.0.0
confidence: 0.9
usageCount: 0
---

## Overview
This skill enforces Lyzr brand consistency by reviewing any content piece — blog post, ad copy, social post, sales deck, email, or landing page — against the official brand guidelines. The output is a structured pass/fail audit with specific line-level corrections, not vague notes.

## When to Use
- Before publishing any externally facing content
- As the final step in the content-pipeline workflow
- When onboarding a new writer or agency
- During a messaging-audit to verify channel consistency
- When content comes back from a freelancer or external contributor
- Before a campaign goes live

## How to Execute

### Step 1: Load Brand Reference
Pull the current brand standards from /knowledge/brand-guidelines.md. Confirm which version of the guidelines applies (check document version number if available).

Key criteria to evaluate:
1. Mission alignment
2. Tone and voice
3. Messaging pillars
4. Prohibited language
5. Structural and formatting conventions

### Step 2: Mission Alignment Check
Does the content reflect Lyzr's mission: "democratize agentic AI for enterprises"?
- Does the content speak to enterprise-grade problems and scale?
- Does it position AI as accessible and practical, not futuristic or intimidating?
- Does it communicate empowerment, not dependency?

**Pass**: Content clearly supports enterprise buyers in making AI accessible and actionable.
**Fail**: Content is either too SMB/consumer-focused or too sci-fi/theoretical, misaligning with the enterprise value proposition.

### Step 3: Tone and Voice Review
Lyzr's voice is: Expert but accessible. Confident without being arrogant. Direct without being blunt. Never jargon-heavy.

Check each section of the content:
- **Expert**: Does it demonstrate deep domain knowledge? Is there specificity, data, and nuance?
- **Accessible**: Can a non-technical CMO understand it? Are technical terms explained the first time they appear?
- **Not jargon-heavy**: Flag buzzwords used without substance — "synergy", "leverage" (as a verb), "ecosystem" (unless defined), "paradigm shift", "disruptive" without evidence.
- **Active voice**: Flag passive constructions. "Results were improved by our platform" should be "Our platform improved results."
- **Direct**: Flag hedging language — "might", "could potentially", "in some cases" unless genuine uncertainty warrants it.

### Step 4: Messaging Pillar Audit
Lyzr's three messaging pillars must appear in full-length content and be clear in short-form content:

**Pillar 1 — Speed to Value**: Does the content communicate fast deployment, quick time-to-first-result, rapid ROI?
**Pillar 2 — Enterprise-Grade**: Does the content address security, compliance, scale, integrations, and reliability?
**Pillar 3 — No Vendor Lock-In**: Does the content address flexibility, open standards, model-agnosticism, data portability?

For long-form content: All three pillars should appear.
For short-form (social, ads): At least one pillar should be present.

### Step 5: Prohibited Language Check
Scan for and flag all instances of:
- "easy" or "easily" — replace with specific evidence of simplicity or speed
- "simple" or "simply" — same as above
- Passive voice constructions (more than 10% of sentences)
- Superlatives without evidence: "the best", "the most powerful", "industry-leading" without citation
- Vague claims: "significant results", "major improvement", "huge savings" — always quantify
- Competitor disparagement (allowed to compare facts, not to mock)
- Promises that legal hasn't cleared: "guarantee", "always", "100%"

### Step 6: Formatting and Structure Check
- Headlines: Sentence case (not Title Case) for body H2/H3s on the blog; Title Case for titles and social headlines
- Oxford comma: Required in lists of three or more
- Numbers: Spell out one through nine; use numerals for 10 and above
- Percentages: Use % symbol with numerals (47%, not 47 percent)
- Company name: "Lyzr" not "LYZR" not "lyzr"
- Product name: "Lyzr AgenticOS" on first reference; "Lyzr" or "the platform" on subsequent references

### Step 7: Visual Reference Notes
If reviewing content that includes image or visual guidance:
- Verify any colors referenced match Lyzr's brand palette
- Flag any competitor logos or trademarked imagery
- Confirm any stock photography guidance aligns with "real enterprise teams, not generic stock people" standard

## Output Format

**Brand Review Report — [Content Title]**
Reviewer: Skott | Date: [date] | Content type: [type]

**Overall Status**: PASS / PASS WITH REVISIONS / FAIL

**Criterion-by-Criterion Results**:

| Criterion | Status | Issue Found | Suggested Fix |
|-----------|--------|-------------|---------------|
| Mission Alignment | PASS | — | — |
| Tone — Expert | PASS | — | — |
| Tone — Accessible | FAIL | Para 3 uses "distributed ledger consensus mechanism" without explanation | Define the term: "...consensus mechanism (the process by which nodes agree on data validity)..." |
| Prohibited Language | FAIL | "Simple setup" in headline, "easy to use" in para 1 | Replace: "Deploy in days, not months" / "Built for teams who move fast" |
| Messaging Pillar: Speed to Value | PASS | — | — |
| Messaging Pillar: Enterprise-Grade | FAIL | No mention of security or compliance | Add: mention SOC 2 compliance and enterprise SSO in features section |
| Messaging Pillar: No Vendor Lock-In | PASS | — | — |
| Formatting | FAIL | Company name written as "LYZR" in 2 places | Change to "Lyzr" |

**Specific Edits Required**:
1. [Exact quote from content] → [Exact replacement text]
2. [Exact quote from content] → [Exact replacement text]

**Total Issues**: [X critical / Y moderate / Z minor]
**Estimated revision time**: [X minutes for a writer]
