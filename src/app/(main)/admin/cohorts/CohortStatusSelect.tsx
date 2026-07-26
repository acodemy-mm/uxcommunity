"use client";

import { useTransition } from "react";
import { setCohortStatus } from "./actions";

export function CohortStatusSelect({
  cohortId,
  status,
}: {
  cohortId: string;
  status: "open" | "closed";
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as "open" | "closed";
    if (next === status) return;
    startTransition(async () => {
      const result = await setCohortStatus(cohortId, next);
      if (!result.success) alert(result.error);
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
    >
      <option value="open">Active</option>
      <option value="closed">Inactive</option>
    </select>
  );
}
