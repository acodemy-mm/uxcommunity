import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const [articlesRes, videosRes, jobsRes, challengesRes] = await Promise.all([
    supabase.from("articles").select("id, title, slug, excerpt, created_at").eq("published", true).order("created_at", { ascending: false }).limit(3),
    supabase.from("video_courses").select("id, title, youtube_url, thumbnail").order("order_index").limit(3),
    supabase.from("job_posts").select("id, title, company, location").order("created_at", { ascending: false }).limit(3),
    supabase.from("challenges").select("id, title, start_date, end_date").order("end_date", { ascending: false }).limit(3),
  ]);

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
          UX Community
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Your hub for UX articles, video courses, podcasts, job opportunities, and design challenges.
        </p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Link
          href="/articles"
          className="p-6 rounded-xl border border-slate-700/50 bg-[#16162a] hover:border-indigo-500/30 transition-all"
        >
          <div className="text-3xl mb-2">📝</div>
          <h2 className="font-semibold text-slate-100">Articles</h2>
          <p className="text-sm text-slate-400 mt-1">UX insights & best practices</p>
        </Link>
        <Link
          href="/videos"
          className="p-6 rounded-xl border border-slate-700/50 bg-[#16162a] hover:border-indigo-500/30 transition-all"
        >
          <div className="text-3xl mb-2">🎬</div>
          <h2 className="font-semibold text-slate-100">Video Courses</h2>
          <p className="text-sm text-slate-400 mt-1">Learn from YouTube</p>
        </Link>
        <Link
          href="/podcasts"
          className="p-6 rounded-xl border border-slate-700/50 bg-[#16162a] hover:border-indigo-500/30 transition-all"
        >
          <div className="text-3xl mb-2">🎧</div>
          <h2 className="font-semibold text-slate-100">Podcasts</h2>
          <p className="text-sm text-slate-400 mt-1">Listen & learn</p>
        </Link>
        <Link
          href="/jobs"
          className="p-6 rounded-xl border border-slate-700/50 bg-[#16162a] hover:border-indigo-500/30 transition-all"
        >
          <div className="text-3xl mb-2">💼</div>
          <h2 className="font-semibold text-slate-100">Job Posts</h2>
          <p className="text-sm text-slate-400 mt-1">Find your next role</p>
        </Link>
      </div>

      <section className="mt-16 grid lg:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-100">Latest Articles</h2>
            <Link href="/articles" className="text-indigo-400 hover:text-indigo-300 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {articlesRes.data?.length ? (
              articlesRes.data.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="block p-4 rounded-lg border border-slate-700/50 bg-[#16162a] hover:border-indigo-500/30 transition-colors"
                >
                  <h3 className="font-medium text-slate-100">{article.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{article.excerpt}</p>
                  <span className="text-xs text-slate-500 mt-2 block">
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-slate-500 py-8">No articles yet. Check back soon!</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-100">Video Courses</h2>
            <Link href="/videos" className="text-indigo-400 hover:text-indigo-300 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {videosRes.data?.length ? (
              videosRes.data.map((video) => (
                <Link
                  key={video.id}
                  href={`/videos/${video.id}`}
                  className="block p-4 rounded-lg border border-slate-700/50 bg-[#16162a] hover:border-indigo-500/30 transition-colors"
                >
                  <h3 className="font-medium text-slate-100">{video.title}</h3>
                  <span className="text-xs text-slate-500 mt-2 block">Video course</span>
                </Link>
              ))
            ) : (
              <p className="text-slate-500 py-8">No videos yet. Check back soon!</p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-100">Design Challenges</h2>
          <Link href="/challenges" className="text-indigo-400 hover:text-indigo-300 font-medium">
            View all
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {challengesRes.data?.length ? (
            challengesRes.data.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/challenges/${challenge.id}`}
                className="block p-4 rounded-lg border border-slate-700/50 bg-[#16162a] hover:border-indigo-500/30 transition-colors"
              >
                <h3 className="font-medium text-slate-100">{challenge.title}</h3>
                <span className="text-xs text-slate-500 mt-2 block">
                  {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}
                </span>
              </Link>
            ))
          ) : (
            <p className="text-slate-500 col-span-3 py-8">No challenges yet. Check back soon!</p>
          )}
        </div>
      </section>
    </div>
  );
}
