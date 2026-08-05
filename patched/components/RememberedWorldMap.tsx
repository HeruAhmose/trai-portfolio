/**
 * RememberedWorldMap — a real interactive map.
 *
 * Replaces an <img> pointing at /manus-storage/remembered_world_map.png (which
 * is not in the repository, and whose onError handler hid it, leaving an empty
 * bordered box) plus seven dots positioned by `left: 15 + i*12%`.
 *
 * Here the landmass is generated, the seven regions have deliberate positions
 * with terrain that matches their function, trade routes connect them in the
 * flywheel order, and a pulse of value travels the loop. Hover, click, arrow
 * keys and touch all select. Nothing depends on a missing asset.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sovereignAudio from '@/lib/sovereignAudio';

const GOLD = '216,170,67';

export interface Region {
  name: string;
  organ: string;
  desc: string;
  x: number; // 0–1 of viewBox width
  y: number; // 0–1 of viewBox height
  terrain: 'forge' | 'garden' | 'citadel' | 'route' | 'coast' | 'delta' | 'hearth';
}

export const REGIONS: Region[] = [
  { name: 'Carbon Forge',        organ: 'Tamerian Materials',   x: 0.22, y: 0.30, terrain: 'forge',   desc: 'Concord, North Carolina. Where the hemp-carbon matrix is designed and the patent estate is built. The substrate every other region stands on.' },
  { name: 'Saffron Gardens',     organ: 'True Melange Φ',       x: 0.47, y: 0.20, terrain: 'garden',  desc: 'The agronomic pilot. Corms set on the golden angle, harvest graded to ISO 3632, bioactives measured rather than asserted.' },
  { name: 'Blue Cyber Citadel',  organ: 'Queen Califia',        x: 0.74, y: 0.31, terrain: 'citadel', desc: 'The defended perimeter. Triple-core intelligence watching the portfolio’s identity, markets and infrastructure.' },
  { name: 'Caravan Arteries',    organ: 'Mela Nation',          x: 0.62, y: 0.53, terrain: 'route',   desc: 'The routes themselves. Last-mile logistics carrying material, product and people between every other region.' },
  { name: 'Woven Identity Coast',organ: 'MeLaNiNa',             x: 0.83, y: 0.68, terrain: 'coast',   desc: 'Where the crop becomes cloth. Hemp textile, cultural expression, and ownership written into the making.' },
  { name: 'Digital Bridge Delta',organ: 'TechBridge',           x: 0.34, y: 0.66, terrain: 'delta',   desc: 'Raleigh-Durham. Navigator hubs where 1.2 million North Carolinians without reliable digital access can cross.' },
  { name: 'Foundation Hearth',   organ: 'The Peoples Foundation',x: 0.50, y: 0.84, terrain: 'hearth', desc: 'The centre of return. Surplus arrives here and leaves as programs — the reason the loop is a loop.' },
];

const VB = { w: 1000, h: 720 };

/* JavaScript's % is remainder, not modulo — it keeps the sign of the operand,
   so (-1 % 7) is -1 and REGIONS[-1] is undefined. Every wrap below goes through
   this helper instead. */
const mod = (n: number, m: number) => ((n % m) + m) % m;

/* Deterministic pseudo-random so the coastline is stable between renders. */
const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

/** A closed organic landmass path, generated once. */
function landPath(): string {
  const pts: [number, number][] = [];
  const N = 46;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const wobble =
      0.78 +
      0.16 * Math.sin(a * 3 + 1.2) +
      0.09 * Math.sin(a * 5.5 + 0.4) +
      0.05 * rnd(i + 3);
    const rx = VB.w * 0.44 * wobble;
    const ry = VB.h * 0.42 * wobble;
    pts.push([VB.w / 2 + Math.cos(a) * rx, VB.h / 2 + Math.sin(a) * ry * 0.94]);
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[i];
    const p1 = pts[(i + 1) % pts.length];
    const cx = (p0[0] + p1[0]) / 2;
    const cy = (p0[1] + p1[1]) / 2;
    d += ` Q ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }
  return d + ' Z';
}
const LAND = landPath();

const TERRAIN: Record<Region['terrain'], (x: number, y: number) => React.ReactNode> = {
  forge: (x, y) => (
    <g>
      {[0, 1, 2].map((i) => (
        <polygon
          key={i}
          points={`${x - 16 + i * 14},${y + 10} ${x - 9 + i * 14},${y - 6 - i * 3} ${x - 2 + i * 14},${y + 10}`}
          fill={`rgba(${GOLD},.16)`}
        />
      ))}
    </g>
  ),
  garden: (x, y) => (
    <g>
      {Array.from({ length: 13 }).map((_, i) => {
        const a = i * 2.39996;
        const r = 4.2 * Math.sqrt(i + 1);
        return <circle key={i} cx={x + Math.cos(a) * r} cy={y + Math.sin(a) * r} r={1.5} fill={`rgba(${GOLD},.4)`} />;
      })}
    </g>
  ),
  citadel: (x, y) => (
    <g fill="none" stroke={`rgba(${GOLD},.28)`} strokeWidth={1.2}>
      <rect x={x - 13} y={y - 11} width={26} height={22} />
      <rect x={x - 6} y={y - 18} width={12} height={7} />
    </g>
  ),
  route: (x, y) => (
    <path
      d={`M ${x - 22} ${y + 8} Q ${x} ${y - 14} ${x + 22} ${y + 6}`}
      fill="none"
      stroke={`rgba(${GOLD},.3)`}
      strokeWidth={1.4}
      strokeDasharray="4 3"
    />
  ),
  coast: (x, y) => (
    <g stroke={`rgba(${GOLD},.26)`} strokeWidth={1.1} fill="none">
      {[0, 6, 12].map((o) => (
        <path key={o} d={`M ${x - 20} ${y + o - 6} q 10 -5 20 0 t 20 0`} />
      ))}
    </g>
  ),
  delta: (x, y) => (
    <g stroke={`rgba(${GOLD},.3)`} strokeWidth={1.2} fill="none">
      <path d={`M ${x} ${y - 14} L ${x} ${y + 4}`} />
      <path d={`M ${x} ${y + 4} L ${x - 14} ${y + 15}`} />
      <path d={`M ${x} ${y + 4} L ${x + 14} ${y + 15}`} />
    </g>
  ),
  hearth: (x, y) => (
    <g>
      <circle cx={x} cy={y} r={13} fill="none" stroke={`rgba(${GOLD},.3)`} strokeWidth={1.2} />
      <circle cx={x} cy={y} r={5} fill={`rgba(${GOLD},.3)`} />
    </g>
  ),
};

export const RememberedWorldMap: React.FC = () => {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [pulse, setPulse] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  /* Value travelling the flywheel. Halts for reduced motion. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.max(0, Math.min(0.1, (now - last) / 1000));
      last = now;
      setPulse((p) => mod(p + dt * 0.085, 1));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pick = useCallback((i: number) => {
    setActive(i);
    sovereignAudio.select(i);
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      pick(mod(active + 1, REGIONS.length));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      pick(mod(active - 1, REGIONS.length));
    }
  };

  const px = (r: Region) => r.x * VB.w;
  const py = (r: Region) => r.y * VB.h;

  /* Position of the travelling pulse along the closed route. */
  const seg = mod(pulse, 1) * REGIONS.length;
  const si = Math.floor(seg);
  const sf = seg - si;
  const a = REGIONS[mod(si, REGIONS.length)];
  const b = REGIONS[mod(si + 1, REGIONS.length)];
  const pulseX = px(a) + (px(b) - px(a)) * sf;
  const pulseY = py(a) + (py(b) - py(a)) * sf;

  const current = REGIONS[active];

  return (
    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
      <div className="relative border border-[#d8aa43]/12 bg-[#070b0f] overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className="w-full h-auto block touch-manipulation"
          role="group"
          aria-label="The Remembered World — seven regions of the TRAI architecture"
          tabIndex={0}
          onKeyDown={onKey}
        >
          <defs>
            <radialGradient id="sea" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#0b1018" />
              <stop offset="100%" stopColor="#050709" />
            </radialGradient>
            <linearGradient id="landfill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(216,170,67,.10)" />
              <stop offset="100%" stopColor="rgba(216,170,67,.03)" />
            </linearGradient>
            <filter id="soft">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>

          <rect width={VB.w} height={VB.h} fill="url(#sea)" />

          {/* latitude grid */}
          <g stroke="rgba(216,170,67,.05)" strokeWidth={1}>
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={(i + 1) * (VB.h / 10)} x2={VB.w} y2={(i + 1) * (VB.h / 10)} />
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`v${i}`} x1={(i + 1) * (VB.w / 14)} y1={0} x2={(i + 1) * (VB.w / 14)} y2={VB.h} />
            ))}
          </g>

          {/* landmass */}
          <path d={LAND} fill="url(#landfill)" stroke="rgba(216,170,67,.22)" strokeWidth={1.4} />
          <path d={LAND} fill="none" stroke="rgba(216,170,67,.07)" strokeWidth={9} filter="url(#soft)" />

          {/* trade routes in flywheel order */}
          <g>
            {REGIONS.map((r, i) => {
              const n = REGIONS[mod(i + 1, REGIONS.length)];
              const on = active === i || active === mod(i + 1, REGIONS.length);
              return (
                <line
                  key={`r${i}`}
                  x1={px(r)}
                  y1={py(r)}
                  x2={px(n)}
                  y2={py(n)}
                  stroke={on ? 'rgba(216,170,67,.55)' : 'rgba(216,170,67,.16)'}
                  strokeWidth={on ? 1.8 : 1}
                  strokeDasharray="7 6"
                />
              );
            })}
          </g>

          {/* travelling value */}
          <circle cx={pulseX} cy={pulseY} r={9} fill="rgba(255,225,150,.16)" />
          <circle cx={pulseX} cy={pulseY} r={3.4} fill="#ffe090" />

          {/* terrain glyphs */}
          <g>{REGIONS.map((r) => <g key={`t${r.name}`}>{TERRAIN[r.terrain](px(r), py(r))}</g>)}</g>

          {/* region markers */}
          {REGIONS.map((r, i) => {
            const on = active === i;
            const hi = hover === i;
            return (
              <g
                key={r.name}
                transform={`translate(${px(r)},${py(r)})`}
                className="cursor-pointer"
                onClick={() => pick(i)}
                onMouseEnter={() => {
                  setHover(i);
                  sovereignAudio.hover(i);
                }}
                onMouseLeave={() => setHover(null)}
                role="button"
                tabIndex={0}
                aria-label={`${r.name} — ${r.organ}`}
                aria-pressed={on}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    pick(i);
                  }
                }}
              >
                {on && (
                  <circle r={26} fill="none" stroke="rgba(216,170,67,.35)" strokeWidth={1}>
                    <animate attributeName="r" values="16;30;16" dur="2.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values=".55;0;.55" dur="2.6s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle r={on ? 8 : hi ? 6.5 : 5} fill={on ? '#ffe090' : 'rgba(216,170,67,.55)'} stroke="#050709" strokeWidth={1.5} />
                <text
                  x={r.x > 0.62 ? -14 : 14}
                  y={4}
                  textAnchor={r.x > 0.62 ? 'end' : 'start'}
                  fontSize={13}
                  fontFamily="ui-monospace, monospace"
                  letterSpacing="0.06em"
                  fill={on || hi ? '#f4f0e6' : 'rgba(244,240,230,.45)'}
                >
                  {r.name}
                </text>
              </g>
            );
          })}
        </svg>

        <p className="absolute left-4 bottom-3 text-[0.62rem] font-sans tracking-[0.18em] uppercase text-[#f4f0e6]/28">
          Arrow keys to travel · click a region
        </p>
      </div>

      {/* Region list */}
      <div>
        <div className="space-y-1">
          {REGIONS.map((r, i) => (
            <button
              key={r.name}
              onClick={() => pick(i)}
              onMouseEnter={() => {
                setHover(i);
                sovereignAudio.hover(i);
              }}
              onMouseLeave={() => setHover(null)}
              aria-pressed={active === i}
              className={`w-full text-left p-4 border-l-2 transition-all ${
                active === i
                  ? 'border-[#d8aa43] bg-[#d8aa43]/5'
                  : 'border-[#d8aa43]/15 hover:border-[#d8aa43]/40'
              }`}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span
                  className={`font-bold block ${active === i ? 'text-[#d8aa43]' : 'text-[#f4f0e6]/70'}`}
                  style={{ WebkitTextFillColor: active === i ? '#d8aa43' : undefined }}
                >
                  {r.name}
                </span>
                <span className="text-[0.62rem] font-sans tracking-[0.14em] uppercase text-[#f4f0e6]/30 shrink-0">
                  {r.organ}
                </span>
              </span>
              <AnimatePresence initial={false}>
                {active === i && (
                  <motion.span
                    className="block overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="block text-xs font-sans text-[#f4f0e6]/50 mt-2 leading-relaxed">
                      {r.desc}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
        <p className="mt-5 text-[0.66rem] font-sans text-[#f4f0e6]/28 leading-relaxed">
          The map is a mythos layer. {current.organ} is the venture it stands for; the routes are the
          order value travels through the architecture.
        </p>
      </div>
    </div>
  );
};

export default RememberedWorldMap;
