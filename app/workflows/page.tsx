"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  GitBranch,
  Puzzle,
  ScrollText,
  Play,
  Pause,
  Copy,
  Edit3,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Link2,
  Settings,
  Activity,
  AlertTriangle,
  Package,
  Layers,
  BarChart2,
  Mail,
  Target,
  Bell,
  TrendingUp,
  Globe,
  Rss,
  Database,
  ShoppingCart,
  FileText,
  Filter,
  Search,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";

// ─── Design tokens ────────────────────────────────────────────────────────────
const PRIMARY = "hsl(25,62%,25%)";
const MUTED = "hsl(25,20%,50%)";
const CARD = "hsl(36,30%,97%)";
const BORDER = "hsl(30,15%,87%)";
const GREEN = "hsl(142,55%,35%)";
const DARK_TEXT = "#3a1f0e";

// ─── Sub-tabs ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "builder", label: "Workflow Builder", icon: GitBranch },
  { id: "templates", label: "Templates", icon: Layers },
  { id: "integrations", label: "Integrations", icon: Puzzle },
  { id: "logs", label: "Automation Logs", icon: ScrollText },
];

// ─── Templates data ───────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: 1, icon: Package, color: "#7c3aed", name: "Product Launch", desc: "End-to-end launch orchestration across all channels", steps: 12, uses: 847 },
  { id: 2, icon: Bell, color: "#2563eb", name: "Webinar Campaign", desc: "Registration → Nurture → Follow-up", steps: 8, uses: 423 },
  { id: 3, icon: Rss, color: "#059669", name: "SEO Content Pipeline", desc: "Keyword → Brief → Content → Publish → Monitor", steps: 6, uses: 1247 },
  { id: 4, icon: TrendingUp, color: "#d97706", name: "Lead Nurturing", desc: "MQL → SQL → Opportunity automation", steps: 10, uses: 2108 },
  { id: 5, icon: Globe, color: "#db2777", name: "Social Campaign", desc: "Campaign → Multi-platform publish → Monitor", steps: 7, uses: 634 },
  { id: 6, icon: Target, color: "#0891b2", name: "ABM Campaign", desc: "Account targeting → Personalized outreach → Sales handoff", steps: 14, uses: 312 },
  { id: 7, icon: AlertTriangle, color: "#dc2626", name: "Competitive Response", desc: "Competitor alert → Analysis → Counter-messaging → Publish", steps: 5, uses: 89 },
  { id: 8, icon: BarChart2, color: "#7c3aed", name: "Quarterly Review", desc: "Data collection → AI analysis → Report → Board deck", steps: 9, uses: 156 },
];

// ─── Integrations data ────────────────────────────────────────────────────────
const INTEGRATIONS = [
  { name: "HubSpot", category: "CRM", color: "#ff7a59", connected: true, sync: "2m ago" },
  { name: "Salesforce", category: "CRM", color: "#00a1e0", connected: true, sync: "5m ago" },
  { name: "Slack", category: "Messaging", color: "#4a154b", connected: true, sync: "1m ago" },
  { name: "Google Analytics", category: "Analytics", color: "#e37400", connected: true, sync: "10m ago" },
  { name: "LinkedIn Ads", category: "Advertising", color: "#0077b5", connected: true, sync: "15m ago" },
  { name: "Google Ads", category: "Advertising", color: "#4285f4", connected: true, sync: "8m ago" },
  { name: "Marketo", category: "Marketing", color: "#5c4ee5", connected: false, sync: null },
  { name: "Notion", category: "Productivity", color: "#000000", connected: false, sync: null },
  { name: "Jira", category: "Project Mgmt", color: "#0052cc", connected: false, sync: null },
  { name: "Meta Ads", category: "Advertising", color: "#1877f2", connected: false, sync: null },
  { name: "Mailchimp", category: "Email", color: "#ffe01b", connected: false, sync: null },
  { name: "WordPress", category: "CMS", color: "#21759b", connected: false, sync: null },
];

// ─── Automation logs ──────────────────────────────────────────────────────────
const LOGS = [
  { id: "L001", workflow: "Webinar Lead Nurture", trigger: "Webinar Registration", started: "2h ago", duration: "3m 12s", status: "Success", records: 24, error: null },
  { id: "L002", workflow: "SEO Content Pipeline", trigger: "Keyword Research Complete", started: "4h ago", duration: "8m 45s", status: "Success", records: 6, error: null },
  { id: "L003", workflow: "Lead Nurturing", trigger: "MQL Score ≥ 80", started: "5h ago", duration: "1m 08s", status: "Success", records: 47, error: null },
  { id: "L004", workflow: "Product Launch", trigger: "Launch Date -7 days", started: "6h ago", duration: "2m 33s", status: "Running", records: 12, error: null },
  { id: "L005", workflow: "ABM Campaign", trigger: "Account Signal Detected", started: "7h ago", duration: "—", status: "Failed", records: 0, error: "Salesforce API rate limit exceeded. Retry in 15 minutes." },
  { id: "L006", workflow: "Competitive Response", trigger: "Competitor Mention", started: "9h ago", duration: "4m 22s", status: "Success", records: 3, error: null },
  { id: "L007", workflow: "Social Campaign", trigger: "Manual Trigger", started: "11h ago", duration: "6m 01s", status: "Success", records: 18, error: null },
  { id: "L008", workflow: "Webinar Lead Nurture", trigger: "Webinar Registration", started: "1d ago", duration: "3m 08s", status: "Success", records: 31, error: null },
  { id: "L009", workflow: "Quarterly Review", trigger: "Scheduled — Q2", started: "2d ago", duration: "22m 14s", status: "Success", records: 1, error: null },
  { id: "L010", workflow: "Lead Nurturing", trigger: "MQL Score ≥ 80", started: "2d ago", duration: "1m 55s", status: "Success", records: 29, error: null },
];

// ─── Last run log steps ───────────────────────────────────────────────────────
const LAST_RUN_STEPS = [
  { step: "Trigger: Webinar Registration", time: "10:42:01", status: "ok" },
  { step: "Lead Enrichment Agent: Fetched company data (Clearbit)", time: "10:42:04", status: "ok" },
  { step: "Branch: Enterprise (>500 emp) — 18 contacts", time: "10:42:05", status: "ok" },
  { step: "LinkedIn Retargeting: Audience synced to LinkedIn Ads", time: "10:42:08", status: "ok" },
  { step: "Sales Notification: Slack DM sent to 3 AEs", time: "10:42:09", status: "ok" },
  { step: "ABM Email Sequence: Enrolled 18 contacts", time: "10:42:11", status: "ok" },
  { step: "Branch: SMB (<500 emp) — 6 contacts", time: "10:42:05", status: "ok" },
  { step: "Email Drip Sequence: Enrolled 6 contacts", time: "10:42:07", status: "ok" },
  { step: "Product Trial Offer: Email sent", time: "10:42:08", status: "ok" },
  { step: "Performance Tracking Agent: Dashboard updated", time: "10:42:14", status: "ok" },
];

// ─── Node types ───────────────────────────────────────────────────────────────
type NodeVariant = "trigger" | "agent" | "action" | "branch" | "tracker";
interface WorkflowNode {
  id: string;
  label: string;
  sublabel?: string;
  variant: NodeVariant;
}

const NODE_STYLES: Record<NodeVariant, { bg: string; border: string; text: string; dot: string }> = {
  trigger: { bg: "hsl(142,55%,95%)", border: "hsl(142,55%,70%)", text: "hsl(142,55%,25%)", dot: GREEN },
  agent:   { bg: "hsl(25,62%,95%)",  border: "hsl(25,62%,70%)",  text: PRIMARY,             dot: PRIMARY },
  branch:  { bg: "hsl(36,80%,95%)",  border: "hsl(36,80%,70%)",  text: "#92400e",           dot: "#d97706" },
  action:  { bg: "hsl(220,80%,96%)", border: "hsl(220,80%,75%)", text: "#1e3a8a",           dot: "#2563eb" },
  tracker: { bg: "hsl(270,60%,96%)", border: "hsl(270,60%,75%)", text: "#4c1d95",           dot: "#7c3aed" },
};

function WFNode({ node }: { node: WorkflowNode }) {
  const s = NODE_STYLES[node.variant];
  return (
    <div
      className="rounded-xl px-4 py-3 min-w-[160px] text-center text-sm font-medium shadow-sm select-none"
      style={{ background: s.bg, border: `1.5px solid ${s.border}`, color: s.text }}
    >
      <div className="flex items-center justify-center gap-2">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: s.dot }}
        />
        <span className="leading-tight">{node.label}</span>
      </div>
      {node.sublabel && (
        <p className="text-[10px] mt-1 opacity-70">{node.sublabel}</p>
      )}
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center my-1">
      {label && (
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded mb-0.5"
          style={{ background: CARD, color: MUTED, border: `1px solid ${BORDER}` }}
        >
          {label}
        </span>
      )}
      <div style={{ width: 2, height: 20, background: BORDER }} />
      <div
        style={{
          width: 0, height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `7px solid ${BORDER}`,
        }}
      />
    </div>
  );
}

// ─── Workflow Canvas ──────────────────────────────────────────────────────────
function WorkflowCanvas() {
  return (
    <div
      className="flex-1 rounded-xl p-6 overflow-auto"
      style={{ background: "hsl(36,30%,96%)", border: `1px solid ${BORDER}`, minHeight: 480 }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: MUTED }}>
        Webinar Lead Nurture — Visual Flow
      </p>

      <div className="flex flex-col items-center">
        {/* Trigger */}
        <WFNode node={{ id: "t", label: "Webinar Registration", sublabel: "Trigger", variant: "trigger" }} />
        <Arrow />

        {/* Enrichment */}
        <WFNode node={{ id: "e", label: "Lead Enrichment Agent", sublabel: "Clearbit · Company data", variant: "agent" }} />
        <Arrow />

        {/* Branch node */}
        <WFNode node={{ id: "b", label: "Company Size Branch", sublabel: "Routing by employee count", variant: "branch" }} />

        {/* Two paths */}
        <div className="flex gap-12 mt-0">
          {/* Enterprise path */}
          <div className="flex flex-col items-center">
            <Arrow label="Enterprise >500" />
            <WFNode node={{ id: "lr", label: "LinkedIn Retargeting", sublabel: "Audience sync", variant: "action" }} />
            <Arrow />
            <WFNode node={{ id: "sn", label: "Sales Notification", sublabel: "Slack → AE team", variant: "action" }} />
            <Arrow />
            <WFNode node={{ id: "abm", label: "ABM Email Sequence", sublabel: "8-touch cadence", variant: "action" }} />
            <Arrow />
          </div>

          {/* SMB path */}
          <div className="flex flex-col items-center">
            <Arrow label="SMB <500" />
            <WFNode node={{ id: "ed", label: "Email Drip Sequence", sublabel: "5-touch nurture", variant: "action" }} />
            <Arrow />
            <WFNode node={{ id: "pt", label: "Product Trial Offer", sublabel: "Automated email", variant: "action" }} />
            <Arrow />
            <div style={{ height: 44 }} /> {/* spacer to align with enterprise path */}
          </div>
        </div>

        {/* Converge arrow */}
        <div className="flex items-center gap-1 mb-1">
          <div style={{ width: 110, height: 1.5, background: BORDER }} />
          <ArrowRight size={14} color={BORDER} />
          <div style={{ width: 110, height: 1.5, background: BORDER }} />
        </div>

        {/* Tracker */}
        <WFNode node={{ id: "pt2", label: "Performance Tracking Agent", sublabel: "Dashboard · Attribution", variant: "tracker" }} />
      </div>
    </div>
  );
}

// ─── Workflow Settings Panel ──────────────────────────────────────────────────
function WorkflowSettings() {
  const [active, setActive] = useState(true);

  return (
    <div
      className="w-72 flex-shrink-0 rounded-xl p-5 flex flex-col gap-4"
      style={{ background: CARD, border: `1px solid ${BORDER}` }}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: MUTED }}>
          Workflow Settings
        </p>
        <p className="font-semibold text-base" style={{ color: DARK_TEXT }}>Webinar Lead Nurture</p>
        <p className="text-xs mt-0.5" style={{ color: MUTED }}>ID: WF-0042</p>
      </div>

      {/* Status toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: DARK_TEXT }}>Status</span>
        <button
          onClick={() => setActive(p => !p)}
          className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
          style={{
            background: active ? "hsl(142,55%,90%)" : "hsl(0,0%,90%)",
            color: active ? GREEN : "#6b7280",
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: active ? GREEN : "#9ca3af" }} />
          {active ? "Active" : "Paused"}
        </button>
      </div>

      {/* Meta */}
      {[
        { label: "Trigger", value: "Webinar Registration" },
        { label: "Last Run", value: "2h ago" },
        { label: "Total Runs", value: "847" },
        { label: "Success Rate", value: "98.2%" },
      ].map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between border-t pt-3" style={{ borderColor: BORDER }}>
          <span className="text-xs" style={{ color: MUTED }}>{label}</span>
          <span className="text-sm font-medium" style={{ color: DARK_TEXT }}>{value}</span>
        </div>
      ))}

      {/* Action buttons */}
      <div className="flex gap-2 pt-1">
        {[
          { label: "Edit", icon: Edit3, solid: true },
          { label: "Pause", icon: Pause, solid: false },
          { label: "Duplicate", icon: Copy, solid: false },
        ].map(({ label, icon: Icon, solid }) => (
          <button
            key={label}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
            style={solid
              ? { background: PRIMARY, color: "#fff" }
              : { background: "transparent", color: PRIMARY, border: `1px solid ${BORDER}` }
            }
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Last run log */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: MUTED }}>Last Run Log</p>
        <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
          {LAST_RUN_STEPS.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: GREEN }} />
              <div>
                <p className="text-[11px] leading-tight" style={{ color: DARK_TEXT }}>{s.step}</p>
                <p className="text-[10px]" style={{ color: MUTED }}>{s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Templates tab ────────────────────────────────────────────────────────────
function TemplatesTab() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {TEMPLATES.map(t => {
        const Icon = t.icon;
        return (
          <motion.div
            key={t.id}
            whileHover={{ y: -2 }}
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${t.color}18` }}
              >
                <Icon size={18} style={{ color: t.color }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{t.name}</p>
                <p className="text-[10px]" style={{ color: MUTED }}>{t.steps} steps</p>
              </div>
            </div>
            <p className="text-xs leading-snug" style={{ color: MUTED }}>{t.desc}</p>
            <div className="flex items-center justify-between text-xs" style={{ color: MUTED }}>
              <span>Used {t.uses.toLocaleString()}×</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <button
                className="flex-1 rounded-lg py-1.5 text-xs font-semibold"
                style={{ background: PRIMARY, color: "#fff" }}
              >
                Use Template
              </button>
              <button
                className="flex-1 rounded-lg py-1.5 text-xs font-semibold"
                style={{ border: `1px solid ${BORDER}`, color: PRIMARY }}
              >
                Preview
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Integrations tab ─────────────────────────────────────────────────────────
function IntegrationsTab() {
  return (
    <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
      {INTEGRATIONS.map(int => (
        <motion.div
          key={int.name}
          whileHover={{ y: -2 }}
          className="rounded-xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: int.color }}
            >
              {int.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{int.name}</p>
              <p className="text-[10px]" style={{ color: MUTED }}>{int.category}</p>
            </div>
          </div>

          {int.connected ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={12} style={{ color: GREEN }} />
                <span className="text-xs" style={{ color: GREEN }}>Connected</span>
              </div>
              <span className="text-[10px]" style={{ color: MUTED }}>Synced {int.sync}</span>
            </div>
          ) : (
            <button
              className="w-full rounded-lg py-1.5 text-xs font-semibold"
              style={{ background: "#2563eb1a", color: "#2563eb" }}
            >
              Connect
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Logs tab ─────────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { bg: string; color: string; icon: React.ElementType }> = {
  Success: { bg: "hsl(142,55%,92%)", color: GREEN, icon: CheckCircle },
  Running: { bg: "hsl(220,80%,93%)", color: "#2563eb", icon: RefreshCw },
  Failed:  { bg: "hsl(0,84%,94%)",   color: "#dc2626", icon: XCircle },
};

function LogsTab() {
  const [expandedError, setExpandedError] = useState<string | null>(null);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "hsl(36,30%,95%)" }}>
            {["Workflow", "Trigger", "Started", "Duration", "Status", "Records", "Actions"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {LOGS.map((log, i) => {
            const s = STATUS_STYLE[log.status];
            const Icon = s.icon;
            const isErrOpen = expandedError === log.id;

            return (
              <>
                <tr
                  key={log.id}
                  className="border-t transition-colors hover:bg-[hsl(36,30%,96%)]"
                  style={{ borderColor: BORDER, background: i % 2 === 0 ? "#fff" : CARD }}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: DARK_TEXT }}>{log.workflow}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{log.trigger}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{log.started}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{log.duration}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ background: s.bg, color: s.color }}
                    >
                      <Icon size={11} className={log.status === "Running" ? "animate-spin" : ""} />
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{log.records || "—"}</td>
                  <td className="px-4 py-3">
                    {log.error ? (
                      <button
                        onClick={() => setExpandedError(isErrOpen ? null : log.id)}
                        className="text-xs font-semibold rounded-lg px-2.5 py-1 transition-colors"
                        style={{ background: "#dc26261a", color: "#dc2626" }}
                      >
                        {isErrOpen ? "Hide Error" : "View Error"}
                      </button>
                    ) : (
                      <button className="text-xs font-semibold" style={{ color: MUTED }}>
                        View
                      </button>
                    )}
                  </td>
                </tr>
                {isErrOpen && log.error && (
                  <tr key={`${log.id}-err`} style={{ borderColor: BORDER }}>
                    <td colSpan={7} className="px-4 pb-3">
                      <div
                        className="flex items-start gap-3 rounded-lg p-3"
                        style={{ background: "#dc262608", border: "1px solid #dc262630" }}
                      >
                        <AlertTriangle size={16} style={{ color: "#dc2626", flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <p className="text-xs font-semibold mb-0.5" style={{ color: "#dc2626" }}>Error Detail</p>
                          <p className="text-xs" style={{ color: DARK_TEXT }}>{log.error}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState("builder");

  return (
    <div className="p-8 flex flex-col gap-8 min-h-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: MUTED }}>CMO Office AgenticOS</p>
        <h1 className="font-serif text-3xl font-bold" style={{ color: PRIMARY }}>Workflow Automation</h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>Trigger-based multi-agent workflows for marketing operations</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <MetricCard label="Active Workflows" value="18" sub="Across all campaigns" trend={12} />
        <MetricCard label="Runs This Month" value="2,847" sub="↑ 18% vs last month" trend={18} />
        <MetricCard label="Time Saved" value="340 hrs" sub="Per month" trend={22} />
        <MetricCard label="Automation Rate" value="78%" sub="Of marketing ops" trend={5} />
      </motion.div>

      {/* Sub-tabs */}
      <div className="flex gap-1" style={{ borderBottom: `2px solid ${BORDER}` }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative"
              style={{ color: isActive ? PRIMARY : MUTED }}
            >
              <Icon size={15} />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="wf-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: PRIMARY }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "builder" && (
            <div className="flex gap-5">
              <WorkflowCanvas />
              <WorkflowSettings />
            </div>
          )}
          {activeTab === "templates" && <TemplatesTab />}
          {activeTab === "integrations" && <IntegrationsTab />}
          {activeTab === "logs" && <LogsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
