import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CourseForm } from "../../CourseForm";
import { DeleteVideoButton } from "./DeleteVideoButton";

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: video, error } = await supabase
    .from("video_courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !video) notFound();

  const { data: lessons } = await supabase
    .from("course_lessons")
    .select("id, title, youtube_url, duration_minutes, sort_order")
    .eq("course_id", id)
    .order("sort_order");

  const defaultLessons =
    lessons && lessons.length > 0
      ? lessons
      : [
          {
            title: video.title,
            youtube_url: video.youtube_url,
            duration_minutes: video.duration_minutes,
          },
        ];

  return (
    <div>
      <Link href="/admin/videos" className="text-indigo-400 hover:underline mb-6 inline-block">
        ← Back to courses
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-100">Edit course</h2>
        <DeleteVideoButton id={id} />
      </div>

      <CourseForm
        mode="edit"
        courseId={id}
        defaultTitle={video.title}
        defaultDescription={video.description || ""}
        defaultCoverImageUrl={video.thumbnail || null}
        defaultOrderIndex={(video as { order_index?: number }).order_index ?? 0}
        defaultDifficulty={(video as { difficulty_level?: string }).difficulty_level || ""}
        defaultRating={(video as { rating?: number }).rating != null ? String((video as { rating?: number }).rating) : ""}
        defaultLessons={defaultLessons}
      />
    </div>
  );
}
