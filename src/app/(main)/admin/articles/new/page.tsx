import Link from "next/link";
import { ArticleForm } from "../ArticleForm";

export default function NewArticlePage() {
  return (
    <div>
      <Link
        href="/admin/articles"
        className="text-indigo-400 hover:underline mb-6 inline-block"
      >
        ← Back to articles
      </Link>

      <h2 className="text-xl font-semibold text-slate-100 mb-6">
        New Article
      </h2>

      <ArticleForm mode="create" />
    </div>
  );
}
