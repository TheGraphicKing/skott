// /Users/navaneethakrishnan/Desktop/skott/app/build/integrations/page.tsx
"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Link,
  Unlink,
  Clock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

type IntegrationStatus = "connected" | "disconnected";

interface Integration {
  id: string;
  name: string;
  category: string;
  status: IntegrationStatus;
  lastSync: string | null;
  description: string;
  color: string;
  abbr: string;
}

const INTEGRATIONS: Integration[] = [
  { id: "i1", name: "HubSpot", category: "CRM", status: "connected", lastSync: "2m ago", description: "CRM, deals, contacts, MQL pipeline sync", color: "bg-orange-500", abbr: "HS" },
  { id: "i2", name: "Google Ads", category: "Paid Media", status: "connected", lastSync: "5m ago", description: "Campaign performance, spend, conversions", color: "bg-blue-500", abbr: "GA" },
  { id: "i3", name: "LinkedIn Ads", category: "Paid Media", status: "connected", lastSync: "8m ago", description: "Campaign Manager data, lead forms, CTR", color: "bg-indigo-600", abbr: "LI" },
  { id: "i4", name: "Meta Ads", category: "Paid Media", status: "connected", lastSync: "10m ago", description: "Facebook & Instagram campaign metrics", color: "bg-blue-600", abbr: "META" },
  { id: "i5", name: "GA4", category: "Analytics", status: "connected", lastSync: "15m ago", description: "Web traffic, conversions, funnel data", color: "bg-amber-500", abbr: "GA4" },
  { id: "i6", name: "WordPress", category: "CMS", status: "connected", lastSync: "1h ago", description: "Blog publishing, content distribution", color: "bg-blue-700", abbr: "WP" },
  { id: "i7", name: "Semrush", category: "SEO", status: "connected", lastSync: "3h ago", description: "Keyword tracking, backlinks, domain authority", color: "bg-orange-600", abbr: "SR" },
  { id: "i8", name: "Slack", category: "Comms", status: "connected", lastSync: "30s ago", description: "Alert routing, lead notifications, approvals", color: "bg-purple-500", abbr: "SL" },
  { id: "i9", name: "Google Search Console", category: "SEO", status: "connected", lastSync: "6h ago", description: "Organic clicks, impressions, page indexing", color: "bg-green-600", abbr: "GSC" },
  { id: "i10", name: "Salesforce", category: "CRM", status: "disconnected", lastSync: null, description: "Enterprise CRM sync, opportunity pipeline", color: "bg-blue-400", abbr: "SF" },
  { id: "i11", name: "Marketo", category: "Marketing Automation", status: "disconnected", lastSync: null, description: "Lead nurture, email automation, scoring", color: "bg-purple-600", abbr: "MK" },
  { id: "i12", name: "Drift", category: "Conversational", status: "disconnected", lastSync: null, description: "Chat leads, qualification, meeting booking", color: "bg-sky-500", abbr: "DT" },
  { id: "i13", name: "Zapier", category: "Automation", status: "disconnected", lastSync: null, description: "Multi-app workflow automation bridge", color: "bg-orange-400", abbr: "ZAP" },
  { id: "i14", name: "Apollo", category: "Sales Intelligence", status: "disconnected", lastSync: null, description: "Contact enrichment, prospecting database", color: "bg-cyan-600", abbr: "APL" },
  { id: "i15", name: "Mixpanel", category: "Product Analytics", status: "disconnected", lastSync: null, description: "Product usage, event tracking, funnels", color: "bg-violet-600", abbr: "MX" },
];

const CATEGORY_COLORS: Record<string, string> = {
  CRM: "bg-orange-100 text-orange-700",
  "Paid Media": "bg-blue-100 text-blue-700",
  Analytics: "bg-amber-100 text-amber-700",
  CMS: "bg-gray-100 text-gray-600",
  SEO: "bg-green-100 text-green-700",
  Comms: "bg-purple-100 text-purple-700",
  "Marketing Automation": "bg-violet-100 text-violet-700",
  Conversational: "bg-sky-100 text-sky-700",
  Automation: "bg-orange-100 text-orange-700",
  "Sales Intelligence": "bg-cyan-100 text-cyan-700",
  "Product Analytics": "bg-indigo-100 text-indigo-700",
};

type FilterStatus = "all" | "connected" | "disconnected";

export default function IntegrationsPage() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);

  const toggleStatus = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "connected" ? "disconnected" : "connected", lastSync: i.status === "disconnected" ? "just now" : null }
          : i
      )
    );
  };

  const connected = integrations.filter((i) => i.status === "connected").length;
  const filtered = integrations.filter((i) => statusFilter === "all" || i.status === statusFilter);

  return (
    <div className="min-h-screen bg-[hsl(36,30%,98%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(25,40%,18%)] mb-1">Integrations</h1>
          <p className="text-sm text-[hsl(25,20%,45%)]">Connect data sources to power your AI marketing agents</p>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-sm text-[hsl(25,40%,18%)] font-semibold">
              <span className="text-2xl font-bold text-emerald-600">{connected}</span>
              <span className="text-[hsl(25,20%,45%)] font-normal">/ {integrations.length} connected</span>
            </div>
            <div className="flex-1 max-w-48 bg-[hsl(30,15%,85%)] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(connected / integrations.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 bg-[hsl(36,30%,94%)] border border-[hsl(30,15%,85%)] rounded-xl p-1 w-fit">
        {(["all", "connected", "disconnected"] as FilterStatus[]).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
              statusFilter === f ? "bg-[hsl(25,62%,25%)] text-white" : "text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)]"
            )}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Integration grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((intg) => {
          const isConnected = intg.status === "connected";
          return (
            <div
              key={intg.id}
              className={cn(
                "bg-[hsl(36,30%,96%)] border rounded-[0.75rem] p-5 flex flex-col gap-3 hover:shadow-sm transition-all",
                isConnected ? "border-[hsl(30,15%,85%)]" : "border-dashed border-[hsl(30,15%,82%)]"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {/* Logo placeholder */}
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm", intg.color)}>
                    {intg.abbr}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[hsl(25,40%,18%)] text-sm">{intg.name}</h3>
                    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", CATEGORY_COLORS[intg.category] ?? "bg-gray-100 text-gray-600")}>
                      {intg.category}
                    </span>
                  </div>
                </div>
                <div className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full", isConnected ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-500 border border-gray-200")}>
                  {isConnected ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {isConnected ? "Connected" : "Disconnected"}
                </div>
              </div>

              <p className="text-xs text-[hsl(25,20%,45%)] leading-relaxed">{intg.description}</p>

              {/* Last sync */}
              {isConnected && intg.lastSync && (
                <div className="flex items-center gap-1.5 text-xs text-[hsl(25,20%,45%)]">
                  <RefreshCw className="w-3 h-3" />
                  <span>Last sync: <span className="text-[hsl(25,40%,18%)] font-medium">{intg.lastSync}</span></span>
                </div>
              )}

              {/* Action button */}
              <button
                onClick={() => toggleStatus(intg.id)}
                className={cn(
                  "flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                  isConnected
                    ? "border border-red-200 text-red-600 hover:bg-red-50"
                    : "bg-[hsl(25,62%,25%)] text-white hover:bg-[hsl(25,62%,20%)]"
                )}
              >
                {isConnected ? (
                  <><Unlink className="w-3.5 h-3.5" />Disconnect</>
                ) : (
                  <><Link className="w-3.5 h-3.5" />Connect</>
                )}
              </button>
            </div>
          );
        })}
      </div>
      <AIRecommendations page="integrations" />
    </div>
  );
}
