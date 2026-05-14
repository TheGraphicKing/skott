// /Users/navaneethakrishnan/Desktop/skott/app/content/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Loader2,
  ChevronRight,
  BarChart2,
  Sparkles,
  FileText,
  Search,
  Layers,
  Send,
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
import { playbooks } from "@/data/mock";
import { cn } from "@/lib/utils";

// ─── Stage config ─────────────────────────────────────────────────────────────
const STAGE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  Research:    { label: "Research",    color: "text-[hsl(25,20%,45%)]",   bg: "bg-[hsl(25,20%,60%)]/10" },
  Building:    { label: "Building",    color: "text-[hsl(217,91%,50%)]",  bg: "bg-[hsl(217,91%,60%)]/10" },
  Review:      { label: "Review",      color: "text-[hsl(38,92%,40%)]",   bg: "bg-[hsl(38,92%,50%)]/10" },
  Published:   { label: "Published",   color: "text-[hsl(142,71%,35%)]",  bg: "bg-[hsl(142,71%,45%)]/10" },
  Distributed: { label: "Distributed", color: "text-[hsl(258,78%,48%)]",  bg: "bg-[hsl(258,78%,60%)]/10" },
};

// ─── Workflow steps ────────────────────────────────────────────────────────────
const BUILD_STEPS = [
  { icon: Search,    label: "Research",   desc: "Keyword & competitor analysis" },
  { icon: FileText,  label: "Build",      desc: "AI-assisted content generation" },
  { icon: Sparkles,  label: "Review",     desc: "Brand voice & quality scoring" },
  { icon: BookOpen,  label: "Publish",    desc: "WordPress & content hub" },
  { icon: Send,      label: "Distribute", desc: "Multi-channel distribution" },
];

// ─── Playbook bar chart data ───────────────────────────────────────────────────
const playbookChartData = playbooks.map((pb) => ({
  name: pb.title.split(" ").slice(0, 3).join(" ") + "…",
  leads: pb.leads,
  demos: pb.demos,
}));

// ─── Channel dot ──────────────────────────────────────────────────────────────
function ChannelDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1 text-[11px]">
      {ok
        ? <CheckCircle2 size={12} className="text-[hsl(142,71%,35%)]" />
        : <XCircle size={12} className="text-[hsl(0,84%,55%)]" />}
      <span className={ok ? "text-[hsl(142,71%,35%)]" : "text-[hsl(0,84%,55%)]"}>{label}</span>
    </div>
  );
}

// ─── Playbook card ─────────────────────────────────────────────────────────────
function PlaybookCard({ pb }: { pb: typeof playbooks[0] }) {
  const stage = STAGE_CONFIG[pb.stage] ?? STAGE_CONFIG.Research;
  const needsDist = (pb.stage === "Published" || pb.stage === "Distributed") &&
    (!pb.channels.linkedin || !pb.channels.wordpress || !pb.channels.email || !pb.channels.social);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)] flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-[600] text-[hsl(25,40%,18%)] leading-snug">{pb.title}</p>
        <span className={cn("shrink-0 text-[10px] font-[600] uppercase tracking-wide px-2 py-0.5 rounded-full", stage.bg, stage.color)}>
          {stage.label}
        </span>
      </div>

      {needsDist && (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[hsl(0,84%,60%)]/10 text-[hsl(0,84%,55%)] text-[11px] font-[600]">
          <AlertTriangle size={12} /> Needs Distribution
        </div>
      )}

      <div className="flex gap-4 text-xs text-[hsl(25,20%,45%)]">
        <span><span className="font-[600] text-[hsl(25,40%,18%)]">{pb.leads}</span> leads</span>
        <span><span className="font-[600] text-[hsl(25,40%,18%)]">{pb.demos}</span> demos</span>
      </div>

      <div className="border-t border-[hsl(30,15%,88%)] pt-3">
        <p className="text-[10px] uppercase tracking-widest text-[hsl(25,20%,45%)] mb-2">Distribution</p>
        <div className="grid grid-cols-2 gap-1">
          <ChannelDot ok={pb.channels.linkedin}  label="LinkedIn" />
          <ChannelDot ok={pb.channels.wordpress} label="WordPress" />
          <ChannelDot ok={pb.channels.email}     label="Email" />
          <ChannelDot ok={pb.channels.social}    label="Social" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ContentPage() {
  const [building, setBuilding] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  function handleStartBuilding() {
    setBuilding(true);
    setActiveStep(0);
    let step = 0;
    const tick = () => {
      step++;
      if (step < BUILD_STEPS.length) {
        setActiveStep(step);
        setTimeout(tick, 900);
      } else {
        setTimeout(() => {
          setBuilding(false);
          setActiveStep(null);
        }, 700);
      }
    };
    setTimeout(tick, 900);
  }

  return (
    <div className="p-6 space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-[700] text-[hsl(25,40%,18%)]">Content &amp; Campaigns</h1>
          <p className="text-sm text-[hsl(25,20%,45%)] mt-0.5">Playbook intelligence, AI scoring, and multi-channel distribution</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[hsl(25,20%,45%)]">Content Strategist</span>
          <AgentStatusBadge status="idle" />
        </div>
      </div>

      {/* ── Metrics ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Active Playbooks"   value="5"      trend={0}   trendLabel="stable" />
        <MetricCard label="Content MQLs"       value="218"    trend={8}   trendLabel="MoM" />
        <MetricCard label="Demo Bookings"      value="47"     trend={12}  trendLabel="MoM" />
        <MetricCard label="Avg Quality Score"  value="82/100" trend={3}   trendLabel="WoW" />
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-6">
        {/* ── Playbooks (2/3 wide) ───────────────────────────────────────── */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-[600] text-[hsl(25,40%,18%)]">Playbook Library</h2>
            <span className="text-xs text-[hsl(25,20%,45%)]">{playbooks.length} playbooks</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {playbooks.map((pb) => <PlaybookCard key={pb.id} pb={pb} />)}
          </div>
        </div>

        {/* ── Right panel ────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Playbook Builder */}
          <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)] space-y-4">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-[hsl(25,62%,25%)]" />
              <h3 className="font-[600] text-sm text-[hsl(25,40%,18%)]">Build New Playbook</h3>
            </div>

            <div className="space-y-2">
              {BUILD_STEPS.map((step, i) => {
                const isActive = activeStep === i;
                const isDone   = activeStep !== null && i < activeStep;
                return (
                  <div key={step.label}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300",
                      isActive ? "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)]" : "bg-[hsl(30,15%,90%)]"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-[700]",
                      isActive ? "bg-[hsl(36,33%,94%)] text-[hsl(25,62%,25%)]" :
                      isDone   ? "bg-[hsl(142,71%,45%)]/20 text-[hsl(142,71%,35%)]" :
                                 "bg-white/60 text-[hsl(25,20%,45%)]"
                    )}>
                      {isDone ? <CheckCircle2 size={13} /> : isActive ? <Loader2 size={13} className="animate-spin" /> : i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-xs font-[600]", isActive ? "text-[hsl(36,33%,94%)]" : "text-[hsl(25,40%,18%)]")}>{step.label}</p>
                      <p className={cn("text-[10px]", isActive ? "text-[hsl(36,33%,80%)]" : "text-[hsl(25,20%,45%)]")}>{step.desc}</p>
                    </div>
                    {i < BUILD_STEPS.length - 1 && !isActive && (
                      <ChevronRight size={13} className="ml-auto text-[hsl(25,20%,55%)]" />
                    )}
                    {isActive && <Zap size={13} className="ml-auto text-[hsl(38,92%,70%)]" />}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleStartBuilding}
              disabled={building}
              className={cn(
                "w-full py-2.5 rounded-lg text-sm font-[600] flex items-center justify-center gap-2 transition-all",
                building
                  ? "bg-[hsl(25,62%,25%)]/50 text-[hsl(36,33%,80%)] cursor-not-allowed"
                  : "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] hover:bg-[hsl(25,62%,20%)]"
              )}
            >
              {building ? <><Loader2 size={14} className="animate-spin" /> Generating…</> : <><Play size={14} /> Start Building</>}
            </button>
          </div>

          {/* AI Scoring Panel */}
          <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)] space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[hsl(25,62%,25%)]" />
              <h3 className="font-[600] text-sm text-[hsl(25,40%,18%)]">Live Content Score</h3>
              <span className="ml-auto text-[10px] bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,35%)] px-2 py-0.5 rounded-full font-[600]">● Live</span>
            </div>

            {[
              { label: "Word Count",        value: "2,847",   unit: "words" },
              { label: "Keyword Density",   value: "2.3%",    unit: "" },
              { label: "Brand Voice Score", value: "91/100",  unit: "" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-[hsl(25,20%,45%)] text-xs">{row.label}</span>
                <span className="font-[600] text-[hsl(25,40%,18%)] text-xs">{row.value} {row.unit && <span className="text-[hsl(25,20%,45%)] font-[400]">{row.unit}</span>}</span>
              </div>
            ))}

            <div className="border-t border-[hsl(30,15%,88%)] pt-3">
              <div className="flex items-start gap-2 bg-[hsl(38,92%,50%)]/10 rounded-lg p-2.5">
                <Sparkles size={12} className="text-[hsl(38,92%,40%)] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[hsl(38,92%,35%)] leading-snug">
                  <span className="font-[600]">Suggestion:</span> Add a case study to section 3 to increase conversion by ~23%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Distribution Chart ──────────────────────────────────────────────── */}
      <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)]">
        <div className="flex items-center gap-2 mb-5">
          <BarChart2 size={16} className="text-[hsl(25,62%,25%)]" />
          <h2 className="font-[600] text-[hsl(25,40%,18%)]">Leads by Playbook</h2>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={playbookChartData} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(25,20%,45%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(25,20%,45%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(36,30%,96%)", border: "1px solid hsl(30,15%,85%)", borderRadius: "0.5rem", fontSize: 12 }}
              cursor={{ fill: "hsl(25,62%,25%)/5" }}
            />
            <Bar dataKey="leads" name="Leads" fill="hsl(25,62%,25%)" radius={[4,4,0,0]} />
            <Bar dataKey="demos" name="Demos" fill="hsl(258,78%,60%)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
