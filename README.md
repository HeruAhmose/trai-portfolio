# TRAI — Sovereign Technology Portfolio

Proprietary. All rights reserved. See [LICENSE](LICENSE).

React + Vite + TypeScript. Deploys as a static site.

```bash
npm ci
npm run check      # typecheck + verified-facts guard
npm run build      # → dist/public
npm run dev        # local
```

## Verified-facts guard

`scripts/check-facts.mjs` runs before every build and blocks the deploy on
failure. It makes `VERIFIED_FACTS.md` executable: no fabricated institutional
validation, no implied credentials, "patent filed" never "granted", and the T₂
coherence figure keeps its HYPOTHESIS label. It is context-aware, so
`NIST Cybersecurity Framework`, `not peer reviewed`, and `T2: 8.5` as a
simulation constant all pass correctly.

Currently clean across 247 source files.

## Deploy

`SITE_URL` is set as a repository variable; push to `main` builds and deploys
via GitHub Actions. Netlify and Vercel are wired as manual workflow options.
