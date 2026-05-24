"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { TagState } from "@/lib/tag-utils";

interface TagFilterProps {
  tagStates: TagState[];
  activeTags: string[];
}

export default function TagFilter({ tagStates, activeTags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagClick = (tagName: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (tagName === "ALL") {
      params.delete("tags");
    } else if (activeTags.includes(tagName)) {
      const newTags = activeTags.filter((t) => t !== tagName);
      if (newTags.length === 0) {
        params.delete("tags");
      } else {
        params.set("tags", newTags.join(","));
      }
    } else {
      const newTags = [...activeTags, tagName];
      params.set("tags", newTags.join(","));
    }

    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const showAll = activeTags.length === 0;

  return (
    <div className="flex gap-1.5 flex-wrap">
      <button
        onClick={() => handleTagClick("ALL")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
          showAll
            ? "bg-[#dc2626] text-white"
            : "bg-gray-100 text-gray-500 border border-gray-200 hover:border-[#dc2626]"
        }`}
      >
        ALL
      </button>
      {tagStates.map((tag) => (
        <button
          key={tag.name}
          onClick={() => tag.hasMatches && handleTagClick(tag.name)}
          disabled={!tag.hasMatches && !tag.active}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            tag.active
              ? "bg-[#dc2626] text-white"
              : tag.hasMatches
                ? "bg-gray-100 text-gray-500 border border-gray-200 hover:border-[#dc2626]"
                : "bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed opacity-40"
          }`}
        >
          {tag.active ? `${tag.name} ×` : tag.name}
        </button>
      ))}
    </div>
  );
}
