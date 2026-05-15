"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock,
  Brain, Target, Globe, Search, Users, BarChart3, Zap, Star,
  ArrowUpRight, ArrowDownRight, ChevronRight, Sparkles,
  ShieldAlert, Eye, MessageSquare, ThumbsUp, ThumbsDown,
  DollarSign, Rocket, BookOpen, Bell, Filter, Download,
  Play, Calendar, CheckCheck, X, Plus,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const PRIMARY    = "hsl(25,62%,25%)";
const MUTED      = "hsl(25,20%,50%)";
const CARD       = "hsl(36,30%,97%)";
const BORDER     = "hsl(30,15%,87%)";
const PAGE_BG    = "hsl(36,33%,94%)";
const GREEN      = "hsl(142,55%,35%)";
const RED        = "#dc2626";
const AMBER      = "#d97706";
const BLUE       = "#2563eb";
const DARK_TEXT  = "#3a1f0e";

type Tab = "Market Intelligence" | "Competitor Intelligence" | "Customer Intelligence" | "AI Recommendations";
const TABS: Tab[] = ["Market Intelligence", "Competitor Intelligence", "Customer Intelligence", "AI Recommendations"];

// ─── KPI data ─────────────────────────────────────────────────────────────────
const kpis = [
  { label: "Lyzr Share of Voice",    value: "18%",     icon: BarChart3, color: PRIMARY, sub: "vs 24% top competitor" },
  { label: "NPS Score",              value: "42",      icon: ThumbsUp,  color: GREEN,   sub: "Industry avg 38" },
  { label: "Positive Sentiment",     value: "68%",     icon: Star,      color: AMBER,   sub: "across review platforms" },
  { label: "Competitors Tracked",    value: "12",      icon: Eye,       color: BLUE,    sub: "4 high-threat AI competitors" },
  { label: "Market Signals Today",   value: "847",     icon: Bell,      color: AMBER,   sub: "+124 vs yesterday" },
  { label: "Intelligence Reports",   value: "156",     icon: BookOpen,  color: PRIMARY, sub: "this month" },
];

// ─── Market Intelligence ──────────────────────────────────────────────────────
const trends = [
  { title: "AI-native marketing stacks growing 340% YoY in enterprise segment", source: "Gartner", date: "May 12", impact: "High" },
  { title: "Intent data platforms seeing 5× demand surge from CMOs", source: "Forrester", date: "May 11", impact: "High" },
  { title: "Cookie deprecation driving 68% of brands to first-party data shift", source: "Bloomberg", date: "May 10", impact: "High" },
  { title: "B2B video content engagement up 127% vs 2025", source: "Forrester", date: "May 9", impact: "Medium" },
  { title: "ABM adoption at 84% among Fortune 500 CMOs", source: "Gartner", date: "May 8", impact: "High" },
  { title: "Marketing AI spend forecast to reach $107B by 2028", source: "Bloomberg", date: "May 7", impact: "High" },
  { title: "Short-form video replacing blog as top awareness channel in B2B", source: "Gartner", date: "May 6", impact: "Medium" },
  { title: "Category creation strategy gaining 3× more VC attention", source: "Forrester", date: "May 5", impact: "Medium" },
];

const opportunities = [
  { title: "Untapped segment: Series B SaaS CMOs with <5 person teams", tam: "$2.4B", icon: Target, color: BLUE },
  { title: "Partner channel: System integrators seeking AI marketing tools", tam: "12K companies", icon: Users, color: GREEN },
  { title: "Geographic: APAC enterprise marketing automation 2× faster growth", tam: "$840M opportunity", icon: Globe, color: AMBER },
  { title: "Vertical: Healthcare B2B marketing — low competition, high value", tam: "$320M opportunity", icon: Rocket, color: PRIMARY },
];

const keywords = [
  { kw: "AI marketing automation", vol: 8400, bars: [40, 55, 62, 70, 84, 100] },
  { kw: "marketing intelligence platform", vol: 5200, bars: [50, 55, 60, 68, 72, 80] },
  { kw: "CMO analytics dashboard", vol: 3800, bars: [30, 38, 45, 52, 60, 70] },
  { kw: "B2B intent data", vol: 6100, bars: [60, 65, 70, 75, 82, 90] },
  { kw: "account based marketing software", vol: 7300, bars: [55, 60, 65, 72, 80, 88] },
  { kw: "first-party data strategy", vol: 4900, bars: [20, 30, 45, 60, 72, 85] },
  { kw: "revenue attribution software", vol: 3200, bars: [40, 42, 48, 54, 62, 68] },
  { kw: "marketing mix modeling tool", vol: 2700, bars: [30, 34, 38, 45, 52, 58] },
  { kw: "AI content generation B2B", vol: 5800, bars: [30, 40, 55, 68, 80, 95] },
  { kw: "pipeline acceleration software", vol: 2100, bars: [35, 38, 42, 48, 54, 60] },
];

// ─── Competitor Intelligence ───────────────────────────────────────────────────
const competitors = [
  { name: "Moveworks", sov: "24%", stage: "Series C", funding: "$200M", headcount: "500", recentMove: "Posted comparison blog vs Lyzr (2 days ago)", seoTrend: "up", strengths: "IT automation, large enterprise", weaknesses: "No marketing focus", threat: "High" },
  { name: "Adept AI", sov: "15%", stage: "Series B", funding: "$415M", headcount: "200", recentMove: "New product launch announcement (1 week ago)", seoTrend: "up", strengths: "General automation", weaknesses: "Early stage GTM", threat: "High" },
  { name: "AutoGPT", sov: "12%", stage: "Open Source", funding: "—", headcount: "45 contributors", recentMove: "v0.5 release with new plugins (3 days ago)", seoTrend: "neutral", strengths: "Developer community", weaknesses: "No enterprise support", threat: "Medium" },
  { name: "LangChain", sov: "9%", stage: "Series A", funding: "$25M", headcount: "120", recentMove: "LangSmith GA announcement (5 days ago)", seoTrend: "up", strengths: "Developer ecosystem", weaknesses: "Complex setup", threat: "Medium" },
];

const adLibrary = [
  { competitor: "Moveworks", campaign: "AI Automation for IT", type: "Sponsored", channel: "LinkedIn", variants: 3, spend: "~$120K est.", date: "May 10" },
  { competitor: "Adept AI", campaign: "General AI Launch", type: "Display", channel: "Google", variants: 5, spend: "~$80K est.", date: "May 9" },
  { competitor: "Moveworks", campaign: "Enterprise IT Assistant", type: "Search", channel: "Google", variants: 4, spend: "~$90K est.", date: "May 8" },
  { competitor: "LangChain", campaign: "LangSmith for Teams", type: "Sponsored", channel: "LinkedIn", variants: 2, spend: "~$40K est.", date: "May 7" },
  { competitor: "AutoGPT", campaign: "v0.5 Plugin Ecosystem", type: "Video", channel: "YouTube", variants: 3, spend: "~$15K est.", date: "May 6" },
  { competitor: "Adept AI", campaign: "Workflow Automation Demo", type: "Display", channel: "Programmatic", variants: 4, spend: "~$60K est.", date: "May 5" },
];

const swot = {
  strengths: ["AI-native marketing OS — purpose-built vs general-purpose competitors", "Deep enterprise integrations (200+ connectors)", "Fastest time-to-value in category (avg 3 days)"],
  weaknesses: ["Smaller brand recognition in SMB market", "Limited offline channel capabilities", "Higher price point vs open-source alternatives"],
  opportunities: ["Category leadership in AI marketing OS — no direct competitor yet", "APAC expansion — 2× growth potential", "Partner ecosystem — 3 SIs requesting co-marketing"],
  threats: ["Moveworks expanding from IT automation into marketing use cases", "Adept AI's $415M war chest for GTM acceleration", "LangChain developer mindshare could shift enterprise buying decisions"],
};

// ─── Customer Intelligence ────────────────────────────────────────────────────
const personas = [
  {
    name: "Sarah Chen",
    role: "VP Marketing, Series D SaaS",
    persona: "Enterprise CMO",
    age: 42,
    budget: "$2M+",
    pain: "No unified view of marketing ROI across channels",
    goals: ["Prove marketing attribution to board", "Scale pipeline 3×", "Reduce tool fragmentation"],
    channels: ["LinkedIn", "Events", "Analyst Reports"],
    color: BLUE,
    initials: "SC",
  },
  {
    name: "Marcus Rodriguez",
    role: "Marketing Operations Lead",
    persona: "Marketing Ops",
    age: 35,
    budget: "$200K",
    pain: "Tool fragmentation causing manual reporting overhead",
    goals: ["Centralize martech stack", "Automate reporting", "Improve data quality"],
    channels: ["Google", "Email", "G2"],
    color: GREEN,
    initials: "MR",
  },
  {
    name: "Priya Patel",
    role: "Growth Marketing Manager",
    persona: "Growth Marketer",
    age: 28,
    budget: "$80K",
    pain: "CAC increasing, attribution is unclear across channels",
    goals: ["Reduce CAC by 20%", "Improve attribution clarity", "Scale top channels"],
    channels: ["Meta", "Google", "Content"],
    color: AMBER,
    initials: "PP",
  },
  {
    name: "James O'Brien",
    role: "Agency Partner — Multi-client",
    persona: "Agency Partner",
    age: 45,
    budget: "Varies",
    pain: "Multi-client management overhead, no consolidated view",
    goals: ["Single pane of glass for 12 clients", "White-label reporting", "Faster onboarding"],
    channels: ["Referral", "Events", "LinkedIn"],
    color: PRIMARY,
    initials: "JO",
  },
];

const sentimentItems = {
  painPoints: [
    "Difficulty proving ROI to executive teams",
    "Data silos across marketing tools",
    "Complex setup and onboarding process",
    "Limited native integrations with CRM",
    "Reporting lacks real-time granularity",
  ],
  praised: [
    "AI recommendations are actionable and accurate",
    "Unified dashboard saves 10+ hours/week",
    "Outstanding customer success team",
    "Best attribution modeling in the market",
    "Agent automation handles 80% of tasks",
  ],
};

const journeyStages = [
  { stage: "Awareness", time: "4.2 wks", conv: "2.0%", channel: "LinkedIn / SEO", blocker: "Brand recall" },
  { stage: "Consideration", time: "3.1 wks", conv: "18.4%", channel: "G2 / Events", blocker: "ROI proof" },
  { stage: "Decision", time: "2.8 wks", conv: "31.2%", channel: "Demo / Sales", blocker: "Pricing objection" },
  { stage: "Onboarding", time: "1.5 wks", conv: "88.0%", channel: "CS Team", blocker: "Integration setup" },
  { stage: "Expansion", time: "8.0 wks", conv: "42.0%", channel: "In-product", blocker: "Champion buy-in" },
  { stage: "Advocacy", time: "Ongoing", conv: "28.0%", channel: "NPS / G2", blocker: "Review friction" },
];

// ─── AI Recommendations ───────────────────────────────────────────────────────
const aiRecs = [
  { id: 1, priority: "Critical", category: "Budget",      icon: AlertTriangle, color: RED,     title: "Pause Meta EMEA spend — ROAS 2.4× vs 4× target", body: "Reallocating $82K to LinkedIn ABM could save an estimated $34K in wasted CAC. EMEA campaigns consistently underperforming for 6 consecutive weeks.", impact: "Save $82K, improve blended ROAS by +0.6×" },
  { id: 2, priority: "High",     category: "SEO",         icon: Search,        color: BLUE,    title: "Create 'AI marketing automation' topic cluster — 8.4K monthly searches", body: "Zero content coverage on this keyword cluster. Competitors rank #1–3. Creating 8-piece topic cluster could capture 2.1K visits/mo by Q3.", impact: "+2,100 organic visits/mo, 14 MQLs est." },
  { id: 3, priority: "High",     category: "Competitive", icon: ShieldAlert,   color: AMBER,   title: "Respond to Moveworks comparison blog — 72h window for counter-messaging", body: "Moveworks posted a comparison blog vs Lyzr generating early traction. A targeted counter-narrative around our AI-native marketing focus can recapture share of voice now.", impact: "Capture 15–20% share of voice in category" },
  { id: 4, priority: "High",     category: "Campaign",    icon: TrendingUp,    color: GREEN,   title: "Increase LinkedIn ABM budget 40% — highest performing channel at 6.8× ROAS", body: "LinkedIn ABM is outperforming all other channels. Additional $34K investment projects +$231K in pipeline contribution based on current conversion rates.", impact: "+$231K pipeline, 18 new enterprise SQLs" },
  { id: 5, priority: "Medium",   category: "Campaign",    icon: Calendar,      color: PRIMARY, title: "Q3 pre-load: August seasonality risk -23% in B2B SaaS", body: "Historical data shows B2B SaaS engagement drops 23% in August. Pre-loading campaigns in July ensures pipeline continuity through the seasonal dip.", impact: "Maintain pipeline at $8M+ through August" },
  { id: 6, priority: "Medium",   category: "Content",     icon: Users,         color: BLUE,    title: "Partner channel: 3 system integrators requesting co-marketing", body: "Deloitte Digital, Accenture Song, and WPP are requesting co-marketing partnerships. Combined reach of 45,000 enterprise prospects.", impact: "Reach 45K enterprise prospects at near-zero CAC" },
  { id: 7, priority: "Medium",   category: "Campaign",    icon: Star,          color: AMBER,   title: "G2 review velocity falling — launch review incentive campaign", body: "Review velocity dropped 34% vs Q1. Competitors gaining ground on G2 rankings. A $5K incentive campaign could generate 80+ reviews in 30 days.", impact: "+80 reviews, maintain G2 leader badge" },
  { id: 8, priority: "Low",      category: "Content",     icon: Sparkles,      color: MUTED,   title: "Explore TikTok for brand awareness — competitors not yet active", body: "Analysis shows zero competitor presence on TikTok B2B. Early mover advantage opportunity. B2B TikTok engagement rates 3× LinkedIn for awareness content.", impact: "First-mover advantage, est. 500K impressions/mo" },
];

// ─── Utility components ───────────────────────────────────────────────────────
function KpiCard({ kpi }: { kpi: typeof kpis[0] }) {
  const Icon = kpi.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}
      className="flex items-start gap-4"
    >
      <div style={{ background: `${kpi.color}18`, borderRadius: 10, padding: 10 }}>
        <Icon size={20} style={{ color: kpi.color }} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color: DARK_TEXT, lineHeight: 1 }}>{kpi.value}</div>
        <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{kpi.label}</div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{kpi.sub}</div>
      </div>
    </motion.div>
  );
}

function ImpactBadge({ level }: { level: string }) {
  const color = level === "High" ? RED : AMBER;
  return (
    <span style={{ background: `${color}18`, color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
      {level}
    </span>
  );
}

function ThreatBadge({ level }: { level: string }) {
  const color = level === "High" ? RED : level === "Medium" ? AMBER : GREEN;
  return (
    <span style={{ background: `${color}18`, color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
      {level}
    </span>
  );
}

function PriorityBadge({ level }: { level: string }) {
  const map: Record<string, string> = { Critical: RED, High: AMBER, Medium: BLUE, Low: MUTED };
  const color = map[level] ?? MUTED;
  return (
    <span style={{ background: `${color}18`, color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
      {level}
    </span>
  );
}

// ─── Tab: Market Intelligence ─────────────────────────────────────────────────
function MarketIntelligenceTab() {
  return (
    <div className="flex flex-col gap-8">
      {/* Industry Trend Feed */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT }}>Industry Trend Feed</h3>
          <span style={{ fontSize: 12, color: MUTED }}>Updated 12 min ago</span>
        </div>
        <div className="grid grid-cols-1 gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
          {trends.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16 }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT, lineHeight: 1.45, marginBottom: 8 }}>{t.title}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 11, color: MUTED }}>{t.source}</span>
                  <span style={{ fontSize: 11, color: MUTED }}>·</span>
                  <span style={{ fontSize: 11, color: MUTED }}>{t.date}</span>
                </div>
                <ImpactBadge level={t.impact} />
              </div>
              <button
                style={{ marginTop: 10, background: PRIMARY, color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                Create Report
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Market Opportunity Scanner */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Market Opportunity Scanner</h3>
        <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {opportunities.map((op, i) => {
            const Icon = op.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, borderLeft: `4px solid ${op.color}` }}
              >
                <div className="flex items-start gap-3">
                  <div style={{ background: `${op.color}18`, borderRadius: 8, padding: 8 }}>
                    <Icon size={18} style={{ color: op.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT, lineHeight: 1.4 }}>{op.title}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: op.color, marginTop: 6 }}>Est. TAM / Reach: {op.tam}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Search Trend Pulse */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Search Trend Pulse</h3>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
          <div className="flex flex-col gap-3">
            {keywords.map((kw, i) => (
              <div key={i} className="flex items-center gap-4">
                <div style={{ width: 220, fontSize: 13, color: DARK_TEXT, fontWeight: 500 }}>{kw.kw}</div>
                <div style={{ fontSize: 12, color: MUTED, width: 60 }}>{kw.vol.toLocaleString()}/mo</div>
                {/* sparkline bars */}
                <div className="flex items-end gap-0.5" style={{ height: 24 }}>
                  {kw.bars.map((h, bi) => (
                    <div
                      key={bi}
                      style={{
                        width: 6,
                        height: `${(h / 100) * 24}px`,
                        background: bi === kw.bars.length - 1 ? PRIMARY : `${PRIMARY}55`,
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>
                  +{Math.round((kw.bars[kw.bars.length - 1] - kw.bars[0]) / kw.bars[0] * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Tab: Competitor Intelligence ─────────────────────────────────────────────
function CompetitorIntelligenceTab() {
  const [activeSwot, setActiveSwot] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {/* Competitor Rows */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Competitor Dashboard</h3>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: `${PRIMARY}0a`, borderBottom: `1px solid ${BORDER}` }}>
                {["Competitor", "SOV", "Stage / Funding", "Headcount", "Recent Move", "Strengths", "Weaknesses", "Threat"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {competitors.map((c, i) => (
                <tr key={i} style={{ borderBottom: i < competitors.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${PRIMARY}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: PRIMARY }}>
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: PRIMARY }}>{c.sov}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: MUTED }}>
                    <div>{c.stage}</div>
                    {c.funding !== "—" && <div style={{ fontSize: 11, color: DARK_TEXT, fontWeight: 600, marginTop: 2 }}>{c.funding}</div>}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: DARK_TEXT }}>{c.headcount}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: DARK_TEXT, maxWidth: 200 }}>{c.recentMove}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: GREEN }}>{c.strengths}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: RED }}>{c.weaknesses}</td>
                  <td style={{ padding: "14px 16px" }}><ThreatBadge level={c.threat} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ad Library */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Ad Library — Recent Competitor Ads Detected</h3>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {adLibrary.map((ad, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, marginBottom: 2 }}>{ad.competitor}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{ad.campaign}</div>
                </div>
                <span style={{ background: BLUE + "18", color: BLUE, border: `1px solid ${BLUE}44`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
                  {ad.type}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3" style={{ fontSize: 12, color: MUTED }}>
                <span>{ad.channel}</span>
                <span>·</span>
                <span>{ad.variants} variants</span>
                <span>·</span>
                <span style={{ color: DARK_TEXT, fontWeight: 600 }}>{ad.spend}</span>
              </div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Spotted {ad.date}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SWOT Analysis */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Lyzr vs AI Competitors — SWOT Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          {(["strengths", "weaknesses", "opportunities", "threats"] as const).map((key) => {
            const config = {
              strengths:    { label: "Strengths",    color: GREEN,   bg: "#f0fdf4" },
              weaknesses:   { label: "Weaknesses",   color: RED,     bg: "#fef2f2" },
              opportunities:{ label: "Opportunities",color: BLUE,    bg: "#eff6ff" },
              threats:      { label: "Threats",      color: AMBER,   bg: "#fffbeb" },
            }[key];
            const isOpen = activeSwot === key;
            return (
              <motion.div
                key={key}
                onClick={() => setActiveSwot(isOpen ? null : key)}
                style={{ background: config.bg, border: `1px solid ${config.color}33`, borderRadius: 12, padding: 20, cursor: "pointer" }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontSize: 14, fontWeight: 700, color: config.color }}>{config.label}</span>
                  <ChevronRight size={16} style={{ color: config.color, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </div>
                <AnimatePresence>
                  {(isOpen || true) && (
                    <ul className="flex flex-col gap-2">
                      {swot[key].map((item, i) => (
                        <li key={i} style={{ fontSize: 12, color: DARK_TEXT, display: "flex", alignItems: "flex-start", gap: 6 }}>
                          <span style={{ color: config.color, marginTop: 2 }}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ─── Tab: Customer Intelligence ───────────────────────────────────────────────
function CustomerIntelligenceTab() {
  return (
    <div className="flex flex-col gap-8">
      {/* Persona Cards + Sentiment side by side */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* Persona Cards */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Customer Personas</h3>
          <div className="flex flex-col gap-4">
            {personas.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, borderLeft: `4px solid ${p.color}` }}
              >
                <div className="flex items-start gap-4">
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${p.color}20`, border: `2px solid ${p.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: p.color, flexShrink: 0 }}>
                    {p.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontSize: 14, fontWeight: 700, color: DARK_TEXT }}>{p.name}</span>
                      <span style={{ fontSize: 11, color: MUTED }}>Age {p.age}</span>
                      <span style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}44`, borderRadius: 6, padding: "1px 8px", fontSize: 11, fontWeight: 600 }}>{p.persona}</span>
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{p.role}</div>
                    <div style={{ fontSize: 12, color: RED, marginTop: 8, fontWeight: 500 }}>Pain: {p.pain}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {p.goals.map((g, gi) => (
                        <span key={gi} style={{ fontSize: 11, background: `${PRIMARY}10`, color: PRIMARY, borderRadius: 4, padding: "2px 8px" }}>{g}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>
                      <strong style={{ color: DARK_TEXT }}>Budget:</strong> {p.budget} &nbsp;·&nbsp; <strong style={{ color: DARK_TEXT }}>Channels:</strong> {p.channels.join(", ")}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sentiment Panel */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Sentiment Analysis</h3>
          <div className="flex flex-col gap-4">
            {/* NPS */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>NPS Score</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: GREEN }}>72</div>
              <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>↑ +8 pts vs last quarter</div>
            </div>
            {/* Review sentiment */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>Review Sentiment</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: DARK_TEXT }}>84%</div>
              <div style={{ fontSize: 12, color: MUTED }}>positive across G2, Capterra, Trustpilot</div>
              {/* bar */}
              <div style={{ marginTop: 10, height: 8, background: BORDER, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "84%", background: GREEN, borderRadius: 4 }} />
              </div>
            </div>
            {/* Pain points */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
              <div className="flex items-center gap-2 mb-3">
                <ThumbsDown size={14} style={{ color: RED }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>Top Pain Points</span>
              </div>
              <ul className="flex flex-col gap-2">
                {sentimentItems.painPoints.map((p, i) => (
                  <li key={i} style={{ fontSize: 12, color: DARK_TEXT, display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <span style={{ color: RED }}>•</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            {/* Praised */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
              <div className="flex items-center gap-2 mb-3">
                <ThumbsUp size={14} style={{ color: GREEN }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>Top Praised Features</span>
              </div>
              <ul className="flex flex-col gap-2">
                {sentimentItems.praised.map((p, i) => (
                  <li key={i} style={{ fontSize: 12, color: DARK_TEXT, display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <span style={{ color: GREEN }}>•</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Journey Map */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Customer Journey Map</h3>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
          <div className="flex gap-2" style={{ overflowX: "auto" }}>
            {journeyStages.map((stage, i) => (
              <div key={i} className="flex flex-col items-center" style={{ minWidth: 140, flex: 1 }}>
                {/* connector */}
                <div className="flex items-center w-full">
                  <div style={{ flex: 1, height: 2, background: i === 0 ? "transparent" : `${PRIMARY}40` }} />
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                  </div>
                  <div style={{ flex: 1, height: 2, background: i === journeyStages.length - 1 ? "transparent" : `${PRIMARY}40` }} />
                </div>
                <div style={{ marginTop: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT }}>{stage.stage}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{stage.time}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: GREEN, marginTop: 4 }}>{stage.conv} conv.</div>
                  <div style={{ fontSize: 11, color: BLUE, marginTop: 2 }}>{stage.channel}</div>
                  <div style={{ fontSize: 11, color: RED, marginTop: 4, fontStyle: "italic" }}>⚠ {stage.blocker}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Tab: AI Recommendations ──────────────────────────────────────────────────
function AIRecommendationsTab() {
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [scheduled, setScheduled] = useState<Set<number>>(new Set());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT }}>AI-Generated Strategic Recommendations</h3>
        <span style={{ fontSize: 12, color: MUTED }}>Updated by agents 4 min ago</span>
      </div>
      {aiRecs.map((rec, i) => {
        const Icon = rec.icon;
        const isApplied = applied.has(rec.id);
        const isScheduled = scheduled.has(rec.id);
        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: isApplied ? "#f0fdf4" : CARD,
              border: `1px solid ${isApplied ? GREEN + "66" : BORDER}`,
              borderRadius: 12,
              padding: 20,
              borderLeft: `4px solid ${rec.color}`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div style={{ background: `${rec.color}18`, borderRadius: 8, padding: 8, flexShrink: 0 }}>
                  <Icon size={18} style={{ color: rec.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <PriorityBadge level={rec.priority} />
                    <span style={{ background: `${BLUE}10`, color: BLUE, borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>{rec.category}</span>
                    {isApplied && <span style={{ background: `${GREEN}18`, color: GREEN, borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>✓ Applied</span>}
                    {isScheduled && !isApplied && <span style={{ background: `${AMBER}18`, color: AMBER, borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>⏰ Scheduled</span>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DARK_TEXT, lineHeight: 1.4 }}>{rec.title}</div>
                  <div style={{ fontSize: 13, color: MUTED, marginTop: 4, lineHeight: 1.5 }}>{rec.body}</div>
                  <div style={{ fontSize: 12, color: GREEN, fontWeight: 600, marginTop: 6 }}>Impact: {rec.impact}</div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setApplied(prev => { const s = new Set(prev); s.has(rec.id) ? s.delete(rec.id) : s.add(rec.id); return s; })}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 7,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: isApplied ? GREEN : PRIMARY,
                    color: "#fff",
                  }}
                >
                  {isApplied ? "Applied ✓" : "Apply"}
                </button>
                {!isApplied && (
                  <button
                    onClick={() => setScheduled(prev => { const s = new Set(prev); s.has(rec.id) ? s.delete(rec.id) : s.add(rec.id); return s; })}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 7,
                      border: `1px solid ${BORDER}`,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      background: isScheduled ? `${AMBER}18` : "#fff",
                      color: isScheduled ? AMBER : MUTED,
                    }}
                  >
                    {isScheduled ? "Scheduled" : "Schedule"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Market Intelligence");

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "32px 32px 64px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div className="flex items-center gap-2 mb-1">
          <Brain size={22} style={{ color: PRIMARY }} />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: DARK_TEXT }}>Intelligence Center</h1>
        </div>
        <p style={{ fontSize: 14, color: MUTED }}>Market, competitor & customer intelligence powered by AI agents</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {kpis.map((k, i) => <KpiCard key={i} kpi={k} />)}
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 mb-8" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4, display: "inline-flex" }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: activeTab === tab ? PRIMARY : "transparent",
              color: activeTab === tab ? "#fff" : MUTED,
              transition: "all 0.2s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Market Intelligence"    && <MarketIntelligenceTab />}
          {activeTab === "Competitor Intelligence" && <CompetitorIntelligenceTab />}
          {activeTab === "Customer Intelligence"  && <CustomerIntelligenceTab />}
          {activeTab === "AI Recommendations"     && <AIRecommendationsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
