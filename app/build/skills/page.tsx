// /Users/navaneethakrishnan/Desktop/skott/app/build/skills/page.tsx
"use client";

import { useState } from "react";
import {
  Puzzle,
  FileText,
  Clock,
  Activity,
  Search,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

type SkillStatus = "ACTIVE" | "AVAILABLE" | "DRAFT";

interface Skill {
  id: string;
  name: string;
  description: string;
  status: SkillStatus;
  runsThisWeek: number;
  lastUsed: string;
  category: string;
}

const SKILLS: Skill[] = [
  { id: "s1", name: "campaign-analysis", description: "Analyzes campaign performance data from Google Ads, LinkedIn, Meta. Surfaces anomalies and reallocation recommendations.", status: "ACTIVE", runsThisWeek: 48, lastUsed: "4m ago", category: "Performance" },
  { id: "s2", name: "mql-reporting", description: "Generates MQL gap reports from HubSpot. Compares actuals to monthly targets by channel and stage.", status: "ACTIVE", runsThisWeek: 12, lastUsed: "1h ago", category: "Reporting" },
  { id: "s3", name: "social-publishing", description: "Schedules and publishes posts to LinkedIn, Twitter, Reddit, Instagram via platform APIs.", status: "ACTIVE", runsThisWeek: 34, lastUsed: "2m ago", category: "Social" },
  { id: "s4", name: "brand-voice-check", description: "Scores content against Lyzr brand voice guidelines (0–100). Blocks publishing below threshold.", status: "ACTIVE", runsThisWeek: 21, lastUsed: "6m ago", category: "Brand" },
  { id: "s5", name: "wiki-ingest", description: "Ingests documents, decks, and reports into the LLM wiki. Extracts entities, links, and synthesis.", status: "ACTIVE", runsThisWeek: 7, lastUsed: "45m ago", category: "Knowledge" },
  { id: "s6", name: "wiki-query", description: "Answers structured questions from the LLM wiki using semantic search and entity resolution.", status: "ACTIVE", runsThisWeek: 29, lastUsed: "8m ago", category: "Knowledge" },
  { id: "s7", name: "wiki-lint", description: "Weekly lint pass on all wiki nodes — checks for stale facts, broken links, missing sources.", status: "ACTIVE", runsThisWeek: 1, lastUsed: "3d ago", category: "Knowledge" },
  { id: "s8", name: "seo-intelligence", description: "Classifies link-building emails by DA tier, detects AEO citation gaps vs competitors.", status: "ACTIVE", runsThisWeek: 18, lastUsed: "30m ago", category: "SEO" },
  { id: "s9", name: "event-intake", description: "Processes event lead exports. Scores leads, classifies HOT/WARM/COLD, routes to CRM.", status: "ACTIVE", runsThisWeek: 8, lastUsed: "15m ago", category: "Events" },
  { id: "s10", name: "content-distribution", description: "Distributes published content to WordPress, LinkedIn, email lists, and Slack channels.", status: "ACTIVE", runsThisWeek: 5, lastUsed: "2h ago", category: "Content" },
  { id: "s11", name: "budget-optimizer", description: "Generates weekly budget reallocation recommendations based on ROAS and MQL efficiency.", status: "AVAILABLE", runsThisWeek: 0, lastUsed: "6d ago", category: "Performance" },
  { id: "s12", name: "anomaly-detector", description: "Monitors campaign KPIs for statistically significant drops. Triggers alerts and routes to inbox.", status: "ACTIVE", runsThisWeek: 22, lastUsed: "1h ago", category: "Performance" },
  { id: "s13", name: "lead-router", description: "Routes inbound leads to AEs, SDR sequences, or CRM stages based on ICP scoring rules.", status: "ACTIVE", runsThisWeek: 14, lastUsed: "10m ago", category: "Events" },
  { id: "s14", name: "pdf-generator", description: "Generates structured PDF reports and decks from structured agent outputs and templates.", status: "AVAILABLE", runsThisWeek: 2, lastUsed: "5d ago", category: "Reporting" },
  { id: "s15", name: "competitor-intel", description: "Tracks competitor ad creative, landing pages, and content updates. Surfaces weekly diffs.", status: "DRAFT", runsThisWeek: 0, lastUsed: "Never", category: "Intelligence" },
];

const STATUS_COLORS: Record<SkillStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  AVAILABLE: "bg-gray-100 text-gray-600 border border-gray-200",
  DRAFT: "bg-amber-100 text-amber-700 border border-amber-200",
};

const CATEGORY_COLORS: Record<string, string> = {
  Performance: "bg-orange-100 text-orange-700",
  Reporting: "bg-blue-100 text-blue-700",
  Social: "bg-violet-100 text-violet-700",
  Brand: "bg-rose-100 text-rose-700",
  Knowledge: "bg-indigo-100 text-indigo-700",
  SEO: "bg-green-100 text-green-700",
  Events: "bg-pink-100 text-pink-700",
  Content: "bg-cyan-100 text-cyan-700",
  Intelligence: "bg-purple-100 text-purple-700",
};

export default function SkillsManagerPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SkillStatus | "ALL">("ALL");

  const filtered = SKILLS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    ACTIVE: SKILLS.filter(s => s.status === "ACTIVE").length,
    AVAILABLE: SKILLS.filter(s => s.status === "AVAILABLE").length,
    DRAFT: SKILLS.filter(s => s.status === "DRAFT").length,
  };

  return (
    <div className="min-h-screen bg-[hsl(36,30%,98%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(25,40%,18%)] mb-1">Skills Manager</h1>
          <p className="text-sm text-[hsl(25,20%,45%)]">Configure and monitor agent skill modules</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-sm font-semibold text-[hsl(25,40%,18%)]">{SKILLS.length} Skills</span>
            {(["ACTIVE", "AVAILABLE", "DRAFT"] as SkillStatus[]).map((s) => (
              <span key={s} className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", STATUS_COLORS[s])}>
                {counts[s]} {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(25,20%,45%)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[hsl(30,15%,85%)] bg-white text-[hsl(25,40%,18%)] focus:outline-none focus:ring-1 focus:ring-[hsl(25,62%,25%)]"
          />
        </div>
        <div className="flex gap-1 bg-[hsl(36,30%,94%)] border border-[hsl(30,15%,85%)] rounded-xl p-1">
          {(["ALL", "ACTIVE", "AVAILABLE", "DRAFT"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                statusFilter === f ? "bg-[hsl(25,62%,25%)] text-white" : "text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)]"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Skills grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((skill) => (
          <div
            key={skill.id}
            className="bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-[0.75rem] p-5 flex flex-col gap-3 hover:shadow-sm transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[hsl(25,62%,25%)] flex items-center justify-center shrink-0">
                  <Puzzle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[hsl(25,40%,18%)] font-mono">{skill.name}</p>
                  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", CATEGORY_COLORS[skill.category] ?? "bg-gray-100 text-gray-600")}>
                    {skill.category}
                  </span>
                </div>
              </div>
              <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0", STATUS_COLORS[skill.status])}>
                {skill.status}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-[hsl(25,20%,45%)] leading-relaxed flex-1">{skill.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[hsl(36,30%,93%)] rounded-lg p-2.5">
                <div className="flex items-center gap-1 text-[hsl(25,20%,45%)] mb-1">
                  <Activity className="w-3 h-3" />
                  <span className="text-[10px]">Runs this week</span>
                </div>
                <p className="font-bold text-[hsl(25,40%,18%)]">{skill.runsThisWeek}</p>
              </div>
              <div className="bg-[hsl(36,30%,93%)] rounded-lg p-2.5">
                <div className="flex items-center gap-1 text-[hsl(25,20%,45%)] mb-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px]">Last used</span>
                </div>
                <p className="font-bold text-[hsl(25,40%,18%)] text-sm">{skill.lastUsed}</p>
              </div>
            </div>

            {/* Edit button */}
            <button className="flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-medium border border-[hsl(30,15%,85%)] rounded-lg text-[hsl(25,20%,45%)] hover:bg-[hsl(36,30%,93%)] hover:text-[hsl(25,40%,18%)] transition-colors">
              <FileText className="w-3.5 h-3.5" />
              Edit SKILL.md
              <ChevronRight className="w-3 h-3 ml-auto" />
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[hsl(25,20%,45%)]">
          <Puzzle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No skills match your search</p>
        </div>
      )}
      <AIRecommendations page="skills" />
    </div>
  );
}
