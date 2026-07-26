import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, published, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-100">Articles</h2>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
        >
          New Article
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-300">Title</th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">Status</th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">Date</th>
              <th className="text-right px-4 py-3 font-medium text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles?.map((article) => (
              <tr key={article.id} className="border-b border-slate-700">
                <td className="px-4 py-3 text-slate-100">{article.title}</td>
                <td className="px-4 py-3 text-slate-400 font-mono text-sm">{article.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      article.published ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {article.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm">
                  {new Date(article.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-indigo-400 hover:underline font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!articles || articles.length === 0) && (
          <p className="p-8 text-center text-slate-500">No articles yet.</p>
        )}
      </div>
    </div>
  );
}
