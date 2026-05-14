"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, AlertTriangle, CheckCircle2, Clock, Zap,
  ArrowUpRight, ArrowDownRight, Brain, Rocket, Target, DollarSign,
  BarChart3, Users, Megaphone, Shield, Circle,
  ChevronRight, Sparkles, Globe, Bell,
} from "lucide-react";

const PRIMARY = "hsl(25,62%,25%)";
const MUTED = "hsl(25,20%,50%)";
const CARD = "hsl(36,30%,97%)";
const BORDER = "hsl(30,15%,87%)";
const GREEN = "hsl(142,55%,35%)";
const RED = "#dc2626";
const AMBER = "#d97706";
const BLUE = "#2563eb";

const cmoKpis = [
  { label: "Revenue Influenced", value: "$4.2M", delta: "+18.3%", dir: "up", sub: "vs last month", icon: DollarSign, color: GREEN },
  { label: "Pipeline Contribution", value: "$12.8M", delta: "+24.1%", dir: "up", sub: "vs last quarter", icon: TrendingUp, color: BLUE },
  { label: "Marketing CAC", value: "$284", delta: "-12.4%", dir: "down-good", sub: "vs Q1 avg $324", icon: Target, color: GREEN },
  { label: "Blended ROAS", value: "4.2×", delta: "+0.8×", dir: "up", sub: "target: 3.5×", icon: BarChart3, color: GREEN },
  { label: "Active Campaigns", value: "23", delta: "8 live", dir: "neutral", sub: "5 pending approval", icon: Rocket, color: PRIMARY },
  { label: "Budget Utilized", value: "67%", delta: "$2.1M / $3.2M", dir: "neutral", sub: "Q2 allocation", icon: DollarSign, color: AMBER },
];

const campaigns = [
  { name: "Q2 Enterprise Launch", status: "live", budget: "$450K", spent: 72, ctr: "3.2%", roas: "5.1×", team: ["SM", "AK", "RB"], risk: "low" },
  { name: "EMEA Expansion Wave", status: "at-risk", budget: "$280K", spent: 58, ctr: "1.8%", roas: "2.4×", team: ["JL", "PK"], risk: "high" },
  { name: "LinkedIn ABM — Enterprise", status: "live", budget: "$85K", spent: 44, ctr: "4.7%", roas: "6.8×", team: ["SM", "MR"], risk: "low" },
  { name: "AI Tools Webinar Series", status: "live", budget: "$45K", spent: 81, ctr: "—", roas: "—", team: ["AK"], risk: "low", extra: "1,247 regs" },
  { name: "Product Update Awareness", status: "scheduled", budget: "$120K", spent: 0, ctr: "—", roas: "—", team: ["RB", "JL"], risk: "low", extra: "Jun 3" },
  { name: "G2 Review Push", status: "paused", budget: "$32K", spent: 91, ctr: "2.1%", roas: "3.8×", team: ["MR"], risk: "medium" },
];

const aiRecs = [
  { id: 1, icon: AlertTriangle, color: RED, title: "Pause EMEA Meta Ads — underperforming", body: "ROAS 2.4× vs 4× target. Reallocating $82K to LinkedIn ABM saves est. $34K CAC.", action: "Auto-reallocate", tag: "Budget" },
  { id: 2, icon: TrendingUp, color: BLUE, title: "Scale LinkedIn ABM — top performer at 6.8× ROAS", body: "47% win-rate on enterprise deals. Increase budget by 40% ($34K) for max impact.", action: "Increase Budget", tag: "Growth" },
  { id: 3, icon: Brain, color: GREEN, title: "SEO gap: 'AI marketing automation' (8.4K/mo)", body: "Zero coverage. Competitors rank #1–3. Create topic cluster now to capture traffic.", action: "Generate Brief", tag: "SEO" },
  { id: 4, icon: Megaphone, color: AMBER, title: "Repurpose webinar → campaign assets", body: "AI Tools Webinar has 1,247 registrations. Extract 12 clips for LinkedIn + email.", action: "Start Repurpose", tag: "Content" },
  { id: 5, icon: Shield, color: PRIMARY, title: "Q3 risk: August seasonality -23% engagement", body: "Historical data for B2B SaaS. Pre-load campaigns now to avoid pipeline dip.", action: "View Q3 Plan", tag: "Strategy" },
];

const competitorAlerts = [
  { competitor: "HubSpot", alert: "Launched AI Content Hub — 240+ press mentions in 48h", time: "2h ago", severity: "high" },
  { competitor: "Salesforce", alert: "Increased G2 review spend 3× this quarter targeting 'CRM' keywords", time: "6h ago", severity: "medium" },
  { competitor: "Marketo", alert: "New SERP position #2 for 'marketing automation platform' — up from #7", time: "1d ago", severity: "medium" },
  { competitor: "6sense", alert: "Product launch signals detected via LinkedIn AI intent monitoring", time: "2d ago", severity: "low" },
];

const funnel = [
  { stage: "Impressions", value: "14.2M", pct: 100 },
  { stage: "Website Visitors", value: "284K", pct: 68, conv: "2.0%" },
  { stage: "Leads", value: "8,420", pct: 52, conv: "2.97%" },
  { stage: "MQLs", value: "2,106", pct: 38, conv: "25.0%" },
  { stage: "SQLs", value: "631", pct: 26, conv: "30.0%" },
  { stage: "Opportunities", value: "214", pct: 16, conv: "33.9%" },
  { stage: "Revenue Won", value: "$4.2M", pct: 10, conv: "~$20K ACV" },
];

const myTasks = [
  { title: "Review Q2 Enterprise campaign copy", due: "Today, 2:00 PM", priority: "high", campaign: "Q2 Enterprise Launch" },
  { title: "Approve LinkedIn carousel assets (6 slides)", due: "Today, 5:00 PM", priority: "high", campaign: "LinkedIn ABM" },
  { title: "SEO brief for 'AI marketing automation'", due: "Tomorrow", priority: "medium", campaign: "SEO Hub" },
  { title: "Edit webinar follow-up email sequence", due: "Tomorrow", priority: "medium", campaign: "AI Webinar" },
  { title: "Update EMEA campaign messaging", due: "Jun 2", priority: "low", campaign: "EMEA Expansion" },
];

const pendingApprovals = [
  { title: "EMEA LinkedIn Ad Set — 4 variants", type: "Ad Creative", requestor: "Priya K.", time: "1h ago" },
  { title: "Q2 Blog Post: 'AI in B2B Marketing'", type: "Content", requestor: "Alex M.", time: "3h ago" },
  { title: "G2 Review Email Campaign", type: "Email", requestor: "Ryan B.", time: "5h ago" },
];

const publishQueue = [
  { title: "LinkedIn: AI webinar recap thread", platform: "LinkedIn", time: "Today 4:00 PM", status: "scheduled" },
  { title: "Twitter/X: Product feature announcement", platform: "X", time: "Today 6:00 PM", status: "scheduled" },
  { title: "Blog: Top 10 AI marketing tools 2025", platform: "Blog", time: "Jun 3 9:00 AM", status: "draft" },
  { title: "Email: EMEA lead nurture sequence #3", platform: "Email", time: "Jun 4 8:00 AM", status: "approved" },
];

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  live: { label: "Live", color: GREEN, bg: "hsl(142,55%,93%)" },
  "at-risk": { label: "At Risk", color: RED, bg: "#fef2f2" },
  scheduled: { label: "Scheduled", color: BLUE, bg: "#eff6ff" },
  paused: { label: "Paused", color: AMBER, bg: "#fffbeb" },
};

const riskBorder: Record<string, string> = { high: "#dc2626", medium: "#d97706", low: "hsl(142,55%,35%)" };

export default function HomePage() {
  const [view, setView] = useState<"cmo" | "marketer">("cmo");
  const [appliedRecs, setAppliedRecs] = useState<Set<number>>(new Set());

  return (
    <div className="min-h-full" style={{ background: "hsl(36,33%,94%)" }}>
      {/* Page Header */}
      <div className="sticky top-0 z-30 px-8 pt-6 pb-4" style={{ background: "hsl(36,33%,94%)", borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#3a1f0e" }}>
              {view === "cmo" ? "CMO Command Center" : "Marketing Workspace"}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: MUTED }}>
              {view === "cmo" ? "Executive intelligence dashboard — Thursday, May 14, 2026" : "Your tasks, campaigns, and publishing queue"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg p-1 gap-1" style={{ background: "hsl(36,30%,90%)", border: `1px solid ${BORDER}` }}>
              {(["cmo", "marketer"] as const).map(r => (
                <button key={r} onClick={() => setView(r)}
                  className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
                  style={view === r ? { background: "#3a1f0e", color: "#fff" } : { color: MUTED }}>
                  {r === "cmo" ? "CMO View" : "Marketer View"}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: PRIMARY }}>
              <Zap className="w-4 h-4" /> Ask AI
            </button>
            <button className="relative p-2 rounded-lg transition-all hover:bg-white/60" style={{ color: MUTED }}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "cmo" ? (
          <motion.div key="cmo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="p-8 space-y-6">

            {/* KPI Row */}
            <div className="grid grid-cols-6 gap-4">
              {cmoKpis.map((kpi, i) => (
                <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl p-4 flex flex-col gap-2" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>{kpi.label}</span>
                    <kpi.icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
                  </div>
                  <div className="text-2xl font-bold" style={{ color: "#3a1f0e" }}>{kpi.value}</div>
                  <div className="flex items-center gap-1">
                    {kpi.dir === "up" && <ArrowUpRight className="w-3 h-3" style={{ color: GREEN }} />}
                    {kpi.dir === "down-good" && <ArrowDownRight className="w-3 h-3" style={{ color: GREEN }} />}
                    <span className="text-[11px] font-semibold" style={{ color: kpi.dir === "neutral" ? MUTED : GREEN }}>{kpi.delta}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: MUTED }}>{kpi.sub}</span>
                </motion.div>
              ))}
            </div>

            {/* Row 2: Campaigns + AI Recs */}
            <div className="grid grid-cols-5 gap-6">
              {/* Campaign Health */}
              <div className="col-span-3 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4" style={{ color: PRIMARY }} />
                    <span className="text-sm font-semibold" style={{ color: "#3a1f0e" }}>Campaign Health</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "hsl(36,30%,90%)", color: MUTED }}>23 total</span>
                  </div>
                  <a href="/campaigns" className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: PRIMARY }}>
                    View all <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {campaigns.map((c, i) => {
                    const s = statusStyle[c.status];
                    return (
                      <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/40 transition-colors cursor-pointer"
                        style={{ borderLeft: `3px solid ${riskBorder[c.risk]}` }}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate" style={{ color: "#3a1f0e" }}>{c.name}</span>
                            {c.extra && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "hsl(142,55%,93%)", color: GREEN }}>{c.extra}</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px]" style={{ color: MUTED }}>{c.budget}</span>
                            {c.spent > 0 && (
                              <div className="flex items-center gap-1.5">
                                <div className="w-20 h-1.5 rounded-full" style={{ background: "hsl(30,15%,87%)" }}>
                                  <div className="h-1.5 rounded-full" style={{ width: `${c.spent}%`, background: c.spent > 85 ? RED : c.spent > 60 ? AMBER : GREEN }} />
                                </div>
                                <span className="text-[10px]" style={{ color: MUTED }}>{c.spent}%</span>
                              </div>
                            )}
                            {c.roas !== "—" && <span className="text-[11px] font-semibold" style={{ color: GREEN }}>ROAS {c.roas}</span>}
                            {c.ctr !== "—" && <span className="text-[11px]" style={{ color: MUTED }}>CTR {c.ctr}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-1.5">
                            {c.team.map(t => (
                              <div key={t} className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                                style={{ background: PRIMARY, border: "2px solid white" }}>{t}</div>
                            ))}
                          </div>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: s.color, background: s.bg }}>{s.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="col-span-2 rounded-xl flex flex-col" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <Sparkles className="w-4 h-4" style={{ color: PRIMARY }} />
                  <span className="text-sm font-semibold" style={{ color: "#3a1f0e" }}>AI Recommendations</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "#fef2f2", color: RED }}>2 critical</span>
                </div>
                <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: BORDER }}>
                  {aiRecs.map(rec => (
                    <div key={rec.id} className="p-4 hover:bg-white/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <rec.icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: rec.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: `${rec.color}18`, color: rec.color }}>{rec.tag}</span>
                          </div>
                          <p className="text-xs font-semibold leading-snug mb-1" style={{ color: "#3a1f0e" }}>{rec.title}</p>
                          <p className="text-[11px] leading-relaxed mb-2" style={{ color: MUTED }}>{rec.body}</p>
                          <button onClick={() => setAppliedRecs(s => { const n = new Set(s); n.add(rec.id); return n; })}
                            className="text-[11px] font-semibold px-3 py-1 rounded-md transition-all"
                            style={appliedRecs.has(rec.id) ? { background: "hsl(142,55%,93%)", color: GREEN } : { background: PRIMARY, color: "#fff" }}>
                            {appliedRecs.has(rec.id) ? "✓ Applied" : rec.action}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Funnel + Competitor Alerts + Agents & Budget */}
            <div className="grid grid-cols-3 gap-6">
              {/* Marketing Funnel */}
              <div className="rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <BarChart3 className="w-4 h-4" style={{ color: PRIMARY }} />
                  <span className="text-sm font-semibold" style={{ color: "#3a1f0e" }}>Marketing Funnel</span>
                  <span className="ml-auto text-[10px]" style={{ color: MUTED }}>Last 30 days</span>
                </div>
                <div className="p-5 space-y-3">
                  {funnel.map((f, i) => (
                    <div key={f.stage}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium" style={{ color: "#3a1f0e" }}>{f.stage}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold" style={{ color: "#3a1f0e" }}>{f.value}</span>
                          {f.conv && <span className="text-[10px]" style={{ color: GREEN }}>↓ {f.conv}</span>}
                        </div>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: "hsl(30,15%,87%)" }}>
                        <div className="h-2 rounded-full" style={{ width: `${f.pct}%`, background: `hsl(${25 + i * 12},${62 - i * 3}%,${25 + i * 6}%)` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Alerts */}
              <div className="rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: AMBER }} />
                  <span className="text-sm font-semibold" style={{ color: "#3a1f0e" }}>Competitor Alerts</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "#fffbeb", color: AMBER }}>4 new</span>
                </div>
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {competitorAlerts.map((alert, i) => (
                    <div key={i} className="px-5 py-3.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: PRIMARY }}>{alert.competitor}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                          style={{ background: alert.severity === "high" ? "#fef2f2" : alert.severity === "medium" ? "#fffbeb" : "hsl(36,30%,90%)", color: alert.severity === "high" ? RED : alert.severity === "medium" ? AMBER : MUTED }}>
                          {alert.severity}
                        </span>
                        <span className="ml-auto text-[10px]" style={{ color: MUTED }}>{alert.time}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: "#3a1f0e" }}>{alert.alert}</p>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <a href="/intelligence" className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: PRIMARY }}>
                    Open Intel Center <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Agents + Budget */}
              <div className="space-y-4">
                <div className="rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <Brain className="w-4 h-4" style={{ color: PRIMARY }} />
                    <span className="text-sm font-semibold" style={{ color: "#3a1f0e" }}>Active Agents</span>
                    <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold" style={{ color: GREEN }}>
                      <Circle className="w-2 h-2 fill-current animate-pulse" /> 6 running
                    </span>
                  </div>
                  <div className="px-5 py-3 space-y-3">
                    {[
                      { name: "CMO Strategy Agent", task: "Analyzing Q3 opportunities…", prog: 68 },
                      { name: "SEO Research Agent", task: "Auditing 847 keywords…", prog: 43 },
                      { name: "Competitor Monitor", task: "Tracking HubSpot AI Hub…", prog: 91 },
                      { name: "Budget Optimizer", task: "Rebalancing EMEA spend…", prog: 27 },
                    ].map(agent => (
                      <div key={agent.name}>
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[11px] font-semibold" style={{ color: "#3a1f0e" }}>{agent.name}</span>
                          <span className="text-[10px]" style={{ color: MUTED }}>{agent.prog}%</span>
                        </div>
                        <p className="text-[10px] mb-1" style={{ color: MUTED }}>{agent.task}</p>
                        <div className="h-1 rounded-full" style={{ background: "hsl(30,15%,87%)" }}>
                          <div className="h-1 rounded-full" style={{ width: `${agent.prog}%`, background: PRIMARY }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <DollarSign className="w-4 h-4" style={{ color: PRIMARY }} />
                    <span className="text-sm font-semibold" style={{ color: "#3a1f0e" }}>Q2 Budget Burn</span>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    {[
                      { ch: "Paid Social", pct: 78, spend: "$840K" },
                      { ch: "Google Ads", pct: 62, spend: "$480K" },
                      { ch: "Content", pct: 54, spend: "$210K" },
                      { ch: "Events", pct: 45, spend: "$310K" },
                      { ch: "SEO / Tools", pct: 38, spend: "$160K" },
                    ].map(ch => (
                      <div key={ch.ch}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px]" style={{ color: "#3a1f0e" }}>{ch.ch}</span>
                          <span className="text-[11px] font-semibold" style={{ color: MUTED }}>{ch.spend} · {ch.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "hsl(30,15%,87%)" }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${ch.pct}%`, background: ch.pct > 75 ? AMBER : PRIMARY }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* MARKETER VIEW */
          <motion.div key="marketer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="p-8 space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "My Tasks Today", value: "12", sub: "3 overdue", icon: CheckCircle2, color: RED },
                { label: "Pending Approvals", value: "5", sub: "2 urgent", icon: Clock, color: AMBER },
                { label: "In Publishing Queue", value: "8", sub: "4 scheduled today", icon: Globe, color: BLUE },
                { label: "Campaigns Active", value: "4", sub: "assigned to me", icon: Rocket, color: GREEN },
              ].map((kpi, i) => (
                <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="rounded-xl p-5 flex items-start gap-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="p-2.5 rounded-lg" style={{ background: `${kpi.color}18` }}>
                    <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: "#3a1f0e" }}>{kpi.value}</div>
                    <div className="text-xs font-medium" style={{ color: "#3a1f0e" }}>{kpi.label}</div>
                    <div className="text-[11px]" style={{ color: MUTED }}>{kpi.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6">
              {/* My Tasks */}
              <div className="rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: PRIMARY }} />
                  <span className="text-sm font-semibold" style={{ color: "#3a1f0e" }}>My Tasks</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#fef2f2", color: RED }}>3 overdue</span>
                </div>
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {myTasks.map((task, i) => (
                    <div key={i} className="px-5 py-3.5 hover:bg-white/50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 w-4 h-4 rounded border-2 shrink-0" style={{ borderColor: BORDER }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium leading-snug" style={{ color: "#3a1f0e" }}>{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px]" style={{ color: task.priority === "high" ? RED : MUTED }}>{task.due}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "hsl(36,30%,90%)", color: MUTED }}>{task.campaign}</span>
                          </div>
                        </div>
                        <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: task.priority === "high" ? RED : task.priority === "medium" ? AMBER : GREEN }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Pending Approvals */}
              <div className="rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <Shield className="w-4 h-4" style={{ color: PRIMARY }} />
                  <span className="text-sm font-semibold" style={{ color: "#3a1f0e" }}>Pending Approvals</span>
                </div>
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {pendingApprovals.map((item, i) => (
                    <div key={i} className="px-5 py-4">
                      <p className="text-xs font-medium" style={{ color: "#3a1f0e" }}>{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "hsl(36,30%,90%)", color: MUTED }}>{item.type}</span>
                        <span className="text-[10px]" style={{ color: MUTED }}>by {item.requestor} · {item.time}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold text-white" style={{ background: GREEN }}>Approve</button>
                        <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold" style={{ background: "hsl(36,30%,90%)", color: MUTED }}>Review</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Publishing Queue */}
              <div className="rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <Globe className="w-4 h-4" style={{ color: PRIMARY }} />
                  <span className="text-sm font-semibold" style={{ color: "#3a1f0e" }}>Publishing Queue</span>
                </div>
                <div className="divide-y" style={{ borderColor: BORDER }}>
                  {publishQueue.map((item, i) => (
                    <div key={i} className="px-5 py-3.5 hover:bg-white/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: "#3a1f0e" }}>{item.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-semibold" style={{ color: PRIMARY }}>{item.platform}</span>
                            <span className="text-[10px]" style={{ color: MUTED }}>{item.time}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: item.status === "scheduled" ? "#eff6ff" : item.status === "approved" ? "hsl(142,55%,93%)" : "hsl(36,30%,90%)",
                            color: item.status === "scheduled" ? BLUE : item.status === "approved" ? GREEN : MUTED,
                          }}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <button className="w-full py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-all" style={{ background: PRIMARY }}>
                    + Schedule New Post
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
