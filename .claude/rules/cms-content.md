---
paths: ["src/lib/cms*.ts", "src/components/cms/**", "src/app/**/page.tsx", "src/app/**/route.ts"]
---

# CMS content path conventions — c3hays-redesign

- `src/lib/cms.ts`'s `cmsFetch` must stay fail-soft: short-circuit to `null` when
  `NEXT_PUBLIC_CMS_URL` is unset (keeps the static-export build safe), and use
  `cache: "no-store"` with a bounded timeout (2.5s) for the live path. Do not add a hard failure
  or a longer default timeout without checking both deploy targets in `DEPLOY_READY.md`.
- Page components try CMS content first and fall back to hand-built sections when
  `blocks.length` is empty (`src/app/page.tsx` pattern) — preserve this shape in any new CMS-backed
  route; never make the CMS the only content source for a page.
- Editable-by-construction: any element carrying `data-cms-link` must contain a
  `data-cms-link-label` descendant, or the Studio editor's label-derivation
  (`EditBridge.tsx:402`) collapses the element's entire content into one editable button label.
  Covered by `tests/editable-by-construction.test.ts` — run it after touching any `data-cms-link`
  component.
- On the Cloudflare Worker target, cross-Worker CMS calls go through the `CMS` service binding
  declared in `wrangler.jsonc`, not `c3-studio`'s public `workers.dev` URL — a public-URL
  subrequest between Workers does not deliver the response body. `CMS_LIVE` itself must be read at
  request time via `getCloudflareContext().env` there, not `process.env` (empty on the Worker).
