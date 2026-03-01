"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { removeUser, type UserActionResult } from "./actions";

export function RemoveUserButton({
  userId,
  userEmail,
  isCurrentUser,
}: {
  userId: string;
  userEmail: string | null;
  isCurrentUser: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (isCurrentUser) return;
    const email = userEmail ?? "this user";
    if (!confirm(`Remove ${email}? They will no longer be able to sign in. This cannot be undone.`))
      return;
    startTransition(async () => {
      const result: UserActionResult = await removeUser(userId);
      if (result.success) return;
      alert(result.error);
    });
  }

  if (isCurrentUser) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
      title="Remove user"
    >
      <Trash2 className="h-4 w-4" />
      Remove
    </button>
  );
}
