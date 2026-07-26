import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPodcastsPage() {
  const supabase = await createClient();
  const { data: podcasts } = await supabase
    .from("podcasts")
    .select("id, title, episode_url, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-100">Podcasts</h2>
        <Link
          href="/admin/podcasts/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
        >
          New Podcast
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-300">Title</th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">Episode URL</th>
              <th className="text-right px-4 py-3 font-medium text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {podcasts?.map((podcast) => (
              <tr key={podcast.id} className="border-b border-slate-700">
                <td className="px-4 py-3 text-slate-100">{podcast.title}</td>
                <td className="px-4 py-3 text-slate-400 text-sm truncate max-w-xs">{podcast.episode_url}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/podcasts/${podcast.id}/edit`}
                    className="text-indigo-400 hover:underline font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!podcasts || podcasts.length === 0) && (
          <p className="p-8 text-center text-slate-500">No podcasts yet.</p>
        )}
      </div>
    </div>
  );
}
