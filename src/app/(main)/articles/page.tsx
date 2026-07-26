import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getArticleImageUrl } from "@/lib/article-images";
import { FileText, Search, Clock, Heart, MessageCircle } from "lucide-react";
import { ArticlesFilters } from "./ArticlesFilters";

export const dynamic = "force-dynamic";

const CARD_GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-600",
];

const CATEGORIES = [
  "All",
  "UX Research",
  "UI Design",
  "Design Systems",
  "Career",
  "Accessibility",
  "Case Study",
];

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

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_image,
      created_at,
      read_time_minutes,
      likes_count,
      comments_count,
      featured,
      categories
    `)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (category && category !== "All") {
    query = query.contains("categories", [category]);
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);
  }

  const { data: articles } = await query;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-8 w-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Articles</h1>
          </div>
          <p className="text-slate-400">
            Insights, case studies, and guides from the UX community
          </p>
        </div>
        <div className="w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <form action="/articles" method="get">
              {category && category !== "All" && (
                <input type="hidden" name="category" value={category} />
              )}
              <input
                type="search"
                name="q"
                placeholder="Search articles..."
                defaultValue={q}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </form>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="h-10" />}>
        <ArticlesFilters categories={CATEGORIES} selected={category ?? "All"} />
      </Suspense>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles?.length ? (
          articles.map((article, index) => {
            const categories = (article.categories as string[]) ?? [];
            const gradient =
              CARD_GRADIENTS[index % CARD_GRADIENTS.length];
            const coverUrl = getArticleImageUrl(article.cover_image);

            return (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-700/50 bg-[#16162a] transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div
                  className={`relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br ${gradient}`}
                >
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-sm font-medium text-white/80">
                        Cover Image
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#16162a]/90 to-transparent" />
                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    {article.featured && (
                      <span className="rounded-md bg-indigo-600/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                        Featured
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-0.5 text-xs text-slate-200 backdrop-blur-sm">
                    {timeAgo(article.created_at)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {categories.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {categories.slice(0, 3).map((cat) => (
                        <span
                          key={cat}
                          className="rounded bg-indigo-500/30 px-2 py-0.5 text-xs font-medium text-indigo-300"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="mb-3 text-xl font-bold leading-snug text-white line-clamp-3 group-hover:text-indigo-300">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-400 line-clamp-4">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-4 border-t border-slate-700/60 pt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {article.read_time_minutes
                        ? `${article.read_time_minutes} min read`
                        : "—"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {article.likes_count ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {article.comments_count ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-[#16162a] py-24">
            <FileText className="mb-4 h-16 w-16 text-slate-600" />
            <p className="text-slate-500">No articles yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
