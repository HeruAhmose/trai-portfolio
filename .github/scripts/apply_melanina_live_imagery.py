from pathlib import Path

page = Path("client/src/pages/MeLaNiNa.tsx")
facts = Path("scripts/check-facts.mjs")

text = page.read_text(encoding="utf-8")

old_import = 'import { IdentityTextileVisual } from "@/components/OrganVisuals";\n'
new_import = (
    'import { IdentityTextileVisual } from "@/components/OrganVisuals";\n'
    'import { PROVENANCE_LABEL, VIDEO } from "@/lib/media";\n'
)
if new_import not in text:
    if old_import not in text:
        raise SystemExit("MeLaNiNa import anchor not found")
    text = text.replace(old_import, new_import, 1)

old_visual = "          <PyramidMark />"
new_visual = '''          <figure
            data-melanina-collection-archive="true"
            className="relative overflow-hidden border border-[#d6b66a]/25 bg-black shadow-[0_28px_90px_rgba(0,0,0,.45)]"
          >
            <div className="relative aspect-[5/4] overflow-hidden bg-[#080706]">
              <img
                src={VIDEO.melanina.poster}
                alt="MeLaNiNa Collection 001 — Pyramid No Scheme source rendering"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(5,5,5,.82)_100%),radial-gradient(circle_at_50%_40%,transparent_0%,rgba(5,5,5,.14)_72%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[.22] mix-blend-screen">
                <PyramidMark />
              </div>
            </div>
            <figcaption className="flex flex-col gap-2 border-t border-white/10 px-5 py-4 text-[9px] uppercase tracking-[.18em] text-white/42 sm:flex-row sm:items-center sm:justify-between">
              <span>{VIDEO.melanina.caption} · Collection source visual</span>
              <span className="text-[#d6b66a]/70">
                {PROVENANCE_LABEL[VIDEO.melanina.provenance]}
              </span>
            </figcaption>
          </figure>'''
if 'data-melanina-collection-archive="true"' not in text:
    if text.count(old_visual) != 1:
        raise SystemExit(f"Expected exactly one PyramidMark collection anchor, found {text.count(old_visual)}")
    text = text.replace(old_visual, new_visual, 1)

page.write_text(text, encoding="utf-8")

guard_text = facts.read_text(encoding="utf-8")
old_rule = '''  {
    file: "client/src/pages/MeLaNiNa.tsx",
    required: [
      "MeLaNiNa remains in development",
      "currently available products",
    ],
    forbidden: ["products available now", "EIN filed"],
  },'''
new_rule = '''  {
    file: "client/src/pages/MeLaNiNa.tsx",
    required: [
      "MeLaNiNa remains in development",
      "currently available products",
      'data-melanina-collection-archive="true"',
      "VIDEO.melanina.poster",
      "PROVENANCE_LABEL[VIDEO.melanina.provenance]",
      "Collection source visual",
    ],
    forbidden: ["products available now", "EIN filed"],
  },'''
if 'data-melanina-collection-archive=\\"true\\"' not in guard_text and 'data-melanina-collection-archive="true"' not in guard_text:
    if old_rule not in guard_text:
        raise SystemExit("Existing MeLaNiNa facts rule anchor not found")
    guard_text = guard_text.replace(old_rule, new_rule, 1)
facts.write_text(guard_text, encoding="utf-8")

print("MELANINA_PATCH_APPLIED")
print("PAGE_HAS_ARCHIVE_VISUAL=", 'data-melanina-collection-archive="true"' in text)
print("PAGE_USES_REGISTERED_MEDIA=", 'VIDEO.melanina.poster' in text)
print("FACTS_GUARD_PRESENT=", 'VIDEO.melanina.poster' in guard_text and 'PROVENANCE_LABEL[VIDEO.melanina.provenance]' in guard_text)
