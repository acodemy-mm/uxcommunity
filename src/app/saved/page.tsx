import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Bookmark, ArrowLeft, Heart, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

function timeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

type SavedRow = {
  article_id: string;
  created_at: string;
  articles: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    likes_count: number | null;
    read_time_minutes: number | null;
    created_at: string;
    categories: string[] | null;
  } | null;
};

export default async function SavedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: saves } = await supabase
    .from("article_saves")
    .select(
      `article_id, created_at,
       articles(id, title, slug, excerpt, cover_image, likes_count, read_time_minutes, created_at, categories)`
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const savedArticles = (saves ?? []) as SavedRow[];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "rgba(235,235,245,0.4)" }}>
          Library
        </p>
        <h1 className="text-[34px] font-bold text-white leading-tight">
          Saved
        </h1>
        <p className="mt-1 text-[15px]" style={{ color: "rgba(235,235,245,0.55)" }}>
          {savedArticles.length} {savedArticles.length === 1 ? "article" : "articles"} saved
        </p>
      </div>

      {savedArticles.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-[22px]"
            style={{ background: "rgba(118,118,128,0.18)" }}
          >
            <Bookmark className="h-9 w-9" style={{ color: "rgba(235,235,245,0.4)" }} />
          </div>
          <h2 className="mb-2 text-[19px] font-semibold text-white">Nothing saved yet</h2>
          <p className="mb-6 max-w-xs text-[15px]" style={{ color: "rgba(235,235,245,0.5)" }}>
            Tap the bookmark icon on any article to save it here for later.
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold text-white"
            style={{ background: "#0A84FF" }}
          >
            Browse Articles
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {savedArticles.map((row) => {
            const a = row.articles;
            if (!a) return null;
            const cats = (a.categories ?? []) as string[];

            return (
              <Link
                key={row.article_id}
                href={`/articles/${a.slug}`}
                className="group flex gap-4 rounded-2xl p-4 ios-spring active:scale-[0.98]"
                style={{ background: "#1C1C1E" }}
              >
                {/* Cover thumbnail */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700">
                  {a.cover_image && (
                    <img
                      src={a.cover_image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  {cats.length > 0 && (
                    <p className="mb-1 truncate text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: "#0A84FF" }}>
                      {cats[0]}
                    </p>
                  )}
                  <h2 className="mb-1 line-clamp-2 text-[15px] font-semibold leading-snug text-white group-hover:text-indigo-300">
                    {a.title}
                  </h2>
                  {a.excerpt && (
                    <p className="mb-2 line-clamp-1 text-[13px]"
                      style={{ color: "rgba(235,235,245,0.5)" }}>
                      {a.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[12px]"
                    style={{ color: "rgba(235,235,245,0.4)" }}>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {a.read_time_minutes ? `${a.read_time_minutes} min` : timeAgo(a.created_at)}
                    </span>
                    {(a.likes_count ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {a.likes_count}
                      </span>
                    )}
                  </div>
                </div>

                {/* Saved bookmark indicator */}
                <Bookmark className="mt-1 h-4 w-4 shrink-0 fill-current" style={{ color: "#0A84FF" }} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
