import { Search } from "lucide-react";
import { SidebarToggle } from "@/components/SidebarToggle";
import { getCachedUser } from "@/lib/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default async function Header() {
  const user = await getCachedUser();
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : null;

  return (
    <header className="sticky top-0 z-20 ios-glass">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-5">

        {/* Mobile: hamburger */}
        <div className="lg:hidden shrink-0">
          <SidebarToggle />
        </div>

        {/* iOS-style pill search bar */}
        <div className="relative flex-1 max-w-2xl mx-auto">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "rgba(235,235,245,0.5)" }}
          />
          <input
            type="search"
            placeholder="Search"
            className="w-full h-9 rounded-[10px] pl-9 pr-4 text-[15px] text-white placeholder:text-[rgba(235,235,245,0.45)] outline-none ios-spring focus:ring-2 focus:ring-[var(--ios-blue)]/40"
            style={{ background: "rgba(118,118,128,0.24)" }}
          />
        </div>

        {/* Right: user avatar or sign in */}
        <div className="shrink-0">
          {user ? (
            <Avatar className="h-8 w-8 cursor-pointer ios-bounce hover:opacity-80">
              <AvatarFallback
                className="text-xs font-bold text-white rounded-full"
                style={{ background: "linear-gradient(135deg, var(--ios-blue), var(--ios-purple))" }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Link
              href="/auth/login"
              className="text-[15px] font-medium ios-spring"
              style={{ color: "var(--ios-blue)" }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* iOS thin separator */}
      <div className="ios-separator" />
    </header>
  );
}
