"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  ClipboardCheck,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Eye,
  ChevronDown,
  ChevronRight,
  Send,
  Mic,
  FileText,
  Sparkles,
  Paperclip,
  X,
  PenLine,
  Megaphone,
  Target,
  Globe,
  Share2,
  TrendingUp,
} from "lucide-react";

// ─── Design tokens ──────────────────────────────────────────────────────────
const PRIMARY = "#67391b";
const PRIMARY_LIGHT = "rgba(103,57,27,0.10)";
const SUCCESS = "hsl(142,55%,35%)";
const WARNING = "hsl(38,80%,50%)";
const DESTRUCTIVE = "hsl(0,72%,45%)";

// ─── CMO Journey cards ───────────────────────────────────────────────────────
const cmoJourneys = [
  {
    label: "Blog & Content Engine",
    desc: "Keyword research, AI drafting, SEO optimization & WordPress publishing pipeline",
    path: "/content",
    icon: PenLine,
  },
  {
    label: "Demand Generation",
    desc: "Campaign targeting, lead scoring, MQL attribution & pipeline acceleration",
    path: "/performance-marketing",
    icon: Megaphone,
  },
  {
    label: "ABM Intelligence",
    desc: "Account intent signals, personalized outreach, engagement tracking & deal influence",
    path: "/growth",
    icon: Target,
  },
  {
    label: "SEO & Search",
    desc: "Rankings, AEO citations, backlink velocity, keyword gaps & GEO positioning",
    path: "/seo",
    icon: Globe,
  },
  {
    label: "Social & Influencer",
    desc: "Multi-platform scheduling, trend radar, creator discovery & brand voice QC",
    path: "/social-media",
    icon: Share2,
  },
  {
    label: "Performance Marketing",
    desc: "Ad spend optimization, ROAS tracking, anomaly detection & budget reallocation",
    path: "/performance-marketing",
    icon: TrendingUp,
  },
];

// ─── Marketing Team Journey cards ────────────────────────────────────────────
const teamJourneys = [
  {
    label: "My Content Queue",
    desc: "Drafts pending review, scheduled posts, approvals & content calendar tasks",
    path: "/content",
    icon: PenLine,
  },
  {
    label: "Campaign Tasks",
    desc: "Active campaign to-dos, asset requests, copy reviews & launch checklists",
    path: "/performance-marketing",
    icon: Megaphone,
  },
  {
    label: "Social Calendar",
    desc: "Upcoming posts, platform-specific scheduling & engagement tracking",
    path: "/social-media",
    icon: Share2,
  },
  {
    label: "Keyword Assignments",
    desc: "Assigned clusters, gap analysis tasks, ranking alerts & content briefs",
    path: "/seo",
    icon: Globe,
  },
  {
    label: "Outreach Sequences",
    desc: "ABM sequences in-flight, reply handling, meeting links & follow-up queues",
    path: "/growth",
    icon: Target,
  },
  {
    label: "Analytics Reports",
    desc: "Weekly performance snapshots, channel attribution & stakeholder summaries",
    path: "/chief-of-staff",
    icon: TrendingUp,
  },
];

// ─── CMO insights (mock) ─────────────────────────────────────────────────────
const cmoInsights = [
  {
    id: "i1",
    severity: "critical",
    headline: "Pipeline Coverage Below 3× — Q2 at Risk",
    summary: "Marketing-sourced pipeline is $2.4M short of 3× coverage ratio required by RevOps. Content MQLs down 18% MoM.",
    actionLabel: "Investigate →",
  },
  {
    id: "i2",
    severity: "warning",
    headline: "LinkedIn CPL Spike — 42% Above Benchmark",
    summary: "Paid LinkedIn cost-per-lead rose from $84 to $119 in the past 14 days. Creative fatigue detected across 3 ad sets.",
    actionLabel: "Review →",
  },
  {
    id: "i3",
    severity: "positive",
    headline: "Organic Share of Voice +6 pts in 30 Days",
    summary: "SEO agent added 14 AEO-optimized articles. AI citation appearances in SGE results increased from 12 to 31.",
    actionLabel: "View report →",
  },
  {
    id: "i4",
    severity: "info",
    headline: "Competitor TechCorp Raised $120M Series C",
    summary: "Signal intelligence flagged funding announcement. Sales enablement deck update recommended within 72 hours.",
    actionLabel: "Draft response →",
  },
  {
    id: "i5",
    severity: "warning",
    headline: "Email Deliverability Rate Dropped to 91%",
    summary: "HubSpot domain health score degraded. SPF/DKIM misalignment detected on 2 sending domains.",
    actionLabel: "Fix now →",
  },
  {
    id: "i6",
    severity: "positive",
    headline: "Webinar Registrations Beat Target by 34%",
    summary: "'AI in Revenue Operations' webinar hit 2,340 registrations vs 1,750 target. Highest-performing invite copy variant surfaced.",
    actionLabel: "See breakdown →",
  },
];

// ─── Team insights (mock) ────────────────────────────────────────────────────
const teamInsights = [
  {
    id: "t1",
    severity: "warning",
    headline: "3 Blog Drafts Overdue for Review",
    summary: "The April keyword cluster has 3 posts exceeding 5-day SLA. Awaiting your approval before scheduling.",
    actionLabel: "Review drafts →",
  },
  {
    id: "t2",
    severity: "info",
    headline: "Social Calendar Gap Next Week",
    summary: "Tuesday–Thursday have no scheduled posts across LinkedIn and Twitter. Content queue has 4 ready-to-publish pieces.",
    actionLabel: "Schedule now →",
  },
  {
    id: "t3",
    severity: "positive",
    headline: "Your ABM Sequence Hit 48% Reply Rate",
    summary: "The 'Fintech Q2 Targets' sequence is performing 2.3× above team average. Consider scaling to 50 more accounts.",
    actionLabel: "Scale up →",
  },
  {
    id: "t4",
    severity: "critical",
    headline: "Google Analytics Tracking Broken on /pricing",
    summary: "GA4 event loss detected since May 10. ~6,400 sessions untracked. Immediate tag fix required.",
    actionLabel: "Fix tracking →",
  },
  {
    id: "t5",
    severity: "info",
    headline: "New Keyword Cluster Assigned — 'Revenue AI'",
    summary: "18 keywords with avg 3,200 monthly searches added to your queue. 4 content briefs auto-generated.",
    actionLabel: "View briefs →",
  },
  {
    id: "t6",
    severity: "positive",
    headline: "Weekly Report Ready for Stakeholders",
    summary: "Auto-generated marketing performance report for May 6–12 is ready. Covers MQLs, pipeline, spend, and SEO.",
    actionLabel: "Send report →",
  },
];

// ─── Pending actions (mock) ──────────────────────────────────────────────────
const cmoPendingActions = [
  {
    id: "pa1",
    type: "approval",
    title: "LinkedIn Ads Budget Increase — +$45K",
    description: "Agent recommends shifting $45K from Google Display to LinkedIn for ABM targeting. ROAS model projects 2.1× return on incremental spend.",
    amount: "$45K",
    urgency: "high",
    dueDate: "May 16, 2026",
    category: "Paid Media",
  },
  {
    id: "pa2",
    type: "approval",
    title: "Q3 Campaign Calendar — 28 Campaigns",
    description: "Proposed Q3 calendar with 28 campaigns across demand gen, content, events and brand. Requires CMO sign-off before agency briefing.",
    amount: undefined,
    urgency: "high",
    dueDate: "May 17, 2026",
    category: "Strategy",
  },
  {
    id: "pa3",
    type: "review",
    title: "Churn Attribution Analysis — April Cohort",
    description: "Agent flagged marketing-influenced churn at 6.2% in April cohort — 2× benchmark. Exit surveys cite misaligned messaging vs. product reality.",
    amount: undefined,
    urgency: "critical",
    dueDate: "May 15, 2026",
    category: "Retention",
  },
  {
    id: "pa4",
    type: "approval",
    title: "Event Sponsorship — SaaStr Annual 2026",
    description: "Proposal for Platinum sponsorship at SaaStr ($87K). Includes keynote slot, booth, and 2 sponsored sessions. ROI model attached.",
    amount: "$87K",
    urgency: "medium",
    dueDate: "May 20, 2026",
    category: "Events",
  },
  {
    id: "pa5",
    type: "review",
    title: "Brand Compliance Audit — Q1 Findings",
    description: "Brand QC agent flagged 34 assets with off-brand usage across 6 teams. Recommends mandatory brand training and asset library refresh.",
    amount: undefined,
    urgency: "medium",
    dueDate: "May 19, 2026",
    category: "Brand",
  },
];

// ─── Integrated systems ──────────────────────────────────────────────────────
const integratedSystems = [
  { id: "hs", name: "HubSpot" },
  { id: "ga4", name: "GA4" },
  { id: "apollo", name: "Apollo" },
  { id: "semrush", name: "SEMrush" },
  { id: "li", name: "LinkedIn Ads" },
  { id: "sf", name: "Salesforce" },
];

// ─── Animation variants ──────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function severityColor(s: string) {
  if (s === "critical") return DESTRUCTIVE;
  if (s === "warning") return WARNING;
  if (s === "positive") return SUCCESS;
  return PRIMARY;
}

function SeverityIcon({ severity }: { severity: string }) {
  const color = severityColor(severity);
  const cls = "w-3.5 h-3.5 flex-shrink-0";
  if (severity === "critical" || severity === "warning")
    return <AlertTriangle className={cls} style={{ color }} />;
  if (severity === "positive")
    return <CheckCircle2 className={cls} style={{ color }} />;
  return <Info className={cls} style={{ color }} />;
}

function urgencyBorder(u: string) {
  if (u === "critical") return `1px solid ${DESTRUCTIVE}33`;
  if (u === "high") return `1px solid ${WARNING}33`;
  return "1px solid hsl(30,15%,85%)";
}

function urgencyIconStyle(u: string): React.CSSProperties {
  if (u === "critical") return { background: `${DESTRUCTIVE}18`, color: DESTRUCTIVE };
  if (u === "high") return { background: `${WARNING}18`, color: WARNING };
  return { background: PRIMARY_LIGHT, color: PRIMARY };
}

function urgencyBadgeStyle(u: string): React.CSSProperties {
  if (u === "critical") return { background: `${DESTRUCTIVE}15`, color: DESTRUCTIVE };
  if (u === "high") return { background: `${WARNING}15`, color: WARNING };
  return { background: "hsl(25,20%,50%,0.1)", color: "hsl(25,20%,50%)" };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CommandCenter() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [attachment, setAttachment] = useState<{ name: string; content: string } | null>(null);
  const [activeView, setActiveView] = useState<"cmo" | "team">("cmo");
  const [dismissedActions, setDismissedActions] = useState<Set<string>>(new Set());
  const [showAllActions, setShowAllActions] = useState(false);
  const [showAllInsights, setShowAllInsights] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const journeys = activeView === "cmo" ? cmoJourneys : teamJourneys;
  const insights = activeView === "cmo" ? cmoInsights : teamInsights;
  const allActions = cmoPendingActions.filter((a) => !dismissedActions.has(a.id));
  const displayedActions = showAllActions ? allActions : allActions.slice(0, 3);
  const hasMoreActions = allActions.length > 3 && !showAllActions;
  const displayedInsights = showAllInsights ? insights : insights.slice(0, 3);
  const hasMoreInsights = insights.length > 3 && !showAllInsights;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be under 2MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setAttachment({ name: file.name, content });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleQuerySubmit = () => {
    if (!query.trim() && !attachment) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set("message", query.trim());
    if (attachment) sessionStorage.setItem("mktg_attachment", JSON.stringify(attachment));
    router.push(`/agent-console?${params.toString()}`);
  };

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-4 pb-10">
      {/* ── Hero / Search ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center text-center pt-16 pb-8"
      >
        {/* View toggle — absolute top-right */}
        <div className="absolute right-0 top-0 flex items-center rounded-xl overflow-hidden border"
          style={{ borderColor: "hsl(30,15%,85%)", background: "hsl(36,30%,97%)" }}>
          <button
            onClick={() => { setActiveView("cmo"); setShowAllInsights(false); setShowAllActions(false); }}
            className="px-4 py-2 text-[11.5px] font-semibold transition-all"
            style={
              activeView === "cmo"
                ? { background: PRIMARY, color: "hsl(36,33%,96%)" }
                : { background: "transparent", color: "hsl(25,20%,50%)" }
            }
          >
            CMO Office
          </button>
          <button
            onClick={() => { setActiveView("team"); setShowAllInsights(false); setShowAllActions(false); }}
            className="px-4 py-2 text-[11.5px] font-semibold transition-all"
            style={
              activeView === "team"
                ? { background: PRIMARY, color: "hsl(36,33%,96%)" }
                : { background: "transparent", color: "hsl(25,20%,50%)" }
            }
          >
            Marketing Team
          </button>
        </div>

        {/* Logo */}
        <img
          src="/lyzr-logo.png"
          alt="Lyzr"
          className="h-8 object-contain mb-4"
        />

        {/* Headline */}
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "hsl(25,40%,18%)" }}>
          CMO Office{" "}
          <span style={{ color: PRIMARY }}>AgenticOS</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: "hsl(25,20%,45%)" }}>
          AgenticOS — Autonomous marketing intelligence for the modern enterprise
        </p>

        {/* Search bar */}
        <div className="mt-5 w-full max-w-2xl">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".csv,.json,.txt,.md,.xml,.tsv"
            className="hidden"
          />
          <div className="relative">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-1 rounded-lg transition-colors"
              style={{ color: "hsl(25,20%,60%)" }}
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuerySubmit()}
              placeholder="How can I help?"
              className="w-full border rounded-2xl pl-11 pr-24 py-3.5 text-sm focus:outline-none focus:ring-2 placeholder:text-muted-foreground/40"
              style={{
                background: "hsl(36,30%,97%,0.8)",
                backdropFilter: "blur(16px)",
                borderColor: "hsl(30,15%,85%)",
                color: "hsl(25,40%,18%)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06),0 1px 4px rgba(0,0,0,0.04)",
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                className="p-2 rounded-lg transition-colors"
                style={{ color: "hsl(25,20%,60%)" }}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={handleQuerySubmit}
                disabled={!query.trim() && !attachment}
                className="p-2.5 rounded-xl transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: PRIMARY, color: "hsl(36,33%,96%)" }}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Attachment pill */}
          <AnimatePresence>
            {attachment && (
              <motion.div
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 border"
                style={{ background: "hsl(36,30%,97%)", borderColor: "hsl(30,15%,85%)" }}
              >
                <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: PRIMARY }} />
                <span className="text-xs truncate flex-1" style={{ color: "hsl(25,40%,18%)" }}>
                  {attachment.name}
                </span>
                <span className="text-[10px] flex-shrink-0" style={{ color: "hsl(25,20%,55%)" }}>
                  {(attachment.content.length / 1024).toFixed(1)}KB
                </span>
                <button
                  onClick={() => setAttachment(null)}
                  className="p-0.5 rounded transition-colors flex-shrink-0"
                >
                  <X className="w-3 h-3" style={{ color: "hsl(25,20%,55%)" }} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Integrated systems row */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 w-full"
          >
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap"
                style={{ color: "hsl(25,20%,55%)" }}
              >
                Integrated Systems
              </span>
              {integratedSystems.map((sys) => (
                <span
                  key={sys.id}
                  className="text-[10.5px] font-medium px-2.5 py-1 rounded-full border"
                  style={{
                    background: "hsl(36,30%,97%)",
                    borderColor: "hsl(30,15%,85%)",
                    color: "hsl(25,30%,40%)",
                  }}
                >
                  {sys.name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Agent Journeys header */}
          <div className="flex items-center gap-2 mt-6 mb-2 w-full">
            <Sparkles className="w-3.5 h-3.5" style={{ color: PRIMARY }} />
            <h2
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "hsl(25,40%,18%)" }}
            >
              ✦ Agent Journeys
            </h2>
          </div>

          {/* Journey cards — 2-col grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-3 w-full"
            >
              {journeys.map((card, idx) => (
                <div key={card.path + card.label} className="relative">
                  {/* Tooltip on first card — positioned below so it's not clipped */}
                  {idx === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute top-full left-0 mt-2 z-10 pointer-events-none flex flex-col items-start"
                    >
                      <div
                        className="w-0 h-0"
                        style={{
                          borderLeft: "6px solid transparent",
                          borderRight: "6px solid transparent",
                          borderBottom: `6px solid ${PRIMARY}`,
                          marginLeft: 16,
                        }}
                      />
                      <div
                        className="text-[10px] font-medium px-3 py-2 rounded-lg shadow-lg leading-relaxed"
                        style={{ background: PRIMARY, color: "hsl(36,33%,96%)" }}
                      >
                        {activeView === "cmo"
                          ? "Start here — analyze content gaps, flag underperforming keywords & generate pipeline content"
                          : "Start here — review your queue, prioritize drafts & launch today's tasks"}
                      </div>
                    </motion.div>
                  )}
                  <Link href={card.path}>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + idx * 0.05 }}
                      className="group flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.6)",
                        backdropFilter: "blur(8px)",
                        borderColor: idx === 0 ? `${PRIMARY}28` : "hsl(30,15%,85%,0.6)",
                        boxShadow: idx === 0 ? `0 0 0 1px ${PRIMARY}12` : undefined,
                      }}
                    >
                      <div
                        className="p-2 rounded-lg transition-colors flex-shrink-0"
                        style={{ background: PRIMARY_LIGHT, color: PRIMARY }}
                      >
                        <card.icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <span
                          className="text-sm font-semibold block transition-colors"
                          style={{ color: "hsl(25,40%,18%)" }}
                        >
                          {card.label}
                        </span>
                        <p
                          className="text-[11px] leading-relaxed mt-0.5"
                          style={{ color: "hsl(25,20%,50%)" }}
                        >
                          {card.desc}
                        </p>
                      </div>
                      <ChevronRight
                        className="w-4 h-4 flex-shrink-0 transition-all group-hover:translate-x-0.5"
                        style={{ color: "hsl(25,20%,60%)" }}
                      />
                    </motion.div>
                  </Link>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Insights + Actions ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Agent Insights — col-span-3 */}
        <div className="lg:col-span-3 space-y-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="w-3.5 h-3.5" style={{ color: PRIMARY }} />
            <h2 className="text-xs font-semibold" style={{ color: "hsl(25,40%,18%)" }}>
              Agent Insights
            </h2>
            <span
              className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
              style={{ background: PRIMARY_LIGHT, color: PRIMARY }}
            >
              {insights.length}
            </span>
          </div>

          <div
            className="rounded-2xl border p-1"
            style={{
              background: "rgba(255,255,255,0.4)",
              backdropFilter: "blur(8px)",
              borderColor: "hsl(30,15%,85%,0.5)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView + "-insights"}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-0"
              >
                {displayedInsights.map((insight, idx) => (
                  <motion.div
                    key={insight.id}
                    variants={itemVariants}
                    className="group flex items-start gap-2.5 py-2.5 px-2 rounded-xl transition-colors hover:bg-white/50"
                    style={{ borderTop: idx !== 0 ? "1px solid hsl(30,15%,88%,0.4)" : undefined }}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <SeverityIcon severity={insight.severity} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] leading-snug" style={{ color: "hsl(25,40%,18%)" }}>
                        <span className="font-semibold">{insight.headline}</span>
                        <span style={{ color: "hsl(25,20%,50%)" }}> — {insight.summary}</span>
                      </p>
                      <button
                        onClick={() => router.push("/agent-console")}
                        className="inline-flex items-center text-[10px] font-medium transition-colors mt-0.5 opacity-0 group-hover:opacity-100"
                        style={{ color: PRIMARY }}
                      >
                        {insight.actionLabel}
                        <ArrowRight className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {hasMoreInsights && (
              <button
                onClick={() => setShowAllInsights(true)}
                className="w-full py-1.5 text-[10px] font-medium transition-all flex items-center justify-center gap-1"
                style={{ color: PRIMARY }}
              >
                Show all {insights.length} insights
                <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Actions Required — col-span-2 */}
        <div className="lg:col-span-2 space-y-2.5">
          {allActions.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h2
                  className="text-xs font-semibold flex items-center gap-1.5"
                  style={{ color: "hsl(25,40%,18%)" }}
                >
                  <ClipboardCheck className="w-3.5 h-3.5" style={{ color: PRIMARY }} />
                  Actions Required
                  <span
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{ background: PRIMARY_LIGHT, color: PRIMARY }}
                  >
                    {allActions.length}
                  </span>
                </h2>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView + "-actions"}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-2"
                >
                  {displayedActions.map((action) => (
                    <motion.div
                      key={action.id}
                      variants={itemVariants}
                      className="rounded-2xl p-3 border transition-all"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(16px)",
                        border: urgencyBorder(action.urgency),
                        boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="p-1.5 rounded-lg mt-0.5 flex-shrink-0"
                          style={urgencyIconStyle(action.urgency)}
                        >
                          {action.type === "approval" ? (
                            <ThumbsUp className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3
                              className="font-semibold text-[12px] leading-tight"
                              style={{ color: "hsl(25,40%,18%)" }}
                            >
                              {action.title}
                            </h3>
                            <span
                              className="text-[7px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                              style={urgencyBadgeStyle(action.urgency)}
                            >
                              {action.urgency}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span
                              className="text-[8px] uppercase tracking-wider font-semibold"
                              style={{ color: "hsl(25,20%,55%)" }}
                            >
                              {action.category}
                            </span>
                            <span
                              className="text-[8px] flex items-center gap-0.5"
                              style={{ color: "hsl(25,20%,55%)" }}
                            >
                              <Clock className="w-2.5 h-2.5" /> {action.dueDate}
                            </span>
                            {action.amount && (
                              <span
                                className="text-[8px] font-mono font-semibold px-1 py-0.5 rounded"
                                style={{
                                  background: "hsl(36,30%,92%)",
                                  color: "hsl(25,40%,22%)",
                                }}
                              >
                                {action.amount}
                              </span>
                            )}
                          </div>
                          <p
                            className="text-[10px] mt-1 leading-relaxed line-clamp-2"
                            style={{ color: "hsl(25,20%,50%)" }}
                          >
                            {action.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1.5 mt-2 ml-8">
                        {action.type === "approval" ? (
                          <>
                            <button
                              onClick={() =>
                                setDismissedActions((prev) => new Set(prev).add(action.id))
                              }
                              className="px-2 py-0.5 text-[10px] font-medium rounded-lg transition-colors flex items-center gap-1"
                              style={{
                                background: `${SUCCESS}18`,
                                color: SUCCESS,
                              }}
                            >
                              <ThumbsUp className="w-2.5 h-2.5" /> Approve
                            </button>
                            <button
                              onClick={() =>
                                setDismissedActions((prev) => new Set(prev).add(action.id))
                              }
                              className="px-2 py-0.5 text-[10px] font-medium rounded-lg transition-colors flex items-center gap-1"
                              style={{
                                background: `${DESTRUCTIVE}15`,
                                color: DESTRUCTIVE,
                              }}
                            >
                              <ThumbsDown className="w-2.5 h-2.5" /> Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              setDismissedActions((prev) => new Set(prev).add(action.id))
                            }
                            className="px-2 py-0.5 text-[10px] font-medium rounded-lg transition-colors flex items-center gap-1"
                            style={{ background: PRIMARY_LIGHT, color: PRIMARY }}
                          >
                            <Eye className="w-2.5 h-2.5" /> Review
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {hasMoreActions && (
                <button
                  onClick={() => setShowAllActions(true)}
                  className="w-full py-1.5 text-[10px] font-medium rounded-xl border transition-all flex items-center justify-center gap-1"
                  style={{
                    color: PRIMARY,
                    background: "rgba(255,255,255,0.5)",
                    backdropFilter: "blur(8px)",
                    borderColor: "hsl(30,15%,85%)",
                  }}
                >
                  Show {allActions.length - 3} more
                  <ChevronDown className="w-3 h-3" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
