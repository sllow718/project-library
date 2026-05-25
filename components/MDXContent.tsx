// Server-compatible markdown renderer — no client dependencies
interface MDXContentProps {
  content: string;
}

function renderLine(line: string, i: number) {
  const trimmed = line.trim();
  if (!trimmed) return <div key={i} className="h-3" />;

  // ## Heading
  if (trimmed.startsWith("## ")) {
    return (
      <h2 key={i} className="text-base font-bold text-gray-900 mt-4 mb-1">
        {trimmed.slice(3)}
      </h2>
    );
  }

  // ### Subheading
  if (trimmed.startsWith("### ")) {
    return (
      <h3 key={i} className="text-sm font-semibold text-gray-800 mt-3 mb-1">
        {trimmed.slice(4)}
      </h3>
    );
  }

  // Numbered list item: 1. **title** — description
  const numberedMatch = trimmed.match(/^(\d+)\.\s+\*\*(.+?)\*\*\s*[—–-]?\s*(.*)/);
  if (numberedMatch) {
    return (
      <div key={i} className="flex gap-2 items-start mt-1">
        <span className="w-5 h-5 rounded-full bg-[#dc2626] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
          {numberedMatch[1]}
        </span>
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong className="text-gray-800">{numberedMatch[2]}</strong>
          {numberedMatch[3] ? ` — ${numberedMatch[3]}` : ""}
        </p>
      </div>
    );
  }

  // Regular paragraph — process inline **bold**
  const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) {
    return <p key={i} className="text-sm text-gray-600 leading-relaxed">{trimmed}</p>;
  }

  return (
    <p key={i} className="text-sm text-gray-600 leading-relaxed">
      {parts.map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j} className="text-gray-800 font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </p>
  );
}

export default function MDXContent({ content }: MDXContentProps) {
  const lines = content.trim().split("\n");
  return <div>{lines.map((line, i) => renderLine(line, i))}</div>;
}
