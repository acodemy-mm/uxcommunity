"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createArticle, updateArticle, type ActionResult } from "./actions";

interface ArticleFormProps {
  mode: "create" | "edit";
  articleId?: string;
  defaultValues?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string;
    categories: string;
    tags: string;
    read_time_minutes: number | string;
    published: boolean;
    featured: boolean;
  };
}

export function ArticleForm({
  mode,
  articleId,
  defaultValues,
}: ArticleFormProps) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [imageCount, setImageCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res =
        mode === "create"
          ? await createArticle(formData)
          : await updateArticle(articleId!, formData);
      setResult(res);
      if (res.success && mode === "create") {
        form.reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        id="article-form"
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={defaultValues?.title}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Slug (URL-friendly)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={defaultValues?.slug}
            placeholder="my-article-title"
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={defaultValues?.excerpt}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Content (HTML)
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            required
            defaultValue={defaultValues?.content}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="cover_image"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Cover Image URL
          </label>
          <input
            id="cover_image"
            name="cover_image"
            type="url"
            defaultValue={defaultValues?.cover_image}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Article Images (upload multiple)
          </label>
          <div className="space-y-3">
            {Array.from({ length: imageCount }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <input
                  name="images"
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  className="flex-1 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm text-slate-300 file:mr-4 file:rounded file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white"
                />
                <input
                  name="image_captions"
                  type="text"
                  placeholder="Caption"
                  className="w-40 rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setImageCount((c) => c + 1)}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              + Add another image
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="categories"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Categories (comma-separated)
          </label>
          <input
            id="categories"
            name="categories"
            type="text"
            defaultValue={defaultValues?.categories}
            placeholder="UX Research, Career, Case Study"
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={defaultValues?.tags}
            placeholder="Research board, Wireframe, Prototype"
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="read_time_minutes"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Read time (minutes)
          </label>
          <input
            id="read_time_minutes"
            name="read_time_minutes"
            type="number"
            min="0"
            defaultValue={defaultValues?.read_time_minutes}
            placeholder="8"
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              id="published"
              name="published"
              type="checkbox"
              defaultChecked={defaultValues?.published}
              className="rounded border-slate-600"
            />
            <label
              htmlFor="published"
              className="text-sm font-medium text-slate-300"
            >
              Published
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              defaultChecked={defaultValues?.featured}
              className="rounded border-slate-600"
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium text-slate-300"
            >
              Featured
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Saving…"
              : mode === "create"
                ? "Create Article"
                : "Update Article"}
          </button>
          <Link
            href="/admin/articles"
            className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-800 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>

      {result && (
        <ResultDialog
          result={result}
          onClose={() => setResult(null)}
          mode={mode}
        />
      )}
    </>
  );
}

function ResultDialog({
  result,
  onClose,
  mode,
}: {
  result: ActionResult;
  onClose: () => void;
  mode: "create" | "edit";
}) {
  const slug = result.success && "slug" in result ? result.slug : null;
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className={`max-w-md rounded-xl border p-6 shadow-xl ${
          result.success
            ? "border-green-500/50 bg-slate-900"
            : "border-red-500/50 bg-slate-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {result.success ? (
          <>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <svg
                className="h-6 w-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Success!
            </h3>
            <p className="mb-4 text-slate-400">
              {mode === "create"
                ? "Article created successfully."
                : "Article updated successfully."}
            </p>
            {slug && mode === "create" && (
              <Link
                href={`/articles/${slug}`}
                className="mb-4 block text-indigo-400 hover:text-indigo-300"
              >
                View article →
              </Link>
            )}
          </>
        ) : (
          <>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Error</h3>
            <p className="mb-4 text-slate-400">{result.error}</p>
          </>
        )}
        <button
          onClick={onClose}
          className="w-full rounded-lg bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-600"
        >
          OK
        </button>
      </div>
    </div>
  );
}
