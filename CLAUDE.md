# Working in this repo

Context for Claude Code. Read before touching anything.

## What this is

`trai-portfolio` — the full TRAI estate site. React 19 + Vite + wouter +
Tailwind, with an Express/tRPC server that does **not** run on the deployed
site. Deployed static to GitHub Pages at
`https://heruahmose.github.io/trai-portfolio/`.

**This is not the only portfolio.** `HeruAhmose/peoples-portfolio` is a
deliberately curated 8-page cut of overlapping material. This repo is the
unpruned 47-page estate. Before adding a page here, check whether the same
subject already lives there — the two drifting apart is a real risk, and the
canonical fact table (`shared/organismFacts.ts`) exists in `peoples-portfolio`,
not here.

## The governing standard

**"Vast in Vision, Exact in Claim."** This decides what you are allowed to
write.

- Never invent a measurement, benchmark, validation, or URL.
- Anything projected must be visibly labelled as projected.
- `npm run check:facts` exists — run it. It is the guard against claim drift.
- If you cannot source a fact, leave the gap and say so.

## The central problem: 3,265 lines that reach nobody

This repo does not lack advanced features. It has them and does not use them.
**25 of 101 components are imported by nothing.** Twelve of the largest:

| Component                   | Lines |
| --------------------------- | ----- |
| EnhancedPatentExplorer      | 575   |
| OrganCanvas                 | 389   |
| AdvancedThreeDVisualization | 353   |
| HubNetworkMap               | 333   |
| WakandaHolographic          | 239   |
| ThreePillarModel            | 239   |
| CosmicWebGLBackground       | 206   |
| UltraVisualEffects          | 200   |
| VoiceCommandInterface       | 197   |
| AdvancedShaderEffects       | 196   |
| WebGLShaderEffects          | 193   |
| SpatialAudioSystem          | 145   |

Meanwhile the pages _claim_ these things — "Holographic Command Center",
"View 3D Projects", "Hide 3D" — in text. The gap between claim and delivery is
not a build problem. It is a wiring problem.

**Before writing any new feature, check whether it already exists here.**

Find the current orphan set:

```bash
for c in client/src/components/*.tsx; do
  n=$(basename "$c" .tsx)
  u=$(grep -rl "$n" client/src --include=*.tsx --include=*.ts | grep -v "components/$n.tsx" | wc -l)
  [ "$u" = "0" ] && echo "ORPHAN: $n ($(wc -l < "$c") lines)"
done
```

## Seven Home variants, two routed

`Home`, `HomeCinematic`, `HomeEnhanced`, `HomeEnhancedAstro`, `HomePremium`,
`HomeSovereign`, `HomeUltimate`. Only `HomeCinematic` and `HomeSovereign` are
referenced in `App.tsx`.

Do not add an eighth. Consolidating to one is worth doing, but it is a decision
for the owner, not a refactor to perform unasked — some of these carry visual
work that exists nowhere else.

## Verification discipline

**A passing build proves almost nothing.** An unused component compiles
perfectly. This repo is the proof: 3,265 lines of it compile on every commit
and ship to no one.

After wiring anything, prove it reaches the browser:

```bash
npm exec -- vite build --base /trai-portfolio/
grep -c "YourComponent" client/src/pages/ThePage.tsx    # >= 2: import + usage
grep -c "distinctive string" dist/public/assets/*.js    # >= 1
```

Do not report "done, build passes". Report the grep.

**Write a negative control for any test you add.** Reintroduce the bug, confirm
the test fails, restore. A suite that has only ever passed proves nothing.

**Re-measure; do not carry numbers forward.** A bundle figure measured on one
commit and repeated after the target changed will be wrong.

## Hard constraints

**`main` is protected.** Work on a branch, open a PR, let the checks run.

**npm, not pnpm.** `packageManager: npm@10.9.3`, `package-lock.json`. Do not
touch `package.json` or the lockfile casually — CI installs from the lock.

**Actions are already SHA-pinned** and workflow permissions are least-privilege
(`contents: read`). Keep both.

**24 remote branches, 11 fully merged into main.** Those are safe to delete.
The other 11 carry unmerged work — read before touching:

```bash
for b in $(git branch -r | grep -v HEAD | grep -v origin/main); do
  echo "$b +$(git rev-list --count origin/main..$b)"
done
```

## Commands

```bash
npm ci
npm run check          # typecheck
npm run check:facts    # claim guard
npm exec -- vite build --base /trai-portfolio/
```

The deploy workflow copies `index.html` to `404.html` for deep links and writes
`.nojekyll`. Assets must be prefixed `/trai-portfolio/` — no root-relative
`"/assets/"` refs.

## Priorities

1. **Wire the orphans, do not rewrite them.** Start with
   `EnhancedPatentExplorer` (575 lines) and `HubNetworkMap` (333) — both have
   obvious homes in the patent and community pages.
2. **Static pages that promise interaction**: `ResearchLab` (204 lines, 0
   handlers), `CommunityImpact` (255, 0), `FounderPage` (228, 0),
   `TrueMelangePhi` (190, 0), `PeoplesFoundation` (131, 0).
3. **Add a CSP** to `client/index.html`. There are zero inline scripts, so
   `script-src 'self'` is safe. `style-src` needs `'unsafe-inline'` for React
   and Radix. Note `frame-ancestors` is ignored in meta form — clickjacking
   protection needs a real header, which means a CDN in front of Pages.
4. **Delete the 11 merged branches.**

## Repo settings that need a human

Enable Secret scanning and **Push protection**; confirm the default workflow
token is read-only.
