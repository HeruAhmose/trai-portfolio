/**
 * OrganCanvas — one live visualisation per organ.
 * Canvas2D, a single rAF loop, pauses when offscreen or when reduced motion is
 * requested. Each visual is drawn from the organ's own subject matter rather
 * than a generic particle field.
 */
import React, { useEffect, useRef } from 'react';

const GOLD = '#d8aa43';
const GOLD_RGB = '216,170,67';
const BLUE_RGB = '43,92,168';

export type OrganKey =
  | 'skeleton'
  | 'heart'
  | 'brain'
  | 'vessels'
  | 'skin'
  | 'hands'
  | 'lymphatic';

interface Props {
  organ: OrganKey;
  className?: string;
  /** When false the loop does not run at all. Seven idle card canvases
      animating at once starve the main thread, so cards pass their hover
      state here and only the hovered one draws. */
  active?: boolean;
}

export const OrganCanvas: React.FC<Props> = ({ organ, className, active = true }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    if (!active) {
      const c2 = cv.getContext('2d');
      c2?.clearRect(0, 0, cv.width, cv.height);
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0,
      H = 0,
      raf = 0,
      t = 0,
      running = true;

    const resize = () => {
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = Math.max(1, W * dpr);
      cv.height = Math.max(1, H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting;
        if (running) raf = requestAnimationFrame(loop);
      },
      { threshold: 0 }
    );
    io.observe(cv);

    /* ---------------------------------------------------------- skeleton
       Hex carbon lattice with a piezoelectric charge propagating through it.
       The material is a hemp-carbon matrix, so the lattice is the subject. */
    const skeleton = () => {
      const s = 26;
      const cols = Math.ceil(W / (s * 1.5)) + 2;
      const rows = Math.ceil(H / (s * 1.73)) + 2;
      ctx.lineWidth = 1;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * s * 1.5;
          const y = r * s * 1.732 + (c % 2 ? s * 0.866 : 0);
          const d = Math.hypot(x - W / 2, y - H / 2);
          const wave = Math.sin(d * 0.028 - t * 2.2);
          const hot = Math.max(0, wave);
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i;
            const px = x + Math.cos(a) * s * 0.52;
            const py = y + Math.sin(a) * s * 0.52;
            i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(${GOLD_RGB},${0.07 + hot * 0.5})`;
          ctx.stroke();
          if (hot > 0.86) {
            ctx.fillStyle = `rgba(${GOLD_RGB},${(hot - 0.86) * 2.6})`;
            ctx.beginPath();
            ctx.arc(x, y, 2.1, 0, 6.283);
            ctx.fill();
          }
        }
      }
    };

    /* ------------------------------------------------------------- heart
       Golden-angle phyllotaxis — saffron at the core, Galdieria at the rim.
       The same 137.507° the cultivation trials test. */
    const heart = () => {
      const GA = Math.PI * (3 - Math.sqrt(5));
      const N = 420;
      const cx = W / 2,
        cy = H / 2;
      const unit = Math.min(W, H) / 2 / Math.sqrt(N);
      for (let n = 1; n <= N; n++) {
        const k = n / N;
        const a = n * GA + t * 0.22;
        const rad = unit * Math.sqrt(n);
        const x = cx + Math.cos(a) * rad;
        const y = cy + Math.sin(a) * rad;
        const pulse = 1 + 0.12 * Math.sin(t * 2.4 + n * 0.05);
        let col: string;
        if (k < 0.38) col = `rgba(240,196,99,${0.75 - k})`;
        else if (k < 0.66) col = `rgba(${GOLD_RGB},${0.6 - k * 0.4})`;
        else col = `rgba(${BLUE_RGB},${0.15 + k * 0.4})`;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(x, y, (1 + 3.2 * k) * pulse, 0, 6.283);
        ctx.fill();
      }
    };

    /* ------------------------------------------------------------- brain
       A defended network: nodes, links, and threat packets being intercepted
       at the perimeter. Triple-core architecture, three clusters. */
    const brainNodes = Array.from({ length: 34 }, (_, i) => ({
      a: (i / 34) * 6.283,
      r: 0.3 + ((i * 37) % 60) / 160,
      core: i % 3,
    }));
    const packets = Array.from({ length: 12 }, (_, i) => ({
      p: i / 12,
      speed: 0.12 + ((i * 13) % 7) / 34,
      lane: i % 3,
    }));
    const brain = () => {
      const cx = W / 2,
        cy = H / 2,
        R = Math.min(W, H) * 0.42;
      const pts = brainNodes.map((n) => ({
        x: cx + Math.cos(n.a + t * 0.1) * R * n.r,
        y: cy + Math.sin(n.a + t * 0.1) * R * n.r,
        core: n.core,
      }));
      ctx.lineWidth = 1;
      pts.forEach((p, i) => {
        pts.slice(i + 1).forEach((q) => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < R * 0.42) {
            ctx.strokeStyle = `rgba(${GOLD_RGB},${0.16 * (1 - d / (R * 0.42))})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        });
      });
      pts.forEach((p) => {
        const glow = 0.45 + 0.4 * Math.sin(t * 2 + p.core * 2);
        ctx.fillStyle = `rgba(${GOLD_RGB},${glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6, 0, 6.283);
        ctx.fill();
      });
      packets.forEach((k) => {
        k.p = (k.p + k.speed * 0.006) % 1;
        const a = k.lane * 2.094 + k.p * 6.283;
        const rr = R * (1.05 - k.p * 0.72);
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        const intercepted = k.p > 0.72;
        ctx.fillStyle = intercepted
          ? `rgba(${GOLD_RGB},${1 - (k.p - 0.72) * 3.4})`
          : `rgba(200,80,60,.85)`;
        ctx.beginPath();
        ctx.arc(x, y, intercepted ? 4.4 : 2.4, 0, 6.283);
        ctx.fill();
      });
      ctx.strokeStyle = `rgba(${GOLD_RGB},.22)`;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.28, 0, 6.283);
      ctx.stroke();
    };

    /* ----------------------------------------------------------- vessels
       Routes with freight moving along them. Last-mile logistics as flow. */
    const routes = [
      [0.08, 0.22, 0.42, 0.13, 0.72, 0.34, 0.94, 0.24],
      [0.05, 0.52, 0.35, 0.62, 0.66, 0.48, 0.96, 0.58],
      [0.1, 0.82, 0.38, 0.74, 0.7, 0.88, 0.93, 0.78],
    ];
    const freight = Array.from({ length: 18 }, (_, i) => ({
      lane: i % 3,
      p: (i / 18) % 1,
      v: 0.0016 + ((i * 7) % 5) / 5200,
    }));
    const bez = (r: number[], p: number) => {
      const mt = 1 - p;
      return {
        x:
          (mt ** 3 * r[0] + 3 * mt * mt * p * r[2] + 3 * mt * p * p * r[4] + p ** 3 * r[6]) * W,
        y:
          (mt ** 3 * r[1] + 3 * mt * mt * p * r[3] + 3 * mt * p * p * r[5] + p ** 3 * r[7]) * H,
      };
    };
    const vessels = () => {
      routes.forEach((r) => {
        ctx.strokeStyle = `rgba(${GOLD_RGB},.17)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(r[0] * W, r[1] * H);
        ctx.bezierCurveTo(r[2] * W, r[3] * H, r[4] * W, r[5] * H, r[6] * W, r[7] * H);
        ctx.stroke();
      });
      freight.forEach((f) => {
        f.p = (f.p + f.v) % 1;
        const pt = bez(routes[f.lane], f.p);
        const tail = bez(routes[f.lane], Math.max(0, f.p - 0.05));
        const g = ctx.createLinearGradient(tail.x, tail.y, pt.x, pt.y);
        g.addColorStop(0, `rgba(${GOLD_RGB},0)`);
        g.addColorStop(1, `rgba(${GOLD_RGB},.75)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,225,150,.95)`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.4, 0, 6.283);
        ctx.fill();
      });
    };

    /* -------------------------------------------------------------- skin
       Woven hemp fibre — warp and weft interlacing. Textile as identity. */
    const skin = () => {
      const gap = 15;
      ctx.lineWidth = 2.4;
      for (let x = 0; x < W + gap; x += gap) {
        const off = Math.sin(x * 0.05 + t * 0.9) * 3;
        ctx.strokeStyle = `rgba(${GOLD_RGB},${0.1 + 0.12 * Math.sin(x * 0.09 + t)})`;
        ctx.beginPath();
        ctx.moveTo(x + off, 0);
        ctx.lineTo(x - off, H);
        ctx.stroke();
      }
      for (let y = 0; y < H + gap; y += gap) {
        const off = Math.cos(y * 0.05 - t * 0.7) * 3;
        const lit = 0.5 + 0.5 * Math.sin(y * 0.04 - t * 1.4);
        ctx.strokeStyle = `rgba(${GOLD_RGB},${0.06 + lit * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(0, y + off);
        ctx.lineTo(W, y - off);
        ctx.stroke();
      }
    };

    /* ------------------------------------------------------------- hands
       Hub-and-spoke: Navigator hubs lighting residents in their catchment.
       Year 1 is two hubs; year 2 is four. The visual counts up and holds. */
    const hands = () => {
      const hubs = [
        { x: 0.28, y: 0.36 },
        { x: 0.66, y: 0.3 },
        { x: 0.4, y: 0.72 },
        { x: 0.78, y: 0.66 },
      ];
      // Year 1 is two hubs, year 2 is four. All four are drawn; the two that
      // exist today read brighter, and the ring sweep marks the active one.
      const lit = Math.floor(t * 0.6) % hubs.length;
      hubs.forEach((h, i) => {
        const planned = i >= 2;
        const cx = h.x * W,
          cy = h.y * H;
        const ring = ((t * 0.55 + i * 0.4) % 1.6) / 1.6;
        const dim = planned ? 0.45 : 1;
        ctx.strokeStyle = `rgba(${GOLD_RGB},${(1 - ring) * 0.4 * dim})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, ring * Math.min(W, H) * 0.3, 0, 6.283);
        ctx.stroke();
        for (let k = 0; k < 9; k++) {
          const a = (k / 9) * 6.283 + i;
          const d = Math.min(W, H) * 0.13;
          const px = cx + Math.cos(a) * d;
          const py = cy + Math.sin(a) * d;
          ctx.strokeStyle = `rgba(${GOLD_RGB},${0.2 * dim})`;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.fillStyle = `rgba(${GOLD_RGB},${(0.35 + 0.45 * Math.sin(t * 2 + k + i)) * dim})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.9, 0, 6.283);
          ctx.fill();
        }
        ctx.fillStyle = i === lit ? '#ffe090' : `rgba(${GOLD_RGB},${planned ? 0.5 : 0.95})`;
        ctx.beginPath();
        ctx.arc(cx, cy, i === lit ? 6.5 : 5, 0, 6.283);
        ctx.fill();
      });
    };

    /* --------------------------------------------------------- lymphatic
       Return flow: surplus drawn inward from the periphery to the centre,
       then radiating back out as capacity. */
    const drops = Array.from({ length: 46 }, (_, i) => ({
      a: (i / 46) * 6.283,
      p: (i % 11) / 11,
      v: 0.0022 + ((i * 5) % 6) / 5400,
    }));
    const lymphatic = () => {
      const cx = W / 2,
        cy = H / 2,
        R = Math.min(W, H) * 0.46;
      ctx.strokeStyle = `rgba(${GOLD_RGB},.12)`;
      ctx.lineWidth = 1;
      [0.35, 0.62, 0.9].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * r, 0, 6.283);
        ctx.stroke();
      });
      drops.forEach((d) => {
        d.p = (d.p + d.v) % 1;
        const inward = 1 - d.p;
        const rr = R * inward;
        const x = cx + Math.cos(d.a + t * 0.12) * rr;
        const y = cy + Math.sin(d.a + t * 0.12) * rr;
        ctx.fillStyle = `rgba(${GOLD_RGB},${0.2 + d.p * 0.65})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.4 + d.p * 2.4, 0, 6.283);
        ctx.fill();
      });
      const beat = 0.5 + 0.5 * Math.sin(t * 1.7);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.32);
      g.addColorStop(0, `rgba(255,225,150,${0.25 + beat * 0.35})`);
      g.addColorStop(1, 'rgba(255,225,150,0)');
      ctx.fillStyle = g;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    };

    const painters: Record<OrganKey, () => void> = {
      skeleton,
      heart,
      brain,
      vessels,
      skin,
      hands,
      lymphatic,
    };

    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      t += reduced ? 0 : 0.016;
      painters[organ]();
      raf = requestAnimationFrame(loop);
    };
    if (reduced) {
      t = 1.4; // a single composed frame
      ctx.clearRect(0, 0, W, H);
      painters[organ]();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [organ, active]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
};

export default OrganCanvas;
