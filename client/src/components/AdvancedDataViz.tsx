import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  label: string;
  value: number;
  max: number;
  color: string;
}

interface AdvancedRadarChartProps {
  data: DataPoint[];
  className?: string;
  animated?: boolean;
}

/**
 * Advanced 3D-like radar chart with animated fills
 * Creates sophisticated data visualization
 */
export const AdvancedRadarChart: React.FC<AdvancedRadarChartProps> = ({
  data,
  className = '',
  animated = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = 150;
    const levels = 5;

    let animationProgress = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (animated) {
        animationProgress = (animationProgress + 0.01) % 1;
      } else {
        animationProgress = 1;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw concentric circles (levels)
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= levels; i++) {
        const radius = (maxRadius / levels) * i;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw axes
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < data.length; i++) {
        const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * maxRadius;
        const y = centerY + Math.sin(angle) * maxRadius;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Draw data polygon
      const points = data.map((item, i) => {
        const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2;
        const radius = (item.value / item.max) * maxRadius * animationProgress;
        return {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          color: item.color,
        };
      });

      // Draw filled polygon with gradient
      ctx.fillStyle = 'rgba(0, 217, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fill();

      // Draw outline
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points
      points.forEach((point) => {
        ctx.fillStyle = point.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow
        ctx.strokeStyle = point.color + '40';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      data.forEach((item, i) => {
        const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (maxRadius + 30);
        const y = centerY + Math.sin(angle) * (maxRadius + 30);
        ctx.fillText(item.label, x, y);
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [data, animated]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ filter: 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.3))' }}
    />
  );
};

interface AnimatedBarChartProps {
  data: DataPoint[];
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

/**
 * Animated bar chart with smooth fills
 */
export const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  data,
  className = '',
  direction = 'vertical',
}) => {
  return (
    <div className={`flex ${direction === 'horizontal' ? 'flex-col' : 'flex-row'} gap-4 ${className}`}>
      {data.map((item, index) => (
        <motion.div
          key={index}
          className="flex flex-col gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="text-sm font-semibold text-foreground/80">{item.label}</div>
          <div className="relative h-8 bg-background/50 rounded overflow-hidden border border-foreground/20">
            <motion.div
              className="h-full rounded"
              style={{ background: item.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / item.max) * 100}%` }}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
                delay: index * 0.1,
              }}
            />
            <motion.div
              className="absolute inset-0 rounded"
              style={{
                background: `linear-gradient(90deg, ${item.color}40 0%, transparent 100%)`,
                width: `${(item.value / item.max) * 100}%`,
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
          <div className="text-xs text-foreground/60">
            {item.value} / {item.max}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

interface AnimatedLineChartProps {
  data: Array<{ x: number; y: number }>;
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}

/**
 * Animated line chart with smooth curves
 */
export const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
  data,
  className = '',
  color = '#00D9FF',
  width = 400,
  height = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    let animationProgress = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      animationProgress = Math.min(animationProgress + 0.02, 1);

      ctx.clearRect(0, 0, width, height);

      // Find min and max for scaling
      const yValues = data.map((d) => d.y);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);
      const yRange = maxY - minY || 1;

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw line
      const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((d.y - minY) / yRange) * height,
      }));

      // Draw filled area
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, color + '40');
      gradient.addColorStop(1, color + '00');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, height);
      for (let i = 0; i < Math.floor(points.length * animationProgress); i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.lineTo(points[Math.floor(points.length * animationProgress) - 1]?.x || 0, height);
      ctx.closePath();
      ctx.fill();

      // Draw line
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < Math.floor(points.length * animationProgress); i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // Draw points
      ctx.fillStyle = color;
      for (let i = 0; i < Math.floor(points.length * animationProgress); i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [data, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ filter: 'drop-shadow(0 0 10px rgba(0, 217, 255, 0.2))' }}
    />
  );
};
