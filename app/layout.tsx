import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { TopBar } from "@/components/layout/TopBar";

export const metadata: Metadata = {
  title: "Skott — CMO Office AgenticOS",
  description: "Autonomous AI-powered marketing operations by Lyzr",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full" style={{ background: "hsl(36,33%,94%)" }}>
        <div className="flex h-full overflow-hidden">
          <Sidebar />
          <CommandPalette />
          <main
            className="flex-1 relative flex flex-col h-full overflow-hidden"
            style={{ marginLeft: "256px" }}
          >
            <TopBar />
            <div className="flex-1 overflow-y-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
