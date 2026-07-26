import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateCohort } from "../../actions";
import { CohortForm } from "../../CohortForm";

export default async function EditCohortPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: cohort } = await supabase
    .from("enrollment_cohorts")
    .select(
      `
      id,
      name,
      starts_at,
      schedule_label,
      status,
      sort_index,
      price_tiers:enrollment_price_tiers(amount_mmk)
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (!cohort) notFound();

  const amount =
    (cohort.price_tiers as { amount_mmk: number }[] | null)?.[0]?.amount_mmk ??
    400000;

  const updateAction = updateCohort.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/cohorts"
        className="text-indigo-400 hover:underline mb-6 inline-block"
      >
        ← Back to cohorts
      </Link>

      <h2 className="text-xl font-semibold text-slate-100 mb-6">
        Edit {cohort.name}
      </h2>
      <CohortForm
        action={updateAction}
        submitLabel="Save changes"
        defaults={{
          name: cohort.name,
          starts_at: cohort.starts_at,
          schedule_label: cohort.schedule_label,
          status: cohort.status as "open" | "closed",
          amount_mmk: amount,
          sort_index: cohort.sort_index,
        }}
      />
    </div>
  );
}
