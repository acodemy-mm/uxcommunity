"use client";

import { createContext, useContext, useState, useCallback } from "react";

type SidebarContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarOpenProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarOpen() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebarOpen must be used within SidebarOpenProvider");
  return ctx;
}
