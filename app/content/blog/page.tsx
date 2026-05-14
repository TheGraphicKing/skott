"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine,
  Search,
  Globe,
  Cpu,
  Image,
  Upload,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  X,
  ChevronDown,
  TrendingUp,
  Eye,
  Calendar,
  ThumbsUp,
  Edit3,
} from "lucide-react";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

const bg = "hsl(36,33%,94%)";
const card = "hsl(36,30%,97%)";
const border = "hsl(30,15%,87%)";
const primaryText = "hsl(25,40%,18%)";
const mutedText = "hsl(25,20%,50%)";
const brown = "hsl(25,62%,25%)";

type FilterKey = "All" | "Published" | "In Review" | "Draft";

interface BlogPost {
  id: number;
  title: string;
  keyword: string;
  status: "Draft" | "In Review" | "Published" | "Live";
  traffic: string;
  date: string;
}

const blogPosts: BlogPost[] = [
  { id: 1, title: "How AI Agents Are Replacing Traditional Marketing Teams", keyword: "AI marketing agents", status: "Live", traffic: "5.2K", date: "2025-04-12" },
  { id: 2, title: "Top 10 B2B SaaS Content Strategies for 2025", keyword: "B2B content strategy", status: "Live", traffic: "3.8K", date: "2025-04-18" },
  { id: 3, title: "Prompt Engineering for Marketing Copy: A Deep Dive", keyword: "prompt engineering marketing", status: "Live", traffic: "2.1K", date: "2025-04-30" },
  { id: 4, title: "Why LLM-Powered SEO is Outperforming Manual Efforts", keyword: "LLM SEO automation", status: "Published", traffic: "1.4K", date: "2025-05-05" },
  { id: 5, title: "Building a Content Moat with AI-Assisted Research", keyword: "AI content research", status: "In Review", traffic: "—", date: "—" },
  { id: 6, title: "The ROI of Autonomous Marketing: Real Numbers", keyword: "marketing automation ROI", status: "In Review", traffic: "—", date: "—" },
  { id: 7, title: "Claude vs GPT-4 for Enterprise Marketing Use Cases", keyword: "Claude GPT marketing", status: "Draft", traffic: "—", date: "—" },
  { id: 8, title: "Scaling Content Without Scaling Headcount", keyword: "content scaling AI", status: "Draft", traffic: "—", date: "—" },
];

const pipelineStages = [
  { icon: Search, label: "Keyword Research", status: "completed" },
  { icon: Globe, label: "Context Fetch via Perplexity", status: "completed" },
  { icon: Cpu, label: "Draft via Claude Sonnet 4", status: "running" },
  { icon: Image, label: "Image via Imagen 4", status: "pending" },
  { icon: Upload, label: "WordPress Publish", status: "pending" },
];

const kpiCards = [
  { label: "Posts Published", value: "24", icon: PenLine, delta: "+4 this month" },
  { label: "Avg Organic Traffic", value: "2.8K/post", icon: TrendingUp, delta: "+12% vs last month" },
  { label: "Avg Time to Rank", value: "18 days", icon: Clock, delta: "−3 days vs avg" },
  { label: "Keyword Coverage", value: "89%", icon: Eye, delta: "14 clusters covered" },
];

const statusColors: Record<string, string> = {
  Live: "hsl(142,71%,35%)",
  Published: "hsl(217,91%,50%)",
  "In Review": "hsl(38,92%,50%)",
  Draft: "hsl(25,20%,50%)",
};

const statusBg: Record<string, string> = {
  Live: "hsl(142,71%,45%,0.12)",
  Published: "hsl(217,91%,60%,0.12)",
  "In Review": "hsl(38,92%,50%,0.12)",
  Draft: "hsl(25,20%,60%,0.1)",
};

export default function BlogWriterPage() {
  const [filter, setFilter] = useState<FilterKey>("All");
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("");
  const [intent, setIntent] = useState("Informational");
  const [approvedIds, setApprovedIds] = useState<number[]>([]);

  const filters: FilterKey[] = ["All", "Published", "In Review", "Draft"];

  const filtered = blogPosts.filter((p) => {
    if (filter === "All") return true;
    if (filter === "Published") return p.status === "Live" || p.status === "Published";
    return p.status === filter;
  });

  const handleGenerate = () => {
    if (!keyword) return;
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 3000);
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", padding: "32px 40px", fontFamily: "DM Sans, sans-serif", color: primaryText }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 700, color: primaryText, lineHeight: 1.2 }}>
              Blog Writer Agent
            </h1>
            <p style={{ color: mutedText, fontSize: 14, marginTop: 4 }}>AI-powered blog generation, SEO optimization, and publishing pipeline</p>
          </div>
          <AgentStatusBadge status="running" />
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ background: brown, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          <Plus size={16} /> Generate Blog
        </button>
      </motion.div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {kpiCards.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ color: mutedText, fontSize: 12, fontWeight: 500 }}>{k.label}</span>
              <k.icon size={16} style={{ color: brown }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: primaryText, marginTop: 8, fontFamily: "Playfair Display, serif" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: "hsl(142,55%,40%)", marginTop: 4 }}>{k.delta}</div>
          </motion.div>
        ))}
      </div>

      {/* Pipeline */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "22px 26px", marginBottom: 28 }}>
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 17, fontWeight: 600, marginBottom: 18, color: primaryText }}>Blog Generation Pipeline</h2>
        <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
          {pipelineStages.map((stage, i) => (
            <div key={stage.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {i < pipelineStages.length - 1 && (
                <div style={{ position: "absolute", top: 18, left: "60%", width: "80%", height: 2, background: stage.status === "completed" ? "hsl(142,71%,45%)" : border, zIndex: 0 }} />
              )}
              <div style={{ position: "relative", zIndex: 1, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: stage.status === "completed" ? "hsl(142,71%,45%)" : stage.status === "running" ? brown : border,
                color: stage.status === "pending" ? mutedText : "#fff" }}>
                {stage.status === "running" ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
                    <Loader2 size={16} />
                  </motion.div>
                ) : stage.status === "completed" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <stage.icon size={15} />
                )}
              </div>
              <div style={{ marginTop: 8, fontSize: 11, fontWeight: 500, color: stage.status === "pending" ? mutedText : primaryText, textAlign: "center", maxWidth: 90 }}>{stage.label}</div>
              {stage.status === "running" && (
                <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}
                  style={{ fontSize: 10, color: brown, marginTop: 2 }}>Processing…</motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${filter === f ? brown : border}`,
              background: filter === f ? brown : card, color: filter === f ? "#fff" : mutedText, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Blog Posts Table */}
      <motion.div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${border}` }}>
              {["Title", "Keyword", "Status", "Traffic", "Published", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: mutedText }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filtered.map((post, i) => (
                <motion.tr key={post.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.04 }} style={{ borderBottom: `1px solid ${border}` }}>
                  <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 500, color: primaryText, maxWidth: 280 }}>{post.title}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: mutedText }}>{post.keyword}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ background: statusBg[post.status] || "transparent", color: statusColors[post.status] || mutedText,
                      borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{post.status}</span>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: primaryText }}>{post.traffic}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: mutedText }}>{post.date}</td>
                  <td style={{ padding: "13px 16px" }}>
                    {post.status === "In Review" && !approvedIds.includes(post.id) ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setApprovedIds((prev) => [...prev, post.id])}
                          style={{ padding: "4px 10px", borderRadius: 6, background: "hsl(142,71%,45%)", color: "#fff", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                          <ThumbsUp size={11} /> Approve
                        </button>
                        <button style={{ padding: "4px 10px", borderRadius: 6, background: "transparent", color: brown, border: `1px solid ${border}`, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                          <Edit3 size={11} /> Edit
                        </button>
                      </div>
                    ) : post.status === "In Review" && approvedIds.includes(post.id) ? (
                      <span style={{ color: "hsl(142,71%,40%)", fontSize: 12, fontWeight: 500 }}>✓ Approved</span>
                    ) : (
                      <span style={{ color: mutedText, fontSize: 12 }}>—</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      <AIRecommendations page="blog" />

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => { setShowModal(false); setGenerated(false); setGenerating(false); }}>
            <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: card, borderRadius: 18, padding: 32, width: 460, boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, color: primaryText }}>Generate New Blog</h2>
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: mutedText }}><X size={18} /></button>
              </div>
              {!generated ? (
                <>
                  {[{ label: "Target Keyword", val: keyword, set: setKeyword, ph: "e.g. AI marketing automation" },
                    { label: "Target Audience", val: audience, set: setAudience, ph: "e.g. B2B SaaS founders" }].map((f) => (
                    <div key={f.label} style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: mutedText, display: "block", marginBottom: 6 }}>{f.label}</label>
                      <input value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: bg, color: primaryText, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: mutedText, display: "block", marginBottom: 6 }}>Search Intent</label>
                    <select value={intent} onChange={(e) => setIntent(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: bg, color: primaryText, fontSize: 13, outline: "none" }}>
                      {["Informational", "Navigational", "Commercial", "Transactional"].map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <button onClick={handleGenerate} disabled={generating}
                    style={{ width: "100%", padding: "12px", borderRadius: 10, background: brown, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {generating ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Loader2 size={16} /></motion.div> Generating…</> : "Generate Blog Post"}
                  </button>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <CheckCircle2 size={40} style={{ color: "hsl(142,71%,45%)", margin: "0 auto 12px" }} />
                    <p style={{ fontWeight: 600, color: primaryText, fontSize: 16 }}>Blog post queued!</p>
                    <p style={{ color: mutedText, fontSize: 13, marginTop: 6 }}>Pipeline started for "{keyword}". It will appear in your list shortly.</p>
                  </div>
                  <button onClick={() => { setShowModal(false); setGenerated(false); setKeyword(""); setAudience(""); }}
                    style={{ width: "100%", marginTop: 16, padding: "11px", borderRadius: 10, background: brown, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    Done
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
