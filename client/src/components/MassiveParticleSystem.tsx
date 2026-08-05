import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  hue: number;
}

export const MassiveParticleSystem: React.FC<{
  particleCount?: number;
  intensity?: number;
  className?: string;
}> = ({ particleCount = 50000, intensity = 1, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', {}) as CanvasRenderingContext2D | null;
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random(),
        size: Math.random() * 2 + 0.5,
        hue: Math.random() * 360,
      });
    }
    particlesRef.current = particles;

    let frameCount = 0;
    const animate = () => {
      frameCount++;

      // Clear with fade effect
      ctx.fillStyle = 'rgba(5, 5, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.002 * intensity;

        // Add some gravity and turbulence
        p.vy += 0.01;
        p.vx += Math.sin(frameCount * 0.01 + i) * 0.02;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Reset if dead
        if (p.life <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.vx = (Math.random() - 0.5) * 2;
          p.vy = (Math.random() - 0.5) * 2;
          p.life = 1;
          p.hue = Math.random() * 360;
        }

        // Draw particle
        const brightness = Math.max(0, p.life);
        ctx.fillStyle = `hsla(${p.hue}, 100%, ${50 + brightness * 30}%, ${brightness * 0.6})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        // Draw glow
        ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, ${brightness * 0.3})`;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      ctx.shadowColor = 'rgba(0, 0, 0, 0)';
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default MassiveParticleSystem;
