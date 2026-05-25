import { notFound } from "next/navigation";
import { getLiveProjectBySlug, getLiveProjects } from "@/lib/firebase-admin";
import PokedexHeader from "@/components/PokedexHeader";
import ProjectHero from "@/components/ProjectHero";
import MDXContent from "@/components/MDXContent";
import ProjectNav from "@/components/ProjectNav";
import Link from "next/link";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getLiveProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getLiveProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getLiveProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : allProjects.length - 1;
  const nextIndex = currentIndex < allProjects.length - 1 ? currentIndex + 1 : 0;
  const prev = allProjects.length > 1 ? allProjects[prevIndex] : null;
  const next = allProjects.length > 1 ? allProjects[nextIndex] : null;

  // Split body into "What it does" and "How to use" sections
  const howToUseMatch = project.body.match(/## How to use[\s\S]*/);
  const whatItDoes = project.body.replace(/## How to use[\s\S]*$/, "").trim();
  const howToUseRaw = howToUseMatch ? howToUseMatch[0].trim() : "";
  // Strip the redundant ## How to use heading since the card already shows it
  const howToUse = howToUseRaw.replace(/^## How to use\s*\n?/, "").trim();

  return (
    <>
      <PokedexHeader
        backHref="/"
        backLabel="Back to all projects"
        title={`My Projects / No.${String(currentIndex + 1).padStart(3, "0")}`}
      />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <ProjectHero project={project} index={currentIndex} />

        <section className="bg-white border-2 border-gray-200 rounded-xl p-5 mb-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="text-[#dc2626]">●</span> What it does
          </h2>
          <div className="mt-3">
            <MDXContent content={whatItDoes || "No description provided."} />
          </div>
        </section>

        {howToUse && (
          <section className="bg-white border-2 border-gray-200 rounded-xl p-5 mb-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="text-[#dc2626]">●</span> How to use
            </h2>
            <div className="mt-3">
              <MDXContent content={howToUse} />
            </div>
          </section>
        )}

        <div className="flex gap-2 flex-wrap mb-6">
          {project.tags.map((tag) => (
            <Link
              key={tag}
              href={`/?tags=${tag}`}
              className="bg-[#fef2f2] text-[#dc2626] px-3 py-1 rounded-full text-xs
                         font-medium hover:bg-[#fecaca] transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>

        <ProjectNav prev={prev} next={next} />
      </main>
    </>
  );
}
