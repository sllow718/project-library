// lib/slug-utils.ts
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // remove special chars
    .replace(/[\s_]+/g, "-")     // spaces and underscores → hyphens
    .replace(/-+/g, "-")         // collapse multiple hyphens
    .replace(/^-|-$/g, "");      // trim leading/trailing hyphens
}
