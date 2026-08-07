import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Ultra Visual Effects Component
 * Extreme visual appeal with multiple layered effects
 */
export const UltraVisualEffects: React.FC<{
  intensity?: "low" | "medium" | "high";
  children?: React.ReactNode;
}> = ({ intensity = "high", children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;
    let time = 0;

    const intensityMultiplier = {
      low: 0.3,
      medium: 0.6,
      high: 1,
    }[intensity];

    const drawFrame = () => {
      time += 0.01;

      // Clear with fade
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw multiple layers of effects
      drawParticleField(ctx, time, intensityMultiplier);
      drawWaveEffect(ctx, time, intensityMultiplier);
      drawAuroraEffect(ctx, time, intensityMultiplier);
      drawGlitchEffect(ctx, time, intensityMultiplier);

      animationId = requestAnimationFrame(drawFrame);
    };

    const drawParticleField = (
      ctx: CanvasRenderingContext2D,
      time: number,
      intensity: number
    ) => {
      const particleCount = Math.floor(50 * intensity);
      for (let i = 0; i < particleCount; i++) {
        const x =
          (Math.sin(time * 0.5 + i) * canvas.width) / 2 + canvas.width / 2;
        const y =
          (Math.cos(time * 0.3 + i * 0.5) * canvas.height) / 2 +
          canvas.height / 2;
        const size = 2 + Math.sin(time + i) * 2;
        const opacity = (Math.sin(time * 2 + i) + 1) / 2;

        ctx.fillStyle = `rgba(218, 165, 32, ${opacity * 0.6 * intensity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawWaveEffect = (
      ctx: CanvasRenderingContext2D,
      time: number,
      intensity: number
    ) => {
      ctx.strokeStyle = `rgba(0, 217, 255, ${0.3 * intensity})`;
      ctx.lineWidth = 2;

      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          const y =
            canvas.height / 2 +
            Math.sin((x * 0.01 + time * 0.5 + wave) * Math.PI) * 50 * intensity;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const drawAuroraEffect = (
      ctx: CanvasRenderingContext2D,
      time: number,
      intensity: number
    ) => {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, `rgba(218, 165, 32, ${0.1 * intensity})`);
      gradient.addColorStop(0.5, `rgba(0, 217, 255, ${0.2 * intensity})`);
      gradient.addColorStop(1, `rgba(255, 0, 127, ${0.1 * intensity})`);

      ctx.fillStyle = gradient;
      ctx.globalAlpha = Math.sin(time * 0.3) * 0.3 * intensity;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    };

    const drawGlitchEffect = (
      ctx: CanvasRenderingContext2D,
      time: number,
      intensity: number
    ) => {
      if (Math.random() > 0.95 * (1 - intensity * 0.5)) {
        const glitchX = Math.random() * canvas.width;
        const glitchY = Math.random() * canvas.height;
        const glitchWidth = Math.random() * 100 + 50;
        const glitchHeight = Math.random() * 50 + 20;

        ctx.fillStyle = `rgba(218, 165, 32, ${Math.random() * 0.3 * intensity})`;
        ctx.fillRect(glitchX, glitchY, glitchWidth, glitchHeight);

        ctx.fillStyle = `rgba(0, 217, 255, ${Math.random() * 0.2 * intensity})`;
        ctx.fillRect(
          glitchX + 5,
          glitchY + 5,
          glitchWidth - 10,
          glitchHeight - 10
        );
      }
    };

    drawFrame();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [intensity]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Overlay content */}
      <div className="relative z-10">{children}</div>

      {/* Extreme glow effects */}
      <motion.div
        className="fixed top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-afro-gold to-transparent rounded-full blur-3xl opacity-20 pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ zIndex: 0 }}
      />

      <motion.div
        className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-afro-sapphire to-transparent rounded-full blur-3xl opacity-20 pointer-events-none"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{ zIndex: 0 }}
      />

      {/* Chromatic aberration effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(45deg, rgba(218,165,32,0.05), rgba(0,217,255,0.05))",
          zIndex: 2,
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </div>
  );
};
