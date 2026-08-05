import React from 'react';
import { motion } from 'framer-motion';

interface AfroTechProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
}

/**
 * Afrofuturistic tech card component with innovative design
 */
export const AfroTechCard: React.FC<AfroTechProps> = ({
  children,
  className = '',
  intensity = 'medium',
  animated = true,
}) => {
  const intensityMap = {
    low: 'shadow-lg',
    medium: 'shadow-2xl',
    high: 'shadow-[0_0_60px_rgba(218,165,32,0.5)]',
  };

  return (
    <motion.div
      className={`afro-tech-card ${intensityMap[intensity]} ${className}`}
      animate={animated ? { y: [0, -12, 0] } : {}}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.03 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Afrofuturistic button component
 */
export const AfroButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
  }
> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const sizeMap = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-7 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  const variantMap = {
    primary: 'afro-button',
    secondary: 'bg-afro-terracotta text-afro-midnight border-afro-terracotta hover:shadow-[0_0_50px_rgba(198,84,37,0.6)]',
    accent: 'bg-afro-emerald text-afro-midnight border-afro-emerald hover:shadow-[0_0_50px_rgba(34,139,34,0.6)]',
  };

  return (
    <motion.button
      className={`${variantMap[variant]} ${sizeMap[size]} ${className} font-bold rounded transition-all`}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

/**
 * Afrofuturistic gradient text component
 */
export const AfroGradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}> = ({ children, className = '', animated = true }) => {
  return (
    <motion.div
      className={`afro-gradient-text ${className}`}
      animate={animated ? { opacity: [0.85, 1, 0.85] } : {}}
      transition={{ duration: 3.5, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Afrofuturistic pattern border component
 */
export const AfroPatternBorder: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`afro-pattern-border ${className}`}>
      {children}
    </div>
  );
};

/**
 * Afrofuturistic divider component
 */
export const AfroDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      className={`afro-divider ${className}`}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3.5, repeat: Infinity }}
    />
  );
};

/**
 * Afrofuturistic grid component
 */
export const AfroGrid: React.FC<{
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
    <div className={`afro-grid ${colMap[columns]} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Afrofuturistic grid item component
 */
export const AfroGridItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`afro-grid-item ${className}`}
      whileHover={{ y: -12 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Floating afrofuturistic element
 */
export const FloatingAfro: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`afro-float ${className}`}
      animate={{
        y: [0, -25, 0],
        rotateZ: [-2, 2, -2],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Afrofuturistic input component
 */
export const AfroInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      {...props}
      className={`afro-input ${props.className || ''}`}
    />
  );
};

/**
 * Afrofuturistic radiance effect component
 */
export const AfroRadiance: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}> = ({ children, className = '', intensity = 'medium' }) => {
  const intensityMap = {
    low: 'shadow-[0_0_25px_rgba(218,165,32,0.3)]',
    medium: 'shadow-[0_0_50px_rgba(218,165,32,0.5)]',
    high: 'shadow-[0_0_80px_rgba(218,165,32,0.7)]',
  };

  return (
    <motion.div
      className={`afro-radiance ${intensityMap[intensity]} ${className}`}
      animate={{ opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Afrofuturistic flicker effect component
 */
export const AfroFlicker: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`afro-flicker ${className}`}>
      {children}
    </div>
  );
};

/**
 * Afrofuturistic spinning component
 */
export const AfroSpinSlow: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`afro-spin-slow ${className}`}>
      {children}
    </div>
  );
};

/**
 * Afrofuturistic beat effect component
 */
export const AfroBeat: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`afro-beat ${className}`}>
      {children}
    </div>
  );
};

/**
 * Afrofuturistic glow pulse text component
 */
export const AfroGlowPulse: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`afro-glow-pulse ${className}`}>
      {children}
    </div>
  );
};

/**
 * Afrofuturistic tech glow component
 */
export const AfroTechGlow: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`afro-tech-glow ${className}`}
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Afrofuturistic shimmer component
 */
export const AfroShimmer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`afro-shimmer ${className}`}>
      {children}
    </div>
  );
};
