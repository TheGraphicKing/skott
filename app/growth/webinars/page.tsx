"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Filter,
  Plus,
  Send,
  Edit3,
  FileText,
  Network,
  BarChart2,
  Zap,
  ChevronRight,
  Play,
  AlertCircle,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

// ─── Types ────────────────────────────────────────────────────────────────────

type WebinarFilter = "Upcoming" | "Live" | "Completed" | "Drafts";
type WebinarStatus = "Confirmed" | "Prep" | "Draft";

interface Webinar {
  id: string;
  title: string;
  date: string;
  time: string;
  speaker: string;
  registrations: number;
  target: number;
  daysUntil: number;
  status: WebinarStatus;
}

interface RepurposeStage {
  label: string;
  icon: any;
  status: "done" | "generating" | "pending";
}

interface PostWebinar {
  id: string;
  title: string;
  date: string;
  attendees: number;
  pipeline: string;
  stages: RepurposeStage[];
}

interface FollowUpEmail {
  id: string;
  webinar: string;
  segment: string;
  to: number;
  subject: string;
  scheduledFor: string;
  approved: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const UPCOMING_WEBINARS: Webinar[] = [
  {
    id: "w1",
    title: "AI-Powered GTM: From Lead to Revenue in 30 Days",
    date: "May 22, 2025",
    time: "11:00 AM PT",
    speaker: "Clara Reid, VP Marketing at Skott",
    registrations: 312,
    target: 400,
    daysUntil: 8,
    status: "Confirmed",
  },
  {
    id: "w2",
    title: "The Modern Demand Gen Playbook for B2B SaaS",
    date: "Jun 5, 2025",
    time: "10:00 AM PT",
    speaker: "Daniel Park, Head of Growth",
    registrations: 187,
    target: 350,
    daysUntil: 22,
    status: "Prep",
  },
  {
    id: "w3",
    title: "ABM at Scale: Lessons from 100 Enterprise Campaigns",
    date: "Jun 19, 2025",
    time: "1:00 PM PT",
    speaker: "Niamh Walsh, Director of ABM",
    registrations: 74,
    target: 300,
    daysUntil: 36,
    status: "Draft",
  },
];

const POST_WEBINARS: PostWebinar[] = [
  {
    id: "pw1",
    title: "Content Marketing Velocity: 10x Output with AI",
    date: "Apr 30, 2025",
    attendees: 284,
    pipeline: "$112K",
    stages: [
      { label: "Recording", icon: Play, status: "done" },
      { label: "Clip Highlights", icon: Zap, status: "done" },
      { label: "Blog Post", icon: FileText, status: "done" },
      { label: "Email Follow-up", icon: Send, status: "generating" },
      { label: "LinkedIn Post", icon: Network, status: "pending" },
      { label: "Sales Follow-up", icon: ChevronRight, status: "pending" },
    ],
  },
  {
    id: "pw2",
    title: "Pipeline Attribution in a Cookieless World",
    date: "Apr 10, 2025",
    attendees: 341,
    pipeline: "$172K",
    stages: [
      { label: "Recording", icon: Play, status: "done" },
      { label: "Clip Highlights", icon: Zap, status: "done" },
      { label: "Blog Post", icon: FileText, status: "done" },
      { label: "Email Follow-up", icon: Send, status: "done" },
      { label: "LinkedIn Post", icon: Network, status: "done" },
      { label: "Sales Follow-up", icon: ChevronRight, status: "generating" },
    ],
  },
];

const CHART_DATA = [
  { name: "Feb", registrations: 312, attendees: 198 },
  { name: "Mar", registrations: 428, attendees: 301 },
  { name: "Apr (W1)", registrations: 267, attendees: 184 },
  { name: "Apr (W2)", registrations: 391, attendees: 271 },
  { name: "May (W1)", registrations: 445, attendees: 312 },
  { name: "May (W2)", registrations: 284, attendees: 200 },
  { name: "Jun (W1)", registrations: 187, attendees: 0 },
  { name: "Jun (W2)", registrations: 74, attendees: 0 },
];

const FOLLOW_UP_EMAILS: FollowUpEmail[] = [
  { id: "fe1", webinar: "Content Marketing Velocity", segment: "Attended — no demo request", to: 201, subject: "Your recording + 3 AI content templates we promised", scheduledFor: "Today 2:00 PM", approved: false },
  { id: "fe2", webinar: "Content Marketing Velocity", segment: "Registered but didn't attend", to: 83, subject: "Missed the webinar? Here's the 10-min highlight reel", scheduledFor: "Today 4:00 PM", approved: false },
  { id: "fe3", webinar: "Pipeline Attribution", segment: "Attended — showed demo interest", to: 47, subject: "Following up on your interest in attribution modeling", scheduledFor: "Tomorrow 9:00 AM", approved: true },
];

const CONTENT_REPURPOSING = [
  { type: "Blog Post", title: "10 AI Tools That 10x'd Our Content Output (Real Results)", status: "Published", link: "#" },
  { type: "LinkedIn Carousel", title: "5 lessons from 400+ marketers in one webinar", status: "Scheduled", link: "#" },
  { type: "Short Video Clip", title: "Clara's 90-second take on AI content strategy", status: "Generated", link: "#" },
  { type: "One-Pager PDF", title: "AI GTM Checklist — downloadable resource", status: "Generated", link: "#" },
  { type: "Email Nurture", title: "3-email sequence for non-attendees with webinar highlights", status: "Draft", link: "#" },
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

function StatusChip({ status }: { status: WebinarStatus }) {
  const map: Record<WebinarStatus, string> = {
    Confirmed: "bg-green-50 text-green-700 border border-green-200",
    Prep: "bg-amber-50 text-amber-700 border border-amber-200",
    Draft: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${map[status]}`}>{status}</span>;
}

function RepurposeStageChip({ stage }: { stage: RepurposeStage }) {
  const Icon = stage.icon;
  const colors = {
    done: "bg-green-50 text-green-700 border border-green-200",
    generating: "bg-blue-50 text-blue-600 border border-blue-200 animate-pulse",
    pending: "bg-[hsl(36,33%,94%)] text-[hsl(25,20%,50%)] border border-[hsl(30,15%,87%)]",
  };
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium ${colors[stage.status]}`}>
      {stage.status === "done" ? <CheckCircle size={10} /> : stage.status === "generating" ? <Clock size={10} /> : <Circle size={10} />}
      {stage.label}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WebinarsPage() {
  const [filter, setFilter] = useState<WebinarFilter>("Upcoming");
  const [approvedEmails, setApprovedEmails] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);

  const filters: WebinarFilter[] = ["Upcoming", "Live", "Completed", "Drafts"];

  return (
    <div className="min-h-screen bg-[hsl(36,33%,94%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[hsl(25,62%,25%)] flex items-center justify-center">
            <Video size={18} className="text-[hsl(36,33%,94%)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[hsl(25,40%,18%)]">Webinar Operations Agent</h1>
            <p className="text-xs text-[hsl(25,20%,50%)]">End-to-end webinar lifecycle management</p>
          </div>
          <AgentStatusBadge status="active" />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          Schedule Webinar
        </button>
      </div>

      {/* Schedule Webinar Form (toggled) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border border-[hsl(25,62%,25%)]/20 bg-[hsl(36,30%,97%)] p-5 overflow-hidden"
          >
            <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)] mb-4">New Webinar</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Webinar Title", placeholder: "e.g. AI GTM Playbook for 2025" },
                { label: "Date & Time", placeholder: "e.g. Jun 25, 2025 11:00 AM PT" },
                { label: "Speaker(s)", placeholder: "Name, Title" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-xs font-medium text-[hsl(25,20%,50%)] mb-1">{field.label}</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-[hsl(30,15%,87%)] bg-[hsl(36,33%,94%)] text-sm text-[hsl(25,40%,18%)] placeholder:text-[hsl(25,20%,50%)] focus:outline-none focus:border-[hsl(25,62%,25%)]"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-sm font-medium hover:opacity-90">Create & Generate Assets</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[hsl(30,15%,87%)] text-sm text-[hsl(25,40%,18%)] hover:bg-[hsl(36,33%,94%)]">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard icon={Video} label="Webinars This Quarter" value="8" sub="3 planned, 5 completed" color="bg-[hsl(25,62%,25%)]/10 text-[hsl(25,62%,25%)]" />
        <KPICard icon={Users} label="Total Registrations" value="2,847" sub="+23% vs last quarter" color="bg-blue-50 text-blue-600" />
        <KPICard icon={TrendingUp} label="Avg Attendance Rate" value="67%" sub="Industry avg: 52%" color="bg-green-50 text-green-600" />
        <KPICard icon={DollarSign} label="Pipeline from Webinars" value="$284K" sub="Attributed this quarter" color="bg-purple-50 text-purple-600" />
      </div>

      {/* Filter + Upcoming Webinars */}
      <div>
        <div className="flex items-center gap-2 mb-4">
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
        </div>

        {filter === "Upcoming" && (
          <div className="grid grid-cols-3 gap-4">
            {UPCOMING_WEBINARS.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <StatusChip status={w.status} />
                  <span className="text-[11px] font-semibold text-[hsl(25,62%,25%)] bg-[hsl(25,62%,25%)]/10 px-2 py-0.5 rounded-full">
                    {w.daysUntil > 0 ? `${w.daysUntil}d away` : "Live"}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[hsl(25,40%,18%)] mb-1 leading-snug">{w.title}</h3>
                <p className="text-[11px] text-[hsl(25,20%,50%)] mb-3">{w.speaker}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[hsl(25,20%,50%)] mb-3">
                  <Calendar size={11} /> {w.date} · {w.time}
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-[hsl(25,20%,50%)] mb-1">
                    <span>Registrations</span>
                    <span className="font-semibold text-[hsl(25,40%,18%)]">{w.registrations} / {w.target}</span>
                  </div>
                  <div className="h-1.5 bg-[hsl(30,15%,87%)] rounded-full">
                    <div
                      className="h-full rounded-full bg-[hsl(25,62%,25%)]"
                      style={{ width: `${Math.min((w.registrations / w.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 text-[11px] py-1.5 rounded border border-[hsl(30,15%,87%)] text-[hsl(25,40%,18%)] hover:bg-[hsl(36,33%,94%)] transition-colors">View Registrants</button>
                  <button className="flex-1 text-[11px] py-1.5 rounded border border-[hsl(30,15%,87%)] text-[hsl(25,40%,18%)] hover:bg-[hsl(36,33%,94%)] transition-colors">Send Reminder</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filter !== "Upcoming" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-dashed border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-10 text-center"
          >
            <Video size={28} className="text-[hsl(25,20%,50%)] mx-auto mb-2" />
            <p className="text-sm text-[hsl(25,20%,50%)]">No webinars in <strong>{filter}</strong> status</p>
          </motion.div>
        )}
      </div>

      {/* Post-Webinar Pipeline + Chart */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Post-Webinar Pipeline</h2>
          {POST_WEBINARS.map((pw, i) => (
            <motion.div
              key={pw.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-[hsl(25,40%,18%)]">{pw.title}</h3>
                  <p className="text-[11px] text-[hsl(25,20%,50%)] mt-0.5">{pw.date} · {pw.attendees} attendees · <span className="text-green-600 font-medium">{pw.pipeline} pipeline</span></p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {pw.stages.map((stage, si) => (
                  <RepurposeStageChip key={si} stage={stage} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Registration Chart */}
        <div className="rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={14} className="text-[hsl(25,62%,25%)]" />
            <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Registrations by Webinar</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CHART_DATA} barGap={2}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(25,20%,50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(25,20%,50%)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(36,30%,97%)", border: "1px solid hsl(30,15%,87%)", borderRadius: 8, fontSize: 11 }}
                cursor={{ fill: "hsl(25,62%,25%)", opacity: 0.05 }}
              />
              <Bar dataKey="registrations" fill="hsl(25,62%,25%)" radius={[3, 3, 0, 0]} name="Registrations" />
              <Bar dataKey="attendees" fill="hsl(25,62%,25%)" fillOpacity={0.35} radius={[3, 3, 0, 0]} name="Attended" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-[hsl(25,20%,50%)]">
              <div className="w-3 h-3 rounded bg-[hsl(25,62%,25%)]" /> Registrations
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[hsl(25,20%,50%)]">
              <div className="w-3 h-3 rounded bg-[hsl(25,62%,25%)]/35" /> Attended
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Email Approvals + Content Repurposing */}
      <div className="grid grid-cols-2 gap-6">
        {/* Follow-up Emails */}
        <div className="rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={14} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Follow-up Email Approvals</h2>
            <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              {FOLLOW_UP_EMAILS.filter((e) => !approvedEmails.has(e.id) && !e.approved).length} pending
            </span>
          </div>
          <div className="space-y-3">
            {FOLLOW_UP_EMAILS.map((email) => {
              const isApproved = approvedEmails.has(email.id) || email.approved;
              return (
                <div key={email.id} className="p-3 rounded-lg bg-[hsl(36,33%,94%)] border border-[hsl(30,15%,87%)]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-[hsl(25,62%,25%)]">{email.webinar}</p>
                      <p className="text-xs font-medium text-[hsl(25,40%,18%)] truncate">{email.subject}</p>
                      <p className="text-[11px] text-[hsl(25,20%,50%)]">{email.segment} · {email.to} recipients</p>
                      <p className="text-[11px] text-[hsl(25,20%,50%)] flex items-center gap-1 mt-0.5"><Clock size={10} /> {email.scheduledFor}</p>
                    </div>
                    <button
                      onClick={() => setApprovedEmails((prev) => new Set([...prev, email.id]))}
                      className={`shrink-0 mt-0.5 transition-colors ${isApproved ? "text-green-500" : "text-[hsl(25,20%,50%)] hover:text-green-500"}`}
                    >
                      <CheckCircle size={18} />
                    </button>
                  </div>
                  {!isApproved && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setApprovedEmails((prev) => new Set([...prev, email.id]))}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-[11px] font-medium hover:opacity-90"
                      >
                        <Send size={10} /> Approve & Schedule
                      </button>
                      <button className="px-3 py-1.5 rounded border border-[hsl(30,15%,87%)] text-[11px] text-[hsl(25,40%,18%)] hover:bg-[hsl(30,15%,87%)]">
                        <Edit3 size={11} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Repurposing Tracker */}
        <div className="rounded-xl border border-[hsl(30,15%,87%)] bg-[hsl(36,30%,97%)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-[hsl(25,62%,25%)]" />
            <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Content Repurposing Tracker</h2>
            <span className="ml-auto text-[11px] text-[hsl(25,20%,50%)]">Content Marketing Velocity webinar</span>
          </div>
          <div className="space-y-2">
            {CONTENT_REPURPOSING.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(36,33%,94%)] border border-[hsl(30,15%,87%)]"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[hsl(25,62%,25%)]">{item.type}</p>
                  <p className="text-xs text-[hsl(25,40%,18%)] truncate">{item.title}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  item.status === "Published" ? "bg-green-50 text-green-700 border-green-200" :
                  item.status === "Scheduled" ? "bg-blue-50 text-blue-600 border-blue-200" :
                  item.status === "Generated" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-gray-100 text-gray-500 border-gray-200"
                }`}>{item.status}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <AIRecommendations page="webinars" />
    </div>
  );
}
