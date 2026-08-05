import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface QuantumGate {
  id: string;
  type: 'H' | 'X' | 'Y' | 'Z' | 'CNOT' | 'MEASURE';
  qubit: number;
  controlQubit?: number;
}

export const QuantumCircuitSimulator: React.FC = () => {
  const [gates, setGates] = useState<QuantumGate[]>([]);
  const [qubitStates, setQubitStates] = useState<{ real: number; imag: number }[]>([
    { real: 1, imag: 0 },
    { real: 1, imag: 0 },
    { real: 1, imag: 0 },
  ]);
  const [measurements, setMeasurements] = useState<number[]>([0, 0, 0]);
  const [isSimulating, setIsSimulating] = useState(false);

  const numQubits = 3;

  const addGate = (type: QuantumGate['type'], qubit: number) => {
    const newGate: QuantumGate = {
      id: Date.now().toString(),
      type,
      qubit,
    };
    setGates([...gates, newGate]);
  };

  const removeGate = (id: string) => {
    setGates(gates.filter((g) => g.id !== id));
  };

  const simulateCircuit = () => {
    setIsSimulating(true);
    
    // Simulate quantum gates
    let newStates = [...qubitStates];

    gates.forEach((gate) => {
      switch (gate.type) {
        case 'H':
          // Hadamard: (|0⟩ + |1⟩) / √2
          newStates[gate.qubit] = {
            real: (newStates[gate.qubit].real + newStates[gate.qubit].imag) / Math.sqrt(2),
            imag: (newStates[gate.qubit].real - newStates[gate.qubit].imag) / Math.sqrt(2),
          };
          break;
        case 'X':
          // Pauli-X: flip
          newStates[gate.qubit] = {
            real: newStates[gate.qubit].imag,
            imag: newStates[gate.qubit].real,
          };
          break;
        case 'Z':
          // Pauli-Z: phase flip
          newStates[gate.qubit].imag *= -1;
          break;
      }
    });

    setQubitStates(newStates);

    // Measure qubits
    const newMeasurements = newStates.map((state) => {
      const probability = state.real * state.real + state.imag * state.imag;
      return Math.random() < probability ? 1 : 0;
    });

    setMeasurements(newMeasurements);
    setIsSimulating(false);
  };

  const resetCircuit = () => {
    setGates([]);
    setQubitStates([
      { real: 1, imag: 0 },
      { real: 1, imag: 0 },
      { real: 1, imag: 0 },
    ]);
    setMeasurements([0, 0, 0]);
  };

  const gateColors: Record<QuantumGate['type'], string> = {
    H: '#00ff88',
    X: '#ff0066',
    Y: '#ffaa00',
    Z: '#0066ff',
    CNOT: '#00ffff',
    MEASURE: '#ff00ff',
  };

  return (
    <div className="w-full p-6 bg-gradient-to-br from-black/60 to-black/40 rounded-lg border border-cyan-400/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Quantum Circuit Simulator</h3>

        {/* Circuit visualization */}
        <div className="mb-6 p-4 bg-black/50 rounded border border-cyan-400/20 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {Array.from({ length: numQubits }).map((_, qubit) => (
              <div key={qubit} className="flex items-center gap-2">
                <div className="w-12 text-center text-xs font-bold text-cyan-300">q{qubit}</div>
                <div className="flex gap-1 h-12 items-center">
                  {gates
                    .filter((g) => g.qubit === qubit)
                    .map((gate, idx) => (
                      <motion.button
                        key={gate.id}
                        onClick={() => removeGate(gate.id)}
                        className="w-12 h-12 rounded border-2 flex items-center justify-center font-bold text-xs cursor-pointer hover:opacity-70 transition-opacity"
                        style={{
                          borderColor: gateColors[gate.type],
                          backgroundColor: gateColors[gate.type] + '20',
                          color: gateColors[gate.type],
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {gate.type}
                      </motion.button>
                    ))}
                  <div className="w-12 h-0.5 bg-cyan-400/30" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gate palette */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-cyan-400 mb-3">Available Gates</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {(['H', 'X', 'Y', 'Z'] as const).map((gateType) => (
              <div key={gateType} className="space-y-2">
                <div className="text-xs text-cyan-200/60 text-center">{gateType}</div>
                {Array.from({ length: numQubits }).map((_, qubit) => (
                  <motion.button
                    key={`${gateType}-${qubit}`}
                    onClick={() => addGate(gateType, qubit)}
                    className="w-full px-2 py-1 rounded border text-xs font-bold transition-all"
                    style={{
                      borderColor: gateColors[gateType],
                      backgroundColor: gateColors[gateType] + '20',
                      color: gateColors[gateType],
                    }}
                    whileHover={{ scale: 1.05, backgroundColor: gateColors[gateType] + '40' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    q{qubit}
                  </motion.button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Qubit states */}
        <div className="mb-6 p-4 bg-black/50 rounded border border-cyan-400/20">
          <h4 className="text-sm font-bold text-cyan-400 mb-3">Qubit States</h4>
          <div className="grid grid-cols-3 gap-3">
            {qubitStates.map((state, i) => {
              const magnitude = Math.sqrt(state.real * state.real + state.imag * state.imag);
              const phase = Math.atan2(state.imag, state.real);
              return (
                <div key={i} className="p-3 bg-black/40 rounded border border-cyan-400/30 text-xs font-mono text-cyan-200/80">
                  <div className="text-cyan-400 font-bold mb-1">q{i}</div>
                  <div>|ψ⟩ = {state.real.toFixed(3)} + {state.imag.toFixed(3)}i</div>
                  <div>|Magnitude|: {magnitude.toFixed(3)}</div>
                  <div>Phase: {(phase * 180 / Math.PI).toFixed(1)}°</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Measurement results */}
        <div className="mb-6 p-4 bg-black/50 rounded border border-cyan-400/20">
          <h4 className="text-sm font-bold text-cyan-400 mb-3">Measurement Results</h4>
          <div className="flex gap-4">
            {measurements.map((m, i) => (
              <motion.div
                key={i}
                className="flex-1 p-3 rounded border-2 text-center"
                style={{
                  borderColor: m === 1 ? '#ff0066' : '#00ff88',
                  backgroundColor: m === 1 ? '#ff006620' : '#00ff8820',
                }}
                animate={{ scale: isSimulating ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-xs text-cyan-200/60">q{i}</div>
                <div className="text-3xl font-bold" style={{ color: m === 1 ? '#ff0066' : '#00ff88' }}>
                  {m}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <motion.button
            onClick={simulateCircuit}
            disabled={gates.length === 0 || isSimulating}
            className="px-6 py-2 bg-cyan-500/40 border border-cyan-400 rounded text-cyan-300 hover:bg-cyan-500/60 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSimulating ? 'Simulating...' : 'Simulate Circuit'}
          </motion.button>
          <motion.button
            onClick={resetCircuit}
            className="px-6 py-2 bg-black/50 border border-cyan-400/30 rounded text-cyan-300 hover:border-cyan-400 font-bold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
        </div>

        <div className="mt-4 text-xs text-cyan-200/60 font-mono">
          <div>Total gates: {gates.length}</div>
          <div>Qubits: {numQubits}</div>
          <div>State vector: {qubitStates.length}</div>
        </div>
      </motion.div>
    </div>
  );
};
