import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * 3D Parallax with Depth and Atmospheric Effects
 * Creates true depth perception with layered parallax
 */

interface ParallaxLayer {
  depth: number;
  opacity: number;
  scale: number;
  blur: number;
}

export const ParallaxDepthLayer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  const layers: ParallaxLayer[] = [
    { depth: 0, opacity: 1, scale: 1, blur: 0 },
    { depth: 1, opacity: 0.8, scale: 0.95, blur: 2 },
    { depth: 2, opacity: 0.6, scale: 0.9, blur: 4 },
    { depth: 3, opacity: 0.4, scale: 0.85, blur: 6 },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Atmospheric fog layers */}
      {layers.map((layer, i) => (
        <motion.div
          key={`layer-${i}`}
          className="absolute inset-0"
          style={{
            zIndex: i,
            opacity: layer.opacity,
            filter: `blur(${layer.blur}px)`,
            perspective: "1000px",
          }}
          animate={{
            x: mousePosition.x * (layer.depth * 10),
            y: mousePosition.y * (layer.depth * 10),
            scale: layer.scale + scrollY * 0.0001,
          }}
          transition={{
            type: "spring",
            stiffness: 100 - layer.depth * 20,
            damping: 30,
          }}
        >
          {/* Atmospheric gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(
                circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
                rgba(0, 217, 255, ${0.1 * (1 - layer.depth * 0.2)}) 0%,
                rgba(212, 175, 55, ${0.05 * (1 - layer.depth * 0.2)}) 50%,
                transparent 100%
              )`,
            }}
          />

          {/* Depth cues - closer objects are sharper */}
          {i === 0 && children}
        </motion.div>
      ))}

      {/* Depth of field effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            circle at center,
            transparent 0%,
            rgba(0, 0, 0, ${0.1 + scrollY * 0.0001}) 100%
          )`,
          zIndex: 100,
        }}
      />

      {/* Atmospheric perspective lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient
            id="perspectiveGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#d4af37" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00d9ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Perspective lines converging to vanishing point */}
        {Array.from({ length: 5 }).map((_, i) => {
          const offset = (i - 2) * 100;
          return (
            <motion.line
              key={`perspective-${i}`}
              x1="50%"
              y1="0%"
              x2={`calc(50% + ${offset}px)`}
              y2="100%"
              stroke="url(#perspectiveGradient)"
              strokeWidth="1"
              opacity="0.3"
              animate={{
                y2: `calc(100% + ${scrollY * 0.5}px)`,
              }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          );
        })}
      </svg>

      {/* Chromatic aberration effect on scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            90deg,
            rgba(255, 0, 100, ${Math.abs(Math.sin(scrollY * 0.01)) * 0.05}) 0%,
            transparent 50%,
            rgba(0, 217, 255, ${Math.abs(Math.cos(scrollY * 0.01)) * 0.05}) 100%
          )`,
          zIndex: 99,
        }}
      />
    </div>
  );
};
