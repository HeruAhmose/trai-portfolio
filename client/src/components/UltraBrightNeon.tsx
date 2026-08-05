import React from 'react';
import { motion } from 'framer-motion';

interface UltraBrightNeonProps {
  children: React.ReactNode;
  color?: 'cyan' | 'magenta' | 'lime' | 'gold' | 'white';
  intensity?: number;
  blur?: number;
  className?: string;
}

const colorMap = {
  cyan: {
    glow: 'shadow-[0_0_20px_rgba(0,255,255,0.8),0_0_40px_rgba(0,255,255,0.6),0_0_60px_rgba(0,255,255,0.4)]',
    text: 'text-cyan-300',
    border: 'border-cyan-400',
  },
  magenta: {
    glow: 'shadow-[0_0_20px_rgba(255,0,255,0.8),0_0_40px_rgba(255,0,255,0.6),0_0_60px_rgba(255,0,255,0.4)]',
    text: 'text-magenta-300',
    border: 'border-magenta-400',
  },
  lime: {
    glow: 'shadow-[0_0_20px_rgba(0,255,0,0.8),0_0_40px_rgba(0,255,0,0.6),0_0_60px_rgba(0,255,0,0.4)]',
    text: 'text-lime-300',
    border: 'border-lime-400',
  },
  gold: {
    glow: 'shadow-[0_0_20px_rgba(255,215,0,0.8),0_0_40px_rgba(255,215,0,0.6),0_0_60px_rgba(255,215,0,0.4)]',
    text: 'text-yellow-300',
    border: 'border-yellow-400',
  },
  white: {
    glow: 'shadow-[0_0_20px_rgba(255,255,255,0.8),0_0_40px_rgba(255,255,255,0.6),0_0_60px_rgba(255,255,255,0.4)]',
    text: 'text-white',
    border: 'border-white',
  },
};

export const UltraBrightNeon: React.FC<UltraBrightNeonProps> = ({
  children,
  color = 'cyan',
  intensity = 1,
  blur = 20,
  className = '',
}) => {
  const colors = colorMap[color];

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        filter: [
          `drop-shadow(0 0 ${blur}px ${color === 'cyan' ? 'rgba(0,255,255,' : 'rgba(255,0,255,'}${0.4 * intensity}))`,
          `drop-shadow(0 0 ${blur + 10}px ${color === 'cyan' ? 'rgba(0,255,255,' : 'rgba(255,0,255,'}${0.6 * intensity}))`,
          `drop-shadow(0 0 ${blur}px ${color === 'cyan' ? 'rgba(0,255,255,' : 'rgba(255,0,255,'}${0.4 * intensity}))`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div className={`${colors.glow} transition-all duration-300`}>{children}</div>
    </motion.div>
  );
};

export const BrightText: React.FC<{
  children: React.ReactNode;
  color?: 'cyan' | 'magenta' | 'lime' | 'gold' | 'white';
  className?: string;
}> = ({ children, color = 'cyan', className = '' }) => {
  const colors = colorMap[color];

  return (
    <motion.span
      className={`${colors.text} font-bold tracking-wider ${className} ${colors.glow}`}
      animate={{
        textShadow: [
          `0 0 10px ${color === 'cyan' ? 'rgba(0,255,255,0.5)' : 'rgba(255,0,255,0.5)'},
           0 0 20px ${color === 'cyan' ? 'rgba(0,255,255,0.3)' : 'rgba(255,0,255,0.3)'}`,
          `0 0 20px ${color === 'cyan' ? 'rgba(0,255,255,0.8)' : 'rgba(255,0,255,0.8)'},
           0 0 30px ${color === 'cyan' ? 'rgba(0,255,255,0.5)' : 'rgba(255,0,255,0.5)'}`,
          `0 0 10px ${color === 'cyan' ? 'rgba(0,255,255,0.5)' : 'rgba(255,0,255,0.5)'},
           0 0 20px ${color === 'cyan' ? 'rgba(0,255,255,0.3)' : 'rgba(255,0,255,0.3)'}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  );
};

export const RadiantGradient: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: `
          radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 0%, rgba(255, 215, 0, 0.2) 0%, transparent 50%)
        `,
        backdropFilter: 'blur(0.5px)',
      }}
    >
      {children}
    </div>
  );
};

export default UltraBrightNeon;
