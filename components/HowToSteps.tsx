interface HowToStepsProps {
  steps: { title: string; description: string }[];
}

export default function HowToSteps({ steps }: HowToStepsProps) {
  if (steps.length === 0) return null;

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3 items-start">
          <span
            className="w-5 h-5 rounded-full bg-[#dc2626] text-white flex items-center
                       justify-center text-[11px] font-bold flex-shrink-0 mt-0.5"
          >
            {i + 1}
          </span>
          <div>
            <strong className="text-sm text-gray-800">{step.title}</strong>
            {step.description && (
              <span className="text-sm text-gray-500">
                {" "}— {step.description}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
