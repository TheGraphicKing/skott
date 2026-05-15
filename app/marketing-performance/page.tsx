"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, DollarSign, Users, Target, Download,
  AlertCircle, CheckCircle, ChevronDown, ChevronUp, ArrowDown,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from "recharts";

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

// ─── Channel Data ─────────────────────────────────────────────────────────────
interface Channel {
  channel: string; spend: string; spendN: number;
  mqls: number; sqls: number; opps: number;
  revenue: string; revenueN: number;
  roi: number; trend: "up" | "down" | "flat";
}

const rawChannels: Channel[] = [
  { channel: "Paid Search",   spend: "$142K", spendN: 142,  mqls: 980,  sqls: 420, opps: 180, revenue: "$1.8M", revenueN: 1800, roi: 4.2,  trend: "up"   },
  { channel: "LinkedIn ABM",  spend: "$98K",  spendN: 98,   mqls: 1240, sqls: 560, opps: 240, revenue: "$2.1M", revenueN: 2100, roi: 5.8,  trend: "up"   },
  { channel: "Content / SEO", spend: "$45K",  spendN: 45,   mqls: 840,  sqls: 380, opps: 160, revenue: "$890K", revenueN: 890,  roi: 8.3,  trend: "up"   },
  { channel: "Email",         spend: "$12K",  spendN: 12,   mqls: 280,  sqls: 120, opps: 52,  revenue: "$420K", revenueN: 420,  roi: 12.1, trend: "flat" },
  { channel: "Events",        spend: "$210K", spendN: 210,  mqls: 380,  sqls: 170, opps: 72,  revenue: "$1.4M", revenueN: 1400, roi: 2.8,  trend: "down" },
  { channel: "Partner",       spend: "$38K",  spendN: 38,   mqls: 420,  sqls: 188, opps: 80,  revenue: "$680K", revenueN: 680,  roi: 6.4,  trend: "up"   },
  { channel: "Display",       spend: "$28K",  spendN: 28,   mqls: 80,   sqls: 32,  opps: 14,  revenue: "$124K", revenueN: 124,  roi: 1.9,  trend: "down" },
];

// ─── Funnel Data ──────────────────────────────────────────────────────────────
const funnelSteps = [
  { stage: "Impressions", value: "2.4M",  count: 2400000, conv: null  },
  { stage: "Clicks",      value: "48K",   count: 48000,   conv: "2%"  },
  { stage: "Leads",       value: "12.4K", count: 12400,   conv: "26%" },
  { stage: "MQL",         value: "3.42K", count: 3420,    conv: "28%" },
  { stage: "SQL",         value: "1.87K", count: 1870,    conv: "55%" },
  { stage: "Opp",         value: "620",   count: 620,     conv: "33%" },
  { stage: "Customer",    value: "124",   count: 124,     conv: "20%" },
];
const FUNNEL_MAX = funnelSteps[0].count;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function roiColor(roi: number) {
  if (roi >= 8)   return GREEN;
  if (roi >= 3)   return DARK_TEXT;
  return RED;
}

function roiBadgeColor(roi: number) {
  if (roi >= 6)   return GREEN;
  if (roi >= 3)   return BLUE;
  return RED;
}

function TrendBadge({ trend }: { trend: "up" | "down" | "flat" }) {
  const cfg = {
    up:   { symbol: "↑", color: GREEN },
    down: { symbol: "↓", color: RED   },
    flat: { symbol: "→", color: AMBER },
  };
  const t = cfg[trend];
  return <span style={{ color: t.color, fontSize: 18, fontWeight: 700 }}>{t.symbol}</span>;
}

function exportCSV(channels: Channel[]) {
  const header = "Channel,Spend,MQLs,SQLs,Opps,Revenue,ROI\n";
  const rows = channels.map(c =>
    `${c.channel},${c.spend},${c.mqls},${c.sqls},${c.opps},${c.revenue},${c.roi}×`
  ).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "marketing-performance.csv"; a.click();
  URL.revokeObjectURL(url);
}

function Toast({ msg }: { msg: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
      style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 200,
        background: DARK_TEXT, color: "#fff", borderRadius: 10, padding: "12px 20px",
        fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      }}>
      {msg}
    </motion.div>
  );
}

// ─── Anomaly Modal ────────────────────────────────────────────────────────────
function AnomalyModal({ onClose }: { onClose: () => void }) {
  // Mini sparkline data — CPL trend
  const cplData = [
    { day: "Mon", cpl: 64 }, { day: "Tue", cpl: 66 }, { day: "Wed", cpl: 68 },
    { day: "Thu", cpl: 70 }, { day: "Fri", cpl: 69 }, { day: "Sat", cpl: 72 },
    { day: "Sun", cpl: 95 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
        zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: CARD, borderRadius: 16, padding: "28px",
          width: 500, maxWidth: "92vw", boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
        }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle size={18} color={AMBER} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, margin: 0 }}>LinkedIn CPL Spike Analysis</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: MUTED }}>×</button>
        </div>

        {/* CPL trend chart */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 8 }}>CPL TREND (LAST 7 DAYS)</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={cplData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD }}
                formatter={(v: any) => [`$${v}`, "CPL"]}
              />
              <Bar dataKey="cpl" radius={[4, 4, 0, 0]} maxBarSize={28}>
                {cplData.map((entry, i) => (
                  <Cell key={i} fill={i === cplData.length - 1 ? RED : PRIMARY} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recommendation */}
        <div style={{ background: PRIMARY + "10", borderRadius: 10, border: `1px solid ${PRIMARY}30`, padding: "14px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: PRIMARY, marginBottom: 6 }}>AI RECOMMENDATION</div>
          <p style={{ fontSize: 12, color: DARK_TEXT, margin: 0, lineHeight: 1.6 }}>
            Recommend: creative refresh + bid cap at $8.50. Projected savings: <strong>$2,400/week</strong>.
            Expand audience to "VP Operations" + "Chief Digital Officer". Resume at $2K/day cap.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "10px", fontSize: 13, fontWeight: 700, color: "#fff",
            background: PRIMARY, border: "none", borderRadius: 9, cursor: "pointer",
          }}>Apply Fix</button>
          <button onClick={onClose} style={{
            padding: "10px 18px", fontSize: 13, color: MUTED,
            background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 9, cursor: "pointer",
          }}>Dismiss</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MarketingPerformancePage() {
  const [dateRange, setDateRange]         = useState("30D");
  const [attribution, setAttribution]     = useState("Linear");
  const [sortKey, setSortKey]             = useState<keyof Channel>("roi");
  const [sortDir, setSortDir]             = useState<"asc" | "desc">("desc");
  const [anomalyOpen, setAnomalyOpen]     = useState(false);
  const [anomalyDismissed, setAnomalyDismissed] = useState(false);
  const [toast, setToast]                 = useState<string | null>(null);

  const dateRanges  = ["7D", "30D", "Quarter", "YTD", "Custom"];
  const attributions = ["First Touch", "Last Touch", "Linear", "Time-Decay", "Data-Driven"];

  const sorted = useMemo(() => {
    return [...rawChannels].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [sortKey, sortDir]);

  function handleSort(col: keyof Channel) {
    if (sortKey === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(col); setSortDir("desc"); }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const chartData = rawChannels.map(c => ({
    name: c.channel.split("/")[0].trim().split(" ")[0],
    ROI:  c.roi,
    fill: roiBadgeColor(c.roi),
  }));

  const kpis = [
    {
      label: "Pipeline", value: "$6.2M", delta: "+8%", sub: "73% to $8.5M target",
      icon: TrendingUp, color: GREEN, progress: 73,
    },
    {
      label: "Revenue Influenced", value: "$1.84M", delta: "+12%", sub: "vs last period",
      icon: DollarSign, color: BLUE, progress: null,
    },
    {
      label: "MQLs Generated", value: "3,420", delta: "+340", sub: "vs last period",
      icon: Users, color: GREEN, progress: null,
    },
    {
      label: "CAC", value: "$284", delta: "↓8%", sub: "lower is better",
      icon: Target, color: GREEN, progress: null,
    },
  ];

  type SortableKey = Extract<keyof Channel, "channel" | "spendN" | "mqls" | "sqls" | "opps" | "revenueN" | "roi" | "trend">;

  const colHeaders: { label: string; key: SortableKey | null; sortable: boolean }[] = [
    { label: "Channel", key: "channel",  sortable: true  },
    { label: "Spend",   key: "spendN",   sortable: true  },
    { label: "MQLs",    key: "mqls",     sortable: true  },
    { label: "SQLs",    key: "sqls",     sortable: true  },
    { label: "Opps",    key: "opps",     sortable: true  },
    { label: "Revenue", key: "revenueN", sortable: true  },
    { label: "ROI",     key: "roi",      sortable: true  },
    { label: "Trend",   key: "trend",    sortable: false },
    { label: "Actions", key: null,       sortable: false },
  ];

  return (
    <div style={{ padding: "28px 32px", background: PAGE_BG, minHeight: "100vh" }}>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>Marketing Performance</h1>
            <p style={{ color: MUTED, fontSize: 13, margin: "4px 0 0" }}>
              Multi-channel attribution, ROI & funnel analytics
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            {/* Date range */}
            <div style={{ display: "flex", gap: 4, background: CARD, borderRadius: 10, border: `1px solid ${BORDER}`, padding: "4px" }}>
              {dateRanges.map(d => (
                <button key={d} onClick={() => setDateRange(d)} style={{
                  padding: "5px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: dateRange === d ? PRIMARY : "transparent",
                  color: dateRange === d ? "#fff" : MUTED, border: "none",
                }}>{d}</button>
              ))}
            </div>
            {/* Attribution model */}
            <div style={{ display: "flex", gap: 4, background: CARD, borderRadius: 10, border: `1px solid ${BORDER}`, padding: "4px" }}>
              {attributions.map(a => (
                <button key={a} onClick={() => setAttribution(a)} style={{
                  padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer",
                  background: attribution === a ? BLUE : "transparent",
                  color: attribution === a ? "#fff" : MUTED, border: "none",
                }}>{a}</button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div key={k.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.06 }}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: MUTED }}>{k.label}</span>
                <Icon size={16} color={k.color} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: DARK_TEXT, marginBottom: 6 }}>{k.value}</div>
              <span style={{
                fontSize: 11, fontWeight: 700, color: k.color,
                background: k.color + "18", borderRadius: 99, padding: "2px 8px",
              }}>{k.delta}</span>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{k.sub}</div>
              {k.progress !== null && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 5, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${k.progress}%` }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      style={{ height: "100%", background: k.color, borderRadius: 99 }}
                    />
                  </div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 3 }}>{k.progress}% to target</div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Anomaly Alert Banner ── */}
      <AnimatePresence>
        {!anomalyDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{
              background: "hsl(38,90%,94%)", border: "1px solid hsl(38,80%,75%)",
              borderRadius: 12, padding: "12px 18px",
              display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
            }}>
            <AlertCircle size={16} color={AMBER} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: DARK_TEXT, flex: 1 }}>
              <strong>⚠ LinkedIn CPL spiked 40% yesterday.</strong> Spend temporarily paused by Paid Media Agent.
            </span>
            <button onClick={() => setAnomalyOpen(true)} style={{
              padding: "5px 14px", fontSize: 12, fontWeight: 700, color: AMBER,
              background: "transparent", border: `1px solid ${AMBER}`, borderRadius: 7, cursor: "pointer",
            }}>
              → Investigate
            </button>
            <button onClick={() => setAnomalyDismissed(true)} style={{
              padding: "5px 10px", fontSize: 14, color: MUTED, background: "transparent", border: "none", cursor: "pointer",
            }}>×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Channel Performance Table ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, margin: 0 }}>Channel Performance</h2>
          <button onClick={() => exportCSV(sorted)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", fontSize: 12, fontWeight: 600, color: PRIMARY,
            background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 8, cursor: "pointer",
          }}>
            <Download size={13} /> Export CSV
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: PAGE_BG }}>
                {colHeaders.map(h => (
                  <th key={h.label}
                    onClick={() => h.sortable && h.key && handleSort(h.key as keyof Channel)}
                    style={{
                      padding: "10px 16px", fontSize: 11, fontWeight: 700, color: MUTED,
                      textAlign: "left", borderBottom: `1px solid ${BORDER}`,
                      cursor: h.sortable ? "pointer" : "default", userSelect: "none", whiteSpace: "nowrap",
                    }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {h.label}
                      {h.sortable && h.key && sortKey === h.key && (
                        sortDir === "desc" ? <ChevronDown size={11} /> : <ChevronUp size={11} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => (
                <motion.tr key={c.channel}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{c.channel}</td>
                  <td style={{ padding: "11px 16px", fontSize: 12, color: MUTED }}>{c.spend}</td>
                  <td style={{ padding: "11px 16px", fontSize: 12, color: DARK_TEXT, fontWeight: 500 }}>{c.mqls.toLocaleString()}</td>
                  <td style={{ padding: "11px 16px", fontSize: 12, color: DARK_TEXT }}>{c.sqls.toLocaleString()}</td>
                  <td style={{ padding: "11px 16px", fontSize: 12, color: DARK_TEXT }}>{c.opps}</td>
                  <td style={{ padding: "11px 16px", fontSize: 12, fontWeight: 600, color: DARK_TEXT }}>{c.revenue}</td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700, borderRadius: 99, padding: "2px 8px",
                      color: roiColor(c.roi),
                      background: roiBadgeColor(c.roi) + "18",
                    }}>
                      {c.roi}×
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px" }}><TrendBadge trend={c.trend} /></td>
                  <td style={{ padding: "11px 16px" }}>
                    <button onClick={() => showToast(`Filtering campaign view for ${c.channel}…`)} style={{
                      fontSize: 11, fontWeight: 600, color: BLUE,
                      background: BLUE + "12", border: `1px solid ${BLUE}30`,
                      borderRadius: 7, padding: "4px 10px", cursor: "pointer",
                    }}>
                      View Campaigns
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── ROI Bar Chart ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 22px", marginBottom: 22 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, margin: "0 0 16px" }}>Channel ROI Comparison</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `${v}×`} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD }}
              formatter={(v: any) => [`${v}×`, "ROI"]}
            />
            <Bar dataKey="ROI" radius={[6, 6, 0, 0]} maxBarSize={52}>
              {chartData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div style={{ display: "flex", gap: 20, marginTop: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Elite (>6×)",    color: GREEN },
            { label: "Strong (3–6×)", color: BLUE  },
            { label: "Below (<3×)",   color: RED   },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: MUTED }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Marketing Funnel ── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 22px" }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, margin: "0 0 20px" }}>
          Conversion Funnel — Q2 2026
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {funnelSteps.map((step, i) => {
            // Scale: use square-root scale so small stages are still visible
            const rawPct = step.count / FUNNEL_MAX;
            const widthPct = Math.max(4, Math.round(Math.sqrt(rawPct) * 100));
            const opacity  = 1 - i * 0.09;

            return (
              <div key={step.stage}>
                {/* Conversion rate connector */}
                {step.conv && (
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 4, fontSize: 10, color: MUTED, fontWeight: 600, padding: "4px 0",
                  }}>
                    <ArrowDown size={9} />
                    <span>{step.conv} conversion</span>
                  </div>
                )}
                {/* Stage row */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 100, fontSize: 12, fontWeight: 600, color: MUTED,
                    flexShrink: 0, textAlign: "right",
                  }}>
                    {step.stage}
                  </div>
                  <div style={{ flex: 1, height: 36, background: PAGE_BG, borderRadius: 8, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
                      style={{
                        height: "100%",
                        background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY}${Math.round(opacity * 255).toString(16).padStart(2, "0")})`,
                        borderRadius: 8,
                        display: "flex", alignItems: "center", paddingLeft: 12,
                      }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                        {step.value}
                      </span>
                    </motion.div>
                  </div>
                  <div style={{ width: 60, fontSize: 11, color: MUTED, textAlign: "right", flexShrink: 0 }}>
                    {step.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Modals & Toasts ── */}
      <AnimatePresence>
        {anomalyOpen && <AnomalyModal onClose={() => setAnomalyOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {toast && <Toast msg={toast} />}
      </AnimatePresence>
    </div>
  );
}
