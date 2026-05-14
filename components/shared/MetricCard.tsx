"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: number;
  trendLabel?: string;
  variant?: "default" | "accent";
  className?: string;
}

export function MetricCard({ label, value, sub, trend, trendLabel, variant = "default", className }: MetricCardProps) {
  const positive = trend !== undefined && trend >= 0;

  return (
    <div className={cn(
      "rounded-[0.75rem] border border-[hsl(30,15%,85%)] p-5 bg-[hsl(36,30%,96%)]",
      variant === "accent" && "bg-[hsl(25,62%,25%)] border-[hsl(25,62%,25%)]",
      className
    )}>
      <p className={cn(
        "text-[11px] uppercase tracking-widest font-[500] mb-3",
        variant === "accent" ? "text-[hsl(36,33%,80%)]" : "text-[hsl(25,20%,45%)]"
      )}>
        {label}
      </p>
      <p className={cn(
        "font-serif text-3xl font-[600] tracking-tight",
        variant === "accent" ? "text-[hsl(36,33%,94%)]" : "text-[hsl(25,40%,18%)]"
      )}>
        {value}
      </p>
      {sub && (
        <p className={cn(
          "text-xs mt-1",
          variant === "accent" ? "text-[hsl(36,33%,80%)]" : "text-[hsl(25,20%,45%)]"
        )}>
          {sub}
        </p>
      )}
      {trend !== undefined && (
        <div className={cn(
          "flex items-center gap-1 mt-3 text-xs font-[500]",
          positive ? "text-[hsl(142,71%,35%)]" : "text-[hsl(0,84%,55%)]"
        )}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{positive ? "+" : ""}{trend}%{trendLabel ? ` ${trendLabel}` : " WoW"}</span>
        </div>
      )}
    </div>
  );
}
