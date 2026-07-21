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
  // Real celebratejesus.org channels ONLY (verified against the live /watch-online and
  // /messages pages): Facebook + Facebook Live, Instagram, and the Vimeo message archive.
  // The live site has NO YouTube channel — do NOT re-add one. Do NOT invent a Google Play
  // link (only an iOS app exists on the real site).
  social: {
    facebook: "https://facebook.com/c3hays",
    facebookLive: "https://facebook.com/c3hays/videos",
    instagram: "https://instagram.com/c3hays",
    vimeo: "https://vimeo.com/c3hays",
  },
  giving: {
    hays: "https://pushpay.com/g/4390326549?r=monthly",
    colby: "https://pushpay.com/g/celebratejesus?r=monthly",
    online: "https://pushpay.com/g/4553051606?r=monthly",
  },
  // iOS "C3 Hays" app (App ID 1028509278). No Android/Play link exists on the real site.
  appStore: "https://apps.apple.com/us/app/c3-hays/id1028509278",
} as const;
