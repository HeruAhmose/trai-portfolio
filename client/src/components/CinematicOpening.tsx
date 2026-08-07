import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Cinematic Opening Sequence
 * Multi-stage narrative animation that unfolds the portfolio story
 */
export const CinematicOpening: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  // Stage 1: Cosmic void emergence
  useEffect(() => {
    if (stage !== 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;
    let time = 0;

    const drawCosmicVoid = () => {
      time += 0.01;

      // Dark void background
      ctx.fillStyle = "#0a0e27";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cosmic dust particles
      for (let i = 0; i < 200; i++) {
        const x =
          (Math.sin(time * 0.3 + i) * canvas.width) / 2 + canvas.width / 2;
        const y =
          (Math.cos(time * 0.2 + i * 0.5) * canvas.height) / 2 +
          canvas.height / 2;
        const size = Math.max(0.5, Math.sin(time + i) * 2 + 1);
        const opacity = Math.sin(time * 0.5 + i) * 0.5 + 0.5;

        ctx.fillStyle = `rgba(212, 175, 55, ${opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Central energy core
      const coreX = canvas.width / 2;
      const coreY = canvas.height / 2;
      const coreSize = Math.max(50, Math.sin(time * 0.5) * 50 + 100);

      if (coreSize > 0) {
        const gradient = ctx.createRadialGradient(
          coreX,
          coreY,
          0,
          coreX,
          coreY,
          coreSize
        );
        gradient.addColorStop(
          0,
          `rgba(212, 175, 55, ${Math.sin(time) * 0.3 + 0.3})`
        );
        gradient.addColorStop(
          0.5,
          `rgba(0, 217, 255, ${Math.sin(time * 0.7) * 0.2})`
        );
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      setProgress(Math.min(time / 3, 1));

      if (time < 3) {
        animationId = requestAnimationFrame(drawCosmicVoid);
      } else {
        setStage(1);
      }
    };

    drawCosmicVoid();

    return () => cancelAnimationFrame(animationId);
  }, [stage]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Stage 1: Void Emergence */}
      {stage >= 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: progress }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: progress, opacity: progress }}
            transition={{ duration: 2 }}
          >
            <div className="text-6xl font-bold bg-gradient-to-r from-accent-gold via-accent-cyan to-accent-magenta bg-clip-text text-transparent">
              SOVEREIGN
            </div>
            <div className="text-2xl text-accent-cyan mt-4 font-light tracking-widest">
              AWAKENING
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Stage 2: Hex Mesh Formation */}
      {stage >= 1 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1920 1080"
          >
            {/* Animated hex grid */}
            {Array.from({ length: 12 }).map((_, row) =>
              Array.from({ length: 16 }).map((_, col) => {
                const x = col * 120 + (row % 2) * 60;
                const y = row * 104;
                const delay = (row + col) * 0.05;

                return (
                  <motion.polygon
                    key={`hex-${row}-${col}`}
                    points="60,0 120,30 120,90 60,120 0,90 0,30"
                    fill="none"
                    stroke="url(#hexGradient)"
                    strokeWidth="2"
                    transform={`translate(${x}, ${y})`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{
                      delay,
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  />
                );
              })
            )}

            <defs>
              <linearGradient
                id="hexGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00d9ff" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      )}

      {/* Stage 3: Core Text Emergence */}
      {stage >= 1 && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <h1 className="text-7xl font-black bg-gradient-to-r from-accent-gold via-accent-cyan to-accent-magenta bg-clip-text text-transparent">
              JONATHAN PEOPLES
            </h1>
            <p className="text-xl text-accent-cyan mt-4 font-light tracking-widest">
              SOVEREIGN TECH PORTFOLIO
            </p>
          </motion.div>

          {/* Status indicators */}
          <motion.div
            className="flex gap-8 text-sm font-mono text-accent-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
              HEX MESH COMPLETE
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
              AURA PROCESSING
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-magenta rounded-full animate-pulse" />
              VOICE WAITING
            </div>
          </motion.div>

          {/* Skip button */}
          <motion.button
            className="mt-12 px-8 py-3 border-2 border-accent-gold text-accent-gold font-mono text-sm hover:bg-accent-gold/10 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.8 }}
            onClick={onComplete}
          >
            SKIP SEQUENCE
          </motion.button>
        </motion.div>
      )}

      {/* Auto-complete after 5 seconds */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 0.5 }}
        onAnimationComplete={onComplete}
      />
    </div>
  );
};
