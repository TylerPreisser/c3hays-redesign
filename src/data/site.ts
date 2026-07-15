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
  // Real celebratejesus.org channels ONLY. Phase 3: podcast (anchor.fm) and Vimeo were
  // REMOVED site-wide — everything moved to YouTube. Do NOT re-add vimeo/podcast, and
  // do NOT invent a Google Play link (only an iOS app exists on the real site).
  social: {
    facebook: "https://facebook.com/c3hays",
    facebookLive: "https://facebook.com/c3hays/videos",
    instagram: "https://instagram.com/c3hays",
    youtube: "https://www.youtube.com/@c3hays",
  },
  giving: {
    hays: "https://pushpay.com/g/4390326549?r=monthly",
    colby: "https://pushpay.com/g/celebratejesus?r=monthly",
    online: "https://pushpay.com/g/4553051606?r=monthly",
  },
  // iOS "C3 Hays" app (App ID 1028509278). No Android/Play link exists on the real site.
  appStore: "https://apps.apple.com/us/app/c3-hays/id1028509278",
} as const;
