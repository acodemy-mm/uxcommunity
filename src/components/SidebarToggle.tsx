"use client";

import { Menu } from "lucide-react";
import { useSidebarOpen } from "./SidebarContext";

export function SidebarToggle() {
  const { toggle } = useSidebarOpen();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Open menu"
      className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
