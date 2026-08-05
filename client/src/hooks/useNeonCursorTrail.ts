import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  angle: number;
}

const NEON_COLORS = [
  '#ffd700', // Gold
  '#00ffff', // Cyan
  '#ff00ff', // Magenta
  '#00ff00', // Lime
  '#ff0080', // Hot Pink
  '#00d9ff', // Electric Cyan
];

const PARTICLE_COUNT = 8;
const PARTICLE_LIFE = 0.8;
const PARTICLE_SIZE_MIN = 2;
const PARTICLE_SIZE_MAX = 6;
const VELOCITY_SPREAD = 2;
const MEGA_BURST_COUNT = 60;
const MEGA_BURST_LIFE = 1.2;
const DIRECTIONAL_BURST_COUNT = 30;

export const useNeonCursorTrail = (enabled: boolean = true) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastParticleTimeRef = useRef(0);
  const selectedColorRef = useRef(0);
  const keyPressedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;

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

    // Helper function to create particles
    const createParticles = (
      count: number,
      x: number,
      y: number,
      maxLife: number = PARTICLE_LIFE,
      velocityMultiplier: number = 1,
      colorOverride?: string
    ): void => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const velocity = (50 + Math.random() * VELOCITY_SPREAD * 50) * velocityMultiplier;

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 0,
          maxLife,
          size: PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN),
          color: colorOverride || NEON_COLORS[selectedColorRef.current],
          angle,
        });
      }
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Create particles on mouse move
      const now = performance.now() / 1000;
      if (now - lastParticleTimeRef.current > 0.02) {
        createParticles(PARTICLE_COUNT, mouseRef.current.x, mouseRef.current.y);
        lastParticleTimeRef.current = now;
      }
    };

    // Keyboard event handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      keyPressedRef.current.add(e.key);

      // Spacebar - Mega burst
      if (e.code === 'Space') {
        e.preventDefault();
        createParticles(
          MEGA_BURST_COUNT,
          mouseRef.current.x,
          mouseRef.current.y,
          MEGA_BURST_LIFE,
          1.5
        );
      }

      // Arrow keys - Directional bursts
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        for (let i = 0; i < DIRECTIONAL_BURST_COUNT; i++) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
          const velocity = 100 + Math.random() * 50;
          particlesRef.current.push({
            x: mouseRef.current.x,
            y: mouseRef.current.y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 0,
            maxLife: MEGA_BURST_LIFE,
            size: PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN),
            color: NEON_COLORS[selectedColorRef.current],
            angle,
          });
        }
      }

      if (e.code === 'ArrowDown') {
        e.preventDefault();
        for (let i = 0; i < DIRECTIONAL_BURST_COUNT; i++) {
          const angle = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
          const velocity = 100 + Math.random() * 50;
          particlesRef.current.push({
            x: mouseRef.current.x,
            y: mouseRef.current.y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 0,
            maxLife: MEGA_BURST_LIFE,
            size: PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN),
            color: NEON_COLORS[selectedColorRef.current],
            angle,
          });
        }
      }

      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        for (let i = 0; i < DIRECTIONAL_BURST_COUNT; i++) {
          const angle = Math.PI + (Math.random() - 0.5) * 0.4;
          const velocity = 100 + Math.random() * 50;
          particlesRef.current.push({
            x: mouseRef.current.x,
            y: mouseRef.current.y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 0,
            maxLife: MEGA_BURST_LIFE,
            size: PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN),
            color: NEON_COLORS[selectedColorRef.current],
            angle,
          });
        }
      }

      if (e.code === 'ArrowRight') {
        e.preventDefault();
        for (let i = 0; i < DIRECTIONAL_BURST_COUNT; i++) {
          const angle = (Math.random() - 0.5) * 0.4;
          const velocity = 100 + Math.random() * 50;
          particlesRef.current.push({
            x: mouseRef.current.x,
            y: mouseRef.current.y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 0,
            maxLife: MEGA_BURST_LIFE,
            size: PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN),
            color: NEON_COLORS[selectedColorRef.current],
            angle,
          });
        }
      }

      // Number keys (1-6) - Color selection
      if (e.key >= '1' && e.key <= '6') {
        const colorIndex = parseInt(e.key) - 1;
        if (colorIndex < NEON_COLORS.length) {
          selectedColorRef.current = colorIndex;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keyPressedRef.current.delete(e.key);
    };

    // Animation loop
    const animate = (): void => {
      // Clear canvas with slight trail effect
      ctx.fillStyle = 'rgba(4, 1, 33, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i];
        particle.life += 1 / 60;

        if (particle.life >= particle.maxLife) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        // Update position
        particle.x += particle.vx / 60;
        particle.y += particle.vy / 60;

        // Apply gravity
        particle.vy += 50 / 60;

        // Calculate opacity based on life
        const progress = particle.life / particle.maxLife;
        const opacity = Math.max(0, 1 - progress);

        // Draw particle
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw circle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = opacity * 0.5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size + 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // Draw cursor indicator
      ctx.save();
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw cursor glow ring
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled]);

  return canvasRef;
};
