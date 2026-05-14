// ─── AGENTS ──────────────────────────────────────────────────────────────────
export const agents = [
  { id: "a1", name: "Master Orchestrator", role: "Tier 1 Orchestrator", status: "active", model: "Claude Sonnet 4", runsToday: 96, avgLatency: "1.2s", lastRun: "30s ago", confidence: 0.97, tasks: ["Polling HubSpot for MQL gap", "Firing today's priorities to 30 team members", "Monitoring anomaly thresholds"] },
  { id: "a2", name: "Social Media Agent", role: "Social Media Manager", status: "active", model: "Claude Sonnet 4", runsToday: 34, avgLatency: "4.1s", lastRun: "2m ago", confidence: 0.93, tasks: ["Monitoring LinkedIn trending topics", "Scoring draft post for brand voice", "Scheduling 3 posts for tomorrow"] },
  { id: "a3", name: "Campaign Optimizer", role: "Performance Marketing", status: "active", model: "Claude Sonnet 4", runsToday: 48, avgLatency: "6.3s", lastRun: "4m ago", confidence: 0.91, tasks: ["Analyzing CPC anomaly on G-Brand-01", "Generating budget reallocation recommendation", "Checking lead quality across 13 campaigns"] },
  { id: "a4", name: "SEO Intelligence Agent", role: "SEO / AEO / GEO", status: "active", model: "Claude Sonnet 4", runsToday: 12, avgLatency: "11.4s", lastRun: "7m ago", confidence: 0.88, tasks: ["Classifying 7 new link-building emails", "Detecting AEO citation gaps vs competitors", "Scoring 2 newly published blog posts"] },
  { id: "a5", name: "Events Command Agent", role: "Events Manager", status: "active", model: "Claude Sonnet 4", runsToday: 8, avgLatency: "9.2s", lastRun: "15m ago", confidence: 0.95, tasks: ["Processing 23 leads from Finovate Fall", "Generating CMO SDR report on demand", "Routing HOT leads to AE Slack channel"] },
  { id: "a6", name: "Content Strategist", role: "Content & Campaigns", status: "idle", model: "Claude Sonnet 4", runsToday: 5, avgLatency: "14.7s", lastRun: "1h ago", confidence: 0.89, tasks: [] },
  { id: "a7", name: "Brand QC Agent", role: "Brand Design", status: "active", model: "Claude Sonnet 4", runsToday: 21, avgLatency: "3.8s", lastRun: "6m ago", confidence: 0.96, tasks: ["Running QC checks on 2 social creatives", "Checking colour contrast ratios", "Validating Lyzr typography rules"] },
  { id: "a8", name: "Partnership Agent", role: "GSI Partnerships", status: "idle", model: "Claude Sonnet 4", runsToday: 6, avgLatency: "8.1s", lastRun: "2h ago", confidence: 0.87, tasks: [] },
  { id: "a9", name: "Chief of Staff Agent", role: "Chief of Staff", status: "active", model: "Claude Sonnet 4", runsToday: 19, avgLatency: "16.2s", lastRun: "12m ago", confidence: 0.94, tasks: ["Assembling weekly marketing deck (Friday)", "Checking podcast pipeline approvals", "Scanning team task velocity for CMO report"] },
  { id: "a10", name: "Wiki Curator", role: "LLM Wiki", status: "active", model: "Claude Sonnet 4", runsToday: 7, avgLatency: "22.3s", lastRun: "45m ago", confidence: 0.92, tasks: ["Ingesting 3 new campaign reports", "Updating entity page: Lyzr Architect", "Running weekly lint pass"] },
];

// ─── KPIs ─────────────────────────────────────────────────────────────────────
export const kpis = {
  mqls: { current: 312, target: 1000, trend: +18, unit: "/mo" },
  paidSpend: { current: 84200, target: 90000, trend: -2.1, unit: "USD" },
  costPerMql: { current: 269, target: 200, trend: +12, unit: "USD" },
  activeCampaigns: { current: 13, trend: 0 },
  socialReach: { current: 284000, trend: +6.2, unit: "" },
  contentMqls: { current: 47, target: 150, trend: +8, unit: "" },
  brandScore: { current: 87, target: 90, trend: +3, unit: "/100" },
  seoClicks: { current: 12400, trend: +4.1, unit: "/wk" },
};

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────
export const activityFeed = [
  { id: "f1", time: "30s ago", agent: "Master Orchestrator", action: "Detected MQL gap of -38 vs weekly target. Firing anomaly alert to Performance & Content leads.", type: "alert" },
  { id: "f2", time: "2m ago", agent: "Campaign Optimizer", action: "G-Brand-01 CTR dropped 23% in last 4h. Recommending ad copy rotation. Routing to Performance Manager.", type: "recommendation" },
  { id: "f3", time: "4m ago", agent: "Brand QC Agent", action: "LinkedIn creative for 'Lyzr Architect' passed all 6 QC checks. Status updated to APPROVED.", type: "success" },
  { id: "f4", time: "6m ago", agent: "Social Media Agent", action: "Trend detected: 'Agentic AI' trending on LinkedIn. Brief generated. Assigned to content team. 6h window.", type: "insight" },
  { id: "f5", time: "12m ago", agent: "Events Command Agent", action: "23 leads from Finovate Fall processed. 8 HOT → Slack alert sent to AEs. 11 WARM → SDR sequence.", type: "success" },
  { id: "f6", time: "15m ago", agent: "Chief of Staff Agent", action: "Weekly deck assembly started. Pulling HubSpot, GA4, and ad platform data for Friday 4pm deadline.", type: "info" },
  { id: "f7", time: "28m ago", agent: "SEO Intelligence Agent", action: "7 link-building emails classified: 2 Tier 1 (DA >30, AI niche) → drafts ready for review.", type: "insight" },
  { id: "f8", time: "45m ago", agent: "Wiki Curator", action: "Ingested Q1 campaign retrospective. 14 wiki pages updated. 2 new synthesis pages created.", type: "info" },
  { id: "f9", time: "1h ago", agent: "Master Orchestrator", action: "Morning briefing delivered to 28 team members. 6 priority tasks auto-assigned. 3 approvals pending.", type: "info" },
  { id: "f10", time: "2h ago", agent: "Partnership Agent", action: "HubSpot query: 'Calls last week from GSI campaigns' → 4 calls, 2 demos, $0 new pipeline. Report sent.", type: "info" },
];

// ─── CAMPAIGNS ────────────────────────────────────────────────────────────────
export const campaigns = [
  { id: "c1", name: "G-Brand-01", platform: "Google", budget: 4200, spent: 3890, convAction: "Demo Request", ctr: 1.8, costMql: 312, mqls: 12, status: "active", change: -23, alert: true },
  { id: "c2", name: "G-Competitor-02", platform: "Google", budget: 2800, spent: 2100, convAction: "Demo Request", ctr: 2.4, costMql: 245, mqls: 9, status: "active", change: +4, alert: false },
  { id: "c3", name: "LI-ABM-Enterprise", platform: "LinkedIn", budget: 6500, spent: 5800, convAction: "Lead Form", ctr: 0.62, costMql: 410, mqls: 14, status: "active", change: -8, alert: false },
  { id: "c4", name: "LI-Retargeting-01", platform: "LinkedIn", budget: 3200, spent: 2900, convAction: "Lead Form", ctr: 0.88, costMql: 289, mqls: 10, status: "active", change: +12, alert: false },
  { id: "c5", name: "LI-TOFU-Architect", platform: "LinkedIn", budget: 4800, spent: 3200, convAction: "Content Download", ctr: 0.44, costMql: 533, mqls: 6, status: "active", change: -15, alert: true },
  { id: "c6", name: "META-Retarget-01", platform: "Meta", budget: 1800, spent: 1650, convAction: "Lead Form", ctr: 1.12, costMql: 275, mqls: 6, status: "active", change: +2, alert: false },
  { id: "c7", name: "META-Lookalike-02", platform: "Meta", budget: 2200, spent: 1100, convAction: "Lead Form", ctr: 0.93, costMql: 220, mqls: 5, status: "active", change: +19, alert: false },
  { id: "c8", name: "G-PMAX-01", platform: "Google", budget: 3000, spent: 2800, convAction: "Demo Request", ctr: 3.2, costMql: 187, mqls: 15, status: "learning", change: 0, alert: false },
];

// ─── EVENTS ──────────────────────────────────────────────────────────────────
export const events = [
  { id: "e1", name: "Finovate Fall", date: "2025-09-09", location: "New York, NY", status: "done", budget: 52000, leads: 500, hot: 109, sql: 1, closedWon: 1, revenue: 1500000, attendees: ["Siva", "Kress", "Joel"], category: "Conference" },
  { id: "e2", name: "GTC (NVIDIA)", date: "2025-03-17", location: "San Jose, CA", status: "done", budget: 38000, leads: 87, hot: 14, sql: 0, closedWon: 0, revenue: 0, attendees: ["Rob", "Jesse"], category: "Conference" },
  { id: "e3", name: "Firstsource SOAR", date: "2025-10-14", location: "London, UK", status: "confirmed", budget: 37500, leads: 0, hot: 0, sql: 0, closedWon: 0, revenue: 0, attendees: ["Siva", "Anju"], category: "Partner" },
  { id: "e4", name: "HFS Spring Summit", date: "2025-05-20", location: "Boston, MA", status: "planning", budget: 25000, leads: 0, hot: 0, sql: 0, closedWon: 0, revenue: 0, attendees: ["Mark", "Jill"], category: "Conference" },
  { id: "e5", name: "Salesforce World Tour", date: "2025-06-11", location: "Chicago, IL", status: "confirmed", budget: 18000, leads: 0, hot: 0, sql: 0, closedWon: 0, revenue: 0, attendees: ["Praveen", "Sri"], category: "Conference" },
  { id: "e6", name: "AI Summit London", date: "2025-11-05", location: "London, UK", status: "planning", budget: 22000, leads: 0, hot: 0, sql: 0, closedWon: 0, revenue: 0, attendees: ["Kress", "Vedant"], category: "Conference" },
  { id: "e7", name: "Lyzr Partner Dinner - NYC", date: "2025-04-28", location: "New York, NY", status: "done", budget: 8500, leads: 34, hot: 8, sql: 0, closedWon: 0, revenue: 0, attendees: ["Joel", "Ravi"], category: "Dinner" },
  { id: "e8", name: "Dreamforce 2025", date: "2025-09-15", location: "San Francisco, CA", status: "confirmed", budget: 45000, leads: 0, hot: 0, sql: 0, closedWon: 0, revenue: 0, attendees: ["Siva", "Mark", "Kress"], category: "Conference" },
];

// ─── SOCIAL POSTS ─────────────────────────────────────────────────────────────
export const socialPosts = [
  { id: "sp1", platform: "LinkedIn", content: "AI agents are transforming how enterprises operate. Learn how Lyzr's AgenticOS platform automates complex workflows end-to-end. Read the full playbook →", status: "scheduled", scheduledAt: "2025-05-15 09:00 IST", reach: 28400, engagement: 3.2, brandScore: 94, author: "Social Media Agent" },
  { id: "sp2", platform: "Twitter", content: "🔥 Agentic AI is the future of enterprise automation. Lyzr builds the platform. You build the agents. #AgenticAI #LyzrOS", status: "pending-approval", scheduledAt: null, reach: 12100, engagement: 2.1, brandScore: 78, author: "Social Media Agent" },
  { id: "sp3", platform: "LinkedIn", content: "The average enterprise runs 47 manual approval workflows per week. Our customers cut that to 3 with Skott. Here's how...", status: "published", scheduledAt: "2025-05-13 10:00 IST", reach: 34200, engagement: 4.8, brandScore: 97, author: "Social Media Agent" },
  { id: "sp4", platform: "Instagram", content: "Behind the scenes: how our AI agents collaborate to run an entire marketing org — from campaign strategy to social publishing.", status: "draft", scheduledAt: null, reach: 8900, engagement: 2.9, brandScore: 88, author: "Social Media Agent" },
  { id: "sp5", platform: "Reddit", content: "We're a startup that built an AI workforce for our own marketing team. AMA — happy to share what's working and what isn't.", status: "pending-approval", scheduledAt: null, reach: 5600, engagement: 1.8, brandScore: 71, author: "Reddit Seeding Agent" },
];

// ─── SEO DATA ─────────────────────────────────────────────────────────────────
export const seoData = {
  organicClicks: 12400,
  impressions: 284000,
  avgPosition: 18.4,
  ctr: 4.4,
  domainHealth: 84,
  aeoMentions: 76,
  aeoCitedPages: 263,
  aeoGaps: 14,
  topKeywords: [
    { keyword: "agentic AI platform", position: 7, change: +3, clicks: 840, impressions: 9200 },
    { keyword: "AI agent builder", position: 12, change: -2, clicks: 620, impressions: 8100 },
    { keyword: "enterprise AI automation", position: 9, change: +5, clicks: 580, impressions: 7400 },
    { keyword: "LLM orchestration platform", position: 15, change: +1, clicks: 410, impressions: 6200 },
    { keyword: "no-code AI agents", position: 22, change: -4, clicks: 290, impressions: 5800 },
    { keyword: "AI workflow automation", position: 18, change: +2, clicks: 380, impressions: 5100 },
  ],
  linkBuildingEmails: [
    { id: "lb1", from: "sarah@techblog.io", subject: "Guest post opportunity — AI & Automation", da: 42, tier: "T1", status: "draft-ready", preview: "Hi Lyzr team, we'd love to feature..." },
    { id: "lb2", from: "editor@aiinsider.com", subject: "Partnership inquiry — backlink exchange", da: 35, tier: "T1", status: "draft-ready", preview: "Following up on our previous..." },
    { id: "lb3", from: "info@links4you.net", subject: "Boost your rankings today!", da: 8, tier: "T3", status: "spam", preview: "We can get you 500 backlinks for..." },
    { id: "lb4", from: "partnerships@techcrunch.com", subject: "Content collaboration request", da: 91, tier: "T1", status: "new", preview: "We're looking for innovative AI..." },
  ],
};

// ─── CONTENT / PLAYBOOKS ──────────────────────────────────────────────────────
export const playbooks = [
  { id: "pb1", title: "The Enterprise AI Agent Buyer's Guide 2025", stage: "Published", leads: 342, demos: 28, views: 4800, channels: { linkedin: true, wordpress: true, email: true, social: true }, distributed: true },
  { id: "pb2", title: "How to Build Production-Ready AI Agents Without ML Expertise", stage: "Distributed", leads: 218, demos: 19, views: 3200, channels: { linkedin: true, wordpress: true, email: false, social: true }, distributed: false },
  { id: "pb3", title: "AgenticOS vs. Traditional Automation: ROI Calculator", stage: "Building", leads: 0, demos: 0, views: 0, channels: { linkedin: false, wordpress: false, email: false, social: false }, distributed: false },
  { id: "pb4", title: "5 Ways Financial Services Firms Are Using Agentic AI", stage: "Research", leads: 0, demos: 0, views: 0, channels: { linkedin: false, wordpress: false, email: false, social: false }, distributed: false },
  { id: "pb5", title: "Lyzr Platform: Architecture Deep Dive for CTOs", stage: "Review", leads: 0, demos: 0, views: 0, channels: { linkedin: false, wordpress: false, email: false, social: false }, distributed: false },
];

// ─── DESIGN REQUESTS ──────────────────────────────────────────────────────────
export const designRequests = [
  { id: "dr1", title: "Lyzr Architect Launch Banner Set", requester: "Social Team", type: "Social Creative", status: "In QC", designer: "Priya", dueDate: "May 16", brandScore: 96, revisions: 1 },
  { id: "dr2", title: "Finovate Fall Event Deck", requester: "Kress", type: "Presentation", status: "In Progress", designer: "Raj", dueDate: "May 18", brandScore: null, revisions: 0 },
  { id: "dr3", title: "Google Ads Creative Set — Q2", requester: "Performance Team", type: "Ad Creative", status: "Review", designer: "Priya", dueDate: "May 15", brandScore: 88, revisions: 2 },
  { id: "dr4", title: "Enterprise AI Playbook Cover", requester: "Content Team", type: "Document", status: "Approved", designer: "Raj", dueDate: "May 12", brandScore: 100, revisions: 0 },
  { id: "dr5", title: "LinkedIn Carousel — Agentic AI 101", requester: "Social Team", type: "Social Creative", status: "Queued", designer: null, dueDate: "May 20", brandScore: null, revisions: 0 },
];

// ─── WIKI NODES ───────────────────────────────────────────────────────────────
export const wikiNodes = [
  // Entities
  { id: "w1", slug: "lyzr-platform", title: "Lyzr Platform", type: "entity", category: "products", links: ["w2", "w3", "w8", "w12"], updated: "2025-05-13", sources: 8 },
  { id: "w2", slug: "lyzr-architect", title: "Lyzr Architect", type: "entity", category: "products", links: ["w1", "w4", "w9"], updated: "2025-05-12", sources: 5 },
  { id: "w3", slug: "lyzr-studio", title: "Lyzr Studio", type: "entity", category: "products", links: ["w1", "w5"], updated: "2025-05-10", sources: 4 },
  { id: "w4", slug: "target-audience", title: "Target Audience — Enterprise", type: "entity", category: "audience", links: ["w2", "w6", "w11"], updated: "2025-05-11", sources: 6 },
  { id: "w5", slug: "competitor-analysis", title: "Competitor Landscape", type: "entity", category: "market", links: ["w3", "w7", "w12"], updated: "2025-05-09", sources: 3 },
  // Concepts
  { id: "w6", slug: "agentic-ai-definition", title: "Agentic AI — Definition & Market", type: "concept", category: "market-intelligence", links: ["w1", "w4", "w7", "w10"], updated: "2025-05-13", sources: 9 },
  { id: "w7", slug: "brand-voice-guidelines", title: "Lyzr Brand Voice", type: "concept", category: "brand", links: ["w5", "w8", "w13"], updated: "2025-05-08", sources: 7 },
  { id: "w8", slug: "mql-attribution-model", title: "MQL Attribution Model", type: "concept", category: "marketing", links: ["w1", "w9", "w10", "w14"], updated: "2025-05-12", sources: 5 },
  { id: "w9", slug: "icp-profile", title: "Ideal Customer Profile", type: "concept", category: "audience", links: ["w2", "w4", "w8"], updated: "2025-05-11", sources: 4 },
  { id: "w10", slug: "north-star-metrics", title: "North Star: 1000 MQL/mo", type: "concept", category: "strategy", links: ["w6", "w8", "w11", "w14"], updated: "2025-05-13", sources: 3 },
  { id: "w11", slug: "abm-strategy", title: "ABM Strategy — Enterprise", type: "concept", category: "marketing", links: ["w4", "w10", "w12"], updated: "2025-05-10", sources: 5 },
  { id: "w12", slug: "content-distribution", title: "Content Distribution Playbook", type: "concept", category: "content", links: ["w1", "w5", "w11", "w13"], updated: "2025-05-09", sources: 6 },
  // Synthesis
  { id: "w13", slug: "q1-retrospective", title: "Q1 2025 Campaign Retrospective", type: "synthesis", category: "analysis", links: ["w7", "w8", "w12", "w14"], updated: "2025-05-07", sources: 12 },
  { id: "w14", slug: "gsi-partnership-intel", title: "GSI Partnership Intelligence", type: "synthesis", category: "partnerships", links: ["w8", "w10", "w11"], updated: "2025-05-06", sources: 4 },
];

// ─── DECISIONS ────────────────────────────────────────────────────────────────
export const pendingDecisions = [
  { id: "d1", title: "Increase G-Brand-01 budget by 40%", category: "PERFORMANCE", priority: "HIGH", agent: "Campaign Optimizer", date: "May 14, 2026", description: "CTR drop of 23% detected. Agent recommends creative rotation + 40% budget increase to recover lost impressions before end-of-month.", checks: { budget: "PASS", compliance: "PASS", threshold: "FLAGGED" } as Record<string, string>, amount: "+$1,680/wk" },
  { id: "d2", title: "Approve LinkedIn post — Agentic AI 101 Carousel", category: "SOCIAL", priority: "MEDIUM", agent: "Social Media Agent", date: "May 14, 2026", description: "Brand voice score: 94/100. Estimated reach: 28,400. Scheduled for tomorrow 9am IST. Requires marketing manager sign-off.", checks: { brand: "PASS", content: "PASS", legal: "PASS" } as Record<string, string>, amount: null },
  { id: "d3", title: "Publish Enterprise AI Buyer's Guide v2", category: "CONTENT", priority: "HIGH", agent: "Content Strategist", date: "May 14, 2026", description: "Updated playbook with 2025 market data. 342 leads from v1. Distribution to all channels pending CMO approval.", checks: { brand: "PASS", legal: "PASS", accuracy: "PASS" } as Record<string, string>, amount: null },
  { id: "d4", title: "Initiate Accenture ABM campaign Q2", category: "PARTNERSHIPS", priority: "MEDIUM", agent: "Partnership Agent", date: "May 13, 2026", description: "Targeting 180 Accenture MDs in BFSI vertical. Estimated budget: $12,000. No duplicate campaigns detected.", checks: { budget: "PASS", compliance: "PASS", duplicate: "PASS" } as Record<string, string>, amount: "$12,000" },
];

// ─── AGENT RUNS ───────────────────────────────────────────────────────────────
export const agentRuns = [
  { id: "r1", name: "Financial Recon — Weekly", status: "completed", duration: "47s", tokens: "15,230", cost: "$0.062", confidence: 0.94, safetyFlags: 0, time: "08:42", steps: 16 },
  { id: "r2", name: "Social Post Generation", status: "completed", duration: "23s", tokens: "8,440", cost: "$0.034", confidence: 0.91, safetyFlags: 0, time: "09:15", steps: 9 },
  { id: "r3", name: "Campaign Anomaly Detection", status: "completed", duration: "61s", tokens: "19,780", cost: "$0.081", confidence: 0.88, safetyFlags: 1, time: "09:58", steps: 22 },
  { id: "r4", name: "Lead Routing — Finovate", status: "completed", duration: "38s", tokens: "11,200", cost: "$0.046", confidence: 0.97, safetyFlags: 0, time: "10:22", steps: 14 },
  { id: "r5", name: "Weekly Deck Assembly", status: "running", duration: "—", tokens: "—", cost: "—", confidence: null, safetyFlags: 0, time: "11:03", steps: null },
  { id: "r6", name: "SEO Link Email Classifier", status: "completed", duration: "18s", tokens: "5,890", cost: "$0.024", confidence: 0.96, safetyFlags: 0, time: "07:31", steps: 7 },
  { id: "r7", name: "Brand QC — Ad Creative Set", status: "failed", duration: "12s", tokens: "3,200", cost: "$0.013", confidence: 0.62, safetyFlags: 2, time: "06:55", steps: 5 },
];

// ─── PODCAST PIPELINE ─────────────────────────────────────────────────────────
export const podcastPipeline = [
  { id: "pod1", guest: "Dr. Sarah Chen", company: "MIT CSAIL", topic: "AI Agents in Enterprise", stage: "Published", episode: 3, status: "live" },
  { id: "pod2", guest: "Marcus Rodriguez", company: "Accenture AI", topic: "GSI Partnerships & AI", stage: "Client Approval", episode: 4, status: "pending" },
  { id: "pod3", guest: "Lisa Park", company: "Goldman Sachs", topic: "AI in Financial Services", stage: "Recorded", episode: 5, status: "processing" },
  { id: "pod4", guest: "James Thompson", company: "McKinsey Digital", topic: "Autonomous Enterprise Ops", stage: "Scheduled", episode: 6, status: "upcoming" },
  { id: "pod5", guest: "Aisha Okonkwo", company: "BCG Gamma", topic: "AI Strategy for CEOs", stage: "Outreach", episode: 7, status: "outreach" },
];

// ─── CHART DATA ───────────────────────────────────────────────────────────────
export const mqlTrendData = [
  { month: "Nov", mqls: 198, target: 1000 },
  { month: "Dec", mqls: 224, target: 1000 },
  { month: "Jan", mqls: 241, target: 1000 },
  { month: "Feb", mqls: 268, target: 1000 },
  { month: "Mar", mqls: 285, target: 1000 },
  { month: "Apr", mqls: 294, target: 1000 },
  { month: "May", mqls: 312, target: 1000 },
];

export const channelBreakdownData = [
  { channel: "Paid Search", mqls: 98, color: "#6366f1" },
  { channel: "Paid Social", mqls: 74, color: "#8b5cf6" },
  { channel: "Organic SEO", mqls: 47, color: "#10b981" },
  { channel: "Events", mqls: 38, color: "#f59e0b" },
  { channel: "Content", mqls: 31, color: "#ef4444" },
  { channel: "Referral", mqls: 24, color: "#06b6d4" },
];

export const weeklySpendData = [
  { week: "W1", google: 8200, linkedin: 14000, meta: 3800 },
  { week: "W2", google: 9100, linkedin: 15200, meta: 4100 },
  { week: "W3", google: 7800, linkedin: 13800, meta: 3600 },
  { week: "W4", google: 9400, linkedin: 16100, meta: 4400 },
  { week: "W5", google: 10200, linkedin: 14900, meta: 3900 },
];
