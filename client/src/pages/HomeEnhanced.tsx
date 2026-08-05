import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Brain, Layers, Sparkles, Gauge, Infinity } from 'lucide-react';
import {
  ParticleBackground,
  HolographicText,
  NeuralNetwork,
  FloatingElement,
  PulseGlow,
  GlitchText,
  AnimatedGradientBorder,
} from '@/components/AdvancedVisuals';
import { InteractiveButton } from '@/components/InteractiveButton';
import { UltraBrightNeon, BrightText, RadiantGradient } from '@/components/UltraBrightNeon';
import { MassiveParticleSystem } from '@/components/MassiveParticleSystem';


export default function HomeEnhanced() {
  const [isMuted, setIsMuted] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Ultra-bright particle system background */}
      <MassiveParticleSystem particleCount={75000} intensity={1.2} className="opacity-60" />

      {/* Radiant gradient overlays */}
      <RadiantGradient className="absolute inset-0 pointer-events-none"><div /></RadiantGradient>

      {/* Main content */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Hero section */}
          <motion.div variants={itemVariants} className="space-y-6 max-w-4xl">
            <div className="space-y-4">
              <UltraBrightNeon color="cyan" intensity={1.5}>
                <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-none">
                  <BrightText color="cyan">JONATHAN</BrightText>
                  <br />
                  <BrightText color="magenta">PEOPLES</BrightText>
                </h1>
              </UltraBrightNeon>

              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-cyan-300">
                  Sovereign Tech Portfolio
                </h2>
                <p className="text-xl text-cyan-200/80 max-w-2xl leading-relaxed">
                  <BrightText color="lime">Advancing the frontiers</BrightText> of cybersecurity, material science, and community technology through sovereign innovation and ethical architecture.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-8"
            >
              <InteractiveButton
                variant="primary"
                size="lg"
                onClick={() => {}}
                soundEnabled={!isMuted}
                hapticEnabled={true}
                className="text-lg"
              >
                Explore Portfolio <ArrowRight className="ml-2 w-5 h-5" />
              </InteractiveButton>

              <InteractiveButton
                variant="secondary"
                size="lg"
                onClick={() => setShowVisualization(!showVisualization)}
                soundEnabled={!isMuted}
                hapticEnabled={true}
                className="text-lg"
              >
                View Research
              </InteractiveButton>
            </motion.div>
          </motion.div>

          {/* Feature grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Energy Harvesting',
                desc: 'Multi-modal composite materials',
                color: 'lime',
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'AI & Security',
                desc: 'Cybersecurity innovations',
                color: 'cyan',
              },
              {
                icon: <Layers className="w-8 h-8" />,
                title: 'Material Science',
                desc: 'Quantum-enhanced composites',
                color: 'magenta',
              },
            ].map((feature, i) => (
              <UltraBrightNeon key={i} color={feature.color as any} intensity={1.3}>
                <motion.div
                  className="p-6 rounded-lg border border-current/30 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="mb-4 text-2xl">{feature.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm opacity-80">{feature.desc}</p>
                </motion.div>
              </UltraBrightNeon>
            ))}
          </motion.div>

          {/* 3D Visualization */}
          {showVisualization && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-20"
            >
              <UltraBrightNeon color="gold" intensity={1.2}>
                <div className="rounded-lg border border-yellow-400/50 bg-black/60 backdrop-blur-lg p-8">
                  <div className="w-full h-96 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded flex items-center justify-center">
                    <span className="text-yellow-300 font-bold">3D Visualization</span>
                  </div>
                </div>
              </UltraBrightNeon>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 opacity-20">
          <FloatingElement delay={0}><div className="w-full h-full" /></FloatingElement>
        </div>
        <div className="absolute bottom-20 right-10 w-40 h-40 opacity-15">
          <FloatingElement delay={2}><div className="w-full h-full" /></FloatingElement>
        </div>
      </div>
    </div>
  );
}
