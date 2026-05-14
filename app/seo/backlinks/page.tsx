"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  AlertTriangle,
  CheckCircle2,
  Send,
  Eye,
  X,
  ExternalLink,
  Mail,
  Shield,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

// ─── Types ────────────────────────────────────────────────────────────────────
type ProspectStatus = "Prospect" | "Outreach Sent" | "Replied" | "Accepted" | "Published" | "Rejected";
type LinkType = "Guest Post" | "Resource Page" | "Broken Link" | "Partnership";
type FilterTab = "All" | "Prospect" | "Outreach Sent" | "Accepted" | "Published";

interface Prospect {
  id: number;
  domain: string;
  dr: number;
  type: LinkType;
  opportunityScore: number;
  status: ProspectStatus;
  contact: string;
  lastActivity: string;
  emailPreview: string;
}

interface RecentBacklink {
  id: number;
  domain: string;
  da: number;
  anchor: string;
  linkedTo: string;
  date: string;
}

interface ToxicLink {
  id: number;
  domain: string;
  reason: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PROSPECTS: Prospect[] = [
  { id: 1, domain: "techcrunch.com", dr: 93, type: "Guest Post", opportunityScore: 9.4, status: "Outreach Sent", contact: "editors@techcrunch.com", lastActivity: "2 days ago", emailPreview: "Hi Sarah, I noticed TechCrunch has been covering AI-driven marketing extensively. I'd love to contribute a piece on agentic marketing workflows — a topic your readers are actively searching for, with 40K monthly searches and rising intent..." },
  { id: 2, domain: "hubspot.com", dr: 91, type: "Resource Page", opportunityScore: 9.1, status: "Replied", contact: "content@hubspot.com", lastActivity: "1 day ago", emailPreview: "Hi James, Your marketing automation resources page is excellent. We've built a comprehensive guide on AI agent orchestration that would complement your existing resources perfectly. Our guide already has 200+ natural backlinks..." },
  { id: 3, domain: "semrush.com", dr: 88, type: "Partnership", opportunityScore: 8.7, status: "Accepted", contact: "partnerships@semrush.com", lastActivity: "3 days ago", emailPreview: "Hi Elena, I'm reaching out about a potential content partnership. Our AI marketing platform and SEMrush serve overlapping audiences — we see an opportunity for mutual guest posts and co-created research reports..." },
  { id: 4, domain: "contentmarketinginstitute.com", dr: 79, type: "Guest Post", opportunityScore: 8.3, status: "Prospect", contact: "submissions@cmi.com", lastActivity: "5 days ago", emailPreview: "Hi Robert, CMI is the gold standard for content marketing education. I'd like to propose a piece on 'How AI agents are rewriting the content marketing playbook' — backed by data from our platform's 500+ users..." },
  { id: 5, domain: "searchengineland.com", dr: 82, type: "Broken Link", opportunityScore: 8.0, status: "Prospect", contact: "editor@sel.com", lastActivity: "1 week ago", emailPreview: "Hi Amanda, I found a broken link on your guide to marketing automation tools — the link to [old-tool.com/guide] returns a 404. We have an up-to-date resource that covers the same topic and more..." },
  { id: 6, domain: "moz.com", dr: 90, type: "Resource Page", opportunityScore: 9.0, status: "Published", contact: "community@moz.com", lastActivity: "2 weeks ago", emailPreview: "Hi Rand, Your SEO learning hub is the first resource I recommend to every marketer. I'd love for our AI SEO guide to be considered for your tools and resources page..." },
  { id: 7, domain: "ahrefs.com", dr: 89, type: "Partnership", opportunityScore: 8.8, status: "Rejected", contact: "tim@ahrefs.com", lastActivity: "3 weeks ago", emailPreview: "Hi Tim, Ahrefs and our platform are used by the same growth-focused marketers. I'd like to explore a co-marketing arrangement — shared blog posts, joint webinars, and newsletter swaps..." },
  { id: 8, domain: "neilpatel.com", dr: 83, type: "Guest Post", opportunityScore: 7.9, status: "Outreach Sent", contact: "hello@neilpatel.com", lastActivity: "4 days ago", emailPreview: "Hi Neil, Your blog reaches millions of marketers every month. I'd like to contribute a post on how agentic AI is replacing traditional marketing automation — a topic trending hard right now..." },
  { id: 9, domain: "marketingprofs.com", dr: 74, type: "Guest Post", opportunityScore: 7.5, status: "Prospect", contact: "content@mprofs.com", lastActivity: "1 week ago", emailPreview: "Hi Anne, MarketingProfs readers are sophisticated practitioners who appreciate tactical depth. I have a data-driven piece on AI-driven content personalization that I believe would resonate strongly..." },
  { id: 10, domain: "copyblogger.com", dr: 77, type: "Resource Page", opportunityScore: 7.2, status: "Replied", contact: "editor@copyblogger.com", lastActivity: "2 days ago", emailPreview: "Hi Sonia, Copyblogger's content marketing resources have helped thousands of writers. Our guide on AI content workflows could be a natural addition to your strategy resources page..." },
];

const RECENT_BACKLINKS: RecentBacklink[] = [
  { id: 1, domain: "moz.com", da: 90, anchor: "AI marketing automation platform", linkedTo: "/blog/ai-marketing-guide", date: "May 12, 2026" },
  { id: 2, domain: "searchenginejournal.com", da: 79, anchor: "agentic marketing workflows", linkedTo: "/features/agents", date: "May 10, 2026" },
  { id: 3, domain: "marketingland.com", da: 73, anchor: "Skott AI platform", linkedTo: "/", date: "May 8, 2026" },
  { id: 4, domain: "growthhackers.com", da: 68, anchor: "marketing orchestration tool", linkedTo: "/blog/orchestration", date: "May 6, 2026" },
  { id: 5, domain: "producthunt.com", da: 88, anchor: "featured product", linkedTo: "/", date: "May 3, 2026" },
];

const TOXIC_LINKS: ToxicLink[] = [
  { id: 1, domain: "spammy-seo-links.biz", reason: "Low quality link farm, spam score 94" },
  { id: 2, domain: "free-backlinks-bot.ru", reason: "Automated link injection, irrelevant niche" },
];

const VELOCITY_DATA = [
  { week: "W1", links: 4 }, { week: "W2", links: 7 }, { week: "W3", links: 5 },
  { week: "W4", links: 11 }, { week: "W5", links: 9 }, { week: "W6", links: 14 },
  { week: "W7", links: 12 }, { week: "W8", links: 18 }, { week: "W9", links: 15 },
  { week: "W10", links: 21 }, { week: "W11", links: 19 }, { week: "W12", links: 24 },
];

const FILTER_TABS: FilterTab[] = ["All", "Prospect", "Outreach Sent", "Accepted", "Published"];

const STATUS_COLORS: Record<ProspectStatus, string> = {
  "Prospect": "bg-gray-100 text-gray-600",
  "Outreach Sent": "bg-blue-100 text-blue-700",
  "Replied": "bg-yellow-100 text-yellow-700",
  "Accepted": "bg-green-100 text-green-700",
  "Published": "bg-[hsl(25,62%,25%)]/10 text-[hsl(25,62%,25%)]",
  "Rejected": "bg-red-100 text-red-600",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function BacklinksPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  const filtered = activeFilter === "All"
    ? PROSPECTS
    : PROSPECTS.filter((p) => p.status === activeFilter);

  const kpis = [
    { label: "Total Backlinks", value: "847", icon: <Link2 className="w-5 h-5" />, delta: "+12 this week" },
    { label: "New This Month", value: "+34", icon: <CheckCircle2 className="w-5 h-5" />, delta: "vs +21 last month" },
    { label: "Domain Rating", value: "52", icon: <Shield className="w-5 h-5" />, delta: "+4 this month" },
    { label: "Referring Domains", value: "284", icon: <ExternalLink className="w-5 h-5" />, delta: "+18 this month" },
  ];

  return (
    <div className="min-h-screen bg-[hsl(36,33%,94%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[hsl(25,40%,18%)]">Backlink Builder Agent</h1>
        <AgentStatusBadge status="active" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[hsl(25,20%,50%)] text-xs">{k.label}</span>
              <span className="text-[hsl(25,62%,25%)]">{k.icon}</span>
            </div>
            <p className="text-2xl font-bold text-[hsl(25,40%,18%)]">{k.value}</p>
            <p className="text-xs text-green-600 mt-1">{k.delta}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Panel */}
      <div className="flex gap-5">
        {/* Prospect Table */}
        <div className="flex-1 bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[hsl(30,15%,87%)] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Link Prospects</h2>
            <div className="flex gap-2">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                    activeFilter === tab
                      ? "bg-[hsl(25,62%,25%)] text-white"
                      : "bg-[hsl(36,33%,94%)] text-[hsl(25,20%,50%)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[hsl(30,15%,87%)] text-[hsl(25,20%,50%)]">
                  {["Domain", "DR", "Type", "Score", "Status", "Contact", "Last Activity", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, i) => (
                    <motion.tr
                      key={p.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-[hsl(30,15%,87%)] hover:bg-[hsl(36,33%,94%)] cursor-pointer"
                      onClick={() => setSelectedProspect(p)}
                    >
                      <td className="px-4 py-2.5 font-medium text-[hsl(25,40%,18%)]">{p.domain}</td>
                      <td className="px-4 py-2.5">
                        <span className="font-bold text-[hsl(25,62%,25%)]">{p.dr}</span>
                      </td>
                      <td className="px-4 py-2.5 text-[hsl(25,20%,50%)]">{p.type}</td>
                      <td className="px-4 py-2.5">
                        <span className="font-bold text-[hsl(25,40%,18%)]">{p.opportunityScore}</span>
                        <span className="text-[hsl(25,20%,50%)]">/10</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[hsl(25,20%,50%)] max-w-[120px] truncate">{p.contact}</td>
                      <td className="px-4 py-2.5 text-[hsl(25,20%,50%)]">{p.lastActivity}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedProspect(p)}
                            className="p-1 hover:bg-[hsl(30,15%,87%)] rounded"
                          >
                            <Eye className="w-3.5 h-3.5 text-[hsl(25,20%,50%)]" />
                          </button>
                          {p.status === "Prospect" && (
                            <button className="p-1 bg-[hsl(25,62%,25%)] rounded">
                              <Mail className="w-3.5 h-3.5 text-white" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Preview Panel */}
        <AnimatePresence>
          {selectedProspect && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className="w-80 bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-4 space-y-3 flex-shrink-0"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Outreach Email</h3>
                <button onClick={() => setSelectedProspect(null)}>
                  <X className="w-4 h-4 text-[hsl(25,20%,50%)]" />
                </button>
              </div>
              <div className="text-[10px] text-[hsl(25,20%,50%)]">To: {selectedProspect.contact}</div>
              <div className="text-[10px] text-[hsl(25,20%,50%)]">Domain: <strong className="text-[hsl(25,40%,18%)]">{selectedProspect.domain}</strong> (DR {selectedProspect.dr})</div>
              <textarea
                defaultValue={selectedProspect.emailPreview}
                className="w-full h-44 text-[11px] bg-[hsl(36,33%,94%)] border border-[hsl(30,15%,87%)] rounded-lg p-3 text-[hsl(25,40%,18%)] resize-none focus:outline-none focus:ring-1 focus:ring-[hsl(25,62%,25%)]"
              />
              <button className="w-full bg-[hsl(25,62%,25%)] text-white text-xs py-2 rounded-lg flex items-center justify-center gap-2 font-medium">
                <Send className="w-3.5 h-3.5" /> Approve & Send
              </button>
              <p className="text-[10px] text-[hsl(25,20%,50%)] text-center">Human-in-the-loop approval required</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Recent Backlinks */}
        <div className="col-span-1 bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Recently Earned</h2>
          {RECENT_BACKLINKS.map((b) => (
            <div key={b.id} className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[hsl(25,40%,18%)]">{b.domain}</span>
                <span className="text-[10px] text-[hsl(25,62%,25%)] font-bold">DA {b.da}</span>
              </div>
              <p className="text-[11px] text-[hsl(25,20%,50%)] italic">&quot;{b.anchor}&quot;</p>
              <div className="flex items-center justify-between text-[10px] text-[hsl(25,20%,50%)]">
                <span>{b.linkedTo}</span>
                <span>{b.date}</span>
              </div>
              <div className="border-b border-[hsl(30,15%,87%)] pt-1" />
            </div>
          ))}
        </div>

        {/* Link Velocity Chart */}
        <div className="col-span-1 bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)] mb-3">Link Velocity (12 Weeks)</h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={VELOCITY_DATA}>
              <defs>
                <linearGradient id="linkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(25,62%,25%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(25,62%,25%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,87%)" />
              <XAxis dataKey="week" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="links" stroke="hsl(25,62%,25%)" fill="url(#linkGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Toxic Links */}
        <div className="col-span-1 bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Toxic Links Alert</h2>
          </div>
          {TOXIC_LINKS.map((t) => (
            <div key={t.id} className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
              <p className="text-xs font-medium text-red-700">{t.domain}</p>
              <p className="text-[11px] text-red-500">{t.reason}</p>
              <button className="flex items-center gap-1 text-[10px] bg-red-600 text-white px-2.5 py-1 rounded-lg font-medium">
                <Shield className="w-3 h-3" /> Disavow
              </button>
            </div>
          ))}
        </div>
      </div>
      <AIRecommendations page="backlinks" />
    </div>
  );
}
