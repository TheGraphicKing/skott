// /Users/navaneethakrishnan/Desktop/skott/app/agency/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  PauseCircle,
  AlertTriangle,
  ChevronRight,
  FileText,
  Send,
  Calendar,
  Users,
  Settings,
  RefreshCw,
  BarChart2,
  Shield,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const P = "hsl(25,62%,25%)";
const MUTED = "hsl(25,20%,50%)";
const CARD = "hsl(36,30%,97%)";
const BORDER = "hsl(30,15%,87%)";
const PAGE_BG = "hsl(36,33%,94%)";
const GREEN = "hsl(142,55%,35%)";
const RED = "#dc2626";
const AMBER = "#d97706";
const BLUE = "#2563eb";
const DARK_TEXT = "#3a1f0e";

// ─── Client data ──────────────────────────────────────────────────────────────
type Health = "green" | "amber" | "red";

interface Client {
  id: number;
  name: string;
  campaigns: number;
  health: number;
  status: Health;
}

const CLIENTS: Client[] = [
  { id: 1, name: "TechCorp Inc.",       campaigns: 6, health: 94, status: "green" },
  { id: 2, name: "FinServ Partners",    campaigns: 4, health: 87, status: "green" },
  { id: 3, name: "MedDevice Co.",       campaigns: 3, health: 72, status: "amber" },
  { id: 4, name: "RetailBrand Global",  campaigns: 8, health: 91, status: "green" },
  { id: 5, name: "SaaS Startup X",      campaigns: 2, health: 65, status: "amber" },
  { id: 6, name: "Healthcare AI Co.",   campaigns: 5, health: 88, status: "green" },
  { id: 7, name: "EdTech Platform",     campaigns: 3, health: 54, status: "red"   },
  { id: 8, name: "Real Estate Tech",    campaigns: 2, health: 96, status: "green" },
];

const HEALTH_COLOR: Record<Health, string> = { green: GREEN, amber: AMBER, red: RED };

// ─── TechCorp campaign table ──────────────────────────────────────────────────
type CampaignStatus = "Live" | "Active" | "Paused";

const CAMPAIGNS_TC = [
  { name: "Q2 Product Launch",  status: "Live"   as CampaignStatus, budget: "$120K", roas: "6.2×" },
  { name: "LinkedIn ABM",        status: "Live"   as CampaignStatus, budget: "$85K",  roas: "7.1×" },
  { name: "Google Brand",        status: "Active" as CampaignStatus, budget: "$65K",  roas: "4.8×" },
  { name: "Retargeting",         status: "Paused" as CampaignStatus, budget: "$45K",  roas: "2.1×" },
];

const STATUS_STYLE: Record<CampaignStatus, { bg: string; text: string; icon: React.ReactNode }> = {
  Live:   { bg: "#d1fae5", text: GREEN, icon: <Activity className="w-3 h-3" /> },
  Active: { bg: "#dbeafe", text: BLUE,  icon: <CheckCircle2 className="w-3 h-3" /> },
  Paused: { bg: "#f3f4f6", text: "#6b7280", icon: <PauseCircle className="w-3 h-3" /> },
};

const APPROVALS = [
  { title: "Q2 Creative Assets — Round 2",   due: "Due today",   type: "Creative" },
  { title: "LinkedIn Campaign Copy v3",       due: "Due May 15",  type: "Copy"     },
  { title: "June Budget Reallocation Plan",  due: "Due May 17",  type: "Budget"   },
];

const TEAM = [
  { name: "Alex R.", initials: "AR", color: "#7c3aed" },
  { name: "Jamie K.", initials: "JK", color: BLUE       },
  { name: "Sam T.",  initials: "ST", color: GREEN       },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Avatar({ member }: { member: typeof TEAM[0] }) {
  return (
    <div className="relative group">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
        style={{ background: member.color }}>
        {member.initials}
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
        style={{ background: DARK_TEXT }}>
        {member.name}
      </div>
    </div>
  );
}

function BudgetBar({ spent, total }: { spent: number; total: number }) {
  const pct = (spent / total) * 100;
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: BORDER }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: pct > 80 ? AMBER : P }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AgencyPage() {
  const [selectedClient, setSelectedClient] = useState<Client>(CLIENTS[0]);

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ background: PAGE_BG }}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-6 h-6" style={{ color: P }} />
          <h1 className="text-2xl font-bold" style={{ color: DARK_TEXT }}>Agency Mode</h1>
        </div>
        <p className="text-sm" style={{ color: MUTED }}>
          Multi-client workspace management with white-label reporting
        </p>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Clients",        value: "8",     icon: <Building2 className="w-5 h-5" /> },
          { label: "Campaigns Running",     value: "47",    icon: <Activity className="w-5 h-5" />  },
          { label: "Total Ad Spend Managed",value: "$4.8M", icon: <DollarSign className="w-5 h-5" /> },
          { label: "Avg Client ROAS",       value: "3.8×",  icon: <TrendingUp className="w-5 h-5" /> },
        ].map((kpi) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 border"
            style={{ background: CARD, borderColor: BORDER }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: MUTED }}>{kpi.label}</span>
              <span style={{ color: P }}>{kpi.icon}</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: DARK_TEXT }}>{kpi.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Main layout */}
      <div className="flex gap-5">
        {/* Left sidebar — client list */}
        <div className="w-52 shrink-0 space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Clients</p>
          {CLIENTS.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="w-full text-left p-3 rounded-xl border transition-all hover:shadow-sm"
              style={{
                background: selectedClient.id === client.id ? P : CARD,
                borderColor: selectedClient.id === client.id ? P : BORDER,
                color: selectedClient.id === client.id ? "#fff" : DARK_TEXT,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: selectedClient.id === client.id ? "#fff" : HEALTH_COLOR[client.status] }} />
                <span className="text-xs font-semibold truncate">{client.name}</span>
              </div>
              <div className="flex justify-between text-xs pl-4"
                style={{ color: selectedClient.id === client.id ? "rgba(255,255,255,0.7)" : MUTED }}>
                <span>{client.campaigns} campaigns</span>
                <span>{client.health}%</span>
              </div>
            </button>
          ))}
        </div>

        {/* Main content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedClient.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0 space-y-4"
          >
            {/* Client header */}
            <div className="rounded-2xl border p-5" style={{ background: CARD, borderColor: BORDER }}>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {/* Logo placeholder */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg text-white shrink-0"
                    style={{ background: P }}>
                    {selectedClient.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: DARK_TEXT }}>{selectedClient.name}</h2>
                    <p className="text-xs" style={{ color: MUTED }}>Primary contact: <span style={{ color: DARK_TEXT }}>Sarah Chen (CMO)</span></p>
                    <div className="flex gap-4 mt-1 text-xs" style={{ color: MUTED }}>
                      <span>Contract: <span style={{ color: DARK_TEXT, fontWeight: 600 }}>$45K/mo</span></span>
                      <span>Renewal: <span style={{ color: DARK_TEXT, fontWeight: 600 }}>Sep 2026</span></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {TEAM.map((m) => <Avatar key={m.name} member={m} />)}
                  </div>
                  <span className="text-xs" style={{ color: MUTED }}>Team</span>
                </div>
              </div>
            </div>

            {/* Client KPIs */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Q2 Budget",            value: "$380K",  sub: "Spent $247K · 65%" },
                { label: "Revenue Attributed",   value: "$1.92M", sub: "vs $1.5M last Q"   },
                { label: "ROAS",                 value: "5.1×",   sub: "vs 3.8× avg"        },
                { label: "CAC",                  value: "$210",   sub: "↓ from $248"        },
              ].map((kpi, i) => (
                <div key={i} className="rounded-xl border p-3" style={{ background: "#fff", borderColor: BORDER }}>
                  <p className="text-xs" style={{ color: MUTED }}>{kpi.label}</p>
                  <p className="text-xl font-bold mt-0.5" style={{ color: DARK_TEXT }}>{kpi.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: MUTED }}>{kpi.sub}</p>
                  {kpi.label === "Q2 Budget" && (
                    <div className="mt-1.5"><BudgetBar spent={247} total={380} /></div>
                  )}
                </div>
              ))}
            </div>

            {/* Campaign Table */}
            <div className="rounded-2xl border p-5" style={{ background: CARD, borderColor: BORDER }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: DARK_TEXT }}>Active Campaigns</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs border-b" style={{ color: MUTED, borderColor: BORDER }}>
                    <th className="text-left pb-2 font-medium">Campaign</th>
                    <th className="text-left pb-2 font-medium">Status</th>
                    <th className="text-left pb-2 font-medium">Budget</th>
                    <th className="text-left pb-2 font-medium">ROAS</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: BORDER }}>
                  {CAMPAIGNS_TC.map((c) => {
                    const s = STATUS_STYLE[c.status];
                    return (
                      <tr key={c.name} className="hover:bg-white transition-colors">
                        <td className="py-2.5 font-medium" style={{ color: DARK_TEXT }}>{c.name}</td>
                        <td className="py-2.5">
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: s.bg, color: s.text }}>
                            {s.icon}{c.status}
                          </span>
                        </td>
                        <td className="py-2.5 font-medium" style={{ color: DARK_TEXT }}>{c.budget}</td>
                        <td className="py-2.5 font-bold" style={{ color: GREEN }}>{c.roas}</td>
                        <td className="py-2.5">
                          <ChevronRight className="w-4 h-4" style={{ color: MUTED }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-3 gap-4">
              {/* White-label report */}
              <div className="col-span-1 rounded-2xl border p-4" style={{ background: CARD, borderColor: BORDER }}>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4" style={{ color: P }} />
                  <h3 className="font-semibold text-sm" style={{ color: DARK_TEXT }}>White-Label Report</h3>
                </div>
                <div className="rounded-xl border p-3 mb-3" style={{ background: "#fff", borderColor: BORDER }}>
                  <p className="text-xs font-semibold" style={{ color: DARK_TEXT }}>Client Report: May 2026</p>
                  <p className="text-xs mt-0.5" style={{ color: MUTED }}>Generated May 14 · PDF · 12 pages</p>
                  <div className="flex gap-1.5 mt-2">
                    <div className="h-1 flex-1 rounded-full" style={{ background: P }} />
                    <div className="h-1 flex-1 rounded-full" style={{ background: MUTED, opacity: 0.3 }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <button className="w-full py-2 rounded-lg text-xs font-semibold text-white"
                    style={{ background: P }}>Generate Report</button>
                  <button className="w-full py-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5"
                    style={{ color: BLUE, borderColor: BLUE }}>
                    <Send className="w-3 h-3" />Send to Client
                  </button>
                  <button className="w-full py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5"
                    style={{ color: MUTED, borderColor: BORDER }}>
                    <Calendar className="w-3 h-3" />Schedule Monthly
                  </button>
                </div>
              </div>

              {/* Approval queue */}
              <div className="col-span-1 rounded-2xl border p-4" style={{ background: CARD, borderColor: BORDER }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: AMBER }} />
                    <h3 className="font-semibold text-sm" style={{ color: DARK_TEXT }}>Approval Queue</h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: "#fff7ed", color: AMBER }}>3 pending</span>
                </div>
                <div className="space-y-2">
                  {APPROVALS.map((a, i) => (
                    <div key={i} className="p-3 rounded-xl border" style={{ background: "#fff", borderColor: BORDER }}>
                      <p className="text-xs font-semibold" style={{ color: DARK_TEXT }}>{a.title}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs" style={{ color: MUTED }}>{a.due}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: PAGE_BG, color: MUTED }}>{a.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div className="col-span-1 rounded-2xl border p-4" style={{ background: CARD, borderColor: BORDER }}>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4" style={{ color: P }} />
                  <h3 className="font-semibold text-sm" style={{ color: DARK_TEXT }}>Client Permissions</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Read-only dashboard",   on: true  },
                    { label: "View campaign metrics",  on: true  },
                    { label: "Download reports",       on: true  },
                    { label: "Edit campaigns",         on: false },
                    { label: "Access raw data",        on: false },
                  ].map((perm) => (
                    <div key={perm.label} className="flex items-center justify-between text-xs">
                      <span style={{ color: DARK_TEXT }}>{perm.label}</span>
                      <div className="relative w-8 h-4 rounded-full transition-colors"
                        style={{ background: perm.on ? GREEN : BORDER }}>
                        <div className="absolute top-0.5 rounded-full w-3 h-3 bg-white transition-all"
                          style={{ left: perm.on ? "calc(100% - 14px)" : "2px" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
