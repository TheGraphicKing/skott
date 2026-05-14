"use client";

import { cn } from "@/lib/utils";
import { activityFeed } from "@/data/mock";
import { AlertTriangle, CheckCircle, Lightbulb, Info, Zap } from "lucide-react";

const typeConfig = {
  alert:          { icon: AlertTriangle, color: "text-[hsl(38,92%,50%)]", bg: "bg-[hsl(38,92%,50%)]/10" },
  recommendation: { icon: Lightbulb,    color: "text-[hsl(217,91%,60%)]", bg: "bg-[hsl(217,91%,60%)]/10" },
  success:        { icon: CheckCircle,  color: "text-[hsl(142,71%,45%)]", bg: "bg-[hsl(142,71%,45%)]/10" },
  insight:        { icon: Zap,          color: "text-[hsl(262,83%,58%)]", bg: "bg-[hsl(262,83%,58%)]/10" },
  info:           { icon: Info,         color: "text-[hsl(25,20%,45%)]",  bg: "bg-[hsl(25,20%,45%)]/10"  },
};

export function ActivityFeed({ limit = 10 }: { limit?: number }) {
  const items = activityFeed.slice(0, limit);

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const t = typeConfig[item.type as keyof typeof typeConfig];
        const Icon = t.icon;
        return (
          <div
            key={item.id}
            className="flex gap-3 p-3 rounded-[0.75rem] bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", t.bg)}>
              <Icon size={13} className={t.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-[500] text-[hsl(25,62%,25%)]">{item.agent}</span>
                <span className="text-[10px] text-[hsl(25,20%,45%)]">{item.time}</span>
              </div>
              <p className="text-xs text-[hsl(25,20%,45%)] leading-relaxed">{item.action}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
