import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Block {
  id: number;
  hash: string;
  data: string;
  timestamp: number;
  x: number;
  y: number;
  connections: number[];
}

export const BlockchainVisualization: React.FC<{ blockCount?: number }> = ({
  blockCount = 8,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [animation, setAnimation] = useState(0);

  // Initialize blockchain
  useEffect(() => {
    const newBlocks: Block[] = [];
    for (let i = 0; i < blockCount; i++) {
      const hash = Math.random().toString(16).substring(2, 10).toUpperCase();
      newBlocks.push({
        id: i,
        hash,
        data: `Block ${i}`,
        timestamp: Date.now() - i * 1000,
        x: 100 + i * 80,
        y: 150 + Math.sin(i * 0.5) * 50,
        connections: i > 0 ? [i - 1] : [],
      });
    }
    setBlocks(newBlocks);
  }, [blockCount]);

  // Animate
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimation((prev) => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || blocks.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0e27');
    gradient.addColorStop(1, '#1a2a4a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    blocks.forEach((block) => {
      block.connections.forEach((connId) => {
        const connBlock = blocks[connId];
        if (connBlock) {
          ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(block.x, block.y);
          ctx.lineTo(connBlock.x, connBlock.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Animated flow
          const progress = (animation % 100) / 100;
          const flowX = connBlock.x + (block.x - connBlock.x) * progress;
          const flowY = connBlock.y + (block.y - connBlock.y) * progress;

          ctx.fillStyle = '#00ff00';
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(flowX, flowY, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    });

    // Draw blocks
    blocks.forEach((block) => {
      const isSelected = selectedBlock === block.id;
      const size = isSelected ? 50 : 40;

      // Block glow
      ctx.fillStyle = isSelected ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 255, 0, 0.1)';
      ctx.beginPath();
      ctx.arc(block.x, block.y, size + 15, 0, Math.PI * 2);
      ctx.fill();

      // Block border
      ctx.strokeStyle = isSelected ? '#ffd700' : '#00ff00';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.shadowColor = isSelected ? '#ffd700' : '#00ff00';
      ctx.shadowBlur = isSelected ? 20 : 10;
      ctx.beginPath();
      ctx.arc(block.x, block.y, size, 0, Math.PI * 2);
      ctx.stroke();

      // Block fill
      ctx.fillStyle = isSelected ? '#ffd70040' : '#00ff0020';
      ctx.beginPath();
      ctx.arc(block.x, block.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Block ID
      ctx.fillStyle = isSelected ? '#ffd700' : '#00ff00';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(block.id.toString(), block.x, block.y - 5);

      // Hash preview
      ctx.font = '8px monospace';
      ctx.fillStyle = '#00ff00';
      ctx.fillText(block.hash.substring(0, 4), block.x, block.y + 8);

      ctx.shadowBlur = 0;
    });

    // Draw verification indicator
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Blocks: ${blocks.length} | Verified: ${blocks.length}`, 10, 20);
  }, [blocks, selectedBlock, animation]);

  return (
    <div className="flex flex-col gap-4">
      <motion.canvas
        ref={canvasRef}
        onClick={(e) => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return;

          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          blocks.forEach((block) => {
            const dist = Math.sqrt((x - block.x) ** 2 + (y - block.y) ** 2);
            if (dist < 40) {
              setSelectedBlock(selectedBlock === block.id ? null : block.id);
            }
          });
        }}
        className="w-full rounded-lg border-2 border-green-400/50 shadow-lg shadow-green-400/30 cursor-pointer"
      />

      {selectedBlock !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-black/50 rounded border border-green-400/50"
        >
          <div className="text-sm text-green-400 font-mono space-y-2">
            <div>
              <strong>Block ID:</strong> {blocks[selectedBlock]?.id}
            </div>
            <div>
              <strong>Hash:</strong> {blocks[selectedBlock]?.hash}
            </div>
            <div>
              <strong>Data:</strong> {blocks[selectedBlock]?.data}
            </div>
            <div>
              <strong>Timestamp:</strong> {new Date(blocks[selectedBlock]?.timestamp || 0).toLocaleTimeString()}
            </div>
            <div>
              <strong>Verified:</strong> ✓ Yes
            </div>
          </div>
        </motion.div>
      )}

      <div className="text-xs text-cyan-400/60 text-center">
        Click on blocks to view details | Green flow indicates data propagation
      </div>
    </div>
  );
};
