// /Users/navaneethakrishnan/Desktop/skott/app/events/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Flame,
  BarChart2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  ChevronRight,
  Zap,
  TrendingUp,
  Grid3X3,
  List,
  LayoutGrid,
  PieChart,
  Table,
  Eye,
  Mail,
} from "lucide-react";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";
import { MetricCard } from "@/components/shared/MetricCard";
import { events } from "@/data/mock";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────
type StatusFilter = "All Status" | "done" | "confirmed" | "planning" | "TBD";

// ─── Config ────────────────────────────────────────────────────────────────────
const STATUS_FILTERS: StatusFilter[] = ["All Status", "done", "confirmed", "planning", "TBD"];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  done:      { label: "Done",      bg: "bg-[hsl(142,71%,45%)]/10", text: "text-[hsl(142,71%,35%)]", border: "border-[hsl(142,71%,45%)]/20" },
  confirmed: { label: "Confirmed", bg: "bg-blue-50",               text: "text-blue-700",            border: "border-blue-200" },
  planning:  { label: "Planning",  bg: "bg-amber-50",              text: "text-amber-700",            border: "border-amber-200" },
  TBD:       { label: "TBD",       bg: "bg-[hsl(25,20%,92%)]",    text: "text-[hsl(25,20%,50%)]",   border: "border-[hsl(30,15%,80%)]" },
};

const CATEGORY_CONFIG: Record<string, { bg: string; text: string }> = {
  Conference: { bg: "bg-indigo-50",  text: "text-indigo-700" },
  Dinner:     { bg: "bg-purple-50",  text: "text-purple-700" },
  Partner:    { bg: "bg-teal-50",    text: "text-teal-700" },
  Digital:    { bg: "bg-orange-50",  text: "text-orange-700" },
};

const VIEW_MODES = [
  { icon: <List size={14} />,       label: "Table" },
  { icon: <Calendar size={14} />,   label: "Calendar" },
  { icon: <LayoutGrid size={14} />, label: "Board" },
  { icon: <PieChart size={14} />,   label: "Budget View" },
  { icon: <BarChart2 size={14} />,  label: "Analytics" },
  { icon: <Grid3X3 size={14} />,    label: "Map View" },
  { icon: <Users size={14} />,      label: "Team View" },
  { icon: <Eye size={14} />,        label: "Timeline" },
];

// ─── Lead Intake mock data ─────────────────────────────────────────────────────
const sampleLeads = [
  { name: "James Whitfield",  title: "VP of Operations",    company: "Citibank",       score: 88, temp: "HOT",  hubspot: "Enrolled in AE sequence", avatar: "JW" },
  { name: "Priya Mehta",      title: "Director of IT",      company: "HDFC Bank",      score: 64, temp: "WARM", hubspot: "Added to SDR nurture",     avatar: "PM" },
  { name: "Carlos Restrepo",  title: "Marketing Analyst",   company: "Santander",      score: 31, temp: "COOL", hubspot: "Tagged — re-engage Q3",    avatar: "CR" },
];

const TEMP_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  HOT:  { bg: "bg-[hsl(0,84%,60%)]/10",    text: "text-[hsl(0,84%,50%)]",    border: "border-[hsl(0,84%,60%)]/20" },
  WARM: { bg: "bg-amber-50",               text: "text-amber-700",            border: "border-amber-200" },
  COOL: { bg: "bg-blue-50",                text: "text-blue-600",             border: "border-blue-200" },
};

// ─── CMO Report sections ───────────────────────────────────────────────────────
const reportSections = [
  { label: "Executive Summary",        icon: <FileText size={13} />,   done: true  },
  { label: "Event Performance Table",  icon: <Table size={13} />,      done: true  },
  { label: "Lead Quality Breakdown",   icon: <BarChart2 size={13} />,  done: true  },
  { label: "Budget vs Actuals",        icon: <DollarSign size={13} />, done: true  },
  { label: "Pipeline Attribution",     icon: <TrendingUp size={13} />, done: true  },
  { label: "Next Quarter Roadmap",     icon: <Calendar size={13} />,   done: false },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function AvatarChip({ name }: { name: string }) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-[9px] font-[600] -ml-1 first:ml-0 border border-[hsl(36,30%,96%)]">
      {initials}
    </span>
  );
}

function StatusChip({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["TBD"];
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-[500] border", cfg.bg, cfg.text, cfg.border)}>
      {cfg.label}
    </span>
  );
}

function CategoryChip({ category }: { category: string }) {
  const cfg = CATEGORY_CONFIG[category] ?? { bg: "bg-gray-50", text: "text-gray-600" };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-[500]", cfg.bg, cfg.text)}>
      {category}
    </span>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function EventsManagerPage() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeViewMode, setActiveViewMode] = useState(0);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const filtered = events.filter((e) => {
    const matchesStatus = activeFilter === "All Status" || e.status === activeFilter;
    const matchesSearch =
      !searchQuery ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalBudget = events.reduce((s, e) => s + e.budget, 0);
  const totalHot = events.reduce((s, e) => s + e.hot, 0);
  const closedWonRevenue = events.reduce((s, e) => s + e.revenue, 0);
  const closedWonCount = events.filter((e) => e.closedWon > 0).length;

  async function handleGenerateReport() {
    setGeneratingReport(true);
    await new Promise((r) => setTimeout(r, 1800));
    setGeneratingReport(false);
    setReportGenerated(true);
  }

  return (
    <div className="min-h-screen bg-[hsl(36,30%,98%)] p-6 space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-3xl font-[700] text-[hsl(25,40%,18%)]">Events Manager</h1>
            <AgentStatusBadge status="active" />
          </div>
          <p className="text-[hsl(25,20%,45%)] text-sm">Events Command Agent · 8 runs today · Last: 15m ago</p>
        </div>

        {/* View mode buttons */}
        <div className="flex items-center gap-1 flex-wrap justify-end">
          {VIEW_MODES.map((vm, i) => (
            <button
              key={vm.label}
              onClick={() => setActiveViewMode(i)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-[500] border transition-all",
                activeViewMode === i
                  ? "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] border-[hsl(25,62%,25%)]"
                  : "bg-[hsl(36,30%,96%)] border-[hsl(30,15%,85%)] text-[hsl(25,20%,45%)] hover:border-[hsl(25,62%,25%)]/40"
              )}
            >
              {vm.icon}
              {vm.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Metrics ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Events Total" value="48" sub="8 tracked this quarter" />
        <MetricCard label="Budget Committed" value="$326,705" sub="Across all events" />
        <MetricCard label="Hot Leads" value={totalHot} sub="From completed events" trend={+12} />
        <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)]">
          <p className="text-[11px] uppercase tracking-widest font-[500] mb-3 text-[hsl(25,20%,45%)]">Closed Won</p>
          <p className="font-serif text-3xl font-[600] tracking-tight text-[hsl(25,40%,18%)]">
            {closedWonCount}
          </p>
          <p className="text-xs mt-1 text-[hsl(142,71%,35%)] font-[600]">
            $1.5M revenue attributed
          </p>
        </div>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-[0.75rem] p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-[500] transition-all",
                activeFilter === f
                  ? "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)]"
                  : "text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)]"
              )}
            >
              {f === "done" ? "Done" : f === "confirmed" ? "Confirmed" : f === "planning" ? "Planning" : f}
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(25,20%,55%)]" />
          <input
            type="text"
            placeholder="Search events…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-[0.75rem] text-[hsl(25,40%,18%)] placeholder:text-[hsl(25,20%,60%)] focus:outline-none focus:border-[hsl(25,62%,25%)]/50"
          />
        </div>

        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-[500] text-[hsl(25,20%,45%)] border border-[hsl(30,15%,85%)] rounded-[0.75rem] bg-[hsl(36,30%,96%)] hover:border-[hsl(25,62%,25%)]/40 transition-all">
          <Filter size={13} />
          More Filters
        </button>
      </div>

      {/* ── Events Table ───────────────────────────────────────────────────── */}
      <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(30,15%,85%)] bg-[hsl(36,30%,93%)]">
                {["Event Name", "Date", "Location", "Category", "Status", "Budget", "Leads", "Hot", "SQL", "Closed Won", "Attendees", "Actions"].map((col) => (
                  <th key={col} className="text-left px-4 py-3 text-[11px] uppercase tracking-widest text-[hsl(25,20%,45%)] font-[500] whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((event, i) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-[hsl(30,15%,88%)] hover:bg-[hsl(36,30%,93%)] transition-colors"
                >
                  <td className="px-4 py-3 font-[500] text-[hsl(25,40%,18%)] whitespace-nowrap">{event.name}</td>
                  <td className="px-4 py-3 text-[hsl(25,20%,45%)] whitespace-nowrap">{formatDate(event.date)}</td>
                  <td className="px-4 py-3 text-[hsl(25,20%,45%)] whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="shrink-0" />
                      {event.location}
                    </span>
                  </td>
                  <td className="px-4 py-3"><CategoryChip category={event.category} /></td>
                  <td className="px-4 py-3"><StatusChip status={event.status} /></td>
                  <td className="px-4 py-3 text-[hsl(25,40%,18%)] font-[500] whitespace-nowrap">${event.budget.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[hsl(25,20%,45%)]">{event.leads || "—"}</td>
                  <td className="px-4 py-3">
                    {event.hot > 0 ? (
                      <span className="flex items-center gap-0.5 text-[hsl(0,84%,50%)] font-[600]">
                        <Flame size={12} />
                        {event.hot}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-[hsl(25,20%,45%)]">{event.sql || "—"}</td>
                  <td className="px-4 py-3">
                    {event.revenue > 0 ? (
                      <span className="text-[hsl(142,71%,35%)] font-[700]">
                        ${(event.revenue / 1_000_000).toFixed(1)}M
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {event.attendees.map((a) => <AvatarChip key={a} name={a} />)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-[11px] font-[500] text-[hsl(25,62%,25%)] hover:underline flex items-center gap-0.5">
                      View <ChevronRight size={11} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-[hsl(30,15%,85%)] text-xs text-[hsl(25,20%,55%)]">
          Showing {filtered.length} of {events.length} events
        </div>
      </div>

      {/* ── Bottom sections: Lead Intake + CMO Report ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Lead Intake */}
        <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-[600] text-[hsl(25,40%,18%)]">Post-Event Lead Processing</h2>
              <p className="text-[11px] text-[hsl(25,20%,50%)] mt-0.5">Events Command Agent · Finovate Fall · 23 leads</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,35%)] text-[11px] font-[500]">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142,71%,45%)] animate-pulse" />
              Processing
            </div>
          </div>

          {/* Routing legend */}
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-[hsl(0,84%,50%)] font-[600]"><Flame size={11} /> HOT → AE Slack</span>
            <span className="text-[hsl(25,20%,60%)]">·</span>
            <span className="flex items-center gap-1 text-amber-600 font-[600]"><Zap size={11} /> WARM → SDR Sequence</span>
            <span className="text-[hsl(25,20%,60%)]">·</span>
            <span className="text-[hsl(25,20%,50%)]">COOL → Re-engage Q3</span>
          </div>

          <div className="space-y-3">
            {sampleLeads.map((lead, i) => {
              const tempCfg = TEMP_CONFIG[lead.temp];
              return (
                <motion.div
                  key={lead.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[hsl(30,15%,85%)] bg-white/60"
                >
                  <div className="w-9 h-9 rounded-full bg-[hsl(25,62%,25%)] flex items-center justify-center text-[hsl(36,33%,94%)] text-[11px] font-[700] shrink-0">
                    {lead.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-[600] text-[hsl(25,40%,18%)] truncate">{lead.name}</p>
                    <p className="text-[11px] text-[hsl(25,20%,50%)] truncate">{lead.title} · {lead.company}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-[700] border", tempCfg.bg, tempCfg.text, tempCfg.border)}>
                      {lead.temp}
                    </span>
                    <div className="text-right">
                      <p className="text-[10px] text-[hsl(25,20%,50%)]">Score</p>
                      <p className={cn("text-xs font-[700]", lead.score >= 80 ? "text-[hsl(0,84%,50%)]" : lead.score >= 60 ? "text-amber-600" : "text-blue-600")}>{lead.score}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* HubSpot status mini-table */}
          <div className="rounded-xl border border-[hsl(30,15%,85%)] overflow-hidden">
            <div className="bg-[hsl(36,30%,93%)] px-3 py-2 text-[11px] font-[600] text-[hsl(25,20%,45%)] uppercase tracking-widest">HubSpot Routing Status</div>
            {sampleLeads.map((lead) => (
              <div key={lead.name} className="flex items-center justify-between px-3 py-2 border-t border-[hsl(30,15%,88%)] text-xs">
                <span className="font-[500] text-[hsl(25,40%,18%)]">{lead.name}</span>
                <span className="text-[hsl(25,20%,50%)]">{lead.hubspot}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CMO Report */}
        <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-[600] text-[hsl(25,40%,18%)]">CMO SDR Report</h2>
              <p className="text-[11px] text-[hsl(25,20%,50%)] mt-0.5">Auto-generated from events data · Q2 2025</p>
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={generatingReport}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-[600] transition-all",
                generatingReport
                  ? "bg-[hsl(25,62%,25%)]/60 text-white cursor-wait"
                  : "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] hover:bg-[hsl(25,62%,20%)]"
              )}
            >
              {generatingReport ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <FileText size={14} />
                  Generate SDR Report
                </>
              )}
            </button>
          </div>

          {/* Sections list */}
          <div className="space-y-2">
            {reportSections.map((sec, i) => (
              <div
                key={sec.label}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all",
                  reportGenerated && sec.done
                    ? "border-[hsl(142,71%,45%)]/20 bg-[hsl(142,71%,45%)]/5"
                    : "border-[hsl(30,15%,85%)] bg-white/40"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                  reportGenerated && sec.done
                    ? "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,35%)]"
                    : "bg-[hsl(36,30%,90%)] text-[hsl(25,20%,50%)]"
                )}>
                  {reportGenerated && sec.done ? <CheckCircle2 size={14} /> : sec.icon}
                </div>
                <span className={cn(
                  "text-sm font-[500] flex-1",
                  reportGenerated && sec.done ? "text-[hsl(25,40%,18%)]" : "text-[hsl(25,20%,50%)]"
                )}>
                  {sec.label}
                </span>
                {!reportGenerated && (
                  <span className="text-[11px] text-[hsl(25,20%,60%)]">Section {i + 1}</span>
                )}
                {reportGenerated && sec.done && (
                  <span className="text-[11px] text-[hsl(142,71%,35%)] font-[500]">Ready</span>
                )}
                {reportGenerated && !sec.done && (
                  <span className="text-[11px] text-amber-600 font-[500]">Pending</span>
                )}
              </div>
            ))}
          </div>

          <AnimatePresence>
            {reportGenerated && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 pt-2"
              >
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-sm font-[600] hover:bg-[hsl(25,62%,20%)] transition-all">
                  <Download size={13} />
                  Download PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[hsl(30,15%,85%)] text-[hsl(25,20%,45%)] text-sm font-[500] hover:border-[hsl(25,62%,25%)]/40 transition-all">
                  <Mail size={13} />
                  Email to CMO
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AIRecommendations page="events" />
    </div>
  );
}
