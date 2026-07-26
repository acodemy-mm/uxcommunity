"use client";

import { useRouter } from "next/navigation";
import { deleteChallenge } from "../../actions";

export function DeleteChallengeButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this challenge?")) return;
    await deleteChallenge(id);
    router.push("/admin/challenges");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
    >
      Delete
    </button>
  );
}
