"use client";

import { useTransition } from "react";
import { updateUserRole, type UserActionResult } from "./actions";

type Role = "user" | "admin";

export function UpdateRoleForm({
  profileId,
  currentRole,
}: {
  profileId: string;
  currentRole: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const role = e.target.value as Role;
    if (role !== "user" && role !== "admin") return;
    if (role === currentRole) return;
    startTransition(async () => {
      const result: UserActionResult = await updateUserRole(profileId, role);
      if (result.success) {
        // Optionally show toast; revalidate will refresh the list
      } else {
        alert(result.error);
      }
    });
  }

  return (
    <select
      value={currentRole}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  );
}
