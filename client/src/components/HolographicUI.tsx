import React from "react";
import { motion } from "framer-motion";

interface HolographicProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  scanlines?: boolean;
}

export const HolographicPanel: React.FC<HolographicProps> = ({
  children,
  className = "",
  intensity = 1,
  scanlines = true,
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          `0 0 20px rgba(0, 255, 255, ${0.3 * intensity}), inset 0 0 20px rgba(0, 255, 255, ${0.1 * intensity})`,
          `0 0 40px rgba(0, 255, 255, ${0.5 * intensity}), inset 0 0 30px rgba(0, 255, 255, ${0.2 * intensity})`,
          `0 0 20px rgba(0, 255, 255, ${0.3 * intensity}), inset 0 0 20px rgba(0, 255, 255, ${0.1 * intensity})`,
        ],
      }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <div className="relative border border-cyan-400/50 bg-black/60 backdrop-blur-lg p-6 rounded-lg overflow-hidden">
        {/* Scanlines effect */}
        {scanlines && (
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.3) 2px, rgba(0,255,255,0.3) 4px)",
            }}
          />
        )}

        {/* Glitch effect overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0, 0.1, 0, 0.05, 0],
            x: [0, 2, -2, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,0,255,0.1) 0%, transparent 50%, rgba(0,255,255,0.1) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

export const FloatingHologram: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        y: [0, -20, 0],
        opacity: [0.6, 1, 0.6],
        rotateZ: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <div className="relative">
        {/* Holographic glow */}
        <div
          className="absolute inset-0 rounded-lg blur-xl"
          style={{
            background:
              "radial-gradient(circle, rgba(0,255,255,0.3) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative border border-cyan-400/40 bg-cyan-500/5 backdrop-blur-sm p-4 rounded-lg text-cyan-300">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export const GlitchText: React.FC<{
  children: React.ReactNode;
  intensity?: number;
}> = ({ children, intensity = 1 }) => {
  return (
    <motion.div
      className="relative inline-block"
      animate={{
        textShadow: [
          `0 0 0px rgba(255,0,255,0), 2px 2px 0px rgba(0,255,255,${0.5 * intensity})`,
          `0 0 0px rgba(255,0,255,0), -2px -2px 0px rgba(255,0,255,${0.5 * intensity})`,
          `0 0 0px rgba(255,0,255,0), 2px 2px 0px rgba(0,255,255,${0.5 * intensity})`,
        ],
      }}
      transition={{
        duration: 0.3,
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      {children}
    </motion.div>
  );
};

export const HolographicGrid: React.FC<{
  className?: string;
  cellSize?: number;
  opacity?: number;
}> = ({ className = "", cellSize = 50, opacity = 0.1 }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(0deg, transparent calc(${cellSize}px - 1px), rgba(0,255,255,${opacity}) calc(${cellSize}px - 1px)),
          linear-gradient(90deg, transparent calc(${cellSize}px - 1px), rgba(0,255,255,${opacity}) calc(${cellSize}px - 1px))
        `,
        backgroundSize: `${cellSize}px ${cellSize}px`,
      }}
    />
  );
};

export const HolographicBorder: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          `0 0 0px rgba(0,255,255,0.3), inset 0 0 10px rgba(0,255,255,0.1)`,
          `0 0 10px rgba(0,255,255,0.6), inset 0 0 15px rgba(0,255,255,0.2)`,
          `0 0 0px rgba(0,255,255,0.3), inset 0 0 10px rgba(0,255,255,0.1)`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      <div className="border-2 border-cyan-400/50 rounded-lg p-4 bg-black/40 backdrop-blur-sm">
        {children}
      </div>
    </motion.div>
  );
};

export const RadarScan: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <motion.div
      className={`relative w-32 h-32 rounded-full border border-cyan-400/50 ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    >
      {/* Radar circles */}
      <div
        className="absolute inset-0 rounded-full border border-cyan-400/30"
        style={{ inset: "25%" }}
      />
      <div
        className="absolute inset-0 rounded-full border border-cyan-400/20"
        style={{ inset: "50%" }}
      />

      {/* Radar sweep */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(0,255,255,0.3) 0deg, transparent 90deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Center dot */}
      <div className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400" />
    </motion.div>
  );
};

export default HolographicPanel;
