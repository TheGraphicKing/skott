"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Download, TrendingUp, Zap, Brain,
  ChevronRight, CircleDot, BarChart3, Activity,
} from "lucide-react";
import {
  AreaChart, Area, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ComposedChart,
} from "recharts";

// ─── Brand Colors ─────────────────────────────────────────────────────────────
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

// ─── Pipeline Trend Data ──────────────────────────────────────────────────────
const pipelineData = [
  { month: "Nov", pipeline: 4.2, target: 8.5 },
  { month: "Dec", pipeline: 4.8, target: 8.5 },
  { month: "Jan", pipeline: 5.1, target: 8.5 },
  { month: "Feb", pipeline: 5.6, target: 8.5 },
  { month: "Mar", pipeline: 5.9, target: 8.5 },
  { month: "Apr", pipeline: 6.2, target: 8.5 },
];

// ─── Campaign Data ────────────────────────────────────────────────────────────
const campaigns = [
  {
    name: "Agentic OS for BFSI",
    statusLabel: "High Risk",
    statusColor: RED,
    note: "Launch tomorrow — 3 assets pending",
    avatars: ["EW", "MS"],
    roas: "3.4×",
  },
  {
    name: "LinkedIn ABM Enterprise",
    statusLabel: "On Track",
    statusColor: GREEN,
    note: "8 accounts engaged this week",
    avatars: ["PS", "RK"],
    roas: "4.8×",
  },
  {
    name: "AWS Partnership Announcement",
    statusLabel: "On Track",
    statusColor: GREEN,
    note: "Press release approved",
    avatars: ["RP"],
    roas: "4.2×",
  },
  {
    name: "OGI Whitepaper Campaign",
    statusLabel: "At Risk",
    statusColor: AMBER,
    note: "2 days behind schedule",
    avatars: ["EW", "DK"],
    roas: "2.8×",
  },
];

// ─── Funnel Data ──────────────────────────────────────────────────────────────
const funnelStages = [
  { label: "Leads",      count: 12400, widthPct: 100, conv: null },
  { label: "MQL",        count: 5208,  widthPct: 42,  conv: "42% conversion" },
  { label: "SQL",        count: 2232,  widthPct: 32,  conv: "43% conversion" },
  { label: "Opportunity",count: 992,   widthPct: 22,  conv: "44% conversion" },
  { label: "Customer",   count: 373,   widthPct: 13,  conv: "38% conversion" },
];

// ─── AI Recommendations ───────────────────────────────────────────────────────
const recommendations = [
  {
    id: 1,
    dot: PRIMARY,
    headline: "Reallocate $15K: Display → LinkedIn ABM",
    desc: "Projected +$180K pipeline uplift",
    action: "Apply",
  },
  {
    id: 2,
    dot: AMBER,
    headline: "BFSI launch: 3 assets still pending",
    desc: "Assign Morgan Blake — due tomorrow",
    action: "Assign",
  },
  {
    id: 3,
    dot: BLUE,
    headline: "Moveworks comparison blog published",
    desc: "Recommend counter-content within 48h",
    action: "Brief",
  },
];

// ─── Active Agents ────────────────────────────────────────────────────────────
const activeAgents = [
  { name: "Campaign Strategist", task: "Generating BFSI Q3 strategy",    pct: 92,  indeterminate: false },
  { name: "Email Sequencer",     task: "Sending to 1,200 contacts",       pct: 78,  indeterminate: false },
  { name: "SEO Optimizer",       task: "Updating 14 meta descriptions",   pct: 45,  indeterminate: false },
  { name: "Competitor Monitor",  task: "Tracking Moveworks blog",         pct: 0,   indeterminate: true  },
];

// ─── Avatar Bubble ────────────────────────────────────────────────────────────
function AvatarBubble({ initials, idx }: { initials: string; idx: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: PRIMARY,
        color: "#fff",
        fontSize: 9,
        fontWeight: 700,
        border: "2px solid #fff",
        marginLeft: idx === 0 ? 0 : -6,
        position: "relative",
        zIndex: 10 - idx,
      }}
    >
      {initials}
    </span>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div
      style={{
        height: 6,
        background: BORDER,
        borderRadius: 99,
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ height: "100%", background: color, borderRadius: 99 }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CommandCentrePage() {
  const [doneRecs, setDoneRecs] = useState<Set<number>>(new Set());

  function markDone(id: number) {
    setDoneRecs((prev) => new Set([...prev, id]));
  }

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "24px" }}>

      {/* ── 1. Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: DARK_TEXT }}>Command Centre</h1>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: MUTED }}>
            Real-time marketing intelligence — Lyzr AI
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: MUTED }}>Thursday, May 15, 2026</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 500, color: DARK_TEXT,
              background: "transparent", border: `1px solid ${BORDER}`,
              borderRadius: 8, padding: "6px 12px", cursor: "pointer",
            }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600, color: "#fff",
              background: PRIMARY, border: "none",
              borderRadius: 8, padding: "6px 14px", cursor: "pointer",
            }}
          >
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* ── 2. Morning Brief ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: PRIMARY,
          borderRadius: 14,
          padding: "18px 22px",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Morning Brief — AI Generated
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#fff", lineHeight: 1.65 }}>
            Good morning, Sarah. Pipeline is{" "}
            <strong>27% behind plan</strong> at{" "}
            <strong>$6.2M vs $8.5M target</strong>. Paid media CAC improved{" "}
            <strong>8%</strong> this week to{" "}
            <strong>$284</strong>.{" "}
            <strong>4 items</strong> need your approval before end of day. The{" "}
            &lsquo;Agentic OS for BFSI&rsquo; campaign launches tomorrow — 3 creative
            assets still pending Morgan Blake&rsquo;s delivery.
          </p>
        </div>
        <div
          style={{
            flexShrink: 0,
            textAlign: "right",
            fontSize: 11,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 700, color: "#fff" }}>Sarah Chen</div>
          <div>CMO, Lyzr AI</div>
        </div>
      </motion.div>

      {/* ── 3. KPI Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {/* Revenue Influenced */}
        {[
          {
            label: "Revenue Influenced",
            value: "$1.84M",
            delta: "↑12%",
            deltaColor: GREEN,
            sub: "vs last quarter",
            extra: null,
          },
          {
            label: "Pipeline Generated",
            value: "$6.2M",
            delta: "↑8%",
            deltaColor: GREEN,
            sub: "73% to $8.5M plan",
            extra: "amber-bar",
          },
          {
            label: "CAC",
            value: "$284",
            delta: "↓8%",
            deltaColor: GREEN,
            sub: "was $308 last quarter",
            extra: null,
          },
          {
            label: "ROAS",
            value: "4.2×",
            delta: "↑0.3×",
            deltaColor: GREEN,
            sub: "target 4.0×",
            extra: null,
          },
          {
            label: "Active Campaigns",
            value: "23",
            delta: null,
            deltaColor: null,
            sub: null,
            extra: "campaigns-sub",
          },
          {
            label: "Budget Used",
            value: "$2.89M / $4.2M",
            delta: null,
            deltaColor: null,
            sub: null,
            extra: "budget-bar",
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.4 }}
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: "16px",
            }}
          >
            <div style={{ fontSize: 11, color: MUTED, fontWeight: 500, marginBottom: 6 }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: DARK_TEXT, marginBottom: 8 }}>
              {kpi.value}
            </div>

            {kpi.delta && (
              <span
                style={{
                  display: "inline-block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: kpi.deltaColor!,
                  background: kpi.deltaColor! + "20",
                  borderRadius: 99,
                  padding: "2px 8px",
                  marginBottom: 4,
                }}
              >
                {kpi.delta}
              </span>
            )}

            {kpi.sub && (
              <div style={{ fontSize: 11, color: MUTED }}>{kpi.sub}</div>
            )}

            {kpi.extra === "amber-bar" && (
              <div style={{ marginTop: 6 }}>
                <div
                  style={{
                    height: 4,
                    background: BORDER,
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "73%" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                      height: "100%",
                      background: AMBER,
                      borderRadius: 99,
                    }}
                  />
                </div>
              </div>
            )}

            {kpi.extra === "campaigns-sub" && (
              <div style={{ fontSize: 11, color: MUTED }}>
                7 planning &nbsp;·&nbsp;{" "}
                <span style={{ color: RED }}>3 at risk</span>
              </div>
            )}

            {kpi.extra === "budget-bar" && (
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>69% used</div>
                <div
                  style={{
                    height: 4,
                    background: BORDER,
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "69%" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                      height: "100%",
                      background: PRIMARY,
                      borderRadius: 99,
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── 4. Two-Column Section ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* LEFT: Campaign Health + Marketing Funnel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Campaign Health */}
          <div
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: DARK_TEXT }}>
                Campaign Health
              </span>
              <a
                href="/campaigns"
                style={{
                  fontSize: 13,
                  color: BLUE,
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                View all →
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {campaigns.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: PAGE_BG,
                    borderLeft: `4px solid ${c.statusColor}`,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: DARK_TEXT,
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11, color: MUTED }}>{c.note}</div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: c.statusColor,
                        background: c.statusColor + "18",
                        borderRadius: 99,
                        padding: "2px 8px",
                      }}
                    >
                      {c.statusLabel}
                    </span>
                    <span style={{ fontSize: 11, color: MUTED }}>ROAS {c.roas}</span>
                  </div>

                  <div style={{ display: "flex", flexShrink: 0 }}>
                    {c.avatars.map((av, ai) => (
                      <AvatarBubble key={av} initials={av} idx={ai} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Marketing Funnel */}
          <div
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: "20px",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: DARK_TEXT }}>
                Marketing Funnel
              </span>
              <span style={{ fontSize: 11, color: MUTED, marginLeft: 10 }}>
                12,400 total leads this quarter
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {funnelStages.map((stage, i) => {
                const opacities = [1, 0.8, 0.6, 0.4, 0.25];
                return (
                  <div key={stage.label}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ fontSize: 11, color: MUTED, fontWeight: 500, width: 80 }}>
                        {stage.label}
                      </span>
                      {stage.conv && (
                        <span style={{ fontSize: 10, color: MUTED }}>{stage.conv}</span>
                      )}
                    </div>
                    <div
                      style={{
                        height: 28,
                        background: BORDER,
                        borderRadius: 6,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.widthPct}%` }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.7 }}
                        style={{
                          height: "100%",
                          background: PRIMARY,
                          opacity: opacities[i],
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: 10,
                        }}
                      >
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>
                          {stage.count.toLocaleString()}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: AI Recommendations + Active Agents */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* AI Recommendations */}
          <div
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: DARK_TEXT }}>
                AI Recommendations
              </span>
              <button
                style={{
                  fontSize: 11,
                  color: MUTED,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
                onClick={() =>
                  setDoneRecs(new Set(recommendations.map((r) => r.id)))
                }
              >
                Dismiss all
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recommendations.map((rec, i) => {
                const done = doneRecs.has(rec.id);
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    style={{
                      background: PAGE_BG,
                      borderRadius: 8,
                      padding: "12px 14px",
                    }}
                  >
                    <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: rec.dot,
                          flexShrink: 0,
                          marginTop: 3,
                        }}
                      />
                      <div style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT }}>
                        {rec.headline}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: MUTED, marginBottom: 10, paddingLeft: 16 }}>
                      {rec.desc}
                    </div>
                    <div style={{ paddingLeft: 16 }}>
                      <AnimatePresence mode="wait">
                        {done ? (
                          <motion.span
                            key="done"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ fontSize: 12, fontWeight: 700, color: GREEN }}
                          >
                            ✓ Done
                          </motion.span>
                        ) : (
                          <motion.button
                            key="btn"
                            initial={{ opacity: 1 }}
                            onClick={() => markDone(rec.id)}
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#fff",
                              background: PRIMARY,
                              border: "none",
                              borderRadius: 6,
                              padding: "4px 12px",
                              cursor: "pointer",
                            }}
                          >
                            {rec.action}
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Active Agents */}
          <div
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: GREEN,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: DARK_TEXT }}>
                Active Agents
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 12,
                  fontWeight: 600,
                  color: GREEN,
                }}
              >
                20 running
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {activeAgents.map((agent, i) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.07 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT }}>
                        {agent.name}
                      </div>
                      <div style={{ fontSize: 11, color: MUTED }}>{agent.task}</div>
                    </div>
                    {!agent.indeterminate && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: PRIMARY }}>
                        {agent.pct}%
                      </span>
                    )}
                  </div>

                  {agent.indeterminate ? (
                    <div
                      style={{
                        height: 6,
                        background: BORDER,
                        borderRadius: 99,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.4,
                          ease: "linear",
                        }}
                        style={{
                          width: "35%",
                          height: "100%",
                          background: `linear-gradient(90deg, transparent, ${PRIMARY}, transparent)`,
                          borderRadius: 99,
                        }}
                      />
                    </div>
                  ) : (
                    <ProgressBar pct={agent.pct} color={PRIMARY} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Pipeline Trend Chart ── */}
      <div
        style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: "20px",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: DARK_TEXT, marginBottom: 16 }}>
          Pipeline Trend — Last 6 Months
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={pipelineData} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="pipelineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.3} />
                <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: MUTED }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: MUTED }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}M`}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: `1px solid ${BORDER}`,
                background: CARD,
              }}
              formatter={(v: any, name: any) => [
                `$${v}M`,
                name === "pipeline" ? "Pipeline" : "Target",
              ]}
            />
            <Area
              type="monotone"
              dataKey="pipeline"
              stroke={PRIMARY}
              strokeWidth={2}
              fill="url(#pipelineGrad)"
              dot={{ fill: PRIMARY, r: 3, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke={BORDER}
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
