// /Users/navaneethakrishnan/Desktop/skott/app/observe/compliance/page.tsx
"use client";

import { useState } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  Calendar,
  RefreshCw,
  Lock,
  Globe,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

type Tab = "Rules" | "Safety Metrics" | "Audit Summary";
const TABS: Tab[] = ["Rules", "Safety Metrics", "Audit Summary"];

const RULES_MUST_ALWAYS = [
  { text: "Always check brand voice score before publishing social content (threshold: ≥85/100)", appliesTo: "Social Media Agent, Content Strategist" },
  { text: "Always route budget change recommendations >$500/wk to human decision inbox for approval", appliesTo: "Campaign Optimizer" },
  { text: "Always redact PII from all LLM context windows before processing lead data", appliesTo: "All Agents" },
  { text: "Always log decision rationale and confidence score for every agent output", appliesTo: "All Agents" },
  { text: "Always perform duplicate campaign check before launching new campaign", appliesTo: "Campaign Optimizer, Partnership Agent" },
];

const RULES_MUST_NEVER = [
  { text: "Never publish content without passing brand QC check or explicit human override", appliesTo: "Social Media Agent, Content Strategist" },
  { text: "Never send outbound emails using real contact data without SDR approval step", appliesTo: "Partnership Agent, Events Command Agent" },
  { text: "Never adjust live campaign bids by more than 30% in a single automated action", appliesTo: "Campaign Optimizer" },
  { text: "Never expose raw HubSpot API keys, tokens, or credentials in logs or LLM context", appliesTo: "All Agents" },
];

const RULES_ESCALATION = [
  { text: "Escalate to CMO if weekly MQL gap exceeds 30% of monthly target with no recovery plan", appliesTo: "Master Orchestrator" },
  { text: "Escalate to Legal if any content references a competitor by name without review", appliesTo: "Content Strategist, Social Media Agent" },
  { text: "Escalate to CFO if total weekly ad spend exceeds approved budget by >10%", appliesTo: "Campaign Optimizer, Master Orchestrator" },
];

const SAFETY_METRICS = [
  { label: "PII Redaction", value: 100, runs: 96, total: 96, ok: true, description: "All 96 runs successfully redacted PII before LLM context" },
  { label: "Data Boundary", value: 100, runs: 96, total: 96, ok: true, description: "No cross-agent data leakage detected in any run" },
  { label: "Threshold Check", value: 89, runs: 85, total: 96, ok: false, description: "11 runs exceeded budget thresholds without explicit override" },
  { label: "Hallucination Guard", value: 95, runs: 91, total: 96, ok: true, description: "5 outputs flagged for factual review; 3 resolved, 2 pending" },
  { label: "Authorization", value: 100, runs: 96, total: 96, ok: true, description: "All agent actions performed within assigned role permissions" },
];

const REGULATORY_FRAMEWORKS = [
  { name: "GDPR", icon: <Globe className="w-4 h-4" />, status: "Compliant", detail: "Data processing, consent, and PII handling rules active", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { name: "SOX", icon: <TrendingUp className="w-4 h-4" />, icon2: null, status: "Compliant", detail: "Financial controls and audit trail requirements met", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { name: "MiFID II", icon: <Lock className="w-4 h-4" />, status: "In Review", detail: "Investment content review scheduled for Q2 completion", color: "text-amber-600 bg-amber-50 border-amber-200" },
];

const VALIDATION_SCHEDULE = [
  { check: "PII Scan — All Agent Outputs", frequency: "Per Run", lastRun: "08:42 today", nextRun: "11:03 today", status: "Active" },
  { check: "Brand Voice Threshold Calibration", frequency: "Weekly", lastRun: "May 12", nextRun: "May 19", status: "Active" },
  { check: "Budget Authorization Audit", frequency: "Daily", lastRun: "08:00 today", nextRun: "08:00 tomorrow", status: "Active" },
  { check: "Data Boundary Penetration Test", frequency: "Monthly", lastRun: "May 1", nextRun: "Jun 1", status: "Active" },
  { check: "Hallucination Spot-check — LLM Outputs", frequency: "Weekly", lastRun: "May 12", nextRun: "May 19", status: "Active" },
  { check: "GDPR Compliance Review", frequency: "Quarterly", lastRun: "Mar 31", nextRun: "Jun 30", status: "Scheduled" },
];

function RuleCard({ text, appliesTo, variant }: { text: string; appliesTo: string; variant: "always" | "never" | "escalate" }) {
  const styles = {
    always: { border: "border-l-4 border-l-emerald-400 bg-emerald-50/60 border border-emerald-100", iconBg: "bg-emerald-100 text-emerald-600", icon: <ShieldCheck className="w-4 h-4" /> },
    never: { border: "border-l-4 border-l-red-400 bg-red-50/60 border border-red-100", iconBg: "bg-red-100 text-red-600", icon: <ShieldAlert className="w-4 h-4" /> },
    escalate: { border: "border-l-4 border-l-amber-400 bg-amber-50/60 border border-amber-100", iconBg: "bg-amber-100 text-amber-600", icon: <AlertTriangle className="w-4 h-4" /> },
  }[variant];

  return (
    <div className={cn("rounded-[0.75rem] p-4 flex items-start gap-3", styles.border)}>
      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", styles.iconBg)}>
        {styles.icon}
      </div>
      <div>
        <p className="text-sm text-[hsl(25,40%,18%)] leading-relaxed">{text}</p>
        <p className="text-xs text-[hsl(25,20%,45%)] mt-1.5">
          <span className="font-semibold">Applies to:</span> {appliesTo}
        </p>
      </div>
    </div>
  );
}

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Rules");

  return (
    <div className="min-h-screen bg-[hsl(36,30%,98%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(25,40%,18%)] mb-1">Compliance & Guardrails</h1>
          <p className="text-sm text-[hsl(25,20%,45%)]">Governance rules, safety metrics, and audit frameworks for all agent activity</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">Overall Compliance Health</p>
            <p className="text-2xl font-bold text-emerald-700">94.7%</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[hsl(36,30%,94%)] border border-[hsl(30,15%,85%)] rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === t ? "bg-[hsl(25,62%,25%)] text-white shadow-sm" : "text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Rules tab */}
      {activeTab === "Rules" && (
        <div className="space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-[hsl(25,40%,18%)]">MUST ALWAYS</h2>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">{RULES_MUST_ALWAYS.length} rules</span>
            </div>
            <div className="space-y-2.5">
              {RULES_MUST_ALWAYS.map((r, i) => <RuleCard key={i} text={r.text} appliesTo={r.appliesTo} variant="always" />)}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h2 className="font-bold text-[hsl(25,40%,18%)]">MUST NEVER</h2>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold border border-red-200">{RULES_MUST_NEVER.length} rules</span>
            </div>
            <div className="space-y-2.5">
              {RULES_MUST_NEVER.map((r, i) => <RuleCard key={i} text={r.text} appliesTo={r.appliesTo} variant="never" />)}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="font-bold text-[hsl(25,40%,18%)]">ESCALATION RULES</h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold border border-amber-200">{RULES_ESCALATION.length} rules</span>
            </div>
            <div className="space-y-2.5">
              {RULES_ESCALATION.map((r, i) => <RuleCard key={i} text={r.text} appliesTo={r.appliesTo} variant="escalate" />)}
            </div>
          </section>
        </div>
      )}

      {/* Safety Metrics tab */}
      {activeTab === "Safety Metrics" && (
        <div className="space-y-4">
          {!SAFETY_METRICS.find(m => m.ok === false) ? null : (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-[0.75rem]">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Threshold Check at 89% — below 95% target</p>
                <p className="text-xs text-amber-700 mt-0.5">11 runs exceeded budget thresholds without explicit human override. Review pending decisions to resolve.</p>
              </div>
            </div>
          )}
          <div className="grid gap-4">
            {SAFETY_METRICS.map((m) => (
              <div key={m.label} className={cn(
                "bg-[hsl(36,30%,96%)] border rounded-[0.75rem] p-5",
                m.ok ? "border-[hsl(30,15%,85%)]" : "border-amber-200 bg-amber-50/30"
              )}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", m.ok ? "bg-emerald-100" : "bg-amber-100")}>
                      {m.ok ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[hsl(25,40%,18%)]">{m.label}</h3>
                      <p className="text-xs text-[hsl(25,20%,45%)] mt-0.5">{m.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-2xl font-bold", m.ok ? "text-emerald-600" : "text-amber-600")}>{m.value}%</p>
                    <p className="text-xs text-[hsl(25,20%,45%)]">{m.runs}/{m.total} runs</p>
                  </div>
                </div>
                <div className="bg-[hsl(30,15%,85%)] rounded-full h-2 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", m.ok ? "bg-emerald-500" : "bg-amber-400")}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
                {!m.ok && (
                  <p className="text-xs text-amber-700 mt-2 font-medium">
                    Target: 95% — {95 - m.value}pp below threshold
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Summary tab */}
      {activeTab === "Audit Summary" && (
        <div className="space-y-6">
          {/* Regulatory frameworks */}
          <section>
            <h2 className="font-bold text-[hsl(25,40%,18%)] mb-3">Regulatory Frameworks</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {REGULATORY_FRAMEWORKS.map((fw) => (
                <div key={fw.name} className={cn("rounded-[0.75rem] p-4 border", fw.color)}>
                  <div className="flex items-center gap-2 mb-2">
                    {fw.icon}
                    <span className="font-bold text-lg">{fw.name}</span>
                    <span className={cn("ml-auto text-xs font-semibold px-2 py-0.5 rounded-full border", fw.color)}>
                      {fw.status}
                    </span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">{fw.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Validation schedule */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[hsl(25,40%,18%)]">Validation Schedule</h2>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[hsl(30,15%,85%)] rounded-lg text-[hsl(25,20%,45%)] hover:bg-[hsl(36,30%,94%)] transition-colors">
                  <Download className="w-3.5 h-3.5" />CSV
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[hsl(30,15%,85%)] rounded-lg text-[hsl(25,20%,45%)] hover:bg-[hsl(36,30%,94%)] transition-colors">
                  <FileText className="w-3.5 h-3.5" />PDF
                </button>
              </div>
            </div>
            <div className="bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-[0.75rem] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[hsl(30,15%,85%)] bg-[hsl(36,30%,93%)]">
                    {["Check Name", "Frequency", "Last Run", "Next Run", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[hsl(25,20%,45%)] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(30,15%,88%)]">
                  {VALIDATION_SCHEDULE.map((row, i) => (
                    <tr key={i} className="hover:bg-[hsl(36,30%,94%)] transition-colors">
                      <td className="px-4 py-3 font-medium text-[hsl(25,40%,18%)]">{row.check}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-[hsl(25,20%,45%)]"><RefreshCw className="w-3 h-3" />{row.frequency}</span>
                      </td>
                      <td className="px-4 py-3 text-[hsl(25,20%,45%)] text-sm">{row.lastRun}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-[hsl(25,20%,45%)]"><Calendar className="w-3 h-3" />{row.nextRun}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          row.status === "Active" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-blue-100 text-blue-700 border border-blue-200"
                        )}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
      <AIRecommendations page="compliance" />
    </div>
  );
}
