import React from 'react';
import { motion } from 'framer-motion';
import { QuantumCircuitSimulator } from '@/components/QuantumCircuitSimulator';

export const QuantumSimulatorPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-black via-indigo-950/20 to-black p-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">Quantum Circuit Simulator</h1>
          <p className="text-cyan-200/60">Design and simulate quantum circuits with real-time state visualization</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <QuantumCircuitSimulator />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="p-6 bg-black/50 rounded-lg border border-cyan-400/20">
            <h2 className="text-lg font-bold text-cyan-400 mb-4">Quantum Gates</h2>
            <div className="space-y-2 text-xs text-cyan-200/70 font-mono">
              <div><span className="text-green-400">H</span> - Hadamard (superposition)</div>
              <div><span className="text-red-400">X</span> - Pauli-X (bit flip)</div>
              <div><span className="text-yellow-400">Y</span> - Pauli-Y (rotation)</div>
              <div><span className="text-blue-400">Z</span> - Pauli-Z (phase flip)</div>
            </div>
          </div>

          <div className="p-6 bg-black/50 rounded-lg border border-cyan-400/20">
            <h2 className="text-lg font-bold text-cyan-400 mb-4">State Representation</h2>
            <div className="space-y-2 text-xs text-cyan-200/70 font-mono">
              <div>|ψ⟩ = a|0⟩ + b|1⟩</div>
              <div>Magnitude: √(a² + b²)</div>
              <div>Phase: atan2(b, a)</div>
              <div>Probability: |amplitude|²</div>
            </div>
          </div>

          <div className="p-6 bg-black/50 rounded-lg border border-cyan-400/20">
            <h2 className="text-lg font-bold text-cyan-400 mb-4">Measurement</h2>
            <div className="space-y-2 text-xs text-cyan-200/70 font-mono">
              <div>Collapses superposition</div>
              <div>Probability-based outcome</div>
              <div>Irreversible operation</div>
              <div>Returns classical bits</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-6 bg-black/50 rounded-lg border border-cyan-400/20"
        >
          <h2 className="text-lg font-bold text-cyan-400 mb-4">Try These Circuits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-cyan-200/70">
            <div className="p-3 bg-black/40 rounded border border-cyan-400/10">
              <div className="font-bold text-cyan-300 mb-1">Bell State (Entanglement)</div>
              <div>Add H gate to q0, then CNOT with q0 as control and q1 as target</div>
            </div>
            <div className="p-3 bg-black/40 rounded border border-cyan-400/10">
              <div className="font-bold text-cyan-300 mb-1">Superposition</div>
              <div>Add H gates to all qubits to create equal superposition</div>
            </div>
            <div className="p-3 bg-black/40 rounded border border-cyan-400/10">
              <div className="font-bold text-cyan-300 mb-1">Phase Kickback</div>
              <div>Add Z gate to q0, then H gates to observe phase effects</div>
            </div>
            <div className="p-3 bg-black/40 rounded border border-cyan-400/10">
              <div className="font-bold text-cyan-300 mb-1">Quantum Interference</div>
              <div>Combine H and X gates to demonstrate interference patterns</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
