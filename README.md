# c3hays-redesign

The public website for Celebration Community Church (Hays). Next.js, React, Tailwind, Node 22.
Agent and contributor rules live in `CLAUDE.md`.

## Local development

```bash
npm ci
npm run dev                      # http://localhost:4400, hand-built pages (the static-export shape)
```

### Run the site as C3 Studio's editor canvas

Studio frames this site and edits it in place through the edit bridge (`src/components/cms/EditBridge.tsx`).
Two settings turn that on, and **both must be on the command line**. `next.config.ts` runs before Next reads
`.env.local`, so `CMS_LIVE=1` kept only in `.env.local` is not seen and the page fails with
"force-dynamic couldn't be exported".

```bash
CMS_LIVE=1 NEXT_PUBLIC_CMS_URL=http://localhost:4600 npm run dev
```

| Setting | What it does |
|---|---|
| `CMS_LIVE=1` | Live server rendering from Studio instead of the static export. |
| `NEXT_PUBLIC_CMS_URL` | Studio's origin of the same environment (local `http://localhost:4600`; staging and production name their own). The bridge posts to this origin only and accepts messages only from it. With it unset the bridge stays off. |
| `STUDIO_ORIGIN` | Optional. The origin allowed to frame the site (CSP `frame-ancestors`). Set it to the same origin when it is not the one above. |

`NEXT_PUBLIC_*` values are fixed when the page is built or the dev server starts: restart after changing one.
Open the canvas page as `/?cmsEdit=1` inside Studio's iframe. Opened on its own it does nothing.
Every value is listed in `.env.example`.

### The canvas messages

The bridge and Studio talk with `postMessage`. Every message is `{ v: 2, source, type, ... }`. A message with another
`v`, another `source`, from another origin, or from any window but the parent is ignored.

| Direction | Message |
|---|---|
| site to Studio | `cms:ready {draftServed, asOf, mode, reason}`, `cms:select {path, kind, box, ...}`, `cms:edit {path, value}`, `cms:section {op, id, index}` |
| Studio to site | `editor:mode {mode, caps?, pages?}`, `editor:apply {path, value}`, `editor:select {path}` |

`tests/editbridge-contract.test.ts` is the executable description of each one.

### Checks

```bash
npx tsc --noEmit
npx vitest run tests/editbridge-*.test.ts
```
