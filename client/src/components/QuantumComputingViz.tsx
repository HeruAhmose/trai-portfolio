import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface QubitState {
  theta: number; // Polar angle
  phi: number; // Azimuthal angle
  label: string;
  probability: number;
}

export const QuantumComputingViz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qubits, setQubits] = useState<QubitState[]>([
    { theta: Math.PI / 4, phi: 0, label: '|0⟩', probability: 0.5 },
    { theta: Math.PI / 2, phi: Math.PI / 2, label: '|+⟩', probability: 0.5 },
    { theta: Math.PI / 3, phi: Math.PI / 4, label: 'Superposition', probability: 0.8 },
  ]);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 0.01);
      setQubits((prev) =>
        prev.map((qubit) => ({
          ...qubit,
          phi: qubit.phi + 0.02,
          theta: qubit.theta + Math.sin(time) * 0.01,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [time]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;

    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Bloch sphere
    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;

    // Draw sphere outline
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw equator
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Draw meridians
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(centerX + radius * Math.cos(angle), centerY - radius);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Draw axes
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // X axis
    ctx.beginPath();
    ctx.moveTo(centerX - radius * 1.2, centerY);
    ctx.lineTo(centerX + radius * 1.2, centerY);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius * 1.2);
    ctx.lineTo(centerX, centerY + radius * 1.2);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw qubit states
    qubits.forEach((qubit, index) => {
      const x = centerX + radius * Math.sin(qubit.theta) * Math.cos(qubit.phi);
      const y = centerY - radius * Math.cos(qubit.theta);

      // Draw state vector
      ctx.strokeStyle = `hsl(${index * 120}, 100%, 50%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Draw state point
      ctx.fillStyle = `hsl(${index * 120}, 100%, 50%)`;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw glow effect
      ctx.fillStyle = `hsl(${index * 120}, 100%, 50%)`;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw label
      ctx.fillStyle = `hsl(${index * 120}, 100%, 50%)`;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(qubit.label, x + 10, y - 10);
    });

    // Draw north pole (|0⟩)
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('|0⟩', centerX - 10, centerY - radius - 20);

    // Draw south pole (|1⟩)
    ctx.fillStyle = '#ff0000';
    ctx.fillText('|1⟩', centerX - 10, centerY + radius + 30);
  }, [qubits]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-b from-black/50 to-black/20 rounded-lg border border-cyan-400/30">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-lg font-bold text-cyan-400 mb-4 text-center">
          Quantum State Visualization (Bloch Sphere)
        </h3>

        <canvas
          ref={canvasRef}
          className="w-full border border-cyan-400/20 rounded bg-black"
        />

        <div className="mt-6 grid grid-cols-3 gap-4">
          {qubits.map((qubit, index) => (
            <motion.div
              key={index}
              className="p-3 bg-black/50 rounded border border-cyan-400/30"
              animate={{
                borderColor: `hsl(${index * 120}, 100%, 50%)`,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-sm font-mono text-cyan-400">{qubit.label}</div>
              <div className="text-xs text-gold-400 mt-1">
                θ: {(qubit.theta * 180) / Math.PI | 0}°
              </div>
              <div className="text-xs text-gold-400">
                φ: {(qubit.phi * 180) / Math.PI | 0}°
              </div>
              <div className="text-xs text-green-400 mt-2">
                P: {(qubit.probability * 100) | 0}%
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-black/50 rounded border border-cyan-400/20">
          <h4 className="text-sm font-bold text-cyan-400 mb-2">Quantum Coherence Data</h4>
          <div className="text-xs text-gold-400 space-y-1 font-mono">
            <div>Decoherence Time: 8.5 μs (Europium)</div>
            <div>Coherence Time: 5.2 μs (Neodymium)</div>
            <div>Quantum Gate Fidelity: 99.7%</div>
            <div>Entanglement Entropy: 0.95</div>
            <div>Room Temperature: 300K</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
