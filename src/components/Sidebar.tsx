import Link from "next/link";
import { User } from "lucide-react";
import { getCachedUser, getCachedProfile } from "@/lib/supabase/server";
import { SidebarNav } from "./SidebarNav";

export default async function Sidebar() {
  const user = await getCachedUser();
  const profile = await getCachedProfile(user?.id);
  const isAdmin = profile?.role === "admin";

  return (
    <aside className="h-screen w-64 border-r border-slate-800 bg-[#12122a]">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto py-6">
          <SidebarNav />
        </div>

        <div className="border-t border-slate-800 p-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                {user.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-slate-200">
                  {user.email}
                </p>
                <div className="flex gap-2 mt-1">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Admin
                    </Link>
                  )}
                  <form action="/auth/signout" method="POST" className="inline">
                    <button
                      type="submit"
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/auth/login"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50"
              >
                <User className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
