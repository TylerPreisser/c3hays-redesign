import { SERVICE_TIMES_SNAPSHOT } from "./service-times.snapshot";
import { campus, daysAndTimes } from "@/lib/service-times-core";

export interface ServiceTime {
  day: string;
  times: string[];
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  services: ServiceTime[];
  mapsUrl: string;
  image: string;
  description: string;
}

export const locations: Location[] = [
  {
    id: "hays",
    name: "Hays",
    slug: "hays",
    street: "5790 230th Ave",
    city: "Hays",
    state: "KS",
    zip: "67601",
    // Times are Studio data; this is the generated snapshot of them (see src/lib/service-times.ts).
    services: daysAndTimes(campus(SERVICE_TIMES_SNAPSHOT, "hays")),
    mapsUrl:
      "https://maps.google.com/?q=5790+230th+Ave,+Hays,+KS+67601",
    image: "/images/exterior.webp",
    description:
      "C3 in Hays, Kansas.",
  },
  {
    id: "colby",
    name: "Colby",
    slug: "colby",
    street: "1923 S Range",
    city: "Colby",
    state: "KS",
    zip: "67701",
    services: daysAndTimes(campus(SERVICE_TIMES_SNAPSHOT, "colby")),
    mapsUrl: "https://maps.google.com/?q=1923+S+Range,+Colby,+KS+67701",
    image: "/images/hero-2.webp",
    description:
      "C3 in Colby, Kansas.",
  },
];
