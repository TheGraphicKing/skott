"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Megaphone, DollarSign, FileText, BarChart3, Rocket,
  Zap, Brain, Bell, ChevronDown, ChevronUp, Check, X,
  Mic, Send, ArrowRight,
} from "lucide-react";
import { useViewStore } from "@/lib/view-store";

// ── Brand tokens ────────────────────────────────────────────
const PRIMARY   = "hsl(25,62%,25%)";
const MUTED     = "hsl(25,20%,50%)";
const CARD      = "hsl(36,30%,97%)";
const BORDER    = "hsl(30,15%,87%)";
const PAGE_BG   = "hsl(36,33%,94%)";
const GREEN     = "hsl(142,55%,35%)";
const RED       = "#dc2626";
const AMBER     = "#d97706";
const BLUE      = "#2563eb";
const DARK_TEXT = "#3a1f0e";

// ── AI search responses ─────────────────────────────────────
function getAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("pipeline"))
    return "Pipeline is currently at $6.2M — 27% behind the $8.5M target. Top contributor: LinkedIn ABM ($2.1M). Recommend: reallocate $15K from Display to LinkedIn for projected +$180K uplift.";
  if (q.includes("approve") || q.includes("approval"))
    return "You have 4 items pending approval: Q2 Board Deck, BFSI Creative, HubSpot Renewal ($48K), and a T&E Exception. Navigate to Approvals & Governance to action them.";
  if (q.includes("campaign"))
    return "23 active campaigns. Top performer: AWS Partnership (420% ROI). At risk: OGI Whitepaper (2 days behind). BFSI Vertical Launch launches tomorrow — 3 assets still pending.";
  if (q.includes("budget"))
    return "FY2026 budget: $4.2M. Spent: $2.89M (69%). Remaining: $1.31M. Pace is on track. Largest category: Paid Ads ($1.2M, 42%). Forecast: on budget through Q4.";
  return "Based on today's data: Pipeline is $6.2M (73% to plan), CAC improved 8% this week to $284, and 4 items need your approval. How can I help further?";
}

function getMarketerAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("task"))
    return "You have 5 tasks today. 2 are HIGH priority: BFSI hero image review (due 10am) and OGI nurture approval (due 2pm). The LinkedIn post is due at 12pm.";
  if (q.includes("campaign"))
    return "You are assigned to 3 campaigns: BFSI Vertical Launch (68%, Active), LinkedIn ABM Enterprise (45%, Active), and OGI Whitepaper (30%, At Risk — 2 days behind schedule).";
  if (q.includes("publish") || q.includes("post"))
    return "Publishing queue has 5 items. Next: LinkedIn post 'AWS Partnership Recap' at 12pm. Reminder: 2 posts still need your final edit before they can be scheduled.";
  return "Good morning! You have 5 tasks, 3 campaigns active, and 5 items in your publishing queue. 2 tasks are HIGH priority today. How can I help?";
}

// ── Journey cards ───────────────────────────────────────────
const journeys = [
  { icon: Rocket,    title: "Campaign Planning",        desc: "Strategic planning, budget allocation, timeline mapping & campaign readiness checklist", href: "/campaign-planning" },
  { icon: TrendingUp,title: "Marketing Performance",   desc: "Multi-channel attribution, ROI analysis, funnel diagnostics & conversion tracking",     href: "/marketing-performance" },
  { icon: Megaphone, title: "Brand & Reputation",       desc: "Share of voice, sentiment monitoring, competitive positioning & crisis detection",       href: "/brand-reputation" },
  { icon: DollarSign,title: "Budget & Spend",           desc: "Budget pacing, variance analysis, vendor management & forecast modeling",                href: "/budget-spend" },
  { icon: FileText,  title: "Content Operations",       desc: "Content calendar, asset pipeline, approval workflows & publishing velocity",              href: "/content-ops" },
  { icon: BarChart3, title: "Analytics & Reporting",    desc: "Board packs, cohort analysis, custom reports & executive dashboards",                    href: "/analytics" },
];

// ── Insight & action data ───────────────────────────────────
const insights = [
  { level: "red",   title: "Pipeline Miss: -$2.3M (-27%)",    body: "Pipeline at $6.2M vs $8.5M target. BFSI and Mid-Market segments underperforming. Recommend accelerating LinkedIn ABM spend." },
  { level: "amber", title: "LinkedIn CPM Inflation +22%",      body: "CPM up in Enterprise IT segment. Consider creative refresh or bid cap adjustment." },
  { level: "amber", title: "5 Campaigns Behind Schedule",      body: "OGI Whitepaper (2d), APAC Launch (1d), Re-engagement (3d), Partner Newsletter (1d), Display Refresh (1d)" },
  { level: "green", title: "Content/SEO ROI at 8.3×",         body: "Outperforming target of 6×. Top post: 'Agentic AI for BFSI' — 4,200 views, 320 MQLs." },
];
const insightDot: Record<string, string> = { red: RED, amber: AMBER, green: GREEN };

type ActionState = "idle" | "approved" | "rejected";
const initialActions = [
  { title: "Q2 Board Deck — Final Sign-Off",           badge: "HIGH",     desc: "Board presentation ready for CMO review. Includes pipeline commentary and updated guidance.",        review: false },
  { title: "BFSI Campaign Creative — Hero Image",      badge: "HIGH",     desc: "Creative pending approval from Morgan Blake. Due before campaign launch tomorrow.",                  review: false },
  { title: "Vendor Contract Renewal — HubSpot Pro",    badge: "",         desc: "Annual renewal ($48K). Agent flagged 12% price increase vs last year. Alternatives scored.",         review: false },
  { title: "VP Sales T&E Exception Report",            badge: "CRITICAL", desc: "Expense anomaly flagged at $47.2K. Requires CMO review before escalation.",                         review: true },
];

const badgeStyle: Record<string, { bg: string; color: string }> = {
  HIGH:     { bg: "#fef2f2", color: RED },
  CRITICAL: { bg: "#fef2f2", color: RED },
  "":       { bg: "hsl(36,30%,90%)", color: MUTED },
};

// ── Marketer tasks ──────────────────────────────────────────
const marketerTasks = [
  { title: "Review BFSI hero image creative",        tag: "Campaign",  priority: "HIGH",   time: "due 10am" },
  { title: "Publish LinkedIn post — AWS Partnership", tag: "Social",    priority: "MEDIUM", time: "due 12pm" },
  { title: "Update keyword list for BFSI blog",       tag: "SEO",       priority: "LOW",    time: "due 3pm"  },
  { title: "Approve email sequence for OGI nurture",  tag: "Email",     priority: "HIGH",   time: "due 2pm"  },
  { title: "Submit weekly analytics report",          tag: "Reporting", priority: "MEDIUM", time: "due 5pm"  },
];

const marketerCampaigns = [
  { name: "BFSI Vertical Launch",      status: "Active",   pct: 68, owner: "Emily Watson" },
  { name: "LinkedIn ABM Enterprise",   status: "Active",   pct: 45, owner: "Priya Sharma" },
  { name: "OGI Whitepaper",            status: "At Risk",  pct: 30, owner: "Emily Watson" },
];

const publishQueue = [
  { platform: "LinkedIn", time: "12:00 PM", content: "AWS Partnership Recap — key wins and customer quotes" },
  { platform: "X",        time: "2:00 PM",  content: "Thread: 5 reasons agentic AI is reshaping B2B marketing" },
  { platform: "Blog",     time: "Jun 3",    content: "Agentic AI for BFSI — 4,200 views, 320 MQLs" },
  { platform: "Email",    time: "Jun 4",    content: "OGI nurture sequence #3 — 1,200 contacts" },
  { platform: "LinkedIn", time: "Jun 5",    content: "Product update: new campaign intelligence features" },
];

// ── Search bar shared component ─────────────────────────────
function SearchBar({ marketer = false }: { marketer?: boolean }) {
  const [query, setQuery]       = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading]   = useState(false);

  function handleSend() {
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");
    setTimeout(() => {
      setResponse(marketer ? getMarketerAIResponse(query) : getAIResponse(query));
      setLoading(false);
    }, 1200);
  }

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <div className="rounded-2xl px-5 py-4 flex items-center gap-3"
        style={{ background: "rgba(255,255,255,0.6)", border: `1px solid ${BORDER}`, boxShadow: "0 4px 24px rgba(58,31,14,0.08)" }}>
        <Mic className="w-5 h-5 shrink-0" style={{ color: MUTED }} />
        <input
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-[hsl(25,20%,65%)]"
          style={{ color: DARK_TEXT }}
          placeholder="How can I help?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="p-2.5 rounded-xl transition-opacity hover:opacity-80"
          style={{ background: PRIMARY }}>
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div key="loading" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 max-w-2xl mx-auto rounded-xl px-5 py-4 flex items-center gap-3"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <Brain className="w-4 h-4 shrink-0" style={{ color: PRIMARY }} />
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: PRIMARY, animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </motion.div>
        )}
        {response && !loading && (
          <motion.div key="response" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 max-w-2xl mx-auto rounded-xl px-5 py-4 flex items-start gap-3"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <Brain className="w-4 h-4 mt-0.5 shrink-0" style={{ color: PRIMARY }} />
            <p className="text-sm leading-relaxed" style={{ color: DARK_TEXT }}>{response}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── CMO view ────────────────────────────────────────────────
function CMOView() {
  const [insightsOpen, setInsightsOpen] = useState(true);
  const [actionStates, setActionStates] = useState<ActionState[]>(initialActions.map(() => "idle"));
  const [visible, setVisible] = useState<boolean[]>(initialActions.map(() => true));

  function handleAction(i: number, action: "approved" | "rejected") {
    setActionStates(s => s.map((v, idx) => idx === i ? action : v));
    setTimeout(() => setVisible(v => v.map((val, idx) => idx === i ? false : val)), 800);
  }

  return (
    <>
      <SearchBar />

      {/* Agent Journeys */}
      <div className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>Agent Journeys</span>
          <Zap className="w-3 h-3" style={{ color: MUTED }} />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {journeys.map((j, i) => (
            <motion.div key={j.title}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(58,31,14,0.12)" }}
              className="rounded-xl p-5 flex flex-col cursor-pointer"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <Link href={j.href} className="flex flex-col h-full">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: `${PRIMARY}18` }}>
                  <j.icon className="w-5 h-5" style={{ color: PRIMARY }} />
                </div>
                <span className="text-sm font-semibold mt-3" style={{ color: DARK_TEXT }}>{j.title}</span>
                <span className="text-xs mt-1 leading-relaxed" style={{ color: MUTED }}>{j.desc}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* End-to-End Workflows */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>End-to-End Workflows</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${PRIMARY}15`, color: PRIMARY }}>12 ACTIVE</span>
          </div>
          <span className="text-[11px]" style={{ color: MUTED }}>AI-orchestrated multi-agent journeys</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { title: "Campaign Launch Orchestrator",    desc: "Plan → Content → Creative → Email → Social → Paid → Ship", href: "/campaign-planning",      color: PRIMARY, steps: 7 },
            { title: "SEO Content Factory",             desc: "Keyword research → Brief → Draft → Publish → Track",        href: "/seo",                    color: BLUE,    steps: 5 },
            { title: "Lead Nurture & Sales Handoff",    desc: "Score → Segment → Nurture → Route → Close",                 href: "/digital/lead-ops",       color: GREEN,   steps: 5 },
            { title: "Content Atomization",             desc: "Long-form → Blog → Social → Email → Ads → Analytics",       href: "/content-ops",            color: AMBER,   steps: 6 },
            { title: "Paid Media Performance Rescue",   desc: "Diagnose → Reallocate → Optimize → Monitor → Report",       href: "/paid-media",             color: RED,     steps: 5 },
            { title: "Website Conversion Optimizer",    desc: "Audit → Gaps → A/B Test → Update → Measure",                href: "/digital/website-ops",    color: BLUE,    steps: 5 },
            { title: "Event Planning & Promotion",      desc: "Plan → Create Assets → Promote → Capture → Nurture",        href: "/growth/events",          color: PRIMARY, steps: 5 },
            { title: "Creative Request Pipeline",       desc: "Request → Design → Review → Approve → Deploy",              href: "/creative-hub",           color: AMBER,   steps: 5 },
            { title: "Brand Crisis Response",           desc: "Alert → Assess → Draft → Publish → Monitor",                href: "/brand-reputation",       color: RED,     steps: 5 },
            { title: "Sales Content Builder",           desc: "Brief → Research → Draft → Review → Distribute",            href: "/growth/sales-enablement",color: GREEN,   steps: 5 },
            { title: "Budget Intelligence",             desc: "Audit → Model → Recommend → Approve → Reallocate",          href: "/budget-spend",           color: AMBER,   steps: 5 },
            { title: "Analyst Briefing Pipeline",       desc: "Research → Brief → Schedule → Present → Follow-up",         href: "/growth/analyst-relations",color: BLUE,  steps: 5 },
          ].map((w, i) => (
            <motion.div key={w.title}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.04 }}
              whileHover={{ scale: 1.015, boxShadow: "0 6px 20px rgba(58,31,14,0.1)" }}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer" }}>
              <Link href={w.href} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: w.color, marginTop: 5, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: w.color, background: `${w.color}12`, padding: "2px 7px", borderRadius: 99 }}>{w.steps} steps</span>
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: DARK_TEXT, marginBottom: 4, lineHeight: 1.4 }}>{w.title}</p>
                <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.45 }}>{w.desc}</p>
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ flex: 1, height: 3, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${60 + i * 3}%`, height: "100%", background: w.color, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 10, color: w.color, fontWeight: 700 }}>{60 + i * 3}%</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom two-column */}
      <div className="mt-10 grid grid-cols-2 gap-6">

        {/* LEFT — Agent Insights */}
        <div className="rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 px-5 py-4 cursor-pointer" style={{ borderBottom: `1px solid ${BORDER}` }}
            onClick={() => setInsightsOpen(o => !o)}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: RED }} />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: RED }} />
            </span>
            <span className="text-sm font-semibold" style={{ color: DARK_TEXT }}>Agent Insights</span>
            <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: "#fef2f2", color: RED }}>4</span>
            <div className="ml-auto" style={{ color: MUTED }}>
              {insightsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
          <AnimatePresence>
            {insightsOpen && (
              <motion.div key="insights" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden">
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {insights.map((ins, i) => (
                    <div key={i} className="px-5 py-4 flex gap-3">
                      <div className="mt-1 w-2.5 h-2.5 rounded-full shrink-0" style={{ background: insightDot[ins.level] }} />
                      <div>
                        <p className="text-xs font-semibold" style={{ color: DARK_TEXT }}>{ins.title}</p>
                        <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: MUTED }}>{ins.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <button className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: BLUE }}>
                    Show all 6 insights <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT — Actions Required */}
        <div className="rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <Bell className="w-4 h-4" style={{ color: PRIMARY }} />
            <span className="text-sm font-semibold" style={{ color: DARK_TEXT }}>Actions Required</span>
            <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: "#fef2f2", color: RED }}>4</span>
          </div>
          <div className="divide-y" style={{ borderColor: BORDER }}>
            {initialActions.map((action, i) => {
              if (!visible[i]) return null;
              const state = actionStates[i];
              return (
                <motion.div key={i}
                  animate={state !== "idle" ? { backgroundColor: state === "approved" ? "#f0fdf4" : "#fef2f2" } : {}}
                  className="px-5 py-4">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-xs font-semibold flex-1" style={{ color: DARK_TEXT }}>{action.title}</span>
                    {action.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                        style={badgeStyle[action.badge]}>
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed mb-3" style={{ color: MUTED }}>{action.desc}</p>
                  {state === "idle" ? (
                    <div className="flex gap-2">
                      {!action.review ? (
                        <>
                          <button onClick={() => handleAction(i, "approved")}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-opacity hover:opacity-80"
                            style={{ background: GREEN }}>
                            <Check className="w-3 h-3" /> Approve
                          </button>
                          <button onClick={() => handleAction(i, "rejected")}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-opacity hover:opacity-80"
                            style={{ background: "#fef2f2", color: RED }}>
                            <X className="w-3 h-3" /> Reject
                          </button>
                        </>
                      ) : (
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-opacity hover:opacity-80"
                          style={{ background: BLUE }}>
                          Review
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] font-semibold" style={{ color: state === "approved" ? GREEN : RED }}>
                      {state === "approved" ? "✓ Approved" : "✗ Rejected"}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="px-5 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
            <button className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: BLUE }}>
              Show 2 more <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Marketer view ────────────────────────────────────────────
function MarketerView() {
  const [done, setDone] = useState<Set<number>>(new Set());
  function toggle(i: number) {
    setDone(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  }
  const priorityDot: Record<string, string> = { HIGH: RED, MEDIUM: AMBER, LOW: GREEN };
  const statusColor: Record<string, string>  = { Active: GREEN, "At Risk": RED };

  return (
    <>
      <SearchBar marketer />

      {/* Today's Tasks */}
      <div className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-semibold" style={{ color: DARK_TEXT }}>Today&apos;s Tasks</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#fef2f2", color: RED }}>
            {marketerTasks.length}
          </span>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {marketerTasks.map((task, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-white/50 transition-colors cursor-pointer"
              style={{ borderBottom: i < marketerTasks.length - 1 ? `1px solid ${BORDER}` : undefined }}
              onClick={() => toggle(i)}>
              <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                style={{ borderColor: done.has(i) ? GREEN : BORDER, background: done.has(i) ? GREEN : "transparent" }}>
                {done.has(i) && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium" style={{ color: DARK_TEXT, textDecoration: done.has(i) ? "line-through" : undefined, opacity: done.has(i) ? 0.5 : 1 }}>
                  {task.title}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "hsl(36,30%,90%)", color: MUTED }}>{task.tag}</span>
                  <span className="text-[10px]" style={{ color: MUTED }}>{task.time}</span>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: priorityDot[task.priority] }} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom two-column */}
      <div className="mt-8 grid grid-cols-2 gap-6">

        {/* LEFT — My Campaigns */}
        <div className="rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <Rocket className="w-4 h-4" style={{ color: PRIMARY }} />
            <span className="text-sm font-semibold" style={{ color: DARK_TEXT }}>My Campaigns</span>
          </div>
          <div className="divide-y" style={{ borderColor: BORDER }}>
            {marketerCampaigns.map((c, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold flex-1" style={{ color: DARK_TEXT }}>{c.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: c.status === "Active" ? "hsl(142,55%,93%)" : "#fef2f2", color: statusColor[c.status] }}>
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: BORDER }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${c.pct}%`, background: c.status === "At Risk" ? AMBER : PRIMARY }} />
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: MUTED }}>{c.pct}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: MUTED }}>{c.owner}</span>
                  <Link href="/campaigns" className="text-[10px] font-medium hover:underline flex items-center gap-0.5" style={{ color: BLUE }}>
                    View <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Publishing Queue */}
        <div className="rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <FileText className="w-4 h-4" style={{ color: PRIMARY }} />
            <span className="text-sm font-semibold" style={{ color: DARK_TEXT }}>Publishing Queue</span>
          </div>
          <div className="divide-y" style={{ borderColor: BORDER }}>
            {publishQueue.map((p, i) => (
              <div key={i} className="px-5 py-3.5 flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: `${PRIMARY}18`, color: PRIMARY }}>{p.platform}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-snug" style={{ color: DARK_TEXT }}>{p.content}</p>
                  <span className="text-[10px]" style={{ color: MUTED }}>{p.time}</span>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button className="text-[10px] font-semibold px-2 py-1 rounded-md transition-opacity hover:opacity-80"
                    style={{ background: `${PRIMARY}18`, color: PRIMARY }}>Edit</button>
                  <button className="text-[10px] font-semibold px-2 py-1 rounded-md text-white transition-opacity hover:opacity-80"
                    style={{ background: PRIMARY }}>Publish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Root page ────────────────────────────────────────────────
export default function HomePage() {
  const { viewMode } = useViewStore();

  return (
    <div className="min-h-full" style={{ background: PAGE_BG }}>
      <div className="max-w-4xl mx-auto pt-12 pb-16 px-6">

        {/* Top Center */}
        <div className="flex flex-col items-center text-center">
          <Image src="/lyzr-logo.png" alt="Lyzr" height={40} width={120} style={{ height: 40, width: "auto" }} priority />
          <h1 className="text-4xl font-bold mt-4" style={{ color: DARK_TEXT }}>Welcome back</h1>
          <p className="text-base mt-1" style={{ color: MUTED }}>
            {viewMode === "cmo"
              ? "CMO Office AgenticOS — Autonomous marketing intelligence"
              : "Your marketing workspace — tasks, campaigns & content"}
          </p>
        </div>

        {/* View-specific content */}
        <AnimatePresence mode="wait">
          {viewMode === "cmo" ? (
            <motion.div key="cmo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <CMOView />
            </motion.div>
          ) : (
            <motion.div key="marketer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <MarketerView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
