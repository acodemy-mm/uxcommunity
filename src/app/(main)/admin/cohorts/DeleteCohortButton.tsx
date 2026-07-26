"use client";

import { useState } from "react";
import { deleteCohort } from "./actions";

export function DeleteCohortButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this cohort batch? This cannot be undone.")) return;
    setLoading(true);
    const result = await deleteCohort(id);
    if (!result.success) {
      alert(result.error);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:underline font-medium disabled:opacity-50"
    >
      {loading ? "…" : "Delete"}
    </button>
  );
}
