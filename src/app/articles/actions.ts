"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleLike(articleId: string, articleSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("article_likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("article_id", articleId)
    .maybeSingle();

  if (existing) {
    await supabase.from("article_likes").delete().eq("id", existing.id);
  } else {
    await supabase
      .from("article_likes")
      .insert({ user_id: user.id, article_id: articleId });
  }

  revalidatePath(`/articles/${articleSlug}`);
  return { liked: !existing };
}

export async function toggleSave(articleId: string, articleSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("article_saves")
    .select("id")
    .eq("user_id", user.id)
    .eq("article_id", articleId)
    .maybeSingle();

  if (existing) {
    await supabase.from("article_saves").delete().eq("id", existing.id);
  } else {
    await supabase
      .from("article_saves")
      .insert({ user_id: user.id, article_id: articleId });
  }

  revalidatePath(`/articles/${articleSlug}`);
  revalidatePath("/saved");
  return { saved: !existing };
}
