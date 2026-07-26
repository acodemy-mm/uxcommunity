import { createClient } from "@/lib/supabase/server";
import type { EnrollmentCatalog } from "@/types/database";

/** Fallback when DB seed is not yet applied — keeps the wizard usable locally */
export const FALLBACK_CATALOG: EnrollmentCatalog = {
  id: "00000000-0000-4000-8000-000000000001",
  title: "UX Community Foundations",
  slug: "foundations",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  cohorts: [
    {
      id: "00000000-0000-4000-8000-000000000002",
      program_id: "00000000-0000-4000-8000-000000000001",
      name: "Batch 1",
      starts_at: "2026-08-08",
      schedule_label: "Every Weekend, 9:00 - 10:30 AM (MMT)",
      status: "open",
      sort_index: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      price_tiers: [
        {
          id: "00000000-0000-4000-8000-000000000012",
          cohort_id: "00000000-0000-4000-8000-000000000002",
          label: "Regular",
          amount_mmk: 400000,
          per_seat: false,
          sold_out: false,
          sort_index: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    },
  ],
};

export async function getEnrollmentCatalog(
  slug = "foundations"
): Promise<EnrollmentCatalog> {
  try {
    const supabase = await createClient();
    const { data: program, error } = await supabase
      .from("enrollment_programs")
      .select(
        `
        *,
        cohorts:enrollment_cohorts(
          *,
          price_tiers:enrollment_price_tiers(*)
        )
      `
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error || !program) return FALLBACK_CATALOG;

    // Public enroll only shows active (open) cohorts
    const cohorts = (program.cohorts ?? [])
      .filter((c: EnrollmentCatalog["cohorts"][number]) => c.status === "open")
      .map((c: EnrollmentCatalog["cohorts"][number]) => ({
        ...c,
        price_tiers: [...(c.price_tiers ?? [])].sort(
          (a, b) => a.sort_index - b.sort_index
        ),
      }))
      .sort(
        (a: EnrollmentCatalog["cohorts"][number], b: EnrollmentCatalog["cohorts"][number]) =>
          a.sort_index - b.sort_index
      );

    return { ...program, cohorts } as EnrollmentCatalog;
  } catch {
    return FALLBACK_CATALOG;
  }
}
