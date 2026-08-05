import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AMCVisualizationProps {
  isActive: boolean;
}

export default function AMCVisualization({ isActive }: AMCVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;

      // Clear canvas
      ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw orbiting particles (representing constituents)
      const constituents = [
        { label: 'Hemp Carbon', color: '#ffd700', angle: time * 0.5 },
        { label: 'Quartz', color: '#00d9ff', angle: time * 0.7 + Math.PI / 2 },
        { label: 'Tourmaline', color: '#ff00ff', angle: time * 0.6 + Math.PI },
        { label: 'Magnetite', color: '#00ff88', angle: time * 0.8 + (3 * Math.PI) / 2 },
      ];

      constituents.forEach((constituent) => {
        const radius = 120;
        const x = centerX + Math.cos(constituent.angle) * radius;
        const y = centerY + Math.sin(constituent.angle) * radius;

        // Draw particle
        ctx.fillStyle = constituent.color;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow
        ctx.strokeStyle = constituent.color + '40';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.stroke();

        // Draw connection line to center
        ctx.strokeStyle = constituent.color + '20';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      });

      // Draw central core
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fill();

      // Draw rotating rings
      const rings = [40, 80, 120];
      rings.forEach((radius, idx) => {
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 - idx * 0.08})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw rare-earth dopant visualization
      const dopantCount = 8;
      for (let i = 0; i < dopantCount; i++) {
        const angle = (time * 1.2 + (i / dopantCount) * Math.PI * 2) % (Math.PI * 2);
        const radius = 60;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.fillStyle = '#ff00ff';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ff00ff40';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw text labels
      ctx.fillStyle = '#e0e0e0';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ARCHITECTED MULTI-MODAL COUPLING', centerX, 40);
      ctx.font = '12px monospace';
      ctx.fillStyle = '#a0a0a0';
      ctx.fillText('Hemp • Quartz • Tourmaline • Magnetite • Rare-Earth Dopants', centerX, 65);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  return (
    <motion.div
      className="w-full h-full rounded-lg border border-primary neon-border overflow-hidden bg-background/50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
      transition={{ duration: 0.6 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </motion.div>
  );
}
