import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CeremonialIntro — a slow, elegant cinematic entrance.
 * 
 * Sequence:
 * 0.0s — Deep black. Silence.
 * 0.8s — A single point of amber light appears at center.
 * 2.0s — The point slowly expands into the heart orb.
 * 3.5s — "TRAI" fades in, letter by letter.
 * 5.0s — Tagline fades in below.
 * 6.5s — The orb and text hold.
 * 7.5s — Everything dissolves to black.
 * 8.5s — Page fades in.
 * 
 * Total: ~9 seconds. Skippable at any point.
 */

interface CeremonialIntroProps {
  onComplete: () => void;
}

export function CeremonialIntro({ onComplete }: CeremonialIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'orb' | 'text' | 'tagline' | 'hold' | 'dissolve' | 'done'>('orb');
  const [visible, setVisible] = useState(true);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  // Visit-count speed tuning: first visit 9s, each subsequent visit 1.2x faster, min 4s
  const getDuration = () => {
    try {
      const visits = parseInt(localStorage.getItem('trai_visit_count') || '0', 10);
      const next = visits + 1;
      localStorage.setItem('trai_visit_count', String(next));
      const base = 9000;
      const speed = Math.pow(1.2, visits); // 1x, 1.2x, 1.44x, 1.73x...
      return Math.max(4000, Math.round(base / speed));
    } catch {
      return 9000;
    }
  };

  // Canvas orb animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const cx = () => canvas.width / 2;
    const cy = () => canvas.height / 2;

    let startTime = 0;
    const TOTAL = getDuration();

    const draw = (ts: number) => {
      if (!startTime) { startTime = ts; startRef.current = ts; }
      const t = ts - startTime;
      const progress = Math.min(t / TOTAL, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#050709';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Phase timing
        const orbStart = 800;
        const orbPeak = TOTAL * 0.39;
        const dissolveStart = TOTAL * 0.83;

        if (t > orbStart) {
          const orbProgress = Math.min((t - orbStart) / (orbPeak - orbStart), 1);
          // Eased expansion
          const eased = 1 - Math.pow(1 - orbProgress, 3);
          const maxRadius = Math.min(canvas.width, canvas.height) * 0.22;
          const radius = 2 + eased * maxRadius;

          // Dissolve fade
          let alpha = 1;
          if (t > dissolveStart) {
            alpha = Math.max(0, 1 - (t - dissolveStart) / 1200);
          }

          // Outer glow
          const glow = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), radius * 2.5);
          glow.addColorStop(0, `rgba(216, 170, 67, ${0.25 * alpha})`);
          glow.addColorStop(0.4, `rgba(180, 130, 40, ${0.10 * alpha})`);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(cx(), cy(), radius * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Second outer glow pulse (breathing)
          const pulse = 0.5 + 0.5 * Math.sin(t * 0.002);
          const glow2 = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), radius * 4.0);
          glow2.addColorStop(0, `rgba(216, 170, 67, ${0.08 * alpha * pulse})`);
          glow2.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow2;
          ctx.beginPath();
          ctx.arc(cx(), cy(), radius * 4.0, 0, Math.PI * 2);
          ctx.fill();

          // Heart orb
          const grad = ctx.createRadialGradient(
            cx() - radius * 0.2, cy() - radius * 0.2, 0,
            cx(), cy(), radius
          );
          grad.addColorStop(0, `rgba(255, 230, 150, ${alpha})`);
          grad.addColorStop(0.3, `rgba(216, 170, 67, ${alpha})`);
          grad.addColorStop(0.65, `rgba(150, 105, 28, ${alpha})`);
          grad.addColorStop(0.88, `rgba(60, 38, 8, ${alpha})`);
          grad.addColorStop(1, `rgba(8, 6, 2, ${alpha})`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx(), cy(), radius, 0, Math.PI * 2);
          ctx.fill();

          // Orbital ring — appears after orb is 60% grown
          if (orbProgress > 0.6) {
            const ringAlpha = Math.min((orbProgress - 0.6) / 0.4, 1) * alpha;
            const ringRadius = radius * 1.6;
            // Rotating ring
            ctx.save();
            ctx.translate(cx(), cy());
            ctx.rotate(t * 0.0003);
            ctx.translate(-cx(), -cy());
            ctx.strokeStyle = `rgba(216, 170, 67, ${ringAlpha * 0.55})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx(), cy(), ringRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // Second ring (counter-rotating)
            ctx.save();
            ctx.translate(cx(), cy());
            ctx.rotate(-t * 0.0002);
            ctx.translate(-cx(), -cy());
            ctx.strokeStyle = `rgba(216, 170, 67, ${ringAlpha * 0.25})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(cx(), cy(), ringRadius * 1.4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // Gold tick marks on outer ring
            if (ringAlpha > 0.5) {
              for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + t * 0.0003;
                const x1 = cx() + Math.cos(angle) * ringRadius * 1.35;
                const y1 = cy() + Math.sin(angle) * ringRadius * 1.35;
                const x2 = cx() + Math.cos(angle) * ringRadius * 1.45;
                const y2 = cy() + Math.sin(angle) * ringRadius * 1.45;
                ctx.strokeStyle = `rgba(216, 170, 67, ${ringAlpha * 0.6})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
              }
            }
          }
      }

      if (t > dissolveStart + 1200) {
        cancelAnimationFrame(rafRef.current);
        setVisible(false);
        setTimeout(onComplete, 400);
        return;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    // Phase transitions for text
    const t1 = setTimeout(() => setPhase('text'), TOTAL * 0.39);
    const t2 = setTimeout(() => setPhase('tagline'), TOTAL * 0.56);
    const t3 = setTimeout(() => setPhase('dissolve'), TOTAL * 0.83);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  }, [onComplete]);

  const skip = () => {
    cancelAnimationFrame(rafRef.current);
    setVisible(false);
    setTimeout(onComplete, 300);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: '#050709' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Canvas orb */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Text overlay — centered below the orb */}
          <div className="relative z-10 text-center" style={{ marginTop: '45vh' }}>
            {/* TRAI letters */}
            <AnimatePresence>
              {(phase === 'text' || phase === 'tagline' || phase === 'hold') && (
                <motion.div
                  className="flex items-center justify-center gap-[0.12em] mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {['T', 'R', 'A', 'I'].map((letter, i) => (
                    <motion.span
                      key={letter}
                      className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-[0.15em]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: '#f4f0e6',
                        WebkitTextFillColor: '#f4f0e6',
                        textShadow: '0 0 40px rgba(244,240,230,0.2)',
                      }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tagline */}
            <AnimatePresence>
              {(phase === 'tagline' || phase === 'hold') && (
                <motion.p
                  className="text-xs tracking-[0.28em] uppercase"
                  style={{ color: 'rgba(216,170,67,0.7)', fontFamily: 'var(--font-interface)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                >
                  Tamerian Renaissance Alliance Initiative
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Skip — subtle, bottom right */}
          <motion.button
            onClick={skip}
            className="absolute bottom-8 right-8 text-xs tracking-[0.18em] uppercase transition-colors"
            style={{ color: 'rgba(244,240,230,0.2)', fontFamily: 'var(--font-interface)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ color: 'rgba(244,240,230,0.5)' }}
          >
            Skip
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
