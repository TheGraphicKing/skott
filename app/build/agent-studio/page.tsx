// /Users/navaneethakrishnan/Desktop/skott/app/build/agent-studio/page.tsx
"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Bot,
  Settings,
  FileText,
  ScrollText,
  Activity,
  Clock,
  Zap,
  ChevronRight,
  Cpu,
  CheckCircle2,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRecommendations } from "@/components/shared/AIRecommendations";
import { agents } from "@/data/mock";

const STATUS_CONFIG: Record<string, { color: string; dot: string }> = {
  active: { color: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  idle: { color: "bg-gray-100 text-gray-600 border border-gray-200", dot: "bg-gray-400" },
};

const ROLE_COLORS: Record<string, string> = {
  "Tier 1 Orchestrator": "bg-purple-100 text-purple-700",
  "Social Media Manager": "bg-blue-100 text-blue-700",
  "Performance Marketing": "bg-orange-100 text-orange-700",
  "SEO / AEO / GEO": "bg-green-100 text-green-700",
  "Events Manager": "bg-pink-100 text-pink-700",
  "Content & Campaigns": "bg-indigo-100 text-indigo-700",
  "Brand Design": "bg-rose-100 text-rose-700",
  "GSI Partnerships": "bg-cyan-100 text-cyan-700",
  "Chief of Staff": "bg-violet-100 text-violet-700",
  "LLM Wiki": "bg-amber-100 text-amber-700",
};

interface NewAgentForm {
  name: string;
  role: string;
  model: string;
}

export default function AgentStudioPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<NewAgentForm>({ name: "", role: "", model: "Claude Sonnet 4" });
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "idle">("all");

  const filtered = agents.filter((a) => filterStatus === "all" || a.status === filterStatus);

  const activeCount = agents.filter((a) => a.status === "active").length;
  const idleCount = agents.filter((a) => a.status === "idle").length;

  return (
    <div className="min-h-screen bg-[hsl(36,30%,98%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(25,40%,18%)] mb-1">Agent Studio</h1>
          <p className="text-sm text-[hsl(25,20%,45%)]">Configure, monitor, and manage your AI marketing agents</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-sm font-medium text-[hsl(25,40%,18%)]">
              <span className="font-bold">{agents.length}</span> Agents
            </span>
            <span className="flex items-center gap-1.5 text-sm text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />{activeCount} Active
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-gray-400" />{idleCount} Idle
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(25,62%,25%)] text-white text-sm font-medium rounded-xl hover:bg-[hsl(25,62%,20%)] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Agent
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-[hsl(36,30%,94%)] border border-[hsl(30,15%,85%)] rounded-xl p-1 w-fit">
        {(["all", "active", "idle"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
              filterStatus === f ? "bg-[hsl(25,62%,25%)] text-white" : "text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)]"
            )}
          >
            {f === "all" ? "All Agents" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Agent grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((agent) => {
          const sc = STATUS_CONFIG[agent.status];
          const roleColor = ROLE_COLORS[agent.role] ?? "bg-gray-100 text-gray-700";
          return (
            <div
              key={agent.id}
              className="bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-[0.75rem] p-5 flex flex-col gap-4 hover:shadow-sm transition-all"
            >
              {/* Card header */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[hsl(25,62%,25%)] flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[hsl(25,40%,18%)] text-sm leading-tight">{agent.name}</h3>
                    <span className={cn("flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0", sc.color)}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />
                      {agent.status}
                    </span>
                  </div>
                  <span className={cn("inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-1", roleColor)}>
                    {agent.role}
                  </span>
                </div>
              </div>

              {/* Model */}
              <div className="flex items-center gap-1.5 text-xs text-[hsl(25,20%,45%)]">
                <Cpu className="w-3.5 h-3.5" />
                <span>{agent.model}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Runs Today", value: agent.runsToday, icon: <Activity className="w-3 h-3" /> },
                  { label: "Avg Latency", value: agent.avgLatency, icon: <Zap className="w-3 h-3" /> },
                  { label: "Last Run", value: agent.lastRun, icon: <Clock className="w-3 h-3" /> },
                ].map((s) => (
                  <div key={s.label} className="bg-[hsl(36,30%,93%)] rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-[hsl(25,20%,45%)] mb-1">{s.icon}</div>
                    <p className="font-bold text-sm text-[hsl(25,40%,18%)]">{s.value}</p>
                    <p className="text-[10px] text-[hsl(25,20%,45%)] mt-0.5 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Current task */}
              {agent.status === "active" && agent.tasks.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                  <p className="text-[11px] text-emerald-600 font-semibold mb-0.5">Current Task</p>
                  <p className="text-xs text-emerald-800 leading-snug">{agent.tasks[0]}</p>
                  {agent.tasks.length > 1 && (
                    <p className="text-[10px] text-emerald-600 mt-1">+{agent.tasks.length - 1} more tasks</p>
                  )}
                </div>
              )}

              {agent.status === "idle" && (
                <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-500">Agent is idle — no active tasks</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-[hsl(30,15%,85%)] rounded-lg text-[hsl(25,20%,45%)] hover:bg-[hsl(36,30%,93%)] hover:text-[hsl(25,40%,18%)] transition-colors">
                  <Settings className="w-3 h-3" />View Config
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-[hsl(30,15%,85%)] rounded-lg text-[hsl(25,20%,45%)] hover:bg-[hsl(36,30%,93%)] hover:text-[hsl(25,40%,18%)] transition-colors">
                  <FileText className="w-3 h-3" />Edit SOUL.md
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-[hsl(30,15%,85%)] rounded-lg text-[hsl(25,20%,45%)] hover:bg-[hsl(36,30%,93%)] hover:text-[hsl(25,40%,18%)] transition-colors">
                  <ScrollText className="w-3 h-3" />Logs
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Agent modal overlay */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-[hsl(36,30%,97%)] rounded-2xl border border-[hsl(30,15%,85%)] shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[hsl(30,15%,85%)]">
              <h2 className="font-bold text-[hsl(25,40%,18%)]">Create New Agent</h2>
              <button onClick={() => setShowCreate(false)} className="p-1.5 hover:bg-[hsl(30,15%,88%)] rounded-lg">
                <X className="w-4 h-4 text-[hsl(25,20%,45%)]" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[hsl(25,20%,45%)] block mb-1.5">Agent Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Demand Gen Agent"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-[hsl(30,15%,85%)] bg-white text-[hsl(25,40%,18%)] focus:outline-none focus:ring-1 focus:ring-[hsl(25,62%,25%)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[hsl(25,20%,45%)] block mb-1.5">Role / Department</label>
                <input
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  placeholder="e.g. Demand Generation"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-[hsl(30,15%,85%)] bg-white text-[hsl(25,40%,18%)] focus:outline-none focus:ring-1 focus:ring-[hsl(25,62%,25%)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[hsl(25,20%,45%)] block mb-1.5">Model</label>
                <select
                  value={form.model}
                  onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-[hsl(30,15%,85%)] bg-white text-[hsl(25,40%,18%)] focus:outline-none focus:ring-1 focus:ring-[hsl(25,62%,25%)]"
                >
                  <option>Claude Sonnet 4</option>
                  <option>Claude Haiku 3.5</option>
                  <option>Claude Opus 4</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium border border-[hsl(30,15%,85%)] rounded-xl text-[hsl(25,20%,45%)] hover:bg-[hsl(36,30%,93%)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium bg-[hsl(25,62%,25%)] text-white rounded-xl hover:bg-[hsl(25,62%,20%)] transition-colors"
                >
                  Create Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <AIRecommendations page="agent-studio" />
    </div>
  );
}
