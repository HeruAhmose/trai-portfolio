import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NeuralNetworkViz } from '@/components/NeuralNetworkViz';
import { LossCurveViz } from '@/components/LossCurveViz';
import { HolographicPanel, HolographicBorder, FloatingHologram } from '@/components/HolographicUI';

export default function TrainingDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<'loss' | 'accuracy' | 'weights'>('loss');

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <section className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Neural Network Training
          </h1>
          <p className="text-lg text-cyan-200/80">Real-time visualization of deep learning model training</p>
        </motion.div>

        {/* Main visualization grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
        >
          {/* Neural Network */}
          <HolographicPanel intensity={1} scanlines={true}>
            <NeuralNetworkViz />
          </HolographicPanel>

          {/* Loss Curves */}
          <HolographicPanel intensity={1} scanlines={true}>
            <LossCurveViz />
          </HolographicPanel>
        </motion.div>

        {/* Metrics selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 mb-12 justify-center flex-wrap"
        >
          {(['loss', 'accuracy', 'weights'] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-6 py-2 rounded border transition-all ${
                selectedMetric === metric
                  ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300'
                  : 'bg-black/40 border-cyan-400/30 text-cyan-400/60 hover:border-cyan-400'
              }`}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Detailed metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <HolographicBorder>
            <h3 className="text-lg font-bold text-blue-300 mb-4">Model Architecture</h3>
            <div className="space-y-2 text-sm text-cyan-200/80 font-mono">
              <div>Input: 784 features</div>
              <div>Dense(512) + ReLU</div>
              <div>Dense(256) + ReLU</div>
              <div>Dense(128) + ReLU</div>
              <div>Output: 10 classes</div>
              <div className="text-cyan-400 mt-3">Params: 669,706</div>
            </div>
          </HolographicBorder>

          <HolographicBorder>
            <h3 className="text-lg font-bold text-blue-300 mb-4">Training Config</h3>
            <div className="space-y-2 text-sm text-cyan-200/80 font-mono">
              <div>Optimizer: Adam</div>
              <div>LR: 0.001</div>
              <div>Batch: 32</div>
              <div>Epochs: 100</div>
              <div>Loss: CrossEntropy</div>
              <div className="text-cyan-400 mt-3">Status: Running</div>
            </div>
          </HolographicBorder>

          <HolographicBorder>
            <h3 className="text-lg font-bold text-blue-300 mb-4">Performance</h3>
            <div className="space-y-2 text-sm text-cyan-200/80 font-mono">
              <div>Best Loss: 0.0234</div>
              <div>Best Acc: 99.2%</div>
              <div>Convergence: 87%</div>
              <div>ETA: 2m 15s</div>
              <div>GPU Mem: 2.1GB</div>
              <div className="text-cyan-400 mt-3">Optimal</div>
            </div>
          </HolographicBorder>
        </motion.div>

        {/* Floating info cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <FloatingHologram delay={0}>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-300 mb-2">87</div>
              <div className="text-xs text-cyan-200/60">Epochs Completed</div>
            </div>
          </FloatingHologram>

          <FloatingHologram delay={0.2}>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-300 mb-2">99.2%</div>
              <div className="text-xs text-cyan-200/60">Validation Accuracy</div>
            </div>
          </FloatingHologram>

          <FloatingHologram delay={0.4}>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-300 mb-2">0.023</div>
              <div className="text-xs text-cyan-200/60">Final Loss</div>
            </div>
          </FloatingHologram>
        </motion.div>
      </section>
    </div>
  );
}
