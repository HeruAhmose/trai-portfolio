from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def patch(path: str, old: str, new: str, count: int = 1) -> None:
    target = ROOT / path
    text = target.read_text(encoding="utf-8")
    actual = text.count(old)
    if actual != count:
        raise SystemExit(f"{path}: expected {count} occurrence(s), found {actual}: {old[:90]!r}")
    target.write_text(text.replace(old, new), encoding="utf-8")

# Public/documented status surfaces.
patch(
    "VERIFIED_FACTS.md",
    "7. The Peoples Foundation — Lymphatic — separate regenerative-beneficiary affiliate; EIN obtained; tax-exempt status pending counsel confirmation; no tax-exempt determination or recognition represented",
    "7. The Peoples Foundation — Lymphatic — separate regenerative-beneficiary affiliate; EIN obtained; stated federal operating position under §508(c)(1)(A); no IRS determination letter or adjudication of qualification represented",
)

patch(
    "README.md",
    "| 07  | Lymphatic — regenerative return | The Peoples Foundation | EIN obtained · tax-exempt status pending counsel confirmation | **lives here** — [`/peoples-foundation`](client/src/pages/PeoplesFoundation.tsx) — separate regenerative-beneficiary affiliate",
    "| 07  | Lymphatic — regenerative return | The Peoples Foundation | EIN obtained · stated §508(c)(1)(A) operating position        | **lives here** — [`/peoples-foundation`](client/src/pages/PeoplesFoundation.tsx) — separate regenerative-beneficiary affiliate; no IRS determination letter represented",
)

patch(
    "client/src/pages/HomeSovereign.tsx",
    '    desc: "Regenerative return — separate affiliate; EIN obtained; tax-exempt status pending counsel confirmation.",',
    '    desc: "Regenerative return — separate affiliate; EIN obtained; stated federal operating position under §508(c)(1)(A); no IRS determination letter represented.",',
)
patch(
    "client/src/pages/HomeSovereign.tsx",
    """                The Peoples Foundation is a separate regenerative-beneficiary
                affiliate and TRAI's intended regenerative-return organ. EIN
                obtained; tax-exempt status pending counsel confirmation. No
                tax-exempt determination or recognition is represented here;
                future value flows require written governance and evidence.""",
    """                The Peoples Foundation is a separate regenerative-beneficiary
                affiliate and TRAI's intended regenerative-return organ. EIN
                obtained. The Foundation states its federal operating position
                under §508(c)(1)(A); no IRS determination letter or adjudication
                of qualification is represented here. Future value flows require
                written governance and evidence.""",
)
patch(
    "client/src/pages/HomeSovereign.tsx",
    """                  Entity status: EIN obtained. Tax-exempt status pending counsel
                  confirmation. This public site does not represent a tax-exempt
                  determination or recognition. Allocations remain subject to
                  governing documents, written agreements, counsel review, and
                  applicable law.""",
    """                  Federal operating position: §508(c)(1)(A). EIN obtained. No IRS
                  determination letter or adjudication of qualification is
                  represented by this site. Allocations remain subject to governing
                  documents, written agreements, counsel review, and applicable law.""",
)

patch(
    "client/src/pages/PeoplesFoundation.tsx",
    """            The Peoples Foundation is a separate regenerative-beneficiary
            affiliate and the Sovereignty Stack's intended regenerative-return
            organ. EIN obtained; tax-exempt status pending counsel confirmation.""",
    """            The Peoples Foundation is a separate regenerative-beneficiary
            affiliate and the Sovereignty Stack's intended regenerative-return
            organ. EIN obtained; stated federal operating position under
            §508(c)(1)(A). No IRS determination letter is represented.""",
)
patch(
    "client/src/pages/PeoplesFoundation.tsx",
    """                The Peoples Foundation is a separate regenerative-beneficiary
                affiliate. Its EIN has been obtained; tax-exempt status remains
                pending counsel confirmation. No tax-exempt determination or
                recognition is represented. Its community-return architecture
                remains subject to governing documents, written agreements,
                counsel, and applicable law.""",
    """                The Peoples Foundation is a separate regenerative-beneficiary
                affiliate. Its EIN has been obtained. The Foundation states its
                federal operating position under §508(c)(1)(A). Under IRS rules,
                qualifying churches and certain church-related organizations that
                satisfy §501(c)(3) are excepted from the recognition-application
                requirement. This repository does not represent an IRS
                determination letter or adjudication of the Foundation's
                qualification. Its community-return architecture remains subject
                to governing documents, written agreements, counsel, and
                applicable law.""",
)
patch(
    "client/src/pages/PeoplesFoundation.tsx",
    """                  {
                    label: "Tax-exempt status",
                    status: "Pending counsel confirmation",
                    color: "#d8aa43",
                  },
                  {
                    label: "Tax-exempt determination",
                    status: "Not represented",
                    color: "#94a3b8",
                  },""",
    """                  {
                    label: "Federal operating position",
                    status: "§508(c)(1)(A)",
                    color: "#d8aa43",
                  },
                  {
                    label: "IRS determination letter",
                    status: "Not represented",
                    color: "#94a3b8",
                  },""",
)

patch(
    "client/src/components/OrganPortal.tsx",
    '      "EIN obtained · tax-exempt status pending counsel confirmation",',
    '      "EIN obtained · stated federal operating position under §508(c)(1)(A)",',
)
patch(
    "client/src/components/OrganPortal.tsx",
    '      "No tax-exempt determination or recognition is represented",',
    '      "No IRS determination letter or adjudication of qualification is represented",',
)
patch(
    "client/src/components/OrganPortal.tsx",
    '    status: "Entity Formed · Tax-Exempt Status Pending Counsel Confirmation",',
    '    status: "§508(c)(1)(A) Operating Position · No IRS Determination Letter Represented",',
)

patch(
    "client/src/components/SovereignWorldMap.tsx",
    '    desc: "Separate regenerative-beneficiary affiliate. EIN obtained; tax-exempt status pending counsel confirmation. Intended regenerative-return channel.",',
    '    desc: "Separate regenerative-beneficiary affiliate. EIN obtained; stated federal operating position under §508(c)(1)(A); no IRS determination letter represented. Intended regenerative-return channel.",',
)

patch(
    "client/public/trai-ecosystem.json",
    '      "blurb": "Separate regenerative-beneficiary affiliate. EIN obtained; tax-exempt status pending counsel confirmation. No tax-exempt determination or recognition is represented."',
    '      "blurb": "Separate regenerative-beneficiary affiliate. EIN obtained; stated federal operating position under §508(c)(1)(A). No IRS determination letter or adjudication of qualification is represented."',
)

patch(
    "client/public/trai-organism-v5.json",
    '      "synopsis": "The Peoples Foundation is a separate regenerative-beneficiary affiliate and the lymphatic system of the organism, the intended channel through which value returns rather than accumulates. EIN obtained; tax-exempt status pending counsel confirmation. This registry does not represent a tax-exempt determination or recognition.",',
    '      "synopsis": "The Peoples Foundation is a separate regenerative-beneficiary affiliate and the lymphatic system of the organism, the intended channel through which value returns rather than accumulates. EIN obtained; stated federal operating position under §508(c)(1)(A). This registry does not represent an IRS determination letter or adjudication of qualification.",',
)
patch(
    "client/public/trai-organism-v5.json",
    '      "status": "EIN obtained · tax-exempt status pending counsel confirmation",',
    '      "status": "EIN obtained · §508(c)(1)(A) operating position · no IRS determination letter represented",',
)

patch(
    "server/routers/features.ts",
    '      "Separate regenerative-beneficiary affiliate and intended regenerative-return organ; EIN obtained, with tax-exempt status pending counsel confirmation",',
    '      "Separate regenerative-beneficiary affiliate and intended regenerative-return organ; EIN obtained; stated federal operating position under §508(c)(1)(A); no IRS determination letter represented",',
)
patch(
    "server/routers/features.ts",
    '      "entity formed",',
    '      "entity formed",\n      "508(c)(1)(A)",',
)

patch(
    "scripts/audit-built-site.mjs",
    '      "tax-exempt status pending counsel confirmation",',
    '      "§508(c)(1)(A)",\n      "IRS determination letter",',
)

# Build/deploy truth gate: require the stated operating position and reject the superseded copy.
patch(
    ".github/workflows/deploy.yml",
    "          grep -R -Fq 'tax-exempt status pending counsel confirmation' dist/public/assets",
    "          grep -R -Fq '§508(c)(1)(A)' dist/public/assets",
)
patch(
    ".github/workflows/deploy.yml",
    r"|§508\(c\)\(1\)\(A\)|section 508\(c\)\(1\)\(A\)",
    "|tax-exempt status pending counsel confirmation",
)

# Facts guard: §508(c)(1)(A) is no longer forbidden; the superseded pending-counsel claim is.
patch(
    "scripts/check-facts.mjs",
    """  {
    re: /§508\\s*\\(c\\)\\s*\\(1\\)\\s*\\(A\\)|section\\s+508\\s*\\(c\\)\\s*\\(1\\)\\s*\\(A\\)/i,
    why: "the prior Foundation tax-status claim is superseded and unsupported by the current record",
  },""",
    """  {
    re: /tax-exempt status pending counsel confirmation/i,
    why: "the Foundation's stated §508(c)(1)(A) operating position supersedes this prior pending-counsel wording",
  },""",
)

old_blocks = {
"home": """  {
    file: "client/src/pages/HomeSovereign.tsx",
    required: [
      "Mandate of Mistrust",
      "Deterministic H.K. triage",
      "EIN obtained",
      "tax-exempt status pending counsel confirmation",
      "separate regenerative-beneficiary",
      "https://heruahmose.github.io/QueenCalifia-CyberAI/",
    ],
    forbidden: [
      "queencalifia-cyberai.web.app",
      "H.K. AI triage",
      "federal tax-exempt status pending",
      "§508(c)(1)(A)",
    ],
  },""",
"foundation": """  {
    file: "client/src/pages/PeoplesFoundation.tsx",
    required: [
      "regenerative-beneficiary",
      "EIN obtained",
      "tax-exempt status pending counsel confirmation",
      "No tax-exempt determination",
      "adopted or automatic",
    ],
    forbidden: [
      "Application Pending",
      "tax-exempt status application is pending",
      "automatically, structurally, permanently",
      "§508(c)(1)(A)",
    ],
  },""",
"worldmap": """  {
    file: "client/src/components/SovereignWorldMap.tsx",
    required: [
      "Separate regenerative-beneficiary affiliate",
      "EIN obtained",
      "tax-exempt status pending counsel confirmation",
    ],
    forbidden: ["§508(c)(1)(A)"],
  },""",
"portal": """  {
    file: "client/src/components/OrganPortal.tsx",
    required: [
      "Separate regenerative-beneficiary affiliate",
      "EIN obtained · tax-exempt status pending counsel confirmation",
      "No tax-exempt determination or recognition is represented",
      "Entity Formed · Tax-Exempt Status Pending Counsel Confirmation",
    ],
    forbidden: ["§508(c)(1)(A)"],
  },""",
"server": """  {
    file: "server/routers/features.ts",
    required: [
      "Separate regenerative-beneficiary affiliate",
      "EIN obtained",
      "tax-exempt status pending counsel confirmation",
      '\"entity formed\"',
    ],
    forbidden: ["508(c)(1)(A)"],
  },""",
"organism": """  {
    file: "client/public/trai-organism-v5.json",
    required: [
      "separate regenerative-beneficiary affiliate",
      "EIN obtained · tax-exempt status pending counsel confirmation",
      "does not represent a tax-exempt determination or recognition",
      "https://heruahmose.github.io/QueenCalifia-CyberAI/",
      "Early development · not operating",
      "Designed · not yet operating",
    ],
    forbidden: [
      "queencalifia-cyberai.web.app",
      "exemption pending",
      "EIN filed",
      "§508(c)(1)(A)",
    ],
  },""",
"ecosystem": """  {
    file: "client/public/trai-ecosystem.json",
    required: [
      '\"doctrine\": \"Mandate of Mistrust\"',
      '\"stage\": \"pre-pilot\"',
      '\"stage\": \"entity-formed\"',
      "pilot is not yet operating",
      "EIN obtained; tax-exempt status pending counsel confirmation",
      "https://heruahmose.github.io/QueenCalifia-CyberAI/",
    ],
    forbidden: [
      "queencalifia-cyberai.web.app",
      "qc.tamerian-materials.com",
      "§508(c)(1)(A)",
      '\"id\": \"techbridge\",\\n      \"name\": \"TechBridge\",\\n      \"full\": \"TechBridge Collective\",\\n      \"role\": \"Community reach\",\\n      \"url\": \"https://techbridge-collective.org/\",\\n      \"primary\": false,\\n      \"stage\": \"live\"',
    ],
  },""",
"readme": """  {
    file: "README.md",
    required: [
      "Early development",
      "Designed · not yet operating",
      "Experimental dashboards",
      "EIN obtained · tax-exempt status pending counsel confirmation",
      "separate regenerative-beneficiary affiliate",
    ],
    forbidden: [
      "EIN filed · early development",
      "48-page React",
      "§508(c)(1)(A)",
    ],
  },""",
"facts": """  {
    file: "VERIFIED_FACTS.md",
    required: [
      "Mandate of Mistrust",
      "Public H.K. uses bounded static guidance",
      "separate regenerative-beneficiary affiliate",
      "EIN obtained",
      "tax-exempt status pending counsel confirmation",
    ],
    forbidden: [
      "H.K. powered by Claude AI",
      "federal tax-exempt pending",
      "§508(c)(1)(A)",
    ],
  },""",
"audit": """  {
    file: "scripts/audit-built-site.mjs",
    required: [
      'const cdpEndpoint = \"http://127.0.0.1:9222\"',
      'const reportPath = \"/tmp/trai-browser-audit.json\"',
      '\"http://127.0.0.1:4173/trai-portfolio/\"',
      '\"https://heruahmose.github.io/trai-portfolio/\"',
      "allowedBaseUrl(candidate.url)",
      "tax-exempt status pending counsel confirmation",
    ],
    forbidden: [
      "TRAI_AUDIT_MODE",
      "TRAI_CDP_URL",
      "TRAI_BASE_URL",
      "TRAI_AUDIT_REPORT",
    ],
  },""",
"deploy": """  {
    file: ".github/workflows/deploy.yml",
    required: [
      "cat /tmp/trai-browser-audit.json",
      "--remote-debugging-port=9222",
      "tax-exempt status pending counsel confirmation",
    ],
    forbidden: [
      "TRAI_AUDIT_MODE",
      "TRAI_CDP_URL",
      "TRAI_BASE_URL",
      "TRAI_AUDIT_REPORT",
      "Operating position: §508(c)(1)(A)",
    ],
  },""",
}

new_blocks = {
"home": """  {
    file: "client/src/pages/HomeSovereign.tsx",
    required: [
      "Mandate of Mistrust",
      "Deterministic H.K. triage",
      "EIN obtained",
      "§508(c)(1)(A)",
      "federal operating position",
      "IRS determination letter",
      "separate regenerative-beneficiary",
      "https://heruahmose.github.io/QueenCalifia-CyberAI/",
    ],
    forbidden: [
      "queencalifia-cyberai.web.app",
      "H.K. AI triage",
      "federal tax-exempt status pending",
      "tax-exempt status pending counsel confirmation",
    ],
  },""",
"foundation": """  {
    file: "client/src/pages/PeoplesFoundation.tsx",
    required: [
      "regenerative-beneficiary",
      "EIN obtained",
      "§508(c)(1)(A)",
      "federal operating position",
      "IRS determination letter",
      "qualifying churches",
      "§501(c)(3)",
      "adopted or automatic",
    ],
    forbidden: [
      "Application Pending",
      "tax-exempt status application is pending",
      "tax-exempt status pending counsel confirmation",
      "automatically, structurally, permanently",
    ],
  },""",
"worldmap": """  {
    file: "client/src/components/SovereignWorldMap.tsx",
    required: [
      "Separate regenerative-beneficiary affiliate",
      "EIN obtained",
      "§508(c)(1)(A)",
      "IRS determination letter",
    ],
    forbidden: ["tax-exempt status pending counsel confirmation"],
  },""",
"portal": """  {
    file: "client/src/components/OrganPortal.tsx",
    required: [
      "Separate regenerative-beneficiary affiliate",
      "EIN obtained · stated federal operating position under §508(c)(1)(A)",
      "No IRS determination letter or adjudication of qualification is represented",
      "§508(c)(1)(A) Operating Position · No IRS Determination Letter Represented",
    ],
    forbidden: ["tax-exempt status pending counsel confirmation"],
  },""",
"server": """  {
    file: "server/routers/features.ts",
    required: [
      "Separate regenerative-beneficiary affiliate",
      "EIN obtained",
      "§508(c)(1)(A)",
      "no IRS determination letter represented",
      '\"entity formed\"',
    ],
    forbidden: ["tax-exempt status pending counsel confirmation"],
  },""",
"organism": """  {
    file: "client/public/trai-organism-v5.json",
    required: [
      "separate regenerative-beneficiary affiliate",
      "§508(c)(1)(A)",
      "IRS determination letter",
      "https://heruahmose.github.io/QueenCalifia-CyberAI/",
      "Early development · not operating",
      "Designed · not yet operating",
    ],
    forbidden: [
      "queencalifia-cyberai.web.app",
      "exemption pending",
      "EIN filed",
      "tax-exempt status pending counsel confirmation",
    ],
  },""",
"ecosystem": """  {
    file: "client/public/trai-ecosystem.json",
    required: [
      '\"doctrine\": \"Mandate of Mistrust\"',
      '\"stage\": \"pre-pilot\"',
      '\"stage\": \"entity-formed\"',
      "pilot is not yet operating",
      "§508(c)(1)(A)",
      "IRS determination letter",
      "https://heruahmose.github.io/QueenCalifia-CyberAI/",
    ],
    forbidden: [
      "queencalifia-cyberai.web.app",
      "qc.tamerian-materials.com",
      "tax-exempt status pending counsel confirmation",
      '\"id\": \"techbridge\",\\n      \"name\": \"TechBridge\",\\n      \"full\": \"TechBridge Collective\",\\n      \"role\": \"Community reach\",\\n      \"url\": \"https://techbridge-collective.org/\",\\n      \"primary\": false,\\n      \"stage\": \"live\"',
    ],
  },""",
"readme": """  {
    file: "README.md",
    required: [
      "Early development",
      "Designed · not yet operating",
      "Experimental dashboards",
      "EIN obtained · stated §508(c)(1)(A) operating position",
      "no IRS determination letter represented",
      "separate regenerative-beneficiary affiliate",
    ],
    forbidden: [
      "EIN filed · early development",
      "48-page React",
      "tax-exempt status pending counsel confirmation",
    ],
  },""",
"facts": """  {
    file: "VERIFIED_FACTS.md",
    required: [
      "Mandate of Mistrust",
      "Public H.K. uses bounded static guidance",
      "separate regenerative-beneficiary affiliate",
      "EIN obtained",
      "§508(c)(1)(A)",
      "no IRS determination letter",
    ],
    forbidden: [
      "H.K. powered by Claude AI",
      "federal tax-exempt pending",
      "tax-exempt status pending counsel confirmation",
    ],
  },""",
"audit": """  {
    file: "scripts/audit-built-site.mjs",
    required: [
      'const cdpEndpoint = \"http://127.0.0.1:9222\"',
      'const reportPath = \"/tmp/trai-browser-audit.json\"',
      '\"http://127.0.0.1:4173/trai-portfolio/\"',
      '\"https://heruahmose.github.io/trai-portfolio/\"',
      "allowedBaseUrl(candidate.url)",
      "§508(c)(1)(A)",
      "IRS determination letter",
    ],
    forbidden: [
      "TRAI_AUDIT_MODE",
      "TRAI_CDP_URL",
      "TRAI_BASE_URL",
      "TRAI_AUDIT_REPORT",
      "tax-exempt status pending counsel confirmation",
    ],
  },""",
"deploy": """  {
    file: ".github/workflows/deploy.yml",
    required: [
      "cat /tmp/trai-browser-audit.json",
      "--remote-debugging-port=9222",
      "§508(c)(1)(A)",
    ],
    forbidden: [
      "TRAI_AUDIT_MODE",
      "TRAI_CDP_URL",
      "TRAI_BASE_URL",
      "TRAI_AUDIT_REPORT",
      "tax-exempt status pending counsel confirmation",
    ],
  },""",
}

for key in old_blocks:
    patch("scripts/check-facts.mjs", old_blocks[key], new_blocks[key])

# Ensure no stale pending-counsel wording survives in authoritative Foundation surfaces.
for rel in [
    "README.md",
    "VERIFIED_FACTS.md",
    "client/src/pages/HomeSovereign.tsx",
    "client/src/pages/PeoplesFoundation.tsx",
    "client/src/components/OrganPortal.tsx",
    "client/src/components/SovereignWorldMap.tsx",
    "client/public/trai-ecosystem.json",
    "client/public/trai-organism-v5.json",
    "server/routers/features.ts",
    "scripts/audit-built-site.mjs",
]:
    text = (ROOT / rel).read_text(encoding="utf-8")
    if "tax-exempt status pending counsel confirmation" in text:
        raise SystemExit(f"{rel}: stale pending-counsel status remains")

print("FOUNDATION_508_PATCH=PASS")
