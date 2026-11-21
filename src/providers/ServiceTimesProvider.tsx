"use client";

import { createContext, useContext } from "react";
import { SERVICE_TIMES_SNAPSHOT } from "@/data/service-times.snapshot";
import type { ServiceTimesData } from "@/lib/service-times-core";

/** Server components read `getServiceTimes()`; client components read this, fed once by the root layout. */
const Ctx = createContext<ServiceTimesData>(SERVICE_TIMES_SNAPSHOT);

export function ServiceTimesProvider({ value, children }: { value: ServiceTimesData; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useServiceTimes = (): ServiceTimesData => useContext(Ctx);
