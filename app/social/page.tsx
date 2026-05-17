"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, TrendingUp, Activity, Eye,
  Plus, Edit, Trash2, Heart, MessageCircle,
  Repeat2, Share2, Clock, CheckCircle,
  AlertCircle, RefreshCw, Download, Filter,
  ArrowUp, BarChart3, Sparkles, X as XIcon,
  MessageSquare, Send, ThumbsUp, Minus, AlertTriangle,
  ToggleLeft, ToggleRight, ChevronDown, ChevronRight,
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const PRIMARY   = "hsl(25,62%,25%)";
const MUTED     = "hsl(25,20%,50%)";
const CARD      = "hsl(36,30%,97%)";
const BORDER    = "hsl(30,15%,87%)";
const PAGE_BG   = "hsl(36,33%,94%)";
const GREEN     = "hsl(142,55%,35%)";
const RED       = "#dc2626";
const AMBER     = "#d97706";
const BLUE      = "#2563eb";
const DARK_TEXT = "#3a1f0e";

const TABS = ["Overview", "Publishing Queue", "Content Performance", "Engagement Inbox", "Social Listening"];

// ─── Overview Data ────────────────────────────────────────────────────────────
const overviewKpis = [
  { label: "Total Followers",    value: "24.8K", icon: Users,     color: PRIMARY, sub: "across all channels" },
  { label: "Posts This Month",   value: "42",    icon: Share2,    color: BLUE,   sub: "published posts" },
  { label: "Avg Engagement",     value: "3.8%",  icon: Activity,  color: GREEN,  sub: "engagement rate" },
  { label: "Reach",              value: "128K",  icon: Eye,       color: AMBER,  sub: "total impressions" },
];

const channelCards = [
  { name: "LinkedIn",  followers: "18.4K", eng: "4.2%", viewRate: null, sub: "Top performing channel", color: "#0077b5", badge: "LinkedIn" },
  { name: "Twitter/X", followers: "4,200", eng: "2.8%", viewRate: null, sub: "2nd largest audience",  color: "#14171a", badge: "X" },
  { name: "YouTube",   followers: "1,840", eng: null,   viewRate: "6.1%", sub: "6.1% view rate",      color: "#ff0000", badge: "YT" },
  { name: "Instagram", followers: "380",   eng: "3.2%", viewRate: null, sub: "Growing channel",       color: "#c13584", badge: "IG" },
];

// ─── Publishing Queue Data ────────────────────────────────────────────────────
const publishingQueue = [
  { date: "May 14, 09:00 AM", platform: "LinkedIn", preview: "How Lyzr's AgenticOS is redefining enterprise AI workflows in 2025", status: "Scheduled" },
  { date: "May 14, 02:00 PM", platform: "Twitter",  preview: "🚀 Just hit 18K followers on LinkedIn! Thank you for your support —", status: "Scheduled" },
  { date: "May 15, 10:00 AM", platform: "LinkedIn", preview: "Case Study: How Verifone reduced hiring costs by 34% using Lyzr HR", status: "Draft" },
  { date: "May 15, 03:00 PM", platform: "YouTube",  preview: "Lyzr AI Demo: Building an autonomous research agent in 10 minutes", status: "Scheduled" },
  { date: "May 16, 09:30 AM", platform: "LinkedIn", preview: "The CMO's guide to AI-native marketing operations — what we learned", status: "Scheduled" },
  { date: "May 17, 11:00 AM", platform: "Twitter",  preview: "Thread: 5 metrics every CMO should track in their AI-powered stack", status: "Draft" },
  { date: "May 18, 09:00 AM", platform: "LinkedIn", preview: "Announcing Lyzr's Series A — building the future of agentic enterprise", status: "Scheduled" },
  { date: "May 20, 02:00 PM", platform: "Instagram",preview: "Behind the scenes at Lyzr HQ — meet the team building tomorrow's AI", status: "Draft" },
];

// ─── Content Performance Data ─────────────────────────────────────────────────
const topPosts = [
  { platform: "LinkedIn", snippet: "How Lyzr AI helped Verifone reduce CAC by 34%",             likes: 284, comments: 47, shares: 89, reach: "12,400", eng: "3.4%", date: "May 8" },
  { platform: "LinkedIn", snippet: "Why every enterprise needs an AI-native CMO OS in 2025",    likes: 198, comments: 31, shares: 67, reach: "9,800",  eng: "3.0%", date: "May 3" },
  { platform: "YouTube",  snippet: "Lyzr Platform Demo: Agentic Research in 5 Min",              likes: 156, comments: 28, shares: 44, reach: "8,200",  eng: "2.9%", date: "May 6" },
  { platform: "LinkedIn", snippet: "Series A announcement — what's next for Lyzr AI",            likes: 312, comments: 58, shares: 112,reach: "16,100", eng: "3.0%", date: "May 1" },
  { platform: "Twitter",  snippet: "Thread: AI agents are replacing marketing dashboards. Here", likes: 89,  comments: 14, shares: 203,reach: "7,400",  eng: "4.1%", date: "May 10" },
  { platform: "LinkedIn", snippet: "BFSI enterprises are adopting AI agents 3x faster than",    likes: 147, comments: 22, shares: 38, reach: "6,900",  eng: "3.0%", date: "May 5" },
  { platform: "YouTube",  snippet: "Full Demo: Building a Sales Agent with Lyzr in 20 Minutes", likes: 98,  comments: 19, shares: 31, reach: "5,600",  eng: "2.6%", date: "May 11" },
  { platform: "Instagram",snippet: "The Lyzr team — 40 people, 6 countries, one mission",       likes: 204, comments: 38, shares: 12, reach: "4,200",  eng: "6.1%", date: "May 7" },
  { platform: "LinkedIn", snippet: "What does an AI-native marketing team look like? We asked",  likes: 118, comments: 18, shares: 29, reach: "5,100",  eng: "3.2%", date: "May 9" },
  { platform: "Twitter",  snippet: "Hot take: Most 'AI marketing tools' are just GPT wrappers.", likes: 67,  comments: 42, shares: 188,reach: "6,800",  eng: "4.4%", date: "May 12" },
];

// ─── Social Listening Data ────────────────────────────────────────────────────
const mentions = [
  { platform: "LinkedIn", author: "Sarah Chen, VP Marketing",    content: "Lyzr AI just changed how our team runs campaign analytics — genuinely impressive agentic stack", sentiment: "Positive", time: "2h ago" },
  { platform: "Twitter",  author: "@techmarketer_jay",            content: "@lyzr_ai your CMO OS demo blew my mind. When's the enterprise plan launching?",               sentiment: "Positive", time: "3h ago" },
  { platform: "LinkedIn", author: "Rahul Mehta, CTO @ FinScale", content: "Evaluating Lyzr AI vs. alternatives. Anyone have experience with their BFSI-specific agents?", sentiment: "Neutral",  time: "4h ago" },
  { platform: "Twitter",  author: "@ai_skeptic_bob",              content: "Not sure Lyzr AI is ready for enterprise scale yet. Would love to see more case studies.",      sentiment: "Neutral",  time: "5h ago" },
  { platform: "LinkedIn", author: "Priya Nair, CMO @ Verifone",  content: "Working with Lyzr AI has been transformative for our HR and marketing ops. Highly recommend.",  sentiment: "Positive", time: "6h ago" },
  { platform: "Twitter",  author: "@marketinggeek_88",            content: "Lyzr AI's research agent saves our team 6 hours a week. Absolute game changer 🔥",             sentiment: "Positive", time: "7h ago" },
  { platform: "LinkedIn", author: "Tom Wu, Partner @ VentureXYZ", content: "Keep an eye on @lyzr_ai — their agentic OS approach is genuinely differentiated in the market.", sentiment: "Positive", time: "8h ago" },
  { platform: "Twitter",  author: "@skeptical_cto",               content: "Lyzr AI pricing is a bit steep for SMBs. Hope they introduce a startup tier.",                  sentiment: "Negative", time: "9h ago" },
  { platform: "LinkedIn", author: "Ana Lima, RevOps Lead",        content: "Had a product demo with Lyzr AI today. Solid tool, but integrations with existing CRM need work.", sentiment: "Neutral", time: "10h ago" },
  { platform: "Twitter",  author: "@enterpriseai_fan",            content: "Lyzr AI's Series A is huge news. Following their journey closely #AI #agenticOS",              sentiment: "Positive", time: "11h ago" },
  { platform: "LinkedIn", author: "Mark Davies, Sales Director",  content: "The Lyzr AI sales agent handles objections better than most SDRs I've worked with. Impressive.", sentiment: "Positive", time: "12h ago" },
  { platform: "Twitter",  author: "@aifuturist_x",               content: "Every enterprise CMO should look at Lyzr AI's OS. This is where the market is heading.",         sentiment: "Positive", time: "14h ago" },
  { platform: "LinkedIn", author: "Lisa Park, Growth Lead",       content: "Lyzr AI vs Relevance AI — anyone done a head-to-head? Would love to hear real experiences.",     sentiment: "Neutral",  time: "15h ago" },
  { platform: "Twitter",  author: "@saas_critic",                 content: "Another AI startup claiming to revolutionize marketing. Results speak louder than demos, Lyzr.", sentiment: "Negative", time: "16h ago" },
  { platform: "LinkedIn", author: "Kavya Reddy, Product Manager", content: "Just saw Lyzr AI's latest content agent demo — the quality of outputs was genuinely great.",     sentiment: "Positive", time: "18h ago" },
];

const keywords = [
  { word: "AgenticOS", size: 22 }, { word: "AI marketing", size: 18 }, { word: "enterprise AI", size: 16 },
  { word: "BFSI", size: 14 }, { word: "CMO OS", size: 20 }, { word: "AI agents", size: 17 },
  { word: "automation", size: 13 }, { word: "Series A", size: 15 }, { word: "Lyzr platform", size: 19 },
  { word: "revenue", size: 12 }, { word: "pipeline", size: 13 }, { word: "agentic", size: 16 },
];

// ─── Helper Components ────────────────────────────────────────────────────────
function PlatformBadge({ platform }: { platform: string }) {
  const map: Record<string, string> = { LinkedIn: "#0077b5", Twitter: "#14171a", YouTube: "#ff0000", Instagram: "#c13584", X: "#14171a" };
  const c = map[platform] ?? MUTED;
  return (
    <span style={{ padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600, background: c + "18", color: c }}>
      {platform}
    </span>
  );
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Positive: { bg: "hsl(142,55%,90%)", color: GREEN },
    Neutral:  { bg: "hsl(36,30%,90%)",  color: AMBER },
    Negative: { bg: "#fee2e2",           color: RED },
  };
  const style = map[sentiment] ?? { bg: BORDER, color: MUTED };
  return (
    <span style={{ padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600, background: style.bg, color: style.color }}>
      {sentiment}
    </span>
  );
}

function PostStatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; icon: React.ElementType }> = {
    Scheduled: { bg: "hsl(213,90%,93%)", color: BLUE,  icon: Clock },
    Draft:     { bg: "hsl(36,30%,90%)",  color: AMBER, icon: Edit },
    Published: { bg: "hsl(142,55%,90%)", color: GREEN, icon: CheckCircle },
  };
  const s = map[status] ?? { bg: BORDER, color: MUTED, icon: Clock };
  const Icon = s.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
      <Icon size={11} /> {status}
    </span>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {overviewKpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 24px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 13, color: MUTED, marginBottom: 6 }}>{k.label}</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: DARK_TEXT }}>{k.value}</p>
                <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{k.sub}</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: k.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <k.icon size={20} color={k.color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Channel Cards */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 14 }}>Channel Performance</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {channelCards.map((ch, i) => (
            <motion.div
              key={ch.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.07 }}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20, position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: ch.color }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, marginTop: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: ch.color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: ch.color }}>{ch.badge}</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>{ch.name}</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: DARK_TEXT, marginBottom: 4 }}>{ch.followers}</p>
              <p style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>followers / subscribers</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 11, color: MUTED }}>Engagement</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: ch.eng ? GREEN : MUTED }}>
                    {ch.eng ?? ch.viewRate}
                  </p>
                </div>
                <span style={{ fontSize: 11, color: MUTED, textAlign: "right", maxWidth: 80 }}>{ch.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Publishing Queue Tab ─────────────────────────────────────────────────────
function PublishingQueueTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT }}>Publishing Queue</h3>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>8 posts scheduled for the next 7 days</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: MUTED, cursor: "pointer" }}>
            <Filter size={14} /> Filter
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: PRIMARY, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Plus size={14} /> Schedule Post
          </button>
        </div>
      </div>

      {/* Queue List */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: PAGE_BG }}>
              {["Date & Time", "Platform", "Content Preview", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: MUTED }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {publishingQueue.map((post, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 1 ? PAGE_BG + "50" : "transparent" }}
              >
                <td style={{ padding: "14px 20px", fontSize: 13, color: DARK_TEXT, fontWeight: 500, whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={13} color={MUTED} />
                    {post.date}
                  </div>
                </td>
                <td style={{ padding: "14px 20px" }}><PlatformBadge platform={post.platform} /></td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: MUTED, maxWidth: 320 }}>
                  <span style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.preview.slice(0, 62)}{post.preview.length > 62 ? "…" : ""}
                  </span>
                </td>
                <td style={{ padding: "14px 20px" }}><PostStatusBadge status={post.status} /></td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${BORDER}`, background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Edit size={13} color={MUTED} />
                    </button>
                    <button style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${BORDER}`, background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trash2 size={13} color={RED} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Content Performance Tab ──────────────────────────────────────────────────
function ContentPerformanceTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT }}>Top Posts by Engagement</h3>
          <p style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>Top 10 posts this month</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: MUTED, cursor: "pointer" }}>
          <Download size={14} /> Export
        </button>
      </div>

      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ background: PAGE_BG }}>
                {["Platform", "Post Preview", "Likes", "Comments", "Shares", "Reach", "Eng %", "Date"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: MUTED, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topPosts.map((post, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 1 ? PAGE_BG + "50" : "transparent" }}
                >
                  <td style={{ padding: "14px 16px" }}><PlatformBadge platform={post.platform} /></td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: DARK_TEXT, maxWidth: 260 }}>
                    {post.snippet.slice(0, 52)}{post.snippet.length > 52 ? "…" : ""}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, color: RED }}>
                      <Heart size={13} /> {post.likes}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: BLUE }}>
                      <MessageCircle size={13} /> {post.comments}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: GREEN }}>
                      <Repeat2 size={13} /> {post.shares}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: DARK_TEXT, fontWeight: 600 }}>{post.reach}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: parseFloat(post.eng) >= 4 ? GREEN : parseFloat(post.eng) >= 3 ? AMBER : MUTED }}>
                      {post.eng}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: MUTED }}>{post.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Social Listening Tab ─────────────────────────────────────────────────────
function SocialListeningTab() {
  const [filter, setFilter] = useState<"All" | "Positive" | "Neutral" | "Negative">("All");

  const filtered = filter === "All" ? mentions : mentions.filter(m => m.sentiment === filter);

  const sentimentCounts = {
    Positive: mentions.filter(m => m.sentiment === "Positive").length,
    Neutral:  mentions.filter(m => m.sentiment === "Neutral").length,
    Negative: mentions.filter(m => m.sentiment === "Negative").length,
  };
  const total = mentions.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Sentiment Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Sentiment Breakdown</h3>
          <div style={{ display: "flex", gap: 20 }}>
            {(["Positive", "Neutral", "Negative"] as const).map(s => {
              const pct = Math.round((sentimentCounts[s] / total) * 100);
              const colorMap = { Positive: GREEN, Neutral: AMBER, Negative: RED };
              const c = colorMap[s];
              return (
                <div key={s} style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: MUTED }}>{s}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: c }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: BORDER, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      style={{ height: "100%", borderRadius: 4, background: c }}
                    />
                  </div>
                  <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{sentimentCounts[s]} mentions</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Keyword Cloud */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, marginBottom: 14 }}>Top Keywords</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {keywords.map(k => (
              <span
                key={k.word}
                style={{
                  fontSize: Math.max(10, k.size - 4), fontWeight: k.size >= 18 ? 700 : 500,
                  color: PRIMARY, opacity: 0.5 + (k.size / 22) * 0.5,
                  padding: "2px 6px", borderRadius: 4,
                  background: PRIMARY + "12",
                }}
              >
                {k.word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mentions Feed */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>Mentions Feed</h3>
            <p style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Tracking "Lyzr AI" and "@lyzr_ai" across platforms</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["All", "Positive", "Neutral", "Negative"] as const).map(f => {
              const colorMap = { All: PRIMARY, Positive: GREEN, Neutral: AMBER, Negative: RED };
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    border: `1px solid ${isActive ? colorMap[f] : BORDER}`,
                    background: isActive ? colorMap[f] + "15" : "white",
                    color: isActive ? colorMap[f] : MUTED,
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ maxHeight: 480, overflowY: "auto" }}>
          {filtered.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{
                padding: "16px 24px",
                borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
                display: "flex", alignItems: "flex-start", gap: 14,
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: PRIMARY + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY }}>
                  {m.author[0]}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT }}>{m.author}</span>
                    <PlatformBadge platform={m.platform} />
                    <SentimentBadge sentiment={m.sentiment} />
                  </div>
                  <span style={{ fontSize: 11, color: MUTED, flexShrink: 0, marginLeft: 12 }}>{m.time}</span>
                </div>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{m.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AI Composer Modal ────────────────────────────────────────────────────────
const PLATFORM_SAMPLES: Record<string, string> = {
  LinkedIn:
    "🚀 The autonomous CMO office isn't coming — it's here. Lyzr's AgenticOS is helping enterprise marketing teams run campaigns 24/7 without manual intervention. Here's what we've learned after 200+ deployments 👇\n\n1. AI agents reduce CAC by an average of 34%\n2. Content output increases 5× with 60% smaller teams\n3. Pipeline attribution accuracy jumps to 94%\n\nTag a CMO who needs to see this. 💬",
  "X / Twitter":
    "Thread 🧵: AI agents are quietly replacing marketing dashboards. Here's what the best CMOs are doing instead →",
  Instagram:
    "Behind every great marketing result is an AI agent working 24/7. 🤖 Meet the team behind the scenes at Lyzr HQ.",
  YouTube:
    "NEW: How we cut CAC by 34% with autonomous campaign management (full platform walkthrough)",
};

const PLATFORM_LIMITS: Record<string, number> = {
  LinkedIn: 700,
  "X / Twitter": 280,
  Instagram: 2200,
  YouTube: 5000,
};

function AIComposerModal({ onClose }: { onClose: () => void }) {
  const [platform, setPlatform] = useState<string>("LinkedIn");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<string | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const platforms = ["LinkedIn", "X / Twitter", "Instagram", "YouTube"];
  const tones = ["Professional", "Bold", "Casual", "Witty"];

  function handleGenerate() {
    setGenerating(true);
    setGenerated(null);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(PLATFORM_SAMPLES[platform] ?? "");
    }, 2000);
  }

  function handlePostNow() {
    setPosting(true);
    setTimeout(() => {
      setPosting(false);
      setPosted(true);
      setTimeout(() => onClose(), 1500);
    }, 1500);
  }

  const charCount = generated ? generated.length : 0;
  const charLimit = PLATFORM_LIMITS[platform] ?? 700;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.55)", display: "flex",
          alignItems: "center", justifyContent: "center",
          padding: "24px",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          style={{
            background: CARD, borderRadius: 18, width: "100%", maxWidth: 640,
            maxHeight: "90vh", overflowY: "auto",
            border: `1px solid ${BORDER}`,
            boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          }}
        >
          {/* Modal Header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "20px 24px", borderBottom: `1px solid ${BORDER}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: PRIMARY + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={18} color={PRIMARY} />
              </div>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: DARK_TEXT }}>AI Social Composer</h2>
                <p style={{ fontSize: 12, color: MUTED }}>Generate platform-optimized social content</p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <XIcon size={16} color={MUTED} />
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Platform Selector */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT, marginBottom: 8 }}>Platform</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {platforms.map(p => {
                  const active = platform === p;
                  return (
                    <button
                      key={p}
                      onClick={() => { setPlatform(p); setGenerated(null); }}
                      style={{
                        padding: "7px 16px", borderRadius: 9999, fontSize: 13, fontWeight: 600,
                        cursor: "pointer", border: `1px solid ${active ? PRIMARY : BORDER}`,
                        background: active ? PRIMARY : "white",
                        color: active ? "white" : MUTED,
                        transition: "all 0.15s",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT, marginBottom: 8 }}>What do you want to post about?</p>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Our latest case study showing 34% CAC reduction with AI agents..."
                rows={3}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 10,
                  border: `1px solid ${BORDER}`, background: "white",
                  fontSize: 13, color: DARK_TEXT, resize: "vertical",
                  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Tone Selector */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT, marginBottom: 8 }}>Tone</p>
              <div style={{ display: "flex", gap: 8 }}>
                {tones.map(t => {
                  const active = tone === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      style={{
                        padding: "6px 14px", borderRadius: 9999, fontSize: 13, fontWeight: 600,
                        cursor: "pointer", border: `1px solid ${active ? AMBER : BORDER}`,
                        background: active ? AMBER + "18" : "white",
                        color: active ? AMBER : MUTED,
                        transition: "all 0.15s",
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px 24px", borderRadius: 10, border: "none",
                background: generating ? MUTED : PRIMARY, color: "white",
                fontSize: 14, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
            >
              {generating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%" }}
                  />
                  Generating…
                </>
              ) : (
                <><Sparkles size={16} /> Generate Post</>
              )}
            </button>

            {/* Generated Preview */}
            {generated !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div style={{
                  background: PAGE_BG, border: `1px solid ${BORDER}`,
                  borderRadius: 12, padding: 16,
                }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT, marginBottom: 10 }}>Generated Preview</p>
                  <p style={{ fontSize: 13, color: DARK_TEXT, lineHeight: 1.65, whiteSpace: "pre-line" }}>{generated}</p>
                </div>

                {/* Character Count */}
                <p style={{ fontSize: 12, color: charCount > charLimit ? RED : MUTED, textAlign: "right" }}>
                  Character count: {charCount}/{charLimit}
                </p>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {/* Schedule Post */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                      onClick={() => setScheduleOpen(v => !v)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "9px 16px", borderRadius: 9, border: `1px solid ${BORDER}`,
                        background: "white", fontSize: 13, fontWeight: 600, color: DARK_TEXT, cursor: "pointer",
                      }}
                    >
                      <Clock size={14} color={MUTED} /> Schedule Post <ChevronDown size={13} color={MUTED} />
                    </button>
                    {scheduleOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: "flex", gap: 8, alignItems: "center" }}
                      >
                        <input
                          type="datetime-local"
                          value={scheduleDateTime}
                          onChange={e => setScheduleDateTime(e.target.value)}
                          style={{
                            padding: "7px 10px", borderRadius: 8, border: `1px solid ${BORDER}`,
                            fontSize: 13, color: DARK_TEXT, background: "white",
                          }}
                        />
                        <button
                          style={{
                            padding: "7px 14px", borderRadius: 8, border: "none",
                            background: PRIMARY, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          Confirm Schedule
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* Post Now */}
                  <button
                    onClick={handlePostNow}
                    disabled={posting || posted}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "9px 20px", borderRadius: 9, border: "none",
                      background: posted ? GREEN : posting ? MUTED : BLUE,
                      color: "white", fontSize: 13, fontWeight: 700, cursor: (posting || posted) ? "not-allowed" : "pointer",
                    }}
                  >
                    {posted ? (
                      <><CheckCircle size={14} /> Posted!</>
                    ) : posting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          style={{ width: 14, height: 14, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%" }}
                        />
                        Posting…
                      </>
                    ) : (
                      <><Send size={14} /> Post Now</>
                    )}
                  </button>

                  {/* Save Draft */}
                  <button
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "9px 16px", borderRadius: 9,
                      border: `1px solid ${BORDER}`, background: "white",
                      fontSize: 13, fontWeight: 600, color: MUTED, cursor: "pointer",
                    }}
                  >
                    <Edit size={14} /> Save as Draft
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Engagement Inbox Tab ──────────────────────────────────────────────────────
const inboxStats = [
  { label: "Unread Comments", value: "24", color: BLUE },
  { label: "Mentions",        value: "8",  color: AMBER },
  { label: "DMs",             value: "3",  color: PRIMARY },
  { label: "Avg Response Time", value: "2.4h", color: GREEN },
];

const engagementItems = [
  { platform: "LinkedIn", author: "Sarah Mitchell",       time: "20 min ago", content: "This is exactly what we needed! How long does the implementation take?",                      sentiment: "Positive" },
  { platform: "LinkedIn", author: "Michael Torres",       time: "1h ago",     content: "Interesting approach. Have you considered the compliance implications for regulated industries?", sentiment: "Neutral"  },
  { platform: "X",        author: "@techcmo2026",         time: "2h ago",     content: "Finally someone gets it. The AI marketing OS is the future.",                                  sentiment: "Positive" },
  { platform: "LinkedIn", author: "James Park",           time: "3h ago",     content: "Can you share the specific methodology behind the 34% CAC reduction?",                         sentiment: "Positive" },
  { platform: "LinkedIn", author: "Competition Watch",    time: "4h ago",     content: "How does this compare to [Competitor]?",                                                        sentiment: "Neutral"  },
  { platform: "Instagram",author: "@digital_marketer_pro",time: "5h ago",    content: "Love the content! Would love to collaborate 🔥",                                                sentiment: "Positive" },
  { platform: "X",        author: "@skeptic_cmo",         time: "6h ago",     content: "Seems too good to be true. What are the actual limitations?",                                  sentiment: "Negative" },
  { platform: "LinkedIn", author: "Rebecca Nguyen",       time: "8h ago",     content: "Already using Lyzr for 6 months — these numbers are real. Game changer.",                     sentiment: "Positive" },
];

function SentimentIcon({ sentiment }: { sentiment: string }) {
  if (sentiment === "Positive") return <ThumbsUp size={13} color={GREEN} />;
  if (sentiment === "Negative") return <AlertTriangle size={13} color={RED} />;
  return <Minus size={13} color={AMBER} />;
}

function EngagementInboxTab() {
  const [filter, setFilter] = useState<"All" | "Comments" | "Mentions" | "DMs">("All");
  const [autoReply, setAutoReply] = useState(false);
  const [replyOpen, setReplyOpen] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [markedRead, setMarkedRead] = useState<Set<number>>(new Set());
  const [sentReplies, setSentReplies] = useState<Set<number>>(new Set());

  const filterPills = ["All", "Comments", "Mentions", "DMs"] as const;

  function handleSendReply(idx: number) {
    setSentReplies(prev => new Set(prev).add(idx));
    setReplyOpen(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* AI Auto-reply Banner */}
      {autoReply && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: GREEN + "15", border: `1px solid ${GREEN}40`,
            borderRadius: 10, padding: "12px 18px",
            display: "flex", alignItems: "center", gap: 10,
          }}
        >
          <Sparkles size={16} color={GREEN} />
          <p style={{ fontSize: 13, fontWeight: 600, color: GREEN }}>
            AI Auto-reply is ACTIVE — AI will draft responses for review
          </p>
        </motion.div>
      )}

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {inboxStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              background: CARD, border: `1px solid ${BORDER}`,
              borderRadius: 12, padding: "16px 20px",
            }}
          >
            <p style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Inbox Panel */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        {/* Inbox Header */}
        <div style={{
          padding: "16px 24px", borderBottom: `1px solid ${BORDER}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          {/* Filter Pills */}
          <div style={{ display: "flex", gap: 6 }}>
            {filterPills.map(f => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "5px 14px", borderRadius: 9999, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", border: `1px solid ${active ? PRIMARY : BORDER}`,
                    background: active ? PRIMARY + "12" : "white",
                    color: active ? PRIMARY : MUTED,
                    transition: "all 0.15s",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* AI Auto-reply toggle */}
          <button
            onClick={() => setAutoReply(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 14px", borderRadius: 9,
              border: `1px solid ${autoReply ? GREEN : BORDER}`,
              background: autoReply ? GREEN + "12" : "white",
              fontSize: 13, fontWeight: 600,
              color: autoReply ? GREEN : MUTED,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {autoReply ? <ToggleRight size={18} color={GREEN} /> : <ToggleLeft size={18} color={MUTED} />}
            AI Auto-reply
          </button>
        </div>

        {/* Items */}
        <div>
          {engagementItems.map((item, i) => {
            const isRead = markedRead.has(i);
            const isReplying = replyOpen === i;
            const isSent = sentReplies.has(i);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  borderTop: i === 0 ? "none" : `1px solid ${BORDER}`,
                  padding: "18px 24px",
                  background: isRead ? PAGE_BG + "60" : "transparent",
                  opacity: isRead ? 0.7 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%",
                    background: PRIMARY + "18", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: PRIMARY }}>{item.author[0]}</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Top Row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT }}>{item.author}</span>
                        <PlatformBadge platform={item.platform} />
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: item.sentiment === "Positive" ? GREEN : item.sentiment === "Negative" ? RED : AMBER, fontWeight: 600 }}>
                          <SentimentIcon sentiment={item.sentiment} />
                          {item.sentiment === "Positive" ? "Positive" : item.sentiment === "Negative" ? "Negative" : "Neutral"}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: MUTED, flexShrink: 0, marginLeft: 12 }}>{item.time}</span>
                    </div>

                    {/* Content */}
                    <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.5, marginBottom: 12 }}>{item.content}</p>

                    {/* Inline Reply */}
                    {isReplying && !isSent && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-end" }}
                      >
                        <textarea
                          value={replyText[i] ?? ""}
                          onChange={e => setReplyText(prev => ({ ...prev, [i]: e.target.value }))}
                          placeholder="Write your reply..."
                          rows={2}
                          style={{
                            flex: 1, padding: "9px 12px", borderRadius: 9,
                            border: `1px solid ${BORDER}`, background: "white",
                            fontSize: 13, color: DARK_TEXT, resize: "none",
                            outline: "none", fontFamily: "inherit",
                          }}
                        />
                        <button
                          onClick={() => handleSendReply(i)}
                          style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "9px 16px", borderRadius: 9, border: "none",
                            background: PRIMARY, color: "white",
                            fontSize: 13, fontWeight: 700, cursor: "pointer",
                          }}
                        >
                          <Send size={13} /> Send Reply
                        </button>
                      </motion.div>
                    )}

                    {isSent && (
                      <p style={{ fontSize: 12, color: GREEN, fontWeight: 600, marginBottom: 8 }}>
                        <CheckCircle size={12} style={{ display: "inline", marginRight: 4 }} /> Reply sent
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: 8 }}>
                      {!isSent && (
                        <button
                          onClick={() => setReplyOpen(isReplying ? null : i)}
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "5px 12px", borderRadius: 7,
                            border: `1px solid ${isReplying ? PRIMARY : BORDER}`,
                            background: isReplying ? PRIMARY + "10" : "white",
                            fontSize: 12, fontWeight: 600,
                            color: isReplying ? PRIMARY : MUTED, cursor: "pointer",
                          }}
                        >
                          <MessageSquare size={12} /> Reply
                        </button>
                      )}
                      {!isRead && (
                        <button
                          onClick={() => setMarkedRead(prev => new Set(prev).add(i))}
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            padding: "5px 12px", borderRadius: 7,
                            border: `1px solid ${BORDER}`, background: "white",
                            fontSize: 12, fontWeight: 600, color: MUTED, cursor: "pointer",
                          }}
                        >
                          <CheckCircle size={12} /> Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SocialPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [composerOpen, setComposerOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "32px 40px", fontFamily: "inherit" }}>
      {/* AI Composer Modal */}
      {composerOpen && <AIComposerModal onClose={() => setComposerOpen(false)} />}

      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK_TEXT, marginBottom: 6 }}>Social Media</h1>
            <p style={{ fontSize: 14, color: MUTED }}>Publishing, performance analytics & brand listening</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => setComposerOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, border: "none", background: PRIMARY, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              <Sparkles size={14} /> + Create Post
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: MUTED, cursor: "pointer" }}>
              <RefreshCw size={14} /> Refresh
            </button>
            <div style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: MUTED }}>
              May 2025
            </div>
          </div>
        </div>

        {/* Workflow Banner — Campaign Launch Orchestrator, Step 5 of 6 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 16px", marginBottom: 20, flexWrap: "wrap" as const, marginTop: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Workflow:</span>
          {[
            { label: "1. Plan", current: false },
            { label: "2. Content", current: false },
            { label: "3. Creative", current: false },
            { label: "4. Email", current: false },
            { label: "5. Social", current: true },
            { label: "6. Launch", current: false },
          ].map((step, i, arr) => (
            <span key={step.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: step.current ? 700 : 400, color: step.current ? PRIMARY : MUTED }}>
                {step.label}
              </span>
              {i < arr.length - 1 && <ChevronRight size={12} color={MUTED} />}
            </span>
          ))}
          <a
            href="/campaigns"
            style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "white", background: PRIMARY, borderRadius: 7, padding: "6px 12px", textDecoration: "none" }}
          >
            Go to Campaigns →
          </a>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 24, borderBottom: `1px solid ${BORDER}` }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px", fontSize: 14, fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? PRIMARY : MUTED,
                background: "transparent", border: "none", cursor: "pointer",
                borderBottom: activeTab === tab ? `2.5px solid ${PRIMARY}` : "2.5px solid transparent",
                marginBottom: -1, transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === "Overview"             && <OverviewTab />}
          {activeTab === "Publishing Queue"     && <PublishingQueueTab />}
          {activeTab === "Content Performance"  && <ContentPerformanceTab />}
          {activeTab === "Engagement Inbox"     && <EngagementInboxTab />}
          {activeTab === "Social Listening"     && <SocialListeningTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
