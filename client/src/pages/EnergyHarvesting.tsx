import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AudioSystem } from '../components/AudioSystem';
import { CinematicIntro } from '../components/CinematicIntro';
import { InteractiveButton } from '../components/InteractiveButton';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export const EnergyHarvesting: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [energyLevel, setEnergyLevel] = useState(1);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; vx: number; vy: number; life: number }>>([]);
  const [showIntro, setShowIntro] = useState(false);
  const { playSuccess, playTransition } = useSoundEffects(true);

  // Cinematic intro animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setEnergyLevel(1);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Particle system for energy visualization
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        let newParticles = prev.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1,
          life: p.life - 0.02,
        })).filter((p) => p.life > 0);

        // Add new particles
        if (Math.random() > 0.7) {
          newParticles.push({
            x: Math.random() * 800,
            y: 0,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 2 + 1,
            life: 1,
          });
        }

        return newParticles;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0e27');
    gradient.addColorStop(1, '#1a2a4a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw energy field
    ctx.fillStyle = `rgba(0, 255, 0, ${0.1 * energyLevel})`;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 100 + energyLevel * 50, 0, Math.PI * 2);
    ctx.fill();

    // Draw particles
    particles.forEach((p) => {
      ctx.fillStyle = `rgba(0, 255, 0, ${p.life * 0.8})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw energy core
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 20 + energyLevel * 10, 0, Math.PI * 2);
    ctx.fill();
  }, [energyLevel, particles]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050607] via-[#0a1628] to-[#050607] pt-20 pb-20">
      <AudioSystem
        soundscapeUrl="https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/energy-harvesting-soundscape_e2489e7d.wav"
        volume={0.3}
        autoPlay={true}
        loop={true}
      />

      {showIntro && (
        <CinematicIntro
          title="Energy Harvesting"
          subtitle="Thermoelectric & Piezoelectric Power Generation"
          color="#00ff00"
          icon="⚡"
          duration={2.5}
          onComplete={() => setShowIntro(false)}
        />
      )}
      {/* Cinematic Intro */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: energyLevel > 0 ? 1 : 0, scale: energyLevel > 0 ? 1 : 0.8 }}
        transition={{ duration: 1.5 }}
        className="max-w-6xl mx-auto px-4 mb-12"
      >
        <h1 className="text-6xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
            Energy Harvesting Systems
          </span>
        </h1>
        <p className="text-center text-green-400 text-lg mb-8">
          Thermoelectric & Piezoelectric Power Generation
        </p>
      </motion.div>

      {/* Interactive Canvas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: energyLevel > 0 ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="max-w-4xl mx-auto px-4 mb-12"
      >
        <canvas
          ref={canvasRef}
          className="w-full border-2 border-green-400/50 rounded-lg shadow-lg shadow-green-400/30"
        />
      </motion.div>

      {/* Content Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: energyLevel > 0 ? 1 : 0, y: energyLevel > 0 ? 0 : 20 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Thermoelectric Section */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-black/50 rounded-lg border border-green-400/30"
        >
          <h3 className="text-2xl font-bold text-green-400 mb-4">Thermoelectric Generation</h3>
          <div className="space-y-3 text-sm text-cyan-400">
            <p>
              <strong>ZT Figure of Merit:</strong> Proposed target: ZT &gt; 1.0 @ 300K (hypothesis — not yet experimentally confirmed)
            </p>
            <p>
              <strong>Temperature Range:</strong> 250K - 450K operational window
            </p>
            <p>
              <strong>Composition:</strong> Proposed 12% magnetite formulation with quartz, tourmaline, and rare-earth dopants
            </p>
            <p>
              <strong>Status:</strong> Testable hypothesis — U.S. Patent Application 63/934,269
            </p>
          </div>
        </motion.div>

        {/* Piezoelectric Section */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-6 bg-black/50 rounded-lg border border-green-400/30"
        >
          <h3 className="text-2xl font-bold text-green-400 mb-4">Piezoelectric Generation</h3>
          <div className="space-y-3 text-sm text-cyan-400">
            <p>
              <strong>Voltage Output:</strong> Proposed piezoelectric response from quartz + tourmaline matrix (specific values not yet confirmed)
            </p>
            <p>
              <strong>Proposed Composition:</strong> Quartz (15–45%) + tourmaline (3–25%) in hemp-carbon matrix
            </p>
            <p>
              <strong>Stress Response:</strong> Linear voltage increase from 0-100 MPa
            </p>
            <p>
              <strong>Status:</strong> Testable hypothesis — 25 patent claims filed
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Device Integration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: energyLevel > 0 ? 1 : 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 mt-12 p-8 bg-gradient-to-r from-black/50 to-black/30 rounded-lg border border-green-400/30"
      >
        <h3 className="text-2xl font-bold text-green-400 mb-6 text-center">
          Integrated Energy Harvesting Device
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🌡️</div>
            <h4 className="font-bold text-cyan-400 mb-2">Thermal Input</h4>
            <p className="text-sm text-gold-400">
              Temperature differential across composite material
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">⚡</div>
            <h4 className="font-bold text-cyan-400 mb-2">Energy Conversion</h4>
            <p className="text-sm text-gold-400">
              Thermoelectric & piezoelectric energy generation
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🔋</div>
            <h4 className="font-bold text-cyan-400 mb-2">Power Storage</h4>
            <p className="text-sm text-gold-400">
              Efficient energy management and storage circuit
            </p>
          </div>
        </div>
      </motion.div>

      {/* Research Data */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: energyLevel > 0 ? 1 : 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 mt-12 p-8 bg-black/50 rounded-lg border border-green-400/30"
      >
        <h3 className="text-xl font-bold text-green-400 mb-4">Key Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-cyan-400 font-mono">
          <div>
            <div className="mb-3">
              <span className="text-green-400">Thermoelectric ZT:</span> Target &gt; 1.0 @ 300K (proposed)
            </div>
            <div className="mb-3">
              <span className="text-green-400">Piezoelectric Response:</span> Proposed (not yet confirmed)
            </div>
            <div className="mb-3">
              <span className="text-green-400">Conductivity Range:</span> 10²–10⁶ S/m (proposed)
            </div>
          </div>
          <div>
            <div className="mb-3">
              <span className="text-green-400">Operating Temp:</span> 250-450K
            </div>
            <div className="mb-3">
              <span className="text-green-400">Stress Range:</span> 0-100 MPa
            </div>
            <div className="mb-3">
              <span className="text-green-400">Patent Status:</span> App. 63/934,269 · Filed Dec 11, 2025
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
