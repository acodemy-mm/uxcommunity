"use server";

import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CohortActionResult =
  | { success: true }
  | { success: false; error: string };

async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Only admins can manage cohorts.");
  }
}

async function ensureFoundationsProgram(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: existing } = await supabase
    .from("enrollment_programs")
    .select("id")
    .eq("slug", "foundations")
    .maybeSingle();

  if (existing?.id) return existing.id as string;

  const { data: created, error } = await supabase
    .from("enrollment_programs")
    .insert({ title: "UX Community Foundations", slug: "foundations" })
    .select("id")
    .single();

  if (error) throw error;
  return created.id as string;
}

function parseStatus(formData: FormData): "open" | "closed" {
  const status = (formData.get("status") as string) || "open";
  return status === "closed" ? "closed" : "open";
}

function revalidateCohortPaths() {
  revalidatePath("/admin/cohorts");
  revalidatePath("/admin");
  revalidatePath("/enroll");
}

export async function createCohort(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const starts_at = formData.get("starts_at") as string;
  const schedule_label = (formData.get("schedule_label") as string)?.trim();
  const status = parseStatus(formData);
  const amount_mmk = Number(formData.get("amount_mmk") || 400000);
  const sort_index = Number(formData.get("sort_index") || 0);

  if (!name || !starts_at || !schedule_label) {
    throw new Error("Name, start date, and schedule are required.");
  }

  const program_id = await ensureFoundationsProgram(supabase);

  const { data: cohort, error } = await supabase
    .from("enrollment_cohorts")
    .insert({
      program_id,
      name,
      starts_at,
      schedule_label,
      status,
      sort_index,
    })
    .select("id")
    .single();

  if (error) throw error;

  const { error: tierError } = await supabase.from("enrollment_price_tiers").insert({
    cohort_id: cohort.id,
    label: "Regular",
    amount_mmk: Number.isFinite(amount_mmk) ? amount_mmk : 400000,
    per_seat: false,
    sold_out: false,
    sort_index: 0,
  });

  if (tierError) throw tierError;

  revalidateCohortPaths();
  redirect("/admin/cohorts");
}

export async function updateCohort(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const starts_at = formData.get("starts_at") as string;
  const schedule_label = (formData.get("schedule_label") as string)?.trim();
  const status = parseStatus(formData);
  const amount_mmk = Number(formData.get("amount_mmk") || 400000);
  const sort_index = Number(formData.get("sort_index") || 0);

  if (!name || !starts_at || !schedule_label) {
    throw new Error("Name, start date, and schedule are required.");
  }

  const { error } = await supabase
    .from("enrollment_cohorts")
    .update({
      name,
      starts_at,
      schedule_label,
      status,
      sort_index,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;

  // Keep the Regular price tier amount in sync when editing
  const { data: tiers } = await supabase
    .from("enrollment_price_tiers")
    .select("id")
    .eq("cohort_id", id)
    .order("sort_index", { ascending: true })
    .limit(1);

  if (tiers?.[0]?.id && Number.isFinite(amount_mmk)) {
    await supabase
      .from("enrollment_price_tiers")
      .update({
        amount_mmk,
        updated_at: new Date().toISOString(),
      })
      .eq("id", tiers[0].id);
  }

  revalidateCohortPaths();
  redirect("/admin/cohorts");
}

export async function setCohortStatus(
  id: string,
  status: "open" | "closed"
): Promise<CohortActionResult> {
  try {
    await requireAdmin();
    if (status !== "open" && status !== "closed") {
      return { success: false, error: "Invalid status." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("enrollment_cohorts")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidateCohortPaths();
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update status.",
    };
  }
}

export async function deleteCohort(id: string): Promise<CohortActionResult> {
  try {
    await requireAdmin();
    const supabase = await createClient();
    const { error } = await supabase
      .from("enrollment_cohorts")
      .delete()
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidateCohortPaths();
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to delete cohort.",
    };
  }
}
