"use client";

import { useState } from "react";
import { revokeCourseAccess } from "../../actions";

export function RevokeAccessButton({ courseId, userId }: { courseId: string; userId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleRevoke() {
    if (!confirm("Remove access for this user?")) return;
    setLoading(true);
    try {
      await revokeCourseAccess(courseId, userId);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleRevoke}
      disabled={loading}
      className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      {loading ? "Removing…" : "Remove"}
    </button>
  );
}
