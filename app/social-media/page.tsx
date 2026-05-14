// /Users/navaneethakrishnan/Desktop/skott/app/social-media/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  Star,
  Users,
  CheckCircle,
  Edit3,
  Zap,
  Clock,
  Eye,
  Shield,
  AlertTriangle,
  Sparkles,
  Send,
  Hash,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";
import { socialPosts } from "@/data/mock";
import { cn } from "@/lib/utils";

// ─── Platform config ──────────────────────────────────────────────────────────
const platformConfig: Record<string, { color: string; bg: string; label: string }> = {
  LinkedIn: { color: "text-blue-700", bg: "bg-blue-100", label: "LinkedIn" },
  Twitter:  { color: "text-neutral-800", bg: "bg-neutral-100", label: "X / Twitter" },
  Instagram: { color: "text-purple-700", bg: "bg-purple-100", label: "Instagram" },
  Reddit:   { color: "text-orange-700", bg: "bg-orange-100", label: "Reddit" },
};

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  published:        { color: "text-green-700",  bg: "bg-green-100",  label: "Published" },
  scheduled:        { color: "text-blue-700",   bg: "bg-blue-100",   label: "Scheduled" },
  "pending-approval": { color: "text-amber-700", bg: "bg-amber-100", label: "Pending Approval" },
  draft:            { color: "text-neutral-600", bg: "bg-neutral-100", label: "Draft" },
};

// ─── Trend Radar mock data ───────────────────────────────────────────────────
const trendRadar = [
  {
    id: "t1",
    platform: "LinkedIn",
    topic: "Agentic AI in Enterprise Ops",
    hook: "47% of enterprise ops teams plan to deploy AI agents by Q3 2025. Are you ready?",
    urgency: "high",
    window: "6h",
    reach: "28–45K",
  },
  {
    id: "t2",
    platform: "Twitter",
    topic: "OpenAI GPT-5 Announcements",
    hook: "Everyone's talking GPT-5. Here's why agentic infrastructure matters more than the model.",
    urgency: "medium",
    window: "12h",
    reach: "12–18K",
  },
  {
    id: "t3",
    platform: "Reddit",
    topic: "AI Startup AMA threads surging",
    hook: "Founders sharing real AI deployment stories on r/startups. Time to tell ours.",
    urgency: "low",
    window: "24h",
    reach: "4–8K",
  },
];

// ─── Thunderclap mock ────────────────────────────────────────────────────────
const thunderclap = {
  title: "Lyzr Architect Launch — Coordinated Burst",
  scheduled: "May 15, 2025 · 9:00 AM IST",
  platforms: ["LinkedIn", "Twitter", "Instagram"],
  team: [
    { name: "Siva", handle: "@siva_lyzr", status: "confirmed" },
    { name: "Kress", handle: "@kress_ai", status: "confirmed" },
    { name: "Joel", handle: "@joel_lyzr", status: "pending" },
    { name: "Mark", handle: "@markm_lyzr", status: "pending" },
    { name: "Priya", handle: "@priya_brand", status: "declined" },
  ],
};

// ─── Approval queue (subset of socialPosts) ───────────────────────────────────
const approvalQueue = socialPosts.filter(p => p.status === "pending-approval");

// ─── Tab navigation ───────────────────────────────────────────────────────────
const TABS = ["Content Calendar", "Trend Radar", "Approval Queue", "Thunderclap"] as const;
type Tab = (typeof TABS)[number];

export default function SocialMediaPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Content Calendar");
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  const handleApprove = (id: string) => setApprovedIds(prev => new Set([...prev, id]));

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-2xl font-[600] text-[hsl(25,40%,18%)]">Social Media Manager</h1>
            <AgentStatusBadge status="active" />
          </div>
          <p className="text-sm text-[hsl(25,20%,45%)]">
            Social Media Agent · Content calendar, trend radar, brand voice & coordinated publishing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[hsl(30,15%,85%)] text-[hsl(25,20%,45%)] hover:bg-[hsl(36,30%,96%)] transition-colors">
            <Send size={12} /> Schedule Post
          </button>
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] font-[500] hover:opacity-90 transition-opacity">
            <Sparkles size={12} /> Generate with AI
          </button>
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Posts Scheduled" value={12} sub="Next 7 days" trend={8} />
        <MetricCard label="Engagement Rate" value="3.8%" sub="Avg across platforms" trend={4.2} />
        <MetricCard label="Brand Voice Score" value="94/100" sub="Last 30 posts" trend={2} />
        <MetricCard label="Social MQLs" value={47} sub="This month · target: 150" trend={8} />
      </div>

      {/* ── Tab navigation ── */}
      <div className="flex items-center gap-1 border-b border-[hsl(30,15%,85%)] pb-0">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-[500] border-b-2 transition-colors -mb-px",
              activeTab === tab
                ? "border-[hsl(25,62%,25%)] text-[hsl(25,40%,18%)]"
                : "border-transparent text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)]"
            )}
          >
            {tab}
            {tab === "Approval Queue" && approvalQueue.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-[600]">
                {approvalQueue.length - approvedIds.size}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* ────────────────────────── CONTENT CALENDAR ────────────────────────── */}
        {activeTab === "Content Calendar" && (
          <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] overflow-hidden">
            <div className="px-5 py-4 border-b border-[hsl(30,15%,85%)] flex items-center gap-2">
              <Calendar size={14} className="text-[hsl(25,62%,25%)]" />
              <span className="text-sm font-[500] text-[hsl(25,40%,18%)]">Content Calendar</span>
              <span className="ml-auto text-[11px] text-[hsl(25,20%,45%)]">{socialPosts.length} posts</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[hsl(30,15%,85%)]">
                    {["Platform", "Content Preview", "Status", "Scheduled", "Est. Reach", "Brand Score", "Actions"].map(h => (
                      <th key={h} className="text-left text-[11px] font-[500] uppercase tracking-widest text-[hsl(25,20%,45%)] px-5 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {socialPosts.map((post, i) => {
                    const plat = platformConfig[post.platform] ?? platformConfig.LinkedIn;
                    const stat = statusConfig[post.status] ?? statusConfig.draft;
                    return (
                      <motion.tr
                        key={post.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-[hsl(30,15%,88%)] hover:bg-[hsl(30,15%,93%)] transition-colors"
                      >
                        {/* Platform */}
                        <td className="px-5 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-[600]", plat.bg, plat.color)}>
                            <span className="w-2 h-2 rounded-full" style={{ background: "currentColor", opacity: 0.7 }} />
                            {plat.label}
                          </span>
                        </td>
                        {/* Content preview */}
                        <td className="px-5 py-4 max-w-[280px]">
                          <p className="text-xs text-[hsl(25,40%,18%)] line-clamp-2 leading-relaxed">{post.content}</p>
                          <p className="text-[10px] text-[hsl(25,20%,55%)] mt-1">by {post.author}</p>
                        </td>
                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-[600]", stat.bg, stat.color)}>
                            {stat.label}
                          </span>
                        </td>
                        {/* Scheduled */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 text-xs text-[hsl(25,20%,45%)]">
                            <Clock size={11} />
                            {post.scheduledAt ?? <span className="italic text-[hsl(25,20%,60%)]">Unscheduled</span>}
                          </div>
                        </td>
                        {/* Est. Reach */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 text-xs text-[hsl(25,40%,18%)] font-[500]">
                            <Eye size={11} className="text-[hsl(25,20%,45%)]" />
                            {post.reach >= 1000 ? `${(post.reach / 1000).toFixed(1)}K` : post.reach}
                          </div>
                        </td>
                        {/* Brand Score */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 w-16 bg-[hsl(30,15%,88%)] rounded-full overflow-hidden">
                              <div
                                className={cn("h-full rounded-full", post.brandScore >= 90 ? "bg-green-500" : post.brandScore >= 75 ? "bg-amber-500" : "bg-red-500")}
                                style={{ width: `${post.brandScore}%` }}
                              />
                            </div>
                            <span className={cn("text-xs font-[600]", post.brandScore >= 90 ? "text-green-700" : post.brandScore >= 75 ? "text-amber-700" : "text-red-700")}>
                              {post.brandScore}
                            </span>
                          </div>
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {post.status === "pending-approval" || post.status === "draft" ? (
                              <>
                                <button
                                  onClick={() => handleApprove(post.id)}
                                  disabled={approvedIds.has(post.id)}
                                  className={cn(
                                    "flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg font-[500] transition-colors",
                                    approvedIds.has(post.id)
                                      ? "bg-green-100 text-green-700"
                                      : "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] hover:opacity-90"
                                  )}
                                >
                                  <CheckCircle size={11} />
                                  {approvedIds.has(post.id) ? "Approved" : "Approve"}
                                </button>
                                <button className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border border-[hsl(30,15%,85%)] text-[hsl(25,20%,45%)] hover:bg-[hsl(30,15%,90%)] transition-colors font-[500]">
                                  <Edit3 size={11} /> Edit
                                </button>
                              </>
                            ) : (
                              <span className="text-[11px] text-[hsl(25,20%,55%)] italic">
                                {post.status === "published" ? "Live" : "Queued"}
                              </span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ────────────────────────── TREND RADAR ─────────────────────────────── */}
        {activeTab === "Trend Radar" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-[hsl(25,62%,25%)]" />
              <span className="text-sm font-[500] text-[hsl(25,40%,18%)]">AI-Detected Trends</span>
              <span className="ml-auto text-xs text-[hsl(25,20%,45%)]">Updated 6 min ago</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {trendRadar.map((trend, i) => {
                const urgencyColors: Record<string, string> = {
                  high: "bg-red-100 text-red-700",
                  medium: "bg-amber-100 text-amber-700",
                  low: "bg-blue-100 text-blue-700",
                };
                const plat = platformConfig[trend.platform] ?? platformConfig.LinkedIn;
                return (
                  <motion.div
                    key={trend.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] p-5 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-[600]", plat.bg, plat.color)}>
                        {plat.label}
                      </span>
                      <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-[600] uppercase tracking-wide", urgencyColors[trend.urgency])}>
                        {trend.urgency} urgency
                      </span>
                    </div>

                    <div>
                      <p className="font-serif text-base font-[500] text-[hsl(25,40%,18%)] mb-1">{trend.topic}</p>
                      <p className="text-xs text-[hsl(25,20%,45%)] italic leading-relaxed">"{trend.hook}"</p>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-[hsl(25,20%,45%)]">
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>Window: {trend.window}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={11} />
                        <span>Est. {trend.reach}</span>
                      </div>
                    </div>

                    <button className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] font-[500] hover:opacity-90 transition-opacity">
                      <Sparkles size={12} /> Generate Post
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Trend graph placeholder */}
            <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Hash size={13} className="text-[hsl(25,62%,25%)]" />
                <span className="text-sm font-[500] text-[hsl(25,40%,18%)]">Topic Velocity (last 24h)</span>
              </div>
              <div className="flex items-end gap-3 h-20">
                {["Agentic AI", "GPT-5", "AI Agents", "LLM Ops", "Enterprise AI", "AI Safety", "Automation"].map((t, i) => {
                  const heights = [80, 55, 90, 40, 70, 30, 60];
                  return (
                    <div key={t} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className="w-full rounded-t-sm bg-[hsl(25,62%,25%)]/20 hover:bg-[hsl(25,62%,25%)]/40 transition-colors cursor-pointer"
                        style={{ height: `${heights[i]}%` }}
                      />
                      <span className="text-[9px] text-[hsl(25,20%,45%)] text-center leading-tight">{t}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────── APPROVAL QUEUE ──────────────────────────── */}
        {activeTab === "Approval Queue" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-[hsl(25,62%,25%)]" />
              <span className="text-sm font-[500] text-[hsl(25,40%,18%)]">Posts Pending Approval</span>
              <span className="ml-auto text-xs text-[hsl(25,20%,45%)]">{approvalQueue.length} posts awaiting review</span>
            </div>

            {approvalQueue.length === 0 ? (
              <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] p-10 text-center">
                <CheckCircle size={28} className="mx-auto text-green-500 mb-2" />
                <p className="text-sm text-[hsl(25,20%,45%)]">All clear — no posts pending approval</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvalQueue.map((post, i) => {
                  const plat = platformConfig[post.platform] ?? platformConfig.LinkedIn;
                  const isApproved = approvedIds.has(post.id);
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={cn(
                        "rounded-[0.75rem] border bg-[hsl(36,30%,96%)] p-5",
                        isApproved
                          ? "border-green-300 border-l-4 border-l-green-500"
                          : "border-amber-300 border-l-4 border-l-amber-500"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-[600]", plat.bg, plat.color)}>
                              {plat.label}
                            </span>
                            <span className="text-[11px] text-[hsl(25,20%,45%)]">by {post.author}</span>
                            {isApproved && (
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-[600] bg-green-100 text-green-700">Approved</span>
                            )}
                          </div>

                          <p className="text-sm text-[hsl(25,40%,18%)] leading-relaxed">{post.content}</p>

                          <div className="flex items-center gap-4 text-[11px] text-[hsl(25,20%,45%)]">
                            <div className="flex items-center gap-1">
                              <Eye size={11} /> Est. {(post.reach / 1000).toFixed(1)}K reach
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp size={11} /> {post.engagement}% eng. rate
                            </div>
                            <div className="flex items-center gap-1">
                              <Star size={11} />
                              <span className={cn(
                                "font-[600]",
                                post.brandScore >= 90 ? "text-green-700" : post.brandScore >= 75 ? "text-amber-700" : "text-red-700"
                              )}>
                                Brand Score: {post.brandScore}/100
                              </span>
                            </div>
                          </div>

                          {post.brandScore < 80 && (
                            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                              <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                              <p className="text-xs text-amber-700">Brand voice score is below threshold (80). Review tone before approving.</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => handleApprove(post.id)}
                            disabled={isApproved}
                            className={cn(
                              "flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-[500] transition-colors",
                              isApproved
                                ? "bg-green-100 text-green-700 cursor-default"
                                : "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] hover:opacity-90"
                            )}
                          >
                            <CheckCircle size={12} />
                            {isApproved ? "Approved" : "Approve"}
                          </button>
                          <button className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg border border-[hsl(30,15%,85%)] text-[hsl(25,20%,45%)] hover:bg-[hsl(30,15%,90%)] transition-colors font-[500]">
                            <Edit3 size={12} /> Edit
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ────────────────────────── THUNDERCLAP ─────────────────────────────── */}
        {activeTab === "Thunderclap" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-[hsl(25,62%,25%)]" />
              <span className="text-sm font-[500] text-[hsl(25,40%,18%)]">Thunderclap Hub</span>
              <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-[600]">1 Active</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[0.75rem] border border-[hsl(25,62%,25%)]/30 bg-[hsl(36,30%,96%)] overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 py-4 bg-[hsl(25,62%,25%)] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[hsl(36,33%,94%)]" />
                    <span className="font-serif text-base font-[500] text-[hsl(36,33%,94%)]">{thunderclap.title}</span>
                  </div>
                  <p className="text-xs text-[hsl(36,33%,80%)] mt-1">{thunderclap.scheduled}</p>
                </div>
                <div className="flex gap-1">
                  {thunderclap.platforms.map(p => {
                    const plat = platformConfig[p] ?? platformConfig.LinkedIn;
                    return (
                      <span key={p} className={cn("px-2 py-0.5 rounded-full text-[11px] font-[600]", plat.bg, plat.color)}>
                        {p}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-[500] uppercase tracking-widest text-[hsl(25,20%,45%)] mb-3">Team Participation</p>
                  <div className="space-y-2">
                    {thunderclap.team.map(member => {
                      const statusConf = {
                        confirmed: { color: "text-green-700", bg: "bg-green-100", label: "Confirmed" },
                        pending:   { color: "text-amber-700", bg: "bg-amber-100", label: "Pending" },
                        declined:  { color: "text-red-700",   bg: "bg-red-100",   label: "Declined" },
                      }[member.status];
                      return (
                        <div key={member.name} className="flex items-center justify-between px-4 py-3 rounded-lg border border-[hsl(30,15%,85%)] bg-white/40">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[hsl(25,62%,25%)]/10 flex items-center justify-center">
                              <Users size={14} className="text-[hsl(25,62%,25%)]" />
                            </div>
                            <div>
                              <p className="text-sm font-[500] text-[hsl(25,40%,18%)]">{member.name}</p>
                              <p className="text-[11px] text-[hsl(25,20%,45%)]">{member.handle}</p>
                            </div>
                          </div>
                          <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-[600]", statusConf?.bg, statusConf?.color)}>
                            {statusConf?.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                      <p className="font-serif text-lg font-[600] text-green-700">{thunderclap.team.filter(m => m.status === "confirmed").length}</p>
                      <p className="text-[10px] text-green-700 font-[500]">Confirmed</p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="font-serif text-lg font-[600] text-amber-700">{thunderclap.team.filter(m => m.status === "pending").length}</p>
                      <p className="text-[10px] text-amber-700 font-[500]">Pending</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="font-serif text-lg font-[600] text-red-700">{thunderclap.team.filter(m => m.status === "declined").length}</p>
                      <p className="text-[10px] text-red-700 font-[500]">Declined</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="text-xs px-4 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] font-[500] hover:opacity-90 transition-opacity whitespace-nowrap">
                      Send Reminder
                    </button>
                    <button className="text-xs px-4 py-2 rounded-lg border border-[hsl(30,15%,85%)] text-[hsl(25,20%,45%)] hover:bg-[hsl(30,15%,90%)] transition-colors whitespace-nowrap">
                      Edit Campaign
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Empty state for new thunderclap */}
            <div className="rounded-[0.75rem] border border-dashed border-[hsl(30,15%,80%)] bg-[hsl(36,30%,96%)]/50 p-8 text-center">
              <Zap size={24} className="mx-auto text-[hsl(25,20%,55%)] mb-3" />
              <p className="text-sm font-[500] text-[hsl(25,40%,18%)] mb-1">Launch a New Thunderclap</p>
              <p className="text-xs text-[hsl(25,20%,45%)] mb-4">Coordinate a simultaneous post burst across your team for maximum organic reach.</p>
              <button className="text-xs px-4 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] font-[500] hover:opacity-90 transition-opacity">
                + New Thunderclap Campaign
              </button>
            </div>
          </div>
        )}
      </motion.div>
      <AIRecommendations page="social-media" />
    </div>
  );
}
