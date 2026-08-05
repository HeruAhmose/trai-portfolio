/**
 * Media registry — the single source of truth for every asset on the site.
 *
 * `provenance` is required on every entry, and the UI always renders it. The
 * site already distinguishes "Built" from "EIN filed" for ventures; this does
 * the same job for imagery, so a generated illustration can sit beside a 2006
 * photograph without either borrowing the other's credibility.
 *
 *   photograph — a real photograph of a real thing
 *   rendering  — a generated illustration of a real programme
 *   concept    — a speculative design visual for work in R&D
 *
 * Assets excluded during processing (minors, third parties who have not
 * consented, other people's signatures, garbled generated text) are recorded
 * in scripts/media-pipeline.py rather than here, so the reasoning survives.
 */

export type Provenance = 'photograph' | 'rendering' | 'concept';

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  photograph: 'Photograph',
  rendering: 'Rendering',
  concept: 'Concept — in development',
};

export interface MediaItem {
  src: string;
  alt: string;
  caption: string;
  provenance: Provenance;
  year?: string;
  /** Portrait assets get taller grid cells. */
  portrait?: boolean;
}

export interface VideoItem {
  src: string;
  poster: string;
  caption: string;
  provenance: Provenance;
}

/* ------------------------------------------------------------------ archive
   Verifiable photographs. The founder's own record: discipline, service,
   recognition — and a father's jersey number that became his own. */
export const ARCHIVE: MediaItem[] = [
  {
    src: '/media/archive/salisbury-44.jpg',
    alt: 'A Salisbury High School football player in a number 44 jersey, kneeling with a helmet',
    caption: 'Salisbury High, №44 — the father',
    provenance: 'photograph',
    portrait: true,
  },
  {
    src: '/media/archive/newspaper-portrait.jpg',
    alt: 'Jonathan Peoples seated in a school library, photographed for a newspaper feature',
    caption: 'Kannapolis Citizen feature — senior year',
    provenance: 'photograph',
  },
  {
    src: '/media/archive/kannapolis-carry.jpg',
    alt: 'A Kannapolis running back in green carrying the ball through a tackle under floodlights',
    caption: 'Kannapolis, №6 — a number chosen, not inherited',
    provenance: 'photograph',
    portrait: true,
  },
  {
    src: '/media/archive/kannapolis-sideline.jpg',
    alt: 'Kannapolis football players in green helmets gathered on the sideline',
    caption: 'Friday nights, K-Town',
    provenance: 'photograph',
  },
  {
    src: '/media/archive/track-handoff.jpg',
    alt: 'Two Kannapolis sprinters mid-handoff in a relay exchange',
    caption: 'The exchange — relay, Kannapolis track',
    provenance: 'photograph',
    portrait: true,
  },
  {
    src: '/media/archive/track-dash.jpg',
    alt: 'Sprinters at full speed down a track straightaway',
    caption: 'Open track',
    provenance: 'photograph',
  },
  {
    src: '/media/archive/maritime-carry.jpg',
    alt: 'A SUNY Maritime running back in navy breaking through the defensive line',
    caption: 'SUNY Maritime, №6',
    provenance: 'photograph',
    portrait: true,
  },
  {
    src: '/media/archive/maritime-huddle.jpg',
    alt: 'SUNY Maritime players raising helmets together after a game',
    caption: 'Helmets up',
    provenance: 'photograph',
  },
  {
    src: '/media/archive/navy-whites.jpg',
    alt: 'Midshipmen in Navy dress whites gathered for a group photograph',
    caption: 'Dress whites — U.S. Navy',
    provenance: 'photograph',
  },
  {
    src: '/media/archive/ktown-top20.jpg',
    alt: 'A Friday Nights in K-Town graphic listing the top 20 running backs of all time',
    caption: '№14 all-time — Friday Nights in K-Town',
    provenance: 'photograph',
  },
];

/* ---------------------------------------------------------------- tamerian
   Renderings. Illustrations of a real, patent-anchored materials programme —
   never presented as micrographs or measurements. */
export const TAMERIAN: MediaItem[] = [
  {
    src: '/media/tamerian/living-circuit.jpg',
    alt: 'An isometric rendering of a layered crystalline substrate with gold circuit tracery and an orbiting core',
    caption: 'The Living Circuit — layered substrate study',
    provenance: 'rendering',
  },
  {
    src: '/media/tamerian/butterfly-wing.jpg',
    alt: 'A butterfly wing in iridescent teal with circuit-like traces following the wing veins',
    caption: 'Structural colour — wing scale as conductor',
    provenance: 'rendering',
    portrait: true,
  },
  {
    src: '/media/tamerian/gecko-toe.jpg',
    alt: 'A gecko toe pad rendered with concentric interference rings across each pad',
    caption: 'Setae — adhesion without adhesive',
    provenance: 'rendering',
    portrait: true,
  },
  {
    src: '/media/tamerian/lattice.jpg',
    alt: 'A dense silver cellular lattice with coloured nodes distributed across its membranes',
    caption: 'Lattice study — node distribution',
    provenance: 'rendering',
  },
  {
    src: '/media/tamerian/honeycomb.jpg',
    alt: 'Honeycomb geometry surrounded by molecular clusters and leaf venation on white',
    caption: 'Hexagonal packing — biological precedent',
    provenance: 'rendering',
  },
  {
    src: '/media/tamerian/helix-lab.jpg',
    alt: 'A rendering of luminous double helices suspended above a laboratory table',
    caption: 'Helix study',
    provenance: 'rendering',
  },
  {
    src: '/media/tamerian/coral-forms.jpg',
    alt: 'Abstract coloured columnar forms interleaved with coral-like structures',
    caption: 'Growth forms — columnar study',
    provenance: 'rendering',
  },
  {
    src: '/media/tamerian/chamber-rendering.jpg',
    alt: 'A rendering of a vacuum chamber apparatus in a clean laboratory',
    caption: 'Chamber study — a rendering, not a facility',
    provenance: 'rendering',
  },
];

/* ----------------------------------------------------------------- concept
   Design visuals for R&D-stage technologies. */
export const CONCEPT: MediaItem[] = [
  {
    src: '/media/concept/helm-crown.jpg',
    alt: 'A crown of upright crystal prisms above concentric rings of light',
    caption: 'The Tamerian Helm — crown geometry',
    provenance: 'concept',
    portrait: true,
  },
  {
    src: '/media/concept/helm-section.jpg',
    alt: 'A sectioned helmet rendering showing layered crystal and lattice interior structure',
    caption: 'The Tamerian Helm — layer section',
    provenance: 'concept',
    portrait: true,
  },
];

/* ------------------------------------------------------------------- video */
export const VIDEO: Record<string, VideoItem> = {
  tamerianProject: {
    src: '/media/video/tamerian-project.mp4',
    poster: '/media/video/tamerian-project-poster.jpg',
    caption: 'The Tamerian Project',
    provenance: 'rendering',
  },
  tamerianCompose: {
    src: '/media/video/tamerian-compose.mp4',
    poster: '/media/video/tamerian-compose-poster.jpg',
    caption: 'The Tamerian Project — composition',
    provenance: 'rendering',
  },
  butterfly: {
    src: '/media/video/digital-butterfly.mp4',
    poster: '/media/video/digital-butterfly-poster.jpg',
    caption: 'Digital butterfly',
    provenance: 'rendering',
  },
  melanina: {
    src: '/media/video/melanina.mp4',
    poster: '/media/video/melanina-poster.jpg',
    caption: 'Introducing MeLaNiNa Aesthetics',
    provenance: 'rendering',
  },
};

/* ------------------------------------------- proprietary technologies
   Section 7 of the TRAI business plan. Stage is stated for each, using the
   same vocabulary the ventures use elsewhere on the site, so nothing in
   R&D reads as shipped. */
export interface Technology {
  name: string;
  role: string;
  body: string;
  stage: string;
  media?: MediaItem;
  video?: VideoItem;
}

export const TECHNOLOGIES: Technology[] = [
  {
    name: 'Tamerian Ore',
    role: 'The substrate',
    body: 'A hemp-derived carbon composite carrying piezoelectric quartz and tourmaline, magnetite and rare-earth dopants in one body, so a single material converts mechanical, thermal and magnetic gradients at once.',
    stage: 'Patent filed · 63/934,269 · 25 claims',
    media: TAMERIAN[0],
  },
  {
    name: 'The Tamerian Circuit',
    role: 'The processor',
    body: 'A biomimetic processing architecture drawing its pathway topology from biological nerve structure rather than conventional die layout.',
    stage: 'Research and development',
    media: TAMERIAN[3],
  },
  {
    name: 'The Tamerian Engine',
    role: 'The converter',
    body: 'The energy-conversion programme built on the Ore substrate, targeting multi-modal harvesting from ambient mechanical, thermal and magnetic sources.',
    stage: 'Research and development',
    media: TAMERIAN[6],
  },
  {
    name: 'Tamerian Helm',
    role: 'The interface',
    body: 'A wearable interface concept pairing the Ore substrate with a layered crystal geometry. The crown and section studies are design work; the underlying materials science is the Ore programme.',
    stage: 'Research and development',
    media: CONCEPT[0],
  },
  {
    name: 'Queen Califia AI',
    role: 'The intelligence',
    body: 'An autonomous cybersecurity platform on a triple-core architecture — Cyber, Identity and Markets — with a generative training engine.',
    stage: 'Deployed',
    media: TAMERIAN[5],
  },
  {
    name: 'Tameric Syntax',
    role: 'The language',
    body: 'A multi-layer programming language specification developed to express the architecture across the rest of the stack.',
    stage: 'Research and development',
    media: TAMERIAN[4],
  },
];
