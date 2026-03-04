"use client";

import { useEffect, useState } from "react";
import { useSidebarOpen } from "./SidebarContext";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useSidebarOpen();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isOpen = mounted && open;

  return (
    <>
      {/* iOS-style dim overlay */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Sidebar drawer — fixed on lg, slide-over on mobile */}
      <div
        className={`fixed left-0 top-0 z-40 h-screen w-72 ios-spring lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
}
