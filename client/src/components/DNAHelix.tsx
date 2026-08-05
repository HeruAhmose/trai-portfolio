import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface BasePair {
  position: number;
  type: 'AT' | 'GC';
  rotation: number;
}

export const DNAHelix: React.FC<{ interactive?: boolean }> = ({ interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [selectedBase, setSelectedBase] = useState<number | null>(null);
  const basePairsRef = useRef<BasePair[]>([]);

  // Generate DNA sequence
  useEffect(() => {
    const bases: BasePair[] = [];
    const sequence = 'ATGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC';

    for (let i = 0; i < sequence.length / 2; i++) {
      const base1 = sequence[i * 2];
      const base2 = sequence[i * 2 + 1];
      const type = (base1 === 'A' && base2 === 'T') || (base1 === 'T' && base2 === 'A') ? 'AT' : 'GC';

      bases.push({
        position: i,
        type,
        rotation: (i / (sequence.length / 2)) * Math.PI * 2,
      });
    }

    basePairsRef.current = bases;
  }, []);

  // Animate rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    const centerX = 300;
    const centerY = 300;

    // Background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300);
    gradient.addColorStop(0, '#1a2a4a');
    gradient.addColorStop(1, '#0a0e27');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw DNA helix
    const rotRad = (rotation * Math.PI) / 180;

    basePairsRef.current.forEach((base, idx) => {
      // Helix position
      const helixRotation = base.rotation + rotRad;
      const x1 = centerX + Math.cos(helixRotation) * 80;
      const y1 = centerY + (idx - basePairsRef.current.length / 2) * 3;

      const x2 = centerX + Math.cos(helixRotation + Math.PI) * 80;
      const y2 = centerY + (idx - basePairsRef.current.length / 2) * 3;

      // Draw backbone
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + 5, y1 + 3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 5, y2 + 3);
      ctx.stroke();

      // Draw base pair
      const isSelected = selectedBase === idx;
      const color = base.type === 'AT' ? '#00ff00' : '#ff00ff';

      // Left base
      ctx.fillStyle = isSelected ? '#ffff00' : color;
      ctx.shadowColor = color;
      ctx.shadowBlur = isSelected ? 20 : 10;
      ctx.beginPath();
      ctx.arc(x1, y1, isSelected ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Right base
      ctx.fillStyle = isSelected ? '#ffff00' : color;
      ctx.beginPath();
      ctx.arc(x2, y2, isSelected ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Connection line
      ctx.strokeStyle = `rgba(${base.type === 'AT' ? '0, 255, 0' : '255, 0, 255'}, ${isSelected ? 0.8 : 0.4})`;
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.shadowBlur = 0;
    });

    // Draw axis
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 200);
    ctx.lineTo(centerX, centerY + 200);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('5\'', centerX - 100, centerY - 220);
    ctx.fillText('3\'', centerX + 100, centerY + 220);
  }, [rotation, selectedBase]);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.canvas
        ref={canvasRef}
        onClick={(e) => {
          if (!interactive) return;
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return;

          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // Simple click detection
          basePairsRef.current.forEach((base, idx) => {
            const helixRotation = base.rotation + (rotation * Math.PI) / 180;
            const x1 = 300 + Math.cos(helixRotation) * 80;
            const y1 = 300 + (idx - basePairsRef.current.length / 2) * 3;

            const dist = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
            if (dist < 10) {
              setSelectedBase(selectedBase === idx ? null : idx);
            }
          });
        }}
        className="w-full rounded-lg border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/30 cursor-pointer"
        whileHover={{ scale: 1.02 }}
      />

      {selectedBase !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-black/50 rounded border border-cyan-400/50"
        >
          <div className="text-sm text-cyan-400">
            <div className="font-bold">
              Base Pair #{selectedBase + 1}: {basePairsRef.current[selectedBase]?.type}
            </div>
            <div className="text-xs text-gold-400 mt-2">
              {basePairsRef.current[selectedBase]?.type === 'AT'
                ? 'Adenine-Thymine (2 hydrogen bonds)'
                : 'Guanine-Cytosine (3 hydrogen bonds)'}
            </div>
          </div>
        </motion.div>
      )}

      {interactive && (
        <div className="text-xs text-cyan-400/60 text-center">
          Click on base pairs to view details
        </div>
      )}
    </div>
  );
};
