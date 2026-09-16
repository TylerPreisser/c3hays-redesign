---
paths: ["tests/**", "vitest.config.ts", "vitest.config.mjs"]
---

# Testing conventions — c3hays-redesign

- Vitest defaults to `environment: "node"`; opt into DOM APIs per file with the magic comment
  `// @vitest-environment jsdom` at the top (see `tests/editable-by-construction.test.ts:1`).
- Path alias `@/*` → `src/*` is set in `vitest.config.ts`, independent of `tsconfig.json`'s own
  `paths` — if you add a new alias, add it in both places or imports resolve in one and not the other.
- `esbuild.jsx` is forced to `"automatic"` in `vitest.config.ts` because the app's own tsconfig
  uses Next's JSX handling — don't "fix" this by changing tsconfig's `jsx` value for tests.
- Gotcha (`vitest.config.ts:1-4`, comment on file): the `tests/` dir existed for 41 files before
  Vitest was ever a real dependency, so the suite silently never ran and a values-truth guard sat
  stale through a rewrite. If you add a test, confirm `npm run test` actually collects and runs it
  — don't assume presence in `tests/` means it executes.
- Self-correcting guard pattern in use (`tests/editable-by-construction.test.ts`): a real-markup
  assertion is wrapped in `it.fails` while a known invariant violation is unfixed, so the suite
  stays green but the test flips to a loud failure the moment the invariant is satisfied — forcing
  removal of `.fails`. Prefer this pattern over skipping/deleting a test for a known, open bug.
