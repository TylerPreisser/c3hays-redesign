import { cache } from "react";
import { getCMSLocations } from "@/lib/cms";
import { SERVICE_TIMES_SNAPSHOT } from "@/data/service-times.snapshot";
import { resolveTimes, type ServiceTimesData } from "@/lib/service-times-core";

/**
 * The church's service times for this request: Studio's published location records, or the generated snapshot of
 * Studio's last published times when Studio is down, slow or sends something unusable. Once per request.
 */
export const getServiceTimes = cache(async (): Promise<ServiceTimesData> => {
  const live = await getCMSLocations();
  return resolveTimes(live, SERVICE_TIMES_SNAPSHOT);
});
