import ReactMarkdown from "react-markdown";

interface MDXContentProps {
  content: string;
}

export default function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-800 prose-li:text-gray-600">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
