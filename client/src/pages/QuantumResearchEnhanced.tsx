import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { InteractiveBlochSphere } from '@/components/InteractiveBlochSphere';
import {
  HolographicPanel,
  FloatingHologram,
  GlitchText,
  HolographicGrid,
  HolographicBorder,
  RadarScan,
} from '@/components/HolographicUI';
import { useHumanVoice } from '@/hooks/useHumanVoice';
import { Volume2, VolumeX } from 'lucide-react';

export default function QuantumResearchEnhanced() {
  const { speak, speakConversational, speakDivine, stop, isPlaying } = useHumanVoice();
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (voiceEnabled && showIntro) {
      speakDivine(
        'Welcome to the Quantum Research section. Explore the AMC hypothesis for room-temperature quantum sensing.'
      );
    }
  }, [voiceEnabled, showIntro, speakDivine]);

  const handleVoiceToggle = () => {
    if (voiceEnabled) {
      stop();
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(true);
      speakDivine('Voice guidance enabled. The AMC hypothesis proposes room-temperature quantum coherence through rare-earth dopants.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Holographic grid background */}
      <HolographicGrid cellSize={60} opacity={0.08} />

      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                Quantum Coherence
              </h1>
              <GlitchText intensity={1.5}>
                <p className="text-xl text-cyan-300">Room Temperature Quantum States</p>
              </GlitchText>
            </div>

            {/* Voice control */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceToggle}
              className={`p-4 rounded-lg border-2 transition-all ${
                voiceEnabled
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                  : 'border-cyan-400/50 bg-black/40 text-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </motion.button>
          </div>

          {/* Intro text */}
          {showIntro && (
            <HolographicPanel intensity={0.8}>
              <p className="text-cyan-200 leading-relaxed">
                This visualization presents our groundbreaking research on quantum coherence times measured at room temperature
                (300K). The AMC hypothesis proposes that rare-earth dopants in quartz hosts could enable room-temperature quantum coherence.
                This is a testable hypothesis described in the 2026 preprint. Not yet experimentally confirmed. U.S. Patent Application 63/934,269.
              </p>
              <button
                onClick={() => setShowIntro(false)}
                className="mt-4 px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded text-cyan-300 hover:bg-cyan-500/40 transition text-sm"
              >
                Dismiss
              </button>
            </HolographicPanel>
          )}
        </motion.div>

        {/* Main visualization area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <HolographicPanel intensity={1} scanlines={true}>
            <InteractiveBlochSphere />
          </HolographicPanel>
        </motion.div>

        {/* Data insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {/* Key findings */}
          <HolographicBorder>
            <h3 className="text-xl font-bold text-cyan-300 mb-4">Key Findings</h3>
            <ul className="space-y-3 text-cyan-200/80 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">→</span>
                <span>Europium (Eu³⁺) is a proposed rare-earth dopant — specific coherence values not yet confirmed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">→</span>
                <span>Room temperature operation is the proposed goal of the AMC hypothesis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">→</span>
                <span>Rare-earth dopants in quartz hosts are proposed to extend coherence times</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">→</span>
                <span>Ramsey interferometry is the proposed validation method for the hypothesis</span>
              </li>
            </ul>
          </HolographicBorder>

          {/* Technical specs */}
          <HolographicBorder>
            <h3 className="text-xl font-bold text-cyan-300 mb-4">Measurement Specs</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-cyan-400 font-mono text-xs">TEMPERATURE</div>
                <div className="text-cyan-200">300 K (Room Temperature)</div>
              </div>
              <div>
                <div className="text-cyan-400 font-mono text-xs">METHOD</div>
                <div className="text-cyan-200">Ramsey Interferometry (proposed)</div>
              </div>
              <div>
                <div className="text-cyan-400 font-mono text-xs">HOST MATERIAL</div>
                <div className="text-cyan-200">Quartz (SiO₂) Crystal</div>
              </div>
              <div>
                <div className="text-cyan-400 font-mono text-xs">DOPANTS</div>
                <div className="text-cyan-200">Rare-Earth Ions (5 variants)</div>
              </div>
            </div>
          </HolographicBorder>
        </motion.div>

        {/* Floating holograms with additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <FloatingHologram delay={0}>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-300 mb-2">8.5 µs</div>
              <div className="text-3xl font-bold text-cyan-300 mb-2">T₂ &gt; ?</div>
              <div className="text-xs text-cyan-200/60">Proposed Coherence Time (not yet measured)</div>
            </div>
          </FloatingHologram>

          <FloatingHologram delay={0.2}>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300 mb-2">300 K</div>
              <div className="text-xs text-cyan-200/60">Operating Temperature</div>
            </div>
          </FloatingHologram>

          <FloatingHologram delay={0.4}>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-300 mb-2">5</div>
              <div className="text-xs text-cyan-200/60">Rare-Earth Dopants</div>
            </div>
          </FloatingHologram>
        </motion.div>

        {/* Radar scan indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mt-12"
        >
          <RadarScan className="opacity-50" />
        </motion.div>
      </section>
    </div>
  );
}
            <h3 className="text-xl font-bold text-cyan-300 mb-4">Proposed Parameters</h3>
