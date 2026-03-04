"use client";

import { useState } from "react";
import { grantCourseAccess } from "@/app/admin/videos/actions";

type Course = { id: string; title: string };

export function UserCourseAccessForm({
  userId,
  availableCourses,
}: {
  userId: string;
  availableCourses: Course[];
}) {
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      await grantCourseAccess(courseId, userId);
      setCourseId("");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to grant access");
    } finally {
      setLoading(false);
    }
  }

  if (availableCourses.length === 0) {
    return (
      <p className="text-slate-500 text-sm">
        User already has access to all courses.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap gap-3">
      <div className="flex-1 min-w-0 sm:min-w-[200px]">
        <label htmlFor="course" className="block text-xs text-slate-500 mb-1">
          Course
        </label>
        <select
          id="course"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 text-sm"
        >
          <option value="">Select course</option>
          {availableCourses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={!courseId || loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Adding…" : "Grant access"}
        </button>
      </div>
      {error && <p className="w-full text-sm text-red-400">{error}</p>}
    </form>
  );
}
