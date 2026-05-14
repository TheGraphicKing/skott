// /Users/navaneethakrishnan/Desktop/skott/app/observe/audit-trail/page.tsx
"use client";

import { useState } from "react";
import {
  Bot,
  User,
  Server,
  Shield,
  Download,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  CalendarRange,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

type ActorType = "AI Agent" | "Human" | "System" | "Guardrail";
type EventType = "agent" | "user" | "system" | "guardrail";

interface AuditEvent {
  id: string;
  timestamp: string;
  type: EventType;
  actor: ActorType;
  description: string;
  details: {
    input?: string;
    output?: string;
    metadata?: string;
  };
}

const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "AE-0091",
    timestamp: "2026-05-14  11:02:14",
    type: "agent",
    actor: "AI Agent",
    description: "Agent published LinkedIn post after brand QC pass",
    details: {
      input: "Post: 'AI agents are transforming how enterprises operate...' | Brand score: 94/100",
      output: "Published to LinkedIn. Post ID: li_9823411. Estimated reach: 28,400.",
      metadata: "Agent: Social Media Agent | Skill: social-publishing | Run: R2",
    },
  },
  {
    id: "AE-0090",
    timestamp: "2026-05-14  10:48:33",
    type: "user",
    actor: "Human",
    description: "User approved budget increase for LI-Retargeting-01",
    details: {
      input: "Decision ID: d1 | Requested: +$1,680/wk | Flagged check: threshold",
      output: "Approved by: navaneeth@lyzr.ai | Override justification: 'Strong MQL efficiency warrants increase'",
      metadata: "Action taken via Decision Inbox | Run: Campaign Optimizer",
    },
  },
  {
    id: "AE-0089",
    timestamp: "2026-05-14  10:22:07",
    type: "system",
    actor: "System",
    description: "System auto-routed 8 hot leads to AE Slack",
    details: {
      input: "Lead batch: Finovate Fall (23 leads scored) | HOT threshold: ≥80 score",
      output: "8 HOT leads pushed to #ae-alerts Slack channel. HubSpot records updated.",
      metadata: "Triggered by: Lead Router skill | Run: R4 | No human action required",
    },
  },
  {
    id: "AE-0088",
    timestamp: "2026-05-14  09:58:41",
    type: "guardrail",
    actor: "Guardrail",
    description: "Guardrail blocked post: brand voice score 62/100 below threshold",
    details: {
      input: "Post draft: 'Check out our new AI platform!!' | Brand score: 62/100 | Threshold: 85",
      output: "Post blocked. Reason: Informal tone, missing value proposition, exclamation overuse.",
      metadata: "Rule: MUST ALWAYS — brand_voice_check | Agent: Social Media Agent | Run: R7",
    },
  },
  {
    id: "AE-0087",
    timestamp: "2026-05-14  09:15:22",
    type: "agent",
    actor: "AI Agent",
    description: "Agent generated weekly deck — 9 sections completed",
    details: {
      input: "Data sources: HubSpot pipeline, GA4 traffic, Google Ads, LinkedIn Ads, Finovate leads",
      output: "Deck: marketing_weekly_may14.pdf | 9 sections | 22 slides | Sent to CMO inbox.",
      metadata: "Agent: Chief of Staff Agent | Skill: deck-assembly | Run: R5",
    },
  },
  {
    id: "AE-0086",
    timestamp: "2026-05-14  08:44:19",
    type: "user",
    actor: "Human",
    description: "User approved campaign budget change +$1,680/wk",
    details: {
      input: "Campaign: G-Brand-01 | Change: +40% budget | Previous: $4,200/wk → New: $5,880/wk",
      output: "Approved. Google Ads API budget update queued for next business hour.",
      metadata: "Approver: mark@lyzr.ai | Source: Decision Inbox AE-0090",
    },
  },
  {
    id: "AE-0085",
    timestamp: "2026-05-14  08:12:05",
    type: "system",
    actor: "System",
    description: "System triggered wiki ingest on Q2 campaign output",
    details: {
      input: "Source: Q2_campaign_summary.pdf | Pages: 14 | Entity tags: 6",
      output: "14 wiki pages updated. 2 new synthesis pages created. Entity: Lyzr Architect updated.",
      metadata: "Triggered by: wiki-ingest skill | Agent: Wiki Curator | Run: R8",
    },
  },
  {
    id: "AE-0084",
    timestamp: "2026-05-14  07:31:48",
    type: "guardrail",
    actor: "Guardrail",
    description: "Agent flagged duplicate campaign: similar to Q1 GSI campaign",
    details: {
      input: "Proposed: 'Accenture BFSI Retarget Q2' | Similarity: 87% match to 'Q1-GSI-BFSI-01'",
      output: "Campaign creation paused. Flagged to Partnership Agent for differentiation review.",
      metadata: "Rule: MUST ALWAYS — duplicate_campaign_check | Agent: Campaign Optimizer",
    },
  },
];

const EVENT_CONFIG: Record<EventType, { color: string; iconBg: string; icon: React.ReactNode; label: string }> = {
  agent: { color: "border-emerald-300", iconBg: "bg-emerald-500", icon: <Bot className="w-3.5 h-3.5 text-white" />, label: "AI Agent" },
  user: { color: "border-blue-300", iconBg: "bg-blue-500", icon: <User className="w-3.5 h-3.5 text-white" />, label: "Human" },
  system: { color: "border-gray-300", iconBg: "bg-gray-500", icon: <Server className="w-3.5 h-3.5 text-white" />, label: "System" },
  guardrail: { color: "border-amber-300", iconBg: "bg-amber-500", icon: <Shield className="w-3.5 h-3.5 text-white" />, label: "Guardrail" },
};

const ACTOR_BADGE: Record<ActorType, string> = {
  "AI Agent": "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Human": "bg-blue-100 text-blue-700 border border-blue-200",
  "System": "bg-gray-100 text-gray-700 border border-gray-200",
  "Guardrail": "bg-amber-100 text-amber-700 border border-amber-200",
};

export default function AuditTrailPage() {
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  const [typeFilter, setTypeFilter] = useState<EventType | "all">("all");

  const toggleExpand = (id: string) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = AUDIT_EVENTS.filter((e) => typeFilter === "all" || e.type === typeFilter);

  return (
    <div className="min-h-screen bg-[hsl(36,30%,98%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(25,40%,18%)] mb-1">Audit Trail</h1>
          <p className="text-sm text-[hsl(25,20%,45%)]">Immutable log of all agent, human, system, and guardrail actions</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date range (static) */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-lg text-sm text-[hsl(25,20%,45%)]">
            <CalendarRange className="w-4 h-4" />
            <span>May 14, 2026</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[hsl(30,15%,85%)] rounded-lg text-[hsl(25,20%,45%)] hover:bg-[hsl(36,30%,94%)] transition-colors">
            <Download className="w-3.5 h-3.5" />CSV
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[hsl(30,15%,85%)] rounded-lg text-[hsl(25,20%,45%)] hover:bg-[hsl(36,30%,94%)] transition-colors">
            <FileText className="w-3.5 h-3.5" />PDF
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {(["all", "agent", "user", "system", "guardrail"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full border transition-all capitalize",
              typeFilter === f
                ? "bg-[hsl(25,62%,25%)] text-white border-[hsl(25,62%,25%)]"
                : "border-[hsl(30,15%,85%)] text-[hsl(25,20%,45%)] hover:bg-[hsl(36,30%,94%)]"
            )}
          >
            {f === "all" ? "All Events" : EVENT_CONFIG[f]?.label ?? f}
          </button>
        ))}
        <span className="ml-auto text-xs text-[hsl(25,20%,45%)] self-center">{filtered.length} events</span>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-[hsl(30,15%,85%)]" />

        <div className="space-y-4">
          {filtered.map((event) => {
            const cfg = EVENT_CONFIG[event.type];
            const isExpanded = expandedEvents[event.id];
            return (
              <div key={event.id} className="relative">
                {/* Icon circle */}
                <div className={cn("absolute -left-8 w-7 h-7 rounded-full flex items-center justify-center shadow-sm border-2 border-white", cfg.iconBg)}>
                  {cfg.icon}
                </div>

                <div className={cn(
                  "bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-[0.75rem] p-4 ml-2",
                  event.type === "guardrail" && "border-amber-200 bg-amber-50/30"
                )}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-mono text-[11px] text-[hsl(25,20%,45%)] bg-[hsl(36,30%,93%)] px-2 py-0.5 rounded">{event.id}</span>
                        <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", ACTOR_BADGE[event.actor])}>
                          {event.actor}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[hsl(25,40%,18%)]">{event.description}</p>
                      <p className="text-xs text-[hsl(25,20%,45%)] mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.timestamp}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleExpand(event.id)}
                      className="text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)] p-1 rounded-lg hover:bg-[hsl(36,30%,90%)] transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[hsl(30,15%,85%)] space-y-2">
                      {event.details.input && (
                        <div>
                          <p className="text-[11px] font-semibold text-[hsl(25,20%,45%)] uppercase tracking-wide mb-1">Input</p>
                          <p className="text-xs text-[hsl(25,40%,18%)] bg-[hsl(36,30%,93%)] rounded-lg p-2.5 leading-relaxed">{event.details.input}</p>
                        </div>
                      )}
                      {event.details.output && (
                        <div>
                          <p className="text-[11px] font-semibold text-[hsl(25,20%,45%)] uppercase tracking-wide mb-1">Output</p>
                          <p className="text-xs text-[hsl(25,40%,18%)] bg-[hsl(36,30%,93%)] rounded-lg p-2.5 leading-relaxed">{event.details.output}</p>
                        </div>
                      )}
                      {event.details.metadata && (
                        <div>
                          <p className="text-[11px] font-semibold text-[hsl(25,20%,45%)] uppercase tracking-wide mb-1">Metadata</p>
                          <p className="text-xs text-[hsl(25,20%,45%)] font-mono bg-[hsl(36,30%,93%)] rounded-lg p-2.5 leading-relaxed">{event.details.metadata}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <AIRecommendations page="audit-trail" />
    </div>
  );
}
