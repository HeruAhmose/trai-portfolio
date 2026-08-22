import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AudioSystem } from '../components/AudioSystem';
import { CinematicIntro } from '../components/CinematicIntro';

interface ProcessStep {
  id: number;
  name: string;
  description: string;
  icon: string;
  details: string[];
}

export const Manufacturing: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const steps: ProcessStep[] = [
    {
      id: 710,
      name: 'Hemp Fiber Preparation',
      description: 'Source, clean, and cut hemp bast fibers',
      icon: '🌿',
      details: [
        'Hemp fiber sourcing and quality assessment',
        'Cleaning and decontamination process',
        'Fiber cutting to optimal length (10-50 μm)',
        'Moisture content standardization',
      ],
    },
    {
      id: 720,
      name: 'Pyrolysis',
      description: 'Heat to 800-1200°C in inert atmosphere',
      icon: '🔥',
      details: [
        'Inert atmosphere chamber preparation',
        'Controlled heating ramp (5°C/min)',
        'Peak temperature: 800-1200°C',
        'Hemp-derived carbon fiber extraction',
      ],
    },
    {
      id: 730,
      name: 'Crystal Synthesis',
      description: 'Synthesize or procure crystalline components',
      icon: '💎',
      details: [
        'Quartz microcrystals (1-50 μm)',
        'Tourmaline nanoparticles (10-500 nm)',
        'Magnetite nanoparticles (10-100 nm)',
        'Rare-earth doped crystals synthesis',
      ],
    },
    {
      id: 740,
      name: 'Composite Fabrication',
      description: 'Disperse components and add binder',
      icon: '⚗️',
      details: [
        'Component dispersion in matrix',
        'Sonication/stirring for uniform distribution',
        'Polymer or ceramic binder addition',
        'Homogenization and degassing',
      ],
    },
    {
      id: 750,
      name: 'Consolidation',
      description: 'Cast, mold, press, or extrude',
      icon: '🏗️',
      details: [
        'Mold preparation and setup',
        'Pressure application (50-500 MPa)',
        'Temperature control during consolidation',
        'Cure or sinter process',
      ],
    },
    {
      id: 760,
      name: 'Post-Processing',
      description: 'Machine to dimensions and attach electrodes',
      icon: '🔧',
      details: [
        'Precision machining to specifications',
        'Surface finishing and polishing',
        'Electrode attachment (gold/silver)',
        'Wire bonding and contact preparation',
      ],
    },
    {
      id: 770,
      name: 'Characterization & QC',
      description: 'Test electrical, piezoelectric, thermoelectric properties',
      icon: '📊',
      details: [
        'Electrical conductivity measurement',
        'Piezoelectric coefficient testing',
        'Thermoelectric performance (ZT)',
        'Mechanical property validation',
      ],
    },
  ];

  // Animate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 300;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0e27');
    gradient.addColorStop(1, '#1a2a4a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw process flow
    const stepWidth = canvas.width / steps.length;
    steps.forEach((step, idx) => {
      const x = (idx + 0.5) * stepWidth;
      const y = canvas.height / 2;

      // Connection line
      if (idx < steps.length - 1) {
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 + (activeStep >= idx ? 0.4 : 0)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + stepWidth * 0.3, y);
        ctx.lineTo(x + stepWidth * 0.7, y);
        ctx.stroke();
      }

      // Step circle
      const isActive = activeStep === idx;
      const isComplete = activeStep > idx;

      ctx.fillStyle = isComplete ? '#00ff00' : isActive ? '#ffd700' : '#00d9ff';
      ctx.shadowColor = isComplete ? '#00ff00' : isActive ? '#ffd700' : '#00d9ff';
      ctx.shadowBlur = isActive ? 20 : 10;
      ctx.beginPath();
      ctx.arc(x, y, isActive ? 20 : 15, 0, Math.PI * 2);
      ctx.fill();

      // Step number
      ctx.fillStyle = '#0a0e27';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(step.id.toString(), x, y);
    });

    // Progress bar
    ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(0, canvas.height - 10, (progress / 100) * canvas.width, 10);
  }, [activeStep, progress, steps]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-deep-blue to-black pt-20 pb-20">
      <AudioSystem
        soundscapeUrl="https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/manufacturing-soundscape_6f5c9be0.wav"
        volume={0.3}
        autoPlay={true}
        loop={true}
      />

      {showIntro && (
        <CinematicIntro
          title="Manufacturing"
          subtitle="7-Step Advanced Composite Fabrication"
          color="#ffd700"
          icon="🔨"
          duration={2.5}
          onComplete={() => setShowIntro(false)}
        />
      )}
      {/* Cinematic Intro */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto px-4 mb-12"
      >
        <h1 className="text-6xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Manufacturing Process
          </span>
        </h1>
        <p className="text-center text-gold-400 text-lg mb-8">
          7-Step Advanced Composite Fabrication
        </p>
      </motion.div>

      {/* Process Visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="max-w-4xl mx-auto px-4 mb-12"
      >
        <canvas
          ref={canvasRef}
          className="w-full border-2 border-gold-400/50 rounded-lg shadow-lg shadow-gold-400/30"
        />
      </motion.div>

      {/* Step Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-4xl mx-auto px-4 mb-12 flex justify-center gap-2 flex-wrap"
      >
        {steps.map((step, idx) => (
          <motion.button
            key={step.id}
            onClick={() => setActiveStep(idx)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded font-bold transition-all ${
              activeStep === idx
                ? 'bg-gold-400/30 text-gold-400 border-2 border-gold-400'
                : 'bg-black/50 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400'
            }`}
          >
            Step {step.id}
          </motion.button>
        ))}
      </motion.div>

      {/* Active Step Details */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 mb-12 p-8 bg-gradient-to-r from-black/50 to-black/30 rounded-lg border-2 border-gold-400/30"
      >
        <div className="flex items-start gap-6">
          <div className="text-6xl">{steps[activeStep].icon}</div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-gold-400 mb-2">
              Step {steps[activeStep].id}: {steps[activeStep].name}
            </h3>
            <p className="text-cyan-400 text-lg mb-4">{steps[activeStep].description}</p>
            <div className="space-y-2">
              {steps[activeStep].details.map((detail, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-sm text-green-400 font-mono flex items-center gap-2"
                >
                  <span className="text-gold-400">▸</span>
                  {detail}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quality Control */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 p-8 bg-black/50 rounded-lg border border-gold-400/30"
      >
        <h3 className="text-2xl font-bold text-gold-400 mb-2 text-center">
          QC Release Targets
        </h3>
        <p className="text-sm text-cyan-400/70 mb-6 text-center max-w-2xl mx-auto">
          The acceptance criteria the seven-step process is designed to meet, each
          drawn from a claim in provisional 63/934,269. No system-level performance
          data are reported.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'Electrical', value: '10²–10⁶ S/m', claim: 'Claim 1' },
            { name: 'Piezoelectric', value: '>100 mV @ 1g', claim: 'Claim 20' },
            { name: 'Thermal', value: '>50 mV @ 10°C/min', claim: 'Claim 21' },
            { name: 'Mechanical', value: '>10⁶ cycles', claim: 'Claim 12' },
          ].map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + idx * 0.1 }}
              className="p-4 bg-black/70 rounded border border-gold-400/30 text-center"
            >
              <div className="text-xl font-bold text-gold-400 mb-2">{test.value}</div>
              <div className="text-sm text-cyan-400">{test.name}</div>
              <div className="text-[10px] font-mono text-white/40 mt-1 tracking-wider">
                {test.claim}
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-[10px] font-mono text-white/30 mt-6 text-center tracking-[0.2em] uppercase">
          Design envelope · not measured data
        </p>
      </motion.div>
    </div>
  );
};
