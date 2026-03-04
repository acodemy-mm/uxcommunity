import Link from "next/link";
import { getCachedUser, getCachedProfile } from "@/lib/supabase/server";
import { SidebarNav } from "./SidebarNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";

export default async function Sidebar() {
  const user = await getCachedUser();
  const profile = await getCachedProfile(user?.id);
  const isAdmin = profile?.role === "admin";

  const displayName = user?.email
    ? user.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "UX";

  return (
    <aside className="flex h-screen w-72 flex-col ios-glass-thick select-none overflow-hidden">

      {/* ── iOS-style large title area ─────────── */}
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center gap-1 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--ios-blue)] text-[10px] font-bold text-white shadow-lg">
            UX
          </div>
          <span className="ml-1 text-[11px] font-semibold text-[var(--ios-blue)] uppercase tracking-widest">
            UXcellent
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Forum
        </h1>
      </div>

      {/* ── Profile card — iOS grouped row ─────── */}
      <div className="mx-4 mb-5">
        {user ? (
          <div className="flex items-center gap-3 rounded-2xl bg-[#1C1C1E] px-4 py-3">
            <Avatar className="h-12 w-12 shrink-0 shadow-lg">
              <AvatarFallback className="rounded-full text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--ios-blue), var(--ios-purple))" }}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-white leading-tight truncate">
                {displayName ?? user.email}
              </p>
              <p className="text-[13px] text-[rgba(235,235,245,0.6)] truncate mt-0.5">
                {user.email}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-[rgba(235,235,245,0.3)] shrink-0" />
          </div>
        ) : (
          <div className="rounded-2xl bg-[#1C1C1E] px-4 py-4">
            <p className="text-[13px] text-[rgba(235,235,245,0.6)] mb-3">
              Sign in to access all features
            </p>
            <div className="flex gap-2">
              <Link
                href="/auth/login"
                className="flex-1 rounded-xl bg-[var(--ios-blue)] px-4 py-2 text-center text-[13px] font-semibold text-white ios-spring hover:opacity-85 active:scale-[0.97]"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 rounded-xl bg-[#2C2C2E] px-4 py-2 text-center text-[13px] font-semibold text-white ios-spring hover:bg-[#3A3A3C] active:scale-[0.97]"
              >
                Join Free
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ─────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <SidebarNav isAdmin={isAdmin} />
      </div>

      {/* ── Bottom: sign out / admin ────────────── */}
      {user && (
        <div className="mx-4 mb-8 space-y-2">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center justify-between rounded-2xl bg-[#1C1C1E] px-4 py-3 ios-spring hover:bg-[#2C2C2E] active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-[8px]"
                  style={{ background: "var(--ios-purple)" }}>
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-[15px] font-medium text-white">Admin Panel</span>
              </div>
              <ChevronRight className="h-4 w-4 text-[rgba(235,235,245,0.3)]" />
            </Link>
          )}
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center rounded-2xl bg-[#1C1C1E] px-4 py-3 text-[15px] font-medium text-[var(--ios-red)] ios-spring hover:bg-[#2C2C2E] active:scale-[0.98]"
            >
              Sign Out
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
