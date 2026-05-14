// /Users/navaneethakrishnan/Desktop/skott/app/build/knowledge-base/page.tsx
"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  FileJson,
  FileSpreadsheet,
  Trash2,
  Eye,
  Database,
  Link,
  Calendar,
  HardDrive,
  CloudUpload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRecommendations } from "@/components/shared/AIRecommendations";

interface KBDocument {
  id: string;
  filename: string;
  type: "PDF" | "MD" | "JSON" | "XLSX";
  size: string;
  dateAdded: string;
  wikiPagesLinked: number;
}

const DOCUMENTS: KBDocument[] = [
  { id: "kb1", filename: "campaign-retrospective-q1.pdf", type: "PDF", size: "2.4 MB", dateAdded: "May 7, 2026", wikiPagesLinked: 14 },
  { id: "kb2", filename: "brand-guidelines-2025.pdf", type: "PDF", size: "8.1 MB", dateAdded: "Jan 12, 2026", wikiPagesLinked: 7 },
  { id: "kb3", filename: "icp-definition.md", type: "MD", size: "48 KB", dateAdded: "Feb 3, 2026", wikiPagesLinked: 4 },
  { id: "kb4", filename: "competitor-analysis.json", type: "JSON", size: "312 KB", dateAdded: "Apr 20, 2026", wikiPagesLinked: 3 },
  { id: "kb5", filename: "hubspot-attribution-model.md", type: "MD", size: "94 KB", dateAdded: "Mar 15, 2026", wikiPagesLinked: 5 },
  { id: "kb6", filename: "event-database-2026.xlsx", type: "XLSX", size: "1.1 MB", dateAdded: "May 1, 2026", wikiPagesLinked: 6 },
  { id: "kb7", filename: "seo-strategy-2025.md", type: "MD", size: "67 KB", dateAdded: "Jan 28, 2026", wikiPagesLinked: 2 },
  { id: "kb8", filename: "playbook-distribution-rules.md", type: "MD", size: "52 KB", dateAdded: "Apr 5, 2026", wikiPagesLinked: 1 },
];

const TYPE_CONFIG: Record<KBDocument["type"], { icon: React.ReactNode; color: string; bg: string }> = {
  PDF: { icon: <FileText className="w-4 h-4" />, color: "text-red-600", bg: "bg-red-100" },
  MD: { icon: <FileText className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-100" },
  JSON: { icon: <FileJson className="w-4 h-4" />, color: "text-amber-600", bg: "bg-amber-100" },
  XLSX: { icon: <FileSpreadsheet className="w-4 h-4" />, color: "text-emerald-600", bg: "bg-emerald-100" },
};

export default function KnowledgeBasePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [docs, setDocs] = useState<KBDocument[]>(DOCUMENTS);

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const totalWikiLinks = docs.reduce((sum, d) => sum + d.wikiPagesLinked, 0);

  return (
    <div className="min-h-screen bg-[hsl(36,30%,98%)] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(25,40%,18%)] mb-1">Knowledge Base</h1>
          <p className="text-sm text-[hsl(25,20%,45%)]">Source documents that power the LLM wiki and agent context</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-[hsl(25,20%,45%)]">
            <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" />{docs.length} documents</span>
            <span className="flex items-center gap-1.5"><Link className="w-3.5 h-3.5" />{totalWikiLinks} wiki pages linked</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(25,62%,25%)] text-white text-sm font-medium rounded-xl hover:bg-[hsl(25,62%,20%)] transition-colors shadow-sm">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Documents table */}
      <div className="bg-[hsl(36,30%,96%)] border border-[hsl(30,15%,85%)] rounded-[0.75rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(30,15%,85%)] bg-[hsl(36,30%,93%)]">
                {["Document", "Type", "Size", "Date Added", "Wiki Pages", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[hsl(25,20%,45%)] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(30,15%,88%)]">
              {docs.map((doc) => {
                const tc = TYPE_CONFIG[doc.type];
                return (
                  <tr key={doc.id} className="hover:bg-[hsl(36,30%,94%)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", tc.bg)}>
                          <span className={tc.color}>{tc.icon}</span>
                        </div>
                        <span className="font-medium text-[hsl(25,40%,18%)] font-mono text-xs">{doc.filename}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-bold px-2 py-0.5 rounded", tc.bg, tc.color)}>{doc.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs text-[hsl(25,20%,45%)]">
                        <HardDrive className="w-3 h-3" />{doc.size}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs text-[hsl(25,20%,45%)]">
                        <Calendar className="w-3 h-3" />{doc.dateAdded}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs font-medium text-[hsl(25,40%,18%)]">
                        <Link className="w-3 h-3 text-[hsl(25,20%,45%)]" />{doc.wikiPagesLinked} pages
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[hsl(36,30%,90%)] text-[hsl(25,20%,45%)] hover:text-[hsl(25,40%,18%)] transition-colors border border-[hsl(30,15%,85%)]">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[hsl(25,20%,45%)] hover:text-red-600 transition-colors border border-[hsl(30,15%,85%)]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
        className={cn(
          "border-2 border-dashed rounded-[0.75rem] p-10 text-center transition-all cursor-pointer",
          isDragging
            ? "border-[hsl(25,62%,25%)] bg-[hsl(25,62%,25%)]/5"
            : "border-[hsl(30,15%,80%)] hover:border-[hsl(25,62%,25%)] hover:bg-[hsl(36,30%,95%)]"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-colors", isDragging ? "bg-[hsl(25,62%,25%)]" : "bg-[hsl(36,30%,92%)]")}>
            <CloudUpload className={cn("w-7 h-7 transition-colors", isDragging ? "text-white" : "text-[hsl(25,20%,45%)]")} />
          </div>
          <div>
            <p className="font-semibold text-[hsl(25,40%,18%)]">Drag & drop documents here</p>
            <p className="text-sm text-[hsl(25,20%,45%)] mt-1">or click to browse — PDF, Markdown, JSON, XLSX supported</p>
          </div>
          <div className="flex items-center gap-2 mt-2 px-4 py-2 bg-[hsl(36,30%,93%)] rounded-lg border border-[hsl(30,15%,85%)]">
            <Database className="w-3.5 h-3.5 text-[hsl(25,62%,25%)]" />
            <p className="text-xs text-[hsl(25,20%,45%)]">
              <span className="font-semibold text-[hsl(25,40%,18%)]">Auto-ingest enabled</span> — uploaded files are automatically processed by the Wiki Curator agent and linked to relevant wiki pages
            </p>
          </div>
        </div>
      </div>
      <AIRecommendations page="knowledge-base" />
    </div>
  );
}
