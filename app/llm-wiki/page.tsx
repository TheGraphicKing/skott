"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, RefreshCw, Activity, Send, Loader2, RotateCcw } from "lucide-react";
import * as d3 from "d3";

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeType = "Entity" | "Concept" | "Synthesis";

interface WikiNode {
  id: string;
  label: string;
  type: NodeType;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

interface WikiLink {
  source: string | WikiNode;
  target: string | WikiNode;
}

interface ChatMessage {
  role: "user" | "agent";
  text: string;
}

// ─── CMO Knowledge Graph Data ─────────────────────────────────────────────────

const WIKI_NODES: WikiNode[] = [
  // Entities (red-brown) — concrete systems/assets
  { id: "hubspot", label: "HubSpot CRM", type: "Entity" },
  { id: "ga4", label: "GA4 Analytics", type: "Entity" },
  { id: "apollo", label: "Apollo.io", type: "Entity" },
  { id: "salesforce", label: "Salesforce", type: "Entity" },
  { id: "linkedin", label: "LinkedIn Ads", type: "Entity" },
  { id: "semrush", label: "SEMrush", type: "Entity" },
  { id: "budget", label: "Q2 Budget Allocation", type: "Entity" },

  // Concepts (orange-brown) — strategies/frameworks
  { id: "content_strategy", label: "Content Strategy", type: "Concept" },
  { id: "demand_gen", label: "Demand Gen Framework", type: "Concept" },
  { id: "abm", label: "ABM Intelligence", type: "Concept" },
  { id: "seo_aeo", label: "SEO / AEO / GEO", type: "Concept" },
  { id: "perf_mktg", label: "Performance Marketing", type: "Concept" },
  { id: "brand_voice", label: "Brand Voice", type: "Concept" },
  { id: "competitive", label: "Competitive Intel", type: "Concept" },

  // Synthesis (gold) — AI-generated insights
  { id: "pipeline_attr", label: "Pipeline Attribution Model", type: "Synthesis" },
  { id: "q2_analysis", label: "Q2 Campaign Analysis", type: "Synthesis" },
  { id: "channel_mix", label: "Channel Mix Framework", type: "Synthesis" },
  { id: "content_cal", label: "Content Calendar Q3", type: "Synthesis" },
  { id: "competitor_resp", label: "Competitor Response Plan", type: "Synthesis" },
  { id: "email_fix", label: "Email Deliverability Fix", type: "Synthesis" },
];

const WIKI_LINKS: WikiLink[] = [
  { source: "hubspot", target: "demand_gen" },
  { source: "hubspot", target: "abm" },
  { source: "hubspot", target: "pipeline_attr" },
  { source: "ga4", target: "perf_mktg" },
  { source: "ga4", target: "q2_analysis" },
  { source: "ga4", target: "channel_mix" },
  { source: "apollo", target: "abm" },
  { source: "apollo", target: "demand_gen" },
  { source: "salesforce", target: "pipeline_attr" },
  { source: "salesforce", target: "abm" },
  { source: "linkedin", target: "perf_mktg" },
  { source: "linkedin", target: "abm" },
  { source: "semrush", target: "seo_aeo" },
  { source: "semrush", target: "content_strategy" },
  { source: "budget", target: "perf_mktg" },
  { source: "budget", target: "channel_mix" },
  { source: "content_strategy", target: "content_cal" },
  { source: "content_strategy", target: "brand_voice" },
  { source: "demand_gen", target: "q2_analysis" },
  { source: "demand_gen", target: "pipeline_attr" },
  { source: "abm", target: "pipeline_attr" },
  { source: "abm", target: "competitor_resp" },
  { source: "seo_aeo", target: "content_cal" },
  { source: "perf_mktg", target: "channel_mix" },
  { source: "perf_mktg", target: "q2_analysis" },
  { source: "competitive", target: "competitor_resp" },
  { source: "brand_voice", target: "content_cal" },
  { source: "hubspot", target: "email_fix" },
  { source: "demand_gen", target: "email_fix" },
];

// ─── Color config ─────────────────────────────────────────────────────────────

const NODE_COLORS: Record<NodeType, { fill: string; stroke: string; label: string }> = {
  Entity: { fill: "#8b3a3a", stroke: "#6b2a2a", label: "Entity" },
  Concept: { fill: "#a0522d", stroke: "#7a3e20", label: "Concept" },
  Synthesis: { fill: "#b8860b", stroke: "#8b6508", label: "Synthesis" },
};

const SUGGESTED = [
  "Which channels are driving the most pipeline?",
  "Summarise our Q2 content performance",
  "What's causing the LinkedIn CPL spike?",
  "How does our SEO coverage compare to competitors?",
];

// ─── Wiki Agent API call ──────────────────────────────────────────────────────

async function askWikiAgent(question: string): Promise<string> {
  try {
    const res = await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: "llm-wiki",
        context: `User asked: "${question}". Respond as a CMO Office Wiki Agent — synthesise an answer drawing from marketing knowledge graph nodes: pipeline attribution, Q2 campaign analysis, channel mix, content strategy, ABM intelligence. Be specific and actionable. 2-4 sentences.`,
      }),
    });
    const data = await res.json();
    const rec = data.recommendations?.[0];
    return rec ? `${rec.title}: ${rec.description}` : "I couldn't find a synthesis for that query. Try rephrasing or check the knowledge graph nodes directly.";
  } catch {
    return "Unable to reach the Wiki Agent right now. Please try again in a moment.";
  }
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LLMWikiPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [thinking, setThinking] = useState(false);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  const entityCount = WIKI_NODES.filter(n => n.type === "Entity").length;
  const conceptCount = WIKI_NODES.filter(n => n.type === "Concept").length;
  const synthCount = WIKI_NODES.filter(n => n.type === "Synthesis").length;

  const buildGraph = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", 18)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-4L8,0L0,4")
      .attr("fill", "#c4a882");

    const nodes: WikiNode[] = WIKI_NODES.map(n => ({ ...n }));
    const links: WikiLink[] = WIKI_LINKS.map(l => ({ ...l }));

    const sim = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(90).strength(0.6))
      .force("charge", d3.forceManyBody().strength(-220))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(30));

    const linkEl = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#d4b896")
      .attr("stroke-width", 1.2)
      .attr("stroke-opacity", 0.5)
      .attr("marker-end", "url(#arrow)");

    const nodeG = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(
        d3.drag<SVGGElement, WikiNode>()
          .on("start", (event, d) => {
            if (!event.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) sim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any
      )
      .on("click", (_, d) => setHighlightedNode(prev => prev === d.id ? null : d.id));

    nodeG.append("circle")
      .attr("r", (d) => d.type === "Synthesis" ? 22 : d.type === "Concept" ? 18 : 14)
      .attr("fill", (d) => NODE_COLORS[d.type].fill)
      .attr("stroke", (d) => NODE_COLORS[d.type].stroke)
      .attr("stroke-width", 1.5)
      .attr("fill-opacity", 0.85);

    nodeG.append("text")
      .text((d) => d.label)
      .attr("dy", (d) => (d.type === "Synthesis" ? 32 : d.type === "Concept" ? 26 : 22))
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("fill", "#4a3520")
      .attr("font-weight", "500");

    sim.on("tick", () => {
      linkEl
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      nodeG.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
  }, []);

  useEffect(() => {
    buildGraph();
  }, [buildGraph]);

  async function handleAsk(question?: string) {
    const q = question ?? inputVal.trim();
    if (!q) return;
    setInputVal("");
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setThinking(true);
    const answer = await askWikiAgent(q);
    setMessages(prev => [...prev, { role: "agent", text: answer }]);
    setThinking(false);
  }

  return (
    <div className="flex h-full" style={{ background: "hsl(36,33%,94%)" }}>
      {/* ── Left: graph area ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 p-6 gap-4">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <BookOpen size={22} style={{ color: "hsl(25,62%,25%)" }} />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "hsl(25,40%,18%)" }}>LLM Wiki</h1>
              <p className="text-sm" style={{ color: "hsl(25,20%,50%)" }}>
                CMO domain knowledge — entities, concepts, and synthesis pages maintained by the agent
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={buildGraph}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-opacity hover:opacity-70"
              style={{ borderColor: "hsl(30,15%,87%)", color: "hsl(25,20%,50%)", background: "hsl(36,30%,97%)" }}
            >
              <RefreshCw size={12} /> Refresh
            </button>
            <button
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-opacity hover:opacity-70"
              style={{ borderColor: "hsl(30,15%,87%)", color: "hsl(25,20%,50%)", background: "hsl(36,30%,97%)" }}
            >
              <Activity size={12} /> Health Check
            </button>
          </div>
        </div>

        {/* Wiki stats */}
        <div
          className="rounded-xl border p-4"
          style={{ background: "hsl(36,30%,97%)", borderColor: "hsl(30,15%,87%)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "hsl(25,20%,55%)" }}>
            WIKI STATS
          </p>
          <p className="text-base font-bold mb-2" style={{ color: "hsl(25,40%,18%)" }}>
            {WIKI_NODES.length} pages · {WIKI_LINKS.length} links
          </p>
          <div className="flex items-center gap-4">
            {(["Entity", "Concept", "Synthesis"] as NodeType[]).map(type => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: NODE_COLORS[type].fill }} />
                <span className="text-[11px]" style={{ color: "hsl(25,20%,50%)" }}>
                  {type} ({type === "Entity" ? entityCount : type === "Concept" ? conceptCount : synthCount})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* D3 graph */}
        <div
          ref={containerRef}
          className="flex-1 rounded-xl border overflow-hidden"
          style={{ background: "hsl(36,30%,97%)", borderColor: "hsl(30,15%,87%)", minHeight: 380 }}
        >
          <svg ref={svgRef} className="w-full h-full" />
        </div>
      </div>

      {/* ── Right: Wiki Agent panel ───────────────────────────────── */}
      <div
        className="w-[340px] shrink-0 flex flex-col border-l"
        style={{ background: "hsl(36,30%,97%)", borderColor: "hsl(30,15%,87%)" }}
      >
        {/* Panel header */}
        <div className="p-5 border-b" style={{ borderColor: "hsl(30,15%,87%)" }}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(25,62%,25%,0.12)" }}>
              <BookOpen size={15} style={{ color: "hsl(25,62%,25%)" }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "hsl(25,40%,18%)" }}>Wiki Agent</p>
              <p className="text-[11px]" style={{ color: "hsl(25,20%,50%)" }}>LLM-powered synthesis across the knowledge graph</p>
            </div>
          </div>
          <p className="text-[11.5px] leading-relaxed" style={{ color: "hsl(25,20%,50%)" }}>
            Ask a question and the agent will read relevant wiki pages, highlight them on the graph, and stream its synthesis. Substantive answers are filed back to the wiki as new synthesis pages.
          </p>
        </div>

        {/* Suggested questions */}
        {messages.length === 0 && (
          <div className="p-4 border-b" style={{ borderColor: "hsl(30,15%,87%)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "hsl(25,20%,55%)" }}>
              TRY ASKING
            </p>
            <div className="space-y-2">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => handleAsk(q)}
                  className="w-full text-left text-[11.5px] px-3 py-2.5 rounded-lg border transition-all hover:opacity-80"
                  style={{
                    background: "hsl(36,33%,94%)",
                    borderColor: "hsl(30,15%,87%)",
                    color: "hsl(25,40%,18%)",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[90%] rounded-xl px-3 py-2.5 text-[12px] leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { background: "hsl(25,62%,25%)", color: "hsl(36,33%,96%)" }
                      : { background: "hsl(36,33%,94%)", color: "hsl(25,40%,18%)", border: "1px solid hsl(30,15%,87%)" }
                  }
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {thinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <Loader2 size={13} className="animate-spin" style={{ color: "hsl(25,62%,25%)" }} />
              <span className="text-[11px]" style={{ color: "hsl(25,20%,50%)" }}>Synthesising from knowledge graph…</span>
            </motion.div>
          )}
        </div>

        {/* Chat input */}
        <div className="p-4 border-t" style={{ borderColor: "hsl(30,15%,87%)" }}>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1 text-[10px] mb-2 hover:opacity-70 transition-opacity"
              style={{ color: "hsl(25,20%,55%)" }}
            >
              <RotateCcw size={10} /> Clear chat
            </button>
          )}
          <div className="flex items-center gap-2">
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAsk()}
              placeholder="Ask the wiki agent…"
              className="flex-1 text-[12px] px-3 py-2 rounded-lg border focus:outline-none focus:ring-1"
              style={{
                background: "hsl(36,33%,94%)",
                borderColor: "hsl(30,15%,87%)",
                color: "hsl(25,40%,18%)",
              }}
            />
            <button
              onClick={() => handleAsk()}
              disabled={!inputVal.trim() && !thinking}
              className="p-2 rounded-lg transition-all disabled:opacity-30"
              style={{ background: "hsl(25,62%,25%)", color: "hsl(36,33%,96%)" }}
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
