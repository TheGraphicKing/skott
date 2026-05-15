"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useViewStore } from "@/lib/view-store";
import {
  Home, Rocket, PenTool, Brain, BarChart3, GitBranch,
  Users, Sparkles, Building2, Inbox, CircleDot, Command,
  Zap, LayoutDashboard, Search, DollarSign, Mail, Share2,
  Palette, Bot, Settings, Shield, BookOpen, Activity,
  FlaskConical, Network, ListChecks, Layers, Eye,
  FileText, TrendingUp, ClipboardList, Megaphone, Globe,
  MonitorPlay, Workflow, Target,
} from "lucide-react";

const MUTED = "hsl(25,20%,50%)";

const cmoSections = [
  {
    label: null,
    items: [
      { label: "Home", href: "/", icon: Home },
      { label: "Command Centre", href: "/command-centre", icon: LayoutDashboard },
      { label: "Compliance & Governance", href: "/compliance", icon: Shield },
      { label: "LLM Wiki", href: "/llm-wiki", icon: BookOpen },
    ],
  },
  {
    label: "AGENT JOURNEYS",
    items: [
      { label: "Campaign Planning", href: "/campaign-planning", icon: Rocket },
      { label: "Marketing Performance", href: "/marketing-performance", icon: TrendingUp },
      { label: "Brand & Reputation", href: "/brand-reputation", icon: Megaphone },
      { label: "Budget & Spend", href: "/budget-spend", icon: DollarSign },
      { label: "Content Operations", href: "/content-ops", icon: FileText },
      { label: "Analytics & Reporting", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "BUILD",
    items: [
      { label: "Agent Studio", href: "/build/agent-studio", icon: Bot },
      { label: "Skills Manager", href: "/build/skills", icon: FlaskConical },
      { label: "Knowledge Base", href: "/build/knowledge-base", icon: Layers },
      { label: "Integrations", href: "/build/integrations", icon: Network },
      { label: "Skill Flows", href: "/build/skill-flows", icon: GitBranch },
    ],
  },
  {
    label: "OBSERVE",
    items: [
      { label: "Decision Inbox", href: "/observe/decision-inbox", icon: Inbox },
      { label: "Agent Metrics", href: "/observe/agent-runs", icon: Activity },
      { label: "Agent Runs", href: "/observe/agent-runs", icon: MonitorPlay },
      { label: "Compliance & Guardrails", href: "/observe/compliance", icon: Shield },
      { label: "Audit Trail", href: "/observe/audit-trail", icon: ListChecks },
    ],
  },
  {
    label: null,
    items: [
      { label: "Team & Ops", href: "/team", icon: Users },
    ],
  },
];

const marketerSections = [
  {
    label: null,
    items: [
      { label: "Home", href: "/", icon: Home },
      { label: "Campaigns", href: "/campaigns", icon: Rocket },
      { label: "Content Studio", href: "/content-studio", icon: PenTool },
    ],
  },
  {
    label: "CHANNELS",
    items: [
      { label: "Social Studio", href: "/social", icon: Share2 },
      { label: "Ad Creative Studio", href: "/creative-hub", icon: Palette },
      { label: "Email & CRM Hub", href: "/email-crm", icon: Mail },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { label: "SEO & Organic", href: "/seo", icon: Search },
      { label: "Competitive Intel", href: "/intelligence", icon: Brain },
      { label: "Market Signals", href: "/paid-media", icon: Target },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { label: "Automation Flows", href: "/workflows", icon: Workflow },
      { label: "Workflows", href: "/workflows", icon: GitBranch },
      { label: "Asset Library", href: "/brand-brain", icon: Sparkles },
    ],
  },
  {
    label: null,
    items: [
      { label: "My Tasks", href: "/team", icon: ClipboardList },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { viewMode, sampleData, toggleSampleData } = useViewStore();
  const sections = viewMode === "cmo" ? cmoSections : marketerSections;

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
          <p className="text-[13px] font-semibold leading-tight" style={{ color: "#3a1f0e" }}>CMO&apos;s Office</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: MUTED }}>AgenticOS</p>
        </div>
      </div>

      {/* CMD+K trigger */}
      <div className="px-3 pt-3 pb-1">
        <button
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all"
          style={{ background: "rgba(255,255,255,0.5)", border: "1px solid #673f1b20", color: MUTED }}
          onClick={() => document.dispatchEvent(new CustomEvent("open-cmd-palette"))}
        >
          <Command className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search or run action…</span>
          <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: "#673f1b15" }}>⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
        {sections.map((section, si) => (
          <div key={si} className={section.label ? "pt-3" : "pt-1"}>
            {section.label && (
              <div className="pt-1 pb-1 px-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: MUTED }}>
                  {section.label}
                </span>
              </div>
            )}
            {section.items.map((item) => (
              <NavLink key={item.href + item.label} item={item} active={isActive(item.href)} />
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: "1px solid #673f1b1a" }}>
        {/* Sample Data toggle */}
        <button
          onClick={toggleSampleData}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-2 transition-all text-left"
          style={{ background: "rgba(255,255,255,0.4)", border: "1px solid #673f1b15" }}
        >
          <div
            className="w-8 h-4 rounded-full relative transition-all"
            style={{ background: sampleData ? "hsl(25,62%,25%)" : "#d1c7bc" }}
          >
            <div
              className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
              style={{ left: sampleData ? "17px" : "2px" }}
            />
          </div>
          <span className="text-[10px] font-medium" style={{ color: MUTED }}>Sample Data</span>
        </button>

        {/* Agent status */}
        <div
          className="flex items-center gap-3 px-2 py-2 rounded-xl"
          style={{ background: "#f8f2e999", border: "1px solid #673f1b1a" }}
        >
          <CircleDot className="w-4 h-4 animate-pulse" style={{ color: "hsl(142,55%,35%)" }} />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs font-medium truncate" style={{ color: "#3a1f0e" }}>Agent Active</span>
            <span className="text-[10px]" style={{ color: MUTED }}>Powered by Lyzr AgenticOS</span>
          </div>
          <span className="flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full animate-pulse" style={{ background: "hsl(142,55%,35%)", animationDelay: `${i * 200}ms` }} />
            ))}
          </span>
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
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        active ? "bg-black text-white shadow-md" : "text-[#5a3a25] hover:bg-white/50 hover:text-[#3a1f0e]"
      )}
    >
      <Icon className={cn("w-4 h-4 shrink-0", active ? "text-white" : "text-[#8a6a55]")} />
      {item.label}
    </Link>
  );
}
