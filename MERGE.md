# Merge: v10 + the media/guard work

One organism, not two forks.

## What the comparison found

Your v10 and my working copy had **two parallel implementations of the same
three features**. That is the incoherence, at the code level:

| Feature | v10 | mine |
|---|---|---|
| World map | `SovereignWorldMap.tsx` | `RememberedWorldMap.tsx` |
| Sound | `useSovereignSound.ts` | `lib/sovereignAudio.ts` |
| Organ portal | reuses existing viz components | `OrganCanvas` + own data |

Two of anything is the opposite of one body. So each was judged on merit rather
than by whose it was.

## Where v10 won, and I deferred

**`SovereignWorldMap` stays.** It carries `route` *and* `external` per region,
so the map actually links to Tamerian Materials, Queen Califia and TechBridge.
Mine did not. That is precisely the synergy the architecture claims, and mine
was the weaker piece.

**`useSovereignSound` stays.** It builds a real `AudioContext` and synthesises
every voice. It is less elaborate than mine but it works, and one working sound
system beats two.

**v10's `OrganPortal` structure stays.** It renders `NeuralNetworkViz`,
`QuantumComputingViz`, `DNAHelix` and `AMCVisualization` — components that were
sitting in the repository as dead imports. Reusing them is better than my
`OrganCanvas` duplicating that work in a new file.

`RememberedWorldMap.tsx` and `lib/sovereignAudio.ts` are **deleted**. They were
the duplicates.

## Where mine won, and was merged in

**Portal accessibility.** v10's portal locked scroll and closed on Escape, but
had no focus trap, no `aria-modal`, no label, and no focus restore. A modal
that lets focus escape behind the backdrop is unusable with a keyboard, and
dropping a keyboard user at the top of the document on every close is worse.
All four are now in, on v10's structure.

**The media system.** v10 had none. Added: 30 processed assets, the provenance
registry, and three sections — Origin (the founder archive), Proprietary
Technologies, Biomimicry. Every image carries a Photograph / Rendering /
Concept chip, so a 2006 football photograph can sit beside a Tamerian render
without either borrowing the other's credibility.

**The guards, the cinematic layer, the ecosystem bar, US spelling.**

## What the guard caught in v10

Running `check-facts.mjs` against the merge surfaced **six violations that v10
had reintroduced** — claims I had fixed in the earlier copy:

- "Peer-reviewed preprint" in four places. A preprint by definition precedes
  peer review; the phrase is a contradiction.
- The T₂ coherence figure stated twice without the HYPOTHESIS label your own
  `VERIFIED_FACTS.md` requires.

All fixed. This is the argument for the guard existing: a written standard
depends on whoever edits last remembering it, and across a fork, nobody did.

**One rule was too broad and I narrowed it.** "51 peer-reviewed papers cited in
validation framework" is legitimate — those are other people's published papers
your patent cites. The rule now blocks claiming *our* work is peer reviewed
while allowing citation of other people's. That correction is synced back to
the standalone repo too.

## Build fixes carried over

`@builder.io/vite-plugin-jsx-loc` requires Vite 4–5 against this project's Vite
7, which breaks `npm ci` (it only survives under `--legacy-peer-deps`). Removed
and the lockfile regenerated.

`MediaSystem.tsx` imported the deleted audio engine; it now uses
`useSovereignSound`, so there is one sound system rather than an orphaned
import.

## Verified

Clean checkout, no `node_modules`:

- `npm ci` succeeds · facts guard clean across **248 files** · `vite build`
  succeeds
- Cinematic intro plays and clears; ecosystem bar renders; viewport
  `maximum-scale=1` repaired automatically
- v10 kept: sovereign world map present, **7 organ buttons**
- Added: `#origin`, `#technologies`, `#biomimicry`; 10 archive photographs;
  6 technology cards; **19/19 media images load**; 22 provenance chips
- Portal: opens, `aria-modal="true"`, labelled *"Tamerian Materials — Skeleton"*,
  visualization renders, scroll locked, **focus trapped**, Escape closes, scroll
  restored, **no lingering overlay**
- Zero console errors; zero horizontal overflow

## Note

`tsc --noEmit` still reports pre-existing errors in `_core/hooks/useAuth.ts` and
tRPC router typing. They predate all of this and are unrelated. That is why the
CI typecheck is advisory while the facts guard is a hard gate.

---

# Follow-up: HK widget and type errors

## The HK widget was broken, not just mistyped

It sent `{ message: text }`. The router's zod schema requires `question`. Every
request failed validation before it reached the model, so the widget could only
ever return its own error string — "The bridge is temporarily unavailable."
Anyone who typed into it got that, every time.

Fixed, and two things added while in there:

- **Conversation history is now sent.** The router accepts
  `conversationHistory` and always did; the widget never passed it, so H.K. had
  no memory within a session even though the server was built for it. The canned
  greeting is filtered out so it does not pollute the context.
- **Replies are explicitly typed as `Message`.** Without the annotation
  TypeScript widens the object literal and it stops being assignable to
  `SetStateAction<Message[]>` — the second reported error.

## 38 type errors to zero

Most of them were not real. `@types/node` and `vite` are declared in
`package.json` but were absent from `node_modules` after an earlier
`--package-lock-only` regeneration, so `tsc` could not resolve `vite/client` or
Node globals and cascaded. A clean `npm install` cleared 37 of them.

The one genuine error was in the H.K. response path: the model can return
either a string or an array of content blocks, and the raw union was leaking
through the procedure into the client. Normalized at the server boundary —
where it belongs — rather than patched in the widget. The server already did
`String(assistantMessage)` when writing to the database, so it half-knew about
this; now every consumer of the procedure gets a string.

**`npx tsc --noEmit` now reports 0 errors**, so the CI typecheck has been
restored to a hard gate. It was advisory only because 38 pre-existing errors
would have blocked every deploy.

## Eight more broken images

v10 had reintroduced `/manus-storage/` paths that do not exist in the
repository — including the founder headshot, which renders in the navigation on
every page. All eight repointed to real processed assets across
`PremiumNavigation`, `CommunityImpact`, `MaterialsScience` and `FounderPage`.

**Four remain and were deliberately left alone:** the Mela Nation vision images.
There is no equivalent asset in the media set, and substituting an unrelated
render there would be worse than a broken image — it would misrepresent a
venture that is still in development. They need real artwork, or the section
needs to change.

## Verified

Clean install, no `node_modules`:

- `npm install` · **`tsc --noEmit` 0 errors** · facts guard clean across 248
  files · `vite build` succeeds
- Served and loaded: **20/20 media images, zero 404s**, 7 organ buttons,
  ecosystem bar, intro plays and clears, zero console errors, zero overflow
