"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  FileText,
  Zap,
  Target,
  ChevronRight,
  BarChart2,
  Sparkles,
} from "lucide-react";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

// ─── Types ────────────────────────────────────────────────────────────────────
type OpportunityTab = "All" | "Quick Wins" | "Content Gaps" | "Ranking Drops";
type ContentStatus = "Has Content" | "No Content" | "Needs Update";

interface Keyword {
  id: number;
  keyword: string;
  volume: number;
  difficulty: number;
  position: number | null;
  opportunityScore: number;
  contentStatus: ContentStatus;
}

interface Cluster {
  id: number;
  topic: string;
  keywords: string[];
  totalVolume: number;
}

interface ScatterPoint {
  keyword: string;
  volume: number;
  difficulty: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const KEYWORDS: Keyword[] = [
  { id: 1, keyword: "ai marketing automation", volume: 12400, difficulty: 68, position: 7, opportunityScore: 88, contentStatus: "Has Content" },
  { id: 2, keyword: "agentic AI marketing", volume: 8900, difficulty: 42, position: 14, opportunityScore: 94, contentStatus: "Has Content" },
  { id: 3, keyword: "marketing orchestration platform", volume: 5600, difficulty: 38, position: null, opportunityScore: 91, contentStatus: "No Content" },
  { id: 4, keyword: "autonomous marketing agent", volume: 6800, difficulty: 45, position: 19, opportunityScore: 89, contentStatus: "No Content" },
  { id: 5, keyword: "AI content generation B2B", volume: 9200, difficulty: 58, position: 11, opportunityScore: 83, contentStatus: "Needs Update" },
  { id: 6, keyword: "LLM marketing automation", volume: 4300, difficulty: 31, position: 6, opportunityScore: 87, contentStatus: "Has Content" },
  { id: 7, keyword: "marketing AI agents 2026", volume: 7100, difficulty: 29, position: 4, opportunityScore: 92, contentStatus: "Has Content" },
  { id: 8, keyword: "automated lead nurturing AI", volume: 5800, difficulty: 55, position: null, opportunityScore: 79, contentStatus: "No Content" },
  { id: 9, keyword: "AI SEO optimization tool", volume: 11000, difficulty: 72, position: 23, opportunityScore: 76, contentStatus: "Needs Update" },
  { id: 10, keyword: "personalized email AI", volume: 8400, difficulty: 63, position: 18, opportunityScore: 81, contentStatus: "Has Content" },
  { id: 11, keyword: "marketing workflow automation", volume: 6200, difficulty: 47, position: 9, opportunityScore: 84, contentStatus: "Has Content" },
  { id: 12, keyword: "AI campaign management", volume: 4700, difficulty: 36, position: null, opportunityScore: 90, contentStatus: "No Content" },
  { id: 13, keyword: "growth hacking AI tools", volume: 3900, difficulty: 28, position: 5, opportunityScore: 85, contentStatus: "Has Content" },
  { id: 14, keyword: "predictive marketing analytics", volume: 7800, difficulty: 61, position: 31, opportunityScore: 74, contentStatus: "Needs Update" },
  { id: 15, keyword: "AI copywriting platform", volume: 14200, difficulty: 77, position: null, opportunityScore: 70, contentStatus: "No Content" },
];

const CLUSTERS: Cluster[] = [
  {
    id: 1,
    topic: "Agentic Marketing",
    keywords: ["agentic AI marketing", "autonomous marketing agent", "marketing AI agents 2026", "AI campaign management"],
    totalVolume: 29800,
  },
  {
    id: 2,
    topic: "Marketing Automation",
    keywords: ["ai marketing automation", "marketing orchestration platform", "automated lead nurturing AI", "marketing workflow automation"],
    totalVolume: 30000,
  },
  {
    id: 3,
    topic: "AI Content & SEO",
    keywords: ["AI content generation B2B", "AI SEO optimization tool", "AI copywriting platform", "LLM marketing automation"],
    totalVolume: 38700,
  },
];

const SCATTER_POINTS: ScatterPoint[] = [
  { keyword: "agentic AI", volume: 89, difficulty: 42 },
  { keyword: "AI marketing", volume: 95, difficulty: 68 },
  { keyword: "LLM automation", volume: 55, difficulty: 31 },
  { keyword: "AI agents", volume: 80, difficulty: 45 },
  { keyword: "content AI B2B", volume: 75, difficulty: 58 },
  { keyword: "marketing AI 2026", volume: 70, difficulty: 29 },
  { keyword: "AI SEO", volume: 88, difficulty: 72 },
  { keyword: "email AI", volume: 72, difficulty: 63 },
  { keyword: "predictive analytics", volume: 68, difficulty: 61 },
  { keyword: "AI copywriting", volume: 98, difficulty: 77 },
  { keyword: "AI campaign mgmt", volume: 50, difficulty: 36 },
  { keyword: "growth AI", volume: 46, difficulty: 28 },
  { keyword: "lead nurture AI", value: 60, difficulty: 55 },
  { keyword: "workflow auto", volume: 62, difficulty: 47 },
  { keyword: "orchestration", volume: 58, difficulty: 38 },
  { keyword: "personalization AI", volume: 65, difficulty: 52 },
  { keyword: "AI demand gen", volume: 42, difficulty: 33 },
  { keyword: "B2B AI tools", volume: 78, difficulty: 60 },
  { keyword: "AI outbound", volume: 38, difficulty: 25 },
  { keyword: "marketing OS", volume: 30, difficulty: 20 },
] as ScatterPoint[];

const FILTER_TABS: OpportunityTab[] = ["All", "Quick Wins", "Content Gaps", "Ranking Drops"];

const CONTENT_STATUS_COLORS: Record<ContentStatus, string> = {
  "Has Content": "bg-green-100 text-green-700",
  "No Content": "bg-red-100 text-red-600",
  "Needs Update": "bg-yellow-100 text-yellow-700",
};

const BRIEF_STRUCTURE = `# Content Brief: Marketing Orchestration Platform

## Target Keyword: marketing orchestration platform
## Search Volume: 5,600/mo | Difficulty: 38 | Opportunity: 91

### Content Goal
Rank position 1-3 for "marketing orchestration platform" and capture
30+ related long-tail variations.

### Recommended Format
Long-form guide (2,500-3,500 words) with comparison tables

### H1: The Complete Guide to Marketing Orchestration Platforms in 2026

### Outline
1. What is Marketing Orchestration? (definitions, evolution)
2. Why Traditional Automation Falls Short (pain points)
3. How AI Agents Change the Game (agentic vs rule-based)
4. Key Features to Look For (checklist format)
5. Top Platforms Compared (table: Skott vs competitors)
6. Implementation Roadmap (step-by-step)
7. ROI Calculator (interactive element)

### Internal Links
- /features/agents, /blog/ai-marketing-guide, /pricing

### CTA
Free demo → "See orchestration in action"`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function KeywordsPage() {
  const [activeTab, setActiveTab] = useState<OpportunityTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [showBrief, setShowBrief] = useState(false);
  const [generatingBrief, setGeneratingBrief] = useState(false);

  const filterKeywords = (kws: Keyword[]) => {
    let result = kws;
    if (activeTab === "Quick Wins") result = result.filter((k) => k.position !== null && k.position >= 4 && k.position <= 20);
    else if (activeTab === "Content Gaps") result = result.filter((k) => k.contentStatus === "No Content");
    else if (activeTab === "Ranking Drops") result = result.filter((k) => k.position !== null && k.position > 20);
    if (searchQuery) result = result.filter((k) => k.keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    return result;
  };

  const displayedKeywords = filterKeywords(KEYWORDS);

  const handleGenerateBrief = () => {
    setGeneratingBrief(true);
    setTimeout(() => { setGeneratingBrief(false); setShowBrief(true); }, 1800);
  };

  const kpis = [
    { label: "Keywords Tracked", value: "1,247", icon: <BarChart2 className="w-5 h-5" />, delta: "+23 this week" },
    { label: "Opportunities Found", value: "84", icon: <Target className="w-5 h-5" />, delta: "+12 new" },
    { label: "Quick Wins", value: "23", icon: <Zap className="w-5 h-5" />, delta: "Pos 4-20" },
    { label: "Content Gaps", value: "156", icon: <FileText className="w-5 h-5" />, delta: "No content yet" },
  ];

  const opportunityColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-700 font-bold";
    if (score >= 80) return "bg-yellow-100 text-yellow-700 font-semibold";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-[hsl(36,33%,94%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[hsl(25,40%,18%)]">Keyword Intelligence Agent</h1>
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(25,20%,50%)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search keywords, topics, or URLs..."
          className="w-full pl-9 pr-4 py-2.5 bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl text-sm text-[hsl(25,40%,18%)] placeholder-[hsl(25,20%,60%)] focus:outline-none focus:ring-2 focus:ring-[hsl(25,62%,25%)]/30"
        />
      </div>

      {/* Main Grid */}
      <div className="flex gap-5">
        {/* Keyword Table */}
        <div className="flex-1 bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[hsl(30,15%,87%)]">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-medium transition-all relative ${
                  activeTab === tab
                    ? "text-[hsl(25,62%,25%)]"
                    : "text-[hsl(25,20%,50%)] hover:text-[hsl(25,40%,18%)]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="kw-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(25,62%,25%)]"
                  />
                )}
              </button>
            ))}
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[hsl(30,15%,87%)] text-[hsl(25,20%,50%)]">
                {["Keyword", "Volume", "Difficulty", "Position", "Opportunity", "Content", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {displayedKeywords.map((kw, i) => (
                  <motion.tr
                    key={kw.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    whileHover={{ backgroundColor: "hsl(36,33%,93%)" }}
                    className="border-b border-[hsl(30,15%,87%)] cursor-pointer"
                    onClick={() => setSelectedKeyword(kw)}
                  >
                    <td className="px-4 py-2.5 font-medium text-[hsl(25,40%,18%)]">{kw.keyword}</td>
                    <td className="px-4 py-2.5 text-[hsl(25,20%,50%)]">{kw.volume.toLocaleString()}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[hsl(30,15%,87%)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${kw.difficulty}%`,
                              backgroundColor: kw.difficulty >= 70 ? "#ef4444" : kw.difficulty >= 45 ? "#f59e0b" : "#22c55e",
                            }}
                          />
                        </div>
                        <span>{kw.difficulty}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[hsl(25,20%,50%)]">
                      {kw.position ? `#${kw.position}` : <span className="text-[hsl(25,20%,60%)] italic">Not ranking</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${opportunityColor(kw.opportunityScore)}`}>
                        {kw.opportunityScore}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${CONTENT_STATUS_COLORS[kw.contentStatus]}`}>
                        {kw.contentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedKeyword(kw); handleGenerateBrief(); }}
                        className="flex items-center gap-1 text-[10px] text-[hsl(25,62%,25%)] hover:underline"
                      >
                        <FileText className="w-3 h-3" /> Brief
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div className="w-72 space-y-4 flex-shrink-0">
          {/* AI Recommendations */}
          <div className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[hsl(25,62%,25%)]" />
              <h3 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Top 3 Actions This Week</h3>
            </div>
            {[
              { action: "Publish content for", target: "marketing orchestration platform", note: "Opportunity 91, no content" },
              { action: "Update post ranking for", target: "AI content generation B2B", note: "Pos #11, page needs refresh" },
              { action: "Build 3 links to", target: "agentic AI marketing", note: "Pos #14 → target top 5" },
            ].map((rec, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="w-5 h-5 rounded-full bg-[hsl(25,62%,25%)] text-white text-[10px] font-bold flex-shrink-0 flex items-center justify-center mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-[hsl(25,40%,18%)]">{rec.action} <strong>"{rec.target}"</strong></p>
                  <p className="text-[hsl(25,20%,50%)] text-[10px]">{rec.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scatter Visualization */}
          <div className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[hsl(25,40%,18%)] mb-1">Volume vs Difficulty</h3>
            <p className="text-[10px] text-[hsl(25,20%,50%)] mb-2">Top-left = best opportunities</p>
            <svg viewBox="0 0 200 160" className="w-full">
              <line x1="20" y1="8" x2="20" y2="140" stroke="hsl(30,15%,87%)" strokeWidth="1" />
              <line x1="20" y1="140" x2="195" y2="140" stroke="hsl(30,15%,87%)" strokeWidth="1" />
              <text x="10" y="8" fontSize="7" fill="hsl(25,20%,50%)" textAnchor="middle">Vol</text>
              <text x="195" y="148" fontSize="7" fill="hsl(25,20%,50%)">Diff</text>
              {SCATTER_POINTS.map((p, i) => {
                const vol = (p.volume ?? 50);
                const x = 22 + (p.difficulty / 100) * 165;
                const y = 138 - (vol / 100) * 125;
                const isHigh = p.difficulty < 45 && vol > 60;
                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r={3.5}
                      fill={isHigh ? "hsl(142,71%,45%)" : "hsl(25,62%,25%)"}
                      opacity={0.75}
                    />
                  </g>
                );
              })}
              <text x="30" y="20" fontSize="6" fill="hsl(142,71%,35%)">Best zone ↙</text>
            </svg>
            <div className="flex gap-3 mt-1 text-[10px] text-[hsl(25,20%,50%)]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Quick wins</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[hsl(25,62%,25%)] inline-block" /> Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyword Clusters */}
      <div className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[hsl(25,62%,25%)]" />
          <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Topic Clusters</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CLUSTERS.map((cluster) => (
            <div key={cluster.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[hsl(25,40%,18%)]">{cluster.topic}</h3>
                <span className="text-[10px] text-[hsl(25,20%,50%)]">{cluster.totalVolume.toLocaleString()} vol</span>
              </div>
              <div className="space-y-1">
                {cluster.keywords.map((kw) => (
                  <div key={kw} className="flex items-center gap-1.5 text-[11px] text-[hsl(25,20%,50%)]">
                    <ChevronRight className="w-3 h-3 text-[hsl(25,62%,25%)]" />
                    {kw}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Brief Panel */}
      <AnimatePresence>
        {(selectedKeyword || showBrief) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[hsl(25,62%,25%)]" />
                <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">
                  Content Brief {selectedKeyword ? `— "${selectedKeyword.keyword}"` : ""}
                </h2>
              </div>
              <button
                onClick={() => { setSelectedKeyword(null); setShowBrief(false); }}
                className="text-xs text-[hsl(25,20%,50%)] hover:text-[hsl(25,40%,18%)]"
              >
                Close
              </button>
            </div>

            {!showBrief ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGenerateBrief}
                  disabled={generatingBrief}
                  className="flex items-center gap-2 bg-[hsl(25,62%,25%)] text-white px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-60"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${generatingBrief ? "animate-spin" : ""}`} />
                  {generatingBrief ? "Generating brief…" : "Generate Content Brief"}
                </button>
                {selectedKeyword && (
                  <span className="text-xs text-[hsl(25,20%,50%)]">
                    Volume: {selectedKeyword.volume.toLocaleString()} | Difficulty: {selectedKeyword.difficulty} | Opportunity: {selectedKeyword.opportunityScore}
                  </span>
                )}
              </div>
            ) : (
              <motion.pre
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[hsl(36,33%,94%)] rounded-lg p-4 text-[11px] text-[hsl(25,40%,18%)] whitespace-pre-wrap font-mono leading-relaxed overflow-auto max-h-64"
              >
                {BRIEF_STRUCTURE}
              </motion.pre>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AIRecommendations page="keywords" />
    </div>
  );
}
