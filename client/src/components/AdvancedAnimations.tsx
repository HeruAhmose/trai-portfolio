import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AdvancedAnimationsProps {
  children: React.ReactNode;
  type?: 'morph' | 'liquid' | 'particle' | 'wave' | 'pulse' | 'shimmer';
  intensity?: number;
  className?: string;
}

export const AdvancedAnimations: React.FC<AdvancedAnimationsProps> = ({
  children,
  type = 'pulse',
  intensity = 1,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes morph-shape {
        0%, 100% {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          transform: rotate(0deg) scale(1);
        }
        25% {
          border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          transform: rotate(90deg) scale(1.05);
        }
        50% {
          border-radius: 70% 30% 40% 60% / 40% 70% 60% 30%;
          transform: rotate(180deg) scale(1);
        }
        75% {
          border-radius: 40% 70% 60% 30% / 70% 40% 30% 60%;
          transform: rotate(270deg) scale(1.05);
        }
      }

      @keyframes liquid-wave {
        0%, 100% {
          d: path('M0,100 Q25,75 50,100 T100,100 L100,200 L0,200 Z');
        }
        50% {
          d: path('M0,100 Q25,50 50,100 T100,100 L100,200 L0,200 Z');
        }
      }

      @keyframes particle-float {
        0%, 100% {
          transform: translateY(0px) translateX(0px) scale(1);
          opacity: 0.8;
        }
        50% {
          transform: translateY(-20px) translateX(10px) scale(1.2);
          opacity: 1;
        }
      }

      @keyframes wave-propagate {
        0% {
          transform: scaleX(0) scaleY(1);
          opacity: 1;
        }
        100% {
          transform: scaleX(1) scaleY(1);
          opacity: 0;
        }
      }

      @keyframes pulse-glow {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.7);
        }
        50% {
          box-shadow: 0 0 0 20px rgba(0, 255, 255, 0);
        }
      }

      @keyframes shimmer-effect {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }

      .morph-animation {
        animation: morph-shape 6s ease-in-out infinite;
      }

      .liquid-animation {
        animation: liquid-wave 3s ease-in-out infinite;
      }

      .particle-animation {
        animation: particle-float 4s ease-in-out infinite;
      }

      .wave-animation {
        animation: wave-propagate 2s ease-out infinite;
      }

      .pulse-animation {
        animation: pulse-glow 2s ease-in-out infinite;
      }

      .shimmer-animation {
        background: linear-gradient(
          90deg,
          rgba(0, 255, 255, 0) 0%,
          rgba(0, 255, 255, 0.2) 50%,
          rgba(0, 255, 255, 0) 100%
        );
        background-size: 1000px 100%;
        animation: shimmer-effect 3s infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const animationClass = {
    morph: 'morph-animation',
    liquid: 'liquid-animation',
    particle: 'particle-animation',
    wave: 'wave-animation',
    pulse: 'pulse-animation',
    shimmer: 'shimmer-animation',
  }[type];

  return (
    <motion.div
      ref={containerRef}
      className={`${animationClass} ${className}`}
      style={{ opacity: intensity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: intensity }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default AdvancedAnimations;
