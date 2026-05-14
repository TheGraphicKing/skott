// /Users/navaneethakrishnan/Desktop/skott/app/brand-design/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  Plus,
  X,
  ChevronRight,
  User,
  Calendar,
  Palette,
  Layout,
  FileImage,
  PenTool,
  RotateCcw,
  Send,
  MessageSquare,
} from "lucide-react";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { MetricCard } from "@/components/shared/MetricCard";
import { AIRecommendations } from "@/components/shared/AIRecommendations";
import { designRequests } from "@/data/mock";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterTab = "All" | "In Progress" | "In QC" | "Review" | "Approved" | "Queued";
const FILTER_TABS: FilterTab[] = ["All", "In Progress", "In QC", "Review", "Approved", "Queued"];

// ─── Status chip config ────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  "In Progress": { color: "text-[hsl(217,91%,50%)]",  bg: "bg-[hsl(217,91%,60%)]/10" },
  "In QC":       { color: "text-[hsl(258,78%,48%)]",  bg: "bg-[hsl(258,78%,60%)]/10" },
  "Review":      { color: "text-[hsl(38,92%,40%)]",   bg: "bg-[hsl(38,92%,50%)]/10" },
  "Approved":    { color: "text-[hsl(142,71%,35%)]",  bg: "bg-[hsl(142,71%,45%)]/10" },
  "Queued":      { color: "text-[hsl(25,20%,45%)]",   bg: "bg-[hsl(25,20%,60%)]/10" },
};

// ─── QC checks ────────────────────────────────────────────────────────────────
const QC_CHECKS = [
  { label: "Colour Palette",        result: "PASS" as const },
  { label: "Contrast Ratio WCAG AA",result: "PASS" as const },
  { label: "Visual Hierarchy",      result: "PASS" as const },
  { label: "Spacing / Alignment",   result: "PASS" as const },
  { label: "Font Consistency",      result: "PASS" as const },
  { label: "Tonality",              result: "FLAGGED" as const },
];

// ─── Template library ─────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: "t1", name: "LinkedIn Post",         type: "Social Creative", icon: Layout },
  { id: "t2", name: "Event Deck",            type: "Presentation",    icon: PenTool },
  { id: "t3", name: "Ad Creative Set",       type: "Ad Creative",     icon: FileImage },
  { id: "t4", name: "Playbook Cover",        type: "Document",        icon: Palette },
];

// ─── Capacity bar ────────────────────────────────────────────────────────────
function CapacityBar({ name, current, max }: { name: string; current: number; max: number }) {
  const pct = (current / max) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[hsl(25,62%,25%)] flex items-center justify-center text-[hsl(36,33%,94%)] text-[10px] font-[700]">
            {name[0]}
          </div>
          <span className="font-[500] text-[hsl(25,40%,18%)]">{name}</span>
        </div>
        <span className="text-[hsl(25,20%,45%)]">{current}/{max} requests</span>
      </div>
      <div className="h-2 bg-[hsl(30,15%,88%)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", pct > 80 ? "bg-[hsl(0,84%,55%)]" : "bg-[hsl(25,62%,25%)]")}
        />
      </div>
    </div>
  );
}

// ─── Request form (inline modal) ──────────────────────────────────────────────
function RequestForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ title: "", requester: "", type: "", brief: "", templateUsed: false, dueDate: "" });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30"
    >
      <div className="w-full max-w-lg rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-[600] text-[hsl(25,40%,18%)]">Submit Design Request</h3>
          <button onClick={onClose} className="text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)]"><X size={16} /></button>
        </div>

        {[
          { label: "Request Title", key: "title", placeholder: "e.g. Q2 LinkedIn Banner Set" },
          { label: "Requester",     key: "requester", placeholder: "Your name or team" },
          { label: "Type",          key: "type",  placeholder: "Social Creative / Presentation / Ad Creative…" },
        ].map(({ label, key, placeholder }) => (
          <div key={key} className="space-y-1">
            <label className="text-[11px] uppercase tracking-widest text-[hsl(25,20%,45%)] font-[500]">{label}</label>
            <input
              value={form[key as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              className="w-full text-sm px-3 py-2 rounded-lg border border-[hsl(30,15%,85%)] bg-white/60 text-[hsl(25,40%,18%)] placeholder:text-[hsl(25,20%,55%)] focus:outline-none focus:ring-1 focus:ring-[hsl(25,62%,25%)]"
            />
          </div>
        ))}

        <div className="space-y-1">
          <label className="text-[11px] uppercase tracking-widest text-[hsl(25,20%,45%)] font-[500]">Brief</label>
          <textarea
            rows={3}
            value={form.brief}
            onChange={(e) => setForm({ ...form, brief: e.target.value })}
            placeholder="Describe the design needs, context, and goals…"
            className="w-full text-sm px-3 py-2 rounded-lg border border-[hsl(30,15%,85%)] bg-white/60 text-[hsl(25,40%,18%)] placeholder:text-[hsl(25,20%,55%)] focus:outline-none focus:ring-1 focus:ring-[hsl(25,62%,25%)] resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-[hsl(25,40%,18%)] cursor-pointer">
            <input type="checkbox" checked={form.templateUsed} onChange={(e) => setForm({ ...form, templateUsed: e.target.checked })}
              className="rounded border-[hsl(30,15%,85%)]" />
            Template used
          </label>
          <div className="space-y-1">
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="text-sm px-3 py-2 rounded-lg border border-[hsl(30,15%,85%)] bg-white/60 text-[hsl(25,40%,18%)] focus:outline-none focus:ring-1 focus:ring-[hsl(25,62%,25%)]" />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-[hsl(30,15%,85%)] text-sm text-[hsl(25,20%,45%)] hover:bg-[hsl(30,15%,90%)]">
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-sm font-[600] text-[hsl(36,33%,94%)] flex items-center justify-center gap-1.5 hover:bg-[hsl(25,62%,20%)]">
            <Send size={13} /> Submit Request
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function BrandDesignPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [showForm, setShowForm] = useState(false);
  const [flaggedNote, setFlaggedNote] = useState("");

  const filtered = activeTab === "All"
    ? designRequests
    : designRequests.filter((r) => r.status === activeTab);

  return (
    <>
      <AnimatePresence>
        {showForm && <RequestForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>

      <div className="p-6 space-y-8">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-[700] text-[hsl(25,40%,18%)]">Brand Design</h1>
            <p className="text-sm text-[hsl(25,20%,45%)] mt-0.5">Design request queue, Brand QC reviews, and template library</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[hsl(25,20%,45%)]">Brand QC Agent</span>
              <AgentStatusBadge status="active" />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-sm font-[600] hover:bg-[hsl(25,62%,20%)] transition-colors"
            >
              <Plus size={14} /> Submit Request
            </button>
          </div>
        </div>

        {/* ── Metrics ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Requests This Week" value="14"      trend={17}  trendLabel="WoW" />
          <MetricCard label="QC Pass Rate"        value="87%"    trend={-2}  trendLabel="WoW" />
          <MetricCard label="Avg Turnaround"      value="1.2d"   trend={-8}  trendLabel="WoW" />
          <MetricCard label="Revisions Needed"    value="2"      trend={0}   trendLabel="stable" />
        </div>

        {/* ── Designer capacity ────────────────────────────────────────────── */}
        <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)]">
          <h2 className="font-[600] text-sm text-[hsl(25,40%,18%)] mb-4">Designer Capacity</h2>
          <div className="grid grid-cols-2 gap-6">
            <CapacityBar name="Priya" current={4} max={6} />
            <CapacityBar name="Raj"   current={3} max={6} />
          </div>
        </div>

        {/* ── Main grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-6">
          {/* ── Request Queue ──────────────────────────────────────────────── */}
          <div className="col-span-2 space-y-4">
            <h2 className="font-[600] text-[hsl(25,40%,18%)]">Design Request Queue</h2>

            {/* Filter tabs */}
            <div className="flex gap-1 p-1 rounded-lg bg-[hsl(30,15%,90%)] w-fit">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-[500] transition-all",
                    activeTab === tab
                      ? "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)]"
                      : "text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[hsl(30,15%,91%)] text-[10px] uppercase tracking-widest text-[hsl(25,20%,45%)]">
                    {["Request", "Type", "Status", "Designer", "Due", "Brand Score", "Rev."].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left font-[600]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req, i) => {
                    const sc = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.Queued;
                    return (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-t border-[hsl(30,15%,88%)] bg-[hsl(36,30%,96%)] hover:bg-[hsl(30,15%,93%)] transition-colors"
                      >
                        <td className="px-3 py-3">
                          <p className="font-[500] text-[hsl(25,40%,18%)] text-xs leading-snug">{req.title}</p>
                          <p className="text-[10px] text-[hsl(25,20%,50%)]">{req.requester}</p>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(25,20%,60%)]/10 text-[hsl(25,20%,45%)] font-[500]">{req.type}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-[600]", sc.bg, sc.color)}>{req.status}</span>
                        </td>
                        <td className="px-3 py-3">
                          {req.designer
                            ? <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-[hsl(25,62%,25%)] flex items-center justify-center text-[hsl(36,33%,94%)] text-[9px] font-[700]">
                                  {req.designer[0]}
                                </div>
                                <span className="text-xs text-[hsl(25,40%,18%)]">{req.designer}</span>
                              </div>
                            : <span className="text-xs text-[hsl(25,20%,55%)]">—</span>
                          }
                        </td>
                        <td className="px-3 py-3 text-xs text-[hsl(25,20%,45%)]">{req.dueDate}</td>
                        <td className="px-3 py-3">
                          {req.brandScore !== null
                            ? <span className={cn("text-xs font-[600]", req.brandScore >= 95 ? "text-[hsl(142,71%,35%)]" : req.brandScore >= 85 ? "text-[hsl(38,92%,40%)]" : "text-[hsl(0,84%,55%)]")}>
                                {req.brandScore}/100
                              </span>
                            : <span className="text-xs text-[hsl(25,20%,55%)]">—</span>
                          }
                        </td>
                        <td className="px-3 py-3">
                          <span className={cn("text-xs font-[600]", req.revisions > 1 ? "text-[hsl(0,84%,55%)]" : "text-[hsl(25,40%,18%)]")}>
                            {req.revisions}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Right panel ────────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Brand QC Review */}
            <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)] space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[hsl(142,71%,35%)]" />
                <h3 className="font-[600] text-sm text-[hsl(25,40%,18%)]">Brand QC Review</h3>
              </div>
              <p className="text-[10px] text-[hsl(25,20%,45%)]">Lyzr Architect Launch Banner Set</p>

              <div className="space-y-2">
                {QC_CHECKS.map((check) => (
                  <div key={check.label}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[hsl(25,40%,18%)]">{check.label}</span>
                      {check.result === "PASS"
                        ? <span className="text-[10px] font-[600] text-[hsl(142,71%,35%)] flex items-center gap-1"><CheckCircle2 size={11} /> PASS</span>
                        : <span className="text-[10px] font-[600] text-[hsl(38,92%,40%)] flex items-center gap-1"><AlertTriangle size={11} /> FLAGGED</span>
                      }
                    </div>
                    {check.result === "FLAGGED" && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        className="mt-1.5 space-y-1.5"
                      >
                        <textarea
                          rows={2}
                          value={flaggedNote}
                          onChange={(e) => setFlaggedNote(e.target.value)}
                          placeholder="Add override note…"
                          className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-[hsl(38,92%,50%)] bg-[hsl(38,92%,50%)]/5 text-[hsl(25,40%,18%)] placeholder:text-[hsl(25,20%,55%)] focus:outline-none resize-none"
                        />
                        <button className="flex items-center gap-1 text-[10px] text-[hsl(38,92%,40%)] font-[600] hover:underline">
                          <RotateCcw size={10} /> Override with note
                        </button>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Template library */}
            <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)] space-y-3">
              <h3 className="font-[600] text-sm text-[hsl(25,40%,18%)]">Template Library</h3>
              <div className="space-y-2">
                {TEMPLATES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[hsl(30,15%,90%)]">
                      <Icon size={14} className="text-[hsl(25,62%,25%)]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-[500] text-[hsl(25,40%,18%)]">{t.name}</p>
                        <p className="text-[10px] text-[hsl(25,20%,45%)]">{t.type}</p>
                      </div>
                      <button className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] font-[600] hover:bg-[hsl(25,62%,20%)]">
                        <Download size={10} /> Download
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <AIRecommendations page="brand-design" />
      </div>
    </>
  );
}
