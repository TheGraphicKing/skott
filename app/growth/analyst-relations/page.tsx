"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Users, TrendingUp, Star, CheckCircle,
  AlertCircle, Clock, Calendar, ChevronRight, FileText, Globe,
} from "lucide-react";

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

const kpis = [
  { label: "Coverage Reports",   value: "14",  sub: "published this FY",      icon: FileText,   color: PRIMARY },
  { label: "Briefings Scheduled",value: "3",   sub: "next 30 days",           icon: Calendar,   color: BLUE },
  { label: "Analyst Mentions",   value: "47",  sub: "across all reports",     icon: BookOpen,   color: AMBER },
  { label: "Positive Coverage",  value: "71%", sub: "vs 58% industry avg",    icon: TrendingUp, color: GREEN },
];

const analysts = [
  {
    name: "Mark Beccue",        firm: "Omdia",     focus: "AI / Automation",   lastBriefing: "Feb 2026",
    sentiment: "Positive", coverageCount: 6,
  },
  {
    name: "Craig Le Clair",     firm: "Forrester", focus: "AI Agents",         lastBriefing: "Jan 2026",
    sentiment: "Neutral",  coverageCount: 4,
  },
  {
    name: "Erick Brethenoux",   firm: "Gartner",   focus: "AI Strategy",       lastBriefing: "Mar 2026",
    sentiment: "Positive", coverageCount: 8,
  },
  {
    name: "Whit Andrews",       firm: "Gartner",   focus: "AI Platforms",      lastBriefing: "Nov 2025",
    sentiment: "Neutral",  coverageCount: 3,
  },
];

const briefings = [
  { analyst: "Erick Brethenoux", firm: "Gartner",   date: "May 22, 2026",  topic: "OGI Platform — Q2 Update",         status: "Scheduled" },
  { analyst: "Mark Beccue",      firm: "Omdia",     date: "Jun 3, 2026",   topic: "BFSI Vertical Strategy",           status: "Confirmed" },
  { analyst: "Craig Le Clair",   firm: "Forrester", date: "Jun 18, 2026",  topic: "AI Agent Orchestration Use Cases", status: "Tentative" },
];

const coverageReports = [
  {
    title: "Now Tech: AI Agent Platforms Q2 2026",   firm: "Forrester",
    sentiment: "Positive", date: "Apr 2026",
    quote: "Lyzr AI stands out for its enterprise-grade agentic orchestration capabilities.",
  },
  {
    title: "Market Radar: Enterprise AI Assistants",  firm: "Omdia",
    sentiment: "Positive", date: "Mar 2026",
    quote: "Lyzr's OGI framework addresses a critical gap in governed multi-agent systems.",
  },
  {
    title: "Gartner Hype Cycle: AI Platform Vendors", firm: "Gartner",
    sentiment: "Neutral",  date: "Feb 2026",
    quote: "Lyzr AI listed as a Sample Vendor in the AI Agent Orchestration segment.",
  },
  {
    title: "AI in Financial Services — Vendor Landscape", firm: "Omdia",
    sentiment: "Positive", date: "Jan 2026",
    quote: "Lyzr AI's BFSI-focused agentic solutions demonstrate strong differentiation.",
  },
];

const submissions = [
  { inquiry: "Forrester Wave: AI Agents Q3 2026",    submitted: "Apr 10, 2026", status: "In Review" },
  { inquiry: "Gartner Magic Quadrant — AI Platforms", submitted: "Mar 28, 2026", status: "Responded" },
  { inquiry: "IDC MarketScape: AI Orchestration",    submitted: "May 1, 2026",  status: "Submitted" },
  { inquiry: "Omdia Universe: Enterprise AI 2026",   submitted: "Feb 15, 2026", status: "Responded" },
];

const sentimentColor: Record<string, string> = { Positive: GREEN, Neutral: AMBER, Negative: RED };
const subStatusColor: Record<string, string>  = { Submitted: BLUE, "In Review": AMBER, Responded: GREEN };

type Tab = "roster" | "briefings" | "coverage" | "submissions";

export default function AnalystRelations() {
  const [tab, setTab] = useState<Tab>("roster");

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "32px 40px", fontFamily: "inherit" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>Analyst Relations</h1>
            <p style={{ margin: "4px 0 0", color: MUTED, fontSize: 14 }}>
              Gartner, Forrester, Omdia coverage management · FY2026
            </p>
          </div>
          <button style={{
            background: PRIMARY, color: "#fff", border: "none", borderRadius: 10,
            padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Calendar size={14} /> Schedule Briefing
          </button>
        </div>
      </motion.div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 22px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: MUTED, fontWeight: 500 }}>{k.label}</p>
                <p style={{ margin: "6px 0 2px", fontSize: 28, fontWeight: 800, color: DARK_TEXT }}>{k.value}</p>
                <p style={{ margin: 0, fontSize: 12, color: MUTED }}>{k.sub}</p>
              </div>
              <div style={{ background: `${k.color}18`, borderRadius: 10, padding: 10 }}>
                <k.icon size={20} color={k.color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4, background: CARD, border: `1px solid ${BORDER}`,
        borderRadius: 10, padding: 4, marginBottom: 24, width: "fit-content",
      }}>
        {([
          { key: "roster",      label: "Analyst Roster" },
          { key: "briefings",   label: "Briefing Calendar" },
          { key: "coverage",    label: "Coverage Tracker" },
          { key: "submissions", label: "Submission Manager" },
        ] as { key: Tab; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 12,
              background: tab === t.key ? PRIMARY : "transparent",
              color: tab === t.key ? "#fff" : MUTED,
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Analyst Roster */}
      {tab === "roster" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
            {analysts.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 22px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: DARK_TEXT }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{a.firm} · {a.focus}</div>
                  </div>
                  <span style={{
                    background: `${sentimentColor[a.sentiment]}20`,
                    color: sentimentColor[a.sentiment],
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 9999,
                  }}>{a.sentiment}</span>
                </div>
                <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
                  <div>
                    <div style={{ fontSize: 10, color: MUTED }}>Last Briefing</div>
                    <div style={{ fontWeight: 600, fontSize: 12, color: DARK_TEXT, marginTop: 3 }}>{a.lastBriefing}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: MUTED }}>Coverage Count</div>
                    <div style={{ fontWeight: 600, fontSize: 12, color: DARK_TEXT, marginTop: 3 }}>{a.coverageCount} reports</div>
                  </div>
                </div>
                <button style={{
                  marginTop: 14, width: "100%", background: `${PRIMARY}12`, color: PRIMARY,
                  border: `1px solid ${PRIMARY}30`, borderRadius: 8, padding: "8px",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  Schedule Briefing <ChevronRight size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Briefing Calendar */}
      {tab === "briefings" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {briefings.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 22px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ background: `${PRIMARY}15`, borderRadius: 10, padding: 11 }}>
                    <Calendar size={18} color={PRIMARY} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: DARK_TEXT }}>{b.analyst}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{b.firm} · {b.topic}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: DARK_TEXT }}>{b.date}</div>
                  </div>
                  <span style={{
                    background: b.status === "Confirmed" ? `${GREEN}20` : b.status === "Scheduled" ? `${BLUE}20` : `${AMBER}20`,
                    color: b.status === "Confirmed" ? GREEN : b.status === "Scheduled" ? BLUE : AMBER,
                    fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 9999,
                  }}>{b.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Coverage Tracker */}
      {tab === "coverage" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {coverageReports.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 22px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: DARK_TEXT }}>{r.title}</span>
                      <span style={{
                        background: `${sentimentColor[r.sentiment]}20`,
                        color: sentimentColor[r.sentiment],
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999,
                      }}>{r.sentiment}</span>
                    </div>
                    <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>
                      {r.firm} · {r.date}
                    </div>
                    <div style={{
                      background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px",
                      fontSize: 12, color: DARK_TEXT, fontStyle: "italic", lineHeight: 1.5,
                    }}>
                      "{r.quote}"
                    </div>
                  </div>
                  <button style={{
                    marginLeft: 16, background: `${PRIMARY}12`, color: PRIMARY, border: `1px solid ${PRIMARY}30`,
                    borderRadius: 8, padding: "8px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
                  }}>
                    View <Globe size={11} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Submission Manager */}
      {tab === "submissions" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: `${PRIMARY}10`, borderBottom: `1px solid ${BORDER}` }}>
                  {["Analyst Inquiry", "Submitted", "Status"].map((h) => (
                    <th key={h} style={{
                      padding: "14px 22px", textAlign: "left",
                      fontSize: 12, fontWeight: 700, color: PRIMARY,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{ borderBottom: `1px solid ${BORDER}` }}
                  >
                    <td style={{ padding: "16px 22px", fontWeight: 600, fontSize: 13, color: DARK_TEXT }}>{s.inquiry}</td>
                    <td style={{ padding: "16px 22px", fontSize: 12, color: MUTED }}>{s.submitted}</td>
                    <td style={{ padding: "16px 22px" }}>
                      <span style={{
                        background: `${subStatusColor[s.status]}20`,
                        color: subStatusColor[s.status],
                        fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 9999,
                      }}>{s.status}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
