"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Download, TrendingUp, Zap, Brain,
  ChevronRight, CircleDot, BarChart3, Activity,
  Rocket, PenTool, DollarSign, CheckCircle, X,
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

// ─── Quick Actions Data ───────────────────────────────────────────────────────
const quickActions = [
  {
    id: "launch-campaign",
    label: "Launch Campaign",
    icon: Rocket,
    color: PRIMARY,
    subtitle: "Start a new campaign from template",
    badge: null,
  },
  {
    id: "create-content",
    label: "Create Content",
    icon: PenTool,
    color: BLUE,
    subtitle: "Generate blog post, email, or ad copy",
    badge: null,
  },
  {
    id: "run-report",
    label: "Run Report",
    icon: BarChart3,
    color: GREEN,
    subtitle: "Generate performance snapshot",
    badge: null,
  },
  {
    id: "budget-check",
    label: "Budget Check",
    icon: DollarSign,
    color: AMBER,
    subtitle: "Review spend vs budget across channels",
    badge: null,
  },
  {
    id: "approve-pending",
    label: "Approve Pending",
    icon: CheckCircle,
    color: GREEN,
    subtitle: "4 items waiting for your review",
    badge: "4",
  },
  {
    id: "ai-brief",
    label: "AI Brief",
    icon: Brain,
    color: PRIMARY,
    subtitle: "Ask AI for strategic recommendations",
    badge: null,
  },
];

const budgetRows = [
  { channel: "LinkedIn", spent: "$28K", budget: "$35K", pct: 80 },
  { channel: "Email", spent: "$4K", budget: "$5K", pct: 80 },
  { channel: "Paid Search", spent: "$18K", budget: "$20K", pct: 90 },
  { channel: "Display", spent: "$8K", budget: "$15K", pct: 53 },
];

const pendingItems = [
  { id: "p1", label: "OGI Whitepaper final copy" },
  { id: "p2", label: "BFSI campaign brief" },
  { id: "p3", label: "Email sequence #3" },
  { id: "p4", label: "LinkedIn ad variant B" },
];

// ─── Quick Action Panel ───────────────────────────────────────────────────────
function QuickActionPanel({
  activeAction,
  onClose,
}: {
  activeAction: string | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [reportProgress, setReportProgress] = useState(0);
  const [campaignName, setCampaignName] = useState("");
  const [template, setTemplate] = useState("Product Launch");
  const [contentType, setContentType] = useState("Blog");
  const [topic, setTopic] = useState("");
  const [aiQuestion, setAiQuestion] = useState("What should I focus on today?");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [pendingStatuses, setPendingStatuses] = useState<Record<string, string>>({});

  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setLoading(false);
    setToast(null);
    setReportProgress(0);
    setAiAnswer(null);
    if (progressRef.current) clearInterval(progressRef.current);
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [activeAction]);

  function showToast(msg: string) {
    setLoading(false);
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function handleLaunch() {
    setLoading(true);
    setTimeout(() => showToast("Campaign queued for launch"), 2000);
  }

  function handleGenerate() {
    setLoading(true);
    setTimeout(() => showToast("Content sent to Content Studio"), 2000);
  }

  function handleRunReport() {
    setReportProgress(0);
    progressRef.current = setInterval(() => {
      setReportProgress((p) => {
        if (p >= 100) {
          clearInterval(progressRef.current!);
          showToast("Weekly report generated — check your inbox");
          return 100;
        }
        return p + 4;
      });
    }, 120);
  }

  function handleAIBrief() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAiAnswer(
        "Focus on the BFSI campaign launch — it's your highest-risk item. Approve the 3 pending assets, then reallocate $15K from Display to LinkedIn ABM for a projected $180K pipeline uplift. Check in with Morgan Blake on the creative delivery."
      );
    }, 2000);
  }

  function handlePending(id: string, status: "approved" | "rejected") {
    setPendingStatuses((prev) => ({ ...prev, [id]: status }));
  }

  if (!activeAction) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    fontSize: 12,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    background: PAGE_BG,
    color: DARK_TEXT,
    outline: "none",
    boxSizing: "border-box",
  };

  const primaryBtn: React.CSSProperties = {
    marginTop: 12,
    width: "100%",
    padding: "8px",
    fontSize: 12,
    fontWeight: 600,
    color: "#fff",
    background: PRIMARY,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  };

  const actionBtn = (color: string): React.CSSProperties => ({
    fontSize: 11,
    fontWeight: 600,
    color: "#fff",
    background: color,
    border: "none",
    borderRadius: 6,
    padding: "3px 10px",
    cursor: "pointer",
  });

  return (
    <AnimatePresence>
      <motion.div
        key={activeAction}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22 }}
        style={{
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: "20px",
          marginBottom: 24,
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: MUTED,
            padding: 0,
          }}
        >
          <X size={16} />
        </button>

        {/* Toast */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginBottom: 14,
              padding: "8px 14px",
              background: GREEN + "18",
              border: `1px solid ${GREEN}`,
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: GREEN,
            }}
          >
            ✓ {toast}
          </motion.div>
        )}

        {/* ── Launch Campaign ── */}
        {activeAction === "launch-campaign" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT, marginBottom: 14 }}>
              Launch Campaign
            </div>
            <label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 4 }}>
              Campaign Name
            </label>
            <input
              style={inputStyle}
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g. Q3 BFSI Push"
            />
            <label style={{ fontSize: 11, color: MUTED, display: "block", marginTop: 10, marginBottom: 4 }}>
              Template
            </label>
            <select
              style={inputStyle}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              <option>Product Launch</option>
              <option>ABM Outbound</option>
              <option>Content Drive</option>
            </select>
            <button style={primaryBtn} onClick={handleLaunch} disabled={loading}>
              {loading ? "Launching…" : "Launch"}
            </button>
          </div>
        )}

        {/* ── Create Content ── */}
        {activeAction === "create-content" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT, marginBottom: 14 }}>
              Create Content
            </div>
            <label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 4 }}>
              Content Type
            </label>
            <select
              style={inputStyle}
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              <option>Blog</option>
              <option>Email</option>
              <option>Social</option>
              <option>Ad</option>
            </select>
            <label style={{ fontSize: 11, color: MUTED, display: "block", marginTop: 10, marginBottom: 4 }}>
              Topic
            </label>
            <input
              style={inputStyle}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI for enterprise HR"
            />
            <button style={primaryBtn} onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating…" : "Generate"}
            </button>
          </div>
        )}

        {/* ── Run Report ── */}
        {activeAction === "run-report" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT, marginBottom: 14 }}>
              Run Report
            </div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>
              Generates a full performance snapshot for the current week.
            </div>
            {reportProgress > 0 && reportProgress <= 100 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>
                  Generating… {reportProgress}%
                </div>
                <div style={{ height: 6, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
                  <motion.div
                    animate={{ width: `${reportProgress}%` }}
                    transition={{ duration: 0.1 }}
                    style={{ height: "100%", background: GREEN, borderRadius: 99 }}
                  />
                </div>
              </div>
            )}
            {!toast && (
              <button
                style={{ ...primaryBtn, background: GREEN }}
                onClick={handleRunReport}
                disabled={reportProgress > 0 && reportProgress < 100}
              >
                Generate Report
              </button>
            )}
          </div>
        )}

        {/* ── Budget Check ── */}
        {activeAction === "budget-check" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT, marginBottom: 14 }}>
              Budget Check
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["Channel", "Spent", "Budget", "Usage"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "4px 8px",
                        fontSize: 11,
                        color: MUTED,
                        fontWeight: 600,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {budgetRows.map((row) => (
                  <tr key={row.channel}>
                    <td style={{ padding: "8px 8px", color: DARK_TEXT, fontWeight: 500 }}>
                      {row.channel}
                    </td>
                    <td style={{ padding: "8px 8px", color: DARK_TEXT }}>{row.spent}</td>
                    <td style={{ padding: "8px 8px", color: MUTED }}>{row.budget}</td>
                    <td style={{ padding: "8px 8px", minWidth: 80 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ flex: 1, height: 5, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${row.pct}%`,
                              background: row.pct >= 85 ? RED : AMBER,
                              borderRadius: 99,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 10, color: MUTED, flexShrink: 0 }}>{row.pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={{ ...primaryBtn, background: AMBER }}>Rebalance Budget</button>
          </div>
        )}

        {/* ── Approve Pending ── */}
        {activeAction === "approve-pending" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT, marginBottom: 14 }}>
              Approve Pending
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: PAGE_BG,
                    borderRadius: 8,
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 12, color: DARK_TEXT, flex: 1 }}>{item.label}</span>
                  {pendingStatuses[item.id] ? (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: pendingStatuses[item.id] === "approved" ? GREEN : RED,
                      }}
                    >
                      {pendingStatuses[item.id] === "approved" ? "✓ Approved" : "✕ Rejected"}
                    </span>
                  ) : (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        style={actionBtn(GREEN)}
                        onClick={() => handlePending(item.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        style={actionBtn(RED)}
                        onClick={() => handlePending(item.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AI Brief ── */}
        {activeAction === "ai-brief" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT, marginBottom: 14 }}>
              AI Brief
            </div>
            <label style={{ fontSize: 11, color: MUTED, display: "block", marginBottom: 4 }}>
              Ask the AI anything…
            </label>
            <textarea
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: 64,
                fontFamily: "inherit",
              }}
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
            />
            <button style={primaryBtn} onClick={handleAIBrief} disabled={loading}>
              {loading ? "Thinking…" : "Get Recommendation"}
            </button>
            {aiAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 14,
                  padding: "12px 14px",
                  background: PRIMARY + "10",
                  border: `1px solid ${PRIMARY}30`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: DARK_TEXT,
                  lineHeight: 1.65,
                }}
              >
                <span style={{ fontWeight: 700, color: PRIMARY }}>AI: </span>
                {aiAnswer}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CommandCentrePage() {
  const [doneRecs, setDoneRecs] = useState<Set<number>>(new Set());
  const [activeAction, setActiveAction] = useState<string | null>(null);

  function markDone(id: number) {
    setDoneRecs((prev) => new Set([...prev, id]));
  }

  function handleActionClick(id: string) {
    setActiveAction((prev) => (prev === id ? null : id));
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

      {/* ── Quick Actions Bar ── */}
      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 4,
          marginBottom: 24,
        }}
      >
        {quickActions.map((action) => {
          const Icon = action.icon;
          const isActive = activeAction === action.id;
          return (
            <motion.div
              key={action.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleActionClick(action.id)}
              style={{
                minWidth: 200,
                background: isActive ? action.color + "12" : CARD,
                border: `1px solid ${isActive ? action.color : BORDER}`,
                borderRadius: 12,
                padding: "16px",
                cursor: "pointer",
                position: "relative",
                flexShrink: 0,
              }}
            >
              {/* Badge */}
              {action.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: RED,
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: 99,
                    minWidth: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                  }}
                >
                  {action.badge}
                </span>
              )}

              {/* Icon circle */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: action.color + "26",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Icon size={17} color={action.color} />
              </div>

              {/* Text */}
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: DARK_TEXT,
                  marginBottom: 4,
                }}
              >
                {action.label}
              </div>
              <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.4 }}>
                {action.subtitle}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick Action Panel ── */}
      <QuickActionPanel
        activeAction={activeAction}
        onClose={() => setActiveAction(null)}
      />

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
