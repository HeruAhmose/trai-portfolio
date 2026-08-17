#!/usr/bin/env node
/**
 * Verified-facts guard.
 * ---------------------------------------------------------------------------
 * The repository already carries VERIFIED_FACTS.md, headed "Do Not Fabricate".
 * That discipline is the strongest thing in this project, and this makes it
 * executable: CI fails if a claim the record does not support reaches the
 * source.
 *
 * Two classes of check:
 *   FORBIDDEN — language that asserts validation, credentials, or measurement
 *               that does not exist.
 *   ANCHORED  — figures that may appear only in their correct form. A patent
 *               number or a coherence figure quietly drifting is exactly the
 *               kind of error nobody catches by reading.
 */
import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOTS = ['client/src', 'patched'].filter((d) => {
  try { return statSync(d).isDirectory(); } catch { return false; }
});

const FORBIDDEN = [
  { re: /\b(Oak Ridge|ORNL|Argonne|Sandia|Los Alamos|Lawrence Livermore)\b/i,
    why: 'no national laboratory has validated this work' },
  // NIST is legitimate as a named compliance framework; it is not legitimate
  // as a validating body for this work.
  { re: /\bNIST\b/i,
    allowedBy: /NIST\s+(Cybersecurity Framework|CSF|SP\s*800|800-\d+|guidelines?|standards?|compliance)/i,
    why: 'NIST has not validated this work (naming the compliance framework is fine)' },
  // "Not peer reviewed" is the honest disclosure we want to keep.
  // Citing other people's peer-reviewed literature is legitimate and is the
  // normal shape of a references section. What is not legitimate is claiming
  // that OUR work has been peer reviewed.
  { re: /\bpeer[- ]reviewed\b/i,
    allowedBy: /\b(not|non|pre|awaiting|pending|prior to|yet to be)[- ]?peer[- ]reviewed\b|peer[- ]reviewed\s*(publication)?\s*(is )?(pending|planned|forthcoming)|\d+\s+peer[- ]reviewed\s+(papers?|studies|articles|sources|references)|peer[- ]reviewed\s+(papers?|studies|literature|sources|references)\s+(cited|referenced|reviewed|surveyed)/i,
    why: 'no peer-reviewed publication of this work exists yet (citing others is fine)' },
  { re: /\bpost[- ]doctoral dissertation\b/i,
    why: 'implies credentials and institutional review that do not exist' },
  { re: /\bpatent(ed)?\s+(technology|process|material)\b/i,
    why: 'the application is filed, not granted — say "patent filed"' },
  { re: /\bpatent[- ]granted\b/i, why: 'the application is filed, not granted' },
  { re: /\broom[- ]temperature superconduct/i,
    why: 'not demonstrated; would be a Nobel-level claim' },
  { re: /\bzero[- ]point energy\b/i, why: 'not demonstrated' },
  // Allowed inside an explicit prohibited-claims list, or a negation.
  { re: /\bFDA[- ]approved\b/i,
    allowedBy: /(never|not|no|avoid|prohibit|do not|cannot|must not|unless it actually is)[^.]{0,90}FDA[- ]approved|FDA[- ]approved[^.]{0,40}(unless|is prohibited|not permitted)|["'“]FDA[- ]approved["'”]/i,
    why: 'nothing here is FDA-approved' },
  { re: /\[(Institution Name|Advisor Name|Insert Date|Insert Contact Info)\]/i,
    why: 'unfilled template placeholder' },
  { re: /\blorem ipsum\b/i, why: 'placeholder copy' },
];

/** [pattern that may appear, the only acceptable surrounding form, reason] */
const ANCHORED = [
  { find: /63\/934,?269/g, must: /63\/934,269/, why: 'patent application number must be exact' },
  // Only prose claims about coherence need the qualifier. `T2: 8.5` as an
  // object key inside a physics simulation is data, not an assertion.
  { find: /T[₂2]\s*(coherence\s*)?[>≥]\s*\d[\d.]*\s*(μs|us|ns)/gi,
    must: /HYPOTHESIS|hypothesis|not confirmed|target|projected/i,
    why: 'a stated coherence figure must carry its hypothesis label' },
];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(e)) continue;
      walk(p, out);
    } else if (['.tsx', '.ts', '.html', '.md'].includes(extname(p))) {
      out.push(p);
    }
  }
  return out;
}

let fail = 0;
let scanned = 0;

for (const root of ROOTS) {
  for (const file of walk(root)) {
    // The guard itself and the facts record must be able to name what is banned.
    if (/check-facts|VERIFIED_FACTS|SECURITY\.md|LICENSE/.test(file)) continue;
    const src = readFileSync(file, 'utf8');
    scanned++;

    for (const { re, why, allowedBy } of FORBIDDEN) {
      const m = src.match(re);
      if (m) {
        // Some terms are legitimate in a negated or citational context —
        // "Not peer reviewed", "NIST Cybersecurity Framework", or a term
        // listed precisely because it is prohibited.
        if (allowedBy) {
          const around = src.slice(Math.max(0, m.index - 140), m.index + 180);
          if (allowedBy.test(around)) continue;
        }
        const at = src.slice(Math.max(0, m.index - 70), m.index + 90).replace(/\s+/g, ' ');
        console.error(`✗ ${file}\n    matched: "${m[0]}"\n    reason:  ${why}\n    context: …${at}…\n`);
        fail++;
      }
    }

    for (const { find, must, why } of ANCHORED) {
      for (const m of src.matchAll(find)) {
        const around = src.slice(Math.max(0, m.index - 200), m.index + 260);
        if (!must.test(around)) {
          console.error(`✗ ${file}\n    "${m[0]}" appears without its required qualifier\n    reason:  ${why}\n`);
          fail++;
        }
      }
    }
  }
}

if (fail) {
  console.error(`\nfacts guard: ${fail} violation(s) across ${scanned} files. Build blocked.`);
  process.exit(1);
}
console.log(`facts guard: ${scanned} files clean.`);
