"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListChecks, Plus, CheckCircle, Clock, AlertCircle,
  TrendingUp, Users, Tag, Calendar, ChevronRight,
  Sparkles, ArrowRight, Star, Target, Zap, Filter,
  BarChart3, Globe, FileText, Edit,
} from "lucide-react";

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

// ─── Types ───────────────────────────────────────────────────────────────────
type Priority = "Critical" | "High" | "Medium" | "Low";
type Column   = "To Do" | "In Progress" | "Review" | "Done";

interface Task {
  id: number;
  title: string;
  campaign: string;
  campaignPath: string;
  due: string;
  priority: Priority;
  assignee: string;
  column: Column;
  overdue?: boolean;
  dueToday?: boolean;
  aiSuggested?: boolean;
  description?: string;
}

// ─── Task Data ────────────────────────────────────────────────────────────────
const initialTasks: Task[] = [
  // To Do
  { id: 1,  title: "Review Q2 Board Deck Draft",             campaign: "/dashboards",     campaignPath: "/dashboards",    due: "May 16", priority: "High",     assignee: "SC", column: "To Do",       aiSuggested: true,  description: "Review and provide feedback on the Q2 board deck. Focus on pipeline metrics, campaign ROI, and Q3 projections." },
  { id: 2,  title: "Update BFSI Landing Page",               campaign: "/seo",            campaignPath: "/seo",           due: "May 20", priority: "Medium",   assignee: "DK", column: "To Do",       description: "Refresh BFSI landing page copy with new Hitachi case study callouts and updated industry stats." },
  { id: 3,  title: "Brief Creative for LinkedIn Ads",        campaign: "/creative-hub",   campaignPath: "/creative-hub",  due: "May 17", priority: "High",     assignee: "EW", column: "To Do",       description: "Write creative brief for Q2 LinkedIn ad campaign targeting enterprise CMOs in BFSI and fintech." },
  { id: 4,  title: "Schedule social posts for week",         campaign: "/social",         campaignPath: "/social",        due: "May 19", priority: "Low",      assignee: "PS", column: "To Do",       description: "Schedule the weekly social calendar across LinkedIn, Twitter/X, and Instagram." },
  { id: 5,  title: "QA email nurture sequence",              campaign: "/email-crm",      campaignPath: "/email-crm",     due: "May 22", priority: "Medium",   assignee: "AK", column: "To Do",       description: "QA the 5-email BFSI nurture sequence — check personalization tokens, links, and unsubscribe flow." },
  // In Progress
  { id: 6,  title: "Write OGI Whitepaper Chapter 3",         campaign: "/content-studio", campaignPath: "/content-studio", due: "May 15", priority: "High",    assignee: "SC", column: "In Progress", overdue: true,      description: "Draft Chapter 3: 'OGI vs. Traditional Automation' — 2,000 words with supporting data and case examples." },
  { id: 7,  title: "Competitive battlecard update",          campaign: "/intelligence",   campaignPath: "/intelligence",  due: "May 18", priority: "Medium",   assignee: "RP", column: "In Progress", description: "Update competitive battlecards for Salesforce, HubSpot, and Marketo with latest pricing and feature data." },
  { id: 8,  title: "LinkedIn ABM campaign setup",            campaign: "/campaigns",      campaignPath: "/campaigns",     due: "May 15", priority: "Critical", assignee: "SC", column: "In Progress", overdue: true, aiSuggested: true, description: "Configure LinkedIn ABM campaign targeting the 50 key enterprise accounts identified by the intelligence team." },
  // Review
  { id: 9,  title: "BFSI Campaign creative assets",         campaign: "/creative-hub",   campaignPath: "/creative-hub",  due: "May 16", priority: "High",     assignee: "EW", column: "Review",      description: "Review final creative assets for the BFSI vertical launch — banner ads, landing page hero, and email header." },
  { id: 10, title: "Q2 pipeline report",                    campaign: "/analytics",      campaignPath: "/analytics",     due: "May 16", priority: "Medium",   assignee: "SC", column: "Review",      description: "Final review of Q2 pipeline report before distribution to CEO and Board." },
  // Done
  { id: 11, title: "Set up HubSpot nurture flow",           campaign: "/email-crm",      campaignPath: "/email-crm",     due: "May 10", priority: "Medium",   assignee: "AK", column: "Done",        description: "Completed HubSpot workflow automation for BFSI lead nurture sequence." },
  { id: 12, title: "Publish Hitachi case study",            campaign: "/content-studio", campaignPath: "/content-studio", due: "May 12", priority: "High",    assignee: "SC", column: "Done",        description: "Published the Hitachi ROI case study to website and distributed across all channels." },
  { id: 13, title: "Weekly performance report",             campaign: "/analytics",      campaignPath: "/analytics",     due: "May 13", priority: "Low",      assignee: "DK", column: "Done",        description: "Compiled and distributed weekly marketing performance report to all stakeholders." },
];

const COLUMNS: Column[] = ["To Do", "In Progress", "Review", "Done"];

const priorityConfig: Record<Priority, { bg: string; color: string; label: string }> = {
  Critical: { bg: RED + "18",   color: RED,    label: "Critical" },
  High:     { bg: AMBER + "18", color: AMBER,  label: "High"     },
  Medium:   { bg: BLUE + "18",  color: BLUE,   label: "Medium"   },
  Low:      { bg: BORDER,       color: MUTED,  label: "Low"      },
};

const columnConfig: Record<Column, { color: string; count: number }> = {
  "To Do":       { color: MUTED,  count: 8  },
  "In Progress": { color: BLUE,   count: 5  },
  "Review":      { color: AMBER,  count: 4  },
  "Done":        { color: GREEN,  count: 7  },
};

const sampleComments = [
  { author: "Raj Patel",  avatar: "RP", time: "2h ago",  text: "Checked the metrics — looks solid. Just need the Q3 forecast section to be updated with latest pipeline numbers." },
  { author: "Emily Walsh", avatar: "EW", time: "4h ago", text: "I'll have the creative assets ready by EOD tomorrow so this can go live on schedule." },
  { author: "Sarah Chen", avatar: "SC", time: "Yesterday", text: "Priority confirmed — this is blocking the board presentation. Let's get this done first thing tomorrow." },
];

export default function MyTasksPage() {
  const [tasks, setTasks]               = useState<Task[]>(initialTasks);
  const [aiMode, setAiMode]             = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask]           = useState({ title: "", campaign: "", due: "", priority: "Medium" as Priority, assignee: "" });

  const overdueCount   = tasks.filter(t => t.overdue).length;
  const dueTodayCount  = tasks.filter(t => t.dueToday).length;
  const completedCount = tasks.filter(t => t.column === "Done").length;

  const handleAddTask = () => {
    if (!newTask.title) return;
    const task: Task = { id: Date.now(), ...newTask, campaignPath: newTask.campaign, column: "To Do", description: "" };
    setTasks(t => [task, ...t]);
    setShowAddModal(false);
    setNewTask({ title: "", campaign: "", due: "", priority: "Medium", assignee: "" });
  };

  return (
    <div style={{ background: PAGE_BG, minHeight: "100vh", padding: "32px" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ListChecks size={20} style={{ color: PRIMARY }} />
              <span style={{ color: MUTED, fontSize: 13 }}>My Workspace</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: DARK_TEXT }}>My Tasks</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* AI Toggle */}
            <div className="flex items-center gap-2" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 14px" }}>
              <Sparkles size={14} style={{ color: aiMode ? PRIMARY : MUTED }} />
              <span style={{ fontSize: 13, color: aiMode ? DARK_TEXT : MUTED, fontWeight: aiMode ? 600 : 400 }}>AI Prioritization</span>
              <button onClick={() => setAiMode(m => !m)}
                style={{ width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer", position: "relative", background: aiMode ? PRIMARY : BORDER, transition: "all 0.2s" }}>
                <div style={{ position: "absolute", top: 2, left: aiMode ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </button>
            </div>
            <button onClick={() => setShowAddModal(true)} style={{ background: PRIMARY, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, border: "none" }}>
              <Plus size={14} /> Add Task
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: "Total Tasks",          value: tasks.length,    sub: "across all columns",  icon: ListChecks, color: PRIMARY },
            { label: "Due Today",            value: dueTodayCount + 3, sub: "3 require attention", icon: Clock,    color: AMBER   },
            { label: "Overdue",              value: overdueCount,    sub: "immediate action",     icon: AlertCircle, color: RED   },
            { label: "Completed This Week",  value: completedCount,  sub: "great progress",       icon: CheckCircle, color: GREEN },
          ].map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: CARD, border: `1px solid ${k.color === RED ? RED + "30" : BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 13, color: MUTED }}>{k.label}</span>
                <div style={{ background: k.color + "18", padding: 8, borderRadius: 8 }}>
                  <k.icon size={16} style={{ color: k.color }} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: k.color === RED ? RED : DARK_TEXT }}>{k.value}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{k.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Overdue Alert */}
        {overdueCount > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: RED + "10", border: `1px solid ${RED}30`, borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <AlertCircle size={16} style={{ color: RED }} />
            <span style={{ fontSize: 13, color: RED, fontWeight: 600 }}>{overdueCount} overdue tasks require attention</span>
            <button style={{ marginLeft: "auto", fontSize: 12, color: RED, background: "transparent", border: `1px solid ${RED}40`, padding: "3px 10px", borderRadius: 4, cursor: "pointer" }}>View All</button>
          </motion.div>
        )}
      </motion.div>

      {/* Kanban Board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.column === col);
          const cfg = columnConfig[col];
          return (
            <div key={col}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3" style={{ padding: "0 4px" }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 14, fontWeight: 700, color: DARK_TEXT }}>{col}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 12, background: cfg.color + "20", color: cfg.color }}>{colTasks.length}</span>
                </div>
                <Plus size={14} style={{ color: MUTED, cursor: "pointer" }} onClick={() => setShowAddModal(true)} />
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3">
                {colTasks.map((task, i) => {
                  const pc = priorityConfig[task.priority];
                  const dueColor = task.overdue ? RED : task.dueToday ? AMBER : MUTED;
                  return (
                    <motion.div key={task.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedTask(task)}
                      whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                      style={{
                        background: CARD,
                        border: `1px solid ${task.overdue ? RED + "40" : BORDER}`,
                        borderRadius: 10,
                        padding: 14,
                        cursor: "pointer",
                        transition: "box-shadow 0.2s",
                        position: "relative",
                        overflow: "hidden",
                      }}>
                      {/* Overdue left stripe */}
                      {task.overdue && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: RED }} />}

                      {/* AI Badge */}
                      {aiMode && task.aiSuggested && (
                        <div className="flex items-center gap-1 mb-2">
                          <Sparkles size={11} style={{ color: PRIMARY }} />
                          <span style={{ fontSize: 10, fontWeight: 600, color: PRIMARY }}>AI Suggested</span>
                        </div>
                      )}

                      {/* Title */}
                      <div style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT, lineHeight: 1.4, marginBottom: 10, paddingLeft: task.overdue ? 6 : 0 }}>
                        {task.title}
                      </div>

                      {/* Campaign Tag */}
                      <div className="flex items-center gap-1 mb-2">
                        <Tag size={10} style={{ color: MUTED }} />
                        <span style={{ fontSize: 11, color: MUTED, fontFamily: "monospace" }}>{task.campaign}</span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar size={11} style={{ color: dueColor }} />
                          <span style={{ fontSize: 11, color: dueColor, fontWeight: task.overdue || task.dueToday ? 700 : 400 }}>
                            {task.overdue ? "OVERDUE" : task.due}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 600, background: pc.bg, color: pc.color }}>{task.priority}</span>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: PRIMARY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>
                            {task.assignee}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Slide-out */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 40 }}
              onClick={() => setSelectedTask(null)} />
            <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 420, background: CARD, zIndex: 50, boxShadow: "-4px 0 30px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>

              {/* Panel Header */}
              <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, fontWeight: 600, ...priorityConfig[selectedTask.priority] }}>{selectedTask.priority}</span>
                  <button onClick={() => setSelectedTask(null)} style={{ background: "transparent", border: "none", color: MUTED, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>✕</button>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: DARK_TEXT, lineHeight: 1.3 }}>{selectedTask.title}</div>
              </div>

              {/* Panel Body */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
                {/* Meta Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  {[
                    { label: "Status", value: selectedTask.column },
                    { label: "Priority", value: selectedTask.priority },
                    { label: "Due Date", value: selectedTask.overdue ? "OVERDUE" : selectedTask.due },
                    { label: "Assignee", value: selectedTask.assignee },
                  ].map(m => (
                    <div key={m.label}>
                      <div style={{ fontSize: 11, color: MUTED, marginBottom: 3 }}>{m.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: m.label === "Due Date" && selectedTask.overdue ? RED : DARK_TEXT }}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Campaign */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Campaign / Area</div>
                  <div className="flex items-center gap-2">
                    <Tag size={12} style={{ color: PRIMARY }} />
                    <span style={{ fontSize: 13, color: PRIMARY, fontFamily: "monospace", fontWeight: 500 }}>{selectedTask.campaign}</span>
                  </div>
                </div>

                {/* Status Dropdown */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Move To</div>
                  <select defaultValue={selectedTask.column} onChange={e => {
                    setTasks(ts => ts.map(t => t.id === selectedTask.id ? { ...t, column: e.target.value as Column } : t));
                    setSelectedTask(s => s ? { ...s, column: e.target.value as Column } : null);
                  }}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT }}>
                    {COLUMNS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</div>
                  <div style={{ fontSize: 13, color: DARK_TEXT, lineHeight: 1.6, background: PAGE_BG, padding: 12, borderRadius: 7 }}>
                    {selectedTask.description || "No description yet."}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Comments</div>
                  <div className="flex flex-col gap-3">
                    {sampleComments.map((c, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                        style={{ display: "flex", gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: PRIMARY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                          {c.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT }}>{c.author}</span>
                            <span style={{ fontSize: 11, color: MUTED }}>{c.time}</span>
                          </div>
                          <div style={{ fontSize: 12, color: DARK_TEXT, lineHeight: 1.5 }}>{c.text}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {/* Comment input */}
                  <div className="flex gap-2 mt-4">
                    <input placeholder="Add a comment…" style={{ flex: 1, padding: "7px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 12, color: DARK_TEXT, outline: "none" }} />
                    <button style={{ padding: "7px 14px", borderRadius: 7, background: PRIMARY, color: "#fff", fontSize: 12, border: "none", cursor: "pointer" }}>Send</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: CARD, borderRadius: 14, padding: 28, width: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>Add New Task</h3>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>Title</label>
                <input value={newTask.title} onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))}
                  placeholder="e.g. Review Q3 campaign brief" style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT, outline: "none" }} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>Campaign / Area</label>
                <input value={newTask.campaign} onChange={e => setNewTask(t => ({ ...t, campaign: e.target.value }))}
                  placeholder="e.g. /campaigns" style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT, outline: "none", fontFamily: "monospace" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>Due Date</label>
                  <input type="date" value={newTask.due} onChange={e => setNewTask(t => ({ ...t, due: e.target.value }))}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask(t => ({ ...t, priority: e.target.value as Priority }))}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT }}>
                    <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>Assignee</label>
                  <input value={newTask.assignee} onChange={e => setNewTask(t => ({ ...t, assignee: e.target.value }))}
                    placeholder="Initials e.g. SC" style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT, outline: "none" }} />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleAddTask} style={{ flex: 1, padding: "10px", borderRadius: 8, background: PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none" }}>Add Task</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
