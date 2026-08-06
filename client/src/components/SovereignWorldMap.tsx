import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Region {
  id: number;
  name: string;
  role: string;
  organ: string;
  desc: string;
  route: string;
  external?: string;
  x: number; // % of canvas width
  y: number; // % of canvas height
  color: string;
  glyph: string;
}

const REGIONS: Region[] = [
  { id: 0, name: 'Carbon Forge', role: 'Skeleton', organ: 'Tamerian Materials', desc: 'Hemp-derived carbon composite. Patent App 63/934,269 · 25 claims. Material sovereignty — the structural foundation of the organism.', route: '/materials', external: 'https://tamerian-materials.com/', x: 28, y: 42, color: '#c87941', glyph: '⬡' },
  { id: 1, name: 'Saffron Gardens', role: 'Heart', organ: 'True Melange Φ', desc: 'Saffron-hemp biotechnology platform. First product: Blue-Gold Daily RTD tea. Biological sovereignty — what the organism metabolizes.', route: '/true-melange', x: 48, y: 30, color: '#d8aa43', glyph: 'Φ' },
  { id: 2, name: 'Blue Cyber Citadel', role: 'Brain', organ: 'Queen Califia', desc: 'Autonomous cybersecurity intelligence. Triple-core: Cyber, Identity, Markets. Cognitive sovereignty — the nervous system.', route: '/queen-califia', external: 'https://queencalifia-cyberai.web.app/', x: 68, y: 22, color: '#4a9eff', glyph: '◈' },
  { id: 3, name: 'Caravan Arteries', role: 'Vessels', organ: 'Mela Nation', desc: 'Last-mile logistics, community access, resilient distribution. Mobility sovereignty — the blood vessels of the organism.', route: '/mela-nation', x: 78, y: 55, color: '#e85d3a', glyph: '⟳' },
  { id: 4, name: 'Woven Identity Coast', role: 'Skin', organ: 'MeLaNiNa', desc: 'Hemp apparel, cultural expression, employee-ownership pathways. Identity sovereignty — the skin that carries memory.', route: '/melanina', x: 55, y: 68, color: '#9b59b6', glyph: '◉' },
  { id: 5, name: 'Digital Bridge Delta', role: 'Hands', organ: 'TechBridge', desc: 'Digital Navigator hubs in Raleigh-Durham. H.K. AI triage. Community reach — the hands that build bridges.', route: '/community', external: 'https://techbridge-collective.org/', x: 35, y: 62, color: '#2ecc71', glyph: '⌬' },
  { id: 6, name: 'Foundation Hearth', role: 'Lymphatic', organ: 'The Peoples Foundation', desc: 'Designed to receive defined charitable allocations. Regenerative return — surplus flows back to the community that built it.', route: '/peoples-foundation', x: 18, y: 72, color: '#d8aa43', glyph: '♾' },
];

// Connection pairs between regions (organ relationships)
const CONNECTIONS = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[1,5],[2,4],[0,6]];

interface Props {
  onRegionClick?: (region: Region) => void;
  onRegionHover?: (id: number) => void;
  soundHover?: () => void;
  soundClick?: () => void;
}

export function SovereignWorldMap({ onRegionClick, onRegionHover, soundHover, soundClick }: Props) {
  const [active, setActive] = useState<number>(1); // Start at Saffron Gardens (Heart)
  const [hovered, setHovered] = useState<number | null>(null);
  const [pulse, setPulse] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // Animate connection pulses
  useEffect(() => {
    let t = 0;
    const tick = () => {
      t += 0.012;
      setPulse(t);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Draw the canvas background map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    CONNECTIONS.forEach(([a, b]) => {
      const ra = REGIONS[a], rb = REGIONS[b];
      const x1 = ra.x / 100 * W, y1 = ra.y / 100 * H;
      const x2 = rb.x / 100 * W, y2 = rb.y / 100 * H;
      const isActive = a === active || b === active;
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      const alpha = isActive ? 0.35 : 0.1;
      grad.addColorStop(0, `rgba(216,170,67,${alpha})`);
      grad.addColorStop(0.5, `rgba(216,170,67,${alpha * 1.5})`);
      grad.addColorStop(1, `rgba(216,170,67,${alpha})`);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      // Curved connection
      const mx = (x1 + x2) / 2 + (y2 - y1) * 0.15;
      const my = (y1 + y2) / 2 - (x2 - x1) * 0.15;
      ctx.quadraticCurveTo(mx, my, x2, y2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = isActive ? 1.5 : 0.5;
      ctx.stroke();
    });

    // Animate pulse along active connections
    CONNECTIONS.filter(([a, b]) => a === active || b === active).forEach(([a, b]) => {
      const ra = REGIONS[a], rb = REGIONS[b];
      const x1 = ra.x / 100 * W, y1 = ra.y / 100 * H;
      const x2 = rb.x / 100 * W, y2 = rb.y / 100 * H;
      const t = (pulse * 0.8) % 1;
      const mx = (x1 + x2) / 2 + (y2 - y1) * 0.15;
      const my = (y1 + y2) / 2 - (x2 - x1) * 0.15;
      // Bezier point at t
      const bx = (1-t)*(1-t)*x1 + 2*(1-t)*t*mx + t*t*x2;
      const by = (1-t)*(1-t)*y1 + 2*(1-t)*t*my + t*t*y2;
      const grad2 = ctx.createRadialGradient(bx, by, 0, bx, by, 6);
      grad2.addColorStop(0, 'rgba(216,170,67,0.9)');
      grad2.addColorStop(1, 'rgba(216,170,67,0)');
      ctx.beginPath();
      ctx.arc(bx, by, 6, 0, Math.PI * 2);
      ctx.fillStyle = grad2;
      ctx.fill();
    });
  }, [active, pulse]);

  const handleRegionClick = (r: Region) => {
    setActive(r.id);
    soundClick?.();
    onRegionClick?.(r);
  };

  const handleRegionHover = (id: number) => {
    setHovered(id);
    soundHover?.();
    onRegionHover?.(id);
  };

  const activeRegion = REGIONS[active];

  return (
    <div className="relative w-full" style={{ minHeight: 520 }}>
      {/* Canvas for connections */}
      <canvas
        ref={canvasRef}
        width={900}
        height={520}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.9 }}
      />

      {/* Region nodes */}
      {REGIONS.map(r => {
        const isActive = r.id === active;
        const isHovered = r.id === hovered;
        return (
          <motion.button
            key={r.id}
            className="absolute flex flex-col items-center gap-1 group"
            style={{ left: `${r.x}%`, top: `${r.y}%`, transform: 'translate(-50%, -50%)', zIndex: 10 }}
            onClick={() => handleRegionClick(r)}
            onMouseEnter={() => handleRegionHover(r.id)}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92 }}
          >
            {/* Outer glow ring */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  style={{ width: 64, height: 64, top: -20, left: -20, border: `1px solid ${r.color}`, opacity: 0.4 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </AnimatePresence>
            {/* Node circle */}
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold relative"
              style={{
                background: isActive
                  ? `radial-gradient(circle at 35% 35%, ${r.color}dd, ${r.color}66)`
                  : `radial-gradient(circle at 35% 35%, ${r.color}44, ${r.color}22)`,
                border: `1.5px solid ${isActive ? r.color : r.color + '55'}`,
                color: isActive ? '#050709' : r.color,
                boxShadow: isActive ? `0 0 20px ${r.color}60, 0 0 40px ${r.color}20` : 'none',
              }}
              animate={isActive ? { boxShadow: [`0 0 20px ${r.color}60`, `0 0 35px ${r.color}80`, `0 0 20px ${r.color}60`] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {r.glyph}
            </motion.div>
            {/* Label */}
            <span
              className="text-[9px] font-mono tracking-[0.12em] uppercase whitespace-nowrap"
              style={{ color: isActive ? r.color : 'rgba(244,240,230,0.35)', textShadow: isActive ? `0 0 12px ${r.color}80` : 'none' }}
            >
              {r.role}
            </span>
          </motion.button>
        );
      })}

      {/* Active region detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="absolute bottom-0 left-0 right-0 p-6"
          style={{ background: 'linear-gradient(0deg, rgba(5,7,9,0.97) 60%, transparent)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-start justify-between gap-6 max-w-2xl">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase mb-1" style={{ color: activeRegion.color }}>
                {activeRegion.name} · {activeRegion.organ}
              </p>
              <p className="text-sm font-sans text-[#f4f0e6]/60 leading-relaxed max-w-md">
                {activeRegion.desc}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0 mt-1">
              <motion.button
                onClick={() => { onRegionClick?.(activeRegion); }}
                className="text-xs font-mono px-4 py-2 border transition-colors"
                style={{ borderColor: `${activeRegion.color}40`, color: activeRegion.color }}
                whileHover={{ borderColor: activeRegion.color, background: `${activeRegion.color}15` }}
                whileTap={{ scale: 0.96 }}
              >
                Enter →
              </motion.button>
              {activeRegion.external && (
                <motion.a
                  href={activeRegion.external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono px-4 py-2 border border-[#f4f0e6]/10 text-[#f4f0e6]/30 hover:text-[#f4f0e6]/60 transition-colors"
                  whileTap={{ scale: 0.96 }}
                >
                  Live ↗
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
