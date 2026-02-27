import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Clock, ThumbsUp, Bookmark, Share2 } from "lucide-react";

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

  const { data: images } = await supabase
    .from("article_images")
    .select("id, storage_path, caption, sort_order")
    .eq("article_id", article.id)
    .order("sort_order");

  let authorName: string | null = null;
  if (article.author_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", article.author_id)
      .single();
    authorName = profile?.full_name ?? null;
  }

  const categories = (article.categories as string[]) ?? [];
  const likesCount = article.likes_count ?? 0;

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/articles"
        className="mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Articles
      </Link>

      <article className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#16162a]">
        {/* Cover Image */}
        <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
          {article.cover_image ? (
            <img
              src={article.cover_image}
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
          <div
            className="prose-article [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-100 [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-100 [&_p]:mb-4 [&_p]:text-slate-300 [&_p]:leading-relaxed [&_a]:text-indigo-400 [&_a]:hover:underline [&_strong]:text-slate-100 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-slate-300 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-slate-300 [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

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
          <div className="mt-10 flex items-center justify-between border-t border-slate-700/50 pt-6">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-400">
                <ThumbsUp className="h-5 w-5" />
                <span>{likesCount}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-400">
                <Bookmark className="h-5 w-5" />
                <span>Save</span>
              </button>
            </div>
            <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-400">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
