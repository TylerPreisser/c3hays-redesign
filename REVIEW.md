# REVIEW.md — evidence bar for c3hays-redesign

Every finding needs a concrete failing scenario plus `file:line` citations. Confidence 0-100;
discard anything under 80. Read the implementation, not just the diff — trace callers before
flagging a defect. Discard a finding if the behavior is guarded, intentional, or you cannot
demonstrate it fails. Conformance to an Accepted ADR (`DECISIONS/`) is never a defect.

**Excluded from review:** style nits, speculative/hypothetical risk, feature requests, generated
code, lockfiles, anything ESLint/`tsc` already catches.

## Repo-specific must-checks

1. **Both/all deploy targets still build.** A change to `next.config.ts`, `wrangler.jsonc`, or
   `vercel.json` must not silently break the static-export path (`output: "export"`) while fixing
   the SSR path, or vice versa — cite which target the diff was actually verified against.
2. **CMS fail-soft path preserved.** Any change to `src/lib/cms.ts` must keep the `null`-on-empty-
   `NEXT_PUBLIC_CMS_URL` short-circuit and the bounded timeout — trace every caller in
   `src/app/**/page.tsx` to confirm the fallback-to-hand-built-sections branch still fires.
3. **Editable-by-construction invariant.** Any new or edited `data-cms-link` element must contain
   a `data-cms-link-label` descendant (`tests/editable-by-construction.test.ts`), or the Studio
   editor collapses the element into one editable button label — cite the specific element.
4. **Cloudflare service binding integrity.** A change to `wrangler.jsonc`'s `services` binding
   name must match the deployed `c3-studio` Worker's actual `name` — a mismatch fails silently
   (empty CMS content), not with an error; verify the binding name against what's live, not assumed.
