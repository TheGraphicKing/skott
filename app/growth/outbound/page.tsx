"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Mail,
  CalendarDays,
  RefreshCw,
  Filter,
  ChevronRight,
  MessageSquare,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Send,
  Edit3,
  Zap,
} from "lucide-react";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProspectStatus = "Active" | "Replied" | "Bounced" | "Opted Out" | "Meeting Booked";
type ProspectFilter = "All" | "Active" | "Replied" | "Bounced" | "Meeting Booked";
type ReplyIntent = "Interested" | "Not Now" | "Wrong Person";

interface Prospect {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  sequence: string;
  step: number;
  totalSteps: number;
  stepLabel: string;
  status: ProspectStatus;
  lastActivity: string;
}

interface Reply {
  id: string;
  from: string;
  company: string;
  preview: string;
  receivedAt: string;
  classified: ReplyIntent | null;
}

interface SequenceRow {
  name: string;
  enrolled: number;
  step1: number;
  step2: number;
  step3: number;
  replyRate: string;
  meetingRate: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROSPECTS: Prospect[] = [
  { id: "p1", name: "Alex Rivera", title: "VP Marketing", company: "Lattice", industry: "HR Tech", sequence: "VP Marketing Cold", step: 2, totalSteps: 5, stepLabel: "Email 2", status: "Active", lastActivity: "2h ago" },
  { id: "p2", name: "Jordan Kim", title: "Head of Demand Gen", company: "Drata", industry: "Compliance", sequence: "Demand Gen Outbound", step: 3, totalSteps: 5, stepLabel: "LinkedIn", status: "Replied", lastActivity: "5h ago" },
  { id: "p3", name: "Priya Mehta", title: "CMO", company: "Rippling", industry: "HR/Payroll", sequence: "CMO Sequence", step: 1, totalSteps: 5, stepLabel: "Email 1", status: "Active", lastActivity: "1h ago" },
  { id: "p4", name: "Sam Torres", title: "Director of Growth", company: "Vercel", industry: "Dev Tools", sequence: "Growth Leader", step: 4, totalSteps: 5, stepLabel: "Email 3", status: "Active", lastActivity: "Yesterday" },
  { id: "p5", name: "Dana Patel", title: "VP Marketing", company: "Linear", industry: "Productivity", sequence: "VP Marketing Cold", step: 2, totalSteps: 5, stepLabel: "Email 2", status: "Meeting Booked", lastActivity: "3h ago" },
  { id: "p6", name: "Marcus Webb", title: "Growth PM", company: "Retool", industry: "Dev Tools", sequence: "Growth Leader", step: 1, totalSteps: 5, stepLabel: "Email 1", status: "Bounced", lastActivity: "2 days ago" },
  { id: "p7", name: "Casey Liu", title: "Head of Marketing", company: "Plane", industry: "PM Tools", sequence: "Demand Gen Outbound", step: 2, totalSteps: 5, stepLabel: "Email 2", status: "Active", lastActivity: "4h ago" },
  { id: "p8", name: "Robin Shah", title: "CMO", company: "Merge.dev", industry: "Dev Tools", sequence: "CMO Sequence", step: 3, totalSteps: 5, stepLabel: "Email 2 (case study)", status: "Replied", lastActivity: "Yesterday" },
  { id: "p9", name: "Taylor Brooks", title: "VP Demand Gen", company: "Chorus.ai", industry: "Revenue Intel", sequence: "Demand Gen Outbound", step: 1, totalSteps: 5, stepLabel: "Email 1", status: "Opted Out", lastActivity: "3 days ago" },
  { id: "p10", name: "Morgan Ellis", title: "Director Marketing Ops", company: "Gong", industry: "Revenue Intel", sequence: "VP Marketing Cold", step: 5, totalSteps: 5, stepLabel: "Email 3 (breakup)", status: "Active", lastActivity: "6h ago" },
];

const REPLIES: Reply[] = [
  { id: "r1", from: "Jordan Kim", company: "Drata", preview: "Hey — this is actually pretty timely. We've been evaluating AI tools for our content team. Can you send over more details?", receivedAt: "30 min ago", classified: null },
  { id: "r2", from: "Robin Shah", company: "Merge.dev", preview: "Thanks for reaching out, but we're heads down on our current roadmap for the next 6 months. Circle back in Q3.", receivedAt: "2h ago", classified: null },
  { id: "r3", from: "Nolan Price", company: "Mixpanel", preview: "I'm not really the right person here — you'd want to talk to our head of growth. I'll forward this.", receivedAt: "4h ago", classified: null },
];

const AI_SUGGESTIONS = [
  { prospect: "Alex Rivera", company: "Lattice", action: "Send Email 3 with Lattice-specific case study (HR Tech peer reference)", reason: "Opened Email 2 twice, no reply in 48h — high intent signal", cta: "Generate Email" },
  { prospect: "Sam Torres", company: "Vercel", action: "Bump with LinkedIn connection request referencing shared connection", reason: "Email 3 opened, Vercel hiring 3 marketing roles — buying signal", cta: "Draft LinkedIn" },
  { prospect: "Morgan Ellis", company: "Gong", action: "Send breakup email — low effort, high re-engagement success rate", reason: "Sequence step 5, no engagement yet — re-engage or disqualify", cta: "Generate Breakup" },
];

const SEQUENCES: SequenceRow[] = [
  { name: "VP Marketing Cold", enrolled: 284, step1: 91, step2: 67, step3: 38, replyRate: "9.2%", meetingRate: "3.1%" },
  { name: "Demand Gen Outbound", enrolled: 156, step1: 88, step2: 71, step3: 44, replyRate: "7.8%", meetingRate: "2.6%" },
  { name: "CMO Sequence", enrolled: 73, step1: 95, step2: 62, step3: 41, replyRate: "11.4%", meetingRate: "4.2%" },
];

const STEP_LABELS = ["Email 1", "Email 2", "LinkedIn", "Email 3", "Breakup"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function KPICard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[hsl(25,20%,50%)] uppercase tracking-wide mb-1">{label}</p>
          <p className="text-3xl font-bold text-[hsl(25,40%,18%)]">{value}</p>
          <p className="text-xs text-[hsl(25,20%,50%)] mt-1">{sub}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ProspectStatus }) {
  const colors: Record<ProspectStatus, string> = {
    Active: "bg-blue-50 text-blue-700 border border-blue-200",
    Replied: "bg-green-50 text-green-700 border border-green-200",
    Bounced: "bg-red-50 text-red-600 border border-red-200",
    "Opted Out": "bg-gray-100 text-gray-500 border border-gray-200",
    "Meeting Booked": "bg-purple-50 text-purple-700 border border-purple-200",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${colors[status]}`}>{status}</span>;
}

function MiniStepper({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-4 rounded-full transition-colors ${
            i < step ? "bg-[hsl(25,62%,25%)]" : i === step ? "bg-[hsl(25,62%,25%)]/40" : "bg-[hsl(30,15%,87%)]"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OutboundPage() {
  const [filter, setFilter] = useState<ProspectFilter>("All");
  const [classifiedReplies, setClassifiedReplies] = useState<Record<string, ReplyIntent>>({});
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const filters: ProspectFilter[] = ["All", "Active", "Replied", "Bounced", "Meeting Booked"];

  const filtered = PROSPECTS.filter((p) => {
    if (filter === "All") return true;
    return p.status === filter;
  });

  function classifyReply(id: string, intent: ReplyIntent) {
    setClassifiedReplies((prev) => ({ ...prev, [id]: intent }));
  }

  return (
    <div className="min-h-screen bg-[hsl(36,33%,94%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[hsl(25,62%,25%)] flex items-center justify-center">
            <Send size={18} className="text-[hsl(36,33%,94%)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[hsl(25,40%,18%)]">Outbound Agent</h1>
            <p className="text-xs text-[hsl(25,20%,50%)]">Prospecting & Sequence Automation</p>
          </div>
          <AgentStatusBadge status="active" />
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-[hsl(25,20%,50%)]">
            <RefreshCw size={12} /> Apollo synced 2h ago
          </span>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-sm font-medium hover:opacity-90 transition-opacity">
            <Zap size={14} />
            Enrich Prospects
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard icon={Users} label="Prospects in Queue" value="1,847" sub="+134 added this week" color="bg-[hsl(25,62%,25%)]/10 text-[hsl(25,62%,25%)]" />
        <KPICard icon={Mail} label="Active Sequences" value="12" sub="3 paused, 2 completed" color="bg-blue-50 text-blue-600" />
        <KPICard icon={MessageSquare} label="Reply Rate" value="8.4%" sub="+1.2% vs last month" color="bg-green-50 text-green-600" />
        <KPICard icon={CalendarDays} label="Meetings Booked" value="23" sub="This quarter" color="bg-purple-50 text-purple-600" />
      </div>

      {/* Prospect List */}
      <div className="rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-[hsl(30,15%,87%)]">
          <Filter size={14} className="text-[hsl(25,20%,50%)]" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)]"
                  : "bg-[hsl(36,33%,94%)] text-[hsl(25,20%,50%)] border border-[hsl(30,15%,87%)] hover:border-[hsl(25,62%,25%)]"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-[hsl(25,20%,50%)]">{filtered.length} prospects</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[hsl(36,33%,94%)] border-b border-[hsl(30,15%,87%)]">
              {["Name", "Title / Company", "Sequence", "Progress", "Step", "Status", "Last Activity"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[hsl(25,20%,50%)] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.035 }}
                  className="border-b border-[hsl(30,15%,87%)] hover:bg-[hsl(25,62%,25%)]/3 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-[hsl(25,40%,18%)]">{p.name}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium text-[hsl(25,40%,18%)]">{p.title}</p>
                    <p className="text-[11px] text-[hsl(25,20%,50%)]">{p.company}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[hsl(25,20%,50%)]">{p.sequence}</td>
                  <td className="px-4 py-3"><MiniStepper step={p.step} total={p.totalSteps} /></td>
                  <td className="px-4 py-3 text-xs text-[hsl(25,40%,18%)]">{p.stepLabel}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-xs text-[hsl(25,20%,50%)]">{p.lastActivity}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Reply Triage */}
        <div className="col-span-1 rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={14} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Reply Triage</h2>
            <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              {REPLIES.filter((r) => !classifiedReplies[r.id]).length} pending
            </span>
          </div>
          <div className="space-y-4">
            {REPLIES.map((reply) => {
              const classified = classifiedReplies[reply.id];
              return (
                <div key={reply.id} className="p-3 rounded-lg bg-[hsl(36,33%,94%)] border border-[hsl(30,15%,87%)]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-[hsl(25,40%,18%)]">{reply.from} <span className="font-normal text-[hsl(25,20%,50%)]">— {reply.company}</span></p>
                    <span className="text-[10px] text-[hsl(25,20%,50%)]">{reply.receivedAt}</span>
                  </div>
                  <p className="text-[11px] text-[hsl(25,20%,50%)] mb-3 line-clamp-2">{reply.preview}</p>
                  {classified ? (
                    <div className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded ${
                      classified === "Interested" ? "bg-green-50 text-green-700" :
                      classified === "Not Now" ? "bg-amber-50 text-amber-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      <CheckCircle size={11} /> Classified: {classified}
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      {(["Interested", "Not Now", "Wrong Person"] as ReplyIntent[]).map((intent) => (
                        <button
                          key={intent}
                          onClick={() => classifyReply(reply.id, intent)}
                          className="flex-1 text-[10px] font-medium py-1 rounded border border-[hsl(30,15%,87%)] text-[hsl(25,40%,18%)] hover:bg-[hsl(36,33%,94%)] transition-colors text-center"
                        >
                          {intent}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="col-span-1 rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-[hsl(25,62%,25%)]" />
            <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">AI Suggestions</h2>
          </div>
          <div className="space-y-4">
            {AI_SUGGESTIONS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-3 rounded-lg bg-[hsl(36,33%,94%)] border border-[hsl(30,15%,87%)]"
              >
                <p className="text-xs font-semibold text-[hsl(25,40%,18%)] mb-1">{s.prospect} <span className="font-normal text-[hsl(25,20%,50%)]">at {s.company}</span></p>
                <p className="text-[11px] text-[hsl(25,40%,18%)] mb-1">{s.action}</p>
                <p className="text-[11px] text-[hsl(25,20%,50%)] mb-3">{s.reason}</p>
                <button
                  onClick={() => setGeneratingFor(s.prospect)}
                  className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] hover:opacity-90 transition-opacity"
                >
                  {generatingFor === s.prospect ? <><Clock size={11} /> Generating...</> : <><Zap size={11} /> {s.cta}</>}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sequence Performance */}
        <div className="col-span-1 rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5">
          <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)] mb-4">Sequence Performance</h2>
          <div className="space-y-5">
            {SEQUENCES.map((seq) => (
              <div key={seq.name}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[hsl(25,40%,18%)]">{seq.name}</p>
                  <p className="text-[11px] text-[hsl(25,20%,50%)]">{seq.enrolled} enrolled</p>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: "Step 1 open", pct: seq.step1 },
                    { label: "Step 2 open", pct: seq.step2 },
                    { label: "Step 3 open", pct: seq.step3 },
                  ].map((bar) => (
                    <div key={bar.label} className="flex items-center gap-2 text-[10px] text-[hsl(25,20%,50%)]">
                      <span className="w-16 shrink-0">{bar.label}</span>
                      <div className="flex-1 h-1.5 bg-[hsl(30,15%,87%)] rounded-full">
                        <div className="h-full rounded-full bg-[hsl(25,62%,25%)]" style={{ width: `${bar.pct}%` }} />
                      </div>
                      <span>{bar.pct}%</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  <span className="text-[11px] font-medium text-green-600">Reply {seq.replyRate}</span>
                  <span className="text-[11px] font-medium text-purple-600">Meeting {seq.meetingRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AIRecommendations page="outbound" />
    </div>
  );
}
