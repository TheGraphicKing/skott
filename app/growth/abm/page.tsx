"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  TrendingUp,
  Users,
  ChevronRight,
  CheckCircle,
  Clock,
  Zap,
  Filter,
  Send,
  Edit3,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

// ─── Types ───────────────────────────────────────────────────────────────────

type Stage = "Awareness" | "Consideration" | "Decision";
type Filter = "All Accounts" | "Hot" | "Active Sequences" | "Awaiting Reply";

interface Account {
  id: string;
  company: string;
  industry: string;
  score: number;
  stage: Stage;
  emailsSent: number;
  opened: number;
  replied: number;
  lastActivity: string;
}

interface Signal {
  company: string;
  type: string;
  detail: string;
  time: string;
}

interface PendingApproval {
  id: string;
  company: string;
  subject: string;
  to: string;
  scheduledFor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ACCOUNTS: Account[] = [
  { id: "a1", company: "Salesforce", industry: "CRM / Cloud", score: 94, stage: "Decision", emailsSent: 6, opened: 5, replied: 2, lastActivity: "2h ago" },
  { id: "a2", company: "Databricks", industry: "Data & AI", score: 88, stage: "Consideration", emailsSent: 4, opened: 4, replied: 1, lastActivity: "4h ago" },
  { id: "a3", company: "Snowflake", industry: "Data Warehouse", score: 82, stage: "Consideration", emailsSent: 5, opened: 3, replied: 0, lastActivity: "Yesterday" },
  { id: "a4", company: "HubSpot", industry: "Marketing Tech", score: 76, stage: "Awareness", emailsSent: 3, opened: 2, replied: 0, lastActivity: "2 days ago" },
  { id: "a5", company: "Twilio", industry: "Communications", score: 71, stage: "Awareness", emailsSent: 2, opened: 1, replied: 1, lastActivity: "3 days ago" },
  { id: "a6", company: "Figma", industry: "Design Tools", score: 67, stage: "Awareness", emailsSent: 2, opened: 2, replied: 0, lastActivity: "3 days ago" },
  { id: "a7", company: "Stripe", industry: "FinTech", score: 91, stage: "Decision", emailsSent: 7, opened: 6, replied: 3, lastActivity: "1h ago" },
  { id: "a8", company: "Notion", industry: "Productivity", score: 63, stage: "Awareness", emailsSent: 1, opened: 0, replied: 0, lastActivity: "5 days ago" },
];

const EMAIL_PREVIEWS: Record<string, { subject: string; body: string[] }> = {
  a1: {
    subject: "How Salesforce can reduce churn with AI-driven content workflows",
    body: [
      "Hi Marcus — I noticed Salesforce's Trailhead team just posted 3 new SDR roles last week, which tells me you're scaling go-to-market hard. Congrats on the momentum.",
      "We work with companies like Gong and Outreach to automate their ABM content layer — think hyper-personalized email sequences, landing pages, and follow-up assets generated in minutes, not weeks. Given Salesforce's Einstein AI layer, we can plug directly into your existing stack without disruption.",
      "Would a 20-minute call make sense this week? Happy to bring a live demo specific to CRM SaaS workflows. Attaching a short case study on how Gong cut content production time by 68%.",
    ],
  },
  a7: {
    subject: "Stripe's PLG motion + AI content — a conversation worth having",
    body: [
      "Hi Priya — saw the announcement about Stripe's new embedded finance suite. That kind of product expansion typically means a content bottleneck downstream — docs, sales decks, nurture sequences — all needing a refresh simultaneously.",
      "Skott's AI Marketing OS is purpose-built for exactly this scenario. We recently helped a fintech scale from 2 to 18 markets in a quarter without adding headcount, by automating the content operations layer.",
      "I'd love to share how we'd approach Stripe's specific growth motion. 15 minutes this Friday?",
    ],
  },
  default: {
    subject: "Quick question about your marketing workflow",
    body: [
      "Hi there — I came across your recent product announcement and was genuinely impressed by the direction you're heading.",
      "We've been helping companies in your space streamline their content and outbound operations using AI agents — reducing time-to-pipeline by 40%+ in most cases.",
      "Worth a quick call to explore if there's a fit? Happy to keep it focused on your specific challenges.",
    ],
  },
};

const SEQUENCES = [
  { name: "Enterprise Decision Maker", steps: ["Email 1", "Wait 3d", "Email 2", "LinkedIn", "Wait 5d", "Email 3 (case study)"], active: 47 },
  { name: "Mid-Market Consideration", steps: ["Email 1", "Wait 2d", "Email 2 (demo)", "Wait 4d", "LinkedIn", "Email 3"], active: 31 },
  { name: "Awareness Nurture", steps: ["Email 1 (blog)", "Wait 7d", "Email 2 (webinar)", "Wait 7d", "Email 3 (case study)"], active: 89 },
];

const PENDING_APPROVALS: PendingApproval[] = [
  { id: "p1", company: "Snowflake", subject: "How Snowflake can cut data team overhead with AI workflows", to: "kevin.lee@snowflake.com", scheduledFor: "Today 3:00 PM" },
  { id: "p2", company: "HubSpot", subject: "HubSpot + Skott: a natural integration story", to: "sarah.chen@hubspot.com", scheduledFor: "Today 4:30 PM" },
  { id: "p3", company: "Figma", subject: "AI-generated design team content at scale", to: "michael.torres@figma.com", scheduledFor: "Tomorrow 9:00 AM" },
];

const SIGNALS: Signal[] = [
  { company: "Databricks", type: "Job Posting", detail: "Hiring VP of Growth Marketing — signals major marketing investment", time: "2h ago" },
  { company: "Stripe", type: "Funding", detail: "Raised $694M Series I — expansion budget likely increasing", time: "6h ago" },
  { company: "Salesforce", type: "Tech Change", detail: "Added Marketo to their stack — top-of-funnel expansion in progress", time: "Yesterday" },
  { company: "Snowflake", type: "News", detail: "Featured in Gartner Magic Quadrant — great congratulations hook", time: "2 days ago" },
];

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

function StageBadge({ stage }: { stage: Stage }) {
  const colors: Record<Stage, string> = {
    Awareness: "bg-blue-50 text-blue-700 border border-blue-200",
    Consideration: "bg-amber-50 text-amber-700 border border-amber-200",
    Decision: "bg-green-50 text-green-700 border border-green-200",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${colors[stage]}`}>{stage}</span>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ABMPage() {
  const [filter, setFilter] = useState<Filter>("All Accounts");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  const filters: Filter[] = ["All Accounts", "Hot", "Active Sequences", "Awaiting Reply"];

  const filtered = ACCOUNTS.filter((a) => {
    if (filter === "Hot") return a.score > 80;
    if (filter === "Active Sequences") return a.emailsSent > 2;
    if (filter === "Awaiting Reply") return a.replied === 0 && a.opened > 0;
    return true;
  });

  const emailPreview = selectedAccount
    ? EMAIL_PREVIEWS[selectedAccount.id] ?? EMAIL_PREVIEWS.default
    : null;

  return (
    <div className="min-h-screen bg-[hsl(36,33%,94%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[hsl(25,62%,25%)] flex items-center justify-center">
            <Building2 size={18} className="text-[hsl(36,33%,94%)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[hsl(25,40%,18%)]">ABM Email Agent</h1>
            <p className="text-xs text-[hsl(25,20%,50%)]">Account-Based Marketing Automation</p>
          </div>
          <AgentStatusBadge status="active" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-sm font-medium hover:opacity-90 transition-opacity">
          <Zap size={14} />
          Run Signals Scan
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard icon={Building2} label="Target Accounts" value="284" sub="+12 added this week" color="bg-[hsl(25,62%,25%)]/10 text-[hsl(25,62%,25%)]" />
        <KPICard icon={Mail} label="Emails Personalized" value="1,247" sub="AI-generated, human-approved" color="bg-blue-50 text-blue-600" />
        <KPICard icon={TrendingUp} label="Avg Open Rate" value="34%" sub="+8% vs industry avg" color="bg-green-50 text-green-600" />
        <KPICard icon={Users} label="MQLs from ABM" value="47" sub="This quarter" color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Account Table */}
        <div className="col-span-2 space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[hsl(25,20%,50%)]" />
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)]"
                    : "bg-[hsl(36,30%,97%)] text-[hsl(25,20%,50%)] border border-[hsl(30,15%,87%)] hover:border-[hsl(25,62%,25%)]"
                }`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto text-xs text-[hsl(25,20%,50%)]">{filtered.length} accounts</span>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(30,15%,87%)] bg-[hsl(36,33%,94%)]">
                  {["Company", "Score", "Stage", "Sent", "Opened", "Replied", "Last Activity"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[hsl(25,20%,50%)] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((account, i) => (
                    <motion.tr
                      key={account.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSelectedAccount(account)}
                      className={`border-b border-[hsl(30,15%,87%)] cursor-pointer transition-colors ${
                        selectedAccount?.id === account.id
                          ? "bg-[hsl(25,62%,25%)]/5"
                          : "hover:bg-[hsl(25,62%,25%)]/3"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-[hsl(25,40%,18%)]">{account.company}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-[hsl(30,15%,87%)]">
                            <div
                              className={`h-full rounded-full ${account.score >= 80 ? "bg-green-500" : account.score >= 60 ? "bg-amber-500" : "bg-red-400"}`}
                              style={{ width: `${account.score}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-[hsl(25,40%,18%)]">{account.score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StageBadge stage={account.stage} /></td>
                      <td className="px-4 py-3 text-[hsl(25,20%,50%)]">{account.emailsSent}</td>
                      <td className="px-4 py-3 text-[hsl(25,20%,50%)]">{account.opened}</td>
                      <td className="px-4 py-3 text-[hsl(25,20%,50%)]">{account.replied}</td>
                      <td className="px-4 py-3 text-[hsl(25,20%,50%)] text-xs">{account.lastActivity}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Sequences */}
          <div className="rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5">
            <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)] mb-4">Active Sequences</h2>
            <div className="space-y-4">
              {SEQUENCES.map((seq) => (
                <div key={seq.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[hsl(25,40%,18%)]">{seq.name}</span>
                    <span className="text-xs text-[hsl(25,20%,50%)]">{seq.active} active</span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {seq.steps.map((step, i) => (
                      <span key={i} className={`flex items-center gap-1 text-[11px] ${step.startsWith("Wait") ? "text-[hsl(25,20%,50%)] italic" : "text-[hsl(25,40%,18%)] bg-[hsl(36,33%,94%)] border border-[hsl(30,15%,87%)] px-2 py-0.5 rounded"}`}>
                        {!step.startsWith("Wait") && i > 0 && <ChevronRight size={10} className="text-[hsl(25,20%,50%)]" />}
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Panels */}
        <div className="space-y-4">
          {/* Email Preview Panel */}
          <AnimatePresence mode="wait">
            {emailPreview ? (
              <motion.div
                key={selectedAccount?.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl border border-[hsl(25,62%,25%)]/20 bg-[hsl(36,30%,97%)] p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">AI Draft — {selectedAccount?.company}</h2>
                  <ExternalLink size={14} className="text-[hsl(25,20%,50%)]" />
                </div>
                <div className="mb-3">
                  <p className="text-[11px] text-[hsl(25,20%,50%)] uppercase tracking-wide mb-1">Subject</p>
                  <p className="text-sm font-medium text-[hsl(25,40%,18%)]">{emailPreview.subject}</p>
                </div>
                <div className="space-y-2 text-xs text-[hsl(25,20%,50%)] leading-relaxed border-t border-[hsl(30,15%,87%)] pt-3">
                  {emailPreview.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-xs font-medium hover:opacity-90 transition-opacity">
                    <Send size={12} /> Approve & Send
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-[hsl(30,15%,87%)] text-xs font-medium text-[hsl(25,40%,18%)] hover:bg-[hsl(36,33%,94%)] transition-colors">
                    <Edit3 size={12} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-dashed border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5 text-center"
              >
                <Mail size={24} className="text-[hsl(25,20%,50%)] mx-auto mb-2" />
                <p className="text-sm text-[hsl(25,20%,50%)]">Click an account to preview its AI-generated email draft</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pending Approvals */}
          <div className="rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={14} className="text-amber-500" />
              <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Pending Approvals</h2>
              <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{PENDING_APPROVALS.length}</span>
            </div>
            <div className="space-y-3">
              {PENDING_APPROVALS.map((ap) => (
                <div key={ap.id} className="flex items-start justify-between gap-2 p-3 rounded-lg bg-[hsl(36,33%,94%)] border border-[hsl(30,15%,87%)]">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[hsl(25,40%,18%)] truncate">{ap.company}</p>
                    <p className="text-[11px] text-[hsl(25,20%,50%)] truncate">{ap.subject}</p>
                    <p className="text-[11px] text-[hsl(25,20%,50%)] mt-0.5 flex items-center gap-1"><Clock size={10} />{ap.scheduledFor}</p>
                  </div>
                  <button
                    onClick={() => setApprovedIds((prev) => new Set([...prev, ap.id]))}
                    className={`shrink-0 transition-colors ${approvedIds.has(ap.id) ? "text-green-500" : "text-[hsl(25,20%,50%)] hover:text-green-500"}`}
                  >
                    <CheckCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Signal Feed */}
          <div className="rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-[hsl(25,62%,25%)]" />
              <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Account Signals</h2>
            </div>
            <div className="space-y-3">
              {SIGNALS.map((sig, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(25,62%,25%)] mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[hsl(25,40%,18%)]">{sig.company} — <span className="text-[hsl(25,62%,25%)]">{sig.type}</span></p>
                    <p className="text-[11px] text-[hsl(25,20%,50%)]">{sig.detail}</p>
                    <p className="text-[11px] text-[hsl(25,20%,50%)] mt-0.5">{sig.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AIRecommendations page="abm" />
    </div>
  );
}
