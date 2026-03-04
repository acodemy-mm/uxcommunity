"use client";

import { useSidebarOpen } from "./SidebarContext";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useSidebarOpen();

  return (
    <>
      {/* Overlay on mobile when sidebar is open */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Sidebar: off-canvas on mobile, fixed on lg */}
      <div
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
}
