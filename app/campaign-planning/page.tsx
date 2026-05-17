"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, AlertCircle, Brain, ChevronDown, ChevronUp,
  Users, Rocket, Calendar, ChevronRight,
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

// ─── Campaign Data ────────────────────────────────────────────────────────────
type CampaignStatus = "Active" | "At Risk" | "Planning" | "Complete";
interface Campaign {
  name: string; status: CampaignStatus; owner: string; budget: string;
  progress: number; roasOrRoi: string;
}
const allCampaigns: Campaign[] = [
  { name: "BFSI Vertical Launch",     status: "Active",   owner: "EW", budget: "$180K", progress: 68,  roasOrRoi: "3.4×" },
  { name: "OGI Whitepaper Campaign",  status: "At Risk",  owner: "EW", budget: "$45K",  progress: 30,  roasOrRoi: "2.8×" },
  { name: "AWS Partnership",          status: "Active",   owner: "RP", budget: "$28K",  progress: 85,  roasOrRoi: "4.2×" },
  { name: "Hitachi Case Study",       status: "Active",   owner: "DK", budget: "$32K",  progress: 55,  roasOrRoi: "1.9×" },
  { name: "Series A PR",              status: "Complete", owner: "JT", budget: "$15K",  progress: 100, roasOrRoi: "8.5×" },
  { name: "LinkedIn ABM Enterprise",  status: "Active",   owner: "PS", budget: "$98K",  progress: 45,  roasOrRoi: "4.8×" },
  { name: "Agentic OS APAC",          status: "Planning", owner: "AR", budget: "$62K",  progress: 10,  roasOrRoi: "—"    },
];

const statusColor: Record<CampaignStatus, string> = {
  Active: GREEN, "At Risk": RED, Planning: BLUE, Complete: MUTED,
};

// ─── Team Data ────────────────────────────────────────────────────────────────
const teamMembers = [
  { name: "Emily Watson",   role: "Content Lead",  campaigns: 3, capacity: 92, status: "OVERLOADED" },
  { name: "David Kim",      role: "SEO Lead",      campaigns: 2, capacity: 78, status: "HIGH"       },
  { name: "Priya Sharma",   role: "Paid Media",    campaigns: 2, capacity: 65, status: "OK"         },
  { name: "Alex Rodriguez", role: "Social",        campaigns: 2, capacity: 71, status: "OK"         },
  { name: "Jamie Liu",      role: "Email",         campaigns: 1, capacity: 88, status: "HIGH"       },
  { name: "Jordan Taylor",  role: "Ops",           campaigns: 1, capacity: 55, status: "OK"         },
  { name: "Morgan Blake",   role: "Designer",      campaigns: 4, capacity: 94, status: "OVERLOADED" },
  { name: "Raj Patel",      role: "VP",            campaigns: 4, capacity: 82, status: "HIGH"       },
  { name: "Sarah Chen",     role: "CMO",           campaigns: 7, capacity: 76, status: "OK"         },
];

// ─── Gantt Data ───────────────────────────────────────────────────────────────
// Timeline: May 1 – Jul 31 = 92 days. left% and width% relative to full span.
const MAY1 = new Date("2026-05-01").getTime();
const JUL31 = new Date("2026-07-31").getTime();
const SPAN = JUL31 - MAY1;
function ganttPos(start: string, end: string) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return {
    left: Math.round(((s - MAY1) / SPAN) * 100),
    width: Math.round(((e - s) / SPAN) * 100),
  };
}
const ganttItems = [
  { name: "BFSI Vertical Launch",    ...ganttPos("2026-05-01","2026-06-30"), color: PRIMARY, owner: "EW", budget: "$180K", status: "Active"   },
  { name: "LinkedIn ABM Enterprise", ...ganttPos("2026-05-15","2026-07-31"), color: BLUE,    owner: "PS", budget: "$98K",  status: "Active"   },
  { name: "AWS Partnership",         ...ganttPos("2026-05-01","2026-05-31"), color: GREEN,   owner: "RP", budget: "$28K",  status: "Active"   },
  { name: "OGI Whitepaper",          ...ganttPos("2026-05-10","2026-06-20"), color: AMBER,   owner: "EW", budget: "$45K",  status: "At Risk"  },
  { name: "Agentic OS APAC",         ...ganttPos("2026-06-01","2026-07-31"), color: MUTED,   owner: "AR", budget: "$62K",  status: "Planning" },
];

// ─── Strategy AI Hardcoded Output ─────────────────────────────────────────────
const strategyOutput = {
  channels: [
    { name: "LinkedIn ABM",   pct: 35, color: BLUE    },
    { name: "Content / SEO",  pct: 25, color: GREEN   },
    { name: "Email Nurture",  pct: 20, color: AMBER   },
    { name: "Events",         pct: 15, color: PRIMARY  },
    { name: "PR",             pct: 5,  color: MUTED   },
  ],
  timeline: [
    { week: "Week 1–2", phase: "Foundation", desc: "Brand positioning, asset creation, landing page",           color: PRIMARY },
    { week: "Week 3–4", phase: "Launch",     desc: "LinkedIn campaign live, blog published, PR sent",           color: BLUE    },
    { week: "Week 5–6", phase: "Amplify",    desc: "Email sequences, webinar, partner activation",              color: GREEN   },
    { week: "Week 7–8", phase: "Optimize",   desc: "A/B test results, budget reallocation, retargeting",        color: AMBER   },
  ],
  personas: [
    { title: "CTO",        msg: "Reduce AI implementation time by 60% with pre-built agentic workflows"    },
    { title: "CMO",        msg: "Autonomous marketing ops — from strategy to execution, 24/7"              },
    { title: "Head of IT", msg: "Enterprise-grade security with SOC2 Type II compliance"                   },
  ],
  metrics: ["Pipeline $800K", "MQLs 400", "CAC <$300", "ROAS >4×"],
  risks:   ["Competitor response may accelerate", "Budget overrun if events underperform"],
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = ["Overview", "New Campaign", "Strategy AI", "Timeline", "Team"] as const;
type Tab = (typeof TABS)[number];

// ─── Helper Components ────────────────────────────────────────────────────────
function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  const palette = [PRIMARY, BLUE, GREEN, AMBER, RED];
  const ci = initials.charCodeAt(0) % palette.length;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: size, height: size, borderRadius: "50%", background: palette[ci],
      color: "#fff", fontSize: size * 0.36, fontWeight: 700, flexShrink: 0,
    }}>
      {initials}
    </span>
  );
}

function Toast({ msg }: { msg: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
      style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 200,
        background: DARK_TEXT, color: "#fff", borderRadius: 10, padding: "12px 20px",
        fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      }}>
      {msg}
    </motion.div>
  );
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function OverviewTab() {
  const [filter, setFilter] = useState<string>("All");
  const filters = ["All", "Active", "At Risk", "Planning", "Complete"];

  const filtered = filter === "All"
    ? allCampaigns
    : allCampaigns.filter(c => c.status === filter);

  const stats = [
    { label: "Active",    val: 4, color: GREEN },
    { label: "Planning",  val: 1, color: BLUE  },
    { label: "At Risk",   val: 1, color: RED   },
    { label: "Completed", val: 1, color: MUTED },
  ];

  return (
    <div>
      {/* Stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
            padding: "14px 20px",
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: filter === f ? PRIMARY : CARD,
            color: filter === f ? "#fff" : MUTED,
            border: `1px solid ${filter === f ? PRIMARY : BORDER}`,
            transition: "all 0.15s",
          }}>{f}</button>
        ))}
      </div>

      {/* Campaign grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((c, i) => (
            <motion.div key={c.name}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: CARD, border: `1px solid ${BORDER}`,
                borderRadius: 12, padding: "16px",
              }}>
              {/* Top row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, borderRadius: 99, padding: "2px 10px",
                  color: statusColor[c.status], background: statusColor[c.status] + "1a",
                }}>
                  {c.status}
                </span>
                <Avatar initials={c.owner} size={28} />
              </div>
              {/* Name */}
              <div style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT, marginBottom: 4 }}>{c.name}</div>
              {/* Budget */}
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>Budget: {c.budget}</div>
              {/* Progress */}
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                <span>Progress</span><span>{c.progress}%</span>
              </div>
              <div style={{ height: 6, background: BORDER, borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress}%` }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.7 }}
                  style={{ height: "100%", background: statusColor[c.status], borderRadius: 99 }}
                />
              </div>
              {/* ROAS */}
              <div style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>
                ROAS / ROI: <strong style={{ color: DARK_TEXT }}>{c.roasOrRoi}</strong>
              </div>
              <button style={{
                width: "100%", padding: "7px", fontSize: 12, fontWeight: 600,
                color: PRIMARY, background: "transparent",
                border: `1px solid ${BORDER}`, borderRadius: 8, cursor: "pointer",
              }}>
                Open →
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Tab: New Campaign (5-step wizard) ────────────────────────────────────────
function NewCampaignTab() {
  const [step, setStep]               = useState(1);
  const [goal, setGoal]               = useState("Product Launch");
  const [segment, setSegment]         = useState("BFSI");
  const [audience, setAudience]       = useState("");
  const [keyMessage, setKeyMessage]   = useState("");
  const [channels, setChannels]       = useState<string[]>(["LinkedIn", "Email"]);
  const [startDate, setStartDate]     = useState("2026-06-01");
  const [endDate, setEndDate]         = useState("2026-07-31");
  const [budget, setBudget]           = useState("50000");
  const [cmoApproval, setCmoApproval] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(true);
  const [launching, setLaunching]     = useState(false);
  const [launched, setLaunched]       = useState(false);

  const TOTAL = 5;
  const stepLabels = ["Goal & Audience", "Channels & Assets", "Timeline & Budget", "Team & Approvals", "Review & Launch"];
  const goalOptions    = ["Product Launch", "Vertical Expansion", "Event Promo", "Brand Awareness", "Lead Gen"];
  const segmentOptions = ["BFSI", "Enterprise IT", "Mid-Market", "SMB", "Developer"];
  const channelOptions = ["Blog", "LinkedIn", "Email", "Google Ads", "Webinar", "Press Release", "Partner Co-marketing"];

  const budgetSplit = [
    { label: "Paid",    pct: 40, color: BLUE   },
    { label: "Content", pct: 25, color: GREEN  },
    { label: "Events",  pct: 20, color: AMBER  },
    { label: "Tools",   pct: 15, color: MUTED  },
  ];

  const durationDays = startDate && endDate
    ? Math.max(0, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
    : 0;

  function toggleChannel(ch: string) {
    setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  }

  function suggestedAssets() {
    const items: string[] = [];
    if (channels.includes("Blog"))               items.push("3 long-form blog posts (1,500+ words)");
    if (channels.includes("LinkedIn"))           items.push("6 LinkedIn carousel posts + 4 text updates");
    if (channels.includes("Email"))              items.push("5-email nurture sequence + 1 launch announcement");
    if (channels.includes("Google Ads"))         items.push("3 ad groups, 15 headlines, 4 descriptions");
    if (channels.includes("Webinar"))            items.push("1 webinar landing page + post-event email");
    if (channels.includes("Press Release"))      items.push("1 press release + 3 media pitch emails");
    if (channels.includes("Partner Co-marketing")) items.push("2 co-branded assets + partner brief");
    return items;
  }

  function handleLaunch() {
    setLaunching(true);
    setTimeout(() => { setLaunching(false); setLaunched(true); }, 1500);
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1px solid ${BORDER}`, background: PAGE_BG,
    color: DARK_TEXT, fontSize: 13, outline: "none", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    fontSize: 12, color: MUTED, fontWeight: 600, display: "block", marginBottom: 6,
  };

  return (
    <div>
      {/* Step indicator */}
      <div style={{
        display: "flex", gap: 0, marginBottom: 24, background: CARD,
        borderRadius: 12, border: `1px solid ${BORDER}`, padding: "5px", overflow: "hidden",
      }}>
        {stepLabels.map((label, i) => {
          const s = i + 1;
          const active = step === s;
          const done   = step > s;
          return (
            <button key={label} onClick={() => setStep(s)} style={{
              flex: 1, padding: "8px 4px", fontSize: 11, fontWeight: 600, cursor: "pointer",
              borderRadius: 8, border: "none", transition: "all 0.18s",
              background: active ? PRIMARY : "transparent",
              color: active ? "#fff" : done ? GREEN : MUTED,
            }}>
              <span style={{ display: "block", marginBottom: 2 }}>{done ? "✓" : s}</span>
              <span style={{ display: "block" }}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          style={{
            background: CARD, border: `1px solid ${BORDER}`,
            borderRadius: 14, padding: "24px",
          }}>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>Goal & Audience</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={lbl}>Campaign Goal</label>
                  <select value={goal} onChange={e => setGoal(e.target.value)} style={{ ...inp, appearance: "none" }}>
                    {goalOptions.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Target Segment</label>
                  <select value={segment} onChange={e => setSegment(e.target.value)} style={{ ...inp, appearance: "none" }}>
                    {segmentOptions.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Target Audience Description</label>
                <textarea value={audience} onChange={e => setAudience(e.target.value)}
                  placeholder="Describe your ideal customer..."
                  style={{ ...inp, minHeight: 80, resize: "vertical" }}
                />
              </div>
              <div>
                <label style={lbl}>Key Message</label>
                <input value={keyMessage} onChange={e => setKeyMessage(e.target.value)}
                  placeholder="What's the one thing we want them to remember?"
                  style={inp}
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>Channels & Assets</h3>
              <label style={{ ...lbl, marginBottom: 12 }}>Select Channels</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
                {channelOptions.map(ch => {
                  const sel = channels.includes(ch);
                  return (
                    <button key={ch} onClick={() => toggleChannel(ch)} style={{
                      padding: "8px 18px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: sel ? PRIMARY : PAGE_BG,
                      color: sel ? "#fff" : MUTED,
                      border: `1px solid ${sel ? PRIMARY : BORDER}`,
                      transition: "all 0.15s",
                    }}>
                      {sel ? "✓ " : ""}{ch}
                    </button>
                  );
                })}
              </div>
              {channels.length > 0 && (
                <div style={{ background: PAGE_BG, borderRadius: 10, padding: "16px", border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, marginBottom: 10 }}>Suggested Assets</div>
                  <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12, color: DARK_TEXT, lineHeight: 2 }}>
                    {suggestedAssets().map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>Timeline & Budget</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
                <div>
                  <label style={lbl}>Start Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={lbl}>End Date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Total Budget ($)</label>
                  <input type="number" value={budget} onChange={e => setBudget(e.target.value)} style={inp} />
                </div>
              </div>
              {startDate && endDate && (
                <div style={{ fontSize: 12, color: GREEN, fontWeight: 600, marginBottom: 16 }}>
                  Campaign duration: {durationDays} days
                </div>
              )}
              {/* AI Budget Split */}
              <div style={{ background: PAGE_BG, borderRadius: 10, padding: "16px", border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, marginBottom: 12 }}>AI Budget Allocation</div>
                {budgetSplit.map(b => (
                  <div key={b.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: MUTED }}>{b.label}</span>
                      <span style={{ fontWeight: 700, color: b.color }}>
                        {b.pct}% — ${Math.round(Number(budget || 0) * b.pct / 100).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ height: 8, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${b.pct}%` }}
                        transition={{ duration: 0.6 }}
                        style={{ height: "100%", background: b.color, borderRadius: 99 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>Team & Approvals</h3>
              <div style={{ background: PAGE_BG, borderRadius: 10, border: `1px solid ${BORDER}`, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 700, color: PRIMARY }}>
                  Auto-assigned Team
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Role","Member","Channels"].map(h => (
                        <th key={h} style={{ padding: "8px 16px", fontSize: 11, fontWeight: 700, color: MUTED, textAlign: "left", borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { role: "Content Lead", name: "Emily Watson", initials: "EW", channels: "Blog, Email" },
                      { role: "Paid Media",   name: "Priya Sharma", initials: "PS", channels: "Google Ads, LinkedIn" },
                      { role: "Social",       name: "Alex Rodriguez", initials: "AR", channels: "LinkedIn posts" },
                    ].map(m => (
                      <tr key={m.name} style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ padding: "10px 16px", fontSize: 12, color: MUTED }}>{m.role}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Avatar initials={m.initials} size={28} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: DARK_TEXT }}>{m.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 16px", fontSize: 12, color: MUTED }}>{m.channels}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Toggles */}
              <div style={{ background: PAGE_BG, borderRadius: 10, border: `1px solid ${BORDER}`, padding: "16px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, marginBottom: 14 }}>Approval Gates</div>
                {[
                  { label: "Require CMO approval for spend >$50K", val: cmoApproval, set: setCmoApproval },
                  { label: "Slack notifications",                   val: slackNotifs, set: setSlackNotifs },
                ].map(t => (
                  <div key={t.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: DARK_TEXT }}>{t.label}</span>
                    <button onClick={() => t.set(!t.val)} style={{
                      width: 40, height: 22, borderRadius: 99, border: "none", cursor: "pointer",
                      background: t.val ? GREEN : BORDER, position: "relative", transition: "background 0.2s",
                    }}>
                      <span style={{
                        position: "absolute", top: 3, left: t.val ? 20 : 3, width: 16, height: 16,
                        borderRadius: "50%", background: "#fff", transition: "left 0.2s",
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>Review & Launch</h3>
              <div style={{ background: PAGE_BG, borderRadius: 10, border: `1px solid ${BORDER}`, padding: "18px", marginBottom: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { label: "Goal",          val: goal                              },
                    { label: "Segment",        val: segment                           },
                    { label: "Channels",       val: channels.join(", ") || "—"       },
                    { label: "Budget",         val: `$${Number(budget).toLocaleString()}` },
                    { label: "Start Date",     val: startDate                         },
                    { label: "End Date",       val: endDate                           },
                    { label: "Duration",       val: `${durationDays} days`            },
                    { label: "CMO Approval",   val: cmoApproval ? "Required" : "Not required" },
                    { label: "Slack Notifs",   val: slackNotifs ? "On" : "Off"        },
                    { label: "Key Message",    val: keyMessage || "—"                 },
                  ].map(row => (
                    <div key={row.label}>
                      <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 2 }}>{row.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT }}>{row.val}</div>
                    </div>
                  ))}
                </div>
              </div>
              {launched ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: GREEN + "18", border: `1px solid ${GREEN}40`, borderRadius: 10,
                    padding: "16px", display: "flex", alignItems: "center", gap: 10,
                    color: GREEN, fontWeight: 700, fontSize: 14,
                  }}>
                  <CheckCircle size={18} />
                  Campaign created! Redirecting to Campaign Hub…
                </motion.div>
              ) : (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleLaunch} disabled={launching}
                  style={{
                    width: "100%", padding: "14px", fontSize: 15, fontWeight: 700, color: "#fff",
                    background: launching ? MUTED : PRIMARY, border: "none", borderRadius: 10,
                    cursor: launching ? "wait" : "pointer",
                  }}>
                  {launching ? "Creating campaign…" : "🚀 Launch Campaign"}
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} style={{
          padding: "9px 22px", borderRadius: 9, fontSize: 13, fontWeight: 600,
          cursor: step === 1 ? "default" : "pointer",
          background: step === 1 ? PAGE_BG : CARD,
          color: step === 1 ? MUTED : DARK_TEXT,
          border: `1px solid ${BORDER}`,
        }}>
          ← Back
        </button>
        {step < TOTAL && (
          <button onClick={() => setStep(s => Math.min(TOTAL, s + 1))} style={{
            padding: "9px 22px", borderRadius: 9, fontSize: 13, fontWeight: 700,
            cursor: "pointer", background: PRIMARY, color: "#fff", border: "none",
          }}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Strategy AI ─────────────────────────────────────────────────────────
function StrategyAITab() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated]   = useState(false);
  const [goalText, setGoalText]     = useState("");
  const [segment, setSegment]       = useState("BFSI");
  const [budgetAmt, setBudgetAmt]   = useState("120000");
  const [timeline, setTimeline]     = useState("8 weeks");
  const [differentiator, setDifferentiator] = useState("");

  function generate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1px solid ${BORDER}`, background: PAGE_BG,
    color: DARK_TEXT, fontSize: 13, outline: "none", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = { fontSize: 12, color: MUTED, fontWeight: 600, display: "block", marginBottom: 6 };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Input form */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "24px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <Brain size={18} color={PRIMARY} />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK_TEXT, margin: 0 }}>Strategy AI Generator</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={lbl}>Campaign Goal</label>
            <input value={goalText} onChange={e => setGoalText(e.target.value)}
              placeholder="e.g. Drive 200 MQLs from BFSI in Q3" style={inp} />
          </div>
          <div>
            <label style={lbl}>Target Segment</label>
            <select value={segment} onChange={e => setSegment(e.target.value)} style={{ ...inp, appearance: "none" }}>
              {["BFSI", "Enterprise IT", "Mid-Market"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Budget ($)</label>
            <input type="number" value={budgetAmt} onChange={e => setBudgetAmt(e.target.value)}
              placeholder="e.g. 120000" style={inp} />
          </div>
          <div>
            <label style={lbl}>Timeline</label>
            <select value={timeline} onChange={e => setTimeline(e.target.value)} style={{ ...inp, appearance: "none" }}>
              {["4 weeks", "6 weeks", "8 weeks", "12 weeks"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>Key Differentiator</label>
          <textarea value={differentiator} onChange={e => setDifferentiator(e.target.value)}
            placeholder="What makes Lyzr uniquely suited for this campaign?"
            style={{ ...inp, minHeight: 72, resize: "vertical" }}
          />
        </div>
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={generate} disabled={generating}
          style={{
            width: "100%", padding: "12px", fontSize: 13, fontWeight: 700, color: "#fff",
            background: generating ? MUTED : PRIMARY, border: "none", borderRadius: 10,
            cursor: generating ? "wait" : "pointer",
          }}>
          {generating ? "Generating strategy…" : "✨ Generate Strategy"}
        </motion.button>
      </div>

      {/* Output card */}
      <AnimatePresence>
        {generated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "24px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>
              AI-Generated Strategy: Lyzr AgenticOS for {segment}
            </h3>

            {/* Channel mix */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 10 }}>RECOMMENDED CHANNEL MIX</div>
              {strategyOutput.channels.map(ch => (
                <div key={ch.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: DARK_TEXT }}>{ch.name}</span>
                    <span style={{ fontWeight: 700, color: ch.color }}>{ch.pct}%</span>
                  </div>
                  <div style={{ height: 8, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${ch.pct}%` }}
                      transition={{ duration: 0.7 }}
                      style={{ height: "100%", background: ch.color, borderRadius: 99 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 4-Phase Timeline */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 10 }}>4-PHASE TIMELINE</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {strategyOutput.timeline.map(t => (
                  <div key={t.phase} style={{
                    background: PAGE_BG, borderRadius: 10, padding: "12px",
                    border: `1px solid ${BORDER}`, borderTop: `3px solid ${t.color}`,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: t.color, marginBottom: 3 }}>{t.phase}</div>
                    <div style={{ fontSize: 10, color: MUTED, marginBottom: 6 }}>{t.week}</div>
                    <div style={{ fontSize: 11, color: DARK_TEXT, lineHeight: 1.5 }}>{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Messages per Persona */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 10 }}>KEY MESSAGES PER PERSONA</div>
              {strategyOutput.personas.map(p => (
                <div key={p.title} style={{
                  display: "flex", gap: 12, alignItems: "flex-start",
                  padding: "10px 0", borderBottom: `1px solid ${BORDER}`,
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: PRIMARY,
                    background: PRIMARY + "12", borderRadius: 6, padding: "3px 8px", flexShrink: 0,
                  }}>{p.title}</span>
                  <span style={{ fontSize: 12, color: DARK_TEXT, lineHeight: 1.5 }}>{p.msg}</span>
                </div>
              ))}
            </div>

            {/* Success Metrics + Risks */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 8 }}>SUCCESS METRICS</div>
                {strategyOutput.metrics.map(m => (
                  <div key={m} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12, color: DARK_TEXT }}>
                    <CheckCircle size={13} color={GREEN} /> {m}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: MUTED, marginBottom: 8 }}>RISK FACTORS</div>
                {strategyOutput.risks.map(r => (
                  <div key={r} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 8, fontSize: 12, color: DARK_TEXT, lineHeight: 1.4 }}>
                    <AlertCircle size={13} color={AMBER} style={{ marginTop: 1, flexShrink: 0 }} /> {r}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{
                padding: "10px 22px", fontSize: 13, fontWeight: 700, color: "#fff",
                background: PRIMARY, border: "none", borderRadius: 9, cursor: "pointer",
              }}>
                Save Strategy
              </button>
              <button style={{
                padding: "10px 22px", fontSize: 13, fontWeight: 600, color: PRIMARY,
                background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 9, cursor: "pointer",
              }}>
                Apply to Campaign
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tab: Timeline (Gantt) ────────────────────────────────────────────────────
function TimelineTab() {
  const [hovered, setHovered] = useState<number | null>(null);
  const months = ["May 2026", "Jun 2026", "Jul 2026"];

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "24px" }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, marginBottom: 20 }}>Campaign Timeline</h3>

      {/* Month labels */}
      <div style={{ display: "flex", paddingLeft: 190, marginBottom: 10 }}>
        {months.map((m, i) => (
          <div key={m} style={{
            flex: 1, fontSize: 11, fontWeight: 600, color: MUTED,
            borderLeft: i > 0 ? `1px dashed ${BORDER}` : "none",
            paddingLeft: i > 0 ? 10 : 0,
          }}>{m}</div>
        ))}
      </div>

      {/* Gantt rows */}
      {ganttItems.map((item, i) => (
        <div key={item.name} style={{ display: "flex", alignItems: "center", marginBottom: 14, position: "relative" }}>
          <div style={{
            width: 188, fontSize: 12, fontWeight: 500, color: DARK_TEXT, flexShrink: 0,
            paddingRight: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {item.name}
          </div>
          <div style={{
            flex: 1, height: 34, background: PAGE_BG, borderRadius: 8,
            position: "relative", border: `1px solid ${BORDER}`,
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.width}%` }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.65 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "absolute", top: 0, left: `${item.left}%`,
                height: "100%", background: item.color, borderRadius: 8,
                opacity: 0.82, cursor: "pointer", display: "flex",
                alignItems: "center", paddingLeft: 10, overflow: "hidden",
              }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                {item.name.split(" ")[0]}
              </span>
            </motion.div>

            {/* Hover popover */}
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  style={{
                    position: "absolute", top: "calc(100% + 8px)", left: `${item.left}%`,
                    zIndex: 20, background: DARK_TEXT, color: "#fff", borderRadius: 9,
                    padding: "10px 14px", fontSize: 11, lineHeight: 1.6,
                    whiteSpace: "nowrap", boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
                  }}>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>{item.name}</div>
                  <div>Owner: {item.owner} · Budget: {item.budget}</div>
                  <div>Status: {item.status}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Team ────────────────────────────────────────────────────────────────
function TeamTab() {
  const [toast, setToast] = useState<string | null>(null);

  function capacityColor(pct: number) {
    return pct >= 85 ? RED : pct >= 70 ? AMBER : GREEN;
  }
  function statusBadge(s: string) {
    const cfg: Record<string, { bg: string; color: string }> = {
      OVERLOADED: { bg: RED + "18",   color: RED   },
      HIGH:       { bg: AMBER + "18", color: AMBER },
      OK:         { bg: GREEN + "18", color: GREEN },
    };
    return cfg[s] || cfg.OK;
  }

  function handleReassign(name: string) {
    setToast(`Opening task reassignment for ${name}…`);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <>
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${BORDER}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK_TEXT, margin: 0 }}>Team Capacity</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: PAGE_BG }}>
              {["Member", "Role", "Campaigns", "Capacity", "Status", ""].map((h, i) => (
                <th key={i} style={{
                  padding: "10px 18px", fontSize: 11, fontWeight: 700, color: MUTED,
                  textAlign: "left", borderBottom: `1px solid ${BORDER}`,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((m, i) => {
              const initials = m.name.split(" ").map(n => n[0]).join("");
              const badge = statusBadge(m.status);
              const capColor = capacityColor(m.capacity);
              return (
                <motion.tr key={m.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar initials={initials} size={30} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: DARK_TEXT }}>{m.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 18px", fontSize: 12, color: MUTED }}>{m.role}</td>
                  <td style={{ padding: "12px 18px", fontSize: 13, color: DARK_TEXT, fontWeight: 500 }}>{m.campaigns}</td>
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 80, height: 7, background: BORDER, borderRadius: 99, overflow: "hidden" }}>
                        <div style={{
                          width: `${m.capacity}%`, height: "100%",
                          background: capColor, borderRadius: 99,
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: capColor }}>{m.capacity}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, borderRadius: 99, padding: "3px 10px",
                      background: badge.bg, color: badge.color,
                    }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    {m.status === "OVERLOADED" && (
                      <button onClick={() => handleReassign(m.name)} style={{
                        fontSize: 11, fontWeight: 600, color: RED,
                        background: RED + "12", border: `1px solid ${RED}30`,
                        borderRadius: 7, padding: "4px 10px", cursor: "pointer",
                      }}>
                        Reassign Work
                      </button>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <AnimatePresence>{toast && <Toast msg={toast} />}</AnimatePresence>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CampaignPlanningPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <div style={{ padding: "28px 32px", background: PAGE_BG, minHeight: "100vh" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: DARK_TEXT, margin: 0 }}>Campaign Planning</h1>
        <p style={{ color: MUTED, fontSize: 13, margin: "4px 0 0" }}>
          Strategic planning, budget allocation & campaign readiness
        </p>
      </motion.div>

      {/* Workflow Banner */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10,
        padding: "10px 16px", marginBottom: 20, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: MUTED, textTransform: "uppercase" }}>Workflow</span>
        <span style={{ color: PRIMARY, fontWeight: 700, fontSize: 12 }}>1. Plan</span>
        <ChevronRight size={12} style={{ color: MUTED, flexShrink: 0 }} />
        <span style={{ color: MUTED, fontSize: 12 }}>2. Content</span>
        <ChevronRight size={12} style={{ color: MUTED, flexShrink: 0 }} />
        <span style={{ color: MUTED, fontSize: 12 }}>3. Creative</span>
        <ChevronRight size={12} style={{ color: MUTED, flexShrink: 0 }} />
        <span style={{ color: MUTED, fontSize: 12 }}>4. Email</span>
        <ChevronRight size={12} style={{ color: MUTED, flexShrink: 0 }} />
        <span style={{ color: MUTED, fontSize: 12 }}>5. Social</span>
        <ChevronRight size={12} style={{ color: MUTED, flexShrink: 0 }} />
        <span style={{ color: MUTED, fontSize: 12 }}>6. Launch</span>
        <a href="/content-studio" style={{
          marginLeft: "auto", display: "flex", alignItems: "center", gap: 4,
          fontSize: 11, fontWeight: 600, color: "#fff", background: PRIMARY,
          border: "none", borderRadius: 7, padding: "6px 12px", cursor: "pointer",
          textDecoration: "none", whiteSpace: "nowrap",
        }}>
          Continue to Content Studio →
        </a>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 24, background: CARD,
        borderRadius: 12, border: `1px solid ${BORDER}`, padding: "5px", width: "fit-content",
      }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "7px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
            background: activeTab === tab ? PRIMARY : "transparent",
            color: activeTab === tab ? "#fff" : MUTED,
            border: "none", transition: "all 0.18s",
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}>
          {activeTab === "Overview"      && <OverviewTab />}
          {activeTab === "New Campaign"  && <NewCampaignTab />}
          {activeTab === "Strategy AI"   && <StrategyAITab />}
          {activeTab === "Timeline"      && <TimelineTab />}
          {activeTab === "Team"          && <TeamTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
