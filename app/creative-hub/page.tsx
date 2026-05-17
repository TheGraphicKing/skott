// /Users/navaneethakrishnan/Desktop/skott/app/creative-hub/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Image,
  Video,
  FileText,
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Layers,
  Copy,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  Users,
  Tag,
  X,
  Play,
  Pause,
  FlaskConical,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
} from "lucide-react";

// ─── Brand Colors ──────────────────────────────────────────────────────────────
const C = {
  PRIMARY: "hsl(25,62%,25%)",
  MUTED: "hsl(25,20%,50%)",
  CARD: "hsl(36,30%,97%)",
  BORDER: "hsl(30,15%,87%)",
  PAGE_BG: "hsl(36,33%,94%)",
  GREEN: "hsl(142,55%,35%)",
  RED: "#dc2626",
  AMBER: "#d97706",
  BLUE: "#2563eb",
  DARK_TEXT: "#3a1f0e",
};

// ─── Types ─────────────────────────────────────────────────────────────────────
type SubTab = "Request Queue" | "Asset Library" | "AI Asset Generator" | "Brand Guidelines" | "Templates" | "A/B Test Manager";
const SUB_TABS: SubTab[] = ["Request Queue", "Asset Library", "AI Asset Generator", "Brand Guidelines", "Templates", "A/B Test Manager"];

type Priority = "High" | "Medium" | "Low";
type KanbanCol = "Backlog" | "In Progress" | "Review" | "Done";

interface KanbanCard {
  id: string;
  title: string;
  assignee: string;
  priority: Priority;
  detail: string;
  note?: string;
  progress?: number;
  reviewer?: string;
  completedDate?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRIORITY_CONFIG: Record<Priority, { bg: string; text: string; label: string }> = {
  High:   { bg: "rgba(220,38,38,0.1)",  text: C.RED,   label: "High"   },
  Medium: { bg: "rgba(217,119,6,0.1)",  text: C.AMBER, label: "Medium" },
  Low:    { bg: "rgba(37,99,235,0.1)",  text: C.BLUE,  label: "Low"    },
};

const KANBAN_DATA: Record<KanbanCol, KanbanCard[]> = {
  Backlog: [
    { id: "b1", title: "Q3 Product Launch Banner Set", assignee: "Emily Watson", priority: "High", detail: "3 banners", note: "2 days overdue" },
    { id: "b2", title: "LinkedIn Ad Creative — BFSI", assignee: "Priya Sharma", priority: "Medium", detail: "5 variants", note: "Due May 20" },
    { id: "b3", title: "Hitachi Case Study Design", assignee: "Morgan Blake", priority: "Low", detail: "PDF layout", note: "Due May 25" },
  ],
  "In Progress": [
    { id: "p1", title: "Agentic OS Hero Image", assignee: "Morgan Blake", priority: "High", detail: "web/social", progress: 60 },
    { id: "p2", title: "Email Header Templates x5", assignee: "Morgan Blake", priority: "Medium", detail: "email", progress: 40 },
    { id: "p3", title: "AWS Partnership One-Pager", assignee: "Emily Watson", priority: "High", detail: "PDF", progress: 80 },
  ],
  Review: [
    { id: "r1", title: "OGI Whitepaper Cover", assignee: "Sarah Chen", priority: "High", detail: "Awaiting approval", reviewer: "Sarah Chen reviewing" },
    { id: "r2", title: "Trade Show Booth Mockup", assignee: "David Kim", priority: "Medium", detail: "Final revisions", reviewer: "David Kim reviewing" },
  ],
  Done: [
    { id: "d1", title: "Lyzr Brand Style Guide v3", assignee: "Emily Watson", priority: "High", detail: "PDF", completedDate: "May 10" },
    { id: "d2", title: "Webinar Promo Graphics", assignee: "Priya Sharma", priority: "Medium", detail: "Social set", completedDate: "May 9" },
    { id: "d3", title: "Q2 Newsletter Header", assignee: "Morgan Blake", priority: "Low", detail: "Email", completedDate: "May 8" },
  ],
};

interface AssetItem {
  id: string;
  name: string;
  type: "Brand" | "Image" | "Video" | "Document" | "Icons" | "Templates";
  files?: number;
  date: string;
  color: string;
}

const ASSETS: AssetItem[] = [
  { id: "a1", name: "Lyzr Logo Package", type: "Brand", files: 12, date: "May 12", color: "hsl(25,62%,35%)" },
  { id: "a2", name: "Agentic OS Hero Image", type: "Image", date: "May 11", color: "hsl(30,50%,65%)" },
  { id: "a3", name: "BFSI Campaign Banner", type: "Image", date: "May 10", color: "hsl(36,40%,55%)" },
  { id: "a4", name: "Q1 Board Report", type: "Document", date: "May 9", color: "hsl(25,30%,70%)" },
  { id: "a5", name: "LinkedIn Banner Pack", type: "Image", date: "May 8", color: "hsl(20,55%,45%)" },
  { id: "a6", name: "Product Demo Video", type: "Video", date: "May 7", color: "hsl(15,60%,30%)" },
  { id: "a7", name: "Brand Style Guide", type: "Document", date: "May 6", color: "hsl(35,25%,75%)" },
  { id: "a8", name: "Icon Library", type: "Icons", date: "May 5", color: "hsl(28,45%,60%)" },
  { id: "a9", name: "Email Templates", type: "Templates", date: "May 4", color: "hsl(32,35%,50%)" },
  { id: "a10", name: "Partner Co-brand Kit", type: "Brand", files: 8, date: "May 3", color: "hsl(22,55%,40%)" },
  { id: "a11", name: "AWS Event Banner", type: "Image", date: "May 2", color: "hsl(38,45%,62%)" },
  { id: "a12", name: "Webinar Deck Master", type: "Templates", date: "May 1", color: "hsl(18,50%,35%)" },
];

const ASSET_TYPE_ICON: Record<string, React.ReactNode> = {
  Brand: <Star size={12} />,
  Image: <Image size={12} />,
  Video: <Video size={12} />,
  Document: <FileText size={12} />,
  Icons: <Layers size={12} />,
  Templates: <Copy size={12} />,
};

const TEMPLATES = [
  { id: "t1", name: "LinkedIn Post Template", category: "Social", uses: 847, icon: <Users size={20} /> },
  { id: "t2", name: "Email Newsletter", category: "Email", uses: 1240, icon: <FileText size={20} /> },
  { id: "t3", name: "Case Study PDF", category: "Document", uses: 342, icon: <FileText size={20} /> },
  { id: "t4", name: "Webinar Deck", category: "Presentation", uses: 228, icon: <Layers size={20} /> },
  { id: "t5", name: "Campaign Brief", category: "Document", uses: 891, icon: <Edit size={20} /> },
  { id: "t6", name: "Press Release", category: "Document", uses: 156, icon: <FileText size={20} /> },
  { id: "t7", name: "Product One-Pager", category: "PDF", uses: 423, icon: <FileText size={20} /> },
  { id: "t8", name: "Twitter/X Thread", category: "Social", uses: 672, icon: <Tag size={20} /> },
  { id: "t9", name: "Blog Post Template", category: "Content", uses: 1104, icon: <Edit size={20} /> },
];

const GENERATED_PREVIEWS = [
  { id: "g1", color: "hsl(25,62%,35%)", label: "Option A — Bold" },
  { id: "g2", color: "hsl(30,50%,55%)", label: "Option B — Warm" },
  { id: "g3", color: "hsl(36,40%,65%)", label: "Option C — Minimal" },
];

const GEN_HISTORY = [
  { id: "h1", name: "BFSI LinkedIn Banner", date: "Today 10:24 AM" },
  { id: "h2", name: "Agentic OS Square Post", date: "Today 9:10 AM" },
  { id: "h3", name: "AWS Email Header", date: "Yesterday 4:40 PM" },
  { id: "h4", name: "Q3 Launch Hero", date: "Yesterday 2:15 PM" },
  { id: "h5", name: "OGI Whitepaper Cover", date: "May 12, 11:30 AM" },
];

// ─── Shared Sub-components ────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      style={{ background: cfg.bg, color: cfg.text, fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Tab: Request Queue ────────────────────────────────────────────────────────
function RequestQueue() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", requestor: "", priority: "Medium", dueDate: "", description: "" });

  const columns: KanbanCol[] = ["Backlog", "In Progress", "Review", "Done"];

  return (
    <div style={{ position: "relative" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ color: C.MUTED, fontSize: 13 }}>8 active requests · 3 completed this week</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6, background: C.PRIMARY, color: "#fff",
            border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}
        >
          <Plus size={15} /> New Request
        </button>
      </div>

      {/* Kanban board */}
      <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
        {columns.map((col) => (
          <div
            key={col}
            style={{ minWidth: 270, flex: "0 0 270px", background: "hsl(36,25%,92%)", borderRadius: 12, padding: 14, border: `1px solid ${C.BORDER}` }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: C.DARK_TEXT }}>{col}</span>
              <span style={{ background: C.BORDER, borderRadius: 99, padding: "1px 9px", fontSize: 12, color: C.MUTED, fontWeight: 600 }}>
                {KANBAN_DATA[col].length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {KANBAN_DATA[col].map((card) => (
                <KanbanCardItem key={card.id} card={card} col={col} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* New Request Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: C.CARD, borderRadius: 16, padding: 28, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontWeight: 700, fontSize: 17, color: C.DARK_TEXT }}>New Creative Request</h3>
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.MUTED }}><X size={18} /></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Title", key: "title", type: "text", placeholder: "e.g. Q3 Product Launch Banner" },
                  { label: "Requestor", key: "requestor", type: "text", placeholder: "e.g. Emily Watson" },
                  { label: "Due Date", key: "dueDate", type: "date", placeholder: "" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: C.MUTED, display: "block", marginBottom: 4 }}>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={(form as Record<string, string>)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.BORDER}`, background: "#fff", fontSize: 13, color: C.DARK_TEXT, boxSizing: "border-box" }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.MUTED, display: "block", marginBottom: 4 }}>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.BORDER}`, background: "#fff", fontSize: 13, color: C.DARK_TEXT }}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.MUTED, display: "block", marginBottom: 4 }}>Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the creative request..."
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.BORDER}`, background: "#fff", fontSize: 13, color: C.DARK_TEXT, resize: "none", boxSizing: "border-box" }}
                  />
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: C.PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", cursor: "pointer", fontWeight: 700, fontSize: 14, marginTop: 4 }}
                >
                  Submit Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KanbanCardItem({ card, col }: { card: KanbanCard; col: KanbanCol }) {
  const isOverdue = card.note?.includes("overdue");
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 6px 20px rgba(58,31,14,0.12)" }}
      style={{
        background: C.CARD, borderRadius: 10, padding: 12, border: `1px solid ${C.BORDER}`, cursor: "default",
        boxShadow: "0 2px 6px rgba(58,31,14,0.05)",
      }}
    >
      <p style={{ fontWeight: 600, fontSize: 13, color: C.DARK_TEXT, marginBottom: 8, lineHeight: 1.4 }}>{card.title}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <PriorityBadge priority={card.priority} />
        <span style={{ fontSize: 11, color: C.MUTED }}>{card.detail}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 20, height: 20, borderRadius: 99, background: C.PRIMARY, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>{card.assignee.split(" ").map((n) => n[0]).join("")}</span>
          </div>
          <span style={{ fontSize: 11, color: C.MUTED }}>{card.assignee}</span>
        </div>
        {card.note && (
          <span style={{ fontSize: 11, color: isOverdue ? C.RED : C.MUTED, display: "flex", alignItems: "center", gap: 3 }}>
            {isOverdue ? <AlertCircle size={11} /> : <Clock size={11} />} {card.note}
          </span>
        )}
        {card.reviewer && (
          <span style={{ fontSize: 11, color: C.MUTED }}>{card.reviewer.split(" ")[0]}</span>
        )}
        {card.completedDate && (
          <span style={{ fontSize: 11, color: C.GREEN, display: "flex", alignItems: "center", gap: 3 }}>
            <CheckCircle size={11} /> {card.completedDate}
          </span>
        )}
      </div>
      {col === "In Progress" && card.progress !== undefined && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: C.MUTED }}>Progress</span>
            <span style={{ fontSize: 11, color: C.PRIMARY, fontWeight: 600 }}>{card.progress}%</span>
          </div>
          <div style={{ background: C.BORDER, borderRadius: 99, height: 4 }}>
            <div style={{ background: C.PRIMARY, borderRadius: 99, height: 4, width: `${card.progress}%`, transition: "width 0.3s" }} />
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Tab: Asset Library ────────────────────────────────────────────────────────
function AssetLibrary() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filterOpts = ["All", "Images", "Videos", "Documents", "Templates", "Icons"];

  const filtered = ASSETS.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ||
      (filter === "Images" && a.type === "Image") ||
      (filter === "Videos" && a.type === "Video") ||
      (filter === "Documents" && a.type === "Document") ||
      (filter === "Templates" && a.type === "Templates") ||
      (filter === "Icons" && a.type === "Icons");
    return matchSearch && matchFilter;
  });

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Total Assets", value: "2,400" },
          { label: "Brand Assets", value: "340" },
          { label: "Last Updated", value: "2h ago" },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, background: C.CARD, borderRadius: 10, padding: "12px 16px", border: `1px solid ${C.BORDER}` }}>
            <p style={{ fontSize: 11, color: C.MUTED, fontWeight: 600, marginBottom: 2 }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: C.PRIMARY }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Upload */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.MUTED }} />
          <input
            placeholder="Search assets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8, borderRadius: 8, border: `1px solid ${C.BORDER}`, background: C.CARD, fontSize: 13, color: C.DARK_TEXT, boxSizing: "border-box" }}
          />
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, background: C.PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          <Upload size={14} /> Upload New Asset
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {filterOpts.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            style={{
              padding: "5px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: filter === opt ? C.PRIMARY : C.CARD,
              color: filter === opt ? "#fff" : C.MUTED,
              border: `1px solid ${filter === opt ? C.PRIMARY : C.BORDER}`,
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {filtered.map((asset) => (
          <motion.div
            key={asset.id}
            whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(58,31,14,0.12)" }}
            style={{ background: C.CARD, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.BORDER}`, boxShadow: "0 2px 6px rgba(58,31,14,0.05)" }}
          >
            {/* Placeholder thumbnail */}
            <div style={{ height: 100, background: asset.color, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 28 }}>
                {ASSET_TYPE_ICON[asset.type]}
              </div>
              {asset.files && (
                <span style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.35)", color: "#fff", fontSize: 10, padding: "2px 7px", borderRadius: 99, fontWeight: 600 }}>
                  {asset.files} files
                </span>
              )}
            </div>
            <div style={{ padding: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.DARK_TEXT, marginBottom: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{asset.name}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, background: "hsl(25,20%,90%)", color: C.MUTED, padding: "1px 7px", borderRadius: 99, fontWeight: 600 }}>{asset.type}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, color: C.MUTED }}>{asset.date}</span>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: C.MUTED, padding: 2 }}><Download size={13} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: AI Asset Generator ───────────────────────────────────────────────────
function AIAssetGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Professional");
  const [format, setFormat] = useState("LinkedIn Banner (1200×628)");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"Desktop" | "Tablet" | "Mobile">("Desktop");
  const [selectedPreview, setSelectedPreview] = useState(0);

  const styles = ["Professional", "Bold", "Minimal", "Warm"];
  const formats = ["LinkedIn Banner (1200×628)", "Facebook Post", "Twitter Header", "Email Header", "Blog Hero", "Square (1:1)"];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setGenerated(false);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 1800);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
      {/* Left: Generator */}
      <div>
        <div style={{ background: C.CARD, borderRadius: 14, padding: 24, border: `1px solid ${C.BORDER}`, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ background: C.PRIMARY, borderRadius: 8, padding: 6 }}><Zap size={16} color="#fff" /></div>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: C.DARK_TEXT }}>AI Asset Generator</h3>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.MUTED, display: "block", marginBottom: 6 }}>Describe the asset you need</label>
            <textarea
              rows={3}
              placeholder="e.g. LinkedIn banner for BFSI campaign with Lyzr brand colors"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.BORDER}`, background: "#fff", fontSize: 13, color: C.DARK_TEXT, resize: "none", boxSizing: "border-box", lineHeight: 1.5 }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.MUTED, display: "block", marginBottom: 8 }}>Style</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  style={{
                    padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: style === s ? C.PRIMARY : C.CARD,
                    color: style === s ? "#fff" : C.MUTED,
                    border: `1px solid ${style === s ? C.PRIMARY : C.BORDER}`,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.MUTED, display: "block", marginBottom: 6 }}>Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.BORDER}`, background: "#fff", fontSize: 13, color: C.DARK_TEXT }}
            >
              {formats.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: "100%", padding: "11px 0", borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: loading ? C.MUTED : C.PRIMARY, color: "#fff", fontWeight: 700, fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%" }}
                />
                Generating…
              </>
            ) : (
              <><Zap size={16} /> Generate Asset</>
            )}
          </button>
        </div>

        {/* Generated previews */}
        <AnimatePresence>
          {generated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ background: C.CARD, borderRadius: 14, padding: 20, border: `1px solid ${C.BORDER}`, marginBottom: 20 }}
            >
              <h4 style={{ fontWeight: 700, fontSize: 14, color: C.DARK_TEXT, marginBottom: 14 }}>Generated Previews</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {GENERATED_PREVIEWS.map((g, idx) => (
                  <div
                    key={g.id}
                    onClick={() => setSelectedPreview(idx)}
                    style={{ borderRadius: 10, overflow: "hidden", border: `2px solid ${selectedPreview === idx ? C.PRIMARY : C.BORDER}`, cursor: "pointer" }}
                  >
                    <div style={{ height: 90, background: g.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>{format.split(" ")[0]}</span>
                    </div>
                    <div style={{ padding: 10, background: "#fff" }}>
                      <p style={{ fontSize: 11, color: C.MUTED, marginBottom: 8 }}>{g.label}</p>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ flex: 1, padding: "5px 0", background: C.PRIMARY, color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Use This</button>
                        <button style={{ padding: "5px 8px", background: "none", color: C.MUTED, border: `1px solid ${C.BORDER}`, borderRadius: 6, fontSize: 11, cursor: "pointer" }}><ArrowRight size={11} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Canvas */}
        <AnimatePresence>
          {generated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ background: C.CARD, borderRadius: 14, padding: 20, border: `1px solid ${C.BORDER}` }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <h4 style={{ fontWeight: 700, fontSize: 14, color: C.DARK_TEXT }}>Preview Canvas</h4>
                <div style={{ display: "flex", gap: 6 }}>
                  {(["Desktop", "Tablet", "Mobile"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setPreviewDevice(d)}
                      style={{
                        display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        background: previewDevice === d ? C.PRIMARY : C.CARD,
                        color: previewDevice === d ? "#fff" : C.MUTED,
                        border: `1px solid ${previewDevice === d ? C.PRIMARY : C.BORDER}`,
                      }}
                    >
                      {d === "Desktop" && <Monitor size={12} />}
                      {d === "Tablet" && <Tablet size={12} />}
                      {d === "Mobile" && <Smartphone size={12} />}
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" }}>
                {(() => {
                  const dims = previewDevice === "Desktop" ? { w: 400, h: 200 } : previewDevice === "Tablet" ? { w: 280, h: 200 } : { w: 140, h: 200 };
                  const previewColor = GENERATED_PREVIEWS[selectedPreview].color;
                  return (
                    <>
                      <div
                        style={{
                          width: dims.w, height: dims.h, borderRadius: previewDevice === "Mobile" ? 16 : 10,
                          border: `2px solid ${C.BORDER}`, overflow: "hidden", boxShadow: "0 4px 16px rgba(58,31,14,0.1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: previewColor,
                        }}
                      >
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600 }}>
                          {GENERATED_PREVIEWS[selectedPreview].label}
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: C.MUTED, marginTop: 10 }}>
                        {dims.w}×{dims.h}px · {previewDevice} view
                      </p>
                      <button
                        style={{
                          marginTop: 10, display: "flex", alignItems: "center", gap: 6,
                          background: C.PRIMARY, color: "#fff", border: "none", borderRadius: 8,
                          padding: "7px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        <Download size={13} /> Download PNG
                      </button>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Generation History */}
      <div style={{ background: C.CARD, borderRadius: 14, padding: 20, border: `1px solid ${C.BORDER}`, height: "fit-content" }}>
        <h4 style={{ fontWeight: 700, fontSize: 14, color: C.DARK_TEXT, marginBottom: 14 }}>Generation History</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {GEN_HISTORY.map((h) => (
            <div key={h.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "hsl(36,25%,93%)", borderRadius: 8, border: `1px solid ${C.BORDER}` }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.DARK_TEXT }}>{h.name}</p>
                <p style={{ fontSize: 11, color: C.MUTED }}>{h.date}</p>
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: C.MUTED }}><Download size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Brand Guidelines ─────────────────────────────────────────────────────
function BrandGuidelines() {
  const colors = [
    { name: "Primary", hex: "#5c2f0a", display: "hsl(25,72%,20%)" },
    { name: "Secondary", hex: "#f8f2e9", display: "hsl(36,50%,95%)" },
    { name: "Accent", hex: "#d4875a", display: "hsl(20,58%,59%)" },
    { name: "Success", hex: "#2d7a3d", display: "hsl(134,46%,33%)" },
  ];

  const dosList = [
    "Use logo on light cream or white backgrounds",
    "Maintain minimum 20px clear space around the logo",
    "Use approved color variants only",
    "Scale proportionally without distortion",
  ];
  const dontsList = [
    "Don't place logo on busy photographic backgrounds",
    "Don't alter logo colors outside approved palette",
    "Don't stretch, rotate, or add effects to the logo",
    "Don't use drop shadows or outlines on the logo",
  ];

  const voiceTone = [
    { trait: "Professional", example: "\"Our AI platform delivers enterprise-grade reliability.\"" },
    { trait: "Confident", example: "\"Lyzr transforms how teams work with intelligent automation.\"" },
    { trait: "Innovative", example: "\"We're redefining the future of agentic AI workflows.\"" },
    { trait: "Human", example: "\"We're here to help your team achieve more, together.\"" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Color Palette */}
      <div style={{ background: C.CARD, borderRadius: 14, padding: 22, border: `1px solid ${C.BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: C.DARK_TEXT, display: "flex", alignItems: "center", gap: 8 }}><Palette size={16} /> Color Palette</h3>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {colors.map((c) => (
            <div key={c.name} style={{ flex: 1 }}>
              <div style={{ height: 64, borderRadius: 10, background: c.display, border: `1px solid ${C.BORDER}`, marginBottom: 8 }} />
              <p style={{ fontSize: 12, fontWeight: 700, color: C.DARK_TEXT }}>{c.name}</p>
              <p style={{ fontSize: 11, color: C.MUTED, fontFamily: "monospace" }}>{c.hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div style={{ background: C.CARD, borderRadius: 14, padding: 22, border: `1px solid ${C.BORDER}` }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: C.DARK_TEXT, marginBottom: 16 }}>Typography</h3>
        <div style={{ display: "flex", gap: 14 }}>
          {[
            { role: "Headings", spec: "Inter 700", sample: "Heading Text", size: 22 },
            { role: "Body", spec: "Inter 400", sample: "Body text for paragraphs", size: 14 },
            { role: "Captions", spec: "Inter 500", sample: "Caption & label text", size: 12 },
          ].map((t) => (
            <div key={t.role} style={{ flex: 1, padding: "14px 16px", background: "hsl(36,25%,93%)", borderRadius: 10, border: `1px solid ${C.BORDER}` }}>
              <p style={{ fontSize: 11, color: C.MUTED, fontWeight: 600, marginBottom: 6 }}>{t.role}</p>
              <p style={{ fontSize: t.size, fontWeight: t.spec.includes("700") ? 700 : t.spec.includes("500") ? 500 : 400, color: C.DARK_TEXT, marginBottom: 6 }}>{t.sample}</p>
              <p style={{ fontSize: 11, color: C.MUTED, fontFamily: "monospace" }}>{t.spec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Logo Usage */}
      <div style={{ background: C.CARD, borderRadius: 14, padding: 22, border: `1px solid ${C.BORDER}` }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: C.DARK_TEXT, marginBottom: 16 }}>Logo Usage</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.GREEN, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle size={14} /> Do's</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {dosList.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <CheckCircle size={12} style={{ color: C.GREEN, marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.DARK_TEXT, lineHeight: 1.5 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.RED, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><AlertCircle size={14} /> Don'ts</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {dontsList.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <AlertCircle size={12} style={{ color: C.RED, marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.DARK_TEXT, lineHeight: 1.5 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Voice & Tone */}
      <div style={{ background: C.CARD, borderRadius: 14, padding: 22, border: `1px solid ${C.BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: C.DARK_TEXT }}>Voice & Tone</h3>
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: C.PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            <Download size={13} /> Download Brand Kit
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {voiceTone.map((v) => (
            <div key={v.trait} style={{ padding: "14px 16px", background: "hsl(36,25%,93%)", borderRadius: 10, border: `1px solid ${C.BORDER}` }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.PRIMARY, marginBottom: 5 }}>{v.trait}</p>
              <p style={{ fontSize: 12, color: C.MUTED, lineHeight: 1.5, fontStyle: "italic" }}>{v.example}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Templates ────────────────────────────────────────────────────────────
function TemplatesTab() {
  const catColor: Record<string, string> = {
    Social: "hsl(217,91%,60%)",
    Email: C.GREEN,
    Document: C.MUTED,
    Presentation: C.AMBER,
    PDF: C.RED,
    Content: "hsl(280,60%,55%)",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <p style={{ color: C.MUTED, fontSize: 13 }}>9 templates available</p>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.MUTED }} />
          <input placeholder="Search templates…" style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 8, border: `1px solid ${C.BORDER}`, background: C.CARD, fontSize: 12, color: C.DARK_TEXT, width: 200 }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {TEMPLATES.map((t) => (
          <motion.div
            key={t.id}
            whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(58,31,14,0.12)" }}
            style={{ background: C.CARD, borderRadius: 14, padding: 20, border: `1px solid ${C.BORDER}`, boxShadow: "0 2px 6px rgba(58,31,14,0.05)" }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ background: "hsl(25,30%,90%)", borderRadius: 10, padding: 10, color: C.PRIMARY }}>
                {t.icon}
              </div>
              <span style={{
                fontSize: 11, padding: "2px 9px", borderRadius: 99, fontWeight: 600,
                background: `${catColor[t.category] || C.MUTED}18`,
                color: catColor[t.category] || C.MUTED,
              }}>
                {t.category}
              </span>
            </div>
            <p style={{ fontWeight: 700, fontSize: 14, color: C.DARK_TEXT, marginBottom: 4 }}>{t.name}</p>
            <p style={{ fontSize: 12, color: C.MUTED, marginBottom: 14 }}>{t.uses.toLocaleString()} uses</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ flex: 1, padding: "7px 0", background: C.PRIMARY, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Use Template
              </button>
              <button style={{ padding: "7px 12px", background: "none", color: C.MUTED, border: `1px solid ${C.BORDER}`, borderRadius: 8, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <Eye size={13} /> Preview
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: A/B Test Manager ─────────────────────────────────────────────────────
function ABTestManager() {
  const [toast, setToast] = useState<string | null>(null);
  const [winnerApplied, setWinnerApplied] = useState(false);
  const [newTest, setNewTest] = useState({ name: "", variantA: "", variantB: "" });
  const [split, setSplit] = useState("50/50");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleApplyWinner = () => {
    showToast("Applying Winner A to LinkedIn Banner Q3 campaign…");
    setTimeout(() => setWinnerApplied(true), 1000);
  };

  const statusColor = (s: string) => s === "Running" ? C.GREEN : s === "Paused" ? C.AMBER : C.BLUE;
  const statusBg = (s: string) => s === "Running" ? "rgba(45,122,61,0.1)" : s === "Paused" ? "rgba(217,119,6,0.1)" : "rgba(37,99,235,0.1)";

  const barData = [
    { metric: "Impressions", a: 42000, b: 38000, aLabel: "42K", bLabel: "38K", max: 42000 },
    { metric: "Clicks", a: 1764, b: 1178, aLabel: "1,764", bLabel: "1,178", max: 1764 },
    { metric: "CTR", a: 4.2, b: 3.1, aLabel: "4.2%", bLabel: "3.1%", max: 4.2 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Active Tests */}
      <div style={{ background: C.CARD, borderRadius: 14, padding: 22, border: `1px solid ${C.BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <FlaskConical size={16} color={C.PRIMARY} />
          <h3 style={{ fontWeight: 700, fontSize: 15, color: C.DARK_TEXT }}>Active Tests</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.BORDER}` }}>
                {["Test Name", "Variant A", "Variant B", "Traffic Split", "Status", "Results", "Action"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.MUTED, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr style={{ borderBottom: `1px solid ${C.BORDER}` }}>
                <td style={{ padding: "12px 12px", fontWeight: 600, color: C.DARK_TEXT }}>LinkedIn Banner Q3</td>
                <td style={{ padding: "12px 12px", color: C.MUTED }}>Bold CTA</td>
                <td style={{ padding: "12px 12px", color: C.MUTED }}>Subtle CTA</td>
                <td style={{ padding: "12px 12px", color: C.MUTED }}>50/50</td>
                <td style={{ padding: "12px 12px" }}>
                  <span style={{ background: statusBg("Running"), color: statusColor("Running"), fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 600 }}>Running</span>
                </td>
                <td style={{ padding: "12px 12px" }}>
                  <div style={{ fontSize: 11, color: C.DARK_TEXT }}>
                    <span style={{ color: C.PRIMARY, fontWeight: 600 }}>A: 4.2% CTR</span><br />
                    <span style={{ color: C.BLUE }}>B: 3.1% CTR</span>
                  </div>
                </td>
                <td style={{ padding: "12px 12px" }}>
                  {winnerApplied ? (
                    <span style={{ fontSize: 12, color: C.GREEN, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle size={13} /> Applied A ✓
                    </span>
                  ) : (
                    <button
                      onClick={handleApplyWinner}
                      style={{ background: C.PRIMARY, color: "#fff", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      Apply Winner A
                    </button>
                  )}
                </td>
              </tr>
              {/* Row 2 */}
              <tr style={{ borderBottom: `1px solid ${C.BORDER}` }}>
                <td style={{ padding: "12px 12px", fontWeight: 600, color: C.DARK_TEXT }}>Email Header Spring</td>
                <td style={{ padding: "12px 12px", color: C.MUTED }}>Product Focus</td>
                <td style={{ padding: "12px 12px", color: C.MUTED }}>Lifestyle</td>
                <td style={{ padding: "12px 12px", color: C.MUTED }}>60/40</td>
                <td style={{ padding: "12px 12px" }}>
                  <span style={{ background: statusBg("Complete"), color: statusColor("Complete"), fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 600 }}>Complete</span>
                </td>
                <td style={{ padding: "12px 12px" }}>
                  <div style={{ fontSize: 11 }}>
                    <span style={{ color: C.MUTED }}>A: 28% OR</span><br />
                    <span style={{ color: C.BLUE, fontWeight: 600 }}>B: 31% OR</span>
                  </div>
                </td>
                <td style={{ padding: "12px 12px" }}>
                  <button
                    disabled
                    style={{ background: "rgba(45,122,61,0.12)", color: C.GREEN, border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "default", whiteSpace: "nowrap" }}
                  >
                    Applied B ✓
                  </button>
                </td>
              </tr>
              {/* Row 3 */}
              <tr>
                <td style={{ padding: "12px 12px", fontWeight: 600, color: C.DARK_TEXT }}>Ad Creative BFSI</td>
                <td style={{ padding: "12px 12px", color: C.MUTED }}>Enterprise</td>
                <td style={{ padding: "12px 12px", color: C.MUTED }}>ROI Focus</td>
                <td style={{ padding: "12px 12px", color: C.MUTED }}>50/50</td>
                <td style={{ padding: "12px 12px" }}>
                  <span style={{ background: statusBg("Paused"), color: statusColor("Paused"), fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 600 }}>Paused</span>
                </td>
                <td style={{ padding: "12px 12px" }}>
                  <div style={{ fontSize: 11 }}>
                    <span style={{ color: C.MUTED }}>A: 2.8% CTR</span><br />
                    <span style={{ color: C.BLUE, fontWeight: 600 }}>B: 3.4% CTR</span>
                  </div>
                </td>
                <td style={{ padding: "12px 12px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ background: C.AMBER, color: "#fff", border: "none", borderRadius: 7, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      <Play size={11} /> Resume
                    </button>
                    <button style={{ background: C.BLUE, color: "#fff", border: "none", borderRadius: 7, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                      Apply B
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Test */}
      <div style={{ background: C.CARD, borderRadius: 14, padding: 22, border: `1px solid ${C.BORDER}` }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: C.DARK_TEXT, marginBottom: 16 }}>Create New Test</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.MUTED, display: "block", marginBottom: 5 }}>Test Name</label>
            <input
              placeholder="e.g. Q4 Campaign Banner Test"
              value={newTest.name}
              onChange={(e) => setNewTest((t) => ({ ...t, name: e.target.value }))}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.BORDER}`, background: "#fff", fontSize: 13, color: C.DARK_TEXT, boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.MUTED, display: "block", marginBottom: 5 }}>Variant A Description</label>
            <input
              placeholder="e.g. Bold CTA headline"
              value={newTest.variantA}
              onChange={(e) => setNewTest((t) => ({ ...t, variantA: e.target.value }))}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.BORDER}`, background: "#fff", fontSize: 13, color: C.DARK_TEXT, boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.MUTED, display: "block", marginBottom: 5 }}>Variant B Description</label>
            <input
              placeholder="e.g. Minimal lifestyle imagery"
              value={newTest.variantB}
              onChange={(e) => setNewTest((t) => ({ ...t, variantB: e.target.value }))}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.BORDER}`, background: "#fff", fontSize: 13, color: C.DARK_TEXT, boxSizing: "border-box" }}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.MUTED, display: "block", marginBottom: 8 }}>Traffic Split</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {["50/50", "60/40", "70/30"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSplit(opt)}
                  style={{
                    padding: "5px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: split === opt ? C.PRIMARY : C.CARD,
                    color: split === opt ? "#fff" : C.MUTED,
                    border: `1px solid ${split === opt ? C.PRIMARY : C.BORDER}`,
                  }}
                >
                  {opt}
                </button>
              ))}
              <span style={{ fontSize: 12, color: C.MUTED }}>Selected: <strong style={{ color: C.PRIMARY }}>{split}</strong></span>
            </div>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button
              style={{ background: C.PRIMARY, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
            >
              <FlaskConical size={15} /> Start A/B Test
            </button>
          </div>
        </div>
      </div>

      {/* Results Charts */}
      <div style={{ background: C.CARD, borderRadius: 14, padding: 22, border: `1px solid ${C.BORDER}` }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: C.DARK_TEXT, marginBottom: 4 }}>Results — LinkedIn Banner Q3</h3>
        <p style={{ fontSize: 12, color: C.MUTED, marginBottom: 18 }}>Running · 50/50 split · A leads with 4.2% CTR vs 3.1%</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {barData.map((row) => (
            <div key={row.metric}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.DARK_TEXT, marginBottom: 8 }}>{row.metric}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 14, fontSize: 11, color: C.PRIMARY, fontWeight: 700 }}>A</span>
                  <div style={{ flex: 1, background: "hsl(36,25%,90%)", borderRadius: 99, height: 14, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(row.a / row.max) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{ height: "100%", background: C.PRIMARY, borderRadius: 99 }}
                    />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.PRIMARY, minWidth: 48, textAlign: "right" }}>{row.aLabel}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 14, fontSize: 11, color: C.BLUE, fontWeight: 700 }}>B</span>
                  <div style={{ flex: 1, background: "hsl(36,25%,90%)", borderRadius: 99, height: 14, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(row.b / row.max) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                      style={{ height: "100%", background: C.BLUE, borderRadius: 99 }}
                    />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.BLUE, minWidth: 48, textAlign: "right" }}>{row.bLabel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            style={{
              position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
              background: C.PRIMARY, color: "#fff", padding: "12px 24px", borderRadius: 10,
              fontSize: 13, fontWeight: 600, zIndex: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <CheckCircle size={15} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
const CAMPAIGNS = ["All Campaigns", "BFSI Vertical Launch", "LinkedIn ABM Enterprise", "AWS Partnership", "OGI Whitepaper", "Agentic OS APAC"];

export default function CreativeHubPage() {
  const [activeTab, setActiveTab] = useState<SubTab>("Request Queue");
  const [activeCampaign, setActiveCampaign] = useState("All Campaigns");

  const tabContent: Record<SubTab, React.ReactNode> = {
    "Request Queue": <RequestQueue />,
    "Asset Library": <AssetLibrary />,
    "AI Asset Generator": <AIAssetGenerator />,
    "Brand Guidelines": <BrandGuidelines />,
    Templates: <TemplatesTab />,
    "A/B Test Manager": <ABTestManager />,
  };

  return (
    <div style={{ minHeight: "100vh", background: C.PAGE_BG, padding: "28px 32px" }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: C.PRIMARY, borderRadius: 10, padding: 8 }}>
              <Palette size={20} color="#fff" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.DARK_TEXT }}>Creative Hub</h1>
          </div>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <select
              value={activeCampaign}
              onChange={(e) => setActiveCampaign(e.target.value)}
              style={{
                background: C.CARD, border: `1px solid ${C.BORDER}`, borderRadius: 8,
                padding: "6px 32px 6px 12px", fontSize: 13, color: C.DARK_TEXT, cursor: "pointer",
                appearance: "none", WebkitAppearance: "none", fontWeight: 600, outline: "none",
              }}
            >
              {CAMPAIGNS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={13} style={{ position: "absolute", right: 10, pointerEvents: "none", color: C.MUTED }} />
          </div>
        </div>
        <p style={{ color: C.MUTED, fontSize: 14 }}>Manage design assets, creative requests, and brand resources in one place.</p>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${C.BORDER}`, paddingBottom: 0 }}>
        {SUB_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "9px 18px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeTab === tab ? 700 : 500,
              color: activeTab === tab ? C.PRIMARY : C.MUTED,
              borderBottom: activeTab === tab ? `2.5px solid ${C.PRIMARY}` : "2.5px solid transparent",
              marginBottom: -1,
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
