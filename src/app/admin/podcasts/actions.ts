"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPodcast(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const episode_url = formData.get("episode_url") as string;
  const cover_image = (formData.get("cover_image") as string) || null;
  const duration_minutes = formData.get("duration_minutes") ? parseInt(formData.get("duration_minutes") as string) : null;

  const { error } = await supabase.from("podcasts").insert({
    title,
    description: description || null,
    episode_url,
    cover_image,
    duration_minutes,
  });

  if (error) throw error;
  revalidatePath("/admin/podcasts");
  revalidatePath("/podcasts");
  revalidatePath("/");
}

export async function updatePodcast(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const episode_url = formData.get("episode_url") as string;
  const cover_image = (formData.get("cover_image") as string) || null;
  const duration_minutes = formData.get("duration_minutes") ? parseInt(formData.get("duration_minutes") as string) : null;

  const { error } = await supabase
    .from("podcasts")
    .update({ title, description: description || null, episode_url, cover_image, duration_minutes, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/podcasts");
  revalidatePath("/podcasts");
  revalidatePath("/");
}

export async function deletePodcast(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("podcasts").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/podcasts");
  revalidatePath("/podcasts");
  revalidatePath("/");
}
