"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Headphones,
  BookOpen,
  Trophy,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { useSidebarOpen } from "./SidebarContext";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/articles", label: "Articles", icon: FileText },
  { href: "/podcasts", label: "Podcasts", icon: Headphones },
  { href: "/videos", label: "Courses", icon: BookOpen },
  { href: "/challenges", label: "Challenges", icon: Trophy },
  { href: "/jobs", label: "Job Posts", icon: Briefcase },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { setOpen } = useSidebarOpen();

  return (
    <nav className="space-y-1 px-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
              isActive
                ? "bg-indigo-500/20 text-indigo-300"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
            }`}
          >
            <span
              className={
                isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
              }
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="flex-1 font-medium">{item.label}</span>
            <ChevronRight
              className={`h-4 w-4 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
