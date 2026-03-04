"use client";

import { useSidebarOpen } from "./SidebarContext";

export function SidebarToggle() {
  const { open, toggle } = useSidebarOpen();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={open ? "Close menu" : "Open menu"}
      className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full ios-spring active:scale-90"
      style={{ background: "rgba(118,118,128,0.20)" }}
    >
      {/* iOS-style three-line menu / X */}
      {open ? (
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );
}
