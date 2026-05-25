"use client";

import { useState, useMemo } from "react";
import type { Category } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";

interface PreviewData {
  title: string;
  description: string;
  icon: string;
  category: Category;
  tags: string[];
  body: string;
}

interface LivePreviewProps {
  data: PreviewData;
}

// Simple markdown-to-text: render bold, headings, and paragraphs without any library
function PlainPreview({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        // Headings
        if (trimmed.startsWith("## ")) {
          return (
            <p key={i} className="text-xs font-bold text-gray-800 mt-2">
              {trimmed.replace(/^## /, "")}
            </p>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <p key={i} className="text-[11px] font-semibold text-gray-700 mt-1">
              {trimmed.replace(/^### /, "")}
            </p>
          );
        }

        // Bold markers: **text**
        const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);

        return (
          <p key={i} className="text-xs text-gray-600 leading-relaxed">
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={j} className="text-gray-800">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function LivePreview({ data }: LivePreviewProps) {
  const [tab, setTab] = useState<"card" | "page">("card");
  const colors = CATEGORY_COLORS[data.category];

  const whatItDoes = useMemo(() => {
    if (!data.body) return "Content preview will appear here as you type...";
    return data.body.replace(/## How to use[\s\S]*$/, "").trim() || "What it does section...";
  }, [data.body]);

  const howToUse = useMemo(() => {
    if (!data.body) return "Add steps in the editor...";
    return data.body.match(/## How to use[\s\S]*/)?.[0] || "Add a ## How to use section...";
  }, [data.body]);

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="flex border-b border-gray-200 shrink-0">
        <button
          type="button"
          onClick={() => setTab("card")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
            tab === "card"
              ? "bg-[#fef2f2] text-[#dc2626] border-b-2 border-[#dc2626]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Card Preview
        </button>
        <button
          type="button"
          onClick={() => setTab("page")}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
            tab === "page"
              ? "bg-[#fef2f2] text-[#dc2626] border-b-2 border-[#dc2626]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Page Preview
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#f8f9fa]">
        {tab === "card" ? (
          <div className="max-w-[180px] mx-auto mt-4">
            <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              <div
                className="px-2 py-1 text-[10px] font-bold text-white"
                style={{ backgroundColor: colors.bar }}
              >
                No.001
              </div>
              <div className="p-3 text-center">
                <div className="text-2xl mb-1">{data.icon || "❓"}</div>
                <h3 className="font-bold text-xs text-gray-900 leading-tight">
                  {data.title || "Project Name"}
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                  {data.description || "Short description will appear here"}
                </p>
                <div className="flex gap-1 justify-center flex-wrap mt-2">
                  {(data.tags.length > 0 ? data.tags : ["tag1"]).slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[8px] font-medium"
                      style={{ backgroundColor: colors.bg, color: colors.bar }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 border-2"
                style={{ backgroundColor: colors.bg, borderColor: colors.bar }}
              >
                {data.icon || "❓"}
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#dc2626] uppercase">
                  No.001 &middot; {data.category || "category"}
                </p>
                <h2 className="text-base font-extrabold text-gray-900">
                  {data.title || "Project Name"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {data.description || "Short description"}
                </p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
              <h3 className="text-[11px] font-bold text-gray-900 mb-1">● What it does</h3>
              <PlainPreview text={whatItDoes} />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h3 className="text-[11px] font-bold text-gray-900 mb-1">● How to use</h3>
              <PlainPreview text={howToUse} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
