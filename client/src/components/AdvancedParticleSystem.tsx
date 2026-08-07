import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
  type: "standard" | "glow" | "trail";
}

export const AdvancedParticleSystem: React.FC<{
  width?: number;
  height?: number;
  particleCount?: number;
  emitterType?: "fountain" | "explosion" | "ambient" | "swarm";
}> = ({
  width = 800,
  height = 600,
  particleCount = 200,
  emitterType = "ambient",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const animationFrame = () => {
      timeRef.current++;

      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(10, 14, 39, 0.1)";
      ctx.fillRect(0, 0, width, height);

      // Add new particles based on emitter type
      if (particlesRef.current.length < particleCount) {
        const newParticles = generateParticles(emitterType, 5);
        particlesRef.current.push(...newParticles);
      }

      // Update and render particles
      particlesRef.current = particlesRef.current
        .map(p => updateParticle(p, emitterType))
        .filter(p => p.life > 0);

      // Render particles with advanced effects
      particlesRef.current.forEach(p => {
        renderParticle(ctx, p);
      });

      requestAnimationFrame(animationFrame);
    };

    animationFrame();
  }, [width, height, particleCount, emitterType]);

  const generateParticles = (type: string, count: number): Particle[] => {
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      switch (type) {
        case "fountain":
          particles.push({
            x: width / 2 + (Math.random() - 0.5) * 50,
            y: height,
            vx: (Math.random() - 0.5) * 8,
            vy: -Math.random() * 12 - 5,
            life: 1,
            size: Math.random() * 3 + 1,
            color: `hsl(${Math.random() * 60 + 180}, 100%, 50%)`,
            type: Math.random() > 0.7 ? "glow" : "standard",
          });
          break;

        case "explosion":
          particles.push({
            x: width / 2,
            y: height / 2,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            life: 1,
            size: Math.random() * 4 + 2,
            color: `hsl(${Math.random() * 60}, 100%, ${Math.random() * 30 + 50}%)`,
            type: "trail",
          });
          break;

        case "swarm":
          const angle = (i / count) * Math.PI * 2;
          const speed = 3 + Math.random() * 2;
          particles.push({
            x: width / 2 + Math.cos(angle) * 100,
            y: height / 2 + Math.sin(angle) * 100,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            size: Math.random() * 2 + 1,
            color: `hsl(${200 + Math.random() * 60}, 80%, 50%)`,
            type: "glow",
          });
          break;

        case "ambient":
        default:
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            size: Math.random() * 1.5 + 0.5,
            color: `hsla(${Math.random() * 360}, 100%, 50%, ${Math.random() * 0.5 + 0.3})`,
            type: "standard",
          });
          break;
      }
    }

    return particles;
  };

  const updateParticle = (p: Particle, type: string): Particle => {
    const updated = { ...p };

    // Apply physics
    updated.x += updated.vx;
    updated.y += updated.vy;
    updated.life -= 0.01;

    // Gravity
    if (type === "fountain" || type === "explosion") {
      updated.vy += 0.2;
    }

    // Swarm behavior
    if (type === "swarm") {
      const centerX = width / 2;
      const centerY = height / 2;
      const dx = centerX - updated.x;
      const dy = centerY - updated.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 150) {
        updated.vx += (dx / dist) * 0.1;
        updated.vy += (dy / dist) * 0.1;
      }
    }

    // Ambient drift
    if (type === "ambient") {
      updated.vx += (Math.random() - 0.5) * 0.1;
      updated.vy += (Math.random() - 0.5) * 0.1;
    }

    // Bounce off edges
    if (updated.x < 0 || updated.x > width) updated.vx *= -1;
    if (updated.y < 0 || updated.y > height) updated.vy *= -1;

    // Keep in bounds
    updated.x = Math.max(0, Math.min(width, updated.x));
    updated.y = Math.max(0, Math.min(height, updated.y));

    return updated;
  };

  const renderParticle = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.globalAlpha = p.life;

    switch (p.type) {
      case "glow":
        // Glowing particle with bloom effect
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "trail":
        // Trail particle with gradient
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 2
        );
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "standard":
      default:
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg border border-cyan-400/30 shadow-lg shadow-cyan-400/20"
    />
  );
};
