"use client";

import { useEffect, useState } from "react";
import { useSidebarOpen } from "./SidebarContext";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useSidebarOpen();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount (SSR + initial hydration), always render the closed state
  // so server HTML and client HTML match exactly.
  const isOpen = mounted && open;

  return (
    <>
      {/* Overlay — only visible on mobile when sidebar is open */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Sidebar: off-canvas on mobile, fixed on lg+ */}
      <div
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
}
