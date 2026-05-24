"use client";

import { useRouter } from "next/navigation";

interface EmptyStateProps {
  activeTags: string[];
}

export default function EmptyState({ activeTags }: EmptyStateProps) {
  const router = useRouter();

  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🔍</div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        No matching projects
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        No projects found with tag
        {activeTags.length > 1 ? "s" : ""}:{" "}
        {activeTags.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-[#dc2626] text-white px-2 py-0.5 rounded-full text-xs mx-0.5"
          >
            {tag}
          </span>
        ))}
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-5 py-2 border-2 border-[#dc2626] text-[#dc2626] rounded-lg
                   text-sm font-semibold hover:bg-[#dc2626] hover:text-white transition-colors"
      >
        Show all projects
      </button>
    </div>
  );
}
