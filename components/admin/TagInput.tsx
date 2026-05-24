"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { getAutocompleteSuggestions } from "@/lib/tag-utils";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  allExistingTags: string[];
  error?: string;
}

export default function TagInput({ tags, onChange, allExistingTags, error }: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(
    () => getAutocompleteSuggestions(input, allExistingTags, tags),
    [input, allExistingTags, tags]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) {
        addTag(input);
      }
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className={`flex flex-wrap gap-1.5 items-center px-3 py-2 border rounded-lg
          min-h-[42px] bg-white ${error ? "border-red-400" : "border-gray-200"}
          focus-within:border-[#dc2626] focus-within:ring-1 focus-within:ring-[#dc2626]/20`}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-[#fef2f2] text-[#dc2626] px-2 py-0.5 rounded-full text-xs
                       font-medium flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-red-200 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[10px]"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Type a tag and press Enter..." : ""}
          className="flex-1 min-w-[100px] outline-none text-sm bg-transparent py-0.5"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-36 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
