"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home, Rocket, PenTool, Brain, BarChart3, GitBranch,
  Users, Sparkles, Building2, Inbox, CircleDot, Command,
  TrendingUp, Zap,
} from "lucide-react";

const PRIMARY = "hsl(25,62%,25%)";
const MUTED = "hsl(25,20%,50%)";

const homeItem = { label: "Home", href: "/", icon: Home };

const navSections = [
  {
    label: "COMMAND CENTER",
    items: [
      { label: "Campaigns", href: "/campaigns", icon: Rocket },
      { label: "Content Studio", href: "/content-studio", icon: PenTool },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { label: "Intel Center", href: "/intelligence", icon: Brain },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { label: "Workflows", href: "/workflows", icon: GitBranch },
      { label: "Team & Ops", href: "/team", icon: Users },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "Brand Brain", href: "/brand-brain", icon: Sparkles },
      { label: "Agency Mode", href: "/agency", icon: Building2 },
    ],
  },
  {
    label: "OBSERVE",
    items: [
      { label: "LLM Wiki", href: "/llm-wiki", icon: Brain },
      { label: "Decision Inbox", href: "/observe/decision-inbox", icon: Inbox },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 flex flex-col z-40"
      style={{
        background: "#f8f2e9e6",
        backdropFilter: "blur(30px) saturate(200%)",
        WebkitBackdropFilter: "blur(30px) saturate(200%)",
        borderRight: "1px solid #673f1b1a",
        boxShadow: "4px 0 30px #673f1b08",
      }}
    >
      {/* Brand header */}
      <div className="h-16 flex items-center px-5 gap-3" style={{ borderBottom: "1px solid #673f1b1a" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/lyzr-logo.png" alt="Lyzr" style={{ height: 26, width: "auto", objectFit: "contain" }} />
        <div>
          <p className="text-[13px] font-semibold leading-tight" style={{ color: "#3a1f0e" }}>CMO Office</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: MUTED }}>AgenticOS</p>
        </div>
      </div>

      {/* CMD+K trigger */}
      <div className="px-3 pt-3 pb-1">
        <button
          id="cmd-palette-trigger"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all"
          style={{
            background: "rgba(255,255,255,0.5)",
            border: "1px solid #673f1b20",
            color: MUTED,
          }}
          onClick={() => document.dispatchEvent(new CustomEvent("open-cmd-palette"))}
        >
          <Command className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search or run action…</span>
          <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "#673f1b15" }}>⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
        {/* Home */}
        <NavLink item={homeItem} active={isActive(homeItem.href)} />

        {/* Sectioned items */}
        {navSections.map(section => (
          <div key={section.label} className="pt-2">
            <div className="pt-1 pb-1 px-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: MUTED }}>
                {section.label}
              </span>
            </div>
            {section.items.map(item => (
              <NavLink key={item.href} item={item} active={isActive(item.href)} />
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: "1px solid #673f1b1a" }}>
        {/* Active agents indicator */}
        <div className="mb-2 px-2 py-1.5 rounded-lg flex items-center gap-2"
          style={{ background: "hsl(142,55%,96%)", border: "1px solid hsl(142,55%,80%)" }}>
          <Zap className="w-3 h-3" style={{ color: "hsl(142,55%,35%)" }} />
          <span className="text-[10px] font-semibold" style={{ color: "hsl(142,45%,28%)" }}>6 Agents Running</span>
          <span className="ml-auto flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full animate-pulse" style={{ background: "hsl(142,55%,35%)", animationDelay: `${i * 200}ms` }} />
            ))}
          </span>
        </div>
        <div
          className="flex items-center gap-3 px-2 py-2 rounded-xl"
          style={{ background: "#f8f2e999", border: "1px solid #673f1b1a" }}
        >
          <CircleDot className="w-4 h-4 animate-pulse" style={{ color: "hsl(142,55%,35%)" }} />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs font-medium truncate" style={{ color: "#3a1f0e" }}>System Online</span>
            <span className="text-[10px]" style={{ color: MUTED }}>Powered by Lyzr AgenticOS</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavLink({ item, active }: { item: { label: string; href: string; icon: React.ElementType }; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent",
        active
          ? "bg-black text-white shadow-md"
          : "text-[#5a3a25] hover:bg-white/50 hover:text-[#3a1f0e]"
      )}
    >
      <Icon className={cn("w-4 h-4 shrink-0 transition-colors", active ? "text-white" : "text-[#8a6a55]")} />
      {item.label}
    </Link>
  );
}
