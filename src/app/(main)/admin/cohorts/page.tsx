import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatMmk } from "@/lib/enroll/config";
import { CohortStatusSelect } from "./CohortStatusSelect";
import { DeleteCohortButton } from "./DeleteCohortButton";

type CohortRow = {
  id: string;
  name: string;
  starts_at: string;
  schedule_label: string;
  status: "open" | "closed";
  sort_index: number;
  program?: { title: string } | null;
  price_tiers?: { label: string; amount_mmk: number }[] | null;
};

export default async function AdminCohortsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enrollment_cohorts")
    .select(
      `
      id,
      name,
      starts_at,
      schedule_label,
      status,
      sort_index,
      program:enrollment_programs(title),
      price_tiers:enrollment_price_tiers(label, amount_mmk)
    `
    )
    .order("sort_index", { ascending: true })
    .order("starts_at", { ascending: false });

  const cohorts: CohortRow[] = (data ?? []).map((row) => {
    const programRaw = row.program as { title: string } | { title: string }[] | null;
    const program = Array.isArray(programRaw) ? programRaw[0] ?? null : programRaw;
    return {
      id: row.id,
      name: row.name,
      starts_at: row.starts_at,
      schedule_label: row.schedule_label,
      status: row.status as "open" | "closed",
      sort_index: row.sort_index,
      program,
      price_tiers: (row.price_tiers ?? []) as { label: string; amount_mmk: number }[],
    };
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Cohorts</h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage batch info and active / inactive status for enrollment
          </p>
        </div>
        <Link
          href="/admin/cohorts/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium shrink-0"
        >
          New cohort
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Batch
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Schedule
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Price
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Status
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort) => {
              const price = cohort.price_tiers?.[0];
              return (
                <tr key={cohort.id} className="border-b border-slate-700">
                  <td className="px-4 py-3">
                    <p className="text-slate-100 font-medium">{cohort.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cohort.program?.title ?? "Foundations"} · starts{" "}
                      {new Date(cohort.starts_at + "T00:00:00").toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-sm max-w-[240px]">
                    {cohort.schedule_label}
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-sm whitespace-nowrap">
                    {price ? formatMmk(price.amount_mmk) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <CohortStatusSelect
                      cohortId={cohort.id}
                      status={cohort.status}
                    />
                  </td>
                  <td className="px-4 py-3 text-right space-x-4">
                    <Link
                      href={`/admin/cohorts/${cohort.id}/edit`}
                      className="text-indigo-400 hover:underline font-medium"
                    >
                      Edit
                    </Link>
                    <DeleteCohortButton id={cohort.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {cohorts.length === 0 && (
          <p className="p-8 text-center text-slate-500">
            No cohorts yet. Create a batch to show on the enroll form.
          </p>
        )}
      </div>
    </div>
  );
}
