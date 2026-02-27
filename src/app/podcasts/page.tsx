import { createClient } from "@/lib/supabase/server";

export default async function PodcastsPage() {
  const supabase = await createClient();
  const { data: podcasts } = await supabase
    .from("podcasts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Podcasts</h1>

      <div className="space-y-6">
        {podcasts?.length ? (
          podcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="flex gap-6 p-6 bg-[#16162a] rounded-xl border border-slate-700/50"
            >
              {podcast.cover_image && (
                <img
                  src={podcast.cover_image}
                  alt=""
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-slate-100">{podcast.title}</h2>
                {podcast.description && (
                  <p className="text-slate-400 mt-1">{podcast.description}</p>
                )}
                {podcast.duration_minutes && (
                  <span className="text-sm text-slate-500 mt-2 block">
                    {podcast.duration_minutes} min
                  </span>
                )}
                <a
                  href={podcast.episode_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
                >
                  Listen
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-[#16162a] rounded-xl border border-slate-700/50">
            <p className="text-slate-500">No podcasts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
