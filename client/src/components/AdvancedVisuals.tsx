import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random() * 100 + 50,
          maxLife: 150,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? "#ffd700" : "#00d9ff",
        });
      }
    };

    initParticles();

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(10, 14, 39, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life < 0) {
          return false;
        }

        const alpha = (p.life / p.maxLife) * 0.6;
        const rgbColor =
          p.color === "#ffd700" ? "rgb(255, 215, 0)" : "rgb(0, 217, 255)";
        ctx.fillStyle = rgbColor
          .replace("rgb", `rgba`)
          .replace(")", `, ${alpha})`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections between nearby particles
        particlesRef.current.forEach(p2 => {
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = `rgba(255, 215, 0, ${(1 - distance / 100) * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        return true;
      });

      // Add new particles occasionally
      if (particlesRef.current.length < 50 && Math.random() > 0.7) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 150,
          maxLife: 150,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? "#ffd700" : "#00d9ff",
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(10,14,39,0.5) 0%, rgba(5,7,20,1) 100%)",
      }}
    />
  );
};

export const HolographicText = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Base text */}
      <div className="relative z-10">{children}</div>

      {/* Holographic glow layers */}
      <motion.div
        className="absolute inset-0 blur-md opacity-50"
        style={{
          background: "linear-gradient(45deg, #ffd700, #00d9ff, #ffd700)",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
      >
        {children}
      </motion.div>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ["200% 0%", "-200% 0%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent)",
          backgroundSize: "200% 100%",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const GlitchText = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        textShadow: [
          "0 0 0 #ffd700, 0 0 0 #00d9ff",
          "2px 2px 0 #ffd700, -2px -2px 0 #00d9ff",
          "-2px 2px 0 #ffd700, 2px -2px 0 #00d9ff",
          "0 0 0 #ffd700, 0 0 0 #00d9ff",
        ],
      }}
      transition={{
        duration: 0.3,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 2,
      }}
    >
      {children}
    </motion.div>
  );
};

export const NeuralNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number }>
  >([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;

    // Initialize nodes
    const nodeCount = 15;
    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
    }));

    const animate = () => {
      ctx.fillStyle = "rgba(10, 14, 39, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodesRef.current.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw connections
        nodesRef.current.forEach((other, j) => {
          if (i < j) {
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              ctx.strokeStyle = `rgba(0, 217, 255, ${(1 - distance / 150) * 0.5})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });

        // Draw node
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow
        ctx.fillStyle = "rgba(255, 215, 0, 0.3)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded border border-primary/30 bg-card"
    />
  );
};

export const AnimatedGradientBorder = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
      }}
      style={{
        background:
          "linear-gradient(45deg, #ffd700, #00d9ff, #ff00ff, #ffd700)",
        backgroundSize: "300% 300%",
        padding: "2px",
        borderRadius: "8px",
      }}
    >
      <div className="bg-background rounded">{children}</div>
    </motion.div>
  );
};

export const FloatingElement = ({
  children,
  duration = 4,
  delay = 0,
}: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        type: "tween",
      }}
    >
      {children}
    </motion.div>
  );
};

export const PulseGlow = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          "0 0 20px rgba(255, 215, 0, 0.3)",
          "0 0 40px rgba(0, 217, 255, 0.5)",
          "0 0 20px rgba(255, 215, 0, 0.3)",
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
    >
      {children}
    </motion.div>
  );
};
