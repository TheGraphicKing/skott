"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Star, TrendingUp, DollarSign, CheckCircle,
  Award, ChevronRight, Globe, FileText, BookOpen,
} from "lucide-react";

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

const kpis = [
  { label: "Active Advocates",     value: "12",     sub: "across 8 accounts",  icon: Users,      color: PRIMARY },
  { label: "Case Studies Published", value: "8",    sub: "+2 this quarter",    icon: FileText,   color: BLUE },
  { label: "Review Velocity",      value: "4.2/mo", sub: "G2, Capterra, TR",   icon: Star,       color: AMBER },
  { label: "Referral Revenue",     value: "$340K",  sub: "6 closed referrals", icon: DollarSign, color: GREEN },
];

const stages = [
  { label: "Willing",    count: 18 },
  { label: "Interviewing", count: 9 },
  { label: "Drafting",   count: 5 },
  { label: "Published",  count: 8 },
  { label: "Active Advocate", count: 12 },
];

const caseStudies = [
  { company: "Hitachi",      status: "Published",  type: "Case Study",         publishDate: "Mar 2026", mqls: 120 },
  { company: "Goldman Sachs",status: "In Review",  type: "Video Testimonial",  publishDate: "—",        mqls: null },
  { company: "Accenture",    status: "Drafting",   type: "Written Case Study", publishDate: "—",        mqls: null },
  { company: "JPMorgan",     status: "Interviewing",type: "Case Study",        publishDate: "—",        mqls: null },
];

const reviewPlatforms = [
  { name: "G2",          rating: 4.7, reviews: 48, icon: Star, color: AMBER },
  { name: "Capterra",    rating: 4.6, reviews: 32, icon: Star, color: BLUE },
  { name: "TrustRadius", rating: 4.5, reviews: 19, icon: Star, color: GREEN },
];

const referralStats = [
  { label: "Submitted",  value: 14, color: BLUE },
  { label: "Converted",  value: 6,  color: GREEN },
  { label: "In Progress",value: 8,  color: AMBER },
];

const statusColor: Record<string, string> = {
  "Published":    GREEN,
  "In Review":    AMBER,
  "Drafting":     BLUE,
  "Interviewing": PRIMARY,
};

export default function CustomerAdvocacy() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "32px 40px", fontFamily: "inherit" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>Customer Advocacy</h1>
            <p style={{ margin: "4px 0 0", color: MUTED, fontSize: 14 }}>
              Case studies, reviews & referral program · Lyzr AI, Inc.
            </p>
          </div>
          <button style={{
            background: PRIMARY, color: "#fff", border: "none", borderRadius: 10,
            padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Award size={14} /> Add Advocate
          </button>
        </div>
      </motion.div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 22px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: MUTED, fontWeight: 500 }}>{k.label}</p>
                <p style={{ margin: "6px 0 2px", fontSize: 28, fontWeight: 800, color: DARK_TEXT }}>{k.value}</p>
                <p style={{ margin: 0, fontSize: 12, color: MUTED }}>{k.sub}</p>
              </div>
              <div style={{ background: `${k.color}18`, borderRadius: 10, padding: 10 }}>
                <k.icon size={20} color={k.color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advocacy Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px", marginBottom: 24 }}
      >
        <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>
          Advocacy Pipeline
        </h3>
        <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
          {stages.map((stage, i) => (
            <div key={stage.label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                onClick={() => setSelectedStage(selectedStage === stage.label ? null : stage.label)}
                style={{
                  flex: 1, background: selectedStage === stage.label ? `${PRIMARY}18` : PAGE_BG,
                  border: `2px solid ${selectedStage === stage.label ? PRIMARY : BORDER}`,
                  borderRadius: 10, padding: "16px 14px", textAlign: "center", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 800, color: PRIMARY }}>{stage.count}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginTop: 4 }}>{stage.label}</div>
              </motion.div>
              {i < stages.length - 1 && (
                <ChevronRight size={18} color={MUTED} style={{ flexShrink: 0, margin: "0 4px" }} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Two-column: Case Study Tracker + Review Platforms */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, marginBottom: 24 }}>
        {/* Case Study Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}
        >
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>Case Study Tracker</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: `${PRIMARY}08`, borderBottom: `1px solid ${BORDER}` }}>
                {["Company", "Status", "Content Type", "Publish Date", "MQLs Generated"].map((h) => (
                  <th key={h} style={{
                    padding: "12px 18px", textAlign: "left",
                    fontSize: 11, fontWeight: 700, color: PRIMARY,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {caseStudies.map((row, i) => (
                <motion.tr
                  key={row.company}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}
                  style={{ borderBottom: `1px solid ${BORDER}` }}
                >
                  <td style={{ padding: "14px 18px", fontWeight: 700, fontSize: 13, color: DARK_TEXT }}>{row.company}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{
                      background: `${statusColor[row.status]}20`,
                      color: statusColor[row.status],
                      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 9999,
                    }}>{row.status}</span>
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: 12, color: MUTED }}>{row.type}</td>
                  <td style={{ padding: "14px 18px", fontSize: 12, color: DARK_TEXT }}>{row.publishDate}</td>
                  <td style={{ padding: "14px 18px" }}>
                    {row.mqls !== null
                      ? <span style={{ fontWeight: 700, color: GREEN }}>{row.mqls} MQLs</span>
                      : <span style={{ color: MUTED }}>—</span>
                    }
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Review Platforms + Referral */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px" }}
          >
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>Review Platforms</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reviewPlatforms.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}
                  style={{
                    background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 10,
                    padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: DARK_TEXT }}>{p.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                      <Star size={13} color={AMBER} fill={AMBER} />
                      <span style={{ fontWeight: 700, color: AMBER, fontSize: 13 }}>{p.rating}</span>
                      <span style={{ fontSize: 12, color: MUTED }}>({p.reviews} reviews)</span>
                    </div>
                  </div>
                  <button style={{
                    background: `${PRIMARY}15`, color: PRIMARY, border: `1px solid ${BORDER}`,
                    borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    View <Globe size={11} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Referral Program */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px" }}
          >
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>Referral Program</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {referralStats.map((s) => (
                <div key={s.label} style={{
                  background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 10,
                  padding: "14px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 14, padding: "12px 16px", background: `${GREEN}12`,
              borderRadius: 10, border: `1px solid ${GREEN}30`,
            }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <CheckCircle size={15} color={GREEN} />
                <span style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>
                  $340K revenue generated from referrals this FY
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
