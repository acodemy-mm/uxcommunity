"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarOpen } from "./SidebarContext";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  emoji: string;
  color: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/",           label: "Home",       emoji: "🏠", color: "#0A84FF" },
  { href: "/articles",   label: "Articles",   emoji: "📝", color: "#BF5AF2" },
  { href: "/videos",     label: "Courses",    emoji: "🎬", color: "#FF375F" },
  { href: "/podcasts",   label: "Podcasts",   emoji: "🎧", color: "#FF9F0A" },
  { href: "/challenges", label: "Challenges", emoji: "🏆", color: "#30D158" },
  { href: "/jobs",       label: "Job Board",  emoji: "💼", color: "#40CBE0" },
];

const MY_ITEMS: NavItem[] = [
  { href: "/saved", label: "Saved", emoji: "🔖", color: "#0A84FF" },
];

export function SidebarNav({
  isAdmin,
  isAuthenticated,
}: {
  isAdmin?: boolean;
  isAuthenticated?: boolean;
}) {
  const pathname = usePathname();
  const { setOpen } = useSidebarOpen();

  const renderGroup = (items: NavItem[]) => (
    <div className="overflow-hidden rounded-2xl bg-[#1C1C1E]">
      {items.map((item, i) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const isLast = i === items.length - 1;

        return (
          <div key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 ios-spring active:bg-[#2C2C2E]",
                isActive ? "bg-[#2C2C2E]" : "hover:bg-[#252525]"
              )}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[16px] shadow-sm"
                style={{ backgroundColor: item.color }}
              >
                {item.emoji}
              </span>

              <span
                className={cn(
                  "flex-1 text-[15px]",
                  isActive ? "font-semibold text-white" : "font-medium text-white/90"
                )}
              >
                {item.label}
              </span>

              <ChevronRight
                className={cn(
                  "h-4 w-4 ios-spring",
                  isActive
                    ? "text-[rgba(235,235,245,0.5)]"
                    : "text-[rgba(235,235,245,0.25)] group-hover:text-[rgba(235,235,245,0.4)]"
                )}
              />
            </Link>

            {!isLast && <div className="ml-[60px] ios-separator" />}
          </div>
        );
      })}
    </div>
  );

  return (
    <nav className="space-y-5">
      {/* Browse section */}
      <div>
        <p
          className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "rgba(235,235,245,0.4)" }}
        >
          Browse
        </p>
        {renderGroup(NAV_ITEMS)}
      </div>

      {/* My Library — only for logged-in users */}
      {isAuthenticated && (
        <div>
          <p
            className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "rgba(235,235,245,0.4)" }}
          >
            My Library
          </p>
          {renderGroup(MY_ITEMS)}
        </div>
      )}
    </nav>
  );
}
