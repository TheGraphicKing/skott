"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, TrendingUp, CheckCircle2,
  Loader2, X, Shield, AlertTriangle, Activity, MessageSquare,
} from "lucide-react";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
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
const sentimentBars = [
  { label: "Positive", value: 68, color: GREEN },
  { label: "Neutral",  value: 22, color: AMBER },
  { label: "Negative", value: 10, color: RED   },
];

const sentimentTrend = [
  { month: "Nov", positive: 61 },
  { month: "Dec", positive: 63 },
  { month: "Jan", positive: 64 },
  { month: "Feb", positive: 65 },
  { month: "Mar", positive: 67 },
  { month: "Apr", positive: 68 },
];

const sovData = [
  { name: "Lyzr AI",    value: 18, color: PRIMARY },
  { name: "Moveworks",  value: 24, color: "#6b7280" },
  { name: "Adept AI",   value: 15, color: BLUE },
  { name: "AutoGPT",    value: 12, color: AMBER },
  { name: "LangChain",  value: 9,  color: "hsl(280,45%,40%)" },
  { name: "Others",     value: 22, color: BORDER },
];

const competitorRows = [
  { id: 1, name: "Moveworks", move: "Published 'Lyzr vs Moveworks' comparison blog", date: "2 days ago", threat: "HIGH",   action: "Generate Response" },
  { id: 2, name: "Adept AI",  move: "Announced 'Adept for Finance' product launch",  date: "1 week ago", threat: "MEDIUM", action: "Monitor" },
  { id: 3, name: "AutoGPT",   move: "Released v0.5 with marketing plugins",           date: "3 days ago", threat: "LOW",    action: "Dismiss" },
  { id: 4, name: "LangChain", move: "LangSmith GA — targeting dev teams",             date: "5 days ago", threat: "LOW",    action: "Dismiss" },
];

const reviews = [
  { id: 1, stars: 5, reviewer: "Alex M.",  company: "Firstsource", quote: "Best agentic AI platform — saves 12h/week on campaign management", platform: "G2" },
  { id: 2, stars: 5, reviewer: "Sarah K.", company: "Accenture",   quote: "Excellent ROI tracking and campaign attribution", platform: "Capterra" },
  { id: 3, stars: 5, reviewer: "James L.", company: "Hitachi",     quote: "Transformed our BFSI marketing operations", platform: "G2" },
  { id: 4, stars: 4, reviewer: "Maria P.", company: "WTW",         quote: "Steep learning curve but powerful once configured", platform: "Capterra" },
];

// ─── Toast ───────────────────────────────────────────────────────────────────
type ToastData = { msg: string; color: string };

function Toast({ msg, color, onClose }: ToastData & { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      style={{
        position: "fixed", top: 16, right: 16, zIndex: 50,
        background: CARD, borderLeft: `4px solid ${color}`,
        padding: "12px 20px", borderRadius: 10,
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        minWidth: 280, fontSize: 14, fontWeight: 500, color: DARK_TEXT,
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
function StatCard({ label, value, sub, icon: Icon, accent, badge }: {
  label: string; value: string; sub: string; icon: any; accent?: string;
  badge?: { text: string; color: string };
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{label}</span>
        <div style={{ background: PAGE_BG, borderRadius: 8, padding: 6 }}>
          <Icon size={16} style={{ color: accent || PRIMARY }} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: DARK_TEXT }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
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

// ─── Threat Badge ─────────────────────────────────────────────────────────────
function ThreatBadge({ level }: { level: string }) {
  const c = level === "HIGH" ? RED : level === "MEDIUM" ? AMBER : GREEN;
  return <span style={{ background: c + "18", color: c, borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 700 }}>{level}</span>;
}

// ─── Pie Label ────────────────────────────────────────────────────────────────
const RADIAN = Math.PI / 180;
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  return (
    <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)}
      fill="#fff" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fontWeight: 600 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i <= n ? AMBER : "transparent"} style={{ color: AMBER }} />
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function BrandReputationPage() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [crisisActive, setCrisisActive] = useState(false);
  const [crisisLaunching, setCrisisLaunching] = useState(false);
  const [loadingRow, setLoadingRow] = useState<number | null>(null);
  const [dismissedRows, setDismissedRows] = useState<number[]>([]);
  const [loadingReview, setLoadingReview] = useState<number | null>(null);

  function showToast(msg: string, color: string = GREEN) {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleCompetitorAction(id: number, action: string) {
    if (action === "Dismiss") {
      setDismissedRows(prev => [...prev, id]);
      return;
    }
    if (action === "Monitor") {
      showToast("Added to monitoring watchlist", AMBER);
      return;
    }
    // Generate Response
    setLoadingRow(id);
    await new Promise(r => setTimeout(r, 1500));
    setLoadingRow(null);
    showToast("Counter-content brief created and assigned to Emily Watson", GREEN);
  }

  async function handleLaunchCrisis() {
    setCrisisLaunching(true);
    await new Promise(r => setTimeout(r, 800));
    setCrisisLaunching(false);
    setCrisisActive(false);
    showToast("Crisis response workflow activated. Team notified via Slack.", RED);
  }

  async function handleReviewRespond(id: number) {
    setLoadingReview(id);
    await new Promise(r => setTimeout(r, 1200));
    setLoadingReview(null);
    showToast("Response drafted. Review in Content Studio.", GREEN);
  }

  const visibleCompetitors = competitorRows.filter(c => !dismissedRows.includes(c.id));

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "32px 40px", fontFamily: "Inter, sans-serif" }}>
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} color={toast.color} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: DARK_TEXT, margin: 0 }}>Brand &amp; Reputation</h1>
        <p style={{ color: MUTED, marginTop: 4, fontSize: 14 }}>Share of voice, sentiment monitoring &amp; competitive positioning</p>
      </motion.div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16, marginBottom: 16 }}>
        <StatCard label="NPS Score"      value="42"         sub="Industry avg 38"       icon={Star}          accent={GREEN}
          badge={{ text: "Above Average", color: GREEN }} />
        <StatCard label="Share of Voice" value="18%"        sub="vs Moveworks 24%"       icon={Activity}      accent={BLUE} />
        <StatCard label="Sentiment"      value="68% Positive" sub="↑3% from last month"  icon={MessageSquare} accent={AMBER} />
        <StatCard label="Brand Searches" value="12,400/mo"  sub="↑14%"                  icon={TrendingUp}    accent={GREEN} />
      </div>

      {/* Two-column: Sentiment + SOV Pie */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Sentiment */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: DARK_TEXT, marginBottom: 16 }}>Sentiment Breakdown</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {sentimentBars.map(d => (
              <div key={d.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: MUTED, marginBottom: 5 }}>
                  <span>{d.label}</span>
                  <span style={{ fontWeight: 700, color: d.color }}>{d.value}%</span>
                </div>
                <div style={{ height: 8, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${d.value}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ height: "100%", background: d.color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT, marginBottom: 10 }}>Positive Sentiment Trend</h3>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={sentimentTrend}>
              <defs>
                <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GREEN} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={GREEN} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 75]} tick={{ fill: MUTED, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}%`, "Positive"]} />
              <Area type="monotone" dataKey="positive" stroke={GREEN} fill="url(#sentGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Share of Voice Pie */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: DARK_TEXT, marginBottom: 8 }}>Share of Voice — AI Agents Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sovData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} labelLine={false} label={PieLabel}>
                {sovData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
            {sovData.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />
                <span style={{ fontWeight: d.name === "Lyzr AI" ? 700 : 400, color: d.name === "Lyzr AI" ? PRIMARY : MUTED }}>{d.name}</span>
                <span style={{ fontWeight: 600, color: DARK_TEXT }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Competitor Content Tracker */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "16px 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: DARK_TEXT, margin: 0 }}>Competitor Moves</h2>
          <span style={{ fontSize: 11, color: MUTED }}>Last 7 days</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}`, borderTop: `1px solid ${BORDER}` }}>
              {["Competitor","Move","Date","Threat","Action"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 16px", fontSize: 10, fontWeight: 700, color: MUTED }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {visibleCompetitors.map(c => (
                <motion.tr key={c.id}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: DARK_TEXT }}>{c.name}</td>
                  <td style={{ padding: "12px 16px", color: MUTED, maxWidth: 300 }}>{c.move}</td>
                  <td style={{ padding: "12px 16px", color: MUTED, whiteSpace: "nowrap" }}>{c.date}</td>
                  <td style={{ padding: "12px 16px" }}><ThreatBadge level={c.threat} /></td>
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => handleCompetitorAction(c.id, c.action)}
                      disabled={loadingRow === c.id}
                      style={{
                        background: c.action === "Generate Response" ? PRIMARY : PAGE_BG,
                        color: c.action === "Generate Response" ? "hsl(36,33%,94%)" : MUTED,
                        border: `1px solid ${c.action === "Generate Response" ? PRIMARY : BORDER}`,
                        borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                        cursor: loadingRow === c.id ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", gap: 5, opacity: loadingRow === c.id ? 0.7 : 1,
                      }}>
                      {loadingRow === c.id ? <><Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} />Creating…</> : c.action}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Crisis Detection */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <AnimatePresence mode="wait">
          {!crisisActive ? (
            <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ background: GREEN + "12", border: `1px solid ${GREEN}40`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Shield size={16} style={{ color: GREEN }} />
                <span style={{ fontWeight: 600, color: GREEN, fontSize: 14 }}>✓ No Active Crises</span>
                <span style={{ color: MUTED, fontSize: 13 }}>Last checked 2 min ago by Crisis Detector agent</span>
              </div>
              <button onClick={() => setCrisisActive(true)}
                style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 7, padding: "5px 12px", fontSize: 12, color: MUTED, cursor: "pointer", fontWeight: 500 }}>
                🔴 Simulate Crisis
              </button>
            </motion.div>
          ) : (
            <motion.div key="crisis" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{ background: RED + "10", border: `1px solid ${RED}40`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <AlertTriangle size={16} style={{ color: RED }} />
                <span style={{ fontWeight: 700, color: RED, fontSize: 14 }}>🚨 CRISIS DETECTED:</span>
                <span style={{ color: DARK_TEXT, fontSize: 13 }}>Negative PR spike on LinkedIn — 42 mentions in 1h. Sentiment dropped 18% in 30 min.</span>
                <button onClick={handleLaunchCrisis} disabled={crisisLaunching}
                  style={{
                    background: RED, color: "#fff", border: "none", borderRadius: 8,
                    padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: crisisLaunching ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: 6, opacity: crisisLaunching ? 0.7 : 1,
                  }}>
                  {crisisLaunching ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />Activating…</> : "🚀 Launch Crisis Response"}
                </button>
              </div>
              <button onClick={() => setCrisisActive(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}>
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* G2 / Capterra Reviews */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: DARK_TEXT, margin: 0 }}>Recent Reviews</h2>
          <span style={{ background: "#FF4B4B18", color: "#FF4B4B", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>G2</span>
          <span style={{ background: "#0070C018", color: "#0070C0", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>Capterra</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <Stars n={r.stars} />
                <span style={{
                  background: r.platform === "G2" ? "#FF4B4B18" : "#0070C018",
                  color: r.platform === "G2" ? "#FF4B4B" : "#0070C0",
                  borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700,
                }}>
                  {r.platform}
                </span>
              </div>
              <p style={{ fontSize: 13, color: DARK_TEXT, lineHeight: 1.5, marginBottom: 10, fontStyle: "italic" }}>"{r.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT }}>{r.reviewer}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{r.company}</div>
                </div>
                <button onClick={() => handleReviewRespond(r.id)} disabled={loadingReview === r.id}
                  style={{
                    background: CARD, border: `1px solid ${BORDER}`, borderRadius: 7,
                    padding: "5px 12px", fontSize: 12, fontWeight: 500, color: PRIMARY,
                    cursor: loadingReview === r.id ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: 5, opacity: loadingReview === r.id ? 0.7 : 1,
                  }}>
                  {loadingReview === r.id ? <><Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} />Drafting…</> : "Respond"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
