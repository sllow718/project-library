"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { Project } from "@/lib/types";
import { filterProjects, computeTagStates } from "@/lib/tag-utils";
import TagFilter from "@/components/TagFilter";
import ProjectCard from "@/components/ProjectCard";
import EmptyState from "@/components/EmptyState";

interface IndexContentProps {
  projects: Project[];
  allTags: string[];
}

export function IndexContent({ projects, allTags }: IndexContentProps) {
  const searchParams = useSearchParams();
  const activeTags = searchParams.get("tags")?.split(",").filter(Boolean) ?? [];

  const filteredProjects = useMemo(
    () => filterProjects(projects, activeTags),
    [projects, activeTags]
  );

  const tagStates = useMemo(
    () => computeTagStates(allTags, activeTags, projects),
    [allTags, activeTags, projects]
  );

  return (
    <>
      <div className="mb-6">
        <TagFilter tagStates={tagStates} activeTags={activeTags} />
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState activeTags={activeTags} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filteredProjects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
