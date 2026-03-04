import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import {
  ArrowLeft,
  Clock,
  Star,
  Play,
  BookmarkPlus,
  Share2,
  Lock,
} from "lucide-react";
import { SignInGate } from "@/components/SignInGate";

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return m > 0 ? `${h}:${m.toString().padStart(2, "0")}` : `${h}:00`;
  return `${m}:00`;
}

export default async function VideoDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { id } = await params;
  const user = await getCachedUser();
  const supabase = await createClient();

  // Always fetch video metadata (public) so we can show the locked detail page.
  const { data: video, error } = await supabase
    .from("video_courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !video) notFound();

  // Determine access
  let isAdmin = false;
  let myAccess = null;

  if (user) {
    const [profileRes, myAccessRes] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      supabase.from("user_course_access").select("id").eq("course_id", id).eq("user_id", user.id).maybeSingle(),
    ]);
    isAdmin = profileRes.data?.role === "admin";
    myAccess = myAccessRes.data;
  }

  const canView = isAdmin || !!myAccess;
  const difficulty = (video as { difficulty_level?: string }).difficulty_level ?? "Beginner";
  const rating = (video as { rating?: number }).rating ?? 4.5;

  // Locked view — shown to guests and users without access
  if (!canView) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Link
          href="/videos"
          className="mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Courses
        </Link>

        {/* Course info header */}
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">{difficulty}</p>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">{video.title}</h1>
          {video.description && (
            <p className="mt-2 text-slate-400 max-w-2xl">{video.description}</p>
          )}
        </div>

        {/* Locked player placeholder */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#16162a]">
              <div className="aspect-video flex flex-col items-center justify-center gap-4 bg-slate-900/80">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
                  <Lock className="h-9 w-9 text-slate-500" />
                </div>
                <div className="text-center px-6">
                  <p className="text-lg font-semibold text-slate-300">Course locked</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {user
                      ? "You don't have access to this course. Contact an admin to request access."
                      : "Sign in or create an account to request access to this course."}
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    {!user && (
                      <>
                        <Link
                          href="/auth/login"
                          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                        >
                          Sign in
                        </Link>
                        <Link
                          href="/auth/signup"
                          className="rounded-lg border border-slate-600 px-5 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
                        >
                          Sign up
                        </Link>
                      </>
                    )}
                    <Link
                      href="/videos"
                      className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800"
                    >
                      Browse courses
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Course meta */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-[#16162a] px-4 py-4 text-sm text-slate-500">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{(video as { duration_minutes?: number | null }).duration_minutes
                ? formatDuration((video as { duration_minutes: number }).duration_minutes)
                : "—"}</span>
              <Star className="h-4 w-4 fill-current text-amber-400/60 ml-auto" />
              <span>{rating}</span>
            </div>
          </div>

          {/* Lessons sidebar — blurred placeholder */}
          <div className="h-fit rounded-xl border border-slate-700/50 bg-[#16162a] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-400">Lessons</h3>
              <Lock className="h-4 w-4 text-slate-600" />
            </div>
            <div className="space-y-2 select-none">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5 opacity-40">
                  <div className="h-8 w-8 rounded-full bg-slate-700 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 rounded bg-slate-700 w-3/4" />
                    <div className="h-2.5 rounded bg-slate-800 w-1/3" />
                  </div>
                </div>
              ))}
              <p className="pt-2 text-center text-xs text-slate-600">Unlock to see all lessons</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { lesson: lessonParam } = await searchParams;
  const lessonIndex = Math.max(0, Math.min(parseInt(lessonParam ?? "0", 10) || 0, 999));

  const { data: lessons } = await supabase
    .from("course_lessons")
    .select("id, title, youtube_url, duration_minutes, sort_order")
    .eq("course_id", id)
    .order("sort_order");

  const lessonList =
    lessons && lessons.length > 0
      ? lessons
      : [
          {
            id: video.id,
            title: video.title,
            youtube_url: video.youtube_url,
            duration_minutes: video.duration_minutes,
            sort_order: 0,
          },
        ];

  const currentIndex = Math.min(lessonIndex, lessonList.length - 1);
  const activeLesson = lessonList[currentIndex];
  const hasNext = currentIndex < lessonList.length - 1;
  const nextIndex = currentIndex + 1;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header: back + difficulty + title | rating */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/videos"
            className="mb-3 inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Courses</span>
          </Link>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {difficulty}
          </p>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">
            {video.title}
          </h1>
        </div>
        <div className="flex items-center gap-1 text-amber-400">
          <Star className="h-5 w-5 fill-current" />
          <span className="font-medium text-white">{rating}</span>
        </div>
      </div>

      {/* Two-column layout: video | lessons */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: Video player */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#16162a]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-700/50 px-3 sm:px-4 py-3">
              <h2 className="font-semibold text-white text-sm sm:text-base line-clamp-2">
                {activeLesson.title}
              </h2>
              <div className="flex items-center gap-3 text-sm text-slate-400 shrink-0">
                <button className="flex items-center gap-1 hover:text-indigo-400" type="button">
                  <BookmarkPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Watch later</span>
                </button>
                <button className="flex items-center gap-1 hover:text-indigo-400" type="button">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
            <div className="aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(activeLesson.youtube_url)}
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Video details + Mark complete */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-700/50 bg-[#16162a] px-3 sm:px-4 py-4">
            <div className="min-w-0">
              <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-2">{activeLesson.title}</h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Clock className="h-4 w-4 shrink-0" />
                {formatDuration(activeLesson.duration_minutes)}
              </div>
            </div>
            {hasNext ? (
              <Link
                href={`/videos/${id}?lesson=${nextIndex}`}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Mark complete → Next
              </Link>
            ) : (
              <span className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-400">
                Completed
              </span>
            )}
          </div>

          {/* About this course */}
          <div className="rounded-xl border border-slate-700/50 bg-[#16162a] p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              About this course
            </h3>
            <p className="text-slate-400 leading-relaxed">
              {video.description ??
                "Learn UX principles, design thinking, and user research methods from the ground up. This course is perfect for designers transitioning into UX or students entering the field."}
            </p>
          </div>
        </div>

        {/* Right: Lessons sidebar */}
        <div className="h-fit rounded-xl border border-slate-700/50 bg-[#16162a] p-3 sm:p-4 lg:sticky lg:top-24">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-white">Lessons</h3>
            <span className="text-sm text-slate-500">
              {lessonList.length > 0
                ? `${Math.round(((currentIndex + 1) / lessonList.length) * 100)}% complete`
                : "0% complete"}
            </span>
          </div>
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{
                width: lessonList.length > 0 ? `${((currentIndex + 1) / lessonList.length) * 100}%` : "0%",
              }}
            />
          </div>
          <ul className="space-y-1">
            {lessonList.map((lesson, idx) => {
              const isActive = idx === currentIndex;
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/videos/${id}?lesson=${idx}`}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                      isActive ? "bg-indigo-600/30" : "hover:bg-slate-800/50"
                    }`}
                  >
                    {isActive ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
                        <Play className="h-4 w-4 text-white fill-white" />
                      </div>
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-sm font-medium text-slate-400">
                        {idx + 1}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-medium ${
                          isActive ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        {formatDuration(lesson.duration_minutes)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
