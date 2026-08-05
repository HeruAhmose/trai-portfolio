import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface HologramElement {
  id: string;
  label: string;
  icon: string;
  color: string;
  angle: number;
}

export const HolographicInterface: React.FC<{ title?: string }> = ({
  title = 'Holographic Control Panel',
}) => {
  const [glitch, setGlitch] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [scanlines, setScanlines] = useState(false);

  const elements: HologramElement[] = [
    { id: 'energy', label: 'Energy', icon: '⚡', color: '#00ff00', angle: 0 },
    { id: 'quantum', label: 'Quantum', icon: '⚛️', color: '#ff00ff', angle: 60 },
    { id: 'materials', label: 'Materials', icon: '💎', color: '#00ffff', angle: 120 },
    { id: 'network', label: 'Network', icon: '🌐', color: '#ffff00', angle: 180 },
    { id: 'security', label: 'Security', icon: '🔐', color: '#ff0080', angle: 240 },
    { id: 'ai', label: 'AI', icon: '🤖', color: '#00ff80', angle: 300 },
  ];

  // Trigger glitch effect
  const triggerGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 300);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Scanlines overlay */}
      {scanlines && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,255,0,0.03) 0px, rgba(0,255,0,0.03) 1px, transparent 1px, transparent 2px)',
              animation: 'scanlines 8s linear infinite',
            }}
          />
        </div>
      )}

      {/* Main hologram container */}
      <motion.div
        className="relative w-full aspect-square rounded-lg border-2 border-cyan-400/50 bg-black/50 overflow-hidden"
        style={{
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(0, 255, 255, 0.1)',
        }}
        animate={glitch ? { x: [0, -5, 5, -5, 0] } : {}}
        transition={{ duration: 0.2 }}
      >
        {/* Center core */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="relative w-24 h-24">
            {/* Core glow */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.3)',
              }}
            />

            {/* Center point */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-4 h-4 rounded-full bg-cyan-400"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.8)',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Hologram elements in circle */}
        {elements.map((element, idx) => {
          const radius = 120;
          const angle = (element.angle * Math.PI) / 180;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.button
              key={element.id}
              className="absolute w-16 h-16 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-bold transition-all"
              style={{
                left: '50%',
                top: '50%',
                marginLeft: -32,
                marginTop: -32,
                borderColor: element.color,
                backgroundColor: `${element.color}15`,
              }}
              animate={{
                x,
                y,
                scale: selectedElement === element.id ? 1.3 : 1,
                boxShadow:
                  selectedElement === element.id
                    ? `0 0 30px ${element.color}, inset 0 0 15px ${element.color}`
                    : `0 0 10px ${element.color}80`,
              }}
              transition={{ type: 'spring', stiffness: 100 }}
              onClick={() => {
                setSelectedElement(selectedElement === element.id ? null : element.id);
                triggerGlitch();
                setScanlines(!scanlines);
              }}
              whileHover={{ scale: selectedElement === element.id ? 1.3 : 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl mb-1">{element.icon}</div>
              <div style={{ color: element.color }}>{element.label}</div>
            </motion.button>
          );
        })}

        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 255, 255, 0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Glitch effect overlay */}
        {glitch && (
          <motion.div
            className="absolute inset-0 bg-red-500/20 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>

      {/* Title and info */}
      <motion.div
        className="mt-6 text-center"
        animate={glitch ? { x: [0, -2, 2, 0] } : {}}
      >
        <h3 className="text-lg font-bold text-cyan-400 mb-2">{title}</h3>
        {selectedElement && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gold-400"
          >
            {elements.find((e) => e.id === selectedElement)?.label} System Active
          </motion.p>
        )}
      </motion.div>

      {/* Control buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <motion.button
          onClick={triggerGlitch}
          className="px-4 py-2 bg-black/50 border border-cyan-400/50 rounded text-cyan-400 text-sm font-bold hover:border-cyan-400 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Glitch
        </motion.button>
        <motion.button
          onClick={() => setScanlines(!scanlines)}
          className="px-4 py-2 bg-black/50 border border-cyan-400/50 rounded text-cyan-400 text-sm font-bold hover:border-cyan-400 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {scanlines ? 'Disable' : 'Enable'} Scanlines
        </motion.button>
      </div>

      <style>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
      `}</style>
    </div>
  );
};
