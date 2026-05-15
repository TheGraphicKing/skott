"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, ClipboardList, Settings, FileCheck, Lock,
  AlertCircle, CheckCircle, X, Download, Plus, ToggleLeft, ToggleRight,
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
const PURPLE    = "#7c3aed";

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
            {t.type === "error"   && <AlertCircle size={15} />}
            {t.type === "info"    && <Shield size={15} />}
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

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex items-center transition-colors"
      style={{ color: on ? GREEN : MUTED }}
    >
      {on ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
    </button>
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

// ══════════════════════════════════════════════════════════════════════════════
// TAB 1 — Brand Safety
// ══════════════════════════════════════════════════════════════════════════════
function BrandSafety({ addToast }: { addToast: (msg: string, type?: Toast["type"]) => void }) {
  type ViolationStatus = "OPEN" | "RESOLVED";
  const [statuses, setStatuses] = useState<Record<number, ViolationStatus>>({
    1: "OPEN",
    3: "OPEN",
  });
  const [resolving, setResolving] = useState<Record<number, boolean>>({});

  const violations = [
    {
      id: 1,
      severity: "MEDIUM",
      severityColor: AMBER,
      category: "BRAND VOICE",
      date: "May 14",
      desc: 'Draft blog used "cheapest AI" phrasing in pricing section',
    },
    {
      id: 2,
      severity: "LOW",
      severityColor: GREEN,
      category: "ACCESSIBILITY",
      date: "May 13",
      desc: "LinkedIn post lacked accessibility alt-text for hero image",
      alwaysResolved: true,
    },
    {
      id: 3,
      severity: "HIGH",
      severityColor: RED,
      category: "POLICY",
      date: "May 15",
      desc: "Ad copy exceeded 12% discount claim (policy max 10%)",
    },
  ];

  const handleResolve = (id: number) => {
    setResolving((r) => ({ ...r, [id]: true }));
    setTimeout(() => {
      setResolving((r) => ({ ...r, [id]: false }));
      setStatuses((s) => ({ ...s, [id]: "RESOLVED" }));
      addToast("Violation resolved and logged.", "success");
    }, 1000);
  };

  const openCount = violations.filter(
    (v) => !v.alwaysResolved && statuses[v.id] === "OPEN"
  ).length;
  const resolvedCount = violations.length - openCount;

  return (
    <div className="space-y-4">
      {violations.map((v) => {
        const isResolved = v.alwaysResolved || statuses[v.id] === "RESOLVED";
        return (
          <div
            key={v.id}
            className="rounded-xl p-4 flex items-start gap-4"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}
          >
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${v.severityColor}18`, color: v.severityColor }}
              >
                {v.severity}
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${BLUE}12`, color: BLUE }}
              >
                {v.category}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-0.5" style={{ color: DARK_TEXT }}>{v.desc}</p>
              <p className="text-xs" style={{ color: MUTED }}>{v.date}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: isResolved ? `${GREEN}15` : `${AMBER}15`,
                  color: isResolved ? GREEN : AMBER,
                }}
              >
                {isResolved ? "RESOLVED" : "OPEN"}
              </span>
              {!isResolved && (
                <button
                  onClick={() => handleResolve(v.id)}
                  disabled={resolving[v.id]}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: PRIMARY, color: "#fff", opacity: resolving[v.id] ? 0.7 : 1 }}
                >
                  {resolving[v.id] ? "Resolving…" : "Resolve"}
                </button>
              )}
            </div>
          </div>
        );
      })}
      <div
        className="rounded-xl px-5 py-3 text-sm font-medium"
        style={{ background: CARD, border: `1px solid ${BORDER}`, color: MUTED }}
      >
        {resolvedCount} resolved · {openCount} open · Brand safety score:{" "}
        <span className="font-bold" style={{ color: GREEN }}>87/100</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 2 — Audit Log
// ══════════════════════════════════════════════════════════════════════════════
const ALL_LOGS = [
  { time: "2min ago",   agent: "Email Sequencer",      action: "Sent 1,200 emails to BFSI DMs segment",         user: "System",    status: "success" },
  { time: "15min ago",  agent: "Campaign Strategist",  action: "Updated BFSI Q3 strategy document",             user: "Sarah Chen", status: "success" },
  { time: "28min ago",  agent: "SEO Optimizer",        action: "Updated 14 meta descriptions",                  user: "System",    status: "success" },
  { time: "42min ago",  agent: "Brand Voice Guard",    action: "Flagged 2 phrases in draft blog",               user: "System",    status: "flagged" },
  { time: "1h ago",     agent: "Budget Optimizer",     action: "Reallocated $1,800 Paid→Social",                user: "System",    status: "success" },
  { time: "1.5h ago",   agent: "Content Agent",        action: "Completed BFSI whitepaper draft",               user: "System",    status: "success" },
  { time: "2h ago",     agent: "Analytics Reporter",   action: "Sent weekly digest to Sarah Chen",              user: "System",    status: "success" },
  { time: "2.5h ago",   agent: "Competitor Monitor",   action: "Detected Moveworks blog post",                  user: "System",    status: "success" },
  { time: "3h ago",     agent: "Lead Scorer",          action: "Processed 34 leads from HubSpot",               user: "System",    status: "success" },
  { time: "4h ago",     agent: "Paid Media Agent",     action: "Paused G-Display campaign (ROAS <2×)",          user: "System",    status: "success" },
  { time: "4.5h ago",   agent: "Campaign Strategist",  action: "Created Q3 LinkedIn ABM campaign brief",        user: "Raj Patel", status: "success" },
  { time: "5h ago",     agent: "Email Sequencer",      action: "A/B test completed: variant B +14% open rate",  user: "System",    status: "success" },
  { time: "5.5h ago",   agent: "SEO Optimizer",        action: "Submitted sitemap to Google Search Console",    user: "System",    status: "success" },
  { time: "6h ago",     agent: "Brand Voice Guard",    action: "Approved landing page copy for /solutions",     user: "System",    status: "success" },
  { time: "7h ago",     agent: "Budget Optimizer",     action: "Flagged Events overspend by $12K",              user: "System",    status: "flagged" },
  { time: "8h ago",     agent: "Content Agent",        action: "Published 3 blog posts to CMS",                 user: "System",    status: "success" },
  { time: "9h ago",     agent: "Analytics Reporter",   action: "Pipeline variance report sent to CMO",          user: "System",    status: "success" },
  { time: "10h ago",    agent: "Lead Scorer",          action: "Escalated 5 MQLs to sales queue",               user: "System",    status: "success" },
  { time: "11h ago",    agent: "Competitor Monitor",   action: "Monitored 12 competitor pages for changes",     user: "System",    status: "success" },
  { time: "12h ago",    agent: "Paid Media Agent",     action: "Increased LinkedIn bid by 8% based on ROAS",   user: "Raj Patel", status: "success" },
];

const AGENT_COLORS: Record<string, string> = {
  "Campaign Strategist": PRIMARY,
  "Email Sequencer":     BLUE,
  "SEO Optimizer":       GREEN,
  "Brand Voice Guard":   PURPLE,
  "Budget Optimizer":    AMBER,
  "Content Agent":       "#0891b2",
  "Analytics Reporter":  "#0f766e",
  "Competitor Monitor":  "#b45309",
  "Lead Scorer":         "#6d28d9",
  "Paid Media Agent":    "#be123c",
};

function AuditLog() {
  const [agentFilter, setAgentFilter] = useState("All");
  const [userFilter,  setUserFilter]  = useState("All");
  const [dateFilter,  setDateFilter]  = useState("Today");
  const [showing,     setShowing]     = useState(10);

  const filtered = ALL_LOGS.filter((l) => {
    if (agentFilter !== "All" && l.agent !== agentFilter) return false;
    if (userFilter  !== "All" && l.user  !== userFilter)  return false;
    return true;
  });

  const visible = filtered.slice(0, showing);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: "Agent", value: agentFilter, onChange: setAgentFilter, options: ["All", ...Object.keys(AGENT_COLORS)] },
          { label: "User",  value: userFilter,  onChange: setUserFilter,  options: ["All", "System", "Sarah Chen", "Raj Patel"] },
          { label: "Date",  value: dateFilter,  onChange: setDateFilter,  options: ["Today", "This Week", "This Month"] },
        ].map((f) => (
          <div key={f.label} className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: MUTED }}>{f.label}:</span>
            <select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="text-xs rounded-lg px-2 py-1.5 font-medium"
              style={{ background: CARD, border: `1px solid ${BORDER}`, color: DARK_TEXT }}
            >
              {f.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: PAGE_BG }}>
              {["Time", "Agent", "Action", "User", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: MUTED }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => {
              const agentColor = AGENT_COLORS[row.agent] || MUTED;
              return (
                <tr key={i} style={{ borderTop: `1px solid ${BORDER}` }} className="hover:bg-amber-50/20 transition-colors">
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: MUTED }}>{row.time}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: `${agentColor}15`, color: agentColor }}
                    >
                      {row.agent}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: DARK_TEXT }}>{row.action}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{row.user}</td>
                  <td className="px-4 py-3">
                    {row.status === "success" ? (
                      <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: GREEN }}>
                        <CheckCircle size={12} /> Success
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: AMBER }}>
                        <AlertCircle size={12} /> Flagged
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: MUTED }}>Showing {visible.length} of {filtered.length}</p>
        {showing < filtered.length && (
          <button
            onClick={() => setShowing((s) => s + 10)}
            className="px-4 py-2 rounded-lg text-xs font-semibold"
            style={{ background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}30` }}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 3 — Agent Settings
// ══════════════════════════════════════════════════════════════════════════════
const AGENTS_CONFIG = [
  "Campaign Strategist",
  "Content Writer",
  "SEO Optimizer",
  "Email Sequencer",
  "Brand Voice Guard",
  "Competitor Monitor",
  "Budget Optimizer",
  "Analytics Reporter",
];

function AgentSettings({ addToast }: { addToast: (msg: string, type?: Toast["type"]) => void }) {
  const [configs, setConfigs] = useState<Record<string, {
    enabled: boolean;
    model: string;
    temp: number;
    autoPublish: boolean;
    maxBudget: number;
  }>>(
    Object.fromEntries(
      AGENTS_CONFIG.map((name) => [
        name,
        { enabled: true, model: "claude-sonnet-4-6", temp: 0.7, autoPublish: false, maxBudget: 500 },
      ])
    )
  );

  const update = (name: string, key: string, val: unknown) => {
    setConfigs((c) => ({ ...c, [name]: { ...c[name], [key]: val } }));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {AGENTS_CONFIG.map((name) => {
        const cfg = configs[name];
        const color = AGENT_COLORS[name] || PRIMARY;
        return (
          <div key={name} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{name}</p>
                <span
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: `${color}15`, color }}
                >
                  {cfg.enabled ? "Active" : "Paused"}
                </span>
              </div>
              <Toggle on={cfg.enabled} onChange={(v) => update(name, "enabled", v)} />
            </div>

            {/* Model */}
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>Model</label>
              <select
                value={cfg.model}
                onChange={(e) => update(name, "model", e.target.value)}
                className="w-full text-xs rounded-lg px-2 py-1.5"
                style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, color: DARK_TEXT }}
              >
                <option value="claude-sonnet-4-6">claude-sonnet-4-6</option>
                <option value="claude-opus-4-7">claude-opus-4-7</option>
                <option value="claude-haiku-4-5">claude-haiku-4-5</option>
              </select>
            </div>

            {/* Temperature */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold" style={{ color: MUTED }}>Temperature</label>
                <span className="text-xs font-bold" style={{ color: DARK_TEXT }}>{cfg.temp.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={cfg.temp}
                onChange={(e) => update(name, "temp", parseFloat(e.target.value))}
                className="w-full accent-amber-700"
              />
            </div>

            {/* Auto-publish + Max budget */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Toggle on={cfg.autoPublish} onChange={(v) => update(name, "autoPublish", v)} />
                <span className="text-xs" style={{ color: MUTED }}>Auto-publish</span>
              </div>
              <div className="flex items-center gap-1 flex-1">
                <span className="text-xs font-semibold" style={{ color: MUTED }}>$</span>
                <input
                  type="number"
                  value={cfg.maxBudget}
                  onChange={(e) => update(name, "maxBudget", parseInt(e.target.value) || 0)}
                  className="w-full text-xs rounded-lg px-2 py-1 text-right"
                  style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, color: DARK_TEXT }}
                  placeholder="Max budget"
                />
              </div>
            </div>

            {/* Save */}
            <button
              onClick={() => addToast(`Config saved for ${name}`, "success")}
              className="w-full py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}30` }}
            >
              Save Config
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 4 — Compliance Scorecards
// ══════════════════════════════════════════════════════════════════════════════
function ComplianceTab({ addToast }: { addToast: (msg: string, type?: Toast["type"]) => void }) {
  const certs = [
    {
      name: "SOC 2 Type II",
      icon: "✓",
      lastAudit: "Mar 15, 2025",
      nextAudit: "Mar 15, 2026",
      detail: null,
      action: "Download Report",
      actionType: "download",
    },
    {
      name: "ISO 27001",
      icon: "✓",
      lastAudit: "Feb 10, 2025",
      nextAudit: "Feb 10, 2026",
      detail: null,
      action: "Download Report",
      actionType: "download",
    },
    {
      name: "GDPR",
      icon: "✓",
      lastAudit: null,
      nextAudit: null,
      detail: "Data residency: EU-West, US-West · DPO: Jordan Taylor",
      action: "View Policy",
      actionType: "view",
    },
    {
      name: "CCPA",
      icon: "✓",
      lastAudit: null,
      nextAudit: null,
      detail: "Privacy policy updated: Jan 5, 2025",
      action: "View Policy",
      actionType: "view",
    },
  ];

  const securityItems = [
    { label: "Data Encryption",      pct: 100, status: "✓" },
    { label: "Access Control",       pct: 96,  status: "✓" },
    { label: "Audit Logging",        pct: 98,  status: "✓" },
    { label: "Vulnerability Scanning", pct: 84, status: "⚠" },
  ];

  const handleAction = (cert: typeof certs[0]) => {
    if (cert.actionType === "download") {
      const blob = new Blob([`${cert.name} Compliance Report - Lyzr AI\nGenerated: ${new Date().toLocaleDateString()}\nStatus: Certified\n`], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cert.name.replace(/ /g, "-")}-compliance-report.txt`;
      a.click();
      URL.revokeObjectURL(url);
      addToast("Downloading compliance report...", "info");
    } else {
      addToast("Opening policy document…", "info");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {certs.map((cert, i) => (
          <div
            key={i}
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `4px solid ${GREEN}` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl" style={{ color: GREEN }}>{cert.icon}</span>
              <h3 className="font-bold" style={{ color: DARK_TEXT }}>{cert.name}</h3>
              <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${GREEN}15`, color: GREEN }}>Certified</span>
            </div>
            {cert.lastAudit && (
              <div className="text-xs space-y-0.5" style={{ color: MUTED }}>
                <p>Last audit: <span style={{ color: DARK_TEXT }}>{cert.lastAudit}</span></p>
                <p>Next audit: <span style={{ color: DARK_TEXT }}>{cert.nextAudit}</span></p>
              </div>
            )}
            {cert.detail && (
              <p className="text-xs" style={{ color: MUTED }}>{cert.detail}</p>
            )}
            <button
              onClick={() => handleAction(cert)}
              className="self-start px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${PRIMARY}30` }}
            >
              {cert.action}
            </button>
          </div>
        ))}
      </div>

      {/* Security Scorecard */}
      <div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Security Scorecard</h3>
          <span className="text-2xl font-bold" style={{ color: GREEN }}>94/100</span>
        </div>
        <div className="space-y-3">
          {securityItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs w-40 font-medium" style={{ color: DARK_TEXT }}>{item.label}</span>
              <div className="flex-1"><ProgressBar pct={item.pct} color={item.pct >= 95 ? GREEN : item.pct >= 85 ? AMBER : RED} /></div>
              <span className="text-xs font-bold w-8 text-right" style={{ color: item.pct >= 95 ? GREEN : AMBER }}>{item.pct}%</span>
              <span className="text-sm">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB 5 — Guardrails
// ══════════════════════════════════════════════════════════════════════════════
const INITIAL_GUARDRAILS = [
  { id: 1, on: true,  category: "CONTENT",     title: "Block competitor brand names in paid ads",           desc: "Prevent any content with competitor brand names from appearing in paid ad campaigns." },
  { id: 2, on: true,  category: "FINANCE",     title: "Require CMO approval for spend >$10K",               desc: "Any budget allocation decision exceeding $10,000 requires CMO sign-off before execution." },
  { id: 3, on: true,  category: "BRAND",       title: "Enforce brand voice score >80% before publish",      desc: "All content must score 80% or above on brand voice check before being published." },
  { id: 4, on: true,  category: "PERFORMANCE", title: "Alert if CAC increases >15% week-over-week",         desc: "Trigger immediate alert to marketing ops if customer acquisition cost rises more than 15%." },
  { id: 5, on: false, category: "OPERATIONS",  title: "Block all publishing between 11pm–6am local time",   desc: "Prevent any automated publishing during off-hours to avoid unmonitored content going live." },
  { id: 6, on: true,  category: "PERFORMANCE", title: "Auto-pause campaigns with ROAS <1.5× for 3+ days",  desc: "Automatically pause campaigns delivering below 1.5× ROAS for three or more consecutive days." },
];

const CATEGORY_COLORS: Record<string, string> = {
  CONTENT: BLUE,
  FINANCE: AMBER,
  BRAND: PRIMARY,
  PERFORMANCE: GREEN,
  OPERATIONS: PURPLE,
};

function Guardrails({ addToast }: { addToast: (msg: string, type?: Toast["type"]) => void }) {
  const [guardrails, setGuardrails] = useState(INITIAL_GUARDRAILS);
  const [showModal, setShowModal] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", category: "CONTENT", desc: "", condition: "", on: true });

  const toggleGuardrail = (id: number) => {
    setGuardrails((g) => g.map((r) => r.id === id ? { ...r, on: !r.on } : r));
  };

  const handleCreate = () => {
    if (!newRule.name.trim()) return;
    const next = {
      id: guardrails.length + 1,
      on: newRule.on,
      category: newRule.category,
      title: newRule.name,
      desc: newRule.desc || newRule.condition,
    };
    setGuardrails((g) => [...g, next]);
    setShowModal(false);
    setNewRule({ name: "", category: "CONTENT", desc: "", condition: "", on: true });
    addToast("Guardrail created.", "success");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Active Guardrails</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border"
          style={{ borderColor: BORDER, color: PRIMARY, background: CARD }}
        >
          <Plus size={13} /> Add Guardrail
        </button>
      </div>

      <div className="space-y-3">
        {guardrails.map((rule) => {
          const catColor = CATEGORY_COLORS[rule.category] || MUTED;
          return (
            <div key={rule.id} className="rounded-xl p-4 flex items-start gap-3" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <Toggle on={rule.on} onChange={() => toggleGuardrail(rule.id)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${catColor}15`, color: catColor }}
                  >
                    {rule.category}
                  </span>
                  <p className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{rule.title}</p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{rule.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Guardrail Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="rounded-2xl p-6 w-full max-w-md"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: DARK_TEXT }}>Add Guardrail</h3>
                <button onClick={() => setShowModal(false)} style={{ color: MUTED }}><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>Rule Name</label>
                  <input
                    type="text"
                    value={newRule.name}
                    onChange={(e) => setNewRule((r) => ({ ...r, name: e.target.value }))}
                    placeholder="e.g. Block off-brand messaging"
                    className="w-full text-sm rounded-lg px-3 py-2"
                    style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, color: DARK_TEXT }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>Category</label>
                  <select
                    value={newRule.category}
                    onChange={(e) => setNewRule((r) => ({ ...r, category: e.target.value }))}
                    className="w-full text-sm rounded-lg px-3 py-2"
                    style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, color: DARK_TEXT }}
                  >
                    {Object.keys(CATEGORY_COLORS).map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>Description</label>
                  <textarea
                    value={newRule.desc}
                    onChange={(e) => setNewRule((r) => ({ ...r, desc: e.target.value }))}
                    rows={2}
                    className="w-full text-sm rounded-lg px-3 py-2 resize-none"
                    style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, color: DARK_TEXT }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: MUTED }}>Condition</label>
                  <input
                    type="text"
                    value={newRule.condition}
                    onChange={(e) => setNewRule((r) => ({ ...r, condition: e.target.value }))}
                    placeholder="e.g. brand_voice_score < 80"
                    className="w-full text-sm rounded-lg px-3 py-2"
                    style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, color: DARK_TEXT }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Toggle on={newRule.on} onChange={(v) => setNewRule((r) => ({ ...r, on: v }))} />
                  <span className="text-xs" style={{ color: MUTED }}>Enable immediately</span>
                </div>
                <button
                  onClick={handleCreate}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: PRIMARY, color: "#fff" }}
                >
                  Create Guardrail
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT PAGE
// ══════════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: "brand",      label: "Brand Safety",     icon: Shield },
  { id: "audit",      label: "Audit Log",         icon: ClipboardList },
  { id: "agents",     label: "Agent Settings",    icon: Settings },
  { id: "compliance", label: "Compliance",        icon: FileCheck },
  { id: "guardrails", label: "Guardrails",        icon: Lock },
];

export default function CompliancePage() {
  const { toasts, addToast } = useToast();
  const [activeTab, setActiveTab] = useState("brand");

  return (
    <div className="min-h-full" style={{ background: PAGE_BG }}>
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <div className="px-8 pt-8 pb-0">
        <h1 className="text-2xl font-bold" style={{ color: DARK_TEXT }}>Compliance &amp; Governance</h1>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>Brand safety, audit trail &amp; governance controls</p>
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
                    layoutId="compliance-tab"
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
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "brand"      && <BrandSafety    addToast={addToast} />}
            {activeTab === "audit"      && <AuditLog />}
            {activeTab === "agents"     && <AgentSettings  addToast={addToast} />}
            {activeTab === "compliance" && <ComplianceTab  addToast={addToast} />}
            {activeTab === "guardrails" && <Guardrails     addToast={addToast} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
