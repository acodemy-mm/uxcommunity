"use client";

import { useState } from "react";
import { grantCourseAccess } from "../../actions";

type Profile = { id: string; email: string | null; full_name: string | null };

export function GrantAccessForm({
  courseId,
  availableProfiles,
}: {
  courseId: string;
  availableProfiles: Profile[];
}) {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      await grantCourseAccess(courseId, userId);
      setUserId("");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to grant access");
    } finally {
      setLoading(false);
    }
  }

  if (availableProfiles.length === 0) {
    return (
      <p className="text-slate-500 text-sm">All users already have access to this course.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-3">
      <div className="min-w-0 flex-1 sm:min-w-[220px]">
        <label htmlFor="access-user" className="block text-xs text-slate-500 mb-1">
          Select user
        </label>
        <select
          id="access-user"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 text-sm"
        >
          <option value="">Select a user</option>
          {availableProfiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.full_name || p.email || p.id}
              {p.email && p.full_name ? ` (${p.email})` : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={!userId || loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Granting…" : "Grant access"}
        </button>
      </div>
      {error && (
        <p className="w-full text-sm text-red-400">{error}</p>
      )}
    </form>
  );
}
