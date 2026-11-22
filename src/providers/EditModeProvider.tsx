"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * True only when this page is the editor's canvas (the request carries the editor's preview token). The editor's
 * select-only markers (`data-cms-pick`) are drawn only then: an ordinary visitor's HTML carries none of them.
 */
const Ctx = createContext(false);
export const useEditMode = (): boolean => useContext(Ctx);
export function EditModeProvider({ edit, children }: { edit: boolean; children: ReactNode }) {
  return <Ctx.Provider value={edit}>{children}</Ctx.Provider>;
}
