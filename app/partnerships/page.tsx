// /Users/navaneethakrishnan/Desktop/skott/app/partnerships/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CalendarDays,
  AlertTriangle,
  Search,
  Send,
  ChevronRight,
  BarChart2,
  Database,
  Radio,
  CheckCircle2,
  Clock,
  Dot,
  Bell,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { MetricCard } from "@/components/shared/MetricCard";
import { AIRecommendations } from "@/components/shared/AIRecommendations";
import { cn } from "@/lib/utils";

// ─── Sample tasks ─────────────────────────────────────────────────────────────
type TaskStatus = "Not Started" | "In Progress" | "Blocked" | "Done";

interface Task {
  id: string;
  title: string;
  owner: string;
  source: string;
  status: TaskStatus;
  due: string;
}

const TASKS: Task[] = [
  { id: "t1", title: "Share Lyzr deck with Accenture BFSI lead",   owner: "Priya",    source: "Accenture BFSI · May 12", status: "In Progress",  due: "May 16" },
  { id: "t2", title: "Send ROI calculator to Infosys team",         owner: "Raj",      source: "Infosys Call · May 10",   status: "Not Started",  due: "May 17" },
  { id: "t3", title: "Draft co-marketing brief with Wipro",         owner: "Kress",    source: "Wipro Sync · May 9",      status: "In Progress",  due: "May 19" },
  { id: "t4", title: "Follow up on TCS demo feedback",              owner: "Joel",     source: "TCS Demo · May 8",        status: "Blocked",      due: "May 15" },
  { id: "t5", title: "Upload Capgemini campaign assets to Drive",   owner: "Priya",    source: "Capgemini · May 7",       status: "Done",         due: "May 13" },
  { id: "t6", title: "Confirm HCL event logistics",                 owner: "Siva",     source: "HCL Call · May 6",        status: "Not Started",  due: "May 20" },
  { id: "t7", title: "Review Accenture ABM campaign draft",         owner: "Mark",     source: "Accenture BFSI · May 12", status: "Blocked",      due: "May 15" },
  { id: "t8", title: "Publish partnership case study — Infosys",   owner: "Anju",     source: "Infosys Call · May 10",   status: "Done",         due: "May 14" },
];

const COLUMNS: TaskStatus[] = ["Not Started", "In Progress", "Blocked", "Done"];

const COL_CONFIG: Record<TaskStatus, { bg: string; header: string; badge: string }> = {
  "Not Started": { bg: "bg-[hsl(30,15%,92%)]",         header: "text-[hsl(25,20%,45%)]",   badge: "bg-[hsl(25,20%,60%)]/20 text-[hsl(25,20%,45%)]" },
  "In Progress": { bg: "bg-[hsl(217,91%,60%)]/5",      header: "text-[hsl(217,91%,50%)]",  badge: "bg-[hsl(217,91%,60%)]/15 text-[hsl(217,91%,50%)]" },
  "Blocked":     { bg: "bg-[hsl(0,84%,60%)]/5",        header: "text-[hsl(0,84%,55%)]",    badge: "bg-[hsl(0,84%,60%)]/15 text-[hsl(0,84%,55%)]" },
  "Done":        { bg: "bg-[hsl(142,71%,45%)]/5",      header: "text-[hsl(142,71%,35%)]",  badge: "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,35%)]" },
};

// ─── HubSpot quick chips ──────────────────────────────────────────────────────
const QUICK_CHIPS = ["Calls last week", "MQLs from GSI", "Deals at demo stage", "Pipeline added this month"];

const HUBSPOT_RESULTS: Record<string, { label: string; value: string; chart: { name: string; value: number }[] }> = {
  "Calls last week": {
    label: "Calls last week", value: "4 calls, 2 demos",
    chart: [
      { name: "Mon", value: 1 }, { name: "Tue", value: 0 }, { name: "Wed", value: 2 },
      { name: "Thu", value: 1 }, { name: "Fri", value: 0 },
    ],
  },
  "MQLs from GSI": {
    label: "MQLs from GSI channels", value: "38 MQLs this month",
    chart: [
      { name: "Accenture", value: 12 }, { name: "Infosys", value: 9 },
      { name: "Wipro", value: 7 }, { name: "TCS", value: 6 }, { name: "HCL", value: 4 },
    ],
  },
  "Deals at demo stage": {
    label: "Deals at demo stage", value: "14 deals",
    chart: [
      { name: "BFSI", value: 5 }, { name: "Insurance", value: 4 },
      { name: "Healthcare", value: 3 }, { name: "Retail", value: 2 },
    ],
  },
  "Pipeline added this month": {
    label: "Pipeline added (May)", value: "$2.8M total",
    chart: [
      { name: "W1", value: 480000 }, { name: "W2", value: 920000 },
      { name: "W3", value: 840000 }, { name: "W4", value: 560000 },
    ],
  },
};

// ─── Campaign records ─────────────────────────────────────────────────────────
const CAMPAIGNS = [
  { id: "kc1", name: "Accenture BFSI ABM — Q2",    gsi: "Accenture", budget: "$12,000", mqls: 0,  status: "Active",    duplicate: false, dupeNote: "" },
  { id: "kc2", name: "Infosys Enterprise AI TOFU", gsi: "Infosys",   budget: "$8,500",  mqls: 11, status: "Active",    duplicate: false, dupeNote: "" },
  { id: "kc3", name: "Wipro Co-marketing Webinar", gsi: "Wipro",     budget: "$5,000",  mqls: 0,  status: "Planning",  duplicate: true,  dupeNote: "Similar campaign ran 6 months ago — Results: 12 MQLs, $890 cost/MQL" },
];

// ─── Team members ─────────────────────────────────────────────────────────────
const TEAM = [
  { name: "Priya",   goal: 6, campaigns: 3, deps: [true, true, false] },
  { name: "Raj",     goal: 5, campaigns: 2, deps: [true, false, false] },
  { name: "Kress",   goal: 8, campaigns: 4, deps: [true, true, true] },
  { name: "Joel",    goal: 4, campaigns: 1, deps: [true, false, false] },
  { name: "Siva",    goal: 7, campaigns: 3, deps: [true, true, false] },
  { name: "Anju",    goal: 5, campaigns: 2, deps: [true, true, false] },
];

// ─── Task card ────────────────────────────────────────────────────────────────
function TaskCard({ task }: { task: Task }) {
  const [pinged, setPinged] = useState(false);
  return (
    <div className="rounded-lg border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] p-3 space-y-2">
      <p className="text-xs font-[500] text-[hsl(25,40%,18%)] leading-snug">{task.title}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] bg-[hsl(25,62%,25%)]/10 text-[hsl(25,62%,25%)] px-1.5 py-0.5 rounded font-[500]">{task.owner}</span>
        <span className="text-[10px] text-[hsl(25,20%,45%)] flex items-center gap-0.5"><CalendarDays size={9} /> {task.due}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-[hsl(25,20%,50%)] italic">{task.source}</p>
        <button
          onClick={() => { setPinged(true); setTimeout(() => setPinged(false), 2000); }}
          className={cn("flex items-center gap-1 text-[10px] px-2 py-1 rounded font-[600] transition-all",
            pinged ? "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,35%)]" : "bg-[hsl(25,62%,25%)]/10 text-[hsl(25,62%,25%)] hover:bg-[hsl(25,62%,25%)]/20"
          )}
        >
          {pinged ? <><CheckCircle2 size={9} /> Pinged</> : <><Bell size={9} /> Ping</>}
        </button>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function PartnershipsPage() {
  const [hubspotQuery, setHubspotQuery] = useState("MQLs from GSI");
  const [searchVal, setSearchVal] = useState("");
  const result = HUBSPOT_RESULTS[hubspotQuery] ?? HUBSPOT_RESULTS["MQLs from GSI"];

  return (
    <div className="p-6 space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-[700] text-[hsl(25,40%,18%)]">GSI Partnerships</h1>
          <p className="text-sm text-[hsl(25,20%,45%)] mt-0.5">Campaign tracking, HubSpot intelligence, and team coordination</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[hsl(25,20%,45%)]">Partnership Agent</span>
          <AgentStatusBadge status="idle" />
        </div>
      </div>

      {/* ── Metrics ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Active GSI Campaigns" value="6"     trend={0}   trendLabel="stable" />
        <MetricCard label="MQLs from GSI"         value="38"   trend={14}  trendLabel="MoM" />
        <MetricCard label="Calls Booked"          value="14"   trend={27}  trendLabel="MoM" />
        <MetricCard label="Pipeline Value"        value="$2.8M" trend={6}  trendLabel="MoM" />
      </div>

      {/* ── Kanban ──────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="font-[600] text-[hsl(25,40%,18%)] mb-4">My Tasks</h2>
        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const cfg = COL_CONFIG[col];
            const colTasks = TASKS.filter((t) => t.status === col);
            return (
              <div key={col} className={cn("rounded-[0.75rem] p-3 space-y-2", cfg.bg)}>
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("text-xs font-[600]", cfg.header)}>{col}</span>
                  <span className={cn("text-[10px] font-[700] px-1.5 py-0.5 rounded-full", cfg.badge)}>{colTasks.length}</span>
                </div>
                {colTasks.map((task) => <TaskCard key={task.id} task={task} />)}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Meeting-to-Task Pipeline ─────────────────────────────────────────── */}
      <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)]">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={15} className="text-[hsl(25,62%,25%)]" />
          <h2 className="font-[600] text-[hsl(25,40%,18%)]">Meeting-to-Task Pipeline</h2>
        </div>
        <div className="flex items-center gap-3 mb-4 px-3 py-2.5 rounded-lg bg-[hsl(25,62%,25%)]/5 border border-[hsl(25,62%,25%)]/20">
          <div className="w-8 h-8 rounded-full bg-[hsl(25,62%,25%)] flex items-center justify-center shrink-0">
            <Radio size={14} className="text-[hsl(36,33%,94%)]" />
          </div>
          <div>
            <p className="text-sm font-[600] text-[hsl(25,40%,18%)]">Accenture BFSI Discussion — May 12</p>
            <p className="text-xs text-[hsl(25,20%,45%)]">5 tasks extracted · 2 owners assigned · 3 deadlines set</p>
          </div>
          <ChevronRight size={16} className="ml-auto text-[hsl(25,20%,45%)]" />
        </div>
        <div className="space-y-2">
          {[
            { task: "Share Lyzr deck with Accenture BFSI lead",     owner: "Priya",  due: "May 16" },
            { task: "Review Accenture ABM campaign draft",           owner: "Mark",   due: "May 15" },
            { task: "Initiate co-sell agreement discussion",         owner: "Kress",  due: "May 18" },
            { task: "Set up joint demo environment for BFSI POC",   owner: "Raj",    due: "May 20" },
            { task: "Draft MoU for partnership framework",           owner: "Siva",   due: "May 22" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[hsl(30,15%,90%)]">
              <Zap size={12} className="text-[hsl(25,62%,25%)] shrink-0" />
              <span className="flex-1 text-xs text-[hsl(25,40%,18%)]">{item.task}</span>
              <span className="text-[10px] bg-[hsl(25,62%,25%)]/10 text-[hsl(25,62%,25%)] px-1.5 py-0.5 rounded font-[500]">{item.owner}</span>
              <span className="text-[10px] text-[hsl(25,20%,45%)] flex items-center gap-0.5"><CalendarDays size={9} /> {item.due}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HubSpot Query ────────────────────────────────────────────────────── */}
      <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)] space-y-4">
        <div className="flex items-center gap-2">
          <Database size={15} className="text-[hsl(25,62%,25%)]" />
          <h2 className="font-[600] text-[hsl(25,40%,18%)]">HubSpot Query Interface</h2>
        </div>

        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[hsl(30,15%,85%)] bg-white/60">
          <Search size={14} className="text-[hsl(25,20%,45%)]" />
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Ask HubSpot anything…"
            className="flex-1 text-sm text-[hsl(25,40%,18%)] placeholder:text-[hsl(25,20%,55%)] bg-transparent focus:outline-none"
          />
          <button className="px-3 py-1 rounded-md bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-xs font-[600]">Query</button>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setHubspotQuery(chip)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-[500] transition-all",
                hubspotQuery === chip
                  ? "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)]"
                  : "bg-[hsl(30,15%,90%)] text-[hsl(25,20%,45%)] hover:bg-[hsl(30,15%,85%)]"
              )}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-1">
          <div className="col-span-1 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-[hsl(25,20%,45%)]">Result</p>
            <p className="text-xl font-serif font-[600] text-[hsl(25,40%,18%)]">{result.value}</p>
            <p className="text-xs text-[hsl(25,20%,45%)]">{result.label}</p>
          </div>
          <div className="col-span-2">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={result.chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(25,20%,45%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(25,20%,45%)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(36,30%,96%)", border: "1px solid hsl(30,15%,85%)", borderRadius: "0.5rem", fontSize: 11 }} />
                <Bar dataKey="value" fill="hsl(25,62%,25%)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Campaign Knowledge Base ──────────────────────────────────────────── */}
      <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)]">
        <h2 className="font-[600] text-[hsl(25,40%,18%)] mb-4">Campaign Knowledge Base</h2>
        <div className="space-y-3">
          {CAMPAIGNS.map((c) => (
            <div key={c.id} className="rounded-lg border border-[hsl(30,15%,85%)] p-3.5 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-[600] text-[hsl(25,40%,18%)]">{c.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-[hsl(25,20%,45%)]">
                    <span>{c.gsi}</span>
                    <span>Budget: {c.budget}</span>
                    {c.mqls > 0 && <span>{c.mqls} MQLs</span>}
                  </div>
                </div>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-[600]",
                  c.status === "Active"
                    ? "bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,35%)]"
                    : "bg-[hsl(25,20%,60%)]/10 text-[hsl(25,20%,45%)]"
                )}>
                  {c.status}
                </span>
              </div>
              {c.duplicate && (
                <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-[hsl(38,92%,50%)]/10 border border-[hsl(38,92%,50%)]/30">
                  <AlertTriangle size={12} className="text-[hsl(38,92%,40%)] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[hsl(38,92%,35%)]">{c.dupeNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Team Visibility ──────────────────────────────────────────────────── */}
      <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)]">
        <div className="flex items-center gap-2 mb-4">
          <Users size={15} className="text-[hsl(25,62%,25%)]" />
          <h2 className="font-[600] text-[hsl(25,40%,18%)]">Team Visibility</h2>
        </div>
        <div className="space-y-2">
          {TEAM.map((member) => (
            <div key={member.name} className="flex items-center gap-4 px-3 py-2.5 rounded-lg bg-[hsl(30,15%,90%)]">
              <div className="w-7 h-7 rounded-full bg-[hsl(25,62%,25%)] flex items-center justify-center text-[hsl(36,33%,94%)] text-[11px] font-[700] shrink-0">
                {member.name[0]}
              </div>
              <span className="w-16 text-sm font-[500] text-[hsl(25,40%,18%)]">{member.name}</span>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[10px] text-[hsl(25,20%,45%)]">Weekly goal:</span>
                <span className="text-xs font-[600] text-[hsl(25,40%,18%)]">{member.goal} tasks</span>
                <span className="mx-2 text-[hsl(30,15%,80%)]">|</span>
                <span className="text-[10px] text-[hsl(25,20%,45%)]">{member.campaigns} campaigns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[hsl(25,20%,45%)]">Dependencies:</span>
                {member.deps.map((d, i) => (
                  <div key={i} className={cn("w-2.5 h-2.5 rounded-full", d ? "bg-[hsl(142,71%,45%)]" : "bg-[hsl(30,15%,80%)]")} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <AIRecommendations page="partnerships" />
    </div>
  );
}
