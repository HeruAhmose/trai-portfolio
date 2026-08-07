import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../styles/premiumDesign.css";

interface TraiCinematicEffectsProps {
  children?: React.ReactNode;
  showAurora?: boolean;
  showOrbital?: boolean;
  showTelemetry?: boolean;
}

/**
 * TRAI-Inspired Cinematic Effects Component
 * Integrates parallax, aurora, orbital systems, and telemetry labels
 */
export const TraiCinematicEffects: React.FC<TraiCinematicEffectsProps> = ({
  children,
  showAurora = true,
  showOrbital = true,
  showTelemetry = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = React.useState(0);

  // Starfield background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      opacity: number;
    }> = [];
    const starCount = Math.floor((canvas.width * canvas.height) / 8000);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2,
        opacity: Math.random() * 0.6 + 0.4,
      });
    }

    let animationId: number;
    let time = 0;

    const drawStarfield = () => {
      time += 0.005;

      // Fade effect
      ctx.fillStyle = "rgba(10, 14, 39, 0.02)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(star => {
        ctx.fillStyle = `rgba(240, 207, 123, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Twinkling
        star.opacity += (Math.random() - 0.5) * 0.03;
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));
      });

      animationId = requestAnimationFrame(drawStarfield);
    };

    drawStarfield();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Scroll tracking for parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Aurora Effects */}
      {showAurora && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 40%)",
              zIndex: 1,
            }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <motion.div
            className="fixed top-0 right-0 w-full h-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 70% 30%, rgba(0, 217, 255, 0.06) 0%, transparent 50%)",
              zIndex: 1,
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />
        </>
      )}

      {/* Orbital System */}
      {showOrbital && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none z-2">
          {/* Orbit Rings */}
          {[1, 2, 3].map(orbit => (
            <motion.div
              key={`orbit-${orbit}`}
              className="absolute inset-0 border border-accent-gold/20 rounded-full"
              style={{
                width: `${100 + orbit * 60}px`,
                height: `${100 + orbit * 60}px`,
                left: `50%`,
                top: `50%`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 20 + orbit * 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Orbit Nodes */}
          {[0, 90, 180, 270].map(angle => (
            <motion.div
              key={`node-${angle}`}
              className="absolute w-3 h-3 bg-accent-cyan rounded-full shadow-lg"
              style={{
                left: `50%`,
                top: `50%`,
              }}
              animate={{
                x: Math.cos((angle * Math.PI) / 180) * 100,
                y: Math.sin((angle * Math.PI) / 180) * 100,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Central Heart Orb */}
          <motion.div
            className="absolute w-6 h-6 bg-gradient-to-br from-accent-gold to-accent-cyan rounded-full shadow-2xl"
            style={{
              left: `50%`,
              top: `50%`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 20px rgba(212, 175, 55, 0.5)",
                "0 0 40px rgba(212, 175, 55, 0.8)",
                "0 0 20px rgba(212, 175, 55, 0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </div>
      )}

      {/* Telemetry Labels */}
      {showTelemetry && (
        <div className="fixed top-20 right-8 z-10 space-y-4 pointer-events-none">
          {[
            { label: "SYS / 07", delay: 0 },
            { label: "RETURN LOOP / ACTIVE", delay: 0.2 },
            { label: "MEMORY FIELD / LOCKED", delay: 0.4 },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="text-xs font-mono text-accent-gold/70 tracking-widest"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay, duration: 0.6 }}
            >
              ◆ {item.label}
            </motion.div>
          ))}
        </div>
      )}

      {/* Pointer Aura */}
      <motion.div
        className="fixed pointer-events-none z-2"
        style={{
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(43, 111, 159, 0.05), transparent 70%)",
          pointerEvents: "none",
        }}
        animate={{
          x: "var(--pointer-x, 50vw)",
          y: "var(--pointer-y, 40vh)",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        onMouseMove={e => {
          const x = e.clientX;
          const y = e.clientY;
          (e.currentTarget as HTMLElement).style.setProperty(
            "--pointer-x",
            `${x - 200}px`
          );
          (e.currentTarget as HTMLElement).style.setProperty(
            "--pointer-y",
            `${y - 200}px`
          );
        }}
      />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent-gold to-accent-cyan z-50"
        style={{
          width: `${(scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
