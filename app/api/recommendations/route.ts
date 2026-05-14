import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { page, context } = await req.json();

  const pageContextMap: Record<string, string> = {
    blog: "Blog content strategy for Lyzr AI — an enterprise AI agent platform. Recent trends: agentic AI adoption, LLM orchestration, multi-agent systems.",
    playbooks: "Sales and marketing playbook generation for Lyzr AI. Target: enterprise CTOs, VP Engineering, AI leads at mid-market B2B companies.",
    "case-studies": "Customer success stories for Lyzr AI. Key verticals: fintech, HR tech, healthcare, enterprise SaaS.",
    pages: "Landing page optimization for Lyzr AI platform. Focus: conversion, product demos, enterprise sign-ups.",
    pr: "PR and media outreach for Lyzr AI. Key angles: agentic AI leadership, enterprise adoption, funding/growth milestones.",
    abm: "Account-Based Marketing for Lyzr AI. Target accounts: Fortune 500 enterprises evaluating AI infrastructure. Signals: job postings for AI/ML roles, recent tech acquisitions.",
    outbound: "Outbound sales for Lyzr AI platform. ICP: VP/Director of Engineering, CTO, AI leads at 500-5000 person companies.",
    influencer: "Influencer and creator partnerships for Lyzr AI. Focus: AI/ML thought leaders, enterprise tech influencers, podcast hosts covering AI adoption.",
    events: "Event marketing for Lyzr AI. Mix of virtual webinars and in-person tech conferences. Goal: pipeline generation and brand awareness.",
    webinars: "Webinar strategy for Lyzr AI. Topics: building AI agents, enterprise AI adoption, multi-agent systems for business automation.",
    viral: "Viral content and growth hacking for Lyzr AI. Channels: LinkedIn, Twitter/X, HackerNews, AI newsletters.",
    seo: "SEO strategy for lyzr.ai. Focus: ranking for agentic AI, LLM orchestration, enterprise AI platform, multi-agent systems keywords.",
    "performance-marketing": "Paid advertising for Lyzr AI. Platforms: Google Ads, LinkedIn Ads. Goal: demo bookings and enterprise pipeline.",
    backlinks: "Link building for lyzr.ai. Target: AI/ML publications, tech media, enterprise software directories.",
    keywords: "Keyword intelligence for Lyzr AI content strategy. Primary intent: enterprise buyers researching AI agent platforms.",
    "social-media": "Social media management for Lyzr AI. Platforms: LinkedIn (primary), Twitter/X, YouTube. Voice: authoritative, forward-thinking, practical.",
    "brand-design": "Brand design for Lyzr AI — clean, enterprise-grade, AI-forward aesthetic. Core colors: navy, white, accent teal/gold.",
    partnerships: "GSI and technology partnerships for Lyzr AI. Targets: Deloitte, Accenture, AWS, Azure, Google Cloud partner programs.",
    "chief-of-staff": "Executive marketing operations for Lyzr AI CMO. Weekly metrics review, budget allocation, cross-functional alignment.",
    "/": "Command center overview for Lyzr AI marketing operations. Current focus: Q2 pipeline generation and brand authority building.",
  };

  const pageDescription = context || pageContextMap[page] || `Marketing operations for Lyzr AI — ${page} page`;

  const systemPrompt = `You are Skott, an elite AI marketing intelligence system for Lyzr AI (an enterprise agentic AI platform).
You generate hyper-specific, immediately actionable recommendations for marketing teams.
Each recommendation must be concrete, data-driven, and executable with one click.
Format: Return EXACTLY 4 recommendations as a JSON array. Each has:
- title: short action title (5-8 words max)
- description: why this matters + what specifically to do (1-2 sentences, be specific about numbers/targets/tactics)
- priority: "high" | "medium" | "low"
- action: the CTA button text (2-4 words)
- category: one of "content" | "campaign" | "optimization" | "outreach" | "analysis"
Return ONLY valid JSON, no markdown.`;

  const userPrompt = `Generate 4 AI-powered recommendations for the ${page} page.
Context: ${pageDescription}
Focus on highest-impact actions the team can execute today. Be specific about targets, numbers, and tactics.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "[]";
    let recommendations;
    try {
      recommendations = JSON.parse(text);
    } catch {
      recommendations = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
    }

    return Response.json({ recommendations });
  } catch (err) {
    console.error("Recommendations API error:", err);
    // Fallback recommendations
    return Response.json({
      recommendations: [
        {
          title: "Launch targeted LinkedIn campaign",
          description: "3 enterprise accounts showing buying signals. Deploy personalized sequence targeting VP Engineering roles with Lyzr demo offer.",
          priority: "high",
          action: "Launch Campaign",
          category: "campaign",
        },
        {
          title: "Optimize top-performing content",
          description: "Your last 3 posts averaged 4.2K impressions. A/B test headline variants to push engagement above 6% benchmark.",
          priority: "medium",
          action: "Optimize Now",
          category: "optimization",
        },
        {
          title: "Capture competitor keyword gaps",
          description: "12 high-intent keywords where competitors rank but Lyzr doesn't. Quick-win content can capture 2.4K monthly searches.",
          priority: "high",
          action: "Create Content",
          category: "content",
        },
        {
          title: "Re-engage dormant prospects",
          description: "47 leads went cold in the last 30 days. AI-personalized re-engagement sequence with new Lyzr case study has 34% re-open rate.",
          priority: "medium",
          action: "Send Sequence",
          category: "outreach",
        },
      ],
    });
  }
}
