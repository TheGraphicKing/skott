"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, Target, BarChart3,
  ArrowUpRight, ArrowDownRight, Brain, Sparkles, Download,
  ChevronRight, AlertTriangle, CheckCircle2, Zap, Search,
  Users, Globe, Mail, Megaphone, Star, Calendar, Play,
  RefreshCw, Send, Filter, Layers,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
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

type Tab = "Executive Dashboard" | "Funnel Analytics" | "Attribution" | "Forecasting";
const TABS: Tab[] = ["Executive Dashboard", "Funnel Analytics", "Attribution", "Forecasting"];

// ─── KPI data ─────────────────────────────────────────────────────────────────
const kpis = [
  { label: "Revenue Attributed", value: "$4.2M",   delta: "+18.3%", dir: "up",       icon: DollarSign, color: GREEN },
  { label: "Marketing ROI",      value: "312%",    delta: "+42%",   dir: "up",       icon: TrendingUp, color: GREEN },
  { label: "Pipeline Influenced",value: "$12.8M",  delta: "+24.1%", dir: "up",       icon: BarChart3,  color: BLUE  },
  { label: "Avg CAC",            value: "$284",    delta: "-12.4%", dir: "down-good",icon: Target,     color: GREEN },
  { label: "Avg LTV",            value: "$42,000", delta: "+8.1%",  dir: "up",       icon: Star,       color: AMBER },
];

// ─── Trend chart data (3 months) ──────────────────────────────────────────────
const trendMonths = ["Mar", "Apr", "May"];

const revenueData  = [3400, 3850, 4200];   // $K
const cacData      = [324,  301,  284];    // $
const roasData     = [3.4,  3.8,  4.2];   // ×

// ─── Channel performance ──────────────────────────────────────────────────────
const channels = [
  { channel: "LinkedIn",    spend: "$280K", revenue: "$1.90M", roi: 579, cac: "$198", ctr: "4.7%", roas: "6.8×", trend: "up"   },
  { channel: "Google Ads", spend: "$420K", revenue: "$1.32M", roi: 214, cac: "$284", ctr: "3.2%", roas: "3.1×", trend: "up"   },
  { channel: "Meta",        spend: "$210K", revenue: "$252K",  roi: 20,  cac: "$512", ctr: "1.8%", roas: "1.2×", trend: "down" },
  { channel: "Email",       spend: "$48K",  revenue: "$648K",  roi: 1250,cac: "$42",  ctr: "28.4%",roas: "13.5×",trend: "up"  },
  { channel: "Content/SEO", spend: "$95K",  revenue: "$756K",  roi: 695, cac: "$120", ctr: "—",    roas: "7.9×", trend: "up"   },
  { channel: "Events",      spend: "$180K", revenue: "$324K",  roi: 80,  cac: "$460", ctr: "—",    roas: "1.8×", trend: "neutral"},
];

// ─── Funnel data ──────────────────────────────────────────────────────────────
const funnelStages = [
  { stage: "Impressions", value: "14.2M", pct: 100, leakage: null, action: "Scale top channels", color: PRIMARY },
  { stage: "Website",     value: "284K",  pct: 2.0, leakage: "−13.9M",  action: "Improve targeting",      color: BLUE  },
  { stage: "Leads",       value: "8,420", pct: 2.97,leakage: "−275K",   action: "Optimize landing pages",  color: AMBER },
  { stage: "MQL",         value: "2,106", pct: 25.0,leakage: "−6,314",  action: "Improve lead scoring",    color: AMBER },
  { stage: "SQL",         value: "631",   pct: 30.0,leakage: "−1,475",  action: "Sales alignment",         color: RED   },
  { stage: "Opportunity", value: "214",   pct: 33.9,leakage: "−417",    action: "Win rate training",       color: RED   },
  { stage: "Revenue",     value: "$4.2M", pct: null,leakage: null,      action: "Scale top channels",      color: GREEN },
];

// 6-month cohort retention
const cohorts = [
  { month: "Dec", m0: 100, m1: 88, m2: 78, m3: 70, m4: 64, m5: 60 },
  { month: "Jan", m0: 100, m1: 86, m2: 76, m3: 68, m4: 63, m5: null },
  { month: "Feb", m0: 100, m1: 89, m2: 79, m3: 71, m4: null, m5: null },
  { month: "Mar", m0: 100, m1: 87, m2: 77, m3: null, m4: null, m5: null },
  { month: "Apr", m0: 100, m1: 90, m2: null, m3: null, m4: null, m5: null },
  { month: "May", m0: 100, m1: null, m2: null, m3: null, m4: null, m5: null },
];

const leakageAlerts = [
  { stage: "Website → Lead", issue: "Landing page bounce rate 74% on LinkedIn traffic", fix: "A/B test new hero variant targeting 'CMO persona'" },
  { stage: "MQL → SQL", issue: "Lead scoring model rejecting 48% of qualified accounts", fix: "Update ICP firmographic thresholds — expand to 50-200 employee range" },
  { stage: "SQL → Opportunity", issue: "24% of SQLs go dark after first sales call", fix: "Deploy AI follow-up sequence within 4h of first call completion" },
];

// ─── Attribution ──────────────────────────────────────────────────────────────
type AttrModel = "First Touch" | "Last Touch" | "Linear" | "Time Decay" | "AI Multi-Touch";
const ATTR_MODELS: AttrModel[] = ["First Touch", "Last Touch", "Linear", "Time Decay", "AI Multi-Touch"];

const attrData: Record<AttrModel, { channel: string; pct: number; value: string }[]> = {
  "AI Multi-Touch": [
    { channel: "LinkedIn", pct: 42, value: "$1.76M" },
    { channel: "Google",   pct: 28, value: "$1.18M" },
    { channel: "Email",    pct: 18, value: "$756K"  },
    { channel: "Meta",     pct: 12, value: "$504K"  },
  ],
  "First Touch": [
    { channel: "LinkedIn", pct: 55, value: "$2.31M" },
    { channel: "Google",   pct: 30, value: "$1.26M" },
    { channel: "Email",    pct: 10, value: "$420K"  },
    { channel: "Meta",     pct: 5,  value: "$210K"  },
  ],
  "Last Touch": [
    { channel: "LinkedIn", pct: 32, value: "$1.34M" },
    { channel: "Google",   pct: 22, value: "$924K"  },
    { channel: "Email",    pct: 38, value: "$1.60M" },
    { channel: "Meta",     pct: 8,  value: "$336K"  },
  ],
  "Linear": [
    { channel: "LinkedIn", pct: 38, value: "$1.60M" },
    { channel: "Google",   pct: 26, value: "$1.09M" },
    { channel: "Email",    pct: 22, value: "$924K"  },
    { channel: "Meta",     pct: 14, value: "$588K"  },
  ],
  "Time Decay": [
    { channel: "LinkedIn", pct: 36, value: "$1.51M" },
    { channel: "Google",   pct: 24, value: "$1.01M" },
    { channel: "Email",    pct: 28, value: "$1.18M" },
    { channel: "Meta",     pct: 12, value: "$504K"  },
  ],
};

const topCampaigns = [
  { name: "Q2 Enterprise Launch",      channel: "LinkedIn",  revenue: "$840K", pct: 20,  touches: 3.2 },
  { name: "LinkedIn ABM — Enterprise", channel: "LinkedIn",  revenue: "$672K", pct: 16,  touches: 2.8 },
  { name: "Brand Search — Branded KW", channel: "Google",    revenue: "$504K", pct: 12,  touches: 1.4 },
  { name: "Nurture Email Sequence Q2", channel: "Email",     revenue: "$378K", pct: 9,   touches: 4.1 },
  { name: "AI Tools Webinar Series",   channel: "Events",    revenue: "$252K", pct: 6,   touches: 2.2 },
];

const paths = [
  { path: "LinkedIn → Google Search → Email → Won", count: 124, revenue: "$2.48M", pct: 59 },
  { path: "Content SEO → Google → Demo → Won",      count: 58,  revenue: "$1.16M", pct: 28 },
  { path: "Event → SDR Call → Email → Won",          count: 32,  revenue: "$640K",  pct: 15 },
];

// ─── Forecasting ──────────────────────────────────────────────────────────────
const scenarios = {
  Conservative: { revenue: "$11.2M", pipeline: "$32M", cac: "$310", color: RED   },
  Base:         { revenue: "$14.8M", pipeline: "$44M", cac: "$284", color: AMBER },
  Optimistic:   { revenue: "$18.4M", pipeline: "$58M", cac: "$248", color: GREEN },
};

// ─── Utility ──────────────────────────────────────────────────────────────────
function KpiCard({ kpi }: { kpi: typeof kpis[0] }) {
  const Icon = kpi.icon;
  const isGood = kpi.dir === "up" || kpi.dir === "down-good";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 4 }}>{kpi.label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: DARK_TEXT, lineHeight: 1 }}>{kpi.value}</div>
        </div>
        <div style={{ background: `${kpi.color}18`, borderRadius: 10, padding: 10 }}>
          <Icon size={20} style={{ color: kpi.color }} />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3">
        {isGood
          ? <ArrowUpRight size={14} style={{ color: GREEN }} />
          : <ArrowDownRight size={14} style={{ color: RED }} />}
        <span style={{ fontSize: 13, fontWeight: 700, color: isGood ? GREEN : RED }}>{kpi.delta}</span>
        <span style={{ fontSize: 12, color: MUTED, marginLeft: 2 }}>vs last month</span>
      </div>
    </motion.div>
  );
}

// Simple SVG polyline chart
function TrendChart({ data, color, label, suffix = "" }: { data: number[]; color: string; label: string; suffix?: string }) {
  const max = Math.max(...data) * 1.1;
  const min = Math.min(...data) * 0.9;
  const W = 240, H = 70;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min)) * H;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, flex: 1 }}>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: DARK_TEXT }}>
        {suffix}{data[data.length - 1].toLocaleString()}
      </div>
      <svg width={W} height={H + 20} viewBox={`0 0 ${W} ${H + 20}`} style={{ marginTop: 8 }}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pts}
        />
        {data.map((v, i) => {
          const x = (i / (data.length - 1)) * W;
          const y = H - ((v - min) / (max - min)) * H;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill={color} />
              <text x={x} y={H + 16} textAnchor="middle" fontSize="10" fill={MUTED}>{trendMonths[i]}</text>
            </g>
          );
        })}
        {/* area fill */}
        <polyline
          fill={`${color}15`}
          stroke="none"
          points={`0,${H} ${pts} ${W},${H}`}
        />
      </svg>
    </div>
  );
}

function RoiCell({ roi }: { roi: number }) {
  const color = roi > 300 ? GREEN : roi > 150 ? AMBER : RED;
  return (
    <td style={{ padding: "13px 14px" }}>
      <span style={{ background: `${color}18`, color, border: `1px solid ${color}44`, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
        {roi}%
      </span>
    </td>
  );
}

// ─── Executive Dashboard Tab ──────────────────────────────────────────────────
function ExecutiveDashboard() {
  const [showExport, setShowExport] = useState(false);
  return (
    <div className="flex flex-col gap-8">
      {/* 3-month trends */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>3-Month Performance Trends</h3>
        <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
          <TrendChart data={revenueData} color={GREEN} label="Revenue Influenced ($K)" suffix="$" />
          <TrendChart data={cacData}     color={RED}   label="Avg CAC ($)"             suffix="$" />
          <TrendChart data={roasData}    color={BLUE}  label="Blended ROAS"            suffix=""  />
        </div>
      </section>

      {/* Channel Performance Table */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Channel Performance</h3>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: `${PRIMARY}0a`, borderBottom: `1px solid ${BORDER}` }}>
                {["Channel", "Spend", "Revenue", "ROI", "CAC", "CTR", "ROAS", "Trend"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {channels.map((ch, i) => (
                <tr key={i} style={{ borderBottom: i < channels.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{ch.channel}</td>
                  <td style={{ padding: "13px 14px", fontSize: 13, color: MUTED }}>{ch.spend}</td>
                  <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{ch.revenue}</td>
                  <RoiCell roi={ch.roi} />
                  <td style={{ padding: "13px 14px", fontSize: 13, color: DARK_TEXT }}>{ch.cac}</td>
                  <td style={{ padding: "13px 14px", fontSize: 13, color: MUTED }}>{ch.ctr}</td>
                  <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{ch.roas}</td>
                  <td style={{ padding: "13px 14px" }}>
                    {ch.trend === "up"      && <TrendingUp   size={16} style={{ color: GREEN }} />}
                    {ch.trend === "down"    && <TrendingDown  size={16} style={{ color: RED   }} />}
                    {ch.trend === "neutral" && <span style={{ fontSize: 12, color: MUTED }}>→</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Executive Summary */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT }}>Executive Summary</h3>
          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              <Download size={14} /> Board Report
            </button>
            {showExport && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "8px 0", zIndex: 50, minWidth: 160, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                {["Export as PDF", "Export as PPTX", "Send via Email", "Share Link"].map(opt => (
                  <button key={opt} style={{ display: "block", width: "100%", padding: "8px 16px", background: "none", border: "none", textAlign: "left", fontSize: 13, color: DARK_TEXT, cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${PRIMARY}10`)}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >{opt}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} style={{ color: PRIMARY }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: PRIMARY }}>AI-Generated Insight — May 2026</span>
          </div>
          {[
            "Marketing generated $4.2M revenue influence this month, 18% above target, driven primarily by LinkedIn ABM (6.8× ROAS) and Email nurture (13.5× ROAS). These two channels alone account for 60% of attributed pipeline.",
            "CAC improved 12.4% to $284 against a $324 Q1 baseline, reflecting better channel mix optimization. Email and Content/SEO remain the most efficient acquisition channels with CAC of $42 and $120 respectively.",
            "Meta EMEA remains the primary risk vector with ROAS of 1.2× against a 4× target. Immediate budget reallocation of $82K to LinkedIn is recommended to protect blended ROAS and Q3 pipeline contribution.",
          ].map((bullet, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 2 ? 12 : 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: PRIMARY, marginTop: 6, flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: DARK_TEXT, lineHeight: 1.6, margin: 0 }}>{bullet}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Funnel Analytics Tab ─────────────────────────────────────────────────────
function FunnelAnalytics() {
  return (
    <div className="flex flex-col gap-8">
      {/* Funnel visualization */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Full Funnel Visualization</h3>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
          <div className="flex flex-col gap-3">
            {funnelStages.map((stage, i) => {
              const widthPct = stage.pct !== null ? Math.max(stage.pct * 0.95 + 5, 15) : 100;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div style={{ width: 120, fontSize: 13, fontWeight: 600, color: DARK_TEXT, textAlign: "right", flexShrink: 0 }}>{stage.stage}</div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        width: `${widthPct}%`,
                        height: 36,
                        background: `${stage.color}22`,
                        border: `1.5px solid ${stage.color}55`,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 12,
                        transition: "width 0.5s",
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 700, color: stage.color }}>{stage.value}</span>
                      {stage.pct !== null && (
                        <span style={{ fontSize: 11, color: MUTED, marginLeft: 8 }}>({stage.pct}% conv.)</span>
                      )}
                    </div>
                  </div>
                  <div style={{ width: 100, fontSize: 11, color: RED, flexShrink: 0 }}>{stage.leakage && `Lost: ${stage.leakage}`}</div>
                  <button style={{ fontSize: 11, color: BLUE, background: `${BLUE}10`, border: `1px solid ${BLUE}30`, borderRadius: 6, padding: "3px 10px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {stage.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cohort Analysis */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Cohort Retention Analysis</h3>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", minWidth: 480 }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px 16px", textAlign: "left", fontSize: 12, color: MUTED, fontWeight: 600 }}>Cohort</th>
                  {["M0", "M1", "M2", "M3", "M4", "M5"].map(m => (
                    <th key={m} style={{ padding: "8px 16px", textAlign: "center", fontSize: 12, color: MUTED, fontWeight: 600 }}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohorts.map((c, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{c.month}</td>
                    {([c.m0, c.m1, c.m2, c.m3, c.m4, c.m5] as (number | null)[]).map((v, j) => {
                      const alpha = v !== null ? v / 100 : 0;
                      return (
                        <td key={j} style={{ padding: "8px 16px", textAlign: "center" }}>
                          {v !== null ? (
                            <span style={{
                              display: "inline-block",
                              padding: "4px 10px",
                              borderRadius: 6,
                              background: `hsla(142,55%,35%,${alpha * 0.4 + 0.05})`,
                              color: v > 80 ? GREEN : v > 60 ? AMBER : RED,
                              fontSize: 12,
                              fontWeight: 700,
                            }}>
                              {v}%
                            </span>
                          ) : (
                            <span style={{ color: BORDER, fontSize: 12 }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Leakage Alerts */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>AI-Detected Funnel Leakage Alerts</h3>
        <div className="flex flex-col gap-3">
          {leakageAlerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ background: "#fef9ec", border: `1px solid ${AMBER}44`, borderRadius: 10, padding: 16, borderLeft: `4px solid ${AMBER}` }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} style={{ color: AMBER, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, marginBottom: 2 }}>Leakage: {alert.stage}</div>
                  <div style={{ fontSize: 13, color: DARK_TEXT, fontWeight: 500 }}>{alert.issue}</div>
                  <div style={{ fontSize: 12, color: GREEN, marginTop: 4 }}>Fix: {alert.fix}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Attribution Tab ──────────────────────────────────────────────────────────
function AttributionTab() {
  const [model, setModel] = useState<AttrModel>("AI Multi-Touch");
  const data = attrData[model];
  const attrColors = [BLUE, GREEN, AMBER, RED];

  return (
    <div className="flex flex-col gap-8">
      {/* Model Selector */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Attribution Model</h3>
        <div className="flex gap-2 flex-wrap">
          {ATTR_MODELS.map(m => (
            <button
              key={m}
              onClick={() => setModel(m)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${model === m ? PRIMARY : BORDER}`,
                fontSize: 13,
                fontWeight: model === m ? 700 : 400,
                cursor: "pointer",
                background: model === m ? PRIMARY : CARD,
                color: model === m ? "#fff" : DARK_TEXT,
                transition: "all 0.15s",
              }}
            >
              {m} {m === "AI Multi-Touch" && "✦"}
            </button>
          ))}
        </div>
      </section>

      {/* Attribution Breakdown */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Revenue Attribution by Channel</h3>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
          <AnimatePresence mode="wait">
            <motion.div key={model} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
              {data.map((row, i) => (
                <div key={row.channel}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{row.channel}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: attrColors[i] }}>{row.pct}% · {row.value}</span>
                  </div>
                  <div style={{ height: 12, background: BORDER, borderRadius: 6, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.pct}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      style={{ height: "100%", background: attrColors[i], borderRadius: 6 }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Campaign Attribution */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Top 5 Campaigns by Revenue Contribution</h3>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: `${PRIMARY}0a`, borderBottom: `1px solid ${BORDER}` }}>
                {["Campaign", "Channel", "Revenue", "Share", "Avg Touches"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topCampaigns.map((c, i) => (
                <tr key={i} style={{ borderBottom: i < topCampaigns.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{c.name}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: MUTED }}>{c.channel}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: GREEN }}>{c.revenue}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: BORDER, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${c.pct * 5}%`, height: "100%", background: BLUE, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, color: BLUE }}>{c.pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: DARK_TEXT }}>{c.touches}×</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Multi-touch Paths */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Top Multi-Touch Customer Journeys</h3>
        <div className="flex flex-col gap-3">
          {paths.map((p, i) => (
            <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18 }}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT, marginBottom: 4 }}>{p.path}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>{p.count} deals · {p.revenue} attributed</div>
                </div>
                <div style={{ background: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}44`, borderRadius: 8, padding: "4px 14px", fontSize: 13, fontWeight: 700 }}>
                  {p.pct}% of revenue
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Forecasting Tab ──────────────────────────────────────────────────────────
function ForecastingTab() {
  const [query, setQuery] = useState("Why did CAC increase in EMEA this month?");
  const [showAnswer, setShowAnswer] = useState(true);
  const [budgetIncrease, setBudgetIncrease] = useState(15);
  const [linkedinShift, setLinkedinShift] = useState(10);

  const projectedRevenue = (14.8 * (1 + budgetIncrease / 100) * (1 + linkedinShift / 200)).toFixed(1);
  const projectedCac = Math.round(284 * (1 - budgetIncrease / 200) * (1 - linkedinShift / 400));

  return (
    <div className="flex flex-col gap-8">
      {/* NL Query Bar */}
      <section>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
          <div className="flex items-center gap-3">
            <Search size={18} style={{ color: MUTED, flexShrink: 0 }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, color: DARK_TEXT, outline: "none" }}
              placeholder="Ask a question about your marketing data..."
            />
            <button
              onClick={() => setShowAnswer(true)}
              style={{ padding: "7px 16px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <Brain size={14} /> Ask AI
            </button>
          </div>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} style={{ color: PRIMARY }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY }}>AI Analysis</span>
              </div>
              <p style={{ fontSize: 13, color: DARK_TEXT, lineHeight: 1.6, margin: 0 }}>
                EMEA CAC increased 28% this month primarily due to Meta ad performance degradation after iOS 17.4 attribution changes. Three compounding factors were identified:
              </p>
              <ul style={{ margin: "10px 0 0", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  "Meta EMEA ROAS dropped from 3.8× to 1.2× — privacy changes reduced audience matching accuracy by 42%",
                  "EMEA market seasonality in Q2 historically shows 15–20% lower intent signal vs APAC/NA",
                  "Moveworks launched aggressive EMEA campaign in April — 3× ad volume increase detected",
                ].map((b, i) => (
                  <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: DARK_TEXT }}>
                    <span style={{ color: PRIMARY, fontWeight: 700 }}>{i + 1}.</span>{b}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </section>

      {/* Forecast Scenarios */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Q3 Forecast Scenarios</h3>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {(Object.entries(scenarios) as [string, typeof scenarios.Base][]).map(([name, s], i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ background: CARD, border: `2px solid ${s.color}44`, borderRadius: 12, padding: 24 }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 16 }}>{name}</div>
              <div className="flex flex-col gap-4">
                <div>
                  <div style={{ fontSize: 11, color: MUTED }}>Q3 Revenue</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: DARK_TEXT }}>{s.revenue}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: MUTED }}>Q3 Pipeline</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: DARK_TEXT }}>{s.pipeline}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: MUTED }}>Projected CAC</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: DARK_TEXT }}>{s.cac}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Simulation Inputs */}
      <section>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Scenario Simulation</h3>
        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>Adjust Inputs</h4>
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label style={{ fontSize: 13, color: DARK_TEXT, fontWeight: 500 }}>Budget Increase</label>
                  <span style={{ fontSize: 13, fontWeight: 700, color: PRIMARY }}>+{budgetIncrease}%</span>
                </div>
                <input
                  type="range" min={0} max={50} value={budgetIncrease}
                  onChange={e => setBudgetIncrease(Number(e.target.value))}
                  style={{ width: "100%", accentColor: PRIMARY }}
                />
                <div className="flex justify-between" style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>
                  <span>0%</span><span>50%</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label style={{ fontSize: 13, color: DARK_TEXT, fontWeight: 500 }}>LinkedIn Channel Mix Shift</label>
                  <span style={{ fontSize: 13, fontWeight: 700, color: BLUE }}>+{linkedinShift}%</span>
                </div>
                <input
                  type="range" min={0} max={30} value={linkedinShift}
                  onChange={e => setLinkedinShift(Number(e.target.value))}
                  style={{ width: "100%", accentColor: BLUE }}
                />
                <div className="flex justify-between" style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>
                  <span>0%</span><span>30%</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>Projected Impact</h4>
            <div className="flex flex-col gap-4">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 13, color: MUTED }}>Projected Q3 Revenue</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: GREEN }}>${projectedRevenue}M</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 13, color: MUTED }}>Projected CAC</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: GREEN }}>${projectedCac}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                <span style={{ fontSize: 13, color: MUTED }}>vs Base Scenario</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: GREEN }}>+{((Number(projectedRevenue) - 14.8) / 14.8 * 100).toFixed(0)}% revenue</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Forecast Insight */}
      <section>
        <div style={{ background: `${PRIMARY}08`, border: `1px solid ${PRIMARY}30`, borderRadius: 12, padding: 24 }}>
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} style={{ color: PRIMARY }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: PRIMARY }}>AI Forecast Insight</span>
          </div>
          <p style={{ fontSize: 13, color: DARK_TEXT, lineHeight: 1.7, margin: 0 }}>
            The base scenario forecast of <strong>$14.8M Q3 revenue</strong> is derived from a weighted ensemble model combining 18-month historical seasonality patterns, current pipeline velocity, and channel-level regression curves. The model assumes LinkedIn ABM conversion rates remain stable at 6.8× ROAS, Email nurture maintains a 28.4% CTR, and no major channel disruption events occur. The Conservative scenario accounts for a 25% reduction in Meta performance due to continued privacy signal degradation and a 15% increase in competitor SERP competitiveness. The Optimistic scenario reflects full realization of the proposed LinkedIn budget increase and successful launch of the APAC geo expansion in July, historically contributing an additional 8–12% pipeline contribution.
          </p>
        </div>
      </section>
    </div>
  );
}

// ─── NL Query Bar ─────────────────────────────────────────────────────────────
const NL_DEMO_ANSWER =
  "Based on 90-day attribution data: BFSI Vertical Launch ($1.84M influenced pipeline, 340% ROI) and LinkedIn ABM Enterprise ($2.1M, 480% ROI) were top performers in deals >$100K. Combined, they account for 73% of BFSI segment revenue influenced.";

function NLQueryBar() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ query: string; answer: string } | null>(null);

  const handleRun = () => {
    if (!query.trim()) return;
    setResult({ query: query.trim(), answer: NL_DEMO_ANSWER });
  };

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 28 }}>
      <div className="flex items-center gap-3">
        <Brain size={20} style={{ color: PRIMARY, flexShrink: 0 }} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleRun()}
          placeholder="Ask anything... e.g. 'Which campaigns influenced deals >$100K in BFSI?'"
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            fontSize: 14,
            color: DARK_TEXT,
            outline: "none",
          }}
        />
        <button
          onClick={handleRun}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 18px",
            background: PRIMARY,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Send size={14} /> Run Query
        </button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} style={{ color: PRIMARY }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY }}>AI Answer</span>
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>
            Query: <em style={{ color: DARK_TEXT }}>&ldquo;{result.query}&rdquo;</em>
          </div>
          <p style={{ fontSize: 13, color: DARK_TEXT, lineHeight: 1.65, margin: 0 }}>
            {result.answer}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Executive Dashboard");

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "32px 32px 64px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={22} style={{ color: PRIMARY }} />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: DARK_TEXT }}>Analytics & Attribution</h1>
        </div>
        <p style={{ fontSize: 14, color: MUTED }}>Revenue attribution, funnel intelligence & marketing forecasting</p>
      </div>

      {/* NL Query Bar — above tabs */}
      <NLQueryBar />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {kpis.map((k, i) => <KpiCard key={i} kpi={k} />)}
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "inline-flex", gap: 4, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4, marginBottom: 32 }}>
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
          {activeTab === "Executive Dashboard" && <ExecutiveDashboard />}
          {activeTab === "Funnel Analytics"    && <FunnelAnalytics />}
          {activeTab === "Attribution"         && <AttributionTab />}
          {activeTab === "Forecasting"         && <ForecastingTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
