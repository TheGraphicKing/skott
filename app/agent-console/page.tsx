"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Send, Square, Bot, Cpu, Compass, BookOpen, Brain, FileSearch, FilePlus, Terminal, Sparkles, CheckCircle, AlertCircle, ChevronDown, ChevronRight, X } from "lucide-react";
import { cn, sleep } from "@/lib/utils";
import { agents } from "@/data/mock";

type StepType = "agent_init" | "skill_discovery" | "skill_load" | "memory_load" | "file_read" | "file_write" | "tool_exec" | "llm_thinking" | "output_ready" | "error";
type StepStatus = "running" | "completed" | "failed";

interface PipelineStep {
  id: string;
  type: StepType;
  label: string;
  detail?: string;
  status: StepStatus;
  duration?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  pipeline?: PipelineStep[];
  streaming?: boolean;
}

const STEP_ICONS: Record<StepType, { icon: React.ElementType; color: string }> = {
  agent_init:      { icon: Cpu,          color: "text-gray-500" },
  skill_discovery: { icon: Compass,      color: "text-blue-600" },
  skill_load:      { icon: BookOpen,     color: "text-indigo-600" },
  memory_load:     { icon: Brain,        color: "text-purple-600" },
  file_read:       { icon: FileSearch,   color: "text-teal-600" },
  file_write:      { icon: FilePlus,     color: "text-green-600" },
  tool_exec:       { icon: Terminal,     color: "text-amber-600" },
  llm_thinking:    { icon: Sparkles,     color: "text-violet-500" },
  output_ready:    { icon: CheckCircle,  color: "text-green-600" },
  error:           { icon: AlertCircle,  color: "text-red-600" },
};

const demoScenarios: Record<string, { steps: Omit<PipelineStep, "id" | "status">[]; response: string }> = {
  default: {
    steps: [
      { type: "agent_init", label: "Initializing Skott Marketing Agent..." },
      { type: "skill_discovery", label: "Discovering relevant skills...", detail: "MQL analysis, campaign optimization, reporting" },
      { type: "memory_load", label: "Loading agent memory..." },
      { type: "skill_load", label: "Loading skill — campaign-analysis" },
      { type: "skill_load", label: "Loading skill — mql-reporting" },
      { type: "file_read", label: "Reading campaign-performance.json" },
      { type: "file_read", label: "Reading hubspot-mqls.json" },
      { type: "llm_thinking", label: "Analyzing..." },
    ],
    response: `## Marketing Performance Summary — May 2026

**Current MQL Status:** 312/month (31% of 1,000 target)

### Key Findings:

| Channel | MQLs | Cost/MQL | Trend |
|---------|------|----------|-------|
| Paid Search | 98 | $312 | ↓ -8% |
| Paid Social | 74 | $410 | ↑ +12% |
| Organic SEO | 47 | $0 | ↑ +4% |
| Events | 38 | $860 | — |
| Content | 31 | $220 | ↑ +8% |

### Recommended Actions:

1. **Immediate:** Rotate ad creative on G-Brand-01 — CTR has dropped 23% in 4 hours
2. **This week:** Scale LI-Retargeting-01 by +20% budget (cost/MQL 28% below target)
3. **This month:** Focus content distribution — 2 playbooks are published but undistributed

> The MQL trajectory shows consistent growth (+57% YTD) but acceleration is needed to reach 1,000/month by Q4. Paid channels need optimization while organic channels continue to outperform expectations.`
  },
};

function AgentConsolePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [pipelineCollapsed, setPipelineCollapsed] = useState<Record<number, boolean>>({});
  const abortRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const skottAgent = agents.find(a => a.id === "a1")!;

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) {
      router.replace("/agent-console");
      setTimeout(() => sendMessage(msg), 300);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;
    abortRef.current = false;
    setStreaming(true);

    const userMsg: Message = { role: "user", content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);

    const scenario = demoScenarios.default;
    const pipeline: PipelineStep[] = [];

    // Add empty assistant message
    setMessages(prev => [...prev, { role: "assistant", content: "", pipeline: [], streaming: true }]);

    // Simulate pipeline steps
    for (let i = 0; i < scenario.steps.length; i++) {
      if (abortRef.current) break;
      const step: PipelineStep = {
        id: `step-${i}`,
        ...scenario.steps[i],
        status: "running",
      };
      pipeline.push(step);
      setMessages(prev => prev.map((m, idx) =>
        idx === prev.length - 1 ? { ...m, pipeline: [...pipeline] } : m
      ));
      await sleep(300 + Math.random() * 250);
      if (abortRef.current) break;
      step.status = "completed";
      step.duration = Math.floor(200 + Math.random() * 600);
      setMessages(prev => prev.map((m, idx) =>
        idx === prev.length - 1 ? { ...m, pipeline: [...pipeline] } : m
      ));
    }

    if (abortRef.current) {
      setMessages(prev => prev.map((m, idx) =>
        idx === prev.length - 1 ? { ...m, streaming: false } : m
      ));
      setStreaming(false);
      return;
    }

    // Try real API, fall back to demo response
    try {
      const apiMessages = allMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let current = "";
        while (true) {
          if (abortRef.current) break;
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                current += parsed.text;
                setMessages(prev => prev.map((m, idx) =>
                  idx === prev.length - 1 ? { ...m, content: current } : m
                ));
              }
            } catch { /* skip */ }
          }
        }
      } else {
        throw new Error("API unavailable");
      }
    } catch {
      // Fallback to demo response
      const responseText = scenario.response;
      let current = "";
      for (const char of responseText) {
        if (abortRef.current) break;
        current += char;
        setMessages(prev => prev.map((m, idx) =>
          idx === prev.length - 1 ? { ...m, content: current } : m
        ));
        await sleep(char === "\n" ? 25 : 10);
      }
    }

    // Add output_ready step
    pipeline.push({ id: "step-final", type: "output_ready", label: "Output generated", status: "completed", duration: 0 });
    setMessages(prev => prev.map((m, idx) =>
      idx === prev.length - 1 ? { ...m, pipeline: [...pipeline], streaming: false } : m
    ));
    setStreaming(false);
  };

  const stopStream = () => {
    abortRef.current = true;
    setStreaming(false);
  };

  const togglePipeline = (idx: number) =>
    setPipelineCollapsed(p => ({ ...p, [idx]: !p[idx] }));

  return (
    <div className="flex h-full -mx-8 -my-6">
      {/* Main chat + pipeline */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Agent header */}
        <div className="px-6 py-4 border-b border-[hsl(30,15%,85%)] flex items-center gap-3 bg-[hsl(36,30%,97%)]">
          <div className="w-9 h-9 rounded-xl bg-[hsl(25,62%,25%)] flex items-center justify-center">
            <Bot size={18} className="text-[hsl(36,33%,94%)]" />
          </div>
          <div>
            <p className="font-serif text-sm font-[600] text-[hsl(25,40%,18%)]">Skott Marketing Agent</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(142,71%,45%)] animate-pulse-dot" />
              <span className="text-[11px] text-[hsl(25,20%,45%)]">Online & Ready · Claude Sonnet 4</span>
            </div>
          </div>
          <div className="ml-auto">
            <span className="text-[10px] bg-[hsl(25,20%,45%)]/10 text-[hsl(25,20%,45%)] px-2 py-1 rounded-full font-[500]">
              SAMPLE DATA
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-[hsl(25,62%,25%)]/10 flex items-center justify-center mb-4">
                <Sparkles size={28} className="text-[hsl(25,62%,25%)]" />
              </div>
              <h2 className="font-serif text-xl font-[500] text-[hsl(25,40%,18%)] mb-2">Ask Skott Anything</h2>
              <p className="text-sm text-[hsl(25,20%,45%)] max-w-sm mb-6">
                The marketing agent has full context — all skills, all campaign data, all memory.
              </p>
              <div className="grid grid-cols-2 gap-2 max-w-lg">
                {[
                  "Why did MQLs drop this week?",
                  "Which campaigns should I pause?",
                  "Generate a Q2 marketing report",
                  "What content should we publish next?",
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-sm text-left px-4 py-2.5 rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] text-[hsl(25,20%,45%)] hover:border-[hsl(25,62%,25%)]/30 hover:text-[hsl(25,40%,18%)] transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-[hsl(25,62%,25%)] flex items-center justify-center shrink-0 mt-1">
                  <Bot size={15} className="text-[hsl(36,33%,94%)]" />
                </div>
              )}
              <div className={cn("max-w-[85%]", msg.role === "user" ? "order-first" : "")}>
                {msg.role === "user" ? (
                  <div className="px-4 py-2.5 rounded-2xl bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)] text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Pipeline steps */}
                    {msg.pipeline && msg.pipeline.length > 0 && (
                      <div className="rounded-[0.75rem] border border-[hsl(30,15%,85%)] bg-[hsl(36,30%,96%)] overflow-hidden">
                        <button
                          onClick={() => togglePipeline(idx)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-[500] text-[hsl(25,20%,45%)] hover:bg-[hsl(30,15%,88%)] transition-colors"
                        >
                          {pipelineCollapsed[idx]
                            ? <ChevronRight size={12} />
                            : <ChevronDown size={12} />
                          }
                          {msg.streaming
                            ? `${msg.pipeline.filter(s => s.status === "completed").length} steps completed...`
                            : `▾ ${msg.pipeline.length} STEPS COMPLETED`
                          }
                        </button>
                        {!pipelineCollapsed[idx] && (
                          <div className="px-4 pb-3 space-y-1">
                            {msg.pipeline.map((step) => {
                              const { icon: Icon, color } = STEP_ICONS[step.type];
                              return (
                                <div key={step.id} className="flex items-center gap-2.5 py-1">
                                  <Icon size={13} className={color} />
                                  {step.status === "running" ? (
                                    <div className="w-3 h-3 border-2 border-[hsl(25,62%,25%)] border-t-transparent rounded-full animate-spin" />
                                  ) : step.status === "completed" ? (
                                    <CheckCircle size={12} className="text-[hsl(142,71%,45%)]" />
                                  ) : (
                                    <X size={12} className="text-red-500" />
                                  )}
                                  <span className="text-xs text-[hsl(25,20%,45%)] flex-1">{step.label}</span>
                                  {step.detail && <span className="text-[10px] text-[hsl(25,20%,55%)] italic max-w-[120px] truncate">{step.detail}</span>}
                                  {step.duration && <span className="text-[10px] text-[hsl(25,20%,55%)] ml-2">{(step.duration / 1000).toFixed(1)}s</span>}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Response text */}
                    {msg.content && (
                      <div className={cn(
                        "text-sm text-[hsl(25,40%,18%)] leading-relaxed prose prose-sm max-w-none",
                        msg.streaming && !msg.content.endsWith("\n") && "streaming-cursor"
                      )}>
                        <MarkdownRenderer content={msg.content} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="px-6 py-4 border-t border-[hsl(30,15%,85%)] bg-[hsl(36,30%,97%)]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[hsl(30,15%,85%)] glass-input focus-within:ring-2 focus-within:ring-[hsl(25,62%,25%)]/20">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { sendMessage(input); setInput(""); } }}
              placeholder="Message Skott Marketing Agent..."
              className="flex-1 bg-transparent outline-none text-sm text-[hsl(25,40%,18%)] placeholder:text-[hsl(25,20%,55%)]"
            />
            {streaming ? (
              <button
                onClick={stopStream}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <Square size={12} fill="white" />
              </button>
            ) : (
              <button
                onClick={() => { if (input.trim()) { sendMessage(input); setInput(""); } }}
                disabled={!input.trim()}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  input.trim() ? "bg-[hsl(25,62%,25%)] text-[hsl(36,33%,94%)]" : "text-[hsl(25,20%,55%)]"
                )}
              >
                <Send size={14} />
              </button>
            )}
          </div>
          <p className="text-center text-[11px] text-[hsl(25,20%,55%)] mt-2">
            AI can make mistakes. Verify critical marketing data.
          </p>
        </div>
      </div>

      {/* Right sidebar — Agent Context */}
      <div className="w-64 border-l border-[hsl(30,15%,85%)] bg-[hsl(36,30%,97%)] flex flex-col overflow-y-auto scrollbar-thin">
        <div className="px-4 py-4 border-b border-[hsl(30,15%,85%)]">
          <h3 className="font-serif text-sm font-[600] text-[hsl(25,40%,18%)]">Agent Context</h3>
        </div>

        <div className="p-4 space-y-4">
          {/* Active Skills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest font-[500] text-[hsl(25,20%,45%)]">Active Skills</span>
              <span className="text-[10px] bg-[hsl(25,20%,45%)]/10 text-[hsl(25,20%,45%)] px-1.5 py-0.5 rounded-full font-[500]">21</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["campaign-analysis", "mql-reporting", "seo-intelligence", "social-publishing", "brand-voice"].map(skill => (
                <span key={skill} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-[500] bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,35%)] border border-[hsl(142,71%,45%)]/20">
                  <div className="w-1 h-1 rounded-full bg-[hsl(142,71%,45%)]" />
                  {skill}
                </span>
              ))}
              <span className="text-[10px] text-[hsl(25,20%,45%)] px-2 py-0.5">+ 16 more</span>
            </div>
          </div>

          {/* Data Files */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest font-[500] text-[hsl(25,20%,45%)]">Data Files</span>
              <span className="text-[10px] bg-[hsl(25,20%,45%)]/10 text-[hsl(25,20%,45%)] px-1.5 py-0.5 rounded-full font-[500]">22</span>
            </div>
            <div className="space-y-1">
              {["campaign-performance.json", "hubspot-mqls.json", "ga4-organic.json", "seo-rankings.csv"].map(f => (
                <div key={f} className="flex items-center gap-1.5 text-[11px] text-[hsl(25,20%,45%)]">
                  <FileSearch size={11} className="text-teal-600 shrink-0" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
              <span className="text-[10px] text-[hsl(25,20%,45%)] pl-4">+ 18 more files</span>
            </div>
          </div>

          {/* Compliance */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest font-[500] text-[hsl(25,20%,45%)]">Compliance Guards</span>
              <span className="text-[10px] bg-[hsl(25,20%,45%)]/10 text-[hsl(25,20%,45%)] px-1.5 py-0.5 rounded-full font-[500]">4</span>
            </div>
            <div className="space-y-1">
              {[
                "Never share competitor data externally",
                "Brand voice must score >75 to publish",
                "Budget changes >$500/day need approval",
                "PII masked in all external outputs",
              ].map(r => (
                <div key={r} className="flex items-start gap-1.5 text-[11px] text-[hsl(25,20%,45%)] leading-relaxed">
                  <div className="w-3 h-3 rounded-full bg-[hsl(25,62%,25%)]/20 flex items-center justify-center mt-0.5 shrink-0">
                    <div className="w-1 h-1 rounded-full bg-[hsl(25,62%,25%)]" />
                  </div>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return <h2 key={i} className="font-serif text-base font-[600] text-[hsl(25,40%,18%)] mt-3 mb-1">{line.slice(3)}</h2>;
        if (line.startsWith("### ")) return <h3 key={i} className="font-serif text-sm font-[600] text-[hsl(25,40%,18%)] mt-2 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-[600] text-[hsl(25,40%,18%)]">{line.slice(2, -2)}</p>;
        if (line.startsWith("> ")) return <blockquote key={i} className="border-l-2 border-[hsl(25,62%,25%)] pl-3 text-[hsl(25,20%,45%)] italic text-xs">{line.slice(2)}</blockquote>;
        if (line.startsWith("| ") && line.includes("|")) {
          if (line.includes("---")) return null;
          const cells = line.split("|").filter(c => c.trim());
          return (
            <div key={i} className="flex gap-0 text-xs border-b border-[hsl(30,15%,88%)]">
              {cells.map((cell, j) => (
                <span key={j} className={cn("px-2 py-1 flex-1", j === 0 && "font-[500] text-[hsl(25,40%,18%)]", j > 0 && "text-[hsl(25,20%,45%)]")}>{cell.trim()}</span>
              ))}
            </div>
          );
        }
        if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
          return <p key={i} className="text-[hsl(25,20%,45%)]">{line}</p>;
        }
        if (line === "") return <div key={i} className="h-1" />;
        return <p key={i} className="text-[hsl(25,20%,45%)]">{line}</p>;
      })}
    </div>
  );
}

export default function AgentConsoleWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full text-[hsl(25,20%,45%)]">Loading...</div>}>
      <AgentConsolePage />
    </Suspense>
  );
}
