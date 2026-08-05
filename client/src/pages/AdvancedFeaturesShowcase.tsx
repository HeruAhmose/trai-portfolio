import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AdvancedParticleSystem } from '../components/AdvancedParticleSystem';
import { DNAHelix } from '../components/DNAHelix';
import { HolographicInterface } from '../components/HolographicInterface';
import { BlockchainVisualization } from '../components/BlockchainVisualization';

type FeatureTab = 'particles' | 'dna' | 'hologram' | 'blockchain';

export const AdvancedFeaturesShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeatureTab>('particles');

  const features = [
    {
      id: 'particles',
      name: 'Particle Effects',
      icon: '✨',
      description: 'GPU-accelerated particle systems with fountain, explosion, and swarm behaviors',
    },
    {
      id: 'dna',
      name: 'DNA Visualization',
      icon: '🧬',
      description: 'Interactive DNA helix with base pair visualization and hydrogen bonding',
    },
    {
      id: 'hologram',
      name: 'Holographic UI',
      icon: '🔮',
      description: 'Sci-fi holographic interface with glitch effects and scanlines',
    },
    {
      id: 'blockchain',
      name: 'Blockchain',
      icon: '⛓️',
      description: 'Distributed ledger visualization with real-time data flow',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-deep-blue to-black pt-20 pb-20">
      {/* Cinematic Intro */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto px-4 mb-12"
      >
        <h1 className="text-6xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Advanced Technology Showcase
          </span>
        </h1>
        <p className="text-center text-purple-400 text-lg mb-8">
          Cutting-Edge Visualizations & Interactive Systems
        </p>
      </motion.div>

      {/* Feature Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 mb-12 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {features.map((feature, idx) => (
          <motion.button
            key={feature.id}
            onClick={() => setActiveTab(feature.id as FeatureTab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + idx * 0.1 }}
            className={`p-4 rounded-lg border-2 transition-all text-center ${
              activeTab === feature.id
                ? 'bg-purple-400/20 border-purple-400 shadow-lg shadow-purple-400/50'
                : 'bg-black/50 border-purple-400/30 hover:border-purple-400/60'
            }`}
          >
            <div className="text-3xl mb-2">{feature.icon}</div>
            <div className="text-sm font-bold text-purple-400">{feature.name}</div>
          </motion.button>
        ))}
      </motion.div>

      {/* Feature Description */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 mb-8 p-6 bg-black/50 rounded-lg border border-purple-400/30"
      >
        <p className="text-purple-400 text-center">
          {features.find((f) => f.id === activeTab)?.description}
        </p>
      </motion.div>

      {/* Feature Content */}
      <motion.div
        key={`content-${activeTab}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 mb-12"
      >
        {activeTab === 'particles' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Fountain Effect</h3>
              <AdvancedParticleSystem width={800} height={400} emitterType="fountain" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Explosion Effect</h3>
              <AdvancedParticleSystem width={800} height={400} emitterType="explosion" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Swarm Intelligence</h3>
              <AdvancedParticleSystem width={800} height={400} emitterType="swarm" />
            </div>
          </div>
        )}

        {activeTab === 'dna' && (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <DNAHelix interactive />
            </div>
          </div>
        )}

        {activeTab === 'hologram' && (
          <div className="flex justify-center">
            <HolographicInterface title="Holographic Command Center" />
          </div>
        )}

        {activeTab === 'blockchain' && (
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <BlockchainVisualization blockCount={8} />
            </div>
          </div>
        )}
      </motion.div>

      {/* Technical Specifications */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="p-6 bg-black/50 rounded-lg border border-purple-400/30">
          <h3 className="text-xl font-bold text-purple-400 mb-4">Performance</h3>
          <div className="space-y-2 text-sm text-cyan-400 font-mono">
            <div>
              <span className="text-purple-400">Rendering:</span> WebGL 2.0 + Canvas 2D
            </div>
            <div>
              <span className="text-purple-400">Particles:</span> 1000+ simultaneous
            </div>
            <div>
              <span className="text-purple-400">Frame Rate:</span> 60 FPS target
            </div>
            <div>
              <span className="text-purple-400">GPU Acceleration:</span> Enabled
            </div>
          </div>
        </div>

        <div className="p-6 bg-black/50 rounded-lg border border-purple-400/30">
          <h3 className="text-xl font-bold text-purple-400 mb-4">Features</h3>
          <div className="space-y-2 text-sm text-cyan-400 font-mono">
            <div>✓ Real-time physics simulation</div>
            <div>✓ Interactive element selection</div>
            <div>✓ Procedural animation</div>
            <div>✓ Responsive design</div>
          </div>
        </div>
      </motion.div>

      {/* Integration Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 mt-12 p-8 bg-gradient-to-r from-black/50 to-black/30 rounded-lg border border-purple-400/30"
      >
        <h3 className="text-2xl font-bold text-purple-400 mb-6 text-center">
          Integration with Research Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="font-bold text-cyan-400 mb-2">Material Science</h4>
            <p className="text-sm text-gold-400">
              Visualize composite structures and crystal formations
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚛️</div>
            <h4 className="font-bold text-cyan-400 mb-2">Quantum Computing</h4>
            <p className="text-sm text-gold-400">
              Explore quantum states and coherence mechanisms
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔐</div>
            <h4 className="font-bold text-cyan-400 mb-2">Cryptography</h4>
            <p className="text-sm text-gold-400">
              Understand quantum-safe encryption protocols
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedFeaturesShowcase;
