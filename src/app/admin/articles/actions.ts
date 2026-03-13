"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionResult =
  | { success: true; articleId?: string; slug?: string }
  | { success: false; error: string };

export async function createArticle(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized. Please sign in." };

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const author_name = (formData.get("author_name") as string) || null;
    const published = formData.get("published") === "on";
    const categories = (formData.getAll("categories") as string[]) ?? [];
    const read_time_minutes = formData.get("read_time_minutes")
      ? parseInt(formData.get("read_time_minutes") as string)
      : null;
    const featured = formData.get("featured") === "on";

    if (!title?.trim()) return { success: false, error: "Title is required." };
    if (!slug?.trim()) return { success: false, error: "Slug is required." };
    if (!content?.trim()) return { success: false, error: "Content is required." };

    // Cover image upload
    let cover_image: string | null = null;
    const coverFile = formData.get("cover_image_file") as File | null;
    if (coverFile && coverFile.size > 0) {
      const ext = coverFile.name.split(".").pop() || "jpg";
      const path = `covers/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(path, coverFile, { contentType: coverFile.type });
      if (!uploadError) {
        cover_image = path;
      }
    }

    const { data: article, error } = await supabase
      .from("articles")
      .insert({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        cover_image,
        author_id: user.id,
        author_name,
        published,
        categories,
        read_time_minutes,
        featured,
      })
      .select("id, slug")
      .single();

    if (error) {
      if (error.code === "23505") return { success: false, error: "An article with this slug already exists." };
      return { success: false, error: error.message };
    }

    // Upload multiple images
    const imageFiles = formData.getAll("images") as File[];
    const captionInputs = formData.getAll("image_captions") as string[];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (!file?.size || file.size === 0) continue;

      const ext = file.name.split(".").pop() || "jpg";
      const path = `${article.id}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      await supabase.from("article_images").insert({
        article_id: article.id,
        storage_path: path,
        caption: captionInputs[i]?.trim() || null,
        sort_order: i,
      });
    }

    revalidatePath("/admin/articles");
    revalidatePath("/articles");
    revalidatePath("/articles/[slug]", "page");
    revalidatePath("/");

    return { success: true, articleId: article.id, slug: article.slug };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "An unexpected error occurred." };
  }
}

export async function updateArticle(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized. Please sign in." };

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const author_name = (formData.get("author_name") as string) || null;
    const published = formData.get("published") === "on";
    const categories = (formData.getAll("categories") as string[]) ?? [];
    const read_time_minutes = formData.get("read_time_minutes")
      ? parseInt(formData.get("read_time_minutes") as string)
      : null;
    const featured = formData.get("featured") === "on";

    if (!title?.trim()) return { success: false, error: "Title is required." };
    if (!slug?.trim()) return { success: false, error: "Slug is required." };
    if (!content?.trim()) return { success: false, error: "Content is required." };

    // Cover image upload / retain existing
    let cover_image =
      ((formData.get("existing_cover_image") as string) || "").trim() || null;
    const coverFile = formData.get("cover_image_file") as File | null;
    if (coverFile && coverFile.size > 0) {
      const ext = coverFile.name.split(".").pop() || "jpg";
      const path = `covers/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(path, coverFile, { contentType: coverFile.type });
      if (!uploadError) {
        cover_image = path;
      }
    }

    const { error } = await supabase
      .from("articles")
      .update({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        cover_image,
        author_name,
        published,
        categories,
        read_time_minutes,
        featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      if (error.code === "23505") return { success: false, error: "An article with this slug already exists." };
      return { success: false, error: error.message };
    }

    // Upload new images
    const imageFiles = formData.getAll("images") as File[];
    const captionInputs = formData.getAll("image_captions") as string[];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (!file?.size || file.size === 0) continue;

      const ext = file.name.split(".").pop() || "jpg";
      const path = `${id}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(path, file, { contentType: file.type });

      if (uploadError) continue;

      await supabase.from("article_images").insert({
        article_id: id,
        storage_path: path,
        caption: captionInputs[i]?.trim() || null,
        sort_order: i,
      });
    }

    revalidatePath("/admin/articles");
    revalidatePath("/articles");
    revalidatePath("/articles/[slug]", "page");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "An unexpected error occurred." };
  }
}

export async function deleteArticle(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath("/articles/[slug]", "page");
  revalidatePath("/");
}
