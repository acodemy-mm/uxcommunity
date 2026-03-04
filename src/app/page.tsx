import { createClient, getCachedUser, getCachedProfile } from "@/lib/supabase/server";
import { BentoGrid, type ContentItem } from "@/components/BentoGrid";

export default async function HomePage() {
  const supabase = await createClient();
  const user = await getCachedUser();
  const profile = await getCachedProfile(user?.id);
  const isAdmin = profile?.role === "admin";

  const [articlesRes, videosRes, challengesRes, jobsRes] = await Promise.all([
    supabase.from("articles").select("id, title, slug, excerpt, created_at")
      .eq("published", true).order("created_at", { ascending: false }).limit(6),
    supabase.from("video_courses").select("id, title, description, thumbnail, duration_minutes, difficulty_level")
      .order("order_index").limit(6),
    supabase.from("challenges").select("id, title, start_date, end_date")
      .order("end_date", { ascending: false }).limit(4),
    supabase.from("job_posts").select("id, title, company, location, created_at")
      .order("created_at", { ascending: false }).limit(4),
  ]);

  let myAccessSet = new Set<string>();
  if (user && !isAdmin) {
    const { data: access } = await supabase
      .from("user_course_access").select("course_id").eq("user_id", user.id);
    (access ?? []).forEach((a) => myAccessSet.add(a.course_id));
  }

  const items: ContentItem[] = [];

  for (const a of articlesRes.data ?? []) {
    items.push({
      id: `article-${a.id}`, type: "article",
      title: a.title, description: a.excerpt ?? undefined,
      href: `/articles/${a.slug}`,
      date: new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
  }

  for (const v of videosRes.data ?? []) {
    const canAccess = isAdmin || myAccessSet.has(v.id);
    const mins = (v as { duration_minutes?: number | null }).duration_minutes;
    items.push({
      id: `video-${v.id}`, type: "video",
      title: v.title, description: v.description ?? undefined,
      href: `/videos/${v.id}`,
      thumbnail: (v as { thumbnail?: string | null }).thumbnail,
      meta: !mins ? "Self-paced" : mins >= 60 ? `${Math.floor(mins/60)}h ${mins%60 ? `${mins%60}m` : ""}`.trim() : `${mins}m`,
      extra: (v as { difficulty_level?: string }).difficulty_level ?? undefined,
      locked: !canAccess,
    });
  }

  for (const c of challengesRes.data ?? []) {
    items.push({
      id: `challenge-${c.id}`, type: "challenge",
      title: c.title, href: `/challenges/${c.id}`,
      meta: `${new Date(c.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(c.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    });
  }

  for (const j of jobsRes.data ?? []) {
    items.push({
      id: `job-${j.id}`, type: "job",
      title: j.title,
      description: [(j as { company?: string }).company, (j as { location?: string }).location].filter(Boolean).join(" · "),
      href: `/jobs/${j.id}`,
      date: new Date((j as { created_at: string }).created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  }

  return (
    <div className="px-4 pb-10 pt-5 sm:px-5 lg:px-8">
      {/* iOS large title */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-1"
          style={{ color: "rgba(235,235,245,0.45)" }}>
          Discover
        </p>
        <h1 className="text-[34px] font-bold tracking-tight text-white leading-none">
          {user
            ? `Welcome back${(user.email?.split("@")[0] ?? "").replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) ? `, ${user.email!.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase())}` : ""}`
            : "UX Community"}
        </h1>
        <p className="mt-1 text-[15px]" style={{ color: "rgba(235,235,245,0.55)" }}>
          Articles, courses, challenges &amp; more
        </p>
      </div>

      <BentoGrid items={items} />
    </div>
  );
}
