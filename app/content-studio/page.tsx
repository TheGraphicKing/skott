"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool,
  Search,
  Share2,
  Megaphone,
  FolderOpen,
  ArrowUpRight,
  Sparkles,
  Copy,
  Pencil,
  Send,
  Calendar,
  RefreshCw,
  Globe,
  TrendingUp,
  Link2,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  ImageIcon,
  Video,
  FileText,
  LayoutGrid,
  BarChart3,
  Loader2,
  ChevronRight,
  Zap,
  Filter,
  Plus,
  ExternalLink,
  Eye,
  Download,
  Star,
  Hash,
  Mail,
  MonitorPlay,
  Layers,
  Radio,
  MessageSquare,
  Users,
  AtSign,
  Play,
  BookOpen,
  Link,
  LayoutTemplate,
} from "lucide-react";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const PRIMARY = "hsl(25,62%,25%)";
const MUTED = "hsl(25,20%,50%)";
const CARD = "hsl(36,30%,97%)";
const BORDER = "hsl(30,15%,87%)";
const PAGE_BG = "hsl(36,33%,94%)";
const GREEN = "hsl(142,55%,35%)";
const RED = "#dc2626";
const AMBER = "#d97706";
const BLUE = "#2563eb";
const DARK_TEXT = "#3a1f0e";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Tab = "writer" | "seo" | "social" | "ads" | "assets";

// ─── KPI Header Cards ─────────────────────────────────────────────────────────
const KPI_DATA = [
  { label: "Content Published", value: "847", delta: "+34 this month", up: true, color: BLUE },
  { label: "Avg SEO Score", value: "82/100", delta: "+4 pts MoM", up: true, color: GREEN },
  { label: "Organic Traffic", value: "142K", delta: "+18% MoM", up: true, color: GREEN },
  { label: "Engagement Rate", value: "4.8%", delta: "+0.6% MoM", up: true, color: PRIMARY },
];

function KpiCard({ label, value, delta, up, color }: typeof KPI_DATA[0]) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{ background: CARD, border: `1px solid ${BORDER}` }}
    >
      <p className="text-xs font-medium" style={{ color: MUTED }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: DARK_TEXT }}>{value}</p>
      <div className="flex items-center gap-1">
        <ArrowUpRight size={12} style={{ color: up ? GREEN : RED }} />
        <span className="text-xs font-medium" style={{ color: up ? GREEN : RED }}>{delta}</span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: AI WRITER
// ═══════════════════════════════════════════════════════════════════════════════

const CONTENT_TYPES = ["Blog Post", "LinkedIn Post", "X Thread", "Email", "Ad Copy", "Video Script", "Landing Page"];
const TONES = ["Professional", "Conversational", "Bold", "Technical"];
const PERSONAS = ["Enterprise CMO", "Marketing Manager", "Growth Hacker"];
const WORD_COUNTS = ["800", "1200", "2000"];

const BLOG_DRAFT = `# 5 Ways AI Agents Are Replacing Marketing Teams in 2026

The modern CMO faces a paradox: pressure to do more with less while delivering hyper-personalized experiences at scale. Enter AI agents — autonomous systems that don't just assist marketers but actively execute campaigns, optimize spend, and generate content without human intervention.

## 1. End-to-End Content Creation at Scale

AI agents in 2026 don't just draft copy — they research trending topics, identify semantic keyword gaps, write optimized long-form content, and publish directly to CMS platforms. Tools like Skott's Content Agent process 500+ briefs per month with an average SEO score of 84/100, outperforming human-written content by 23% on organic CTR. The result: content teams have shrunk from 12-person departments to 3-person oversight units.

## 2. Autonomous Campaign Management

Gone are the days of campaign managers manually adjusting bids every morning. AI agents monitor performance signals in real time, reallocating budget across channels, pausing underperforming ad sets, and scaling winners — all without a single Slack message. Enterprise brands using autonomous campaign management report 34% lower CAC and 2.1× faster time-to-market.

## 3. Hyper-Personalized Demand Generation

Marketing teams once spent weeks segmenting audiences. AI agents now build micro-segments dynamically, crafting unique messaging for each buyer persona at every funnel stage. A 2026 Forrester study found that AI-driven personalization increases pipeline conversion by 41%, with B2B SaaS companies seeing the highest lift in mid-market accounts.

## 4. Predictive SEO and Content Gaps

AI agents don't wait for traffic to drop — they identify emerging keyword opportunities 6–8 weeks before competitors. By analyzing SERP volatility, entity relationships, and competitor publishing cadence, these systems generate content roadmaps that consistently place brands in position 1–3 for high-intent queries. One CMO reported capturing 18K in incremental monthly organic sessions within 90 days.

## 5. Real-Time Reporting and Strategy Adaptation

The final frontier: AI agents that synthesize cross-channel data and recommend strategic pivots in real time. Rather than waiting for a quarterly business review, CMOs receive AI-generated briefs every Monday summarizing what's working, what isn't, and exactly what to do next — with confidence intervals attached.

**The bottom line:** The marketing teams winning in 2026 aren't the largest — they're the ones that have embraced AI agents as force multipliers. The question is no longer whether to adopt, but how fast.`;

function AIWriterTab() {
  const [contentType, setContentType] = useState("Blog Post");
  const [tone, setTone] = useState("Professional");
  const [persona, setPersona] = useState("Enterprise CMO");
  const [wordCount, setWordCount] = useState("1200");
  const [brandVoice, setBrandVoice] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [seoOptimizing, setSeoOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2400);
  };

  const handleSeoOptimize = () => {
    setSeoOptimizing(true);
    setTimeout(() => setSeoOptimizing(false), 1800);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left: Input panel */}
      <div className="flex flex-col gap-4 rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <h3 className="text-sm font-semibold" style={{ color: DARK_TEXT }}>Content Settings</h3>

        {/* Content type */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: MUTED }}>Content Type</p>
          <div className="flex flex-wrap gap-1.5">
            {CONTENT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setContentType(t)}
                className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
                style={{
                  background: contentType === t ? PRIMARY : "transparent",
                  color: contentType === t ? "#fff" : DARK_TEXT,
                  border: `1px solid ${contentType === t ? PRIMARY : BORDER}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div>
          <p className="text-xs font-medium mb-1.5" style={{ color: MUTED }}>Topic / Keyword</p>
          <textarea
            className="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none"
            style={{ background: "hsl(36,33%,94%)", border: `1px solid ${BORDER}`, color: DARK_TEXT, minHeight: 72 }}
            defaultValue="How AI agents are replacing marketing teams in 2026"
          />
        </div>

        {/* Tone */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: MUTED }}>Tone</p>
          <div className="flex gap-1.5">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className="flex-1 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  background: tone === t ? "hsl(25,62%,25%)/10" : "transparent",
                  color: tone === t ? PRIMARY : MUTED,
                  border: `1px solid ${tone === t ? PRIMARY : BORDER}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Persona */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: MUTED }}>Target Persona</p>
          <div className="flex gap-1.5">
            {PERSONAS.map((p) => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className="flex-1 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  background: persona === p ? "hsl(25,62%,25%)/10" : "transparent",
                  color: persona === p ? PRIMARY : MUTED,
                  border: `1px solid ${persona === p ? PRIMARY : BORDER}`,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Word count */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: MUTED }}>Word Count</p>
          <div className="flex gap-1.5">
            {WORD_COUNTS.map((w) => (
              <button
                key={w}
                onClick={() => setWordCount(w)}
                className="flex-1 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  background: wordCount === w ? "hsl(25,62%,25%)/10" : "transparent",
                  color: wordCount === w ? PRIMARY : MUTED,
                  border: `1px solid ${wordCount === w ? PRIMARY : BORDER}`,
                }}
              >
                {w} words
              </button>
            ))}
          </div>
        </div>

        {/* Brand voice toggle */}
        <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: "hsl(36,33%,94%)", border: `1px solid ${BORDER}` }}>
          <div>
            <p className="text-xs font-semibold" style={{ color: DARK_TEXT }}>Brand Voice</p>
            <p className="text-xs" style={{ color: MUTED }}>Skott Tone Guidelines applied</p>
          </div>
          <button
            onClick={() => setBrandVoice(!brandVoice)}
            className="relative w-10 h-5 rounded-full transition-colors"
            style={{ background: brandVoice ? GREEN : BORDER }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"
              style={{ transform: brandVoice ? "translateX(21px)" : "translateX(2px)" }}
            />
          </button>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-opacity"
          style={{ background: PRIMARY, color: "#fff", opacity: generating ? 0.7 : 1 }}
        >
          {generating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {generating ? "Generating…" : "Generate with AI"}
        </button>

        {/* Secondary actions */}
        <div className="flex gap-2">
          <button
            onClick={handleSeoOptimize}
            disabled={seoOptimizing}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border transition-colors"
            style={{ border: `1px solid ${BORDER}`, color: DARK_TEXT, background: "transparent" }}
          >
            {seoOptimizing ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
            SEO Optimize
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border"
            style={{ border: `1px solid ${BORDER}`, color: DARK_TEXT, background: "transparent" }}
          >
            <RefreshCw size={12} />
            Repurpose
          </button>
        </div>
      </div>

      {/* Right: Output panel */}
      <div className="flex flex-col gap-4 rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        {/* Score bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium" style={{ color: MUTED }}>SEO Score</span>
            <span className="text-sm font-bold" style={{ color: GREEN }}>84/100</span>
          </div>
          <div className="w-px h-4" style={{ background: BORDER }} />
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium" style={{ color: MUTED }}>Readability</span>
            <span className="text-sm font-bold" style={{ color: AMBER }}>72</span>
          </div>
          <div className="w-px h-4" style={{ background: BORDER }} />
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium" style={{ color: MUTED }}>Word Count</span>
            <span className="text-sm font-bold" style={{ color: DARK_TEXT }}>1,240</span>
          </div>
          <div className="ml-auto">
            <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: `${GREEN}15`, color: GREEN }}>Ready to Publish</span>
          </div>
        </div>

        {/* Content output */}
        <AnimatePresence mode="wait">
          {generating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-3 min-h-[320px]"
            >
              <Loader2 size={32} className="animate-spin" style={{ color: PRIMARY }} />
              <p className="text-sm font-medium" style={{ color: MUTED }}>Generating your content…</p>
              <div className="flex flex-col gap-1.5 w-full max-w-xs">
                {["Researching topic…", "Analyzing competitors…", "Drafting content…"].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={12} style={{ color: GREEN }} />
                    <span className="text-xs" style={{ color: MUTED }}>{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-y-auto text-sm leading-relaxed rounded-lg p-4 max-h-[420px]"
              style={{ background: "hsl(36,33%,94%)", border: `1px solid ${BORDER}`, color: DARK_TEXT }}
            >
              {BLOG_DRAFT.split("\n").map((line, i) => {
                if (line.startsWith("# ")) return <h2 key={i} className="text-base font-bold mb-3" style={{ color: DARK_TEXT }}>{line.slice(2)}</h2>;
                if (line.startsWith("## ")) return <h3 key={i} className="text-sm font-semibold mt-4 mb-2" style={{ color: PRIMARY }}>{line.slice(3)}</h3>;
                if (line.startsWith("**")) return <p key={i} className="mt-3 font-semibold text-xs" style={{ color: DARK_TEXT }}>{line.replace(/\*\*/g, "")}</p>;
                if (line.trim() === "") return <div key={i} className="h-2" />;
                return <p key={i} className="text-xs leading-relaxed mb-2" style={{ color: "#4a3020" }}>{line}</p>;
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
            style={{ border: `1px solid ${BORDER}`, color: copied ? GREEN : DARK_TEXT, background: "transparent" }}
          >
            {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ border: `1px solid ${BORDER}`, color: DARK_TEXT, background: "transparent" }}>
            <Pencil size={12} /> Edit
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: PRIMARY, color: "#fff" }}>
            <Send size={12} /> Publish
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ border: `1px solid ${BORDER}`, color: DARK_TEXT, background: "transparent" }}>
            <Calendar size={12} /> Schedule
          </button>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs" style={{ color: MUTED }}>Repurpose →</span>
            {[{ icon: Link, label: "LinkedIn" }, { icon: Mail, label: "Email" }, { icon: Hash, label: "Twitter" }].map(({ icon: Icon, label }) => (
              <button key={label} title={label} className="p-1.5 rounded-lg border" style={{ border: `1px solid ${BORDER}`, color: MUTED }}>
                <Icon size={12} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: SEO HUB
// ═══════════════════════════════════════════════════════════════════════════════

const SEO_KPIS = [
  { label: "Domain Authority", value: "54", delta: "+3 MoM", color: BLUE },
  { label: "Keywords Ranking", value: "2,847", delta: "+142 this month", color: GREEN },
  { label: "Organic Traffic", value: "142K", delta: "+18% MoM", color: GREEN },
  { label: "Backlinks", value: "8,420", delta: "+284 this month", color: PRIMARY },
];

const KEYWORD_ROWS = [
  { keyword: "AI marketing automation", volume: "8,400", difficulty: 42, diffLabel: "Medium", rank: "Not ranking", opp: "HIGH", action: "Create Content", actionColor: PRIMARY },
  { keyword: "CMO tools 2026", volume: "3,200", difficulty: 28, diffLabel: "Low", rank: "Not ranking", opp: "HIGH", action: "Create Content", actionColor: PRIMARY },
  { keyword: "marketing attribution software", volume: "5,800", difficulty: 67, diffLabel: "Hard", rank: "#8", opp: "MEDIUM", action: "Build Links", actionColor: AMBER },
  { keyword: "AI content generation", volume: "12,400", difficulty: 78, diffLabel: "Hard", rank: "#22", opp: "MEDIUM", action: "Target", actionColor: AMBER },
  { keyword: "b2b marketing automation", volume: "6,700", difficulty: 45, diffLabel: "Medium", rank: "#5", opp: "LOW", action: "Monitor", actionColor: MUTED },
  { keyword: "marketing ops platform", volume: "2,100", difficulty: 32, diffLabel: "Low", rank: "#11", opp: "HIGH", action: "Optimize", actionColor: PRIMARY },
  { keyword: "demand generation software", volume: "4,300", difficulty: 55, diffLabel: "Medium", rank: "#16", opp: "MEDIUM", action: "Target", actionColor: AMBER },
  { keyword: "revenue marketing platform", volume: "1,800", difficulty: 22, diffLabel: "Low", rank: "Not ranking", opp: "HIGH", action: "Create Content", actionColor: PRIMARY },
  { keyword: "marketing performance analytics", volume: "3,600", difficulty: 48, diffLabel: "Medium", rank: "#9", opp: "MEDIUM", action: "Optimize", actionColor: AMBER },
  { keyword: "ai seo tools", volume: "9,100", difficulty: 71, diffLabel: "Hard", rank: "Not ranking", opp: "MEDIUM", action: "Build Links", actionColor: AMBER },
];

const TOPIC_CLUSTERS = [
  {
    hub: "AI in Marketing",
    strength: 78,
    articles: [
      "AI Marketing Agents: Complete Guide 2026",
      "How to Automate Your Marketing Stack with AI",
      "AI vs Human Content: What CMOs Need to Know",
      "Top 10 AI Marketing Tools for Enterprise Teams",
      "ROI of AI in B2B Marketing: Case Studies",
    ],
  },
  {
    hub: "Campaign Optimization",
    strength: 64,
    articles: [
      "How to Reduce CAC by 40% with Automated Bidding",
      "Multi-Channel Attribution: The Definitive Guide",
      "A/B Testing at Scale: Beyond Basic Experiments",
      "Campaign Budget Optimization Across Channels",
      "How to Set Up Autonomous Campaign Management",
    ],
  },
  {
    hub: "Marketing Analytics",
    strength: 71,
    articles: [
      "Marketing Dashboard Best Practices for CMOs",
      "Predictive Analytics in Demand Generation",
      "First-Party Data Strategy Post-Cookie Apocalypse",
      "Revenue Attribution Models: Compared and Ranked",
      "Building a Marketing Data Warehouse in 2026",
    ],
  },
];

function SEOHubTab() {
  const [creatingContent, setCreatingContent] = useState<string | null>(null);

  const handleAction = (keyword: string) => {
    setCreatingContent(keyword);
    setTimeout(() => setCreatingContent(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {SEO_KPIS.map((k) => (
          <div key={k.label} className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-xs font-medium mb-1" style={{ color: MUTED }}>{k.label}</p>
            <p className="text-xl font-bold" style={{ color: DARK_TEXT }}>{k.value}</p>
            <p className="text-xs font-medium mt-0.5" style={{ color: k.color }}>{k.delta}</p>
          </div>
        ))}
      </div>

      {/* Keyword table */}
      <div className="rounded-xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold" style={{ color: DARK_TEXT }}>Keyword Opportunities</h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${BLUE}15`, color: BLUE }}>AI-Identified</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: "hsl(36,33%,94%)" }}>
              {["Keyword", "Monthly Volume", "Difficulty", "Current Rank", "Opportunity", "Action"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left font-semibold" style={{ color: MUTED }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {KEYWORD_ROWS.map((row, i) => (
              <tr key={i} className="border-t hover:bg-[hsl(36,33%,96%)] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-3 font-medium" style={{ color: DARK_TEXT }}>{row.keyword}</td>
                <td className="px-4 py-3" style={{ color: DARK_TEXT }}>{row.volume}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${row.difficulty}%`,
                          background: row.difficulty < 40 ? GREEN : row.difficulty < 65 ? AMBER : RED,
                        }}
                      />
                    </div>
                    <span style={{ color: row.difficulty < 40 ? GREEN : row.difficulty < 65 ? AMBER : RED }}>
                      {row.diffLabel} {row.difficulty}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span style={{ color: row.rank === "Not ranking" ? MUTED : DARK_TEXT }}>{row.rank}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="px-2 py-0.5 rounded-full font-semibold text-[10px]"
                    style={{
                      background: row.opp === "HIGH" ? `${GREEN}15` : row.opp === "MEDIUM" ? `${AMBER}20` : `${MUTED}20`,
                      color: row.opp === "HIGH" ? GREEN : row.opp === "MEDIUM" ? AMBER : MUTED,
                    }}
                  >
                    {row.opp}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleAction(row.keyword)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium transition-opacity flex items-center gap-1"
                    style={{ background: `${row.actionColor}15`, color: row.actionColor }}
                  >
                    {creatingContent === row.keyword ? <Loader2 size={10} className="animate-spin" /> : <Zap size={10} />}
                    {creatingContent === row.keyword ? "Working…" : row.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Topic clusters */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: DARK_TEXT }}>Topic Cluster Visualization</h3>
        <div className="grid grid-cols-3 gap-4">
          {TOPIC_CLUSTERS.map((cluster) => (
            <div key={cluster.hub} className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: PRIMARY }} />
                  <span className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{cluster.hub}</span>
                </div>
                <span className="text-xs font-bold" style={{ color: cluster.strength >= 70 ? GREEN : AMBER }}>
                  {cluster.strength}% strength
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-200 mb-3">
                <div className="h-full rounded-full" style={{ width: `${cluster.strength}%`, background: cluster.strength >= 70 ? GREEN : AMBER }} />
              </div>
              <div className="flex flex-col gap-1.5">
                {cluster.articles.map((article, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: MUTED }} />
                    <span className="text-[11px] leading-snug" style={{ color: MUTED }}>{article}</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full py-1.5 rounded-lg text-xs font-medium border transition-colors" style={{ border: `1px solid ${BORDER}`, color: PRIMARY }}>
                View Cluster →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: SOCIAL STUDIO
// ═══════════════════════════════════════════════════════════════════════════════

const PLATFORMS = [
  { name: "LinkedIn", icon: Link, followers: "42K", eng: "4.7%", last: "2h ago", color: "#0a66c2" },
  { name: "Instagram", icon: ImageIcon, followers: "28K", eng: "6.2%", last: "5h ago", color: "#e1306c" },
  { name: "X / Twitter", icon: AtSign, followers: "18K", eng: "2.1%", last: "1d ago", color: "#000000" },
  { name: "YouTube", icon: Play, followers: "8.4K", eng: "8.4%", last: "3d ago", color: "#ff0000" },
  { name: "TikTok", icon: Hash, followers: "14K", eng: "11.2%", last: "1d ago", color: "#010101" },
  { name: "Reddit", icon: MessageSquare, followers: "6.2K", eng: "3.8%", last: "2d ago", color: "#ff4500" },
  { name: "Threads", icon: Radio, followers: "4.8K", eng: "5.1%", last: "4h ago", color: "#000000" },
  { name: "Facebook", icon: Users, followers: "22K", eng: "1.8%", last: "6h ago", color: "#1877f2" },
];

const QUEUE_POSTS = [
  { platform: "LinkedIn", icon: Link, color: "#0a66c2", content: "AI agents are doing what a 10-person marketing team used to do. Here's the playbook CMOs are using in 2026 👇", time: "Today, 9:00 AM", status: "Approved" },
  { platform: "X / Twitter", icon: AtSign, color: "#000000", content: "Thread: 5 AI marketing moves that generated $4.2M pipeline this quarter (real numbers) ↓", time: "Today, 11:30 AM", status: "Approved" },
  { platform: "Instagram", icon: ImageIcon, color: "#e1306c", content: "Behind the scenes: our AI content engine created 847 pieces of content this month with a 3-person team.", time: "Today, 2:00 PM", status: "Pending" },
  { platform: "LinkedIn", icon: Link, color: "#0a66c2", content: "The CMO who embraces AI agents won't replace human marketers — they'll replace CMOs who don't.", time: "Tomorrow, 8:00 AM", status: "Approved" },
  { platform: "YouTube", icon: Play, color: "#ff0000", content: "NEW VIDEO: How we cut CAC by 34% using autonomous campaign management (full walkthrough)", time: "Tomorrow, 10:00 AM", status: "Draft" },
  { platform: "Threads", icon: Radio, color: "#000000", content: "Marketing attribution in 2026 is actually solvable. Here's the stack we use for 100% pipeline visibility.", time: "Tomorrow, 12:00 PM", status: "Pending" },
];

const TRENDING = [
  { topic: "#AIMarketing2026", volume: "142K posts", momentum: "+340% this week", platform: "LinkedIn + X" },
  { topic: "Marketing team cuts / AI replacement", volume: "38K posts", momentum: "+180% this week", platform: "LinkedIn" },
  { topic: "#CMOPriorities2026", volume: "24K posts", momentum: "+95% this week", platform: "LinkedIn" },
  { topic: "Budget reallocation to AI tools", volume: "19K posts", momentum: "+210% this week", platform: "X + Reddit" },
  { topic: "#ContentAI", volume: "87K posts", momentum: "+65% this week", platform: "All platforms" },
];

function SocialStudioTab() {
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const handleGenerate = (platform: string) => {
    setGeneratingFor(platform);
    setTimeout(() => setGeneratingFor(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-5 gap-4">
        {/* Platform grid */}
        <div className="col-span-3">
          <h3 className="text-sm font-semibold mb-3" style={{ color: DARK_TEXT }}>Connected Platforms</h3>
          <div className="grid grid-cols-2 gap-3">
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              const isGenerating = generatingFor === p.name;
              return (
                <div key={p.name} className="rounded-xl p-3.5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${p.color}15` }}>
                      <Icon size={14} style={{ color: p.color }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{p.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mb-2.5">
                    <div>
                      <p className="text-[10px]" style={{ color: MUTED }}>Followers</p>
                      <p className="text-xs font-bold" style={{ color: DARK_TEXT }}>{p.followers}</p>
                    </div>
                    <div>
                      <p className="text-[10px]" style={{ color: MUTED }}>Engagement</p>
                      <p className="text-xs font-bold" style={{ color: GREEN }}>{p.eng}</p>
                    </div>
                    <div>
                      <p className="text-[10px]" style={{ color: MUTED }}>Last Post</p>
                      <p className="text-xs font-medium" style={{ color: MUTED }}>{p.last}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGenerate(p.name)}
                    className="w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-opacity"
                    style={{ background: `${p.color}15`, color: p.color, opacity: isGenerating ? 0.7 : 1 }}
                  >
                    {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    {isGenerating ? "Generating…" : "Generate Post"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Queue */}
        <div className="col-span-2 flex flex-col gap-3">
          <h3 className="text-sm font-semibold" style={{ color: DARK_TEXT }}>Content Queue</h3>
          <div className="flex flex-col gap-2">
            {QUEUE_POSTS.map((post, i) => {
              const Icon = post.icon;
              return (
                <div key={i} className="rounded-xl p-3" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center" style={{ background: `${post.color}15` }}>
                      <Icon size={11} style={{ color: post.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] leading-snug mb-1.5 line-clamp-2" style={{ color: DARK_TEXT }}>{post.content}</p>
                      <div className="flex items-center gap-2">
                        <Clock size={9} style={{ color: MUTED }} />
                        <span className="text-[10px]" style={{ color: MUTED }}>{post.time}</span>
                        <span
                          className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{
                            background: post.status === "Approved" ? `${GREEN}15` : post.status === "Pending" ? `${AMBER}20` : `${MUTED}15`,
                            color: post.status === "Approved" ? GREEN : post.status === "Pending" ? AMBER : MUTED,
                          }}
                        >
                          {post.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trending topics */}
      <div className="rounded-xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
          <h3 className="text-sm font-semibold" style={{ color: DARK_TEXT }}>Trending Topics</h3>
          <span className="text-xs" style={{ color: MUTED }}>AI-monitored across all platforms</span>
        </div>
        <div className="divide-y" style={{ borderColor: BORDER }}>
          {TRENDING.map((t, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-4">
              <TrendingUp size={14} style={{ color: GREEN }} className="flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{t.topic}</p>
                <p className="text-xs" style={{ color: MUTED }}>{t.volume} · {t.platform}</p>
              </div>
              <span className="text-xs font-medium" style={{ color: GREEN }}>{t.momentum}</span>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: PRIMARY, color: "#fff" }}>
                Create Campaign
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: AD CREATIVE STUDIO
// ═══════════════════════════════════════════════════════════════════════════════

const AD_FORMATS = ["Google Search", "Google Display", "Meta Feed", "LinkedIn Sponsored", "YouTube Pre-roll"];

const AD_VARIANTS = [
  {
    headline: "Replace 10 Marketers With 1 AI Agent",
    body: "Enterprise teams using Skott reduce content costs by 74% while publishing 5× more content. Trusted by 200+ CMOs. Start free today.",
    cta: "Start Free Trial",
    ctr: 4.2,
    conv: 3.8,
  },
  {
    headline: "AI Marketing OS Built for Enterprise CMOs",
    body: "From content creation to campaign optimization — Skott's AI agents handle your entire marketing stack autonomously. See ROI in 30 days.",
    cta: "Book a Demo",
    ctr: 3.9,
    conv: 4.1,
  },
  {
    headline: "Cut CAC by 34%. Scale Revenue. With AI.",
    body: "Join 200+ enterprise marketing teams running campaigns autonomously. Multi-channel. Always-on. Predictably profitable.",
    cta: "Calculate Your ROI",
    ctr: 5.1,
    conv: 2.9,
  },
  {
    headline: "The AI CMO Office Is Here. Are You Ready?",
    body: "Skott's agentic marketing platform manages your entire go-to-market motion — from SEO to demand gen. Built for modern CMOs.",
    cta: "See It In Action",
    ctr: 3.6,
    conv: 3.4,
  },
];

function AdCreativeTab() {
  const [activeFormat, setActiveFormat] = useState("LinkedIn Sponsored");
  const [generatingVariants, setGeneratingVariants] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const handleGenerate = () => {
    setGeneratingVariants(true);
    setTimeout(() => setGeneratingVariants(false), 2200);
  };

  return (
    <div className="flex gap-6">
      {/* Left: format selector */}
      <div className="w-52 flex-shrink-0 flex flex-col gap-2">
        <h3 className="text-sm font-semibold mb-1" style={{ color: DARK_TEXT }}>Ad Format</h3>
        {AD_FORMATS.map((fmt) => (
          <button
            key={fmt}
            onClick={() => setActiveFormat(fmt)}
            className="px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors"
            style={{
              background: activeFormat === fmt ? PRIMARY : CARD,
              color: activeFormat === fmt ? "#fff" : DARK_TEXT,
              border: `1px solid ${activeFormat === fmt ? PRIMARY : BORDER}`,
            }}
          >
            {fmt}
          </button>
        ))}
        <button
          onClick={handleGenerate}
          className="mt-4 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium"
          style={{ background: PRIMARY, color: "#fff" }}
        >
          {generatingVariants ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {generatingVariants ? "Generating…" : "Generate Variants"}
        </button>
      </div>

      {/* Right: variants panel */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{activeFormat} — 4 Variants</h3>
            <p className="text-xs" style={{ color: MUTED }}>LinkedIn ABM Campaign · AI-generated</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${BLUE}15`, color: BLUE }}>AI Scored</span>
        </div>

        {generatingVariants ? (
          <div className="flex items-center justify-center h-48 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={24} className="animate-spin" style={{ color: PRIMARY }} />
              <p className="text-sm" style={{ color: MUTED }}>Generating ad variants…</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {AD_VARIANTS.map((v, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedVariant(i)}
                className="rounded-xl p-4 cursor-pointer transition-all"
                style={{
                  background: CARD,
                  border: `2px solid ${selectedVariant === i ? PRIMARY : BORDER}`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${PRIMARY}15`, color: PRIMARY }}>VARIANT {i + 1}</span>
                  {selectedVariant === i && <CheckCircle2 size={14} style={{ color: GREEN }} />}
                </div>
                <h4 className="text-sm font-bold mb-1.5 leading-snug" style={{ color: DARK_TEXT }}>{v.headline}</h4>
                <p className="text-xs leading-relaxed mb-3" style={{ color: MUTED }}>{v.body}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold" style={{ background: PRIMARY, color: "#fff" }}>{v.cta}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="rounded-lg p-2" style={{ background: "hsl(36,33%,94%)" }}>
                    <p className="text-[10px]" style={{ color: MUTED }}>Predicted CTR</p>
                    <p className="text-sm font-bold" style={{ color: v.ctr >= 4.5 ? GREEN : v.ctr >= 3.5 ? AMBER : MUTED }}>{v.ctr}%</p>
                  </div>
                  <div className="rounded-lg p-2" style={{ background: "hsl(36,33%,94%)" }}>
                    <p className="text-[10px]" style={{ color: MUTED }}>Conv. Score</p>
                    <p className="text-sm font-bold" style={{ color: v.conv >= 4 ? GREEN : v.conv >= 3 ? AMBER : MUTED }}>{v.conv}%</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 rounded-lg text-xs font-medium" style={{ background: PRIMARY, color: "#fff" }}>Use This</button>
                  <button className="flex-1 py-1.5 rounded-lg text-xs font-medium border" style={{ border: `1px solid ${BORDER}`, color: DARK_TEXT }}>Edit</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Performance prediction */}
        <div className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <h4 className="text-xs font-semibold mb-3" style={{ color: DARK_TEXT }}>Performance Prediction — {activeFormat}</h4>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Est. Reach", value: "284K", color: BLUE },
              { label: "Est. CTR", value: "3.8%", color: GREEN },
              { label: "Est. Conversions", value: "847", color: GREEN },
              { label: "Est. CAC", value: "$310", color: AMBER },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-xs mb-1" style={{ color: MUTED }}>{m.label}</p>
                <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: ASSET LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════

type AssetFilter = "All" | "Images" | "Videos" | "Templates" | "Approved" | "Pending";

const ASSET_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4",
  "#f97316", "#84cc16", "#ec4899", "#6366f1", "#14b8a6", "#eab308",
  "#a855f7", "#22c55e", "#0ea5e9", "#d946ef", "#f43f5e", "#fb923c",
  "#2dd4bf", "#a3e635",
];

const ASSETS = [
  // Brand logos
  { name: "Primary Logo (White)", type: "Images", subtype: "Brand Logo", size: "284 KB", date: "Mar 1, 2026", uses: 142, status: "Approved", color: "#3b82f6", icon: "logo" },
  { name: "Primary Logo (Dark)", type: "Images", subtype: "Brand Logo", size: "291 KB", date: "Mar 1, 2026", uses: 98, status: "Approved", color: "#1e40af", icon: "logo" },
  { name: "Logo Horizontal", type: "Images", subtype: "Brand Logo", size: "178 KB", date: "Mar 1, 2026", uses: 76, status: "Approved", color: "#60a5fa", icon: "logo" },
  { name: "Logo Icon Only", type: "Images", subtype: "Brand Logo", size: "64 KB", date: "Mar 1, 2026", uses: 210, status: "Approved", color: "#93c5fd", icon: "logo" },
  // Campaign banners
  { name: "Q2 Hero Banner 1920×600", type: "Images", subtype: "Campaign Banner", size: "842 KB", date: "Apr 10, 2026", uses: 34, status: "Approved", color: "#10b981", icon: "banner" },
  { name: "Q2 Hero Banner 1200×628", type: "Images", subtype: "Campaign Banner", size: "512 KB", date: "Apr 10, 2026", uses: 28, status: "Approved", color: "#059669", icon: "banner" },
  { name: "LinkedIn ABM Banner", type: "Images", subtype: "Campaign Banner", size: "394 KB", date: "Apr 14, 2026", uses: 19, status: "Approved", color: "#0a66c2", icon: "banner" },
  { name: "Google Display 728×90", type: "Images", subtype: "Campaign Banner", size: "156 KB", date: "Apr 16, 2026", uses: 44, status: "Approved", color: "#6ee7b7", icon: "banner" },
  { name: "Meta Carousel Slide 1", type: "Images", subtype: "Campaign Banner", size: "628 KB", date: "Apr 18, 2026", uses: 22, status: "Pending", color: "#34d399", icon: "banner" },
  { name: "Meta Carousel Slide 2", type: "Images", subtype: "Campaign Banner", size: "611 KB", date: "Apr 18, 2026", uses: 22, status: "Pending", color: "#a7f3d0", icon: "banner" },
  // Social templates
  { name: "LinkedIn Quote Card", type: "Templates", subtype: "Social Template", size: "—", date: "Mar 15, 2026", uses: 87, status: "Approved", color: "#8b5cf6", icon: "template" },
  { name: "LinkedIn Stat Card", type: "Templates", subtype: "Social Template", size: "—", date: "Mar 15, 2026", uses: 64, status: "Approved", color: "#7c3aed", icon: "template" },
  { name: "Instagram Story Frame", type: "Templates", subtype: "Social Template", size: "—", date: "Mar 20, 2026", uses: 41, status: "Approved", color: "#a78bfa", icon: "template" },
  { name: "X Thread Header", type: "Templates", subtype: "Social Template", size: "—", date: "Mar 22, 2026", uses: 55, status: "Approved", color: "#c4b5fd", icon: "template" },
  { name: "LinkedIn Carousel", type: "Templates", subtype: "Social Template", size: "—", date: "Apr 2, 2026", uses: 33, status: "Approved", color: "#6d28d9", icon: "template" },
  { name: "Event Announcement", type: "Templates", subtype: "Social Template", size: "—", date: "Apr 5, 2026", uses: 18, status: "Pending", color: "#4c1d95", icon: "template" },
  { name: "Product Feature Grid", type: "Templates", subtype: "Social Template", size: "—", date: "Apr 8, 2026", uses: 27, status: "Approved", color: "#ede9fe", icon: "template" },
  { name: "Case Study Card", type: "Templates", subtype: "Social Template", size: "—", date: "Apr 10, 2026", uses: 15, status: "Pending", color: "#ddd6fe", icon: "template" },
  // Email headers
  { name: "Newsletter Header", type: "Images", subtype: "Email Header", size: "124 KB", date: "Mar 5, 2026", uses: 48, status: "Approved", color: "#f59e0b", icon: "email" },
  { name: "Product Update Header", type: "Images", subtype: "Email Header", size: "98 KB", date: "Mar 8, 2026", uses: 36, status: "Approved", color: "#d97706", icon: "email" },
  { name: "Event Invite Header", type: "Images", subtype: "Email Header", size: "112 KB", date: "Mar 12, 2026", uses: 24, status: "Approved", color: "#fbbf24", icon: "email" },
  { name: "Nurture Email Header", type: "Images", subtype: "Email Header", size: "88 KB", date: "Mar 18, 2026", uses: 19, status: "Pending", color: "#fde68a", icon: "email" },
  // Video thumbnails
  { name: "Webinar Thumbnail", type: "Videos", subtype: "Video Thumbnail", size: "342 KB", date: "Apr 20, 2026", uses: 12, status: "Approved", color: "#ef4444", icon: "video" },
  { name: "YouTube Demo Thumbnail", type: "Videos", subtype: "Video Thumbnail", size: "298 KB", date: "Apr 22, 2026", uses: 8, status: "Approved", color: "#dc2626", icon: "video" },
  { name: "Product Walkthrough Thumb", type: "Videos", subtype: "Video Thumbnail", size: "317 KB", date: "Apr 25, 2026", uses: 6, status: "Pending", color: "#b91c1c", icon: "video" },
];

function AssetIcon({ type }: { type: string }) {
  if (type === "logo") return <Layers size={20} />;
  if (type === "banner") return <MonitorPlay size={20} />;
  if (type === "template") return <LayoutTemplate size={20} />;
  if (type === "email") return <Mail size={20} />;
  if (type === "video") return <Video size={20} />;
  return <ImageIcon size={20} />;
}

function AssetLibraryTab() {
  const [filter, setFilter] = useState<AssetFilter>("All");
  const filters: AssetFilter[] = ["All", "Images", "Videos", "Templates", "Approved", "Pending"];

  const filtered = ASSETS.filter((a) => {
    if (filter === "All") return true;
    if (filter === "Approved" || filter === "Pending") return a.status === filter;
    return a.type === filter;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <Filter size={14} style={{ color: MUTED }} />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: filter === f ? PRIMARY : CARD,
              color: filter === f ? "#fff" : DARK_TEXT,
              border: `1px solid ${filter === f ? PRIMARY : BORDER}`,
            }}
          >
            {f}
            {f === "All" && <span className="ml-1 text-[10px] opacity-70">({ASSETS.length})</span>}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: PRIMARY, color: "#fff" }}>
          <Plus size={12} /> Upload Asset
        </button>
      </div>

      {/* Asset grid */}
      <div className="grid grid-cols-4 gap-3">
        {filtered.map((asset, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="rounded-xl overflow-hidden group"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}
          >
            {/* Thumbnail */}
            <div
              className="h-24 flex items-center justify-center relative"
              style={{ background: `${asset.color}20` }}
            >
              <div style={{ color: asset.color, opacity: 0.7 }}>
                <AssetIcon type={asset.icon} />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-1.5">
                <button className="p-1.5 rounded-lg bg-white/90">
                  <Eye size={12} style={{ color: DARK_TEXT }} />
                </button>
                <button className="p-1.5 rounded-lg bg-white/90">
                  <Download size={12} style={{ color: DARK_TEXT }} />
                </button>
              </div>
              <span
                className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                style={{
                  background: asset.status === "Approved" ? `${GREEN}20` : `${AMBER}20`,
                  color: asset.status === "Approved" ? GREEN : AMBER,
                }}
              >
                {asset.status}
              </span>
            </div>

            {/* Info */}
            <div className="p-2.5">
              <p className="text-xs font-semibold leading-snug mb-0.5 truncate" style={{ color: DARK_TEXT }}>{asset.name}</p>
              <p className="text-[10px] mb-1.5" style={{ color: MUTED }}>{asset.subtype}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px]" style={{ color: MUTED }}>
                  {asset.size !== "—" && <span>{asset.size}</span>}
                  <span>{asset.date}</span>
                </div>
                <div className="flex items-center gap-0.5 text-[10px]" style={{ color: MUTED }}>
                  <Star size={8} />
                  <span>{asset.uses}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "writer", label: "AI Writer", icon: <PenTool size={14} /> },
  { id: "seo", label: "SEO Hub", icon: <Search size={14} /> },
  { id: "social", label: "Social Studio", icon: <Share2 size={14} /> },
  { id: "ads", label: "Ad Creative Studio", icon: <Megaphone size={14} /> },
  { id: "assets", label: "Asset Library", icon: <FolderOpen size={14} /> },
];

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>("writer");

  return (
    <div className="min-h-screen p-6 flex flex-col gap-6" style={{ background: PAGE_BG }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: DARK_TEXT }}>Content Studio</h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>AI-powered content creation, optimization &amp; publishing</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: PRIMARY, color: "#fff" }}>
            <Plus size={14} /> Create Content
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border" style={{ border: `1px solid ${BORDER}`, color: DARK_TEXT, background: CARD }}>
            <Zap size={14} style={{ color: PRIMARY }} /> Batch Generate
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {KPI_DATA.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}`, width: "fit-content" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.id ? PRIMARY : "transparent",
              color: activeTab === tab.id ? "#fff" : MUTED,
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === "writer" && <AIWriterTab />}
          {activeTab === "seo" && <SEOHubTab />}
          {activeTab === "social" && <SocialStudioTab />}
          {activeTab === "ads" && <AdCreativeTab />}
          {activeTab === "assets" && <AssetLibraryTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
