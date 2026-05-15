"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Save, Copy, Calendar, ChevronDown, ChevronUp,
  Clock, Zap, Globe, Mail, Share2, CheckCircle, XCircle,
  Bell, Database, FileText, Activity,
  Shield, GitBranch, Timer, Layers, X, Plus, DollarSign,
} from "lucide-react";

// ─── Brand Tokens ──────────────────────────────────────────────────────────────
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
const PURPLE    = "hsl(280,45%,40%)";

// ─── Node type config ──────────────────────────────────────────────────────────
const NODE_TYPES: Record<string, { color: string; label: string }> = {
  trigger:    { color: GREEN,   label: "Trigger"   },
  agent:      { color: PRIMARY, label: "Agent"     },
  action:     { color: BLUE,    label: "Action"    },
  condition:  { color: AMBER,   label: "Logic"     },
  delay:      { color: MUTED,   label: "Logic"     },
  monitoring: { color: PURPLE,  label: "Monitor"   },
};

// ─── Palette sections ──────────────────────────────────────────────────────────
const PALETTE_SECTIONS = [
  {
    title: "TRIGGERS", color: GREEN,
    items: [
      { id: "signal-trigger",   label: "Signal Trigger",   type: "trigger",    icon: Zap        },
      { id: "schedule-trigger", label: "Schedule Trigger", type: "trigger",    icon: Clock      },
      { id: "webhook-trigger",  label: "Webhook Trigger",  type: "trigger",    icon: Globe      },
    ],
  },
  {
    title: "AGENTS", color: PRIMARY,
    items: [
      { id: "content-agent",    label: "Content Agent",    type: "agent",      icon: FileText   },
      { id: "seo-agent",        label: "SEO Agent",        type: "agent",      icon: Activity   },
      { id: "email-agent",      label: "Email Agent",      type: "agent",      icon: Mail       },
      { id: "social-agent",     label: "Social Agent",     type: "agent",      icon: Share2     },
      { id: "budget-agent",     label: "Budget Agent",     type: "agent",      icon: DollarSign },
    ],
  },
  {
    title: "ACTIONS", color: BLUE,
    items: [
      { id: "publish-action",   label: "Publish Action",   type: "action",     icon: CheckCircle },
      { id: "crm-update",       label: "CRM Update",       type: "action",     icon: Database   },
      { id: "slack-notify",     label: "Slack Notify",     type: "action",     icon: Bell       },
      { id: "approval-gate",    label: "Approval Gate",    type: "action",     icon: Shield     },
    ],
  },
  {
    title: "LOGIC", color: AMBER,
    items: [
      { id: "condition",        label: "Condition",        type: "condition",  icon: GitBranch  },
      { id: "delay",            label: "Delay",            type: "delay",      icon: Timer      },
      { id: "split-test",       label: "Split Test",       type: "condition",  icon: Layers     },
    ],
  },
  {
    title: "MONITORING", color: PURPLE,
    items: [
      { id: "brand-guard",      label: "Brand Guard",      type: "monitoring", icon: Shield     },
      { id: "budget-check",     label: "Budget Check",     type: "monitoring", icon: DollarSign },
    ],
  },
];

// ─── Types ─────────────────────────────────────────────────────────────────────
type WfNode = {
  id: string; label: string; subLabel?: string; type: string;
  x: number; y: number; icon: React.ElementType;
};
type WfEdge = { from: string; to: string; label?: string };
type LogRow  = { time: string; node: string; action: string; status: "pass" | "fail"; duration: string };
type WorkflowTemplate = { name: string; nodes: WfNode[]; edges: WfEdge[]; logRows: LogRow[] };

// ─── Workflow data ─────────────────────────────────────────────────────────────
const WORKFLOWS: Record<string, WorkflowTemplate> = {
  "Daily Publishing": {
    name: "Daily Publishing",
    nodes: [
      { id: "n1", label: "Schedule Trigger", subLabel: "6:00 AM Daily",      type: "trigger",    x: 30,   y: 200, icon: Clock       },
      { id: "n2", label: "Content Agent",    subLabel: "Draft Content",       type: "agent",      x: 210,  y: 200, icon: FileText    },
      { id: "n3", label: "Brand Guard",      subLabel: "Brand Check",         type: "monitoring", x: 390,  y: 200, icon: Shield      },
      { id: "n4", label: "Condition",        subLabel: "Approved?",           type: "condition",  x: 570,  y: 200, icon: GitBranch   },
      { id: "n5", label: "Publish Action",   subLabel: "Publish Post",        type: "action",     x: 750,  y: 120, icon: CheckCircle },
      { id: "n6", label: "Approval Gate",    subLabel: "Request Approval",    type: "action",     x: 750,  y: 280, icon: Shield      },
      { id: "n7", label: "Social Agent",     subLabel: "Social Distribute",   type: "agent",      x: 930,  y: 120, icon: Share2      },
      { id: "n8", label: "Slack Notify",     subLabel: "Notify Team",         type: "action",     x: 1110, y: 120, icon: Bell        },
    ],
    edges: [
      { from: "n1", to: "n2" }, { from: "n2", to: "n3" }, { from: "n3", to: "n4" },
      { from: "n4", to: "n5", label: "YES" }, { from: "n4", to: "n6", label: "NO" },
      { from: "n5", to: "n7" }, { from: "n7", to: "n8" },
    ],
    logRows: [
      { time: "06:00:02", node: "Schedule Trigger", action: "Triggered",                         status: "pass", duration: "12ms"    },
      { time: "06:00:03", node: "Content Agent",    action: "Draft generated (847 words)",        status: "pass", duration: "1,240ms" },
      { time: "06:00:04", node: "Brand Guard",      action: "Approved (score: 96%)",              status: "pass", duration: "380ms"   },
      { time: "06:00:04", node: "Condition",        action: "Result: YES",                        status: "pass", duration: "8ms"     },
      { time: "06:00:05", node: "Publish Action",   action: "Published to LinkedIn, Twitter",    status: "pass", duration: "892ms"   },
    ],
  },
  "Campaign Launch": {
    name: "Campaign Launch",
    nodes: [
      { id: "n1", label: "Signal Trigger",  subLabel: "Campaign Approved",   type: "trigger",    x: 30,   y: 200, icon: Zap         },
      { id: "n2", label: "Content Agent",   subLabel: "Create Assets",       type: "agent",      x: 210,  y: 120, icon: FileText    },
      { id: "n3", label: "SEO Agent",       subLabel: "SEO Brief",           type: "agent",      x: 210,  y: 280, icon: Activity    },
      { id: "n4", label: "Brand Guard",     subLabel: "Brand Review",        type: "monitoring", x: 390,  y: 200, icon: Shield      },
      { id: "n5", label: "Approval Gate",   subLabel: "CMO Approval",        type: "action",     x: 570,  y: 200, icon: Shield      },
      { id: "n6", label: "Email Agent",     subLabel: "Launch Sequence",     type: "agent",      x: 750,  y: 120, icon: Mail        },
      { id: "n7", label: "Social Agent",    subLabel: "Social Posts",        type: "agent",      x: 750,  y: 280, icon: Share2      },
      { id: "n8", label: "CRM Update",      subLabel: "Update HubSpot",      type: "action",     x: 930,  y: 200, icon: Database    },
      { id: "n9", label: "Analytics Agent", subLabel: "Track Results",       type: "agent",      x: 1110, y: 200, icon: Activity    },
    ],
    edges: [
      { from: "n1", to: "n2" }, { from: "n1", to: "n3" },
      { from: "n2", to: "n4" }, { from: "n3", to: "n4" },
      { from: "n4", to: "n5" }, { from: "n5", to: "n6" }, { from: "n5", to: "n7" },
      { from: "n6", to: "n8" }, { from: "n7", to: "n8" }, { from: "n8", to: "n9" },
    ],
    logRows: [
      { time: "09:00:00", node: "Signal Trigger", action: "Campaign kick-off signal received",   status: "pass", duration: "5ms"    },
      { time: "09:00:02", node: "Content Agent",  action: "Creative assets generated",           status: "pass", duration: "2,100ms" },
      { time: "09:00:03", node: "SEO Agent",      action: "47 keywords identified & planned",    status: "pass", duration: "890ms"  },
      { time: "09:00:05", node: "Brand Guard",    action: "Brand review passed (score: 94%)",    status: "pass", duration: "420ms"  },
      { time: "09:00:07", node: "Approval Gate",  action: "CMO approved — campaign live",        status: "pass", duration: "18ms"   },
    ],
  },
  "Crisis Response": {
    name: "Crisis Response",
    nodes: [
      { id: "n1", label: "Signal Trigger", subLabel: "Crisis Detected",      type: "trigger",    x: 30,   y: 200, icon: Globe       },
      { id: "n2", label: "Condition",      subLabel: "Severity?",            type: "condition",  x: 210,  y: 200, icon: GitBranch   },
      { id: "n3", label: "Slack Notify",   subLabel: "Alert CMO",            type: "action",     x: 390,  y: 120, icon: Bell        },
      { id: "n4", label: "Content Agent",  subLabel: "Draft Response",       type: "agent",      x: 390,  y: 280, icon: FileText    },
      { id: "n5", label: "Approval Gate",  subLabel: "CMO Review",           type: "action",     x: 570,  y: 120, icon: Shield      },
      { id: "n6", label: "Publish Action", subLabel: "Publish Response",     type: "action",     x: 750,  y: 120, icon: CheckCircle },
      { id: "n7", label: "CRM Update",     subLabel: "Log Incident",         type: "action",     x: 750,  y: 280, icon: Database    },
    ],
    edges: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3", label: "HIGH" }, { from: "n2", to: "n4", label: "LOW" },
      { from: "n3", to: "n5" }, { from: "n5", to: "n6" }, { from: "n4", to: "n7" },
    ],
    logRows: [
      { time: "14:22:01", node: "Signal Trigger", action: "Negative sentiment spike detected",   status: "pass", duration: "8ms"    },
      { time: "14:22:02", node: "Condition",      action: "Severity: HIGH — CMO path routed",   status: "fail", duration: "14ms"   },
      { time: "14:22:03", node: "Slack Notify",   action: "CMO alerted via Slack #crisis",      status: "pass", duration: "210ms"  },
      { time: "14:22:10", node: "Approval Gate",  action: "Awaiting CMO sign-off…",             status: "pass", duration: "—"      },
      { time: "14:22:45", node: "Publish Action", action: "Crisis statement published",         status: "pass", duration: "634ms"  },
    ],
  },
  "Lead Nurture": {
    name: "Lead Nurture",
    nodes: [
      { id: "n1", label: "Webhook Trigger", subLabel: "New MQL",             type: "trigger",   x: 30,   y: 200, icon: Globe      },
      { id: "n2", label: "Lead Scorer",     subLabel: "Score Lead",          type: "agent",     x: 210,  y: 200, icon: Activity   },
      { id: "n3", label: "Condition",       subLabel: "Score >70?",          type: "condition", x: 390,  y: 200, icon: GitBranch  },
      { id: "n4", label: "Email Agent",     subLabel: "BFSI Sequence",       type: "agent",     x: 570,  y: 120, icon: Mail       },
      { id: "n5", label: "Email Agent",     subLabel: "General Nurture",     type: "agent",     x: 570,  y: 280, icon: Mail       },
      { id: "n6", label: "Delay",           subLabel: "Wait 3 Days",         type: "delay",     x: 750,  y: 120, icon: Timer      },
      { id: "n7", label: "Condition",       subLabel: "Engaged?",            type: "condition", x: 930,  y: 120, icon: GitBranch  },
      { id: "n8", label: "CRM Update",      subLabel: "Update Stage",        type: "action",    x: 1110, y: 120, icon: Database   },
    ],
    edges: [
      { from: "n1", to: "n2" }, { from: "n2", to: "n3" },
      { from: "n3", to: "n4", label: "YES" }, { from: "n3", to: "n5", label: "NO" },
      { from: "n4", to: "n6" }, { from: "n6", to: "n7" },
      { from: "n7", to: "n8", label: "YES" },
    ],
    logRows: [
      { time: "10:05:00", node: "Webhook Trigger", action: "New lead: alex@enterprise.io",      status: "pass", duration: "6ms"    },
      { time: "10:05:01", node: "Lead Scorer",     action: "Lead scored: 84 / 100",             status: "pass", duration: "340ms"  },
      { time: "10:05:01", node: "Condition",        action: "Score >70 → BFSI path",           status: "pass", duration: "9ms"    },
      { time: "10:05:02", node: "Email Agent",     action: "BFSI sequence email sent",          status: "pass", duration: "720ms"  },
      { time: "10:05:02", node: "Delay",           action: "Waiting 3 days before follow-up",  status: "pass", duration: "—"      },
    ],
  },
};

const TEMPLATE_NAMES = Object.keys(WORKFLOWS);

// ─── Node dimensions ───────────────────────────────────────────────────────────
const NODE_W = 140;
const NODE_H = 64;

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }}
      style={{ position: "fixed", top: 72, left: "50%", background: DARK_TEXT, color: "white", padding: "12px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 9999, boxShadow: "0 6px 24px rgba(0,0,0,0.28)", whiteSpace: "nowrap", border: `1.5px solid ${BORDER}` }}
    >{msg}</motion.div>
  );
}

// ─── Node Config Panel ─────────────────────────────────────────────────────────
function NodeConfigPanel({ node, onClose, showToast }: { node: WfNode; onClose: () => void; showToast: (m: string) => void }) {
  const [name, setName]   = useState(node.label);
  const [saving, setSaving] = useState(false);
  const typeInfo = NODE_TYPES[node.type] ?? NODE_TYPES.action;
  const Icon = node.icon;

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); showToast("Node updated."); }, 800);
  };

  return (
    <motion.div
      key={node.id}
      initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 60, opacity: 0 }}
      style={{ width: 288, background: CARD, borderLeft: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}
    >
      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: typeInfo.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <Icon size={16} color={typeInfo.color} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: typeInfo.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{typeInfo.label}</span>
          <p style={{ fontSize: 14, fontWeight: 700, color: DARK_TEXT, margin: "2px 0 0" }}>{node.label}</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 2, marginTop: 2 }}><X size={15} /></button>
      </div>

      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Node Name */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Node Name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: DARK_TEXT, outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* Trigger fields */}
        {node.type === "trigger" && (<>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Cron Expression</label>
            <input defaultValue="0 6 * * *"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 12, fontFamily: "monospace", color: DARK_TEXT, outline: "none", boxSizing: "border-box" }} />
            <p style={{ fontSize: 11, color: MUTED, marginTop: 4, marginBottom: 0 }}>Every day at 6:00 AM</p>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Timezone</label>
            <select style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: DARK_TEXT, outline: "none", boxSizing: "border-box" }}>
              <option>UTC</option><option>America/New_York</option><option>Asia/Kolkata</option><option>Europe/London</option>
            </select>
          </div>
        </>)}

        {/* Agent fields */}
        {node.type === "agent" && (<>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Model</label>
            <select style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: DARK_TEXT, outline: "none", boxSizing: "border-box" }}>
              <option>claude-sonnet-4-6</option><option>claude-opus-4-7</option><option>Lyzr Default</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Temperature — <span style={{ color: MUTED }}>0.7</span></label>
            <input type="range" min={0} max={1} step={0.1} defaultValue={0.7}
              style={{ width: "100%", accentColor: PRIMARY }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: MUTED, marginTop: 2 }}>
              <span>Precise</span><span>Creative</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Max Tokens</label>
            <input type="number" defaultValue={2048}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: DARK_TEXT, outline: "none", boxSizing: "border-box" }} />
          </div>
        </>)}

        {/* Condition fields */}
        {node.type === "condition" && (<>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Field</label>
            <input defaultValue="brand_score" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: DARK_TEXT, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Operator</label>
            <select style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: DARK_TEXT, outline: "none", boxSizing: "border-box" }}>
              <option>equals</option><option>contains</option><option>greater than</option><option>less than</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Value</label>
            <input defaultValue="80" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: DARK_TEXT, outline: "none", boxSizing: "border-box" }} />
          </div>
        </>)}

        {/* Delay fields */}
        {node.type === "delay" && (<>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Duration</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" defaultValue={3} style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: DARK_TEXT, outline: "none" }} />
              <select style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: DARK_TEXT, outline: "none" }}>
                <option>hours</option><option>days</option><option>minutes</option>
              </select>
            </div>
          </div>
        </>)}

        {/* Action fields */}
        {node.type === "action" && (<>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Target</label>
            <input defaultValue={node.label.includes("Slack") ? "#content-ops" : "linkedin,twitter"} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: DARK_TEXT, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Template</label>
            <select style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: DARK_TEXT, outline: "none", boxSizing: "border-box" }}>
              <option>Default</option><option>Blog Post</option><option>Social Caption</option><option>Newsletter</option>
            </select>
          </div>
        </>)}

        {/* Monitoring fields */}
        {node.type === "monitoring" && (<>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, display: "block", marginBottom: 6 }}>Alert Threshold</label>
            <input defaultValue="brand_score < 80" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 13, color: DARK_TEXT, outline: "none", boxSizing: "border-box" }} />
          </div>
        </>)}
      </div>

      <div style={{ padding: 16, borderTop: `1px solid ${BORDER}` }}>
        <button onClick={handleSave} disabled={saving}
          style={{ width: "100%", padding: "10px", borderRadius: 8, background: saving ? MUTED : PRIMARY, color: "white", fontWeight: 700, fontSize: 13, border: "none", cursor: saving ? "default" : "pointer", transition: "background 0.2s" }}>
          {saving ? "Saving…" : "Save Node"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Canvas Component ──────────────────────────────────────────────────────────
function WorkflowCanvas({
  template, selectedId, onSelect, runningIdx,
}: {
  template: WorkflowTemplate; selectedId: string | null;
  onSelect: (id: string) => void; runningIdx: number;
}) {
  const { nodes, edges } = template;
  const orderedIds = nodes.map(n => n.id);
  const canvasW = Math.max(...nodes.map(n => n.x + NODE_W + 100), 1000);
  const canvasH = Math.max(...nodes.map(n => n.y + NODE_H + 100), 420);

  function pathD(fromId: string, toId: string) {
    const from = nodes.find(n => n.id === fromId);
    const to   = nodes.find(n => n.id === toId);
    if (!from || !to) return "";
    const x1 = from.x + NODE_W, y1 = from.y + NODE_H / 2;
    const x2 = to.x,            y2 = to.y + NODE_H / 2;
    const cx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
  }

  function edgeMidpoint(fromId: string, toId: string) {
    const from = nodes.find(n => n.id === fromId);
    const to   = nodes.find(n => n.id === toId);
    if (!from || !to) return { x: 0, y: 0 };
    return {
      x: (from.x + NODE_W + to.x) / 2,
      y: (from.y + NODE_H / 2 + to.y + NODE_H / 2) / 2 - 8,
    };
  }

  return (
    <div style={{ position: "relative", width: canvasW, height: canvasH }}>
      {/* Zoom badge */}
      <div style={{ position: "absolute", top: 8, right: 8, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: MUTED, zIndex: 10 }}>
        100%
      </div>

      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }} width={canvasW} height={canvasH}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={BORDER} />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const mid = edgeMidpoint(e.from, e.to);
          return (
            <g key={i}>
              <path d={pathD(e.from, e.to)} fill="none" stroke={BORDER} strokeWidth={2} markerEnd="url(#arrowhead)" />
              {e.label && (
                <text x={mid.x} y={mid.y} textAnchor="middle" fontSize={10} fill={MUTED} fontWeight={700}
                  style={{ background: "white" }}>{e.label}</text>
              )}
            </g>
          );
        })}
      </svg>

      {nodes.map((node, idx) => {
        const typeInfo = NODE_TYPES[node.type] ?? NODE_TYPES.action;
        const isSelected = selectedId === node.id;
        const isActive   = runningIdx > 0 && orderedIds.indexOf(node.id) < runningIdx;
        const Icon = node.icon;
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.06 }}
            onClick={() => onSelect(node.id)}
            style={{
              position: "absolute", left: node.x, top: node.y,
              width: NODE_W, minHeight: NODE_H,
              background: CARD, borderRadius: 10, overflow: "hidden",
              border: isSelected
                ? `2px solid ${PRIMARY}`
                : `1.5px solid ${isActive ? typeInfo.color : BORDER}`,
              boxShadow: isSelected
                ? `0 0 0 3px ${PRIMARY}28`
                : isActive ? `0 0 14px ${typeInfo.color}60` : "0 1px 4px rgba(0,0,0,0.08)",
              cursor: "pointer",
              transition: "border 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ height: 4, background: isActive ? typeInfo.color : typeInfo.color + "70", transition: "background 0.3s", borderRadius: "10px 10px 0 0" }} />
            <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: typeInfo.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={14} color={typeInfo.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: MUTED, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{typeInfo.label}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: DARK_TEXT, margin: "2px 0 0", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.label}</p>
                {node.subLabel && <p style={{ fontSize: 10, color: MUTED, margin: "1px 0 0" }}>{node.subLabel}</p>}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function WorkflowsPage() {
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATE_NAMES[0]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showLogs, setShowLogs]             = useState(false);
  const [running, setRunning]               = useState(false);
  const [runningIdx, setRunningIdx]         = useState(0);
  const [toast, setToast]                   = useState<string | null>(null);

  const template     = WORKFLOWS[activeTemplate];
  const selectedNode = template.nodes.find(n => n.id === selectedNodeId) ?? null;

  const showToast = (msg: string) => setToast(msg);

  const handleRun = async () => {
    if (running) return;
    setRunning(true); setRunningIdx(0);
    for (let i = 1; i <= template.nodes.length; i++) {
      await new Promise(r => setTimeout(r, 420));
      setRunningIdx(i);
    }
    await new Promise(r => setTimeout(r, 500));
    setRunning(false);
    showToast(
      activeTemplate === "Daily Publishing" ? "✓ Workflow complete — 4 posts published, 0 errors"
      : activeTemplate === "Campaign Launch"  ? "✓ Campaign launched — 3 channels live, budget OK"
      : activeTemplate === "Crisis Response"  ? "✓ Crisis response initiated — exec notified"
      : "✓ Lead nurture sequence started — 3,200 contacts enrolled"
    );
  };

  const switchTemplate = (t: string) => {
    setActiveTemplate(t); setSelectedNodeId(null); setRunningIdx(0);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: PAGE_BG, overflow: "hidden", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key={toast} msg={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>

      {/* Page Header */}
      <div style={{ padding: "14px 20px", background: CARD, borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>Marketing Workflows</h1>
            <p style={{ fontSize: 11, color: MUTED, margin: "2px 0 0" }}>Visual automation builder — powered by Lyzr AgenticOS</p>
          </div>

          {/* Template selector tabs */}
          <div style={{ display: "flex", gap: 2, background: PAGE_BG, borderRadius: 10, padding: 4, flexShrink: 0 }}>
            {TEMPLATE_NAMES.map(t => (
              <button key={t} onClick={() => switchTemplate(t)}
                style={{ padding: "6px 11px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: activeTemplate === t ? PRIMARY : "transparent", color: activeTemplate === t ? "white" : MUTED, transition: "all 0.15s", whiteSpace: "nowrap" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button onClick={handleRun} disabled={running}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "none", cursor: running ? "default" : "pointer", background: running ? GREEN : PRIMARY, color: "white", fontWeight: 700, fontSize: 12, transition: "background 0.2s", opacity: running ? 0.85 : 1 }}>
              {running ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "flex" }}>
                  <Play size={13} />
                </motion.span>
              ) : <Play size={13} />}
              {running ? "Running…" : "▶ Run"}
            </button>
            {([
              { icon: Save,     label: "💾 Save",      msg: "Workflow saved successfully."  },
              { icon: Copy,     label: "⊕ Duplicate",  msg: "Workflow duplicated."          },
              { icon: Calendar, label: "🗓 Schedule",   msg: "Workflow scheduler opened."   },
            ] as const).map(btn => (
              <button key={btn.label} onClick={() => showToast(btn.msg)}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 11px", borderRadius: 8, border: `1px solid ${BORDER}`, cursor: "pointer", background: CARD, color: DARK_TEXT, fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body — 3 panel */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* LEFT: Node Palette */}
        <div style={{ width: 208, background: CARD, borderRight: `1px solid ${BORDER}`, overflowY: "auto", flexShrink: 0, padding: "12px 0" }}>
          {PALETTE_SECTIONS.map(section => (
            <div key={section.title} style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: section.color, letterSpacing: "0.09em", padding: "0 12px 6px", margin: 0 }}>{section.title}</p>
              <p style={{ fontSize: 9, color: MUTED, padding: "0 12px 6px", margin: "-4px 0 2px", letterSpacing: "0.03em" }}>(click to add)</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 8px" }}>
                {section.items.map(item => {
                  const Icon = item.icon;
                  const tc   = NODE_TYPES[item.type];
                  return (
                    <button key={item.id}
                      onClick={() => showToast(`${item.label} added to canvas`)}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", cursor: "pointer", textAlign: "left" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = tc.color; (e.currentTarget as HTMLElement).style.background = tc.color + "0c"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER;   (e.currentTarget as HTMLElement).style.background = "white"; }}
                    >
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: tc.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, flex: 1 }}>{item.label}</span>
                      <Plus size={11} color={MUTED} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CENTER: Canvas + Logs */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflow: "auto", backgroundImage: `radial-gradient(circle, ${BORDER} 1px, transparent 1px)`, backgroundSize: "24px 24px", backgroundColor: PAGE_BG, padding: 40 }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTemplate} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <WorkflowCanvas
                  template={template}
                  selectedId={selectedNodeId}
                  onSelect={id => setSelectedNodeId(prev => prev === id ? null : id)}
                  runningIdx={runningIdx}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Execution Logs */}
          <div style={{ background: CARD, borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <button onClick={() => setShowLogs(p => !p)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "none", border: "none", cursor: "pointer", width: "100%", color: DARK_TEXT, fontSize: 12, fontWeight: 600 }}>
              {showLogs ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              {showLogs ? "Hide Logs ▲" : "Show Execution Logs ▼"}
              <span style={{ fontSize: 11, color: MUTED, fontWeight: 400 }}>— {template.logRows.length} entries</span>
            </button>
            <AnimatePresence>
              {showLogs && (
                <motion.div initial={{ height: 0 }} animate={{ height: 200 }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
                  <div style={{ height: 200, overflowY: "auto", borderTop: `1px solid ${BORDER}` }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: PAGE_BG }}>
                          {["Time", "Node", "Action", "Status", "Duration"].map(h => (
                            <th key={h} style={{ padding: "7px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.05em", borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {template.logRows.map((row, i) => (
                          <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                            <td style={{ padding: "7px 16px", color: MUTED, fontFamily: "monospace", fontSize: 11, whiteSpace: "nowrap" }}>{row.time}</td>
                            <td style={{ padding: "7px 16px", color: DARK_TEXT, fontWeight: 600, whiteSpace: "nowrap" }}>{row.node}</td>
                            <td style={{ padding: "7px 16px", color: DARK_TEXT }}>{row.action}</td>
                            <td style={{ padding: "7px 16px" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: row.status === "pass" ? GREEN + "18" : RED + "18", color: row.status === "pass" ? GREEN : RED }}>
                                {row.status === "pass" ? <CheckCircle size={9} /> : <XCircle size={9} />}
                                {row.status === "pass" ? "✓ Pass" : "✗ Fail"}
                              </span>
                            </td>
                            <td style={{ padding: "7px 16px", color: MUTED, fontFamily: "monospace", fontSize: 11 }}>{row.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Node config */}
        <AnimatePresence>
          {selectedNode && (
            <NodeConfigPanel
              key={selectedNode.id}
              node={selectedNode}
              onClose={() => setSelectedNodeId(null)}
              showToast={showToast}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
