import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TrainingData {
  epoch: number;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
}

export const LossCurveViz: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [isTraining, setIsTraining] = useState(true);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setTrainingData((prev) => {
        const newEpoch = prev.length;
        const baseLoss = Math.exp(-newEpoch / 50);
        const loss = baseLoss + (Math.random() - 0.5) * 0.05;
        const accuracy = 1 - loss;

        return [
          ...prev,
          {
            epoch: newEpoch,
            loss: Math.max(0.01, loss),
            accuracy: Math.min(0.99, accuracy),
            valLoss: baseLoss + (Math.random() - 0.5) * 0.08,
            valAccuracy: 1 - (baseLoss + (Math.random() - 0.5) * 0.08),
          },
        ];
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isTraining]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || trainingData.length === 0) return;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | null;
    if (!ctx) return;

    canvas.width = 700;
    canvas.height = 400;

    const padding = 60;
    const graphWidth = canvas.width - padding * 2;
    const graphHeight = canvas.height - padding * 2;

    // Clear canvas
    ctx.fillStyle = 'rgba(5, 5, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (graphWidth / 10) * i;
      const y = padding + (graphHeight / 10) * i;

      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();

      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Epoch', canvas.width / 2, canvas.height - 10);

    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Loss / Accuracy', 0, 0);
    ctx.restore();

    // Draw loss curve (training)
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    trainingData.forEach((data, idx) => {
      const x = padding + (idx / Math.max(1, trainingData.length - 1)) * graphWidth;
      const y = canvas.height - padding - data.loss * graphHeight;

      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw validation loss curve
    ctx.strokeStyle = 'rgba(255, 150, 100, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();

    trainingData.forEach((data, idx) => {
      const x = padding + (idx / Math.max(1, trainingData.length - 1)) * graphWidth;
      const y = canvas.height - padding - data.valLoss * graphHeight;

      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw accuracy curve
    ctx.strokeStyle = 'rgba(100, 200, 100, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    trainingData.forEach((data, idx) => {
      const x = padding + (idx / Math.max(1, trainingData.length - 1)) * graphWidth;
      const y = canvas.height - padding - (1 - data.accuracy) * graphHeight;

      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw current point
    if (trainingData.length > 0) {
      const lastData = trainingData[trainingData.length - 1];
      const x = padding + ((trainingData.length - 1) / Math.max(1, trainingData.length - 1)) * graphWidth;
      const y = canvas.height - padding - lastData.loss * graphHeight;

      // Glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
      gradient.addColorStop(0, 'rgba(255, 100, 100, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 100, 100, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - 15, y - 15, 30, 30);

      // Point
      ctx.fillStyle = 'rgba(255, 100, 100, 1)';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw legend
    const legendY = padding + 20;
    const legendX = canvas.width - 200;

    ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
    ctx.fillRect(legendX, legendY, 10, 10);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('Training Loss', legendX + 15, legendY + 10);

    ctx.fillStyle = 'rgba(100, 200, 100, 0.8)';
    ctx.fillRect(legendX, legendY + 20, 10, 10);
    ctx.fillText('Accuracy', legendX + 15, legendY + 30);

    ctx.fillStyle = 'rgba(255, 150, 100, 0.6)';
    ctx.fillRect(legendX, legendY + 40, 10, 10);
    ctx.fillText('Val Loss', legendX + 15, legendY + 50);
  }, [trainingData]);

  const lastData = trainingData[trainingData.length - 1];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-cyan-300">Loss & Accuracy Curves</h3>
        <button
          onClick={() => setIsTraining(!isTraining)}
          className="px-3 py-1 bg-cyan-500/20 border border-cyan-400 rounded text-sm text-cyan-300 hover:bg-cyan-500/40 transition"
        >
          {isTraining ? 'Pause' : 'Resume'}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full border border-cyan-400/50 rounded-lg bg-black/60 backdrop-blur-sm"
        style={{ maxWidth: '700px', margin: '0 auto', display: 'block' }}
      />

      {lastData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"
        >
          <div className="p-3 rounded border border-red-400/30 bg-red-500/10">
            <div className="text-red-400/60 text-xs">Training Loss</div>
            <div className="text-red-300 font-mono font-bold">{lastData.loss.toFixed(4)}</div>
          </div>
          <div className="p-3 rounded border border-green-400/30 bg-green-500/10">
            <div className="text-green-400/60 text-xs">Accuracy</div>
            <div className="text-green-300 font-mono font-bold">{(lastData.accuracy * 100).toFixed(1)}%</div>
          </div>
          <div className="p-3 rounded border border-orange-400/30 bg-orange-500/10">
            <div className="text-orange-400/60 text-xs">Val Loss</div>
            <div className="text-orange-300 font-mono font-bold">{lastData.valLoss.toFixed(4)}</div>
          </div>
          <div className="p-3 rounded border border-cyan-400/30 bg-cyan-500/10">
            <div className="text-cyan-400/60 text-xs">Epoch</div>
            <div className="text-cyan-300 font-mono font-bold">{lastData.epoch}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LossCurveViz;
