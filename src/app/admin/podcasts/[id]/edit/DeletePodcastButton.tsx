"use client";

import { useRouter } from "next/navigation";
import { deletePodcast } from "../../actions";

export function DeletePodcastButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this podcast?")) return;
    await deletePodcast(id);
    router.push("/admin/podcasts");
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
