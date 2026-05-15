"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, TrendingUp, Globe, Shield, DollarSign,
  ArrowUp, ArrowDown, Minus, AlertCircle, CheckCircle,
  Download, FileText, BarChart2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
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

// ─── Toast ────────────────────────────────────────────────────────────────────
type Toast = { id: number; message: string; type: "success" | "error" | "info" };

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
            style={{
              background: t.type === "success" ? GREEN : t.type === "error" ? RED : BLUE,
              color: "#fff",
              minWidth: 280,
            }}
          >
            {t.type === "success" && <CheckCircle size={15} />}
            {t.type === "error" && <AlertCircle size={15} />}
            {t.type === "info" && <FileText size={15} />}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const addToast = (message: string, type: Toast["type"] = "success") => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };
  return { toasts, addToast };
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, icon: Icon, color, badge,
}: {
  label: string; value: string; sub: string; icon: React.ElementType; color: string; badge?: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.025 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{ background: CARD, border: `1px solid ${BORDER}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: MUTED }}>{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <span className="text-2xl font-bold" style={{ color: DARK_TEXT }}>{value}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: MUTED }}>{sub}</span>
        {badge}
      </div>
    </motion.div>
  );
}

// ─── Circle Progress Ring ─────────────────────────────────────────────────────
function CircleProgress({ score }: { score: number }) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const scoreColor = score >= 90 ? GREEN : score >= 80 ? AMBER : RED;
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke={BORDER} strokeWidth="12" />
        <circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke={scoreColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ / 4}
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        <text x="65" y="60" textAnchor="middle" fontSize="22" fontWeight="bold" fill={DARK_TEXT}>{score}</text>
        <text x="65" y="76" textAnchor="middle" fontSize="10" fill={MUTED}>/100</text>
      </svg>
      <span className="text-sm font-semibold" style={{ color: MUTED }}>Technical Score</span>
    </div>
  );
}

// ─── SEO Audit Section ────────────────────────────────────────────────────────
function SEOAuditSection({ addToast }: { addToast: (msg: string, type?: Toast["type"]) => void }) {
  const [auditState, setAuditState] = useState<"idle" | "running" | "complete">("idle");
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [score, setScore] = useState(84);
  const [fixing, setFixing] = useState<Record<number, boolean>>({});
  const [fixed, setFixed] = useState<Record<number, boolean>>({});

  const statuses = [
    "Crawling 847 pages…",
    "Analyzing keyword positions…",
    "Checking Core Web Vitals…",
    "Scanning backlink profile…",
    "Generating recommendations…",
  ];

  const issues = [
    {
      id: 1,
      severity: "HIGH",
      color: RED,
      title: "3 pages with Slow LCP (>4s)",
      desc: "/blog/agentic-ai-bfsi, /solutions/enterprise, /pricing",
      scoreGain: 3,
      toast: "LCP optimized. Caching headers applied.",
    },
    {
      id: 2,
      severity: "MEDIUM",
      color: AMBER,
      title: "12 pages missing meta descriptions",
      desc: "Including /blog/* and /solutions/* pages",
      scoreGain: 4,
      toast: "12 meta descriptions auto-generated by SEO Agent.",
    },
    {
      id: 3,
      severity: "MEDIUM",
      color: AMBER,
      title: "4 broken internal links",
      desc: "Detected in /resources/ section",
      scoreGain: 3,
      toast: "Broken links redirected.",
    },
  ];

  useEffect(() => {
    if (auditState !== "running") return;
    setProgress(0);
    setStatusIdx(0);
    const start = Date.now();
    const total = 3000;
    const iv = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / total) * 100, 100);
      setProgress(pct);
      setStatusIdx(Math.floor((pct / 100) * (statuses.length - 1)));
      if (pct >= 100) {
        clearInterval(iv);
        setTimeout(() => setAuditState("complete"), 200);
      }
    }, 50);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditState]);

  const handleFix = (issue: typeof issues[0]) => {
    if (fixing[issue.id] || fixed[issue.id]) return;
    setFixing((f) => ({ ...f, [issue.id]: true }));
    setTimeout(() => {
      setFixing((f) => ({ ...f, [issue.id]: false }));
      setFixed((f) => ({ ...f, [issue.id]: true }));
      setScore((s) => s + issue.scoreGain);
      addToast(issue.toast, "success");
    }, 1500);
  };

  // Expose setAuditState so parent can trigger
  useEffect(() => {
    (window as Window & { __triggerSEOAudit?: () => void }).__triggerSEOAudit = () => setAuditState("running");
    return () => { delete (window as Window & { __triggerSEOAudit?: () => void }).__triggerSEOAudit; };
  }, []);

  return (
    <div className="space-y-4">
      {auditState === "idle" && (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full" style={{ border: `3px solid ${BORDER}` }} />
            <div className="absolute inset-2 rounded-full" style={{ border: `3px solid ${MUTED}`, opacity: 0.4 }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Search size={28} style={{ color: PRIMARY }} />
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: PRIMARY }}
            >
              <TrendingUp size={12} color="#fff" />
            </div>
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: DARK_TEXT }}>Click &lsquo;Run SEO Audit&rsquo; to analyze your site</p>
          <p className="text-xs" style={{ color: MUTED }}>Crawls all pages, checks keyword positions, Core Web Vitals &amp; backlinks</p>
        </div>
      )}

      {auditState === "running" && (
        <div className="rounded-xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{statuses[statusIdx]}</p>
            <span className="text-sm font-bold" style={{ color: PRIMARY }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: BORDER }}>
            <motion.div
              className="h-full rounded-full"
              style={{ width: `${progress}%`, background: PRIMARY }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: MUTED }}>Analyzing lyzr.ai — please wait…</p>
        </div>
      )}

      {auditState === "complete" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="flex gap-8 items-start">
              <CircleProgress score={score} />
              <div className="flex-1 space-y-3">
                <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Issues Found</h3>
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 rounded-xl flex items-start gap-3"
                    style={{
                      background: fixed[issue.id] ? `${GREEN}08` : PAGE_BG,
                      border: `1px solid ${fixed[issue.id] ? GREEN + "40" : BORDER}`,
                      opacity: fixed[issue.id] ? 0.75 : 1,
                      transition: "all 0.3s",
                    }}
                  >
                    <AlertCircle size={16} style={{ color: fixed[issue.id] ? GREEN : issue.color, flexShrink: 0, marginTop: 2 }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-xs font-bold px-1.5 py-0.5 rounded"
                          style={{ background: `${fixed[issue.id] ? GREEN : issue.color}18`, color: fixed[issue.id] ? GREEN : issue.color }}
                        >
                          {fixed[issue.id] ? "FIXED" : issue.severity}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{issue.title}</span>
                      </div>
                      <p className="text-xs" style={{ color: MUTED }}>{issue.desc}</p>
                    </div>
                    {!fixed[issue.id] ? (
                      <button
                        onClick={() => handleFix(issue)}
                        disabled={fixing[issue.id]}
                        className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: PRIMARY, color: "#fff", opacity: fixing[issue.id] ? 0.7 : 1 }}
                      >
                        {fixing[issue.id] ? "Fixing…" : "Fix Issue"}
                      </button>
                    ) : (
                      <CheckCircle size={16} style={{ color: GREEN, flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Keyword Rankings Table ───────────────────────────────────────────────────
const KEYWORDS = [
  { kw: "agentic AI platform",       pos: 8,  vol: 2400, diff: 72, change: 3,   url: "/solutions" },
  { kw: "AI marketing automation",   pos: 14, vol: 5200, diff: 68, change: 2,   url: "/blog/ai-marketing" },
  { kw: "Lyzr AI",                   pos: 2,  vol: 890,  diff: 42, change: 0,   url: "/" },
  { kw: "autonomous AI agents",      pos: 11, vol: 3100, diff: 75, change: 4,   url: "/platform" },
  { kw: "AI for BFSI",               pos: 19, vol: 1400, diff: 58, change: 6,   url: "/solutions/bfsi" },
  { kw: "enterprise AI agent",       pos: 23, vol: 4800, diff: 80, change: -2,  url: "/enterprise" },
  { kw: "marketing AI platform",     pos: 31, vol: 6200, diff: 76, change: 0,   url: "/marketing" },
  { kw: "AI workflow automation",    pos: 17, vol: 2900, diff: 65, change: 8,   url: "/workflows" },
  { kw: "agentic AI for marketing",  pos: 12, vol: 1800, diff: 62, change: 5,   url: "/marketing-ai" },
  { kw: "Lyzr vs ChatGPT",           pos: 6,  vol: 720,  diff: 45, change: 12,  url: "/compare" },
];

function KeywordsTable() {
  return (
    <div className="rounded-xl overflow-hidden mt-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
      <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Keyword Rankings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: PAGE_BG }}>
              {["Keyword", "Position", "Volume/mo", "Difficulty", "Change", "URL"].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: MUTED }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {KEYWORDS.map((row, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }} className="hover:bg-amber-50/30 transition-colors">
                <td className="px-4 py-3 font-medium" style={{ color: DARK_TEXT }}>{row.kw}</td>
                <td className="px-4 py-3">
                  <span
                    className="font-bold text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: row.pos <= 10 ? `${GREEN}18` : row.pos <= 20 ? `${AMBER}18` : `${MUTED}18`,
                      color: row.pos <= 10 ? GREEN : row.pos <= 20 ? AMBER : MUTED,
                    }}
                  >
                    #{row.pos}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: DARK_TEXT }}>{row.vol.toLocaleString()}</td>
                <td className="px-4 py-3" style={{ color: MUTED }}>{row.diff}</td>
                <td className="px-4 py-3">
                  {row.change > 0 ? (
                    <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: GREEN }}>
                      <ArrowUp size={12} />↑{row.change}
                    </span>
                  ) : row.change < 0 ? (
                    <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: RED }}>
                      <ArrowDown size={12} />↓{Math.abs(row.change)}
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: MUTED }}>
                      <Minus size={12} /> —
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: BLUE }}>{row.url}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Content Gaps ─────────────────────────────────────────────────────────────
const GAPS = [
  { topic: "Agentic AI for Banks", vol: 3200, diff: 55, coverage: "No current content", action: "Create Brief" },
  { topic: "AI Marketing Automation ROI Guide", vol: 2800, diff: 60, coverage: "Partial coverage", action: "Expand Content" },
  { topic: "Enterprise AI Agent Comparison", vol: 4100, diff: 70, coverage: "Competitors ranking", action: "Compete" },
  { topic: "Lyzr AI vs HubSpot AI", vol: 1200, diff: 48, coverage: "No current content", action: "Create Brief" },
  { topic: "BFSI AI Compliance Guide", vol: 1800, diff: 52, coverage: "No current content", action: "Create Brief" },
];

function ContentGaps({ addToast }: { addToast: (msg: string, type?: Toast["type"]) => void }) {
  return (
    <div className="rounded-xl p-5 mt-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-semibold" style={{ color: DARK_TEXT }}>AI-Identified Content Gaps</h3>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${PRIMARY}18`, color: PRIMARY }}>
          Lyzr AI
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {GAPS.map((gap, i) => (
          <div key={i} className="p-4 rounded-xl flex flex-col gap-2" style={{ background: PAGE_BG, border: `1px solid ${BORDER}` }}>
            <p className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{gap.topic}</p>
            <div className="flex items-center gap-3 text-xs" style={{ color: MUTED }}>
              <span>{gap.vol.toLocaleString()} searches/mo</span>
              <span>·</span>
              <span>Difficulty {gap.diff}</span>
            </div>
            <p className="text-xs" style={{ color: MUTED }}>{gap.coverage}</p>
            <button
              onClick={() => addToast("Content brief created and added to Content Operations queue.", "success")}
              className="self-start px-3 py-1.5 rounded-lg text-xs font-semibold mt-1"
              style={{ background: PRIMARY, color: "#fff" }}
            >
              {gap.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-tab: Keywords Chart ──────────────────────────────────────────────────
const KW_CHART_DATA = KEYWORDS.map((k) => ({
  name: k.kw.split(" ").slice(0, 2).join(" "),
  vol: k.vol,
}));

function KeywordsSubTab() {
  return (
    <div className="mt-4">
      <div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <h3 className="font-semibold mb-4" style={{ color: DARK_TEXT }}>Top Keywords by Volume</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={KW_CHART_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 48 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: MUTED }} angle={-30} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 10, fill: MUTED }} />
            <Tooltip
              contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
              formatter={(v: any) => [v.toLocaleString(), "Volume/mo"]}
            />
            <Bar dataKey="vol" radius={[4, 4, 0, 0]}>
              {KW_CHART_DATA.map((_, i) => (
                <Cell key={i} fill={PRIMARY} opacity={0.7 + (i % 3) * 0.1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Sub-tab: Content Performance ────────────────────────────────────────────
const CONTENT_PAGES = [
  { page: "/solutions/agentic-ai",   traffic: 4200, conversions: 38, avgPos: 6.2,  wc: 2800 },
  { page: "/blog/ai-marketing",      traffic: 3100, conversions: 22, avgPos: 14.1, wc: 1950 },
  { page: "/platform",               traffic: 2800, conversions: 31, avgPos: 8.4,  wc: 3200 },
  { page: "/marketing-ai",           traffic: 1900, conversions: 15, avgPos: 12.3, wc: 1600 },
  { page: "/solutions/bfsi",         traffic: 1400, conversions: 19, avgPos: 18.7, wc: 2100 },
  { page: "/enterprise",             traffic: 1100, conversions: 12, avgPos: 23.4, wc: 2400 },
];

function ContentSubTab({ addToast }: { addToast: (msg: string, type?: Toast["type"]) => void }) {
  return (
    <div className="mt-4 rounded-xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
      <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Content Performance</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: PAGE_BG }}>
            {["Page", "Organic Traffic", "Conversions", "Avg Position", "Word Count", "Action"].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: MUTED }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CONTENT_PAGES.map((row, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }} className="hover:bg-amber-50/30 transition-colors">
              <td className="px-4 py-3 text-xs font-medium" style={{ color: BLUE }}>{row.page}</td>
              <td className="px-4 py-3 font-semibold" style={{ color: DARK_TEXT }}>{row.traffic.toLocaleString()}</td>
              <td className="px-4 py-3" style={{ color: GREEN }}>{row.conversions}</td>
              <td className="px-4 py-3" style={{ color: row.avgPos <= 10 ? GREEN : row.avgPos <= 20 ? AMBER : MUTED }}>#{row.avgPos}</td>
              <td className="px-4 py-3" style={{ color: MUTED }}>{row.wc.toLocaleString()}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => addToast("Content optimization queued for " + row.page, "info")}
                  className="px-3 py-1 rounded-lg text-xs font-semibold"
                  style={{ background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}30` }}
                >
                  Optimize
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Sub-tab: Technical ───────────────────────────────────────────────────────
function TechnicalSubTab() {
  const vitals = [
    { name: "LCP", value: "3.8s",  label: "Largest Contentful Paint", threshold: "Should be <2.5s", color: RED },
    { name: "FID", value: "18ms",  label: "First Input Delay",         threshold: "Good <100ms",    color: GREEN },
    { name: "CLS", value: "0.08",  label: "Cumulative Layout Shift",   threshold: "Good <0.1",      color: GREEN },
  ];

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {vitals.map((v, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${v.color}50` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold" style={{ color: MUTED }}>{v.name}</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${v.color}15`, color: v.color }}
              >
                {v.color === GREEN ? "Good" : "Poor"}
              </span>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: v.color }}>{v.value}</p>
            <p className="text-xs font-medium" style={{ color: DARK_TEXT }}>{v.label}</p>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>{v.threshold}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Site Health</h3>
          <span className="text-lg font-bold" style={{ color: AMBER }}>84/100</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: BORDER }}>
          <div className="h-full rounded-full" style={{ width: "84%", background: AMBER }} />
        </div>
        <p className="text-xs mt-2" style={{ color: MUTED }}>Resolve HIGH issues to push above 90</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function SEOPage() {
  const { toasts, addToast } = useToast();
  const [auditKey, setAuditKey] = useState(0);
  const [subTab, setSubTab] = useState<"keywords" | "content" | "technical">("keywords");

  const handleRunAudit = () => {
    setAuditKey((k) => k + 1);
  };

  const handleExportReport = () => {
    const csv = [
      "Keyword,Position,Volume/mo,Difficulty,Change,URL",
      ...KEYWORDS.map((k) => `"${k.kw}",${k.pos},${k.vol},${k.diff},${k.change},${k.url}`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lyzr-seo-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    addToast("SEO report exported as CSV.", "success");
  };

  const subTabs = [
    { id: "keywords" as const,  label: "Keywords",  icon: Search },
    { id: "content" as const,   label: "Content",   icon: FileText },
    { id: "technical" as const, label: "Technical", icon: Shield },
  ];

  return (
    <div className="min-h-full" style={{ background: PAGE_BG }}>
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: DARK_TEXT }}>SEO &amp; Organic</h1>
            <p className="text-sm mt-0.5" style={{ color: MUTED }}>Search performance, keyword intelligence &amp; technical health</p>
          </div>
          <button
            onClick={handleRunAudit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: PRIMARY, color: "#fff" }}
          >
            <Search size={15} /> Run SEO Audit
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-5 gap-4 mt-4">
          <StatCard label="Organic Traffic"   value="28,400/mo" sub="↑18% MoM"             icon={TrendingUp}  color={GREEN} />
          <StatCard label="Keywords Ranking"  value="847"        sub="+42 this month"        icon={Search}      color={BLUE} />
          <StatCard label="Top 10 Keywords"   value="124"        sub="out of 847 tracked"    icon={BarChart2}   color={PRIMARY} />
          <StatCard
            label="Domain Authority" value="52" sub="Score out of 100"
            icon={Globe} color={AMBER}
            badge={
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${GREEN}18`, color: GREEN }}>
                Good
              </span>
            }
          />
          <StatCard label="Pipeline from SEO" value="$890K"     sub="↑22% QoQ"              icon={DollarSign}  color={GREEN} />
        </div>
      </div>

      <div className="px-8 pb-8 space-y-4">
        {/* Audit — re-mounts on each Run click */}
        <SEOAuditSection key={auditKey} addToast={addToast} />

        {/* Keywords Table */}
        <KeywordsTable />

        {/* Content Gaps */}
        <ContentGaps addToast={addToast} />

        {/* Export */}
        <button
          onClick={handleExportReport}
          className="w-full py-3 rounded-xl text-sm font-semibold border transition-all hover:bg-amber-50/40"
          style={{ borderColor: BORDER, color: PRIMARY, background: CARD }}
        >
          <Download size={14} className="inline mr-2" />
          Export Report
        </button>

        {/* Sub-tabs */}
        <div>
          <div className="flex gap-0" style={{ borderBottom: `1px solid ${BORDER}` }}>
            {subTabs.map((st) => {
              const active = subTab === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setSubTab(st.id)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium relative transition-colors"
                  style={{ color: active ? PRIMARY : MUTED }}
                >
                  <st.icon size={14} />
                  {st.label}
                  {active && (
                    <motion.div
                      layoutId="seo-subtab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: PRIMARY }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={subTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {subTab === "keywords"  && <KeywordsSubTab />}
              {subTab === "content"   && <ContentSubTab addToast={addToast} />}
              {subTab === "technical" && <TechnicalSubTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
