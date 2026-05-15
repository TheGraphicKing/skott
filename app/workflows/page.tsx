"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Save, Clock, Zap, Globe, Mail, Share2, CheckCircle,
  Bell, Database, FileText, Activity,
  Shield, GitBranch, Timer, Layers, X, Plus, DollarSign,
  LayoutTemplate, History, Search, Eye,
  RotateCcw, MonitorPlay, BarChart3,
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
const PURPLE    = "hsl(280,45%,40%)";

const NODE_TYPES: Record<string, { color: string; label: string }> = {
  trigger:    { color: GREEN,   label: "Trigger"   },
  agent:      { color: PRIMARY, label: "Agent"     },
  action:     { color: BLUE,    label: "Action"    },
  condition:  { color: AMBER,   label: "Logic"     },
  delay:      { color: MUTED,   label: "Logic"     },
  monitoring: { color: PURPLE,  label: "Monitor"   },
};

const PALETTE_SECTIONS = [
  { title: "TRIGGERS", color: GREEN, items: [
    { id: "signal-trigger",   label: "Signal Trigger",   type: "trigger",    icon: Zap        },
    { id: "schedule-trigger", label: "Schedule Trigger", type: "trigger",    icon: Clock      },
    { id: "webhook-trigger",  label: "Webhook Trigger",  type: "trigger",    icon: Globe      },
  ]},
  { title: "AGENTS", color: PRIMARY, items: [
    { id: "content-agent",    label: "Content Agent",    type: "agent",      icon: FileText   },
    { id: "seo-agent",        label: "SEO Agent",        type: "agent",      icon: Activity   },
    { id: "email-agent",      label: "Email Agent",      type: "agent",      icon: Mail       },
    { id: "social-agent",     label: "Social Agent",     type: "agent",      icon: Share2     },
    { id: "budget-agent",     label: "Budget Agent",     type: "agent",      icon: DollarSign },
  ]},
  { title: "ACTIONS", color: BLUE, items: [
    { id: "publish-action",   label: "Publish Action",   type: "action",     icon: CheckCircle },
    { id: "crm-update",       label: "CRM Update",       type: "action",     icon: Database   },
    { id: "slack-notify",     label: "Slack Notify",     type: "action",     icon: Bell       },
    { id: "email-send",       label: "Send Email",       type: "action",     icon: Mail       },
  ]},
  { title: "LOGIC", color: AMBER, items: [
    { id: "if-condition",     label: "If / Else",        type: "condition",  icon: GitBranch  },
    { id: "delay-node",       label: "Delay",            type: "delay",      icon: Timer      },
    { id: "merge-node",       label: "Merge",            type: "condition",  icon: Layers     },
  ]},
  { title: "MONITORING", color: PURPLE, items: [
    { id: "compliance-check", label: "Compliance",       type: "monitoring", icon: Shield     },
    { id: "analytics-node",   label: "Analytics",        type: "monitoring", icon: BarChart3  },
  ]},
];

interface FlowNode {
  id: string; label: string; type: string;
  x: number; y: number; connected: string[];
}

const STARTER_NODES: FlowNode[] = [
  { id: "n1", label: "Signal Trigger", type: "trigger", x: 60,  y: 160, connected: ["n2"] },
  { id: "n2", label: "Content Agent",  type: "agent",   x: 260, y: 160, connected: ["n3"] },
  { id: "n3", label: "SEO Agent",      type: "agent",   x: 460, y: 160, connected: ["n4"] },
  { id: "n4", label: "Publish Action", type: "action",  x: 660, y: 160, connected: []     },
];

const TEMPLATES = [
  { id: 1, name: "Blog-to-Social Syndication",  category: "Content",  trigger: "New Blog Post",      steps: ["SEO Agent", "Social Agent", "Publish to 4 channels"] },
  { id: 2, name: "Lead Scoring Automation",      category: "Lead Gen", trigger: "Form Fill",          steps: ["CRM Update", "Score Agent", "Slack Alert"] },
  { id: 3, name: "Weekly Performance Report",   category: "Analytics",trigger: "Schedule (Mon 9AM)", steps: ["Data Agent", "Report Agent", "Email Board"] },
  { id: 4, name: "Competitive Intel Monitor",   category: "Analytics",trigger: "Signal Trigger",     steps: ["Intel Agent", "Slack Alert", "Archive"] },
  { id: 5, name: "Email Nurture Sequence",       category: "Email",    trigger: "Lead Created",       steps: ["Segment Agent", "Email Agent (5-step)", "Log"] },
  { id: 6, name: "Social Listening & Response", category: "Social",   trigger: "Mention Detected",   steps: ["Sentiment Agent", "Reply Agent", "Log"] },
  { id: 7, name: "Content Performance Review",  category: "Content",  trigger: "Schedule (Weekly)",  steps: ["Analytics Agent", "Content Agent", "Recommendation Report"] },
  { id: 8, name: "Budget Reallocation Alert",   category: "Analytics",trigger: "Budget Threshold",   steps: ["Finance Alert", "Threshold Check", "CMO Approval"] },
];

const CAT_COLORS: Record<string, string> = {
  Content: BLUE, "Lead Gen": GREEN, Analytics: AMBER, Email: PRIMARY, Social: PURPLE,
};

const ACTIVE_INIT = [
  { id: 1, name: "Blog Syndication Agent", status: "Active",    lastRun: "2 min ago",    runsToday: 12,  rate: 98.3 },
  { id: 2, name: "Lead Scoring Pipeline",  status: "Active",    lastRun: "8 min ago",    runsToday: 47,  rate: 99.1 },
  { id: 3, name: "Weekly Board Report",    status: "Scheduled", lastRun: "Tomorrow 9AM", runsToday: 0,   rate: 100  },
  { id: 4, name: "Competitive Monitor",    status: "Active",    lastRun: "34 sec ago",   runsToday: 203, rate: 97.6 },
  { id: 5, name: "Email Nurture Flow",     status: "Paused",    lastRun: "2 hours ago",  runsToday: 0,   rate: 95.2 },
];

const EXEC = [
  { id: 1,  wf: "Blog Syndication Agent", time: "14:32:10", dur: "8s",  ok: true  },
  { id: 2,  wf: "Lead Scoring Pipeline",  time: "14:28:44", dur: "12s", ok: true  },
  { id: 3,  wf: "Competitive Monitor",    time: "14:25:01", dur: "5s",  ok: true  },
  { id: 4,  wf: "Blog Syndication Agent", time: "14:20:15", dur: "9s",  ok: true  },
  { id: 5,  wf: "Lead Scoring Pipeline",  time: "14:17:33", dur: "N/A", ok: false, error: "CRM timeout" },
  { id: 6,  wf: "Email Nurture Flow",     time: "12:00:01", dur: "21s", ok: true  },
  { id: 7,  wf: "Competitive Monitor",    time: "11:55:10", dur: "6s",  ok: true  },
  { id: 8,  wf: "Blog Syndication Agent", time: "11:50:44", dur: "7s",  ok: true  },
  { id: 9,  wf: "Lead Scoring Pipeline",  time: "11:45:22", dur: "13s", ok: true  },
  { id: 10, wf: "Weekly Board Report",    time: "09:00:00", dur: "44s", ok: true  },
];

const LOGS: Record<number, string[]> = {
  5: [
    "14:17:33  [INFO]   Workflow started: Lead Scoring Pipeline",
    "14:17:34  [INFO]   Trigger received: Form submission #4821",
    "14:17:36  [WARN]   CRM connection attempt 1/3 failed (timeout)",
    "14:17:45  [ERROR]  CRM connection failed after 3 retries — workflow aborted",
  ],
};
const DEFAULT_LOGS = [
  "Workflow started successfully",
  "Trigger fired — processing input",
  "Agent completed task in under 10s",
  "Output published — workflow complete",
];

function BuilderTab({ showToast }: { showToast: (m: string) => void }) {
  const [nodes, setNodes] = useState<FlowNode[]>(STARTER_NODES);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runPct, setRunPct] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addNode = (item: { id: string; label: string; type: string }) => {
    const newNode: FlowNode = {
      id: `n${Date.now()}`, label: item.label, type: item.type,
      x: 60 + Math.random() * 400, y: 80 + Math.random() * 200, connected: [],
    };
    setNodes(p => [...p, newNode]);
  };

  const handleRun = () => {
    setRunning(true); setRunPct(0);
    intervalRef.current = setInterval(() => {
      setRunPct(p => {
        if (p >= 100) { clearInterval(intervalRef.current!); setRunning(false); showToast("Workflow executed successfully!"); return 0; }
        return p + 5;
      });
    }, 80);
  };

  return (
    <div className="flex gap-4" style={{ height: "calc(100vh - 200px)" }}>
      <div className="w-52 shrink-0 overflow-y-auto rounded-xl flex flex-col gap-3 p-3"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        {PALETTE_SECTIONS.map(sec => (
          <div key={sec.title}>
            <p className="text-[9px] font-bold tracking-widest mb-1.5 px-1" style={{ color: sec.color }}>{sec.title}</p>
            {sec.items.map(item => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => addNode(item)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-1 text-left"
                  style={{ background: "rgba(255,255,255,0.5)", border: `1px solid ${BORDER}` }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: NODE_TYPES[item.type].color }} />
                  <Icon size={12} style={{ color: MUTED }} />
                  <span className="text-xs" style={{ color: DARK_TEXT }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: MUTED }}>Untitled Workflow</span>
            <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: `${PRIMARY}15`, color: PRIMARY }}>Draft</span>
          </div>
          <div className="flex items-center gap-2">
            {running && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: `${GREEN}15` }}>
                <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                  <div className="h-full rounded-full" style={{ width: `${runPct}%`, background: GREEN }} />
                </div>
                <span className="text-xs font-medium" style={{ color: GREEN }}>{runPct}%</span>
              </div>
            )}
            <button onClick={() => showToast("Workflow saved!")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.6)", border: `1px solid ${BORDER}`, color: DARK_TEXT }}>
              <Save size={13} /> Save
            </button>
            <button onClick={handleRun} disabled={running}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: running ? BORDER : GREEN, color: "#fff", border: "none", opacity: running ? 0.7 : 1 }}>
              <Play size={13} /> {running ? "Running…" : "Run"}
            </button>
          </div>
        </div>
        <div className="flex-1 relative rounded-xl overflow-hidden"
          style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 23px,rgba(103,63,27,0.04) 24px),repeating-linear-gradient(90deg,transparent,transparent 23px,rgba(103,63,27,0.04) 24px)", border: `1px solid ${BORDER}` }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map(n => n.connected.map(tid => {
              const target = nodes.find(x => x.id === tid);
              if (!target) return null;
              const x1 = n.x + 100, y1 = n.y + 20, x2 = target.x, y2 = target.y + 20;
              return <path key={`${n.id}-${tid}`} d={`M ${x1} ${y1} C ${x1+60} ${y1}, ${x2-60} ${y2}, ${x2} ${y2}`} fill="none" stroke={BORDER} strokeWidth={2} />;
            }))}
          </svg>
          {nodes.map(node => {
            const cfg = NODE_TYPES[node.type];
            const isSel = selectedNode === node.id;
            return (
              <motion.div key={node.id} drag dragMomentum={false}
                onDragEnd={(_, info) => setNodes(p => p.map(n => n.id === node.id ? { ...n, x: Math.max(0, n.x + info.offset.x), y: Math.max(0, n.y + info.offset.y) } : n))}
                onClick={() => setSelectedNode(isSel ? null : node.id)}
                className="absolute cursor-grab active:cursor-grabbing select-none"
                style={{ left: node.x, top: node.y }}
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm"
                  style={{ background: isSel ? cfg.color : CARD, color: isSel ? "#fff" : DARK_TEXT, border: `2px solid ${isSel ? cfg.color : BORDER}`, minWidth: 100 }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: isSel ? "rgba(255,255,255,0.7)" : cfg.color }} />
                  {node.label}
                </div>
              </motion.div>
            );
          })}
          <button onClick={() => { setNodes(STARTER_NODES); setSelectedNode(null); }}
            className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(255,255,255,0.8)", border: `1px solid ${BORDER}`, color: MUTED }}>
            <RotateCcw size={11} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplatesTab({ showToast }: { showToast: (m: string) => void }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", "Content", "Lead Gen", "Analytics", "Social", "Email"];
  const filtered = TEMPLATES.filter(t => (cat === "All" || t.category === cat) && (!search || t.name.toLowerCase().includes(search.toLowerCase())));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates…"
            className="pl-9 pr-3 py-2 rounded-lg text-sm outline-none w-56"
            style={{ background: CARD, border: `1px solid ${BORDER}`, color: DARK_TEXT }} />
        </div>
        <div className="flex items-center gap-1.5">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: cat === c ? PRIMARY : CARD, color: cat === c ? "#fff" : DARK_TEXT, border: `1px solid ${cat === c ? PRIMARY : BORDER}` }}>{c}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="h-1" style={{ background: CAT_COLORS[t.category] || PRIMARY }} />
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold leading-snug" style={{ color: DARK_TEXT }}>{t.name}</h3>
                <span className="shrink-0 text-[10px] px-2 py-0.5 rounded font-medium"
                  style={{ background: `${CAT_COLORS[t.category] || PRIMARY}18`, color: CAT_COLORS[t.category] || PRIMARY }}>{t.category}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}30` }}>
                <Zap size={10} style={{ color: GREEN }} />
                <span className="text-xs" style={{ color: DARK_TEXT }}>{t.trigger}</span>
              </div>
              <div className="flex flex-col gap-1">
                {t.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                      style={{ background: PRIMARY, color: "#fff" }}>{i + 1}</span>
                    <span className="text-xs" style={{ color: DARK_TEXT }}>{s}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => showToast("Template loaded into editor!")}
                className="w-full py-2 rounded-lg text-xs font-semibold"
                style={{ background: PRIMARY, color: "#fff", border: "none" }}>Use Template</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ActiveWorkflowsTab({ showToast }: { showToast: (m: string) => void }) {
  const [workflows, setWorkflows] = useState(ACTIVE_INIT);
  const toggle = (id: number) => {
    setWorkflows(p => p.map(w => {
      if (w.id !== id) return w;
      const next = w.status === "Active" ? "Paused" : "Active";
      showToast(`${w.name} ${next === "Active" ? "resumed" : "paused"}`);
      return { ...w, status: next };
    }));
  };
  const dotColor = (s: string) => s === "Active" ? GREEN : s === "Paused" ? AMBER : BLUE;
  const rateColor = (r: number) => r >= 98 ? GREEN : r >= 95 ? AMBER : RED;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold" style={{ color: DARK_TEXT }}>Active Workflows</h2>
        <button onClick={() => showToast("Opening workflow builder…")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: PRIMARY, color: "#fff", border: "none" }}>
          <Plus size={13} /> New Workflow
        </button>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <table className="w-full text-sm">
          <thead><tr style={{ background: CARD, borderBottom: `1px solid ${BORDER}` }}>
            {["Workflow Name", "Status", "Last Run", "Runs Today", "Success Rate", "Actions"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {workflows.map((w, i) => (
              <tr key={w.id} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.5)" : CARD, borderBottom: `1px solid ${BORDER}` }}>
                <td className="px-4 py-3 font-medium" style={{ color: DARK_TEXT }}>{w.name}</td>
                <td className="px-4 py-3"><div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: dotColor(w.status) }} />
                  <span className="text-xs" style={{ color: DARK_TEXT }}>{w.status}</span>
                </div></td>
                <td className="px-4 py-3 text-xs" style={{ color: MUTED }}>{w.lastRun}</td>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: DARK_TEXT }}>{w.runsToday}</td>
                <td className="px-4 py-3"><span className="text-xs font-semibold" style={{ color: rateColor(w.rate) }}>{w.rate}%</span></td>
                <td className="px-4 py-3"><div className="flex items-center gap-1.5">
                  {w.status !== "Scheduled" && (
                    <button onClick={() => toggle(w.id)} className="px-2.5 py-1 rounded text-xs font-medium"
                      style={{ background: w.status === "Active" ? `${AMBER}15` : `${GREEN}15`, color: w.status === "Active" ? AMBER : GREEN, border: `1px solid ${w.status === "Active" ? AMBER : GREEN}35` }}>
                      {w.status === "Active" ? "Pause" : "Resume"}
                    </button>
                  )}
                  <button onClick={() => showToast(`Editing ${w.name}…`)} className="px-2.5 py-1 rounded text-xs font-medium"
                    style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30` }}>Edit</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExecutionHistoryTab() {
  const [logModal, setLogModal] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-3">
        {[{ label: "Total Runs", value: "847", color: BLUE }, { label: "Success Rate", value: "98.4%", color: GREEN }, { label: "Avg Duration", value: "13s", color: PRIMARY }, { label: "Failed Today", value: "1", color: RED }].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: DARK_TEXT }}>Recent Executions</h3>
        <div className="flex flex-col">
          {EXEC.map((e, i) => (
            <div key={e.id} className="flex items-start gap-3 relative">
              {i < EXEC.length - 1 && <div className="absolute left-[6px] top-4 w-0.5" style={{ height: "calc(100% - 4px)", background: BORDER }} />}
              <div className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 z-10" style={{ background: e.ok ? GREEN : RED }} />
              <div className="flex-1 flex items-center justify-between pb-4">
                <div>
                  <p className="text-sm font-medium" style={{ color: DARK_TEXT }}>{e.wf}{!e.ok && <span className="ml-2 text-xs font-normal" style={{ color: RED }}>— Failed ({e.error})</span>}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>{e.time} · {e.dur}</p>
                </div>
                <button onClick={() => setLogModal(e.id)} className="flex items-center gap-1 px-2.5 py-1 rounded text-xs"
                  style={{ background: `${BLUE}12`, color: BLUE, border: `1px solid ${BLUE}25` }}>
                  <Eye size={11} /> View Logs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {logModal !== null && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLogModal(null)}>
            <motion.div className="rounded-xl p-5 w-[500px] max-w-[90vw]" style={{ background: "#1a1a1a", border: "1px solid #333" }}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Execution Logs</h3>
                <button onClick={() => setLogModal(null)}><X size={16} color="#888" /></button>
              </div>
              <div className="flex flex-col gap-2">
                {(LOGS[logModal] || DEFAULT_LOGS).map((line, i) => (
                  <p key={i} className="text-xs font-mono" style={{ color: line.includes("ERROR") ? RED : line.includes("WARN") ? AMBER : "#a0a0a0" }}>{line}</p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type PageTab = "builder" | "templates" | "active" | "history";
const PAGE_TABS: { id: PageTab; label: string; icon: React.ElementType }[] = [
  { id: "builder",   label: "Builder",   icon: GitBranch     },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "active",    label: "Active",    icon: MonitorPlay    },
  { id: "history",   label: "History",   icon: History        },
];

export default function WorkflowsPage() {
  const [tab, setTab] = useState<PageTab>("builder");
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  return (
    <div className="min-h-screen p-6" style={{ background: PAGE_BG }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: DARK_TEXT }}>Workflow Automation</h1>
            <p className="text-sm mt-0.5" style={{ color: MUTED }}>Build, run, and monitor agentic workflows</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}30` }}>5 Active</span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${BLUE}15`, color: BLUE, border: `1px solid ${BLUE}30` }}>8 Templates</span>
          </div>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {PAGE_TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: tab === t.id ? PRIMARY : "transparent", color: tab === t.id ? "#fff" : DARK_TEXT }}>
                <Icon size={14} />{t.label}
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            {tab === "builder"   && <BuilderTab showToast={showToast} />}
            {tab === "templates" && <TemplatesTab showToast={showToast} />}
            {tab === "active"    && <ActiveWorkflowsTab showToast={showToast} />}
            {tab === "history"   && <ExecutionHistoryTab />}
          </motion.div>
        </AnimatePresence>
      </div>
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
