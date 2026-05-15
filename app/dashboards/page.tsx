"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, TrendingUp, DollarSign, Users, Shield,
  FileText, CheckCircle, Clock, AlertCircle, ArrowUp, ArrowDown,
  BarChart3, PieChart, Download, Zap, Brain, Target, Rocket,
  ChevronRight, CheckCheck, X, RefreshCw, Star, Activity,
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

// ─── Tab Config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "executive",    label: "Executive Dashboard", icon: LayoutDashboard },
  { id: "performance",  label: "Marketing Performance", icon: TrendingUp },
  { id: "budget",       label: "Budget & Spend", icon: DollarSign },
  { id: "team",         label: "Team Health", icon: Users },
  { id: "brand",        label: "Brand & Reputation", icon: Shield },
  { id: "board",        label: "Board Pack", icon: FileText },
  { id: "approvals",    label: "Approvals", icon: CheckCircle },
];

// ─── Shared Components ────────────────────────────────────────────────────────
function Card({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-xl p-5 ${className}`}
      style={{ background: CARD, border: `1px solid ${BORDER}`, ...style }}
    >
      {children}
    </div>
  );
}

function StatusBadge({ color, label }: { color: string; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ background: `${color}18`, color }}
    >
      {label}
    </span>
  );
}

function DeltaBadge({ value, dir }: { value: string; dir: "up" | "down" | "neutral" }) {
  const color = dir === "up" ? GREEN : dir === "down" ? RED : MUTED;
  return (
    <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color }}>
      {dir === "up" && <ArrowUp size={12} />}
      {dir === "down" && <ArrowDown size={12} />}
      {value}
    </span>
  );
}

// ─── SVG Area Chart ───────────────────────────────────────────────────────────
function AreaChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 500; const h = 80;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / (max - min || 1)) * (h - 10) - 5,
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 80 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
      ))}
    </svg>
  );
}

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
function BarChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const max = Math.max(...data);
  const w = 500; const h = 100;
  const bw = (w / data.length) * 0.55;
  const gap = w / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full" style={{ height: 120 }}>
      {data.map((v, i) => {
        const bh = (v / max) * h;
        const x = i * gap + gap / 2 - bw / 2;
        const y = h - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx="3" fill={color} opacity="0.85" />
            <text x={x + bw / 2} y={h + 14} textAnchor="middle" fill={MUTED} fontSize="10">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;
  const r = 36; const cx = 50; const cy = 50;
  const arcs = segments.map(seg => {
    const pct = seg.value / total;
    const start = cumulative;
    cumulative += pct;
    const startAngle = start * 2 * Math.PI - Math.PI / 2;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = pct > 0.5 ? 1 : 0;
    return { ...seg, d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z` };
  });
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24">
      <circle cx={cx} cy={cy} r={r} fill={CARD} />
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill={arc.color} opacity="0.9" />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.6} fill={CARD} />
    </svg>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2 w-full rounded-full" style={{ background: BORDER }}>
      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label, value, sub, icon: Icon, color, delta, dir, warning,
}: {
  label: string; value: string; sub: string; icon: React.ElementType;
  color: string; delta?: string; dir?: "up" | "down" | "neutral"; warning?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.025 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-xl p-4 flex flex-col gap-2 cursor-default"
      style={{ background: CARD, border: `1px solid ${warning ? AMBER : BORDER}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: MUTED }}>{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold" style={{ color: DARK_TEXT }}>{value}</span>
        {delta && dir && <DeltaBadge value={delta} dir={dir} />}
      </div>
      <span className="text-xs" style={{ color: MUTED }}>{sub}</span>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 1 — Executive Dashboard
// ══════════════════════════════════════════════════════════════════════════════
function ExecutiveDashboard() {
  const kpis = [
    { label: "Pipeline",             value: "$6.2M",   sub: "$8.5M target (73%)", icon: Target,    color: AMBER, delta: "-27%", dir: "down" as const, warning: true },
    { label: "Revenue Influenced",   value: "$1.84M",  sub: "$2.1M target (88%)", icon: TrendingUp, color: GREEN, delta: "+4%",  dir: "up" as const },
    { label: "CAC Payback",          value: "8.4 mo",  sub: "was 9.1 months",     icon: Activity,   color: GREEN, delta: "-8%",  dir: "up" as const },
    { label: "MER",                  value: "4.2×",    sub: "target 4.0× ✓",      icon: Zap,        color: GREEN, delta: "+5%",  dir: "up" as const },
    { label: "LTV:CAC Ratio",        value: "3.1×",    sub: "healthy threshold",   icon: Star,       color: GREEN, delta: "+0.2×", dir: "up" as const },
    { label: "Team Utilization",     value: "87%",     sub: "above 85% threshold", icon: Users,      color: AMBER, delta: "+2%",  dir: "down" as const, warning: true },
    { label: "Budget Burn",          value: "$2.89M",  sub: "$4.2M total (69%)",   icon: DollarSign, color: BLUE, delta: "on track", dir: "neutral" as const },
    { label: "Share of Voice",       value: "18%",     sub: "Moveworks 24% · Adept 15%", icon: BarChart3, color: BLUE, delta: "+1%", dir: "up" as const },
  ];

  const pipelineData = [4.1, 4.8, 5.2, 5.9, 6.0, 6.2];
  const pipelineLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const aiRecs = [
    { icon: Brain,  text: "Reallocate $40K from Events to LinkedIn ABM — projected +$280K pipeline based on current ROAS trajectory.", cta: "Apply" },
    { icon: Target, text: "BFSI vertical launch tomorrow. Pre-schedule 6 social posts and activate retargeting pixel now.", cta: "Schedule" },
    { icon: Zap,    text: "Emily Watson at 92% capacity. Reassign 2 blog briefs to agency pool to prevent bottleneck.", cta: "Reassign" },
  ];

  return (
    <motion.div
      key="executive"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Morning Brief */}
      <Card style={{ borderLeft: `4px solid ${PRIMARY}` }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${PRIMARY}18` }}>
            <Brain size={20} style={{ color: PRIMARY }} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: DARK_TEXT }}>Good morning, Sarah.</p>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              Pipeline is <span className="font-semibold" style={{ color: AMBER }}>27% behind plan</span>. Paid media CAC improved{" "}
              <span className="font-semibold" style={{ color: GREEN }}>8% this week</span>.{" "}
              <span className="font-semibold" style={{ color: AMBER }}>4 items need your approval</span>.{" "}
              <span className="font-semibold" style={{ color: PRIMARY }}>'Agentic OS for BFSI' launches tomorrow.</span>
            </p>
          </div>
        </div>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <KpiCard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Pipeline Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Pipeline Trend</h3>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>Last 6 months ($M)</p>
          </div>
          <StatusBadge color={AMBER} label="27% behind plan" />
        </div>
        <AreaChart data={pipelineData} color={AMBER} />
        <div className="flex justify-between mt-2">
          {pipelineLabels.map(l => (
            <span key={l} className="text-xs" style={{ color: MUTED }}>{l}</span>
          ))}
        </div>
      </Card>

      {/* AI Recommendations */}
      <div>
        <h3 className="font-semibold mb-3" style={{ color: DARK_TEXT }}>AI Recommendations</h3>
        <div className="space-y-3">
          {aiRecs.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <Card className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${BLUE}15` }}>
                  <rec.icon size={16} style={{ color: BLUE }} />
                </div>
                <p className="flex-1 text-sm leading-relaxed" style={{ color: DARK_TEXT }}>{rec.text}</p>
                <button
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0"
                  style={{ background: PRIMARY, color: CARD }}
                >
                  {rec.cta}
                </button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 2 — Marketing Performance
// ══════════════════════════════════════════════════════════════════════════════
function MarketingPerformance() {
  const channels = [
    { name: "Paid Search",   spend: "$142K", pipeline: "$1.8M", cac: "$312", roi: "4.2×", roiNum: 4.2 },
    { name: "LinkedIn ABM",  spend: "$98K",  pipeline: "$2.1M", cac: "$284", roi: "5.8×", roiNum: 5.8 },
    { name: "Content / SEO", spend: "$45K",  pipeline: "$890K", cac: "$196", roi: "8.2×", roiNum: 8.2 },
    { name: "Email",         spend: "$12K",  pipeline: "$420K", cac: "$84",  roi: "12.1×", roiNum: 12.1 },
    { name: "Events",        spend: "$210K", pipeline: "$1.4M", cac: "$520", roi: "2.8×", roiNum: 2.8 },
    { name: "Partner",       spend: "$38K",  pipeline: "$680K", cac: "$245", roi: "6.4×", roiNum: 6.4 },
  ];

  const campaigns = [
    { name: "BFSI Vertical Launch",  budget: "$180K", roi: "340%", color: GREEN },
    { name: "OGI Whitepaper",         budget: "$45K",  roi: "280%", color: BLUE },
    { name: "AWS Partnership",        budget: "$28K",  roi: "420%", color: PRIMARY },
  ];

  const roiData = channels.map(c => c.roiNum);
  const roiLabels = ["Search", "LinkedIn", "SEO", "Email", "Events", "Partner"];

  return (
    <motion.div
      key="performance"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Channel Table */}
      <Card>
        <h3 className="font-semibold mb-4" style={{ color: DARK_TEXT }}>Channel Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {["Channel", "Spend", "Pipeline", "CAC", "ROI"].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 text-xs font-semibold" style={{ color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {channels.map((ch, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3 pr-4 font-medium" style={{ color: DARK_TEXT }}>{ch.name}</td>
                  <td className="py-3 pr-4" style={{ color: MUTED }}>{ch.spend}</td>
                  <td className="py-3 pr-4 font-semibold" style={{ color: DARK_TEXT }}>{ch.pipeline}</td>
                  <td className="py-3 pr-4" style={{ color: MUTED }}>{ch.cac}</td>
                  <td className="py-3 pr-4">
                    <span className="font-bold" style={{ color: ch.roiNum >= 5 ? GREEN : ch.roiNum >= 3.5 ? AMBER : RED }}>
                      {ch.roi}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ROI Bar Chart */}
      <Card>
        <h3 className="font-semibold mb-4" style={{ color: DARK_TEXT }}>Channel ROI Comparison</h3>
        <BarChart data={roiData} labels={roiLabels} color={PRIMARY} />
      </Card>

      {/* Top Campaigns */}
      <Card>
        <h3 className="font-semibold mb-4" style={{ color: DARK_TEXT }}>Top Campaigns</h3>
        <div className="space-y-3">
          {campaigns.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: PAGE_BG }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 rounded-full" style={{ background: c.color }} />
                <div>
                  <p className="font-medium text-sm" style={{ color: DARK_TEXT }}>{c.name}</p>
                  <p className="text-xs" style={{ color: MUTED }}>Budget: {c.budget}</p>
                </div>
              </div>
              <StatusBadge color={c.color} label={`${c.roi} ROI`} />
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 3 — Budget & Spend
// ══════════════════════════════════════════════════════════════════════════════
function BudgetSpend() {
  const categories = [
    { name: "Paid Ads",  amount: "$1.2M", pct: 42, color: BLUE },
    { name: "Content",   amount: "$380K", pct: 13, color: GREEN },
    { name: "Events",    amount: "$540K", pct: 19, color: AMBER },
    { name: "Tools",     amount: "$280K", pct: 10, color: PRIMARY },
    { name: "Agency",    amount: "$420K", pct: 15, color: MUTED },
    { name: "Misc",      amount: "$180K", pct:  6, color: RED },
  ];

  const monthlyBurn = [310, 425, 480, 510, 530, 635];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <motion.div
      key="budget"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Budget",     value: "$4.2M",   color: PRIMARY },
          { label: "Spent",            value: "$2.89M",  color: AMBER },
          { label: "Remaining",        value: "$1.31M",  color: GREEN },
          { label: "Projected Overage", value: "-$120K", color: RED },
        ].map((item, i) => (
          <Card key={i} className="text-center">
            <p className="text-xs font-medium mb-1" style={{ color: MUTED }}>{item.label}</p>
            <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
          </Card>
        ))}
      </div>

      {/* Overall Burn Progress */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Budget Utilization</h3>
            <p className="text-xs" style={{ color: MUTED }}>$2.89M of $4.2M spent (69%)</p>
          </div>
          <StatusBadge color={AMBER} label="On Track" />
        </div>
        <ProgressBar pct={69} color={AMBER} />
        <p className="text-xs mt-2" style={{ color: RED }}>
          ⚠ At current burn rate, budget exhausted by Nov 28
        </p>
      </Card>

      {/* Category Table */}
      <Card>
        <h3 className="font-semibold mb-4" style={{ color: DARK_TEXT }}>Budget by Category</h3>
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color }} />
              <span className="text-sm flex-1 font-medium" style={{ color: DARK_TEXT }}>{cat.name}</span>
              <span className="text-sm font-semibold w-16 text-right" style={{ color: DARK_TEXT }}>{cat.amount}</span>
              <span className="text-xs w-8 text-right" style={{ color: MUTED }}>{cat.pct}%</span>
              <div className="w-24">
                <ProgressBar pct={cat.pct * 2.38} color={cat.color} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Monthly Burn Chart */}
      <Card>
        <h3 className="font-semibold mb-4" style={{ color: DARK_TEXT }}>Monthly Burn Rate ($K)</h3>
        <BarChart data={monthlyBurn} labels={months} color={PRIMARY} />
      </Card>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 4 — Team Health
// ══════════════════════════════════════════════════════════════════════════════
function TeamHealth() {
  const team = [
    { name: "Emily Watson",    role: "Content Lead",  cap: 92, color: RED },
    { name: "David Kim",       role: "SEO",           cap: 78, color: AMBER },
    { name: "Priya Sharma",    role: "Paid Media",    cap: 65, color: GREEN },
    { name: "Alex Rodriguez",  role: "Social",        cap: 71, color: GREEN },
    { name: "Jamie Liu",       role: "Email",         cap: 88, color: AMBER },
    { name: "Jordan Taylor",   role: "Ops",           cap: 55, color: GREEN },
    { name: "Morgan Blake",    role: "Designer",      cap: 94, color: RED },
  ];

  const velocityData = [18, 22, 19, 25, 21, 28];
  const velocityLabels = ["S1", "S2", "S3", "S4", "S5", "S6"];

  const blockers = [
    "BFSI creative assets — waiting on legal sign-off",
    "AWS co-marketing contract pending CFO review",
    "Webinar platform migration — IT dependency",
  ];

  const approvals = [
    "BFSI Campaign Budget +$40K",
    "Q3 Agency Contract $280K",
    "LinkedIn ABM Creative assets",
    "Press Release: AWS Partnership",
    "Q3 Headcount request — 2 FTE",
  ];

  return (
    <motion.div
      key="team"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Team Capacity */}
      <Card>
        <h3 className="font-semibold mb-4" style={{ color: DARK_TEXT }}>Team Capacity</h3>
        <div className="space-y-4">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: `${member.color}20`, color: member.color }}>
                {member.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium" style={{ color: DARK_TEXT }}>{member.name}</span>
                    <span className="text-xs ml-2" style={{ color: MUTED }}>{member.role}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: member.color }}>{member.cap}%</span>
                </div>
                <ProgressBar pct={member.cap} color={member.color} />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Sprint Velocity */}
      <Card>
        <h3 className="font-semibold mb-4" style={{ color: DARK_TEXT }}>Sprint Velocity</h3>
        <BarChart data={velocityData} labels={velocityLabels} color={GREEN} />
      </Card>

      {/* Pending Approvals & Blockers */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} style={{ color: AMBER }} />
            <h3 className="font-semibold text-sm" style={{ color: DARK_TEXT }}>Pending Approvals ({approvals.length})</h3>
          </div>
          <div className="space-y-2">
            {approvals.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs py-1" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <Clock size={12} className="flex-shrink-0 mt-0.5" style={{ color: AMBER }} />
                <span style={{ color: DARK_TEXT }}>{item}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} style={{ color: RED }} />
            <h3 className="font-semibold text-sm" style={{ color: DARK_TEXT }}>Blockers ({blockers.length})</h3>
          </div>
          <div className="space-y-2">
            {blockers.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs py-1" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <AlertCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: RED }} />
                <span style={{ color: DARK_TEXT }}>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 5 — Brand & Reputation
// ══════════════════════════════════════════════════════════════════════════════
function BrandReputation() {
  const sovData = [
    { label: "Lyzr",      value: 18, color: PRIMARY },
    { label: "Moveworks", value: 24, color: BLUE },
    { label: "Adept",     value: 15, color: GREEN },
    { label: "AutoGPT",   value: 12, color: AMBER },
    { label: "LangChain", value:  9, color: RED },
    { label: "Other",     value: 22, color: MUTED },
  ];

  const mentions = [
    { source: "TechCrunch",     text: "Lyzr's AgenticOS is reshaping how enterprise marketing teams operate at scale.", sentiment: "positive" },
    { source: "G2 Review",      text: "Finally an AI that actually understands our campaign workflows. Incredible time save.", sentiment: "positive" },
    { source: "LinkedIn Post",  text: "Impressed by Lyzr's BFSI vertical positioning — clear moat in regulated industries.", sentiment: "positive" },
  ];

  const searchData = [320, 380, 410, 460, 490, 540];
  const searchLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <motion.div
      key="brand"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* NPS + Sentiment */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-xs font-medium mb-2" style={{ color: MUTED }}>NPS Score</p>
          <p className="text-4xl font-bold" style={{ color: GREEN }}>42</p>
          <StatusBadge color={GREEN} label="Above avg (38)" />
        </Card>
        <Card>
          <p className="text-xs font-medium mb-3" style={{ color: MUTED }}>Sentiment Breakdown</p>
          <div className="space-y-2">
            {[
              { label: "Positive", pct: 68, color: GREEN },
              { label: "Neutral",  pct: 22, color: MUTED },
              { label: "Negative", pct: 10, color: RED },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs w-14" style={{ color: MUTED }}>{s.label}</span>
                <div className="flex-1"><ProgressBar pct={s.pct} color={s.color} /></div>
                <span className="text-xs font-semibold w-8 text-right" style={{ color: s.color }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="flex flex-col items-center justify-center gap-2">
          <p className="text-xs font-medium" style={{ color: MUTED }}>Share of Voice</p>
          <DonutChart segments={sovData} />
          <p className="text-lg font-bold" style={{ color: PRIMARY }}>18%</p>
        </Card>
      </div>

      {/* SOV Table */}
      <Card>
        <h3 className="font-semibold mb-4" style={{ color: DARK_TEXT }}>Share of Voice — Competitive</h3>
        <div className="space-y-3">
          {sovData.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm font-medium w-20" style={{ color: DARK_TEXT }}>{s.label}</span>
              <div className="flex-1"><ProgressBar pct={s.value * 4} color={s.color} /></div>
              <span className="text-sm font-bold w-8 text-right" style={{ color: s.color }}>{s.value}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Mentions */}
      <Card>
        <h3 className="font-semibold mb-4" style={{ color: DARK_TEXT }}>Top Mentions This Week</h3>
        <div className="space-y-3">
          {mentions.map((m, i) => (
            <div key={i} className="p-3 rounded-lg" style={{ background: PAGE_BG }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold" style={{ color: PRIMARY }}>{m.source}</span>
                <StatusBadge color={GREEN} label="Positive" />
              </div>
              <p className="text-sm italic" style={{ color: DARK_TEXT }}>"{m.text}"</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Brand Search Volume */}
      <Card>
        <h3 className="font-semibold mb-4" style={{ color: DARK_TEXT }}>Brand Search Volume Trend</h3>
        <AreaChart data={searchData} color={PRIMARY} />
        <div className="flex justify-between mt-2">
          {searchLabels.map(l => (
            <span key={l} className="text-xs" style={{ color: MUTED }}>{l}</span>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 6 — Board Pack
// ══════════════════════════════════════════════════════════════════════════════
function BoardPack() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [boardToasts, setBoardToasts] = useState<{ id: number; msg: string }[]>([]);
  const boardToastRef = React.useRef(0);

  const addBoardToast = (msg: string) => {
    const id = ++boardToastRef.current;
    setBoardToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setBoardToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  const NARRATIVE = "Q2 2026 Marketing Performance Summary: Pipeline at $6.2M (73% to $8.5M target). Revenue influenced $1.84M (88% to plan). CAC improved 8% to $284. MER at 4.2× vs 4.0× target. LinkedIn ABM is the standout channel at 5.8× ROI. Events underperforming at 2.8× — recommend reducing Q3 events spend by $80K and reallocating to LinkedIn.";

  const sections = [
    { icon: Target,    title: "Executive Summary",        summary: "Q2 pipeline $6.2M vs $8.5M plan. 3 strategic initiatives on track. BFSI vertical launch imminent." },
    { icon: TrendingUp, title: "Pipeline & Revenue",      summary: "LinkedIn ABM driving highest ROI at 5.8×. Email channel CAC lowest at $84." },
    { icon: BarChart3,  title: "Campaign Performance",    summary: "23 active campaigns. BFSI Vertical Launch top performer at 340% ROI." },
    { icon: Shield,     title: "Competitive Position",    summary: "SOV at 18%, gap vs Moveworks narrowed 2pp this quarter." },
    { icon: Users,      title: "Team & Budget",           summary: "87% avg utilization, 2 team members at risk. Budget 69% utilized, forecast on track." },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  };

  const handleExportPPT = () => {
    const blob = new Blob(["PowerPoint content"], { type: "application/vnd.ms-powerpoint" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CMO-Board-Pack-Q2-2026.pptx";
    a.click();
    URL.revokeObjectURL(url);
    addBoardToast("Board Pack exported as PPTX.");
  };

  const handleExportPDF = () => {
    const blob = new Blob(["PDF content"], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CMO-Board-Pack-Q2-2026.pdf";
    a.click();
    URL.revokeObjectURL(url);
    addBoardToast("Board Pack exported as PDF.");
  };

  const handleEmailBoard = () => {
    addBoardToast("Board deck emailed to board@lyzr.ai");
  };

  return (
    <motion.div
      key="board"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Board Toast */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {boardToasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className="pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
              style={{ background: GREEN, color: "#fff", minWidth: 260 }}
            >
              <CheckCheck size={15} /> {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Generate CTA */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Board Report Generator</h3>
            <p className="text-xs mt-1" style={{ color: MUTED }}>AI-compiled from live marketing data — Q2 2026</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: PRIMARY, color: CARD, opacity: generating ? 0.7 : 1 }}
          >
            {generating ? (
              <><RefreshCw size={16} className="animate-spin" /> Generating…</>
            ) : generated ? (
              <><CheckCheck size={16} /> Regenerate</>
            ) : (
              <><Brain size={16} /> Generate Board Report</>
            )}
          </button>
        </div>

        {generated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 pt-4"
            style={{ borderTop: `1px solid ${BORDER}` }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: GREEN }}>✓ Report ready — Q2 2026 Board Pack</p>
            {/* Narrative */}
            <div className="mb-4 p-4 rounded-xl text-sm leading-relaxed" style={{ background: PAGE_BG, color: DARK_TEXT, borderLeft: `3px solid ${PRIMARY}` }}>
              {NARRATIVE}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleExportPPT}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: BLUE, color: "#fff" }}
              >
                <Download size={12} /> Export to PPT
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: GREEN, color: "#fff" }}
              >
                <Download size={12} /> Export to PDF
              </button>
              <button
                onClick={handleEmailBoard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border"
                style={{ borderColor: BORDER, color: MUTED, background: CARD }}
              >
                📧 Email to Board
              </button>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Q1 Preview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Last Board Report — Q1 2025</h3>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>Presented April 15, 2025</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
              <Download size={12} /> PDF
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border" style={{ borderColor: BORDER, color: MUTED }}>
              <Download size={12} /> PPTX
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {sections.map((sec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: PAGE_BG }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${PRIMARY}15` }}>
                <sec.icon size={16} style={{ color: PRIMARY }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{sec.title}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: MUTED }}>{sec.summary}</p>
              </div>
              <ChevronRight size={16} className="flex-shrink-0 mt-1" style={{ color: MUTED }} />
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 7 — Approvals & Governance
// ══════════════════════════════════════════════════════════════════════════════
function ApprovalsGovernance() {
  const [approvals, setApprovals] = useState([
    { id: 1, title: "BFSI Campaign Budget +$40K",    requester: "Sarah Chen",      urgency: "urgent", status: "pending" },
    { id: 2, title: "Q3 Agency Contract $280K",       requester: "CFO Review",      urgency: "normal", status: "pending" },
    { id: 3, title: "LinkedIn ABM Creative",          requester: "Creative Review", urgency: "normal", status: "pending" },
    { id: 4, title: "Press Release: AWS Partnership", requester: "PR Review",       urgency: "normal", status: "pending" },
  ]);
  const [appToasts, setAppToasts] = useState<{ id: number; msg: string; color: string }[]>([]);
  const appToastRef = React.useRef(0);
  const [changesOpen, setChangesOpen] = useState<Record<number, boolean>>({});
  const [changesText, setChangesText] = useState<Record<number, string>>({});

  const addAppToast = (msg: string, color: string) => {
    const id = ++appToastRef.current;
    setAppToasts((t) => [...t, { id, msg, color }]);
    setTimeout(() => setAppToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  const handleApprove = (id: number) => {
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: "approved" } : a));
    addAppToast("✓ Approved", GREEN);
  };

  const handleReject = (id: number) => {
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: "rejected" } : a));
    addAppToast("✗ Rejected", RED);
  };

  const handleSubmitChanges = (id: number) => {
    setChangesOpen((o) => ({ ...o, [id]: false }));
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: "changes-requested" } : a));
    addAppToast("Changes requested and sent.", BLUE);
  };

  const audit = [
    { action: "Approved", item: "Google Ads Budget +$20K",    user: "Sarah M.",   time: "Today 9:42 AM" },
    { action: "Rejected", item: "Influencer Campaign $50K",   user: "Sarah M.",   time: "Yesterday 4:15 PM" },
    { action: "Approved", item: "Content Agency Invoice",      user: "CFO Portal", time: "Yesterday 11:30 AM" },
    { action: "Approved", item: "HubSpot Enterprise Renewal", user: "Sarah M.",   time: "May 12, 3:22 PM" },
    { action: "Reviewed", item: "Q2 Creative Brief",          user: "Sarah M.",   time: "May 11, 10:05 AM" },
  ];

  return (
    <motion.div
      key="approvals"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Approval Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {appToasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className="pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
              style={{ background: t.color, color: "#fff", minWidth: 220 }}
            >
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pending Approvals */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} style={{ color: AMBER }} />
          <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Pending Approvals</h3>
          <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${AMBER}20`, color: AMBER }}>
            {approvals.filter(a => a.status === "pending").length} pending
          </span>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {approvals.map((item) => (
              item.status === "pending" ? (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${item.urgency === "urgent" ? AMBER : BORDER}` }}
                >
                  <div
                    className="flex items-center gap-3 p-4"
                    style={{ background: PAGE_BG }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{item.title}</p>
                        {item.urgency === "urgent" && <StatusBadge color={RED} label="Urgent" />}
                      </div>
                      <p className="text-xs" style={{ color: MUTED }}>Requested by: {item.requester}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: `${GREEN}18`, color: GREEN, border: `1px solid ${GREEN}40` }}
                      >
                        <CheckCheck size={12} /> Approve
                      </button>
                      <button
                        onClick={() => setChangesOpen((o) => ({ ...o, [item.id]: !o[item.id] }))}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}40` }}
                      >
                        <FileText size={12} /> Request Changes
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: `${RED}15`, color: RED, border: `1px solid ${RED}40` }}
                      >
                        <X size={12} /> Reject
                      </button>
                    </div>
                  </div>
                  {/* Inline comment box */}
                  <AnimatePresence>
                    {changesOpen[item.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                        style={{ borderTop: `1px solid ${BORDER}`, background: CARD }}
                      >
                        <div className="p-3 flex flex-col gap-2">
                          <textarea
                            rows={2}
                            value={changesText[item.id] || ""}
                            onChange={(e) => setChangesText((t) => ({ ...t, [item.id]: e.target.value }))}
                            placeholder="Describe the changes needed…"
                            className="w-full text-xs rounded-lg px-3 py-2 resize-none"
                            style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, color: DARK_TEXT }}
                          />
                          <button
                            onClick={() => handleSubmitChanges(item.id)}
                            className="self-end px-3 py-1.5 rounded-lg text-xs font-semibold"
                            style={{ background: BLUE, color: "#fff" }}
                          >
                            Submit
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{
                    background: `${item.status === "approved" ? GREEN : item.status === "rejected" ? RED : BLUE}08`,
                    border: `1px solid ${item.status === "approved" ? GREEN : item.status === "rejected" ? RED : BLUE}30`,
                  }}
                >
                  {item.status === "approved"          && <CheckCircle size={16} style={{ color: GREEN }} />}
                  {item.status === "rejected"          && <X size={16} style={{ color: RED }} />}
                  {item.status === "changes-requested" && <FileText size={16} style={{ color: BLUE }} />}
                  <p className="text-sm" style={{ color: MUTED }}>
                    {item.title} —{" "}
                    <span className="font-semibold" style={{ color: item.status === "approved" ? GREEN : item.status === "rejected" ? RED : BLUE }}>
                      {item.status === "changes-requested" ? "Changes Requested" : item.status}
                    </span>
                  </p>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </Card>

      {/* Audit Trail */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} style={{ color: PRIMARY }} />
          <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Audit Trail</h3>
        </div>
        <div className="space-y-1">
          {audit.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 py-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <span
                className="w-16 text-xs font-semibold text-right"
                style={{ color: entry.action === "Approved" ? GREEN : entry.action === "Rejected" ? RED : BLUE }}
              >
                {entry.action}
              </span>
              <span className="flex-1 text-sm" style={{ color: DARK_TEXT }}>{entry.item}</span>
              <span className="text-xs" style={{ color: MUTED }}>{entry.user}</span>
              <span className="text-xs w-32 text-right" style={{ color: MUTED }}>{entry.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function DashboardsPage() {
  const [activeTab, setActiveTab] = useState("executive");

  const tabContent: Record<string, React.ReactNode> = {
    executive:   <ExecutiveDashboard />,
    performance: <MarketingPerformance />,
    budget:      <BudgetSpend />,
    team:        <TeamHealth />,
    brand:       <BrandReputation />,
    board:       <BoardPack />,
    approvals:   <ApprovalsGovernance />,
  };

  return (
    <div className="min-h-full" style={{ background: PAGE_BG }}>
      {/* Page Header */}
      <div className="px-8 pt-8 pb-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: DARK_TEXT }}>CMO Executive Hub</h1>
            <p className="text-sm mt-0.5" style={{ color: MUTED }}>Real-time marketing intelligence — Q2 2025</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border"
              style={{ borderColor: BORDER, color: MUTED, background: CARD }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{ background: PRIMARY, color: CARD }}
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="px-8 mt-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap relative transition-colors"
                style={{ color: active ? PRIMARY : MUTED }}
              >
                <tab.icon size={15} />
                {tab.label}
                {active && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: PRIMARY }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-8 py-6">
        <AnimatePresence mode="wait">
          {tabContent[activeTab]}
        </AnimatePresence>
      </div>
    </div>
  );
}
