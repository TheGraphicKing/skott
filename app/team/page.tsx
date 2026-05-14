"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  MessageSquare,
  Eye,
  DollarSign,
  Calendar,
  Flag,
  User,
  MoreHorizontal,
  Circle,
  Zap,
  Coffee,
  Video,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";

// ─── Design tokens ────────────────────────────────────────────────────────────
const PRIMARY = "hsl(25,62%,25%)";
const MUTED = "hsl(25,20%,50%)";
const CARD = "hsl(36,30%,97%)";
const BORDER = "hsl(30,15%,87%)";
const GREEN = "hsl(142,55%,35%)";
const RED = "#dc2626";
const AMBER = "#d97706";
const BLUE = "#2563eb";
const DARK_TEXT = "#3a1f0e";
const PAGE_BG = "hsl(36,33%,94%)";

// ─── Sub-tabs ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "workspace", label: "Team Workspace", icon: Users },
  { id: "approvals", label: "Approvals", icon: CheckCircle },
  { id: "resources", label: "Resource Management", icon: DollarSign },
];

// ─── Sprint tasks ─────────────────────────────────────────────────────────────
type TaskStatus = "in-progress" | "review" | "done";
type Priority = "High" | "Medium" | "Low";

interface Task {
  id: string;
  title: string;
  assignee: string;
  due: string;
  priority: Priority;
  status: TaskStatus;
  pendingTime?: string;
}

const TASKS: Task[] = [
  // In Progress
  { id: "T01", title: "Q2 Enterprise campaign copy review", assignee: "Sarah M.", due: "Today", priority: "High", status: "in-progress" },
  { id: "T02", title: "EMEA LinkedIn ad creative set", assignee: "Priya K.", due: "Today", priority: "High", status: "in-progress" },
  { id: "T03", title: "SEO brief: AI marketing automation cluster", assignee: "Alex M.", due: "Tomorrow", priority: "Medium", status: "in-progress" },
  { id: "T04", title: "Webinar follow-up email sequence", assignee: "Ryan B.", due: "Tomorrow", priority: "Medium", status: "in-progress" },
  // Review
  { id: "T05", title: "LinkedIn ABM carousel (6 slides)", assignee: "Alex M.", due: "", priority: "High", status: "review", pendingTime: "2h" },
  { id: "T06", title: "G2 review email campaign", assignee: "Marcus R.", due: "", priority: "Medium", status: "review", pendingTime: "5h" },
  { id: "T07", title: "Q3 campaign strategy deck", assignee: "Sarah M.", due: "", priority: "High", status: "review", pendingTime: "1d" },
  // Done
  { id: "T08", title: "April performance report", assignee: "Tom O.", due: "", priority: "Medium", status: "done" },
  { id: "T09", title: "HubSpot workflow audit", assignee: "Marcus R.", due: "", priority: "Low", status: "done" },
  { id: "T10", title: "Brand refresh guidelines v2", assignee: "Mei C.", due: "", priority: "Medium", status: "done" },
  { id: "T11", title: "LinkedIn campaign UTM setup", assignee: "Priya K.", due: "", priority: "Low", status: "done" },
  { id: "T12", title: "Webinar reminder email #1 and #2", assignee: "Ryan B.", due: "", priority: "High", status: "done" },
];

// ─── Team members ─────────────────────────────────────────────────────────────
type MemberStatus = "Available" | "In Meeting" | "Focus Mode";

interface TeamMember {
  name: string;
  initials: string;
  role: string;
  active: number;
  total: number;
  status: MemberStatus;
  color: string;
  utilization: number;
}

const TEAM: TeamMember[] = [
  { name: "Sarah Mitchell", initials: "SM", role: "Sr. Campaign Manager", active: 4, total: 6, status: "Available", color: "#7c3aed", utilization: 80 },
  { name: "Alex Kumar", initials: "AK", role: "Content Strategist", active: 3, total: 5, status: "Focus Mode", color: "#2563eb", utilization: 65 },
  { name: "Priya Kapoor", initials: "PK", role: "Paid Media Lead", active: 5, total: 7, status: "Available", color: "#db2777", utilization: 90 },
  { name: "Marcus Rodriguez", initials: "MR", role: "Marketing Ops", active: 2, total: 4, status: "In Meeting", color: "#059669", utilization: 55 },
  { name: "Ryan Brown", initials: "RB", role: "Email Marketing", active: 3, total: 6, status: "Available", color: "#d97706", utilization: 60 },
  { name: "Jamie Lee", initials: "JL", role: "SEO Specialist", active: 4, total: 5, status: "Focus Mode", color: "#0891b2", utilization: 85 },
  { name: "Mei Chen", initials: "MC", role: "Brand Designer", active: 2, total: 3, status: "Available", color: "#dc2626", utilization: 72 },
  { name: "Tom Okafor", initials: "TO", role: "Analytics Lead", active: 1, total: 4, status: "Available", color: "#7c3aed", utilization: 30 },
];

// ─── Approvals data ───────────────────────────────────────────────────────────
interface Approval {
  id: string;
  title: string;
  type: string;
  requestor: string;
  campaign: string;
  submitted: string;
  priority: Priority;
}

const APPROVALS: Approval[] = [
  { id: "A01", title: "Q2 Enterprise Blog Post", type: "Content", requestor: "Alex K.", campaign: "Q2 Launch", submitted: "1h ago", priority: "High" },
  { id: "A02", title: "EMEA LinkedIn Ad Set (4 variants)", type: "Ad Creative", requestor: "Priya K.", campaign: "EMEA Expansion", submitted: "2h ago", priority: "High" },
  { id: "A03", title: "G2 Review Email Campaign", type: "Email", requestor: "Ryan B.", campaign: "G2 Push", submitted: "4h ago", priority: "Medium" },
  { id: "A04", title: "Q3 ABM Campaign Plan", type: "Campaign Plan", requestor: "Sarah M.", campaign: "Q3 Strategy", submitted: "6h ago", priority: "High" },
  { id: "A05", title: "$45K budget increase request — LinkedIn", type: "Budget", requestor: "Sarah M.", campaign: "LinkedIn ABM", submitted: "8h ago", priority: "High" },
  { id: "A06", title: "Product launch press release", type: "Content", requestor: "Alex K.", campaign: "Product Launch", submitted: "1d ago", priority: "Medium" },
  { id: "A07", title: "Brand refresh social assets (12)", type: "Brand Asset", requestor: "Mei C.", campaign: "Brand", submitted: "1d ago", priority: "Low" },
  { id: "A08", title: "Webinar promotional email #3", type: "Email", requestor: "Ryan B.", campaign: "AI Webinar", submitted: "2d ago", priority: "Low" },
];

const PRIORITY_STYLE: Record<Priority, { bg: string; color: string }> = {
  High:   { bg: "#dc26261a", color: RED },
  Medium: { bg: "#d977061a", color: AMBER },
  Low:    { bg: "#6b72801a", color: "#6b7280" },
};

const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  Content:       { bg: "#7c3aed1a", color: "#7c3aed" },
  "Ad Creative": { bg: "#2563eb1a", color: BLUE },
  Email:         { bg: "#0891b21a", color: "#0891b2" },
  "Campaign Plan": { bg: "#0596691a", color: "#059669" },
  Budget:        { bg: "#d977061a", color: AMBER },
  "Brand Asset": { bg: "#db27771a", color: "#db2777" },
};

// ─── Capacity data ────────────────────────────────────────────────────────────
const CAPACITY = [
  { name: "Sarah M.", used: 38, total: 40 },
  { name: "Alex K.", used: 28, total: 40 },
  { name: "Priya K.", used: 42, total: 40 },
  { name: "Marcus R.", used: 22, total: 40 },
  { name: "Ryan B.", used: 30, total: 40 },
];

// ─── Campaign staffing ────────────────────────────────────────────────────────
const CAMPAIGNS_STAFF = [
  { name: "Q2 Enterprise Launch", team: 3, status: "Needs designer", flag: false },
  { name: "EMEA Expansion", team: 2, status: "Understaffed", flag: true },
  { name: "LinkedIn ABM", team: 2, status: "Optimal", flag: false },
];

// ─── Freelancers ──────────────────────────────────────────────────────────────
const FREELANCERS = [
  { name: "Amy Z.", role: "Design Contractor", project: "LinkedIn ads", progress: "Week 3/4", rate: "$4,200/wk", color: "#7c3aed" },
  { name: "Studio X", role: "Video Production", project: "Webinar content", progress: "80% complete", rate: "Project-based", color: "#2563eb" },
  { name: "BrightComms", role: "PR Agency", project: "Product launch", progress: "Active", rate: "Retainer", color: "#059669" },
  { name: "RankFlow", role: "SEO Agency", project: "Technical audit", progress: "Week 2/6", rate: "Monthly", color: "#d97706" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = 8 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{ background: color, fontSize: size <= 8 ? 11 : 13 }}
    >
      {initials}
    </div>
  );
}

function StatusDot({ status }: { status: MemberStatus }) {
  const config: Record<MemberStatus, { color: string; icon: React.ElementType }> = {
    Available: { color: GREEN, icon: Circle },
    "In Meeting": { color: AMBER, icon: Video },
    "Focus Mode": { color: BLUE, icon: Coffee },
  };
  const { color, icon: Icon } = config[status];
  return (
    <span className="flex items-center gap-1 text-xs" style={{ color }}>
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const s = PRIORITY_STYLE[priority];
  return (
    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: s.bg, color: s.color }}>
      {priority}
    </span>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({ task }: { task: Task }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="rounded-xl p-3.5 mb-2 shadow-sm"
      style={{ background: "#fff", border: `1px solid ${BORDER}` }}
    >
      <p className="text-[13px] font-medium leading-snug mb-2" style={{ color: DARK_TEXT }}>{task.title}</p>
      <div className="flex items-center justify-between flex-wrap gap-1.5">
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
            style={{ background: MUTED }}
          >
            {task.assignee.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          <span className="text-xs" style={{ color: MUTED }}>{task.assignee}</span>
        </div>
        <PriorityBadge priority={task.priority} />
        {task.due && (
          <span className="text-[10px] font-medium" style={{ color: task.due === "Today" ? RED : MUTED }}>
            Due {task.due}
          </span>
        )}
        {task.pendingTime && (
          <span className="text-[10px]" style={{ color: AMBER }}>Pending {task.pendingTime}</span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Team Workspace tab ───────────────────────────────────────────────────────
function TeamWorkspaceTab() {
  const inProgress = TASKS.filter(t => t.status === "in-progress");
  const review = TASKS.filter(t => t.status === "review");
  const done = TASKS.filter(t => t.status === "done");

  return (
    <div className="flex gap-6">
      {/* Task board — 60% */}
      <div className="flex-1">
        {/* Sprint header */}
        <div
          className="rounded-xl p-4 mb-5 flex items-center justify-between"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}
        >
          <div>
            <p className="font-semibold text-sm" style={{ color: DARK_TEXT }}>Sprint 23 — May 12–26, 2026</p>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>47 / 69 tasks completed</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40 h-2 rounded-full overflow-hidden" style={{ background: BORDER }}>
              <div className="h-full rounded-full" style={{ background: GREEN, width: "68%" }} />
            </div>
            <span className="text-sm font-bold" style={{ color: GREEN }}>68%</span>
          </div>
        </div>

        {/* Board columns */}
        <div className="grid grid-cols-3 gap-4">
          {/* In Progress */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: BLUE }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>In Progress</p>
              <span
                className="ml-auto text-xs font-semibold rounded-full px-1.5 py-0.5"
                style={{ background: "#2563eb1a", color: BLUE }}
              >
                {inProgress.length}
              </span>
            </div>
            {inProgress.map(t => <TaskCard key={t.id} task={t} />)}
          </div>

          {/* Review */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: AMBER }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Review</p>
              <span
                className="ml-auto text-xs font-semibold rounded-full px-1.5 py-0.5"
                style={{ background: "#d977061a", color: AMBER }}
              >
                {review.length}
              </span>
            </div>
            {review.map(t => <TaskCard key={t.id} task={t} />)}
          </div>

          {/* Done */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Done</p>
              <span
                className="ml-auto text-xs font-semibold rounded-full px-1.5 py-0.5"
                style={{ background: "hsl(142,55%,90%)", color: GREEN }}
              >
                {done.length}
              </span>
            </div>
            {done.map(t => (
              <div
                key={t.id}
                className="rounded-xl p-3.5 mb-2 opacity-60"
                style={{ background: "#fff", border: `1px solid ${BORDER}` }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={13} style={{ color: GREEN, flexShrink: 0 }} />
                  <p className="text-[12px] line-through" style={{ color: MUTED }}>{t.title}</p>
                </div>
                <p className="text-[10px] mt-1 ml-5" style={{ color: MUTED }}>{t.assignee}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team members — 40% */}
      <div className="w-72 flex-shrink-0">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: MUTED }}>Team Members</p>
        <div className="flex flex-col gap-2">
          {TEAM.map(member => (
            <motion.div
              key={member.name}
              whileHover={{ x: 2 }}
              className="rounded-xl p-3.5"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <Avatar initials={member.initials} color={member.color} size={9} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: DARK_TEXT }}>{member.name}</p>
                  <p className="text-[10px] truncate" style={{ color: MUTED }}>{member.role}</p>
                </div>
                <StatusDot status={member.status} />
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px]" style={{ color: MUTED }}>Tasks: {member.active}/{member.total}</span>
                <span className="text-[10px] font-semibold" style={{ color: member.utilization >= 90 ? RED : DARK_TEXT }}>
                  {member.utilization}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: BORDER }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${member.utilization}%`,
                    background: member.utilization >= 90 ? RED : member.utilization >= 75 ? AMBER : GREEN,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Approvals tab ────────────────────────────────────────────────────────────
function ApprovalsTab() {
  const [expanded, setExpanded] = useState<string>("A01");

  return (
    <div className="flex flex-col gap-2">
      {APPROVALS.map(item => {
        const typeS = TYPE_STYLE[item.type] ?? { bg: "#6b72801a", color: "#6b7280" };
        const isOpen = expanded === item.id;

        return (
          <motion.div
            key={item.id}
            layout
            className="rounded-xl overflow-hidden"
            style={{ border: `1px solid ${isOpen ? PRIMARY : BORDER}` }}
          >
            {/* Row */}
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[hsl(36,30%,96%)] transition-colors"
              style={{ background: CARD }}
              onClick={() => setExpanded(isOpen ? "" : item.id)}
            >
              <ChevronRight
                size={16}
                style={{ color: MUTED, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: DARK_TEXT }}>{item.title}</p>
              </div>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: typeS.bg, color: typeS.color }}>
                {item.type}
              </span>
              <span className="text-xs w-20 truncate" style={{ color: MUTED }}>{item.requestor}</span>
              <span className="text-xs w-28 truncate" style={{ color: MUTED }}>{item.campaign}</span>
              <span className="text-xs w-16" style={{ color: MUTED }}>{item.submitted}</span>
              <PriorityBadge priority={item.priority} />
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button
                  className="rounded-lg px-3 py-1 text-xs font-semibold"
                  style={{ background: "hsl(142,55%,90%)", color: GREEN }}
                >
                  Approve
                </button>
                <button
                  className="rounded-lg px-3 py-1 text-xs font-semibold"
                  style={{ background: "#dc26261a", color: RED }}
                >
                  Reject
                </button>
                <button
                  className="rounded-lg px-3 py-1 text-xs font-semibold"
                  style={{ border: `1px solid ${BORDER}`, color: MUTED }}
                >
                  Review
                </button>
              </div>
            </div>

            {/* Expanded detail — only for A01 */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div
                    className="p-5 grid grid-cols-3 gap-5"
                    style={{ background: "hsl(36,30%,95%)", borderTop: `1px solid ${BORDER}` }}
                  >
                    {/* Content preview */}
                    <div
                      className="col-span-2 rounded-xl p-4"
                      style={{ background: "#fff", border: `1px solid ${BORDER}` }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: MUTED }}>Content Preview</p>
                      <p className="text-sm font-semibold mb-2" style={{ color: DARK_TEXT }}>
                        {item.id === "A01"
                          ? "How AI Agents Are Redefining Enterprise Marketing in 2026"
                          : item.title}
                      </p>
                      {item.id === "A01" && (
                        <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
                          Enterprise marketing teams are facing an inflection point. AI agents can now autonomously plan, execute, and optimize campaigns across 10+ channels — without human intervention for routine tasks. In this post, we explore how forward-thinking CMOs are deploying agentic workflows to scale personalization, compress go-to-market timelines, and reduce operational overhead by 40%...
                        </p>
                      )}
                    </div>

                    {/* Approval history + comments */}
                    <div className="flex flex-col gap-3">
                      <div
                        className="rounded-xl p-4"
                        style={{ background: "#fff", border: `1px solid ${BORDER}` }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Approval History</p>
                        <div className="flex flex-col gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <CheckCircle size={12} style={{ color: GREEN }} />
                            <span style={{ color: DARK_TEXT }}>SEO check passed</span>
                            <span className="ml-auto" style={{ color: MUTED }}>2h ago</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle size={12} style={{ color: GREEN }} />
                            <span style={{ color: DARK_TEXT }}>Brand compliance ✓</span>
                            <span className="ml-auto" style={{ color: MUTED }}>1.5h ago</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={12} style={{ color: AMBER }} />
                            <span style={{ color: DARK_TEXT }}>CMO approval pending</span>
                            <span className="ml-auto" style={{ color: MUTED }}>Now</span>
                          </div>
                        </div>
                      </div>

                      <div
                        className="rounded-xl p-4 flex-1"
                        style={{ background: "#fff", border: `1px solid ${BORDER}` }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: MUTED }}>Comments</p>
                        <div className="flex flex-col gap-2 text-xs mb-3">
                          <div>
                            <span className="font-semibold" style={{ color: DARK_TEXT }}>Alex K. </span>
                            <span style={{ color: MUTED }}>Added stats from Q1 report. Ready for final review.</span>
                          </div>
                        </div>
                        <input
                          className="w-full rounded-lg px-3 py-1.5 text-xs outline-none"
                          style={{ border: `1px solid ${BORDER}`, color: DARK_TEXT }}
                          placeholder="Add a comment..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="flex-1 rounded-lg py-2 text-xs font-semibold"
                          style={{ background: PRIMARY, color: "#fff" }}
                        >
                          Approve
                        </button>
                        <button
                          className="flex-1 rounded-lg py-2 text-xs font-semibold"
                          style={{ background: "#dc26261a", color: RED }}
                        >
                          Reject
                        </button>
                        <button
                          className="flex-1 rounded-lg py-2 text-xs font-semibold"
                          style={{ border: `1px solid ${BORDER}`, color: MUTED }}
                        >
                          Request Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Resource Management tab ──────────────────────────────────────────────────
function ResourceManagementTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* Section 1: Team Capacity */}
      <div className="rounded-xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: MUTED }}>Team Capacity — Sprint 23</p>
        <div className="flex flex-col gap-3">
          {CAPACITY.map(m => {
            const pct = Math.min((m.used / m.total) * 100, 100);
            const over = m.used > m.total;
            return (
              <div key={m.name} className="flex items-center gap-4">
                <p className="text-sm font-medium w-24 flex-shrink-0" style={{ color: DARK_TEXT }}>{m.name}</p>
                <div className="flex-1 h-3 rounded-full overflow-hidden relative" style={{ background: BORDER }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: over ? RED : m.used >= 35 ? AMBER : GREEN,
                      transition: "width 0.6s ease",
                    }}
                  />
                  {over && (
                    <div
                      className="absolute top-0 right-0 h-full w-0.5 rounded"
                      style={{ background: RED }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-1.5 w-28 flex-shrink-0">
                  <span className="text-xs font-semibold" style={{ color: over ? RED : DARK_TEXT }}>
                    {m.used}/{m.total} hrs
                  </span>
                  {over && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "#dc26261a", color: RED }}>
                      OVER
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Campaign Staffing */}
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-3" style={{ background: "hsl(36,30%,95%)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: MUTED }}>Campaign Staffing</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "hsl(36,30%,97%)" }}>
              {["Campaign", "Team Size", "Status"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS_STAFF.map((c, i) => (
              <tr key={c.name} className="border-t" style={{ borderColor: BORDER, background: i % 2 === 0 ? "#fff" : CARD }}>
                <td className="px-5 py-3 font-medium" style={{ color: DARK_TEXT }}>{c.name}</td>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-1.5">
                    {Array.from({ length: c.team }).map((_, j) => (
                      <div key={j} className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px]" style={{ background: PRIMARY }}>
                        <User size={10} />
                      </div>
                    ))}
                    <span className="text-xs ml-1" style={{ color: MUTED }}>{c.team} members</span>
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: c.flag ? RED : c.status === "Optimal" ? GREEN : AMBER }}
                  >
                    {c.flag && <AlertTriangle size={13} />}
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 3: Freelancer/Vendor Tracker */}
      <div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: MUTED }}>Freelancer / Vendor Tracker</p>
        <div className="grid grid-cols-2 gap-3">
          {FREELANCERS.map(f => (
            <motion.div
              key={f.name}
              whileHover={{ y: -2 }}
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: "#fff", border: `1px solid ${BORDER}` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: f.color }}
              >
                {f.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: DARK_TEXT }}>{f.name}</p>
                <p className="text-[11px]" style={{ color: MUTED }}>{f.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded" style={{ background: `${f.color}18`, color: f.color }}>
                    {f.project}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px]" style={{ color: MUTED }}>{f.progress}</span>
                  <span className="text-[11px] font-semibold" style={{ color: DARK_TEXT }}>{f.rate}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TeamPage() {
  const [activeTab, setActiveTab] = useState("workspace");

  return (
    <div className="p-8 flex flex-col gap-8 min-h-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: MUTED }}>CMO Office AgenticOS</p>
        <h1 className="font-serif text-3xl font-bold" style={{ color: PRIMARY }}>Team & Operations</h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>Collaboration, approvals, and resource management</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <MetricCard label="Team Members" value="24" sub="8 active now" />
        <MetricCard label="Tasks Completed Today" value="47" sub="Sprint 23 in progress" trend={15} />
        <MetricCard label="Pending Approvals" value="12" sub="3 high priority" />
        <MetricCard label="Avg Response Time" value="2.4 hrs" sub="SLA: 4 hrs" trend={10} />
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
                  layoutId="team-tab-indicator"
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
          {activeTab === "workspace" && <TeamWorkspaceTab />}
          {activeTab === "approvals" && <ApprovalsTab />}
          {activeTab === "resources" && <ResourceManagementTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
