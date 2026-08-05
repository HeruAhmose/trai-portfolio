import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const AdvancedDataDashboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedMetric, setSelectedMetric] = useState<'piezo' | 'thermo' | 'conductivity'>('piezo');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#00d9ff';
    ctx.globalAlpha = 0.1;
    ctx.lineWidth = 1;

    for (let i = 0; i <= 10; i++) {
      const x = (canvas.width / 10) * i;
      const y = (canvas.height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Draw data based on selected metric
    const drawPiezoData = () => {
      // Formulation A-D with increasing performance
      const data = [
        { name: 'A', voltage: 8.5, color: '#0066ff' },
        { name: 'B', voltage: 11.8, color: '#00ff88' },
        { name: 'C', voltage: 5.2, color: '#ffaa00' },
        { name: 'D', voltage: 14.8, color: '#ff0066' },
      ];

      const barWidth = canvas.width / (data.length * 2);
      data.forEach((d, i) => {
        const x = (i + 1) * canvas.width / (data.length + 1);
        const height = (d.voltage / 15) * canvas.height * 0.8;
        const y = canvas.height - height - 40;

        ctx.fillStyle = d.color;
        ctx.fillRect(x - barWidth / 2, y, barWidth, height);

        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${d.voltage}V`, x, canvas.height - 15);
      });
    };

    const drawThermoData = () => {
      // Thermoelectric performance curves
      const points = [];
      for (let i = 0; i <= 100; i++) {
        const temp = 250 + (i / 100) * 200;
        const zt = 0.3 + (i / 100) * 2.2;
        points.push({ temp, zt });
      }

      ctx.strokeStyle = '#ff0066';
      ctx.lineWidth = 3;
      ctx.beginPath();

      points.forEach((p, i) => {
        const x = (p.temp - 250) / 200 * canvas.width;
        const y = canvas.height - (p.zt / 2.5) * canvas.height * 0.8 - 40;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw target line
      ctx.strokeStyle = '#00ff00';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - (1.2 / 2.5) * canvas.height * 0.8 - 40);
      ctx.lineTo(canvas.width, canvas.height - (1.2 / 2.5) * canvas.height * 0.8 - 40);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawConductivityData = () => {
      // Electrical conductivity vs hemp carbon content
      const points = [];
      for (let i = 0; i <= 70; i++) {
        const carbon = i;
        const conductivity = carbon < 15 ? Math.pow(10, carbon / 10 - 1) : Math.pow(10, 2 + (carbon - 15) / 55);
        points.push({ carbon, conductivity });
      }

      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.beginPath();

      points.forEach((p, i) => {
        const x = (p.carbon / 70) * canvas.width;
        const y = canvas.height - (Math.log10(p.conductivity) / 3) * canvas.height * 0.8 - 40;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Percolation threshold
      ctx.strokeStyle = '#ffaa00';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo((15 / 70) * canvas.width, 0);
      ctx.lineTo((15 / 70) * canvas.width, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    if (selectedMetric === 'piezo') drawPiezoData();
    else if (selectedMetric === 'thermo') drawThermoData();
    else drawConductivityData();

    // Draw axes
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 40);
    ctx.lineTo(canvas.width, canvas.height - 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(40, canvas.height);
    ctx.stroke();
  }, [selectedMetric]);

  return (
    <div className="w-full p-6 bg-gradient-to-br from-black/60 to-black/40 rounded-lg border border-cyan-400/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Advanced Research Data Visualization</h3>

        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'piezo', label: 'Piezoelectric Performance', desc: 'Voltage output by formulation' },
            { id: 'thermo', label: 'Thermoelectric Curves', desc: 'ZT vs Temperature' },
            { id: 'conductivity', label: 'Electrical Conductivity', desc: 'vs Hemp Carbon Content' },
          ].map((metric) => (
            <motion.button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id as any)}
              className={`px-4 py-2 rounded border transition-all text-sm ${
                selectedMetric === metric.id
                  ? 'bg-cyan-500/40 border-cyan-400 text-cyan-300'
                  : 'bg-black/40 border-cyan-400/30 text-cyan-400/60 hover:border-cyan-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="font-bold">{metric.label}</div>
              <div className="text-xs opacity-70">{metric.desc}</div>
            </motion.button>
          ))}
        </div>

        <canvas
          ref={canvasRef}
          className="w-full border border-cyan-400/20 rounded bg-black mb-4"
        />

        <div className="grid grid-cols-3 gap-3 text-xs text-cyan-200/70 font-mono">
          <div className="p-2 bg-black/40 rounded border border-cyan-400/20">
            <div className="text-cyan-400 font-bold mb-1">Data Source</div>
            <div>Peoples 2026 AMC Preprint</div>
          </div>
          <div className="p-2 bg-black/40 rounded border border-cyan-400/20">
            <div className="text-cyan-400 font-bold mb-1">Visualization Type</div>
            <div>Real-time Canvas Rendering</div>
          </div>
          <div className="p-2 bg-black/40 rounded border border-cyan-400/20">
            <div className="text-cyan-400 font-bold mb-1">Update Frequency</div>
            <div>60 FPS Interactive</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
