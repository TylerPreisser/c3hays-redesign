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
    services: [
      { day: "Saturday", times: ["5:00 PM"] },
      { day: "Sunday", times: ["8:00 AM", "9:30 AM", "11:00 AM"] },
    ],
    mapsUrl:
      "https://maps.google.com/?q=5790+230th+Ave,+Hays,+KS+67601",
    image: "/images/exterior.webp",
    description:
      "Our main campus in Hays, Kansas — where it all began. Four services every weekend with something for every age and stage.",
  },
  {
    id: "colby",
    name: "Colby",
    slug: "colby",
    street: "1923 S Range",
    city: "Colby",
    state: "KS",
    zip: "67701",
    services: [{ day: "Sunday", times: ["10:00 AM"] }],
    mapsUrl: "https://maps.google.com/?q=1923+S+Range,+Colby,+KS+67701",
    image: "/images/building.webp",
    description:
      "Bringing the same heart and vision to northwest Kansas. Join us Sunday morning at our Colby campus.",
  },
];
