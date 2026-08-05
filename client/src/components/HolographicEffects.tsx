import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HolographicEffectsProps {
  children: React.ReactNode;
  intensity?: number;
  glitchEnabled?: boolean;
  scanLinesEnabled?: boolean;
  chromaticAberrationEnabled?: boolean;
  className?: string;
}

export const HolographicEffects: React.FC<HolographicEffectsProps> = ({
  children,
  intensity = 0.5,
  glitchEnabled = true,
  scanLinesEnabled = true,
  chromaticAberrationEnabled = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes holographic-glitch {
        0% {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
          transform: translate(0);
        }
        20% {
          clip-path: polygon(0% 5%, 100% 0%, 100% 95%, 0% 100%);
          transform: translate(2px, -2px);
        }
        40% {
          clip-path: polygon(0% 0%, 100% 3%, 100% 100%, 0% 98%);
          transform: translate(-2px, 2px);
        }
        60% {
          clip-path: polygon(0% 2%, 100% 0%, 100% 98%, 0% 100%);
          transform: translate(1px, -1px);
        }
        80% {
          clip-path: polygon(0% 0%, 100% 4%, 100% 100%, 0% 96%);
          transform: translate(-1px, 1px);
        }
        100% {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
          transform: translate(0);
        }
      }

      @keyframes scan-lines {
        0% {
          background-position: 0 0;
        }
        100% {
          background-position: 0 10px;
        }
      }

      @keyframes chromatic-shift {
        0% {
          filter: drop-shadow(-2px 0 0 rgba(255, 0, 0, 0.3)) drop-shadow(2px 0 0 rgba(0, 255, 255, 0.3));
        }
        50% {
          filter: drop-shadow(-1px 0 0 rgba(255, 0, 0, 0.2)) drop-shadow(1px 0 0 rgba(0, 255, 255, 0.2));
        }
        100% {
          filter: drop-shadow(-2px 0 0 rgba(255, 0, 0, 0.3)) drop-shadow(2px 0 0 rgba(0, 255, 255, 0.3));
        }
      }

      @keyframes neon-glow {
        0%, 100% {
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3);
        }
        50% {
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.5);
        }
      }

      @keyframes liquid-morph {
        0%, 100% {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
        50% {
          border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
        }
      }

      @keyframes particle-burst {
        0% {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(var(--tx), var(--ty)) scale(0);
        }
      }

      .holographic-container {
        position: relative;
        overflow: hidden;
      }

      .holographic-glitch {
        animation: holographic-glitch 0.3s infinite;
      }

      .holographic-scanlines {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.15),
          rgba(0, 0, 0, 0.15) 1px,
          transparent 1px,
          transparent 2px
        );
        animation: scan-lines 8s linear infinite;
        pointer-events: none;
      }

      .holographic-chromatic {
        animation: chromatic-shift 4s ease-in-out infinite;
      }

      .holographic-neon {
        animation: neon-glow 2s ease-in-out infinite;
      }

      .holographic-liquid {
        animation: liquid-morph 4s ease-in-out infinite;
      }

      .particle {
        position: fixed;
        pointer-events: none;
      }

      .particle-burst {
        animation: particle-burst 0.6s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const createParticleBurst = (e: MouseEvent) => {
    if (!containerRef.current) return;

    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle particle-burst';
      
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 100;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.background = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`;
      particle.style.borderRadius = '50%';
      particle.style.boxShadow = `0 0 10px currentColor`;
      
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 600);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`holographic-container ${className}`}
      onClick={(e) => createParticleBurst(e as any)}
    >
      <motion.div
        className={`
          ${glitchEnabled ? 'holographic-glitch' : ''}
          ${chromaticAberrationEnabled ? 'holographic-chromatic' : ''}
          ${scanLinesEnabled ? 'holographic-neon' : ''}
        `}
        style={{ opacity: intensity }}
      >
        {children}
      </motion.div>
      
      {scanLinesEnabled && (
        <div className="holographic-scanlines" />
      )}
    </div>
  );
};

export default HolographicEffects;
