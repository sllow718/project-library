import { Suspense } from "react";
import { getLiveProjects } from "@/lib/firebase-admin";
import PokedexHeader from "@/components/PokedexHeader";
import { getAllTags } from "@/lib/tag-utils";
import { IndexContent } from "./IndexContent";

export const revalidate = false;

export default async function HomePage() {
  const projects = await getLiveProjects();
  const allTags = getAllTags(projects);

  return (
    <>
      <PokedexHeader projectCount={projects.length} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Suspense fallback={<div className="text-center py-12 text-gray-400 text-sm">Loading...</div>}>
          <IndexContent projects={projects} allTags={allTags} />
        </Suspense>
      </main>
    </>
  );
}
