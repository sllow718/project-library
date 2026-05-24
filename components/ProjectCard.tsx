import Link from "next/link";
import type { Project } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const colors = CATEGORY_COLORS[project.category];
  const number = String(index + 1).padStart(3, "0");

  return (
    <Link href={`/${project.slug}`} className="block group">
      <article
        className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden
                   hover:border-[#dc2626] transition-colors duration-150"
      >
        <div
          className="px-2 py-1 text-[10px] font-bold"
          style={{ backgroundColor: colors.bar, color: "#fff" }}
        >
          No.{number}
        </div>
        <div className="p-3 text-center">
          <div className="text-2xl mb-1">{project.icon}</div>
          <h3 className="font-bold text-xs text-gray-900 leading-tight">
            {project.title}
          </h3>
          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
            {project.description}
          </p>
          <div className="flex gap-1 justify-center flex-wrap mt-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded text-[8px] font-medium"
                style={{ backgroundColor: colors.bg, color: colors.bar }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
