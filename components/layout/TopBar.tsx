"use client";

import { useViewStore } from "@/lib/view-store";
import { Bell, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRIMARY = "hsl(25,62%,25%)";
const MUTED = "hsl(25,20%,50%)";
const BORDER = "hsl(30,15%,87%)";

const notifications = [
  { id: 1, type: "approval", title: "Q2 Board Deck needs sign-off", time: "2m ago", read: false },
  { id: 2, type: "alert", title: "Pipeline 27% behind plan", time: "15m ago", read: false },
  { id: 3, type: "mention", title: "Raj mentioned you in BFSI Campaign", time: "1h ago", read: false },
  { id: 4, type: "approval", title: "Creative for LinkedIn ABM pending", time: "2h ago", read: true },
  { id: 5, type: "alert", title: "LinkedIn CPM up 22% today", time: "3h ago", read: true },
  { id: 6, type: "mention", title: "Morgan Blake: hero image ready for review", time: "4h ago", read: true },
];

export function TopBar() {
  const { viewMode, setViewMode } = useViewStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "approvals" | "alerts" | "mentions">("all");

  const unread = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (tab === "all") return true;
    if (tab === "approvals") return n.type === "approval";
    if (tab === "alerts") return n.type === "alert";
    if (tab === "mentions") return n.type === "mention";
    return true;
  });

  return (
    <header
      className="h-14 flex items-center justify-end px-6 gap-3 shrink-0"
      style={{
        background: "#f8f2e9f0",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${BORDER}`,
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* VIEWING AS toggle */}
      <div className="flex items-center gap-2 mr-2">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>Viewing as</span>
        <div
          className="flex rounded-lg p-0.5"
          style={{ background: "rgba(255,255,255,0.6)", border: `1px solid ${BORDER}` }}
        >
          <button
            onClick={() => setViewMode("cmo")}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={{
              background: viewMode === "cmo" ? PRIMARY : "transparent",
              color: viewMode === "cmo" ? "#fff" : MUTED,
            }}
          >
            CMO&apos;s Office
          </button>
          <button
            onClick={() => setViewMode("marketer")}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={{
              background: viewMode === "marketer" ? PRIMARY : "transparent",
              color: viewMode === "marketer" ? "#fff" : MUTED,
            }}
          >
            Employee
          </button>
        </div>
      </div>

      {/* Notifications bell */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(v => !v)}
          className="w-9 h-9 flex items-center justify-center rounded-lg relative transition-all hover:bg-white/60"
          style={{ border: `1px solid ${BORDER}` }}
        >
          <Bell className="w-4 h-4" style={{ color: MUTED }} />
          {unread > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: "#dc2626" }}
            >
              {unread}
            </span>
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 w-80 rounded-xl shadow-2xl overflow-hidden"
              style={{ background: "hsl(36,33%,97%)", border: `1px solid ${BORDER}`, zIndex: 50 }}
            >
              <div className="px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <p className="text-sm font-semibold" style={{ color: "#3a1f0e" }}>Notifications</p>
              </div>
              <div className="flex gap-1 px-3 py-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
                {(["all", "approvals", "alerts", "mentions"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="px-2.5 py-1 rounded-md text-[10px] font-semibold capitalize transition-all"
                    style={{
                      background: tab === t ? PRIMARY : "transparent",
                      color: tab === t ? "#fff" : MUTED,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {filtered.map(n => (
                  <div
                    key={n.id}
                    className="px-4 py-3 flex gap-3 items-start transition-colors hover:bg-white/40"
                    style={{ borderBottom: `1px solid ${BORDER}`, opacity: n.read ? 0.6 : 1 }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{
                        background: n.type === "approval" ? PRIMARY : n.type === "alert" ? "#dc2626" : "#2563eb",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium" style={{ color: "#3a1f0e" }}>{n.title}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: MUTED }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
        style={{ background: PRIMARY }}
        title="Sarah Chen — CMO"
      >
        SC
      </div>
    </header>
  );
}
