/**
 * OrganPortal — the immersive full-screen experience behind each organ card.
 *
 * Replaces the previous behaviour, where clicking a card navigated away and the
 * `activeOrgan` state was declared but never set. This is a real modal:
 * focus-trapped, Escape-closable, scroll-locked, `aria-modal`, with a live
 * visualisation and the organ's verified figures.
 *
 * Every number below is drawn from VERIFIED_FACTS.md. Nothing is invented, and
 * the one hypothesis in the set is labelled as such.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import OrganCanvas, { OrganKey } from './OrganCanvas';
import sovereignAudio from '@/lib/sovereignAudio';

export interface OrganDatum {
  num: string;
  role: string;
  name: string;
  key: OrganKey;
  tagline: string;
  body: string;
  metrics: { k: string; v: string; note?: string }[];
  route: string | null;
  external: string | null;
  status: string;
}

export const ORGAN_DATA: OrganDatum[] = [
  {
    num: '01',
    role: 'Skeleton',
    name: 'Tamerian Materials',
    key: 'skeleton',
    tagline: 'Material sovereignty',
    body: 'A hemp-derived carbon composite engineered for multi-modal energy harvesting and quantum sensing. The hemp-carbon matrix carries piezoelectric quartz and tourmaline, magnetite, and rare-earth dopants in a single body, so one material converts mechanical, thermal and magnetic gradients at once.',
    metrics: [
      { k: 'Patent', v: '63/934,269', note: 'Filed Dec 11 2025 · 25 claims · Conf #6305' },
      { k: 'Hemp-carbon matrix', v: '40–70 vol%', note: 'Pyrolysis 700–1400 °C' },
      { k: 'Conductivity', v: '10²–10⁶ S/m' },
      { k: 'Piezo output', v: '50–500 μW/cm²' },
      { k: 'Combined output', v: '80–800 μW/cm²' },
      { k: 'Thermoelectric ZT', v: '1.0–2.5', note: '5–10× Bi₂Te₃' },
      { k: 'Spin-Seebeck', v: '+40–60%' },
      { k: 'Coherence T₂', v: '>500 ns', note: 'HYPOTHESIS — not confirmed' },
      { k: 'Literature', v: '51 papers cited' },
    ],
    route: '/materials',
    external: 'https://tamerian-materials.com/',
    status: 'Patent filed · entity pending',
  },
  {
    num: '02',
    role: 'Heart',
    name: 'True Melange Φ',
    key: 'heart',
    tagline: 'Biological sovereignty',
    body: 'A saffron-hemp biotechnology platform. The first product is Blue-Gold Daily, a ready-to-drink tea built on a saffron dose matching a published 12-week randomised controlled trial, with colour from an alga and a flower rather than a dye.',
    metrics: [
      { k: 'Saffron', v: '28 mg', note: 'Affron® · Pharmactive · single-sourced' },
      { k: 'Standardisation', v: '≥3.5% Lepticrosalides®', note: 'US10933110B2' },
      { k: 'Grade', v: 'ISO 3632 Cat I' },
      { k: 'Primary colour', v: '21 CFR 73.167', note: 'Galdieria extract blue' },
      { k: 'Accent colour', v: '21 CFR 73.69', note: 'Butterfly pea · teas authorised' },
      { k: 'Hemp inputs', v: 'GRN 765/771/778', note: 'No CBD · no THC' },
      { k: 'Format', v: '12 oz sleek can', note: '$7–10 · DTC-first' },
      { k: 'Co-packer', v: 'In outreach', note: 'Carolina Beverage · Niche Beverage' },
    ],
    route: '/true-melange',
    external: null,
    status: 'Formulation locked · pre-production',
  },
  {
    num: '03',
    role: 'Brain',
    name: 'Queen Califia',
    key: 'brain',
    tagline: 'Cognitive sovereignty',
    body: 'An autonomous cybersecurity platform on a triple-core architecture — Cyber Core, Identity Core and Markets Core — with a generative training engine. It secures the portfolio’s intellectual property and operations, and stands as its own product.',
    metrics: [
      { k: 'Architecture', v: 'Triple-core', note: 'Cyber · Identity · Markets' },
      { k: 'Stack', v: 'Flask / React' },
      { k: 'Deployment', v: 'Live', note: 'queencalifia-cyberai.web.app' },
      { k: 'Named for', v: 'Queen Califia', note: 'Black warrior queen, 1510 novel' },
      { k: 'Designations', v: 'Veteran-owned · Black-owned' },
    ],
    route: '/queen-califia',
    external: 'https://queencalifia-cyberai.web.app/',
    status: 'Deployed · entity pending',
  },
  {
    num: '04',
    role: 'Vessels',
    name: 'Mela Nation',
    key: 'vessels',
    tagline: 'Mobility sovereignty',
    body: 'The circulatory layer. Movement of materials and people, last-mile logistics, community access and supply-chain resilience — the routes that let every other organ reach the places it serves.',
    metrics: [
      { k: 'Function', v: 'Circulatory' },
      { k: 'Scope', v: 'Last-mile logistics' },
      { k: 'Serves', v: 'All ventures' },
      { k: 'Entity', v: 'EIN filed' },
    ],
    route: '/mela-nation',
    external: null,
    status: 'EIN filed · early development',
  },
  {
    num: '05',
    role: 'Skin',
    name: 'MeLaNiNa',
    key: 'skin',
    tagline: 'Identity sovereignty',
    body: 'The visible layer. Hemp apparel and cultural expression carrying employee-ownership and wealth pathways — the surface the world reads first, made from the same crop that runs through the rest of the body.',
    metrics: [
      { k: 'Function', v: 'Identity' },
      { k: 'Material', v: 'Hemp textile' },
      { k: 'Model', v: 'Employee-ownership pathways' },
      { k: 'Entity', v: 'EIN filed' },
    ],
    route: '/melanina',
    external: null,
    status: 'EIN filed · early development',
  },
  {
    num: '06',
    role: 'Hands',
    name: 'TechBridge',
    key: 'hands',
    tagline: 'Community reach',
    body: 'Community technology hubs staffed by paid Digital Navigators, with H.K. — an assistant powered by Claude — carrying the load between visits. Named for Horace King, the enslaved master bridge builder whose spans still stand.',
    metrics: [
      { k: 'Need', v: '1.2M NC residents', note: 'lack digital access' },
      { k: 'Investment', v: '$250K / 2 years' },
      { k: 'Year 1', v: '2 hubs · 4 Navigators' },
      { k: 'Year 2', v: '4 hubs' },
      { k: 'Reach', v: '3,200 residents', note: 'serviceable obtainable market' },
      { k: 'Navigator pay', v: '$20/hr' },
      { k: 'Named for', v: 'Horace King', note: 'enslaved master bridge builder' },
    ],
    route: '/community',
    external: 'https://techbridge-collective.org/',
    status: 'Site live · entity pending',
  },
  {
    num: '07',
    role: 'Lymphatic',
    name: 'The Peoples Foundation',
    key: 'lymphatic',
    tagline: 'Regenerative return',
    body: 'The layer that closes the loop. Designed to receive defined charitable allocations from the ventures and return them to the community as programs — the reason the architecture is regenerative rather than merely commercial.',
    metrics: [
      { k: 'Form', v: '508(c)(1)(a)' },
      { k: 'Entity', v: 'EIN obtained', note: 'federal tax-exempt pending' },
      { k: 'Function', v: 'Beneficiary layer' },
      { k: 'Programs', v: 'Community return' },
    ],
    route: null,
    external: null,
    status: 'EIN obtained · exempt status pending',
  },
];

interface Props {
  index: number | null;
  onClose: () => void;
  /** Move to another organ without leaving the portal. */
  onNavigate: (i: number) => void;
}

export const OrganPortal: React.FC<Props> = ({ index, onClose, onNavigate }) => {
  const [, navigate] = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const open = index !== null;

  /* Presence is managed explicitly rather than left to AnimatePresence, which
     was leaving the fixed-position wrapper mounted after close — an invisible
     overlay across the whole page. `shown` drives the animation; `mounted`
     drives the DOM, and is always cleared on a timer we control. */
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [held, setHeld] = useState<number>(0);

  useEffect(() => {
    if (index !== null) {
      setHeld(index);
      setMounted(true);
      const r = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(r);
    }
    setShown(false);
    // Unmount is driven by the fade completing (below). This timer is a
    // backstop so the fixed overlay can never survive a missed callback.
    const t = window.setTimeout(() => setMounted(false), 340);
    return () => window.clearTimeout(t);
  }, [index]);

  const organ = ORGAN_DATA[held] ?? ORGAN_DATA[0];

  const close = useCallback(() => {
    if (index !== null) sovereignAudio.portalClose(index);
    onClose();
  }, [index, onClose]);

  /* Scroll lock, focus capture and restore */
  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const id = window.setTimeout(() => panelRef.current?.focus(), 40);
    panelRef.current?.scrollTo?.({ top: 0 });
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(id);
      restoreTo.current?.focus?.();
    };
  }, [open, index]);

  /* Escape to close, Tab trapped inside the panel */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const f = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      const inside = panelRef.current.contains(document.activeElement);
      if (!inside) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!mounted) return null;

  return (
    <>
      {(
        <motion.div
          key="organ-portal"
          className="fixed inset-0 z-[100] flex items-stretch"
          style={{ pointerEvents: shown ? 'auto' : 'none' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: shown ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => {
            if (!shown) setMounted(false);
          }}
        >
          <div
            className="absolute inset-0 bg-[#050709]/94 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="organ-portal-title"
            className="relative z-10 w-full h-full overflow-y-auto outline-none"
            initial={{ y: 26, opacity: 0 }}
            animate={{ y: shown ? 0 : 16, opacity: shown ? 1 : 0 }}
            transition={{ duration: 0.36, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Live visualisation, full bleed behind the content */}
            <div className="absolute inset-0 pointer-events-none">
              <OrganCanvas organ={organ.key} className="w-full h-full opacity-45" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050709] via-[#050709]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050709] via-transparent to-[#050709]/80" />
            </div>

            <div className="relative max-w-[1380px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
              <div className="flex items-start justify-between gap-6 mb-12">
                <div>
                  <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 font-sans mb-3">
                    {organ.num} — {organ.role} · {organ.tagline}
                  </p>
                  <h2
                    id="organ-portal-title"
                    className="text-[clamp(2.4rem,6vw,4.6rem)] font-bold leading-[1.02]"
                    style={{ color: '#f4f0e6', WebkitTextFillColor: '#f4f0e6' }}
                  >
                    {organ.name}
                  </h2>
                </div>
                <button
                  onClick={close}
                  className="shrink-0 border border-[#d8aa43]/30 text-[#d8aa43] px-4 py-2 text-xs tracking-[0.18em] uppercase font-sans hover:bg-[#d8aa43] hover:text-[#050709] transition-colors"
                  aria-label="Close and return to the organism"
                >
                  Close ✕
                </button>
              </div>

              <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20">
                <div>
                  <p className="text-[#f4f0e6]/72 font-sans leading-relaxed text-[1.02rem] max-w-[60ch]">
                    {organ.body}
                  </p>
                  <p className="mt-8 text-xs font-sans tracking-[0.16em] uppercase text-[#d8aa43]/60">
                    Status · {organ.status}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-10">
                    {organ.external && (
                      <a
                        href={organ.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-[#d8aa43] text-[#d8aa43] px-6 py-3 text-xs tracking-[0.18em] uppercase font-sans hover:bg-[#d8aa43] hover:text-[#050709] transition-colors"
                      >
                        Visit live site ↗
                      </a>
                    )}
                    {organ.route && (
                      <button
                        onClick={() => {
                          close();
                          navigate(organ.route!);
                        }}
                        className="border border-[#d8aa43]/25 text-[#f4f0e6]/70 px-6 py-3 text-xs tracking-[0.18em] uppercase font-sans hover:border-[#d8aa43]/60 hover:text-[#f4f0e6] transition-colors"
                      >
                        Full detail →
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs tracking-[0.22em] uppercase text-[#d8aa43]/70 font-sans mb-5">
                    Verified figures
                  </p>
                  <dl className="border-t border-[#d8aa43]/12">
                    {organ.metrics.map((m) => (
                      <div
                        key={m.k}
                        className="grid grid-cols-[1fr_auto] gap-4 py-3 border-b border-[#d8aa43]/12 items-baseline"
                      >
                        <dt className="text-xs font-sans tracking-wide text-[#f4f0e6]/55">
                          {m.k}
                          {m.note && (
                            <span className="block text-[0.68rem] text-[#f4f0e6]/32 mt-0.5">
                              {m.note}
                            </span>
                          )}
                        </dt>
                        <dd className="font-mono text-sm text-[#d8aa43] text-right">{m.v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-5 text-[0.68rem] font-sans text-[#f4f0e6]/28 leading-relaxed">
                    Figures are drawn from the project’s verified-facts record. Where a value is a
                    hypothesis rather than a measurement, it is labelled.
                  </p>
                </div>
              </div>

              {/* Lateral navigation between organs, without leaving the portal */}
              <div className="mt-16 pt-8 border-t border-[#d8aa43]/12 flex flex-wrap gap-2">
                {ORGAN_DATA.map((o, i) => (
                  <button
                    key={o.num}
                    onClick={() => {
                      if (i === index) return;
                      sovereignAudio.select(i);
                      onNavigate(i);
                    }}
                    aria-current={i === index ? 'true' : undefined}
                    className={`px-3 py-2 text-[0.66rem] font-sans tracking-[0.14em] uppercase border transition-colors ${
                      i === index
                        ? 'border-[#d8aa43] text-[#d8aa43]'
                        : 'border-[#d8aa43]/15 text-[#f4f0e6]/45 hover:border-[#d8aa43]/45 hover:text-[#f4f0e6]/80'
                    }`}
                  >
                    {o.num} {o.role}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default OrganPortal;
