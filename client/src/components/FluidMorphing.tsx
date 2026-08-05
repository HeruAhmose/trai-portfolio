import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FluidMorphingProps {
  children?: React.ReactNode;
  className?: string;
  duration?: number;
  colors?: string[];
}

/**
 * Fluid morphing shape component
 * Creates organic, flowing shape transformations
 */
export const FluidMorphingShape: React.FC<FluidMorphingProps> = ({
  children,
  className = '',
  duration = 8,
  colors = ['#DAA520', '#228B22', '#1E3A8A', '#FF0080', '#00D9FF'],
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const paths = [
    'M150,0 Q75,0 75,75 Q75,150 150,150 Q225,150 225,75 Q225,0 150,0',
    'M150,0 Q50,50 75,150 Q150,200 225,150 Q250,50 150,0',
    'M150,0 Q100,0 50,75 Q0,150 100,200 Q150,220 200,200 Q250,150 200,75 Q150,0 150,0',
    'M150,0 Q75,25 50,100 Q25,175 75,225 Q150,250 225,225 Q250,175 225,100 Q200,25 150,0',
  ];

  const colorVariants = {
    animate: {
      background: colors.map(color => color),
      transition: {
        duration: duration,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 300 300"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.5))' }}
      >
        <defs>
          <filter id="morphFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
          </filter>
        </defs>

        <motion.path
          d={paths[0]}
          fill="url(#morphGradient)"
          filter="url(#morphFilter)"
          animate={{
            d: paths,
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            d: {
              duration: duration,
              repeat: Infinity,
              repeatType: 'reverse',
            },
            opacity: {
              duration: duration,
              repeat: Infinity,
              repeatType: 'reverse',
            },
          }}
        />

        <defs>
          <linearGradient id="morphGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <motion.stop
              offset="0%"
              stopColor={colors[0]}
             animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              } as any}        />
            <motion.stop
              offset="100%"
              stopColor={colors[colors.length - 1]}
              animate={{ stopColor: colors.reverse() }}
              transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          </linearGradient>
        </defs>
      </svg>

      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
};

/**
 * Liquid swipe transition component
 * Creates smooth, organic transitions between states
 */
interface LiquidSwipeProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export const LiquidSwipeTransition: React.FC<LiquidSwipeProps> = ({
  children,
  className = '',
  color = '#00D9FF',
  direction = 'right',
}) => {
  const getTransformOrigin = () => {
    switch (direction) {
      case 'left':
        return 'right center';
      case 'right':
        return 'left center';
      case 'up':
        return 'center bottom';
      case 'down':
        return 'center top';
      default:
        return 'center center';
    }
  };

  const getInitialClipPath = () => {
    switch (direction) {
      case 'left':
        return 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)';
      case 'right':
        return 'polygon(0 0, 0 0, 0 100%, 0 100%)';
      case 'up':
        return 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)';
      case 'down':
        return 'polygon(0 0, 100% 0, 100% 0, 0 0)';
      default:
        return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
    }
  };

  const getFinalClipPath = () => {
    return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
  };

  return (
    <motion.div
      className={className}
      initial={{ clipPath: getInitialClipPath() }}
      animate={{ clipPath: getFinalClipPath() }}
      transition={{
        duration: 0.8,
        ease: [0.77, 0, 0.175, 1],
      }}
      style={{
        transformOrigin: getTransformOrigin(),
        background: `linear-gradient(135deg, ${color}40 0%, transparent 50%)`,
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Mesh deformation component
 * Creates advanced mesh-based deformation effects
 */
interface MeshDeformationProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const MeshDeformation: React.FC<MeshDeformationProps> = ({
  children,
  className = '',
  intensity = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    let time = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.016;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw mesh grid with deformation
      const gridSize = 30;
      const cols = Math.ceil(canvas.width / gridSize) + 1;
      const rows = Math.ceil(canvas.height / gridSize) + 1;

      ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
      ctx.lineWidth = 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;

          // Calculate deformation
          const dx = Math.sin(time + x * 0.01) * 5 * intensity;
          const dy = Math.cos(time + y * 0.01) * 5 * intensity;

          const x1 = x + dx;
          const y1 = y + dy;

          // Draw point
          ctx.fillStyle = 'rgba(0, 217, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(x1, y1, 2, 0, Math.PI * 2);
          ctx.fill();

          // Draw horizontal line
          if (i < cols - 1) {
            const x2 = (i + 1) * gridSize + Math.sin(time + (i + 1) * gridSize * 0.01) * 5 * intensity;
            const y2 = y + Math.cos(time + y * 0.01) * 5 * intensity;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }

          // Draw vertical line
          if (j < rows - 1) {
            const x2 = x + Math.sin(time + x * 0.01) * 5 * intensity;
            const y2 = (j + 1) * gridSize + Math.cos(time + (j + 1) * gridSize * 0.01) * 5 * intensity;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'blur(0.5px)' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/**
 * Organic wave deformation
 * Creates smooth, wave-like deformations
 */
interface OrganicWaveProps {
  children: React.ReactNode;
  className?: string;
  waveCount?: number;
  amplitude?: number;
}

export const OrganicWave: React.FC<OrganicWaveProps> = ({
  children,
  className = '',
  waveCount = 3,
  amplitude = 10,
}) => {
  const waves = Array.from({ length: waveCount }, (_, i) => i);

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, amplitude, -amplitude, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      } as any}
    >
      {children}
    </motion.div>
  );
};
