import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Advanced 3D visualization using Canvas 3D rendering
 * Creates an immersive, interactive 3D environment with particles, waves, and geometric shapes
 */
export const AdvancedThreeDVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / canvas.width,
        y: e.clientY / canvas.height,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 3D Point class
    class Point3D {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      originalX: number;
      originalY: number;
      originalZ: number;

      constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.originalX = x;
        this.originalY = y;
        this.originalZ = z;
        this.vx = (Math.random() - 0.5) * 0.02;
        this.vy = (Math.random() - 0.5) * 0.02;
        this.vz = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        // Oscillate around original position
        this.vx += (this.originalX - this.x) * 0.0001;
        this.vy += (this.originalY - this.y) * 0.0001;
        this.vz += (this.originalZ - this.z) * 0.0001;

        // Damping
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vz *= 0.98;
      }

      project(focalLength: number, centerX: number, centerY: number) {
        const scale = focalLength / (focalLength + this.z);
        return {
          x: this.x * scale + centerX,
          y: this.y * scale + centerY,
          scale,
          z: this.z,
        };
      }
    }

    // Create particle cloud
    const particles: Point3D[] = [];
    const particleCount = 200;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 200;
      const z = (Math.random() - 0.5) * 400;

      particles.push(
        new Point3D(Math.cos(angle) * radius, Math.sin(angle) * radius, z)
      );
    }

    setIsLoading(false);

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;

      // Clear with fade
      ctx.fillStyle = 'rgba(10, 14, 39, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const focalLength = 300;

      // Update and project particles
      particles.forEach((particle) => {
        particle.update();

        // Apply mouse influence
        const dx = mouseRef.current.x - 0.5;
        const dy = mouseRef.current.y - 0.5;
        particle.vx += dx * 0.0001;
        particle.vy += dy * 0.0001;

        const projected = particle.project(focalLength, centerX, centerY);

        // Draw particle with glow
        const brightness = (projected.scale + 1) / 2;
        const size = Math.max(1, projected.scale * 3);

        // Glow
        const gradient = ctx.createRadialGradient(
          projected.x,
          projected.y,
          0,
          projected.x,
          projected.y,
          size * 3
        );

        if (particle.z > 0) {
          gradient.addColorStop(0, `rgba(255, 215, 0, ${brightness * 0.6})`);
          gradient.addColorStop(1, `rgba(255, 215, 0, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(0, 217, 255, ${brightness * 0.6})`);
          gradient.addColorStop(1, `rgba(0, 217, 255, 0)`);
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle =
          particle.z > 0
            ? `rgba(255, 215, 0, ${brightness})`
            : `rgba(0, 217, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dz = p2.z - p1.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 150) {
            const proj1 = p1.project(focalLength, centerX, centerY);
            const proj2 = p2.project(focalLength, centerX, centerY);

            const alpha = (1 - distance / 150) * 0.3;
            ctx.strokeStyle =
              p1.z > 0
                ? `rgba(255, 215, 0, ${alpha})`
                : `rgba(0, 217, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(proj1.x, proj1.y);
            ctx.lineTo(proj2.x, proj2.y);
            ctx.stroke();
          }
        }
      }

      // Draw rotating geometric shapes
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.1);

      // Outer ring
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 150, 0, Math.PI * 2);
      ctx.stroke();

      // Inner hexagon
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 100;
        const y = Math.sin(angle) * 100;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'radial-gradient(ellipse at center, rgba(10,14,39,0.8) 0%, rgba(5,7,20,1) 100%)' }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
            className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Holographic data visualization with animated metrics
 */
export const HolographicMetrics = ({
  data,
}: {
  data: Array<{ label: string; value: number; max: number; color: string }>;
}) => {
  return (
    <div className="space-y-6">
      {data.map((metric, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono text-foreground">{metric.label}</span>
            <span
              className="text-sm font-mono text-primary animate-pulse-opacity"
            >
              {Math.round((metric.value / metric.max) * 100)}%
            </span>
          </div>

          <div className="relative h-2 rounded-full overflow-hidden bg-card border border-primary/20">
            <motion.div
              className={`h-full rounded-full ${metric.color}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${(metric.value / metric.max) * 100}%` }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              style={{
                boxShadow: `0 0 20px ${metric.color.includes('yellow') ? '#ffd700' : '#00d9ff'}`,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Animated holographic grid background
 */
export const HolographicGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full opacity-20" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="url(#gridGradient)" strokeWidth="1" />
          </pattern>
          <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00d9ff" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated scan lines */}
      <motion.div
        className="absolute inset-0 animate-scan-line"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0, 217, 255, 0.1) 50%, transparent 100%)',
          backgroundSize: '100% 200%',
        }}
      />
    </div>
  );
};
