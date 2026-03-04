import Link from "next/link";
import { Search } from "lucide-react";
import { getCachedUser } from "@/lib/supabase/server";
import { SidebarToggle } from "@/components/SidebarToggle";

export default async function Header() {
  const user = await getCachedUser();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-[#0f0f1e]/95 backdrop-blur">
      <div className="flex h-14 sm:h-16 items-center justify-between gap-2 px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <SidebarToggle />
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center shrink-0 rounded-lg bg-indigo-600 text-sm sm:text-lg font-bold text-white">
            UX
          </div>
          <span className="text-base sm:text-xl font-semibold text-white truncate">UX Forum</span>
        </div>

        <div className="hidden sm:flex flex-1 max-w-xl items-center gap-4 px-2 lg:px-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 shrink-0" />
            <input
              type="search"
              placeholder="Search courses, posts..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {user ? (
            <Link
              href="/"
              className="rounded-lg px-2 sm:px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50"
            >
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Home</span>
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg bg-indigo-600 px-2 sm:px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Login
              </Link>
              <Link
                href="/auth/login?admin=1"
                className="hidden sm:inline-flex rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50"
              >
                Admin
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
