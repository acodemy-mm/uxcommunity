import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GrantAccessForm } from "./GrantAccessForm";
import { RevokeAccessButton } from "./RevokeAccessButton";

export default async function CourseAccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [courseRes, accessRes] = await Promise.all([
    supabase.from("video_courses").select("id, title").eq("id", id).single(),
    supabase.from("user_course_access").select("user_id").eq("course_id", id),
  ]);

  const { data: course, error } = courseRes;
  if (error || !course) notFound();

  const accessRows = accessRes.data ?? [];
  const userIds = accessRows.map((r) => r.user_id);

  const [profilesRes, allProfilesRes] = await Promise.all([
    userIds.length > 0 ? supabase.from("profiles").select("id, email, full_name").in("id", userIds) : Promise.resolve({ data: [] }),
    supabase.from("profiles").select("id, email, full_name").order("email"),
  ]);
  const profiles = profilesRes.data ?? [];
  const allProfiles = allProfilesRes.data ?? [];
  const profilesMap = new Map(profiles.map((p) => [p.id, p]));
  const alreadyHaveAccess = new Set(userIds);
  const availableProfiles = allProfiles.filter((p) => !alreadyHaveAccess.has(p.id));

  return (
    <div>
      <Link
        href="/admin/videos"
        className="text-indigo-400 hover:underline mb-6 inline-block"
      >
        ← Back to courses
      </Link>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-100">Course access</h2>
        <p className="text-slate-400 mt-1">{course.title}</p>
        <p className="text-sm text-slate-500 mt-1">
          Users listed below can view this course. If no one is listed, everyone can view. Add at least one user to restrict access to only those users.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Grant access</h3>
          <GrantAccessForm
            courseId={id}
            availableProfiles={availableProfiles}
          />
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Users with access</h3>
          {userIds.length === 0 ? (
            <p className="text-slate-500 text-sm">No users assigned. Everyone can view this course.</p>
          ) : (
            <ul className="space-y-2">
              {userIds.map((uid) => {
                const p = profilesMap.get(uid);
                return (
                  <li
                    key={uid}
                    className="flex items-center justify-between rounded-lg bg-slate-900/50 px-3 py-2"
                  >
                    <span className="text-slate-200">
                      {p?.full_name || p?.email || uid}
                      {p?.email && p?.full_name && (
                        <span className="text-slate-500 text-sm ml-2">{p.email}</span>
                      )}
                    </span>
                    <RevokeAccessButton courseId={id} userId={uid} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
