"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, AlertTriangle, CheckCircle2, Clock, Zap,
  ArrowUpRight, ArrowDownRight, Brain, Rocket, Target, DollarSign,
  BarChart3, Users, Megaphone, Shield, Circle,
  ChevronRight, Sparkles, Globe, Bell, Plus, RefreshCcw,
  Bot, Send, Layers, FileText, PlayCircle, Pause,
  Calendar, Tag, Eye, MoreHorizontal, Filter, Search,
  Mail, Monitor, Star, ChevronDown,
} from "lucide-react";

// ─── Design Tokens ───────────────────────────────────────────────────────────
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

// ─── KPI Data ────────────────────────────────────────────────────────────────
const kpis = [
  { label: "Active Campaigns", value: "23", sub: "7 live right now", icon: Rocket, color: PRIMARY, delta: "+3", dir: "up" },
  { label: "Total Budget",     value: "$4.2M", sub: "Q2 allocation",    icon: DollarSign, color: BLUE, delta: "+$1M", dir: "up" },
  { label: "Blended ROAS",    value: "4.2×",  sub: "target: 3.5×",     icon: TrendingUp, color: GREEN, delta: "+0.3×", dir: "up" },
  { label: "Pipeline Generated", value: "$6.2M", sub: "vs $5.7M last Q", icon: BarChart3, color: AMBER, delta: "+8%", dir: "up" },
];

// ─── Campaign Data ────────────────────────────────────────────────────────────
const campaigns = [
  {
    id: 1, name: "BFSI Vertical Launch", status: "live", risk: "high",
    budget: "$180K", spent: 68, ctr: "3.4%", roas: "3.4×", cac: "$312",
    team: ["EW", "PS"], milestone: "May 15 — Launch day",
    mqls: 87, revenue: "$612K", aiFlag: "3 assets pending — launch tomorrow",
  },
  {
    id: 2, name: "OGI Whitepaper Campaign", status: "at-risk", risk: "medium",
    budget: "$45K", spent: 62, ctr: "2.1%", roas: "2.8×", cac: "$380",
    team: ["EW"], milestone: "May 20 — Delivery deadline",
    mqls: 34, revenue: "$252K", aiFlag: "Behind schedule by 2 days",
  },
  {
    id: 3, name: "AWS Partnership Announcement", status: "live", risk: "low",
    budget: "$28K", spent: 55, ctr: "3.1%", roas: "4.2×", cac: "$248",
    team: ["RP"], milestone: "May 18 — PR amplification",
    mqls: 41, revenue: "$343K", aiFlag: null,
  },
  {
    id: 4, name: "Hitachi Case Study Promotion", status: "live", risk: "low",
    budget: "$32K", spent: 44, ctr: "2.7%", roas: "1.9×", cac: "$290",
    team: ["DK"], milestone: "Jun 1 — Campaign review",
    mqls: 28, revenue: "$168K", aiFlag: null,
  },
  {
    id: 5, name: "Series A PR Campaign", status: "paused", risk: "low",
    budget: "$15K", spent: 100, ctr: "4.8%", roas: "8.5×", cac: "$88",
    team: ["JT"], milestone: "Complete — May 1",
    mqls: 62, revenue: "$382K", extra: "ROI 850% — complete", aiFlag: null,
  },
  {
    id: 6, name: "LinkedIn ABM — Enterprise", status: "live", risk: "low",
    budget: "$98K", spent: 44, ctr: "4.7%", roas: "4.8×", cac: "$198",
    team: ["PS"], milestone: "Jun 20 — Q3 scale decision",
    mqls: 79, revenue: "$946K", aiFlag: null,
  },
  {
    id: 7, name: "Agentic OS Launch (APAC)", status: "scheduled", risk: "low",
    budget: "$62K", spent: 0, ctr: "—", roas: "—", cac: "—",
    team: ["AR"], milestone: "Jun 10 — Launch date",
    mqls: 0, revenue: "$—", extra: "Planning phase", aiFlag: null,
  },
];

// ─── Content Pipeline Data ───────────────────────────────────────────────────
const kanbanColumns = ["Brief", "Draft", "Review", "Approved", "Published"];

const contentCards = [
  { id: 1, col: "Brief",     title: "AI in B2B Marketing",        type: "Blog",         owner: "SM", due: "Jun 5",  score: 84 },
  { id: 2, col: "Brief",     title: "Q3 Strategy Framework",       type: "Blog",         owner: "AK", due: "Jun 8",  score: 71 },
  { id: 3, col: "Draft",     title: "EMEA Expansion Ad Set",       type: "Ad",           owner: "JL", due: "Jun 3",  score: 76, extra: "4 variants" },
  { id: 4, col: "Draft",     title: "LinkedIn ABM Carousel",       type: "LinkedIn",     owner: "SM", due: "Jun 4",  score: 91, extra: "6 slides" },
  { id: 5, col: "Draft",     title: "Product Demo Video Script",   type: "Video",        owner: "RB", due: "Jun 6",  score: 68, extra: "4 min runtime" },
  { id: 6, col: "Review",    title: "Webinar Follow-up Sequence",  type: "Email",        owner: "AK", due: "Jun 2",  score: 88, extra: "3-part series" },
  { id: 7, col: "Review",    title: "Enterprise Pain Points Post", type: "LinkedIn",     owner: "MR", due: "Jun 3",  score: 79 },
  { id: 8, col: "Approved",  title: "G2 Review CTA Email",         type: "Email",        owner: "MR", due: "Jun 1",  score: 92 },
  { id: 9, col: "Approved",  title: "ABM Landing Page Copy",       type: "Blog",         owner: "SM", due: "Jun 4",  score: 87 },
  { id: 10, col: "Published", title: "How AI Scales Marketing Teams","type": "Blog",     owner: "AK", due: "May 28", score: 95 },
  { id: 11, col: "Published", title: "Q2 Launch Campaign Ads",      type: "Ad",          owner: "RB", due: "May 25", score: 89, extra: "6 variants" },
  { id: 12, col: "Published", title: "Enterprise ROI Calculator",   type: "Blog",        owner: "JL", due: "May 22", score: 82 },
];

// ─── Channel Data ────────────────────────────────────────────────────────────
const channels = [
  { name: "LinkedIn",     spend: "$420K", impressions: "8.2M",  ctr: "4.7%", roas: "6.8×", status: "Active",   color: "#0077b5", barPct: 85 },
  { name: "Google Ads",  spend: "$380K", impressions: "22.4M", ctr: "2.1%", roas: "4.2×", status: "Active",   color: "#4285f4", barPct: 70 },
  { name: "Meta",        spend: "$280K", impressions: "18.7M", ctr: "1.8%", roas: "2.4×", status: "At Risk",  color: "#1877f2", barPct: 42 },
  { name: "Email",       spend: "$45K",  impressions: "284K sent", ctr: "4.2% click", roas: "—", status: "Active", color: "#059669", barPct: 78, extra: "28.4% open" },
  { name: "Content/SEO", spend: "$120K", impressions: "142K organic", ctr: "8.4% conv", roas: "—", status: "Growing", color: AMBER,   barPct: 62, extra: "↑ 34% MoM" },
  { name: "Events",      spend: "$85K",  impressions: "1,247 regs", ctr: "$68 CPR", roas: "—", status: "Live",   color: "#7c3aed", barPct: 55 },
];

// ─── Analytics Table Data ────────────────────────────────────────────────────
const analyticsRows = [
  { name: "BFSI Vertical Launch",         status: "live",      spend: "$122K", roas: "3.4×", ctr: "3.4%", cac: "$312", mqls: 87,  revenue: "$612K"  },
  { name: "OGI Whitepaper Campaign",      status: "at-risk",   spend: "$28K",  roas: "2.8×", ctr: "2.1%", cac: "$380", mqls: 34,  revenue: "$252K"  },
  { name: "AWS Partnership Announcement", status: "live",      spend: "$15K",  roas: "4.2×", ctr: "3.1%", cac: "$248", mqls: 41,  revenue: "$343K"  },
  { name: "Hitachi Case Study Promotion", status: "live",      spend: "$14K",  roas: "1.9×", ctr: "2.7%", cac: "$290", mqls: 28,  revenue: "$168K"  },
  { name: "Series A PR Campaign",         status: "paused",    spend: "$15K",  roas: "8.5×", ctr: "4.8%", cac: "$88",  mqls: 62,  revenue: "$382K"  },
  { name: "LinkedIn ABM — Enterprise",    status: "live",      spend: "$43K",  roas: "4.8×", ctr: "4.7%", cac: "$198", mqls: 79,  revenue: "$946K"  },
  { name: "Agentic OS Launch (APAC)",     status: "scheduled", spend: "$0",    roas: "—",    ctr: "—",    cac: "—",    mqls: 0,   revenue: "—"      },
];

// ─── ROAS trend SVG polyline points (3-month, scaled to 100×40) ──────────────
const roasTrends = [
  { name: "Q2 Enterprise", color: GREEN,  points: "0,30 25,22 50,15 75,8 100,4" },
  { name: "LinkedIn ABM",  color: BLUE,   points: "0,20 25,14 50,10 75,6 100,2" },
  { name: "EMEA Wave",     color: RED,    points: "0,12 25,16 50,22 75,28 100,32" },
];

// ─── Agent Messages ────────────────────────────────────────────────────────────
const agentMessages = [
  { from: "agent", text: "EMEA campaign ROAS at 2.4× — below 3× threshold. Recommend pausing Meta placements and shifting $82K to LinkedIn ABM." },
  { from: "agent", text: "LinkedIn ABM is your top performer at 6.8× ROAS with $198 CAC. A 40% budget increase could yield 28 additional MQLs." },
];

// ─── Helper components ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    "live":      { label: "Live",      bg: "rgba(34,197,94,0.12)", text: GREEN },
    "at-risk":   { label: "At Risk",   bg: "rgba(220,38,38,0.12)", text: RED },
    "scheduled": { label: "Scheduled", bg: "rgba(37,99,235,0.12)", text: BLUE },
    "paused":    { label: "Paused",    bg: "rgba(217,119,6,0.12)", text: AMBER },
    "draft":     { label: "Draft",     bg: "rgba(107,114,128,0.12)", text: "#6b7280" },
  };
  const s = map[status] ?? map.draft;
  return (
    <span style={{ background: s.bg, color: s.text, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
      {s.label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    "Blog": BLUE, "LinkedIn": "#0077b5", "Email": "#059669",
    "Ad": AMBER, "Video": "#7c3aed",
  };
  const color = map[type] ?? MUTED;
  return (
    <span style={{ background: `${color}18`, color, borderRadius: 6, padding: "2px 7px", fontSize: 10, fontWeight: 600 }}>
      {type}
    </span>
  );
}

function Avatar({ initials, size = 28 }: { initials: string; size?: number }) {
  const colors = ["hsl(25,62%,30%)", BLUE, "#059669", "#7c3aed", AMBER];
  const idx = initials.charCodeAt(0) % colors.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[idx], color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, flexShrink: 0,
      border: "2px solid white",
    }}>
      {initials}
    </div>
  );
}

function ProgressBar({ pct, color = GREEN }: { pct: number; color?: string }) {
  const barColor = pct > 85 ? RED : pct > 60 ? AMBER : color;
  return (
    <div style={{ background: BORDER, borderRadius: 4, height: 6, overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ height: "100%", background: barColor, borderRadius: 4 }}
      />
    </div>
  );
}

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div style={{ width: 8, height: 40, background: BORDER, borderRadius: 4, overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
        <motion.div
          initial={{ height: 0 }} animate={{ height: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: "100%", background: color, borderRadius: 4 }}
        />
      </div>
    </div>
  );
}

// ─── Campaign Card ────────────────────────────────────────────────────────────
function CampaignCard({ c }: { c: typeof campaigns[0] }) {
  const borderColor = c.risk === "high" ? RED : c.risk === "medium" ? AMBER : GREEN;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
        borderLeft: `4px solid ${borderColor}`, padding: 18, cursor: "pointer",
        transition: "box-shadow 0.2s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: DARK_TEXT, marginBottom: 4 }}>{c.name}</div>
          <StatusBadge status={c.status} />
        </div>
        <MoreHorizontal size={16} color={MUTED} style={{ cursor: "pointer", flexShrink: 0 }} />
      </div>

      {c.aiFlag && (
        <div style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 8, padding: "6px 10px", marginBottom: 10, fontSize: 11, color: RED, display: "flex", gap: 6, alignItems: "center" }}>
          <AlertTriangle size={12} /> {c.aiFlag}
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: MUTED, marginBottom: 4 }}>
          <span>Budget: <strong style={{ color: DARK_TEXT }}>{c.budget}</strong></span>
          <span style={{ color: c.spent > 85 ? RED : MUTED }}>{c.spent}% spent</span>
        </div>
        <ProgressBar pct={c.spent} />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        {c.extra ? (
          <div style={{ fontSize: 11 }}><span style={{ color: MUTED }}>Extra: </span><strong style={{ color: DARK_TEXT }}>{c.extra}</strong></div>
        ) : (
          <>
            <div style={{ fontSize: 11 }}><span style={{ color: MUTED }}>CTR </span><strong style={{ color: DARK_TEXT }}>{c.ctr}</strong></div>
            <div style={{ fontSize: 11 }}><span style={{ color: MUTED }}>ROAS </span><strong style={{ color: DARK_TEXT }}>{c.roas}</strong></div>
            <div style={{ fontSize: 11 }}><span style={{ color: MUTED }}>CAC </span><strong style={{ color: DARK_TEXT }}>{c.cac}</strong></div>
          </>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: -4 }}>
          {c.team.map((t, i) => (
            <div key={t} style={{ marginLeft: i === 0 ? 0 : -8 }}>
              <Avatar initials={t} size={26} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: MUTED }}>
          <Calendar size={10} /> {c.milestone}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button style={{
          flex: 1, background: PRIMARY, color: "#fff", border: "none",
          borderRadius: 7, padding: "6px 0", fontSize: 11, fontWeight: 600, cursor: "pointer",
        }}>View Details</button>
        <button style={{
          flex: 1, background: "transparent", color: PRIMARY,
          border: `1px solid ${BORDER}`, borderRadius: 7, padding: "6px 0",
          fontSize: 11, fontWeight: 600, cursor: "pointer",
        }}>Quick Actions</button>
      </div>
    </motion.div>
  );
}

// ─── Content Kanban Card ──────────────────────────────────────────────────────
function KanbanCard({ card }: { card: typeof contentCards[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
      style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10,
        padding: 12, cursor: "pointer", marginBottom: 8,
      }}
    >
      <div style={{ marginBottom: 6 }}>
        <TypeBadge type={card.type} />
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, marginBottom: 6, lineHeight: 1.4 }}>{card.title}</div>
      {card.extra && <div style={{ fontSize: 10, color: MUTED, marginBottom: 6 }}>{card.extra}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Avatar initials={card.owner} size={20} />
          <span style={{ fontSize: 10, color: MUTED }}>{card.due}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: card.score >= 85 ? GREEN : card.score >= 70 ? AMBER : RED,
          }} />
          <span style={{ fontSize: 10, color: MUTED }}>{card.score}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Channel Card ─────────────────────────────────────────────────────────────
function ChannelCard({ ch }: { ch: typeof channels[0] }) {
  const statusColor = ch.status === "Active" || ch.status === "Growing" || ch.status === "Live"
    ? GREEN : ch.status === "At Risk" ? RED : AMBER;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.07)" }}
      style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
        padding: 18, cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: ch.color }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: DARK_TEXT }}>{ch.name}</span>
        </div>
        <span style={{ background: `${statusColor}18`, color: statusColor, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 600 }}>
          {ch.status}
        </span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: MUTED }}>Spend</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT }}>{ch.spend}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: MUTED }}>Impressions</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT }}>{ch.impressions}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: MUTED }}>CTR / Rate</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT }}>{ch.ctr}</span>
        </div>
        {ch.roas !== "—" && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: MUTED }}>ROAS</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>{ch.roas}</span>
          </div>
        )}
        {ch.extra && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: MUTED }}>Extra</span>
            <span style={{ fontSize: 11, color: DARK_TEXT }}>{ch.extra}</span>
          </div>
        )}
      </div>

      {/* Mini Bar Chart */}
      <div>
        <div style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>Performance</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
          {[ch.barPct * 0.6, ch.barPct * 0.75, ch.barPct * 0.85, ch.barPct * 0.9, ch.barPct].map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }} animate={{ height: `${v}%` }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              style={{ flex: 1, background: ch.color, borderRadius: "2px 2px 0 0", opacity: 0.7 + i * 0.06 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── AI Sidebar ───────────────────────────────────────────────────────────────
function AISidebar() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(agentMessages);

  function handleSend() {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { from: "user", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "agent", text: "Analyzing campaign data... I'll prepare a recommendation shortly." }]);
    }, 800);
  }

  return (
    <div style={{
      width: 220, flexShrink: 0, background: CARD,
      border: `1px solid ${BORDER}`, borderRadius: 14,
      display: "flex", flexDirection: "column", overflow: "hidden",
      height: "calc(100vh - 120px)", position: "sticky", top: 80,
    }}>
      <div style={{ padding: "14px 14px 10px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: DARK_TEXT }}>Campaign Planner Agent</span>
        </div>
        <div style={{ fontSize: 10, color: MUTED }}>Powered by Skott AI</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            {m.from === "agent" ? (
              <div style={{ background: `${PRIMARY}0f`, borderRadius: "0 10px 10px 10px", padding: "8px 10px" }}>
                <div style={{ display: "flex", gap: 5, alignItems: "flex-start" }}>
                  <Bot size={12} color={PRIMARY} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: DARK_TEXT, lineHeight: 1.5 }}>{m.text}</span>
                </div>
              </div>
            ) : (
              <div style={{ background: `${BLUE}15`, borderRadius: "10px 0 10px 10px", padding: "8px 10px", alignSelf: "flex-end", marginLeft: 16 }}>
                <span style={{ fontSize: 11, color: BLUE, lineHeight: 1.5 }}>{m.text}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div style={{ padding: 10, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Ask about campaigns…"
            style={{
              flex: 1, background: PAGE_BG, border: `1px solid ${BORDER}`,
              borderRadius: 8, padding: "6px 8px", fontSize: 11, color: DARK_TEXT,
              outline: "none",
            }}
          />
          <button
            onClick={handleSend}
            style={{ background: PRIMARY, border: "none", borderRadius: 8, width: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Send size={12} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Kanban column groupings ──────────────────────────────────────────────────
const kanbanStatusMap: Record<string, string[]> = {
  Planning:  ["scheduled"],
  Active:    ["live"],
  Paused:    ["paused"],
  Complete:  ["complete"],
};

// ─── Gantt / Calendar helpers ─────────────────────────────────────────────────
const ganttItems = [
  { name: "BFSI Vertical Launch",         start: 0,  width: 45, color: RED    },
  { name: "OGI Whitepaper Campaign",       start: 10, width: 35, color: AMBER  },
  { name: "AWS Partnership Announcement",  start: 5,  width: 30, color: GREEN  },
  { name: "Hitachi Case Study Promotion",  start: 15, width: 50, color: BLUE   },
  { name: "Series A PR Campaign",          start: 0,  width: 20, color: MUTED  },
  { name: "LinkedIn ABM — Enterprise",     start: 8,  width: 60, color: GREEN  },
  { name: "Agentic OS Launch (APAC)",      start: 40, width: 35, color: PRIMARY },
];

const calendarDots: Record<number, { name: string; color: string }[]> = {
  14: [{ name: "BFSI Launch", color: RED }],
  15: [{ name: "BFSI Launch", color: RED }, { name: "AWS PR", color: GREEN }],
  18: [{ name: "AWS PR Amplification", color: GREEN }],
  20: [{ name: "OGI Deadline", color: AMBER }],
  25: [{ name: "LinkedIn ABM Review", color: BLUE }],
};

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function OverviewTab() {
  const [viewMode, setViewMode] = useState<"List" | "Kanban" | "Gantt" | "Calendar">("List");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* View toggle */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4, width: "fit-content" }}>
        {(["List", "Kanban", "Gantt", "Calendar"] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600,
              cursor: "pointer", border: "none", transition: "all 0.18s",
              background: viewMode === mode ? PRIMARY : "transparent",
              color: viewMode === mode ? "#fff" : MUTED,
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* List view */}
      {viewMode === "List" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {campaigns.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <CampaignCard c={c} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Kanban view */}
      {viewMode === "Kanban" && (
        <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
          {Object.entries(kanbanStatusMap).map(([col, statuses]) => {
            const colCampaigns = campaigns.filter(c => statuses.includes(c.status));
            return (
              <div key={col} style={{ minWidth: 260, flex: "0 0 260px" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 12, padding: "6px 10px", borderRadius: 8,
                  background: col === "Active" ? `${GREEN}10` : col === "Planning" ? `${BLUE}10` : col === "Paused" ? `${AMBER}10` : `${MUTED}10`,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: DARK_TEXT }}>{col}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "1px 8px", borderRadius: 10,
                    background: PRIMARY, color: "#fff",
                  }}>{colCampaigns.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {colCampaigns.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                      <CampaignCard c={c} />
                    </motion.div>
                  ))}
                  {colCampaigns.length === 0 && (
                    <div style={{ border: `1.5px dashed ${BORDER}`, borderRadius: 10, padding: 24, textAlign: "center", fontSize: 12, color: MUTED }}>
                      No campaigns
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Gantt view */}
      {viewMode === "Gantt" && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: DARK_TEXT, marginBottom: 16 }}>Campaign Timeline — May / June 2025</div>
          {/* Header ruler */}
          <div style={{ display: "flex", marginBottom: 8, marginLeft: 200 }}>
            {["May 1", "May 8", "May 15", "May 22", "May 29", "Jun 5", "Jun 12"].map((lbl, i) => (
              <div key={lbl} style={{ flex: 1, fontSize: 10, color: MUTED, borderLeft: `1px dashed ${BORDER}`, paddingLeft: 4 }}>{lbl}</div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ganttItems.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 196, fontSize: 11, color: DARK_TEXT, fontWeight: 600, textAlign: "right", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.name}
                </div>
                <div style={{ flex: 1, position: "relative", height: 24, background: BORDER, borderRadius: 6, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.width}%` }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.06 }}
                    style={{
                      position: "absolute", left: `${item.start}%`,
                      height: "100%", borderRadius: 6,
                      background: item.color, opacity: 0.8,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar view */}
      {viewMode === "Calendar" && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: DARK_TEXT, marginBottom: 16 }}>May 2025</div>
          {/* Day labels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: MUTED, padding: "4px 0" }}>{d}</div>
            ))}
          </div>
          {/* Calendar grid — May 2025 starts on Thursday (index 4) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {Array.from({ length: 4 }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: 31 }).map((_, idx) => {
              const day = idx + 1;
              const dots = calendarDots[day] || [];
              const isToday = day === 14;
              return (
                <motion.div key={day} whileHover={{ scale: 1.05 }}
                  style={{
                    minHeight: 56, borderRadius: 8, padding: "6px 8px",
                    background: isToday ? `${PRIMARY}15` : PAGE_BG,
                    border: `1px solid ${isToday ? PRIMARY : BORDER}`,
                    cursor: "pointer",
                  }}>
                  <div style={{ fontSize: 11, fontWeight: isToday ? 800 : 600, color: isToday ? PRIMARY : DARK_TEXT, marginBottom: 4 }}>{day}</div>
                  {dots.map((dot, di) => (
                    <div key={di} style={{
                      fontSize: 9, color: "#fff", background: dot.color,
                      borderRadius: 4, padding: "1px 5px", marginBottom: 2,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{dot.name}</div>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Tab: Campaign Planner ────────────────────────────────────────────────────
function PlannerTab() {
  const [duration, setDuration] = useState("90");
  const [channels, setChannels] = useState<string[]>(["LinkedIn", "Google", "Email"]);

  function toggleChannel(ch: string) {
    setChannels(prev => prev.includes(ch) ? prev.filter(x => x !== ch) : [...prev, ch]);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20 }}>

      {/* Left: Form */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: DARK_TEXT, marginBottom: 20 }}>Campaign Planner</div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 6 }}>Campaign Goal</label>
          <textarea
            defaultValue="Generate 200 MQLs in Q3 from BFSI enterprise accounts (banks, insurance) for Lyzr AgenticOS via LinkedIn ABM and Thought Leadership"
            style={{
              width: "100%", height: 80, background: PAGE_BG, border: `1px solid ${BORDER}`,
              borderRadius: 8, padding: "8px 12px", fontSize: 12, color: DARK_TEXT,
              outline: "none", resize: "none", boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 6 }}>Target Audience</label>
          <div style={{ position: "relative" }}>
            <select style={{
              width: "100%", background: PAGE_BG, border: `1px solid ${BORDER}`,
              borderRadius: 8, padding: "8px 12px", fontSize: 12, color: DARK_TEXT,
              outline: "none", appearance: "none", cursor: "pointer",
            }}>
              <option>BFSI Enterprise — CISO, CTO, Head of IT (Banks &amp; Insurance)</option>
              <option>Enterprise SaaS (500+ employees)</option>
              <option>Mid-Market Technology (200–500 employees)</option>
            </select>
            <ChevronDown size={14} color={MUTED} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 6 }}>Budget</label>
          <input
            defaultValue="$85,000"
            style={{
              width: "100%", background: PAGE_BG, border: `1px solid ${BORDER}`,
              borderRadius: 8, padding: "8px 12px", fontSize: 12, color: DARK_TEXT,
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 8 }}>Duration</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["30", "60", "90"].map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                style={{
                  flex: 1, padding: "7px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: duration === d ? PRIMARY : PAGE_BG,
                  color: duration === d ? "#fff" : DARK_TEXT,
                  border: `1px solid ${duration === d ? PRIMARY : BORDER}`,
                  transition: "all 0.2s",
                }}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 8 }}>Channels</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["LinkedIn", "Google", "Meta", "Email", "Content"].map(ch => (
              <button
                key={ch}
                onClick={() => toggleChannel(ch)}
                style={{
                  padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer",
                  background: channels.includes(ch) ? `${PRIMARY}15` : PAGE_BG,
                  color: channels.includes(ch) ? PRIMARY : MUTED,
                  border: `1px solid ${channels.includes(ch) ? PRIMARY : BORDER}`,
                  transition: "all 0.2s",
                }}
              >
                {channels.includes(ch) ? "✓ " : ""}{ch}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          style={{
            width: "100%", background: PRIMARY, color: "#fff", border: "none",
            borderRadius: 10, padding: "12px 0", fontSize: 13, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <Sparkles size={16} /> Generate Strategy
        </motion.button>
      </div>

      {/* Right: AI Strategy Output */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: DARK_TEXT }}>Campaign Strategy: Lyzr AgenticOS for BFSI</div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Generated by Campaign Planner Agent · Lyzr.ai</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
            <span style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>AI Generated</span>
          </div>
        </div>

        {/* Goal / Budget / Channels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Goal", value: "200 MQLs in 90 days" },
            { label: "Budget", value: "$98,000" },
            { label: "Primary Channel", value: "LinkedIn ABM (55%)" },
          ].map(s => (
            <div key={s.label} style={{ background: PAGE_BG, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: MUTED, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: DARK_TEXT }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Channel Mix */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: DARK_TEXT, marginBottom: 10 }}>Channel Allocation</div>
          {[
            { ch: "LinkedIn ABM", pct: 55, color: "#0077b5" },
            { ch: "Thought Leadership / Events", pct: 25, color: "#4285f4" },
            { ch: "Partner Co-marketing (AWS)", pct: 20, color: "#059669" },
          ].map(c => (
            <div key={c.ch} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: MUTED, marginBottom: 3 }}>
                <span>{c.ch}</span><span style={{ color: DARK_TEXT, fontWeight: 600 }}>{c.pct}%</span>
              </div>
              <ProgressBar pct={c.pct} color={c.color} />
            </div>
          ))}
        </div>

        {/* Messaging Framework */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: DARK_TEXT, marginBottom: 10 }}>Messaging Framework</div>
          {[
            { tag: "Hero", text: '"Deploy AI agents across your BFSI operations with Lyzr AgenticOS"' },
            { tag: "Pain", text: "Legacy banking workflows costing 60% in operational overhead" },
            { tag: "Proof", text: "Hitachi deployed Lyzr AgenticOS — 3.4× faster process execution" },
          ].map(m => (
            <div key={m.tag} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
              <span style={{ fontSize: 10, fontWeight: 700, background: `${PRIMARY}15`, color: PRIMARY, borderRadius: 5, padding: "2px 6px", flexShrink: 0 }}>{m.tag}</span>
              <span style={{ fontSize: 12, color: DARK_TEXT }}>{m.text}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: DARK_TEXT, marginBottom: 10 }}>Execution Timeline</div>
          {[
            { phase: "Week 1–2", desc: "LinkedIn ABM awareness — target CISO, CTO, Head of IT at banks & insurers" },
            { phase: "Week 3–6", desc: "Thought leadership posts + AWS co-marketing events + retargeting" },
            { phase: "Week 7–12", desc: "Email nurture sequence + OGI whitepaper + SQL handoff to sales" },
          ].map((t, i) => (
            <div key={t.phase} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: PRIMARY, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: DARK_TEXT }}>{t.phase}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Predicted Metrics */}
        <div style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}30`, borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, marginBottom: 8 }}>Predicted Metrics</div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "CTR", value: "3.8–4.2%" },
              { label: "CAC", value: "$310" },
              { label: "ROAS", value: "5.2×" },
              { label: "MQLs", value: "150" },
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontSize: 10, color: MUTED }}>{m.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: DARK_TEXT }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tab: Content Pipeline ────────────────────────────────────────────────────
function ContentPipelineTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
        {kanbanColumns.map(col => {
          const cards = contentCards.filter(c => c.col === col);
          return (
            <div key={col} style={{ minWidth: 210, flex: "0 0 210px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: DARK_TEXT }}>{col}</span>
                <span style={{ fontSize: 10, fontWeight: 600, background: `${PRIMARY}15`, color: PRIMARY, borderRadius: 10, padding: "1px 7px" }}>{cards.length}</span>
              </div>
              <div style={{ minHeight: 100 }}>
                {cards.map(card => (
                  <KanbanCard key={card.id} card={card} />
                ))}
              </div>
              <button style={{
                width: "100%", border: `1px dashed ${BORDER}`, borderRadius: 8,
                padding: "7px 0", fontSize: 11, color: MUTED, background: "transparent",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}>
                <Plus size={12} /> Add card
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Tab: Channel Orchestration ───────────────────────────────────────────────
function ChannelOrchestrationTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {channels.map((ch, i) => (
          <motion.div key={ch.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <ChannelCard ch={ch} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Tab: Analytics ───────────────────────────────────────────────────────────
function AnalyticsTab() {
  // Donut segments (cumulative pct for CSS)
  const donutData = [
    { label: "LinkedIn", pct: 42, color: "#0077b5" },
    { label: "Google",   pct: 28, color: "#4285f4" },
    { label: "Email",    pct: 18, color: "#059669" },
    { label: "Meta",     pct: 12, color: "#1877f2" },
  ];

  // Build conic-gradient string
  let acc = 0;
  const conicParts = donutData.map(d => {
    const start = acc;
    acc += d.pct;
    return `${d.color} ${start}% ${acc}%`;
  });
  const conicGradient = `conic-gradient(${conicParts.join(", ")})`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Campaign Performance Table */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: DARK_TEXT, marginBottom: 16 }}>Campaign Performance</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Name", "Status", "Spend", "ROAS", "CTR", "CAC", "MQLs", "Revenue"].map(h => (
                  <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 600, color: MUTED, padding: "6px 10px", borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analyticsRows.map((row, i) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = PAGE_BG)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "10px 10px", fontSize: 12, fontWeight: 600, color: DARK_TEXT, borderBottom: `1px solid ${BORDER}` }}>{row.name}</td>
                  <td style={{ padding: "10px 10px", borderBottom: `1px solid ${BORDER}` }}><StatusBadge status={row.status} /></td>
                  <td style={{ padding: "10px 10px", fontSize: 12, color: DARK_TEXT, borderBottom: `1px solid ${BORDER}` }}>{row.spend}</td>
                  <td style={{ padding: "10px 10px", fontSize: 12, fontWeight: 700, color: row.roas === "—" ? MUTED : GREEN, borderBottom: `1px solid ${BORDER}` }}>{row.roas}</td>
                  <td style={{ padding: "10px 10px", fontSize: 12, color: DARK_TEXT, borderBottom: `1px solid ${BORDER}` }}>{row.ctr}</td>
                  <td style={{ padding: "10px 10px", fontSize: 12, color: DARK_TEXT, borderBottom: `1px solid ${BORDER}` }}>{row.cac}</td>
                  <td style={{ padding: "10px 10px", fontSize: 12, fontWeight: 700, color: DARK_TEXT, borderBottom: `1px solid ${BORDER}` }}>{row.mqls}</td>
                  <td style={{ padding: "10px 10px", fontSize: 12, fontWeight: 700, color: row.revenue === "—" ? MUTED : PRIMARY, borderBottom: `1px solid ${BORDER}` }}>{row.revenue}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
        {/* ROAS Trend SVG */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: DARK_TEXT, marginBottom: 4 }}>ROAS Trend — 3 Months</div>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 16 }}>Top 3 campaigns</div>
          <svg viewBox="0 0 300 120" width="100%" height="140" style={{ overflow: "visible" }}>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1="30" y1={y * 1.0 + 10} x2="300" y2={y * 1.0 + 10} stroke={BORDER} strokeWidth="0.5" strokeDasharray="3,3" />
            ))}
            {/* Y axis labels */}
            {["7×", "5×", "3×", "1×"].map((lbl, i) => (
              <text key={lbl} x="25" y={i * 28 + 18} fontSize="9" fill={MUTED} textAnchor="end">{lbl}</text>
            ))}
            {/* X axis labels */}
            {["Mar", "Apr", "May", "Jun", "Now"].map((lbl, i) => (
              <text key={lbl} x={30 + i * 67} y="118" fontSize="9" fill={MUTED} textAnchor="middle">{lbl}</text>
            ))}
            {/* Lines */}
            {roasTrends.map(t => (
              <g key={t.name}>
                <polyline
                  points={t.points}
                  fill="none" stroke={t.color} strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  transform="translate(30, 10) scale(2.7, 1)"
                  opacity={0.9}
                />
              </g>
            ))}
            {/* Legend */}
            {roasTrends.map((t, i) => (
              <g key={t.name} transform={`translate(40, ${i * 16 + 15})`}>
                <rect width="18" height="3" rx="2" fill={t.color} y="4" />
                <text x="22" y="11" fontSize="9" fill={DARK_TEXT}>{t.name}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* Channel Attribution Donut */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: DARK_TEXT, marginBottom: 4 }}>Channel Attribution</div>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 16 }}>Revenue influenced %</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
              <div style={{
                width: 100, height: 100, borderRadius: "50%",
                background: conicGradient,
              }} />
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 54, height: 54, borderRadius: "50%",
                background: CARD, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: DARK_TEXT }}>$12.8M</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {donutData.map(d => (
                <div key={d.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                    <span style={{ fontSize: 11, color: DARK_TEXT }}>{d.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: DARK_TEXT }}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Campaign Planner", "Content Pipeline", "Channel Orchestration", "Analytics"];

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 1600, margin: "0 auto", padding: "32px 28px" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Rocket size={18} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>Campaign OS</h1>
                <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>End-to-end campaign planning &amp; execution</p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{
                background: "transparent", border: `1.5px solid ${BORDER}`, borderRadius: 9,
                padding: "9px 18px", fontSize: 13, fontWeight: 600, color: DARK_TEXT, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}>
              <Sparkles size={15} color={AMBER} /> Generate Strategy
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{
                background: PRIMARY, border: "none", borderRadius: 9,
                padding: "9px 18px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}>
              <Plus size={15} /> New Campaign
            </motion.button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
          {kpis.map((k, i) => {
            const Icon = k.icon;
            return (
              <motion.div key={k.label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.07)" }}
                style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 18, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${k.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={k.color} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: k.dir === "up" ? GREEN : RED }}>
                    {k.dir === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {k.delta}
                  </div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: DARK_TEXT, marginBottom: 2 }}>{k.value}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{k.label}</div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{k.sub}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Sub-tab navigation */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 5, width: "fit-content" }}>
          {TABS.map(tab => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "8px 16px", borderRadius: 9, fontSize: 13, fontWeight: 600,
                cursor: "pointer", border: "none", transition: "all 0.2s",
                background: activeTab === tab ? PRIMARY : "transparent",
                color: activeTab === tab ? "#fff" : MUTED,
                boxShadow: activeTab === tab ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
              }}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Main content + Sidebar */}
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}>
                {activeTab === "Overview"               && <OverviewTab />}
                {activeTab === "Campaign Planner"       && <PlannerTab />}
                {activeTab === "Content Pipeline"       && <ContentPipelineTab />}
                {activeTab === "Channel Orchestration"  && <ChannelOrchestrationTab />}
                {activeTab === "Analytics"              && <AnalyticsTab />}
              </motion.div>
            </AnimatePresence>
          </div>
          <AISidebar />
        </div>
      </div>
    </div>
  );
}
