# TRAI Portfolio

The full TRAI estate site — a 48-page React 19 + Vite + wouter + Tailwind app
with an Express/tRPC server that does **not** run on the deployed site.
Deployed static to GitHub Pages at
[heruahmose.github.io/trai-portfolio](https://heruahmose.github.io/trai-portfolio/).

**Proprietary:** [LICENSE](LICENSE)

---

## Part of TRAI

TRAI — the Tamerian Renaissance Alliance Initiative — is framed as seven
organs of one regenerative organism. `HeruAhmose/peoples-portfolio` is the
**entry gate**: a deliberately curated 8-page cut of overlapping material. A
visitor lands there first; two organs have a page on the gate, the rest open
outward. This repo is **the estate** — the unpruned counterpart — and it is
where organs 04, 05, and 07 actually live as pages, since those three organs
have no site of their own yet.

| #   | Organ · role                    | Organ                  | Status                           | Where it lives                                                                                                                                                                                                                                |
| --- | ------------------------------- | ---------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | Skeleton — material sovereignty | Tamerian Materials     | U.S. provisional filed           | own repo: [tamerian-materials](https://github.com/HeruAhmose/tamerian-materials) → [tamerian-materials.com](https://tamerian-materials.com/) · deeper content here: [`/materials`](client/src/pages/MaterialsScience.tsx)                     |
| 02  | Heart — biological sovereignty  | True Mélange Φ         | Formulation set · entity pending | own repo: [blue-gold-daily](https://github.com/HeruAhmose/blue-gold-daily) → [blue-gold-daily site](https://heruahmose.github.io/blue-gold-daily/layers.html) · deeper content here: [`/true-melange`](client/src/pages/TrueMelangePhi.tsx)   |
| 03  | Brain — cognitive sovereignty   | Queen Califia          | Demo standing                    | own repo: [QueenCalifia-CyberAI](https://github.com/HeruAhmose/QueenCalifia-CyberAI) → [Queen Califia Pages](https://heruahmose.github.io/QueenCalifia-CyberAI/) · deeper content here: [`/queen-califia`](client/src/pages/QueenCalifia.tsx) |
| 04  | Vessels — mobility sovereignty  | Mela Nation            | EIN filed · early development    | **lives here** — [`/mela-nation`](client/src/pages/MelaNation.tsx) — no separate repo                                                                                                                                                         |
| 05  | Skin — identity sovereignty     | MeLaNiNa               | EIN filed · early development    | **lives here** — [`/melanina`](client/src/pages/MeLaNiNa.tsx) — no separate repo                                                                                                                                                              |
| 06  | Hands — community reach         | TechBridge Collective  | Designed · not yet operating     | own repo: [techbridge-collective](https://github.com/HeruAhmose/techbridge-collective) → [techbridge-collective.org](https://techbridge-collective.org/) · deeper content here: [`/community`](client/src/pages/CommunityImpact.tsx)          |
| 07  | Lymphatic — regenerative return | The Peoples Foundation | Operating under §508(c)(1)(A)    | **lives here** — [`/peoples-foundation`](client/src/pages/PeoplesFoundation.tsx) — no separate repo                                                                                                                                           |

**TRAI Coin is not an eighth organ.** It is represented in this estate as a
proposed cross-organ governance and participation layer. Its dedicated
[`/trai-coin`](client/src/pages/TraiCoin.tsx) experience describes concept
architecture only: no live token, public sale, exchange listing, deployed smart
contract, or economic right is represented by the current site.

The entry gate: [peoples-portfolio](https://github.com/HeruAhmose/peoples-portfolio) → [heruahmose.github.io/peoples-portfolio](https://heruahmose.github.io/peoples-portfolio/).

Statuses above are sourced from `peoples-portfolio`'s
[`shared/organismFacts.ts`](https://github.com/HeruAhmose/peoples-portfolio/blob/main/shared/organismFacts.ts)
and [`client/src/lib/organism.ts`](https://github.com/HeruAhmose/peoples-portfolio/blob/main/client/src/lib/organism.ts)
— that pair is the canonical fact table for the whole graph, not this repo. If
those files change, this table is what's now out of date.

---

## Tech stack

- **React 19.2**, **Vite 8.2**, **wouter 3** (routing), **Tailwind CSS 4**
- **Three.js** via `@react-three/fiber` / `@react-three/drei`, **Framer Motion**
- **Express 5** + **tRPC 11** server (dev-only tooling and local API surface —
  the deployed GitHub Pages build is static and does not run this server)
- **Drizzle ORM** over **MySQL** (`drizzle-orm/mysql2`), migrations in `drizzle/`
- **Zustand**, **TanStack Query**, **React Hook Form** + **Zod**
- **Vitest** for tests, **Prettier** for formatting
- Node.js `>=22.0.0`, package manager **npm** (`npm@10.9.3`, `package-lock.json`)

---

## Setup

```bash
npm ci
cp .env.example .env    # fill in values as needed for local dev
```

## Develop

```bash
npm run dev
```

## Verify

```bash
npm run check         # tsc --noEmit, then the claim-fact guard below
npm run check:facts   # scripts/check-facts.mjs — guards against claim drift
```

## Build

```bash
npm exec -- vite build --base /trai-portfolio/
```

The deploy workflow copies `index.html` to `404.html` for deep links and
writes `.nojekyll`. Built assets must be prefixed `/trai-portfolio/` — no
root-relative `"/assets/"` references.

---

## Notable features

- **Gamification** (`/gamification`) — session-based explorer points, levels,
  badges, and a leaderboard, persisted through a `userPoints` table
  (`drizzle/schema.ts`) via the `gamification` tRPC router
  (`server/routers/features.ts`). A `GamificationHUD` widget surfaces live
  points/badges/level across the site.
- **H.K. Assistant** — the deployed Pages build is a bounded static guide using
  verified portfolio context, with no external model or persisted conversation
  history. The optional server-connected implementation is wired through
  `server/routers/hkAssistant.ts` and may use an external model and session
  history only when that server is explicitly configured.
- **TRAI Coin** (`/trai-coin`) — a first-class, cross-organ governance and
  participation concept experience, explicitly separated from claims of token
  issuance, public sale, smart-contract deployment, or investment performance.

---

## Repository layout

| Path       | Role                                                |
| ---------- | --------------------------------------------------- |
| `client/`  | Vite React app — 48 pages under `client/src/pages/` |
| `server/`  | Express entry, tRPC routers, storage/db helpers     |
| `shared/`  | Shared TS used by both client and server            |
| `drizzle/` | Schema + SQL migrations (MySQL)                     |

---

## License

Proprietary and confidential — see [LICENSE](LICENSE). No license is granted;
all rights reserved by the Tamerian Renaissance Alliance Initiative and
Jonathan Peoples.
