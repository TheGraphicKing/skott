import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewMode = "cmo" | "marketer";

interface ViewStore {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sampleData: boolean;
  toggleSampleData: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      viewMode: "cmo",
      setViewMode: (mode) => set({ viewMode: mode }),
      sampleData: true,
      toggleSampleData: () => set((s) => ({ sampleData: !s.sampleData })),
      sidebarCollapsed: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
    }),
    { name: "cmo-view-store" }
  )
);
