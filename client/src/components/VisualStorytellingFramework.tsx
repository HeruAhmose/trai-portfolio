import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Visual Storytelling Framework
 * Each section tells a compelling visual story about the work
 */

interface StorySection {
  id: string;
  title: string;
  subtitle: string;
  story: string;
  visualTheme: "quantum" | "materials" | "community";
  depth: number;
}

const storySections: StorySection[] = [
  {
    id: "quantum",
    title: "Quantum Frontiers",
    subtitle: "Exploring the boundaries of computation",
    story: "Where classical physics meets quantum possibility",
    visualTheme: "quantum",
    depth: 3,
  },
  {
    id: "materials",
    title: "Material Innovation",
    subtitle: "Engineering the future at the atomic scale",
    story: "Transforming atoms into solutions",
    visualTheme: "materials",
    depth: 2,
  },
  {
    id: "community",
    title: "Community Impact",
    subtitle: "Building technology for humanity",
    story: "Technology that serves people",
    visualTheme: "community",
    depth: 1,
  },
];

const QuantumVisuals: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Quantum wave visualization */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080">
      <defs>
        <filter id="quantumGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Wave patterns */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.path
          key={`wave-${i}`}
          d={`M 0 ${540 + i * 40} Q 480 ${500 + i * 40} 960 ${540 + i * 40} T 1920 ${540 + i * 40}`}
          stroke="url(#quantumGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#quantumGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{
            delay: i * 0.2,
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}

      <defs>
        <linearGradient
          id="quantumGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#00d9ff" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#ff006e" />
        </linearGradient>
      </defs>
    </svg>

    {/* Particle field */}
    <div className="absolute inset-0">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-accent-cyan rounded-full"
          initial={{
            x: Math.random() * 1920,
            y: Math.random() * 1080,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * 1920,
            y: Math.random() * 1080,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  </div>
);

const MaterialsVisuals: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Crystalline structure */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080">
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i % 5) * 384 + 192;
        const y = Math.floor(i / 5) * 270 + 135;

        return (
          <motion.g key={`crystal-${i}`}>
            <motion.polygon
              points={`${x},${y - 60} ${x + 60},${y} ${x},${y + 60} ${x - 60},${y}`}
              fill="none"
              stroke="#d4af37"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{
                delay: i * 0.1,
                duration: 1,
              }}
            />
            <motion.circle
              cx={x}
              cy={y}
              r="8"
              fill="#00d9ff"
              initial={{ r: 0, opacity: 0 }}
              animate={{ r: 8, opacity: 1 }}
              transition={{
                delay: i * 0.1 + 0.3,
                duration: 0.5,
              }}
            />
          </motion.g>
        );
      })}
    </svg>
  </div>
);

const CommunityVisuals: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Network connections */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080">
      {Array.from({ length: 30 }).map((_, i) => {
        const x = Math.random() * 1920;
        const y = Math.random() * 1080;
        const angle = Math.random() * Math.PI * 2;
        const length = 100 + Math.random() * 200;
        const x2 = x + Math.cos(angle) * length;
        const y2 = y + Math.sin(angle) * length;

        return (
          <motion.line
            key={`connection-${i}`}
            x1={x}
            y1={y}
            x2={x2}
            y2={y2}
            stroke="#00d9ff"
            strokeWidth="1"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              delay: i * 0.05,
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        );
      })}
    </svg>
  </div>
);

export const VisualStorytellingFramework: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSection = storySections[activeSection];

  const getVisuals = (theme: string) => {
    switch (theme) {
      case "quantum":
        return <QuantumVisuals />;
      case "materials":
        return <MaterialsVisuals />;
      case "community":
        return <CommunityVisuals />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-background"
    >
      {/* Background visuals */}
      <motion.div
        className="absolute inset-0"
        key={currentSection.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {getVisuals(currentSection.visualTheme)}
      </motion.div>

      {/* Depth layers with parallax */}
      {Array.from({ length: currentSection.depth }).map((_, i) => (
        <motion.div
          key={`depth-${i}`}
          className="absolute inset-0 border-2 border-accent-gold/10"
          style={{
            transform: `translateZ(${(i + 1) * 100}px)`,
          }}
          initial={{ opacity: 0, scale: 1 + i * 0.05 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ delay: i * 0.2, duration: 1 }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-screen">
        <motion.div
          className="text-center max-w-2xl mx-auto px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.h2
            className="text-6xl font-black bg-gradient-to-r from-accent-gold via-accent-cyan to-accent-magenta bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {currentSection.title}
          </motion.h2>

          <motion.p
            className="text-2xl text-accent-cyan mb-6 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {currentSection.subtitle}
          </motion.p>

          <motion.p
            className="text-xl text-gray-300 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            {currentSection.story}
          </motion.p>

          {/* Navigation */}
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            {storySections.map((_, i) => (
              <button
                key={`nav-${i}`}
                onClick={() => setActiveSection(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === activeSection
                    ? "bg-accent-cyan w-8"
                    : "bg-accent-gold/50"
                }`}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
