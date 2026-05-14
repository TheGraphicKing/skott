// /Users/navaneethakrishnan/Desktop/skott/app/chief-of-staff/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Mic,
  Send,
  TrendingUp,
  TrendingDown,
  Users,
  Zap,
  Eye,
  BarChart2,
  Radio,
  ArrowRight,
  Loader2,
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
import { AIRecommendations } from "@/components/shared/AIRecommendations";
import { podcastPipeline } from "@/data/mock";
import { cn } from "@/lib/utils";

// ─── Strategic metrics ────────────────────────────────────────────────────────
interface StrategicMetric {
  label: string;
  value: string;
  trend: number;
  sub?: string;
  exploreLabel?: string;
}

const STRATEGIC_METRICS: StrategicMetric[] = [
  { label: "MQLs Total",       value: "312",      trend: 18,   sub: "target: 1,000/mo" },
  { label: "MQLs · Architect", value: "128",      trend: 22,   sub: "product split" },
  { label: "MQLs · Studio",    value: "97",       trend: 9,    sub: "product split" },
  { label: "MQLs · GPT",       value: "87",       trend: 14,   sub: "product split" },
  { label: "Paid Spend",       value: "$84.2K",   trend: -2.1, sub: "budget: $90K" },
  { label: "Paid ROI",         value: "3.4×",     trend: 6,    sub: "vs last month" },
  { label: "Email Open Rate",  value: "34.2%",    trend: 3,    sub: "industry avg: 21%" },
  { label: "Social Reach",     value: "284K",     trend: 6.2,  sub: "past 30 days" },
  { label: "SEO Clicks",       value: "12.4K",    trend: 4.1,  sub: "past 7 days" },
  { label: "Campaigns Active", value: "13",       trend: 0,    sub: "across 4 platforms" },
  { label: "Team Velocity",    value: "91%",      trend: 5,    sub: "tasks completed on time" },
  { label: "Avg Brand Score",  value: "87/100",   trend: 3,    sub: "across all outputs" },
];

// ─── Deck sections ─────────────────────────────────────────────────────────────
const DECK_SECTIONS = [
  { label: "Executive Summary",      done: true },
  { label: "MQL Performance",        done: true },
  { label: "Paid Campaign Overview", done: true },
  { label: "Content & SEO",          done: true },
  { label: "Events Recap",           done: true },
  { label: "Social Performance",     done: true },
  { label: "Partnership Update",     done: false },
  { label: "Team Velocity",          done: false },
  { label: "Recommendations",        done: false },
];

// ─── Podcast stage config ──────────────────────────────────────────────────────
type PodcastStage = "Prospect" | "Outreach" | "Scheduled" | "Recorded" | "Client Approval" | "Published";
const PODCAST_STAGES: PodcastStage[] = ["Prospect", "Outreach", "Scheduled", "Recorded", "Client Approval", "Published"];

const PODCAST_STAGE_CONFIG: Record<string, { color: string; bg: string }> = {
  "Prospect":       { color: "text-[hsl(25,20%,45%)]",  bg: "bg-[hsl(25,20%,60%)]/10" },
  "Outreach":       { color: "text-[hsl(217,91%,50%)]", bg: "bg-[hsl(217,91%,60%)]/10" },
  "Scheduled":      { color: "text-[hsl(258,78%,48%)]", bg: "bg-[hsl(258,78%,60%)]/10" },
  "Recorded":       { color: "text-[hsl(38,92%,40%)]",  bg: "bg-[hsl(38,92%,50%)]/10" },
  "Client Approval":{ color: "text-[hsl(0,84%,55%)]",   bg: "bg-[hsl(0,84%,60%)]/10" },
  "Published":      { color: "text-[hsl(142,71%,35%)]", bg: "bg-[hsl(142,71%,45%)]/10" },
};

// ─── Team velocity data ───────────────────────────────────────────────────────
const VELOCITY_DATA = [
  { name: "Priya",   tasks: 14 },
  { name: "Raj",     tasks: 11 },
  { name: "Kress",   tasks: 17 },
  { name: "Joel",    tasks: 9  },
  { name: "Siva",    tasks: 13 },
  { name: "Anju",    tasks: 8  },
  { name: "Mark",    tasks: 12 },
  { name: "Jesse",   tasks: 6  },
  { name: "Rob",     tasks: 10 },
  { name: "Vedant",  tasks: 15 },
];

// ─── Thunderclap team grid ────────────────────────────────────────────────────
const THUNDERCLAP_TEAM = [
  { name: "Priya",   role: "Creative",     status: "Done"     },
  { name: "Raj",     role: "Design",       status: "Done"     },
  { name: "Kress",   role: "Content",      status: "In Review"},
  { name: "Joel",    role: "Paid Media",   status: "Pending"  },
  { name: "Siva",    role: "Events",       status: "Done"     },
  { name: "Anju",    role: "Partnerships", status: "Pending"  },
  { name: "Mark",    role: "Social",       status: "Done"     },
  { name: "Jesse",   role: "Analytics",   status: "In Review"},
];

// ─── Metric card (strategic command centre) ────────────────────────────────────
function StrategicCard({ metric }: { metric: StrategicMetric }) {
  const [expanded, setExpanded] = useState(false);
  const positive = metric.trend >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-4 bg-[hsl(36,30%,96%)] cursor-pointer"
      onClick={() => setExpanded((v) => !v)}
    >
      <p className="text-[10px] uppercase tracking-widest text-[hsl(25,20%,45%)] mb-2">{metric.label}</p>
      <p className="font-serif text-2xl font-[600] text-[hsl(25,40%,18%)]">{metric.value}</p>
      {metric.sub && <p className="text-[10px] text-[hsl(25,20%,50%)] mt-0.5">{metric.sub}</p>}
      <div className={cn("flex items-center gap-1 mt-2 text-[11px] font-[500]", positive ? "text-[hsl(142,71%,35%)]" : "text-[hsl(0,84%,55%)]")}>
        {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        <span>{positive ? "+" : ""}{metric.trend}% WoW</span>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-[hsl(30,15%,88%)] flex items-center gap-1.5 text-[11px] text-[hsl(25,62%,25%)] font-[500]">
              <ArrowRight size={11} /> Explore why →
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Approval item ────────────────────────────────────────────────────────────
function ApprovalItem({ title, timer, followUp }: { title: string; timer: string; followUp: string }) {
  const [approved, setApproved] = useState(false);
  return (
    <div className={cn("flex items-center gap-4 px-4 py-3.5 rounded-lg border transition-all",
      approved ? "border-[hsl(142,71%,45%)]/40 bg-[hsl(142,71%,45%)]/5" : "border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)]"
    )}>
      <div className="flex-1">
        <p className="text-sm font-[600] text-[hsl(25,40%,18%)]">{title}</p>
        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[hsl(25,20%,45%)]">
          <span className="flex items-center gap-1"><Clock size={10} /> {timer}</span>
          <span>{followUp}</span>
        </div>
      </div>
      <button
        onClick={() => setApproved(true)}
        className={cn("px-3 py-1.5 rounded-lg text-xs font-[600] transition-all",
          approved
            ? "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,35%)]"
            : "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] hover:bg-[hsl(25,62%,20%)]"
        )}
      >
        {approved ? <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Approved</span> : "Approve"}
      </button>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ChiefOfStaffPage() {
  const [previewDeck, setPreviewDeck] = useState(false);
  const completedSections = DECK_SECTIONS.filter((s) => s.done).length;
  const totalSections = DECK_SECTIONS.length;

  const podcastByStage: Record<string, typeof podcastPipeline> = {};
  for (const ep of podcastPipeline) {
    (podcastByStage[ep.stage] ??= []).push(ep);
  }

  return (
    <div className="p-6 space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-[700] text-[hsl(25,40%,18%)]">Chief of Staff</h1>
          <p className="text-sm text-[hsl(25,20%,45%)] mt-0.5">Strategic command, deck assembly, podcast pipeline, and team orchestration</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[hsl(25,20%,45%)]">Chief of Staff Agent</span>
          <AgentStatusBadge status="active" />
        </div>
      </div>

      {/* ── Strategic Command Centre ─────────────────────────────────────────── */}
      <div>
        <h2 className="font-[600] text-[hsl(25,40%,18%)] mb-4">Strategic Command Centre</h2>
        <div className="grid grid-cols-4 gap-3">
          {STRATEGIC_METRICS.map((m) => (
            <StrategicCard key={m.label} metric={m} />
          ))}
        </div>
      </div>

      {/* ── Weekly Deck + Client Approval ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-6">
        {/* Deck */}
        <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)] space-y-4">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-[hsl(25,62%,25%)]" />
            <h2 className="font-[600] text-[hsl(25,40%,18%)]">Weekly Deck</h2>
            <span className="ml-auto text-[10px] bg-[hsl(38,92%,50%)]/10 text-[hsl(38,92%,40%)] px-2 py-0.5 rounded-full font-[600] flex items-center gap-1">
              <Clock size={9} /> Friday 4pm deadline
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[hsl(25,20%,45%)]">
              <span>Assembly in progress</span>
              <span className="font-[600] text-[hsl(25,40%,18%)]">{completedSections}/{totalSections} sections</span>
            </div>
            <div className="h-2.5 bg-[hsl(30,15%,88%)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedSections / totalSections) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-[hsl(25,62%,25%)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {DECK_SECTIONS.map((s) => (
              <div key={s.label} className={cn("flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px]",
                s.done ? "bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,35%)]" : "bg-[hsl(30,15%,90%)] text-[hsl(25,20%,45%)]"
              )}>
                {s.done ? <CheckCircle2 size={10} /> : <Loader2 size={10} className="animate-spin" />}
                <span className="truncate">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setPreviewDeck(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[hsl(25,62%,25%)] text-sm font-[600] text-[hsl(25,62%,25%)] hover:bg-[hsl(25,62%,25%)]/5 transition-colors"
            >
              <Eye size={13} /> Preview Draft
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-sm font-[600] hover:bg-[hsl(25,62%,20%)] transition-colors">
              <Send size={13} /> Send to CMO
            </button>
          </div>
        </div>

        {/* Client Approval Hub */}
        <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)] space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[hsl(25,62%,25%)]" />
            <h2 className="font-[600] text-[hsl(25,40%,18%)]">Client Approval Hub</h2>
            <span className="ml-auto text-[10px] bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,55%)] px-2 py-0.5 rounded-full font-[600]">2 pending</span>
          </div>
          <div className="space-y-3">
            <ApprovalItem
              title="Accenture Co-Marketing Brief — Q2"
              timer="Expires in 68 hrs"
              followUp="Auto follow-up enabled · sent 2× already"
            />
            <ApprovalItem
              title="Ep. 4 Podcast Edit — Marcus Rodriguez"
              timer="Expires in 41 hrs"
              followUp="Auto follow-up enabled · sent 1×"
            />
          </div>
        </div>
      </div>

      {/* ── Podcast Pipeline ──────────────────────────────────────────────────── */}
      <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)]">
        <div className="flex items-center gap-2 mb-5">
          <Mic size={15} className="text-[hsl(25,62%,25%)]" />
          <h2 className="font-[600] text-[hsl(25,40%,18%)]">Podcast Pipeline</h2>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {PODCAST_STAGES.map((stage) => {
            const episodes = podcastByStage[stage] ?? [];
            const cfg = PODCAST_STAGE_CONFIG[stage] ?? PODCAST_STAGE_CONFIG.Prospect;
            return (
              <div key={stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={cn("text-[10px] font-[600] uppercase tracking-wide", cfg.color)}>{stage}</span>
                  {episodes.length > 0 && (
                    <span className={cn("text-[9px] font-[700] w-4 h-4 rounded-full flex items-center justify-center", cfg.bg, cfg.color)}>
                      {episodes.length}
                    </span>
                  )}
                </div>
                {episodes.length === 0
                  ? <div className="h-16 rounded-lg border border-dashed border-[hsl(30,15%,82%)] flex items-center justify-center"><span className="text-[10px] text-[hsl(25,20%,55%)]">Empty</span></div>
                  : episodes.map((ep) => (
                      <div key={ep.id} className="rounded-lg border border-[hsl(30,15%,85%)] bg-white/50 p-2.5 space-y-1.5">
                        <p className="text-[10px] font-[600] text-[hsl(25,40%,18%)] leading-snug">{ep.guest}</p>
                        <p className="text-[9px] text-[hsl(25,20%,45%)]">{ep.company}</p>
                        <p className="text-[9px] text-[hsl(25,20%,50%)] leading-snug italic">{ep.topic}</p>
                        <span className={cn("inline-block text-[8px] font-[600] px-1.5 py-0.5 rounded-full", cfg.bg, cfg.color)}>
                          Ep {ep.episode}
                        </span>
                      </div>
                    ))
                }
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Team Velocity + Campaign Orchestrator ────────────────────────────── */}
      <div className="grid grid-cols-2 gap-6">
        {/* Team Velocity */}
        <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)]">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={15} className="text-[hsl(25,62%,25%)]" />
            <h2 className="font-[600] text-[hsl(25,40%,18%)]">Team Velocity This Week</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={VELOCITY_DATA} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(25,20%,45%)" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "hsl(25,40%,18%)" }} axisLine={false} tickLine={false} width={48} />
              <Tooltip contentStyle={{ background: "hsl(36,30%,96%)", border: "1px solid hsl(30,15%,85%)", borderRadius: "0.5rem", fontSize: 11 }} />
              <Bar dataKey="tasks" name="Tasks completed" fill="hsl(25,62%,25%)" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Campaign Orchestrator — Thunderclap */}
        <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)] space-y-4">
          <div className="flex items-center gap-2">
            <Radio size={15} className="text-[hsl(25,62%,25%)]" />
            <h2 className="font-[600] text-[hsl(25,40%,18%)]">Campaign Orchestrator</h2>
          </div>

          <div className="px-3 py-2.5 rounded-lg bg-[hsl(25,62%,25%)]/5 border border-[hsl(25,62%,25%)]/20">
            <div className="flex items-center gap-2">
              <Zap size={13} className="text-[hsl(25,62%,25%)]" />
              <span className="text-sm font-[600] text-[hsl(25,40%,18%)]">Thunderclap Launch — Q2</span>
              <span className="ml-auto text-[10px] bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,35%)] px-2 py-0.5 rounded-full font-[600]">● Active</span>
            </div>
            <p className="text-xs text-[hsl(25,20%,45%)] mt-1">Full-funnel coordinated push · May 20 launch · 8 teams involved</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-[hsl(25,20%,45%)] mb-2">Team participation</p>
            <div className="grid grid-cols-2 gap-2">
              {THUNDERCLAP_TEAM.map((m) => (
                <div key={m.name} className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[hsl(30,15%,90%)]">
                  <div className="w-6 h-6 rounded-full bg-[hsl(25,62%,25%)] flex items-center justify-center text-[hsl(36,33%,94%)] text-[10px] font-[700] shrink-0">
                    {m.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-[500] text-[hsl(25,40%,18%)] truncate">{m.name}</p>
                    <p className="text-[9px] text-[hsl(25,20%,50%)]">{m.role}</p>
                  </div>
                  <span className={cn("text-[9px] font-[600] px-1.5 py-0.5 rounded-full",
                    m.status === "Done"
                      ? "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,35%)]"
                      : m.status === "In Review"
                      ? "bg-[hsl(38,92%,50%)]/15 text-[hsl(38,92%,40%)]"
                      : "bg-[hsl(25,20%,60%)]/10 text-[hsl(25,20%,45%)]"
                  )}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Deck preview modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {previewDeck && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40"
            onClick={() => setPreviewDeck(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-[600] text-[hsl(25,40%,18%)]">Weekly Deck Preview</h3>
                <button onClick={() => setPreviewDeck(false)} className="text-xs text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)]">Close</button>
              </div>
              <div className="space-y-2">
                {DECK_SECTIONS.map((s, i) => (
                  <div key={s.label} className={cn("flex items-center gap-3 px-3 py-2 rounded-lg",
                    s.done ? "bg-[hsl(142,71%,45%)]/5" : "bg-[hsl(30,15%,90%)]"
                  )}>
                    <span className="text-xs font-[500] text-[hsl(25,20%,45%)] w-5">{i + 1}.</span>
                    <span className="flex-1 text-sm text-[hsl(25,40%,18%)]">{s.label}</span>
                    {s.done
                      ? <CheckCircle2 size={13} className="text-[hsl(142,71%,35%)]" />
                      : <Loader2 size={13} className="text-[hsl(25,20%,45%)] animate-spin" />
                    }
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AIRecommendations page="chief-of-staff" />
    </div>
  );
}
