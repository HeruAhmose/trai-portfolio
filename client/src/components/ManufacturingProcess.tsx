import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  id: string;
  number: number;
  title: string;
  description: string;
  details: string[];
}

const manufacturingSteps: Step[] = [
  {
    id: '710',
    number: 710,
    title: 'Fiber Preparation',
    description: 'Source, clean, and cut industrial hemp bast fibers.',
    details: [
      'Select hemp varieties with high cellulose and lignin content',
      'Pre-condition fibers for optimal pyrolysis',
      'Achieve consistent fiber diameter (5–50 μm)',
      'Maintain aspect ratios >100:1',
    ],
  },
  {
    id: '720',
    number: 720,
    title: 'Pyrolysis',
    description: 'Controlled heating at 700–1400°C in inert atmosphere.',
    details: [
      'Temperature range: 700–1400°C',
      'Inert atmosphere (nitrogen or argon)',
      'Optimize carbon yield and microstructure',
      'Achieve conductivity 10²–10⁶ S/m',
    ],
  },
  {
    id: '730',
    number: 730,
    title: 'Crystal Synthesis',
    description: 'Synthesize and prepare crystalline constituents.',
    details: [
      'Quartz SiO₂ (15–45%)',
      'Tourmaline (3–25%)',
      'Magnetite Fe₃O₄ (2–20%)',
      'Rare-earth dopants (0.3–10%)',
    ],
  },
  {
    id: '740',
    number: 740,
    title: 'Dispersion',
    description: 'Disperse all constituents uniformly in polymer matrix.',
    details: [
      'Achieve uniform spatial distribution',
      'Optimize particle size distribution',
      'Minimize agglomeration',
      'Ensure consistent coupling geometry',
    ],
  },
  {
    id: '750',
    number: 750,
    title: 'Binder Addition',
    description: 'Add polymer binder (PDMS or PVDF).',
    details: [
      'Control binder viscosity and flow',
      'Maintain constituent dispersion',
      'Optimize mechanical stress transfer',
      'Ensure environmental encapsulation',
    ],
  },
  {
    id: '760',
    number: 760,
    title: 'Forming & Curing',
    description: 'Form composite into desired geometry and cure.',
    details: [
      'Casting or molding techniques',
      'Temperature-controlled curing',
      'Achieve desired mechanical properties',
      'Optimize crystal field environment',
    ],
  },
  {
    id: '770',
    number: 770,
    title: 'QC & Electrodes',
    description: 'Quality control and electrode integration.',
    details: [
      'Electrical characterization',
      'Mechanical testing',
      'Integrate signal electrodes',
      'Final packaging and sealing',
    ],
  },
];

export default function ManufacturingProcess() {
  const [activeStep, setActiveStep] = useState<string | null>('710');
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const currentStep = manufacturingSteps.find((s) => s.id === activeStep);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Process Flow Visualization */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary opacity-30 hidden lg:block" />

        {/* Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {manufacturingSteps.map((step, idx) => {
            const isActive = activeStep === step.id;
            const isHovered = hoveredStep === step.id;

            return (
              <motion.button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`relative p-4 rounded border transition-all ${
                  isActive
                    ? 'bg-primary text-background border-primary neon-border-glow'
                    : isHovered
                      ? 'bg-card border-primary'
                      : 'bg-card border-border hover:border-primary'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="text-center">
                  <div className={`text-sm font-bold font-mono ${isActive ? 'text-background' : 'text-primary'}`}>
                    {step.number}
                  </div>
                  <div className={`text-xs font-mono mt-2 leading-tight ${isActive ? 'text-background' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                </div>

                {/* Connection Arrow */}
                {idx < manufacturingSteps.length - 1 && (
                  <div className={`absolute -right-3 top-1/2 transform -translate-y-1/2 text-lg ${isActive || isHovered ? 'text-primary' : 'text-border'}`}>
                    →
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Step Details */}
      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 rounded border border-primary bg-card neon-border"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold text-primary neon-text">{currentStep.number}</span>
                  <h2 className="text-2xl font-bold text-foreground">{currentStep.title}</h2>
                </div>
                <p className="text-foreground/80 mb-6">{currentStep.description}</p>

                {/* Key Details */}
                <div className="space-y-3">
                  {currentStep.details.map((detail, idx) => (
                    <motion.div
                      key={idx}
                      className="flex gap-3 items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-sm text-foreground/80">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column - Visualization */}
              <motion.div
                className="flex items-center justify-center p-6 rounded border border-border bg-background/50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
                  >
                    {currentStep.number === 710 && '🌾'}
                    {currentStep.number === 720 && '🔥'}
                    {currentStep.number === 730 && '💎'}
                    {currentStep.number === 740 && '🌊'}
                    {currentStep.number === 750 && '🧪'}
                    {currentStep.number === 760 && '🔨'}
                    {currentStep.number === 770 && '✓'}
                  </motion.div>
                  <p className="font-mono text-xs text-muted-foreground">
                    Step {manufacturingSteps.findIndex((s) => s.id === currentStep.id) + 1} of {manufacturingSteps.length}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Process Summary */}
      <motion.div
        className="p-4 rounded border border-border bg-card text-sm text-foreground/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="font-mono text-xs text-muted-foreground mb-2">PROCESS SUMMARY</p>
        <p>
          The 7-step manufacturing process transforms raw hemp fibers into a sophisticated multi-modal transduction composite. Each step is carefully controlled to maintain the coupling geometry necessary for emergent system-level performance.
        </p>
      </motion.div>
    </motion.div>
  );
}
