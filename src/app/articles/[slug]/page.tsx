import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Share2, Clock } from "lucide-react";
import { LikeButton } from "@/components/LikeButton";
import { SaveButton } from "@/components/SaveButton";

export const dynamic = "force-dynamic";

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

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

function getImageUrl(storagePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return storagePath;
  return `${supabaseUrl}/storage/v1/object/public/article-images/${storagePath.replace(/^\//, "")}`;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !article) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [imagesResult, authorResult, likeResult, saveResult, moreArticlesResult] =
    await Promise.all([
      supabase
        .from("article_images")
        .select("id, storage_path, caption, sort_order")
        .eq("article_id", article.id)
        .order("sort_order"),
      article.author_id
        ? supabase
            .from("profiles")
            .select("full_name")
            .eq("id", article.author_id)
            .single()
        : Promise.resolve({ data: null }),
      user
        ? supabase
            .from("article_likes")
            .select("id")
            .eq("user_id", user.id)
            .eq("article_id", article.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      user
        ? supabase
            .from("article_saves")
            .select("id")
            .eq("user_id", user.id)
            .eq("article_id", article.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      supabase
        .from("articles")
        .select(
          "id, title, slug, excerpt, cover_image, created_at, read_time_minutes, categories"
        )
        .eq("published", true)
        .neq("id", article.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const images = imagesResult.data;
  const authorName = authorResult.data?.full_name ?? null;
  const initialLiked = !!likeResult.data;
  const initialSaved = !!saveResult.data;
  const categories = (article.categories as string[]) ?? [];
  const likesCount = article.likes_count ?? 0;
  const moreArticles = moreArticlesResult.data ?? [];

  const isHtmlContent =
    typeof article.content === "string" &&
    /<\/?[a-z][\s\S]*>/i.test(article.content);

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/articles"
        className="mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Articles
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.5fr)]">
        <article className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#16162a]">
          {/* Cover Image */}
          <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
            {article.cover_image ? (
              <img
                src={
                  /^https?:\/\//.test(article.cover_image)
                    ? article.cover_image
                    : getImageUrl(article.cover_image)
                }
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium text-white/80">
                Cover Image
              </span>
            )}
          </div>

          <div className="p-6 lg:p-8">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-indigo-500/30 px-3 py-1 text-sm font-medium text-indigo-300"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              {article.title}
            </h1>

            {/* Author & Meta */}
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                {getInitials(authorName)}
              </div>
              <div>
                <p className="font-medium text-slate-200">
                  {authorName ?? "Anonymous"}
                </p>
                <p className="text-sm text-slate-500">
                  {timeAgo(article.created_at)}
                  {article.read_time_minutes && (
                    <> · {article.read_time_minutes} min read</>
                  )}
                </p>
              </div>
            </div>

            {/* Article Body */}
            {isHtmlContent ? (
              <div
                className="prose-article max-w-none [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-100 [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-100 [&_p]:mb-4 [&_p]:text-slate-300 [&_p]:leading-relaxed [&_a]:text-indigo-400 [&_a]:hover:underline [&_strong]:text-slate-100 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-slate-300 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-slate-300 [&_li]:mb-1"
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    let html = String(article.content ?? "")
                      .replace(/^<html[^>]*>/i, "")
                      .replace(/<\/html>$/i, "");
                    html = html.replace(/<p>([\s\S]*?)<\/p>/gi, (_match, inner) => {
                      const byNewlines = inner
                        .split(/\r?\n+/)
                        .map((line: string) => line.trim())
                        .filter(Boolean);
                      if (byNewlines.length > 1) {
                        return byNewlines
                          .map((line: string) => `<p>${line}</p>`)
                          .join("");
                      }
                      const one = byNewlines[0] ?? inner.trim();
                      if (one.length <= 200) return `<p>${one}</p>`;
                      const parts = one.split(/([။.])\s+/);
                      const sentences: string[] = [];
                      for (let i = 0; i < parts.length; i++) {
                        if (/^[။.]$/.test(parts[i]!) && sentences.length > 0) {
                          sentences[sentences.length - 1] += parts[i];
                        } else if (parts[i]!.trim()) {
                          sentences.push(parts[i]!.trim());
                        }
                      }
                      return sentences.length > 1
                        ? sentences.map((s) => `<p>${s}</p>`).join("")
                        : `<p>${one}</p>`;
                    });
                    return html;
                  })(),
                }}
              />
            ) : (
              <div className="prose-article max-w-none text-[15px] leading-relaxed text-slate-300">
                {String(article.content ?? "")
                  .split(/\r?\n+/)
                  .map((para, idx) => {
                    const trimmed = para.trim();
                    if (!trimmed) return null;
                    return (
                      <p key={idx} className="mb-4">
                        {trimmed}
                      </p>
                    );
                  })}
              </div>
            )}

            {/* Images Section */}
            {images && images.length > 0 && (
              <div className="mt-10 border-t border-slate-700/50 pt-8">
                <h2 className="mb-4 text-lg font-semibold text-slate-100">
                  Images
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="overflow-hidden rounded-lg border border-slate-700/50"
                    >
                      <img
                        src={getImageUrl(img.storage_path)}
                        alt={img.caption ?? "Article image"}
                        className="aspect-video w-full object-cover"
                      />
                      {img.caption && (
                        <p className="bg-slate-800/50 px-3 py-2 text-sm text-slate-400">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Engagement Footer */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-700/50 pt-6">
              <div className="flex items-center gap-6">
                <LikeButton
                  articleId={article.id}
                  articleSlug={slug}
                  initialLiked={initialLiked}
                  initialCount={likesCount}
                  isAuthenticated={!!user}
                />
                <SaveButton
                  articleId={article.id}
                  articleSlug={slug}
                  initialSaved={initialSaved}
                  isAuthenticated={!!user}
                />
              </div>
              <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-400">
                <Share2 className="h-5 w-5" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>

            {/* Login prompt for guests */}
            {!user && (
              <p className="mt-4 text-center text-sm text-slate-500">
                <Link
                  href="/auth/login"
                  className="text-[#0A84FF] hover:underline"
                >
                  Sign in
                </Link>{" "}
                to like and save articles
              </p>
            )}
          </div>
        </article>

        <aside className="space-y-4 lg:pt-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
            More from the community
          </h2>
          {moreArticles.length === 0 ? (
            <p className="text-sm text-slate-500">
              No more articles yet. Check back soon.
            </p>
          ) : (
            <div className="space-y-3">
              {moreArticles.map((a) => {
                const relatedCategories = (a.categories as string[]) ?? [];
                return (
                  <Link
                    key={a.id}
                    href={`/articles/${a.slug}`}
                    className="group flex gap-3 rounded-lg border border-slate-700/50 bg-[#111322] p-3 transition-colors hover:border-indigo-500/40"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-slate-800">
                      {a.cover_image ? (
                        <img
                          src={a.cover_image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-[11px] text-slate-400">
                          Article
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[13px] font-medium text-slate-100 group-hover:text-indigo-300">
                        {a.title}
                      </p>
                      {a.excerpt && (
                        <p className="mt-1 line-clamp-2 text-[12px] text-slate-500">
                          {a.excerpt}
                        </p>
                      )}
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span>{timeAgo(a.created_at)}</span>
                        {a.read_time_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {a.read_time_minutes} min read
                          </span>
                        )}
                        {relatedCategories[0] && (
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                            {relatedCategories[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
