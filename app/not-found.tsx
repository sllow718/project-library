import PokedexHeader from "@/components/PokedexHeader";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <PokedexHeader />
      <main className="mx-auto max-w-6xl px-4 py-20 text-center">
        <div className="text-6xl mb-4">?</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-gray-500 mb-6">
          This project doesn&apos;t exist in the library.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#dc2626] text-white px-5 py-2 rounded-lg
                     text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Back to all projects
        </Link>
      </main>
    </>
  );
}
