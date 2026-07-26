/** Resolve article cover/storage paths to a public URL. */
export function getArticleImageUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return pathOrUrl;

  const path = pathOrUrl.replace(/^\//, "");
  return `${supabaseUrl}/storage/v1/object/public/article-images/${path}`;
}
