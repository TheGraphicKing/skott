"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  BarChart2,
  Beaker,
  Users,
  CheckCircle,
  Clock,
  Pause,
  Eye,
  Edit3,
  Plus,
  Filter,
  TrendingUp,
  Globe,
  Layout,
} from "lucide-react";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { cn } from "@/lib/utils";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

// ─── Types ────────────────────────────────────────────────────────────────────
type PageStatus = "Building" | "Review" | "Live" | "Paused";

interface PageItem {
  id: string;
  name: string;
  template: string;
  status: PageStatus;
  traffic: string;
  conversions: string;
  updated: string;
}

interface ABTest {
  id: string;
  page: string;
  variantA: { label: string; cr: string; visitors: number };
  variantB: { label: string; cr: string; visitors: number };
  winner: "A" | "B" | null;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PAGES: PageItem[] = [
  { id: "p1", name: "Lyzr Platform Webinar — May 2025", template: "Webinar Registration", status: "Live",     traffic: "4.2K", conversions: "312", updated: "2h ago" },
  { id: "p2", name: "Architect v2 Product Launch",       template: "Product Launch",       status: "Review",   traffic: "—",    conversions: "—",   updated: "5h ago" },
  { id: "p3", name: "Fortune 500 Case Study: Ops AI",    template: "Case Study",           status: "Building", traffic: "—",    conversions: "—",   updated: "1h ago" },
  { id: "p4", name: "Try Lyzr Free — Q2 Campaign",       template: "Free Trial",           status: "Live",     traffic: "9.8K", conversions: "724", updated: "30m ago" },
  { id: "p5", name: "SaaStr Annual Partner Page",        template: "Partner",              status: "Paused",   traffic: "640",  conversions: "28",  updated: "3d ago" },
];

const TEMPLATES = [
  { id: "t1", name: "Webinar Registration", color: "from-blue-400 to-blue-600",    uses: 8 },
  { id: "t2", name: "Product Launch",       color: "from-purple-400 to-purple-600", uses: 5 },
  { id: "t3", name: "Case Study",           color: "from-emerald-400 to-emerald-600", uses: 12 },
  { id: "t4", name: "Free Trial",           color: "from-amber-400 to-amber-600",  uses: 6 },
  { id: "t5", name: "Event",               color: "from-rose-400 to-rose-600",     uses: 4 },
  { id: "t6", name: "Partner",             color: "from-cyan-400 to-cyan-600",     uses: 3 },
];

const AB_TESTS: ABTest[] = [
  {
    id: "ab1",
    page: "Try Lyzr Free — Q2 Campaign",
    variantA: { label: "Original CTA: 'Start Free Trial'",  cr: "3.8%", visitors: 4820 },
    variantB: { label: "Variant CTA: 'Build Your AI Agent'", cr: "5.1%", visitors: 4790 },
    winner: "B",
  },
  {
    id: "ab2",
    page: "Lyzr Platform Webinar — May 2025",
    variantA: { label: "Hero: Product screenshot", cr: "6.2%", visitors: 2140 },
    variantB: { label: "Hero: Demo video embed",   cr: "7.9%", visitors: 2105 },
    winner: null,
  },
];

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig: Record<PageStatus, { color: string; bg: string; icon: React.ReactNode }> = {
  Live:     { color: "text-green-700",  bg: "bg-green-100",  icon: <Globe size={12} /> },
  Review:   { color: "text-amber-700",  bg: "bg-amber-100",  icon: <Eye size={12} /> },
  Building: { color: "text-blue-700",   bg: "bg-blue-100",   icon: <Clock size={12} /> },
  Paused:   { color: "text-neutral-600", bg: "bg-neutral-100", icon: <Pause size={12} /> },
};

const FILTERS: Array<{ label: string; value: PageStatus | "All" }> = [
  { label: "All",      value: "All" },
  { label: "Live",     value: "Live" },
  { label: "Review",   value: "Review" },
  { label: "Building", value: "Building" },
  { label: "Paused",   value: "Paused" },
];

const KPIS = [
  { label: "Pages Live",            value: "31",  sub: "+4 this month",    icon: <Globe size={20} /> },
  { label: "Avg Conversion Rate",   value: "4.2%", sub: "+0.6% vs last mo", icon: <TrendingUp size={20} /> },
  { label: "A/B Tests Active",      value: "3",   sub: "2 near significance", icon: <Beaker size={20} /> },
  { label: "Avg Monthly Traffic",   value: "18K", sub: "across all pages",  icon: <Users size={20} /> },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function PageBuilderPage() {
  const [filter, setFilter] = useState<PageStatus | "All">("All");
  const [approvedPages, setApprovedPages] = useState<string[]>([]);

  const filtered = filter === "All" ? PAGES : PAGES.filter((p) => p.status === filter);

  return (
    <div className="min-h-screen bg-[hsl(36,33%,94%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[hsl(25,62%,25%)] flex items-center justify-center">
            <Layout size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-[hsl(25,40%,18%)]">Page Builder Agent</h1>
              <AgentStatusBadge status="active" />
            </div>
            <p className="text-xs text-[hsl(25,20%,50%)]">AI-powered landing page creation & optimisation</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-white text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={15} /> New Page
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

      {/* Template Gallery */}
      <div className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)] mb-4 flex items-center gap-2">
          <FileText size={15} /> Template Gallery
        </h2>
        <div className="grid grid-cols-6 gap-3">
          {TEMPLATES.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col gap-2 cursor-pointer"
            >
              <div className={cn("h-24 rounded-lg bg-gradient-to-br", t.color, "flex items-center justify-center")}>
                <Layout size={28} className="text-white/80" />
              </div>
              <p className="text-xs font-medium text-[hsl(25,40%,18%)] leading-tight">{t.name}</p>
              <p className="text-[10px] text-[hsl(25,20%,50%)]">Used {t.uses}x</p>
              <button className="text-[11px] py-1 rounded-md border border-[hsl(30,15%,87%)] text-[hsl(25,62%,25%)] hover:bg-[hsl(25,62%,25%)] hover:text-white transition-colors font-medium">
                Use Template
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pages In Progress */}
      <div className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)] flex items-center gap-2">
            <BarChart2 size={15} /> Pages In Progress
          </h2>
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-[hsl(36,33%,94%)] rounded-lg p-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-all",
                  filter === f.value
                    ? "bg-[hsl(25,62%,25%)] text-white"
                    : "text-[hsl(25,20%,50%)] hover:text-[hsl(25,40%,18%)]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(30,15%,87%)]">
                {["Page Name", "Template", "Status", "Traffic", "Conversions", "Last Updated", "Action"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold text-[hsl(25,20%,50%)] uppercase tracking-wide pb-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.map((page) => {
                  const sc = statusConfig[page.status];
                  const isReview = page.status === "Review";
                  const isApproved = approvedPages.includes(page.id);
                  return (
                    <motion.tr
                      key={page.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="border-b border-[hsl(30,15%,87%)]/50 hover:bg-[hsl(36,33%,94%)]/60 transition-colors"
                    >
                      <td className="py-3 pr-4 font-medium text-[hsl(25,40%,18%)]">{page.name}</td>
                      <td className="py-3 pr-4 text-[hsl(25,20%,50%)] text-xs">{page.template}</td>
                      <td className="py-3 pr-4">
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium", sc.bg, sc.color)}>
                          {sc.icon} {page.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-[hsl(25,40%,18%)]">{page.traffic}</td>
                      <td className="py-3 pr-4 text-[hsl(25,40%,18%)]">{page.conversions}</td>
                      <td className="py-3 pr-4 text-[hsl(25,20%,50%)] text-xs">{page.updated}</td>
                      <td className="py-3">
                        {isReview && !isApproved ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setApprovedPages((prev) => [...prev, page.id])}
                              className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200 transition-colors"
                            >
                              <CheckCircle size={11} /> Approve & Publish
                            </button>
                            <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-medium hover:bg-amber-200 transition-colors">
                              <Edit3 size={11} /> Request Changes
                            </button>
                          </div>
                        ) : isApproved ? (
                          <span className="text-xs text-green-700 font-medium flex items-center gap-1"><CheckCircle size={11} /> Published</span>
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
      </div>

      <AIRecommendations page="pages" />

      {/* A/B Test Panel */}
      <div className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)] mb-4 flex items-center gap-2">
          <Beaker size={15} /> Active A/B Tests
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {AB_TESTS.map((test) => (
            <motion.div
              key={test.id}
              whileHover={{ scale: 1.01 }}
              className="border border-[hsl(30,15%,87%)] rounded-lg p-4 space-y-3"
            >
              <div>
                <p className="text-xs font-semibold text-[hsl(25,40%,18%)]">{test.page}</p>
                {test.winner ? (
                  <span className="text-[10px] text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full font-medium">Variant {test.winner} Winning</span>
                ) : (
                  <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-full font-medium">Running</span>
                )}
              </div>
              {[test.variantA, test.variantB].map((v, idx) => (
                <div key={idx} className={cn("p-3 rounded-lg", test.winner === (idx === 0 ? "A" : "B") ? "bg-green-50 border border-green-200" : "bg-[hsl(36,33%,94%)]")}>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium text-[hsl(25,40%,18%)]">Variant {idx === 0 ? "A" : "B"}</span>
                    <span className="text-sm font-bold text-[hsl(25,62%,25%)]">{v.cr} CR</span>
                  </div>
                  <p className="text-[10px] text-[hsl(25,20%,50%)] mt-0.5">{v.label}</p>
                  <p className="text-[10px] text-[hsl(25,20%,50%)]">{v.visitors.toLocaleString()} visitors</p>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
