# Security

Report a vulnerability to tyler@preissersolutions.com. Please do not open a public issue.

This repository is the public website for Celebration Community Church (Hays). It holds no member data and no
secrets: the Worker has no secrets (`wrangler.jsonc`), `.env.example` is the only env file tracked, and
`.gitignore` excludes `.env*.local`.

Controls in place:
- Draft content is only requested when a preview token is present, and the token is URL-encoded before it is
  forwarded to the editor, which owns and validates it (`src/lib/cms.ts:107-110`).
- The site exposes no API routes of its own; pages are rendered from published content.
- Locked installs (`package-lock.json`, `npm ci`), and a dependency-audit step in `scripts/ci-steps.sh`.
- Deploys only from a commit on `main` with a green `ci-local` status (`scripts/deploy-from-clean-checkout.sh`).
