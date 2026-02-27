import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, Clock, Star, ChevronRight, Search } from "lucide-react";

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
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("video_courses")
    .select("*")
    .order("order_index");

  return (
    <div className="p-6 lg:p-8">
      {/* Header: title + subtitle on left, search on right */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-8 w-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Courses</h1>
          </div>
          <p className="text-slate-400">
            Learn UX design at your own pace
          </p>
        </div>
        <div className="w-full sm:w-64 sm:shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Search courses..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Course cards grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos?.length ? (
          videos.map((video, index) => {
            const difficulty = (video as { difficulty_level?: string }).difficulty_level ?? "Beginner";
            const lessons = (video as { lessons_count?: number }).lessons_count ?? 0;
            const rating = (video as { rating?: number }).rating ?? 4.5;
            const colorClass = getCardColor(difficulty);

            return (
              <div
                key={video.id}
                className="group overflow-hidden rounded-xl border border-slate-700/50 bg-[#16162a] transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div
                  className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${colorClass}`}
                >
                  {(video as { thumbnail?: string | null }).thumbnail ? (
                    <img
                      src={(video as { thumbnail?: string }).thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-16 w-16 text-white/90" />
                  )}
                  <span
                    className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white bg-black/20"
                  >
                    {difficulty}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="mb-2 font-semibold text-white line-clamp-2">
                    {video.title}
                  </h2>
                  {video.description && (
                    <p className="mb-4 line-clamp-2 text-sm text-slate-400">
                      {video.description}
                    </p>
                  )}
                  <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(video.duration_minutes)}
                    </span>
                    {lessons > 0 && (
                      <span>{lessons} lessons</span>
                    )}
                    <span className="ml-auto flex items-center gap-1 text-amber-400">
                      <Star className="h-4 w-4 fill-current" />
                      {rating}
                    </span>
                  </div>
                  <Link
                    href={`/videos/${video.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors group-hover:text-indigo-400"
                  >
                    View course
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-[#16162a] py-24">
            <BookOpen className="mb-4 h-16 w-16 text-slate-600" />
            <p className="text-slate-500">No courses yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
