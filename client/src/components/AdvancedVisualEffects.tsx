import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * 3D Card Flip Component
 */
export const Card3DFlip: React.FC<{
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}> = ({ front, back, className = '' }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <motion.div
      className={`relative w-full h-full cursor-pointer perspective ${className}`}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{
          rotateY: isFlipped ? 180 : 0,
          transformStyle: 'preserve-3d',
        }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ backfaceVisibility: 'hidden' }}>
          {front}
        </div>
        <div
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {back}
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Parallax Scroll Component
 */
export const ParallaxSection: React.FC<{
  children: React.ReactNode;
  offset?: number;
  className?: string;
}> = ({ children, offset = 50, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = React.useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const elementScrolled = window.innerHeight - rect.top;
        setScrollY(elementScrolled * 0.5);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: scrollY }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Morphing Shape Component
 */
export const MorphingShape: React.FC<{
  className?: string;
  duration?: number;
}> = ({ className = '', duration = 4 }) => {
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      animate={{
        borderRadius: ['30% 70% 70% 30% / 30% 30% 70% 70%', '70% 30% 46% 66% / 33% 66% 33% 67%', '100% 60% 60% 100% / 100% 100% 60% 60%', '30% 70% 70% 30% / 30% 30% 70% 70%'],
      }}
      transition={{ duration, repeat: Infinity }}
    />
  );
};

/**
 * Animated Gradient Background
 */
export const AnimatedGradientBg: React.FC<{
  colors?: string[];
  className?: string;
}> = ({ colors = ['#DAA520', '#228B22', '#1E3A8A'], className = '' }) => {
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      animate={{
        background: [
          `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
          `linear-gradient(225deg, ${colors[1]}, ${colors[2]}, ${colors[0]})`,
          `linear-gradient(45deg, ${colors[2]}, ${colors[0]}, ${colors[1]})`,
          `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
        ],
      }}
      transition={{ duration: 8, repeat: Infinity }}
    />
  );
};

/**
 * Particle Burst Effect
 */
export const ParticleBurst: React.FC<{
  isActive: boolean;
  particleCount?: number;
  color?: string;
}> = ({ isActive, particleCount = 20, color = '#DAA520' }) => {
  const particles = Array.from({ length: particleCount });

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: color,
            left: '50%',
            top: '50%',
          }}
          animate={isActive ? {
            x: Math.cos((i / particleCount) * Math.PI * 2) * 200,
            y: Math.sin((i / particleCount) * Math.PI * 2) * 200,
            opacity: [1, 0],
          } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

/**
 * Liquid Swipe Transition
 */
export const LiquidSwipe: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
      animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Glitch Effect Component
 */
export const GlitchEffect: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}> = ({ children, className = '', intensity = 2 }) => {
  return (
    <motion.div
      className={className}
      animate={{
        x: [0, -intensity, intensity, -intensity, 0],
        y: [0, intensity, -intensity, intensity, 0],
      }}
      transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Scroll Reveal Component
 */
export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Staggered Children Reveal
 */
export const StaggeredReveal: React.FC<{
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = '', staggerDelay = 0.1 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * Ripple Effect Button
 */
export const RippleButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  }
> = ({ children, className = '', ...props }) => {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples([...ripples, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    props.onClick?.(e);
  };

  return (
    <button
      {...props}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
          }}
          animate={{
            scale: [0, 4],
            opacity: [1, 0],
          }}
          transition={{ duration: 0.6 }}
        />
      ))}
      {children}
    </button>
  );
};

/**
 * Loading Animation
 */
export const LoadingAnimation: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full bg-afro-gold"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Success Checkmark Animation
 */
export const SuccessCheckmark: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <motion.svg
      className={`w-12 h-12 text-afro-emerald ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <motion.path
        d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d="M22 4L12 14.01l-3-3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </motion.svg>
  );
};

/**
 * Hover Lift Effect
 */
export const HoverLift: React.FC<{
  children: React.ReactNode;
  className?: string;
  liftAmount?: number;
}> = ({ children, className = '', liftAmount = 20 }) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        y: -liftAmount,
        boxShadow: '0 20px 40px rgba(218, 165, 32, 0.3)',
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Text Reveal Animation
 */
export const TextReveal: React.FC<{
  text: string;
  className?: string;
  delay?: number;
}> = ({ text, className = '', delay = 0 }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: delay + i * 0.02 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

/**
 * Floating Bubble Component
 */
export const FloatingBubble: React.FC<{
  className?: string;
  duration?: number;
  size?: number;
}> = ({ className = '', duration = 6, size = 100 }) => {
  return (
    <motion.div
      className={`rounded-full absolute ${className}`}
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 30% 30%, rgba(218, 165, 32, 0.3), rgba(34, 139, 34, 0.1))',
      }}
      animate={{
        y: [0, -50, 0],
        x: [0, 30, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};
