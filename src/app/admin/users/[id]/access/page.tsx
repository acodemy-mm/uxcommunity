import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UserCourseAccessForm } from "./UserCourseAccessForm";
import { RevokeAccessButton } from "./RevokeAccessButton";
import { BookOpen, ArrowLeft } from "lucide-react";

export default async function UserAccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = await params;
  const supabase = await createClient();

  const [profileRes, accessRes, coursesRes] = await Promise.all([
    supabase.from("profiles").select("id, email, full_name").eq("id", userId).single(),
    supabase.from("user_course_access").select("course_id").eq("user_id", userId),
    supabase.from("video_courses").select("id, title").order("order_index"),
  ]);

  const { data: profile, error: profileError } = profileRes;
  if (profileError || !profile) notFound();

  const courseIds = (accessRes.data ?? []).map((r) => r.course_id);
  const allCourses = coursesRes.data ?? [];
  const coursesWithAccess = allCourses.filter((c) => courseIds.includes(c.id));
  const availableCourses = allCourses.filter((c) => !courseIds.includes(c.id));

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm sm:text-base"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to users
      </Link>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-100 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-400" />
          Course access
        </h2>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">
          {profile.full_name || profile.email || profile.id}
          {profile.email && profile.full_name && (
            <span className="text-slate-500 ml-2">{profile.email}</span>
          )}
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Grant access to a course</h3>
          <UserCourseAccessForm
            userId={userId}
            availableCourses={availableCourses}
          />
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Courses with access</h3>
          {coursesWithAccess.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No courses granted yet. All courses are private — grant access above so this user can view them.
            </p>
          ) : (
            <ul className="space-y-2">
              {coursesWithAccess.map((course) => (
                <li
                  key={course.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg bg-slate-900/50 px-3 py-2"
                >
                  <span className="text-slate-200 text-sm sm:text-base truncate">{course.title}</span>
                  <RevokeAccessButton courseId={course.id} userId={userId} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
