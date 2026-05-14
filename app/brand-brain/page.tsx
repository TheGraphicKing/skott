// /Users/navaneethakrishnan/Desktop/skott/app/brand-brain/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  FileText,
  BarChart2,
  Users,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  Target,
  Shield,
  Globe,
  Zap,
  RefreshCw,
  Plus,
  ChevronRight,
  Tag,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const P = "hsl(25,62%,25%)";
const MUTED = "hsl(25,20%,50%)";
const CARD = "hsl(36,30%,97%)";
const BORDER = "hsl(30,15%,87%)";
const PAGE_BG = "hsl(36,33%,94%)";
const GREEN = "hsl(142,55%,35%)";
const AMBER = "#d97706";
const BLUE = "#2563eb";
const DARK_TEXT = "#3a1f0e";

// ─── Knowledge Items ──────────────────────────────────────────────────────────
type KnowledgeType = "Brand" | "Campaign" | "Market Intel" | "Competitor" | "Docs";

interface KnowledgeItem {
  id: number;
  title: string;
  type: KnowledgeType;
  words: string;
  updated: string;
  usedTimes: number;
  tags: string[];
  icon: "file" | "chart" | "brain" | "shield" | "globe";
}

const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  { id: 1,  title: "Brand Guidelines v3.2",                type: "Brand",       words: "4,200",  updated: "Apr 2026", usedTimes: 847,   tags: ["voice", "visual", "core"],          icon: "brain"  },
  { id: 2,  title: "Messaging Framework Q2 2026",          type: "Brand",       words: "2,100",  updated: "May 2026", usedTimes: 423,   tags: ["messaging", "q2", "positioning"],   icon: "file"   },
  { id: 3,  title: "Founder Voice: CEO Podcast Transcripts", type: "Brand",     words: "18,400", updated: "Mar 2026", usedTimes: 156,   tags: ["voice", "ceo", "podcast"],          icon: "brain"  },
  { id: 4,  title: "Q1 2026 Campaign Learnings",           type: "Campaign",    words: "3,800",  updated: "Apr 2026", usedTimes: 312,   tags: ["q1", "campaigns", "learnings"],     icon: "chart"  },
  { id: 5,  title: "Enterprise Buyer Persona Research",    type: "Market Intel",words: "5,200",  updated: "Feb 2026", usedTimes: 634,   tags: ["persona", "enterprise", "icp"],     icon: "globe"  },
  { id: 6,  title: "Competitor Analysis: HubSpot vs Us",   type: "Competitor",  words: "2,800",  updated: "May 2026", usedTimes: 847,   tags: ["hubspot", "competitive", "intel"],  icon: "shield" },
  { id: 7,  title: "ICP Definition & Segmentation",        type: "Brand",       words: "1,600",  updated: "Jan 2026", usedTimes: 1247,  tags: ["icp", "segments", "targeting"],     icon: "brain"  },
  { id: 8,  title: "Product Positioning v4",               type: "Brand",       words: "3,100",  updated: "May 2026", usedTimes: 634,   tags: ["positioning", "product", "gtm"],    icon: "file"   },
  { id: 9,  title: "SEO Strategy & Keyword Map Q2",        type: "Market Intel",words: "4,800",  updated: "Apr 2026", usedTimes: 423,   tags: ["seo", "keywords", "q2"],            icon: "chart"  },
  { id: 10, title: "Email Templates Library",              type: "Campaign",    words: "8,200",  updated: "May 2026", usedTimes: 2108,  tags: ["email", "templates", "nurture"],    icon: "file"   },
  { id: 11, title: "PR & Media Contacts Database",         type: "Docs",        words: "1,400",  updated: "Mar 2026", usedTimes: 89,    tags: ["pr", "media", "contacts"],          icon: "globe"  },
  { id: 12, title: "Customer Case Studies (12)",           type: "Campaign",    words: "24,000", updated: "Apr 2026", usedTimes: 312,   tags: ["case-studies", "social-proof"],     icon: "brain"  },
];

const TABS = ["All", "Brand Guidelines", "Campaigns", "Competitors", "Market Intel", "Docs"] as const;
type Tab = typeof TABS[number];

const AGENT_FEED = [
  { agent: "CMO Strategy Agent",  action: "read",    doc: "Messaging Framework Q2",       time: "2m ago"  },
  { agent: "Content Agent",       action: "read",    doc: "Brand Voice: CEO Transcripts",  time: "15m ago" },
  { agent: "SEO Agent",           action: "read",    doc: "SEO Strategy & Keyword Map",    time: "32m ago" },
  { agent: "Campaign Agent",      action: "updated", doc: "Q1 2026 Campaign Learnings",    time: "1h ago"  },
  { agent: "Competitor Agent",    action: "read",    doc: "Competitor Analysis: HubSpot",  time: "1h ago"  },
  { agent: "Persona Agent",       action: "read",    doc: "Enterprise Buyer Persona",      time: "2h ago"  },
  { agent: "Email Agent",         action: "read",    doc: "Email Templates Library",       time: "2h ago"  },
  { agent: "Content Agent",       action: "read",    doc: "Brand Guidelines v3.2",         time: "3h ago"  },
];

const TYPE_COLORS: Record<KnowledgeType, { bg: string; text: string }> = {
  Brand:       { bg: "hsl(25,62%,92%)",  text: P       },
  Campaign:    { bg: "#dbeafe",           text: BLUE    },
  "Market Intel": { bg: "#d1fae5",        text: GREEN   },
  Competitor:  { bg: "#fee2e2",           text: "#dc2626" },
  Docs:        { bg: "hsl(30,20%,90%)",   text: MUTED   },
};

function typeFilter(item: KnowledgeItem, tab: Tab): boolean {
  if (tab === "All") return true;
  if (tab === "Brand Guidelines") return item.type === "Brand";
  if (tab === "Campaigns") return item.type === "Campaign";
  if (tab === "Competitors") return item.type === "Competitor";
  if (tab === "Market Intel") return item.type === "Market Intel";
  if (tab === "Docs") return item.type === "Docs";
  return true;
}

function ItemIcon({ icon }: { icon: KnowledgeItem["icon"] }) {
  const cls = "w-4 h-4";
  if (icon === "chart")  return <BarChart2 className={cls} />;
  if (icon === "shield") return <Shield className={cls} />;
  if (icon === "globe")  return <Globe className={cls} />;
  if (icon === "brain")  return <Brain className={cls} />;
  return <FileText className={cls} />;
}

// ─── Training bar ─────────────────────────────────────────────────────────────
function TrainBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs" style={{ color: MUTED }}>
        <span>{label}</span>
        <span style={{ color: DARK_TEXT, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: BORDER }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: pct >= 90 ? GREEN : pct >= 80 ? AMBER : BLUE }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ─── Tone bar (CSS only) ──────────────────────────────────────────────────────
function ToneBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-2 text-xs" style={{ color: MUTED }}>
      <span className="w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: BORDER }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: P }} />
      </div>
      <span className="w-6 text-right" style={{ color: DARK_TEXT }}>{pct}%</span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BrandBrainPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const filtered = KNOWLEDGE_ITEMS.filter((item) => typeFilter(item, activeTab));

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ background: PAGE_BG }}>
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-6 h-6" style={{ color: P }} />
          <h1 className="text-2xl font-bold" style={{ color: DARK_TEXT }}>Brand Brain</h1>
        </div>
        <p className="text-sm" style={{ color: MUTED }}>
          Centralized AI memory — brand guidelines, campaign learnings & market intelligence
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Knowledge Items", value: "2,847",  icon: <BookOpen className="w-5 h-5" /> },
          { label: "Brand Voice",     value: "Trained", icon: <CheckCircle2 className="w-5 h-5" />, badge: true },
          { label: "Agents Using Brain", value: "6",   icon: <Zap className="w-5 h-5" /> },
          { label: "Last Updated",    value: "2h ago",  icon: <Clock className="w-5 h-5" /> },
        ].map((kpi) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 border"
            style={{ background: CARD, borderColor: BORDER }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: MUTED }}>{kpi.label}</span>
              <span style={{ color: P }}>{kpi.icon}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold" style={{ color: DARK_TEXT }}>{kpi.value}</span>
              {kpi.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "#d1fae5", color: GREEN }}>Live</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Left: Knowledge Library (60%) */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="rounded-2xl border p-5" style={{ background: CARD, borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-base" style={{ color: DARK_TEXT }}>Knowledge Library</h2>
              <span className="text-xs" style={{ color: MUTED }}>{KNOWLEDGE_ITEMS.length} items</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 flex-wrap mb-4">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: activeTab === tab ? P : "transparent",
                    color: activeTab === tab ? "#fff" : MUTED,
                    border: `1px solid ${activeTab === tab ? P : BORDER}`,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Items */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => {
                  const colors = TYPE_COLORS[item.type];
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:shadow-sm"
                      style={{ borderColor: BORDER, background: "#fff" }}
                      whileHover={{ borderColor: P }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: colors.bg, color: colors.text }}>
                        <ItemIcon icon={item.icon} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium truncate" style={{ color: DARK_TEXT }}>{item.title}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0"
                            style={{ background: colors.bg, color: colors.text }}>{item.type}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs flex-wrap" style={{ color: MUTED }}>
                          <span>{item.words} words</span>
                          <span>·</span>
                          <span>Updated {item.updated}</span>
                          <span>·</span>
                          <span style={{ color: P, fontWeight: 600 }}>Used {item.usedTimes.toLocaleString()}× by agents</span>
                        </div>
                        <div className="flex gap-1 flex-wrap mt-1.5">
                          {item.tags.map((tag) => (
                            <span key={tag} className="text-xs px-1.5 py-0.5 rounded"
                              style={{ background: PAGE_BG, color: MUTED }}>#{tag}</span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0 mt-1" style={{ color: MUTED }} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Upload area */}
            <div className="mt-4 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-opacity-80"
              style={{ borderColor: BORDER }}>
              <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: MUTED }} />
              <p className="font-medium text-sm" style={{ color: DARK_TEXT }}>Upload Brand Documents</p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>PDF, DOCX, TXT, MD, CSV — up to 50MB each</p>
            </div>
          </div>
        </div>

        {/* Right: Brain Status (40%) */}
        <div className="w-80 xl:w-96 shrink-0 space-y-4">

          {/* Brand Voice Analysis */}
          <div className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BORDER }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: DARK_TEXT }}>Brand Voice Analysis</h3>
            <div className="space-y-2 text-xs mb-3">
              <div className="flex justify-between">
                <span style={{ color: MUTED }}>Tone</span>
                <span className="font-medium" style={{ color: DARK_TEXT }}>Professional · Bold · Data-driven</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: MUTED }}>Voice Match Score</span>
                <span className="font-bold text-sm" style={{ color: GREEN }}>94%</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: MUTED }}>Reading Level</span>
                <span className="font-medium" style={{ color: DARK_TEXT }}>Professional (Grade 14)</span>
              </div>
              <div>
                <span style={{ color: MUTED }}>Top Terms: </span>
                <span style={{ color: DARK_TEXT }}>AI agents · marketing ROI · enterprise efficiency</span>
              </div>
            </div>
            <p className="text-xs font-medium mb-2" style={{ color: MUTED }}>Tone Consistency</p>
            <div className="space-y-1.5">
              <ToneBar label="Professional" pct={92} />
              <ToneBar label="Bold"         pct={85} />
              <ToneBar label="Data-driven"  pct={78} />
              <ToneBar label="Empathetic"   pct={61} />
            </div>
          </div>

          {/* Agent Memory Feed */}
          <div className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BORDER }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: DARK_TEXT }}>Agent Memory Feed</h3>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {AGENT_FEED.map((entry, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: P }} />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium" style={{ color: DARK_TEXT }}>{entry.agent}</span>
                    <span style={{ color: MUTED }}> {entry.action} </span>
                    <span className="font-medium" style={{ color: P }}>'{entry.doc}'</span>
                  </div>
                  <span className="shrink-0" style={{ color: MUTED }}>{entry.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Gap Alerts */}
          <div className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BORDER }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: DARK_TEXT }}>Knowledge Gap Alerts</h3>
            <div className="space-y-2">
              {[
                { msg: "Q3 Campaign Strategy not uploaded",          action: "Upload",  actionColor: BLUE  },
                { msg: "Competitor: Marketo analysis outdated (6m)", action: "Refresh", actionColor: AMBER },
                { msg: "No product launch brief for June release",   action: "Create",  actionColor: GREEN },
              ].map((alert, i) => (
                <div key={i} className="flex items-center justify-between gap-2 p-2.5 rounded-lg"
                  style={{ background: "#fff7ed", border: `1px solid #fed7aa` }}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: AMBER }} />
                    <span className="text-xs" style={{ color: DARK_TEXT }}>{alert.msg}</span>
                  </div>
                  <button className="text-xs font-semibold shrink-0 hover:underline"
                    style={{ color: alert.actionColor }}>{alert.action}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Training Status */}
          <div className="rounded-2xl border p-4" style={{ background: CARD, borderColor: BORDER }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: DARK_TEXT }}>Training Status</h3>
            <div className="space-y-3">
              <TrainBar label="Brand Voice Model"           pct={94} />
              <TrainBar label="Campaign Learning Model"     pct={87} />
              <TrainBar label="Competitor Intelligence"     pct={76} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: P }}>
              Upload Knowledge
            </button>
            <button className="w-full py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-white"
              style={{ color: P, borderColor: P }}>
              Train Brand Brain
            </button>
            <button className="w-full py-2.5 rounded-xl text-sm font-medium border transition-all hover:bg-white"
              style={{ color: MUTED, borderColor: BORDER }}>
              Export Memory Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
