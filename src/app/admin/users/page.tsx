import Link from "next/link";
import { createClient, getCachedUser } from "@/lib/supabase/server";
import { UpdateRoleForm } from "./UpdateRoleForm";
import { RemoveUserButton } from "./RemoveUserButton";
import { Users as UsersIcon, BookOpen } from "lucide-react";

export default async function AdminUsersPage() {
  const [supabase, currentUser] = await Promise.all([
    createClient(),
    getCachedUser(),
  ]);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false });
  const currentUserId = currentUser?.id ?? null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <UsersIcon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
        <h2 className="text-lg sm:text-xl font-semibold text-slate-100">User management</h2>
      </div>
      <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
        View users, change roles, and manage course access.
      </p>

      {/* Desktop table */}
      <div className="hidden md:block bg-slate-800 rounded-xl border border-slate-700 overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-300 text-sm">Email</th>
              <th className="text-left px-4 py-3 font-medium text-slate-300 text-sm">Name</th>
              <th className="text-left px-4 py-3 font-medium text-slate-300 text-sm">Role</th>
              <th className="text-left px-4 py-3 font-medium text-slate-300 text-sm">Joined</th>
              <th className="text-left px-4 py-3 font-medium text-slate-300 text-sm">Access</th>
              <th className="text-right px-4 py-3 font-medium text-slate-300 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((profile) => (
              <tr key={profile.id} className="border-b border-slate-700 last:border-0">
                <td className="px-4 py-3 text-slate-100 text-sm">{profile.email ?? "—"}</td>
                <td className="px-4 py-3 text-slate-300 text-sm">{profile.full_name ?? "—"}</td>
                <td className="px-4 py-3">
                  <UpdateRoleForm profileId={profile.id} currentRole={profile.role ?? "user"} />
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm">
                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${profile.id}/access`}
                    className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    <BookOpen className="h-4 w-4" />
                    Courses
                  </Link>
                </td>
                <td className="px-4 py-3 text-right">
                  <RemoveUserButton
                    userId={profile.id}
                    userEmail={profile.email}
                    isCurrentUser={profile.id === currentUserId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {profiles?.map((profile) => (
          <div
            key={profile.id}
            className="rounded-xl border border-slate-700 bg-slate-800 p-4"
          >
            <p className="font-medium text-slate-100 truncate">{profile.email ?? "—"}</p>
            <p className="text-sm text-slate-400 truncate">{profile.full_name ?? "—"}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <UpdateRoleForm profileId={profile.id} currentRole={profile.role ?? "user"} />
              <span className="text-slate-500 text-sm">
                {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-700 pt-3">
              <Link
                href={`/admin/users/${profile.id}/access`}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-700/50 px-3 py-1.5 text-sm text-indigo-300 hover:bg-slate-700"
              >
                <BookOpen className="h-4 w-4" />
                Course access
              </Link>
              <RemoveUserButton
                userId={profile.id}
                userEmail={profile.email}
                isCurrentUser={profile.id === currentUserId}
              />
            </div>
          </div>
        ))}
      </div>

      {(!profiles || profiles.length === 0) && (
        <p className="p-8 text-center text-slate-500 text-sm sm:text-base">No users yet.</p>
      )}
    </div>
  );
}
