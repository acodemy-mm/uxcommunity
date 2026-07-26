"use client";

import { useState } from "react";
import {
  deleteEnrollment,
  updateEnrollmentStatus,
} from "./actions";
import type { EnrollmentStatus } from "@/types/database";

export function EnrollmentActions({
  id,
  status,
}: {
  id: string;
  status: EnrollmentStatus;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(next: EnrollmentStatus) {
    setLoading(next);
    setError(null);
    const result = await updateEnrollmentStatus(id, next);
    if (!result.success) setError(result.error);
    setLoading(null);
  }

  async function handleDelete() {
    if (!confirm("Delete this enrollment application?")) return;
    setLoading("delete");
    setError(null);
    const result = await deleteEnrollment(id);
    if (!result.success) setError(result.error);
    setLoading(null);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-2">
        {status !== "approved" && (
          <button
            type="button"
            disabled={!!loading}
            onClick={() => setStatus("approved")}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 disabled:opacity-50"
          >
            {loading === "approved" ? "…" : "Approve"}
          </button>
        )}
        {status !== "rejected" && (
          <button
            type="button"
            disabled={!!loading}
            onClick={() => setStatus("rejected")}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 disabled:opacity-50"
          >
            {loading === "rejected" ? "…" : "Reject"}
          </button>
        )}
        {status !== "pending" && (
          <button
            type="button"
            disabled={!!loading}
            onClick={() => setStatus("pending")}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-600/40 text-slate-300 hover:bg-slate-600/60 disabled:opacity-50"
          >
            {loading === "pending" ? "…" : "Reset"}
          </button>
        )}
        <button
          type="button"
          disabled={!!loading}
          onClick={handleDelete}
          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 disabled:opacity-50"
        >
          {loading === "delete" ? "…" : "Delete"}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
