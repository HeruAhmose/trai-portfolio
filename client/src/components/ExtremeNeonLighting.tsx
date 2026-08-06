import React from "react";
import { motion } from "framer-motion";

interface ExtremeNeonLightingProps {
  children?: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: "low" | "medium" | "high" | "extreme";
  animated?: boolean;
}

/**
 * Extreme neon lighting effects component
 * Provides:
 * - Multi-layered glow effects
 * - Bloom and light bloom
 * - Chromatic aberration
 * - Light rays and volumetric effects
 * - Animated glow pulsing
 */
export const ExtremeNeonLighting: React.FC<ExtremeNeonLightingProps> = ({
  children,
  className = "",
  glowColor = "#00D9FF",
  intensity = "high",
  animated = true,
}) => {
  const getBlurAmount = () => {
    switch (intensity) {
      case "low":
        return "20px";
      case "medium":
        return "40px";
      case "high":
        return "60px";
      case "extreme":
        return "100px";
      default:
        return "60px";
    }
  };

  const getOpacity = () => {
    switch (intensity) {
      case "low":
        return 0.3;
      case "medium":
        return 0.5;
      case "high":
        return 0.7;
      case "extreme":
        return 1;
      default:
        return 0.7;
    }
  };

  const glowVariants = {
    initial: { opacity: getOpacity() * 0.5, scale: 0.95 },
    animate: {
      opacity: [getOpacity() * 0.5, getOpacity(), getOpacity() * 0.5],
      scale: [0.95, 1.05, 0.95],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as any;

  return (
    <div className={`relative ${className}`}>
      {/* Extreme glow layers */}
      {animated && (
        <>
          {/* Outer glow layer 1 */}
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
              filter: `blur(${getBlurAmount()})`,
            }}
            variants={glowVariants}
            initial="initial"
            animate="animate"
          />

          {/* Outer glow layer 2 */}
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${glowColor}20 0%, transparent 80%)`,
              filter: `blur(calc(${getBlurAmount()} * 1.5))`,
            }}
            variants={{
              initial: { opacity: getOpacity() * 0.3 },
              animate: {
                opacity: [
                  getOpacity() * 0.3,
                  getOpacity() * 0.6,
                  getOpacity() * 0.3,
                ],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                },
              },
            }}
            initial="initial"
            animate="animate"
          />

          {/* Inner bright core */}
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${glowColor}80 0%, transparent 40%)`,
              filter: `blur(10px)`,
            }}
            variants={{
              initial: { opacity: 0.2 },
              animate: {
                opacity: [0.2, 0.5, 0.2],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              },
            }}
            initial="initial"
            animate="animate"
          />
        </>
      )}

      {/* Static glow for non-animated */}
      {!animated && (
        <>
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${glowColor}${Math.floor(
                getOpacity() * 255
              )
                .toString(16)
                .padStart(2, "0")} 0%, transparent 70%)`,
              filter: `blur(${getBlurAmount()})`,
            }}
          />
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${glowColor}${Math.floor(
                getOpacity() * 0.5 * 255
              )
                .toString(16)
                .padStart(2, "0")} 0%, transparent 80%)`,
              filter: `blur(calc(${getBlurAmount()} * 1.5))`,
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Bloom effect overlay */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-50"
        style={{
          background: `linear-gradient(135deg, ${glowColor}20 0%, transparent 50%, ${glowColor}20 100%)`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};

/**
 * Volumetric light rays component
 * Creates dramatic light ray effects
 */
interface VolumetricLightRaysProps {
  className?: string;
  color?: string;
  rayCount?: number;
  animated?: boolean;
}

export const VolumetricLightRays: React.FC<VolumetricLightRaysProps> = ({
  className = "",
  color = "#00D9FF",
  rayCount = 8,
  animated = true,
}) => {
  const rays = Array.from({ length: rayCount }, (_, i) => {
    const angle = (i / rayCount) * 360;
    return angle;
  });

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {rays.map((angle, i) => (
        <motion.div
          key={i}
          className="absolute origin-center"
          style={{
            width: "2px",
            height: "200%",
            left: "50%",
            top: "50%",
            background: `linear-gradient(to bottom, ${color}80 0%, ${color}40 50%, transparent 100%)`,
            transform: `translateX(-50%) translateY(-50%) rotate(${angle}deg)`,
            filter: "blur(2px)",
          }}
          animate={
            animated
              ? {
                  opacity: [0.3, 0.8, 0.3],
                  filter: ["blur(2px)", "blur(4px)", "blur(2px)"],
                }
              : {}
          }
          transition={
            animated
              ? {
                  duration: 3 + i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : {}
          }
        />
      ))}
    </div>
  );
};

/**
 * Chromatic aberration effect
 * Creates color separation effect for extreme visual impact
 */
interface ChromaticAberrationProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  animated?: boolean;
}

export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  children,
  className = "",
  intensity = 2,
  animated = false,
}) => {
  return (
    <motion.div
      className={className}
      style={{
        filter: animated
          ? `url(#chromatic-aberration)`
          : `drop-shadow(${intensity}px 0 0 rgba(255, 0, 128, 0.5)) drop-shadow(-${intensity}px 0 0 rgba(0, 217, 255, 0.5))`,
      }}
      animate={
        animated
          ? {
              x: [-intensity, 0, intensity, 0],
            }
          : {}
      }
      transition={
        animated
          ? {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
};

/**
 * Bloom effect wrapper
 * Creates bloom/glow effect on elements
 */
interface BloomEffectProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  intensity?: "low" | "medium" | "high";
}

export const BloomEffect: React.FC<BloomEffectProps> = ({
  children,
  className = "",
  color = "#DAA520",
  intensity = "high",
}) => {
  const getBloomAmount = () => {
    switch (intensity) {
      case "low":
        return 10;
      case "medium":
        return 20;
      case "high":
        return 40;
      default:
        return 20;
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        filter: `drop-shadow(0 0 ${getBloomAmount()}px ${color}) drop-shadow(0 0 ${getBloomAmount() * 0.5}px ${color})`,
      }}
    >
      {children}
    </div>
  );
};
