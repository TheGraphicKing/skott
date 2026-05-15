"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, BarChart3, Filter, Plus, ChevronRight, Clock,
  CheckCircle, TrendingUp, Target, FileText, Star,
  Search, Tag, Calendar, ArrowRight, Sparkles, Settings,
  Zap, Globe, AlertCircle,
} from "lucide-react";

// ─── Design Tokens ───────────────────────────────────────────────────────────
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

// ─── KPIs ────────────────────────────────────────────────────────────────────
const kpis = [
  { label: "Total Leads",   value: "3,420", sub: "+284 this week",    icon: Users,      color: PRIMARY },
  { label: "MQL Rate",      value: "28%",   sub: "target: 30%",       icon: TrendingUp, color: GREEN   },
  { label: "Avg Lead Score", value: "64",   sub: "MQL threshold: 60", icon: Star,       color: AMBER   },
  { label: "Data Quality",  value: "87%",   sub: "+2% vs last month", icon: CheckCircle, color: BLUE   },
];

// ─── Lead Queue ───────────────────────────────────────────────────────────────
const leads = [
  { name: "Priya Sharma",    company: "HDFC Bank",          score: 84, source: "LinkedIn ABM", stage: "MQL",       assigned: "Raj Patel",   date: "May 14" },
  { name: "Marcus Reid",     company: "JP Morgan Chase",    score: 92, source: "Demo Request",  stage: "SQL",       assigned: "Sarah Chen",  date: "May 14" },
  { name: "Aiko Tanaka",     company: "Mitsubishi UFJ",     score: 76, source: "OGI Whitepaper", stage: "MQL",      assigned: "Raj Patel",   date: "May 13" },
  { name: "Olivia Bennett",  company: "Standard Chartered", score: 61, source: "Webinar",       stage: "MQL",       assigned: "Dev Kumar",   date: "May 13" },
  { name: "Carlos Mendes",   company: "Nubank",             score: 48, source: "SEO Organic",   stage: "Lead",      assigned: "—",           date: "May 12" },
  { name: "Simone Dupont",   company: "BNP Paribas",        score: 88, source: "Referral",      stage: "SQL",       assigned: "Sarah Chen",  date: "May 12" },
  { name: "Rajan Krishnan",  company: "ICICI Bank",         score: 55, source: "Email Nurture", stage: "Lead",      assigned: "Dev Kumar",   date: "May 11" },
  { name: "Emily Walsh",     company: "Barclays",           score: 71, source: "G2 Review",     stage: "MQL",       assigned: "Raj Patel",   date: "May 11" },
  { name: "Chen Wei",        company: "Ping An Insurance",  score: 95, source: "Demo Request",  stage: "Oppty",     assigned: "Sarah Chen",  date: "May 10" },
  { name: "Arun Mehta",      company: "Kotak Mahindra",     score: 43, source: "SEO Organic",   stage: "Lead",      assigned: "—",           date: "May 10" },
];

// ─── Scoring Model ────────────────────────────────────────────────────────────
const scoringCriteria = [
  { category: "Demographics", max: 30, color: BLUE, items: [{ name: "Job Title (C-Suite/VP)", pts: 15 }, { name: "Company Size (>500)", pts: 10 }, { name: "Industry (BFSI/FS)", pts: 5 }] },
  { category: "Behavioral", max: 50, color: PRIMARY, items: [{ name: "Website Visits (3+)", pts: 15 }, { name: "Content Downloads", pts: 20 }, { name: "Demo Request", pts: 15 }] },
  { category: "Engagement", max: 20, color: GREEN, items: [{ name: "Email Opens (5+)", pts: 5 }, { name: "Email Clicks (2+)", pts: 10 }, { name: "Social Interaction", pts: 5 }] },
];

// ─── UTM Data ────────────────────────────────────────────────────────────────
const utmRows = [
  { campaign: "bfsi-vertical-launch",  source: "linkedin",  medium: "paid-social", url: "lyzr.ai/solutions/bfsi", clicks: "4,280", conversions: "312" },
  { campaign: "ogi-whitepaper-q2",     source: "google",    medium: "cpc",         url: "lyzr.ai/ogi-report",     clicks: "2,840", conversions: "184" },
  { campaign: "series-a-announce",     source: "techcrunch", medium: "pr",         url: "lyzr.ai/blog/series-a",  clicks: "6,120", conversions: "89"  },
  { campaign: "aws-partnership",       source: "email",     medium: "newsletter",  url: "lyzr.ai/partners/aws",   clicks: "1,840", conversions: "124" },
  { campaign: "hitachi-case-study",    source: "linkedin",  medium: "organic",     url: "lyzr.ai/case-studies/hitachi", clicks: "920", conversions: "42" },
  { campaign: "apac-webinar-may",      source: "linkedin",  medium: "paid-social", url: "lyzr.ai/webinars/apac-may", clicks: "2,140", conversions: "218" },
];

const TABS = ["Lead Queue", "Scoring Model", "Routing Map", "UTM Manager"];

const stageBadge = (stage: string) => {
  const styles: Record<string, { bg: string; color: string }> = {
    Lead:  { bg: BORDER,      color: MUTED    },
    MQL:   { bg: AMBER + "20", color: AMBER  },
    SQL:   { bg: BLUE + "20",  color: BLUE   },
    Oppty: { bg: GREEN + "20", color: GREEN  },
  };
  return styles[stage] || styles["Lead"];
};

function ScoreBar({ score, max, color }: { score: number; max: number; color: string }) {
  return (
    <div style={{ width: "100%", height: 6, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${(score / max) * 100}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ height: "100%", background: color, borderRadius: 99 }} />
    </div>
  );
}

export default function LeadOpsPage() {
  const [activeTab, setActiveTab] = useState("Lead Queue");
  const [expandedLead, setExpandedLead] = useState<number | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showUtmModal, setShowUtmModal] = useState(false);
  const [filterScore, setFilterScore] = useState("All");
  const [filterStage, setFilterStage] = useState("All");

  const filteredLeads = leads.filter(l => {
    const scoreOk = filterScore === "All" || (filterScore === "60+" && l.score >= 60) || (filterScore === "80+" && l.score >= 80) || (filterScore === "<60" && l.score < 60);
    const stageOk = filterStage === "All" || l.stage === filterStage;
    return scoreOk && stageOk;
  });

  return (
    <div style={{ background: PAGE_BG, minHeight: "100vh", padding: "32px" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users size={20} style={{ color: PRIMARY }} />
              <span style={{ color: MUTED, fontSize: 13 }}>Digital / Lead Operations</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: DARK_TEXT }}>Lead Operations</h1>
          </div>
          <button style={{ background: PRIMARY, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> Import Leads
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 13, color: MUTED }}>{k.label}</span>
                <div style={{ background: k.color + "18", padding: 8, borderRadius: 8 }}>
                  <k.icon size={16} style={{ color: k.color }} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: DARK_TEXT }}>{k.value}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{k.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4, width: "fit-content" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: "7px 18px", borderRadius: 7, fontSize: 13, fontWeight: activeTab === t ? 600 : 400,
                background: activeTab === t ? PRIMARY : "transparent", color: activeTab === t ? "#fff" : MUTED, cursor: "pointer", border: "none", transition: "all 0.2s" }}>
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── Lead Queue ── */}
        {activeTab === "Lead Queue" && (
          <motion.div key="queue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Filter Bar */}
            <div className="flex items-center gap-3 mb-4">
              <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: MUTED }} />
                <input placeholder="Search leads…" style={{ width: "100%", padding: "7px 12px 7px 32px", borderRadius: 7, border: `1px solid ${BORDER}`, background: CARD, fontSize: 13, color: DARK_TEXT, outline: "none" }} />
              </div>
              <select value={filterScore} onChange={e => setFilterScore(e.target.value)}
                style={{ padding: "7px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: CARD, fontSize: 13, color: DARK_TEXT, cursor: "pointer" }}>
                <option>All</option><option>60+</option><option>80+</option><option>&lt;60</option>
              </select>
              <select value={filterStage} onChange={e => setFilterStage(e.target.value)}
                style={{ padding: "7px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: CARD, fontSize: 13, color: DARK_TEXT, cursor: "pointer" }}>
                <option>All</option><option>Lead</option><option>MQL</option><option>SQL</option><option>Oppty</option>
              </select>
            </div>

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: PAGE_BG }}>
                    {["Lead", "Company", "Score", "Source", "Stage", "Assigned To", "Date", ""].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: MUTED, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((l, i) => (
                    <>
                      <motion.tr key={l.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        style={{ borderBottom: `1px solid ${BORDER}`, cursor: "pointer" }}
                        onClick={() => setExpandedLead(expandedLead === i ? null : i)}>
                        <td style={{ padding: "12px 16px" }}>
                          <div className="flex items-center gap-2">
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: PRIMARY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                              {l.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{l.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: MUTED }}>{l.company}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: l.score >= 80 ? GREEN : l.score >= 60 ? AMBER : RED }}>{l.score}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: MUTED }}>{l.source}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 5, fontWeight: 600, ...stageBadge(l.stage) }}>{l.stage}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: DARK_TEXT }}>{l.assigned}</td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: MUTED }}>{l.date}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <ChevronRight size={14} style={{ color: MUTED, transform: expandedLead === i ? "rotate(90deg)" : "none", transition: "all 0.2s" }} />
                        </td>
                      </motion.tr>
                      {expandedLead === i && (
                        <tr key={`${l.name}-expanded`}>
                          <td colSpan={8} style={{ padding: 0, borderBottom: `1px solid ${BORDER}` }}>
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              style={{ padding: "16px 24px", background: PAGE_BG, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                              {[
                                { label: "Email", value: `${l.name.split(" ")[0].toLowerCase()}@${l.company.toLowerCase().replace(/\s/g, "")}.com` },
                                { label: "Phone", value: "+1 (555) 000-0000" },
                                { label: "Last Activity", value: `Viewed /pricing — ${l.date}` },
                                { label: "Score Breakdown", value: "Demo (15) + Downloads (20) + Visit (10)" },
                              ].map(d => (
                                <div key={d.label}>
                                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 2 }}>{d.label}</div>
                                  <div style={{ fontSize: 13, color: DARK_TEXT, fontWeight: 500 }}>{d.value}</div>
                                </div>
                              ))}
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── Scoring Model ── */}
        {activeTab === "Scoring Model" && (
          <motion.div key="scoring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowScoreModal(true)} style={{ background: PRIMARY, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Settings size={14} /> Edit Model
              </button>
            </div>

            {/* Thresholds */}
            <div className="flex gap-4 mb-6">
              {[{ label: "MQL Threshold", value: "60+", color: AMBER }, { label: "SQL Threshold", value: "80+", color: GREEN }].map(t => (
                <div key={t.label} style={{ background: CARD, border: `2px solid ${t.color}40`, borderRadius: 10, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
                  <div>
                    <div style={{ fontSize: 12, color: MUTED }}>{t.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: t.color }}>{t.value} pts</div>
                  </div>
                </div>
              ))}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 24px" }}>
                <div style={{ fontSize: 12, color: MUTED }}>Max Possible Score</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: DARK_TEXT }}>100 pts</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {scoringCriteria.map((cat, ci) => (
                <motion.div key={cat.category} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}
                  style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>{cat.category}</div>
                      <div style={{ fontSize: 12, color: MUTED }}>{cat.max} pts max</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: cat.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: cat.color }}>
                      {cat.max}
                    </div>
                  </div>
                  <ScoreBar score={cat.max} max={100} color={cat.color} />
                  <div className="flex flex-col gap-3 mt-4">
                    {cat.items.map(item => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div style={{ fontSize: 13, color: DARK_TEXT }}>{item.name}</div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: cat.color, background: cat.color + "15", padding: "2px 8px", borderRadius: 4 }}>+{item.pts}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Score Visual */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, marginTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: DARK_TEXT, marginBottom: 16 }}>Score Distribution — Current Leads (3,420)</div>
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 80 }}>
                {[
                  { range: "0-20", count: 180, pct: 22 }, { range: "21-40", count: 420, pct: 52 }, { range: "41-60", count: 840, pct: 100 },
                  { range: "61-80", count: 680, pct: 81 }, { range: "81-100", count: 420, pct: 50 },
                ].map(b => (
                  <div key={b.range} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ fontSize: 10, color: MUTED }}>{b.count}</div>
                    <motion.div initial={{ height: 0 }} animate={{ height: b.pct * 0.6 }} transition={{ duration: 0.8, delay: 0.2 }}
                      style={{ width: "100%", background: b.range === "61-80" ? AMBER : b.range === "81-100" ? GREEN : BLUE + "60", borderRadius: "4px 4px 0 0" }} />
                    <div style={{ fontSize: 10, color: MUTED }}>{b.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Routing Map ── */}
        {activeTab === "Routing Map" && (
          <motion.div key="routing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Flow Diagram */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 32, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, marginBottom: 24 }}>Lead Routing Flow</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
                {[
                  { label: "New Lead", sub: "Score assigned", color: BLUE },
                  null,
                  { label: "MQL (60+)", sub: "Auto-qualified", color: AMBER },
                  null,
                  { label: "SDR Assignment", sub: "Round-robin / rule-based", color: PRIMARY },
                  null,
                  { label: "First Touch", sub: "Within 4 business hours", color: GREEN },
                  null,
                  { label: "AE Handoff", sub: "SQL (80+) threshold", color: "#7c3aed" },
                ].map((step, i) =>
                  step === null ? (
                    <div key={i} style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ width: 20, height: 2, background: BORDER }} />
                      <ArrowRight size={14} style={{ color: MUTED }} />
                    </div>
                  ) : (
                    <motion.div key={step.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                      style={{ minWidth: 130, background: step.color + "12", border: `2px solid ${step.color}30`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: step.color }}>{step.label}</div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{step.sub}</div>
                    </motion.div>
                  )
                )}
              </div>
            </div>

            {/* Routing Rules */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Routing Rules</div>
              <div className="flex flex-col gap-3">
                {[
                  { condition: "Enterprise (>500 employees)", action: "→ Raj Patel's Enterprise SDR team", priority: "High" },
                  { condition: "BFSI / Financial Services vertical", action: "→ Sarah Chen review queue first", priority: "High" },
                  { condition: "APAC region (IP-based)", action: "→ Arun Rao's regional team", priority: "Medium" },
                  { condition: "Inbound Demo Request (any size)", action: "→ Immediate AE notification + 15 min SLA", priority: "Critical" },
                  { condition: "Score 80+ (SQL)", action: "→ Direct AE assignment, skip SDR", priority: "High" },
                  { condition: "Unassigned after 2 hours", action: "→ Escalate to team lead + Slack alert", priority: "Medium" },
                ].map((rule, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", background: PAGE_BG, borderRadius: 8, border: `1px solid ${BORDER}` }}>
                    <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, fontWeight: 600, background: rule.priority === "Critical" ? RED + "18" : rule.priority === "High" ? AMBER + "18" : BLUE + "18", color: rule.priority === "Critical" ? RED : rule.priority === "High" ? AMBER : BLUE }}>
                      {rule.priority}
                    </span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>IF </span>
                      <span style={{ fontSize: 13, color: DARK_TEXT }}>{rule.condition}</span>
                    </div>
                    <div style={{ fontSize: 13, color: GREEN, fontWeight: 500 }}>{rule.action}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── UTM Manager ── */}
        {activeTab === "UTM Manager" && (
          <motion.div key="utm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowUtmModal(true)} style={{ background: PRIMARY, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Plus size={14} /> New UTM
              </button>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: PAGE_BG }}>
                    {["Campaign", "Source", "Medium", "URL", "Clicks", "Conversions", ""].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: MUTED, borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {utmRows.map((u, i) => (
                    <motion.tr key={u.campaign} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                      style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: DARK_TEXT, fontFamily: "monospace" }}>{u.campaign}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: BLUE + "18", color: BLUE }}>{u.source}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: AMBER + "18", color: AMBER }}>{u.medium}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: MUTED, fontFamily: "monospace" }}>{u.url}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{u.clicks}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: GREEN }}>{u.conversions}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <button style={{ fontSize: 11, padding: "3px 8px", borderRadius: 5, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, cursor: "pointer" }}>Copy URL</button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score Modal */}
      <AnimatePresence>
        {showScoreModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setShowScoreModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ background: CARD, borderRadius: 14, padding: 28, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>Edit Scoring Model</h3>
              {["Job Title", "Company Size", "Industry", "Website Visits", "Content Downloads", "Demo Request", "Email Opens", "Email Clicks", "Social"].map(field => (
                <div key={field} className="flex items-center justify-between mb-3">
                  <label style={{ fontSize: 13, color: DARK_TEXT }}>{field}</label>
                  <input type="number" defaultValue={10} style={{ width: 70, padding: "5px 10px", borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 13, color: DARK_TEXT, textAlign: "center" }} />
                </div>
              ))}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowScoreModal(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                <button onClick={() => setShowScoreModal(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, background: PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Model</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showUtmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setShowUtmModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ background: CARD, borderRadius: 14, padding: 28, width: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>Create UTM Link</h3>
              {[{ label: "Campaign Name", ph: "e.g. bfsi-vertical-launch" }, { label: "Source", ph: "e.g. linkedin" }, { label: "Medium", ph: "e.g. paid-social" }, { label: "Base URL", ph: "e.g. lyzr.ai/solutions/bfsi" }].map(f => (
                <div key={f.label} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>{f.label}</label>
                  <input placeholder={f.ph} style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT, outline: "none" }} />
                </div>
              ))}
              <div style={{ padding: 12, background: PAGE_BG, borderRadius: 7, fontSize: 12, fontFamily: "monospace", color: MUTED, marginBottom: 16 }}>
                https://lyzr.ai/solutions/bfsi?utm_campaign=...&utm_source=...&utm_medium=...
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowUtmModal(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                <button onClick={() => setShowUtmModal(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, background: PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Generate UTM</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
