import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Real quantum coherence data from research preprint (FIG. 10)
const COHERENCE_DATA = {
  'Eu³⁺ (Europium)': { T2: 8.5, color: '#ff6b6b', angle: 0 },
  'Nd³⁺ (Neodymium)': { T2: 5.2, color: '#4ecdc4', angle: 72 },
  'Er³⁺ (Erbium)': { T2: 3.8, color: '#95e1d3', angle: 144 },
  'Yb³⁺ (Ytterbium)': { T2: 6.1, color: '#ffd93d', angle: 216 },
  'Ce³⁺ (Cerium)': { T2: 2.9, color: '#ff6b9d', angle: 288 },
};

interface BlochState {
  theta: number; // Polar angle (0 to π)
  phi: number; // Azimuthal angle (0 to 2π)
  name: string;
  T2: number;
}

export const InteractiveBlochSphere: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedState, setSelectedState] = useState<BlochState | null>(null);
  const [rotation, setRotation] = useState({ x: 0.5, y: 0.5 });
  const [isAnimating, setIsAnimating] = useState(true);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', {}) as CanvasRenderingContext2D | null;
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;

    // Helper function to convert Bloch coordinates to 3D
    const blochTo3D = (theta: number, phi: number) => {
      return {
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(theta),
      };
    };

    // Helper function to project 3D to 2D with perspective
    const project3D = (x: number, y: number, z: number, rotX: number, rotY: number) => {
      // Apply rotations
      let rotatedY = y * Math.cos(rotX) - z * Math.sin(rotX);
      let rotatedZ = y * Math.sin(rotX) + z * Math.cos(rotX);

      let rotatedX = x * Math.cos(rotY) + rotatedZ * Math.sin(rotY);
      rotatedZ = -x * Math.sin(rotY) + rotatedZ * Math.cos(rotY);

      // Perspective projection
      const scale = 1 / (1 + rotatedZ * 0.5);
      return {
        x: centerX + rotatedX * radius * scale,
        y: centerY - rotatedY * radius * scale,
        z: rotatedZ,
      };
    };

    const animate = () => {
      timeRef.current += 0.016;

      // Clear canvas
      ctx.fillStyle = 'rgba(5, 5, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background sphere (wireframe)
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
      ctx.lineWidth = 1;

      // Draw latitude lines
      for (let lat = 0; lat < Math.PI; lat += Math.PI / 6) {
        ctx.beginPath();
        for (let lon = 0; lon < Math.PI * 2; lon += 0.1) {
          const { x, y } = project3D(
            Math.sin(lat) * Math.cos(lon),
            Math.sin(lat) * Math.sin(lon),
            Math.cos(lat),
            rotation.x,
            rotation.y
          );
          if (lon === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Draw longitude lines
      for (let lon = 0; lon < Math.PI * 2; lon += Math.PI / 6) {
        ctx.beginPath();
        for (let lat = 0; lat < Math.PI; lat += 0.1) {
          const { x, y } = project3D(
            Math.sin(lat) * Math.cos(lon),
            Math.sin(lat) * Math.sin(lon),
            Math.cos(lat),
            rotation.x,
            rotation.y
          );
          if (lat === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw axes
      const axisLength = 180;

      // X-axis (red)
      const xEnd = project3D(1, 0, 0, rotation.x, rotation.y);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(xEnd.x, xEnd.y);
      ctx.stroke();

      // Y-axis (green)
      const yEnd = project3D(0, 1, 0, rotation.x, rotation.y);
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(yEnd.x, yEnd.y);
      ctx.stroke();

      // Z-axis (blue)
      const zEnd = project3D(0, 0, 1, rotation.x, rotation.y);
      ctx.strokeStyle = 'rgba(0, 150, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(zEnd.x, zEnd.y);
      ctx.stroke();

      // Draw quantum states
      const states: Array<[string, BlochState]> = Object.entries(COHERENCE_DATA).map(
        ([name, data]) => [
          name,
          {
            name,
            T2: data.T2,
            theta: Math.PI / 2.5, // Adjust height based on coherence
            phi: (data.angle * Math.PI) / 180 + timeRef.current * 0.3,
          },
        ]
      );

      // Sort by z-depth for proper rendering
      const projectedStates = states
        .map(([name, state]) => {
          const coords = blochTo3D(state.theta, state.phi);
          const proj = project3D(coords.x, coords.y, coords.z, rotation.x, rotation.y);
          return { name, state, proj, coords };
        })
        .sort((a, b) => a.proj.z - b.proj.z);

      // Draw states
      projectedStates.forEach(({ name, state, proj }) => {
        const data = COHERENCE_DATA[name as keyof typeof COHERENCE_DATA];

        // Draw glow
        const gradient = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, 15);
        gradient.addColorStop(0, data.color + '80');
        gradient.addColorStop(1, data.color + '00');
        ctx.fillStyle = gradient;
        ctx.fillRect(proj.x - 15, proj.y - 15, 30, 30);

        // Draw point
        ctx.fillStyle = data.color;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw label
        ctx.fillStyle = data.color;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(name, proj.x, proj.y + 25);
        ctx.fillText(`T₂: ${state.T2} µs`, proj.x, proj.y + 40);
      });

      // Draw center point
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Update rotation for continuous animation
      if (isAnimating) {
        setRotation((prev) => ({
          x: prev.x + 0.001,
          y: prev.y + 0.0015,
        }));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setRotation({ x: y * Math.PI, y: x * Math.PI * 2 });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-cyan-300">Quantum Coherence Visualization</h2>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 rounded text-cyan-300 hover:bg-cyan-500/40 transition"
        >
          {isAnimating ? 'Pause' : 'Resume'}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full border border-cyan-400/50 rounded-lg bg-black/60 backdrop-blur-sm cursor-move"
        style={{ maxWidth: '600px', margin: '0 auto', display: 'block' }}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(COHERENCE_DATA).map(([name, data]) => (
          <motion.div
            key={name}
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded border border-current/30 bg-black/40 cursor-pointer hover:bg-black/60 transition"
            style={{ borderColor: data.color, color: data.color }}
            onClick={() => setSelectedState({ name, T2: data.T2, theta: 0, phi: 0 })}
          >
            <div className="font-bold text-sm">{name}</div>
            <div className="text-xs opacity-80">T₂: {data.T2} µs</div>
          </motion.div>
        ))}
      </div>

      {selectedState && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded border border-cyan-400/50 bg-cyan-500/10 backdrop-blur-sm"
        >
          <h3 className="font-bold text-cyan-300 mb-2">Selected: {selectedState.name}</h3>
          <p className="text-sm text-cyan-200">
            Coherence Time (T₂): <span className="font-mono">{selectedState.T2} microseconds</span>
          </p>
          <p className="text-xs text-cyan-200/60 mt-2">
            This represents the quantum decoherence time at 300K. Longer coherence times indicate better quantum state preservation.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default InteractiveBlochSphere;
