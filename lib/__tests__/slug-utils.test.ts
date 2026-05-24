import { describe, it, expect } from "vitest";
import { titleToSlug } from "../slug-utils";

describe("titleToSlug", () => {
  it("converts a basic title to a slug", () => {
    expect(titleToSlug("Exam Seating Plan Generator")).toBe("exam-seating-plan-generator");
  });
  it("removes special characters", () => {
    expect(titleToSlug("Hello! World? 123")).toBe("hello-world-123");
  });
  it("collapses multiple hyphens", () => {
    expect(titleToSlug("foo---bar")).toBe("foo-bar");
  });
  it("trims leading and trailing hyphens", () => {
    expect(titleToSlug("-hello-")).toBe("hello");
  });
});
