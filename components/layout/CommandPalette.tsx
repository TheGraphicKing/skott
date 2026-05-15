"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Rocket, PenTool, Brain, BarChart3, GitBranch,
  Sparkles, Search, ArrowRight, Clock,
  Zap, FileText, Shield, LineChart, Layers,
  FileSearch, LayoutDashboard, Mail, Bot, Palette,
  DollarSign, Share2, Settings,
} from "lucide-react";

const PRIMARY = "hsl(25,62%,25%)";
const MUTED = "hsl(25,20%,50%)";
const BORDER = "hsl(30,15%,87%)";
const PAGE_BG = "hsl(36,33%,94%)";

interface CommandItem {
  label: string;
  icon: React.ElementType;
  href: string;
  shortcut: string | null;
}

interface CommandGroup {
  group: string;
  items: CommandItem[];
}

const COMMANDS: CommandGroup[] = [
  {
    group: "Navigate",
    items: [
      { label: "Home",                 icon: Home,            href: "/",              shortcut: "⌘1" },
      { label: "Dashboards",           icon: LayoutDashboard, href: "/dashboards",    shortcut: "⌘2" },
      { label: "Campaigns",            icon: Rocket,          href: "/campaigns",     shortcut: "⌘3" },
      { label: "Content Studio",       icon: PenTool,         href: "/content-studio",shortcut: "⌘4" },
      { label: "Analytics",            icon: LineChart,       href: "/analytics",     shortcut: "⌘5" },
      { label: "Email & CRM",          icon: Mail,            href: "/email-crm",     shortcut: null },
      { label: "Brand & Competitive",  icon: Brain,           href: "/intelligence",  shortcut: null },
      { label: "Agent Center",         icon: Bot,             href: "/agent-center",  shortcut: null },
      { label: "Creative Hub",         icon: Palette,         href: "/creative-hub",  shortcut: null },
      { label: "Paid Media",           icon: DollarSign,      href: "/paid-media",    shortcut: null },
      { label: "Social Media",         icon: Share2,          href: "/social",        shortcut: null },
      { label: "Settings",             icon: Settings,        href: "/settings",      shortcut: null },
    ],
  },
  {
    group: "Create",
    items: [
      { label: "New Campaign",          icon: Rocket,    href: "/campaigns",      shortcut: null },
      { label: "Generate Content",      icon: PenTool,   href: "/content-studio", shortcut: null },
      { label: "Create Workflow",       icon: GitBranch, href: "/build",          shortcut: null },
      { label: "Add Competitor",        icon: Shield,    href: "/intelligence",   shortcut: null },
      { label: "Upload to Brand Brain", icon: Sparkles,  href: "/brand-brain",    shortcut: null },
    ],
  },
  {
    group: "AI Actions",
    items: [
      { label: "Generate Campaign Strategy",   icon: Rocket,    href: "/campaigns",   shortcut: null },
      { label: "Analyze Campaign Performance", icon: BarChart3, href: "/analytics",   shortcut: null },
      { label: "Run Competitor Analysis",      icon: Shield,    href: "/intelligence",shortcut: null },
      { label: "Generate Board Report",        icon: FileText,  href: "/dashboards",  shortcut: null },
      { label: "Create Email Sequence",        icon: Mail,      href: "/email-crm",   shortcut: null },
      { label: "Review Creative Requests",     icon: Palette,   href: "/creative-hub",shortcut: null },
    ],
  },
  {
    group: "Recent",
    items: [
      { label: "BFSI Vertical Launch Campaign",  icon: Clock, href: "/campaigns",   shortcut: null },
      { label: "LinkedIn ABM Enterprise",        icon: Clock, href: "/campaigns",   shortcut: null },
      { label: "Moveworks Competitive Analysis", icon: Clock, href: "/intelligence",shortcut: null },
    ],
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const allItems = COMMANDS.flatMap(g => g.items);

  const filtered = query.trim()
    ? allItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
    : null;

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const navigate = useCallback((href: string) => {
    router.push(href);
    closePalette();
  }, [router, closePalette]);

  useEffect(() => {
    const handleCustomEvent = () => openPalette();
    document.addEventListener("open-cmd-palette", handleCustomEvent);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open ? closePalette() : openPalette();
        return;
      }
      if (!open) return;
      if (e.key === "Escape") { closePalette(); return; }

      const visibleItems = filtered || allItems;
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, visibleItems.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && visibleItems[activeIndex]) { navigate(visibleItems[activeIndex].href); }

      /* ⌘1–⌘9 shortcuts */
      if (e.metaKey && e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        const navItems = COMMANDS[0].items;
        const idx = parseInt(e.key) - 1;
        if (navItems[idx]) navigate(navItems[idx].href);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("open-cmd-palette", handleCustomEvent);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, openPalette, closePalette, navigate, filtered, allItems, activeIndex]);

  const renderGroups = () => {
    if (filtered) {
      return filtered.length > 0 ? (
        <div className="py-2">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>Results</div>
          {filtered.map((item, i) => (
            <CommandItem key={item.label} item={item} active={i === activeIndex}
              onHover={() => setActiveIndex(i)} onClick={() => navigate(item.href)} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-sm" style={{ color: MUTED }}>No commands found for "{query}"</div>
      );
    }

    let flatIndex = 0;
    return COMMANDS.map(group => (
      <div key={group.group} className="py-2" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>{group.group}</div>
        {group.items.map(item => {
          const thisIndex = flatIndex++;
          return (
            <CommandItem key={item.label} item={item} active={thisIndex === activeIndex}
              onHover={() => setActiveIndex(thisIndex)} onClick={() => navigate(item.href)} />
          );
        })}
      </div>
    ));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={closePalette}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "hsl(36,33%,97%)", border: `1px solid ${BORDER}` }}
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <Search className="w-4 h-4 shrink-0" style={{ color: MUTED }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
                placeholder="Search or run a command…"
                className="flex-1 bg-transparent outline-none text-sm font-medium"
                style={{ color: "#3a1f0e" }}
              />
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: PAGE_BG, color: MUTED }}>ESC</kbd>
            </div>

            {/* Commands */}
            <div className="max-h-[420px] overflow-y-auto">{renderGroups()}</div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2.5 text-[10px]" style={{ borderTop: `1px solid ${BORDER}`, color: MUTED }}>
              <span><kbd className="font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="font-mono">↵</kbd> open</span>
              <span><kbd className="font-mono">esc</kbd> close</span>
              <span className="ml-auto flex items-center gap-1"><Zap className="w-3 h-3" /> Powered by Lyzr AgenticOS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CommandItem({
  item, active, onHover, onClick
}: {
  item: { label: string; icon: React.ElementType; href: string; shortcut: string | null };
  active: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      className="w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors text-left"
      style={{
        background: active ? PRIMARY : "transparent",
        color: active ? "#fff" : "#3a1f0e",
      }}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <Icon className="w-4 h-4 shrink-0" style={{ color: active ? "rgba(255,255,255,0.8)" : MUTED }} />
      <span className="flex-1 font-medium">{item.label}</span>
      {item.shortcut && (
        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{ background: active ? "rgba(255,255,255,0.2)" : "hsl(30,15%,87%)", color: active ? "#fff" : MUTED }}>
          {item.shortcut}
        </kbd>
      )}
      {active && <ArrowRight className="w-3 h-3" style={{ color: "rgba(255,255,255,0.7)" }} />}
    </button>
  );
}
