"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  Radio,
  Globe,
  Users,
  Send,
  Edit3,
  CheckCircle,
  Clock,
  Plus,
  X,
  ExternalLink,
  Mail,
  Star,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { cn } from "@/lib/utils";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

// ─── Types ────────────────────────────────────────────────────────────────────
type PRStatus = "Draft" | "Review" | "Distributed" | "Live";

interface PressRelease {
  id: string;
  title: string;
  type: string;
  status: PRStatus;
  pickups: number;
  reach: string;
  date: string;
}

interface Journalist {
  id: string;
  name: string;
  publication: string;
  beat: string;
  relationshipScore: number;
  lastContacted: string;
  status: "Warm" | "Cold" | "Active" | "Dormant";
}

interface Coverage {
  id: string;
  source: string;
  headline: string;
  da: number;
  date: string;
}

interface OutreachItem {
  id: string;
  journalist: string;
  publication: string;
  subject: string;
  scheduledFor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PRESS_RELEASES: PressRelease[] = [
  { id: "pr1", title: "Lyzr Raises $14M Series A to Scale Agentic AI",             type: "Funding",        status: "Live",        pickups: 47, reach: "4.2M", date: "Apr 28" },
  { id: "pr2", title: "Lyzr Partners With Deloitte for Enterprise AI Rollout",      type: "Partnership",    status: "Distributed", pickups: 18, reach: "2.1M", date: "May 2" },
  { id: "pr3", title: "Introducing Lyzr Architect v2: Multi-Agent Orchestration",   type: "Product Launch", status: "Review",      pickups: 0,  reach: "—",    date: "May 12" },
  { id: "pr4", title: "Lyzr AI Report: State of Enterprise Agents 2025",            type: "Research",       status: "Draft",       pickups: 0,  reach: "—",    date: "May 15" },
  { id: "pr5", title: "Lyzr Achieves SOC 2 Type II Certification",                  type: "Compliance",     status: "Distributed", pickups: 11, reach: "890K", date: "May 5" },
  { id: "pr6", title: "Lyzr Named in Gartner Cool Vendors in AI Engineering",       type: "Recognition",    status: "Live",        pickups: 62, reach: "5.8M", date: "Apr 15" },
];

const JOURNALISTS: Journalist[] = [
  { id: "j1", name: "Aria Chen",      publication: "TechCrunch",         beat: "AI & Enterprise",    relationshipScore: 9, lastContacted: "3d ago",  status: "Active" },
  { id: "j2", name: "Marcus Reid",    publication: "The Information",    beat: "VC & Funding",       relationshipScore: 7, lastContacted: "1w ago",  status: "Warm" },
  { id: "j3", name: "Priya Nair",     publication: "Forbes Tech",        beat: "Startup Innovation", relationshipScore: 8, lastContacted: "2w ago",  status: "Warm" },
  { id: "j4", name: "Sam Kowalski",   publication: "VentureBeat",        beat: "AI/ML Products",     relationshipScore: 6, lastContacted: "3w ago",  status: "Cold" },
  { id: "j5", name: "Leila Torres",   publication: "Bloomberg Tech",     beat: "Enterprise SaaS",    relationshipScore: 5, lastContacted: "1mo ago", status: "Dormant" },
  { id: "j6", name: "Devon Park",     publication: "Wired",              beat: "Future of Work",     relationshipScore: 7, lastContacted: "5d ago",  status: "Warm" },
  { id: "j7", name: "Zoe Whitmore",   publication: "Fast Company",       beat: "AI Productivity",    relationshipScore: 9, lastContacted: "1d ago",  status: "Active" },
  { id: "j8", name: "Rajan Mehta",    publication: "MIT Tech Review",    beat: "Emerging Tech",      relationshipScore: 6, lastContacted: "2w ago",  status: "Cold" },
];

const COVERAGE: Coverage[] = [
  { id: "c1", source: "TechCrunch",      headline: "Lyzr's Series A bet on agentic infrastructure signals a new era for enterprise AI", da: 93, date: "Apr 28" },
  { id: "c2", source: "Forbes",          headline: "Why Deloitte chose Lyzr to power its 2025 AI agent deployment strategy",           da: 91, date: "May 3" },
  { id: "c3", source: "VentureBeat",     headline: "Lyzr Architect v2 promises low-code multi-agent orchestration at enterprise scale", da: 84, date: "May 6" },
  { id: "c4", source: "The Information", headline: "Inside the race to build the next enterprise AI agent platform",                    da: 88, date: "Apr 30" },
];

const OUTREACH: OutreachItem[] = [
  { id: "o1", journalist: "Aria Chen",   publication: "TechCrunch",   subject: "Exclusive: Lyzr Architect v2 preview + founder interview", scheduledFor: "May 14, 9:00 AM" },
  { id: "o2", journalist: "Zoe Whitmore", publication: "Fast Company", subject: "Research embargo lift — State of Enterprise Agents 2025",  scheduledFor: "May 15, 8:00 AM" },
  { id: "o3", journalist: "Devon Park",  publication: "Wired",        subject: "Follow-up: AI agent security posture story angle",          scheduledFor: "May 15, 11:00 AM" },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const prStatusConfig: Record<PRStatus, { color: string; bg: string }> = {
  Draft:       { color: "text-neutral-600", bg: "bg-neutral-100" },
  Review:      { color: "text-amber-700",   bg: "bg-amber-100" },
  Distributed: { color: "text-blue-700",    bg: "bg-blue-100" },
  Live:        { color: "text-green-700",   bg: "bg-green-100" },
};

const journalistStatusConfig = {
  Active:  { color: "text-green-700",  bg: "bg-green-100" },
  Warm:    { color: "text-amber-700",  bg: "bg-amber-100" },
  Cold:    { color: "text-blue-700",   bg: "bg-blue-100" },
  Dormant: { color: "text-neutral-600", bg: "bg-neutral-100" },
};

const FILTERS: Array<{ label: string; value: PRStatus | "All" }> = [
  { label: "All",         value: "All" },
  { label: "Draft",       value: "Draft" },
  { label: "In Review",   value: "Review" },
  { label: "Distributed", value: "Distributed" },
];

const KPIS = [
  { label: "Press Releases",          value: "18",   sub: "+3 this quarter",   icon: <Newspaper size={20} /> },
  { label: "Media Mentions",          value: "234",  sub: "across 40+ outlets", icon: <Radio size={20} /> },
  { label: "Coverage Reach",          value: "12.4M", sub: "estimated readers", icon: <Globe size={20} /> },
  { label: "Journalist Response Rate", value: "28%",  sub: "+6% vs benchmark",  icon: <Users size={20} /> },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={cn("w-2 h-2 rounded-full", i < score ? "bg-[hsl(25,62%,25%)]" : "bg-[hsl(30,15%,87%)]")}
        />
      ))}
      <span className="ml-1 text-[11px] text-[hsl(25,20%,50%)]">{score}/10</span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PRAgentPage() {
  const [filter, setFilter] = useState<PRStatus | "All">("All");
  const [approvedPRs, setApprovedPRs] = useState<string[]>([]);
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [approvedOutreach, setApprovedOutreach] = useState<string[]>([]);

  const filtered = filter === "All" ? PRESS_RELEASES : PRESS_RELEASES.filter((p) => p.status === filter);

  return (
    <div className="min-h-screen bg-[hsl(36,33%,94%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[hsl(25,62%,25%)] flex items-center justify-center">
            <Newspaper size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-[hsl(25,40%,18%)]">PR Agent</h1>
              <AgentStatusBadge status="active" />
            </div>
            <p className="text-xs text-[hsl(25,20%,50%)]">Press release creation & media outreach</p>
          </div>
        </div>
        <button
          onClick={() => setShowDraftForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> Draft Press Release
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ scale: 1.02 }}
            className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[hsl(25,20%,50%)] text-xs">{kpi.label}</span>
              <span className="text-[hsl(25,62%,25%)]">{kpi.icon}</span>
            </div>
            <p className="text-2xl font-bold text-[hsl(25,40%,18%)]">{kpi.value}</p>
            <p className="text-xs text-[hsl(25,20%,50%)] mt-0.5">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Press Release Pipeline */}
      <div className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)] flex items-center gap-2">
            <TrendingUp size={15} /> Press Release Pipeline
          </h2>
          <div className="flex items-center gap-1 bg-[hsl(36,33%,94%)] rounded-lg p-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-all",
                  filter === f.value ? "bg-[hsl(25,62%,25%)] text-white" : "text-[hsl(25,20%,50%)] hover:text-[hsl(25,40%,18%)]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(30,15%,87%)]">
              {["Title", "Type", "Status", "Pickups", "Reach", "Date", "Action"].map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold text-[hsl(25,20%,50%)] uppercase tracking-wide pb-2 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filtered.map((pr) => {
                const sc = prStatusConfig[pr.status];
                const isReview = pr.status === "Review";
                const isApproved = approvedPRs.includes(pr.id);
                return (
                  <motion.tr
                    key={pr.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="border-b border-[hsl(30,15%,87%)]/50 hover:bg-[hsl(36,33%,94%)]/60 transition-colors"
                  >
                    <td className="py-3 pr-4 font-medium text-[hsl(25,40%,18%)] max-w-xs">
                      <span className="line-clamp-1">{pr.title}</span>
                    </td>
                    <td className="py-3 pr-4 text-[hsl(25,20%,50%)] text-xs">{pr.type}</td>
                    <td className="py-3 pr-4">
                      <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium", sc.bg, sc.color)}>{pr.status}</span>
                    </td>
                    <td className="py-3 pr-4 text-[hsl(25,40%,18%)]">{pr.pickups > 0 ? pr.pickups : "—"}</td>
                    <td className="py-3 pr-4 text-[hsl(25,40%,18%)]">{pr.reach}</td>
                    <td className="py-3 pr-4 text-[hsl(25,20%,50%)] text-xs">{pr.date}</td>
                    <td className="py-3">
                      {isReview && !isApproved ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setApprovedPRs((prev) => [...prev, pr.id])}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200 transition-colors whitespace-nowrap"
                          >
                            <CheckCircle size={11} /> CMO Approve
                          </button>
                        </div>
                      ) : isApproved ? (
                        <span className="text-xs text-green-700 font-medium flex items-center gap-1"><CheckCircle size={11} /> Approved</span>
                      ) : (
                        <button className="text-[hsl(25,20%,50%)] hover:text-[hsl(25,40%,18%)] transition-colors">
                          <Edit3 size={14} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Media List */}
        <div className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)] mb-4 flex items-center gap-2">
            <Users size={15} /> Media List
          </h2>
          <div className="space-y-2">
            {JOURNALISTS.map((j, i) => {
              const sc = journalistStatusConfig[j.status];
              return (
                <motion.div
                  key={j.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[hsl(36,33%,94%)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[hsl(25,62%,25%)]/10 flex items-center justify-center text-xs font-bold text-[hsl(25,62%,25%)]">
                    {j.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[hsl(25,40%,18%)]">{j.name}</span>
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", sc.bg, sc.color)}>{j.status}</span>
                    </div>
                    <p className="text-[10px] text-[hsl(25,20%,50%)]">{j.publication} · {j.beat}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-0.5 mb-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={8} className={idx < Math.round(j.relationshipScore / 2) ? "fill-amber-400 text-amber-400" : "text-[hsl(30,15%,87%)]"} />
                      ))}
                    </div>
                    <p className="text-[10px] text-[hsl(25,20%,50%)]">{j.lastContacted}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          {/* Coverage Tracker */}
          <div className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)] mb-3 flex items-center gap-2">
              <Globe size={15} /> Coverage Tracker
            </h2>
            <div className="space-y-2">
              {COVERAGE.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-lg bg-[hsl(36,33%,94%)] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[hsl(25,40%,18%)]">{c.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[hsl(25,62%,25%)]/10 text-[hsl(25,62%,25%)] px-1.5 py-0.5 rounded font-medium">DA {c.da}</span>
                      <span className="text-[10px] text-[hsl(25,20%,50%)]">{c.date}</span>
                      <ExternalLink size={11} className="text-[hsl(25,20%,50%)] cursor-pointer hover:text-[hsl(25,40%,18%)]" />
                    </div>
                  </div>
                  <p className="text-[11px] text-[hsl(25,20%,50%)] leading-snug line-clamp-2">{c.headline}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Outreach Queue */}
          <div className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)] mb-3 flex items-center gap-2">
              <Mail size={15} /> Outreach Queue
            </h2>
            <div className="space-y-2">
              {OUTREACH.map((o, i) => {
                const isApproved = approvedOutreach.includes(o.id);
                return (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 rounded-lg bg-[hsl(36,33%,94%)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[hsl(25,40%,18%)]">{o.journalist} <span className="font-normal text-[hsl(25,20%,50%)]">· {o.publication}</span></p>
                        <p className="text-[11px] text-[hsl(25,20%,50%)] mt-0.5 line-clamp-1">{o.subject}</p>
                        <p className="text-[10px] text-[hsl(25,20%,50%)] mt-0.5 flex items-center gap-1"><Clock size={9} /> {o.scheduledFor}</p>
                      </div>
                      {isApproved ? (
                        <span className="text-xs text-green-700 font-medium flex items-center gap-1 shrink-0"><CheckCircle size={11} /> Approved</span>
                      ) : (
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => setApprovedOutreach((prev) => [...prev, o.id])}
                            className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-[11px] font-medium hover:bg-green-200 transition-colors"
                          >
                            Approve
                          </button>
                          <button className="px-2 py-1 rounded-md bg-[hsl(30,15%,87%)] text-[hsl(25,20%,50%)] text-[11px] hover:bg-[hsl(30,15%,82%)] transition-colors">
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AIRecommendations page="pr" />

      {/* Draft Press Release Modal */}
      <AnimatePresence>
        {showDraftForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowDraftForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-6 w-full max-w-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[hsl(25,40%,18%)]">Draft Press Release</h3>
                <button onClick={() => setShowDraftForm(false)}><X size={16} className="text-[hsl(25,20%,50%)]" /></button>
              </div>
              {[
                { label: "Event Type", placeholder: "e.g. Product Launch, Funding, Partnership" },
                { label: "Key Message", placeholder: "Core announcement in one sentence" },
                { label: "Embargo Date", placeholder: "e.g. May 20, 2025" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-xs font-medium text-[hsl(25,40%,18%)] block mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded-lg border border-[hsl(30,15%,87%)] bg-white text-sm text-[hsl(25,40%,18%)] placeholder:text-[hsl(25,20%,50%)] outline-none focus:border-[hsl(25,62%,25%)]"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowDraftForm(false)}
                  className="flex-1 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-white text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Generate Draft
                </button>
                <button onClick={() => setShowDraftForm(false)} className="px-4 py-2 rounded-lg border border-[hsl(30,15%,87%)] text-sm text-[hsl(25,20%,50%)] hover:bg-[hsl(36,33%,94%)]">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
