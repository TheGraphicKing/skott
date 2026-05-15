"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, TrendingUp, BarChart3, Target, Users,
  CheckCircle, AlertCircle, Plus, Edit, Trash2, Eye,
  ArrowUp, ArrowDown, RefreshCw, Download, Filter,
  Activity, Share2, Clock,
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

// ─── Sub-tab config ───────────────────────────────────────────────────────────
const TABS = ["Overview", "Campaigns", "Budget Optimizer", "Attribution"];

// ─── Overview Data ────────────────────────────────────────────────────────────
const kpis = [
  { label: "Total Spend",         value: "$282K",  icon: DollarSign, color: BLUE,  sub: "MTD spend" },
  { label: "Pipeline Generated",  value: "$3.9M",  icon: TrendingUp, color: GREEN, sub: "attributed pipeline" },
  { label: "Avg CAC",             value: "$312",   icon: Target,     color: AMBER, sub: "cost per customer" },
  { label: "ROAS",                value: "4.2×",   icon: BarChart3,  color: PRIMARY, sub: "return on ad spend" },
];

const channels = [
  { name: "Google Search",   spend: "$142K", clicks: "48K",  ctr: "2.80%", cac: "$384", roas: 3.8, color: BLUE  },
  { name: "LinkedIn Ads",    spend: "$98K",  clicks: "12K",  ctr: "0.82%", cac: "$284", roas: 5.8, color: PRIMARY },
  { name: "Google Display",  spend: "$28K",  clicks: "124K", ctr: "0.18%", cac: "$520", roas: 1.9, color: AMBER },
  { name: "Retargeting",     spend: "$14K",  clicks: "89K",  ctr: "0.42%", cac: "$198", roas: 6.2, color: GREEN },
];

// ─── Campaigns Data ───────────────────────────────────────────────────────────
const campaignRows = [
  { name: "BFSI Enterprise Search",   channel: "Google",   status: "Active",  budget: "$800",  spendMtd: "$18.4K", impressions: "124K", clicks: "3,240", ctr: "2.61%", cpc: "$5.68",  conv: 42 },
  { name: "Agentic OS TOFU",          channel: "LinkedIn", status: "Active",  budget: "$600",  spendMtd: "$14.2K", impressions: "89K",  clicks: "1,890", ctr: "2.12%", cpc: "$7.51",  conv: 28 },
  { name: "Series A Announcement",    channel: "LinkedIn", status: "Active",  budget: "$400",  spendMtd: "$9.8K",  impressions: "67K",  clicks: "980",   ctr: "1.46%", cpc: "$10.00", conv: 15 },
  { name: "Retargeting — All Traffic",channel: "Google",   status: "Active",  budget: "$200",  spendMtd: "$4.6K",  impressions: "310K", clicks: "1,320", ctr: "0.43%", cpc: "$3.48",  conv: 24 },
  { name: "Hitachi Case Study",       channel: "LinkedIn", status: "Paused",  budget: "$300",  spendMtd: "$6.2K",  impressions: "42K",  clicks: "680",   ctr: "1.62%", cpc: "$9.12",  conv: 8  },
  { name: "Brand Awareness Display",  channel: "Google",   status: "Active",  budget: "$150",  spendMtd: "$3.4K",  impressions: "89K",  clicks: "160",   ctr: "0.18%", cpc: "$21.25", conv: 3  },
];

// ─── Budget Optimizer Data ────────────────────────────────────────────────────
const initialBudgets: Record<string, number> = {
  "Google Search":  142,
  "LinkedIn Ads":   98,
  "Google Display": 28,
  "Retargeting":    14,
};

// ─── Attribution Data ─────────────────────────────────────────────────────────
const attributionModels = ["Last-touch", "Linear", "Time-decay", "First-touch"];
const attributionData = [
  { campaign: "BFSI Enterprise Search",    "Last-touch": 38, "Linear": 28, "Time-decay": 32, "First-touch": 22 },
  { campaign: "Agentic OS TOFU",           "Last-touch": 12, "Linear": 22, "Time-decay": 18, "First-touch": 34 },
  { campaign: "Series A Announcement",     "Last-touch": 8,  "Linear": 15, "Time-decay": 12, "First-touch": 18 },
  { campaign: "Retargeting — All Traffic", "Last-touch": 28, "Linear": 18, "Time-decay": 24, "First-touch": 10 },
  { campaign: "Hitachi Case Study",        "Last-touch": 6,  "Linear": 10, "Time-decay": 8,  "First-touch": 8  },
  { campaign: "Brand Awareness Display",   "Last-touch": 4,  "Linear": 7,  "Time-decay": 6,  "First-touch": 8  },
];

// ─── Helper Components ────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600,
        background: isActive ? "hsl(142,55%,90%)" : "hsl(36,30%,92%)",
        color: isActive ? GREEN : MUTED,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? GREEN : MUTED, display: "inline-block" }} />
      {status}
    </span>
  );
}

function ChannelBadge({ channel }: { channel: string }) {
  const colorMap: Record<string, string> = {
    Google: BLUE, LinkedIn: PRIMARY,
  };
  const c = colorMap[channel] ?? MUTED;
  return (
    <span style={{ padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600, background: c + "22", color: c }}>
      {channel}
    </span>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const maxRoas = Math.max(...channels.map(c => c.roas));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {kpis.map((k, i) => (
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

      {/* Channel Table */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT }}>Channel Breakdown</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: PAGE_BG }}>
              {["Channel", "Spend", "Clicks / Impressions", "CTR", "CAC", "ROAS"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: MUTED }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {channels.map((ch, i) => (
              <tr key={ch.name} style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 1 ? PAGE_BG + "60" : "transparent" }}>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ fontWeight: 600, color: DARK_TEXT, fontSize: 14 }}>{ch.name}</span>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 14, color: DARK_TEXT, fontWeight: 600 }}>{ch.spend}</td>
                <td style={{ padding: "14px 20px", fontSize: 14, color: MUTED }}>{ch.clicks}</td>
                <td style={{ padding: "14px 20px", fontSize: 14, color: DARK_TEXT }}>{ch.ctr}</td>
                <td style={{ padding: "14px 20px", fontSize: 14, color: DARK_TEXT }}>{ch.cac}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ fontWeight: 700, color: ch.roas >= 4 ? GREEN : ch.roas >= 3 ? AMBER : RED }}>
                    {ch.roas}×
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ROAS Bar Chart */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>ROAS by Channel</h3>
        <svg viewBox="0 0 600 200" style={{ width: "100%", height: 200 }}>
          {channels.map((ch, i) => {
            const barW = 80;
            const gap = (600 - channels.length * barW) / (channels.length + 1);
            const x = gap + i * (barW + gap);
            const barH = (ch.roas / maxRoas) * 150;
            const y = 160 - barH;
            return (
              <g key={ch.name}>
                <rect x={x} y={y} width={barW} height={barH} rx={6} fill={ch.color} opacity={0.85} />
                <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize={13} fontWeight="700" fill={ch.color}>
                  {ch.roas}×
                </text>
                <text x={x + barW / 2} y={185} textAnchor="middle" fontSize={11} fill={MUTED}>
                  {ch.name.split(" ")[0]}
                </text>
              </g>
            );
          })}
          <line x1={0} y1={160} x2={600} y2={160} stroke={BORDER} strokeWidth={1} />
        </svg>
      </div>
    </div>
  );
}

// ─── Campaigns Tab ────────────────────────────────────────────────────────────
function CampaignsTab() {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT }}>Active Ad Campaigns</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: MUTED, cursor: "pointer" }}>
            <Filter size={14} /> Filter
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: MUTED, cursor: "pointer" }}>
            <Download size={14} /> Export
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: PRIMARY, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Plus size={14} /> New Campaign
          </button>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr style={{ background: PAGE_BG }}>
              {["Campaign", "Channel", "Status", "Daily Budget", "Spend MTD", "Impressions", "Clicks", "CTR", "CPC", "Conv."].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: MUTED, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaignRows.map((row, i) => (
              <motion.tr
                key={row.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 1 ? PAGE_BG + "50" : "transparent" }}
              >
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: DARK_TEXT, maxWidth: 200 }}>{row.name}</td>
                <td style={{ padding: "14px 16px" }}><ChannelBadge channel={row.channel} /></td>
                <td style={{ padding: "14px 16px" }}><StatusBadge status={row.status} /></td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: DARK_TEXT }}>{row.budget}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{row.spendMtd}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: MUTED }}>{row.impressions}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: DARK_TEXT }}>{row.clicks}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: DARK_TEXT }}>{row.ctr}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: DARK_TEXT }}>{row.cpc}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: GREEN }}>{row.conv}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Budget Optimizer Tab ─────────────────────────────────────────────────────
function BudgetOptimizerTab() {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [applied, setApplied] = useState(false);

  const recommended: Record<string, number> = {
    "Google Search":  130,
    "LinkedIn Ads":   113,
    "Google Display": 13,
    "Retargeting":    14,
  };

  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);

  function applyRecommendations() {
    setBudgets({ ...recommended });
    setApplied(true);
  }

  const projectedPipeline = applied ? "$4.08M" : "$3.9M";
  const projectedRoas = applied ? "4.8×" : "4.2×";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* AI Recommendation Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "hsl(142,55%,95%)", border: `1px solid hsl(142,55%,75%)`,
          borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 14,
        }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: GREEN + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Activity size={18} color={GREEN} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: DARK_TEXT, marginBottom: 4 }}>AI Recommendation</p>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>
            Based on ROAS and CAC performance, reallocate <strong style={{ color: DARK_TEXT }}>$15K from Google Display</strong> to{" "}
            <strong style={{ color: DARK_TEXT }}>LinkedIn ABM</strong> for a projected{" "}
            <strong style={{ color: GREEN }}>+$180K pipeline increase</strong> and ROAS improvement from 4.2× to 4.8×.
          </p>
        </div>
        <button
          onClick={applyRecommendations}
          style={{
            padding: "9px 18px", borderRadius: 8, border: "none", background: applied ? MUTED : GREEN,
            color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
          }}
        >
          {applied ? "Applied ✓" : "Apply Recommendations"}
        </button>
      </motion.div>

      {/* Sliders */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT }}>Channel Budget Allocation</h3>
          <span style={{ fontSize: 13, color: MUTED }}>Total: <strong style={{ color: DARK_TEXT }}>${totalBudget}K</strong></span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.entries(budgets).map(([ch, val]) => {
            const rec = recommended[ch];
            const diff = val - initialBudgets[ch];
            return (
              <div key={ch}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: DARK_TEXT }}>{ch}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {diff !== 0 && (
                      <span style={{ fontSize: 12, color: diff > 0 ? GREEN : RED, fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
                        {diff > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        {Math.abs(diff)}K
                      </span>
                    )}
                    <span style={{ fontSize: 14, fontWeight: 700, color: DARK_TEXT }}>${val}K</span>
                  </div>
                </div>
                <input
                  type="range" min={5} max={200} value={val}
                  onChange={e => setBudgets(b => ({ ...b, [ch]: Number(e.target.value) }))}
                  style={{ width: "100%", accentColor: PRIMARY }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: MUTED }}>Recommended: ${rec}K</span>
                  <span style={{ fontSize: 11, color: MUTED }}>Max: $200K</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forecast */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 6 }}>Projected Pipeline</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: DARK_TEXT }}>{projectedPipeline}</p>
          {applied && <p style={{ fontSize: 12, color: GREEN, marginTop: 4, fontWeight: 600 }}>↑ +$180K vs current allocation</p>}
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 6 }}>Projected ROAS</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: DARK_TEXT }}>{projectedRoas}</p>
          {applied && <p style={{ fontSize: 12, color: GREEN, marginTop: 4, fontWeight: 600 }}>↑ +0.6× improvement</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Attribution Tab ──────────────────────────────────────────────────────────
function AttributionTab() {
  const [activeModel, setActiveModel] = useState("Last-touch");
  const modelColors: Record<string, string> = {
    "Last-touch": BLUE, "Linear": PRIMARY, "Time-decay": GREEN, "First-touch": AMBER,
  };

  const maxVal = Math.max(...attributionData.map(r => r[activeModel as keyof typeof r] as number));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Model Toggle */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 12, fontWeight: 600 }}>Attribution Model</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {attributionModels.map(m => (
            <button
              key={m}
              onClick={() => setActiveModel(m)}
              style={{
                padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${activeModel === m ? modelColors[m] : BORDER}`,
                background: activeModel === m ? modelColors[m] + "18" : "white",
                color: activeModel === m ? modelColors[m] : MUTED,
                fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: "10px 14px", background: PAGE_BG, borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: MUTED }}>
            {activeModel === "Last-touch" && "Attributes 100% of credit to the final touchpoint before conversion. Best for measuring bottom-funnel efficiency."}
            {activeModel === "Linear" && "Distributes credit equally across all touchpoints in the path. Provides a balanced view of all campaign contributions."}
            {activeModel === "Time-decay" && "Gives more credit to touchpoints closer to conversion. Useful for short sales cycles."}
            {activeModel === "First-touch" && "Attributes 100% of credit to the first touchpoint. Best for measuring awareness and acquisition channels."}
          </p>
        </div>
      </div>

      {/* Attribution Table with visual bars */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORDER}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT }}>Conversion Credit by Campaign</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: PAGE_BG }}>
              <th style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: MUTED }}>Campaign</th>
              {attributionModels.map(m => (
                <th key={m} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: m === activeModel ? modelColors[m] : MUTED }}>
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributionData.map((row, i) => (
              <tr key={row.campaign} style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 1 ? PAGE_BG + "50" : "transparent" }}>
                <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{row.campaign}</td>
                {attributionModels.map(m => {
                  const val = row[m as keyof typeof row] as number;
                  const isActive = m === activeModel;
                  const pct = (val / maxVal) * 100;
                  return (
                    <td key={m} style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 80, height: 8, borderRadius: 4, background: BORDER, overflow: "hidden" }}>
                          <motion.div
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.4 }}
                            style={{ height: "100%", borderRadius: 4, background: isActive ? modelColors[m] : BORDER }}
                          />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400, color: isActive ? modelColors[m] : MUTED }}>
                          {val}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PaidMediaPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "32px 40px", fontFamily: "inherit" }}>
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK_TEXT, marginBottom: 6 }}>Paid Media</h1>
            <p style={{ fontSize: 14, color: MUTED }}>Campaign performance, budget management & attribution analysis</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: MUTED, cursor: "pointer" }}>
              <RefreshCw size={14} /> Refresh
            </button>
            <div style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: MUTED }}>
              May 2025
            </div>
          </div>
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
          {activeTab === "Overview"          && <OverviewTab />}
          {activeTab === "Campaigns"         && <CampaignsTab />}
          {activeTab === "Budget Optimizer"  && <BudgetOptimizerTab />}
          {activeTab === "Attribution"       && <AttributionTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
