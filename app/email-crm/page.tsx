"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Users, CheckCircle, AlertCircle,
  Clock, RefreshCw, Plus, Filter, Download, Settings, Zap,
  TrendingUp, Activity, Link2, Eye, Edit, Pause, Play,
  X, ChevronLeft, ChevronRight,
  Trash2,
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
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
const PURPLE    = "hsl(280,45%,40%)";

// ─── Campaign Data ────────────────────────────────────────────────────────────
const emailCampaigns = [
  { id: 1, name: "BFSI Decision Makers",     status: "active",  contacts: 3200,  openRate: "38%", clickRate: "6.2%", revenue: "$142K" },
  { id: 2, name: "Agentic OS Nurture",        status: "active",  contacts: 8400,  openRate: "31%", clickRate: "4.8%", revenue: "$89K"  },
  { id: 3, name: "Enterprise Re-engagement", status: "paused",  contacts: 1200,  openRate: "22%", clickRate: "2.1%", revenue: "$12K"  },
  { id: 4, name: "AWS Partner Announcement", status: "sent",    contacts: 15000, openRate: "42%", clickRate: "8.4%", revenue: "$67K"  },
  { id: 5, name: "Hitachi Case Study",        status: "draft",   contacts: 2800,  openRate: "—",   clickRate: "—",    revenue: "—"    },
];

const crmConnectors = [
  { name: "HubSpot",    status: "connected", color: GREEN,  lastSync: "2 min ago",  contacts: 24500, deals: 340, dealsLabel: "deals tracked"    },
  { name: "Salesforce", status: "connected", color: BLUE,   lastSync: "5 min ago",  contacts: 18200, deals: 284, dealsLabel: "opportunities"    },
  { name: "Marketo",    status: "partial",   color: PURPLE, lastSync: "1 hour ago", contacts: 12000, deals: null, dealsLabel: null              },
];

const syncHistory = [
  { time: "2:14 PM",  crm: "HubSpot",    records: 142,  status: "success" },
  { time: "2:09 PM",  crm: "Salesforce", records: 88,   status: "success" },
  { time: "1:18 PM",  crm: "HubSpot",    records: 312,  status: "success" },
  { time: "1:02 PM",  crm: "Marketo",    records: 204,  status: "warning" },
  { time: "12:44 PM", crm: "Salesforce", records: 55,   status: "success" },
];

const savedSegments = [
  { name: "BFSI Enterprise C-Suite",   reach: 3200, updated: "Today"      },
  { name: "Mid-Market Fintech VP+",    reach: 1840, updated: "Yesterday"  },
  { name: "SMB Agile Decision Makers", reach: 920,  updated: "3 days ago" },
  { name: "AWS Partner Contacts",      reach: 6400, updated: "1 week ago" },
];

const initialFilters = [
  { field: "Industry",     op: "=",        value: "BFSI"     },
  { field: "Job Title",    op: "contains", value: "C-Level"  },
  { field: "Company Size", op: ">",        value: "500"      },
];

const growthMonths = [
  { month: "Dec", newSubs: 420, churned: 80,  net: 340 },
  { month: "Jan", newSubs: 380, churned: 95,  net: 285 },
  { month: "Feb", newSubs: 510, churned: 72,  net: 438 },
  { month: "Mar", newSubs: 640, churned: 88,  net: 552 },
  { month: "Apr", newSubs: 720, churned: 102, net: 618 },
  { month: "May", newSubs: 180, churned: 45,  net: 135 },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      style={{ position: "fixed", top: 20, right: 24, background: CARD, border: `2px solid ${GREEN}`, borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 600, color: DARK_TEXT, zIndex: 9999, boxShadow: "0 6px 24px rgba(0,0,0,0.18)", maxWidth: 360 }}
    >
      {msg}
    </motion.div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} style={{ display: "inline-flex", marginRight: 6 }}>
      <RefreshCw size={13} />
    </motion.span>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    active:    { label: "Active",    bg: GREEN + "18",   text: GREEN    },
    paused:    { label: "Paused",    bg: AMBER + "22",   text: AMBER    },
    sent:      { label: "Sent",      bg: BLUE  + "18",   text: BLUE     },
    draft:     { label: "Draft",     bg: "#6b728018",    text: "#6b7280"},
    connected: { label: "Connected", bg: GREEN + "18",   text: GREEN    },
    partial:   { label: "Partial",   bg: AMBER + "22",   text: AMBER    },
    success:   { label: "Success",   bg: GREEN + "18",   text: GREEN    },
    warning:   { label: "Warning",   bg: AMBER + "22",   text: AMBER    },
  };
  const s = map[status] ?? map.draft;
  return (
    <span style={{ background: s.bg, color: s.text, borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 700, display: "inline-block" }}>
      {s.label}
    </span>
  );
}

// ─── Campaign Wizard Modal ────────────────────────────────────────────────────
const SEGMENTS = [
  { label: "BFSI Decision Makers",  size: 3200  },
  { label: "All Contacts",          size: 24500 },
  { label: "High Intent",           size: 1800  },
  { label: "Cold Leads",            size: 8400  },
  { label: "MQL Nurture",           size: 4200  },
];

const TEMPLATES_LIST = [
  { name: "Product Announcement", uses: "142 uses", hdr: PRIMARY  },
  { name: "Case Study Spotlight", uses: "89 uses",  hdr: BLUE     },
  { name: "Webinar Invite",       uses: "67 uses",  hdr: GREEN    },
  { name: "Newsletter",           uses: "203 uses", hdr: AMBER    },
];

const TEMPLATE_BODY: Record<string, string> = {
  "Product Announcement": `Hi {{first_name}},\n\nWe're excited to introduce Lyzr AgenticOS — the AI operating system purpose-built for enterprise marketing teams.\n\nWith Lyzr, your team can:\n• Automate 80% of repetitive marketing tasks\n• Deploy AI agents for content, SEO, email, and social\n• Get full observability into every agent action\n\nBook a 30-min demo and see it live.\n\n[Book Demo →]\n\nBest,\nSarah Chen\nHead of Marketing, Lyzr.ai`,
  "Case Study Spotlight": `Hi {{first_name}},\n\nHitachi's marketing team was spending 12 hours every week on manual content approvals. After deploying Lyzr AgenticOS:\n\n✓ 12h/week saved on content workflows\n✓ 94% brand compliance score\n✓ 3x faster campaign launches\n\nRead the full case study to learn how they did it.\n\n[Read Case Study →]\n\nWarm regards,\nSarah Chen`,
  "Webinar Invite": `Hi {{first_name}},\n\nJoin us for an exclusive live demo: "Agentic AI for BFSI Marketing Teams"\n\n📅 Date: Thursday, May 28\n⏰ Time: 11:00 AM IST / 6:30 AM CET\n🎯 Format: 45-min demo + Q&A\n\nSpots are limited — secure yours now.\n\n[Register Free →]\n\nLooking forward to seeing you,\nSarah Chen`,
  "Newsletter": `Hi {{first_name}},\n\nHere's your monthly Lyzr AI Insider:\n\n📌 This month's highlights:\n• New: Budget Agent with real-time spend controls\n• Case study: Accenture saves 8h/week with Brand Guard\n• Upcoming webinar: AI-first GTM strategies for 2026\n\nRead the full issue →\n\nUntil next month,\nThe Lyzr Team`,
};

const AI_SUGGESTIONS = [
  "Add social proof quote from Accenture",
  "Strengthen CTA — use urgency",
  "Personalize opening with recipient name",
];

function CampaignWizard({ onClose, showToast }: { onClose: () => void; showToast: (m: string) => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", subject: "Introducing Agentic OS for BFSI", senderName: "Sarah Chen", senderEmail: "sarah@lyzr.ai",
    segmentIdx: 0, templateIdx: -1,
    body: TEMPLATE_BODY["Product Announcement"],
    variantA: "Introducing Agentic OS for BFSI", variantB: "How Lyzr AI saved Hitachi 12h/week",
    sendTime: "tue10am", winnerMetric: "openRate",
    scheduleType: "now", scheduleDate: "", triggerEvent: "newMQL",
    preview: "desktop",
  });
  const [launching, setLaunching] = useState(false);

  const selectedSeg  = SEGMENTS[formData.segmentIdx];
  const expectedOpen = Math.round(selectedSeg.size * 0.342);

  const update = (k: string, v: string | number) => setFormData(p => ({ ...p, [k]: v }));

  const applyAI = (suggestion: string) => {
    update("body", formData.body + `\n\n[AI Co-pilot applied: ${suggestion}]`);
  };

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      onClose();
      showToast("🚀 Campaign launched! Tracking begins.");
    }, 1600);
  };

  const inputStyle = {
    width: "100%", padding: "9px 11px", borderRadius: 8, border: `1px solid ${BORDER}`,
    background: "white", fontSize: 13, color: DARK_TEXT, outline: "none", boxSizing: "border-box" as const,
  };

  const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: DARK_TEXT, display: "block" as const, marginBottom: 6 };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        style={{ width: 640, maxHeight: "85vh", background: CARD, borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", overflow: "hidden" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>New Email Campaign</h2>
              <p style={{ fontSize: 11, color: MUTED, margin: "3px 0 0" }}>Step {step} of 6</p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4 }}><X size={18} /></button>
          </div>
          {/* Progress bar */}
          <div style={{ display: "flex", gap: 4 }}>
            {[1,2,3,4,5,6].map(s => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? PRIMARY : BORDER, transition: "background 0.3s" }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {["Details", "Template", "Content", "A/B Test", "Schedule", "Review"].map((l, i) => (
              <span key={l} style={{ fontSize: 9, color: i + 1 === step ? PRIMARY : MUTED, fontWeight: i + 1 === step ? 700 : 400, flex: 1, textAlign: "center" }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <AnimatePresence mode="wait">

            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Campaign Name</label>
                  <input value={formData.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Q2 BFSI Outreach" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Subject Line</label>
                  <input value={formData.subject} onChange={e => update("subject", e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Sender Name</label>
                    <input value={formData.senderName} onChange={e => update("senderName", e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Sender Email</label>
                    <input value={formData.senderEmail} onChange={e => update("senderEmail", e.target.value)} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Segment</label>
                  <select value={formData.segmentIdx} onChange={e => update("segmentIdx", Number(e.target.value))}
                    style={{ ...inputStyle, cursor: "pointer" }}>
                    {SEGMENTS.map((s, i) => (
                      <option key={s.label} value={i}>{s.label} ({s.size.toLocaleString()} contacts)</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p style={{ fontSize: 13, color: MUTED, marginBottom: 16, marginTop: 0 }}>Choose a template to start with. You can fully customize it in the next step.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {TEMPLATES_LIST.map((t, i) => (
                    <div key={t.name} onClick={() => { update("templateIdx", i); update("body", TEMPLATE_BODY[t.name] ?? formData.body); }}
                      style={{ border: `2px solid ${formData.templateIdx === i ? PRIMARY : BORDER}`, borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "border 0.2s" }}>
                      <div style={{ height: 80, background: t.hdr + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Mail size={28} color={t.hdr} />
                      </div>
                      <div style={{ padding: "10px 14px" }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT, margin: 0 }}>{t.name}</p>
                        <p style={{ fontSize: 11, color: MUTED, margin: "4px 0 0" }}>{t.uses}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Email Body</label>
                    <textarea value={formData.body} onChange={e => update("body", e.target.value)}
                      style={{ ...inputStyle, minHeight: 280, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} />
                  </div>
                  <div>
                    <label style={labelStyle}>✨ AI Co-pilot</label>
                    <div style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                      {AI_SUGGESTIONS.map(sug => (
                        <div key={sug} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px" }}>
                          <p style={{ fontSize: 11, color: DARK_TEXT, margin: "0 0 8px", lineHeight: 1.4 }}>{sug}</p>
                          <button onClick={() => applyAI(sug)}
                            style={{ background: PRIMARY + "18", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: PRIMARY, fontWeight: 700, cursor: "pointer" }}>
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={labelStyle}>Variant A Subject Line</label>
                  <input value={formData.variantA} onChange={e => update("variantA", e.target.value)} style={{ ...inputStyle, borderLeft: `4px solid ${PRIMARY}` }} />
                </div>
                <div>
                  <label style={labelStyle}>Variant B Subject Line</label>
                  <input value={formData.variantB} onChange={e => update("variantB", e.target.value)} style={{ ...inputStyle, borderLeft: `4px solid ${BLUE}` }} />
                </div>
                <div>
                  <label style={labelStyle}>Send Time</label>
                  {[["tue10am", "Tuesday 10:00 AM"], ["wed2pm", "Wednesday 2:00 PM"], ["thu11am", "Thursday 11:00 AM"]].map(([val, label]) => (
                    <label key={val} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                      <input type="radio" name="sendTime" checked={formData.sendTime === val} onChange={() => update("sendTime", val)} style={{ accentColor: PRIMARY }} />
                      <span style={{ fontSize: 13, color: DARK_TEXT }}>{label}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label style={labelStyle}>Winner Metric</label>
                  {[["openRate", "Open Rate"], ["clickRate", "Click Rate"], ["revenue", "Revenue"]].map(([val, label]) => (
                    <label key={val} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                      <input type="radio" name="winnerMetric" checked={formData.winnerMetric === val} onChange={() => update("winnerMetric", val)} style={{ accentColor: PRIMARY }} />
                      <span style={{ fontSize: 13, color: DARK_TEXT }}>{label}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={labelStyle}>Send Type</label>
                  {[["now", "Send Now"], ["schedule", "Schedule"], ["trigger", "Automated Trigger"]].map(([val, label]) => (
                    <label key={val} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer" }}>
                      <input type="radio" name="scheduleType" checked={formData.scheduleType === val} onChange={() => update("scheduleType", val)} style={{ accentColor: PRIMARY }} />
                      <span style={{ fontSize: 13, color: DARK_TEXT, fontWeight: 600 }}>{label}</span>
                    </label>
                  ))}
                </div>
                {formData.scheduleType === "schedule" && (
                  <div>
                    <label style={labelStyle}>Date &amp; Time</label>
                    <input type="datetime-local" style={{ ...inputStyle, width: "auto" }} />
                  </div>
                )}
                {formData.scheduleType === "trigger" && (
                  <div>
                    <label style={labelStyle}>Trigger Event</label>
                    <select value={formData.triggerEvent} onChange={e => update("triggerEvent", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="newMQL">New MQL</option>
                      <option value="formSubmit">Form Submit</option>
                      <option value="meetingBooked">Meeting Booked</option>
                    </select>
                  </div>
                )}
                {/* Estimated reach */}
                <div style={{ background: PRIMARY + "10", border: `1px solid ${PRIMARY}30`, borderRadius: 12, padding: "16px 20px" }}>
                  <p style={{ fontSize: 12, color: MUTED, margin: "0 0 4px" }}>Estimated Reach</p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>{selectedSeg.size.toLocaleString()} <span style={{ fontSize: 13, fontWeight: 600, color: MUTED }}>contacts</span></p>
                  <p style={{ fontSize: 12, color: MUTED, margin: "6px 0 0" }}>~34.2% expected open rate = <strong style={{ color: DARK_TEXT }}>~{expectedOpen.toLocaleString()} opens</strong></p>
                </div>
              </motion.div>
            )}

            {/* Step 6 */}
            {step === 6 && (
              <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 20px" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT, margin: "0 0 12px" }}>Campaign Summary</p>
                  {[
                    ["Campaign Name", formData.name || "(Untitled)"],
                    ["Subject",       formData.subject],
                    ["Segment",       `${selectedSeg.label} (${selectedSeg.size.toLocaleString()})`],
                    ["Template",      TEMPLATES_LIST[formData.templateIdx]?.name ?? "None selected"],
                    ["Schedule",      formData.scheduleType === "now" ? "Send immediately" : formData.scheduleType === "schedule" ? "Scheduled" : "Automated trigger"],
                    ["A/B Test",      "Active — 2 subject variants"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: MUTED, fontWeight: 500 }}>{k}</span>
                      <span style={{ color: DARK_TEXT, fontWeight: 700 }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Preview toggle */}
                <div>
                  <label style={labelStyle}>Preview</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["desktop", "🖥 Desktop"], ["mobile", "📱 Mobile"]].map(([val, label]) => (
                      <button key={val} onClick={() => update("preview", val)}
                        style={{ padding: "8px 20px", borderRadius: 8, border: `2px solid ${formData.preview === val ? PRIMARY : BORDER}`, background: formData.preview === val ? PRIMARY + "10" : "white", color: formData.preview === val ? PRIMARY : MUTED, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 10, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 12, color: MUTED }}>{formData.preview === "desktop" ? "Desktop preview" : "Mobile preview"} — {formData.subject}</span>
                  </div>
                </div>

                {/* Spam score */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: GREEN + "10", border: `1px solid ${GREEN}30`, borderRadius: 8, padding: "10px 14px" }}>
                  <CheckCircle size={16} color={GREEN} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>Spam Score: <span style={{ color: GREEN }}>Low (2/10)</span> — Good to send</span>
                </div>

                <button
                  onClick={handleLaunch}
                  disabled={launching}
                  style={{ padding: "13px", borderRadius: 10, background: launching ? MUTED : PRIMARY, color: "white", fontWeight: 800, fontSize: 14, border: "none", cursor: launching ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  {launching ? <><Spinner />Launching…</> : "🚀 Launch Campaign"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", color: step === 1 ? MUTED : DARK_TEXT, fontWeight: 600, fontSize: 13, cursor: step === 1 ? "default" : "pointer", opacity: step === 1 ? 0.5 : 1 }}>
            <ChevronLeft size={14} /> Back
          </button>
          <span style={{ fontSize: 12, color: MUTED }}>Step {step} of 6</span>
          {step < 6 ? (
            <button onClick={() => setStep(s => Math.min(6, s + 1))}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 8, border: "none", background: PRIMARY, color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Next <ChevronRight size={14} />
            </button>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Tab 1: Email Campaigns ───────────────────────────────────────────────────
function EmailCampaignsTab({ showToast }: { showToast: (m: string) => void }) {
  const [showWizard, setShowWizard] = useState(false);
  const [campaignStates, setCampaignStates] = useState<Record<number, string>>({});

  const getStatus = (c: typeof emailCampaigns[0]) => campaignStates[c.id] ?? c.status;

  const togglePause = (c: typeof emailCampaigns[0]) => {
    const cur = getStatus(c);
    if (cur === "active") {
      setCampaignStates(p => ({ ...p, [c.id]: "paused" }));
      showToast(`"${c.name}" paused.`);
    } else if (cur === "paused") {
      setCampaignStates(p => ({ ...p, [c.id]: "active" }));
      showToast(`"${c.name}" resumed.`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <AnimatePresence>
        {showWizard && <CampaignWizard onClose={() => setShowWizard(false)} showToast={showToast} />}
      </AnimatePresence>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Total Contacts",     value: "24,500", icon: Users,      color: PRIMARY, sub: "Across all lists"   },
          { label: "Active Sequences",   value: "8",      icon: Zap,        color: BLUE,   sub: "Running right now"  },
          { label: "Avg Open Rate",      value: "34.2%",  icon: Mail,       color: GREEN,  sub: "Industry avg: 21.5%" },
          { label: "Revenue Attributed", value: "$420K",  icon: TrendingUp, color: AMBER,  sub: "This quarter"        },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Icon size={18} color={s.color} />
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: DARK_TEXT }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT }}>{s.label}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{s.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: DARK_TEXT }}>Email Campaigns</div>
          <button onClick={() => setShowWizard(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: PRIMARY, border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, color: "#fff", cursor: "pointer", fontWeight: 700 }}>
            <Plus size={13} /> New Campaign
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: PAGE_BG }}>
                {["Name", "Status", "Contacts", "Open Rate", "Click Rate", "Revenue", "Actions"].map(h => (
                  <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: MUTED, padding: "10px 16px", borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emailCampaigns.map((row, i) => {
                const status = getStatus(row);
                return (
                  <motion.tr key={row.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    onMouseEnter={e => (e.currentTarget.style.background = PAGE_BG)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: DARK_TEXT, borderBottom: `1px solid ${BORDER}` }}>{row.name}</td>
                    <td style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}><StatusBadge status={status} /></td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: DARK_TEXT, borderBottom: `1px solid ${BORDER}` }}>{row.contacts.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: row.openRate === "—" ? MUTED : GREEN, borderBottom: `1px solid ${BORDER}` }}>{row.openRate}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: row.clickRate === "—" ? MUTED : DARK_TEXT, borderBottom: `1px solid ${BORDER}` }}>{row.clickRate}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: row.revenue === "—" ? MUTED : PRIMARY, borderBottom: `1px solid ${BORDER}` }}>{row.revenue}</td>
                    <td style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}` }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => showToast(`Editing "${row.name}"…`)}
                          style={{ display: "flex", alignItems: "center", gap: 4, background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, color: DARK_TEXT, cursor: "pointer", fontWeight: 600 }}>
                          <Edit size={11} /> Edit
                        </button>
                        {status === "active" && (
                          <button onClick={() => togglePause(row)}
                            style={{ display: "flex", alignItems: "center", gap: 4, background: AMBER + "15", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: AMBER, cursor: "pointer", fontWeight: 600 }}>
                            <Pause size={11} /> Pause
                          </button>
                        )}
                        {status === "paused" && (
                          <button onClick={() => togglePause(row)}
                            style={{ display: "flex", alignItems: "center", gap: 4, background: GREEN + "15", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: GREEN, cursor: "pointer", fontWeight: 600 }}>
                            <Play size={11} /> Resume
                          </button>
                        )}
                        {status === "sent" && (
                          <button onClick={() => showToast(`Opening report for "${row.name}"…`)}
                            style={{ display: "flex", alignItems: "center", gap: 4, background: BLUE + "15", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: BLUE, cursor: "pointer", fontWeight: 600 }}>
                            <Eye size={11} /> View Report
                          </button>
                        )}
                        {status === "draft" && (
                          <button onClick={() => showToast(`"${row.name}" deleted.`)}
                            style={{ display: "flex", alignItems: "center", gap: 4, background: RED + "10", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: RED, cursor: "pointer", fontWeight: 600 }}>
                            <Trash2 size={11} /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tab 2: Automation Flows ──────────────────────────────────────────────────
const AUTO_TEMPLATES = ["Welcome Series", "MQL Nurture", "Re-engagement", "Abandoned Cart"];

type AutoNode = { id: string; label: string; sub: string; x: number; y: number; color: string; chip?: string };
type AutoEdge = { from: string; to: string };

const WELCOME_NODES: AutoNode[] = [
  { id: "a1", label: "New Subscriber", sub: "Trigger",        x: 40,  y: 180, color: GREEN  },
  { id: "a2", label: "Welcome Email",  sub: "open rate: 42%", x: 220, y: 180, color: BLUE   },
  { id: "a3", label: "Delay 3 Days",   sub: "72h delay",      x: 400, y: 180, color: MUTED  },
  { id: "a4", label: "Opened?",        sub: "Condition",      x: 580, y: 180, color: AMBER  },
  { id: "a5", label: "Onboarding",     sub: "click 8.2%",     x: 760, y: 100, color: BLUE   },
  { id: "a6", label: "Re-send Variant",sub: "NO branch",      x: 760, y: 260, color: BLUE   },
];
const WELCOME_EDGES: AutoEdge[] = [
  { from: "a1", to: "a2" }, { from: "a2", to: "a3" }, { from: "a3", to: "a4" },
  { from: "a4", to: "a5" }, { from: "a4", to: "a6" },
];

const MQL_NODES: AutoNode[] = [
  { id: "b1", label: "New MQL",       sub: "Trigger",      x: 40,  y: 180, color: GREEN  },
  { id: "b2", label: "Score Lead",    sub: "AI Agent",     x: 220, y: 180, color: PRIMARY},
  { id: "b3", label: "Score ≥70?",    sub: "Condition",    x: 400, y: 180, color: AMBER  },
  { id: "b4", label: "BFSI Nurture",  sub: "YES — 5 steps",x: 580, y: 100, color: BLUE   },
  { id: "b5", label: "Cold Nurture",  sub: "NO — 3 steps", x: 580, y: 260, color: MUTED  },
  { id: "b6", label: "CRM Update",    sub: "Tag + stage",  x: 760, y: 180, color: PRIMARY},
];
const MQL_EDGES: AutoEdge[] = [
  { from: "b1", to: "b2" }, { from: "b2", to: "b3" },
  { from: "b3", to: "b4" }, { from: "b3", to: "b5" },
  { from: "b4", to: "b6" }, { from: "b5", to: "b6" },
];

const AUTO_FLOWS: Record<string, { nodes: AutoNode[]; edges: AutoEdge[] }> = {
  "Welcome Series":  { nodes: WELCOME_NODES, edges: WELCOME_EDGES },
  "MQL Nurture":     { nodes: MQL_NODES,     edges: MQL_EDGES      },
  "Re-engagement":   { nodes: WELCOME_NODES, edges: WELCOME_EDGES  },
  "Abandoned Cart":  { nodes: MQL_NODES,     edges: MQL_EDGES      },
};

const AW = 120; const AH = 52;
function cx(n: AutoNode) { return n.x + AW / 2; }
function cy(n: AutoNode) { return n.y + AH / 2; }
function getNode(nodes: AutoNode[], id: string) { return nodes.find(n => n.id === id)!; }

function AutoCanvasFlow({ nodes, edges }: { nodes: AutoNode[]; edges: AutoEdge[] }) {
  const cw = Math.max(...nodes.map(n => n.x + AW + 80), 900);
  const ch = Math.max(...nodes.map(n => n.y + AH + 80), 380);

  function pathD(fromId: string, toId: string) {
    const f = getNode(nodes, fromId); const t = getNode(nodes, toId);
    const x1 = f.x + AW, y1 = cy(f), x2 = t.x, y2 = cy(t);
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }

  return (
    <div style={{ position: "relative", width: cw, height: ch }}>
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }} width={cw} height={ch}>
        <defs>
          <marker id="aw-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={BORDER} />
          </marker>
        </defs>
        {edges.map((e, i) => (
          <path key={i} d={pathD(e.from, e.to)} fill="none" stroke={BORDER} strokeWidth={2} markerEnd="url(#aw-arrow)" />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <motion.div key={n.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
          style={{ position: "absolute", left: n.x, top: n.y, width: AW, height: AH, background: CARD, borderRadius: 9, border: `1.5px solid ${n.color}`, overflow: "hidden", cursor: "pointer" }}>
          <div style={{ height: 4, background: n.color }} />
          <div style={{ padding: "6px 10px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: DARK_TEXT, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.label}</p>
            <p style={{ fontSize: 9, color: MUTED, margin: "2px 0 0" }}>{n.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AutomationFlowsTab({ showToast }: { showToast: (m: string) => void }) {
  const [activeTpl, setActiveTpl] = useState("Welcome Series");
  const [running, setRunning] = useState(false);
  const flow = AUTO_FLOWS[activeTpl];

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); showToast("✓ Sequence initiated — 3,200 contacts enrolled."); }, 1800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 2, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4 }}>
          {AUTO_TEMPLATES.map(t => (
            <button key={t} onClick={() => setActiveTpl(t)}
              style={{ padding: "6px 12px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: activeTpl === t ? PRIMARY : "transparent", color: activeTpl === t ? "white" : MUTED }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: running ? "Running…" : "▶ Run Workflow", action: handleRun, bg: running ? GREEN : PRIMARY, color: "white" },
            { label: "💾 Save",  action: () => showToast("Flow saved."),         bg: CARD,    color: DARK_TEXT },
            { label: "🧪 Test",  action: () => showToast("Test run started."),   bg: CARD,    color: DARK_TEXT },
            { label: "⏸ Pause", action: () => showToast("Flow paused."),        bg: CARD,    color: DARK_TEXT },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action} disabled={btn.label.startsWith("▶") && running}
              style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, background: btn.bg, color: btn.color, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, overflow: "auto", backgroundImage: `radial-gradient(circle, ${BORDER} 1px, transparent 1px)`, backgroundSize: "24px 24px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTpl} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AutoCanvasFlow nodes={flow.nodes} edges={flow.edges} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Tab 3: List Health ───────────────────────────────────────────────────────
function ListHealthTab({ showToast }: { showToast: (m: string) => void }) {
  const [cleaning, setCleaning] = useState(false);

  const handleClean = () => {
    setCleaning(true);
    setTimeout(() => { setCleaning(false); showToast("✓ Removed 1,500 bounced emails. Sender score improved to 94/100."); }, 1500);
  };

  // SVG circular progress
  const r = 40; const circ = 2 * Math.PI * r; const pct = 92 / 100;
  const dash = circ * pct; const gap = circ - dash;

  const segments = [
    { label: "Enterprise BFSI", count: 8330,  pct: 34, color: PRIMARY },
    { label: "High Intent",     count: 5390,  pct: 22, color: GREEN   },
    { label: "MQL Nurture",     count: 4410,  pct: 18, color: BLUE    },
    { label: "Cold Leads",      count: 6370,  pct: 26, color: MUTED   },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total",        value: "24,500", sub: "↑180 this week", color: PRIMARY, icon: Users        },
          { label: "Active",       value: "21,800", sub: "89% active",     color: GREEN,  icon: CheckCircle   },
          { label: "Unsubscribed", value: "1,200",  sub: "4.9% churn",     color: AMBER,  icon: Pause         },
          { label: "Bounced",      value: "1,500",  sub: "6.1% bounce",    color: RED,    icon: AlertCircle   },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 18 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Icon size={16} color={s.color} />
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: DARK_TEXT }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT }}>{s.label}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{s.sub}</div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Deliverability */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, margin: "0 0 20px" }}>Deliverability Health</p>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 20 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={r} fill="none" stroke={BORDER} strokeWidth="8" />
              <circle cx="50" cy="50" r={r} fill="none" stroke={GREEN} strokeWidth="8"
                strokeDasharray={`${dash} ${gap}`} strokeLinecap="round"
                transform="rotate(-90 50 50)" />
              <text x="50" y="53" textAnchor="middle" fontSize="14" fontWeight="800" fill={DARK_TEXT}>92</text>
              <text x="50" y="66" textAnchor="middle" fontSize="8" fill={MUTED}>/100</text>
            </svg>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT, margin: "0 0 4px" }}>Sender Score</p>
              <p style={{ fontSize: 11, color: GREEN, fontWeight: 600, margin: 0 }}>Excellent — top 10%</p>
            </div>
          </div>
          {[
            { label: "Inbox Rate",    value: "94.2%", color: GREEN },
            { label: "Spam Rate",     value: "0.8%",  color: AMBER },
            { label: "Forward Rate",  value: "1.4%",  color: BLUE  },
          ].map(d => (
            <div key={d.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: DARK_TEXT, fontWeight: 500 }}>{d.label}</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: d.color }}>{d.value}</span>
            </div>
          ))}
        </div>

        {/* Segment Breakdown */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, margin: "0 0 20px" }}>Segment Breakdown</p>
          {segments.map(s => (
            <div key={s.label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: DARK_TEXT }}>{s.label}</span>
                <span style={{ color: MUTED }}>{s.pct}% ({s.count.toLocaleString()} contacts)</span>
              </div>
              <div style={{ background: BORDER, borderRadius: 4, height: 10, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.7, ease: "easeOut" }}
                  style={{ height: "100%", background: s.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* List growth table */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, margin: 0, padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>List Growth — Last 6 Months</p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: PAGE_BG }}>
              {["Month", "New Subs", "Churned", "Net Growth"].map(h => (
                <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: MUTED, padding: "10px 20px", borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {growthMonths.map((row, i) => (
              <tr key={row.month} style={{ borderBottom: `1px solid ${BORDER}` }}
                onMouseEnter={e => (e.currentTarget.style.background = PAGE_BG)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "10px 20px", fontSize: 13, fontWeight: 700, color: DARK_TEXT }}>{row.month}{i === 5 ? " (partial)" : ""}</td>
                <td style={{ padding: "10px 20px", fontSize: 12, fontWeight: 600, color: GREEN }}>+{row.newSubs}</td>
                <td style={{ padding: "10px 20px", fontSize: 12, fontWeight: 600, color: RED }}>-{row.churned}</td>
                <td style={{ padding: "10px 20px", fontSize: 13, fontWeight: 800, color: row.net >= 0 ? GREEN : RED }}>
                  {row.net >= 0 ? "+" : ""}{row.net}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clean list button */}
      <button onClick={handleClean} disabled={cleaning}
        style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${BORDER}`, background: cleaning ? PAGE_BG : CARD, color: DARK_TEXT, fontWeight: 700, fontSize: 13, cursor: cleaning ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {cleaning ? <><Spinner />Cleaning…</> : "🧹 Clean List — Remove 1,500 bounced emails"}
      </button>
    </motion.div>
  );
}

// ─── Tab 4: CRM Sync ──────────────────────────────────────────────────────────
function CRMSyncTab({ showToast }: { showToast: (m: string) => void }) {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => { setSyncing(false); showToast("✓ Sync complete — all CRMs up to date."); }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* CRM Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {crmConnectors.map((crm, i) => (
          <motion.div key={crm.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: `3px solid ${crm.color}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>{crm.name}</p>
                <p style={{ fontSize: 11, color: MUTED, margin: "3px 0 0" }}>Last sync: {crm.lastSync}</p>
              </div>
              <StatusBadge status={crm.status} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: MUTED }}>Contacts synced</span>
                <span style={{ fontWeight: 700, color: DARK_TEXT }}>{crm.contacts.toLocaleString()}</span>
              </div>
              {crm.deals != null && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: MUTED }}>{crm.dealsLabel}</span>
                  <span style={{ fontWeight: 700, color: PRIMARY }}>{crm.deals}</span>
                </div>
              )}
            </div>
            <button onClick={() => showToast(`${crm.name} settings opened.`)}
              style={{ width: "100%", marginTop: 14, padding: "7px 0", borderRadius: 8, border: `1px solid ${BORDER}`, background: "transparent", fontSize: 11, fontWeight: 600, color: DARK_TEXT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Settings size={12} /> Configure
            </button>
          </motion.div>
        ))}
      </div>

      {/* Sync history */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, margin: 0 }}>Sync History</p>
          <button onClick={handleSync} disabled={syncing}
            style={{ display: "flex", alignItems: "center", gap: 6, background: PRIMARY, border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, color: "#fff", cursor: syncing ? "default" : "pointer", fontWeight: 700 }}>
            {syncing ? <><Spinner />Syncing…</> : <><RefreshCw size={13} /> 🔄 Sync Now</>}
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: PAGE_BG }}>
              {["Time", "CRM", "Records Updated", "Status"].map(h => (
                <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: MUTED, padding: "10px 16px", borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {syncHistory.map((s, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}
                onMouseEnter={e => (e.currentTarget.style.background = PAGE_BG)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "11px 16px", fontSize: 12, color: MUTED }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Clock size={11} color={MUTED} /> {s.time}
                  </div>
                </td>
                <td style={{ padding: "11px 16px", fontSize: 12, fontWeight: 600, color: DARK_TEXT }}>{s.crm}</td>
                <td style={{ padding: "11px 16px", fontSize: 12, color: DARK_TEXT }}>{s.records} records</td>
                <td style={{ padding: "11px 16px" }}><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── Tab 5: Segmentation ──────────────────────────────────────────────────────
function SegmentationTab({ showToast }: { showToast: (m: string) => void }) {
  const [filters, setFilters] = useState(initialFilters);

  const addFilter = () => setFilters(p => [...p, { field: "Region", op: "=", value: "India" }]);
  const removeFilter = (idx: number) => setFilters(p => p.filter((_, i) => i !== idx));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Segment builder */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, margin: "0 0 4px" }}>Segment Builder</p>
          <p style={{ fontSize: 11, color: MUTED, margin: "0 0 20px" }}>Build a custom audience from your contact list</p>

          <div style={{ marginBottom: 14 }}>
            {filters.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                {i > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: MUTED, width: 28, textAlign: "center", flexShrink: 0 }}>AND</span>}
                {i === 0 && <div style={{ width: 28, flexShrink: 0 }} />}

                <select defaultValue={f.field}
                  style={{ flex: 1.2, padding: "7px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 12, color: DARK_TEXT, outline: "none" }}>
                  <option>Industry</option><option>Job Title</option><option>Company Size</option><option>Region</option><option>Revenue</option>
                </select>
                <select defaultValue={f.op}
                  style={{ flex: 0.8, padding: "7px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 11, color: MUTED, outline: "none" }}>
                  <option>=</option><option>contains</option><option>&gt;</option><option>&lt;</option>
                </select>
                <input defaultValue={f.value}
                  style={{ flex: 1.8, padding: "7px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "white", fontSize: 11, color: DARK_TEXT, outline: "none" }} />
                <button onClick={() => removeFilter(i)}
                  style={{ width: 26, height: 26, borderRadius: 6, background: RED + "10", border: "none", color: RED, cursor: "pointer", fontSize: 16, fontWeight: 700, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ×
                </button>
              </motion.div>
            ))}
          </div>

          <button onClick={addFilter}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: `1.5px dashed ${BORDER}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, color: MUTED, cursor: "pointer", fontWeight: 600, marginBottom: 22, width: "100%", justifyContent: "center" }}>
            <Plus size={13} /> Add Filter
          </button>

          {/* Estimated reach */}
          <div style={{ background: GREEN + "10", border: `1px solid ${GREEN}30`, borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: MUTED, margin: "0 0 2px" }}>Estimated Reach</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>3,200 <span style={{ fontSize: 13, fontWeight: 600, color: MUTED }}>contacts</span></p>
              <p style={{ fontSize: 11, color: MUTED, margin: "4px 0 0" }}>13.1% of total list</p>
            </div>
            <button onClick={() => showToast("Segment saved.")}
              style={{ background: PRIMARY, border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 12, color: "#fff", cursor: "pointer", fontWeight: 700 }}>
              Save Segment
            </button>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => showToast("Exporting CSV…")}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 0", fontSize: 12, color: DARK_TEXT, cursor: "pointer", fontWeight: 600 }}>
              <Download size={13} /> Export CSV
            </button>
            <button onClick={() => showToast("Opening campaign for this segment…")}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: BLUE + "15", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 12, color: BLUE, cursor: "pointer", fontWeight: 600 }}>
              <Mail size={13} /> Send Campaign
            </button>
          </div>
        </div>

        {/* Saved segments */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, margin: "0 0 16px" }}>Saved Segments</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {savedSegments.map((seg, i) => (
              <motion.div key={seg.name} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                style={{ background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT, margin: 0 }}>{seg.name}</p>
                  <button onClick={() => showToast(`Editing "${seg.name}"…`)}
                    style={{ background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "3px 8px", fontSize: 10, color: PRIMARY, cursor: "pointer", fontWeight: 600 }}>
                    <Edit size={9} style={{ display: "inline", marginRight: 3 }} />Edit
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <span style={{ fontSize: 11, color: MUTED }}>Reach: <strong style={{ color: DARK_TEXT }}>{seg.reach.toLocaleString()}</strong></span>
                    <span style={{ fontSize: 11, color: MUTED }}>Updated: <strong style={{ color: DARK_TEXT }}>{seg.updated}</strong></span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => showToast(`Exporting "${seg.name}"…`)}
                      style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 10, color: MUTED, display: "flex", alignItems: "center", gap: 3 }}>
                      <Download size={10} /> Export
                    </button>
                    <button onClick={() => showToast(`Campaign for "${seg.name}" opened.`)}
                      style={{ background: BLUE + "10", border: "none", cursor: "pointer", fontSize: 10, color: BLUE, display: "flex", alignItems: "center", gap: 3, borderRadius: 5, padding: "3px 7px" }}>
                      <Mail size={10} /> Campaign
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "email",      label: "Email Campaigns",  icon: Mail      },
  { id: "automation", label: "Automation Flows",  icon: Zap       },
  { id: "health",     label: "List Health",       icon: Activity  },
  { id: "crm",        label: "CRM Sync",          icon: Link2     },
  { id: "segments",   label: "Segmentation",      icon: Filter    },
];

export default function EmailCRMPage() {
  const [activeTab, setActiveTab] = useState("email");
  const [toast, setToast]         = useState<string | null>(null);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key={toast} msg={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 28px" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: PRIMARY, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mail size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>Email & CRM Hub</h1>
              <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>Campaigns, automation, list health &amp; CRM integrations</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => showToast("Exporting data…")}
              style={{ background: "transparent", border: `1.5px solid ${BORDER}`, borderRadius: 9, padding: "9px 16px", fontSize: 13, fontWeight: 600, color: DARK_TEXT, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Download size={14} /> Export
            </button>
          </div>
        </motion.div>

        {/* Tab Bar */}
        <div style={{ display: "flex", gap: 2, marginBottom: 24, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 5, width: "fit-content" }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.2s", background: active ? PRIMARY : "transparent", color: active ? "#fff" : MUTED, boxShadow: active ? "0 2px 8px rgba(0,0,0,0.12)" : "none" }}>
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}>
            {activeTab === "email"      && <EmailCampaignsTab showToast={showToast} />}
            {activeTab === "automation" && <AutomationFlowsTab showToast={showToast} />}
            {activeTab === "health"     && <ListHealthTab showToast={showToast} />}
            {activeTab === "crm"        && <CRMSyncTab showToast={showToast} />}
            {activeTab === "segments"   && <SegmentationTab showToast={showToast} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
