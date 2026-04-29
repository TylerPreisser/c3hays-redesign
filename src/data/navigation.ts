export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    label: "About",
    href: "/about/",
    children: [
      { label: "Our Story", href: "/about/" },
      { label: "What We Believe", href: "/beliefs/" },
    ],
  },
  {
    label: "Locations",
    href: "/locations/",
    children: [
      { label: "Hays", href: "/locations/hays/" },
      { label: "Colby", href: "/locations/colby/" },
    ],
  },
  { label: "Messages", href: "/messages/" },
  { label: "Watch", href: "/watch/" },
  { label: "Counseling", href: "/counseling/" },
  { label: "Connect", href: "/connect/" },
];

export const ctaItem: NavItem = {
  label: "Give",
  href: "/give/",
};
