// /Users/navaneethakrishnan/Desktop/skott/app/performance-marketing/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Minus,
  Zap,
  BarChart2,
  DollarSign,
  Target,
  Layers,
  Info,
  ArrowRight,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";
import { campaigns } from "@/data/mock";
import { cn } from "@/lib/utils";

// ─── Platform config ──────────────────────────────────────────────────────────
const platformConfig: Record<string, { color: string; bg: string }> = {
  Google:   { color: "text-blue-700",   bg: "bg-blue-100" },
  LinkedIn: { color: "text-indigo-700", bg: "bg-indigo-100" },
  Meta:     { color: "text-violet-700", bg: "bg-violet-100" },
};

// ─── Attribution tabs ─────────────────────────────────────────────────────────
const ATTR_TABS = ["Google Ads View", "HubSpot View", "Reconciliation"] as const;
type AttrTab = (typeof ATTR_TABS)[number];

// ─── Budget optimizer recommendations ────────────────────────────────────────
const budgetRecs = [
  { campaign: "G-Brand-01",        action: "Pause",      change: -1680, reason: "CTR -23%. Creative fatigue likely. Rotate copy before scaling." },
  { campaign: "G-PMAX-01",         action: "Increase",   change: +1200, reason: "CPA $187 — best performer. In learning phase, increase budget now." },
  { campaign: "META-Lookalike-02", action: "Increase",   change: +800,  reason: "Strong MQL efficiency ($220/MQL). Scale lookalike audience." },
  { campaign: "LI-ABM-Enterprise", action: "Hold",       change: 0,     reason: "High CPA but ABM targets strategic accounts. Hold through cycle." },
];

// ─── Anomaly card ─────────────────────────────────────────────────────────────
const anomaly = {
  campaign: "G-Brand-01",
  platform: "Google",
  detected: "2h ago",
  metric: "CTR",
  change: -23,
  diagnosis: "Suspected creative fatigue on top 2 ad variants. Avg. impression frequency hit 14.2x. Combined with Q2 competitor increase (+4 new ads from Moveworks), this is a two-factor squeeze.",
  actions: [
    { rank: 1, label: "Rotate Ad Creative", detail: "Replace top 2 creatives with Variant C & D from design queue. Est. CTR recovery: +8–12%." },
    { rank: 2, label: "Reduce Impression Cap", detail: "Lower frequency cap to 8x/week to reduce fatigue signal while creative ships." },
    { rank: 3, label: "Pause + Redistribute Budget", detail: "Reallocate $1,680/wk to G-PMAX-01 (current CPA: $187). Lower risk option." },
  ],
};

// ─── Attribution data ─────────────────────────────────────────────────────────
const attrGoogleData = [
  { campaign: "G-Brand-01",     clicks: 4820, conversions: 12, cpa: 312, attributedRevenue: "$48K" },
  { campaign: "G-Competitor-02", clicks: 3240, conversions: 9,  cpa: 245, attributedRevenue: "$36K" },
  { campaign: "G-PMAX-01",      clicks: 7100, conversions: 15, cpa: 187, attributedRevenue: "$60K" },
];

const attrHubSpotData = [
  { campaign: "G-Brand-01",     hsDeals: 8, pipeline: "$32K",  influenced: 18 },
  { campaign: "G-Competitor-02", hsDeals: 7, pipeline: "$28K",  influenced: 12 },
  { campaign: "G-PMAX-01",      hsDeals: 11, pipeline: "$44K", influenced: 21 },
];

export default function PerformanceMarketingPage() {
  const [attrTab, setAttrTab] = useState<AttrTab>("Google Ads View");

  const alertCampaigns = campaigns.filter(c => c.change < -20);
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalMqls = campaigns.reduce((sum, c) => sum + c.mqls, 0);
  const blendedCpa = Math.round(totalSpend / totalMqls);

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-2xl font-[600] text-[hsl(25,40%,18%)]">Performance Marketing</h1>
            <AgentStatusBadge status="active" />
          </div>
          <p className="text-sm text-[hsl(25,20%,45%)]">
            Campaign Optimizer · Google, LinkedIn &amp; Meta · Anomaly detection &amp; budget recommendations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[hsl(30,15%,85%)] text-[hsl(25,20%,45%)] hover:bg-[hsl(36,30%,96%)] transition-colors">
            <BarChart2 size={12} /> Export Report
          </button>
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] font-[500] hover:opacity-90 transition-opacity">
            <Zap size={12} /> Run Optimizer
          </button>
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Total Ad Spend" value="$84.2K" sub="Budget: $90K · MTD" trend={-2.1} />
        <MetricCard label="Blended Cost / MQL" value={`$${blendedCpa}`} sub="Target: $200" trend={12} trendLabel="MoM" />
        <MetricCard label="Total MQLs (Paid)" value={totalMqls} sub="This month from paid" trend={6} />
        <MetricCard label="Active Campaigns" value={13} sub="13 active · 1 learning" />
      </div>

      {/* ── Alert banner ── */}
      {alertCampaigns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 px-4 py-3.5 rounded-[0.75rem] bg-amber-50 border border-amber-300"
        >
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-[500] text-amber-800">
              {alertCampaigns.length} campaign{alertCampaigns.length > 1 ? "s" : ""} flagged for significant performance drop
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              {alertCampaigns.map(c => `${c.name} (${c.change}%)`).join(" · ")} — Review recommended before next budget cycle.
            </p>
          </div>
          <button className="text-xs px-3 py-1.5 rounded-lg bg-amber-600 text-white font-[500] hover:opacity-90 transition-opacity whitespace-nowrap">
            Review Now
          </button>
        </motion.div>
      )}

      {/* ── Campaign table ── */}
      <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[hsl(30,15%,85%)] flex items-center gap-2">
          <Target size={14} className="text-[hsl(25,62%,25%)]" />
          <span className="text-sm font-[500] text-[hsl(25,40%,18%)]">Campaign Table</span>
          <span className="ml-auto text-[11px] text-[hsl(25,20%,45%)]">{campaigns.length} campaigns</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(30,15%,85%)]">
                {[
                  "Campaign Name",
                  "Platform",
                  "Budget",
                  "Spent",
                  "Conv. Action",   /* ALWAYS VISIBLE — non-negotiable */
                  "CTR",
                  "Cost / MQL",
                  "MQLs",
                  "Status",
                  "Change",
                  "Actions",
                ].map(h => (
                  <th
                    key={h}
                    className={cn(
                      "text-left text-[11px] font-[500] uppercase tracking-widest text-[hsl(25,20%,45%)] px-4 py-3 whitespace-nowrap",
                      h === "Conv. Action" && "bg-[hsl(25,62%,25%)]/5 font-[700] text-[hsl(25,62%,25%)]"
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp, i) => {
                const plat = platformConfig[camp.platform] ?? platformConfig.Google;
                const isAlert = camp.change < -20;

                const changeEl =
                  camp.change > 0 ? (
                    <span className="flex items-center gap-0.5 text-green-700 font-[600]">
                      <ChevronUp size={13} /> +{camp.change}%
                    </span>
                  ) : camp.change < 0 ? (
                    <span className="flex items-center gap-0.5 text-red-700 font-[600]">
                      <ChevronDown size={13} /> {camp.change}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-[hsl(25,20%,55%)]">
                      <Minus size={12} /> —
                    </span>
                  );

                const statusEl = (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[11px] font-[600] capitalize",
                    camp.status === "active"   && "bg-green-100 text-green-700",
                    camp.status === "learning" && "bg-blue-100 text-blue-700",
                    camp.status === "paused"   && "bg-neutral-100 text-neutral-600",
                  )}>
                    {camp.status}
                  </span>
                );

                return (
                  <motion.tr
                    key={camp.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn(
                      "border-b border-[hsl(30,15%,88%)] hover:bg-[hsl(30,15%,93%)] transition-colors",
                      isAlert && "bg-amber-50/60 hover:bg-amber-50"
                    )}
                  >
                    {/* Campaign name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {isAlert && <AlertTriangle size={12} className="text-amber-500 shrink-0" />}
                        <span className="font-[500] text-[hsl(25,40%,18%)] text-xs">{camp.name}</span>
                      </div>
                    </td>
                    {/* Platform */}
                    <td className="px-4 py-3.5">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-[600]", plat.bg, plat.color)}>
                        {camp.platform}
                      </span>
                    </td>
                    {/* Budget */}
                    <td className="px-4 py-3.5 text-xs text-[hsl(25,20%,45%)]">
                      ${camp.budget.toLocaleString()}
                    </td>
                    {/* Spent */}
                    <td className="px-4 py-3.5 text-xs text-[hsl(25,40%,18%)] font-[500]">
                      ${camp.spent.toLocaleString()}
                      <div className="w-16 h-1 bg-[hsl(30,15%,88%)] rounded-full mt-1 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", (camp.spent / camp.budget) > 0.9 ? "bg-amber-500" : "bg-[hsl(25,62%,25%)]")}
                          style={{ width: `${Math.min(100, (camp.spent / camp.budget) * 100)}%` }}
                        />
                      </div>
                    </td>
                    {/* Conv. Action — ALWAYS VISIBLE */}
                    <td className="px-4 py-3.5 bg-[hsl(25,62%,25%)]/5">
                      <span className="text-xs font-[500] text-[hsl(25,40%,18%)]">{camp.convAction}</span>
                    </td>
                    {/* CTR */}
                    <td className="px-4 py-3.5 text-xs text-[hsl(25,40%,18%)]">
                      {camp.ctr}%
                    </td>
                    {/* Cost / MQL */}
                    <td className="px-4 py-3.5">
                      <span className={cn(
                        "text-xs font-[600]",
                        camp.costMql <= 250 ? "text-green-700" : camp.costMql <= 350 ? "text-amber-700" : "text-red-700"
                      )}>
                        ${camp.costMql}
                      </span>
                    </td>
                    {/* MQLs */}
                    <td className="px-4 py-3.5 text-xs font-[600] text-[hsl(25,40%,18%)]">
                      {camp.mqls}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3.5">{statusEl}</td>
                    {/* Change */}
                    <td className="px-4 py-3.5 text-xs">{changeEl}</td>
                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="text-[11px] px-2.5 py-1 rounded-lg border border-[hsl(30,15%,85%)] text-[hsl(25,20%,45%)] hover:bg-[hsl(30,15%,90%)] transition-colors font-[500]">
                          Edit
                        </button>
                        {isAlert && (
                          <button className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700 border border-amber-300 font-[600] hover:bg-amber-200 transition-colors">
                            Fix
                          </button>
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

      {/* ── Anomaly card + Budget Optimizer ── */}
      <div className="grid grid-cols-2 gap-6">

        {/* Anomaly card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[0.75rem] border border-red-300 bg-[hsl(36,30%,96%)] overflow-hidden"
        >
          <div className="px-5 py-4 bg-red-50 border-b border-red-200 flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-600" />
            <span className="text-sm font-[600] text-red-800">Anomaly Detected</span>
            <span className="ml-auto text-[11px] text-red-600">{anomaly.detected}</span>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-[600]", platformConfig[anomaly.platform].bg, platformConfig[anomaly.platform].color)}>
                  {anomaly.platform}
                </span>
                <span className="font-serif text-base font-[500] text-[hsl(25,40%,18%)]">{anomaly.campaign}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[hsl(25,20%,45%)]">{anomaly.metric}</span>
                <span className="flex items-center gap-0.5 text-sm font-[600] text-red-700">
                  <TrendingDown size={14} /> {anomaly.change}%
                </span>
                <span className="text-xs text-[hsl(25,20%,45%)]">in last 4 hours</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[hsl(36,30%,93%)] border border-[hsl(30,15%,85%)]">
              <p className="text-[11px] font-[500] uppercase tracking-widest text-[hsl(25,20%,45%)] mb-2">AI Diagnosis</p>
              <p className="text-xs text-[hsl(25,40%,18%)] leading-relaxed">{anomaly.diagnosis}</p>
            </div>

            <div>
              <p className="text-[11px] font-[500] uppercase tracking-widest text-[hsl(25,20%,45%)] mb-2">Ranked Actions</p>
              <div className="space-y-2">
                {anomaly.actions.map(action => (
                  <div key={action.rank} className="flex items-start gap-3 p-3 rounded-lg border border-[hsl(30,15%,85%)] hover:border-[hsl(25,62%,25%)]/30 transition-colors cursor-pointer group">
                    <span className="w-5 h-5 rounded-full bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-[10px] font-[700] flex items-center justify-center shrink-0 mt-0.5">
                      {action.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-[600] text-[hsl(25,40%,18%)] mb-0.5">{action.label}</p>
                      <p className="text-[11px] text-[hsl(25,20%,45%)] leading-relaxed">{action.detail}</p>
                    </div>
                    <ArrowRight size={13} className="text-[hsl(25,20%,55%)] group-hover:text-[hsl(25,62%,25%)] transition-colors mt-0.5 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Budget Optimizer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-[hsl(30,15%,85%)] flex items-center gap-2">
            <DollarSign size={14} className="text-[hsl(25,62%,25%)]" />
            <span className="text-sm font-[500] text-[hsl(25,40%,18%)]">Budget Optimizer</span>
            <span className="ml-1.5 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-[600]">Daily Rec</span>
            <span className="ml-auto text-[11px] text-[hsl(25,20%,45%)]">by Campaign Optimizer Agent</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="p-3.5 rounded-lg bg-[hsl(36,30%,93%)] border border-[hsl(30,15%,85%)]">
              <p className="text-[11px] font-[500] uppercase tracking-widest text-[hsl(25,20%,45%)] mb-1.5">Today's Recommendation</p>
              <p className="text-xs text-[hsl(25,40%,18%)] leading-relaxed">
                Reallocate <span className="font-[600]">$2,480/week</span> from underperforming campaigns (G-Brand-01, LI-ABM-Enterprise) toward high-efficiency channels (G-PMAX-01, META-Lookalike-02). Projected MQL improvement: <span className="font-[600] text-green-700">+9–14 MQLs/month</span>.
              </p>
            </div>

            <div className="space-y-2">
              {budgetRecs.map((rec, i) => {
                const isIncrease = rec.change > 0;
                const isPause = rec.action === "Pause";
                const isHold = rec.action === "Hold";
                return (
                  <motion.div
                    key={rec.campaign}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="flex items-start gap-3 p-3 rounded-lg border border-[hsl(30,15%,85%)] hover:bg-[hsl(30,15%,93%)] transition-colors"
                  >
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded font-[700] uppercase tracking-wide shrink-0 mt-0.5",
                      isIncrease ? "bg-green-100 text-green-700" :
                      isPause    ? "bg-red-100 text-red-700" :
                                   "bg-neutral-100 text-neutral-600"
                    )}>
                      {rec.action}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-[500] text-[hsl(25,40%,18%)]">{rec.campaign}</span>
                        {rec.change !== 0 && (
                          <span className={cn("text-xs font-[600] flex items-center gap-0.5", isIncrease ? "text-green-700" : "text-red-700")}>
                            {isIncrease ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            {isIncrease ? "+" : ""}${Math.abs(rec.change).toLocaleString()}/wk
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[hsl(25,20%,45%)] leading-relaxed">{rec.reason}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button className="flex-1 text-xs py-2 rounded-lg bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] font-[500] hover:opacity-90 transition-opacity">
                Apply All Recommendations
              </button>
              <button className="flex-1 text-xs py-2 rounded-lg border border-[hsl(30,15%,85%)] text-[hsl(25,20%,45%)] hover:bg-[hsl(30,15%,90%)] transition-colors">
                Review Individually
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Attribution Center ── */}
      <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[hsl(30,15%,85%)] flex items-center gap-2">
          <Layers size={14} className="text-[hsl(25,62%,25%)]" />
          <span className="text-sm font-[500] text-[hsl(25,40%,18%)]">Attribution Center</span>
          <div className="ml-auto flex items-center gap-1 text-[11px] text-[hsl(25,20%,45%)]">
            <Info size={11} />
            <span>Multi-touch linear attribution · Last sync 4m ago</span>
          </div>
        </div>

        {/* Attribution tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-[hsl(30,15%,85%)] pb-0">
          {ATTR_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setAttrTab(tab)}
              className={cn(
                "px-4 py-2 text-xs font-[500] border-b-2 transition-colors -mb-px",
                attrTab === tab
                  ? "border-[hsl(25,62%,25%)] text-[hsl(25,40%,18%)]"
                  : "border-transparent text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5">
          <motion.div
            key={attrTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {attrTab === "Google Ads View" && (
              <div>
                <p className="text-xs text-[hsl(25,20%,45%)] mb-3">
                  Conversions and revenue as reported by Google Ads (last-click attribution, 30-day window).
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[hsl(30,15%,85%)]">
                      {["Campaign", "Clicks", "Conversions", "CPA", "Attributed Revenue"].map(h => (
                        <th key={h} className="text-left text-[11px] font-[500] uppercase tracking-widest text-[hsl(25,20%,45%)] py-2 pr-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {attrGoogleData.map(row => (
                      <tr key={row.campaign} className="border-b border-[hsl(30,15%,88%)]">
                        <td className="py-3 pr-4 font-[500] text-[hsl(25,40%,18%)]">{row.campaign}</td>
                        <td className="py-3 pr-4 text-[hsl(25,20%,45%)]">{row.clicks.toLocaleString()}</td>
                        <td className="py-3 pr-4 font-[600] text-[hsl(25,40%,18%)]">{row.conversions}</td>
                        <td className="py-3 pr-4">
                          <span className={cn("font-[600]", row.cpa <= 250 ? "text-green-700" : row.cpa <= 350 ? "text-amber-700" : "text-red-700")}>
                            ${row.cpa}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-[600] text-[hsl(25,40%,18%)]">{row.attributedRevenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {attrTab === "HubSpot View" && (
              <div>
                <p className="text-xs text-[hsl(25,20%,45%)] mb-3">
                  Deals and pipeline influenced as tracked in HubSpot CRM (multi-touch, 90-day attribution window).
                </p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[hsl(30,15%,85%)]">
                      {["Campaign", "HS Deals", "Pipeline", "Influenced Contacts"].map(h => (
                        <th key={h} className="text-left text-[11px] font-[500] uppercase tracking-widest text-[hsl(25,20%,45%)] py-2 pr-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {attrHubSpotData.map(row => (
                      <tr key={row.campaign} className="border-b border-[hsl(30,15%,88%)]">
                        <td className="py-3 pr-4 font-[500] text-[hsl(25,40%,18%)]">{row.campaign}</td>
                        <td className="py-3 pr-4 font-[600] text-[hsl(25,40%,18%)]">{row.hsDeals}</td>
                        <td className="py-3 pr-4 font-[600] text-green-700">{row.pipeline}</td>
                        <td className="py-3 pr-4 text-[hsl(25,20%,45%)]">{row.influenced}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {attrTab === "Reconciliation" && (
              <div className="space-y-4">
                <p className="text-xs text-[hsl(25,20%,45%)]">
                  Reconciliation compares Google Ads last-click conversions with HubSpot multi-touch influenced pipeline to identify attribution gaps.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-[hsl(30,15%,85%)] bg-white/40">
                    <p className="text-[11px] font-[500] uppercase tracking-widest text-[hsl(25,20%,45%)] mb-2">Google-Only MQLs</p>
                    <p className="font-serif text-2xl font-[600] text-[hsl(25,40%,18%)]">8</p>
                    <p className="text-[11px] text-[hsl(25,20%,45%)] mt-1">Not found in HubSpot</p>
                  </div>
                  <div className="p-4 rounded-lg border border-[hsl(30,15%,85%)] bg-white/40">
                    <p className="text-[11px] font-[500] uppercase tracking-widest text-[hsl(25,20%,45%)] mb-2">Matched MQLs</p>
                    <p className="font-serif text-2xl font-[600] text-green-700">28</p>
                    <p className="text-[11px] text-[hsl(25,20%,45%)] mt-1">In both systems</p>
                  </div>
                  <div className="p-4 rounded-lg border border-[hsl(30,15%,85%)] bg-white/40">
                    <p className="text-[11px] font-[500] uppercase tracking-widest text-[hsl(25,20%,45%)] mb-2">HubSpot-Only MQLs</p>
                    <p className="font-serif text-2xl font-[600] text-blue-700">12</p>
                    <p className="text-[11px] text-[hsl(25,20%,45%)] mt-1">Organic / direct touches</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-[hsl(36,30%,93%)] border border-[hsl(30,15%,85%)]">
                  <p className="text-[11px] font-[500] uppercase tracking-widest text-[hsl(25,20%,45%)] mb-1.5">Methodology Note</p>
                  <p className="text-xs text-[hsl(25,40%,18%)] leading-relaxed">
                    Google Ads uses last-click, 30-day attribution. HubSpot uses linear multi-touch with a 90-day window. Discrepancies are expected — this view is designed to surface missing UTM coverage and CRM sync failures, not to reconcile to a single number. The Campaign Optimizer agent flags gaps automatically.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <AIRecommendations page="performance-marketing" />
    </div>
  );
}
