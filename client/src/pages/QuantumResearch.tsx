import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AudioSystem } from '../components/AudioSystem';
import { CinematicIntro } from '../components/CinematicIntro';

interface QuantumState {
  dopant: string;
  coherenceTime: number;
  temperature: number;
  color: string;
}

export const QuantumResearch: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [selectedDopant, setSelectedDopant] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const dopants: QuantumState[] = [
    { dopant: 'Europium (Eu³⁺)', coherenceTime: 8.5, temperature: 300, color: '#ff6b6b' },
    { dopant: 'Neodymium (Nd³⁺)', coherenceTime: 5.2, temperature: 300, color: '#4ecdc4' },
    { dopant: 'Erbium (Er³⁺)', coherenceTime: 3.8, temperature: 300, color: '#95e1d3' },
    { dopant: 'Ytterbium (Yb³⁺)', coherenceTime: 6.1, temperature: 300, color: '#ffd700' },
  ];

  // Rotate Bloch sphere
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Canvas rendering - Bloch sphere
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    // Background
    const gradient = ctx.createRadialGradient(300, 300, 0, 300, 300, 400);
    gradient.addColorStop(0, '#1a2a4a');
    gradient.addColorStop(1, '#0a0e27');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = 300;
    const centerY = 300;
    const radius = 150;
    const dopant = dopants[selectedDopant];

    // Draw Bloch sphere wireframe
    ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
    ctx.lineWidth = 1;

    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      const latRad = (lat * Math.PI) / 180;
      const latRadius = radius * Math.cos(latRad);
      const latY = centerY + radius * Math.sin(latRad);

      ctx.beginPath();
      for (let lon = 0; lon <= 360; lon += 5) {
        const lonRad = ((lon + rotation) * Math.PI) / 180;
        const x = centerX + latRadius * Math.cos(lonRad);
        const y = latY;

        if (lon === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Longitude lines
    for (let lon = 0; lon < 360; lon += 30) {
      ctx.beginPath();
      for (let lat = -90; lat <= 90; lat += 5) {
        const latRad = (lat * Math.PI) / 180;
        const lonRad = ((lon + rotation) * Math.PI) / 180;
        const latRadius = radius * Math.cos(latRad);
        const x = centerX + latRadius * Math.cos(lonRad);
        const y = centerY + radius * Math.sin(latRad);

        if (lat === -90) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 2;

    // X axis
    ctx.beginPath();
    ctx.moveTo(centerX - radius - 20, centerY);
    ctx.lineTo(centerX + radius + 20, centerY);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX, centerY + radius + 20);
    ctx.stroke();

    // Z axis (vertical)
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX, centerY + radius + 20);
    ctx.stroke();

    // Draw quantum state vector
    const stateAngle = ((dopant.coherenceTime / 8.5) * 180 + rotation) * (Math.PI / 180);
    const stateX = centerX + radius * Math.sin(stateAngle) * Math.cos(rotation * Math.PI / 180);
    const stateY = centerY + radius * Math.cos(stateAngle);

    ctx.strokeStyle = dopant.color;
    ctx.lineWidth = 3;
    ctx.shadowColor = dopant.color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(stateX, stateY);
    ctx.stroke();

    // Draw state point
    ctx.fillStyle = dopant.color;
    ctx.beginPath();
    ctx.arc(stateX, stateY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('|0⟩', centerX, centerY - radius - 35);
    ctx.fillText('|1⟩', centerX, centerY + radius + 35);
  }, [rotation, selectedDopant, dopants]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-deep-blue to-black pt-20 pb-20">
      <AudioSystem
        soundscapeUrl="https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/quantum-soundscape_a23f6c33.wav"
        volume={0.3}
        autoPlay={true}
        loop={true}
      />

      {showIntro && (
        <CinematicIntro
          title="Quantum Computing"
          subtitle="Room Temperature Quantum Coherence"
          color="#ff00ff"
          icon="⚙️"
          duration={2.5}
          onComplete={() => setShowIntro(false)}
        />
      )}
      {/* Cinematic Intro */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="max-w-6xl mx-auto px-4 mb-12"
      >
        <h1 className="text-6xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-magenta-400 via-cyan-400 to-magenta-400 bg-clip-text text-transparent">
            Quantum Computing Research
          </span>
        </h1>
        <p className="text-center text-magenta-400 text-lg mb-8">
          Room Temperature Quantum Coherence in Rare-Earth Dopants
        </p>
      </motion.div>

      {/* Bloch Sphere Visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="max-w-2xl mx-auto px-4 mb-12"
      >
        <canvas
          ref={canvasRef}
          className="w-full border-2 border-magenta-400/50 rounded-lg shadow-lg shadow-magenta-400/30"
        />
      </motion.div>

      {/* Dopant Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-4xl mx-auto px-4 mb-12 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {dopants.map((dopant, idx) => (
          <motion.button
            key={idx}
            onClick={() => setSelectedDopant(idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedDopant === idx
                ? `bg-black/70 border-2`
                : 'bg-black/50 border-cyan-400/30 hover:border-cyan-400'
            }`}
            style={{
              borderColor: selectedDopant === idx ? dopant.color : undefined,
              backgroundColor: selectedDopant === idx ? `${dopant.color}20` : undefined,
            }}
          >
            <div className="text-sm font-bold mb-2" style={{ color: dopant.color }}>
              {dopant.dopant}
            </div>
            <div className="text-xs text-cyan-400">
              {dopant.coherenceTime} μs @ 300K
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Coherence Data */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="max-w-4xl mx-auto px-4 mb-12 p-8 bg-black/50 rounded-lg border border-magenta-400/30"
      >
        <h3 className="text-2xl font-bold text-magenta-400 mb-6">
          Quantum Coherence Times (Ramsey Interferometry @ 300K)
        </h3>
        <div className="space-y-4">
          {dopants.map((dopant, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + idx * 0.1 }}
              className="flex items-center gap-4"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: dopant.color }}
              />
              <div className="flex-1">
                <div className="font-bold text-cyan-400">{dopant.dopant}</div>
                <div className="text-sm text-gold-400">
                  T₂ = {dopant.coherenceTime} μs
                </div>
              </div>
              <div className="w-48 h-2 bg-black/50 rounded-full overflow-hidden border border-cyan-400/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(dopant.coherenceTime / 8.5) * 100}%` }}
                  transition={{ delay: 1.5 + idx * 0.1, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: dopant.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key Findings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="p-6 bg-black/50 rounded-lg border border-magenta-400/30">
          <h4 className="text-xl font-bold text-magenta-400 mb-4">Research Breakthrough</h4>
          <div className="text-sm text-cyan-400 space-y-2">
            <p>
              <strong>Achievement:</strong> Room temperature quantum coherence exceeds 1 μs minimum target
            </p>
            <p>
              <strong>Significance:</strong> Eliminates need for cryogenic cooling in quantum systems
            </p>
            <p>
              <strong>Application:</strong> Enables practical quantum computing at 300K
            </p>
          </div>
        </div>

        <div className="p-6 bg-black/50 rounded-lg border border-magenta-400/30">
          <h4 className="text-xl font-bold text-magenta-400 mb-4">Technical Details</h4>
          <div className="text-sm text-cyan-400 space-y-2">
            <p>
              <strong>Host Material:</strong> Quartz crystals (SiO₂)
            </p>
            <p>
              <strong>Measurement:</strong> Ramsey interferometry at 300K
            </p>
            <p>
              <strong>Best Result:</strong> Europium achieves 8.5 μs coherence time
            </p>
          </div>
        </div>
      </motion.div>

      {/* Applications */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 mt-12 p-8 bg-gradient-to-r from-black/50 to-black/30 rounded-lg border border-magenta-400/30"
      >
        <h3 className="text-2xl font-bold text-magenta-400 mb-6 text-center">
          Quantum Computing Applications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Quantum Simulation', desc: 'Simulate molecular and material systems' },
            { name: 'Optimization', desc: 'Solve complex optimization problems' },
            { name: 'Cryptography', desc: 'Quantum-safe encryption and key distribution' },
          ].map((app, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 + idx * 0.1 }}
              className="p-4 bg-black/70 rounded border border-magenta-400/50 text-center"
            >
              <div className="font-bold text-magenta-400 mb-2">{app.name}</div>
              <div className="text-sm text-cyan-400">{app.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
