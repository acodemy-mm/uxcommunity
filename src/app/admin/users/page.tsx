import { createClient, getCachedUser } from "@/lib/supabase/server";
import { UpdateRoleForm } from "./UpdateRoleForm";
import { RemoveUserButton } from "./RemoveUserButton";
import { Users as UsersIcon } from "lucide-react";

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
      <div className="flex items-center gap-2 mb-6">
        <UsersIcon className="h-6 w-6 text-indigo-400" />
        <h2 className="text-xl font-semibold text-slate-100">User management</h2>
      </div>
      <p className="text-slate-400 mb-6">
        View registered users and change roles. Only admins can access this page.
      </p>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Role
              </th>
              <th className="text-left px-4 py-3 font-medium text-slate-300">
                Joined
              </th>
              <th className="text-right px-4 py-3 font-medium text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((profile) => (
              <tr
                key={profile.id}
                className="border-b border-slate-700 last:border-0"
              >
                <td className="px-4 py-3 text-slate-100">
                  {profile.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {profile.full_name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <UpdateRoleForm
                    profileId={profile.id}
                    currentRole={profile.role ?? "user"}
                  />
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm">
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "—"}
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
        {(!profiles || profiles.length === 0) && (
          <p className="p-8 text-center text-slate-500">No users yet.</p>
        )}
      </div>
    </div>
  );
}
