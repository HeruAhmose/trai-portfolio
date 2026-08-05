import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Neuron {
  id: string;
  layer: number;
  index: number;
  activation: number;
  connections: { targetId: string; weight: number }[];
}

export const NeuralNetworkViz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [learningRate, setLearningRate] = useState(0.001);
  const [trainingMetrics, setTrainingMetrics] = useState({
    loss: 0.85,
    accuracy: 0.92,
    epoch: 0,
    learningRate: 0.001,
  });

  // Initialize neural network
  useEffect(() => {
    const layers = [8, 16, 32, 16, 4]; // Input, hidden layers, output
    const newNeurons: Neuron[] = [];
    let id = 0;

    layers.forEach((layerSize, layerIndex) => {
      for (let i = 0; i < layerSize; i++) {
        newNeurons.push({
          id: `neuron-${id}`,
          layer: layerIndex,
          index: i,
          activation: Math.random(),
          connections: [],
        });
        id++;
      }
    });

    // Create connections between layers
    newNeurons.forEach((neuron) => {
      if (neuron.layer < layers.length - 1) {
        const nextLayerStart = newNeurons.findIndex(
          (n) => n.layer === neuron.layer + 1
        );
        const nextLayerSize = layers[neuron.layer + 1];

        for (let i = 0; i < Math.min(3, nextLayerSize); i++) {
          const targetIndex = nextLayerStart + ((neuron.index + i) % nextLayerSize);
          neuron.connections.push({
            targetId: newNeurons[targetIndex].id,
            weight: Math.random(),
          });
        }
      }
    });

    setNeurons(newNeurons);
  }, []);

  // Simulate training with learning rate impact
  useEffect(() => {
    const interval = setInterval(() => {
      setTrainingMetrics((prev) => {
        // Learning rate affects convergence speed
        const lrFactor = Math.pow(learningRate / 0.001, 0.6);
        const lossDecay = Math.random() * 0.02 * lrFactor;
        const accuracyGain = Math.random() * 0.01 * lrFactor;

        return {
          loss: Math.max(0.1, prev.loss - lossDecay),
          accuracy: Math.min(0.99, prev.accuracy + accuracyGain),
          epoch: prev.epoch + 1,
          learningRate: learningRate,
        };
      });

      setNeurons((prev) =>
        prev.map((neuron) => ({
          ...neuron,
          activation: Math.max(0, Math.min(1, neuron.activation + (Math.random() - 0.5) * 0.1)),
        }))
      );
    }, 200);

    return () => clearInterval(interval);
  }, [learningRate]);

  // Draw neural network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || neurons.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 500;

    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const layers = [8, 16, 32, 16, 4];
    const layerSpacing = canvas.width / (layers.length + 1);
    const neuronRadius = 6;

    // Draw connections
    ctx.strokeStyle = '#00d9ff';
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;

    neurons.forEach((neuron) => {
      if (neuron.layer < layers.length - 1) {
        const x1 = layerSpacing * (neuron.layer + 1);
        const y1 = (canvas.height / (layers[neuron.layer] + 1)) * (neuron.index + 1);

        neuron.connections.forEach((conn) => {
          const targetNeuron = neurons.find((n) => n.id === conn.targetId);
          if (targetNeuron) {
            const x2 = layerSpacing * (targetNeuron.layer + 1);
            const y2 = (canvas.height / (layers[targetNeuron.layer] + 1)) * (targetNeuron.index + 1);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        });
      }
    });

    ctx.globalAlpha = 1;

    // Draw neurons
    neurons.forEach((neuron) => {
      const x = layerSpacing * (neuron.layer + 1);
      const y = (canvas.height / (layers[neuron.layer] + 1)) * (neuron.index + 1);

      // Neuron color based on activation
      const hue = neuron.activation * 120; // Green to red
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

      // Draw neuron
      ctx.beginPath();
      ctx.arc(x, y, neuronRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw glow
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(x, y, neuronRadius * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw layer labels
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';

    layers.forEach((_, index) => {
      const x = layerSpacing * (index + 1);
      const label = index === 0 ? 'Input' : index === layers.length - 1 ? 'Output' : `Hidden ${index}`;
      ctx.fillText(label, x, 30);
    });
  }, [neurons]);

  const lrFactor = Math.pow(learningRate / 0.001, 0.6);
  const convergenceSpeed = (1 + learningRate * 500).toFixed(2);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-b from-black/50 to-black/20 rounded-lg border border-cyan-400/30">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-lg font-bold text-cyan-400 mb-4 text-center">
          Neural Network Training Visualization
        </h3>

        <canvas
          ref={canvasRef}
          className="w-full border border-cyan-400/20 rounded bg-black mb-6"
        />

        {/* Learning Rate Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded border border-cyan-400/40"
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-cyan-300">Learning Rate Control</label>
            <span className="text-lg font-mono text-blue-300">{learningRate.toFixed(5)}</span>
          </div>
          <input
            type="range"
            min="0.0001"
            max="0.01"
            step="0.0001"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="grid grid-cols-3 gap-2 text-xs text-cyan-200/60 mt-3 font-mono">
            <div>Min: 0.0001</div>
            <div>Current: {learningRate.toFixed(5)}</div>
            <div>Max: 0.01</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-cyan-200/70">
            <div className="p-2 bg-black/40 rounded border border-cyan-400/20">
              <div className="text-cyan-400 font-bold">Loss Impact</div>
              <div className="text-blue-300">{(lrFactor * 100).toFixed(1)}%</div>
            </div>
            <div className="p-2 bg-black/40 rounded border border-cyan-400/20">
              <div className="text-cyan-400 font-bold">Convergence Speed</div>
              <div className="text-blue-300">{convergenceSpeed}x</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            className="p-4 bg-black/50 rounded border border-cyan-400/30"
            animate={{ borderColor: '#00d9ff' }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xs text-yellow-400 mb-1">Loss</div>
            <div className="text-2xl font-bold text-cyan-400">
              {trainingMetrics.loss.toFixed(3)}
            </div>
            <div className="text-xs text-green-400 mt-1">↓ Decreasing</div>
          </motion.div>

          <motion.div
            className="p-4 bg-black/50 rounded border border-cyan-400/30"
            animate={{ borderColor: '#00ff00' }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xs text-yellow-400 mb-1">Accuracy</div>
            <div className="text-2xl font-bold text-green-400">
              {(trainingMetrics.accuracy * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-green-400 mt-1">↑ Improving</div>
          </motion.div>

          <motion.div
            className="p-4 bg-black/50 rounded border border-cyan-400/30"
            animate={{ borderColor: '#ffd700' }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xs text-yellow-400 mb-1">Epoch</div>
            <div className="text-2xl font-bold text-yellow-400">
              {trainingMetrics.epoch}
            </div>
            <div className="text-xs text-yellow-400 mt-1">Training Progress</div>
          </motion.div>

          <motion.div
            className="p-4 bg-black/50 rounded border border-cyan-400/30"
            animate={{ borderColor: '#ff00ff' }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xs text-yellow-400 mb-1">Learning Rate</div>
            <div className="text-2xl font-bold text-magenta-400">
              {trainingMetrics.learningRate.toExponential(2)}
            </div>
            <div className="text-xs text-magenta-400 mt-1">Interactive</div>
          </motion.div>
        </div>

        <div className="mt-6 p-4 bg-black/50 rounded border border-cyan-400/20">
          <h4 className="text-sm font-bold text-cyan-400 mb-2">Network Architecture</h4>
          <div className="text-xs text-yellow-400 font-mono space-y-1">
            <div>Input Layer: 8 neurons (Feature extraction)</div>
            <div>Hidden Layer 1: 16 neurons (Pattern recognition)</div>
            <div>Hidden Layer 2: 32 neurons (Deep learning)</div>
            <div>Hidden Layer 3: 16 neurons (Feature compression)</div>
            <div>Output Layer: 4 neurons (Classification)</div>
            <div className="mt-2 text-cyan-400">Total Parameters: 1,248</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
