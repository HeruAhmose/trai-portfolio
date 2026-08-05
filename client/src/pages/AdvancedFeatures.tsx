import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QuantumComputingViz } from '../components/QuantumComputingViz';
import { NeuralNetworkViz } from '../components/NeuralNetworkViz';
import { AdvancedPhysicsSimulation } from '../components/AdvancedPhysicsSimulation';
import { Interactive3DDataViz } from '../components/Interactive3DDataViz';
import { Immersive3DEnvironment } from '../components/Immersive3DEnvironment';

export const AdvancedFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('quantum');

  const features = [
    {
      id: 'quantum',
      name: 'Quantum Computing',
      description: 'Bloch sphere visualization with real quantum coherence data',
      icon: '⚛️',
    },
    {
      id: 'neural',
      name: 'Neural Networks',
      description: 'Live training visualization with adaptive learning',
      icon: '🧠',
    },
    {
      id: 'physics',
      name: 'Physics Engine',
      description: 'Advanced cloth dynamics and particle simulation',
      icon: '⚙️',
    },
    {
      id: 'data3d',
      name: '3D Data Viz',
      description: 'Interactive 3D research data visualization',
      icon: '📊',
    },
    {
      id: 'environment',
      name: '3D Explorer',
      description: 'Immersive first-person environment navigation',
      icon: '🌐',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-deep-blue to-black pt-20 pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-gold-400 to-magenta-400 bg-clip-text text-transparent">
            Advanced Interactive Features
          </span>
        </h1>
        <p className="text-center text-gold-400 text-lg mb-8">
          Cutting-edge technologies never before implemented in a portfolio
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
          {features.map((feature, idx) => (
            <motion.button
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeTab === feature.id
                  ? 'bg-cyan-400/20 border-cyan-400 shadow-lg shadow-cyan-400/50'
                  : 'bg-black/50 border-cyan-400/30 hover:border-cyan-400/60'
              }`}
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div className="font-bold text-cyan-400 text-sm">{feature.name}</div>
              <div className="text-xs text-gold-400 mt-1">{feature.description}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4"
      >
        {activeTab === 'quantum' && (
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              Quantum Computing Visualization
            </h2>
            <QuantumComputingViz />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-black/50 rounded-lg border border-cyan-400/30"
            >
              <h3 className="text-xl font-bold text-gold-400 mb-4">Quantum Coherence Research</h3>
              <div className="text-sm text-cyan-400 space-y-3">
                <p>
                  The visualization displays real quantum coherence data from the Peoples 2026 AMC Preprint research. The Bloch sphere represents quantum states of rare-earth dopants embedded in quartz crystals at room temperature (300K).
                </p>
                <p>
                  <strong>Key Findings:</strong> Europium (Eu³⁺) achieves 8.5 μs coherence time, Neodymium (Nd³⁺) reaches 5.2 μs, Ytterbium (Yb³⁺) achieves 6.1 μs, and Erbium (Er³⁺) reaches 3.8 μs. These measurements were obtained using Ramsey interferometry at 300K.
                </p>
                <p>
                  The minimum target coherence time of 1 μs is exceeded by all rare-earth dopants, enabling quantum computing applications at room temperature without cryogenic cooling.
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'neural' && (
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              Neural Network Training Visualization
            </h2>
            <NeuralNetworkViz />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-black/50 rounded-lg border border-cyan-400/30"
            >
              <h3 className="text-xl font-bold text-gold-400 mb-4">Deep Learning Architecture</h3>
              <div className="text-sm text-cyan-400 space-y-3">
                <p>
                  This neural network visualization demonstrates real-time training dynamics with adaptive learning rates. The network processes material science data through multiple hidden layers for feature extraction and pattern recognition.
                </p>
                <p>
                  <strong>Architecture:</strong> 8 input neurons → 16 hidden neurons → 32 deep learning neurons → 16 compression neurons → 4 output classifications. Total parameters: 1,248.
                </p>
                <p>
                  The visualization shows loss decreasing and accuracy improving in real-time, simulating the training of a model to classify composite material properties based on composition and manufacturing parameters.
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'physics' && (
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              Advanced Physics Simulation
            </h2>
            <AdvancedPhysicsSimulation />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-black/50 rounded-lg border border-cyan-400/30"
            >
              <h3 className="text-xl font-bold text-gold-400 mb-4">Cloth Dynamics & Constraints</h3>
              <div className="text-sm text-cyan-400 space-y-3">
                <p>
                  This simulation uses Verlet integration with constraint satisfaction to model realistic cloth physics. The system includes 600 particles connected by 1,170 constraints representing structural, bending, and shear forces.
                </p>
                <p>
                  <strong>Physics Parameters:</strong> Gravity (0.2 m/s²), damping (0.99), and iterative constraint solving (3 iterations per frame) create stable, realistic cloth behavior.
                </p>
                <p>
                  Move your mouse over the cloth to apply forces and watch the physics engine respond in real-time. The pinned corners (gold) remain fixed while the rest of the cloth simulates gravity and wind forces.
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'data3d' && (
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              Interactive 3D Data Visualization
            </h2>
            <Interactive3DDataViz />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-black/50 rounded-lg border border-cyan-400/30"
            >
              <h3 className="text-xl font-bold text-gold-400 mb-4">Research Data in 3D Space</h3>
              <div className="text-sm text-cyan-400 space-y-3">
                <p>
                  This visualization plots real experimental data from the Peoples 2026 AMC Preprint across three dimensions. Each point represents a specific measurement or formulation result.
                </p>
                <p>
                  <strong>Data Sources:</strong> Piezoelectric performance (FIG. 4), thermoelectric performance (FIG. 5), electrical conductivity (FIG. 8), and quantum coherence times (FIG. 10).
                </p>
                <p>
                  Click on data points to view detailed information. Rotate the view by moving your mouse to explore the data from different angles and identify patterns and correlations.
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'environment' && (
          <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              Immersive 3D Environment
            </h2>
            <Immersive3DEnvironment />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-black/50 rounded-lg border border-cyan-400/30"
            >
              <h3 className="text-xl font-bold text-gold-400 mb-4">First-Person Exploration</h3>
              <div className="text-sm text-cyan-400 space-y-3">
                <p>
                  Navigate through a fully immersive 3D environment representing different research domains. Each room contains specialized technology and research areas.
                </p>
                <p>
                  <strong>Rooms:</strong> Sovereign Intelligence Hub (cybersecurity), Material Science Laboratory, Quantum Computing Chamber, Energy Harvesting Station, and AI Governance Center.
                </p>
                <p>
                  Use WASD or arrow keys to move, Space/Shift to move up/down, and move your mouse to look around. Approach rooms to enter them and view their specialized content.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Technology Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-6xl mx-auto px-4 mt-16"
      >
        <div className="p-8 bg-gradient-to-r from-black/50 to-black/30 rounded-lg border border-cyan-400/30">
          <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Technology Stack</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-gold-400 mb-3">Graphics & Rendering</h4>
              <ul className="text-sm text-cyan-400 space-y-1">
                <li>• WebGL 2.0 with GLSL shaders</li>
                <li>• Canvas 2D API for 2D visualizations</li>
                <li>• GPU-accelerated particle systems</li>
                <li>• 3D projection and perspective rendering</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gold-400 mb-3">Audio & Interaction</h4>
              <ul className="text-sm text-cyan-400 space-y-1">
                <li>• Web Audio API for spatial audio</li>
                <li>• Speech Recognition API</li>
                <li>• MediaPipe for gesture detection</li>
                <li>• Real-time audio synthesis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gold-400 mb-3">Physics & Animation</h4>
              <ul className="text-sm text-cyan-400 space-y-1">
                <li>• Verlet integration physics</li>
                <li>• Constraint-based simulation</li>
                <li>• Framer Motion animations</li>
                <li>• Real-time performance optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
