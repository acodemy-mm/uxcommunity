import Link from "next/link";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };
  const isAdmin = profile?.role === "admin";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#0f0f1e]/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white">
            UX
          </div>
          <span className="text-xl font-semibold text-white">UX Forum</span>
        </div>

        <div className="flex flex-1 max-w-xl items-center gap-4 px-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Search courses, posts, challenges..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Student Login
              </Link>
              <Link
                href="/auth/login?admin=1"
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50"
              >
                Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
