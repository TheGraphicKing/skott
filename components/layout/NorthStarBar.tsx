"use client";

import { TrendingUp, Bell, Settings, Search } from "lucide-react";
import { kpis } from "@/data/mock";

export function NorthStarBar() {
  const pct = Math.round((kpis.mqls.current / kpis.mqls.target) * 100);

  return (
    <header className="h-12 flex items-center gap-6 px-6 shrink-0"
      style={{
        background: "hsl(36,30%,97%)",
        borderBottom: "1px solid hsl(30,15%,87%)",
      }}>

      {/* North Star metric */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "hsl(25,20%,50%)" }}>
          North Star
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-serif text-sm font-semibold"
            style={{ color: "hsl(25,40%,18%)" }}>
            {kpis.mqls.current.toLocaleString()}
          </span>
          <span className="text-xs" style={{ color: "hsl(25,20%,50%)" }}>
            / {kpis.mqls.target.toLocaleString()} MQLs/mo
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 rounded-full overflow-hidden"
            style={{ background: "hsl(30,15%,88%)" }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, background: "hsl(25,62%,25%)" }} />
          </div>
          <div className="flex items-center gap-0.5 text-[11px] font-medium"
            style={{ color: "hsl(142,50%,38%)" }}>
            <TrendingUp size={11} />
            <span>+{kpis.mqls.trend}%</span>
          </div>
          <span className="text-[11px]" style={{ color: "hsl(25,20%,50%)" }}>
            {pct}% of target
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-4 w-px" style={{ background: "hsl(30,15%,85%)" }} />

      {/* Status indicators */}
      <div className="flex items-center gap-4 text-[11px]" style={{ color: "hsl(25,20%,50%)" }}>
        {[
          { label: "HubSpot", ok: true },
          { label: "GA4", ok: true },
          { label: "Apollo", ok: true },
          { label: "SEMrush", ok: true },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full"
              style={{ background: s.ok ? "hsl(142,71%,42%)" : "hsl(0,84%,55%)" }} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-colors hover:opacity-80"
          style={{
            background: "hsl(25,62%,25%,0.08)",
            color: "hsl(25,62%,25%)",
          }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
            style={{ background: "hsl(142,71%,42%)" }} />
          Skott AI · Active
        </button>

        <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-70"
          style={{ color: "hsl(25,20%,50%)" }}>
          <Bell size={14} />
        </button>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-70"
          style={{ color: "hsl(25,20%,50%)" }}>
          <Settings size={14} />
        </button>
      </div>
    </header>
  );
}
