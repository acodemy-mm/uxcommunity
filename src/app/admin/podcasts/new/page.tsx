import Link from "next/link";
import { createPodcast } from "../actions";

export default function NewPodcastPage() {
  return (
    <div>
      <Link href="/admin/podcasts" className="text-indigo-400 hover:underline mb-6 inline-block">
        ← Back to podcasts
      </Link>

      <h2 className="text-xl font-semibold text-slate-100 mb-6">New Podcast</h2>

      <form action={createPodcast} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="episode_url" className="block text-sm font-medium text-slate-300 mb-2">
            Episode URL (Spotify, Apple, etc.)
          </label>
          <input
            id="episode_url"
            name="episode_url"
            type="url"
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
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
          >
            Create Podcast
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
