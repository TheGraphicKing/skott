// /Users/navaneethakrishnan/Desktop/skott/app/build/skill-flows/page.tsx
"use client";

import { useState } from "react";
import {
  GitBranch,
  CheckCircle2,
  Pause,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Cpu,
  Database,
  MessageSquare,
  ArrowRight,
  GripVertical,
  Layers,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

interface FlowStep {
  id: string;
  type: "skill" | "condition" | "approval" | "output" | "trigger";
  label: string;
  detail: string;
  agent?: string;
}

interface SkillFlow {
  id: string;
  name: string;
  active: boolean;
  stepCount: number;
  approvalGates: number;
  lastRun: string;
  description: string;
  steps: FlowStep[];
}

const FLOWS: SkillFlow[] = [
  {
    id: "f1",
    name: "Weekly Marketing Deck Assembly",
    active: true,
    stepCount: 9,
    approvalGates: 1,
    lastRun: "Friday 08:00",
    description: "Pulls data from HubSpot, GA4, Google Ads, LinkedIn. Generates 9-section deck. Routes to CMO for review.",
    steps: [
      { id: "s1", type: "trigger", label: "Cron Trigger", detail: "Every Friday 08:00 IST", agent: "Master Orchestrator" },
      { id: "s2", type: "skill", label: "wiki-query", detail: "Pull last week's campaign summaries", agent: "Chief of Staff Agent" },
      { id: "s3", type: "skill", label: "mql-reporting", detail: "Generate MQL gap vs monthly target", agent: "Chief of Staff Agent" },
      { id: "s4", type: "skill", label: "campaign-analysis", detail: "Summarize top 5 campaign anomalies", agent: "Campaign Optimizer" },
      { id: "s5", type: "skill", label: "seo-intelligence", detail: "Append weekly SEO digest", agent: "SEO Intelligence Agent" },
      { id: "s6", type: "skill", label: "event-intake", detail: "Add event pipeline update", agent: "Events Command Agent" },
      { id: "s7", type: "skill", label: "pdf-generator", detail: "Compile and format 22-slide deck", agent: "Chief of Staff Agent" },
      { id: "s8", type: "approval", label: "CMO Review Gate", detail: "Route deck to CMO inbox for sign-off", agent: "Master Orchestrator" },
      { id: "s9", type: "output", label: "Distribute", detail: "Send to 28 team members via Slack + email", agent: "Master Orchestrator" },
    ],
  },
  {
    id: "f2",
    name: "Campaign Anomaly Detection",
    active: true,
    stepCount: 7,
    approvalGates: 1,
    lastRun: "1h ago",
    description: "Monitors all live campaigns every 4h. Detects CTR, CPA, and spend anomalies. Routes recommendations to decision inbox.",
    steps: [
      { id: "s1", type: "trigger", label: "Schedule Trigger", detail: "Every 4 hours, business hours", agent: "Master Orchestrator" },
      { id: "s2", type: "skill", label: "campaign-analysis", detail: "Fetch last 4h metrics from all platforms", agent: "Campaign Optimizer" },
      { id: "s3", type: "skill", label: "anomaly-detector", detail: "Flag metrics with >15% variance", agent: "Campaign Optimizer" },
      { id: "s4", type: "condition", label: "Anomaly Found?", detail: "If yes: generate recommendation. If no: log OK.", agent: "Master Orchestrator" },
      { id: "s5", type: "skill", label: "budget-optimizer", detail: "Generate reallocation recommendation", agent: "Campaign Optimizer" },
      { id: "s6", type: "approval", label: "Human Decision Gate", detail: "Route to Decision Inbox if budget delta >$500", agent: "Master Orchestrator" },
      { id: "s7", type: "output", label: "Update Wiki", detail: "Log anomaly and resolution to wiki-ingest", agent: "Wiki Curator" },
    ],
  },
  {
    id: "f3",
    name: "Lead Intake & Routing",
    active: true,
    stepCount: 6,
    approvalGates: 0,
    lastRun: "10m ago",
    description: "Processes inbound event leads, scores them via ICP match, and routes HOT/WARM/COLD to appropriate channels.",
    steps: [
      { id: "s1", type: "trigger", label: "Webhook Trigger", detail: "On lead export upload or HubSpot form submit", agent: "Events Command Agent" },
      { id: "s2", type: "skill", label: "event-intake", detail: "Parse and normalize lead data", agent: "Events Command Agent" },
      { id: "s3", type: "skill", label: "wiki-query", detail: "Match against ICP profile and company list", agent: "Events Command Agent" },
      { id: "s4", type: "skill", label: "lead-router", detail: "Score and classify HOT / WARM / COLD", agent: "Events Command Agent" },
      { id: "s5", type: "output", label: "Route HOT Leads", detail: "Push to #ae-alerts Slack with contact card", agent: "Events Command Agent" },
      { id: "s6", type: "output", label: "Enroll WARM Leads", detail: "Add to SDR email sequence in HubSpot", agent: "Events Command Agent" },
    ],
  },
  {
    id: "f4",
    name: "Playbook Distribution",
    active: true,
    stepCount: 5,
    approvalGates: 1,
    lastRun: "2d ago",
    description: "On new playbook publish, distributes to WordPress, LinkedIn, email list, and Slack channels with channel-specific formatting.",
    steps: [
      { id: "s1", type: "trigger", label: "Manual Trigger", detail: "CMO approves new playbook", agent: "Content Strategist" },
      { id: "s2", type: "skill", label: "brand-voice-check", detail: "Score content for brand compliance", agent: "Brand QC Agent" },
      { id: "s3", type: "approval", label: "Brand QC Gate", detail: "Block if score <85/100", agent: "Brand QC Agent" },
      { id: "s4", type: "skill", label: "content-distribution", detail: "Push to WordPress, LinkedIn, email", agent: "Content Strategist" },
      { id: "s5", type: "output", label: "Notify Slack", detail: "Post to #marketing-updates with preview", agent: "Master Orchestrator" },
    ],
  },
  {
    id: "f5",
    name: "Wiki Ingest Pipeline",
    active: true,
    stepCount: 6,
    approvalGates: 0,
    lastRun: "45m ago",
    description: "Ingests uploaded documents, extracts entities and concepts, and updates wiki nodes with new synthesis.",
    steps: [
      { id: "s1", type: "trigger", label: "Upload Trigger", detail: "On new document added to Knowledge Base", agent: "Wiki Curator" },
      { id: "s2", type: "skill", label: "wiki-ingest", detail: "Parse document, extract entities and facts", agent: "Wiki Curator" },
      { id: "s3", type: "skill", label: "wiki-query", detail: "Link extracted entities to existing nodes", agent: "Wiki Curator" },
      { id: "s4", type: "skill", label: "wiki-lint", detail: "Check for conflicts with existing wiki data", agent: "Wiki Curator" },
      { id: "s5", type: "condition", label: "Conflict?", detail: "If yes: flag for review. If no: auto-publish.", agent: "Wiki Curator" },
      { id: "s6", type: "output", label: "Update Wiki Nodes", detail: "Publish updated pages and log change history", agent: "Wiki Curator" },
    ],
  },
  {
    id: "f6",
    name: "Brand QC Gate",
    active: false,
    stepCount: 4,
    approvalGates: 1,
    lastRun: "3d ago",
    description: "Standalone QC gate that runs brand voice, visual, and legal checks on any content before publishing.",
    steps: [
      { id: "s1", type: "trigger", label: "Content Submitted", detail: "Any agent submits content for publishing", agent: "Brand QC Agent" },
      { id: "s2", type: "skill", label: "brand-voice-check", detail: "Score on tone, messaging, accuracy", agent: "Brand QC Agent" },
      { id: "s3", type: "condition", label: "Score ≥85?", detail: "PASS: route to publish. FAIL: block + log.", agent: "Brand QC Agent" },
      { id: "s4", type: "approval", label: "Override Gate", detail: "Human can override with justification", agent: "Master Orchestrator" },
    ],
  },
];

const STEP_TYPE_CONFIG: Record<FlowStep["type"], { icon: React.ReactNode; color: string; bg: string }> = {
  trigger: { icon: <Zap className="w-3 h-3" />, color: "text-amber-700", bg: "bg-amber-500" },
  skill: { icon: <Cpu className="w-3 h-3" />, color: "text-blue-700", bg: "bg-blue-500" },
  condition: { icon: <GitBranch className="w-3 h-3" />, color: "text-violet-700", bg: "bg-violet-500" },
  approval: { icon: <ShieldCheck className="w-3 h-3" />, color: "text-red-700", bg: "bg-red-500" },
  output: { icon: <ArrowRight className="w-3 h-3" />, color: "text-emerald-700", bg: "bg-emerald-500" },
};

function StepDots({ steps, active }: { steps: FlowStep[]; active: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const cfg = STEP_TYPE_CONFIG[step.type];
        return (
          <div key={step.id} className="flex items-center gap-1">
            <div
              className={cn("w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0", cfg.bg, !active && "opacity-50")}
              title={step.label}
            >
              {cfg.icon}
            </div>
            {i < steps.length - 1 && (
              <div className={cn("w-3 h-0.5 rounded", active ? "bg-[hsl(30,15%,78%)]" : "bg-[hsl(30,15%,85%)]")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SkillFlowsPage() {
  const [expandedFlows, setExpandedFlows] = useState<Record<string, boolean>>({});

  const toggleFlow = (id: string) => {
    setExpandedFlows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeFlows = FLOWS.filter((f) => f.active).length;
  const totalSteps = FLOWS.reduce((sum, f) => sum + f.stepCount, 0);
  const totalGates = FLOWS.reduce((sum, f) => sum + f.approvalGates, 0);

  return (
    <div className="min-h-screen bg-[hsl(36,30%,98%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(25,40%,18%)] mb-1">Skill Flows</h1>
          <p className="text-sm text-[hsl(25,20%,45%)]">Multi-skill pipelines that orchestrate complex agent workflows</p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[hsl(25,20%,45%)]">
            <span className="flex items-center gap-1.5 font-medium text-[hsl(25,40%,18%)]">
              <Layers className="w-3.5 h-3.5" /><span className="font-bold">{FLOWS.length}</span> flows
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /><span className="font-semibold">{totalSteps}</span> steps
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /><span className="font-semibold">{totalGates}</span> approval gates
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />{activeFlows} active
            </span>
          </div>
        </div>
      </div>

      {/* Flow cards */}
      <div className="space-y-4">
        {FLOWS.map((flow) => {
          const isExpanded = expandedFlows[flow.id];
          return (
            <div
              key={flow.id}
              className={cn(
                "bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-[0.75rem] overflow-hidden transition-all",
                !flow.active && "opacity-70"
              )}
            >
              {/* Card header */}
              <div className="p-5">
                <div className="flex flex-wrap items-start gap-3 justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                      flow.active ? "bg-[hsl(25,62%,25%)]" : "bg-gray-400"
                    )}>
                      <GitBranch className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[hsl(25,40%,18%)]">{flow.name}</h3>
                        <span className={cn(
                          "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full",
                          flow.active
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        )}>
                          {flow.active ? <CheckCircle2 className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                          {flow.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(25,20%,45%)] leading-relaxed mb-3">{flow.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[hsl(25,20%,45%)]">
                        <span className="flex items-center gap-1"><Cpu className="w-3 h-3" />{flow.stepCount} steps</span>
                        {flow.approvalGates > 0 && (
                          <span className="flex items-center gap-1 text-amber-600 font-medium"><ShieldCheck className="w-3 h-3" />{flow.approvalGates} approval gate{flow.approvalGates > 1 ? "s" : ""}</span>
                        )}
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Last run: {flow.lastRun}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFlow(flow.id)}
                    className="p-2 hover:bg-[hsl(36,30%,90%)] rounded-lg text-[hsl(25,20%,45%)] transition-colors shrink-0"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Step dots visualization */}
                <div className="mt-4 pt-4 border-t border-[hsl(30,15%,85%)]">
                  <p className="text-[11px] text-[hsl(25,20%,45%)] mb-2 font-semibold uppercase tracking-wide">Flow Steps</p>
                  <StepDots steps={flow.steps} active={flow.active} />
                </div>
              </div>

              {/* Expanded step breakdown */}
              {isExpanded && (
                <div className="border-t border-[hsl(30,15%,85%)] bg-[hsl(36,30%,93%)] p-5">
                  <p className="text-xs font-semibold text-[hsl(25,20%,45%)] uppercase tracking-wide mb-4">Step Breakdown</p>
                  <div className="space-y-2">
                    {flow.steps.map((step, i) => {
                      const cfg = STEP_TYPE_CONFIG[step.type];
                      return (
                        <div key={step.id} className="flex items-start gap-3 relative">
                          {/* Connector line */}
                          {i < flow.steps.length - 1 && (
                            <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-[hsl(30,15%,82%)] z-0" />
                          )}
                          {/* Step handle (visual drag indicator) */}
                          <div className="relative z-10 flex items-center gap-2 shrink-0">
                            <GripVertical className="w-3 h-3 text-[hsl(30,15%,75%)] cursor-grab" />
                            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0", cfg.bg)}>
                              {cfg.icon}
                            </div>
                          </div>
                          <div className="flex-1 bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-lg p-3">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="text-xs font-semibold text-[hsl(25,40%,18%)]">{step.label}</p>
                              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded capitalize", cfg.bg.replace("bg-", "bg-").replace("500", "100"), cfg.color)}>
                                {step.type}
                              </span>
                            </div>
                            <p className="text-xs text-[hsl(25,20%,45%)]">{step.detail}</p>
                            {step.agent && (
                              <p className="text-[10px] text-[hsl(25,20%,45%)] mt-1 font-medium opacity-70">→ {step.agent}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <AIRecommendations page="skill-flows" />
    </div>
  );
}
