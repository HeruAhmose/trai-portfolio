import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface CinematicIntroProps {
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  /** Retained for call-site compatibility. Timing never dismisses this intro. */
  duration?: number;
  onComplete?: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  title,
  subtitle,
  color,
  icon,
  onComplete,
}) => {
  const [show, setShow] = useState(true);
  const completeRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);

  const finish = useCallback(() => {
    if (completeRef.current) return;
    completeRef.current = true;
    setShow(false);
    exitTimerRef.current = window.setTimeout(() => onComplete?.(), 220);
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "ArrowRight") {
        event.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (exitTimerRef.current !== null)
        window.clearTimeout(exitTimerRef.current);
    };
  }, [finish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} introduction`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[2147483000] flex items-center justify-center bg-black/90 p-5 backdrop-blur-sm"
        >
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, ${color}40 25%, ${color}40 26%, transparent 27%, transparent 74%, ${color}40 75%, ${color}40 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, ${color}40 25%, ${color}40 26%, transparent 27%, transparent 74%, ${color}40 75%, ${color}40 76%, transparent 77%, transparent)`,
              backgroundSize: "50px 50px",
            }}
            animate={{ backgroundPosition: ["0 0", "50px 50px"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={finish}
            className="absolute right-4 top-4 z-20 rounded-full border border-white/35 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:right-8 sm:top-8"
            style={{ outlineColor: color }}
          >
            Skip intro
          </button>

          <div className="relative z-10 max-w-3xl text-center">
            <motion.div
              initial={{ scale: 0.75, rotate: -16, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="mb-7 text-7xl"
              aria-hidden="true"
            >
              {icon}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-4 text-4xl font-bold sm:text-6xl"
              style={{
                backgroundImage: `linear-gradient(135deg, ${color}, ${color}80)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mb-4 text-lg sm:text-xl"
              style={{ color }}
            >
              {subtitle}
            </motion.p>
            <p className="mx-auto max-w-xl text-sm leading-6 text-white/65">
              This section presents architecture, application claims, or
              research targets. It does not convert a proposal or simulation
              into measured evidence.
            </p>
            <button
              type="button"
              autoFocus
              onClick={finish}
              className="mt-8 min-w-52 rounded-full px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-black transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              style={{ backgroundColor: color }}
            >
              Enter section
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
};
