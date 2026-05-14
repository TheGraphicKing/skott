"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Share2,
  MessageSquare,
  Zap,
  TrendingUp,
  Eye,
  ThumbsUp,
  RefreshCw,
  CheckCircle2,
  Clock,
  Send,
  Edit3,
  FlaskConical,
} from "lucide-react";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

// ─── Types ────────────────────────────────────────────────────────────────────
type IdeaStatus = "Ready to Post" | "In Review" | "Posted" | "Scheduled";
type FilterTab = "All" | "In Review" | "Scheduled" | "Posted";
type Platform = "LinkedIn" | "Twitter" | "Reddit";

interface TrendTopic {
  id: number;
  name: string;
  platform: Platform;
  score: number;
  window: string;
  hook: string;
}

interface IdeaCard {
  id: number;
  platform: Platform;
  headline: string;
  preview: string;
  reachMin: string;
  reachMax: string;
  engagementScore: number;
  status: IdeaStatus;
}

interface Experiment {
  id: number;
  hypothesis: string;
  variantA: string;
  variantB: string;
  result: string;
  winner: "A" | "B" | null;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const TRENDS: TrendTopic[] = [
  { id: 1, name: "AI Agents", platform: "LinkedIn", score: 94, window: "Last 24h", hook: "Replace entire marketing teams?" },
  { id: 2, name: "Autonomous Marketing", platform: "Twitter", score: 88, window: "Last 12h", hook: "Who owns decisions when AI runs campaigns?" },
  { id: 3, name: "LLM Orchestration", platform: "LinkedIn", score: 82, window: "Last 48h", hook: "The missing layer in your AI stack" },
  { id: 4, name: "Agentic Workflows", platform: "Reddit", score: 79, window: "Last 24h", hook: "Stop building tools. Start building agents." },
  { id: 5, name: "Prompt Engineering", platform: "Twitter", score: 75, window: "Last 6h", hook: "Is prompt engineering a dying skill?" },
  { id: 6, name: "Marketing Automation", platform: "LinkedIn", score: 71, window: "Last 72h", hook: "From rule-based to reasoning-based" },
  { id: 7, name: "AI Personalization", platform: "LinkedIn", score: 68, window: "Last 48h", hook: "1-to-1 at scale, finally" },
  { id: 8, name: "Zero-Click Content", platform: "Twitter", score: 63, window: "Last 24h", hook: "Content that converts without a click" },
];

const IDEAS: IdeaCard[] = [
  { id: 1, platform: "LinkedIn", headline: "We replaced our entire content team with AI agents for 30 days. Here's what happened.", preview: "Month 1 results: 3x output, 40% lower CAC, and one very humbling lesson about human creativity...", reachMin: "120K", reachMax: "400K", engagementScore: 91, status: "In Review" },
  { id: 2, platform: "Twitter", headline: "The 5 agentic marketing workflows that will make your competitors obsolete by Q3", preview: "Thread: How autonomous agents are reshaping pipeline generation faster than anyone predicted...", reachMin: "80K", reachMax: "250K", engagementScore: 87, status: "Ready to Post" },
  { id: 3, platform: "LinkedIn", headline: "LLM orchestration isn't a tech problem. It's a strategy problem.", preview: "Most teams are failing at AI not because of model quality, but because they can't answer this one question...", reachMin: "95K", reachMax: "310K", engagementScore: 84, status: "Scheduled" },
  { id: 4, platform: "Reddit", headline: "Honest review: 6 months running agentic marketing at a B2B SaaS startup", preview: "What worked, what blew up spectacularly, and the workflow I'd never go back from...", reachMin: "45K", reachMax: "180K", engagementScore: 79, status: "Posted" },
  { id: 5, platform: "Twitter", headline: "Prompt engineering is dead. Workflow engineering is the new moat.", preview: "The teams winning with AI aren't writing better prompts — they're building better systems around the models...", reachMin: "60K", reachMax: "200K", engagementScore: 76, status: "In Review" },
  { id: 6, platform: "LinkedIn", headline: "Why your marketing automation platform will be obsolete in 18 months", preview: "The shift from rule-based to reasoning-based marketing is happening faster than the vendors will tell you...", reachMin: "110K", reachMax: "380K", engagementScore: 88, status: "Ready to Post" },
];

const EXPERIMENTS: Experiment[] = [
  { id: 1, hypothesis: "Contrarian hooks outperform curiosity hooks on LinkedIn", variantA: "Curiosity: 'The secret to AI marketing...'", variantB: "Contrarian: 'AI marketing is broken. Here's proof.'", result: "B leading by 34% CTR after 1,200 impressions", winner: "B" },
  { id: 2, hypothesis: "First-person story posts get more shares than listicles", variantA: "Listicle: '7 ways AI agents save time'", variantB: "Story: 'I lost $40K to bad automation. Then I tried this.'", result: "Inconclusive — need 2K more impressions", winner: null },
  { id: 3, hypothesis: "Early morning posts (7–9am) outperform noon posts", variantA: "7am post: 890 impressions", variantB: "12pm post: 1,140 impressions", result: "A leading by 22% engagement rate so far", winner: "A" },
];

const FILTER_TABS: FilterTab[] = ["All", "In Review", "Scheduled", "Posted"];

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  LinkedIn: <Globe className="w-4 h-4 text-blue-600" />,
  Twitter: <Share2 className="w-4 h-4 text-sky-500" />,
  Reddit: <MessageSquare className="w-4 h-4 text-orange-500" />,
};

const STATUS_COLORS: Record<IdeaStatus, string> = {
  "Ready to Post": "bg-green-100 text-green-700",
  "In Review": "bg-yellow-100 text-yellow-700",
  "Posted": "bg-[hsl(25,62%,25%)]/10 text-[hsl(25,62%,25%)]",
  "Scheduled": "bg-blue-100 text-blue-700",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ViralIdeasPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const filtered = activeFilter === "All"
    ? IDEAS
    : IDEAS.filter((i) => i.status === activeFilter);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerationStep(1);
    setTimeout(() => setGenerationStep(2), 1000);
    setTimeout(() => setGenerationStep(3), 2200);
    setTimeout(() => { setGenerating(false); setGenerationStep(0); }, 3200);
  };

  const kpis = [
    { label: "Ideas Generated", value: "847", icon: <Zap className="w-5 h-5" />, delta: "+12 today" },
    { label: "Ideas Published", value: "34", icon: <Send className="w-5 h-5" />, delta: "+3 this week" },
    { label: "Avg Reach per Post", value: "84K", icon: <Eye className="w-5 h-5" />, delta: "+8.2%" },
    { label: "Top Post Reach", value: "2.1M", icon: <TrendingUp className="w-5 h-5" />, delta: "All time" },
  ];

  return (
    <div className="min-h-screen bg-[hsl(36,33%,94%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[hsl(25,40%,18%)]">Viral Ideas Agent</h1>
          <AgentStatusBadge status="active" />
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-[hsl(25,62%,25%)] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
          {generating ? (
            generationStep === 1 ? "Scanning trends…" : generationStep === 2 ? "Generating ideas…" : "Finalizing…"
          ) : "Generate Ideas"}
        </motion.button>
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

      {/* Main Layout */}
      <div className="flex gap-5">
        {/* Left: Live Trends */}
        <div className="w-[35%] bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Live Trends</h2>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          {TRENDS.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {PLATFORM_ICONS[t.platform]}
                  <span className="text-sm font-medium text-[hsl(25,40%,18%)]">{t.name}</span>
                </div>
                <span className="text-xs font-bold text-[hsl(25,62%,25%)]">{t.score}</span>
              </div>
              <div className="h-1.5 bg-[hsl(30,15%,87%)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${t.score}%` }}
                  transition={{ duration: 0.8, delay: t.id * 0.05 }}
                  className="h-full bg-[hsl(25,62%,25%)] rounded-full"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[hsl(25,20%,50%)]">
                <span>{t.window}</span>
                <span className="italic">{t.hook}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: Idea Cards */}
        <div className="flex-1 space-y-3">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === tab
                    ? "bg-[hsl(25,62%,25%)] text-white"
                    : "bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] text-[hsl(25,20%,50%)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((idea, i) => (
                <motion.div
                  key={idea.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {PLATFORM_ICONS[idea.platform]}
                      <span className="text-[10px] text-[hsl(25,20%,50%)]">{idea.platform}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[idea.status]}`}>
                      {idea.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[hsl(25,40%,18%)] leading-snug">{idea.headline}</p>
                  <p className="text-xs text-[hsl(25,20%,50%)] line-clamp-2">{idea.preview}</p>
                  <div className="flex items-center justify-between text-[10px] text-[hsl(25,20%,50%)]">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {idea.reachMin}–{idea.reachMax}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {idea.engagementScore}% eng.</span>
                  </div>
                  {idea.status === "In Review" && (
                    <div className="flex gap-2 pt-1">
                      <button className="flex-1 bg-[hsl(25,62%,25%)] text-white text-[10px] py-1 rounded-lg flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approve
                      </button>
                      <button className="flex-1 border border-[hsl(30,15%,87%)] text-[hsl(25,20%,50%)] text-[10px] py-1 rounded-lg flex items-center justify-center gap-1">
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    </div>
                  )}
                  {idea.status === "Ready to Post" && (
                    <button className="w-full bg-green-600 text-white text-[10px] py-1 rounded-lg flex items-center justify-center gap-1 mt-1">
                      <Send className="w-3 h-3" /> Post Now
                    </button>
                  )}
                  {idea.status === "Scheduled" && (
                    <div className="flex items-center gap-1 text-[10px] text-blue-600">
                      <Clock className="w-3 h-3" /> Scheduled for tomorrow 9am
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Experiment Tracker */}
      <div className="bg-[hsl(36,30%,97%)] border border-[hsl(30,15%,87%)] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-4 h-4 text-[hsl(25,62%,25%)]" />
          <h2 className="text-sm font-semibold text-[hsl(25,40%,18%)]">Running Experiments</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {EXPERIMENTS.map((exp) => (
            <div key={exp.id} className="space-y-2">
              <p className="text-xs font-semibold text-[hsl(25,40%,18%)]">{exp.hypothesis}</p>
              <div className="space-y-1 text-[11px]">
                <div className={`px-2 py-1 rounded ${exp.winner === "A" ? "bg-green-50 border border-green-200" : "bg-[hsl(30,15%,87%)]"} text-[hsl(25,40%,18%)]`}>
                  A: {exp.variantA}
                </div>
                <div className={`px-2 py-1 rounded ${exp.winner === "B" ? "bg-green-50 border border-green-200" : "bg-[hsl(30,15%,87%)]"} text-[hsl(25,40%,18%)]`}>
                  B: {exp.variantB}
                </div>
              </div>
              <p className="text-[10px] text-[hsl(25,20%,50%)] italic">{exp.result}</p>
            </div>
          ))}
        </div>
      </div>
      <AIRecommendations page="viral" />
    </div>
  );
}
