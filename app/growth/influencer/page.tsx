"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, TrendingUp, Star, ExternalLink, X, Video, Briefcase, AtSign, Mic } from "lucide-react";
import { AgentStatusBadge } from "@/components/shared/AgentStatusBadge";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

const card = "hsl(36,30%,97%)";
const border = "hsl(30,15%,87%)";
const primary = "hsl(25,40%,18%)";
const muted = "hsl(25,20%,50%)";
const brown = "hsl(25,62%,25%)";

type Platform = "All" | "LinkedIn" | "YouTube" | "Twitter" | "Podcast";
type AudienceSize = "All" | "Nano" | "Micro" | "Mid" | "Macro";

const creators = [
  { id: 1, name: "Lenny Rachitsky", handle: "@lennyrachitsky", platform: "Podcast" as Platform, followers: "800K", engagement: "9.2%", fitScore: 9.4, topics: ["Product", "Growth", "SaaS"], audienceOverlap: "84%", category: "Macro" },
  { id: 2, name: "Rand Fishkin", handle: "@randfish", platform: "Twitter" as Platform, followers: "450K", engagement: "4.1%", fitScore: 8.7, topics: ["SEO", "Marketing", "Startups"], audienceOverlap: "76%", category: "Macro" },
  { id: 3, name: "Corey Haines", handle: "@coreyhainesco", platform: "Twitter" as Platform, followers: "42K", engagement: "6.8%", fitScore: 9.1, topics: ["Growth", "SaaS", "Marketing"], audienceOverlap: "91%", category: "Micro" },
  { id: 4, name: "Amanda Natividad", handle: "@amandanat", platform: "LinkedIn" as Platform, followers: "38K", engagement: "5.4%", fitScore: 8.3, topics: ["Content", "B2B", "Marketing"], audienceOverlap: "79%", category: "Micro" },
  { id: 5, name: "Kevin Indig", handle: "@kevin_indig", platform: "LinkedIn" as Platform, followers: "67K", engagement: "4.9%", fitScore: 7.8, topics: ["SEO", "Growth", "Content"], audienceOverlap: "72%", category: "Micro" },
  { id: 6, name: "Harry Dry", handle: "@harrydry", platform: "Twitter" as Platform, followers: "98K", engagement: "7.2%", fitScore: 9.0, topics: ["Copywriting", "Marketing", "Growth"], audienceOverlap: "88%", category: "Mid" },
  { id: 7, name: "MKT1", handle: "@mkt1newsletter", platform: "LinkedIn" as Platform, followers: "28K", engagement: "8.1%", fitScore: 8.9, topics: ["B2B Marketing", "SaaS", "GTM"], audienceOverlap: "93%", category: "Micro" },
  { id: 8, name: "Lex Fridman", handle: "@lexfridman", platform: "YouTube" as Platform, followers: "4.2M", engagement: "2.8%", fitScore: 5.2, topics: ["AI", "Tech", "Science"], audienceOverlap: "31%", category: "Macro" },
  { id: 9, name: "Dave Gerhardt", handle: "@davegerhardt", platform: "LinkedIn" as Platform, followers: "92K", engagement: "5.7%", fitScore: 9.2, topics: ["B2B Marketing", "Brand", "Leadership"], audienceOverlap: "87%", category: "Mid" },
];

const platformIcons: Record<string, React.ElementType> = {
  LinkedIn: Briefcase, YouTube: Video, Twitter: AtSign, Podcast: Mic,
};

const fitColor = (score: number) => score >= 8.5 ? "hsl(142,71%,35%)" : score >= 7 ? "hsl(38,60%,40%)" : "hsl(0,72%,48%)";
const fitBg = (score: number) => score >= 8.5 ? "hsl(142,71%,45%,0.1)" : score >= 7 ? "hsl(38,92%,50%,0.1)" : "hsl(0,72%,51%,0.1)";

export default function InfluencerHubPage() {
  const [platform, setPlatform] = useState<Platform>("All");
  const [audience, setAudience] = useState<AudienceSize>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof creators[0] | null>(null);

  const filtered = creators.filter(c => {
    if (platform !== "All" && c.platform !== platform) return false;
    if (audience !== "All" && c.category !== audience) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.topics.join(" ").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[1100px] mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-2xl font-semibold" style={{ color: primary }}>Influencer Discovery Agent</h1>
            <AgentStatusBadge status="active" />
          </div>
          <p className="text-sm" style={{ color: muted }}>AI-powered creator research · Brand fit scoring · Collaboration intelligence</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: brown, color: "hsl(36,33%,94%)" }}>
          <TrendingUp size={14} /> Find Creators
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Creators Analyzed", value: "2,847", color: "hsl(217,91%,50%)" },
          { label: "Avg Brand Fit Score", value: "7.2/10", color: "hsl(142,71%,35%)" },
          { label: "Active Collaborations", value: "4", color: "hsl(25,62%,30%)" },
          { label: "Est. Reach Unlocked", value: "4.2M", color: "hsl(280,60%,55%)" },
        ].map(k => (
          <div key={k.label} className="rounded-xl border p-4" style={{ background: card, borderColor: border }}>
            <p className="text-[10.5px] font-semibold uppercase tracking-wider mb-2" style={{ color: muted }}>{k.label}</p>
            <p className="font-serif text-2xl font-semibold" style={{ color: primary }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: card, borderColor: border }}>
          <Search size={14} style={{ color: muted }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search creators by name, topic, or audience..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: primary }} />
        </div>
        <select value={platform} onChange={e => setPlatform(e.target.value as Platform)} className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ background: card, borderColor: border, color: primary }}>
          {["All", "LinkedIn", "YouTube", "Twitter", "Podcast"].map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={audience} onChange={e => setAudience(e.target.value as AudienceSize)} className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ background: card, borderColor: border, color: primary }}>
          {["All", "Nano", "Micro", "Mid", "Macro"].map(a => <option key={a}>{a}</option>)}
        </select>
      </div>

      {/* Creator grid */}
      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((c, i) => {
            const PlatIcon = platformIcons[c.platform] || Users;
            return (
              <motion.div key={c.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-xl border p-5 cursor-pointer hover:shadow-md transition-shadow"
                style={{ background: card, borderColor: border }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: `hsl(${(c.id * 47) % 360},60%,45%)` }}>
                      {c.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: primary }}>{c.name}</p>
                      <p className="text-[11px]" style={{ color: muted }}>{c.handle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: fitBg(c.fitScore) }}>
                    <Star size={10} style={{ color: fitColor(c.fitScore) }} />
                    <span className="text-[11px] font-semibold" style={{ color: fitColor(c.fitScore) }}>{c.fitScore}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <PlatIcon size={12} style={{ color: muted }} />
                  <span className="text-[11px]" style={{ color: muted }}>{c.platform} · {c.followers} followers</span>
                  <span className="ml-auto text-[11px] font-medium" style={{ color: "hsl(142,71%,35%)" }}>{c.engagement} eng</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {c.topics.map(t => (
                    <span key={t} className="text-[10.5px] px-2 py-0.5 rounded-full" style={{ background: "hsl(25,20%,50%,0.1)", color: muted }}>{t}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] mb-4" style={{ color: muted }}>
                  <span>Audience overlap: <span className="font-semibold" style={{ color: primary }}>{c.audienceOverlap}</span></span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setSelected(c)} className="flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors" style={{ borderColor: border, color: primary }}>View Profile</button>
                  <button className="flex-1 text-xs py-1.5 rounded-lg font-medium" style={{ background: brown, color: "hsl(36,33%,94%)" }}>Add to Campaign</button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Creator detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.3)" }} onClick={() => setSelected(null)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="w-[400px] h-full overflow-y-auto p-6 shadow-2xl" style={{ background: card }} onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: `hsl(${(selected.id * 47) % 360},60%,45%)` }}>{selected.name[0]}</div>
                  <div>
                    <p className="font-semibold" style={{ color: primary }}>{selected.name}</p>
                    <p className="text-sm" style={{ color: muted }}>{selected.handle}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: muted }}><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl" style={{ background: "hsl(36,33%,95%)", border: `1px solid ${border}` }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: muted }}>Brand Fit Analysis</p>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl font-serif font-bold" style={{ color: fitColor(selected.fitScore) }}>{selected.fitScore}/10</div>
                    <p className="text-xs" style={{ color: muted }}>Audience overlap: {selected.audienceOverlap}</p>
                  </div>
                  <p className="text-xs" style={{ color: muted }}>Recommended for: <span className="font-medium" style={{ color: primary }}>AI Marketing Campaign Q2</span></p>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: muted }}>Recent Performance</p>
                  {["Avg views/post", "Engagement rate", "Brand mentions/mo"].map((metric, idx) => (
                    <div key={metric} className="flex justify-between py-2" style={{ borderBottom: `1px solid ${border}` }}>
                      <span className="text-sm" style={{ color: muted }}>{metric}</span>
                      <span className="text-sm font-medium" style={{ color: primary }}>{["24.8K", selected.engagement, "12"][idx]}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2.5 rounded-xl font-medium text-sm" style={{ background: brown, color: "hsl(36,33%,94%)" }}>Initiate Collaboration</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AIRecommendations page="influencer" />
    </div>
  );
}
