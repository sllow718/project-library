"use client";

import Link from "next/link";
import type { Project } from "@/lib/types";

interface ProjectNavProps {
  prev: Project | null;
  next: Project | null;
}

export default function ProjectNav({ prev, next }: ProjectNavProps) {
  return (
    <div className="flex justify-between items-center pt-4 mt-8 border-t border-gray-200 text-sm">
      <div>
        {prev && (
          <Link
            href={`/${prev.slug}`}
            className="text-gray-500 hover:text-[#dc2626] transition-colors"
          >
            &larr; No.{String(prev.order + 1).padStart(3, "0")} {prev.title}
          </Link>
        )}
      </div>
      <div>
        {next && (
          <Link
            href={`/${next.slug}`}
            className="text-gray-500 hover:text-[#dc2626] transition-colors"
          >
            No.{String(next.order + 1).padStart(3, "0")} {next.title} &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
