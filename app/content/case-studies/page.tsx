"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Eye,
  TrendingUp,
  Clock,
  Plus,
  X,
  CheckCircle2,
  Loader2,
  ThumbsUp,
  BarChart2,
  Globe,
  Building2,
} from "lucide-react";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

const bg = "hsl(36,33%,94%)";
const card = "hsl(36,30%,97%)";
const border = "hsl(30,15%,87%)";
const primaryText = "hsl(25,40%,18%)";
const mutedText = "hsl(25,20%,50%)";
const brown = "hsl(25,62%,25%)";

type FilterKey = "All" | "Published" | "In Pipeline" | "Pending Approval";

type PipelineStage = "Interview" | "Draft" | "Review" | "Design" | "Published";

interface CaseStudy {
  id: number;
  company: string;
  industry: string;
  useCase: string;
  keyMetric: string;
  metricValue: string;
  status: "Published" | "In Pipeline" | "Pending Approval";
  stage: PipelineStage;
  views: string;
  initials: string;
  color: string;
}

const caseStudies: CaseStudy[] = [
  { id: 1, company: "Vercel", industry: "DevTools", useCase: "AI-Assisted Deployment Monitoring", keyMetric: "Deploy time reduced", metricValue: "↓ 68%", status: "Published", stage: "Published", views: "7.1K", initials: "V", color: "hsl(0,0%,10%)" },
  { id: 2, company: "Notion", industry: "Productivity", useCase: "Automating Content Operations with AI", keyMetric: "Content throughput", metricValue: "↑ 4.2×", status: "Published", stage: "Published", views: "5.8K", initials: "N", color: "hsl(25,62%,30%)" },
  { id: 3, company: "Linear", industry: "Project Mgmt", useCase: "LLM-Powered Sprint Planning", keyMetric: "Sprint accuracy", metricValue: "↑ 31%", status: "Published", stage: "Published", views: "4.4K", initials: "L", color: "hsl(250,80%,55%)" },
  { id: 4, company: "Retool", industry: "Low-Code", useCase: "Internal Tool Generation via AI", keyMetric: "Dev hours saved", metricValue: "820 hrs/qtr", status: "Published", stage: "Published", views: "3.6K", initials: "R", color: "hsl(217,91%,50%)" },
  { id: 5, company: "Loom", industry: "Async Video", useCase: "AI Summarization for Sales Reps", keyMetric: "Response rate", metricValue: "↑ 22%", status: "Published", stage: "Published", views: "2.9K", initials: "L", color: "hsl(280,70%,55%)" },
  { id: 6, company: "Figma", industry: "Design", useCase: "Automated Design System Audits", keyMetric: "Audit time", metricValue: "↓ 75%", status: "Pending Approval", stage: "Review", views: "—", initials: "F", color: "hsl(20,90%,55%)" },
  { id: 7, company: "Datadog", industry: "Observability", useCase: "Predictive Incident Response", keyMetric: "MTTR improvement", metricValue: "↓ 41%", status: "Pending Approval", stage: "Design", views: "—", initials: "D", color: "hsl(142,60%,38%)" },
  { id: 8, company: "Rippling", industry: "HR SaaS", useCase: "Onboarding Automation with AI Agents", keyMetric: "HR admin hours", metricValue: "↓ 60%", status: "In Pipeline", stage: "Draft", views: "—", initials: "R", color: "hsl(38,80%,45%)" },
];

const kpiCards = [
  { label: "Published", value: "12", icon: FileText, delta: "+3 this quarter" },
  { label: "In Pipeline", value: "5", icon: Clock, delta: "2 pending approval" },
  { label: "Avg Page Views", value: "4.2K", icon: Eye, delta: "+18% vs last quarter" },
  { label: "Conversion Rate", value: "3.8%", icon: TrendingUp, delta: "Top 10% in category" },
];

const allStages: PipelineStage[] = ["Interview", "Draft", "Review", "Design", "Published"];

const stageIndex = (s: PipelineStage) => allStages.indexOf(s);

const statusColors: Record<string, string> = {
  Published: "hsl(142,71%,35%)",
  "In Pipeline": "hsl(217,91%,50%)",
  "Pending Approval": "hsl(38,92%,45%)",
};
const statusBg: Record<string, string> = {
  Published: "hsl(142,71%,45%,0.12)",
  "In Pipeline": "hsl(217,91%,60%,0.12)",
  "Pending Approval": "hsl(38,92%,50%,0.12)",
};

const industries = ["SaaS", "FinTech", "HR Tech", "DevTools", "Healthcare", "E-commerce", "Logistics", "EdTech"];

export default function CaseStudyPage() {
  const [filter, setFilter] = useState<FilterKey>("All");
  const [showModal, setShowModal] = useState(false);
  const [approvedIds, setApprovedIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [industry, setIndustry] = useState("SaaS");
  const [useCase, setUseCase] = useState("");
  const [keyResults, setKeyResults] = useState("");
  const [metrics, setMetrics] = useState("");

  const filters: FilterKey[] = ["All", "Published", "In Pipeline", "Pending Approval"];

  const filtered = caseStudies.filter((c) => {
    if (filter === "All") return true;
    return c.status === filter;
  });

  const topCase = caseStudies.filter((c) => c.status === "Published").sort((a, b) => parseFloat(b.views) - parseFloat(a.views))[0];

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 3000);
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", padding: "32px 40px", fontFamily: "DM Sans, sans-serif", color: primaryText }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 28, fontWeight: 700, color: primaryText, lineHeight: 1.2 }}>Case Study Agent</h1>
            <p style={{ color: mutedText, fontSize: 14, marginTop: 4 }}>AI-researched, structured, and published customer success stories</p>
          </div>
          <AgentStatusBadge status="active" />
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ background: brown, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> New Case Study
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

      {/* Main layout: grid + sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }}>
        <div>
          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${filter === f ? brown : border}`,
                  background: filter === f ? brown : card, color: filter === f ? "#fff" : mutedText, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                {f}
              </button>
            ))}
          </div>

          {/* Case Study Cards Grid */}
          <motion.div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((cs, i) => (
                <motion.div key={cs.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  {/* Logo placeholder */}
                  <div style={{ height: 56, background: `${cs.color}18`, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: `1px solid ${border}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: cs.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>
                      {cs.initials}
                    </div>
                    <div style={{ marginLeft: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: primaryText }}>{cs.company}</div>
                      <div style={{ fontSize: 11, color: mutedText }}>{cs.industry}</div>
                    </div>
                  </div>

                  <div style={{ padding: "16px 18px", flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: primaryText, lineHeight: 1.4, marginBottom: 10 }}>{cs.useCase}</div>
                    <div style={{ background: `${cs.color}12`, borderRadius: 10, padding: "8px 12px", marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: mutedText, marginBottom: 2 }}>{cs.keyMetric}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: cs.color, fontFamily: "Playfair Display, serif" }}>{cs.metricValue}</div>
                    </div>

                    {/* Stage pipeline mini */}
                    <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                      {allStages.map((stage) => (
                        <div key={stage} title={stage}
                          style={{ flex: 1, height: 4, borderRadius: 3, background: stageIndex(cs.stage) >= stageIndex(stage) ? brown : border }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 10, color: mutedText, marginBottom: 10 }}>Stage: {cs.stage}</div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ background: statusBg[cs.status], color: statusColors[cs.status], borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 600 }}>{cs.status}</span>
                      {cs.views !== "—" && (
                        <span style={{ fontSize: 11, color: mutedText, display: "flex", alignItems: "center", gap: 4 }}><Eye size={11} /> {cs.views}</span>
                      )}
                    </div>
                  </div>

                  {/* Pending Approval actions */}
                  {cs.status === "Pending Approval" && !approvedIds.includes(cs.id) && (
                    <div style={{ padding: "10px 16px 14px", borderTop: `1px solid ${border}`, display: "flex", gap: 8 }}>
                      <button onClick={() => setApprovedIds((p) => [...p, cs.id])}
                        style={{ flex: 1, padding: "6px", borderRadius: 8, background: "hsl(142,71%,45%)", color: "#fff", border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <ThumbsUp size={11} /> Approve
                      </button>
                      <button style={{ flex: 1, padding: "6px", borderRadius: 8, background: "transparent", color: brown, border: `1px solid ${border}`, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                        Revise
                      </button>
                    </div>
                  )}
                  {cs.status === "Pending Approval" && approvedIds.includes(cs.id) && (
                    <div style={{ padding: "10px 16px 12px", borderTop: `1px solid ${border}` }}>
                      <span style={{ color: "hsl(142,71%,40%)", fontSize: 11, fontWeight: 500 }}>✓ CMO Approved</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Sidebar metrics */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Top performer */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "20px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: mutedText, marginBottom: 12 }}>TOP PERFORMING</div>
            {topCase && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: topCase.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{topCase.initials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: primaryText }}>{topCase.company}</div>
                    <div style={{ fontSize: 11, color: mutedText }}>{topCase.industry}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: mutedText, marginBottom: 4 }}>Page Views</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: primaryText, fontFamily: "Playfair Display, serif" }}>{topCase.views}</div>
                <div style={{ fontSize: 12, color: "hsl(142,55%,40%)", marginTop: 2 }}>+24% this month</div>
              </>
            )}
          </div>

          {/* Avg time to publish */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "20px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: mutedText, marginBottom: 8 }}>AVG TIME TO PUBLISH</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: primaryText, fontFamily: "Playfair Display, serif" }}>11 days</div>
            <div style={{ fontSize: 12, color: "hsl(142,55%,40%)", marginTop: 2 }}>−4 days vs manual</div>
            <div style={{ marginTop: 12, display: "flex", gap: 6, alignItems: "center" }}>
              <Clock size={12} style={{ color: mutedText }} />
              <span style={{ fontSize: 11, color: mutedText }}>Interview to publish pipeline</span>
            </div>
          </div>

          {/* Industries covered */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "20px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: mutedText, marginBottom: 12 }}>INDUSTRIES COVERED</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["DevTools", "Productivity", "Design", "Observability"].map((ind, idx) => (
                <div key={ind} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Building2 size={11} style={{ color: brown }} />
                    <span style={{ fontSize: 12, color: primaryText }}>{ind}</span>
                  </div>
                  <div style={{ width: 60, height: 5, borderRadius: 3, background: border, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${[85, 70, 60, 55][idx]}%`, background: brown, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline summary */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "20px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: mutedText, marginBottom: 12 }}>PIPELINE SUMMARY</div>
            {allStages.map((stage) => {
              const count = caseStudies.filter((c) => c.stage === stage).length;
              return (
                <div key={stage} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: mutedText }}>{stage}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: primaryText }}>{count}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <AIRecommendations page="case-studies" />

      {/* New Case Study Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => { setShowModal(false); setSubmitted(false); }}>
            <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: card, borderRadius: 18, padding: 32, width: 500, boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 700, color: primaryText }}>New Case Study</h2>
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: mutedText }}><X size={18} /></button>
              </div>

              {!submitted ? (
                <>
                  {[
                    { label: "Customer Name", val: customerName, set: setCustomerName, ph: "e.g. Acme Corp" },
                    { label: "Use Case", val: useCase, set: setUseCase, ph: "e.g. Automated lead scoring with AI" },
                    { label: "Key Results", val: keyResults, set: setKeyResults, ph: "e.g. 40% increase in pipeline velocity" },
                    { label: "Metrics", val: metrics, set: setMetrics, ph: "e.g. 820 hours saved, 3.2× ROI" },
                  ].map((f) => (
                    <div key={f.label} style={{ marginBottom: 14 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: mutedText, display: "block", marginBottom: 5 }}>{f.label}</label>
                      <input value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: bg, color: primaryText, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 22 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: mutedText, display: "block", marginBottom: 5 }}>Industry</label>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: bg, color: primaryText, fontSize: 13, outline: "none" }}>
                      {industries.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <button onClick={handleSubmit} disabled={submitting}
                    style={{ width: "100%", padding: "12px", borderRadius: 10, background: brown, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {submitting ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Loader2 size={16} /></motion.div> Starting Pipeline…</> : "Start Case Study Pipeline"}
                  </button>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "20px 0" }}>
                  <CheckCircle2 size={44} style={{ color: "hsl(142,71%,45%)", margin: "0 auto 14px" }} />
                  <p style={{ fontWeight: 600, color: primaryText, fontSize: 16, marginBottom: 6 }}>Case study pipeline started!</p>
                  <p style={{ color: mutedText, fontSize: 13 }}>Interview scheduling and research for {customerName || "the customer"} has begun. You'll be notified when the first draft is ready.</p>
                  <button onClick={() => { setShowModal(false); setSubmitted(false); setCustomerName(""); setUseCase(""); setKeyResults(""); setMetrics(""); }}
                    style={{ marginTop: 20, padding: "11px 28px", borderRadius: 10, background: brown, color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
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
