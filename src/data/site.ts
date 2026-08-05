export const site = {
  name: "Celebration Community Church",
  short: "C3",
  tagline: "Welcome Home.",
  mission:
    "Jesus is central to everything we do at C3. We exist to meet with Him, grow in Him, and serve through Him.",
  meetGrowServe: "Meet. Grow. Serve.",
  email: "office@c3hays.com",
  phone: "(785) 625-5483",
  address: { street: "5790 230th Ave", city: "Hays", state: "KS", zip: "67601" },
  // Real, verified church channels ONLY. Every value below is corroborated against
  // reference/c3hays-org-mirror/ (the raw capture of the live celebratejesus.org):
  //   facebook / facebookLive — facebook.com/c3hays, live stream at /videos (the mirror
  //     links /videos 14x and NEVER /live; "/live" was an invented path, removed).
  //   instagram, youtube      — instagram.com/c3hays, youtube.com/@c3hays.
  //   podcast                 — anchor.fm/c3pod IS real: the mirror's site-wide footer
  //     links it 226x behind a fa-podcast icon, and the URL still resolves today
  //     (302 -> creators.spotify.com/pod/profile/c3pod/, whose og:description reads
  //     "The C3 Podcast is a product of Celebration Community Church, with two physical
  //     campuses in Hays, KS and Colby, KS").
  //     NOTE it currently has NO renderer: the Footer does not link it and
  //     WeeklyConnect (which would) has zero importers. It is kept because it is
  //     TRUE, not because something displays it — an earlier note here claimed
  //     WeeklyConnect rendered it, which was wrong.
  // Vimeo is deliberately ABSENT — the real site does carry vimeo.com/c3hays, but the
  // redesign consolidated "watch" on YouTube (3c6d509). That is a product choice, not a
  // truth claim, so do not "restore" it as a correction.
  // Do NOT invent a Google Play link — only an iOS app exists on the real site.
  social: {
    facebook: "https://www.facebook.com/c3hays",
    facebookLive: "https://www.facebook.com/c3hays/videos",
    instagram: "https://www.instagram.com/c3hays/",
    youtube: "https://www.youtube.com/@c3hays",
    podcast: "https://anchor.fm/c3pod",
  },
  giving: {
    hays: "https://pushpay.com/g/4390326549?r=monthly",
    colby: "https://pushpay.com/g/celebratejesus?r=monthly",
    online: "https://pushpay.com/g/4553051606?r=monthly",
  },
  // iOS "C3 KS" app (App ID 1028509278). No Android/Play link exists on the real site.
  appStore: "https://apps.apple.com/us/app/c3-ks/id1028509278",
} as const;
