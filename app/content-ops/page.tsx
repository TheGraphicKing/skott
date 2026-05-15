"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Clock, CheckCircle2, TrendingUp, Loader2, X,
  Plus, ChevronLeft, ChevronRight, Copy, Sparkles, Edit2,
  Zap,
} from "lucide-react";

// ─── Design Tokens ───────────────────────────────────────────────────────────
const PRIMARY   = "hsl(25,62%,25%)";
const MUTED     = "hsl(25,20%,50%)";
const CARD      = "hsl(36,30%,97%)";
const BORDER    = "hsl(30,15%,87%)";
const PAGE_BG   = "hsl(36,33%,94%)";
const GREEN     = "hsl(142,55%,35%)";
const RED       = "#dc2626";
const AMBER     = "#d97706";
const BLUE      = "#2563eb";
const DARK_TEXT = "#3a1f0e";

// ─── Calendar events ─────────────────────────────────────────────────────────
const calEvents: Record<number, { title: string; type: string; status: string; color: string; owner: string }[]> = {
  3:  [{ title: "LinkedIn Post",            type: "Social",    status: "SCHEDULED", color: BLUE,    owner: "PS" }],
  5:  [{ title: 'Blog: Agentic AI for BFSI',type: "Blog",      status: "PUBLISHED", color: GREEN,   owner: "EW" }],
  8:  [{ title: "Email Newsletter",          type: "Email",     status: "SCHEDULED", color: PRIMARY, owner: "JL" }],
  10: [{ title: "Webinar Recap",             type: "Video",     status: "SCHEDULED", color: AMBER,   owner: "MB" }],
  12: [{ title: "Case Study: Hitachi",       type: "Case Study",status: "PUBLISHED", color: GREEN,   owner: "RP" }],
  15: [{ title: "Press Release: AWS",        type: "PR",        status: "IN REVIEW", color: AMBER,   owner: "JT" }],
  17: [{ title: "LinkedIn Carousel",         type: "Social",    status: "SCHEDULED", color: BLUE,    owner: "PS" }],
  20: [{ title: 'Blog: ROI of AI Agents',   type: "Blog",      status: "DRAFT",     color: "#9CA3AF",owner: "DK" }],
  22: [{ title: "Product Update Email",      type: "Email",     status: "SCHEDULED", color: PRIMARY, owner: "JL" }],
  25: [{ title: "OGI Whitepaper",            type: "Whitepaper",status: "OVERDUE",   color: RED,     owner: "RP" }],
  28: [{ title: "Q2 Board Report",           type: "Report",    status: "SCHEDULED", color: PRIMARY, owner: "DK" }],
};

// ─── Kanban data ─────────────────────────────────────────────────────────────
const kanban = {
  Draft: [
    { title: "ROI of AI Agents",   type: "Blog",         owner: "DK", due: "May 20" },
    { title: "APAC Email Series",  type: "Email",        owner: "JL", due: "May 22" },
    { title: "Series B Prep Deck", type: "Presentation", owner: "RP", due: "May 30" },
  ],
  "In Review": [
    { title: "AWS PR",              type: "Design",  owner: "JT", due: "May 15" },
    { title: "Hitachi Case Study Video", type: "Design", owner: "MB", due: "May 18" },
    { title: "Q3 Strategy Doc",    type: "Blog",    owner: "EW", due: "May 19" },
    { title: "LinkedIn Ad Copy Pack", type: "Design", owner: "PS", due: "May 16" },
  ],
  Approved: [
    { title: "BFSI Hero Image",  type: "Design", owner: "MB", due: "May 14" },
    { title: "Email Header x5",  type: "Design", owner: "MB", due: "May 14" },
  ],
  Published: [
    { title: "Agentic AI for BFSI",   type: "Blog",         owner: "EW", due: "May 5"  },
    { title: "Hitachi Case Study PDF", type: "Design",       owner: "RP", due: "May 12" },
    { title: "AWS Announcement Email", type: "Email",        owner: "JT", due: "May 8"  },
    { title: "Series A PR",            type: "Design",       owner: "JT", due: "May 1"  },
    { title: "Q1 Board Report",        type: "Presentation", owner: "DK", due: "May 1"  },
  ],
};

// ─── AI Generator data ───────────────────────────────────────────────────────
const GENERATED: Record<string, { body: string; subject?: string }> = {
  LinkedIn: {
    body: "🚀 Hitachi's marketing team reduced campaign management time by 60% using Lyzr AI.\n\nHere's what changed:\n• Automated 80% of repetitive campaign tasks\n• Cut time-to-launch from 3 weeks → 4 days\n• Generated $890K pipeline in Q1 from AI-assisted content\n• Brand voice consistency score: 94%\n\nAgentic AI isn't the future of marketing — it's the present. Teams using Lyzr's CMO Office OS are running circles around competitors still doing things manually.\n\nThe question isn't whether to adopt AI agents. It's whether you can afford not to. 👇\n\n#AgenticAI #MarketingOS #Lyzr #EnterpriseMarketing",
  },
  "Twitter/X": {
    body: "1/4 Hitachi cut marketing ops time by 60% with @LyzrAI. Here's the breakdown 🧵\n\n2/4 Before Lyzr: 3-week campaign cycles, 80% manual work, inconsistent brand voice across 12 markets.\n\n3/4 After Lyzr CMO Office OS: 4-day launches, AI agents handling research/copy/scheduling, 94% brand voice score.\n\n4/4 The result? $890K pipeline from content in Q1 alone. This is what agentic AI looks like in practice. → lyzr.ai #AgenticAI",
  },
  "Blog Post": {
    body: "How Hitachi Reduced Marketing Operations Time by 60% with Lyzr AI\n\nIn today's hyper-competitive B2B landscape, marketing teams face a paradox: do more, faster, with fewer resources — without sacrificing quality.\n\nHitachi's enterprise marketing division was no exception. Managing campaigns across 12 global markets with a lean team, they needed a solution that could scale their output without scaling headcount.\n\nEnter Lyzr's CMO Office OS — an agentic AI platform built specifically for enterprise marketing teams.\n\nAfter deploying Lyzr, Hitachi saw immediate results: campaign launch time dropped from 3 weeks to 4 days, brand voice consistency hit 94%, and Q1 pipeline from content reached $890K — a 18% increase over the previous quarter.",
  },
  Email: {
    subject: "How Hitachi cut campaign launch time by 60% [case study]",
    body: "Hi [First Name],\n\nI wanted to share a quick win from one of our customers that might be relevant to your team.\n\nHitachi's marketing division deployed Lyzr CMO Office OS in January and saw immediate results:\n\n→ Campaign launch time: 3 weeks → 4 days\n→ Brand voice score: 94% consistency\n→ Pipeline from content: $890K in Q1 (+18%)\n\nThey now run campaigns across 12 global markets with the same headcount — powered by AI agents that handle research, copy, scheduling, and reporting.\n\nWould a 20-minute demo make sense this week?\n\nBest,\n[Your Name]",
  },
  "YouTube Script": {
    body: "HOOK (0–10s): What if your marketing team could do the work of 10 people — in half the time? That's not an exaggeration. That's what Hitachi achieved with Lyzr AI.\n\nSETUP (10–45s): Hitachi's marketing team was stretched across 12 global markets, running campaigns manually with 3-week launch cycles. They needed to scale without hiring.\n\nSOLUTION (45s–2m): Enter Lyzr CMO Office OS — an agentic AI platform that handles campaign planning, content generation, budget intelligence, and performance reporting.\n\nRESULTS (2m–3m): After deploying Lyzr: 60% reduction in ops time, 4-day campaign launches, $890K pipeline from content in Q1 alone.\n\nCTA (3m): Ready to see this in action? Click the link below for a live demo. See you there. ↓",
  },
  "Press Release": {
    body: "FOR IMMEDIATE RELEASE\n\nLyzr AI Helps Hitachi Cut Marketing Operations Time by 60%\n\nSAN FRANCISCO, May 15, 2026 — Lyzr AI, the enterprise agentic AI platform for marketing teams, today announced that Hitachi's global marketing division has achieved a 60% reduction in marketing operations time following deployment of the Lyzr CMO Office OS.\n\nHitachi now launches campaigns in 4 days — down from 3 weeks — while maintaining a 94% brand voice consistency score across 12 global markets. Pipeline generated from AI-assisted content reached $890K in Q1 FY2026, an 18% increase quarter-over-quarter.\n\n\"Lyzr has fundamentally changed how our marketing team operates,\" said James L., VP Marketing at Hitachi. \"We're doing more than ever before with the same headcount.\"\n\nAbout Lyzr AI: Lyzr builds enterprise-grade agentic AI systems for marketing, finance, and operations teams. lyzr.ai",
  },
};

const activeCampaigns = ["BFSI Vertical Launch", "LinkedIn ABM", "AWS Partnership", "Select Campaign"];
type ToneKey = "Professional" | "Conversational" | "Bold" | "Educational";
const TONES: ToneKey[] = ["Professional", "Conversational", "Bold", "Educational"];
const PLATFORMS = ["LinkedIn", "Twitter/X", "Blog Post", "Email", "YouTube Script", "Press Release"];

// ─── Toast ───────────────────────────────────────────────────────────────────
type ToastData = { msg: string; color: string };

function Toast({ msg, color, onClose }: ToastData & { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      style={{
        position: "fixed", top: 16, right: 16, zIndex: 50,
        background: CARD, borderLeft: `4px solid ${color}`,
        padding: "12px 20px", borderRadius: 10,
        display: "flex", alignItems: "center", gap: 10,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        minWidth: 280, fontSize: 14, fontWeight: 500, color: DARK_TEXT,
      }}
    >
      <CheckCircle2 size={16} style={{ color }} />
      {msg}
      <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: MUTED, cursor: "pointer" }}>
        <X size={14} />
      </button>
    </motion.div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accent }: { label: string; value: string; sub: string; icon: any; accent?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{label}</span>
        <div style={{ background: PAGE_BG, borderRadius: 8, padding: 6 }}>
          <Icon size={16} style={{ color: accent || PRIMARY }} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: DARK_TEXT }}>{value}</div>
      <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{sub}</div>
    </motion.div>
  );
}

// ─── Type Badge ───────────────────────────────────────────────────────────────
const typeColorMap: Record<string, string> = {
  Blog: BLUE, Email: AMBER, Social: GREEN, PR: "hsl(280,45%,40%)",
  Video: RED, "Case Study": PRIMARY, Whitepaper: MUTED,
  Presentation: BLUE, Doc: AMBER, Design: GREEN, Report: PRIMARY,
};
function TypeBadge({ type }: { type: string }) {
  const c = typeColorMap[type] || MUTED;
  return (
    <span style={{ background: c + "18", color: c, borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 700 }}>
      {type}
    </span>
  );
}

// ─── May 2026 Calendar ────────────────────────────────────────────────────────
// May 1 2026 = Friday. With Sun=0 grid: offset = 5
const MAY_START_DOW = 5;
const MAY_DAYS = 31;
const TODAY = 15; // May 15

function CalendarTab({ onAddModal, showToast }: { onAddModal: () => void; showToast: (m: string, c: string) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelected(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const cells: (number | null)[] = [];
  for (let i = 0; i < MAY_START_DOW; i++) cells.push(null);
  for (let d = 1; d <= MAY_DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div ref={containerRef}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ChevronLeft size={16} style={{ color: MUTED, cursor: "pointer" }} />
          <span style={{ fontWeight: 700, color: DARK_TEXT, fontSize: 15 }}>May 2026</span>
          <ChevronRight size={16} style={{ color: MUTED, cursor: "pointer" }} />
        </div>
        <button onClick={onAddModal}
          style={{ background: PRIMARY, color: "hsl(36,33%,94%)", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          <Plus size={13} /> Add Content
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1, background: BORDER, borderRadius: 10, overflow: "hidden" }}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} style={{ background: PAGE_BG, textAlign: "center", padding: "6px 0", fontSize: 11, fontWeight: 700, color: MUTED }}>{d}</div>
        ))}
        {cells.map((day, i) => {
          const evts = day ? (calEvents[day] || []) : [];
          const isSelected = selected === day;
          const isToday = day === TODAY;
          return (
            <div key={i}
              onClick={() => day && evts.length && setSelected(isSelected ? null : day)}
              style={{
                background: day ? CARD : PAGE_BG,
                minHeight: 80, padding: "6px 8px",
                cursor: day && evts.length ? "pointer" : "default",
                position: "relative",
                outline: isToday ? `2px solid ${PRIMARY}` : "none",
                outlineOffset: -2,
              }}>
              {day && (
                <>
                  <div style={{ fontSize: 12, fontWeight: isToday ? 800 : 400, color: isToday ? PRIMARY : DARK_TEXT, marginBottom: 4 }}>{day}</div>
                  {evts.map((e, ei) => (
                    <div key={ei} style={{ background: e.color + "20", borderLeft: `3px solid ${e.color}`, borderRadius: 3, padding: "1px 4px", marginBottom: 2 }}>
                      <span style={{ fontSize: 9, color: DARK_TEXT, lineHeight: 1.2, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {e.title.length > 14 ? e.title.slice(0, 13) + "…" : e.title}
                      </span>
                    </div>
                  ))}
                  {isSelected && evts.length > 0 && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      style={{
                        position: "absolute", top: "100%", left: 0, zIndex: 30,
                        background: CARD, border: `1px solid ${BORDER}`,
                        borderRadius: 10, padding: 14, minWidth: 240,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                      }}>
                      {evts.map((e, ei) => (
                        <div key={ei} style={{ marginBottom: ei < evts.length - 1 ? 12 : 0 }}>
                          <div style={{ fontWeight: 700, color: DARK_TEXT, fontSize: 13, marginBottom: 5 }}>{e.title}</div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                            <TypeBadge type={e.type} />
                            <span style={{
                              background: e.status === "PUBLISHED" ? GREEN + "18" : e.status === "OVERDUE" ? RED + "18" : e.status === "IN REVIEW" ? AMBER + "18" : PRIMARY + "18",
                              color: e.status === "PUBLISHED" ? GREEN : e.status === "OVERDUE" ? RED : e.status === "IN REVIEW" ? AMBER : PRIMARY,
                              fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px",
                            }}>{e.status}</span>
                          </div>
                          <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>Owner: {e.owner}</div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, color: DARK_TEXT, cursor: "pointer" }}>Edit</button>
                            <button style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, color: DARK_TEXT, cursor: "pointer" }}>View</button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Kanban Tab ───────────────────────────────────────────────────────────────
function KanbanTab() {
  const cols = Object.keys(kanban) as (keyof typeof kanban)[];
  const colColors: Record<string, string> = { Draft: MUTED, "In Review": AMBER, Approved: BLUE, Published: GREEN };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
      {cols.map(col => (
        <div key={col}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: colColors[col] }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: MUTED }}>{col.toUpperCase()}</span>
            <span style={{ marginLeft: "auto", background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 99, padding: "1px 7px", fontSize: 11, color: MUTED }}>
              {kanban[col].length}
            </span>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 12, minHeight: 400 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {kanban[col].map((card, i) => (
                <motion.div key={i}
                  whileHover={{ y: -2, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                  style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 12, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ marginBottom: 6 }}><TypeBadge type={card.type} /></div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT, lineHeight: 1.3, marginBottom: 8 }}>{card.title}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: PRIMARY, color: "hsl(36,33%,94%)", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {card.owner}
                    </div>
                    <span style={{ fontSize: 10, color: MUTED }}>{card.due}</span>
                  </div>
                  {col === "Published" && (
                    <div style={{ marginTop: 6 }}>
                      <span style={{ background: GREEN + "18", color: GREEN, fontSize: 9, fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>✓ PUBLISHED</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── AI Generator Tab ─────────────────────────────────────────────────────────
function AIGeneratorTab() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["LinkedIn", "Twitter/X", "Email"]);
  const [tone, setTone] = useState<ToneKey>("Professional");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [generated, setGenerated] = useState<string[]>([]);
  const [campaignDropdown, setCampaignDropdown] = useState<number | null>(null);

  const LOAD_STEPS = ["Analyzing topic…", "Generating variants…", "Applying brand voice…"];

  function showToast(msg: string, color: string = GREEN) {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  }

  function togglePlatform(p: string) {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }

  async function handleGenerate() {
    if (selectedPlatforms.length === 0) return;
    setLoading(true);
    setGenerated([]);
    setLoadingStep(0);
    await new Promise(r => setTimeout(r, 800));
    setLoadingStep(1);
    await new Promise(r => setTimeout(r, 900));
    setLoadingStep(2);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setGenerated(selectedPlatforms.slice(0, 3));
  }

  return (
    <div>
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} color={toast.color} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <p style={{ textAlign: "center", fontSize: 13, color: MUTED, marginBottom: 20 }}>
        Generate content for multiple platforms simultaneously
      </p>

      {/* Platform multi-select */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: MUTED, display: "block", marginBottom: 10 }}>PLATFORMS</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {PLATFORMS.map(p => {
            const active = selectedPlatforms.includes(p);
            return (
              <label key={p} onClick={() => togglePlatform(p)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                  background: active ? PRIMARY + "15" : PAGE_BG,
                  border: `1px solid ${active ? PRIMARY : BORDER}`,
                  borderRadius: 8, padding: "8px 12px",
                  fontSize: 12, fontWeight: active ? 600 : 400, color: active ? PRIMARY : MUTED,
                  transition: "all 0.15s",
                }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${active ? PRIMARY : BORDER}`, background: active ? PRIMARY : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {active && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                </div>
                {p}
              </label>
            );
          })}
        </div>
      </div>

      {/* Tone selector */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: MUTED, display: "block", marginBottom: 10 }}>TONE</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TONES.map(t => (
            <button key={t} onClick={() => setTone(t)}
              style={{
                background: tone === t ? PRIMARY : PAGE_BG,
                color: tone === t ? "#fff" : DARK_TEXT,
                border: `1px solid ${tone === t ? PRIMARY : BORDER}`,
                borderRadius: 99, padding: "7px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer",
                transition: "all 0.15s",
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Topic input */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: MUTED, display: "block", marginBottom: 8 }}>TOPIC</label>
        <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3}
          placeholder="Describe the content topic... e.g. 'How Lyzr AI reduced Hitachi's marketing ops time by 60%'"
          style={{ width: "100%", background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: DARK_TEXT, resize: "vertical", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }} />
      </div>

      {/* Generate button */}
      <button onClick={handleGenerate} disabled={loading || selectedPlatforms.length === 0}
        style={{
          width: "100%", background: loading || selectedPlatforms.length === 0 ? MUTED : PRIMARY,
          color: "#fff", border: "none", borderRadius: 12, padding: "16px",
          fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24,
          transition: "background 0.15s",
        }}>
        {loading ? (
          <>
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            {LOAD_STEPS[loadingStep]}
          </>
        ) : (
          <><Sparkles size={16} /> ✨ Generate for All Selected Platforms</>
        )}
      </button>

      {/* Generated cards */}
      <AnimatePresence>
        {generated.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {generated.map((platform, idx) => {
              const data = GENERATED[platform];
              return (
                <motion.div key={platform}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.12 }}
                  style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <TypeBadge type={platform === "Twitter/X" ? "Social" : platform === "YouTube Script" ? "Video" : platform === "Blog Post" ? "Blog" : platform === "Email" ? "Email" : platform === "Press Release" ? "PR" : "Social"} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: MUTED }}>{platform}</span>
                  </div>
                  {data?.subject && (
                    <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 6 }}>Subject: {data.subject}</div>
                  )}
                  <p style={{ fontSize: 12, color: DARK_TEXT, lineHeight: 1.6, marginBottom: 14, whiteSpace: "pre-line" }}>
                    {(data?.body || "").slice(0, 300)}{(data?.body || "").length > 300 ? "…" : ""}
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", position: "relative" }}>
                    <button onClick={() => { navigator.clipboard?.writeText(data?.body || ""); showToast("📋 Copied to clipboard", BLUE); }}
                      style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 7, padding: "6px 10px", fontSize: 11, color: DARK_TEXT, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                      <Copy size={10} /> Copy
                    </button>
                    <button style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 7, padding: "6px 10px", fontSize: 11, color: DARK_TEXT, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                      <Edit2 size={10} /> Edit
                    </button>
                    <div style={{ position: "relative" }}>
                      <button onClick={() => setCampaignDropdown(campaignDropdown === idx ? null : idx)}
                        style={{ background: PRIMARY, color: "hsl(36,33%,94%)", border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                        <Zap size={10} /> Use in Campaign
                      </button>
                      <AnimatePresence>
                        {campaignDropdown === idx && (
                          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            style={{ position: "absolute", top: "110%", left: 0, zIndex: 20, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 6, minWidth: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}>
                            {activeCampaigns.map(c => (
                              <button key={c} onClick={() => { setCampaignDropdown(null); if (c !== "Select Campaign") showToast(`Content added to ${c}.`, GREEN); }}
                                style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "8px 10px", fontSize: 12, color: c === "Select Campaign" ? MUTED : DARK_TEXT, cursor: "pointer", borderRadius: 6, fontStyle: c === "Select Campaign" ? "italic" : "normal" }}
                                onMouseEnter={e => { if (c !== "Select Campaign") e.currentTarget.style.background = PAGE_BG; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
                                {c}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Add Content Modal ────────────────────────────────────────────────────────
function AddModal({ onClose, showToast }: { onClose: () => void; showToast: (m: string, c: string) => void }) {
  function handleAdd() {
    onClose();
    showToast("Content item added to calendar.", GREEN);
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28, width: 400, boxShadow: "0 16px 48px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, margin: 0 }}>Add Content Item</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input placeholder="Title" style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: DARK_TEXT, width: "100%", boxSizing: "border-box" }} />
          <select style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: DARK_TEXT }}>
            {["Blog","Email","Social","PR","Video","Case Study","Whitepaper","Report"].map(t => <option key={t}>{t}</option>)}
          </select>
          <input type="date" defaultValue="2026-05-20" style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: DARK_TEXT }} />
          <select style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: DARK_TEXT }}>
            {["DK — David K.","EW — Emily W.","JL — James L.","MB — Maria B.","PS — Priya S.","RP — Raj P.","JT — Jake T."].map(o => <option key={o}>{o}</option>)}
          </select>
          <button onClick={handleAdd}
            style={{ background: PRIMARY, color: "hsl(36,33%,94%)", border: "none", borderRadius: 9, padding: "10px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Add
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ContentOpsPage() {
  const [activeTab, setActiveTab] = useState<"Calendar" | "Asset Pipeline" | "AI Generator">("Calendar");
  const [toast, setToast] = useState<ToastData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs = ["Calendar", "Asset Pipeline", "AI Generator"] as const;

  function showToast(msg: string, color: string = GREEN) {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "32px 40px", fontFamily: "Inter, sans-serif" }}>
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} color={toast.color} onClose={() => setToast(null)} />}
        {showAddModal && <AddModal onClose={() => setShowAddModal(false)} showToast={showToast} />}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: DARK_TEXT, margin: 0 }}>Content Operations</h1>
        <p style={{ color: MUTED, marginTop: 4, fontSize: 14 }}>Content calendar, asset pipeline &amp; AI content generation</p>
      </motion.div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16, marginBottom: 16 }}>
        <StatCard label="Published"              value="42"        sub="↑8 vs last month"      icon={FileText}   />
        <StatCard label="Avg Time to Publish"    value="3.2 days"  sub="↓0.8 days"             icon={Clock}      accent={GREEN} />
        <StatCard label="Brand Voice Score"      value="94%"       sub="↑2% vs last month"     icon={CheckCircle2} accent={GREEN} />
        <StatCard label="Pipeline from Content"  value="$890K"     sub="↑18%"                  icon={TrendingUp} accent={BLUE} />
      </div>

      {/* Tabs panel */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: PAGE_BG, borderRadius: 10, padding: 4, width: "fit-content" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{
                background: activeTab === t ? CARD : "transparent",
                color: activeTab === t ? DARK_TEXT : MUTED,
                border: activeTab === t ? `1px solid ${BORDER}` : "1px solid transparent",
                borderRadius: 8, padding: "7px 18px", fontSize: 13, fontWeight: activeTab === t ? 600 : 400,
                cursor: "pointer", transition: "all 0.15s",
              }}>
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}>
            {activeTab === "Calendar"       && <CalendarTab onAddModal={() => setShowAddModal(true)} showToast={showToast} />}
            {activeTab === "Asset Pipeline" && <KanbanTab />}
            {activeTab === "AI Generator"   && <AIGeneratorTab />}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
