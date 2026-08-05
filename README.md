# TRAI — Sovereign Technology Portfolio

[![CI](https://github.com/HeruAhmose/trai-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/HeruAhmose/trai-portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/HeruAhmose/trai-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/HeruAhmose/trai-portfolio/actions/workflows/deploy.yml)

Proprietary. All rights reserved. See [LICENSE](LICENSE).

Tamerian Renaissance Alliance Initiative — seven ventures as one regenerative
organism. React SPA, Vite, TypeScript.

## Applying this bundle

`patched/` contains only the files that changed. Drop them into the existing
repository at the matching paths:

```
patched/components/   → client/src/components/
patched/lib/          → client/src/lib/
patched/pages/        → client/src/pages/
patched/public/       → client/public/     (includes media/, ~20 MB)
patched/index.html    → client/index.html
patched/index.css     → client/src/index.css
scripts/              → scripts/
.github/              → .github/
```

Then `npm ci && npx tsc --noEmit && npx vite build`.

## Guard

`scripts/check-facts.mjs` runs before every build and every deploy, and blocks
the merge on failure. It enforces `VERIFIED_FACTS.md` mechanically:

- no national-laboratory validation that did not occur
- no implied credentials or institutional review
- "patent filed", never "patented technology" or "granted"
- the T₂ coherence figure keeps its HYPOTHESIS label
- no unfilled `[Institution Name]` placeholders, no sandbox URLs

It understands context: `NIST Cybersecurity Framework` passes as a compliance
reference, `not peer reviewed` passes as honest disclosure, and `T2: 8.5` as a
simulation constant is data rather than a claim.

Running it against the full repository found four real content errors, now
fixed: three instances of "peer-reviewed preprint" — a contradiction, since a
preprint precedes review — and a coherence figure in `CaseStudies.tsx` that had
lost the hypothesis qualifier your own record requires.

## Deploy

Set the `SITE_URL` repository variable, then push to `main` for GitHub Pages,
or run the Deploy workflow and pick Netlify or Vercel.

| Secret / variable | Type | Needed for |
|---|---|---|
| `SITE_URL` | variable | canonical, og:url, sitemap |
| `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` | secrets | Netlify |
| `VERCEL_TOKEN` | secret | Vercel |

## Ecosystem

`public/trai-ecosystem.json` is the canonical registry of every TRAI property.
Both this site and Blue-Gold Daily read it to build their cross-site bar and
their Organization JSON-LD. Change a URL once and every property follows.
Ventures without a URL render non-clickable with their stage shown, so nothing
in development can look live.
