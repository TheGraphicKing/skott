"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Handshake, DollarSign, TrendingUp, FileText, Users,
  BarChart3, CheckCircle, AlertCircle, Clock, Calendar,
  ChevronRight, Globe, Download, Plus,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

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
  { label: "Active Partners",    value: "12",    sub: "across 4 tiers",         icon: Handshake,  color: PRIMARY },
  { label: "MDF Available",      value: "$180K", sub: "FY2026 allocation",       icon: DollarSign, color: BLUE },
  { label: "Joint Pipeline",     value: "$1.2M", sub: "partner-sourced deals",   icon: TrendingUp, color: GREEN },
  { label: "Co-Branded Assets",  value: "34",    sub: "live this quarter",       icon: FileText,   color: AMBER },
];

const partners = [
  { name: "AWS",           tier: "Strategic", pipeline: "$450K", stage: "Active",   mdfAllocated: 60000, mdfUsed: 45000 },
  { name: "Accenture",     tier: "Strategic", pipeline: "$380K", stage: "Active",   mdfAllocated: 50000, mdfUsed: 32000 },
  { name: "Rocketship.vc", tier: "Growth",    pipeline: "$180K", stage: "Planning", mdfAllocated: 20000, mdfUsed: 0 },
  { name: "GFT Group",     tier: "Growth",    pipeline: "$290K", stage: "Active",   mdfAllocated: 35000, mdfUsed: 28000 },
  { name: "Wipro",         tier: "Standard",  pipeline: "$95K",  stage: "Active",   mdfAllocated: 15000, mdfUsed: 11000 },
];

const lastActivity: Record<string, string> = {
  AWS:           "May 10, 2026",
  Accenture:     "May 8, 2026",
  "Rocketship.vc": "Apr 22, 2026",
  "GFT Group":   "May 12, 2026",
  Wipro:         "May 5, 2026",
};

const coAssets = [
  { partner: "AWS",       type: "Case Study", title: "Lyzr × AWS: Agentic BFSI",   status: "Live" },
  { partner: "Accenture", type: "Webinar",    title: "AI Orchestration for Ops",    status: "Live" },
  { partner: "AWS",       type: "Blog",       title: "How OGI Runs on Amazon Bedrock", status: "Live" },
  { partner: "GFT Group", type: "Case Study", title: "Lyzr × GFT: Banking AI",     status: "In Review" },
  { partner: "Accenture", type: "Blog",       title: "Multi-Agent Systems in 2026", status: "Draft" },
  { partner: "Wipro",     type: "Webinar",    title: "Enterprise AI Agents",        status: "Draft" },
];

const campaigns = [
  { partner: "AWS",       activity: "AWS Summit — Joint Booth",       date: "Jun 15, 2026",  status: "Confirmed" },
  { partner: "Accenture", activity: "BFSI Roundtable — Co-Host",      date: "Jun 22, 2026",  status: "Planning" },
  { partner: "Rocketship.vc", activity: "Portfolio Pitch Day",        date: "Jul 5, 2026",   status: "Planning" },
  { partner: "GFT Group", activity: "GFT × Lyzr Webinar Series",     date: "Jul 18, 2026",  status: "Draft" },
];

const tierColor: Record<string, string> = { Strategic: PRIMARY, Growth: BLUE, Standard: MUTED };
const stageColor: Record<string, string> = { Active: GREEN, Planning: AMBER, Draft: MUTED };
const assetStatusColor: Record<string, string> = { Live: GREEN, "In Review": AMBER, Draft: MUTED };
const campStatusColor: Record<string, string>  = { Confirmed: GREEN, Planning: AMBER, Draft: MUTED };

type Tab = "pipeline" | "mdf" | "assets" | "campaigns";

function MdfBar({ used, allocated }: { used: number; allocated: number }) {
  const pct = Math.round((used / allocated) * 100);
  const color = pct >= 80 ? AMBER : GREEN;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: MUTED }}>Used: ${(used / 1000).toFixed(0)}K / ${(allocated / 1000).toFixed(0)}K</span>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ background: BORDER, borderRadius: 9999, height: 6, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: "100%", background: color, borderRadius: 9999 }}
        />
      </div>
    </div>
  );
}

export default function PartnerMarketing() {
  const [tab, setTab] = useState<Tab>("pipeline");

  const mdfChartData = partners.map((p) => ({
    name: p.name,
    Allocated: Math.round(p.mdfAllocated / 1000),
    Used: Math.round(p.mdfUsed / 1000),
    Remaining: Math.round((p.mdfAllocated - p.mdfUsed) / 1000),
  }));

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "32px 40px", fontFamily: "inherit" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>Partner Marketing</h1>
            <p style={{ margin: "4px 0 0", color: MUTED, fontSize: 14 }}>
              AWS, Accenture, GFT & growth partners · FY2026
            </p>
          </div>
          <button style={{
            background: PRIMARY, color: "#fff", border: "none", borderRadius: 10,
            padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Plus size={14} /> Add Partner
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

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4, background: CARD, border: `1px solid ${BORDER}`,
        borderRadius: 10, padding: 4, marginBottom: 24, width: "fit-content",
      }}>
        {([
          { key: "pipeline",  label: "Partner Pipeline" },
          { key: "mdf",       label: "MDF Tracker" },
          { key: "assets",    label: "Co-Branded Assets" },
          { key: "campaigns", label: "Joint Campaigns" },
        ] as { key: Tab; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 12,
              background: tab === t.key ? PRIMARY : "transparent",
              color: tab === t.key ? "#fff" : MUTED,
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Partner Pipeline */}
      {tab === "pipeline" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: `${PRIMARY}10`, borderBottom: `1px solid ${BORDER}` }}>
                  {["Partner", "Tier", "Joint Pipeline", "Stage", "MDF Used", "Last Activity"].map((h) => (
                    <th key={h} style={{
                      padding: "14px 20px", textAlign: "left",
                      fontSize: 12, fontWeight: 700, color: PRIMARY,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {partners.map((p, i) => (
                  <motion.tr
                    key={p.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{ borderBottom: `1px solid ${BORDER}` }}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ background: `${PRIMARY}15`, borderRadius: 8, padding: 7 }}>
                          <Handshake size={14} color={PRIMARY} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 13, color: DARK_TEXT }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        background: `${tierColor[p.tier]}18`,
                        color: tierColor[p.tier],
                        fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 9999,
                      }}>{p.tier}</span>
                    </td>
                    <td style={{ padding: "16px 20px", fontWeight: 800, fontSize: 14, color: DARK_TEXT }}>{p.pipeline}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        background: `${stageColor[p.stage]}20`,
                        color: stageColor[p.stage],
                        fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 9999,
                      }}>{p.stage}</span>
                    </td>
                    <td style={{ padding: "16px 20px", fontWeight: 600, fontSize: 13, color: DARK_TEXT }}>
                      ${(p.mdfUsed / 1000).toFixed(0)}K
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: 12, color: MUTED }}>{lastActivity[p.name]}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* MDF Tracker */}
      {tab === "mdf" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* MDF Budget cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {partners.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 20px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: DARK_TEXT }}>{p.name}</span>
                    <span style={{
                      background: `${tierColor[p.tier]}18`,
                      color: tierColor[p.tier],
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999,
                    }}>{p.tier}</span>
                  </div>
                  <MdfBar used={p.mdfUsed} allocated={p.mdfAllocated} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                    <span style={{ fontSize: 11, color: MUTED }}>
                      Remaining: <strong style={{ color: GREEN }}>
                        ${((p.mdfAllocated - p.mdfUsed) / 1000).toFixed(0)}K
                      </strong>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* MDF chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px" }}
            >
              <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 700, color: DARK_TEXT }}>
                MDF Allocation vs Usage ($K)
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={mdfChartData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: MUTED }} />
                  <YAxis tick={{ fontSize: 11, fill: MUTED }} />
                  <Tooltip
                    contentStyle={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12 }}
                    formatter={(v: any) => [`$${v}K`, ""]}
                  />
                  <Bar dataKey="Used"      name="Used"      fill={PRIMARY} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Remaining" name="Remaining" fill={`${GREEN}`} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Co-Branded Assets */}
      {tab === "assets" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {coAssets.map((asset, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px" }}
              >
                <div style={{
                  background: PAGE_BG, borderRadius: 10, height: 100, marginBottom: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1px solid ${BORDER}`,
                }}>
                  <FileText size={32} color={`${PRIMARY}60`} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: DARK_TEXT, marginBottom: 6 }}>{asset.title}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{
                    background: `${PRIMARY}15`, color: PRIMARY,
                    fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 9999,
                  }}>{asset.partner}</span>
                  <span style={{
                    background: `${BLUE}15`, color: BLUE,
                    fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 9999,
                  }}>{asset.type}</span>
                  <span style={{
                    background: `${assetStatusColor[asset.status]}20`,
                    color: assetStatusColor[asset.status],
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999,
                  }}>{asset.status}</span>
                </div>
                <button style={{
                  marginTop: 14, width: "100%", background: `${PRIMARY}12`, color: PRIMARY,
                  border: `1px solid ${PRIMARY}30`, borderRadius: 8, padding: "8px",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                }}>
                  <Download size={12} /> Download
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Joint Campaigns */}
      {tab === "campaigns" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {campaigns.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 22px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ background: `${PRIMARY}15`, borderRadius: 10, padding: 11 }}>
                    <Calendar size={18} color={PRIMARY} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: DARK_TEXT }}>{c.activity}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>
                      Partner: <strong style={{ color: PRIMARY }}>{c.partner}</strong> · {c.date}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{
                    background: `${campStatusColor[c.status]}20`,
                    color: campStatusColor[c.status],
                    fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 9999,
                  }}>{c.status}</span>
                  <button style={{
                    background: `${PRIMARY}12`, color: PRIMARY, border: `1px solid ${PRIMARY}30`,
                    borderRadius: 8, padding: "7px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    View <ChevronRight size={11} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
