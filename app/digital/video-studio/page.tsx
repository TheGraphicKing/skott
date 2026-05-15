"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Plus, Download, Upload, Edit, Trash2, Search,
  CheckCircle, Clock, AlertCircle, Star, FileText,
  BarChart3, Users, Globe, Target, Zap, Sparkles,
  Video, Calendar, ChevronRight,
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

// ─── KPIs ────────────────────────────────────────────────────────────────────
const kpis = [
  { label: "Video Projects",  value: "12",    sub: "4 in production",   icon: Video,     color: PRIMARY },
  { label: "Published Videos", value: "8",   sub: "across platforms",   icon: CheckCircle, color: GREEN },
  { label: "Total Views",     value: "24.8K", sub: "+6.2K this month",  icon: BarChart3,  color: BLUE   },
  { label: "Avg Watch Time",  value: "3:24",  sub: "industry avg: 2:10", icon: Clock,     color: AMBER  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────
const projects = [
  { title: "Agentic OS Product Demo",          status: "Published",    platforms: ["YouTube", "LinkedIn"], duration: "4:32", views: "8,400", gradient: "linear-gradient(135deg,#7c3aed,#4f46e5)" },
  { title: "OGI Explainer Video",              status: "In Production", platforms: ["YouTube"],            duration: "3:15", views: "—",    gradient: "linear-gradient(135deg,#0284c7,#0891b2)" },
  { title: "Customer Story: Hitachi",          status: "Published",    platforms: ["LinkedIn", "Website"], duration: "2:48", views: "3,200", gradient: "linear-gradient(135deg,#059669,#10b981)" },
  { title: "Lyzr AgentMesh Technical Deep Dive", status: "Script Ready", platforms: ["YouTube"],          duration: "—",    views: "—",    gradient: "linear-gradient(135deg,#d97706,#f59e0b)" },
  { title: "CEO Vision: Siva on OGI",          status: "Storyboard",   platforms: ["YouTube", "LinkedIn", "Website"], duration: "—", views: "—", gradient: "linear-gradient(135deg,hsl(25,62%,25%),hsl(25,50%,40%))" },
  { title: "BFSI Solution Overview",           status: "Draft",        platforms: ["LinkedIn"],            duration: "—",    views: "—",    gradient: "linear-gradient(135deg,#dc2626,#ef4444)" },
];

// ─── Platform Publishing ──────────────────────────────────────────────────────
const platforms = [
  { name: "YouTube",   connected: true,  icon: "▶",  recentVideos: ["Agentic OS Product Demo", "Customer Story: Hitachi"] },
  { name: "LinkedIn",  connected: true,  icon: "in", recentVideos: ["Agentic OS Product Demo", "Customer Story: Hitachi"] },
  { name: "Twitter/X", connected: false, icon: "𝕏",  recentVideos: [] },
  { name: "Website",   connected: true,  icon: "🌐", recentVideos: ["Customer Story: Hitachi"] },
  { name: "Instagram", connected: false, icon: "📸", recentVideos: [] },
];

const TABS = ["Projects", "AI Generator", "Storyboard", "Publish"];

const statusColor = (s: string) => {
  if (s === "Published") return { bg: GREEN + "18", color: GREEN };
  if (s === "In Production") return { bg: BLUE + "18", color: BLUE };
  if (s === "Script Ready") return { bg: AMBER + "18", color: AMBER };
  if (s === "Storyboard") return { bg: PRIMARY + "20", color: PRIMARY };
  return { bg: BORDER, color: MUTED };
};

const GENERATED_SCRIPT = `🎬 SCENE 1 — HOOK (0:00 - 0:15)
[Visual: Split screen — overwhelmed marketing team vs. Skott AI dashboard]
VO: "What if your marketing team could do 10× the work, with zero burnout?"

🎬 SCENE 2 — PROBLEM (0:15 - 0:45)
[Visual: Stack of tasks, missed deadlines, siloed tools]
VO: "Today's CMOs face an impossible equation. More channels, more data, more demands — but the same 24 hours."

🎬 SCENE 3 — SOLUTION (0:45 - 1:30)
[Visual: Lyzr AI OGI agent activating, automating workflows]
VO: "Lyzr AI's Operator-Grade Intelligence changes everything. OGI doesn't just assist your team — it works autonomously, making real decisions across every marketing function."

🎬 SCENE 4 — FEATURES (1:30 - 2:15)
[Visual: Animated feature walk-through — content, campaigns, analytics, lead ops]
VO: "From content generation to campaign orchestration, lead scoring to competitive intelligence — OGI handles it end-to-end."

🎬 SCENE 5 — PROOF (2:15 - 2:45)
[Visual: Hitachi logo, metrics overlay]
VO: "Hitachi's marketing team shipped 4× more content and reduced campaign launch time by 60% in the first quarter."

🎬 SCENE 6 — CTA (2:45 - 3:00)
[Visual: Demo booking screen, lyzr.ai/demo]
VO: "Ready to transform your marketing? Book a free OGI demo at lyzr.ai/demo."`;

export default function VideoStudioPage() {
  const [activeTab, setActiveTab] = useState("Projects");
  const [generating, setGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");
  const [videoGoal, setVideoGoal] = useState("");
  const [audience, setAudience] = useState("Enterprise CMOs");
  const [tone, setTone] = useState("Professional");
  const [duration, setDuration] = useState("3 minutes");
  const [scenes, setScenes] = useState<string[]>(Array(6).fill(""));
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedScript("");
    await new Promise(r => setTimeout(r, 2000));
    setGeneratedScript(GENERATED_SCRIPT);
    setGenerating(false);
  };

  return (
    <div style={{ background: PAGE_BG, minHeight: "100vh", padding: "32px" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Video size={20} style={{ color: PRIMARY }} />
              <span style={{ color: MUTED, fontSize: 13 }}>Digital / Video Studio</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: DARK_TEXT }}>Video Studio</h1>
          </div>
          <button onClick={() => setShowNewProjectModal(true)} style={{ background: PRIMARY, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> New Project
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map((k, i) => (
            <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 13, color: MUTED }}>{k.label}</span>
                <div style={{ background: k.color + "18", padding: 8, borderRadius: 8 }}>
                  <k.icon size={16} style={{ color: k.color }} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: DARK_TEXT }}>{k.value}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{k.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4, width: "fit-content" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{ padding: "7px 18px", borderRadius: 7, fontSize: 13, fontWeight: activeTab === t ? 600 : 400,
                background: activeTab === t ? PRIMARY : "transparent", color: activeTab === t ? "#fff" : MUTED, cursor: "pointer", border: "none", transition: "all 0.2s" }}>
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── Projects ── */}
        {activeTab === "Projects" && (
          <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-3 gap-4">
              {projects.map((p, i) => {
                const sc = statusColor(p.status);
                return (
                  <motion.div key={p.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
                    {/* Thumbnail */}
                    <div style={{ height: 140, background: p.gradient, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
                        <Play size={20} style={{ color: "#fff" }} />
                      </div>
                      {p.duration !== "—" && (
                        <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 11, padding: "2px 6px", borderRadius: 4 }}>{p.duration}</div>
                      )}
                    </div>
                    <div style={{ padding: 16 }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div style={{ fontSize: 14, fontWeight: 600, color: DARK_TEXT, lineHeight: 1.3 }}>{p.title}</div>
                        <span style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, fontWeight: 600, whiteSpace: "nowrap", ...sc }}>{p.status}</span>
                      </div>
                      {/* Platforms */}
                      <div className="flex gap-1 mb-3">
                        {p.platforms.map(pl => (
                          <span key={pl} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: BLUE + "18", color: BLUE }}>{pl}</span>
                        ))}
                      </div>
                      {/* Views */}
                      {p.views !== "—" && (
                        <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>
                          <span style={{ fontWeight: 600, color: DARK_TEXT }}>{p.views}</span> views
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 11, cursor: "pointer" }}>Edit</button>
                        {p.status === "Published" && (
                          <button style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: `1px solid ${GREEN}40`, background: "transparent", color: GREEN, fontSize: 11, cursor: "pointer" }}>Analytics</button>
                        )}
                        {p.status !== "Published" && (
                          <button style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: `1px solid ${PRIMARY}40`, background: "transparent", color: PRIMARY, fontSize: 11, cursor: "pointer" }}>Continue</button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── AI Generator ── */}
        {activeTab === "AI Generator" && (
          <motion.div key="generator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-5 gap-6">
              {/* Form */}
              <div style={{ gridColumn: "span 2", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} style={{ color: PRIMARY }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>AI Script Generator</span>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 6 }}>Video Goal</label>
                  <textarea value={videoGoal} onChange={e => setVideoGoal(e.target.value)}
                    placeholder="e.g. Explain how Lyzr OGI helps enterprise marketing teams automate operations and scale output 10×"
                    rows={3}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT, outline: "none", resize: "none" }} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 6 }}>Target Audience</label>
                  <select value={audience} onChange={e => setAudience(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT }}>
                    <option>Enterprise CMOs</option>
                    <option>VP of Marketing</option>
                    <option>BFSI Decision Makers</option>
                    <option>Technical Buyers</option>
                    <option>SDR Teams</option>
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 6 }}>Platform</label>
                  <div className="flex flex-wrap gap-2">
                    {["YouTube", "LinkedIn", "Website", "Twitter/X"].map(pl => (
                      <label key={pl} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                        <input type="checkbox" defaultChecked={pl !== "Twitter/X"} />
                        <span style={{ fontSize: 12, color: DARK_TEXT }}>{pl}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 6 }}>Duration</label>
                    <select value={duration} onChange={e => setDuration(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT }}>
                      <option>60 seconds</option><option>2 minutes</option><option>3 minutes</option><option>5 minutes</option><option>10+ minutes</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 6 }}>Tone</label>
                    <select value={tone} onChange={e => setTone(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT }}>
                      <option>Professional</option><option>Conversational</option><option>Inspirational</option><option>Technical</option><option>Story-driven</option>
                    </select>
                  </div>
                </div>

                <button onClick={handleGenerate} disabled={generating}
                  style={{ width: "100%", padding: "12px 0", borderRadius: 8, background: generating ? MUTED : PRIMARY, color: "#fff", fontSize: 14, fontWeight: 600, cursor: generating ? "wait" : "pointer", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
                  {generating ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} />
                      Generating Script…
                    </>
                  ) : (
                    <><Sparkles size={16} /> Generate Script</>
                  )}
                </button>
              </div>

              {/* Generated Script */}
              <div style={{ gridColumn: "span 3", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, marginBottom: 16 }}>Generated Script</div>
                {!generatedScript && !generating && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 12 }}>
                    <FileText size={40} style={{ color: BORDER }} />
                    <div style={{ fontSize: 14, color: MUTED, textAlign: "center" }}>Fill in the form and click "Generate Script"<br />to create your AI-powered video script</div>
                  </div>
                )}
                {generating && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 12 }}>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <Sparkles size={40} style={{ color: PRIMARY }} />
                    </motion.div>
                    <div style={{ fontSize: 14, color: MUTED }}>AI is crafting your script…</div>
                  </div>
                )}
                {generatedScript && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ background: PAGE_BG, borderRadius: 8, padding: 16, whiteSpace: "pre-wrap", fontSize: 13, color: DARK_TEXT, lineHeight: 1.7, marginBottom: 16, maxHeight: 380, overflowY: "auto", fontFamily: "monospace" }}>
                      {generatedScript}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => navigator.clipboard?.writeText(generatedScript)} style={{ flex: 1, padding: "9px 0", borderRadius: 7, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer" }}>Copy Script</button>
                      <button style={{ flex: 1, padding: "9px 0", borderRadius: 7, background: PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Use in Project</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Storyboard ── */}
        {activeTab === "Storyboard" && (
          <motion.div key="storyboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>Visual Storyboard Builder</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>Add scenes to build your video storyboard</div>
                </div>
                <button onClick={() => setScenes(s => [...s, ""])} style={{ background: PRIMARY, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <Plus size={14} /> Add Scene
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {scenes.map((scene, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                    style={{ border: `2px dashed ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
                    {/* Thumbnail area */}
                    <div style={{ height: 120, background: `hsl(${210 + i * 30},40%,90%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6, position: "relative" }}>
                      <div style={{ position: "absolute", top: 8, left: 8, background: PRIMARY, color: "#fff", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                        {i + 1}
                      </div>
                      <Upload size={20} style={{ color: MUTED }} />
                      <div style={{ fontSize: 11, color: MUTED }}>Upload or generate</div>
                    </div>
                    {/* Script text */}
                    <div style={{ padding: 10 }}>
                      <textarea value={scene} onChange={e => setScenes(s => s.map((x, j) => j === i ? e.target.value : x))}
                        placeholder={`Scene ${i + 1} script/notes…`} rows={2}
                        style={{ width: "100%", fontSize: 12, color: DARK_TEXT, border: "none", background: "transparent", outline: "none", resize: "none", fontFamily: "inherit" }} />
                    </div>
                    <div style={{ padding: "8px 10px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 6 }}>
                      <button style={{ flex: 1, padding: "4px 0", borderRadius: 4, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 10, cursor: "pointer" }}>Generate Image</button>
                      <button onClick={() => setScenes(s => s.filter((_, j) => j !== i))} style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid ${RED}30`, background: "transparent", color: RED, fontSize: 10, cursor: "pointer" }}>✕</button>
                    </div>
                  </motion.div>
                ))}

                {/* Add scene placeholder */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => setScenes(s => [...s, ""])}
                  style={{ border: `2px dashed ${BORDER}`, borderRadius: 10, height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
                  <Plus size={24} style={{ color: BORDER }} />
                  <div style={{ fontSize: 12, color: MUTED }}>Add Scene</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Publish ── */}
        {activeTab === "Publish" && (
          <motion.div key="publish" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-2 gap-4">
              {platforms.map((pl, i) => (
                <motion.div key={pl.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ background: CARD, border: `1px solid ${pl.connected ? BORDER : BORDER}`, borderRadius: 12, padding: 20 }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: pl.connected ? PRIMARY + "18" : BORDER, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                        {pl.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>{pl.name}</div>
                        <div style={{ fontSize: 12, color: pl.connected ? GREEN : RED, fontWeight: 500 }}>
                          {pl.connected ? "✓ Connected" : "✗ Not connected"}
                        </div>
                      </div>
                    </div>
                    {pl.connected ? (
                      <button style={{ padding: "7px 16px", borderRadius: 7, background: PRIMARY, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none" }}>Publish</button>
                    ) : (
                      <button style={{ padding: "7px 16px", borderRadius: 7, background: "transparent", border: `1px solid ${BORDER}`, color: MUTED, fontSize: 12, cursor: "pointer" }}>Connect</button>
                    )}
                  </div>
                  {pl.connected && pl.recentVideos.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Recent Publishes</div>
                      <div className="flex flex-col gap-2">
                        {pl.recentVideos.map(v => (
                          <div key={v} className="flex items-center gap-2">
                            <CheckCircle size={12} style={{ color: GREEN }} />
                            <span style={{ fontSize: 12, color: DARK_TEXT }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!pl.connected && (
                    <div style={{ padding: 12, background: PAGE_BG, borderRadius: 7, fontSize: 12, color: MUTED }}>
                      Connect your {pl.name} account to publish videos directly from Video Studio.
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Project Modal */}
      <AnimatePresence>
        {showNewProjectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setShowNewProjectModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ background: CARD, borderRadius: 14, padding: 28, width: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>New Video Project</h3>
              {[{ label: "Project Title", ph: "e.g. Q3 Product Demo" }, { label: "Goal", ph: "e.g. Drive demo bookings for BFSI segment" }].map(f => (
                <div key={f.label} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>{f.label}</label>
                  <input placeholder={f.ph} style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT, outline: "none" }} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[{ label: "Platform", options: ["YouTube", "LinkedIn", "Website", "All"] }, { label: "Status", options: ["Draft", "Script Ready", "Storyboard", "In Production"] }].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "block", marginBottom: 4 }}>{f.label}</label>
                    <select style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: PAGE_BG, fontSize: 13, color: DARK_TEXT }}>
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowNewProjectModal(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                <button onClick={() => setShowNewProjectModal(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, background: PRIMARY, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Create Project</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
