import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AstronomicalEffectsProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

/**
 * Advanced astronomical effects using Canvas API
 * Creates dynamic cosmic backgrounds with:
 * - Procedural nebula generation
 * - Animated star fields
 * - Volumetric light rays
 * - Particle systems
 * - Bloom and glow effects
 */
export const AstronomicalEffects: React.FC<AstronomicalEffectsProps> = ({
  className = '',
  intensity = 'high',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    type: 'star' | 'nebula' | 'ray';
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    // Color palette
    const colors = {
      gold: '#DAA520',
      emerald: '#228B22',
      sapphire: '#1E3A8A',
      hotPink: '#FF0080',
      cyan: '#00D9FF',
      purple: '#9D4EDD',
    };

    const colorArray = Object.values(colors);

    // Initialize particles
    const particleCount = intensity === 'high' ? 200 : intensity === 'medium' ? 100 : 50;
    particlesRef.current = [];

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: Math.random(),
        maxLife: 1,
        size: Math.random() * 3 + 0.5,
        color: colorArray[Math.floor(Math.random() * colorArray.length)],
        type: (['star', 'nebula', 'ray'] as const)[Math.floor(Math.random() * 3)],
      });
    }

    let time = 0;

    // Draw functions
    const drawNebula = (x: number, y: number, size: number, color: string, opacity: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.8})`);
      gradient.addColorStop(0.5, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawStar = (x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.fillStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 3;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawLightRay = (x: number, y: number, length: number, angle: number, color: string, opacity: number) => {
      ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2;
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    };

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.016; // ~60fps

      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background nebula
      const nebulaCenterX = canvas.width / 2 + Math.sin(time * 0.3) * 100;
      const nebulaCenterY = canvas.height / 2 + Math.cos(time * 0.2) * 100;
      drawNebula(nebulaCenterX, nebulaCenterY, 300, colors.gold, 0.15);
      drawNebula(nebulaCenterX + 200, nebulaCenterY - 150, 250, colors.sapphire, 0.1);
      drawNebula(nebulaCenterX - 200, nebulaCenterY + 150, 280, colors.hotPink, 0.12);

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i];

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Update life
        particle.life -= 0.01;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw based on type
        const opacity = Math.max(0, particle.life / particle.maxLife);

        if (particle.type === 'star') {
          drawStar(particle.x, particle.y, particle.size, particle.color, opacity);
        } else if (particle.type === 'nebula') {
          drawNebula(particle.x, particle.y, particle.size * 5, particle.color, opacity * 0.3);
        } else {
          drawLightRay(
            particle.x,
            particle.y,
            particle.size * 20,
            time + i,
            particle.color,
            opacity * 0.5
          );
        }

        // Respawn if dead
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.vx = (Math.random() - 0.5) * 0.5;
          particle.vy = (Math.random() - 0.5) * 0.5;
          particle.life = 1;
          particle.color = colorArray[Math.floor(Math.random() * colorArray.length)];
          particle.type = (['star', 'nebula', 'ray'] as const)[Math.floor(Math.random() * 3)];
        }
      }

      // Draw pulsing core
      const coreSize = 50 + Math.sin(time * 2) * 20;
      const coreGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        coreSize
      );
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      coreGradient.addColorStop(0.5, `${colors.cyan}40`);
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, coreSize, 0, Math.PI * 2);
      ctx.fill();
    };

    animate();

    // Handle resize
    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [intensity]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 } as any}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
