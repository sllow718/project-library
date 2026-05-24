import { describe, it, expect } from "vitest";
import {
  getAllTags,
  computeTagStates,
  filterProjects,
  getAutocompleteSuggestions,
  recalculateOrder,
} from "../tag-utils";
import type { Project } from "../types";

function mockProject(tags: string[], slug = "test", order = 0): Project {
  return {
    slug, tags, title: "", description: "", icon: "", category: "tools",
    liveUrl: "", status: "live", order, body: "",
    createdAt: { seconds: 0, nanoseconds: 0 },
    updatedAt: { seconds: 0, nanoseconds: 0 },
  };
}

describe("getAllTags", () => {
  it("returns unique sorted tags", () => {
    const projects = [mockProject(["b", "a"]), mockProject(["c", "a"])];
    expect(getAllTags(projects)).toEqual(["a", "b", "c"]);
  });
});

describe("computeTagStates", () => {
  const projects = [mockProject(["tools", "education"]), mockProject(["tools"])];
  it("marks active tags", () => {
    const states = computeTagStates(["tools", "education"], ["tools"], projects);
    const tools = states.find((s) => s.name === "tools")!;
    expect(tools.active).toBe(true);
  });
  it("greyed out for tags with no matches", () => {
    const states = computeTagStates(["tools", "crypto"], ["crypto"], projects);
    const tools = states.find((s) => s.name === "tools")!;
    expect(tools.hasMatches).toBe(false);
  });
});

describe("filterProjects", () => {
  const projects = [mockProject(["tools", "education"]), mockProject(["tools"])];
  it("returns all projects when no tags are active", () => {
    expect(filterProjects(projects, [])).toHaveLength(2);
  });
  it("filters with AND logic", () => {
    expect(filterProjects(projects, ["tools", "education"])).toHaveLength(1);
  });
});

describe("getAutocompleteSuggestions", () => {
  it("returns matching tags not already selected", () => {
    const suggestions = getAutocompleteSuggestions("too", ["tools", "toolbox"], ["tools"]);
    expect(suggestions).toEqual(["toolbox"]);
  });
  it("returns empty when input is blank", () => {
    expect(getAutocompleteSuggestions("", ["tools"], [])).toEqual([]);
  });
});

describe("recalculateOrder", () => {
  it("moves a project from index 2 to index 0", () => {
    const projects = [
      mockProject(["a"], "p1", 0),
      mockProject(["b"], "p2", 1),
      mockProject(["c"], "p3", 2),
    ];
    const result = recalculateOrder(projects, 2, 0);
    expect(result).toEqual([
      { slug: "p3", order: 0 },
      { slug: "p1", order: 1 },
      { slug: "p2", order: 2 },
    ]);
  });
});
