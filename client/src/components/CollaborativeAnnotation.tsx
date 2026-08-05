import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp: number;
  color: string;
}

export const CollaborativeAnnotation: React.FC = () => {
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      x: 20,
      y: 30,
      text: 'Peak performance at 30% quartz',
      author: 'Research Team',
      timestamp: Date.now() - 3600000,
      color: '#00ff88',
    },
    {
      id: '2',
      x: 60,
      y: 70,
      text: 'Optimal formulation identified',
      author: 'Analysis Bot',
      timestamp: Date.now() - 1800000,
      color: '#ff0066',
    },
  ]);
  const [newAnnotation, setNewAnnotation] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null);

  const colors = ['#00ff88', '#00ffff', '#ff0066', '#ffaa00', '#0066ff'];

  const addAnnotation = () => {
    if (!newAnnotation.trim() || !selectedPosition) return;

    const annotation: Annotation = {
      id: Date.now().toString(),
      x: selectedPosition.x,
      y: selectedPosition.y,
      text: newAnnotation,
      author: 'You',
      timestamp: Date.now(),
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    setAnnotations([...annotations, annotation]);
    setNewAnnotation('');
    setSelectedPosition(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSelectedPosition({ x, y });
  };

  return (
    <div className="w-full p-6 bg-gradient-to-br from-black/60 to-black/40 rounded-lg border border-cyan-400/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Collaborative Annotation System</h3>

        {/* Canvas for annotations */}
        <motion.div
          onClick={handleCanvasClick}
          className="relative w-full h-64 bg-gradient-to-br from-blue-950 to-black border border-cyan-400/30 rounded mb-4 cursor-crosshair overflow-hidden"
          whileHover={{ borderColor: '#00ffff' }}
        >
          {/* Grid background */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full border-t border-cyan-400" style={{ top: `${i * 10}%` }} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full border-l border-cyan-400" style={{ left: `${i * 10}%` }} />
            ))}
          </div>

          {/* Annotations */}
          {annotations.map((ann) => (
            <motion.div
              key={ann.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute w-6 h-6 rounded-full cursor-pointer group"
              style={{
                left: `${ann.x}%`,
                top: `${ann.y}%`,
                backgroundColor: ann.color,
                boxShadow: `0 0 20px ${ann.color}`,
              }}
            >
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 border border-cyan-400/50 rounded px-3 py-2 text-xs text-cyan-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="font-bold">{ann.text}</div>
                <div className="text-cyan-200/60 text-xs">by {ann.author}</div>
              </div>
            </motion.div>
          ))}

          {/* Selected position indicator */}
          {selectedPosition && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute w-8 h-8 border-2 border-yellow-400 rounded-full pointer-events-none"
              style={{
                left: `${selectedPosition.x}%`,
                top: `${selectedPosition.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </motion.div>

        {/* Annotation input */}
        <div className="space-y-3 mb-4">
          <input
            type="text"
            value={newAnnotation}
            onChange={(e) => setNewAnnotation(e.target.value)}
            placeholder="Click on the canvas to select a position, then type your annotation..."
            className="w-full px-4 py-2 bg-black/50 border border-cyan-400/30 rounded text-cyan-300 placeholder-cyan-400/30 focus:border-cyan-400 focus:outline-none"
            onKeyPress={(e) => e.key === 'Enter' && addAnnotation()}
          />
          <div className="flex gap-2">
            <button
              onClick={addAnnotation}
              disabled={!newAnnotation.trim() || !selectedPosition}
              className="px-4 py-2 bg-cyan-500/40 border border-cyan-400 rounded text-cyan-300 hover:bg-cyan-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Add Annotation
            </button>
            <button
              onClick={() => setSelectedPosition(null)}
              className="px-4 py-2 bg-black/50 border border-cyan-400/30 rounded text-cyan-300 hover:border-cyan-400 transition-all"
            >
              Clear Position
            </button>
          </div>
        </div>

        {/* Annotations list */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-cyan-400">Recent Annotations ({annotations.length})</h4>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {annotations.map((ann) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-black/40 border-l-4 rounded text-xs text-cyan-200/80"
                style={{ borderColor: ann.color }}
              >
                <div className="font-bold text-cyan-300">{ann.text}</div>
                <div className="text-cyan-200/60 mt-1">
                  {ann.author} • ({ann.x.toFixed(0)}%, {ann.y.toFixed(0)}%)
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
