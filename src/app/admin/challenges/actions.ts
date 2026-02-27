"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createChallenge(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const rules = (formData.get("rules") as string) || null;
  const prize = (formData.get("prize") as string) || null;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  const { error } = await supabase.from("challenges").insert({
    title,
    description,
    rules,
    prize,
    start_date,
    end_date,
  });

  if (error) throw error;
  revalidatePath("/admin/challenges");
  revalidatePath("/challenges");
  revalidatePath("/");
}

export async function updateChallenge(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const rules = (formData.get("rules") as string) || null;
  const prize = (formData.get("prize") as string) || null;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  const { error } = await supabase
    .from("challenges")
    .update({ title, description, rules, prize, start_date, end_date, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/challenges");
  revalidatePath("/challenges");
  revalidatePath("/");
}

export async function deleteChallenge(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("challenges").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/challenges");
  revalidatePath("/challenges");
  revalidatePath("/");
}
