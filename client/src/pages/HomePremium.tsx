import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Globe } from "lucide-react";
import { soundDesignService } from "@/services/soundDesign";
import "../styles/premiumDesign.css";

/**
 * Premium Home Page
 * Sleek, sophisticated, and visually stunning
 */
export default function HomePremium() {
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

    const drawPremiumBackground = () => {
      time += 0.005;

      // Clear with fade
      ctx.fillStyle = "rgba(10, 14, 39, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw premium animated grid
      drawPremiumGrid(ctx, time);
      drawPremiumParticles(ctx, time);
      drawPremiumGradientOrbs(ctx, time);

      animationId = requestAnimationFrame(drawPremiumBackground);
    };

    const drawPremiumGrid = (ctx: CanvasRenderingContext2D, time: number) => {
      const gridSize = 50;
      const opacity = 0.05 + Math.sin(time * 0.5) * 0.03;

      ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(time + x * 0.01) * 5, 0);
        ctx.lineTo(x + Math.sin(time + x * 0.01) * 5, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + Math.cos(time + y * 0.01) * 5);
        ctx.lineTo(canvas.width, y + Math.cos(time + y * 0.01) * 5);
        ctx.stroke();
      }
    };

    const drawPremiumParticles = (
      ctx: CanvasRenderingContext2D,
      time: number
    ) => {
      const particleCount = 30;
      for (let i = 0; i < particleCount; i++) {
        const x =
          (Math.sin(time * 0.3 + i) * canvas.width) / 2 + canvas.width / 2;
        const y =
          (Math.cos(time * 0.2 + i * 0.5) * canvas.height) / 2 +
          canvas.height / 2;
        const size = 1 + Math.sin(time * 2 + i) * 1;
        const opacity = (Math.sin(time * 1.5 + i) + 1) / 2;

        ctx.fillStyle = `rgba(212, 175, 55, ${opacity * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawPremiumGradientOrbs = (
      ctx: CanvasRenderingContext2D,
      time: number
    ) => {
      // Orb 1 - Gold
      const x1 = Math.sin(time * 0.3) * 300 + canvas.width / 2;
      const y1 = Math.cos(time * 0.25) * 200 + canvas.height / 3;
      const gradient1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, 150);
      gradient1.addColorStop(0, "rgba(212, 175, 55, 0.1)");
      gradient1.addColorStop(1, "rgba(212, 175, 55, 0)");
      ctx.fillStyle = gradient1;
      ctx.fillRect(x1 - 150, y1 - 150, 300, 300);

      // Orb 2 - Cyan
      const x2 = Math.sin(time * 0.4 + 2) * 300 + canvas.width / 2;
      const y2 = Math.cos(time * 0.35 + 2) * 200 + (canvas.height * 2) / 3;
      const gradient2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, 150);
      gradient2.addColorStop(0, "rgba(0, 217, 255, 0.08)");
      gradient2.addColorStop(1, "rgba(0, 217, 255, 0)");
      ctx.fillStyle = gradient2;
      ctx.fillRect(x2 - 150, y2 - 150, 300, 300);
    };

    drawPremiumBackground();

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-color-primary"
    >
      {/* Premium Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Premium Gradient Overlays */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)",
          zIndex: 1,
        }}
      />

      <motion.div
        className="fixed top-0 right-0 w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 80% 50%, rgba(0, 217, 255, 0.05) 0%, transparent 50%)",
          zIndex: 1,
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <motion.div
            className="mb-6 inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity }}
          >
            <Sparkles className="w-12 h-12 text-accent-gold" />
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-6 text-gradient"
            variants={itemVariants}
          >
            Sovereign Intelligence
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
            variants={itemVariants}
          >
            Advanced research in quantum computing, materials science, and
            autonomous systems. Pioneering the future of technology through
            innovation and sovereign intelligence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            variants={itemVariants}
          >
            <motion.button
              className="btn-premium btn-premium-gold group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => soundDesignService.playUISound("click")}
            >
              <span className="flex items-center gap-2">
                Explore Projects
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button
              className="btn-premium btn-premium-cyan"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => soundDesignService.playUISound("hover")}
            >
              View Research
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-16"
          variants={containerVariants}
        >
          {[
            {
              icon: Zap,
              title: "Quantum Computing",
              description:
                "Advanced quantum algorithms and hardware optimization",
            },
            {
              icon: Globe,
              title: "Materials Science",
              description: "Novel materials with extraordinary properties",
            },
            {
              icon: Sparkles,
              title: "AI Systems",
              description: "Sovereign intelligence and autonomous systems",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="card-premium"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <feature.icon className="w-8 h-8 text-accent-gold mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-accent-gold rounded-full flex items-center justify-center">
          <motion.div
            className="w-1 h-2 bg-accent-gold rounded-full"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
}
