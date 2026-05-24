// lib/tag-utils.ts
import type { Project } from "./types";

export function getAllTags(projects: Project[]): string[] {
  const tagSet = new Set<string>();
  for (const p of projects) {
    for (const tag of p.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

export interface TagState {
  name: string;
  active: boolean;
  hasMatches: boolean;
}

export function computeTagStates(
  allTags: string[],
  activeTags: string[],
  projects: Project[]
): TagState[] {
  return allTags.map((tag) => {
    const isActive = activeTags.includes(tag);
    if (isActive) return { name: tag, active: true, hasMatches: true };
    const testTags = [...activeTags, tag];
    const hasMatches = projects.some((p) =>
      testTags.every((t) => p.tags.includes(t))
    );
    return { name: tag, active: false, hasMatches };
  });
}

export function filterProjects(
  projects: Project[],
  activeTags: string[]
): Project[] {
  if (activeTags.length === 0) return projects;
  return projects.filter((p) =>
    activeTags.every((tag) => p.tags.includes(tag))
  );
}

export function getAutocompleteSuggestions(
  input: string,
  allTags: string[],
  selectedTags: string[]
): string[] {
  if (!input.trim()) return [];
  const lower = input.toLowerCase().trim();
  return allTags.filter(
    (tag) =>
      tag.toLowerCase().includes(lower) && !selectedTags.includes(tag)
  );
}

export function recalculateOrder(
  projects: Project[],
  fromIndex: number,
  toIndex: number
): { slug: string; order: number }[] {
  const reordered = [...projects];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved);
  return reordered.map((p, i) => ({ slug: p.slug, order: i }));
}
