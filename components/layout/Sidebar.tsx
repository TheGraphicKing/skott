"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home, Bot, PenTool, BookOpen, FileText, Globe, Megaphone,
  Mail, Target, Video, Lightbulb, Search, BarChart2, Link2, Zap,
  Briefcase, Brain,
  Plug, GitBranch, Inbox, Play, Shield, ClipboardList,
  Sparkles, Network,
  Building2, Library, Cpu, Users, CircleDot
} from "lucide-react";

// Top-level nav items (no section header — always visible)
const topItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "LLM Wiki", href: "/llm-wiki", icon: Brain },
  { label: "Decision Inbox", href: "/observe/decision-inbox", icon: Inbox },
];

// Sectioned nav (CMO Office context)
const navSections = [
  {
    label: "ACQUIRE",
    items: [
      { label: "Blog Writer", href: "/content/blog", icon: PenTool },
      { label: "Playbooks", href: "/content/playbooks", icon: BookOpen },
      { label: "Case Studies", href: "/content/case-studies", icon: FileText },
      { label: "Page Builder", href: "/content/pages", icon: Globe },
      { label: "PR Agent", href: "/content/pr", icon: Megaphone },
    ],
  },
  {
    label: "ENGAGE",
    items: [
      { label: "Social Media", href: "/social-media", icon: Network },
      { label: "Influencer Hub", href: "/growth/influencer", icon: Users },
      { label: "Webinars", href: "/growth/webinars", icon: Video },
      { label: "Events", href: "/events", icon: Video },
      { label: "Brand Design", href: "/brand-design", icon: Cpu },
    ],
  },
  {
    label: "GROW",
    items: [
      { label: "ABM Email", href: "/growth/abm", icon: Mail },
      { label: "Outbound", href: "/growth/outbound", icon: Target },
      { label: "Viral Ideas", href: "/growth/viral", icon: Lightbulb },
      { label: "Partnerships", href: "/partnerships", icon: Building2 },
    ],
  },
  {
    label: "MEASURE",
    items: [
      { label: "SEO / AEO / GEO", href: "/seo", icon: Search },
      { label: "Paid Ads", href: "/performance-marketing", icon: BarChart2 },
      { label: "Backlinks", href: "/seo/backlinks", icon: Link2 },
      { label: "Keywords", href: "/seo/keywords", icon: Zap },
    ],
  },
  {
    label: "OPERATE",
    items: [
      { label: "Chief of Staff", href: "/chief-of-staff", icon: Briefcase },
      { label: "Agent Studio", href: "/build/agent-studio", icon: Bot },
      { label: "Skills", href: "/build/skills", icon: Sparkles },
      { label: "Knowledge Base", href: "/build/knowledge-base", icon: Library },
      { label: "Integrations", href: "/build/integrations", icon: Plug },
      { label: "Skill Flows", href: "/build/skill-flows", icon: GitBranch },
    ],
  },
  {
    label: "OBSERVE",
    items: [
      { label: "Agent Runs", href: "/observe/agent-runs", icon: Play },
      { label: "Compliance", href: "/observe/compliance", icon: Shield },
      { label: "Audit Trail", href: "/observe/audit-trail", icon: ClipboardList },
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
      {/* ── Brand header ── */}
      <div className="h-16 flex items-center px-5" style={{ borderBottom: "1px solid #673f1b1a" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lyzr-logo.png"
          alt="Lyzr"
          style={{ height: 26, width: "auto", objectFit: "contain" }}
        />
        <div className="ml-3">
          <p className="text-[13px] font-semibold leading-tight" style={{ color: "#3a1f0e" }}>
            CMO Office
          </p>
          <p
            className="text-[9px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "hsl(25,20%,55%)" }}
          >
            AgenticOS
          </p>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {/* Top-level items (Home / LLM Wiki / Decision Inbox) */}
        {topItems.map(item => {
          const active = isActive(item.href);
          return (
            <NavLink key={item.href} item={item} active={active} />
          );
        })}

        {/* Sectioned items */}
        {navSections.map(section => (
          <div key={section.label}>
            <div className="pt-3 pb-1 px-3">
              <span
                className="text-[9px] font-bold uppercase tracking-[0.15em]"
                style={{ color: "hsl(25,20%,55%)" }}
              >
                {section.label}
              </span>
            </div>
            {section.items.map(item => {
              const active = isActive(item.href);
              return <NavLink key={item.href} item={item} active={active} />;
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="p-4" style={{ borderTop: "1px solid #673f1b1a" }}>
        <div
          className="flex items-center gap-3 px-2 py-2 rounded-xl"
          style={{
            background: "#f8f2e999",
            border: "1px solid #673f1b1a",
            backdropFilter: "blur(16px)",
          }}
        >
          <CircleDot className="w-4 h-4 animate-pulse" style={{ color: "hsl(142,55%,35%)" }} />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-xs font-medium truncate" style={{ color: "#3a1f0e" }}>
              Agent Active
            </span>
            <span className="text-[10px]" style={{ color: "hsl(25,20%,50%)" }}>
              Powered by Lyzr AgenticOS
            </span>
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
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group border border-transparent",
        active
          ? "bg-black text-white shadow-md"
          : "text-[#5a3a25] hover:bg-white/50 hover:text-[#3a1f0e]"
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 transition-colors shrink-0",
          active ? "text-white" : "text-[#8a6a55] group-hover:text-[#3a1f0e]"
        )}
      />
      {item.label}
    </Link>
  );
}
