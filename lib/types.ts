// lib/types.ts

export const CATEGORIES = [
  "tools",
  "crypto",
  "data",
  "ai",
  "education",
  "devtools",
  "creative",
  "networking",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<Category, { bar: string; bg: string }> = {
  tools: { bar: "#dc2626", bg: "#fef2f2" },
  crypto: { bar: "#16a34a", bg: "#f0fdf4" },
  data: { bar: "#2563eb", bg: "#eff6ff" },
  ai: { bar: "#7c3aed", bg: "#f5f3ff" },
  education: { bar: "#dc2626", bg: "#fef2f2" },
  devtools: { bar: "#ea580c", bg: "#fff7ed" },
  creative: { bar: "#db2777", bg: "#fdf2f8" },
  networking: { bar: "#ca8a04", bg: "#fefce8" },
};

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: Category;
  tags: string[];
  liveUrl: string;
  repoUrl?: string;
  status: "live" | "draft";
  order: number;
  body: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export interface ProjectFormData {
  title: string;
  description: string;
  icon: string;
  category: Category;
  tags: string[];
  liveUrl: string;
  repoUrl: string;
  status: "live" | "draft";
  body: string;
}
