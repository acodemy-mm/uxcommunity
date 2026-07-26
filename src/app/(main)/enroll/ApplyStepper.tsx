export type WizardStepId = "cohort" | "you" | "why" | "consent" | "payment";

const LABELS: Record<WizardStepId, string> = {
  cohort: "Cohort",
  you: "You",
  why: "Why",
  consent: "Consent",
  payment: "Payment",
};

export function ApplyStepper({
  steps,
  currentIndex,
}: {
  steps: WizardStepId[];
  currentIndex: number;
}) {
  return (
    <ol className="flex items-center justify-between gap-1 sm:gap-2">
      {steps.map((id, i) => {
        const active = i === currentIndex;
        const done = i < currentIndex;
        return (
          <li key={id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  active
                    ? "bg-[var(--ios-blue)] text-white"
                    : done
                      ? "bg-indigo-500/80 text-white"
                      : "bg-[#2C2C2E] text-slate-500"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  active ? "text-white" : "text-slate-500"
                }`}
              >
                {LABELS[id]}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-2 h-px flex-1 ${done ? "bg-indigo-500/60" : "bg-slate-700"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
