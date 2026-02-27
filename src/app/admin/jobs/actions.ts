"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createJob(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const job_type = formData.get("job_type") as string;
  const salary_range = (formData.get("salary_range") as string) || null;
  const apply_url = (formData.get("apply_url") as string) || null;

  const { error } = await supabase.from("job_posts").insert({
    title,
    company,
    description,
    location,
    job_type,
    salary_range,
    apply_url,
  });

  if (error) throw error;
  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  revalidatePath("/");
}

export async function updateJob(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const job_type = formData.get("job_type") as string;
  const salary_range = (formData.get("salary_range") as string) || null;
  const apply_url = (formData.get("apply_url") as string) || null;

  const { error } = await supabase
    .from("job_posts")
    .update({ title, company, description, location, job_type, salary_range, apply_url, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  revalidatePath("/");
}

export async function deleteJob(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("job_posts").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  revalidatePath("/");
}
