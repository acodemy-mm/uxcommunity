import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "../../ArticleForm";
import { DeleteArticleButton } from "./DeleteArticleButton";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) notFound();

  return (
    <div>
      <Link
        href="/admin/articles"
        className="text-indigo-400 hover:underline mb-6 inline-block"
      >
        ← Back to articles
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-100">Edit Article</h2>
        <DeleteArticleButton id={id} />
      </div>

      <ArticleForm
        mode="edit"
        articleId={id}
        defaultValues={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || "",
          content: article.content,
          cover_image: article.cover_image || "",
          categories: Array.isArray(article.categories)
            ? article.categories.join(", ")
            : "",
          tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
          read_time_minutes: article.read_time_minutes || "",
          published: article.published,
          featured: article.featured,
        }}
      />
    </div>
  );
}
