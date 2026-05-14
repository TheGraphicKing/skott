"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  BarChart3,
  Share2,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Loader2,
  ThumbsUp,
  RefreshCw,
  X,
} from "lucide-react";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

const bg = "hsl(36,33%,94%)";
const card = "hsl(36,30%,97%)";
const border = "hsl(30,15%,87%)";
const primaryText = "hsl(25,40%,18%)";
const mutedText = "hsl(25,20%,50%)";
const brown = "hsl(25,62%,25%)";

type FilterKey = "All" | "Live" | "Review" | "Draft";

interface Playbook {
  id: number;
  title: string;
  type: string;
  status: "Live" | "Review" | "Draft";
  leads: number;
  views: string;
  updated: string;
  toc: string[];
}

const playbooks: Playbook[] = [
  {
    id: 1, title: "Enterprise SaaS Sales Acceleration", type: "Sales", status: "Live", leads: 184, views: "3.2K", updated: "2025-05-01",
    toc: ["Executive Stakeholder Mapping", "Pain Point Discovery Framework", "ROI Calculators & Business Cases", "Competitive Objection Handling", "Proposal Templates", "Deal Acceleration Tactics"],
  },
  {
    id: 2, title: "New Customer Onboarding Journey", type: "Onboarding", status: "Live", leads: 142, views: "2.8K", updated: "2025-04-22",
    toc: ["Day 0: Welcome & Access Setup", "Week 1: Core Feature Activation", "Week 2: Integration Deep Dive", "Week 3: First Value Milestone", "Month 1: Executive Check-in", "Ongoing Success Rituals"],
  },
  {
    id: 3, title: "Q3 AI-First Campaign Launch", type: "Campaign", status: "Live", leads: 97, views: "1.5K", updated: "2025-04-18",
    toc: ["Campaign Positioning & Messaging", "Channel Mix Strategy", "Content Calendar (8-week)", "Paid Media Brief", "Landing Page Requirements", "Success Metrics & Reporting"],
  },
  {
    id: 4, title: "Strategic Partner Enablement Kit", type: "Partner", status: "Review", leads: 63, views: "890", updated: "2025-05-08",
    toc: ["Partner Tier Definitions", "Co-sell Qualification Criteria", "Joint GTM Messaging", "Deal Registration Process", "MDF Allocation Guidelines", "Quarterly Business Review Template"],
  },
  {
    id: 5, title: "SKO 2025 Keynote Playbook", type: "Event", status: "Review", leads: 55, views: "420", updated: "2025-05-10",
    toc: ["Event Theme & Narrative Arc", "Speaker Lineup & Briefs", "Breakout Session Structure", "Attendee Journey Mapping", "Post-Event Follow-up Sequence"],
  },
  {
    id: 6, title: "Competitive Win/Loss Intelligence", type: "Competitive", status: "Draft", leads: 0, views: "—", updated: "2025-05-12",
    toc: ["Competitor Landscape Overview", "Feature-by-Feature Battlecard", "Win/Loss Interview Template", "Objection Response Library", "Field Enablement Assets"],
  },
  {
    id: 7, title: "Mid-Market Outbound Campaign", type: "Campaign", status: "Draft", leads: 0, views: "—", updated: "2025-05-13",
    toc: ["ICP Definition & Scoring", "Outbound Sequence Design", "Personalization Tokens", "A/B Test Plan", "Reporting Dashboard Setup"],
  },
  {
    id: 8, title: "Startup Segment Fast-Track Sales", type: "Sales", status: "Live", leads: 211, views: "4.1K", updated: "2025-04-05",
    toc: ["Startup Persona Profiles", "Product-Led Sales Motion", "Self-Serve to Sales Handoff", "Expansion Triggers & Playbook", "Case Study Library", "Referral Program Overview"],
  },
];

const kpiCards = [
  { label: "Active Playbooks", value: "14", icon: BookOpen, delta: "+2 this quarter" },
  { label: "Avg Leads Generated", value: "127/playbook", icon: Users, delta: "+18% vs last quarter" },
  { label: "Completion Rate", value: "74%", icon: BarChart3, delta: "Top quartile" },
  { label: "Distribution Channels", value: "8", icon: Share2, delta: "Email, Slack, CRM, Web…" },
];

const pipelineStages = ["Research", "Draft", "Review", "Approved", "Distributed"];

const typeOptions = ["Sales", "Onboarding", "Campaign", "Partner", "Event", "Competitive"];

const statusColors: Record<string, string> = {
  Live: "hsl(142,71%,35%)",
  Review: "hsl(38,92%,45%)",
  Draft: "hsl(25,20%,50%)",
};
const statusBg: Record<string, string> = {
  Live: "hsl(142,71%,45%,0.12)",
  Review: "hsl(38,92%,50%,0.12)",
  Draft: "hsl(25,20%,60%,0.1)",
};

export default function PlaybooksPage() {
  const [filter, setFilter] = useState<FilterKey>("All");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [approvedIds, setApprovedIds] = useState<number[]>([]);
  const [changesIds, setChangesIds] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [playbookType, setPlaybookType] = useState("Sales");
  const [targetAudience, setTargetAudience] = useState("");
  const [keyMessage, setKeyMessage] = useState("");

  const filters: FilterKey[] = ["All", "Live", "Review", "Draft"];

  const filtered = playbooks.filter((p) => {
    if (filter === "All") return true;
    return p.status === filter;
  });

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2800);
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", padding: "32px 40px", fontFamily: "DM Sans, sans-serif", color: primaryText }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 700, color: primaryText, lineHeight: 1.2 }}>Playbook Generator Agent</h1>
            <p style={{ color: mutedText, fontSize: 14, marginTop: 4 }}>Automated playbook creation, review workflows, and multi-channel distribution</p>
          </div>
          <AgentStatusBadge status="active" />
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ background: brown, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> New Playbook
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

      {/* Pipeline bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: "18px 26px", marginBottom: 28, display: "flex", alignItems: "center", gap: 0 }}>
        {pipelineStages.map((stage, i) => (
          <div key={stage} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: i <= 2 ? brown : border, color: i <= 2 ? "#fff" : mutedText,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, margin: "0 auto 6px" }}>{i + 1}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: i <= 2 ? primaryText : mutedText }}>{stage}</div>
            </div>
            {i < pipelineStages.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < 2 ? brown : border, marginBottom: 14 }} />
            )}
          </div>
        ))}
      </motion.div>

      {/* Generation Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "24px 28px", marginBottom: 24, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 17, fontWeight: 600, color: primaryText }}>Create Playbook</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: mutedText }}><X size={16} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: mutedText, display: "block", marginBottom: 6 }}>Playbook Type</label>
                <select value={playbookType} onChange={(e) => setPlaybookType(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${border}`, background: bg, color: primaryText, fontSize: 13, outline: "none" }}>
                  {typeOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: mutedText, display: "block", marginBottom: 6 }}>Target Audience</label>
                <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. Enterprise AEs"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${border}`, background: bg, color: primaryText, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: mutedText, display: "block", marginBottom: 6 }}>Key Message</label>
                <input value={keyMessage} onChange={(e) => setKeyMessage(e.target.value)} placeholder="e.g. Close deals 2x faster with AI"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${border}`, background: bg, color: primaryText, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
              <button onClick={handleGenerate} disabled={generating}
                style={{ padding: "10px 20px", borderRadius: 10, background: brown, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                {generating ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Loader2 size={14} /></motion.div> Generating</> : "Generate Playbook"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <AIRecommendations page="playbooks" />

      {/* Playbooks List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((pb, i) => (
            <motion.div key={pb.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.05 }}
              style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr auto", gap: 12, alignItems: "center", padding: "14px 20px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: primaryText }}>{pb.title}</div>
                <div style={{ fontSize: 12, color: mutedText, background: "hsl(25,20%,60%,0.08)", padding: "3px 10px", borderRadius: 20, width: "fit-content" }}>{pb.type}</div>
                <div>
                  <span style={{ background: statusBg[pb.status], color: statusColors[pb.status], borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{pb.status}</span>
                </div>
                <div style={{ fontSize: 13, color: primaryText }}>{pb.leads > 0 ? `${pb.leads} leads` : "—"}</div>
                <div style={{ fontSize: 13, color: primaryText }}>{pb.views} views</div>
                <div style={{ fontSize: 12, color: mutedText }}>{pb.updated}</div>
                <button onClick={() => setExpanded(expanded === pb.id ? null : pb.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: mutedText, display: "flex", alignItems: "center" }}>
                  {expanded === pb.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Approval row */}
              {pb.status === "Review" && !approvedIds.includes(pb.id) && !changesIds.includes(pb.id) && (
                <div style={{ padding: "10px 20px 14px", borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 10, background: "hsl(38,92%,50%,0.05)" }}>
                  <Clock size={14} style={{ color: "hsl(38,92%,45%)" }} />
                  <span style={{ fontSize: 12, color: "hsl(38,92%,40%)", fontWeight: 500, flex: 1 }}>Pending Approval — review content before publishing</span>
                  <button onClick={() => setApprovedIds((p) => [...p, pb.id])}
                    style={{ padding: "5px 12px", borderRadius: 7, background: "hsl(142,71%,45%)", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    <ThumbsUp size={12} /> Approve
                  </button>
                  <button onClick={() => setChangesIds((p) => [...p, pb.id])}
                    style={{ padding: "5px 12px", borderRadius: 7, background: "transparent", color: brown, border: `1px solid ${border}`, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    <RefreshCw size={12} /> Request Changes
                  </button>
                </div>
              )}
              {pb.status === "Review" && approvedIds.includes(pb.id) && (
                <div style={{ padding: "8px 20px 12px", borderTop: `1px solid ${border}` }}>
                  <span style={{ color: "hsl(142,71%,40%)", fontSize: 12, fontWeight: 500 }}>✓ Approved — queued for distribution</span>
                </div>
              )}
              {pb.status === "Review" && changesIds.includes(pb.id) && (
                <div style={{ padding: "8px 20px 12px", borderTop: `1px solid ${border}` }}>
                  <span style={{ color: "hsl(38,92%,40%)", fontSize: 12, fontWeight: 500 }}>↩ Changes requested — sent back to draft</span>
                </div>
              )}

              {/* TOC expand */}
              <AnimatePresence>
                {expanded === pb.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden", borderTop: `1px solid ${border}`, padding: "14px 20px 18px", background: "hsl(36,25%,95%)" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: mutedText, marginBottom: 10 }}>TABLE OF CONTENTS</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                      {pb.toc.map((section, idx) => (
                        <div key={section} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: primaryText }}>
                          <span style={{ width: 20, height: 20, borderRadius: "50%", background: brown, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{idx + 1}</span>
                          {section}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
