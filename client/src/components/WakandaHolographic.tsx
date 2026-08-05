import React from 'react';
import { motion } from 'framer-motion';

interface HolographicProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
}

/**
 * Wakanda-inspired holographic card component
 */
export const HolographicCard: React.FC<HolographicProps> = ({
  children,
  className = '',
  intensity = 'medium',
  animated = true,
}) => {
  const intensityMap = {
    low: 'shadow-lg',
    medium: 'shadow-2xl',
    high: 'shadow-[0_0_50px_rgba(255,215,0,0.4)]',
  };

  return (
    <motion.div
      className={`holographic-card ${intensityMap[intensity]} ${className}`}
      animate={animated ? { y: [0, -10, 0] } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.02 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Wakanda tech button component
 */
export const WakandaButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
  }
> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const sizeMap = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const variantMap = {
    primary: 'wakanda-button',
    secondary: 'bg-wakanda-purple text-wakanda-silver border-wakanda-purple hover:shadow-purple-glow',
    ghost: 'bg-transparent text-wakanda-gold border-wakanda-gold hover:bg-wakanda-gold/10',
  };

  return (
    <motion.button
      className={`${variantMap[variant]} ${sizeMap[size]} ${className} font-semibold rounded transition-all`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

/**
 * Holographic text component with gradient and glow
 */
export const HolographicText: React.FC<{
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}> = ({ children, className = '', animated = true }) => {
  return (
    <motion.div
      className={`holographic-text ${className}`}
      animate={animated ? { opacity: [0.8, 1, 0.8] } : {}}
      transition={{ duration: 3, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Tech border component
 */
export const TechBorder: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`tech-border ${className}`}>
      {children}
    </div>
  );
};

/**
 * Holographic divider component
 */
export const HolographicDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      className={`holographic-divider ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
  );
};

/**
 * Tech grid component
 */
export const TechGrid: React.FC<{
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}> = ({ children, columns = 3, className = '' }) => {
  const colMap = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`tech-grid ${colMap[columns]} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Tech grid item component
 */
export const TechGridItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`tech-grid-item ${className}`}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Floating holographic element
 */
export const FloatingHologram: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`holographic-float ${className}`}
      animate={{
        y: [0, -20, 0],
        rotateZ: [0, 5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Tech input component
 */
export const TechInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      {...props}
      className={`tech-input ${props.className || ''}`}
    />
  );
};

/**
 * Vibranium glow effect component
 */
export const VibraniumGlow: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}> = ({ children, className = '', intensity = 'medium' }) => {
  const intensityMap = {
    low: 'shadow-[0_0_20px_rgba(255,215,0,0.2)]',
    medium: 'shadow-[0_0_40px_rgba(255,215,0,0.4)]',
    high: 'shadow-[0_0_60px_rgba(255,215,0,0.6)]',
  };

  return (
    <motion.div
      className={`vibranium-glow ${intensityMap[intensity]} ${className}`}
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Tech flicker effect component
 */
export const TechFlicker: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`tech-flicker ${className}`}>
      {children}
    </div>
  );
};

/**
 * Holographic rotating component
 */
export const HolographicRotate: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`holographic-rotate ${className}`}>
      {children}
    </div>
  );
};
