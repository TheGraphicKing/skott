"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, TrendingUp, CheckCircle2,
  Loader2, ChevronDown, X, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid, Legend,
} from "recharts";

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

// ─── Data ────────────────────────────────────────────────────────────────────
const quarterlyData = [
  { quarter: "Q1", budget: 980, actual: 920 },
  { quarter: "Q2", budget: 1100, actual: 780 },
  { quarter: "Q3", budget: 1200, actual: 0 },
  { quarter: "Q4", budget: 920, actual: 0 },
];

const vendorData = [
  { name: "Google Ads",     value: 540, color: PRIMARY },
  { name: "LinkedIn Ads",   value: 380, color: BLUE },
  { name: "Agency Fees",    value: 420, color: AMBER },
  { name: "Events",         value: 540, color: GREEN },
  { name: "HubSpot",        value: 48,  color: "hsl(280,45%,40%)" },
  { name: "Salesforce",     value: 36,  color: RED },
  { name: "Creative Tools", value: 82,  color: "hsl(200,60%,40%)" },
  { name: "Lyzr Skott",    value: 24,  color: "hsl(60,70%,40%)" },
  { name: "Other",          value: 120, color: MUTED },
];

const varianceRows = [
  { cat: "Paid Ads",   budget: 1200, actual: 1060, variance: -140, pct: -11.7, status: "Under Budget" },
  { cat: "Content",    budget: 380,  actual: 290,  variance: -90,  pct: -23.7, status: "Under Budget" },
  { cat: "Events",     budget: 540,  actual: 612,  variance: +72,  pct: +13.3, status: "Over Budget"  },
  { cat: "Tools/Tech", budget: 280,  actual: 294,  variance: +14,  pct: +5.0,  status: "Over Budget"  },
  { cat: "Agency",     budget: 420,  actual: 390,  variance: -30,  pct: -7.1,  status: "Under Budget" },
  { cat: "Misc",       budget: 180,  actual: 144,  variance: -36,  pct: -20.0, status: "Under Budget" },
];

const burnData = [
  { month: "Nov", spent: 340,  budget: 4200 },
  { month: "Dec", spent: 620,  budget: 4200 },
  { month: "Jan", spent: 960,  budget: 4200 },
  { month: "Feb", spent: 1380, budget: 4200 },
  { month: "Mar", spent: 1940, budget: 4200 },
  { month: "Apr", spent: 2480, budget: 4200 },
  { month: "May", spent: 2890, budget: 4200 },
];

const shiftFromOptions = ["Paid Ads", "Events", "Agency Fees", "Content", "Tools/Tech"];
const shiftToOptions   = ["LinkedIn ABM", "Content Marketing", "Events", "SEO", "Influencer"];

// ─── Toast ───────────────────────────────────────────────────────────────────
type ToastData = { msg: string; color: string };

function Toast({ msg, color, onClose }: ToastData & { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        position: "fixed", top: 16, right: 16, zIndex: 50,
        background: CARD,
        borderLeft: `4px solid ${color}`,
        padding: "12px 20px", borderRadius: 10,
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        minWidth: 280, fontSize: 14, fontWeight: 500,
        color: DARK_TEXT,
      }}
    >
      <CheckCircle2 size={16} style={{ color }} />
      {msg}
      <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: MUTED, cursor: "pointer" }}>
        <X size={14} />
      </button>
    </motion.div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accent, progress, badge }: {
  label: string; value: string; sub: string; icon: any; accent?: string;
  progress?: number; badge?: { text: string; color: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: CARD, border: `1px solid ${BORDER}`,
        borderRadius: 14, padding: "20px 24px",
        display: "flex", flexDirection: "column", gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{label}</span>
        <div style={{ background: PAGE_BG, borderRadius: 8, padding: 6 }}>
          <Icon size={16} style={{ color: accent || PRIMARY }} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: DARK_TEXT }}>{value}</div>
      {progress !== undefined && (
        <div style={{ height: 6, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: PRIMARY, borderRadius: 99 }} />
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: MUTED }}>{sub}</span>
        {badge && (
          <span style={{ background: badge.color + "18", color: badge.color, borderRadius: 6, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>
            {badge.text}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Custom Pie Label ─────────────────────────────────────────────────────────
const RADIAN = Math.PI / 180;
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (percent < 0.04) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fontWeight: 600 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function BudgetSpendPage() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [shiftFrom, setShiftFrom] = useState("Paid Ads");
  const [shiftTo, setShiftTo]   = useState("LinkedIn ABM");
  const [amount, setAmount]     = useState(15000);
  const [simResult, setSimResult] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [cfoLoading, setCfoLoading] = useState(false);

  function showToast(msg: string, color: string = GREEN) {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSimulate() {
    setSimLoading(true);
    setSimResult(false);
    await new Promise(r => setTimeout(r, 1000));
    setSimLoading(false);
    setSimResult(true);
  }

  async function handleCfoApproval() {
    setCfoLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setCfoLoading(false);
    showToast("✓ Reallocation request sent to CFO Office OS", GREEN);
  }

  const fmtTick = (v: number) => v === 0 ? "" : `$${v}K`;

  function statusColor(status: string) {
    if (status === "Over Budget") return RED;
    if (status === "Under Budget") return GREEN;
    return AMBER;
  }

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "32px 40px", fontFamily: "Inter, sans-serif" }}>
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} color={toast.color} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: DARK_TEXT, margin: 0 }}>Budget &amp; Spend</h1>
        <p style={{ color: MUTED, marginTop: 4, fontSize: 14 }}>FY2026 budget intelligence, variance analysis &amp; reallocation</p>
      </motion.div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16, marginBottom: 16 }}>
        <StatCard label="Total Budget"  value="$4.2M"  sub="FY2026"                icon={DollarSign} />
        <StatCard label="Committed"     value="$3.8M"  sub="90% committed"         icon={BarChart3}  accent={BLUE} />
        <StatCard label="Spent"         value="$2.89M" sub="69% of total"          icon={TrendingUp} accent={PRIMARY} progress={69} />
        <StatCard label="Remaining"     value="$1.31M" sub="Forecast: on track Q4" icon={CheckCircle2} accent={GREEN}
          badge={{ text: "on track", color: GREEN }} />
      </div>

      {/* Quarterly BarChart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20, marginTop: 16, marginBottom: 16 }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 600, color: DARK_TEXT, marginBottom: 12 }}>Quarterly Budget vs Actual</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={quarterlyData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis dataKey="quarter" tick={{ fill: MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v === 0 ? "" : `$${v}K`} />
            <Tooltip
              formatter={(v: any, name: any) => [`$${v}K`, name === "budget" ? "Budget" : "Actual"]}
              contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
            />
            <Legend formatter={(v) => v === "budget" ? "Budget" : "Actual"} />
            <Bar dataKey="budget" fill="hsl(30,15%,75%)" radius={[4,4,0,0]} name="budget" />
            <Bar dataKey="actual" fill={PRIMARY}          radius={[4,4,0,0]} name="actual" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Two-column: Vendor Pie + Variance Table */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Vendor Spend Pie */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 600, color: DARK_TEXT, marginBottom: 12 }}>Vendor Spend Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={vendorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={88} labelLine={false} label={PieLabel}>
                {vendorData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [`$${v}K`]} contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 12px", marginTop: 10 }}>
            {vendorData.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: MUTED }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                {d.name} ${d.value}K
              </div>
            ))}
          </div>
        </motion.div>

        {/* Variance Table */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
          style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}
        >
          <div style={{ padding: "16px 20px 8px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: DARK_TEXT, margin: 0 }}>Variance Analysis</h2>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {["Category","Budget","Actual","Variance","Var%","Status"].map(h => (
                  <th key={h} style={{ textAlign: h === "Category" ? "left" : "right", padding: "8px 12px", fontSize: 10, fontWeight: 700, color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {varianceRows.map(r => {
                const sc = statusColor(r.status);
                const varColor = r.variance > 0 ? RED : GREEN;
                return (
                  <tr key={r.cat} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "9px 12px", fontWeight: 500, color: DARK_TEXT }}>{r.cat}</td>
                    <td style={{ padding: "9px 12px", textAlign: "right", color: MUTED }}>${r.budget}K</td>
                    <td style={{ padding: "9px 12px", textAlign: "right", color: MUTED }}>${r.actual}K</td>
                    <td style={{ padding: "9px 12px", textAlign: "right", color: varColor, fontWeight: 600 }}>
                      {r.variance > 0 ? "+" : ""}{r.variance}K
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", color: varColor, fontWeight: 600 }}>
                      {r.pct > 0 ? "+" : ""}{r.pct}%
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right" }}>
                      <span style={{ background: sc + "18", color: sc, borderRadius: 6, padding: "2px 7px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Reallocation Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, marginBottom: 16 }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: DARK_TEXT, margin: 0 }}>Budget Reallocation Simulator</h2>
          <span style={{ fontSize: 11, color: MUTED, fontWeight: 500, background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 99, padding: "2px 9px" }}>
            Powered by Lyzr AI
          </span>
        </div>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>Model pipeline impact before submitting for CFO approval.</p>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, flexWrap: "wrap" }}>
          {/* From */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: MUTED }}>From:</label>
            <div style={{ position: "relative" }}>
              <select value={shiftFrom} onChange={e => setShiftFrom(e.target.value)}
                style={{ appearance: "none", background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 32px 8px 12px", fontSize: 13, color: DARK_TEXT, cursor: "pointer" }}>
                {shiftFromOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: MUTED, pointerEvents: "none" }} />
            </div>
          </div>

          {/* To */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: MUTED }}>To:</label>
            <div style={{ position: "relative" }}>
              <select value={shiftTo} onChange={e => setShiftTo(e.target.value)}
                style={{ appearance: "none", background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 32px 8px 12px", fontSize: 13, color: DARK_TEXT, cursor: "pointer" }}>
                {shiftToOptions.map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: MUTED, pointerEvents: "none" }} />
            </div>
          </div>

          {/* Amount */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: MUTED }}>Amount</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: MUTED, fontSize: 13 }}>$</span>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
                style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 12px 8px 22px", fontSize: 13, color: DARK_TEXT, width: 120 }} />
            </div>
          </div>

          <button onClick={handleSimulate} disabled={simLoading}
            style={{
              background: BLUE, color: "#fff", border: "none", borderRadius: 9,
              padding: "9px 18px", fontSize: 13, fontWeight: 600,
              cursor: simLoading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 6,
              opacity: simLoading ? 0.7 : 1,
            }}>
            {simLoading ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />Simulating…</> : "📊 Simulate Impact"}
          </button>
        </div>

        <AnimatePresence>
          {simResult && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: 20, overflow: "hidden" }}>
              <div style={{ background: GREEN + "12", border: `1px solid ${GREEN}40`, borderRadius: 10, padding: 18, marginBottom: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, marginBottom: 10 }}>PROJECTED IMPACT</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: DARK_TEXT, fontWeight: 500 }}>{shiftFrom}</span>
                    <span style={{ color: RED, fontWeight: 600 }}>-${amount.toLocaleString()} spend → projected -$54K pipeline</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: DARK_TEXT, fontWeight: 500 }}>{shiftTo}</span>
                    <span style={{ color: GREEN, fontWeight: 600 }}>+${amount.toLocaleString()} spend → projected +$180K pipeline</span>
                  </div>
                  <div style={{ borderTop: `1px solid ${GREEN}30`, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT }}>Net projected uplift</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>+$126K pipeline</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <span style={{ fontSize: 12, color: MUTED }}>ROAS impact: 4.2× → <strong style={{ color: GREEN }}>4.6× (projected)</strong></span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <button onClick={handleCfoApproval} disabled={cfoLoading}
                  style={{
                    background: PRIMARY, color: "hsl(36,33%,94%)", border: "none", borderRadius: 9,
                    padding: "9px 18px", fontSize: 13, fontWeight: 600,
                    cursor: cfoLoading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: 6, opacity: cfoLoading ? 0.7 : 1,
                  }}>
                  {cfoLoading ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />Submitting…</> : "📨 Submit for CFO Approval"}
                </button>
                <button onClick={() => { setSimResult(false); }}
                  style={{ background: "none", border: "none", color: MUTED, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                  Reset Simulation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Monthly Burn Rate AreaChart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20, marginBottom: 16 }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 600, color: DARK_TEXT, marginBottom: 12 }}>Monthly Burn Rate — FY2026</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={burnData}>
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={PRIMARY} stopOpacity={0.3} />
                <stop offset="95%" stopColor={PRIMARY} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}K`} />
            <Tooltip contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`$${v}K`]} />
            <Legend />
            <Area type="monotone" dataKey="budget" name="Budget Ceiling" stroke={BORDER}  fill="none" strokeWidth={2} strokeDasharray="6 3" />
            <Area type="monotone" dataKey="spent"  name="Cumul. Spend"   stroke={PRIMARY} fill="url(#spendGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
