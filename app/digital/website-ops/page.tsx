"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, TrendingUp, Users, Zap, AlertCircle, CheckCircle2,
  RefreshCw, ExternalLink, BarChart3, ArrowUpRight, Clock,
  Search, Plus, Eye, Activity, Target, Shield,
} from "lucide-react";

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

const KPI = [
  { label: "Monthly Visitors",  value: "284K",  delta: "+22%",  up: true,  color: BLUE    },
  { label: "Avg Session Time",  value: "3m 42s", delta: "+8%",  up: true,  color: GREEN   },
  { label: "Bounce Rate",       value: "38.2%", delta: "-4.1%", up: true,  color: PRIMARY },
  { label: "Conversion Rate",   value: "3.8%",  delta: "+0.6%", up: true,  color: GREEN   },
];

const PAGES = [
  { url: "/",               title: "Home",               visitors: 84200, cvr: "4.2%", status: "Healthy",  issue: null                     },
  { url: "/platform",       title: "Platform Overview",  visitors: 41800, cvr: "3.8%", status: "Healthy",  issue: null                     },
  { url: "/pricing",        title: "Pricing",            visitors: 38400, cvr: "6.1%", status: "Warning",  issue: "LCP > 3.5s"             },
  { url: "/blog",           title: "Blog",               visitors: 29700, cvr: "1.9%", status: "Healthy",  issue: null                     },
  { url: "/case-studies",   title: "Case Studies",       visitors: 18900, cvr: "5.4%", status: "Healthy",  issue: null                     },
  { url: "/demo",           title: "Request Demo",       visitors: 15200, cvr: "8.7%", status: "Critical", issue: "Form submit error 500"   },
];

const PERF_SCORES = [
  { label: "Performance",    score: 84, color: GREEN   },
  { label: "Accessibility",  score: 96, color: BLUE    },
  { label: "Best Practices", score: 92, color: GREEN   },
  { label: "SEO",            score: 88, color: PRIMARY  },
];

const AGENTS = [
  { name: "Page Speed Agent",    status: "Active", task: "Auditing /pricing LCP",   lastRun: "2 min ago"   },
  { name: "A/B Test Agent",      status: "Active", task: "Running hero variant test", lastRun: "14 min ago" },
  { name: "Form Monitor Agent",  status: "Alert",  task: "Demo form error detected",  lastRun: "5 min ago"  },
  { name: "Uptime Monitor",      status: "Active", task: "All endpoints healthy",     lastRun: "1 min ago"  },
];

type Tab = "Overview" | "Pages" | "Performance" | "Agents";
const TABS: Tab[] = ["Overview", "Pages", "Performance", "Agents"];

export default function WebsiteOpsPage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [toast, setToast] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); showToast("Site audit complete — 2 issues found"); }, 2200);
  };

  const statusColor = (s: string) =>
    s === "Healthy" ? GREEN : s === "Warning" ? AMBER : s === "Critical" ? RED : BLUE;

  return (
    <div className="min-h-screen p-6" style={{ background: PAGE_BG }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: DARK_TEXT }}>Website Operations</h1>
            <p className="text-sm mt-0.5" style={{ color: MUTED }}>lyzr.ai — performance, health, and conversion monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="https://lyzr.ai" target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: CARD, border: `1px solid ${BORDER}`, color: DARK_TEXT }}>
              <ExternalLink size={13} /> lyzr.ai
            </a>
            <button onClick={handleScan} disabled={scanning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: PRIMARY, color: "#fff", border: "none", opacity: scanning ? 0.7 : 1 }}>
              <RefreshCw size={13} className={scanning ? "animate-spin" : ""} />
              {scanning ? "Scanning…" : "Run Audit"}
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          {KPI.map((k) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <p className="text-xs font-medium mb-1" style={{ color: MUTED }}>{k.label}</p>
              <p className="text-2xl font-bold" style={{ color: DARK_TEXT }}>{k.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={11} style={{ color: k.up ? GREEN : RED }} />
                <span className="text-xs font-medium" style={{ color: k.up ? GREEN : RED }}>{k.delta} MoM</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: tab === t ? PRIMARY : "transparent", color: tab === t ? "#fff" : DARK_TEXT }}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}>

            {/* OVERVIEW */}
            {tab === "Overview" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: DARK_TEXT }}>Top Pages by Traffic</h3>
                  {PAGES.slice(0, 5).map((p) => (
                    <div key={p.url} className="flex items-center justify-between py-2.5"
                      style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: DARK_TEXT }}>{p.title}</p>
                        <p className="text-[11px]" style={{ color: MUTED }}>{p.url}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{p.visitors.toLocaleString()}</p>
                        <p className="text-[11px]" style={{ color: MUTED }}>CVR {p.cvr}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <h3 className="text-sm font-semibold mb-4" style={{ color: DARK_TEXT }}>Core Web Vitals</h3>
                    {PERF_SCORES.map((s) => (
                      <div key={s.label} className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ color: DARK_TEXT }}>{s.label}</span>
                          <span className="text-xs font-bold" style={{ color: s.color }}>{s.score}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                          <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-5" style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}30` }}>
                    <div className="flex items-start gap-3">
                      <AlertCircle size={18} style={{ color: AMBER, flexShrink: 0 }} />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: DARK_TEXT }}>2 Issues Detected</p>
                        <p className="text-xs mt-1" style={{ color: MUTED }}>/pricing LCP slow · /demo form error 500</p>
                        <button onClick={() => setTab("Pages")}
                          className="text-xs font-medium mt-2" style={{ color: PRIMARY }}>View all issues →</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAGES */}
            {tab === "Pages" && (
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: CARD, borderBottom: `1px solid ${BORDER}` }}>
                      {["Page", "Visitors", "CVR", "Status", "Issue", "Action"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                          style={{ color: MUTED }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PAGES.map((p, i) => (
                      <tr key={p.url} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.5)" : CARD, borderBottom: `1px solid ${BORDER}` }}>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium" style={{ color: DARK_TEXT }}>{p.title}</p>
                          <p className="text-[11px]" style={{ color: MUTED }}>{p.url}</p>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium" style={{ color: DARK_TEXT }}>{p.visitors.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: DARK_TEXT }}>{p.cvr}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{ background: `${statusColor(p.status)}15`, color: statusColor(p.status) }}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: p.issue ? RED : MUTED }}>{p.issue || "—"}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => showToast(`Running AI fix for ${p.title}…`)}
                            className="text-xs px-2.5 py-1 rounded"
                            style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}25` }}>
                            {p.issue ? "Fix" : "Audit"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PERFORMANCE */}
            {tab === "Performance" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: DARK_TEXT }}>Lighthouse Scores</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {PERF_SCORES.map(s => (
                      <div key={s.label} className="flex flex-col items-center gap-2 p-4 rounded-xl"
                        style={{ background: `${s.color}08`, border: `1px solid ${s.color}25` }}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center"
                          style={{ background: `${s.color}15`, border: `2px solid ${s.color}` }}>
                          <span className="text-xl font-bold" style={{ color: s.color }}>{s.score}</span>
                        </div>
                        <span className="text-xs font-medium text-center" style={{ color: DARK_TEXT }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: DARK_TEXT }}>Page Speed Metrics</h3>
                  {[
                    { label: "LCP (Largest Contentful Paint)", value: "2.1s",  good: true  },
                    { label: "FID (First Input Delay)",        value: "18ms",  good: true  },
                    { label: "CLS (Cumulative Layout Shift)",  value: "0.08",  good: true  },
                    { label: "TTFB (Time to First Byte)",      value: "340ms", good: true  },
                    { label: "/pricing LCP",                   value: "3.8s",  good: false },
                  ].map(m => (
                    <div key={m.label} className="flex items-center justify-between py-2.5"
                      style={{ borderBottom: `1px solid ${BORDER}` }}>
                      <span className="text-xs" style={{ color: DARK_TEXT }}>{m.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: m.good ? GREEN : RED }}>{m.value}</span>
                        {m.good
                          ? <CheckCircle2 size={13} style={{ color: GREEN }} />
                          : <AlertCircle size={13} style={{ color: RED }} />}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => showToast("Running auto-fix for slow pages…")}
                    className="w-full mt-4 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: PRIMARY, color: "#fff", border: "none" }}>
                    Auto-Fix Slow Pages
                  </button>
                </div>
              </div>
            )}

            {/* AGENTS */}
            {tab === "Agents" && (
              <div className="grid grid-cols-2 gap-4">
                {AGENTS.map(a => (
                  <div key={a.name} className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full"
                          style={{ background: a.status === "Alert" ? RED : GREEN }} />
                        <h3 className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{a.name}</h3>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{ background: a.status === "Alert" ? `${RED}15` : `${GREEN}15`, color: a.status === "Alert" ? RED : GREEN }}>
                        {a.status}
                      </span>
                    </div>
                    <p className="text-xs mt-3 mb-1" style={{ color: MUTED }}>Current Task</p>
                    <p className="text-sm" style={{ color: DARK_TEXT }}>{a.task}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[11px]" style={{ color: MUTED }}>Last run: {a.lastRun}</span>
                      <button onClick={() => showToast(`Viewing logs for ${a.name}…`)}
                        className="text-xs px-2.5 py-1 rounded"
                        style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}25` }}>
                        View Logs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className="fixed bottom-6 right-6 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg z-50"
            style={{ background: PRIMARY, color: "#fff" }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
