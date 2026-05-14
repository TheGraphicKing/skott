// /Users/navaneethakrishnan/Desktop/skott/app/observe/agent-runs/page.tsx
"use client";

import { useState } from "react";
import {
  Eye,
  X,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  Cpu,
  Download,
  Database,
  MessageSquare,
  Wrench,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Zap,
  DollarSign,
  Activity,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRecommendations } from "@/components/shared/AIRecommendations";
import { agentRuns } from "@/data/mock";

type RunStatus = "completed" | "running" | "failed";

const STATUS_CONFIG: Record<RunStatus, { label: string; color: string; icon: React.ReactNode }> = {
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700 border border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  running: { label: "Running", color: "bg-blue-100 text-blue-700 border border-blue-200", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  failed: { label: "Failed", color: "bg-red-100 text-red-700 border border-red-200", icon: <XCircle className="w-3 h-3" /> },
};

const STEP_ICONS: Record<string, React.ReactNode> = {
  skill_load: <Download className="w-3.5 h-3.5" />,
  data_ingest: <Database className="w-3.5 h-3.5" />,
  llm_call: <MessageSquare className="w-3.5 h-3.5" />,
  tool_call: <Wrench className="w-3.5 h-3.5" />,
  output: <ArrowUpRight className="w-3.5 h-3.5" />,
};

const EXECUTION_TRACE: Record<string, Array<{ type: string; label: string; duration: string; status: "ok" | "warn" | "err" }>> = {
  r1: [
    { type: "skill_load", label: "Load financial-recon skill", duration: "80ms", status: "ok" },
    { type: "data_ingest", label: "Pull HubSpot closed-won data", duration: "1.2s", status: "ok" },
    { type: "llm_call", label: "Reconcile ad spend vs pipeline", duration: "8.4s", status: "ok" },
    { type: "tool_call", label: "Write summary to wiki", duration: "540ms", status: "ok" },
    { type: "output", label: "Deliver weekly report to Slack", duration: "120ms", status: "ok" },
  ],
  r2: [
    { type: "skill_load", label: "Load social-publishing skill", duration: "60ms", status: "ok" },
    { type: "data_ingest", label: "Fetch trending topics via API", duration: "880ms", status: "ok" },
    { type: "llm_call", label: "Generate post draft", duration: "6.1s", status: "ok" },
    { type: "tool_call", label: "Brand voice check", duration: "1.4s", status: "ok" },
    { type: "output", label: "Queue for human approval", duration: "95ms", status: "ok" },
  ],
  r3: [
    { type: "skill_load", label: "Load anomaly-detector skill", duration: "75ms", status: "ok" },
    { type: "data_ingest", label: "Fetch Google Ads metrics", duration: "2.1s", status: "ok" },
    { type: "llm_call", label: "Analyze CTR variance", duration: "14.2s", status: "ok" },
    { type: "tool_call", label: "Threshold check — budget flag", duration: "880ms", status: "warn" },
    { type: "llm_call", label: "Generate recommendation", duration: "9.3s", status: "ok" },
    { type: "output", label: "Route to decision inbox", duration: "110ms", status: "ok" },
  ],
  r4: [
    { type: "skill_load", label: "Load lead-router skill", duration: "55ms", status: "ok" },
    { type: "data_ingest", label: "Ingest Finovate lead CSV", duration: "1.8s", status: "ok" },
    { type: "llm_call", label: "Score and classify 23 leads", duration: "11.4s", status: "ok" },
    { type: "tool_call", label: "Push HOT leads to Slack", duration: "620ms", status: "ok" },
    { type: "tool_call", label: "Enroll WARM leads in sequence", duration: "480ms", status: "ok" },
    { type: "output", label: "Update HubSpot records", duration: "990ms", status: "ok" },
  ],
  r5: [
    { type: "skill_load", label: "Load deck-assembly skill", duration: "90ms", status: "ok" },
    { type: "data_ingest", label: "Pulling HubSpot pipeline data...", duration: "—", status: "ok" },
  ],
  r6: [
    { type: "skill_load", label: "Load seo-intelligence skill", duration: "50ms", status: "ok" },
    { type: "data_ingest", label: "Read link-building inbox", duration: "720ms", status: "ok" },
    { type: "llm_call", label: "Classify 7 emails by tier", duration: "5.8s", status: "ok" },
    { type: "output", label: "Deliver T1 drafts for review", duration: "85ms", status: "ok" },
  ],
  r7: [
    { type: "skill_load", label: "Load brand-voice-check skill", duration: "60ms", status: "ok" },
    { type: "data_ingest", label: "Fetch ad creative assets", duration: "950ms", status: "ok" },
    { type: "llm_call", label: "Run brand QC checks", duration: "4.2s", status: "err" },
    { type: "output", label: "Reject — brand score 62/100", duration: "75ms", status: "err" },
  ],
};

const SAFETY_METRICS = [
  { label: "PII Redaction", value: 100, runs: "96/96", ok: true },
  { label: "Data Boundary", value: 100, runs: "96/96", ok: true },
  { label: "Threshold Check", value: 89, runs: "85/96", ok: false },
  { label: "Hallucination Guard", value: 95, runs: "91/96", ok: true },
  { label: "Authorization", value: 100, runs: "96/96", ok: true },
];

type TabFilter = "All" | "completed" | "running" | "failed";
const TAB_FILTERS: TabFilter[] = ["All", "completed", "running", "failed"];

export default function AgentRunsPage() {
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState<TabFilter>("All");
  const [selectedRun, setSelectedRun] = useState<string | null>(null);

  const filtered = agentRuns.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = tabFilter === "All" || r.status === tabFilter;
    return matchSearch && matchTab;
  });

  const run = agentRuns.find((r) => r.id === selectedRun);
  const trace = selectedRun ? EXECUTION_TRACE[selectedRun] ?? [] : [];

  return (
    <div className="min-h-screen bg-[hsl(36,30%,98%)] p-6 space-y-6">
      {/* Header metrics */}
      <div>
        <h1 className="text-2xl font-bold text-[hsl(25,40%,18%)] mb-1">Agent Runs</h1>
        <p className="text-sm text-[hsl(25,20%,45%)] mb-5">Real-time execution logs and safety audit for all agent runs today</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { icon: <Activity className="w-4 h-4" />, label: "Runs Today", value: "96", color: "text-blue-600" },
            { icon: <Cpu className="w-4 h-4" />, label: "Total Tokens", value: "84.2K", color: "text-violet-600" },
            { icon: <DollarSign className="w-4 h-4" />, label: "Credit Cost", value: "$0.31", color: "text-emerald-600" },
            { icon: <Flag className="w-4 h-4" />, label: "Safety Flags", value: "3", color: "text-red-600" },
            { icon: <CheckCircle2 className="w-4 h-4" />, label: "Success Rate", value: "94%", color: "text-emerald-600" },
          ].map((m) => (
            <div key={m.label} className="bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-[0.75rem] p-4">
              <div className={cn("flex items-center gap-1.5 text-sm font-medium mb-1", m.color)}>
                {m.icon}
                <span className="text-[hsl(25,20%,45%)] font-normal text-xs">{m.label}</span>
              </div>
              <p className="text-xl font-bold text-[hsl(25,40%,18%)]">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 bg-[hsl(36,30%,94%)] border border-[hsl(30,15%,85%)] rounded-xl p-1">
          {TAB_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTabFilter(t)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
                tabFilter === t ? "bg-[hsl(25,62%,25%)] text-white" : "text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)]"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(25,20%,45%)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search runs..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[hsl(30,15%,85%)] bg-white text-[hsl(25,40%,18%)] focus:outline-none focus:ring-1 focus:ring-[hsl(25,62%,25%)]"
          />
        </div>
      </div>

      {/* Runs table */}
      <div className="bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-[0.75rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(30,15%,85%)] bg-[hsl(36,30%,93%)]">
                {["Run ID", "Name", "Status", "Duration", "Tokens", "Cost", "Confidence", "Safety Flags", "Steps", "Time", "Trace"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[hsl(25,20%,45%)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(30,15%,88%)]">
              {filtered.map((r) => {
                const sc = STATUS_CONFIG[r.status as RunStatus];
                return (
                  <tr key={r.id} className="hover:bg-[hsl(36,30%,94%)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[hsl(25,20%,45%)]">{r.id.toUpperCase()}</td>
                    <td className="px-4 py-3 font-medium text-[hsl(25,40%,18%)] whitespace-nowrap">{r.name}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full", sc.color)}>
                        {sc.icon}{sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[hsl(25,20%,45%)]">{r.duration}</td>
                    <td className="px-4 py-3 text-[hsl(25,20%,45%)]">{r.tokens}</td>
                    <td className="px-4 py-3 text-[hsl(25,20%,45%)]">{r.cost}</td>
                    <td className="px-4 py-3 w-32">
                      {r.confidence !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[hsl(30,15%,85%)] rounded-full h-1.5 overflow-hidden">
                            <div
                              className={cn("h-full rounded-full", r.confidence >= 0.9 ? "bg-emerald-500" : r.confidence >= 0.7 ? "bg-amber-400" : "bg-red-500")}
                              style={{ width: `${r.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-[hsl(25,20%,45%)] whitespace-nowrap">{Math.round((r.confidence ?? 0) * 100)}%</span>
                        </div>
                      ) : <span className="text-[hsl(25,20%,45%)]">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {r.safetyFlags > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                          <AlertTriangle className="w-3 h-3" />{r.safetyFlags}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />0
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[hsl(25,20%,45%)]">{r.steps ?? "—"}</td>
                    <td className="px-4 py-3 text-[hsl(25,20%,45%)]">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.time}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedRun(r.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[hsl(25,62%,25%)] hover:text-white text-[hsl(25,20%,45%)] transition-colors border border-[hsl(30,15%,85%)]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over panel */}
      {selectedRun && run && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedRun(null)} />
          <div className="w-full max-w-md bg-[hsl(36,30%,97%)] border-l border-[hsl(30,15%,85%)] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-[hsl(30,15%,85%)] flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[hsl(25,20%,45%)] uppercase tracking-wide mb-1">Execution Trace</p>
                <h3 className="font-bold text-[hsl(25,40%,18%)]">{run.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-[hsl(25,20%,45%)]">
                  <span>{run.id.toUpperCase()}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{run.time}</span>
                  <span>•</span>
                  <span>{run.duration}</span>
                </div>
              </div>
              <button onClick={() => setSelectedRun(null)} className="p-1.5 hover:bg-[hsl(30,15%,88%)] rounded-lg">
                <X className="w-4 h-4 text-[hsl(25,20%,45%)]" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Run metadata */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Tokens", value: run.tokens },
                  { label: "Cost", value: run.cost },
                  { label: "Steps", value: run.steps ?? "—" },
                  { label: "Safety Flags", value: run.safetyFlags },
                ].map((m) => (
                  <div key={m.label} className="bg-[hsl(36,30%,93%)] rounded-lg p-3">
                    <p className="text-xs text-[hsl(25,20%,45%)]">{m.label}</p>
                    <p className="font-semibold text-[hsl(25,40%,18%)] mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Execution steps */}
              <div>
                <p className="text-xs font-semibold text-[hsl(25,20%,45%)] uppercase tracking-wide mb-3">Execution Steps</p>
                <div className="space-y-2">
                  {trace.map((step, i) => (
                    <div key={i} className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border",
                      step.status === "ok" ? "bg-[hsl(36,30%,94%)] border-[hsl(30,15%,85%)]" :
                      step.status === "warn" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"
                    )}>
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                        step.status === "ok" ? "bg-[hsl(25,62%,25%)] text-white" :
                        step.status === "warn" ? "bg-amber-500 text-white" : "bg-red-500 text-white"
                      )}>
                        {STEP_ICONS[step.type] ?? <Zap className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[hsl(25,40%,18%)]">{step.label}</p>
                        <p className="text-[11px] text-[hsl(25,20%,45%)] mt-0.5 font-mono">{step.type} · {step.duration}</p>
                      </div>
                      {step.status !== "ok" && (
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", step.status === "warn" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>
                          {step.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety metrics */}
              <div>
                <p className="text-xs font-semibold text-[hsl(25,20%,45%)] uppercase tracking-wide mb-3">Safety Metrics</p>
                <div className="space-y-2.5">
                  {SAFETY_METRICS.map((m) => (
                    <div key={m.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[hsl(25,40%,18%)] font-medium">{m.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[hsl(25,20%,45%)]">{m.runs}</span>
                          <span className={cn("text-xs font-bold", m.ok ? "text-emerald-600" : "text-amber-600")}>{m.value}%</span>
                        </div>
                      </div>
                      <div className="bg-[hsl(30,15%,85%)] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", m.ok ? "bg-emerald-500" : "bg-amber-400")}
                          style={{ width: `${m.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <AIRecommendations page="agent-runs" />
    </div>
  );
}
