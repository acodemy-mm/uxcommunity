import type { EnrollmentCohort, EnrollmentPriceTier } from "@/types/database";
import { formatMmk } from "@/lib/enroll/config";

function formatCohortDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ApplicationSummary({
  courseTitle,
  cohort,
  tier,
}: {
  courseTitle: string;
  cohort?: EnrollmentCohort;
  tier?: EnrollmentPriceTier;
}) {
  return (
    <aside className="border-t border-slate-700 bg-[#161618] p-6 lg:border-l lg:border-t-0">
      <div className="lg:sticky lg:top-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Your application
        </p>

        <div className="mt-5 space-y-5 text-sm">
          <div>
            <p className="text-slate-500">Course</p>
            <p className="mt-1 font-semibold text-slate-100">{courseTitle}</p>
          </div>
          <div>
            <p className="text-slate-500">Cohort</p>
            {cohort ? (
              <p className="mt-1 font-semibold text-slate-100">
                {cohort.name}
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  starts {formatCohortDate(cohort.starts_at)} ·{" "}
                  {cohort.schedule_label}
                </span>
              </p>
            ) : (
              <p className="mt-1 text-slate-500">Not selected</p>
            )}
          </div>
          <div>
            <p className="text-slate-500">Price</p>
            {tier ? (
              <p className="mt-1 font-semibold text-slate-100">
                {tier.label}
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  {formatMmk(tier.amount_mmk)}
                  {tier.per_seat ? " per seat" : ""}
                </span>
              </p>
            ) : (
              <p className="mt-1 text-slate-500">Not selected</p>
            )}
          </div>
        </div>

        <div
          className="mt-8 rounded-2xl px-4 py-4"
          style={{ background: "rgba(10, 132, 255, 0.18)" }}
        >
          <p className="text-xs text-slate-300">Total to transfer</p>
          <p className="mt-1 text-xl font-bold text-white">
            {tier ? formatMmk(tier.amount_mmk) : "—"}
          </p>
        </div>
      </div>
    </aside>
  );
}
