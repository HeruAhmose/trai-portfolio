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
import { readFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = [
  "client/src",
  "client/public",
  "server",
  "shared",
  "patched",
].filter(d => {
  try {
    return statSync(d).isDirectory();
  } catch {
    return false;
  }
});

const FORBIDDEN = [
  {
    re: /\b(Oak Ridge|ORNL|Argonne|Sandia|Los Alamos|Lawrence Livermore)\b/i,
    why: "no national laboratory has validated this work",
  },
  // NIST is legitimate as a named compliance framework; it is not legitimate
  // as a validating body for this work.
  {
    re: /\bNIST\b/i,
    allowedBy:
      /NIST\s+(Cybersecurity Framework|CSF|SP\s*800|800-\d+|guidelines?|standards?|compliance)/i,
    why: "NIST has not validated this work (naming the compliance framework is fine)",
  },
  // "Not peer reviewed" is the honest disclosure we want to keep.
  // Citing other people's peer-reviewed literature is legitimate and is the
  // normal shape of a references section. What is not legitimate is claiming
  // that OUR work has been peer reviewed.
  {
    re: /\bpeer[- ]reviewed\b/i,
    allowedBy:
      /\b(not|non|pre|awaiting|pending|prior to|yet to be)[- ]?peer[- ]reviewed\b|peer[- ]reviewed\s*(publication)?\s*(is )?(pending|planned|forthcoming)|\d+\s+peer[- ]reviewed\s+(papers?|studies|articles|sources|references)|peer[- ]reviewed\s+(papers?|studies|literature|sources|references)\s+(cited|referenced|reviewed|surveyed)/i,
    why: "no peer-reviewed publication of this work exists yet (citing others is fine)",
  },
  {
    re: /\bpost[- ]doctoral dissertation\b/i,
    why: "implies credentials and institutional review that do not exist",
  },
  {
    re: /\b(Fortune 500|Government Defense Agency)\b/i,
    why: "no such client or deployment is documented",
  },
  {
    re: /\b(real quantum coherence data|Technology adopted by \d+\+ organizations)\b/i,
    why: "synthetic validation or adoption language is not evidence",
  },
  {
    re: /\bH\.K\. AI\b/i,
    why: "public H.K. is bounded static guidance and TechBridge triage is deterministic",
  },
  {
    re: /\bEINs? filed\b|\bEIN\b[^\n]{0,40}\bObtained\b/i,
    why: "entity status must be evidenced per organ and is not established by this record",
  },
  {
    re: /queencalifia-cyberai\.web\.app|qc\.tamerian-materials\.com/i,
    why: "retired or unavailable Queen Califia endpoint",
  },
  {
    re: /\b(?:Success Rate\s*[:=]\s*["']?(?:87|92)%|Threat Detection\s*[:=]\s*["']?99\.2%|95% threat detection accuracy)\b/i,
    why: "synthetic performance metric has no supporting record",
  },
  {
    re: /\bpatent(ed)?\s+(technology|process|material)\b/i,
    why: 'the application is filed, not granted — say "patent filed"',
  },
  {
    re: /\bpatent[- ]granted\b/i,
    why: "the application is filed, not granted",
  },
  {
    re: /\broom[- ]temperature superconduct/i,
    why: "not demonstrated; would be a Nobel-level claim",
  },
  { re: /\bzero[- ]point energy\b/i, why: "not demonstrated" },
  // Allowed inside an explicit prohibited-claims list, or a negation.
  {
    re: /\bFDA[- ]approved\b/i,
    allowedBy:
      /(never|not|no|avoid|prohibit|do not|cannot|must not|unless it actually is)[^.]{0,90}FDA[- ]approved|FDA[- ]approved[^.]{0,40}(unless|is prohibited|not permitted)|["'“]FDA[- ]approved["'”]/i,
    why: "nothing here is FDA-approved",
  },
  {
    re: /\[(Institution Name|Advisor Name|Insert Date|Insert Contact Info)\]/i,
    why: "unfilled template placeholder",
  },
  { re: /\blorem ipsum\b/i, why: "placeholder copy" },
];

/** [pattern that may appear, the only acceptable surrounding form, reason] */
const ANCHORED = [
  {
    find: /63\/934,?269/g,
    must: /63\/934,269/,
    why: "patent application number must be exact",
  },
  // Only prose claims about coherence need the qualifier. `T2: 8.5` as an
  // object key inside a physics simulation is data, not an assertion.
  {
    find: /T[₂2]\s*(coherence\s*)?[>≥]\s*\d[\d.]*\s*(μs|us|ns)/gi,
    must: /HYPOTHESIS|hypothesis|not confirmed|target|projected/i,
    why: "a stated coherence figure must carry its hypothesis label",
  },
];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (["node_modules", "dist", ".git"].includes(e)) continue;
      walk(p, out);
    } else if ([".tsx", ".ts", ".html", ".md", ".json"].includes(extname(p))) {
      out.push(p);
    }
  }
  return out;
}

const PROJECTION_RULES = [
  {
    file: "client/src/App.tsx",
    required: [
      'Route path="/case-studies"',
      'Route path="/patent-claims"',
      'Route path="/peoples-foundation"',
    ],
    forbidden: [
      "AIInsightsPage",
      "ProjectGallery",
      "GamificationPage",
      "TrainingDashboard",
      'Route path="/admin"',
    ],
  },
  {
    file: "client/src/components/CeremonialIntro.tsx",
    required: ["Skip intro", "User-paced", "Enter TRAI", "Mandate of Mistrust"],
    forbidden: ["trai_visit_count", "watchdog", "autoAdvance"],
  },
  {
    file: "client/src/components/CinematicIntro.tsx",
    required: ["Skip intro", "User-paced", "Enter section"],
    forbidden: ["duration * 1000", "auto-dismiss", "autoAdvance"],
  },
  {
    file: "client/src/pages/CaseStudies.tsx",
    required: [
      "Evidence Before Claims",
      "63/934,269",
      "Measured outcomes",
      "Designed · pilot not operating",
    ],
    forbidden: [
      "Fortune 500 Financial Institution",
      "Government Defense Agency",
      "87%",
      "99.2%",
    ],
  },
  {
    file: "client/src/components/InteractiveTimeline.tsx",
    required: [
      "Pilot not operating",
      "Preprint; not peer reviewed",
      "Measured outcomes represented",
    ],
    forbidden: ["450 pC/N", "5000+", "99.2%", "87%"],
  },
  {
    file: "client/src/pages/CommunityImpact.tsx",
    required: [
      "Designed · not operating",
      "No active hub",
      "not a generative authority",
    ],
    forbidden: ["H.K. AI", "Hub Network Map", "Impact Reports"],
  },
  {
    file: "client/src/components/TechMinutesDashboard.tsx",
    required: [
      "Planning data · no live outcomes",
      "People targeted, not served",
      "No credentials or personal information stored",
    ],
    forbidden: ["Success Rate", "Funding Secured", "Residents Served"],
  },
  {
    file: "client/src/pages/Applications.tsx",
    required: [
      "not a deployment record",
      "Active deployments",
      "Measured outcomes",
    ],
    forbidden: ["Active deployment in wearables", "Commercialization: 2026"],
  },
  {
    file: "client/src/components/InteractiveBlochSphere.tsx",
    required: [
      "no measured coherence values",
      "hypothesis, not confirmed",
      "integrated-composite coherence time",
    ],
    forbidden: ["Real quantum coherence data", "T2: 8.5", "T2: 5.2"],
  },
  {
    file: "client/src/pages/EnergyHarvesting.tsx",
    required: [
      "Patent-application targets · not measured data",
      "integrated TRAI device",
    ],
    forbidden: ["Measured Output", "proven output"],
  },
  {
    file: "client/src/pages/Manufacturing.tsx",
    required: [
      "not a production record",
      "does not represent a qualified line",
      "Required next: documented specimen",
    ],
    forbidden: ["Production ready", "Yield achieved"],
  },
  {
    file: "client/src/pages/ResearchLab.tsx",
    required: [
      "not peer reviewed",
      "No phase is represented as complete",
      "51 peer-reviewed references",
    ],
    forbidden: ["Validation complete", "Experimental Data"],
  },
  {
    file: "client/src/pages/MaterialsScience.tsx",
    required: [
      "Bio-derived multifunctional composites for self-powered sensing",
      "Application sequence · not executed",
      "actual materials or devices",
    ],
    forbidden: ["carbon-negative material", "validated composite"],
  },
  {
    file: "client/src/pages/QuantumResearchEnhanced.tsx",
    required: [
      "Quantum-Sensing Hypothesis",
      "measured coherence data",
      "unconfirmed for the integrated composite",
    ],
    forbidden: ["Quantum Gate Fidelity", "Real quantum coherence data"],
  },
  {
    file: "client/src/pages/HomeSovereign.tsx",
    required: [
      "Mandate of Mistrust",
      "Deterministic H.K. triage",
      "Operating position: §508(c)(1)(A)",
      "https://heruahmose.github.io/QueenCalifia-CyberAI/",
    ],
    forbidden: [
      "queencalifia-cyberai.web.app",
      "H.K. AI triage",
      "federal tax-exempt status pending",
    ],
  },
  {
    file: "client/src/pages/PeoplesFoundation.tsx",
    required: [
      "§508(c)(1)(A)",
      "IRS determination",
      "Not represented",
      "adopted or automatic",
    ],
    forbidden: [
      "Application Pending",
      "tax-exempt status application is pending",
      '{ label: "EIN", status: "Obtained"',
      "automatically, structurally, permanently",
    ],
  },
  {
    file: "client/src/pages/MelaNation.tsx",
    required: [
      "early-development North Carolina logistics concept",
      "No current operations are represented",
      "Documented launch plan",
    ],
    forbidden: ["operating venture", "Documented operating model"],
  },
  {
    file: "client/src/pages/MeLaNiNa.tsx",
    required: [
      "MeLaNiNa remains in development",
      "currently available products",
    ],
    forbidden: ["products available now", "EIN filed"],
  },
  {
    file: "client/src/pages/NuTaMeri.tsx",
    required: [
      "early-development concept",
      "not yet operating",
      "https://heruahmose.github.io/QueenCalifia-CyberAI/",
    ],
    forbidden: ["operating venture", "qc.tamerian-materials.com"],
  },
  {
    file: "client/src/pages/TrueMelangePhi.tsx",
    required: [
      "no shared approval or registration status is assumed",
      "no manufacturing agreement is represented",
      "pending counsel review",
    ],
    forbidden: ["EINs filed for all 4 entities", "Permitted claims"],
  },
  {
    file: "client/src/pages/ContactPage.tsx",
    required: [
      "not a securities offering",
      "no manufacturing agreement",
      "No operating hub",
    ],
    forbidden: [
      "Equity, SAFE, and grant structures available",
      "TechBridge provides everything except the space",
    ],
  },
  {
    file: "client/src/components/PremiumFooter.tsx",
    required: [
      "https://github.com/HeruAhmose",
      "mailto:aitconsult22@gmail.com",
    ],
    forbidden: [
      "href: 'https://github.com',",
      "https://linkedin.com",
      "https://twitter.com",
      "contact@example.com",
      'href="/privacy"',
      'href="/terms"',
      'href="/sitemap"',
    ],
  },
  {
    file: "client/src/components/NewsletterSubscription.tsx",
    required: [
      "This static site has no subscription backend",
      "No address is collected or stored",
    ],
    forbidden: ["Successfully subscribed!", "Simulate API call"],
  },
  {
    file: "client/src/components/HKAssistant.tsx",
    required: [
      "Verified public context · no external model",
      'aria-label="Close H.K. assistant"',
    ],
    forbidden: [
      "Powered by Claude · Memory enabled",
      "Your conversation is remembered across sessions",
    ],
  },
  {
    file: "client/src/components/HKPortalWidget.tsx",
    required: [
      "Verified public context · no external model",
      'aria-label="Send message to H.K."',
    ],
    forbidden: ["TechBridge AI · Claude API"],
  },
  {
    file: "client/src/components/QuantumComputingViz.tsx",
    required: ["Research Targets — Not Measured", "target, not confirmed"],
    forbidden: [
      "Quantum Coherence Data",
      "Quantum Gate Fidelity: 99.7%",
      "Entanglement Entropy: 0.95",
    ],
  },
  {
    file: "server/routers/hkAssistant.ts",
    required: [
      "51 peer-reviewed papers cited",
      "Integrated performance has not been independently validated",
    ],
    forbidden: [
      "150+ experiments conducted",
      "Validation rate: 92%",
      "ISO 10993-5 compliant",
    ],
  },
  {
    file: "client/public/trai-organism-v5.json",
    required: [
      "Operating under §508(c)(1)(A)",
      "https://heruahmose.github.io/QueenCalifia-CyberAI/",
      "Early development · not operating",
      "Designed · not yet operating",
    ],
    forbidden: [
      "queencalifia-cyberai.web.app",
      "exemption pending",
      "EIN filed",
    ],
  },
  {
    file: "client/public/trai-ecosystem.json",
    required: [
      '"doctrine": "Mandate of Mistrust"',
      '"stage": "pre-pilot"',
      "pilot is not yet operating",
      "https://heruahmose.github.io/QueenCalifia-CyberAI/",
    ],
    forbidden: [
      "queencalifia-cyberai.web.app",
      "qc.tamerian-materials.com",
      '"id": "techbridge",\n      "name": "TechBridge",\n      "full": "TechBridge Collective",\n      "role": "Community reach",\n      "url": "https://techbridge-collective.org/",\n      "primary": false,\n      "stage": "live"',
    ],
  },
  {
    file: "README.md",
    required: [
      "Early development",
      "Designed · not yet operating",
      "Experimental dashboards",
    ],
    forbidden: ["EIN filed · early development", "48-page React"],
  },
  {
    file: "VERIFIED_FACTS.md",
    required: [
      "Mandate of Mistrust",
      "Public H.K. uses bounded static guidance",
      "§508(c)(1)(A)",
    ],
    forbidden: ["H.K. powered by Claude AI", "federal tax-exempt pending"],
  },
];

let fail = 0;
let scanned = 0;

for (const root of ROOTS) {
  for (const file of walk(root)) {
    // The guard itself and the facts record must be able to name what is banned.
    if (/check-facts|VERIFIED_FACTS|SECURITY\.md|LICENSE/.test(file)) continue;
    const src = readFileSync(file, "utf8");
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
        const at = src
          .slice(Math.max(0, m.index - 70), m.index + 90)
          .replace(/\s+/g, " ");
        console.error(
          `✗ ${file}\n    matched: "${m[0]}"\n    reason:  ${why}\n    context: …${at}…\n`
        );
        fail++;
      }
    }

    for (const { find, must, why } of ANCHORED) {
      for (const m of src.matchAll(find)) {
        const around = src.slice(Math.max(0, m.index - 200), m.index + 260);
        if (!must.test(around)) {
          console.error(
            `✗ ${file}\n    "${m[0]}" appears without its required qualifier\n    reason:  ${why}\n`
          );
          fail++;
        }
      }
    }
  }
}

for (const { file, required, forbidden } of PROJECTION_RULES) {
  const src = readFileSync(file, "utf8");
  scanned++;

  for (const phrase of required) {
    if (!src.includes(phrase)) {
      console.error(
        "✗ " + file + '\n    required public fact missing: "' + phrase + '"\n'
      );
      fail++;
    }
  }

  for (const phrase of forbidden) {
    if (src.includes(phrase)) {
      console.error(
        "✗ " +
          file +
          '\n    stale or false public fact present: "' +
          phrase +
          '"\n'
      );
      fail++;
    }
  }
}

if (fail) {
  console.error(
    `\nfacts guard: ${fail} violation(s) across ${scanned} files. Build blocked.`
  );
  process.exit(1);
}
console.log(`facts guard: ${scanned} files clean.`);
