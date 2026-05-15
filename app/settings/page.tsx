"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Users, Shield, CreditCard, Webhook, Building2,
  Bell, Lock, Key, CheckCircle, AlertCircle, Plus, Edit, Trash2,
  Download, RefreshCw, ExternalLink, Copy, ChevronRight,
  Globe, Mail,
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

// ─── Tabs Config ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "workspace",    label: "Workspace",      icon: Building2 },
  { id: "integrations", label: "Integrations",   icon: Globe },
  { id: "users",        label: "Users & RBAC",   icon: Users },
  { id: "security",     label: "Security",        icon: Shield },
  { id: "api",          label: "API & Webhooks",  icon: Webhook },
  { id: "billing",      label: "Billing",         icon: CreditCard },
];

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 9999,
        background: checked ? PRIMARY : BORDER,
        border: "none", cursor: "pointer",
        position: "relative", transition: "background 0.25s",
        flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: "#fff", transition: "left 0.25s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

// ─── Card Wrapper ─────────────────────────────────────────────────────────────
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`,
      borderRadius: 12, padding: 24, ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Section Title ────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: 15, fontWeight: 600, color: DARK_TEXT, marginBottom: 16, marginTop: 0 }}>
      {children}
    </h3>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────
function FieldRow({ label, value, type = "text" }: { label: string; value: string; type?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{label}</label>
      <input
        defaultValue={value}
        type={type}
        style={{
          padding: "9px 12px", borderRadius: 8,
          border: `1px solid ${BORDER}`, background: PAGE_BG,
          fontSize: 14, color: DARK_TEXT, outline: "none",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}

// ─── WORKSPACE TAB ────────────────────────────────────────────────────────────
function WorkspaceTab() {
  const [notifs, setNotifs] = useState({
    emailDigests: true, slackAlerts: true, agentSummaries: false, budgetWarnings: true,
  });
  const toggle = (k: keyof typeof notifs) => setNotifs(p => ({ ...p, [k]: !p[k] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Company Info */}
      <Card>
        <SectionTitle>Company Information</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
          {[
            { label: "Company Name", value: "Lyzr AI" },
            { label: "Industry", value: "AI / SaaS" },
            { label: "Headquarters", value: "San Francisco, CA" },
            { label: "Founded", value: "2023" },
            { label: "CEO", value: "Siva Surendira" },
            { label: "CMO", value: "Sarah Chen" },
          ].map(f => (
            <FieldRow key={f.label} label={f.label} value={f.value} />
          ))}
        </div>
      </Card>

      {/* Workspace Settings */}
      <Card>
        <SectionTitle>Workspace Settings</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
          <FieldRow label="Workspace Name" value="Lyzr Marketing OS" />
          <FieldRow label="Timezone" value="America/Los_Angeles (PST)" />
          <FieldRow label="Date Format" value="MM/DD/YYYY" />
          <FieldRow label="Language" value="English (US)" />
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <SectionTitle>Notification Preferences</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { key: "emailDigests" as const, icon: Mail, label: "Email Digests", desc: "Daily summary of agent activities and campaign performance" },
            { key: "slackAlerts" as const, icon: Bell, label: "Slack Alerts", desc: "Real-time notifications for critical events in Slack" },
            { key: "agentSummaries" as const, icon: Settings, label: "Agent Summaries", desc: "Weekly AI-generated reports from your agents" },
            { key: "budgetWarnings" as const, icon: AlertCircle, label: "Budget Warnings", desc: "Alerts when spend exceeds 80% of budget threshold" },
          ].map(({ key, icon: Icon, label, desc }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: PAGE_BG, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${BORDER}` }}>
                  <Icon size={16} color={MUTED} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: DARK_TEXT }}>{label}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{desc}</div>
                </div>
              </div>
              <Toggle checked={notifs[key]} onChange={() => toggle(key)} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
          <button style={{
            padding: "10px 24px", borderRadius: 8, background: PRIMARY,
            color: "#fff", border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 600,
          }}>
            Save Changes
          </button>
        </div>
      </Card>
    </div>
  );
}

// ─── INTEGRATIONS TAB ────────────────────────────────────────────────────────
const INTEGRATIONS = [
  { name: "HubSpot CRM",      status: "connected", color: "#FF7A59" },
  { name: "Salesforce",       status: "connected", color: "#00A1E0" },
  { name: "Google Analytics", status: "connected", color: "#E37400" },
  { name: "Google Ads",       status: "connected", color: "#4285F4" },
  { name: "LinkedIn Ads",     status: "connected", color: "#0A66C2" },
  { name: "Slack",            status: "connected", color: "#4A154B" },
  { name: "Notion",           status: "connected", color: "#000000" },
  { name: "Google Drive",     status: "connected", color: "#34A853" },
  { name: "Marketo",          status: "partial",   color: "#5C4EE5" },
  { name: "Semrush",          status: "partial",   color: "#FF6729" },
  { name: "Ahrefs",           status: "partial",   color: "#FF8C00" },
  { name: "Zoom",             status: "available", color: "#2D8CFF" },
  { name: "Intercom",         status: "available", color: "#1F8FED" },
  { name: "Drift",            status: "available", color: "#4B5EFF" },
  { name: "Outreach",         status: "available", color: "#5951FF" },
  { name: "ZoomInfo",         status: "available", color: "#0057FF" },
  { name: "6sense",           status: "available", color: "#FF4F00" },
];

function IntegrationsTab() {
  const statusConfig = {
    connected: { label: "Connected",  bg: "#dcfce7", color: GREEN },
    partial:   { label: "Partial",    bg: "#fef3c7", color: AMBER },
    available: { label: "Available",  bg: "#f1f5f9", color: "#64748b" },
  };

  return (
    <div>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, color: MUTED }}>
            <span style={{ color: GREEN, fontWeight: 600 }}>8 connected</span> &nbsp;·&nbsp;
            <span style={{ color: AMBER, fontWeight: 600 }}>3 partial</span> &nbsp;·&nbsp;
            <span style={{ color: MUTED }}>6 available</span>
          </div>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: 8, background: PRIMARY,
          color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
        }}>
          <Plus size={14} /> Add Integration
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {INTEGRATIONS.map((intg) => {
          const sc = statusConfig[intg.status as keyof typeof statusConfig];
          return (
            <Card key={intg.name} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: intg.color + "22",
                  border: `1px solid ${intg.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: intg.color }} />
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 9999,
                  background: sc.bg, color: sc.color,
                }}>
                  {sc.label}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: DARK_TEXT }}>{intg.name}</div>
              <button style={{
                padding: "7px 0", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${intg.status === "available" ? BORDER : PRIMARY}`,
                background: intg.status === "available" ? "transparent" : PRIMARY + "15",
                color: intg.status === "available" ? MUTED : PRIMARY,
              }}>
                {intg.status === "available" ? "Connect" : "Configure"}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── USERS & RBAC TAB ─────────────────────────────────────────────────────────
const USERS = [
  { name: "Sarah Chen",      role: "CMO",               perm: "Admin",  status: "Active", login: "Today" },
  { name: "Raj Patel",       role: "Head of Demand Gen", perm: "Editor", status: "Active", login: "Today" },
  { name: "Emily Watson",    role: "Content Lead",       perm: "Editor", status: "Active", login: "2h ago" },
  { name: "David Kim",       role: "SEO Lead",           perm: "Viewer", status: "Active", login: "1d ago" },
  { name: "Priya Sharma",    role: "Paid Media",         perm: "Editor", status: "Active", login: "3h ago" },
  { name: "Alex Rodriguez",  role: "Social",             perm: "Viewer", status: "Active", login: "5h ago" },
  { name: "Jamie Liu",       role: "Email",              perm: "Editor", status: "Active", login: "Today" },
  { name: "Jordan Taylor",   role: "Ops",                perm: "Viewer", status: "Active", login: "2d ago" },
  { name: "Morgan Blake",    role: "Designer",           perm: "Viewer", status: "Active", login: "1d ago" },
];

function initials(name: string) {
  return name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
}

function UsersTab() {
  const permColor = { Admin: RED, Editor: AMBER, Viewer: BLUE };
  const permBg    = { Admin: "#fee2e2", Editor: "#fef3c7", Viewer: "#dbeafe" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 14, color: MUTED }}>9 members · 18/20 seats used</div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "9px 18px", borderRadius: 8, background: PRIMARY,
          color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
        }}>
          <Plus size={14} /> Invite User
        </button>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: PAGE_BG, borderBottom: `1px solid ${BORDER}` }}>
              {["User", "Role", "Permission", "Status", "Last Login", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: MUTED }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {USERS.map((u, i) => (
              <tr key={u.name} style={{ borderBottom: i < USERS.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: PRIMARY + "22", border: `1px solid ${PRIMARY}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: PRIMARY, flexShrink: 0,
                    }}>
                      {initials(u.name)}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: DARK_TEXT }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: MUTED }}>{u.role}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 9999,
                    background: permBg[u.perm as keyof typeof permBg],
                    color: permColor[u.perm as keyof typeof permColor],
                  }}>
                    {u.perm}
                  </span>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN }} />
                    <span style={{ fontSize: 13, color: DARK_TEXT }}>{u.status}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 20px", fontSize: 13, color: MUTED }}>{u.login}</td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${BORDER}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: MUTED }}>
                      <Edit size={12} /> Edit
                    </button>
                    <button style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid #fee2e2`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: RED }}>
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── SECURITY TAB ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const badges = ["SOC 2 Type II", "ISO 27001", "GDPR", "CCPA"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Scorecard */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: `conic-gradient(${GREEN} 94%, ${BORDER} 0%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", flexShrink: 0,
          }}>
            <div style={{
              width: 76, height: 76, borderRadius: "50%", background: CARD,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column",
            }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: GREEN, lineHeight: 1 }}>94</div>
              <div style={{ fontSize: 11, color: MUTED }}>/ 100</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: DARK_TEXT, marginBottom: 6 }}>Security Score</div>
            <div style={{ fontSize: 14, color: MUTED, marginBottom: 14 }}>Excellent — your workspace meets enterprise security standards</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {badges.map(b => (
                <div key={b} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "5px 12px", borderRadius: 9999,
                  background: "#dcfce7", border: `1px solid ${GREEN}44`,
                }}>
                  <CheckCircle size={13} color={GREEN} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: GREEN }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Security Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { icon: Lock, label: "Multi-Factor Authentication", value: "Enabled for all users", status: "ok" },
          { icon: Key,  label: "Single Sign-On (SSO)",        value: "Google Workspace", status: "ok" },
          { icon: Globe, label: "Session Timeout",             value: "8 hours", status: "ok" },
          { icon: Shield, label: "Data Residency",             value: "US-West (AWS us-west-2)", status: "ok" },
        ].map(({ icon: Icon, label, value, status }) => (
          <Card key={label}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: GREEN + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} color={GREEN} />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: MUTED, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: DARK_TEXT }}>{value}</div>
                </div>
              </div>
              <CheckCircle size={18} color={GREEN} />
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: DARK_TEXT, marginBottom: 4 }}>Last Security Audit</div>
            <div style={{ fontSize: 13, color: MUTED }}>March 15, 2025 — Passed all 147 checks. Next audit scheduled June 2025.</div>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 8, border: `1px solid ${BORDER}`,
            background: "transparent", cursor: "pointer", fontSize: 13, color: MUTED,
          }}>
            <Download size={14} /> Download Report
          </button>
        </div>
      </Card>
    </div>
  );
}

// ─── API & WEBHOOKS TAB ───────────────────────────────────────────────────────
const API_KEYS = [
  { name: "Production Key", masked: "sk-lyzr-••••••••••••8f2a", lastUsed: "Today, 11:43 AM", env: "Production" },
  { name: "Staging Key",    masked: "sk-lyzr-••••••••••••3c9d", lastUsed: "Yesterday, 4:12 PM", env: "Staging" },
];

const WEBHOOKS = [
  { url: "https://hooks.example.com/lyzr/••••••prod", events: "campaign.created, agent.completed", triggered: "5 min ago" },
  { url: "https://crm.company.com/webhook/••••••••••", events: "lead.qualified, deal.created",     triggered: "2h ago" },
  { url: "https://slack.com/api/••••••••••••••••••••", events: "budget.warning, report.ready",    triggered: "1d ago" },
];

function ApiTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* API Keys */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <SectionTitle>API Keys</SectionTitle>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 8, background: PRIMARY,
            color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>
            <Plus size={14} /> Create New Key
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {API_KEYS.map(k => (
            <div key={k.name} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: 16, borderRadius: 10, background: PAGE_BG, border: `1px solid ${BORDER}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: PRIMARY + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Key size={16} color={PRIMARY} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: DARK_TEXT }}>{k.name}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Last used: {k.lastUsed}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "monospace", fontSize: 13, color: MUTED, background: BORDER + "66", padding: "4px 10px", borderRadius: 6 }}>
                  {k.masked}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 9999, background: k.env === "Production" ? "#dbeafe" : "#f1f5f9", color: k.env === "Production" ? BLUE : MUTED }}>
                  {k.env}
                </span>
                <button style={{ padding: "6px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: MUTED }}>
                  <Copy size={12} /> Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Rate Limits */}
      <Card>
        <SectionTitle>Rate Limits</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: DARK_TEXT }}>API Requests / minute</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: DARK_TEXT }}>342 / 1,000</span>
        </div>
        <div style={{ height: 8, borderRadius: 9999, background: BORDER, overflow: "hidden" }}>
          <div style={{ width: "34.2%", height: "100%", background: GREEN, borderRadius: 9999 }} />
        </div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>34.2% of rate limit used</div>
      </Card>

      {/* Webhooks */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <SectionTitle>Webhooks</SectionTitle>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 8, border: `1px solid ${BORDER}`,
            background: "transparent", cursor: "pointer", fontSize: 13, color: MUTED,
          }}>
            <Plus size={14} /> Add Endpoint
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {WEBHOOKS.map((w, i) => (
            <div key={i} style={{
              padding: 16, borderRadius: 10, background: PAGE_BG, border: `1px solid ${BORDER}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: PRIMARY }}>{w.url}</span>
                <span style={{ fontSize: 11, color: MUTED }}>Triggered: {w.triggered}</span>
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>Events: <span style={{ color: DARK_TEXT }}>{w.events}</span></div>
            </div>
          ))}
        </div>
      </Card>

      {/* API Docs Link */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, color: MUTED }}>Need help? View the full API documentation</div>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 8, border: `1px solid ${BORDER}`,
            background: "transparent", cursor: "pointer", fontSize: 13, color: PRIMARY, fontWeight: 600,
          }}>
            API Docs <ExternalLink size={13} />
          </button>
        </div>
      </Card>
    </div>
  );
}

// ─── BILLING TAB ──────────────────────────────────────────────────────────────
const INVOICES = [
  { id: "INV-2025-04", date: "Apr 1, 2025",  amount: "$400.00", status: "Paid" },
  { id: "INV-2025-03", date: "Mar 1, 2025",  amount: "$400.00", status: "Paid" },
  { id: "INV-2025-02", date: "Feb 1, 2025",  amount: "$400.00", status: "Paid" },
  { id: "INV-2025-01", date: "Jan 1, 2025",  amount: "$400.00", status: "Paid" },
];

function BillingTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Plan Card */}
      <Card>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: DARK_TEXT }}>Enterprise Plan</div>
              <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 9999, background: PRIMARY + "15", color: PRIMARY }}>Annual</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: PRIMARY, marginBottom: 4 }}>$4,800<span style={{ fontSize: 14, fontWeight: 400, color: MUTED }}> / year</span></div>
            <div style={{ fontSize: 13, color: MUTED }}>Next renewal: <strong style={{ color: DARK_TEXT }}>January 15, 2026</strong></div>
          </div>
          <button style={{
            padding: "10px 20px", borderRadius: 8, background: PRIMARY,
            color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>
            Contact Sales
          </button>
        </div>

        <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 12 }}>INCLUDED FEATURES</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 0" }}>
            {[
              "Unlimited agents", "20 seats", "Priority support",
              "SSO & SAML", "Advanced analytics", "White-label",
            ].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: DARK_TEXT }}>
                <CheckCircle size={14} color={GREEN} />{f}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Usage */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>API Calls This Month</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: DARK_TEXT, marginBottom: 8 }}>892,400 <span style={{ fontSize: 13, color: MUTED, fontWeight: 400 }}>/ 2,000,000</span></div>
          <div style={{ height: 8, borderRadius: 9999, background: BORDER, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: "44.6%", height: "100%", background: AMBER, borderRadius: 9999 }} />
          </div>
          <div style={{ fontSize: 12, color: MUTED }}>44.6% used · 1,107,600 remaining</div>
        </Card>
        <Card>
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>Seats Used</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: DARK_TEXT, marginBottom: 8 }}>18 <span style={{ fontSize: 13, color: MUTED, fontWeight: 400 }}>/ 20 seats</span></div>
          <div style={{ height: 8, borderRadius: 9999, background: BORDER, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: "90%", height: "100%", background: PRIMARY, borderRadius: 9999 }} />
          </div>
          <div style={{ fontSize: 12, color: MUTED }}>90% used · 2 seats available</div>
        </Card>
      </div>

      {/* Invoices */}
      <Card>
        <SectionTitle>Invoice History</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {INVOICES.map(inv => (
            <div key={inv.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", borderRadius: 9, background: PAGE_BG, border: `1px solid ${BORDER}`,
            }}>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <span style={{ fontFamily: "monospace", fontSize: 13, color: MUTED }}>{inv.id}</span>
                <span style={{ fontSize: 13, color: DARK_TEXT }}>{inv.date}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{inv.amount}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 9999, background: "#dcfce7", color: GREEN }}>
                  {inv.status}
                </span>
                <button style={{ padding: "5px 10px", borderRadius: 6, border: `1px solid ${BORDER}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: MUTED }}>
                  <Download size={12} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── TAB CONTENT MAP ──────────────────────────────────────────────────────────
const TAB_CONTENT: Record<string, React.ReactNode> = {
  workspace:    <WorkspaceTab />,
  integrations: <IntegrationsTab />,
  users:        <UsersTab />,
  security:     <SecurityTab />,
  api:          <ApiTab />,
  billing:      <BillingTab />,
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("workspace");

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: 32 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Settings size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: DARK_TEXT }}>Settings & Governance</h1>
            <p style={{ margin: 0, fontSize: 13, color: MUTED }}>Manage workspace, integrations, users, security, and billing</p>
          </div>
        </div>
      </motion.div>

      {/* Tab Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        style={{
          display: "flex", gap: 4, marginBottom: 28,
          background: CARD, padding: 6, borderRadius: 12,
          border: `1px solid ${BORDER}`, width: "fit-content",
        }}
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 18px", borderRadius: 9,
                border: "none", cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500,
                background: active ? PRIMARY : "transparent",
                color: active ? "#fff" : MUTED,
                transition: "all 0.2s",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {TAB_CONTENT[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
