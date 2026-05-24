import type { Project } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";

interface ProjectHeroProps {
  project: Project;
  index: number;
}

export default function ProjectHero({ project, index }: ProjectHeroProps) {
  const colors = CATEGORY_COLORS[project.category];
  const number = String(index + 1).padStart(3, "0");

  return (
    <div className="flex items-start gap-4 mb-6">
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 border-2"
        style={{ backgroundColor: colors.bg, borderColor: colors.bar }}
      >
        {project.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#dc2626] uppercase tracking-wide">
          No.{number} &middot; {project.category}
        </p>
        <h1 className="text-2xl font-extrabold text-gray-900 mt-0.5">
          {project.title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{project.description}</p>
        <div className="flex gap-2 mt-3">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#dc2626] text-white px-4 py-2
                       rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            &#9654; Open Live App
          </a>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white text-gray-600 px-4 py-2
                         rounded-lg text-sm font-medium border border-gray-200 hover:border-gray-400 transition-colors"
            >
              &#128220; View Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
