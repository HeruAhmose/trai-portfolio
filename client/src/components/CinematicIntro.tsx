import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CinematicIntroProps {
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  duration?: number;
  onComplete?: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  title,
  subtitle,
  color,
  icon,
  duration = 3,
  onComplete,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          {/* Animated background grid */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, ${color}40 25%, ${color}40 26%, transparent 27%, transparent 74%, ${color}40 75%, ${color}40 76%, transparent 77%, transparent),
                                linear-gradient(90deg, transparent 24%, ${color}40 25%, ${color}40 26%, transparent 27%, transparent 74%, ${color}40 75%, ${color}40 76%, transparent 77%, transparent)`,
              backgroundSize: "50px 50px",
            }}
            animate={{ backgroundPosition: ["0 0", "50px 50px"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Center content */}
          <div className="relative z-10 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-8xl mb-8"
            >
              {icon}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl font-bold mb-4"
              style={{
                backgroundImage: `linear-gradient(135deg, ${color}, ${color}80)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl mb-8"
              style={{ color }}
            >
              {subtitle}
            </motion.p>

            {/* Loading bar */}
            <motion.div
              className="w-64 h-1 bg-black/50 rounded-full overflow-hidden"
              style={{ borderColor: color, borderWidth: 1 }}
            >
              <motion.div
                className="h-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Particle effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: color,
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: Math.cos((i / 6) * Math.PI * 2) * 200,
                  y: Math.sin((i / 6) * Math.PI * 2) * 200,
                  opacity: [1, 0],
                }}
                transition={{
                  duration,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Corner accents */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 border-2"
            style={{ borderColor: color }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-20 h-20 border-2"
            style={{ borderColor: color }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
