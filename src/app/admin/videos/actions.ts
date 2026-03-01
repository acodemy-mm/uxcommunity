"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const COVER_BUCKET = "course-covers";

async function uploadCover(
  supabase: Awaited<ReturnType<typeof createClient>>,
  courseId: string,
  file: File
): Promise<string | null> {
  if (!file?.size || file.size === 0) return null;
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${courseId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(COVER_BUCKET).upload(path, file, { contentType: file.type });
  if (error) return null;
  const { data: urlData } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path);
  return urlData.publicUrl;
}

function parseLessons(formData: FormData): { title: string; youtube_url: string; duration_minutes: number | null }[] {
  const titles = formData.getAll("lesson_titles") as string[];
  const urls = formData.getAll("lesson_urls") as string[];
  const durations = formData.getAll("lesson_durations") as string[];
  const count = Math.max(titles.length, urls.length);
  const lessons: { title: string; youtube_url: string; duration_minutes: number | null }[] = [];
  for (let i = 0; i < count; i++) {
    const title = (titles[i] ?? "").trim();
    const url = (urls[i] ?? "").trim();
    if (!url) continue;
    const d = durations[i];
    const duration_minutes = d != null && d !== "" ? parseInt(String(d), 10) : null;
    lessons.push({ title: title || `Lesson ${i + 1}`, youtube_url: url, duration_minutes: Number.isNaN(duration_minutes) ? null : duration_minutes });
  }
  return lessons;
}

export async function createVideo(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const order_index = parseInt((formData.get("order_index") as string) || "0", 10) || 0;
  const difficulty_level = (formData.get("difficulty_level") as string) || null;
  const rating = formData.get("rating") ? parseFloat(formData.get("rating") as string) : null;

  const lessons = parseLessons(formData);
  if (lessons.length === 0) {
    throw new Error("At least one video (Video Link Label + Video Link) is required.");
  }

  const firstUrl = lessons[0].youtube_url;
  const totalMinutes = lessons.reduce((sum, l) => sum + (l.duration_minutes ?? 0), 0) || null;

  const { data: course, error: courseError } = await supabase
    .from("video_courses")
    .insert({
      title,
      description,
      youtube_url: firstUrl,
      duration_minutes: totalMinutes,
      order_index,
      difficulty_level,
      lessons_count: lessons.length,
      rating,
    })
    .select("id")
    .single();

  if (courseError) throw courseError;

  const coverFile = formData.get("cover_image") as File | null;
  let thumbnail: string | null = null;
  if (coverFile?.size && coverFile.size > 0) {
    thumbnail = await uploadCover(supabase, course.id, coverFile);
  }
  if (thumbnail) {
    await supabase.from("video_courses").update({ thumbnail }).eq("id", course.id);
  }

  for (let i = 0; i < lessons.length; i++) {
    const { error: lessonError } = await supabase.from("course_lessons").insert({
      course_id: course.id,
      title: lessons[i].title,
      youtube_url: lessons[i].youtube_url,
      duration_minutes: lessons[i].duration_minutes,
      sort_order: i,
    });
    if (lessonError) throw lessonError;
  }

  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  revalidatePath("/");
}

export async function updateVideo(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const order_index = parseInt((formData.get("order_index") as string) || "0", 10) || 0;
  const difficulty_level = (formData.get("difficulty_level") as string) || null;
  const rating = formData.get("rating") ? parseFloat(formData.get("rating") as string) : null;

  const lessons = parseLessons(formData);
  if (lessons.length === 0) {
    throw new Error("At least one video (Video Link Label + Video Link) is required.");
  }

  const firstUrl = lessons[0].youtube_url;
  const totalMinutes = lessons.reduce((sum, l) => sum + (l.duration_minutes ?? 0), 0) || null;
  const removeCover = formData.get("remove_cover") === "on";

  let thumbnail: string | null | undefined = undefined;
  if (removeCover) {
    thumbnail = null;
  } else {
    const coverFile = formData.get("cover_image") as File | null;
    if (coverFile?.size && coverFile.size > 0) {
      thumbnail = await uploadCover(supabase, id, coverFile);
    }
  }

  const updatePayload: Record<string, unknown> = {
    title,
    description,
    youtube_url: firstUrl,
    duration_minutes: totalMinutes,
    order_index,
    difficulty_level,
    lessons_count: lessons.length,
    rating,
    updated_at: new Date().toISOString(),
  };
  if (thumbnail !== undefined) updatePayload.thumbnail = thumbnail;

  const { error: courseError } = await supabase
    .from("video_courses")
    .update(updatePayload)
    .eq("id", id);

  if (courseError) throw courseError;

  await supabase.from("course_lessons").delete().eq("course_id", id);

  for (let i = 0; i < lessons.length; i++) {
    const { error: lessonError } = await supabase.from("course_lessons").insert({
      course_id: id,
      title: lessons[i].title,
      youtube_url: lessons[i].youtube_url,
      duration_minutes: lessons[i].duration_minutes,
      sort_order: i,
    });
    if (lessonError) throw lessonError;
  }

  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  revalidatePath("/");
}

export async function deleteVideo(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("video_courses").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  revalidatePath("/");
}

export async function grantCourseAccess(courseId: string, userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  if (profile?.role !== "admin") throw new Error("Unauthorized");
  const { error } = await supabase.from("user_course_access").insert({
    course_id: courseId,
    user_id: userId,
    granted_by: user?.id ?? null,
  });
  if (error) throw error;
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
}

export async function revokeCourseAccess(courseId: string, userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).single();
  if (profile?.role !== "admin") throw new Error("Unauthorized");
  const { error } = await supabase.from("user_course_access").delete().eq("course_id", courseId).eq("user_id", userId);
  if (error) throw error;
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
}
