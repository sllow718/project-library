import ReactMarkdown from "react-markdown";

interface MDXContentProps {
  content: string;
}

export default function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="text-sm text-gray-600 leading-relaxed space-y-2
      [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-4
      [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-3
      [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-800
      [&_p]:text-gray-600 [&_p]:leading-relaxed
      [&_strong]:text-gray-800 [&_strong]:font-semibold
      [&_ul]:list-disc [&_ul]:pl-5
      [&_ol]:list-decimal [&_ol]:pl-5
      [&_li]:text-gray-600 [&_li]:mb-1
      [&_a]:text-[#dc2626] [&_a]:underline">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
