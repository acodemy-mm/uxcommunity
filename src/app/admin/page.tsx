import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [articlesRes, videosRes, podcastsRes, jobsRes, challengesRes] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("video_courses").select("*", { count: "exact", head: true }),
    supabase.from("podcasts").select("*", { count: "exact", head: true }),
    supabase.from("job_posts").select("*", { count: "exact", head: true }),
    supabase.from("challenges").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Articles", count: articlesRes.count ?? 0, href: "/admin/articles" },
    { label: "Videos", count: videosRes.count ?? 0, href: "/admin/videos" },
    { label: "Podcasts", count: podcastsRes.count ?? 0, href: "/admin/podcasts" },
    { label: "Jobs", count: jobsRes.count ?? 0, href: "/admin/jobs" },
    { label: "Challenges", count: challengesRes.count ?? 0, href: "/admin/challenges" },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-indigo-500 transition-all"
        >
          <p className="text-3xl font-bold text-slate-100">{stat.count}</p>
          <p className="text-slate-400 mt-1">{stat.label}</p>
        </Link>
      ))}
    </div>
  );
}
