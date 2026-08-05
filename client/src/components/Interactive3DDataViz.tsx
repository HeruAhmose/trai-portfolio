import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  x: number;
  y: number;
  z: number;
  value: number;
  label: string;
  color: string;
}

export const Interactive3DDataViz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);

  // Initialize with real research data
  useEffect(() => {
    const data: DataPoint[] = [
      // Piezoelectric Performance Data (FIG. 4)
      {
        x: 30,
        y: 8.5,
        z: 100,
        value: 8.5,
        label: 'Formulation A (30% quartz, 10% tourmaline)',
        color: '#0099ff',
      },
      {
        x: 25,
        y: 12,
        z: 100,
        value: 12,
        label: 'Formulation B (25% quartz, 15% tourmaline)',
        color: '#ff9900',
      },
      {
        x: 35,
        y: 5,
        z: 100,
        value: 5,
        label: 'Formulation C (35% quartz, 5% tourmaline)',
        color: '#00ff00',
      },
      {
        x: 30,
        y: 15,
        z: 100,
        value: 15,
        label: 'Formulation D (30% quartz, 15% tourmaline, optimized)',
        color: '#ff0000',
      },
      // Thermoelectric Performance Data (FIG. 5)
      {
        x: 5,
        y: 1.4,
        z: 300,
        value: 1.4,
        label: 'Tamerian Composite (5% magnetite) @ 300K',
        color: '#0066ff',
      },
      {
        x: 8,
        y: 1.8,
        z: 300,
        value: 1.8,
        label: 'Tamerian Composite (8% magnetite) @ 300K',
        color: '#00cc00',
      },
      {
        x: 12,
        y: 2.2,
        z: 300,
        value: 2.2,
        label: 'Tamerian Composite (12% magnetite, optimized) @ 300K',
        color: '#ff3333',
      },
      // Quantum Coherence Data (FIG. 10)
      {
        x: 63,
        y: 8.5,
        z: 300,
        value: 8.5,
        label: 'Europium (Eu³⁺) - Quantum Coherence Time',
        color: '#ff6666',
      },
      {
        x: 60,
        y: 5.2,
        z: 300,
        value: 5.2,
        label: 'Neodymium (Nd³⁺) - Quantum Coherence Time',
        color: '#0099ff',
      },
      {
        x: 68,
        y: 6.1,
        z: 300,
        value: 6.1,
        label: 'Ytterbium (Yb³⁺) - Quantum Coherence Time',
        color: '#ffff00',
      },
      {
        x: 58,
        y: 3.8,
        z: 300,
        value: 3.8,
        label: 'Erbium (Er³⁺) - Quantum Coherence Time',
        color: '#00ff99',
      },
      // Electrical Conductivity Data (FIG. 8)
      {
        x: 15,
        y: 1,
        z: 100,
        value: 1,
        label: 'Hemp Carbon Content: 15% - Conductivity: 0.1 S/m',
        color: '#ffcc00',
      },
      {
        x: 18,
        y: 100,
        z: 100,
        value: 100,
        label: 'Percolation Threshold (~18%) - Conductivity Jump',
        color: '#ff0000',
      },
      {
        x: 50,
        y: 600,
        z: 100,
        value: 600,
        label: 'Hemp Carbon Content: 50% - Conductivity: 600 S/m',
        color: '#00ff00',
      },
      {
        x: 70,
        y: 700,
        z: 100,
        value: 700,
        label: 'Hemp Carbon Content: 70% - Conductivity: 700 S/m',
        color: '#00ffff',
      },
    ];

    setDataPoints(data);
  }, []);

  // Handle mouse movement for rotation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setRotation({
        x: (y - 0.5) * Math.PI,
        y: (x - 0.5) * Math.PI,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Draw 3D visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dataPoints.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 3D projection function
    const project3D = (x: number, y: number, z: number) => {
      // Normalize coordinates
      const nx = (x - 50) / 50;
      const ny = (y - 10) / 10;
      const nz = (z - 200) / 100;

      // Apply rotation
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);

      let rx = nx;
      let ry = ny * cosX - nz * sinX;
      let rz = ny * sinX + nz * cosX;

      const rx2 = rx * cosY + rz * sinY;
      rz = -rx * sinY + rz * cosY;
      rx = rx2;

      // Perspective projection
      const scale = 300 / (4 + rz);
      const px = centerX + rx * scale;
      const py = centerY - ry * scale;

      return { px, py, scale };
    };

    // Sort points by depth for proper rendering
    const sortedPoints = [...dataPoints].sort((a, b) => {
      const depthA = a.x + a.y + a.z;
      const depthB = b.x + b.y + b.z;
      return depthA - depthB;
    });

    // Draw points
    sortedPoints.forEach((point) => {
      const { px, py, scale } = project3D(point.x, point.y, point.z);

      // Draw point
      ctx.fillStyle = point.color;
      const radius = 4 + (point.value / 700) * 4;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw glow
      ctx.fillStyle = point.color;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(px, py, radius * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw label for selected point
      if (selectedPoint === point) {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, radius + 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Draw axes
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;

    const axisLength = 150;
    const origin = project3D(50, 10, 200);

    // X axis
    const xEnd = project3D(50 + axisLength, 10, 200);
    ctx.beginPath();
    ctx.moveTo(origin.px, origin.py);
    ctx.lineTo(xEnd.px, xEnd.py);
    ctx.stroke();
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('X', xEnd.px + 10, xEnd.py);

    // Y axis
    const yEnd = project3D(50, 10 + axisLength, 200);
    ctx.strokeStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(origin.px, origin.py);
    ctx.lineTo(yEnd.px, yEnd.py);
    ctx.stroke();
    ctx.fillStyle = '#00ff00';
    ctx.fillText('Y', yEnd.px, yEnd.py - 10);

    // Z axis
    const zEnd = project3D(50, 10, 200 + axisLength);
    ctx.strokeStyle = '#0099ff';
    ctx.beginPath();
    ctx.moveTo(origin.px, origin.py);
    ctx.lineTo(zEnd.px, zEnd.py);
    ctx.stroke();
    ctx.fillStyle = '#0099ff';
    ctx.fillText('Z', zEnd.px, zEnd.py + 15);

    ctx.globalAlpha = 1;
  }, [dataPoints, rotation, selectedPoint]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-b from-black/50 to-black/20 rounded-lg border border-cyan-400/30">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-lg font-bold text-cyan-400 mb-2 text-center">
          Interactive 3D Research Data Visualization
        </h3>
        <p className="text-xs text-gold-400 text-center mb-4">
          Piezoelectric, Thermoelectric, Quantum Coherence & Electrical Conductivity Data
        </p>

        <canvas
          ref={canvasRef}
          className="w-full border border-cyan-400/20 rounded bg-black cursor-move mb-6"
          onClick={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // Find nearest point
            let nearest: DataPoint | null = null;
            let minDist = Infinity;

            dataPoints.forEach((point) => {
              const dx = point.x - clickX;
              const dy = point.y - clickY;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < minDist && dist < 50) {
                minDist = dist;
                nearest = point;
              }
            });

            setSelectedPoint(nearest);
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-black/50 rounded border border-cyan-400/30">
            <h4 className="text-sm font-bold text-cyan-400 mb-2">Data Dimensions</h4>
            <div className="text-xs text-gold-400 font-mono space-y-1">
              <div>X-Axis: Composition % (Quartz, Magnetite, Hemp Carbon)</div>
              <div>Y-Axis: Performance Metric (Voltage, ZT, Conductivity)</div>
              <div>Z-Axis: Temperature (K) / Stress (MPa)</div>
              <div className="mt-2 text-cyan-400">Total Data Points: {dataPoints.length}</div>
            </div>
          </div>

          {selectedPoint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-black/50 rounded border border-gold-400/50"
            >
              <h4 className="text-sm font-bold text-gold-400 mb-2">Selected Data Point</h4>
              <div className="text-xs text-cyan-400 font-mono space-y-1">
                <div>{selectedPoint.label}</div>
                <div className="mt-2 text-green-400">Value: {selectedPoint.value}</div>
                <div>X: {selectedPoint.x}, Y: {selectedPoint.y}, Z: {selectedPoint.z}</div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-6 p-4 bg-black/50 rounded border border-cyan-400/20">
          <h4 className="text-sm font-bold text-cyan-400 mb-2">Research Data Sources</h4>
          <div className="text-xs text-gold-400 font-mono space-y-1">
            <div>• FIG. 4: Piezoelectric Performance of Composite Formulations</div>
            <div>• FIG. 5: Thermoelectric Performance Comparison (Tamerian Composite)</div>
            <div>• FIG. 8: Electrical Conductivity vs. Hemp Carbon Content</div>
            <div>• FIG. 10: Quantum Coherence Times at Room Temperature (300K)</div>
            <div className="mt-2 text-cyan-400">Rotate view with mouse movement</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
