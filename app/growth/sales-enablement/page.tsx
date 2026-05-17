"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, TrendingUp, DollarSign, Users, CheckCircle,
  AlertCircle, ChevronRight, Download, BarChart3,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

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
  { label: "Content Used",    value: "234",    sub: "assets this quarter",   icon: FileText,    color: PRIMARY },
  { label: "Win Rate",        value: "34%",    sub: "+3% vs last quarter",   icon: TrendingUp,  color: GREEN },
  { label: "Avg Deal Size",   value: "$127K",  sub: "up from $98K",          icon: DollarSign,  color: BLUE },
  { label: "Active Deals",    value: "18",     sub: "across all stages",     icon: Users,       color: AMBER },
];

const contentRows = [
  { name: "OGI Whitepaper",                     views: 340, downloads: 180, shares: 67, revenue: "$290K" },
  { name: "BFSI Case Study",                    views: 220, downloads: 95,  shares: 45, revenue: "$180K" },
  { name: "Agentic OS Demo Video",              views: 180, downloads: 0,   shares: 38, revenue: "$95K" },
  { name: "Competitive Battlecard — Moveworks", views: 120, downloads: 110, shares: 89, revenue: "$340K" },
];

const winLossData = [
  { name: "Win",         value: 34, color: GREEN },
  { name: "Loss",        value: 28, color: RED },
  { name: "No Decision", value: 38, color: AMBER },
];

const recentDeals = [
  { company: "Accenture",    value: "$890K", outcome: "Win",  reason: "Superior agentic capability, strong POC" },
  { company: "Hitachi",      value: "$340K", outcome: "Win",  reason: "Best ROI model, executive sponsor" },
  { company: "Competitor A", value: "$220K", outcome: "Loss", reason: "Budget freeze, incumbent vendor renewed" },
  { company: "Infosys",      value: "$95K",  outcome: "Win",  reason: "Competitive pricing, BFSI references" },
];

const dealQueue = [
  {
    company: "Goldman Sachs", value: "$890K", request: "Custom BFSI Case Study",
    urgency: "High", daysOpen: 3,
  },
  {
    company: "JPMorgan", value: "$380K", request: "ROI Calculator (custom)",
    urgency: "Medium", daysOpen: 7,
  },
  {
    company: "Microsoft", value: "$520K", request: "Competitive Battlecard vs Copilot",
    urgency: "Medium", daysOpen: 5,
  },
];

type Tab = "content" | "winloss" | "queue";

export default function SalesEnablement() {
  const [tab, setTab] = useState<Tab>("content");
  const [showContentReq, setShowContentReq] = useState(false);
  const [reqSending, setReqSending] = useState(false);
  const [reqDone, setReqDone] = useState(false);
  const [reqForm, setReqForm] = useState({ company: "", asset: "Case Study", urgency: "High" });

  function handleSendReq() {
    setReqSending(true);
    setTimeout(() => { setReqSending(false); setReqDone(true); setTimeout(() => { setReqDone(false); setShowContentReq(false); }, 2000); }, 2000);
  }

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "32px 40px", fontFamily: "inherit" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>Sales Enablement</h1>
            <p style={{ margin: "4px 0 0", color: MUTED, fontSize: 14 }}>
              Content performance, win/loss intelligence & deal support · Q2 FY2026
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowContentReq(true)}
              style={{ background: CARD, color: PRIMARY, border: `1px solid ${PRIMARY}`, borderRadius: 10, padding: "10px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <ChevronRight size={14} /> Request Content for Deal
            </button>
            <button style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>
      </motion.div>

      {/* Workflow banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 16px", marginBottom: 20, flexWrap: "wrap" as const }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: MUTED, textTransform: "uppercase" as const, marginRight: 4 }}>Workflow</span>
        {["1. Brief", "2. Research", "3. Draft", "4. Review", "5. Distribute"].map((step, i) => (
          <span key={step} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && <span style={{ color: MUTED, fontSize: 12 }}>›</span>}
            <span style={{ fontSize: 12, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? PRIMARY : MUTED }}>{step}</span>
          </span>
        ))}
        <a href="/content-studio" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#fff", background: PRIMARY, border: "none", borderRadius: 7, padding: "6px 12px", cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap" as const }}>
          Create Content in Studio →
        </a>
      </div>

      {/* Content Request Modal */}
      {showContentReq && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowContentReq(false)}>
          <div style={{ background: CARD, borderRadius: 16, padding: 28, width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 17, color: DARK_TEXT, margin: 0 }}>Request Content for Deal</h3>
              <button onClick={() => setShowContentReq(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 18 }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>Target Company</label>
                <input value={reqForm.company} onChange={e => setReqForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. Goldman Sachs" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, color: DARK_TEXT, boxSizing: "border-box" as const }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>Asset Type</label>
                <select value={reqForm.asset} onChange={e => setReqForm(f => ({ ...f, asset: e.target.value }))} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, color: DARK_TEXT }}>
                  {["Case Study", "ROI Calculator", "Competitive Battlecard", "One-Pager", "Demo Script"].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>Urgency</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["High", "Medium", "Low"].map(u => (
                    <button key={u} onClick={() => setReqForm(f => ({ ...f, urgency: u }))} style={{ flex: 1, padding: "7px", borderRadius: 8, border: `1px solid ${reqForm.urgency === u ? PRIMARY : BORDER}`, background: reqForm.urgency === u ? `${PRIMARY}15` : "transparent", color: reqForm.urgency === u ? PRIMARY : MUTED, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{u}</button>
                  ))}
                </div>
              </div>
              <button onClick={handleSendReq} disabled={reqSending} style={{ padding: "11px", background: reqDone ? GREEN : PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                {reqSending ? "Sending to Content Studio…" : reqDone ? "✓ Request Sent!" : "Send to Content Studio"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
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
          { key: "content", label: "Content Usage" },
          { key: "winloss", label: "Win / Loss Analysis" },
          { key: "queue",   label: "Deal Support Queue" },
        ] as { key: Tab; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 13,
              background: tab === t.key ? PRIMARY : "transparent",
              color: tab === t.key ? "#fff" : MUTED,
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content Usage tab */}
      {tab === "content" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: `${PRIMARY}10`, borderBottom: `1px solid ${BORDER}` }}>
                  {["Content Piece", "Views", "Downloads", "Sales Shares", "Influenced Revenue"].map((h) => (
                    <th key={h} style={{
                      padding: "14px 20px", textAlign: "left", fontSize: 12,
                      fontWeight: 700, color: PRIMARY, whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contentRows.map((row, i) => (
                  <motion.tr
                    key={row.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{ borderBottom: `1px solid ${BORDER}` }}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ background: `${PRIMARY}15`, borderRadius: 8, padding: 7 }}>
                          <FileText size={14} color={PRIMARY} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 13, color: DARK_TEXT }}>{row.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: 13, color: DARK_TEXT, fontWeight: 600 }}>{row.views}</td>
                    <td style={{ padding: "16px 20px", fontSize: 13, color: DARK_TEXT, fontWeight: 600 }}>{row.downloads}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        background: `${BLUE}15`, color: BLUE, fontWeight: 700,
                        fontSize: 13, padding: "3px 10px", borderRadius: 9999,
                      }}>{row.shares}</span>
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 800, color: GREEN }}>{row.revenue}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Win/Loss tab */}
      {tab === "winloss" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>
            {/* Pie */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>Outcome Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={winLossData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value">
                    {winLossData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
                    formatter={(v: any) => [`${v}%`, ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                {winLossData.map((d) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color }} />
                    <span style={{ fontSize: 13, color: DARK_TEXT }}>{d.name}</span>
                    <span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 13, color: d.color }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent deals table */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>Recent Deals</h3>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: `${PRIMARY}08`, borderBottom: `1px solid ${BORDER}` }}>
                    {["Company", "Deal Value", "Outcome", "Key Reason"].map((h) => (
                      <th key={h} style={{
                        padding: "12px 20px", textAlign: "left", fontSize: 12,
                        fontWeight: 700, color: PRIMARY,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentDeals.map((d, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.07 }}
                      style={{ borderBottom: `1px solid ${BORDER}` }}
                    >
                      <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: 13, color: DARK_TEXT }}>{d.company}</td>
                      <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: 13, color: DARK_TEXT }}>{d.value}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          background: d.outcome === "Win" ? `${GREEN}20` : `${RED}20`,
                          color: d.outcome === "Win" ? GREEN : RED,
                          fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 9999,
                        }}>{d.outcome}</span>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 12, color: MUTED }}>{d.reason}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Deal Support Queue */}
      {tab === "queue" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {dealQueue.map((deal, i) => (
              <motion.div
                key={deal.company}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px",
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24,
                }}
              >
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ background: `${PRIMARY}15`, borderRadius: 12, padding: 14 }}>
                    <BarChart3 size={22} color={PRIMARY} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: DARK_TEXT }}>{deal.company}</div>
                    <div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>
                      Deal Value: <strong style={{ color: DARK_TEXT }}>{deal.value}</strong>
                    </div>
                    <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>
                      Request: <strong style={{ color: DARK_TEXT }}>{deal.request}</strong>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: MUTED }}>Urgency</div>
                    <span style={{
                      background: deal.urgency === "High" ? `${RED}20` : `${AMBER}20`,
                      color: deal.urgency === "High" ? RED : AMBER,
                      fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 9999,
                      display: "block", marginTop: 4,
                    }}>{deal.urgency}</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: MUTED }}>Open</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: DARK_TEXT, marginTop: 4 }}>{deal.daysOpen}d</div>
                  </div>
                  <button style={{
                    background: PRIMARY, color: "#fff", border: "none", borderRadius: 10,
                    padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    Assign <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
