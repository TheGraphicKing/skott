"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Zap, Activity, Clock, CheckCircle, AlertCircle, Pause, Play,
  RefreshCw, Settings, TrendingUp, Brain, Target, BarChart3, Users,
  Shield, Mail, Search, DollarSign, FileText, Star, ArrowRight, ChevronRight
} from "lucide-react";

// ── Brand tokens ──────────────────────────────────────────────────
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

// ── Agent data ────────────────────────────────────────────────────
type Status = "Active" | "Idle" | "Paused";

interface Agent {
  id: number;
  name: string;
  icon: React.ElementType;
  status: Status;
  uptime: string;
  tasks: number;
  desc: string;
}

const AGENTS: Agent[] = [
  { id: 1,  name: "Campaign Strategist",   icon: Target,      status: "Active", uptime: "99.8%", tasks: 12,  desc: "Generates campaign plans and strategies" },
  { id: 2,  name: "Content Writer",        icon: FileText,    status: "Active", uptime: "99.5%", tasks: 34,  desc: "Produces blog posts, copy, assets" },
  { id: 3,  name: "SEO Optimizer",         icon: Search,      status: "Active", uptime: "98.9%", tasks: 28,  desc: "Keyword research, on-page optimization" },
  { id: 4,  name: "Paid Media Manager",    icon: DollarSign,  status: "Active", uptime: "99.1%", tasks: 8,   desc: "Manages Google/LinkedIn bids" },
  { id: 5,  name: "Email Sequencer",       icon: Mail,        status: "Active", uptime: "99.7%", tasks: 156, desc: "Sends and optimizes email sequences" },
  { id: 6,  name: "Social Scheduler",      icon: Zap,         status: "Active", uptime: "99.3%", tasks: 22,  desc: "Schedules posts across channels" },
  { id: 7,  name: "Competitor Monitor",    icon: Activity,    status: "Active", uptime: "99.6%", tasks: 18,  desc: "Tracks Moveworks, Adept, AutoGPT" },
  { id: 8,  name: "Analytics Reporter",    icon: BarChart3,   status: "Active", uptime: "99.4%", tasks: 7,   desc: "Compiles and distributes reports" },
  { id: 9,  name: "Brand Voice Guard",     icon: Shield,      status: "Active", uptime: "99.9%", tasks: 41,  desc: "Reviews content for brand consistency" },
  { id: 10, name: "Lead Scorer",           icon: Star,        status: "Active", uptime: "99.2%", tasks: 89,  desc: "Scores inbound leads from HubSpot/SFDC" },
  { id: 11, name: "Budget Optimizer",      icon: TrendingUp,  status: "Active", uptime: "98.7%", tasks: 4,   desc: "Reallocates spend based on performance" },
  { id: 12, name: "Pipeline Tracker",      icon: ChevronRight,status: "Active", uptime: "99.1%", tasks: 3,   desc: "Monitors deal progression" },
  { id: 13, name: "PR Monitor",            icon: Users,       status: "Idle",   uptime: "99.0%", tasks: 2,   desc: "Tracks press mentions and coverage" },
  { id: 14, name: "Event Coordinator",     icon: Clock,       status: "Idle",   uptime: "98.5%", tasks: 1,   desc: "Manages webinar logistics" },
  { id: 15, name: "ABM Orchestrator",      icon: Brain,       status: "Active", uptime: "99.3%", tasks: 15,  desc: "Coordinates account-based plays" },
  { id: 16, name: "Crisis Detector",       icon: AlertCircle, status: "Idle",   uptime: "99.8%", tasks: 0,   desc: "Monitors for brand crises" },
  { id: 17, name: "Board Reporter",        icon: FileText,    status: "Idle",   uptime: "98.8%", tasks: 1,   desc: "Generates board-ready reports" },
  { id: 18, name: "Customer Interviewer",  icon: Users,       status: "Paused", uptime: "97.2%", tasks: 0,   desc: "Conducts customer research" },
  { id: 19, name: "Attribution Analyst",   icon: BarChart3,   status: "Paused", uptime: "98.1%", tasks: 0,   desc: "Multi-touch attribution modeling" },
  { id: 20, name: "Localization Agent",    icon: Bot,         status: "Active", uptime: "99.0%", tasks: 6,   desc: "Adapts content for APAC markets" },
];

// ── Activity feed ─────────────────────────────────────────────────
interface FeedItem {
  agent: string;
  action: string;
  time: string;
  color: string;
}

const FEED: FeedItem[] = [
  { agent: "Email Sequencer",       action: "sent batch of 1,200 emails to BFSI Decision Makers segment",              time: "2 min ago",  color: GREEN },
  { agent: "Campaign Strategist",   action: "generated Q3 LinkedIn ABM strategy document",                              time: "8 min ago",  color: BLUE },
  { agent: "SEO Optimizer",         action: "updated 14 meta descriptions for /solutions/* pages",                      time: "15 min ago", color: GREEN },
  { agent: "Brand Voice Guard",     action: "flagged 2 phrases in draft blog post for tone correction",                 time: "22 min ago", color: AMBER },
  { agent: "Lead Scorer",           action: "processed 34 new leads from Salesforce, 8 marked MQL-ready",              time: "31 min ago", color: GREEN },
  { agent: "Competitor Monitor",    action: "detected new Moveworks blog post — enterprise AI positioning shift",       time: "45 min ago", color: AMBER },
  { agent: "Content Writer",        action: "completed 'Agentic AI for BFSI' whitepaper draft (4,200 words)",          time: "1h ago",     color: GREEN },
  { agent: "Analytics Reporter",    action: "sent weekly performance digest to Sarah Chen (VP Marketing)",             time: "2h ago",     color: BLUE },
  { agent: "Paid Media Manager",    action: "reduced daily spend on G-Brand-01 by $240 — CTR below threshold",        time: "2h ago",     color: AMBER },
  { agent: "ABM Orchestrator",      action: "enrolled 12 new accounts into Q3 ABM nurture sequence",                   time: "3h ago",     color: BLUE },
  { agent: "Social Scheduler",      action: "published 4 posts across LinkedIn, Twitter, and Threads",                 time: "3h ago",     color: GREEN },
  { agent: "Pipeline Tracker",      action: "flagged 3 deals at risk — no activity in 14+ days",                       time: "4h ago",     color: AMBER },
  { agent: "Budget Optimizer",      action: "reallocated $1,800 from Paid Search to Paid Social based on ROAS data",   time: "5h ago",     color: BLUE },
  { agent: "SEO Optimizer",         action: "identified 22 new long-tail keywords for enterprise AI category",          time: "6h ago",     color: GREEN },
  { agent: "Brand Voice Guard",     action: "approved 7 content pieces — all scored above 80 brand alignment",         time: "6h ago",     color: GREEN },
  { agent: "Event Coordinator",     action: "sent Zoom invites for May 22 webinar to 640 registrants",                 time: "7h ago",     color: BLUE },
  { agent: "Lead Scorer",           action: "re-scored 15 stale leads — 3 elevated to MQL after new engagement data", time: "8h ago",     color: GREEN },
  { agent: "Content Writer",        action: "drafted 3 LinkedIn carousel posts for CFO persona targeting",             time: "9h ago",     color: BLUE },
  { agent: "Competitor Monitor",    action: "Adept raised $250M Series C — recommended response brief created",        time: "10h ago",    color: AMBER },
  { agent: "Analytics Reporter",    action: "generated monthly attribution report — organic up 18% MoM",               time: "12h ago",    color: GREEN },
];

// ── Status helpers ─────────────────────────────────────────────────
function statusColor(s: Status) {
  if (s === "Active") return GREEN;
  if (s === "Idle")   return AMBER;
  return MUTED;
}

function statusBg(s: Status) {
  if (s === "Active") return "hsla(142,55%,35%,0.10)";
  if (s === "Idle")   return "rgba(217,119,6,0.10)";
  return "hsla(25,20%,50%,0.10)";
}

// ── Orchestration nodes ───────────────────────────────────────────
interface OrchestrNode {
  label: string;
  sub?: string;
  parallel?: string[];
}

const WORKFLOW_STEPS: OrchestrNode[] = [
  { label: "Campaign Strategist", sub: "Active" },
  { label: "Parallel", parallel: ["Content Writer", "SEO Optimizer"] },
  { label: "Brand Voice Guard", sub: "Active" },
  { label: "Parallel", parallel: ["Social Scheduler", "Email Sequencer"] },
  { label: "Analytics Reporter", sub: "Active" },
];

const TEMPLATES = [
  { name: "Campaign Launch",        agents: ["Campaign Strategist", "Content Writer", "SEO Optimizer", "Brand Voice Guard", "Social Scheduler", "Email Sequencer", "Analytics Reporter"], color: BLUE },
  { name: "Crisis Response",        agents: ["Crisis Detector", "PR Monitor", "Brand Voice Guard", "Social Scheduler", "Campaign Strategist"], color: RED },
  { name: "Board Report Generation",agents: ["Analytics Reporter", "Budget Optimizer", "Pipeline Tracker", "Board Reporter"], color: PRIMARY },
];

// ── Sub-components ─────────────────────────────────────────────────
function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const Icon = agent.icon;
  const sc   = statusColor(agent.status);
  const sb   = statusBg(agent.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
      style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14 }}
      className="p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow cursor-pointer"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div style={{ background: `hsla(25,62%,25%,0.08)`, borderRadius: 10, width: 36, height: 36 }} className="flex items-center justify-center shrink-0">
          <Icon size={17} style={{ color: PRIMARY }} />
        </div>
        <div
          style={{ background: sb, borderRadius: 999, padding: "2px 8px", display: "flex", alignItems: "center", gap: 5 }}
        >
          {agent.status === "Active" ? (
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              style={{ width: 6, height: 6, borderRadius: 999, background: sc }}
            />
          ) : (
            <div style={{ width: 6, height: 6, borderRadius: 999, background: sc }} />
          )}
          <span style={{ fontSize: 10, fontWeight: 600, color: sc }}>{agent.status}</span>
        </div>
      </div>

      {/* Name + desc */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT, marginBottom: 2 }}>{agent.name}</p>
        <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{agent.desc}</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, borderTop: `1px solid ${BORDER}`, paddingTop: 10, marginTop: "auto" }}>
        <div>
          <p style={{ fontSize: 10, color: MUTED }}>Uptime</p>
          <p style={{ fontSize: 12, fontWeight: 600, color: GREEN }}>{agent.uptime}</p>
        </div>
        <div>
          <p style={{ fontSize: 10, color: MUTED }}>Tasks today</p>
          <p style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT }}>{agent.tasks}</p>
        </div>
      </div>
    </motion.div>
  );
}

function AgentRoster() {
  const stats = [
    { label: "Total Agents",  value: "20",    color: PRIMARY },
    { label: "Active",        value: "14",    color: GREEN },
    { label: "Idle",          value: "4",     color: AMBER },
    { label: "Paused",        value: "2",     color: MUTED },
    { label: "Uptime",        value: "99.2%", color: BLUE },
  ];

  return (
    <div>
      {/* Stat bar */}
      <div
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 20px", marginBottom: 24, display: "flex", gap: 0 }}
      >
        {stats.map((s, i) => (
          <div key={s.label} style={{ flex: 1, borderRight: i < stats.length - 1 ? `1px solid ${BORDER}` : "none", paddingRight: 16, paddingLeft: i === 0 ? 0 : 16 }}>
            <p style={{ fontSize: 10, color: MUTED, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.07em" }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {AGENTS.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} index={i} />
        ))}
      </div>
    </div>
  );
}

function ActivityFeed() {
  const [visible, setVisible] = useState(10);

  return (
    <div>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ width: 8, height: 8, borderRadius: 999, background: GREEN }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>Live Activity Feed</span>
          </div>
          <span style={{ fontSize: 11, color: MUTED }}>Last 24 hours · {FEED.length} events</span>
        </div>

        {/* Events */}
        <div>
          <AnimatePresence>
            {FEED.slice(0, visible).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i < 10 ? i * 0.04 : 0, duration: 0.28 }}
                style={{
                  padding: "12px 20px",
                  borderBottom: i < visible - 1 ? `1px solid ${BORDER}` : "none",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: 999, background: item.color, marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12.5, color: DARK_TEXT, lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 600 }}>{item.agent}</span>{" "}
                    <span style={{ color: MUTED }}>{item.action}</span>
                  </p>
                </div>
                <span style={{ fontSize: 11, color: MUTED, flexShrink: 0, marginTop: 2 }}>{item.time}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load more */}
        {visible < FEED.length && (
          <div style={{ padding: "14px 20px", borderTop: `1px solid ${BORDER}`, textAlign: "center" }}>
            <button
              onClick={() => setVisible(v => Math.min(v + 10, FEED.length))}
              style={{
                fontSize: 12, fontWeight: 600, color: PRIMARY,
                background: "none", border: `1px solid ${BORDER}`, borderRadius: 8,
                padding: "7px 20px", cursor: "pointer"
              }}
            >
              Load More ({FEED.length - visible} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function OrchestrationView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Workflow diagram */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "24px 28px" }}>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT }}>Campaign Launch Workflow</p>
          <p style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Multi-agent orchestration · 7 agents · Sequential + parallel execution</p>
        </div>

        {/* Node chain */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
          {WORKFLOW_STEPS.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
              {/* Arrow between steps */}
              {i > 0 && (
                <div style={{ display: "flex", alignItems: "center", padding: "0 8px" }}>
                  <ArrowRight size={16} style={{ color: MUTED }} />
                </div>
              )}

              {step.parallel ? (
                /* Parallel group */
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {step.parallel.map(name => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        background: "hsla(37,80%,60%,0.12)",
                        border: `1px solid hsla(37,80%,60%,0.35)`,
                        borderRadius: 8,
                        padding: "6px 12px",
                        minWidth: 130
                      }}
                    >
                      <p style={{ fontSize: 11, fontWeight: 600, color: DARK_TEXT }}>{name}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <div style={{ width: 5, height: 5, borderRadius: 999, background: GREEN }} />
                        <span style={{ fontSize: 10, color: GREEN }}>Active · parallel</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Single node */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: PRIMARY,
                    borderRadius: 8,
                    padding: "8px 14px",
                    minWidth: 120
                  }}
                >
                  <p style={{ fontSize: 11, fontWeight: 600, color: CARD }}>{step.label}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      style={{ width: 5, height: 5, borderRadius: 999, background: "hsla(142,70%,65%,1)" }}
                    />
                    <span style={{ fontSize: 10, color: "hsla(36,30%,80%,1)" }}>Active</span>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Pre-Built Orchestration Templates</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {TEMPLATES.map((tmpl, i) => (
            <motion.div
              key={tmpl.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 18px 14px", cursor: "pointer" }}
              className="hover:shadow-sm transition-shadow"
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT }}>{tmpl.name}</p>
                <div style={{ background: `${tmpl.color}18`, borderRadius: 6, padding: "3px 8px" }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: tmpl.color }}>{tmpl.agents.length} agents</span>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                {tmpl.agents.map(name => (
                  <span
                    key={name}
                    style={{
                      fontSize: 10, background: `${BORDER}90`, color: MUTED,
                      borderRadius: 5, padding: "2px 7px"
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
              <button
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: `${tmpl.color}12`, border: `1px solid ${tmpl.color}40`,
                  borderRadius: 7, padding: "6px 0", cursor: "pointer"
                }}
              >
                <Play size={11} style={{ color: tmpl.color }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: tmpl.color }}>Run Template</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────
type Tab = "roster" | "feed" | "orchestration";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "roster",        label: "Agent Roster",  icon: Bot },
  { id: "feed",          label: "Activity Feed", icon: Activity },
  { id: "orchestration", label: "Orchestration", icon: Brain },
];

export default function AgentCenterPage() {
  const [tab, setTab] = useState<Tab>("roster");

  return (
    <div style={{ background: PAGE_BG, minHeight: "100%", padding: "0 0 40px" }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div
            style={{ width: 38, height: 38, borderRadius: 10, background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Bot size={19} style={{ color: CARD }} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: DARK_TEXT }}>Agent Center</h1>
            <p style={{ fontSize: 12, color: MUTED }}>20 AI agents · Lyzr Marketing OS</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "inline-flex", gap: 2, background: "hsla(30,15%,87%,0.6)",
          borderRadius: 10, padding: 3, marginBottom: 24
        }}
      >
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                background: active ? CARD : "transparent",
                color: active ? PRIMARY : MUTED,
                fontWeight: active ? 600 : 500,
                fontSize: 13,
                boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.18s"
              }}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          {tab === "roster"        && <AgentRoster />}
          {tab === "feed"          && <ActivityFeed />}
          {tab === "orchestration" && <OrchestrationView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
