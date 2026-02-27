import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updatePodcast } from "../../actions";
import { DeletePodcastButton } from "./DeletePodcastButton";

export default async function EditPodcastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: podcast, error } = await supabase
    .from("podcasts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !podcast) notFound();

  return (
    <div>
      <Link href="/admin/podcasts" className="text-indigo-400 hover:underline mb-6 inline-block">
        ← Back to podcasts
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-100">Edit Podcast</h2>
        <DeletePodcastButton id={id} />
      </div>

      <form action={updatePodcast.bind(null, id)} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={podcast.title}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="episode_url" className="block text-sm font-medium text-slate-300 mb-2">
            Episode URL
          </label>
          <input
            id="episode_url"
            name="episode_url"
            type="url"
            defaultValue={podcast.episode_url}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={podcast.description || ""}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="cover_image" className="block text-sm font-medium text-slate-300 mb-2">
            Cover Image URL
          </label>
          <input
            id="cover_image"
            name="cover_image"
            type="url"
            defaultValue={podcast.cover_image || ""}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="duration_minutes" className="block text-sm font-medium text-slate-300 mb-2">
            Duration (minutes)
          </label>
          <input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            min="0"
            defaultValue={podcast.duration_minutes || ""}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
          >
            Update Podcast
          </button>
          <Link
            href="/admin/podcasts"
            className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-800 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
