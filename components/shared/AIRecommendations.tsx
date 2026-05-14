"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp, Loader2, RefreshCw, ArrowRight, Zap } from "lucide-react";

interface Recommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  action: string;
  category: "content" | "campaign" | "optimization" | "outreach" | "analysis";
}

interface AIRecommendationsProps {
  page: string;
  context?: string;
  className?: string;
  defaultCollapsed?: boolean;
}

const priorityConfig = {
  high: { color: "hsl(0,72%,48%)", bg: "hsl(0,72%,48%,0.08)", label: "High Impact" },
  medium: { color: "hsl(38,60%,40%)", bg: "hsl(38,60%,40%,0.08)", label: "Medium" },
  low: { color: "hsl(142,50%,35%)", bg: "hsl(142,50%,35%,0.08)", label: "Quick Win" },
};

const categoryConfig = {
  content: { color: "hsl(217,91%,50%)", label: "Content" },
  campaign: { color: "hsl(280,60%,55%)", label: "Campaign" },
  optimization: { color: "hsl(142,71%,35%)", label: "Optimize" },
  outreach: { color: "hsl(25,62%,30%)", label: "Outreach" },
  analysis: { color: "hsl(200,80%,45%)", label: "Analysis" },
};

const card = "hsl(36,30%,97%)";
const border = "hsl(30,15%,87%)";
const primary = "hsl(25,40%,18%)";
const muted = "hsl(25,20%,50%)";
const brown = "hsl(25,62%,25%)";

export function AIRecommendations({ page, context, className = "", defaultCollapsed = false }: AIRecommendationsProps) {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [actionFired, setActionFired] = useState<number | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchRecs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, context }),
      });
      const data = await res.json();
      setRecs(data.recommendations || []);
    } catch {
      setRecs([]);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  }, [page, context]);

  useEffect(() => {
    if (!collapsed && !hasFetched) {
      fetchRecs();
    }
  }, [collapsed, hasFetched, fetchRecs]);

  const handleExpand = () => {
    setCollapsed(false);
    if (!hasFetched) fetchRecs();
  };

  const handleAction = (idx: number) => {
    setActionFired(idx);
    setTimeout(() => setActionFired(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-xl border overflow-hidden ${className}`}
      style={{ background: card, borderColor: border }}
    >
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => collapsed ? handleExpand() : setCollapsed(true)}
        onKeyDown={e => e.key === "Enter" && (collapsed ? handleExpand() : setCollapsed(true))}
        className="w-full flex items-center justify-between px-4 py-3 hover:opacity-80 transition-opacity cursor-pointer"
        style={{ borderBottom: collapsed ? "none" : `1px solid ${border}` }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(38,92%,50%,0.15)" }}>
            <Sparkles size={13} style={{ color: "hsl(38,92%,40%)" }} />
          </div>
          <span className="text-[13px] font-semibold" style={{ color: primary }}>
            Skott AI Recommendations
          </span>
          {recs.length > 0 && !collapsed && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
              style={{ background: "hsl(38,92%,50%,0.12)", color: "hsl(38,60%,35%)" }}>
              {recs.length} actions
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 size={13} className="animate-spin" style={{ color: muted }} />}
          {!collapsed && hasFetched && !loading && (
            <button
              onClick={e => { e.stopPropagation(); setHasFetched(false); fetchRecs(); }}
              className="p-1 rounded-md hover:opacity-70 transition-opacity"
              title="Refresh recommendations"
            >
              <RefreshCw size={12} style={{ color: muted }} />
            </button>
          )}
          {collapsed
            ? <ChevronDown size={14} style={{ color: muted }} />
            : <ChevronUp size={14} style={{ color: muted }} />
          }
        </div>
      </div>

      {/* Body */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {loading ? (
              <div className="px-4 py-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" style={{ color: "hsl(38,92%,40%)" }} />
                  <span className="text-sm" style={{ color: muted }}>Skott is analyzing your pipeline data…</span>
                </div>
                <div className="w-full space-y-2">
                  {[80, 65, 75, 55].map((w, i) => (
                    <motion.div key={i}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="h-3 rounded-full"
                      style={{ width: `${w}%`, background: border }}
                    />
                  ))}
                </div>
              </div>
            ) : recs.length === 0 ? (
              <div className="px-4 py-5 text-center">
                <p className="text-sm" style={{ color: muted }}>No recommendations available. <button onClick={fetchRecs} className="underline" style={{ color: brown }}>Try again</button></p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {recs.map((rec, i) => {
                  const pri = priorityConfig[rec.priority] || priorityConfig.medium;
                  const cat = categoryConfig[rec.category] || categoryConfig.content;
                  const fired = actionFired === i;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3 p-3 rounded-lg border"
                      style={{ borderColor: border, background: "hsl(36,33%,95%)" }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                            style={{ background: pri.bg, color: pri.color }}>
                            {pri.label}
                          </span>
                          <span className="text-[10px] font-medium" style={{ color: cat.color }}>
                            {cat.label}
                          </span>
                        </div>
                        <p className="text-[12.5px] font-semibold leading-snug mb-1" style={{ color: primary }}>
                          {rec.title}
                        </p>
                        <p className="text-[11.5px] leading-relaxed" style={{ color: muted }}>
                          {rec.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAction(i)}
                        className="shrink-0 flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                        style={{
                          background: fired ? "hsl(142,50%,35%)" : brown,
                          color: "hsl(36,33%,94%)",
                          minWidth: 72,
                          justifyContent: "center",
                        }}
                      >
                        {fired ? (
                          <><Zap size={10} /> Done</>
                        ) : (
                          <>{rec.action} <ArrowRight size={10} /></>
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
