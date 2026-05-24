import Link from "next/link";

interface PokedexHeaderProps {
  projectCount?: number;
  backHref?: string;
  backLabel?: string;
  title?: string;
}

export default function PokedexHeader({
  projectCount,
  backHref,
  backLabel,
  title,
}: PokedexHeaderProps) {
  return (
    <header className="bg-[#dc2626] text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-[#dc2626] border-2 border-white/50" />
        <span className="w-3 h-3 rounded-full bg-[#fbbf24]" />
        <span className="w-3 h-3 rounded-full bg-[#22c55e]" />

        {backHref && (
          <Link href={backHref} className="text-sm font-semibold hover:underline ml-1">
            &larr; {backLabel || "Back"}
          </Link>
        )}
        {title && <span className="text-sm font-bold ml-1">{title}</span>}

        {projectCount !== undefined && (
          <span className="ml-auto text-xs font-mono text-white/80 tabular-nums">
            {projectCount} PROJECTS
          </span>
        )}
      </div>
    </header>
  );
}
