import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CeremonialIntroProps {
  onComplete: () => void;
}

type IntroPhase = 0 | 1 | 2;

const phaseCopy = [
  {
    eyebrow: "The Sovereignty Stack",
    title: "Seven organs. One living system.",
    body: "Each organ is independently viable. Together they form a mutually reinforcing architecture.",
  },
  {
    eyebrow: "Operating doctrine",
    title: "Authority must be earned.",
    body: "The Mandate of Mistrust requires evidence, provenance, and human authorization before a claim or system receives authority.",
  },
  {
    eyebrow: "Tamerian Renaissance Alliance Initiative",
    title: "TRAI",
    body: "Enter the documented public record: current states, validation boundaries, and next gates.",
  },
] as const;

export function CeremonialIntro({ onComplete }: CeremonialIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<IntroPhase>(0);
  const [visible, setVisible] = useState(true);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setVisible(false);
    exitTimerRef.current = window.setTimeout(onComplete, 260);
  }, [onComplete]);

  const advance = useCallback(() => {
    setPhase(current => {
      if (current === 2) {
        finish();
        return current;
      }
      return (current + 1) as IntroPhase;
    });
  }, [finish]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null)
        window.clearTimeout(exitTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finish();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        advance();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [advance, finish]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let animationFrame = 0;
    let start = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      start = performance.now();
    };

    const draw = (timestamp: number) => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height * 0.38;
      const elapsed = reducedMotion ? 0 : timestamp - start;
      const pulse = reducedMotion
        ? 0.5
        : 0.5 + Math.sin(elapsed * 0.0016) * 0.5;
      const radius =
        Math.min(width, height) * (0.11 + phase * 0.012) + pulse * 6;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#050709";
      context.fillRect(0, 0, width, height);

      const outerGlow = context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius * 3.4
      );
      outerGlow.addColorStop(0, `rgba(216, 170, 67, ${0.2 + pulse * 0.06})`);
      outerGlow.addColorStop(0.45, "rgba(180, 130, 40, 0.08)");
      outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = outerGlow;
      context.beginPath();
      context.arc(centerX, centerY, radius * 3.4, 0, Math.PI * 2);
      context.fill();

      const orb = context.createRadialGradient(
        centerX - radius * 0.22,
        centerY - radius * 0.22,
        0,
        centerX,
        centerY,
        radius
      );
      orb.addColorStop(0, "#ffe69a");
      orb.addColorStop(0.3, "#d8aa43");
      orb.addColorStop(0.67, "#96691c");
      orb.addColorStop(0.9, "#3c2608");
      orb.addColorStop(1, "#080602");
      context.fillStyle = orb;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.translate(centerX, centerY);
      context.rotate(reducedMotion ? 0 : elapsed * 0.00018);
      context.strokeStyle = "rgba(216, 170, 67, 0.48)";
      context.lineWidth = 1;
      context.beginPath();
      context.ellipse(0, 0, radius * 1.75, radius * 0.72, 0.38, 0, Math.PI * 2);
      context.stroke();
      context.restore();

      if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    draw(performance.now());
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [phase]);

  const current = phaseCopy[phase];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="TRAI ceremonial introduction"
          className="fixed inset-0 z-[2147483000] flex items-center justify-center overflow-hidden"
          style={{ background: "#050709" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={finish}
            className="absolute right-4 top-4 z-20 rounded-full border border-white/30 bg-black/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-[#d8aa43] hover:text-[#f7d778] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7d778] sm:right-8 sm:top-8"
          >
            Skip intro
          </button>

          <div className="relative z-10 mx-auto flex min-h-full w-full max-w-4xl flex-col items-center justify-end px-5 pb-12 pt-[45vh] text-center sm:pb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="max-w-3xl"
              >
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d8aa43] sm:text-xs">
                  {current.eyebrow}
                </p>
                <h1
                  className="text-[clamp(2.3rem,7vw,5.4rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[#f4f0e6]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {current.title}
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#f4f0e6]/70 sm:text-base">
                  {current.body}
                </p>
              </motion.div>
            </AnimatePresence>

            <div
              className="mt-8 flex items-center gap-2"
              aria-label={`Introduction step ${phase + 1} of 3`}
            >
              {[0, 1, 2].map(index => (
                <span
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === phase ? "w-8 bg-[#d8aa43]" : "w-3 bg-white/25"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              autoFocus
              onClick={advance}
              className="mt-7 min-w-48 rounded-full bg-[#d8aa43] px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#050709] transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {phase === 2 ? "Enter TRAI" : "Continue"}
            </button>
            <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-white/45">
              User-paced · Enter or Space activates · Right Arrow continues ·
              Escape skips
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
