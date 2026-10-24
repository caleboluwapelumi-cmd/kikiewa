"use client";

import { createContext, useContext, useMemo, useState } from "react";

/**
 * Whether the mobile menu is open. Shared by the header (which opens it) and
 * the mobile action bar (which hides while it is open).
 */

type MenuState = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MenuStateContext = createContext<MenuState | null>(null);

export function MenuStateProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <MenuStateContext value={value}>{children}</MenuStateContext>;
}

export function useMenuState(): MenuState {
  const state = useContext(MenuStateContext);
  if (!state) throw new Error("useMenuState must be used inside MenuStateProvider");
  return state;
}
