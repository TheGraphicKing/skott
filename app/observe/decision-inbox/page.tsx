"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  ChevronRight,
  Search,
  DollarSign,
  Calendar,
  BarChart3,
  Target,
  FileText,
  Megaphone,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RiskLevel = "critical" | "high" | "medium" | "low";
type Status = "pending" | "approved" | "rejected";
type FilterTab = "All" | "Pending" | "Approved" | "Rejected";

interface Decision {
  id: string;
  risk_level: RiskLevel;
  agent: string;
  workflow: string;
  location: string;
  timestamp: string;
  title: string;
  description: string;
  status: Status;
  amount?: string;
  compliance_passes: number;
  compliance_total: number;
  category: string;
  icon: any;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_DECISIONS: Decision[] = [
  {
    id: "d1",
    risk_level: "critical",
    agent: "Performance Marketing Agent",
    workflow: "Paid Media → Budget Reallocation",
    location: "Google Ads → LinkedIn Ads",
    timestamp: "2 hours ago",
    title: "Shift $45K from Google Display to LinkedIn ABM — Q2 ROAS model",
    description: "Agent recommends reallocating $45K from underperforming Google Display campaigns to LinkedIn ABM targeting. ROAS model projects 2.1× return on incremental spend based on ICP match score.",
    status: "pending",
    amount: "$45,000",
    compliance_passes: 3,
    compliance_total: 3,
    category: "Paid Media",
    icon: BarChart3,
  },
  {
    id: "d2",
    risk_level: "critical",
    agent: "Campaign Strategy Agent",
    workflow: "Campaign Planning → Q3 Calendar",
    location: "Multi-channel · 28 campaigns",
    timestamp: "3 hours ago",
    title: "Approve Q3 Campaign Calendar — 28 campaigns across all channels",
    description: "Proposed Q3 calendar with 28 campaigns spanning demand gen, content, events and brand. Requires CMO sign-off before agency briefing. Pipeline impact modeled at +$3.2M attributed revenue.",
    status: "pending",
    amount: undefined,
    compliance_passes: 2,
    compliance_total: 3,
    category: "Strategy",
    icon: Calendar,
  },
  {
    id: "d3",
    risk_level: "critical",
    agent: "Retention Analytics Agent",
    workflow: "Churn Analysis → Attribution",
    location: "April Cohort · 6.2% churn rate",
    timestamp: "4 hours ago",
    title: "Review churn attribution — marketing-influenced churn at 2× benchmark",
    description: "Agent flagged marketing-influenced churn at 6.2% in April cohort — 2× benchmark. Exit surveys cite misaligned messaging vs. product reality. Immediate messaging audit recommended.",
    status: "pending",
    amount: undefined,
    compliance_passes: 3,
    compliance_total: 3,
    category: "Retention",
    icon: AlertTriangle,
  },
  {
    id: "d4",
    risk_level: "high",
    agent: "Events & Sponsorship Agent",
    workflow: "Event Planning → Sponsorship",
    location: "SaaStr Annual 2026 · San Francisco",
    timestamp: "5 hours ago",
    title: "Approve SaaStr Annual Platinum Sponsorship — $87K commitment",
    description: "Proposal for Platinum sponsorship at SaaStr Annual 2026 ($87K). Includes keynote slot, 10×10 booth, and 2 sponsored sessions. ROI model projects 34 qualified pipeline opportunities.",
    status: "pending",
    amount: "$87,000",
    compliance_passes: 3,
    compliance_total: 3,
    category: "Events",
    icon: Megaphone,
  },
  {
    id: "d5",
    risk_level: "high",
    agent: "Brand Intelligence Agent",
    workflow: "Brand QC → Compliance Audit",
    location: "6 teams · 34 flagged assets",
    timestamp: "Yesterday",
    title: "Publish brand compliance audit — Q1 findings across 6 teams",
    description: "Brand QC agent flagged 34 assets with off-brand usage across 6 teams. Recommends mandatory brand training and asset library refresh. 3 assets flagged as legally sensitive — requires legal review.",
    status: "pending",
    amount: undefined,
    compliance_passes: 2,
    compliance_total: 3,
    category: "Brand",
    icon: Shield,
  },
  {
    id: "d6",
    risk_level: "medium",
    agent: "SEO / AEO Agent",
    workflow: "Content Strategy → SEO Publishing",
    location: "WordPress · 14 articles",
    timestamp: "Yesterday",
    title: "Publish 14 AEO-optimised articles — AI citation gap cluster",
    description: "Content agent generated 14 articles targeting high-value AI search citation gaps. SGE appearance rate for target queries currently at 12 — projected to reach 31 post-publish.",
    status: "approved",
    amount: undefined,
    compliance_passes: 3,
    compliance_total: 3,
    category: "Content",
    icon: FileText,
  },
  {
    id: "d7",
    risk_level: "low",
    agent: "Outbound Agent",
    workflow: "ABM → Email Sequences",
    location: "HubSpot · Fintech segment",
    timestamp: "2 days ago",
    title: "Send ABM sequence to 50 Fintech accounts — 48% historical reply rate",
    description: "The 'Fintech Q2 Targets' sequence hit 48% reply rate in pilot. Agent recommends scaling from 20 to 50 accounts. All contacts verified against DNC lists — ready for deployment.",
    status: "approved",
    amount: undefined,
    compliance_passes: 3,
    compliance_total: 3,
    category: "Outreach",
    icon: Target,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RISK_CONFIG: Record<RiskLevel, { border: string; badge: string; badgeText: string; label: string }> = {
  critical: {
    border: "border-l-[3px] border-l-red-500",
    badge: "bg-red-100 text-red-700",
    badgeText: "CRITICAL",
    label: "CRITICAL",
  },
  high: {
    border: "border-l-[3px] border-l-amber-500",
    badge: "bg-amber-100 text-amber-700",
    badgeText: "HIGH",
    label: "HIGH",
  },
  medium: {
    border: "border-l-[3px] border-l-blue-400",
    badge: "bg-blue-100 text-blue-700",
    badgeText: "MEDIUM",
    label: "MEDIUM",
  },
  low: {
    border: "border-l-[3px] border-l-green-400",
    badge: "bg-green-100 text-green-700",
    badgeText: "LOW",
    label: "LOW",
  },
};

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DecisionInboxPage() {
  const [decisions, setDecisions] = useState(INITIAL_DECISIONS);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const tabs: FilterTab[] = ["All", "Pending", "Approved", "Rejected"];

  const pendingCount = decisions.filter(d => d.status === "pending").length;
  const criticalCount = decisions.filter(d => d.risk_level === "critical" && d.status === "pending").length;
  const approvedToday = decisions.filter(d => d.status === "approved").length;
  const rejectedCount = decisions.filter(d => d.status === "rejected").length;
  const flaggedCompliance = decisions.filter(d => d.compliance_passes < d.compliance_total).length;

  const filtered = decisions.filter(d => {
    const matchTab =
      activeTab === "All" ? true :
      activeTab === "Pending" ? d.status === "pending" :
      activeTab === "Approved" ? d.status === "approved" :
      d.status === "rejected";
    const matchSearch = !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.agent.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  function act(id: string, newStatus: "approved" | "rejected") {
    setProcessing(id);
    setTimeout(() => {
      setDecisions(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
      setExpanded(null);
      setProcessing(null);
    }, 800);
  }

  return (
    <div className="min-h-screen p-6" style={{ background: "hsl(36,33%,94%)" }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Inbox size={22} style={{ color: "hsl(25,62%,25%)" }} />
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "hsl(25,40%,18%)" }}>Decision Inbox</h1>
          <p className="text-sm" style={{ color: "hsl(25,20%,50%)" }}>
            Human-in-the-loop review center for agent decisions
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "PENDING DECISIONS",
            value: pendingCount,
            sub: criticalCount > 0 ? `${criticalCount} Critical` : "All reviewed",
            subColor: criticalCount > 0 ? "#dc2626" : "hsl(142,55%,35%)",
          },
          {
            label: "APPROVED THIS WEEK",
            value: approvedToday,
            sub: "decisions passed",
            subColor: "hsl(142,55%,35%)",
          },
          {
            label: "REJECTED THIS WEEK",
            value: rejectedCount,
            sub: "decisions declined",
            subColor: rejectedCount > 0 ? "#dc2626" : "hsl(25,20%,55%)",
          },
          {
            label: "FLAGGED BY COMPLIANCE",
            value: flaggedCompliance,
            sub: "checks incomplete",
            subColor: flaggedCompliance > 0 ? "#d97706" : "hsl(25,20%,55%)",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border p-5"
            style={{ background: "hsl(36,30%,97%)", borderColor: "hsl(30,15%,87%)" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "hsl(25,20%,55%)" }}>
              {card.label}
            </p>
            <p className="text-3xl font-bold mb-1" style={{ color: "hsl(25,40%,18%)" }}>
              {card.value}
            </p>
            <p className="text-[11px] font-medium" style={{ color: card.subColor }}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Filter tabs + search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {tabs.map(tab => {
            const count = tab === "All" ? decisions.length :
              tab === "Pending" ? pendingCount :
              tab === "Approved" ? approvedToday : rejectedCount;
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                style={
                  active
                    ? { background: "hsl(25,62%,25%)", color: "hsl(36,33%,96%)" }
                    : { background: "hsl(36,30%,97%)", color: "hsl(25,20%,50%)", border: "1px solid hsl(30,15%,87%)" }
                }
              >
                {tab}{tab !== "All" && ` (${count})`}
              </button>
            );
          })}
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(25,20%,55%)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search decisions..."
            className="pl-8 pr-4 py-2 text-[12px] rounded-lg border focus:outline-none focus:ring-1"
            style={{
              background: "hsl(36,30%,97%)",
              borderColor: "hsl(30,15%,87%)",
              color: "hsl(25,40%,18%)",
              width: 220,
            }}
          />
        </div>
      </div>

      {/* Decision list */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map(decision => {
            const risk = RISK_CONFIG[decision.risk_level];
            const isExpanded = expanded === decision.id;
            const Icon = decision.icon;
            const isProcessing = processing === decision.id;

            return (
              <motion.div
                key={decision.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`rounded-xl border overflow-hidden ${risk.border}`}
                style={{ background: "hsl(36,30%,97%)", borderColor: "hsl(30,15%,87%)" }}
              >
                {/* Row */}
                <div
                  className="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-white/50 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : decision.id)}
                >
                  {/* Left content */}
                  <div className="flex-1 min-w-0">
                    {/* Badges + breadcrumb */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${risk.badge}`}>
                        {risk.label}
                      </span>
                      <span className="text-[10px]" style={{ color: "hsl(25,20%,55%)" }}>
                        {decision.workflow}
                      </span>
                      <span className="text-[10px]" style={{ color: "hsl(25,20%,65%)" }}>·</span>
                      <span className="text-[10px]" style={{ color: "hsl(25,20%,55%)" }}>
                        {decision.location}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-[13.5px] font-semibold mb-1 leading-snug" style={{ color: "hsl(25,40%,18%)" }}>
                      {decision.title}
                    </p>

                    {/* Agent + amount + compliance */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Icon size={11} style={{ color: "hsl(25,20%,55%)" }} />
                        <span className="text-[11px]" style={{ color: "hsl(25,20%,50%)" }}>{decision.agent}</span>
                      </div>
                      {decision.amount && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={10} style={{ color: "hsl(25,20%,55%)" }} />
                          <span className="text-[11px] font-semibold" style={{ color: "hsl(25,40%,18%)" }}>
                            {decision.amount}
                          </span>
                        </div>
                      )}
                      <span
                        className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={
                          decision.compliance_passes === decision.compliance_total
                            ? { background: "hsl(142,50%,35%,0.12)", color: "hsl(142,50%,30%)" }
                            : { background: "hsl(38,80%,50%,0.12)", color: "hsl(38,60%,35%)" }
                        }
                      >
                        <CheckCircle2 size={10} />
                        {decision.compliance_passes}/{decision.compliance_total} passed
                      </span>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[11px]" style={{ color: "hsl(25,20%,55%)" }}>{decision.timestamp}</span>
                    {decision.status === "pending" && (
                      <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "#d97706" }}>
                        <AlertTriangle size={10} /> Requires Action
                      </span>
                    )}
                    {decision.status === "approved" && (
                      <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "hsl(142,55%,35%)" }}>
                        <CheckCircle2 size={10} /> Approved
                      </span>
                    )}
                    {decision.status === "rejected" && (
                      <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "#dc2626" }}>
                        <XCircle size={10} /> Rejected
                      </span>
                    )}
                    <ChevronRight
                      size={14}
                      className="transition-transform"
                      style={{
                        color: "hsl(25,20%,55%)",
                        transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    />
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t px-5 py-4"
                      style={{ borderColor: "hsl(30,15%,87%)", background: "hsl(36,33%,94%)" }}
                    >
                      <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: "hsl(25,40%,18%)" }}>
                        {decision.description}
                      </p>
                      {decision.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => act(decision.id, "approved")}
                            disabled={!!isProcessing}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-60"
                            style={{ background: "hsl(142,55%,35%)", color: "white" }}
                          >
                            <CheckCircle2 size={13} />
                            {isProcessing ? "Processing…" : "Approve"}
                          </button>
                          <button
                            onClick={() => act(decision.id, "rejected")}
                            disabled={!!isProcessing}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-60"
                            style={{ background: "#dc2626", color: "white" }}
                          >
                            <XCircle size={13} />
                            {isProcessing ? "Processing…" : "Reject"}
                          </button>
                          <button
                            disabled={!!isProcessing}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold border transition-all disabled:opacity-60"
                            style={{ borderColor: "hsl(30,15%,87%)", color: "hsl(25,40%,18%)", background: "hsl(36,30%,97%)" }}
                          >
                            Request Changes
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Inbox size={32} className="mx-auto mb-3 opacity-30" style={{ color: "hsl(25,40%,18%)" }} />
            <p className="text-sm" style={{ color: "hsl(25,20%,55%)" }}>No decisions match this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
