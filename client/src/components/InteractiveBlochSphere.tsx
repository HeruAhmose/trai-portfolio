import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const DOPANT_CANDIDATES = [
  { name: "Eu³⁺ · Europium", color: "#ff6b6b", angle: 0 },
  { name: "Nd³⁺ · Neodymium", color: "#4ecdc4", angle: 72 },
  { name: "Er³⁺ · Erbium", color: "#95e1d3", angle: 144 },
  { name: "Yb³⁺ · Ytterbium", color: "#ffd93d", angle: 216 },
  { name: "Ce³⁺ · Cerium", color: "#ff6b9d", angle: 288 },
] as const;

export const InteractiveBlochSphere: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const rotationRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 600;
    canvas.height = 600;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;

    const project = (x: number, y: number, z: number) => {
      const { x: rotationX, y: rotationY } = rotationRef.current;
      const rotatedY = y * Math.cos(rotationX) - z * Math.sin(rotationX);
      let rotatedZ = y * Math.sin(rotationX) + z * Math.cos(rotationX);
      const rotatedX = x * Math.cos(rotationY) + rotatedZ * Math.sin(rotationY);
      rotatedZ = -x * Math.sin(rotationY) + rotatedZ * Math.cos(rotationY);
      const scale = 1 / (1 + rotatedZ * 0.5);
      return {
        x: centerX + rotatedX * radius * scale,
        y: centerY - rotatedY * radius * scale,
        z: rotatedZ,
      };
    };

    const draw = () => {
      context.fillStyle = "#05050f";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "rgba(0, 255, 255, 0.2)";
      context.lineWidth = 1;

      for (let latitude = 0; latitude <= Math.PI; latitude += Math.PI / 6) {
        context.beginPath();
        for (let longitude = 0; longitude <= Math.PI * 2; longitude += 0.1) {
          const point = project(
            Math.sin(latitude) * Math.cos(longitude),
            Math.sin(latitude) * Math.sin(longitude),
            Math.cos(latitude)
          );
          if (longitude === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.stroke();
      }

      for (
        let longitude = 0;
        longitude < Math.PI * 2;
        longitude += Math.PI / 6
      ) {
        context.beginPath();
        for (let latitude = 0; latitude <= Math.PI; latitude += 0.1) {
          const point = project(
            Math.sin(latitude) * Math.cos(longitude),
            Math.sin(latitude) * Math.sin(longitude),
            Math.cos(latitude)
          );
          if (latitude === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.stroke();
      }

      const points = DOPANT_CANDIDATES.map(candidate => {
        const phi = (candidate.angle * Math.PI) / 180 + timeRef.current * 0.25;
        const theta = Math.PI / 2.5;
        const projected = project(
          Math.sin(theta) * Math.cos(phi),
          Math.sin(theta) * Math.sin(phi),
          Math.cos(theta)
        );
        return { candidate, projected };
      }).sort((a, b) => a.projected.z - b.projected.z);

      points.forEach(({ candidate, projected }) => {
        const glow = context.createRadialGradient(
          projected.x,
          projected.y,
          0,
          projected.x,
          projected.y,
          18
        );
        glow.addColorStop(0, `${candidate.color}90`);
        glow.addColorStop(1, `${candidate.color}00`);
        context.fillStyle = glow;
        context.fillRect(projected.x - 18, projected.y - 18, 36, 36);
        context.fillStyle = candidate.color;
        context.beginPath();
        context.arc(projected.x, projected.y, 6, 0, Math.PI * 2);
        context.fill();
        context.font = "bold 12px monospace";
        context.textAlign = "center";
        context.fillText(
          candidate.name.split(" · ")[0],
          projected.x,
          projected.y + 24
        );
      });

      context.fillStyle = "rgba(255,255,255,0.8)";
      context.beginPath();
      context.arc(centerX, centerY, 4, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "rgba(255,255,255,0.55)";
      context.font = "11px monospace";
      context.textAlign = "center";
      context.fillText(
        "CONCEPTUAL STATE MAP · NO MEASURED COHERENCE DATA",
        centerX,
        565
      );

      if (isAnimating) {
        timeRef.current += 0.016;
        rotationRef.current = {
          x: rotationRef.current.x + 0.0007,
          y: rotationRef.current.y + 0.0011,
        };
        animationRef.current = window.requestAnimationFrame(draw);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      rotationRef.current = {
        x: ((event.clientY - bounds.top) / bounds.height) * Math.PI,
        y: ((event.clientX - bounds.left) / bounds.width) * Math.PI * 2,
      };
      if (!isAnimating) draw();
    };

    draw();
    canvas.addEventListener("pointermove", handlePointerMove);
    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
      if (animationRef.current !== null)
        window.cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-cyan-300">
            Conceptual Quantum-State Map
          </h2>
          <p className="mt-1 text-sm text-cyan-100/55">
            Interaction model only · not experimental data
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAnimating(current => !current)}
          className="rounded border border-cyan-400 bg-cyan-500/20 px-4 py-2 text-cyan-300 transition hover:bg-cyan-500/40"
        >
          {isAnimating ? "Pause motion" : "Resume motion"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Conceptual Bloch-sphere-style map of five candidate rare-earth dopants; no measured coherence values"
        className="mx-auto block w-full cursor-move rounded-lg border border-cyan-400/50 bg-black/60 backdrop-blur-sm"
        style={{ maxWidth: "600px" }}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {DOPANT_CANDIDATES.map(candidate => (
          <motion.button
            key={candidate.name}
            type="button"
            whileHover={{ scale: 1.04 }}
            onClick={() => setSelectedCandidate(candidate.name)}
            aria-pressed={selectedCandidate === candidate.name}
            className="cursor-pointer rounded border bg-black/40 p-3 text-left transition hover:bg-black/60"
            style={{ borderColor: candidate.color, color: candidate.color }}
          >
            <span className="block text-sm font-bold">{candidate.name}</span>
            <span className="mt-1 block text-xs opacity-75">
              Claim 7 candidate
            </span>
          </motion.button>
        ))}
      </div>

      <div className="rounded-lg border border-yellow-300/30 bg-yellow-300/5 p-5">
        <p className="font-semibold text-yellow-200">
          Research target · hypothesis, not confirmed
        </p>
        <p className="mt-2 text-sm leading-relaxed text-cyan-50/70">
          The application target is T₂ &gt;500 ns at 300 K, with a stated goal
          of 1–10 μs. No dopant-specific or integrated-composite coherence time
          has been measured or represented here.
        </p>
      </div>

      {selectedCandidate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded border border-cyan-400/50 bg-cyan-500/10 p-4"
        >
          <h3 className="font-bold text-cyan-300">
            Selected candidate: {selectedCandidate}
          </h3>
          <p className="mt-2 text-sm text-cyan-100/65">
            Listed in provisional Application 63/934,269. Inclusion in an
            application is not evidence of synthesis, optical addressability, or
            measured coherence.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default InteractiveBlochSphere;
