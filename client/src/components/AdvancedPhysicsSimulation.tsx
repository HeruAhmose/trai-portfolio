import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  pinned: boolean;
}

interface Constraint {
  p1: number;
  p2: number;
  restDistance: number;
}

export const AdvancedPhysicsSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const constraintsRef = useRef<Constraint[]>([]);
  const [simulationStats, setSimulationStats] = useState({
    fps: 60,
    particles: 0,
    constraints: 0,
    energy: 0,
  });

  // Initialize cloth simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 600;

    const clothWidth = 30;
    const clothHeight = 20;
    const spacing = 20;
    const particles: Particle[] = [];
    const constraints: Constraint[] = [];

    // Create cloth particles
    for (let y = 0; y < clothHeight; y++) {
      for (let x = 0; x < clothWidth; x++) {
        const particle: Particle = {
          x: 100 + x * spacing,
          y: 50 + y * spacing,
          vx: 0,
          vy: 0,
          mass: 1,
          pinned: y === 0 && (x === 0 || x === clothWidth - 1),
        };
        particles.push(particle);
      }
    }

    // Create constraints
    for (let y = 0; y < clothHeight; y++) {
      for (let x = 0; x < clothWidth; x++) {
        const index = y * clothWidth + x;

        // Horizontal constraint
        if (x < clothWidth - 1) {
          constraints.push({
            p1: index,
            p2: index + 1,
            restDistance: spacing,
          });
        }

        // Vertical constraint
        if (y < clothHeight - 1) {
          constraints.push({
            p1: index,
            p2: index + clothWidth,
            restDistance: spacing,
          });
        }

        // Diagonal constraints for stability
        if (x < clothWidth - 1 && y < clothHeight - 1) {
          constraints.push({
            p1: index,
            p2: index + clothWidth + 1,
            restDistance: spacing * Math.sqrt(2),
          });
        }
      }
    }

    particlesRef.current = particles;
    constraintsRef.current = constraints;

    setSimulationStats({
      fps: 60,
      particles: particles.length,
      constraints: constraints.length,
      energy: 0,
    });
  }, []);

  // Physics simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.2;
    const damping = 0.99;
    const constraintIterations = 3;

    let lastTime = Date.now();
    let frameCount = 0;

    const simulate = () => {
      const particles = particlesRef.current;
      const constraints = constraintsRef.current;

      // Apply forces
      particles.forEach((p) => {
        if (p.pinned) return;

        p.vy += gravity;
        p.vx *= damping;
        p.vy *= damping;

        p.x += p.vx;
        p.y += p.vy;

        // Boundary conditions
        if (p.x < 0) p.x = 0;
        if (p.x > canvas.width) p.x = canvas.width;
        if (p.y < 0) p.y = 0;
        if (p.y > canvas.height) p.y = canvas.height;
      });

      // Satisfy constraints
      for (let iter = 0; iter < constraintIterations; iter++) {
        constraints.forEach((c) => {
          const p1 = particles[c.p1];
          const p2 = particles[c.p2];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const difference = (distance - c.restDistance) / distance;

          const offsetX = dx * difference * 0.5;
          const offsetY = dy * difference * 0.5;

          if (!p1.pinned) {
            p1.x += offsetX;
            p1.y += offsetY;
          }
          if (!p2.pinned) {
            p2.x -= offsetX;
            p2.y -= offsetY;
          }
        });
      }

      // Draw
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw constraints
      ctx.strokeStyle = '#00d9ff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;

      constraints.forEach((c) => {
        const p1 = particles[c.p1];
        const p2 = particles[c.p2];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      ctx.globalAlpha = 1;

      // Draw particles
      particles.forEach((p) => {
        ctx.fillStyle = p.pinned ? '#ffd700' : '#00ff00';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();

        if (p.pinned) {
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Calculate energy
      let energy = 0;
      particles.forEach((p) => {
        energy += Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      });

      frameCount++;
      const now = Date.now();
      if (now - lastTime > 1000) {
        setSimulationStats((prev) => ({
          ...prev,
          fps: frameCount,
          energy: (energy / particles.length).toFixed(3) as any,
        }));
        frameCount = 0;
        lastTime = now;
      }

      requestAnimationFrame(simulate);
    };

    // Add mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      particlesRef.current.forEach((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 50) {
          const force = (50 - distance) / 50;
          p.vx += (dx / distance) * force * 0.5;
          p.vy += (dy / distance) * force * 0.5;
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    simulate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-b from-black/50 to-black/20 rounded-lg border border-cyan-400/30">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-lg font-bold text-cyan-400 mb-4 text-center">
          Advanced Physics Simulation (Cloth Dynamics)
        </h3>

        <canvas
          ref={canvasRef}
          className="w-full border border-cyan-400/20 rounded bg-black cursor-pointer mb-6"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-black/50 rounded border border-cyan-400/30">
            <div className="text-xs text-gold-400 mb-1">FPS</div>
            <div className="text-2xl font-bold text-cyan-400">
              {simulationStats.fps}
            </div>
          </div>

          <div className="p-4 bg-black/50 rounded border border-cyan-400/30">
            <div className="text-xs text-gold-400 mb-1">Particles</div>
            <div className="text-2xl font-bold text-green-400">
              {simulationStats.particles}
            </div>
          </div>

          <div className="p-4 bg-black/50 rounded border border-cyan-400/30">
            <div className="text-xs text-gold-400 mb-1">Constraints</div>
            <div className="text-2xl font-bold text-cyan-400">
              {simulationStats.constraints}
            </div>
          </div>

          <div className="p-4 bg-black/50 rounded border border-cyan-400/30">
            <div className="text-xs text-gold-400 mb-1">Energy</div>
            <div className="text-2xl font-bold text-magenta-400">
              {simulationStats.energy}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-black/50 rounded border border-cyan-400/20">
          <h4 className="text-sm font-bold text-cyan-400 mb-2">Simulation Parameters</h4>
          <div className="text-xs text-gold-400 font-mono space-y-1">
            <div>Gravity: 0.2 m/s²</div>
            <div>Damping: 0.99</div>
            <div>Constraint Iterations: 3</div>
            <div>Cloth Dimensions: 30×20 particles</div>
            <div>Particle Spacing: 20 pixels</div>
            <div className="mt-2 text-cyan-400">Move mouse over cloth to interact</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
