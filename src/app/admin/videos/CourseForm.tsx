"use client";

import { useState } from "react";
import Link from "next/link";
import { createVideo, updateVideo } from "./actions";
import { Plus, Trash2 } from "lucide-react";

type LessonRow = { label: string; url: string; duration: string };

const defaultLesson = (): LessonRow => ({
  label: "",
  url: "",
  duration: "",
});

interface CourseFormProps {
  mode: "create" | "edit";
  courseId?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultCoverImageUrl?: string | null;
  defaultOrderIndex?: number;
  defaultDifficulty?: string;
  defaultRating?: string;
  defaultLessons?: { title: string; youtube_url: string; duration_minutes: number | null }[];
}

export function CourseForm({
  mode,
  courseId,
  defaultTitle = "",
  defaultDescription = "",
  defaultCoverImageUrl = null,
  defaultOrderIndex = 0,
  defaultDifficulty = "",
  defaultRating = "",
  defaultLessons = [],
}: CourseFormProps) {
  const [lessons, setLessons] = useState<LessonRow[]>(
    defaultLessons.length > 0
      ? defaultLessons.map((l) => ({
          label: l.title,
          url: l.youtube_url,
          duration: l.duration_minutes != null ? String(l.duration_minutes) : "",
        }))
      : [defaultLesson()]
  );
  const [error, setError] = useState<string | null>(null);

  const addVideo = () => setLessons((prev) => [...prev, defaultLesson()]);

  const removeVideo = (index: number) => {
    if (lessons.length <= 1) return;
    setLessons((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLesson = (index: number, field: keyof LessonRow, value: string) => {
    setLessons((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Clear and re-add lesson fields so order is correct
    formData.delete("lesson_titles");
    formData.delete("lesson_urls");
    formData.delete("lesson_durations");
    lessons.forEach((l) => {
      formData.append("lesson_titles", l.label);
      formData.append("lesson_urls", l.url);
      formData.append("lesson_durations", l.duration);
    });

    try {
      if (mode === "create") {
        await createVideo(formData);
        window.location.href = "/admin/videos";
      } else if (courseId) {
        await updateVideo(courseId, formData);
        window.location.href = "/admin/videos";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
          Course title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultTitle}
          className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultDescription}
          className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Cover image upload */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-2">Cover image</h3>
        <p className="mb-3 text-xs text-slate-500">
          Optional. PNG, JPEG, GIF or WebP. Max 5MB.
        </p>
        {defaultCoverImageUrl && (
          <div className="mb-3 flex items-start gap-4">
            <img
              src={defaultCoverImageUrl}
              alt="Current cover"
              className="h-24 w-40 rounded-lg border border-slate-600 object-cover"
            />
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input type="checkbox" name="remove_cover" className="rounded border-slate-600" />
              Remove cover image
            </label>
          </div>
        )}
        <input
          id="cover_image"
          name="cover_image"
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm text-slate-300 file:mr-4 file:rounded file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white"
        />
      </div>

      {/* Video setup: multiple Video Link Label + Video Link */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-300">Videos (lessons)</h3>
          <button
            type="button"
            onClick={addVideo}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Add another video
          </button>
        </div>
        <p className="mb-4 text-xs text-slate-500">
          Add at least one video. Each row is one lesson in the course.
        </p>
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border border-slate-600 bg-slate-900/50 p-4 sm:flex-row sm:items-start sm:gap-4"
            >
              <div className="flex-1 space-y-3 sm:flex sm:flex-1 sm:gap-3 sm:space-y-0">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Video link label
                  </label>
                  <input
                    type="text"
                    value={lesson.label}
                    onChange={(e) => updateLesson(index, "label", e.target.value)}
                    placeholder="e.g. What is UX Design?"
                    className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Video link
                  </label>
                  <input
                    type="url"
                    value={lesson.url}
                    onChange={(e) => updateLesson(index, "url", e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="w-24">
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Min
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={lesson.duration}
                    onChange={(e) => updateLesson(index, "duration", e.target.value)}
                    placeholder="—"
                    className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeVideo(index)}
                disabled={lessons.length <= 1}
                className="mt-1 flex items-center gap-1 text-slate-400 hover:text-red-400 disabled:opacity-40 disabled:hover:text-slate-400 sm:mt-0"
                title={lessons.length <= 1 ? "Keep at least one video" : "Remove video"}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="order_index" className="block text-sm font-medium text-slate-300 mb-2">
            Order (display order)
          </label>
          <input
            id="order_index"
            name="order_index"
            type="number"
            min="0"
            defaultValue={defaultOrderIndex}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="difficulty_level" className="block text-sm font-medium text-slate-300 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty_level"
            name="difficulty_level"
            defaultValue={defaultDifficulty}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-slate-300 mb-2">
            Rating (e.g. 4.5)
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            placeholder="4.5"
            defaultValue={defaultRating}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
        >
          {mode === "create" ? "Create course" : "Update course"}
        </button>
        <Link
          href="/admin/videos"
          className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-800 font-medium"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
