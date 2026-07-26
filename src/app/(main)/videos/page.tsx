import Link from "next/link";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { BookOpen, Clock, Star, ChevronRight, Lock } from "lucide-react";

function formatDuration(minutes: number | null): string {
  if (!minutes) return "—";
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${minutes}m`;
}

function getCardColor(difficulty: string): string {
  switch (difficulty) {
    case "Beginner":
      return "from-violet-500 to-purple-600";
    case "Intermediate":
      return "from-blue-500 to-indigo-600";
    case "Advanced":
      return "from-emerald-500 to-teal-600";
    default:
      return "from-indigo-500 to-indigo-700";
  }
}

export default async function VideosPage() {
  const user = await getCachedUser();
  const supabase = await createClient();

  // Fetch all courses (metadata is public for locked-card display)
  const { data: videos } = await supabase
    .from("video_courses")
    .select("*")
    .order("order_index");

  // Determine per-course access
  let isAdmin = false;
  const myAccessSet = new Set<string>();

  if (user) {
    const [profileRes, myAccessRes] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).single(),
      supabase.from("user_course_access").select("course_id").eq("user_id", user.id),
    ]);
    isAdmin = profileRes.data?.role === "admin";
    (myAccessRes.data ?? []).forEach((a) => myAccessSet.add(a.course_id));
  }

  const canView = (courseId: string) => isAdmin || myAccessSet.has(courseId);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-8 w-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Courses</h1>
          </div>
          <p className="text-slate-400">Learn UX design at your own pace</p>
        </div>
      </div>

      {!videos?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-[#16162a] py-24">
          <BookOpen className="mb-4 h-16 w-16 text-slate-600" />
          <p className="text-slate-500">No courses yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => {
            const difficulty = (video as { difficulty_level?: string }).difficulty_level ?? "Beginner";
            const lessons = (video as { lessons_count?: number }).lessons_count ?? 0;
            const rating = (video as { rating?: number }).rating ?? 4.5;
            const colorClass = getCardColor(difficulty);
            const accessible = canView(video.id);

            return (
              <div
                key={video.id}
                className={`group relative overflow-hidden rounded-xl border bg-[#16162a] transition-all ${
                  accessible
                    ? "border-slate-700/50 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
                    : "border-slate-700/30 opacity-80"
                }`}
              >
                {/* Thumbnail / gradient banner */}
                <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${colorClass}`}>
                  {(video as { thumbnail?: string | null }).thumbnail ? (
                    <img
                      src={(video as { thumbnail?: string }).thumbnail}
                      alt=""
                      className={`h-full w-full object-cover ${!accessible ? "brightness-50" : ""}`}
                    />
                  ) : (
                    <BookOpen className={`h-16 w-16 ${accessible ? "text-white/90" : "text-white/40"}`} />
                  )}

                  {/* Difficulty badge */}
                  <span className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white bg-black/20">
                    {difficulty}
                  </span>

                  {/* Lock overlay for inaccessible courses */}
                  {!accessible && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px]">
                      <Lock className="h-8 w-8 text-white/80 mb-1" />
                      <span className="text-xs font-medium text-white/70">Access required</span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h2 className={`mb-2 font-semibold line-clamp-2 ${accessible ? "text-white" : "text-slate-400"}`}>
                    {video.title}
                  </h2>
                  {video.description && (
                    <p className="mb-4 line-clamp-2 text-sm text-slate-500">
                      {video.description}
                    </p>
                  )}
                  <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(video.duration_minutes)}
                    </span>
                    {lessons > 0 && <span>{lessons} lessons</span>}
                    <span className="ml-auto flex items-center gap-1 text-amber-400/70">
                      <Star className="h-4 w-4 fill-current" />
                      {rating}
                    </span>
                  </div>

                  {accessible ? (
                    <Link
                      href={`/videos/${video.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors group-hover:text-indigo-400"
                    >
                      View course
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-slate-600" />
                      <span className="text-sm text-slate-600">
                        {user ? "Contact admin to get access" : (
                          <>
                            <Link href="/auth/login" className="text-indigo-400 hover:underline">Sign in</Link>
                            {" "}or contact admin
                          </>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
