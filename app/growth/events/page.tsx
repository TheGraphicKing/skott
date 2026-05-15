"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Users, TrendingUp, DollarSign, CheckCircle,
  AlertCircle, Clock, ChevronRight, Mic, Globe, Target, BarChart3,
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
  { label: "Upcoming Events",  value: "6",     sub: "next 90 days",        icon: Calendar,    color: PRIMARY },
  { label: "Registrations",    value: "1,840",  sub: "across all events",  icon: Users,       color: BLUE },
  { label: "Leads Generated",  value: "342",    sub: "MQLs from events",   icon: Target,      color: GREEN },
  { label: "Avg ROI",          value: "3.2×",   sub: "vs 2.8× last Q",     icon: TrendingUp,  color: AMBER },
];

const events = [
  {
    id: 1, name: "Agentic AI for BFSI", type: "Webinar",    date: "Jun 3, 2026",  status: "Upcoming",
    registrations: 340, cost: "$8K",  roi: "4.1×", leads: 62,
    speakers: [
      { name: "Siva Surendira", company: "Lyzr AI", topic: "The Agentic Enterprise", status: "Confirmed" },
      { name: "Mark Beccue",    company: "Omdia",   topic: "AI in Banking 2026",     status: "Confirmed" },
    ],
    followUp: [
      { task: "Send recording to all registrants", done: false },
      { task: "Create highlights clip for LinkedIn", done: false },
      { task: "Add attendees to ABM nurture sequence", done: false },
      { task: "Schedule 1:1 follow-ups for hot leads", done: false },
    ],
  },
  {
    id: 2, name: "AI Summit 2026", type: "Conference", date: "Jun 15, 2026", status: "Upcoming",
    registrations: 450, cost: "$45K", roi: "3.8×", leads: 89,
    speakers: [
      { name: "Sarah Chen",  company: "Lyzr AI", topic: "CMO Panel: AI-First Marketing", status: "Confirmed" },
    ],
    followUp: [
      { task: "Book booth shipping", done: true },
      { task: "Prepare demo station", done: true },
      { task: "Send pre-event ABM mailer", done: false },
    ],
  },
  {
    id: 3, name: "OGI Deep Dive", type: "Virtual",    date: "Jun 22, 2026", status: "Upcoming",
    registrations: 280, cost: "$5K",  roi: "3.4×", leads: 51,
    speakers: [
      { name: "Siva Surendira", company: "Lyzr AI",    topic: "OGI: The Next Platform Shift", status: "Confirmed" },
      { name: "Craig Le Clair", company: "Forrester",  topic: "AI Agent Frameworks",          status: "Tentative" },
    ],
    followUp: [
      { task: "Finalize registration page", done: true },
      { task: "Create promotional assets", done: false },
    ],
  },
  {
    id: 4, name: "AWS re:Invent", type: "Conference", date: "Jul 8, 2026",  status: "Planning",
    registrations: 0,   cost: "$60K", roi: "—",    leads: 0,
    speakers: [],
    followUp: [
      { task: "Confirm partner booth location", done: false },
      { task: "Align with AWS co-marketing team", done: false },
      { task: "Design co-branded materials", done: false },
    ],
  },
  {
    id: 5, name: "Lyzr Customer Day", type: "Virtual",    date: "Jul 15, 2026", status: "Planning",
    registrations: 180, cost: "$12K", roi: "2.8×", leads: 38,
    speakers: [
      { name: "Siva Surendira", company: "Lyzr AI", topic: "Product Roadmap 2026–27", status: "Confirmed" },
    ],
    followUp: [
      { task: "Invite top 50 customers", done: false },
      { task: "Prepare product demo", done: false },
    ],
  },
  {
    id: 6, name: "FinTech Connect", type: "Conference", date: "Jul 28, 2026", status: "Planning",
    registrations: 0, cost: "$30K", roi: "—", leads: 0,
    speakers: [],
    followUp: [
      { task: "Submit speaker proposal", done: false },
      { task: "Reserve expo space", done: false },
    ],
  },
];

const typeColor: Record<string, string> = { Webinar: PRIMARY, Conference: BLUE, Virtual: GREEN };
const statusColor: Record<string, string> = { Upcoming: GREEN, Planning: AMBER, Completed: MUTED };

export default function EventCommandCenter() {
  const [selected, setSelected] = useState<number | null>(null);
  const [followUp, setFollowUp] = useState<Record<string, boolean>>({});

  const selectedEvent = events.find((e) => e.id === selected);

  function toggleTask(key: string) {
    setFollowUp((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div style={{ minHeight: "100vh", background: PAGE_BG, padding: "32px 40px", fontFamily: "inherit" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>Event Command Center</h1>
            <p style={{ margin: "4px 0 0", color: MUTED, fontSize: 14 }}>
              Webinars, conferences & virtual events · Q2–Q3 FY2026
            </p>
          </div>
          <button style={{
            background: PRIMARY, color: "#fff", border: "none", borderRadius: 10,
            padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Calendar size={14} /> New Event
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

      {/* Main layout */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 420px" : "1fr", gap: 24 }}>
        {/* Event list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setSelected(selected === event.id ? null : event.id)}
              style={{
                background: CARD,
                border: `2px solid ${selected === event.id ? PRIMARY : BORDER}`,
                borderRadius: 12, padding: "18px 22px", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20,
                transition: "border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1 }}>
                <div style={{
                  background: `${typeColor[event.type] || PRIMARY}18`, borderRadius: 10, padding: 12, flexShrink: 0,
                }}>
                  {event.type === "Webinar" ? <Mic size={18} color={typeColor[event.type]} /> :
                   event.type === "Virtual" ? <Globe size={18} color={typeColor[event.type]} /> :
                   <BarChart3 size={18} color={typeColor[event.type]} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: DARK_TEXT }}>{event.name}</span>
                    <span style={{
                      background: `${typeColor[event.type]}20`, color: typeColor[event.type],
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999,
                    }}>{event.type}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 5 }}>
                    <span style={{ fontSize: 12, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar size={12} /> {event.date}
                    </span>
                    <span style={{ fontSize: 12, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}>
                      <Users size={12} /> {event.registrations > 0 ? `${event.registrations} registered` : "Planning"}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: MUTED }}>Cost</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: DARK_TEXT }}>{event.cost}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: MUTED }}>ROI</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: event.roi !== "—" ? GREEN : MUTED }}>{event.roi}</div>
                </div>
                <span style={{
                  background: `${statusColor[event.status]}20`,
                  color: statusColor[event.status],
                  fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 9999,
                }}>{event.status}</span>
                <ChevronRight size={16} color={MUTED}
                  style={{ transform: selected === event.id ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && selectedEvent && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {/* Metrics */}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: DARK_TEXT }}>
                  {selectedEvent.name} — Metrics
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Registrations", value: selectedEvent.registrations || "—", color: BLUE },
                    { label: "Leads Generated", value: selectedEvent.leads || "—", color: GREEN },
                    { label: "Cost",           value: selectedEvent.cost,           color: PRIMARY },
                    { label: "ROI",            value: selectedEvent.roi,            color: AMBER },
                  ].map((m) => (
                    <div key={m.label} style={{
                      background: PAGE_BG, border: `1px solid ${BORDER}`,
                      borderRadius: 10, padding: "12px", textAlign: "center",
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.value}</div>
                      <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speakers */}
              {selectedEvent.speakers.length > 0 && (
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px" }}>
                  <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: DARK_TEXT }}>Speaker Management</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {selectedEvent.speakers.map((sp, i) => (
                      <div key={i} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        background: PAGE_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px",
                      }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: DARK_TEXT }}>{sp.name}</div>
                          <div style={{ fontSize: 11, color: MUTED }}>{sp.company} · {sp.topic}</div>
                        </div>
                        <span style={{
                          background: sp.status === "Confirmed" ? `${GREEN}20` : `${AMBER}20`,
                          color: sp.status === "Confirmed" ? GREEN : AMBER,
                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999,
                        }}>{sp.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up checklist */}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px" }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: DARK_TEXT }}>Post-Event Follow-Up</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {selectedEvent.followUp.map((item, i) => {
                    const key = `${selectedEvent.id}-${i}`;
                    const done = followUp[key] ?? item.done;
                    return (
                      <div
                        key={i}
                        onClick={() => toggleTask(key)}
                        style={{
                          display: "flex", gap: 12, alignItems: "center", cursor: "pointer",
                          padding: "10px 12px", background: done ? `${GREEN}10` : PAGE_BG,
                          border: `1px solid ${done ? GREEN + "40" : BORDER}`, borderRadius: 10,
                          transition: "all 0.2s",
                        }}
                      >
                        {done
                          ? <CheckCircle size={16} color={GREEN} />
                          : <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${BORDER}` }} />
                        }
                        <span style={{
                          fontSize: 12, color: done ? MUTED : DARK_TEXT,
                          textDecoration: done ? "line-through" : "none",
                        }}>
                          {item.task}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
