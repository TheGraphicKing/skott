// /Users/navaneethakrishnan/Desktop/skott/app/seo/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Globe,
  Link2,
  Zap,
  Brain,
  BarChart2,
  FileText,
  Send,
  X,
  ArrowRight,
  Search,
  Star,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { MetricCard } from "@/components/shared/MetricCard";
import { AIRecommendations } from "@/components/shared/AIRecommendations";
import { seoData } from "@/data/mock";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Tab = "SEO Rankings" | "AEO Intelligence" | "Link Building";
const TABS: Tab[] = ["SEO Rankings", "AEO Intelligence", "Link Building"];

// ─── Organic traffic trend chart data ─────────────────────────────────────────
const organicTrendData = [
  { week: "W1 Jan", clicks: 8200 },
  { week: "W2 Jan", clicks: 8800 },
  { week: "W3 Jan", clicks: 9100 },
  { week: "W4 Jan", clicks: 9400 },
  { week: "W1 Feb", clicks: 9700 },
  { week: "W2 Feb", clicks: 10200 },
  { week: "W3 Feb", clicks: 10800 },
  { week: "W4 Feb", clicks: 11200 },
  { week: "W1 Mar", clicks: 11600 },
  { week: "W2 Mar", clicks: 12000 },
  { week: "W3 Mar", clicks: 11800 },
  { week: "W4 Mar", clicks: 12400 },
];

// ─── AEO data ─────────────────────────────────────────────────────────────────
const aeoCitations = [
  { engine: "ChatGPT",    count: 31, icon: "🤖", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  { engine: "Perplexity", count: 27, icon: "🔮", color: "text-purple-700",  bg: "bg-purple-50",  border: "border-purple-200" },
  { engine: "Gemini",     count: 18, icon: "✨", color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200"  },
];

const citedExamples = [
  { query: "What is the best agentic AI platform for enterprises?", snippet: "Lyzr's AgenticOS is widely referenced as a leading platform for building production-ready AI agents without ML expertise…", engine: "ChatGPT" },
  { query: "Top no-code AI agent builders in 2025", snippet: "Among the leading solutions, Lyzr stands out for its enterprise focus and rapid deployment capabilities…", engine: "Perplexity" },
  { query: "LLM orchestration tools comparison", snippet: "Lyzr's platform offers a comprehensive orchestration layer that rivals established players like LangChain…", engine: "Gemini" },
];

const aeoGapExamples = [
  { query: "AI automation for financial services",          competitor: "Moveworks", rank: 1 },
  { query: "Enterprise AI agent deployment best practices", competitor: "Cognigy",   rank: 2 },
  { query: "Workflow automation with LLMs",                competitor: "UiPath AI",  rank: 1 },
  { query: "Autonomous AI agents for IT operations",       competitor: "ServiceNow", rank: 1 },
];

// ─── Content quality scorer data ──────────────────────────────────────────────
const contentScores = [
  { title: "The Enterprise AI Agent Buyer's Guide 2025",               score: 94, url: "/blog/enterprise-ai-guide", issues: 0  },
  { title: "How to Build Production-Ready AI Agents Without ML",       score: 78, url: "/blog/no-ml-ai-agents",    issues: 3  },
  { title: "AgenticOS vs. Traditional Automation: ROI Calculator",    score: 61, url: "/blog/agenticos-vs-rpa",   issues: 7  },
];

// ─── Tier config ───────────────────────────────────────────────────────────────
const TIER_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  T1: { bg: "bg-[hsl(142,71%,45%)]/10", text: "text-[hsl(142,71%,35%)]", border: "border-[hsl(142,71%,45%)]/20" },
  T2: { bg: "bg-amber-50",              text: "text-amber-700",           border: "border-amber-200" },
  T3: { bg: "bg-[hsl(0,84%,60%)]/10",  text: "text-[hsl(0,84%,50%)]",   border: "border-[hsl(0,84%,60%)]/20" },
};

// ─── Alert bar ─────────────────────────────────────────────────────────────────
const alerts = [
  { type: "warning", icon: <AlertTriangle size={13} />, text: "AEO gap detected: Lyzr not cited for 'AI automation for financial services' — competitor Moveworks ranked #1" },
  { type: "info",    icon: <TrendingUp size={13} />,    text: "CTR optimization opportunity: 'agentic AI platform' at position 7 with 4.1% CTR — title tag test recommended" },
  { type: "success", icon: <CheckCircle2 size={13} />,  text: "2 Tier-1 link building drafts ready for review — techblog.io (DA 42) and aiinsider.com (DA 35)" },
];

const ALERT_CONFIG: Record<string, { bg: string; text: string; border: string; iconColor: string }> = {
  warning: { bg: "bg-amber-50",                 text: "text-amber-800",           border: "border-amber-200",              iconColor: "text-amber-600" },
  info:    { bg: "bg-blue-50",                  text: "text-blue-800",            border: "border-blue-200",               iconColor: "text-blue-600" },
  success: { bg: "bg-[hsl(142,71%,45%)]/8",    text: "text-[hsl(142,71%,28%)]", border: "border-[hsl(142,71%,45%)]/20",  iconColor: "text-[hsl(142,71%,35%)]" },
};

// ─── Position badge ────────────────────────────────────────────────────────────
function PositionBadge({ pos }: { pos: number }) {
  const color =
    pos <= 10 ? "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,30%)]"
    : pos <= 20 ? "bg-amber-50 text-amber-700"
    : "bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,50%)]";
  return (
    <span className={cn("inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-[700]", color)}>
      {pos}
    </span>
  );
}

// ─── Score bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color = score >= 85 ? "bg-[hsl(142,71%,45%)]" : score >= 65 ? "bg-[hsl(38,92%,50%)]" : "bg-[hsl(0,84%,60%)]";
  const textColor = score >= 85 ? "text-[hsl(142,71%,35%)]" : score >= 65 ? "text-amber-700" : "text-[hsl(0,84%,50%)]";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-[hsl(30,15%,88%)]">
        <div className={cn("h-2 rounded-full transition-all", color)} style={{ width: `${score}%` }} />
      </div>
      <span className={cn("text-sm font-[700] w-8 text-right", textColor)}>{score}</span>
    </div>
  );
}

// ─── Custom tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[hsl(30,15%,85%)] rounded-xl px-3 py-2 shadow-md text-xs">
      <p className="text-[hsl(25,20%,50%)] mb-1">{label}</p>
      <p className="font-[700] text-[hsl(25,40%,18%)]">{payload[0].value.toLocaleString()} clicks</p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function SEOPage() {
  const [activeTab, setActiveTab] = useState<Tab>("SEO Rankings");
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);
  const [generatingBriefs, setGeneratingBriefs] = useState<Record<number, boolean>>({});
  const [sentEmails, setSentEmails] = useState<Record<string, boolean>>({});
  const [declinedEmails, setDeclinedEmails] = useState<Record<string, boolean>>({});

  const visibleAlerts = alerts.filter((_, i) => !dismissedAlerts.includes(i));

  async function handleGenerateBrief(idx: number) {
    setGeneratingBriefs((p) => ({ ...p, [idx]: true }));
    await new Promise((r) => setTimeout(r, 1500));
    setGeneratingBriefs((p) => ({ ...p, [idx]: false }));
  }

  return (
    <div className="min-h-screen bg-[hsl(36,30%,98%)] p-6 space-y-5">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-3xl font-[700] text-[hsl(25,40%,18%)]">SEO / AEO / GEO</h1>
            <AgentStatusBadge status="active" />
          </div>
          <p className="text-[hsl(25,20%,45%)] text-sm">SEO Intelligence Agent · 12 runs today · Last: 7m ago</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-sm font-[600] hover:bg-[hsl(25,62%,20%)] transition-all">
            <Search size={14} />
            Run SEO Audit
          </button>
        </div>
      </div>

      {/* ── Alert Bar ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {visibleAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {alerts.map((alert, i) => {
              if (dismissedAlerts.includes(i)) return null;
              const cfg = ALERT_CONFIG[alert.type];
              return (
                <motion.div
                  key={i}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-[0.75rem] border text-sm",
                    cfg.bg, cfg.border
                  )}
                >
                  <span className={cfg.iconColor}>{alert.icon}</span>
                  <span className={cn("flex-1", cfg.text)}>{alert.text}</span>
                  <button
                    onClick={() => setDismissedAlerts((p) => [...p, i])}
                    className={cn("shrink-0 hover:opacity-70 transition-opacity", cfg.iconColor)}
                  >
                    <X size={13} />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Metrics ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard label="Organic Clicks" value="12.4K" sub="Weekly" trend={+4.1} />
        <MetricCard label="Avg Position"   value="18.4"  sub="All keywords" />
        <MetricCard
          label="Domain Health"
          value="84/100"
          sub="Good — improving"
          trend={+3}
        />
        <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)]">
          <p className="text-[11px] uppercase tracking-widest font-[500] mb-3 text-[hsl(25,20%,45%)]">AEO Cited</p>
          <p className="font-serif text-3xl font-[600] tracking-tight text-[hsl(142,71%,35%)]">76</p>
          <p className="text-xs mt-1 text-[hsl(25,20%,50%)]">pages cited by AI</p>
        </div>
        <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)]">
          <p className="text-[11px] uppercase tracking-widest font-[500] mb-3 text-[hsl(25,20%,45%)]">AEO Gaps</p>
          <p className="font-serif text-3xl font-[600] tracking-tight text-amber-600">14</p>
          <p className="text-xs mt-1 text-amber-600/80">queries — competitor cited</p>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-[0.75rem] p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-[500] transition-all",
              activeTab === tab
                ? "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)]"
                : "text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* ===== SEO Rankings ===== */}
        {activeTab === "SEO Rankings" && (
          <motion.div
            key="seo"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Keyword table */}
            <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[hsl(30,15%,85%)]">
                <h3 className="font-serif text-base font-[600] text-[hsl(25,40%,18%)]">Top Keywords</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[hsl(36,30%,93%)]">
                      {["Keyword", "Position", "Change", "Clicks", "Impressions", "CTR"].map((col) => (
                        <th key={col} className="text-left px-5 py-3 text-[11px] uppercase tracking-widest text-[hsl(25,20%,45%)] font-[500] whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {seoData.topKeywords.map((kw, i) => {
                      const ctr = ((kw.clicks / kw.impressions) * 100).toFixed(1);
                      const positive = kw.change > 0;
                      return (
                        <motion.tr
                          key={kw.keyword}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-t border-[hsl(30,15%,88%)] hover:bg-[hsl(36,30%,93%)] transition-colors"
                        >
                          <td className="px-5 py-3.5 font-[500] text-[hsl(25,40%,18%)]">{kw.keyword}</td>
                          <td className="px-5 py-3.5"><PositionBadge pos={kw.position} /></td>
                          <td className="px-5 py-3.5">
                            <span className={cn(
                              "flex items-center gap-0.5 text-xs font-[600]",
                              kw.change === 0 ? "text-[hsl(25,20%,50%)]" : positive ? "text-[hsl(142,71%,35%)]" : "text-[hsl(0,84%,50%)]"
                            )}>
                              {kw.change > 0 ? <ChevronUp size={13} /> : kw.change < 0 ? <ChevronDown size={13} /> : null}
                              {kw.change > 0 ? `+${kw.change}` : kw.change}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[hsl(25,40%,18%)] font-[500]">{kw.clicks.toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-[hsl(25,20%,50%)]">{kw.impressions.toLocaleString()}</td>
                          <td className="px-5 py-3.5">
                            <span className={cn(
                              "font-[600]",
                              parseFloat(ctr) >= 5 ? "text-[hsl(142,71%,35%)]" : parseFloat(ctr) >= 3 ? "text-amber-600" : "text-[hsl(25,20%,50%)]"
                            )}>
                              {ctr}%
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Organic Traffic Chart */}
            <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-base font-[600] text-[hsl(25,40%,18%)]">Organic Traffic Trend</h3>
                  <p className="text-[11px] text-[hsl(25,20%,50%)] mt-0.5">Weekly clicks · Jan – Mar 2025</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-[600] text-[hsl(142,71%,35%)]">
                  <TrendingUp size={13} /> +51.2% since Jan
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={organicTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" vertical={false} />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: "hsl(25,20%,55%)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(25,20%,55%)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="hsl(25,62%,25%)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "hsl(25,62%,25%)", strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* ===== AEO Intelligence ===== */}
        {activeTab === "AEO Intelligence" && (
          <motion.div
            key="aeo"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* AEO engine strip */}
            <div className="flex items-center gap-3">
              {aeoCitations.map((e) => (
                <div key={e.engine} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-[0.75rem] border", e.bg, e.border)}>
                  <span className="text-lg">{e.icon}</span>
                  <div>
                    <p className={cn("text-xs font-[500]", e.color)}>{e.engine}</p>
                    <p className={cn("text-xl font-[700] font-serif leading-tight", e.color)}>{e.count}</p>
                  </div>
                  <p className="text-[10px] text-[hsl(25,20%,55%)] ml-1">citations</p>
                </div>
              ))}
              <div className="flex-1" />
              <div className="text-right">
                <p className="text-[11px] text-[hsl(25,20%,50%)]">Total pages cited</p>
                <p className="font-serif text-2xl font-[700] text-[hsl(142,71%,35%)]">263</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Lyzr IS Cited */}
              <div className="rounded-[0.75rem] border border-[hsl(142,71%,45%)]/25 bg-[hsl(36,30%,96%)] overflow-hidden">
                <div className="px-5 py-3.5 bg-[hsl(142,71%,45%)]/10 border-b border-[hsl(142,71%,45%)]/20 flex items-center justify-between">
                  <h3 className="font-serif text-base font-[600] text-[hsl(142,71%,28%)]">
                    Lyzr IS Cited
                  </h3>
                  <span className="text-[hsl(142,71%,35%)] font-[700] text-sm">76 queries</span>
                </div>
                <div className="p-4 space-y-3">
                  {citedExamples.map((ex, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-3 rounded-xl border border-[hsl(142,71%,45%)]/15 bg-[hsl(142,71%,45%)]/5"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-xs font-[600] text-[hsl(25,40%,18%)] leading-snug">"{ex.query}"</p>
                        <span className="text-[10px] text-[hsl(142,71%,35%)] font-[500] shrink-0 bg-[hsl(142,71%,45%)]/15 px-1.5 py-0.5 rounded-full">{ex.engine}</span>
                      </div>
                      <p className="text-[11px] text-[hsl(25,20%,50%)] leading-relaxed line-clamp-2">{ex.snippet}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Lyzr NOT Cited (gaps) */}
              <div className="rounded-[0.75rem] border border-amber-200 bg-[hsl(36,30%,96%)] overflow-hidden">
                <div className="px-5 py-3.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
                  <h3 className="font-serif text-base font-[600] text-amber-800">
                    Lyzr NOT Cited — Gaps
                  </h3>
                  <span className="text-amber-700 font-[700] text-sm">14 queries</span>
                </div>
                <div className="p-4 space-y-3">
                  {aeoGapExamples.map((gap, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="p-3 rounded-xl border border-amber-200 bg-amber-50/60 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-[600] text-[hsl(25,40%,18%)] leading-snug mb-1">"{gap.query}"</p>
                        <p className="text-[11px] text-amber-700">
                          Competitor cited: <span className="font-[600]">{gap.competitor}</span>
                          {" "}(Rank #{gap.rank})
                        </p>
                      </div>
                      <button
                        onClick={() => handleGenerateBrief(i)}
                        disabled={generatingBriefs[i]}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-[600] transition-all shrink-0 border",
                          generatingBriefs[i]
                            ? "bg-amber-100 text-amber-500 border-amber-200 cursor-wait"
                            : "bg-amber-600 text-white border-amber-600 hover:bg-amber-700"
                        )}
                      >
                        {generatingBriefs[i] ? (
                          <span className="w-3 h-3 rounded-full border border-amber-300 border-t-amber-600 animate-spin" />
                        ) : (
                          <FileText size={11} />
                        )}
                        {generatingBriefs[i] ? "…" : "Generate Brief"}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== Link Building ===== */}
        {activeTab === "Link Building" && (
          <motion.div
            key="links"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Email queue */}
            <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[hsl(30,15%,85%)] flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-[600] text-[hsl(25,40%,18%)]">Link Building Email Queue</h3>
                  <p className="text-[11px] text-[hsl(25,20%,50%)] mt-0.5">Classified by SEO Intelligence Agent</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[hsl(25,20%,50%)]">
                  <span className="px-2 py-0.5 rounded-full bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,35%)] font-[500]">T1 = DA &gt;30 · AI niche</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-[500] border border-amber-200">T2 = DA 15–30</span>
                  <span className="px-2 py-0.5 rounded-full bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,50%)] font-[500]">T3 = Spam</span>
                </div>
              </div>

              <div className="divide-y divide-[hsl(30,15%,88%)]">
                {seoData.linkBuildingEmails.map((email) => {
                  const tierCfg = TIER_CONFIG[email.tier];
                  const isSent = sentEmails[email.id];
                  const isDeclined = declinedEmails[email.id];
                  return (
                    <motion.div
                      key={email.id}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: isDeclined ? 0.4 : 1 }}
                      className="px-5 py-4 flex items-center gap-4"
                    >
                      {/* Tier badge */}
                      <span className={cn(
                        "inline-flex items-center justify-center w-10 h-10 rounded-full text-xs font-[700] border shrink-0",
                        tierCfg.bg, tierCfg.text, tierCfg.border
                      )}>
                        {email.tier}
                      </span>

                      {/* Email info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-[600] text-[hsl(25,40%,18%)] truncate">{email.subject}</p>
                          <span className="text-[11px] text-[hsl(25,20%,55%)] shrink-0">DA {email.da}</span>
                        </div>
                        <p className="text-[11px] text-[hsl(25,20%,55%)] truncate">
                          {email.from} · {email.preview}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isSent ? (
                          <span className="flex items-center gap-1 text-[11px] text-[hsl(142,71%,35%)] font-[600]">
                            <CheckCircle2 size={13} /> Draft Sent
                          </span>
                        ) : isDeclined ? (
                          <span className="text-[11px] text-[hsl(25,20%,50%)]">Declined</span>
                        ) : (
                          <>
                            {email.status !== "spam" && (
                              <button
                                onClick={() => setSentEmails((p) => ({ ...p, [email.id]: true }))}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-[11px] font-[600] hover:bg-[hsl(25,62%,20%)] transition-all"
                              >
                                <Send size={11} />
                                Send Draft
                              </button>
                            )}
                            <button
                              onClick={() => setDeclinedEmails((p) => ({ ...p, [email.id]: true }))}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[hsl(30,15%,85%)] text-[hsl(25,20%,50%)] text-[11px] font-[500] hover:border-[hsl(0,84%,60%)]/40 hover:text-[hsl(0,84%,50%)] transition-all"
                            >
                              <X size={11} />
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Content Quality Scorer */}
            <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-base font-[600] text-[hsl(25,40%,18%)]">Content Quality Scorer</h3>
                  <p className="text-[11px] text-[hsl(25,20%,50%)] mt-0.5">SEO Intelligence Agent · 2 posts scored today</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[hsl(25,20%,55%)]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[hsl(142,71%,45%)]" /> 85+ Good</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[hsl(38,92%,50%)]" /> 65–84 Fair</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[hsl(0,84%,60%)]" /> &lt;65 Needs work</span>
                </div>
              </div>

              <div className="space-y-4">
                {contentScores.map((post, i) => (
                  <motion.div
                    key={post.url}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl border border-[hsl(30,15%,85%)] bg-white/50"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-[600] text-[hsl(25,40%,18%)] leading-snug">{post.title}</p>
                        <p className="text-[11px] text-[hsl(25,20%,55%)] mt-0.5">{post.url}</p>
                      </div>
                      {post.issues > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                          <AlertTriangle size={10} />
                          {post.issues} issues
                        </span>
                      )}
                    </div>
                    <ScoreBar score={post.score} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AIRecommendations page="seo" />
    </div>
  );
}
