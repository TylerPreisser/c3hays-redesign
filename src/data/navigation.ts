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
  // The C3 Weekly now lives at its OWN page, /news. The legacy /newsletter route is
  // kept as a redirect → /news (SEO/back-compat) by the page coder.
  { label: "C3 Weekly", href: "/news/" },
  // Events is a real top-level page (built by the events coder at /events/).
  { label: "Events", href: "/events/" },
  { label: "Watch", href: "/watch/" },
  { label: "Counseling", href: "/counseling/" },
  { label: "Connect", href: "/connect/" },
];

export const ctaItem: NavItem = {
  label: "Give",
  href: "/give/",
};

export interface NavGroup {
  label: string;
  children: NavItem[];
}

/**
 * G5 — medium-width (768–1279px) + mobile-drawer GROUPING.
 *
 * The flat `navItems` above (8 primary destinations) fits inline only on a wide
 * desktop. Between 768–1279px it crowds and overflows, so the bar folds those same
 * destinations into FOUR dropdown groups. This list is PRESENTATION-ONLY: every href
 * here also appears in `navItems`, so nothing new is introduced and the drift-guard
 * (`nav-no-orphan-pages`, which reads `navItems`) still owns the reachability truth.
 * Group headers are pure toggles (no page of their own) — children carry the links.
 */
export const navGroups: NavGroup[] = [
  {
    label: "About",
    children: [
      { label: "Our Story", href: "/about/" },
      { label: "What We Believe", href: "/beliefs/" },
    ],
  },
  {
    label: "Locations",
    children: [
      { label: "Hays", href: "/locations/hays/" },
      { label: "Colby", href: "/locations/colby/" },
    ],
  },
  {
    label: "Media",
    children: [
      { label: "Messages", href: "/messages/" },
      { label: "C3 Weekly", href: "/news/" },
      { label: "Events", href: "/events/" },
      { label: "Watch", href: "/watch/" },
    ],
  },
  {
    label: "Connect",
    children: [
      { label: "Counseling", href: "/counseling/" },
      { label: "Connect", href: "/connect/" },
    ],
  },
];
